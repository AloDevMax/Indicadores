import crypto from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../shared/db/prisma.mjs';
import { resetDatabase } from '../test/db.mjs';
import { verifyPassword } from './crypto.mjs';
import {
  createSession,
  createUser,
  ensureBuiltInDeveloper,
  findActiveSession,
  findUserByEmail,
  findUserById,
  listUsers,
  revokeSession,
} from './repository.mjs';

const DEVELOPER_EMAIL = 'alo.de.castro@hotmail.com';
const HOUR = 60 * 60 * 1000;

const insertUser = (overrides = {}) => prisma.user.create({
  data: {
    id: crypto.randomUUID(),
    email: 'ana@example.com',
    password_hash: 'hash-ana',
    full_name: 'Ana Souza',
    role: 'user',
    created_at: new Date('2024-01-01T10:00:00.000Z'),
    ...overrides,
  },
});

const insertUnit = (id = 'pu1') => prisma.productiveUnit.create({ data: { id, name: `Unidade ${id}` } });

beforeEach(async () => {
  await resetDatabase();
});

describe('findUserByEmail', () => {
  it('finds a user ignoring case and surrounding spaces, including the password hash', async () => {
    await insertUnit('pu1');
    const ana = await insertUser({ productive_unit_id: 'pu1', email_verified: true });

    const user = await findUserByEmail('  ANA@Example.com ');

    expect(user).toEqual({
      id: ana.id,
      email: 'ana@example.com',
      password_hash: 'hash-ana',
      full_name: 'Ana Souza',
      avatar_url: null,
      role: 'user',
      productive_unit_id: 'pu1',
      email_verified: true,
      is_active: true,
      created_at: expect.any(Date),
    });
    expect(user.created_at.toISOString()).toBe('2024-01-01T10:00:00.000Z');
  });

  it('reports the built-in developer account as developer even though it is stored as admin', async () => {
    await insertUser({ email: DEVELOPER_EMAIL, role: 'admin' });

    const user = await findUserByEmail(DEVELOPER_EMAIL);

    expect(user.role).toBe('developer');
  });

  it('returns null when no user has the email', async () => {
    expect(await findUserByEmail('ninguem@example.com')).toBeNull();
  });
});

describe('findUserById', () => {
  it('returns the user without the password hash', async () => {
    const ana = await insertUser({ avatar_url: '/uploads/ana.png', is_active: false });

    const user = await findUserById(ana.id);

    expect(user).toEqual({
      id: ana.id,
      email: 'ana@example.com',
      full_name: 'Ana Souza',
      avatar_url: '/uploads/ana.png',
      role: 'user',
      productive_unit_id: null,
      email_verified: false,
      is_active: false,
      created_at: expect.any(Date),
    });
    expect(user.created_at.toISOString()).toBe('2024-01-01T10:00:00.000Z');
  });

  it('returns null for an unknown id', async () => {
    expect(await findUserById(crypto.randomUUID())).toBeNull();
  });
});

describe('ensureBuiltInDeveloper', () => {
  it('creates the developer account (stored as admin) when it does not exist', async () => {
    const user = await ensureBuiltInDeveloper();

    expect(user).toEqual({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      email: DEVELOPER_EMAIL,
      password_hash: expect.any(String),
      full_name: 'Alo de Castro',
      avatar_url: null,
      role: 'developer',
      productive_unit_id: null,
      email_verified: true,
      created_at: expect.any(Date),
    });
    expect(await verifyPassword('2665398', user.password_hash)).toBe(true);

    const stored = await prisma.user.findUnique({ where: { email: DEVELOPER_EMAIL } });
    expect(stored.role).toBe('admin');
  });

  it('resets password, name, role and verification of an existing developer account, keeping its id', async () => {
    const existing = await insertUser({
      email: DEVELOPER_EMAIL,
      full_name: 'Outro Nome',
      role: 'user',
      email_verified: false,
      is_active: false,
    });

    const user = await ensureBuiltInDeveloper();

    expect(user).toEqual({
      id: existing.id,
      email: DEVELOPER_EMAIL,
      password_hash: expect.any(String),
      full_name: 'Alo de Castro',
      avatar_url: null,
      role: 'developer',
      productive_unit_id: null,
      email_verified: true,
      is_active: false,
      created_at: expect.any(Date),
    });
    expect(await verifyPassword('2665398', user.password_hash)).toBe(true);

    const stored = await prisma.user.findUnique({ where: { id: existing.id } });
    expect(stored.role).toBe('admin');
    expect(await prisma.user.count()).toBe(1);
  });
});

