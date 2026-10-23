// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import { loginUser, getAuthenticatedUser, logoutUser, requireAuthenticatedUser } from './service.mjs';
import { createSession } from './repository.mjs';
import { createSessionToken, generateSessionId, hashPassword } from './crypto.mjs';
import { resetDatabase } from '../test/db.mjs';
import { createTestUser } from '../test/fixtures.mjs';

const uniqueEmail = () => `user-${crypto.randomUUID()}@example.com`;

// Accounts are created by admins only (there is no self-registration), so
// tests create the user directly and obtain a real token through loginUser.
const createUserWithPassword = (email, password) =>
  createTestUser({ email, password, full_name: 'Test User', role: 'user' });

const loginNewUser = async () => {
  const email = uniqueEmail();
  await createUserWithPassword(email, 'password1');
  const result = await loginUser({ email, password: 'password1' });
  return { email, token: result.body.token };
};

beforeAll(async () => {
  await resetDatabase();
});

describe('loginUser', () => {
  it('returns 400 for invalid input', async () => {
    const result = await loginUser({ email: 'not-an-email', password: '' });
    expect(result.status).toBe(400);
  });

  it('returns 401 when the user does not exist', async () => {
    const result = await loginUser({ email: uniqueEmail(), password: 'whatever' });
    expect(result.status).toBe(401);
    expect(result.body.error).toBe('Credenciais inválidas.');
  });

  it('returns 401 when the password is wrong', async () => {
    const email = uniqueEmail();
    await createUserWithPassword(email, 'correct-password');

    const result = await loginUser({ email, password: 'wrong-password' });

    expect(result.status).toBe(401);
    expect(result.body.error).toBe('Credenciais inválidas.');
  });

  it('returns 403 when the user is inactive', async () => {
    const email = uniqueEmail();
    const passwordHash = await hashPassword('correct-password');
    await createTestUser({
      id: crypto.randomUUID(),
      email,
      password_hash: passwordHash,
      full_name: 'Inactive User',
      role: 'user',
      is_active: false,
    });

    const result = await loginUser({ email, password: 'correct-password' });

    expect(result.status).toBe(403);
    expect(result.body.error).toBe('Colaborador inativo. Contate o administrador.');
  });

  it('returns 200 with a token and the sanitized user on success', async () => {
    const email = uniqueEmail();
    await createUserWithPassword(email, 'correct-password');

    const result = await loginUser({ email, password: 'correct-password' });

    expect(result.status).toBe(200);
    expect(result.body.user).toMatchObject({ email, full_name: 'Test User' });
    expect(result.body.user.password_hash).toBeUndefined();
    expect(typeof result.body.token).toBe('string');
  });
});

describe('getAuthenticatedUser', () => {
  it('returns 401 when there is no Authorization header', async () => {
    const result = await getAuthenticatedUser(undefined);
    expect(result.status).toBe(401);
    expect(result.body.error).toBe('Sessão inválida ou expirada.');
  });

  it('returns 401 for a malformed bearer token', async () => {
    const result = await getAuthenticatedUser('Bearer not-a-real-token');
    expect(result.status).toBe(401);
  });

  it('returns 401 when the session was revoked', async () => {
    const { token } = await loginNewUser();
    await logoutUser(`Bearer ${token}`);

    const result = await getAuthenticatedUser(`Bearer ${token}`);

    expect(result.status).toBe(401);
  });

  it('returns 404 when the session is valid but the user no longer exists', async () => {
    // The session belongs to a real user (the foreign key requires it), but
    // the token names a user id that does not exist.
    const owner = await createTestUser({ email: uniqueEmail(), full_name: 'Session Owner', role: 'user' });
    const sessionId = generateSessionId();
    const userId = crypto.randomUUID();
    await createSession({ sessionId, userId: owner.id, expiresAt: Date.now() + 60_000 });
    const token = createSessionToken({ sessionId, userId, role: 'user' });

    const result = await getAuthenticatedUser(`Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.error).toBe('Usuário não encontrado.');
  });

  it('returns 200 with the user on a valid session', async () => {
    const { email, token } = await loginNewUser();

    const result = await getAuthenticatedUser(`Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.user).toMatchObject({ email });
  });
});

describe('logoutUser', () => {
  it('propagates the 401 result when not authenticated', async () => {
    const result = await logoutUser(undefined);
    expect(result.status).toBe(401);
  });

  it('revokes the session and returns success', async () => {
    const { token } = await loginNewUser();

    const logoutResult = await logoutUser(`Bearer ${token}`);
    expect(logoutResult.status).toBe(200);
    expect(logoutResult.body).toEqual({ success: true });

    const afterLogout = await getAuthenticatedUser(`Bearer ${token}`);
    expect(afterLogout.status).toBe(401);
  });
});

describe('pending password change', () => {
  const loginFlaggedUser = async () => {
    const email = uniqueEmail();
    await createTestUser({ email, password: 'temporaria1', full_name: 'Flagged User', role: 'user', must_change_password: true });
    const result = await loginUser({ email, password: 'temporaria1' });
    return { result, header: `Bearer ${result.body.token}` };
  };

  it('loginUser still succeeds and tells the client the password must be changed', async () => {
    const { result } = await loginFlaggedUser();

    expect(result.status).toBe(200);
    expect(result.body.user.must_change_password).toBe(true);
  });

  it('loginUser reports must_change_password: false for a regular user', async () => {
    const { email, token } = await loginNewUser();

    const result = await getAuthenticatedUser(`Bearer ${token}`);

    expect(result.body.user).toMatchObject({ email, must_change_password: false });
  });

  it('getAuthenticatedUser accepts the session (used by /me, logout and the password change itself)', async () => {
    const { header } = await loginFlaggedUser();

    const result = await getAuthenticatedUser(header);

    expect(result.status).toBe(200);
    expect(result.body.user.must_change_password).toBe(true);
  });

  it('requireAuthenticatedUser blocks every other route with 403 PASSWORD_CHANGE_REQUIRED', async () => {
    const { header } = await loginFlaggedUser();

    const result = await requireAuthenticatedUser(header);

    expect(result).toEqual({
      status: 403,
      body: { error: 'Troque sua senha antes de continuar.', code: 'PASSWORD_CHANGE_REQUIRED' },
    });
  });
});
