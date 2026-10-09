// @vitest-environment node
//
// Route-level Supertest coverage for the Express app built by createApp()
// (server/index.mjs). No vi.mock of the service/repository layers: requests go
// through the real repositories against the test database (see
// server/test/globalSetup.mjs), seeded in beforeAll with the reference data
// the app used to start with, and real Bearer tokens are minted the same way
// service.test.mjs does.
//
// createApp() has no side effects at import time (no DB check, no .listen()),
// which lets this file import server/index.mjs directly instead of re-mounting
// a router on a bare app the way uploadRoutes.test.mjs has to.
import crypto from 'node:crypto';
import request from 'supertest';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { createApp } from './index.mjs';
import { createSession } from './auth/repository.mjs';
import { createSessionToken, generateSessionId } from './auth/crypto.mjs';
import { prisma } from './shared/db/prisma.mjs';
import { resetDatabase } from './test/db.mjs';
import { createTestUser, seedReferenceData } from './test/fixtures.mjs';

const app = createApp();

// Two users seeded in beforeAll for the read-route tests.
const SEED_ADMIN_ID = '00000000-0000-4000-8000-000000000001';
const SEED_USER_ID = '00000000-0000-4000-8000-000000000003';

beforeAll(async () => {
  await resetDatabase();
  await seedReferenceData();
  await createTestUser({
    id: SEED_ADMIN_ID, email: 'admin@test.com', password: 'admin123', full_name: 'Gestor Supremo', role: 'admin', email_verified: true,
  });
  await createTestUser({
    id: SEED_USER_ID, email: 'joao@acme.com', password: 'joao123', full_name: 'Joao Silva', role: 'user', productive_unit_id: 'pu1', email_verified: true,
  });
});

const uniqueEmail = (label) => `${label}-${crypto.randomUUID()}@example.com`;

/**
 * Builds a real Bearer token for an arbitrary role, following the same
 * session-minting steps as service.test.mjs's "returns 200 with the user on
 * a valid session" case (registerUser only ever creates role: 'user', so
 * admin/supervisor/developer sessions are built directly against the
 * repository + crypto layers instead).
 */
const authHeaderFor = async (role, overrides = {}) => {
  if (overrides.productive_unit_id) {
    const id = overrides.productive_unit_id;
    await prisma.productiveUnit.upsert({ where: { id }, create: { id, name: `Unidade ${id}` }, update: {} });
  }

  const user = await createTestUser({
    id: crypto.randomUUID(),
    email: uniqueEmail(role),
    full_name: `Test ${role}`,
    role,
    productive_unit_id: null,
    ...overrides,
  });

  const sessionId = generateSessionId();
  await createSession({ sessionId, userId: user.id, expiresAt: Date.now() + 60 * 60 * 1000 });
  const token = createSessionToken({ sessionId, userId: user.id, role });

  return { header: `Bearer ${token}`, user };
};

const MALFORMED_HEADER = 'Bearer not-a-real-token';
const SESSION_ERROR_BODY = { error: 'Sessão inválida ou expirada.' };

