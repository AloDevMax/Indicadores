import { z } from 'zod';
import { updateUserProfile } from '../admin/repository.mjs';
import {
  createSession,
  findActiveSession,
  findUserByEmail,
  findUserById,
  publicUser,
  revokeSession,
  revokeUserSessions,
} from './repository.mjs';
import {
  DUMMY_PASSWORD_HASH,
  createSessionToken,
  generateSessionId,
  verifyPassword,
  verifySessionToken,
} from './crypto.mjs';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

// O e-mail é a identidade corporativa e só o admin altera; por isso o schema é strict.
const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(2).max(120).optional(),
  current_password: z.string().min(1).max(128).optional(),
  new_password: z.string().min(8).max(128).optional(),
}).strict().refine((input) => !input.new_password || input.current_password, {
  path: ['current_password'],
  message: 'Informe a senha atual.',
});

const PASSWORD_CHANGE_REQUIRED = {
  status: 403,
  body: { error: 'Troque sua senha antes de continuar.', code: 'PASSWORD_CHANGE_REQUIRED' },
};

const getExpirationTimestamp = () => Date.now() + 1000 * 60 * 60 * 24 * 7;

export const loginUser = async (input) => {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: { error: 'Dados inválidos.' } };
  }
  const payload = parsed.data;
  const user = await findUserByEmail(payload.email);
  // Sem conta, verifica contra o hash fictício: o tempo de resposta não revela quais e-mails existem.
  const isPasswordCorrect = await verifyPassword(payload.password, user?.password_hash ?? DUMMY_PASSWORD_HASH);

  if (!user || !isPasswordCorrect) {
    return {
      status: 401,
      body: { error: 'Credenciais inválidas.' },
    };
  }

  if (user.is_active === false) {
    return {
      status: 403,
      body: { error: 'Colaborador inativo. Contate o administrador.' },
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
  // Desativar o colaborador corta o acesso na hora, sem esperar o token expirar.
  if (user.is_active === false) {
    return {
      status: 401,
      body: { error: 'Sessão inválida ou expirada.' },
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

// Para todas as rotas, exceto /me, logout e a própria troca de senha: enquanto a
// senha emitida pelo admin não for trocada, o resto da API fica bloqueado.
export const requireAuthenticatedUser = async (authorizationHeader) => {
  const authResult = await getAuthenticatedUser(authorizationHeader);
  if (authResult.status === 200 && authResult.body.user.must_change_password) {
    return PASSWORD_CHANGE_REQUIRED;
  }
  return authResult;
};

// sessionId: a sessão de quem faz a troca, a única que continua valendo depois de uma nova senha.
export const updateOwnProfile = async (currentUser, input, { sessionId } = {}) => {
  const parsed = profileUpdateSchema.safeParse(input ?? {});
  if (!parsed.success) {
    return { status: 400, body: { error: 'Dados inválidos.', details: parsed.error.errors } };
  }
  const { full_name: fullName, current_password: currentPassword, new_password: newPassword } = parsed.data;

  if (currentUser.must_change_password && !newPassword) {
    return PASSWORD_CHANGE_REQUIRED;
  }

  if (newPassword) {
    const userWithHash = await findUserByEmail(currentUser.email);
    if (!userWithHash || !(await verifyPassword(currentPassword, userWithHash.password_hash))) {
      return { status: 400, body: { error: 'Senha atual incorreta.' } };
    }
    if (newPassword === currentPassword) {
      return { status: 400, body: { error: 'A nova senha deve ser diferente da atual.' } };
    }
  }

  await updateUserProfile(currentUser.id, {
    ...(fullName !== undefined && { full_name: fullName }),
    ...(newPassword && { password: newPassword }),
  });
  if (newPassword) {
    await revokeUserSessions(currentUser.id, { exceptSessionId: sessionId });
  }

  return { status: 200, body: { user: publicUser(await findUserById(currentUser.id)) } };
};