describe('createUser', () => {
  it('creates a user with a normalized email and returns it without the password hash', async () => {
    const user = await createUser({ email: '  Bia@Example.COM ', passwordHash: 'hash-bia', fullName: 'Bia Lima' });

    expect(user).toEqual({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      email: 'bia@example.com',
      full_name: 'Bia Lima',
      role: 'user',
      productive_unit_id: null,
      email_verified: false,
      is_active: true,
      created_at: expect.any(Date),
    });

    const stored = await prisma.user.findUnique({ where: { id: user.id } });
    expect(stored.password_hash).toBe('hash-bia');
  });

  it('marks admins as verified', async () => {
    const user = await createUser({ email: 'admin2@example.com', passwordHash: 'h', fullName: 'Admin', role: 'admin' });

    expect(user.role).toBe('admin');
    expect(user.email_verified).toBe(true);
  });

  it('never creates a developer: the role is downgraded to user', async () => {
    const user = await createUser({ email: 'dev2@example.com', passwordHash: 'h', fullName: 'Dev', role: 'developer' });

    expect(user.role).toBe('user');
  });

  it('rejects a duplicate email', async () => {
    await insertUser({ email: 'ana@example.com' });

    await expect(createUser({ email: 'ana@example.com', passwordHash: 'h', fullName: 'Ana 2' })).rejects.toThrow();
    expect(await prisma.user.count()).toBe(1);
  });
});

describe('sessions', () => {
  it('creates a session that findActiveSession returns with its expiry', async () => {
    const ana = await insertUser();
    const sessionId = crypto.randomUUID();
    const expiresAt = Date.parse('2099-05-01T12:34:56.789Z');

    await createSession({ sessionId, userId: ana.id, expiresAt });
    const session = await findActiveSession(sessionId);

    expect(session).toEqual({
      id: sessionId,
      user_id: ana.id,
      expires_at: expect.any(Date),
      revoked_at: null,
    });
    expect(session.expires_at.toISOString()).toBe('2099-05-01T12:34:56.789Z');
  });

  it('does not return an expired session', async () => {
    const ana = await insertUser();
    const sessionId = crypto.randomUUID();

    await createSession({ sessionId, userId: ana.id, expiresAt: Date.now() - HOUR });

    expect(await findActiveSession(sessionId)).toBeNull();
  });

  it('does not return a revoked session, and records when it was revoked', async () => {
    const ana = await insertUser();
    const sessionId = crypto.randomUUID();
    await createSession({ sessionId, userId: ana.id, expiresAt: Date.now() + HOUR });

    const before = Date.now();
    await revokeSession(sessionId);

    expect(await findActiveSession(sessionId)).toBeNull();
    const stored = await prisma.authSession.findUnique({ where: { id: sessionId } });
    expect(Math.abs(stored.revoked_at.getTime() - before)).toBeLessThan(60 * 1000);
  });

  it('returns null for an unknown session id', async () => {
    expect(await findActiveSession(crypto.randomUUID())).toBeNull();
  });

  it('revoking an unknown session is a no-op', async () => {
    await expect(revokeSession(crypto.randomUUID())).resolves.toBeUndefined();
  });
});

describe('listUsers', () => {
  it('lists every user oldest first, without password hashes', async () => {
    const newer = await insertUser({ email: 'newer@example.com', created_at: new Date('2024-03-01T00:00:00.000Z') });
    const older = await insertUser({ email: 'older@example.com', created_at: new Date('2023-03-01T00:00:00.000Z') });
    await insertUser({ email: DEVELOPER_EMAIL, role: 'admin', created_at: new Date('2024-06-01T00:00:00.000Z') });

    const users = await listUsers();

    expect(users.map((user) => user.email)).toEqual(['older@example.com', 'newer@example.com', DEVELOPER_EMAIL]);
    expect(users[0]).toEqual({
      id: older.id,
      email: 'older@example.com',
      full_name: 'Ana Souza',
      avatar_url: null,
      role: 'user',
      productive_unit_id: null,
      email_verified: false,
      is_active: true,
      created_at: expect.any(Date),
    });
    expect(users[1].id).toBe(newer.id);
    expect(users[2].role).toBe('developer');
    expect(users.every((user) => !('password_hash' in user))).toBe(true);
  });

  it('returns an empty list when there are no users', async () => {
    expect(await listUsers()).toEqual([]);
  });
});
