import http from 'node:http';
import { loadBootstrapData } from './db/bootstrapRepository.mjs';
import { ZodError } from 'zod';
import { getAuthenticatedUser, loginUser, logoutUser, registerUser, requireAuthenticatedUser } from './auth/service.mjs';
import { awardBadges, createSubmission, persistImportRun, removeUserBadge, reviewSubmission } from './operations/repository.mjs';
import { bulkInviteUsers, deleteBadge, deleteUser, saveBadge, saveCompany, saveImportSource, saveProductiveUnit, saveUser } from './admin/repository.mjs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';


const port = Number(process.env.PORT || 4000);

const sendJson = (response, status, payload) => {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  response.end(JSON.stringify(payload));
};

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.resolve(__dirname, '..'); 
app.use(express.static(frontendPath));


const readJsonBody = async (request) => {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 400, { error: 'Missing request URL.' });
    return;
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  try {
    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, {
        status: 'ok',
        databaseConfigured: Boolean(process.env.DATABASE_URL),
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/bootstrap') {
      const payload = await loadBootstrapData();
      sendJson(response, 200, payload);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/register') {
      const result = await registerUser(await readJsonBody(request));
      sendJson(response, result.status, result.body);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/login') {
      const result = await loginUser(await readJsonBody(request));
      sendJson(response, result.status, result.body);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/auth/me') {
      const result = await getAuthenticatedUser(request.headers.authorization);
      sendJson(response, result.status, result.body);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
      const result = await logoutUser(request.headers.authorization);
      sendJson(response, result.status, result.body);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/submissions') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200) {
        sendJson(response, authResult.status, authResult.body);
        return;
      }

      const body = await readJsonBody(request);
      const submission = await createSubmission({
        userId: authResult.body.user.id,
        badgeId: body.badge_id,
        description: body.description,
        proofUrl: body.proof_url,
      });
      sendJson(response, 201, { submission });
      return;
    }

    const reviewMatch = request.method === 'POST'
      ? url.pathname.match(/^\/api\/submissions\/([^/]+)\/review$/)
      : null;

    if (reviewMatch) {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200) {
        sendJson(response, authResult.status, authResult.body);
        return;
      }

      const body = await readJsonBody(request);
      const result = await reviewSubmission({
        submissionId: reviewMatch[1],
        reviewerId: authResult.body.user.id,
        status: body.status,
      });
      sendJson(response, 200, result);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/award-badges') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const body = await readJsonBody(request);
      const awardedBadges = await awardBadges({
        reviewerId: authResult.body.user.id,
        userIds: body.user_ids,
        badgeId: body.badge_id,
        tone: body.tone,
      });
      sendJson(response, 200, { awardedBadges });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/user-badges/remove') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const body = await readJsonBody(request);
      const result = await removeUserBadge({
        reviewerId: authResult.body.user.id,
        userId: body.user_id,
        badgeId: body.badge_id,
      });
      sendJson(response, 200, result);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/import-runs') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const body = await readJsonBody(request);
      const result = await persistImportRun({
        reviewerId: authResult.body.user.id,
        sourceId: body.source_id,
        sourceName: body.source_name,
        matchedColumns: body.matched_columns,
        rows: body.rows,
      });
      sendJson(response, 200, result);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/badges') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const badge = await saveBadge(await readJsonBody(request));
      sendJson(response, 200, { badge });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/badges/delete') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const body = await readJsonBody(request);
      sendJson(response, 200, await deleteBadge(body.id));
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/companies') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const company = await saveCompany(await readJsonBody(request));
      sendJson(response, 200, { company });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/productive-units') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const productiveUnit = await saveProductiveUnit(await readJsonBody(request));
      sendJson(response, 200, { productiveUnit });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/import-sources') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const importSource = await saveImportSource(await readJsonBody(request));
      sendJson(response, 200, { importSource });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/users') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const user = await saveUser(await readJsonBody(request));
      sendJson(response, 200, { user });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/users/bulk-invite') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const body = await readJsonBody(request);
      const result = await bulkInviteUsers({
        emails: body.emails || [],
        companyId: body.company_id,
        productiveUnitId: body.productive_unit_id,
      });
      sendJson(response, 200, result);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/users/delete') {
      const authResult = await requireAuthenticatedUser(request.headers.authorization);
      if (authResult.status !== 200 || authResult.body.user.role !== 'admin') {
        sendJson(response, 403, { error: 'Acesso restrito a administradores.' });
        return;
      }
      const body = await readJsonBody(request);
      sendJson(response, 200, await deleteUser(body.id));
      return;
    }

    sendJson(response, 404, { error: 'Not found.' });
  } catch (error) {
    if (error instanceof SyntaxError) {
      sendJson(response, 400, { error: 'JSON inválido.' });
      return;
    }

    if (error instanceof ZodError) {
      sendJson(response, 400, {
        error: 'Dados inválidos.',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }

    console.error('[api] request failed', error);
    sendJson(response, 500, { error: 'Internal server error.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});