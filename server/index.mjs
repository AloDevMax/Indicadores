import http from 'node:http';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { ZodError } from 'zod';
import { loadBootstrapData } from './db/bootstrapRepository.mjs';
import { getAuthenticatedUser, loginUser, logoutUser, registerUser, requireAuthenticatedUser } from './auth/service.mjs';
import { awardBadges, createSubmission, persistImportRun, removeUserBadge, reviewSubmission } from './operations/repository.mjs';
import { bulkInviteUsers, deleteBadge, deleteUser, saveBadge, saveCompany, saveImportSource, saveProductiveUnit, saveUser } from './admin/repository.mjs';


const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT || 4000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.resolve(__dirname, '..');

console.log("Caminho atual (CWD):", process.cwd());
try {
  const distContent = fs.readdirSync(path.resolve(process.cwd(), 'dist'), { recursive: true });
  console.log("Arquivos encontrados na dist:", distContent);
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
  const data = await loadBootstrapData(req.headers.authorization);
  res.json(data);
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/admin/award-badges', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') return res.sendStatus(403);

  const result = await awardBadges(req.body);
  res.status(200).json(result);
});

app.post('/api/admin/user-badges/remove', async (req, res) => {
  
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') return res.sendStatus(403);

  const result = await removeUserBadge(req.body);
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

  const result = await reviewSubmission({
    submissionId: req.params.id,
    reviewerId: auth.body.user.id,
    status: req.body.status,
  });
  res.status(200).json(result);
});

app.post('/api/admin/companies', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito.' });
  }
  const company = await saveCompany(req.body);
  res.status(201).json({ company });
});

app.post('/api/admin/users', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito.' });
  }

  const user = await saveUser(req.body);
  res.status(201).json({ user });
});

app.post('/api/admin/import-sources', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito.' });
  }

  const importSource = await saveImportSource(req.body);
  res.status(201).json({ importSource });
});

app.post('/api/admin/badges', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito.' });
  }
  const badge = await saveBadge(req.body);
  res.status(200).json({ badge });
});

app.post('/api/admin/badges/delete', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito.' });
  }
  const result = await deleteBadge(req.body.id);
  res.status(200).json(result);
});

app.post('/api/admin/users/delete', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') return res.sendStatus(403);
  
  const result = await deleteUser(req.body.id); 
  res.status(200).json(result);
});

app.post('/api/admin/productive-units', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') return res.sendStatus(403);
  
  const productiveUnit = await saveProductiveUnit(req.body);
  res.status(201).json({ productiveUnit });
  if (auth.status !== 200 || auth.body.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito.' });
  }
  const result = await persistImportRun(req.body);
  res.status(200).json(result);
});

app.post('/api/admin/users/bulk-invite', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') return res.sendStatus(403);
  const result = await bulkInviteUsers(req.body);
  res.status(200).json(result);
});

app.post('/api/admin/productive-units', async (req, res) => {
  const auth = await requireAuthenticatedUser(req.headers.authorization);
  if (auth.status !== 200 || auth.body.user.role !== 'admin') return res.sendStatus(403);
  const result = await saveProductiveUnit(req.body);
  res.status(201).json(result);
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
//   try {
//     const result = await loginUser(req.body);
//     res.status(result.status).json(result.body);
//   } catch (error) {
//     res.status(500).json({ error: 'Erro interno no servidor' });
//   }
// });

//   app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   if (req.method === 'OPTIONS') return res.sendStatus(204);
//   next();
// });

//     app.get('/api/health', (_req, res) => { // O '_' avisa que o parâmetro existe mas é ignorado
//   res.json({
//     status: 'ok',
//     databaseConfigured: Boolean(process.env.DATABASE_URL),
//     timestamp: new Date().toISOString(),
//   });
// });

//    app.post('/api/auth/register', async (req, res) => {
//   const result = await registerUser(req.body);
//   res.status(result.status).json(result.body);
// });

// app.get('/api/bootstrap', async (req, res) => {
//    const data = await loadBootstrapData(req.headers.authorization); 
//   res.json(data);
// });

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

// app.post('/api/admin/companies', async (req, res) => {
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);
  
//   if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso restrito a administradores.' });

//   const result = await saveCompany(req.body);
//   res.status(201).json({ result, message: 'Empresa criada!' });
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


// app.post('/api/admin/companies', async (req, res) => {
//   // 1. Primeiro validamos o usuário pelo token
//   const authResult = await requireAuthenticatedUser(req.headers.authorization);

//   if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso restrito a administradores.' });
//   }

//   // 2. AGORA sim salvamos a empresa com os dados do corpo (req.body)
//   const result = await saveCompany(req.body); 
  
//   res.status(201).json(result);
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
//     companyId: req.body.company_id,
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