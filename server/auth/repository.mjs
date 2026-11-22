import crypto from 'node:crypto';
import { developerPasswordProblem, env } from '../config/env.mjs';
import { prisma } from '../shared/db/prisma.mjs';
import { hashPassword } from './crypto.mjs';

const BUILT_IN_DEVELOPER = {
  id: 'dev-1',
  email: 'alo.de.castro@hotmail.com',
  password: env.DEVELOPER_INITIAL_PASSWORD,
  full_name: 'Alo de Castro',
  role: 'developer',
  email_verified: true,
};

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  full_name: user.full_name,
  avatar_url: user.avatar_url,
  role: user.role,
  productive_unit_id: user.productive_unit_id || undefined,
  created_at: user.created_at,
  email_verified: Boolean(user.email_verified),
  is_active: user.is_active ?? true,
  must_change_password: Boolean(user.must_change_password),
  notifications: user.notifications || [],
});

const USER_SELECT = {
  id: true,
  email: true,
  full_name: true,
  avatar_url: true,
  role: true,
  productive_unit_id: true,
  email_verified: true,
  is_active: true,
  must_change_password: true,
  created_at: true,
};

const USER_WITH_PASSWORD_SELECT = { ...USER_SELECT, password_hash: true };

// lower(email) = lower(...) em SQL: o modo insensitive do Prisma usa ILIKE,
// que trataria "_" e "%" do e-mail como curingas.
const findUserRowByEmail = async (email) => {
  const rows = await prisma.$queryRaw`
    select
      id,
      email,
      password_hash,
      full_name,
      avatar_url,
      role::text as role,
      productive_unit_id,
      email_verified,
      is_active,
      must_change_password,
      created_at
    from users
    where lower(email) = lower(${email})
    limit 1`;

  return rows[0] || null;
};

export const findUserByEmail = async (email) => findUserRowByEmail(email.toLowerCase().trim());

export const findUserById = async (userId) =>
  prisma.user.findUnique({ where: { id: userId }, select: USER_SELECT });

// DEVELOPER_INITIAL_PASSWORD só vale na criação: o seed roda a cada release e não pode desfazer a senha
// que o developer escolheu. resetPassword (seed --reset-developer-password) é o caminho de recuperação.
const hashDeveloperPassword = (password) => {
  const problem = developerPasswordProblem(password, env);
  if (problem) throw new Error(`DEVELOPER_INITIAL_PASSWORD: ${problem}`);
  return hashPassword(password);
};

export const ensureBuiltInDeveloper = async ({ resetPassword = false, password = BUILT_IN_DEVELOPER.password } = {}) => {
  const existingUser = await findUserRowByEmail(BUILT_IN_DEVELOPER.email);

  if (existingUser) {
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        ...(resetPassword && { password_hash: await hashDeveloperPassword(password) }),
        full_name: BUILT_IN_DEVELOPER.full_name,
        role: BUILT_IN_DEVELOPER.role,
        email_verified: BUILT_IN_DEVELOPER.email_verified,
        updated_at: new Date(),
      },
      select: USER_WITH_PASSWORD_SELECT,
    });

    return updatedUser;
  }

  // O retorno da criação nunca incluiu is_active; mantido assim.
  const { is_active: _isActive, ...createSelect } = USER_WITH_PASSWORD_SELECT;
  const createdUser = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email: BUILT_IN_DEVELOPER.email,
      password_hash: await hashDeveloperPassword(password),
      full_name: BUILT_IN_DEVELOPER.full_name,
      role: BUILT_IN_DEVELOPER.role,
      email_verified: BUILT_IN_DEVELOPER.email_verified,
    },
    select: createSelect,
  });

  return createdUser;
};

export const createSession = async ({ sessionId, userId, expiresAt }) => {
  await prisma.authSession.create({
    data: { id: sessionId, user_id: userId, expires_at: new Date(expiresAt) },
  });
};

export const findActiveSession = async (sessionId) => {
  const rows = await prisma.$queryRaw`
    select id, user_id, expires_at, revoked_at
    from auth_sessions
    where id = ${sessionId}::uuid
      and revoked_at is null
      and expires_at > now()
    limit 1`;

  return rows[0] || null;
};

export const revokeSession = async (sessionId) => {
  await prisma.$executeRaw`
    update auth_sessions
    set revoked_at = now()
    where id = ${sessionId}::uuid`;
};

// Encerra as sessões ativas do usuário, menos a indicada (a de quem acabou de trocar a própria senha).
export const revokeUserSessions = async (userId, { exceptSessionId = null } = {}) => {
  await prisma.authSession.updateMany({
    where: { user_id: userId, revoked_at: null, ...(exceptSessionId && { id: { not: exceptSessionId } }) },
    data: { revoked_at: new Date() },
  });
};

export const publicUser = sanitizeUser;

export const listUsers = async () =>
  prisma.user.findMany({ select: USER_SELECT, orderBy: { created_at: 'asc' } });