describe('auth guard matrix', () => {
  // Group A: guard short-circuits with res.sendStatus(403) — a plain-text
  // "Forbidden" body, not JSON. Verified against server/index.mjs's actual
  // route bodies (7 routes).
  describe.each([
    { method: 'post', path: '/api/admin/seed-indicator-badges' },
    { method: 'post', path: '/api/admin/import-monthly-badges' },
    { method: 'post', path: '/api/admin/award-badges' },
    { method: 'post', path: '/api/admin/user-badges/remove' },
    { method: 'post', path: '/api/admin/users/delete' },
    { method: 'post', path: '/api/admin/productive-units' },
    { method: 'post', path: '/api/admin/users/bulk-invite' },
  ])('$method $path', ({ method, path }) => {
    it('returns 403 with a plain-text "Forbidden" body when the Authorization header is missing', async () => {
      const response = await request(app)[method](path);

      expect(response.status).toBe(403);
      expect(response.text).toBe('Forbidden');
      expect(response.headers['content-type']).toMatch(/text\/plain/);
    });

    it('returns 403 with a plain-text "Forbidden" body on a malformed bearer token', async () => {
      const response = await request(app)[method](path).set('Authorization', MALFORMED_HEADER);

      expect(response.status).toBe(403);
      expect(response.text).toBe('Forbidden');
    });
  });

  // Group B: guard fails with an explicit res.status(403).json({error}) and
  // an exact Portuguese message (3 routes).
  describe.each([
    { method: 'post', path: '/api/admin/users', error: 'Acesso restrito.' },
    { method: 'post', path: '/api/admin/badges', error: 'Somente o desenvolvedor pode manter a biblioteca global de selos.' },
    { method: 'post', path: '/api/admin/badges/delete', error: 'Somente o desenvolvedor pode remover selos da biblioteca global.' },
  ])('$method $path', ({ method, path, error }) => {
    it('returns 403 with the exact Portuguese error message when the Authorization header is missing', async () => {
      const response = await request(app)[method](path);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error });
    });

    it('returns 403 with the exact Portuguese error message on a malformed bearer token', async () => {
      const response = await request(app)[method](path).set('Authorization', MALFORMED_HEADER);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error });
    });
  });

  // Group C: guard propagates whatever requireAuthenticatedUser/
  // getAuthenticatedUser actually returned — 401 with the session-error body
  // for a missing/invalid token (3 routes).
  describe.each([
    { method: 'post', path: '/api/submissions' },
    { method: 'post', path: '/api/submissions/some-submission-id/review' },
    { method: 'put', path: '/api/user/profile' },
  ])('$method $path', ({ method, path }) => {
    it('returns 401 with the session-error body when the Authorization header is missing', async () => {
      const response = await request(app)[method](path);

      expect(response.status).toBe(401);
      expect(response.body).toEqual(SESSION_ERROR_BODY);
    });

    it('returns 401 with the session-error body on a malformed bearer token', async () => {
      const response = await request(app)[method](path).set('Authorization', MALFORMED_HEADER);

      expect(response.status).toBe(401);
      expect(response.body).toEqual(SESSION_ERROR_BODY);
    });
  });
});

describe('unauthenticated read routes', () => {
  it('GET /api/badges returns the seeded badge library', async () => {
    const response = await request(app).get('/api/badges');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.badges)).toBe(true);
    expect(response.body.badges).toContainEqual(
      expect.objectContaining({ id: '1', name: 'Mestre de Processos' }),
    );
  });

  it('GET /api/badge-legends returns the default legend copy', async () => {
    const response = await request(app).get('/api/badge-legends');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      badgeLegends: {
        bronze: 'Bronze - Boa performance',
        silver: 'Prata - Excelente performance',
        gold: 'Ouro - Desempenho excepcional',
        loss_1: 'Perda 1 - Expectativa não atendida',
        loss_2: 'Perda 2 - Falha grave',
      },
    });
  });

  it('GET /api/productive-units returns the seeded productive units', async () => {
    const response = await request(app).get('/api/productive-units');

    expect(response.status).toBe(200);
    expect(response.body.productiveUnits).toEqual(
      expect.arrayContaining([{ id: 'pu1', name: 'Fábrica Campinas' }]),
    );
  });
});

