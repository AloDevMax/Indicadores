import http from 'node:http';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { ZodError } from 'zod';
import { createPgClient } from './db/client.mjs';
import { checkDatabaseConnection } from './db/checkConnection.mjs';
import { loadBootstrapData } from './db/bootstrapRepository.mjs';
import { getAuthenticatedUser, loginUser, logoutUser, registerUser, requireAuthenticatedUser } from './auth/service.mjs';
import { ensureBuiltInDeveloper, listUsers } from './auth/repository.mjs';
import { awardBadges, createSubmission, importMonthlyBadges, persistImportRun, removeUserBadge, reviewSubmission } from './operations/repository.mjs';
import { bulkInviteUsers, deleteBadge, deleteUser, memoryAdminStore, saveBadge, saveImportSource, saveProductiveUnit, saveUser, seedIndicatorBadges, updateUserProfile } from './admin/repository.mjs';
import { uploadRouter } from './uploads/uploadRoutes.mjs';
import { memoryStore } from './data/memoryStore.mjs';


const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT || 4004);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.resolve(__dirname, '..');

const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Verificar conexão com banco de dados na inicialização
console.log('\n========================================');
console.log('Verificando conexão com o banco de dados...');
console.log('========================================\n');

const checkConnectionWithRetry = async (maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Tentativa ${attempt}/${maxAttempts}...`);
    const connected = await checkDatabaseConnection(false);
    if (connected) return true;

    if (attempt < maxAttempts) {
      console.log(`Aguardando 2 segundos antes de próxima tentativa...\n`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return false;
};

const dbConnected = await checkConnectionWithRetry(3);

if (!dbConnected) {
  console.error('\n[AVISO CRÍTICO] A aplicação está usando FALLBACK EM MEMÓRIA');
  console.error('Dados adicionados ao site NÃO serão persistidos após reiniciar!\n');
  if (process.env.NODE_ENV === 'production') {
    console.error('[PRODUÇÃO] Verifique: DATABASE_URL, módulo pg instalado, PostgreSQL acessível');
  }
}

// Garantir conta developer uma vez na inicialização
ensureBuiltInDeveloper().catch(err =>
  console.error('[STARTUP] ensureBuiltInDeveloper falhou:', err.message),
);

console.log('Caminho atual (CWD):', process.cwd());
try {
  const distContent = fs.readdirSync(path.resolve(process.cwd(), 'dist'), { recursive: true });
  console.log('Arquivos encontrados na dist:', distContent.length, 'arquivos');
} catch (e) {
  console.log('Erro ao ler a pasta dist:', e.message);
}

app.use(express.json());

const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim()),
);

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

app.use(express.static(frontendPath));

const uploadsPath = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

app.use('/api/upload', uploadRouter);

const isAdminOrDeveloper = (user) => user.role === 'admin' || user.role === 'developer';
const isDeveloper = (user) => user.role === 'developer';
const isSupervisor = (user) => user.role === 'supervisor';
const canManageUnit = (user) => isAdminOrDeveloper(user) || isSupervisor(user);

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

  const client = await createPgClient();

  if (!client) {
    const submission = memoryStore.submissions.find((entry) => entry.id === submissionId);
    if (!submission) return false;

    const users = await listUsers();
    const submissionUser = users.find((entry) => entry.id === submission.user_id);
    if (!submissionUser) return false;

    return submissionUser.productive_unit_id === user.productive_unit_id;
  }

  try {
    const result = await client.query(
      `select u.productive_unit_id
       from badge_submissions s
       inner join users u on u.id = s.user_id
       where s.id = $1
       limit 1`,
      [submissionId],
    );

    if (!result.rows[0]) return false;

    return result.rows[0].productive_unit_id === user.productive_unit_id;
  } finally {
    await client.end();
  }
};

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

app.get('/api/bootstrap', asyncRoute(async (req, res) => {
  const auth = await getAuthenticatedUser(req.headers.authorization);
  const currentUser = auth.status === 200 ? auth.body.user : null;
  const data = await loadBootstrapData(currentUser);
  res.json(data);
}));

app.get('/api/health', asyncRoute(async (_req, res) => {
  try {
    const client = await createPgClient();
    if (client) {
      await client.query('SELECT 1');
      await client.end();
    }
    res.json({ status: 'ok' });
  } catch {
    res.json({ status: 'degraded' });
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

  const user = await saveUser(req.body, req.body.password);
  res.status(201).json({ user });
}));

app.post('/api/admin/import-sources', asyncRoute(async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || !isDeveloper(auth.body.user)) {
    return res.status(403).json({ error: 'Somente o desenvolvedor pode manter fontes globais de importação.' });
  }

  const importSource = await saveImportSource(req.body);
  res.status(201).json({ importSource });
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

app.post('/api/admin/import-runs', asyncRoute(async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || !canManageUnit(auth.body.user)) {
    return res.status(403).json({ error: 'Acesso restrito.' });
  }

  const rows = Array.isArray(req.body.rows) ? req.body.rows : [];
  const scopedUserIds = rows
    .filter((row) => row?.status === 'valid' && row?.user_id)
    .map((row) => row.user_id);

  if (!(await ensureUsersWithinScope(auth.body.user, scopedUserIds))) {
    return res.status(403).json({ error: 'Acesso restrito à sua empresa.' });
  }

  const result = await persistImportRun({
    reviewerId: auth.body.user.id,
    sourceId: req.body.source_id,
    sourceName: req.body.source_name,
    matchedColumns: req.body.matched_columns || {},
    rows,
  });

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
  const client = await createPgClient();

  if (!client) {
    return res.json({ productiveUnits: memoryAdminStore.productiveUnits });
  }

  const result = await client.query('select id, name from productive_units order by name asc');
  await client.end();
  res.json({ productiveUnits: result.rows });
}));

app.use((err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Erro de validação', details: err.errors });
  }
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Servidor pronto na porta ${port}`);
  console.log(`Buscando arquivos do site em: ${frontendPath}`);
});
