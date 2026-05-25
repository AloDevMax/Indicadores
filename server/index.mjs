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
import { listUsers } from './auth/repository.mjs';
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

// Verificar conexão com banco de dados na inicialização
console.log('\n========================================');
console.log('🔍 Verificando conexão com o banco de dados...');
console.log('========================================\n');

// Função com retry
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
  console.error('\n❌ ⚠️  [AVISO CRÍTICO]');
  console.error('A aplicação está usando FALLBACK EM MEMÓRIA');
  console.error('Dados adicionados ao site NÃO serão persistidos após reiniciar!\n');
  if (process.env.NODE_ENV === 'production') {
    console.error('💥 Erro Crítico em Produção!');
    console.error('Possíveis causas:');
    console.error('  1. Módulo pg não está instalado (npm install falhou)');
    console.error('  2. DATABASE_URL não está correto ou acessível');
    console.error('  3. Banco PostgreSQL está offline\n');
  }
}
console.log('');

console.log("Caminho atual (CWD):", process.cwd());
try {
  const distContent = fs.readdirSync(path.resolve(process.cwd(), 'dist'), { recursive: true });
  console.log("Arquivos encontrados na dist:", distContent.length, "arquivos");
} catch (e) {
  console.log("Erro ao ler a pasta dist:", e.message);
}
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.static(frontendPath));

// Servir uploads como arquivos estáticos
const uploadsPath = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Rotas de upload
app.use('/api/upload', uploadRouter);

// Helper para verificar se o usuário é admin ou desenvolvedor
const isAdminOrDeveloper = (user) => user.role === 'admin' || user.role === 'developer';
const isDeveloper = (user) => user.role === 'developer';
const isManager = (user) => user.role === 'admin';
const isSupervisor = (user) => user.role === 'supervisor';
const canManageUnit = (user) => isAdminOrDeveloper(user) || isSupervisor(user);

const ensureManagerUnitScope = (user, unitId) => {
  if (isSupervisor(user)) return Boolean(unitId) && user.productive_unit_id === unitId;
  if (isManager(user)) return Boolean(unitId) && user.productive_unit_id === unitId;
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

app.post('/api/auth/login', async (req, res) => {
  const result = await loginUser(req.body);
  res.status(result.status).json(result.body);
});

app.post('/api/auth/register', async (req, res) => {
  const result = await registerUser(req.body);
  res.status(result.status).json(result.body);
});

app.post('/api/auth/logout', async (req, res) => {
  const result = await logoutUser(req.headers.authorization);
  res.status(result.status).json(result.body);
});

app.get('/api/auth/me', async (req, res) => {
  const result = await getAuthenticatedUser(req.headers.authorization);
  res.status(result.status).json(result.body);
});

app.get('/api/bootstrap', async (req, res) => {
  const auth = await getAuthenticatedUser(req.headers.authorization);
  const currentUser = auth.status === 200 ? auth.body.user : null;
  const data = await loadBootstrapData(currentUser);
  res.json(data);
});

app.get('/api/health', async (_req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      url: process.env.DATABASE_URL ? 'configurada' : 'não configurada',
      ssl: process.env.DATABASE_SSL === 'true' ? 'ativado' : 'desativado',
    },
    environment: process.env.NODE_ENV || 'development',
  };

  // Tenta conectar ao banco para verificar se está disponível
  try {
    const client = await createPgClient();
    if (client) {
      const result = await client.query('SELECT NOW()');
      health.database.connected = true;
      health.database.timestamp = result.rows[0].now;
      await client.end();
    } else {
      health.database.connected = false;
      health.database.info = 'usando fallback em memória';
    }
  } catch (error) {
    health.database.connected = false;
    health.database.error = error.message;
  }

  res.json(health);
});

app.post('/api/admin/seed-indicator-badges', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || !isAdminOrDeveloper(auth.body.user)) return res.sendStatus(403);

  const badges = await seedIndicatorBadges();
  res.status(200).json({ badges });
});

app.post('/api/admin/import-monthly-badges', async (req, res) => {
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
});

app.post('/api/admin/award-badges', async (req, res) => {
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
});

app.post('/api/admin/user-badges/remove', async (req, res) => {
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
}); 


app.post('/api/submissions', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200) return res.status(auth.status).json(auth.body);

  const submission = await createSubmission({
    userId: auth.body.user.id,
    badgeId: req.body.badge_id,
    description: req.body.description,
    proofUrl: req.body.proof_url
  });
  res.status(201).json(submission);
});

