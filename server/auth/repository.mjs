import crypto from 'node:crypto';
import { createPgClient } from '../db/client.mjs';
import { hashPassword } from './crypto.mjs';

const memory = {
  users: [],
  sessions: [],
  initialized: false,
};

const seedUsers = async () => {
  if (memory.initialized) {
    return;
  }

  memory.users = [
    {
      id: 'admin-1',
      email: 'admin@test.com',
      password_hash: await hashPassword('admin123'),
      full_name: 'Comandante Supremo',
      role: 'admin',
      company_id: null,
      productive_unit_id: null,
      level: 99,
      xp: 100000,
      email_verified: true,
      created_at: new Date().toISOString(),
      notifications: [],
    },
    {
      id: 'u1',
      email: 'joao@acme.com',
      password_hash: await hashPassword('joao123'),
      full_name: 'Joao Silva',
      role: 'user',
      company_id: 'c1',
      productive_unit_id: 'pu1',
      level: 5,
      xp: 5200,
      email_verified: true,
      created_at: '2023-01-01T00:00:00.000Z',
      notifications: [],
    },
  ];

  memory.initialized = true;
};

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  full_name: user.full_name,
  role: user.role,
  company_id: user.company_id || undefined,
  productive_unit_id: user.productive_unit_id || undefined,
  level: user.level,
  xp: user.xp,
  created_at: user.created_at,
  email_verified: Boolean(user.email_verified),
  notifications: user.notifications || [],
});

export const findUserByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const client = await createPgClient();

  if (!client) {
    await seedUsers();
    return memory.users.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
  }

  try {
    const result = await client.query(
      `select
        id,
        email,
        password_hash,
        full_name,
        role,
        company_id,
        productive_unit_id,
        level,
        xp,
        email_verified,
        created_at
      from users
      where lower(email) = lower($1)
      limit 1`,
      [normalizedEmail],
    );

    return result.rows[0] || null;
  } finally {
    await client.end();
  }
};

export const findUserById = async (userId) => {
  const client = await createPgClient();

  if (!client) {
    await seedUsers();
    const user = memory.users.find((entry) => entry.id === userId);
    return user ? sanitizeUser(user) : null;
  }

  try {
    const result = await client.query(
      `select
        id,
        email,
        full_name,
        role,
        company_id,
        productive_unit_id,
        level,
        xp,
        email_verified,
        created_at
      from users
      where id = $1
      limit 1`,
      [userId],
    );

    return result.rows[0] || null;
  } finally {
    await client.end();
  }
};

export const createUser = async ({ email, passwordHash, fullName, role = 'user' }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const client = await createPgClient();

  if (!client) {
    await seedUsers();

    const existing = memory.users.find((user) => user.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return null;
    }

    const newUser = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password_hash: passwordHash,
      full_name: fullName,
      role,
      company_id: null,
      productive_unit_id: null,
      level: role === 'admin' ? 99 : 1,
      xp: role === 'admin' ? 100000 : 0,
      email_verified: role === 'admin',
      created_at: new Date().toISOString(),
    };

    memory.users.push(newUser);
    return sanitizeUser(newUser);
  }

  try {
    const result = await client.query(
      `insert into users (
        email,
        password_hash,
        full_name,
        role,
        level,
        xp,
        email_verified
      ) values ($1, $2, $3, $4, $5, $6, $7)
      returning
        id,
        email,
        full_name,
        role,
        company_id,
        productive_unit_id,
        level,
        xp,
        email_verified,
        created_at`,
      [normalizedEmail, passwordHash, fullName, role, role === 'admin' ? 99 : 1, role === 'admin' ? 100000 : 0, role === 'admin'],
    );

    return result.rows[0] || null;
  } finally {
    await client.end();
  }
};

export const createSession = async ({ sessionId, userId, expiresAt }) => {
  const client = await createPgClient();

  if (!client) {
    memory.sessions.push({
      id: sessionId,
      user_id: userId,
      expires_at: expiresAt,
      revoked_at: null,
      created_at: new Date().toISOString(),
    });
    return;
  }

  try {
    await client.query(
      `insert into auth_sessions (id, user_id, expires_at)
       values ($1, $2, to_timestamp($3 / 1000.0))`,
      [sessionId, userId, expiresAt],
    );
  } finally {
    await client.end();
  }
};

export const findActiveSession = async (sessionId) => {
  const client = await createPgClient();

  if (!client) {
    const session = memory.sessions.find((entry) => entry.id === sessionId);
    if (!session || session.revoked_at || new Date(session.expires_at).getTime() < Date.now()) {
      return null;
    }
    return session;
  }

  try {
    const result = await client.query(
      `select id, user_id, expires_at, revoked_at
       from auth_sessions
       where id = $1
         and revoked_at is null
         and expires_at > now()
       limit 1`,
      [sessionId],
    );
    return result.rows[0] || null;
  } finally {
    await client.end();
  }
};

export const revokeSession = async (sessionId) => {
  const client = await createPgClient();

  if (!client) {
    memory.sessions = memory.sessions.map((session) =>
      session.id === sessionId ? { ...session, revoked_at: new Date().toISOString() } : session,
    );
    return;
  }

  try {
    await client.query(
      `update auth_sessions
       set revoked_at = now()
       where id = $1`,
      [sessionId],
    );
  } finally {
    await client.end();
  }
};

export const publicUser = sanitizeUser;

export const upsertMemoryUser = async (user) => {
  await seedUsers();

  const { password: rawPassword, password_hash: providedPasswordHash, ...rest } = user;
  const passwordHash = providedPasswordHash
    ? providedPasswordHash
    : rawPassword
      ? await hashPassword(rawPassword)
      : await hashPassword('changeme123');

  const normalized = {
    ...rest,
    id: rest.id || crypto.randomUUID(),
    email_verified: rest.email_verified ?? false,
    created_at: rest.created_at || new Date().toISOString(),
  };

  const existingIndex = memory.users.findIndex((entry) => entry.id === normalized.id);
  if (existingIndex >= 0) {
    memory.users[existingIndex] = {
      ...memory.users[existingIndex],
      ...normalized,
      password_hash: normalized.password_hash || memory.users[existingIndex].password_hash,
    };
  } else {
    memory.users.push({
      ...normalized,
      password_hash: passwordHash,
    });
  }

  return sanitizeUser(memory.users.find((entry) => entry.id === normalized.id));
};

export const deleteMemoryUser = async (userId) => {
  await seedUsers();
  memory.users = memory.users.filter((entry) => entry.id !== userId);
};

export const listUsers = async () => {
  const client = await createPgClient();

  if (!client) {
    await seedUsers();
    return memory.users.map(sanitizeUser);
  }

  try {
    const result = await client.query(
      `select
        id,
        email,
        full_name,
        role,
        company_id,
        productive_unit_id,
        level,
        xp,
        email_verified,
        created_at
      from users
      order by created_at asc`,
    );

    return result.rows;
  } finally {
    await client.end();
  }
};

export const appendMemoryNotification = async (userId, notification) => {
  await seedUsers();
  memory.users = memory.users.map((user) => (
    user.id === userId
      ? { ...user, notifications: [notification, ...(user.notifications || [])] }
      : user
  ));
};