describe('read routes that require a session', () => {
  describe.each(['/api/users', '/api/user-badges', '/api/submissions', '/api/ranking'])('GET %s', (path) => {
    it('returns 401 with the session-error body when the Authorization header is missing', async () => {
      const response = await request(app).get(path);

      expect(response.status).toBe(401);
      expect(response.body).toEqual(SESSION_ERROR_BODY);
    });

    it('returns 401 with the session-error body on a malformed bearer token', async () => {
      const response = await request(app).get(path).set('Authorization', MALFORMED_HEADER);

      expect(response.status).toBe(401);
      expect(response.body).toEqual(SESSION_ERROR_BODY);
    });
  });

  it('GET /api/users returns every user with emails to an admin', async () => {
    // Regression coverage for a wrong-import bug: this route must read
    // listUsers() from server/auth/repository.mjs, not the identically named
    // listUsers() in server/db/resourceRepository.mjs, which used to read a
    // store that was always empty.
    const { header } = await authHeaderFor('admin');

    const response = await request(app).get('/api/users').set('Authorization', header);

    expect(response.status).toBe(200);
    expect(response.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: SEED_ADMIN_ID, email: 'admin@test.com', role: 'admin' }),
        expect.objectContaining({ id: SEED_USER_ID, email: 'joao@acme.com', role: 'user' }),
      ]),
    );
  });

  it('GET /api/users includes a user registered via POST /api/auth/register (regression test for the listUsers wrong-import bug)', async () => {
    const email = uniqueEmail('users-list-visibility');
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'password1', full_name: 'Users List Visibility' });
    expect(registerResponse.status).toBe(201);
    const { header } = await authHeaderFor('admin');

    const response = await request(app).get('/api/users').set('Authorization', header);

    expect(response.status).toBe(200);
    expect(response.body.users).toContainEqual(
      expect.objectContaining({ email, full_name: 'Users List Visibility', role: 'user' }),
    );
  });

  it('GET /api/users hides other users\' emails from a plain user but keeps their own', async () => {
    const { header, user } = await authHeaderFor('user', { productive_unit_id: 'pu1' });

    const response = await request(app).get('/api/users').set('Authorization', header);

    expect(response.status).toBe(200);
    const joao = response.body.users.find((u) => u.id === SEED_USER_ID);
    expect(joao).toMatchObject({ full_name: 'Joao Silva', role: 'user' });
    expect(joao).not.toHaveProperty('email');
    expect(response.body.users.find((u) => u.id === user.id)).toMatchObject({ email: user.email });
  });

  it('GET /api/users keeps emails for a supervisor', async () => {
    const { header } = await authHeaderFor('supervisor', { productive_unit_id: 'pu1' });

    const response = await request(app).get('/api/users').set('Authorization', header);

    expect(response.status).toBe(200);
    expect(response.body.users).toContainEqual(expect.objectContaining({ id: SEED_USER_ID, email: 'joao@acme.com' }));
  });

  describe('GET /api/user-badges scope', () => {
    const awardTo = async (userId, tone = 'gold') => {
      const id = crypto.randomUUID();
      await prisma.userBadge.create({ data: { id, user_id: userId, badge_id: '1', tone } });
      return id;
    };

    it('returns a plain user their own awards and their unit colleagues\', not other units\'', async () => {
      const me = await authHeaderFor('user', { productive_unit_id: 'pu-ub-a' });
      const colleague = await authHeaderFor('user', { productive_unit_id: 'pu-ub-a' });
      const stranger = await authHeaderFor('user', { productive_unit_id: 'pu-ub-b' });
      const mine = await awardTo(me.user.id);
      const colleagues = await awardTo(colleague.user.id, 'loss_2');
      const strangers = await awardTo(stranger.user.id, 'loss_2');

      const response = await request(app).get('/api/user-badges').set('Authorization', me.header);

      expect(response.status).toBe(200);
      const ids = response.body.userBadges.map((ub) => ub.id);
      expect(ids).toEqual(expect.arrayContaining([mine, colleagues]));
      expect(ids).not.toContain(strangers);
    });

    it('returns only their own awards to a plain user without a unit', async () => {
      const me = await authHeaderFor('user');
      const mine = await awardTo(me.user.id);
      await awardTo(SEED_USER_ID);

      const response = await request(app).get('/api/user-badges').set('Authorization', me.header);

      expect(response.status).toBe(200);
      expect(response.body.userBadges.map((ub) => ub.id)).toEqual([mine]);
    });

    it('returns only awards from the supervisor\'s own unit', async () => {
      const supervisor = await authHeaderFor('supervisor', { productive_unit_id: 'pu-ub-c' });
      const inUnit = await authHeaderFor('user', { productive_unit_id: 'pu-ub-c' });
      const outOfUnit = await authHeaderFor('user', { productive_unit_id: 'pu-ub-d' });
      const visible = await awardTo(inUnit.user.id);
      const hidden = await awardTo(outOfUnit.user.id);

      const response = await request(app).get('/api/user-badges').set('Authorization', supervisor.header);

      expect(response.status).toBe(200);
      const ids = response.body.userBadges.map((ub) => ub.id);
      expect(ids).toContain(visible);
      expect(ids).not.toContain(hidden);
    });

    it('returns every award to an admin, without who granted it', async () => {
      const someone = await authHeaderFor('user', { productive_unit_id: 'pu-ub-e' });
      const id = await awardTo(someone.user.id);
      const { header } = await authHeaderFor('admin');

      const response = await request(app).get('/api/user-badges').set('Authorization', header);

      expect(response.status).toBe(200);
      const award = response.body.userBadges.find((ub) => ub.id === id);
      expect(award).toMatchObject({ user_id: someone.user.id, badge_id: '1', tone: 'gold' });
      expect(award).not.toHaveProperty('awarded_by');
    });
  });

  describe('GET /api/ranking', () => {
    const awardOn = (userId, badgeId, tone, isoDate) =>
      prisma.userBadge.create({ data: { user_id: userId, badge_id: badgeId, tone, awarded_at: new Date(isoDate) } });

    it('returns 400 for a missing or out-of-range month', async () => {
      const { header } = await authHeaderFor('user');

      const missing = await request(app).get('/api/ranking?year=2020').set('Authorization', header);
      const outOfRange = await request(app).get('/api/ranking?year=2020&month=13').set('Authorization', header);

      expect(missing.status).toBe(400);
      expect(outOfRange.status).toBe(400);
    });

    it('gives a plain user the monthly scores of users in other units, without their individual awards', async () => {
      const me = await authHeaderFor('user', { productive_unit_id: 'pu-rk-a' });
      const other = await authHeaderFor('user', { productive_unit_id: 'pu-rk-b' });
      await awardOn(other.user.id, '1', 'gold', '2020-03-01T00:00:00Z'); // Qualidade +3
      await awardOn(other.user.id, '2', 'silver', '2020-03-31T23:59:59Z'); // Segurança +2
      await awardOn(other.user.id, '1', 'loss_2', '2020-03-15T12:00:00Z'); // Qualidade -2
      await awardOn(other.user.id, '1', 'gold', '2020-02-29T23:59:59Z'); // previous month: ignored
      await awardOn(other.user.id, '1', 'gold', '2020-04-01T00:00:00Z'); // next month: ignored

      const response = await request(app).get('/api/ranking?year=2020&month=3').set('Authorization', me.header);

      expect(response.status).toBe(200);
      expect(response.body.ranking.find((entry) => entry.user_id === other.user.id)).toEqual({
        user_id: other.user.id,
        monthly_score: 3,
        positive_count: 2,
        loss_count: 1,
        category_scores: { Qualidade: 1, 'Segurança': 2 },
      });
    });

    it('leaves out users with no awards in the month', async () => {
      const me = await authHeaderFor('user');
      const idle = await authHeaderFor('user');
      await awardOn(idle.user.id, '1', 'gold', '2020-05-10T00:00:00Z');

      const response = await request(app).get('/api/ranking?year=2020&month=6').set('Authorization', me.header);

      expect(response.status).toBe(200);
      expect(response.body.ranking.map((entry) => entry.user_id)).not.toContain(idle.user.id);
    });
  });

  describe('GET /api/submissions scope', () => {
    const createSubmissionFor = async (userId, unitLabel) => {
      const id = crypto.randomUUID();
      await prisma.badgeSubmission.create({ data: { id, user_id: userId, badge_id: '1', description: `scope ${unitLabel}` } });
      return id;
    };

    it('returns only the caller\'s own submissions to a plain user', async () => {
      const me = await authHeaderFor('user', { productive_unit_id: 'pu1' });
      const mine = await createSubmissionFor(me.user.id, 'mine');
      const theirs = await createSubmissionFor(SEED_USER_ID, 'theirs');

      const response = await request(app).get('/api/submissions').set('Authorization', me.header);

      expect(response.status).toBe(200);
      const ids = response.body.submissions.map((s) => s.id);
      expect(ids).toEqual([mine]);
      expect(ids).not.toContain(theirs);
    });

    it('returns only submissions from the supervisor\'s own unit', async () => {
      const supervisor = await authHeaderFor('supervisor', { productive_unit_id: 'pu-scope-a' });
      const inUnit = await authHeaderFor('user', { productive_unit_id: 'pu-scope-a' });
      const outOfUnit = await authHeaderFor('user', { productive_unit_id: 'pu-scope-b' });
      const visible = await createSubmissionFor(inUnit.user.id, 'in unit');
      const hidden = await createSubmissionFor(outOfUnit.user.id, 'out of unit');

      const response = await request(app).get('/api/submissions').set('Authorization', supervisor.header);

      expect(response.status).toBe(200);
      const ids = response.body.submissions.map((s) => s.id);
      expect(ids).toContain(visible);
      expect(ids).not.toContain(hidden);
    });

    it('returns every submission to an admin', async () => {
      const someone = await authHeaderFor('user', { productive_unit_id: 'pu-scope-c' });
      const id = await createSubmissionFor(someone.user.id, 'admin sees');
      const { header } = await authHeaderFor('admin');

      const response = await request(app).get('/api/submissions').set('Authorization', header);

      expect(response.status).toBe(200);
      expect(response.body.submissions.map((s) => s.id)).toContain(id);
    });
  });

});

