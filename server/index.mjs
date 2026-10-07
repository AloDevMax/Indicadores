import http from 'node:http';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { ZodError } from 'zod';
import { env } from './config/env.mjs';
import { getAuthenticatedUser, loginUser, logoutUser, registerUser, requireAuthenticatedUser } from './auth/service.mjs';
import { listUsers } from './auth/repository.mjs';
import { awardBadges, createSubmission, findSubmissionOwnerUnit, importMonthlyBadges, removeUserBadge, reviewSubmission } from './operations/repository.mjs';
import { bulkInviteUsers, deleteBadge, deleteUser, findUserAvatarUrl, saveBadge, saveProductiveUnit, saveUser, seedIndicatorBadges, updateUserProfile } from './admin/repository.mjs';
import { isStoredUploadUrl } from './uploads/uploadService.mjs';
import { uploadRouter } from './uploads/uploadRoutes.mjs';
import { LOCAL_UPLOADS_DIR } from './uploads/storage/localStorage.mjs';
import { listBadges, listProductiveUnits, listUserBadges, listSubmissions, getBadgeLegends } from './db/resourceRepository.mjs';
import { prisma } from './shared/db/prisma.mjs';


const port = env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.resolve(__dirname, '..');

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

export function createApp({ storageDriver = env.STORAGE_DRIVER } = {}) {
  const app = express();

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

  app.use(express.static(frontendPath, {
    setHeaders(res, filePath) {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      }
    },
  }));

  // Com o driver supabase, os arquivos são servidos pelo Storage. Uma URL /uploads/ que sobrou
  // no banco responde 404, em vez de cair no index.html da SPA.
  if (storageDriver === 'local') {
    fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
    app.use('/uploads', express.static(LOCAL_UPLOADS_DIR));
  } else {
    app.use('/uploads', (_req, res) => res.status(404).end());
  }

  app.use('/api/upload', uploadRouter);

  app.post('/api/auth/login', asyncRoute(async (req, res) => {
    const result = await loginUser(req.body);
    res.status(result.status).json(result.body);
  }));

  app.post('/api/auth/register', asyncRoute(async (req, res) => {
    const result = await registerUser(req.body);
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

    if (!(await isAcceptableAvatarUrl(req.body))) {
      return res.status(400).json({ error: 'Avatar inválido: envie a imagem pelo upload.' });
    }

    const user = await saveUser(req.body, req.body.password);
    res.status(201).json({ user });
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
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);

    const currentUser = auth.body.user;
    const { full_name, email, password } = req.body;

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (email !== undefined) updates.email = email;
    if (password !== undefined && password.trim()) updates.password = password;

    const savedUser = await updateUserProfile(currentUser.id, updates);
    res.status(200).json({ user: savedUser });
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

  // Sem filtro por papel: o ranking de qualquer usuário precisa das concessões de todos.
  app.get('/api/user-badges', asyncRoute(async (req, res) => {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);

    const userBadges = await listUserBadges();
    res.json({ userBadges });
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
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  return app;
}

const startServer = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error('[STARTUP] Não foi possível conectar ao banco de dados:', error.message);
    process.exit(1);
  }

  const server = http.createServer(createApp());

  server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor pronto na porta ${port}`);
  });

  process.on('SIGTERM', () => {
    console.log('[SHUTDOWN] SIGTERM recebido, encerrando...');
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });

  return server;
};

// Só sobe o servidor quando o arquivo é executado diretamente
// (`node server/index.mjs`, `node dist/server/index.mjs`). Ao ser importado
// — por testes, por exemplo — nada além das definições acima é avaliado.
// `import.meta.main` só existe no Node 24.2+/22.18+; a imagem de produção usa
// Node 20, então a comparação com `process.argv[1]` é a checagem portável.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  await startServer();
}
