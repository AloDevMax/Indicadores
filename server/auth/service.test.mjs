// @vitest-environment node
import { describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import { registerUser, loginUser, getAuthenticatedUser, logoutUser } from './service.mjs';
import { createSession, upsertMemoryUser } from './repository.mjs';
import { createSessionToken, generateSessionId, hashPassword } from './crypto.mjs';

const uniqueEmail = () => `user-${crypto.randomUUID()}@example.com`;

describe('registerUser', () => {
  it('returns 400 for an invalid email', async () => {
    const result = await registerUser({ email: 'not-an-email', password: 'password1', full_name: 'Test User' });
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Dados inválidos.');
  });

  it('returns 400 when password is shorter than 6 characters', async () => {
    const result = await registerUser({ email: uniqueEmail(), password: '123', full_name: 'Test User' });
    expect(result.status).toBe(400);
  });

  it('returns 201 with a token and the created user on success', async () => {
    const email = uniqueEmail();
    const result = await registerUser({ email, password: 'password1', full_name: 'Test User' });

    expect(result.status).toBe(201);
    expect(result.body.user).toMatchObject({ email, full_name: 'Test User', role: 'user' });
    expect(typeof result.body.token).toBe('string');
    expect(result.body.token.length).toBeGreaterThan(0);
  });

  it('returns 409 when the email is already registered', async () => {
    const email = uniqueEmail();
    await registerUser({ email, password: 'password1', full_name: 'First' });

    const result = await registerUser({ email, password: 'password2', full_name: 'Second' });

    expect(result.status).toBe(409);
    expect(result.body.error).toBe('Email já cadastrado.');
  });
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
    await registerUser({ email, password: 'correct-password', full_name: 'Test User' });

    const result = await loginUser({ email, password: 'wrong-password' });

    expect(result.status).toBe(401);
    expect(result.body.error).toBe('Credenciais inválidas.');
  });

  it('returns 403 when the user is inactive', async () => {
    const email = uniqueEmail();
    const passwordHash = await hashPassword('correct-password');
    await upsertMemoryUser({
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
    await registerUser({ email, password: 'correct-password', full_name: 'Test User' });

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
    const email = uniqueEmail();
    const registerResult = await registerUser({ email, password: 'password1', full_name: 'Test User' });
    await logoutUser(`Bearer ${registerResult.body.token}`);

    const result = await getAuthenticatedUser(`Bearer ${registerResult.body.token}`);

    expect(result.status).toBe(401);
  });

  it('returns 404 when the session is valid but the user no longer exists', async () => {
    const sessionId = generateSessionId();
    const userId = crypto.randomUUID();
    await createSession({ sessionId, userId, expiresAt: Date.now() + 60_000 });
    const token = createSessionToken({ sessionId, userId, role: 'user' });

    const result = await getAuthenticatedUser(`Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.error).toBe('Usuário não encontrado.');
  });

  it('returns 200 with the user on a valid session', async () => {
    const email = uniqueEmail();
    const registerResult = await registerUser({ email, password: 'password1', full_name: 'Test User' });

    const result = await getAuthenticatedUser(`Bearer ${registerResult.body.token}`);

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
    const email = uniqueEmail();
    const registerResult = await registerUser({ email, password: 'password1', full_name: 'Test User' });

    const logoutResult = await logoutUser(`Bearer ${registerResult.body.token}`);
    expect(logoutResult.status).toBe(200);
    expect(logoutResult.body).toEqual({ success: true });

    const afterLogout = await getAuthenticatedUser(`Bearer ${registerResult.body.token}`);
    expect(afterLogout.status).toBe(401);
  });
});