describe('GET /api/health', () => {
  it('returns 200 { status: "ok" } when the database answers', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns 503 { status: "unavailable" } when the database query fails', async () => {
    const spy = vi.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('down'));

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ status: 'unavailable' });
    spy.mockRestore();
  });
});

describe('removed import-source and import-run routes', () => {
  it.each(['/api/admin/import-sources', '/api/admin/import-runs'])('POST %s returns 404', async (path) => {
    const { header } = await authHeaderFor('developer');

    const response = await request(app).post(path).set('Authorization', header).send({});

    expect(response.status).toBe(404);
  });
});

describe('auth flow routes (HTTP layer over the real service functions)', () => {
  // Exact status/body shapes for these are already characterized by
  // server/auth/service.test.mjs; this only confirms the HTTP wiring.

  it('POST /api/auth/register returns 201 with a token and user on success', async () => {
    const email = uniqueEmail('register-http');

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'password1', full_name: 'HTTP Register' });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ email, full_name: 'HTTP Register', role: 'user' });
    expect(typeof response.body.token).toBe('string');
  });

  it('POST /api/auth/register returns 400 for an invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'password1', full_name: 'X' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Dados inválidos.');
  });

  it('POST /api/auth/login returns 200 with a token on valid credentials', async () => {
    const email = uniqueEmail('login-http');
    await request(app).post('/api/auth/register').send({ email, password: 'correct-password', full_name: 'HTTP Login' });

    const response = await request(app).post('/api/auth/login').send({ email, password: 'correct-password' });

    expect(response.status).toBe(200);
    expect(typeof response.body.token).toBe('string');
    expect(response.body.user).toMatchObject({ email });
  });

  it('POST /api/auth/login returns 401 for wrong credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: uniqueEmail('login-fail'), password: 'whatever' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Credenciais inválidas.');
  });

  it('GET /api/auth/me returns 200 with the user on a valid session', async () => {
    const email = uniqueEmail('me-http');
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'password1', full_name: 'HTTP Me' });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${registerResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ email });
  });

  it('GET /api/auth/me returns 401 without a token', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body).toEqual(SESSION_ERROR_BODY);
  });

  it('POST /api/auth/logout revokes the session and returns { success: true }', async () => {
    const email = uniqueEmail('logout-http');
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'password1', full_name: 'HTTP Logout' });
    const token = `Bearer ${registerResponse.body.token}`;

    const logoutResponse = await request(app).post('/api/auth/logout').set('Authorization', token);
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body).toEqual({ success: true });

    const afterLogout = await request(app).get('/api/auth/me').set('Authorization', token);
    expect(afterLogout.status).toBe(401);
  });

  it('POST /api/auth/logout returns 401 without a token', async () => {
    const response = await request(app).post('/api/auth/logout');

    expect(response.status).toBe(401);
  });
});

