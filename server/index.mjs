import http from 'node:http';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { z, ZodError } from 'zod';
import { env } from './config/env.mjs';
import { getAuthenticatedUser, loginUser, logoutUser, requireAuthenticatedUser, updateOwnProfile } from './auth/service.mjs';
import { findUserById, listUsers, revokeUserSessions } from './auth/repository.mjs';
import { awardBadges, createSubmission, findSubmissionOwnerUnit, importMonthlyBadges, removeUserBadge, reviewSubmission } from './operations/repository.mjs';
import { DuplicateEmailError, bulkInviteUsers, deleteBadge, deleteUser, findUserAvatarUrl, saveBadge, saveProductiveUnit, saveUser, seedIndicatorBadges } from './admin/repository.mjs';
import { isStoredUploadUrl } from './uploads/uploadService.mjs';
import { uploadRouter } from './uploads/uploadRoutes.mjs';
import { LOCAL_UPLOADS_DIR } from './uploads/storage/localStorage.mjs';
import { listBadges, listProductiveUnits, listUserBadges, listSubmissions, getBadgeLegends, listMonthlyRanking } from './db/resourceRepository.mjs';
import { prisma } from './shared/db/prisma.mjs';
import { securityHeaders } from './securityHeaders.mjs';


const port = env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Só o build do Vite (dist/client) é público: servir a pasta acima de server/ publicava o código do
// servidor (dist/server/*.mjs em produção; server/, prisma/ e package.json rodando do código-fonte).
// Rodando de dist/server ou de server/, os dois caminhos levam a <repo>/dist/client.
const isBuiltServer = path.basename(path.dirname(__dirname)) === 'dist';
const CLIENT_BUILD_DIR = path.resolve(__dirname, isBuiltServer ? '../client' : '../dist/client');

const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const isAdminOrDeveloper = (user) => user.role === 'admin' || user.role === 'developer';
const isDeveloper = (user) => user.role === 'developer';
const isSupervisor = (user) => user.role === 'supervisor';
const canManageUnit = (user) => isAdminOrDeveloper(user) || isSupervisor(user);

// Usuário comum vê o próprio e-mail, não o dos colegas.
const hideEmailFrom = (viewer, user) => {
  if (canManageUnit(viewer) || user.id === viewer.id) return user;
  const { email: _email, ...rest } = user;
  return rest;
};

// Supervisor vê a própria unidade e usuário comum só as próprias solicitações.
const scopeSubmissions = (viewer, submissions, users) => {
  if (isAdminOrDeveloper(viewer)) return submissions;
  if (isSupervisor(viewer) && viewer.productive_unit_id) {
    const unitUserIds = new Set(users.filter((u) => u.productive_unit_id === viewer.productive_unit_id).map((u) => u.id));
    return submissions.filter((s) => unitUserIds.has(s.user_id));
  }
  if (isSupervisor(viewer)) return submissions;
  return submissions.filter((s) => s.user_id === viewer.id);
};

// Concessões: quem tem unidade vê as da própria unidade (inclusive as próprias);
// usuário comum sem unidade, só as próprias. O ranking entre unidades usa /api/ranking.
const scopeUserBadges = (viewer, userBadges, users) => {
  if (isAdminOrDeveloper(viewer)) return userBadges;
  if (viewer.productive_unit_id) {
    const unitUserIds = new Set(users.filter((u) => u.productive_unit_id === viewer.productive_unit_id).map((u) => u.id));
    return userBadges.filter((ub) => unitUserIds.has(ub.user_id));
  }
  if (isSupervisor(viewer)) return userBadges;
  return userBadges.filter((ub) => ub.user_id === viewer.id);
};

const rankingQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

const ensureManagerUnitScope = (user, unitId) => {
  if (isSupervisor(user)) return Boolean(unitId) && user.productive_unit_id === unitId;
  return true;
};

const ensureUsersWithinScope = async (user, targetUserIds) => {
  if (isDeveloper(user)) return true;

  const users = await listUsers();
  const allowedUserIds = new Set(
    users.filter((u) => u.productive_unit_id === user.productive_unit_id).map((u) => u.id),
  );

  return targetUserIds.every((targetUserId) => allowedUserIds.has(targetUserId));
};

// Editar uma conta exige alcançá-la como ela está no banco, não só pelos dados enviados:
// senão um supervisor "trazia" para a própria unidade (e redefinia a senha de) qualquer conta.
const reasonToDenyEditing = (editor, target) => {
  if (isDeveloper(editor)) return null;
  if (isDeveloper(target)) return 'Somente o desenvolvedor pode alterar essa conta.';
  if (!isSupervisor(editor)) return null;

  const isOwnUnitCollaborator = target.role === 'user'
    && Boolean(editor.productive_unit_id)
    && target.productive_unit_id === editor.productive_unit_id;
  return isOwnUnitCollaborator ? null : 'Supervisores só podem editar colaboradores da própria unidade produtiva.';
};

