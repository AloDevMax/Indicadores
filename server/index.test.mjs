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
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
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
 * a valid session" case: sessions are built directly against the
 * repository + crypto layers for any role.
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

/** Creates a plain user and logs in over HTTP, returning the real token. */
const loginOverHttp = async (label, password = 'password1') => {
  const email = uniqueEmail(label);
  await createTestUser({ email, password, full_name: `HTTP ${label}`, role: 'user' });
  const response = await request(app).post('/api/auth/login').send({ email, password });
  return { email, token: response.body.token };
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

  it('GET /api/users includes a user created after startup (regression test for the listUsers wrong-import bug)', async () => {
    const email = uniqueEmail('users-list-visibility');
    await createTestUser({ email, full_name: 'Users List Visibility', role: 'user' });
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

  it('POST /api/auth/register no longer exists: self-registration is disabled', async () => {
    const email = uniqueEmail('register-disabled');

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'password1', full_name: 'Should Not Exist' });

    expect(response.status).toBe(404);
    expect(await prisma.user.findUnique({ where: { email } })).toBeNull();
  });

  it('POST /api/auth/login returns 200 with a token on valid credentials', async () => {
    const email = uniqueEmail('login-http');
    await createTestUser({ email, password: 'correct-password', full_name: 'HTTP Login', role: 'user' });

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
    const { email, token } = await loginOverHttp('me-http');

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ email });
  });

  it('GET /api/auth/me returns 401 without a token', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body).toEqual(SESSION_ERROR_BODY);
  });

  it('POST /api/auth/logout revokes the session and returns { success: true }', async () => {
    const { token: rawToken } = await loginOverHttp('logout-http');
    const token = `Bearer ${rawToken}`;

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

  it('a fake submission id 404s the review route', async () => {
    const reviewer = await authHeaderFor('admin');

    const response = await request(app)
      .post(`/api/submissions/${crypto.randomUUID()}/review`)
      .set('Authorization', reviewer.header)
      .send({ status: 'approved' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Solicitação não encontrada.' });
  });

  it('PUT /api/user/profile updates the authenticated user\'s own name without asking for the password', async () => {
    const { header, user } = await authHeaderFor('user');

    const response = await request(app)
      .put('/api/user/profile')
      .set('Authorization', header)
      .send({ full_name: 'Nome Atualizado' });

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ id: user.id, full_name: 'Nome Atualizado' });
  });
});