describe('protected routes exercised end-to-end with a valid token', () => {
  it('admin action succeeding: POST /api/admin/seed-indicator-badges seeds the indicator badge set for a plain admin', async () => {
    // Chosen deliberately over /api/admin/award-badges or similar: this is
    // the one mutating admin route whose guard is only isAdminOrDeveloper()
    // with no further ensureUsersWithinScope() call, so a plain 'admin' role
    // (not 'developer') can reach 200 here without needing a productive_unit_id
    // fixture. Several of the other guarded routes (award-badges,
    // import-monthly-badges, user-badges/remove, users/delete) call
    // ensureUsersWithinScope(), which — since the listUsers() wrong-import bug
    // fix — resolves the caller's allowed user ids via real
    // productive_unit_id matching against server/auth/repository.mjs's
    // listUsers(). Using this route instead keeps the test focused on the
    // guard shape without needing to construct matching-unit fixtures.
    const { header } = await authHeaderFor('admin');

    const response = await request(app).post('/api/admin/seed-indicator-badges').set('Authorization', header);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.badges)).toBe(true);
    expect(response.body.badges.length).toBeGreaterThan(0);
    expect(response.body.badges).toContainEqual(expect.objectContaining({ id: 'ind-nps', name: 'NPS' }));
  });

  it('ensureUsersWithinScope regression: a supervisor CAN award a badge to a real target user in their own productive unit', async () => {
    // Direct coverage for server/index.mjs:39-48's real (non-developer)
    // branch, which the listUsers() wrong-import bug always denied
    // regardless of actual scope. Both accounts are given the same real
    // productive_unit_id, and the target user is a real row in the users
    // table (via authHeaderFor -> createTestUser), which
    // ensureUsersWithinScope's listUsers() reads.
    const unitId = 'unit-award-same';
    const { header: supervisorHeader } = await authHeaderFor('supervisor', { productive_unit_id: unitId });
    const { user: targetUser } = await authHeaderFor('user', { productive_unit_id: unitId });

    const response = await request(app)
      .post('/api/admin/award-badges')
      .set('Authorization', supervisorHeader)
      .send({ user_ids: [targetUser.id], badge_id: '1', tone: 'bronze' });

    expect(response.status).toBe(200);
    expect(response.body.awardedBadges).toEqual([
      expect.objectContaining({
        user_id: targetUser.id,
        badge_id: '1',
        tone: 'bronze',
        productive_unit_id: unitId,
      }),
    ]);
  });

  it('ensureUsersWithinScope regression: a supervisor CANNOT award a badge to a real target user in a different productive unit', async () => {
    // Same route/mechanism as above, proving the scope check still denies
    // correctly (i.e. the fix did not make it fail open): the target user is
    // a real, findable account, just in a different productive_unit_id than
    // the supervisor's own.
    const { header: supervisorHeader } = await authHeaderFor('supervisor', { productive_unit_id: 'unit-award-own' });
    const { user: targetUser } = await authHeaderFor('user', { productive_unit_id: 'unit-award-other' });

    const response = await request(app)
      .post('/api/admin/award-badges')
      .set('Authorization', supervisorHeader)
      .send({ user_ids: [targetUser.id], badge_id: '1', tone: 'bronze' });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Acesso restrito à sua empresa.' });
  });

  it('supervisor-scope restriction: POST /api/admin/users 403s a supervisor creating a user outside their own unit', async () => {
    const { header } = await authHeaderFor('supervisor', { productive_unit_id: 'unit-supervisor-own' });

    const response = await request(app)
      .post('/api/admin/users')
      .set('Authorization', header)
      .send({
        email: uniqueEmail('cross-unit-target'),
        full_name: 'Cross Unit User',
        productive_unit_id: 'unit-different-from-supervisor',
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Gestores só podem cadastrar usuários da própria unidade produtiva.' });
  });

  it('supervisor within their own unit is allowed past the scope check for POST /api/admin/users', async () => {
    const unitId = 'unit-supervisor-same';
    const { header } = await authHeaderFor('supervisor', { productive_unit_id: unitId });

    const response = await request(app)
      .post('/api/admin/users')
      .set('Authorization', header)
      .send({
        email: uniqueEmail('same-unit-target'),
        full_name: 'Same Unit User',
        productive_unit_id: unitId,
        // The frontend always sends a role; without one the insert fails with
        // a 500 (NOT NULL), a known gap tracked outside Fase 2.
        role: 'user',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ full_name: 'Same Unit User', productive_unit_id: unitId });
  });

  it('submission review flow: a developer approves a real pending submission end-to-end', async () => {
    // 'developer' is used here to bypass ensureSubmissionWithinScope()
    // outright via isDeveloper(): that function (now correctly reading
    // server/auth/repository.mjs's listUsers() after the listUsers()
    // wrong-import bug fix) resolves the submission owner's real
    // productive_unit_id and compares it to the reviewer's — using
    // 'developer' avoids depending on both accounts sharing a
    // productive_unit_id for this test to pass.
    const applicant = await authHeaderFor('user');
    const reviewer = await authHeaderFor('developer');

    const submissionResponse = await request(app)
      .post('/api/submissions')
      .set('Authorization', applicant.header)
      .send({ badge_id: '1', description: 'Evidência de trabalho' });

    expect(submissionResponse.status).toBe(201);
    expect(submissionResponse.body.status).toBe('pending');
    const submissionId = submissionResponse.body.id;

    const reviewResponse = await request(app)
      .post(`/api/submissions/${submissionId}/review`)
      .set('Authorization', reviewer.header)
      .send({ status: 'approved' });

    expect(reviewResponse.status).toBe(200);
    expect(reviewResponse.body.submission).toMatchObject({ id: submissionId, status: 'approved' });
    expect(reviewResponse.body.awardedBadge).toMatchObject({ user_id: applicant.user.id, badge_id: '1', tone: 'bronze' });
  });

  it('a fake submission id 403s the review route even for a developer-equivalent supervisor within scope', async () => {
    const reviewer = await authHeaderFor('admin');

    // Submission ids are UUIDs: a non-UUID id currently 500s on the database
    // (invalid uuid syntax), a known gap tracked outside Fase 2.
    const response = await request(app)
      .post(`/api/submissions/${crypto.randomUUID()}/review`)
      .set('Authorization', reviewer.header)
      .send({ status: 'approved' });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Acesso restrito à sua empresa.' });
  });

  it('PUT /api/user/profile updates the authenticated user\'s own profile', async () => {
    const { header, user } = await authHeaderFor('user');

    const response = await request(app)
      .put('/api/user/profile')
      .set('Authorization', header)
      .send({ full_name: 'Nome Atualizado' });

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ id: user.id, full_name: 'Nome Atualizado' });
  });
});