const ensureSubmissionWithinScope = async (user, submissionId) => {
  if (isDeveloper(user)) return true;

  const owner = await findSubmissionOwnerUnit(submissionId);
  if (!owner) return false;

  return owner.productive_unit_id === user.productive_unit_id;
};

/**
 * Monta o aplicativo Express completo (middlewares + rotas), sem efeitos
 * colaterais de inicialização: não conecta ao banco e não abre porta. Isso
 * fica no bloco de execução direta no final do arquivo, para que os testes
 * possam importar e montar o app sozinhos.
 */
// O avatar precisa ter vindo do upload (URL do storage). Vazio remove o avatar, e reenviar o valor
// que o usuário já tem é aceito, para não travar a edição de quem ficou com uma URL antiga.
const isAcceptableAvatarUrl = async ({ id, avatar_url: avatarUrl }) => {
  if (avatarUrl === undefined || avatarUrl === null || avatarUrl === '') return true;
  if (isStoredUploadUrl(avatarUrl)) return true;
  return avatarUrl === await findUserAvatarUrl(id);
};

// Só tentativas que falham contam (skipSuccessfulRequests). Por e-mail, barra a força bruta numa conta;
// por endereço, a mesma senha testada em muitas contas.
const DEFAULT_LOGIN_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxFailuresPerEmail: 10, maxFailuresPerIp: 100 };

const createLoginLimiters = ({ windowMs, maxFailuresPerEmail, maxFailuresPerIp }) => {
  const options = {
    windowMs,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.' },
  };

  return [
    rateLimit({ ...options, limit: maxFailuresPerIp }),
    rateLimit({
      ...options,
      limit: maxFailuresPerEmail,
      keyGenerator: (req) => `email:${String(req.body?.email ?? '').trim().toLowerCase()}`,
    }),
  ];
};

