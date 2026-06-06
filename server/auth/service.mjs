import { z } from 'zod';
import {
  createSession,
  createUser,
  findActiveSession,
  findUserByEmail,
  findUserById,
  publicUser,
  revokeSession,
} from './repository.mjs';
import {
  createSessionToken,
  generateSessionId,
  hashPassword,
  verifyPassword,
  verifySessionToken,
} from './crypto.mjs';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
  full_name: z.string().trim().min(2).max(120),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

const getExpirationTimestamp = () => Date.now() + 1000 * 60 * 60 * 24 * 7;

export const registerUser = async (input) => {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: { error: 'Dados inválidos.', details: parsed.error.errors } };
  }
  const payload = parsed.data;
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    return {
      status: 409,
      body: { error: 'Email já cadastrado.' },
    };
  }

  const passwordHash = await hashPassword(payload.password);
  const user = await createUser({
    email: payload.email,
    passwordHash,
    fullName: payload.full_name,
  });

  if (!user) {
    return {
      status: 500,
      body: { error: 'Não foi possível criar o usuário.' },
    };
  }

  const sessionId = generateSessionId();
  const expiresAt = getExpirationTimestamp();
  await createSession({ sessionId, userId: user.id, expiresAt });

  return {
    status: 201,
    body: {
      token: createSessionToken({ sessionId, userId: user.id, role: user.role }),
      user,
    },
  };
};

export const loginUser = async (input) => {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: { error: 'Dados inválidos.' } };
  }
  const payload = parsed.data;
  const user = await findUserByEmail(payload.email);

  if (!user || !(await verifyPassword(payload.password, user.password_hash))) {
    return {
      status: 401,
      body: { error: 'Credenciais inválidas.' },
    };
  }

  const sessionId = generateSessionId();
  const expiresAt = getExpirationTimestamp();
  await createSession({ sessionId, userId: user.id, expiresAt });

  return {
    status: 200,
    body: {
      token: createSessionToken({ sessionId, userId: user.id, role: user.role }),
      user: publicUser(user),
    },
  };
};

export const getAuthenticatedUser = async (authorizationHeader) => {
  const token = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice('Bearer '.length).trim()
    : '';

  const payload = token ? verifySessionToken(token) : null;
  if (!payload) {
    return {
      status: 401,
      body: { error: 'Sessão inválida ou expirada.' },
    };
  }

  const activeSession = await findActiveSession(payload.sessionId);
  if (!activeSession) {
    return {
      status: 401,
      body: { error: 'Sessão inválida ou expirada.' },
    };
  }

  const user = await findUserById(payload.userId);
  if (!user) {
    return {
      status: 404,
      body: { error: 'Usuário não encontrado.' },
    };
  }

  return {
    status: 200,
    body: { user },
    sessionId: payload.sessionId,
  };
};

export const logoutUser = async (authorizationHeader) => {
  const authResult = await getAuthenticatedUser(authorizationHeader);
  if (authResult.status !== 200 || !authResult.sessionId) {
    return authResult;
  }

  await revokeSession(authResult.sessionId);

  return {
    status: 200,
    body: { success: true },
  };
};

export const requireAuthenticatedUser = async (authorizationHeader) => {
  const authResult = await getAuthenticatedUser(authorizationHeader);
  return authResult;
};