describe('PUT /api/user/profile — validation and password change', () => {
  const profileUser = async (overrides = {}) => {
    const email = uniqueEmail('profile');
    const user = await createTestUser({ email, password: 'senha-atual', full_name: 'Perfil', role: 'user', ...overrides });
    const login = await request(app).post('/api/auth/login').send({ email, password: 'senha-atual' });
    return { user, email, header: `Bearer ${login.body.token}` };
  };

  it('rejects an e-mail change: the e-mail is managed by admins (400, e-mail untouched)', async () => {
    const { user, email, header } = await profileUser();

    const response = await request(app).put('/api/user/profile').set('Authorization', header)
      .send({ email: uniqueEmail('outro') });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Dados inválidos.');
    expect((await prisma.user.findUnique({ where: { id: user.id } })).email).toBe(email);
  });

  it('rejects a name shorter than 2 characters', async () => {
    const { header } = await profileUser();

    const response = await request(app).put('/api/user/profile').set('Authorization', header).send({ full_name: 'A' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Dados inválidos.');
  });

  it('rejects a new password shorter than 8 characters', async () => {
    const { header } = await profileUser();

    const response = await request(app).put('/api/user/profile').set('Authorization', header)
      .send({ current_password: 'senha-atual', new_password: 'curta' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Dados inválidos.');
  });

  it('requires the current password to set a new one', async () => {
    const { header } = await profileUser();

    const response = await request(app).put('/api/user/profile').set('Authorization', header)
      .send({ new_password: 'nova-senha-123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Dados inválidos.');
  });

  it('rejects a wrong current password and keeps the old one', async () => {
    const { email, header } = await profileUser();

    const response = await request(app).put('/api/user/profile').set('Authorization', header)
      .send({ current_password: 'errada', new_password: 'nova-senha-123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Senha atual incorreta.');
    const relogin = await request(app).post('/api/auth/login').send({ email, password: 'senha-atual' });
    expect(relogin.status).toBe(200);
  });

  it('rejects a new password equal to the current one', async () => {
    const { header } = await profileUser();

    const response = await request(app).put('/api/user/profile').set('Authorization', header)
      .send({ current_password: 'senha-atual', new_password: 'senha-atual' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('A nova senha deve ser diferente da atual.');
  });

  it('changes the password with the right current password', async () => {
    const { email, header } = await profileUser();

    const response = await request(app).put('/api/user/profile').set('Authorization', header)
      .send({ current_password: 'senha-atual', new_password: 'nova-senha-123' });

    expect(response.status).toBe(200);
    expect(response.body.user.must_change_password).toBe(false);
    expect((await request(app).post('/api/auth/login').send({ email, password: 'nova-senha-123' })).status).toBe(200);
    expect((await request(app).post('/api/auth/login').send({ email, password: 'senha-atual' })).status).toBe(401);
  });
});

describe('pending password change gate', () => {
  const flaggedUser = async () => {
    const email = uniqueEmail('flagged');
    await createTestUser({ email, password: 'temporaria1', full_name: 'Flagged', role: 'admin', must_change_password: true });
    const login = await request(app).post('/api/auth/login').send({ email, password: 'temporaria1' });
    return { header: `Bearer ${login.body.token}` };
  };

  it('blocks the rest of the API with 403 PASSWORD_CHANGE_REQUIRED', async () => {
    const { header } = await flaggedUser();

    const badges = await request(app).get('/api/badges').set('Authorization', header);
    const users = await request(app).get('/api/users').set('Authorization', header);

    expect(badges.status).toBe(200); // public catalog, no auth involved
    expect(users.status).toBe(403);
    expect(users.body).toEqual({ error: 'Troque sua senha antes de continuar.', code: 'PASSWORD_CHANGE_REQUIRED' });
  });

  it('blocks uploads too', async () => {
    const { header } = await flaggedUser();

    const response = await request(app).post('/api/upload/user-avatar').set('Authorization', header)
      .attach('avatar', Buffer.from('fake-image-bytes'), 'avatar.png');

    expect(response.status).toBe(403);
    expect(response.body.code).toBe('PASSWORD_CHANGE_REQUIRED');
  });

  it('still allows /me, the password change, and then unlocks the API', async () => {
    const { header } = await flaggedUser();

    const me = await request(app).get('/api/auth/me').set('Authorization', header);
    expect(me.status).toBe(200);
    expect(me.body.user.must_change_password).toBe(true);

    const nameOnly = await request(app).put('/api/user/profile').set('Authorization', header).send({ full_name: 'Só Nome' });
    expect(nameOnly.status).toBe(403);
    expect(nameOnly.body.code).toBe('PASSWORD_CHANGE_REQUIRED');

    const change = await request(app).put('/api/user/profile').set('Authorization', header)
      .send({ current_password: 'temporaria1', new_password: 'minha-senha-123' });
    expect(change.status).toBe(200);

    const users = await request(app).get('/api/users').set('Authorization', header);
    expect(users.status).toBe(200);
  });
});

describe('admin-issued temporary passwords', () => {
  it('POST /api/admin/users without a password returns a one-time temporary password that logs in', async () => {
    const { header } = await authHeaderFor('developer');
    const email = uniqueEmail('temp');

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send({ email, full_name: 'Temporário', role: 'user' });

    expect(response.status).toBe(201);
    expect(response.body.temporary_password).toMatch(/^[A-HJ-NP-Za-km-z2-9]{12}$/);
    expect(response.body.user.temporary_password).toBeUndefined();
    const login = await request(app).post('/api/auth/login').send({ email, password: response.body.temporary_password });
    expect(login.status).toBe(200);
    expect(login.body.user.must_change_password).toBe(true);
  });

  it('POST /api/admin/users with a password returns no temporary password', async () => {
    const { header } = await authHeaderFor('developer');

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send({ email: uniqueEmail('chosen'), full_name: 'Escolhida', role: 'user', password: 'escolhida1' });

    expect(response.status).toBe(201);
    expect(response.body.temporary_password).toBeUndefined();
  });

  it('POST /api/admin/users/bulk-invite returns one temporary password per created user', async () => {
    const { header } = await authHeaderFor('developer');
    const emails = [uniqueEmail('invite-a'), uniqueEmail('invite-b')];

    const response = await request(app).post('/api/admin/users/bulk-invite').set('Authorization', header)
      .send({ emails });

    expect(response.status).toBe(200);
    expect(response.body.temporaryPasswords.map((entry) => entry.email)).toEqual(emails);
  });
});

describe('static files: only the client build is public', () => {
  // Um build fictício do Vite: os testes não dependem de ter rodado `npm run build`.
  const clientDir = fs.mkdtempSync(path.join(os.tmpdir(), 'labquest-client-'));
  fs.mkdirSync(path.join(clientDir, 'assets'));
  fs.writeFileSync(path.join(clientDir, 'index.html'), '<!doctype html><html><body>SPA</body></html>');
  fs.writeFileSync(path.join(clientDir, 'assets', 'app.js'), 'console.log("app")');
  const staticApp = createApp({ clientDir });

  afterAll(() => fs.rmSync(clientDir, { recursive: true, force: true }));

  it('serves the built assets', async () => {
    const response = await request(staticApp).get('/assets/app.js');

    expect(response.status).toBe(200);
    expect(response.text).toBe('console.log("app")');
  });

  it('serves index.html for an unknown GET path', async () => {
    const response = await request(staticApp).get('/some/unknown/spa/route');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('SPA');
  });

  it.each(['/server/config/env.mjs', '/server/index.mjs', '/package.json', '/prisma/schema.prisma'])(
    'never serves the server source or project files: GET %s gets the SPA',
    async (filePath) => {
      const response = await request(staticApp).get(filePath);

      expect(response.headers['content-type']).toMatch(/text\/html/);
      expect(response.text).toContain('SPA');
    },
  );

  it('the default client directory does not expose the server source either', async () => {
    const response = await request(app).get('/server/config/env.mjs');

    expect(response.text).not.toContain('AUTH_SECRET');
    expect(response.headers['content-type']).not.toMatch(/javascript/);
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

describe('sessions end when access is withdrawn', () => {
  const activeSessions = (userId) => prisma.authSession.count({ where: { user_id: userId, revoked_at: null } });
  const meStatus = async (token) =>
    (await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)).status;

  it('401s an existing session once the user is deactivated', async () => {
    const { email, token } = await loginOverHttp('deactivated');
    await prisma.user.update({ where: { email }, data: { is_active: false } });

    const response = await request(app).get('/api/submissions').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(SESSION_ERROR_BODY);
  });

  it('revokes every session of a user an admin deactivates', async () => {
    const { email, token } = await loginOverHttp('to-deactivate');
    const target = await prisma.user.findUnique({ where: { email } });
    const { header } = await authHeaderFor('developer');

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send({ id: target.id, email, full_name: target.full_name, role: 'user', is_active: false });

    expect(response.status).toBe(201);
    expect(await activeSessions(target.id)).toBe(0);
    expect(await meStatus(token)).toBe(401);
  });

  it('revokes every session of a user whose password an admin resets', async () => {
    const { email, token } = await loginOverHttp('to-reset');
    const target = await prisma.user.findUnique({ where: { email } });
    const { header } = await authHeaderFor('developer');

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send({ id: target.id, email, full_name: target.full_name, role: 'user', password: 'redefinida1' });

    expect(response.status).toBe(201);
    expect(await activeSessions(target.id)).toBe(0);
    expect(await meStatus(token)).toBe(401);
  });

  it('keeps the sessions of a user an admin only renames', async () => {
    const { email, token } = await loginOverHttp('to-rename');
    const target = await prisma.user.findUnique({ where: { email } });
    const { header } = await authHeaderFor('developer');

    await request(app).post('/api/admin/users').set('Authorization', header)
      .send({ id: target.id, email, full_name: 'Outro Nome', role: 'user' });

    expect(await meStatus(token)).toBe(200);
  });

  it('changing your own password ends your other sessions and keeps the current one', async () => {
    const { email, token: current } = await loginOverHttp('own-change');
    const other = (await request(app).post('/api/auth/login').send({ email, password: 'password1' })).body.token;

    const response = await request(app).put('/api/user/profile').set('Authorization', `Bearer ${current}`)
      .send({ current_password: 'password1', new_password: 'nova-senha-123' });

    expect(response.status).toBe(200);
    expect(await meStatus(current)).toBe(200);
    expect(await meStatus(other)).toBe(401);
  });
});

describe('POST /api/auth/login — failed-attempt limits', () => {
  const LIMITS = { windowMs: 60_000, maxFailuresPerEmail: 3, maxFailuresPerIp: 5 };
  const TOO_MANY_ATTEMPTS = { error: 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.' };

  const createAccount = async (label) => {
    const email = uniqueEmail(label);
    await createTestUser({ email, password: 'correta123', full_name: `Limite ${label}`, role: 'user' });
    return email;
  };
  const attempt = (limitedApp, email, password) =>
    request(limitedApp).post('/api/auth/login').send({ email, password });

  it('blocks an e-mail after too many wrong passwords, even with the right one, in any letter case', async () => {
    const limitedApp = createApp({ loginRateLimit: LIMITS });
    const email = await createAccount('target');

    for (let i = 0; i < LIMITS.maxFailuresPerEmail; i += 1) {
      expect((await attempt(limitedApp, i % 2 ? email.toUpperCase() : email, `errada${i}`)).status).toBe(401);
    }
    const blocked = await attempt(limitedApp, email, 'correta123');

    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual(TOO_MANY_ATTEMPTS);
  });

  it('keeps other e-mails usable while one is blocked', async () => {
    const limitedApp = createApp({ loginRateLimit: LIMITS });
    const blockedEmail = await createAccount('blocked');
    const otherEmail = await createAccount('other');

    for (let i = 0; i <= LIMITS.maxFailuresPerEmail; i += 1) await attempt(limitedApp, blockedEmail, 'errada');

    expect((await attempt(limitedApp, otherEmail, 'correta123')).status).toBe(200);
  });

  it('does not count successful logins', async () => {
    const limitedApp = createApp({ loginRateLimit: LIMITS });
    const email = await createAccount('success');

    const statuses = [];
    for (let i = 0; i < LIMITS.maxFailuresPerEmail + 2; i += 1) statuses.push((await attempt(limitedApp, email, 'correta123')).status);

    expect(statuses.every((status) => status === 200)).toBe(true);
  });

  it('blocks an address spraying wrong passwords across many e-mails', async () => {
    const limitedApp = createApp({ loginRateLimit: LIMITS });

    for (let i = 0; i < LIMITS.maxFailuresPerIp; i += 1) {
      expect((await attempt(limitedApp, uniqueEmail(`spray${i}`), 'errada')).status).toBe(401);
    }
    const blocked = await attempt(limitedApp, await createAccount('spray-victim'), 'correta123');

    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual(TOO_MANY_ATTEMPTS);
  });
});

describe('POST /api/admin/users — who can edit an existing account', () => {
  const loginStatus = async (email, password) =>
    (await request(app).post('/api/auth/login').send({ email, password })).status;

  const createTarget = async (overrides) => {
    if (overrides.productive_unit_id) {
      const id = overrides.productive_unit_id;
      await prisma.productiveUnit.upsert({ where: { id }, create: { id, name: `Unidade ${id}` }, update: {} });
    }
    return createTestUser({
      email: uniqueEmail(overrides.role), password: 'original1', full_name: 'Alvo', productive_unit_id: null, ...overrides,
    });
  };

  const editPayload = (target, changes = {}) => ({
    id: target.id,
    email: target.email,
    full_name: target.full_name,
    role: target.role,
    productive_unit_id: target.productive_unit_id ?? '',
    ...changes,
  });

  it('403s a supervisor resetting the password of an admin from another unit, leaving the account untouched', async () => {
    const { header } = await authHeaderFor('supervisor', { productive_unit_id: 'edit-unit-a' });
    const admin = await createTarget({ role: 'admin', productive_unit_id: 'edit-unit-b' });

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send(editPayload(admin, { role: 'user', productive_unit_id: 'edit-unit-a', password: 'hacked123' }));

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Supervisores só podem editar colaboradores da própria unidade produtiva.' });
    expect(await loginStatus(admin.email, 'hacked123')).toBe(401);
    expect(await prisma.user.findUnique({ where: { id: admin.id }, select: { role: true, productive_unit_id: true } }))
      .toEqual({ role: 'admin', productive_unit_id: 'edit-unit-b' });
  });

  it('403s a supervisor editing a plain user from another unit', async () => {
    const { header } = await authHeaderFor('supervisor', { productive_unit_id: 'edit-unit-a' });
    const target = await createTarget({ role: 'user', productive_unit_id: 'edit-unit-b' });

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send(editPayload(target, { productive_unit_id: 'edit-unit-a' }));

    expect(response.status).toBe(403);
    expect((await prisma.user.findUnique({ where: { id: target.id } })).productive_unit_id).toBe('edit-unit-b');
  });

  it('403s a supervisor editing another supervisor of their own unit', async () => {
    const { header } = await authHeaderFor('supervisor', { productive_unit_id: 'edit-unit-a' });
    const target = await createTarget({ role: 'supervisor', productive_unit_id: 'edit-unit-a' });

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send(editPayload(target, { role: 'user' }));

    expect(response.status).toBe(403);
    expect((await prisma.user.findUnique({ where: { id: target.id } })).role).toBe('supervisor');
  });

  it('lets a supervisor edit a plain user of their own unit', async () => {
    const { header } = await authHeaderFor('supervisor', { productive_unit_id: 'edit-unit-a' });
    const target = await createTarget({ role: 'user', productive_unit_id: 'edit-unit-a' });

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send(editPayload(target, { full_name: 'Nome Novo' }));

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ id: target.id, full_name: 'Nome Novo', role: 'user', productive_unit_id: 'edit-unit-a' });
  });

  it('403s an admin resetting the developer account password', async () => {
    const { header } = await authHeaderFor('admin');
    const developer = await createTarget({ role: 'developer' });

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send(editPayload(developer, { role: 'admin', password: 'hacked123' }));

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Somente o desenvolvedor pode alterar essa conta.' });
    expect(await loginStatus(developer.email, 'hacked123')).toBe(401);
    expect((await prisma.user.findUnique({ where: { id: developer.id } })).role).toBe('developer');
  });

  it('lets an admin edit another admin', async () => {
    const { header } = await authHeaderFor('admin');
    const target = await createTarget({ role: 'admin' });

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send(editPayload(target, { full_name: 'Gestor Renomeado' }));

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ id: target.id, full_name: 'Gestor Renomeado', role: 'admin' });
  });

  it('lets the developer reset any account password', async () => {
    const { header } = await authHeaderFor('developer');
    const target = await createTarget({ role: 'admin' });

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send(editPayload(target, { password: 'redefinida1' }));

    expect(response.status).toBe(201);
    expect(await loginStatus(target.email, 'redefinida1')).toBe(200);
  });
});

describe('POST /api/admin/users — the developer role does not come from the e-mail', () => {
  const DEVELOPER_EMAIL = 'alo.de.castro@hotmail.com';
  // Renomeia em vez de apagar: a conta pode ter sessões (auth_sessions) apontando para ela.
  const releaseDeveloperEmail = () => prisma.user.updateMany({
    where: { email: DEVELOPER_EMAIL }, data: { email: uniqueEmail('former-developer') },
  });

  it('keeps an admin who takes a case variant of the developer e-mail as admin', async () => {
    await releaseDeveloperEmail();
    const { header, user } = await authHeaderFor('admin');

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send({ id: user.id, email: 'ALO.DE.CASTRO@HOTMAIL.COM', full_name: user.full_name, role: 'admin' });
    const me = await request(app).get('/api/auth/me').set('Authorization', header);

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(DEVELOPER_EMAIL);
    expect(me.body.user.role).toBe('admin');
    await releaseDeveloperEmail();
  });

  it('409s a case variant of an e-mail that is already registered', async () => {
    const existingEmail = uniqueEmail('taken');
    await createTestUser({ email: existingEmail, full_name: 'Dono', role: 'user' });
    const { header } = await authHeaderFor('developer');

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send({ email: existingEmail.toUpperCase(), full_name: 'Copia', role: 'user' });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Já existe um usuário com esse e-mail.' });
    expect(await prisma.user.count({ where: { email: existingEmail } })).toBe(1);
  });

  it('stores a new account e-mail in lowercase, without surrounding spaces', async () => {
    const { header } = await authHeaderFor('developer');
    const email = uniqueEmail('mixed');

    const response = await request(app).post('/api/admin/users').set('Authorization', header)
      .send({ email: `  ${email.toUpperCase()} `, full_name: 'Caixa Mista', role: 'user' });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(email);
  });
});

describe('security headers', () => {
  const inlineConfig = 'tailwind.config = {}';
  const clientDir = fs.mkdtempSync(path.join(os.tmpdir(), 'labquest-headers-'));
  fs.writeFileSync(path.join(clientDir, 'index.html'), `<html><head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>${inlineConfig}</script>
  </head><body>SPA</body></html>`);
  const inlineConfigHash = `'sha256-${crypto.createHash('sha256').update(inlineConfig).digest('base64')}'`;

  afterAll(() => fs.rmSync(clientDir, { recursive: true, force: true }));

  const cspOf = (response) => Object.fromEntries(
    response.headers['content-security-policy'].split(';').map((directive) => {
      const [name, ...values] = directive.trim().split(/\s+/);
      return [name, values];
    }),
  );

  it('sends the hardening headers on API responses and drops X-Powered-By', async () => {
    const response = await request(createApp({ clientDir })).get('/api/badge-legends');

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(response.headers['cross-origin-opener-policy']).toBe('same-origin');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('allows only the app, the Tailwind CDN and the hashed inline config to run scripts', async () => {
    const csp = cspOf(await request(createApp({ clientDir })).get('/'));

    expect(csp['script-src']).toEqual(["'self'", 'https://cdn.tailwindcss.com', inlineConfigHash]);
    expect(csp['script-src-attr']).toEqual(["'none'"]);
    expect(csp['object-src']).toEqual(["'none'"]);
    expect(csp['frame-ancestors']).toEqual(["'none'"]);
    expect(csp['connect-src']).toEqual(["'self'"]);
    expect(csp['font-src']).toEqual(["'self'", 'https://fonts.gstatic.com', 'data:']);
  });

  it('leaves HSTS and upgrade-insecure-requests out of development, so http://localhost keeps working', async () => {
    const response = await request(createApp({ clientDir, isProduction: false })).get('/');

    expect(response.headers['strict-transport-security']).toBeUndefined();
    expect(cspOf(response)).not.toHaveProperty('upgrade-insecure-requests');
  });

  it('sends HSTS and upgrade-insecure-requests in production', async () => {
    const response = await request(createApp({ clientDir, isProduction: true })).get('/');

    expect(response.headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains');
    expect(cspOf(response)).toHaveProperty('upgrade-insecure-requests');
  });
});

describe('POST /api/submissions/:id/review — integridade da revisão', () => {
  const submitAs = async (applicant) => {
    const response = await request(app).post('/api/submissions').set('Authorization', applicant.header)
      .send({ badge_id: '1', description: 'Evidência' });
    expect(response.status).toBe(201);
    return response.body.id;
  };
  const review = (reviewer, id, status = 'approved') =>
    request(app).post(`/api/submissions/${id}/review`).set('Authorization', reviewer.header).send({ status });
  const awardsOf = (userId) => prisma.userBadge.count({ where: { user_id: userId, badge_id: '1' } });

  it('um supervisor não aprova a própria solicitação', async () => {
    const supervisor = await authHeaderFor('supervisor', { productive_unit_id: 'pu-self-review' });
    const id = await submitAs(supervisor);

    const response = await review(supervisor, id);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Você não pode revisar a própria solicitação.' });
    expect((await prisma.badgeSubmission.findUnique({ where: { id } })).status).toBe('pending');
    expect(await awardsOf(supervisor.user.id)).toBe(0);
  });

  it('nem o developer revisa a própria solicitação', async () => {
    const developer = await authHeaderFor('developer');
    const id = await submitAs(developer);

    const response = await review(developer, id);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Você não pode revisar a própria solicitação.' });
  });

  it('uma solicitação aprovada não é aprovada de novo, e o selo não é recriado', async () => {
    const applicant = await authHeaderFor('user');
    const developer = await authHeaderFor('developer');
    const id = await submitAs(applicant);
    expect((await review(developer, id)).status).toBe(200);

    const again = await review(developer, id);

    expect(again.status).toBe(409);
    expect(again.body).toEqual({ error: 'Esta solicitação já foi revisada.' });
    expect(await awardsOf(applicant.user.id)).toBe(1);
  });

  it('uma solicitação aprovada não pode ser rejeitada depois', async () => {
    const applicant = await authHeaderFor('user');
    const developer = await authHeaderFor('developer');
    const id = await submitAs(applicant);
    expect((await review(developer, id)).status).toBe(200);

    const reject = await review(developer, id, 'rejected');

    expect(reject.status).toBe(409);
    expect((await prisma.badgeSubmission.findUnique({ where: { id } })).status).toBe('approved');
  });

  it('responde 404 para uma solicitação que não existe', async () => {
    const developer = await authHeaderFor('developer');

    const response = await review(developer, crypto.randomUUID());

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Solicitação não encontrada.' });
  });

  it('com duas aprovações simultâneas, só uma vence e existe um único selo', async () => {
    const applicant = await authHeaderFor('user');
    const developer = await authHeaderFor('developer');
    const id = await submitAs(applicant);

    const responses = await Promise.all([review(developer, id), review(developer, id)]);

    expect(responses.filter((r) => r.status === 200)).toHaveLength(1);
    expect(await awardsOf(applicant.user.id)).toBe(1);
  });
});