export function createApp({
  storageDriver = env.STORAGE_DRIVER,
  clientDir = CLIENT_BUILD_DIR,
  isProduction = env.NODE_ENV === 'production',
  loginRateLimit = DEFAULT_LOGIN_RATE_LIMIT,
} = {}) {
  const app = express();

  // Atrás de proxy (Hostinger), req.ip só é o endereço do cliente com TRUST_PROXY configurado.
  app.set('trust proxy', env.TRUST_PROXY);
  app.use(securityHeaders({ isProduction }));
  app.use(express.json());

  const allowedOrigins = new Set(env.ALLOWED_ORIGINS);

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // Com o driver supabase, os arquivos são servidos pelo Storage. Uma URL /uploads/ que sobrou
  // no banco responde 404, em vez de cair no index.html da SPA. Vem antes do build do cliente:
  // o Vite copia public/ (inclusive uploads/ de dev) para dentro dele.
  if (storageDriver === 'local') {
    fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
    app.use('/uploads', express.static(LOCAL_UPLOADS_DIR));
  } else {
    app.use('/uploads', (_req, res) => res.status(404).end());
  }

  app.use(express.static(clientDir, {
    setHeaders(res, filePath) {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      }
    },
  }));

  app.use('/api/upload', uploadRouter);

  app.post('/api/auth/login', ...createLoginLimiters(loginRateLimit), asyncRoute(async (req, res) => {
    const result = await loginUser(req.body);
    res.status(result.status).json(result.body);
  }));

  app.post('/api/auth/logout', asyncRoute(async (req, res) => {
    const result = await logoutUser(req.headers.authorization);
    res.status(result.status).json(result.body);
  }));

  app.get('/api/auth/me', asyncRoute(async (req, res) => {
    const result = await getAuthenticatedUser(req.headers.authorization);
    res.status(result.status).json(result.body);
  }));

  app.get('/api/health', asyncRoute(async (_req, res) => {
    try {
      await prisma.$queryRaw`select 1`;
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ status: 'unavailable' });
    }
  }));

  app.post('/api/admin/seed-indicator-badges', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !isAdminOrDeveloper(auth.body.user)) return res.sendStatus(403);

    const badges = await seedIndicatorBadges();
    res.status(200).json({ badges });
  }));

  app.post('/api/admin/import-monthly-badges', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !canManageUnit(auth.body.user)) return res.sendStatus(403);

    const { awards, month, year } = req.body;

    if (!Array.isArray(awards) || !month || !year) {
      return res.status(400).json({ error: 'Parâmetros inválidos: awards, month e year são obrigatórios.' });
    }

    const userIds = [...new Set(awards.map(a => a.userId || a.user_id).filter(Boolean))];
    if (!(await ensureUsersWithinScope(auth.body.user, userIds))) {
      return res.status(403).json({ error: 'Acesso restrito à sua empresa.' });
    }

    const normalizedAwards = awards.map(a => ({
      userId: a.userId || a.user_id,
      badgeId: a.badgeId || a.badge_id,
      tone: a.tone,
    }));

    const result = await importMonthlyBadges({
      reviewerId: auth.body.user.id,
      awards: normalizedAwards,
      month: Number(month),
      year: Number(year),
    });

    res.status(200).json(result);
  }));

  app.post('/api/admin/award-badges', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !canManageUnit(auth.body.user)) return res.sendStatus(403);
    if (!(await ensureUsersWithinScope(auth.body.user, req.body.user_ids || req.body.userIds || []))) {
      return res.status(403).json({ error: 'Acesso restrito à sua empresa.' });
    }

    const awardedBadges = await awardBadges({
      reviewerId: auth.body.user.id,
      userIds: req.body.user_ids || req.body.userIds || [],
      badgeId: req.body.badge_id || req.body.badgeId,
      tone: req.body.tone,
    });

    res.status(200).json({ awardedBadges });
  }));

  app.post('/api/admin/user-badges/remove', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !canManageUnit(auth.body.user)) return res.sendStatus(403);
    if (!(await ensureUsersWithinScope(auth.body.user, [req.body.user_id || req.body.userId].filter(Boolean)))) {
      return res.status(403).json({ error: 'Acesso restrito à sua empresa.' });
    }

    const result = await removeUserBadge({
      reviewerId: auth.body.user.id,
      userId: req.body.user_id || req.body.userId,
      badgeId: req.body.badge_id || req.body.badgeId,
    });
    res.status(200).json(result);
  }));

  app.post('/api/submissions', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);

    const submission = await createSubmission({
      userId: auth.body.user.id,
      badgeId: req.body.badge_id,
      description: req.body.description,
      proofUrl: req.body.proof_url,
    });
    res.status(201).json(submission);
  }));

  app.post('/api/submissions/:id/review', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);
    if (!canManageUnit(auth.body.user)) {
      return res.status(403).json({ error: 'Acesso restrito.' });
    }
    if (!(await ensureSubmissionWithinScope(auth.body.user, req.params.id))) {
      return res.status(403).json({ error: 'Acesso restrito à sua empresa.' });
    }

    const result = await reviewSubmission({
      submissionId: req.params.id,
      reviewerId: auth.body.user.id,
      status: req.body.status,
    });
    res.status(200).json(result);
  }));

  app.post('/api/admin/users', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !canManageUnit(auth.body.user)) {
      return res.status(403).json({ error: 'Acesso restrito.' });
    }
    if (req.body.role === 'developer' && !isDeveloper(auth.body.user)) {
      return res.status(403).json({ error: 'Somente o desenvolvedor pode manter esse papel.' });
    }
    if (isSupervisor(auth.body.user) && req.body.role && req.body.role !== 'user') {
      return res.status(403).json({ error: 'Supervisores só podem cadastrar colaboradores.' });
    }
    if (req.body.role === 'supervisor' && !req.body.productive_unit_id) {
      return res.status(400).json({ error: 'Supervisor precisa de uma unidade produtiva.' });
    }
    if (!isDeveloper(auth.body.user) && !ensureManagerUnitScope(auth.body.user, req.body.productive_unit_id)) {
      return res.status(403).json({ error: 'Gestores só podem cadastrar usuários da própria unidade produtiva.' });
    }
    if (req.body.id === auth.body.user.id && req.body.is_active === false) {
      return res.status(400).json({ error: 'Você não pode desativar seu próprio usuário.' });
    }

    const existingUser = req.body.id ? await findUserById(req.body.id) : null;
    const denialReason = existingUser && reasonToDenyEditing(auth.body.user, existingUser);
    if (denialReason) {
      return res.status(403).json({ error: denialReason });
    }

    if (!(await isAcceptableAvatarUrl(req.body))) {
      return res.status(400).json({ error: 'Avatar inválido: envie a imagem pelo upload.' });
    }

    try {
      const { temporary_password: temporaryPassword, ...user } = await saveUser(req.body, req.body.password);
      // Senha redefinida ou conta desativada: quem estava logado com o acesso antigo sai.
      if (user.id === req.body.id && (req.body.password || req.body.is_active === false)) {
        await revokeUserSessions(user.id);
      }
      res.status(201).json(temporaryPassword ? { user, temporary_password: temporaryPassword } : { user });
    } catch (error) {
      if (error instanceof DuplicateEmailError) return res.status(409).json({ error: error.message });
      throw error;
    }
  }));

  app.post('/api/admin/badges', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !isDeveloper(auth.body.user)) {
      return res.status(403).json({ error: 'Somente o desenvolvedor pode manter a biblioteca global de selos.' });
    }
    const badge = await saveBadge(req.body);
    res.status(200).json({ badge });
  }));

  app.post('/api/admin/badges/delete', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !isDeveloper(auth.body.user)) {
      return res.status(403).json({ error: 'Somente o desenvolvedor pode remover selos da biblioteca global.' });
    }
    const result = await deleteBadge(req.body.id);
    res.status(200).json(result);
  }));

  app.post('/api/admin/users/delete', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !canManageUnit(auth.body.user)) return res.sendStatus(403);
    if (!(await ensureUsersWithinScope(auth.body.user, [req.body.id].filter(Boolean)))) {
      return res.status(403).json({ error: 'Acesso restrito à sua empresa.' });
    }

    const result = await deleteUser(req.body.id);
    res.status(200).json(result);
  }));

  app.post('/api/admin/productive-units', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !isAdminOrDeveloper(auth.body.user)) return res.sendStatus(403);
    if (!isDeveloper(auth.body.user) && !ensureManagerUnitScope(auth.body.user, req.body.productive_unit_id)) {
      return res.status(403).json({ error: 'Gestores só podem acessar a própria unidade produtiva.' });
    }

    const productiveUnit = await saveProductiveUnit(req.body);
    res.status(201).json({ productiveUnit });
  }));

  app.post('/api/admin/users/bulk-invite', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !canManageUnit(auth.body.user)) return res.sendStatus(403);
    if (!isDeveloper(auth.body.user) && !ensureManagerUnitScope(auth.body.user, req.body.productive_unit_id)) {
      return res.status(403).json({ error: 'Gestores só podem convidar usuários da própria unidade produtiva.' });
    }
    const result = await bulkInviteUsers(req.body);
    res.status(200).json(result);
  }));

  app.put('/api/user/profile', asyncRoute(async (req, res) => {
    // getAuthenticatedUser (não require...): é por aqui que a troca obrigatória de senha acontece.
    const auth = await getAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);

    const result = await updateOwnProfile(auth.body.user, req.body, { sessionId: auth.sessionId });
    res.status(result.status).json(result.body);
  }));

  app.get('/api/productive-units', asyncRoute(async (_req, res) => {
    const productiveUnits = await listProductiveUnits();
    res.json({ productiveUnits });
  }));

  app.get('/api/badges', asyncRoute(async (_req, res) => {
    const badges = await listBadges();
    res.json({ badges });
  }));

  app.get('/api/users', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);

    const users = await listUsers();
    res.json({ users: users.map((user) => hideEmailFrom(auth.body.user, user)) });
  }));

  app.get('/api/user-badges', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);

    const [userBadges, users] = await Promise.all([listUserBadges(), listUsers()]);
    res.json({ userBadges: scopeUserBadges(auth.body.user, userBadges, users) });
  }));

  // Só o saldo agregado de cada usuário, visível a qualquer logado.
  app.get('/api/ranking', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);

    const { year, month } = rankingQuerySchema.parse(req.query);
    const ranking = await listMonthlyRanking({ year, month });
    res.json({ ranking });
  }));

  app.get('/api/submissions', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);

    const [submissions, users] = await Promise.all([listSubmissions(), listUsers()]);
    res.json({ submissions: scopeSubmissions(auth.body.user, submissions, users) });
  }));

  app.get('/api/badge-legends', asyncRoute(async (_req, res) => {
    const badgeLegends = await getBadgeLegends();
    res.json({ badgeLegends });
  }));

  app.use((err, _req, res, _next) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Erro de validação', details: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  });

  app.get('*', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.sendFile(path.join(clientDir, 'index.html'));
  });

  return app;
}

// Escuta antes de conectar ao banco: o Hostinger derruba o app que não chamar
// listen() em até 3 segundos. Se o banco estiver inacessível, o processo
// termina mesmo assim, logo depois. Quem sobe o servidor é server/start.mjs.
export const startServer = ({
  port: listenPort = port,
  connect = () => prisma.$connect(),
  exit = (code) => process.exit(code),
} = {}) => new Promise((resolve) => {
  const server = http.createServer(createApp());

  server.listen(listenPort, '0.0.0.0', () => {
    console.log(`Servidor pronto na porta ${server.address().port}`);
    resolve(server);
  });

  connect().catch((error) => {
    console.error('[STARTUP] Não foi possível conectar ao banco de dados:', error.message);
    exit(1);
  });
});