describe('catch-all route', () => {
  it('serves index.html for an unknown GET path', async () => {
    const response = await request(app).get('/some/unknown/spa/route');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('<html');
  });
});

describe('/uploads conforme o driver de storage', () => {
  it('com o driver supabase, /uploads/* responde 404 em vez do index.html da SPA', async () => {
    const response = await request(createApp({ storageDriver: 'supabase' })).get('/uploads/antigo.png');

    expect(response.status).toBe(404);
    expect(response.text).not.toContain('<html');
  });

  it('com o driver local, /uploads serve os arquivos de public/uploads', async () => {
    const { LOCAL_UPLOADS_DIR } = await import('./uploads/storage/localStorage.mjs');
    const fs = await import('node:fs');
    const name = `teste-${crypto.randomUUID()}.png`;
    fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
    fs.writeFileSync(`${LOCAL_UPLOADS_DIR}/${name}`, 'img');
    try {
      const response = await request(createApp({ storageDriver: 'local' })).get(`/uploads/${name}`);
      expect(response.status).toBe(200);
      expect(response.body.toString()).toBe('img');
    } finally {
      fs.rmSync(`${LOCAL_UPLOADS_DIR}/${name}`, { force: true });
    }
  });
});

describe('POST /api/admin/users só aceita avatar do storage', () => {
  const send = async (body) => {
    const { header } = await authHeaderFor('admin');
    return request(app).post('/api/admin/users').set('Authorization', header)
      .send({ email: uniqueEmail('avatar'), full_name: 'Avatar User', role: 'user', ...body });
  };

  it('recusa um avatar_url de fora do storage', async () => {
    const response = await send({ avatar_url: 'https://evil.example/pixel.png' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Avatar inválido: envie a imagem pelo upload.' });
  });

  it('recusa um caminho que tenta sair de /uploads', async () => {
    const response = await send({ avatar_url: '/uploads/../index.html' });
    expect(response.status).toBe(400);
  });

  it('aceita um avatar_url emitido pelo storage', async () => {
    const response = await send({ avatar_url: '/uploads/abc123-1.png' });

    expect(response.status).toBe(201);
    expect(response.body.user.avatar_url).toBe('/uploads/abc123-1.png');
  });

  it('aceita avatar_url vazio (sem avatar)', async () => {
    const response = await send({ avatar_url: '' });
    expect(response.status).toBe(201);
  });

  it('aceita reenviar o avatar que o usuário já tinha, mesmo de fora do storage', async () => {
    const existing = await createTestUser({
      email: uniqueEmail('legado'), full_name: 'Legado', role: 'user', avatar_url: 'https://antigo.example/a.png',
    });

    const response = await send({ id: existing.id, email: existing.email, full_name: 'Legado 2', avatar_url: 'https://antigo.example/a.png' });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ full_name: 'Legado 2', avatar_url: 'https://antigo.example/a.png' });
  });

  it('recusa trocar o avatar de um usuário existente por uma URL de fora', async () => {
    const existing = await createTestUser({ email: uniqueEmail('troca'), full_name: 'Troca', role: 'user', avatar_url: '/uploads/meu.png' });

    const response = await send({ id: existing.id, email: existing.email, avatar_url: 'https://evil.example/x.png' });

    expect(response.status).toBe(400);
    expect((await prisma.user.findUnique({ where: { id: existing.id } })).avatar_url).toBe('/uploads/meu.png');
  });
});