app.post('/api/submissions/:id/review', async (req, res) => {
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
});


app.post('/api/admin/users', async (req, res) => {
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
});

app.post('/api/admin/import-sources', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || !isDeveloper(auth.body.user)) {
    return res.status(403).json({ error: 'Somente o desenvolvedor pode manter fontes globais de importação.' });
  }

  const importSource = await saveImportSource(req.body);
  res.status(201).json({ importSource });
});

app.post('/api/admin/badges', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || !isDeveloper(auth.body.user)) {
    return res.status(403).json({ error: 'Somente o desenvolvedor pode manter a biblioteca global de selos.' });
  }
  const badge = await saveBadge(req.body);
  res.status(200).json({ badge });
});

app.post('/api/admin/badges/delete', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || !isDeveloper(auth.body.user)) {
    return res.status(403).json({ error: 'Somente o desenvolvedor pode remover selos da biblioteca global.' });
  }
  const result = await deleteBadge(req.body.id);
  res.status(200).json(result);
});

app.post('/api/admin/import-runs', async (req, res) => {
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
});

app.post('/api/admin/users/delete', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || !canManageUnit(auth.body.user)) return res.sendStatus(403);
  if (!(await ensureUsersWithinScope(auth.body.user, [req.body.id].filter(Boolean)))) {
    return res.status(403).json({ error: 'Acesso restrito à sua empresa.' });
  }
  
  const result = await deleteUser(req.body.id); 
  res.status(200).json(result);
});


app.post('/api/admin/productive-units', async (req, res) => {
  try {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200 || !isAdminOrDeveloper(auth.body.user)) return res.sendStatus(403);
    if (!isDeveloper(auth.body.user) && !ensureManagerUnitScope(auth.body.user, req.body.productive_unit_id)) {
      return res.status(403).json({ error: 'Gestores só podem acessar a própria unidade produtiva.' });
    }
    
    const productiveUnit = await saveProductiveUnit(req.body);
    res.status(201).json({ productiveUnit });
  } catch (error) {
    console.error('Error saving productive unit:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao salvar unidade produtiva' });
  }
});

app.post('/api/admin/users/bulk-invite', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || !canManageUnit(auth.body.user)) return res.sendStatus(403);
  if (!isDeveloper(auth.body.user) && !ensureManagerUnitScope(auth.body.user, req.body.productive_unit_id)) {
    return res.status(403).json({ error: 'Gestores só podem convidar usuários da própria unidade produtiva.' });
  }
  const result = await bulkInviteUsers(req.body);
  res.status(200).json(result);
});

app.put('/api/user/profile', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200) return res.status(auth.status).json(auth.body);

  const currentUser = auth.body.user;
  const { full_name, email, password } = req.body;

  // Users can only update their own profile
  const updates = {};
  if (full_name !== undefined) updates.full_name = full_name;
  if (email !== undefined) updates.email = email;
  if (password !== undefined && password.trim()) updates.password = password;

  try {
    const savedUser = await updateUserProfile(currentUser.id, updates);
    res.status(200).json({ user: savedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: error.message || 'Erro ao atualizar perfil.' });
  }
});

app.get('/api/productive-units', async (_req, res) => {
  try {
    const client = await createPgClient();

    if (!client) {
      return res.json({ productiveUnits: memoryAdminStore.productiveUnits });
    }

    const result = await client.query('select id, name from productive_units order by name asc');
    await client.end();
    res.json({ productiveUnits: result.rows });
  } catch (error) {
    console.error('Error fetching productive units:', error);
    res.status(500).json({ error: 'Erro ao buscar unidades produtivas' });
  }
});

app.use((err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Erro de validação', details: err.errors });
  }
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor pronto na porta ${port}`);
  console.log(`📁 Buscando arquivos do site em: ${frontendPath}`);
});

// app.post('/api/auth/login', async (req, res) => {
//   const result = await loginUser(req.body); 
//   res.status(result.status).json(result.body);
// });

//     app.get('/api/auth/me', async (req, res) => {
//   const result = await getAuthenticatedUser(req.headers.authorization);
//   res.status(result.status).json(result.body);
// });

// app.post('/api/auth/logout', async (req, res) => {
//   const result = await logoutUser(req.headers.authorization);
//   res.status(result.status).json(result.body);
// });

// app.get('/api/ZodError', async (_req, res) => { 
//   try {
//     throw new ZodError([{ message: 'Campo obrigatório', path: ['email'], code: 'invalid_type' }]);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       res.status(400).json({ error: 'Erro de validação', details: error.errors });
//     } else {
//       res.status(500).json({ error: 'Erro interno no servidor' });
//     }
//   }
// });

// app.post('/api/awardsBadges', async (req, res) => {
//   const result = await awardBadges(req.body); 
//   res.status(201).json(result);
// });

// app.post('/api/submissions', async (req, res) => {
//   const auth = await requireAuthenticatedUser(req.headers.authorization);
//   if (auth.status !== 200) return res.status(auth.status).json(auth.body);

//   const result = await createSubmission({
//     userId: auth.body.user.id,
//     badgeId: req.body.badge_id,
//     description: req.body.description,
//     proofUrl: req.body.proof_url
//   });

// res.status(201).json(result);
// });

// app.post('/api/review', async (req, res) => {
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);
//   if (authResult.status !== 200) return res.status(authResult.status).json(authResult.body);
   
//    const result = await reviewSubmission({
//     submissionId: req.body.submissionId, // Use req.body se não for via URL
//     reviewerId: authResult.body.user.id,
//     status: req.body.status,
//   });

// res.status(200).json({ result, message: 'Revisão salva!' });
// });
  

//     app.post('/api/admin/award-badges', async (req, res) => {
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);
//   if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso restrito a administradores.' });
//   }

//   res.status(201).json({ message: 'Badge atribuída!' });
// });

//    app.post('/api/admin/user-badges/remove', async (req, res) => {
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);
//   if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso restrito a administradores.' });
//   }

//   const result = await removeUserBadge({
//     reviewerId: authResult.body.user.id,
//     userId: req.body.user_id, // O Express já lê o corpo com 'req.body'
//     badgeId: req.body.badge_id,
//   });
//   res.status(200).json(result);
// });

// app.post('/api/admin/import-runs', async (req, res) => {
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);
//   if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso restrito a administradores.' });
//   }

//   const result = await persistImportRun({
//     reviewerId: authResult.body.user.id,
//     sourceId: req.body.source_id,
//     status: req.body.status,
//     details: req.body.details,
//   });
//   res.status(200).json(result);
// });


   
//     app.post('/api/admin/badges', async (req, res) => { 
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);

//   if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso restrito a administradores.' });
//   }

//    const badge = await saveBadge(req.body);
//   res.status(200).json({ badge });
// });

// app.post('/api/admin/badges/delete', async (req, res) => {
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);
//   if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso restrito a administradores.' });
//   }

//   const result = await deleteBadge(req.body.id);
//   res.status(200).json(result);
// });



//   res.status(201).json({ message: 'Empresa criada!' });

//     app.post('/api/admin/productive-units', async (req, res) => {
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);
//   if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso restrito a administradores.' });
//   }

//   const productiveUnit = await saveProductiveUnit(req.body);
//   res.status(200).json({ productiveUnit });
// });

//    app.post('/api/admin/import-sources', async (req, res) => {  
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);
//   if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso restrito a administradores.' });
//   }

//       const importSource = await saveImportSource(req.body);
//   res.status(200).json({ importSource });

//    app.post('/api/admin/users', async (req, res) => {
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);
//   if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso restrito a administradores.' });
//   }

//      const user = await saveUser(req.body);
//   res.status(200).json({ user });
// });
//     },

//   app.post('/api/admin/users/bulk-invite', async (req, res) => {
//   const auth = await requireAuthenticatedUser(req.headers.authorization);
//   if (auth.status !== 200 || auth.body.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
  
//   const result = await bulkInviteUsers({
//     emails: req.body.emails || [],
//     productiveUnitId: req.body.productive_unit_id,
//   });
//   res.status(200).json(result);
//   }));

// app.post('/api/admin/users/delete', async (req, res) => {
//   const auth = await requireAuthenticatedUser(req.headers.authorization);
//   if (auth.status !== 200 || auth.body.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
  
//   const result = await deleteUser(req.body.id);
//   res.status(200).json(result);
// });

// app.use(express.static(frontendPath));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });

// server.listen(port, '0.0.0.0', () => {
//   console.log(`Servidor rodando na porta ${port}`);
// });
