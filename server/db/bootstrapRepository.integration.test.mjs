import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../shared/db/prisma.mjs';
import { resetDatabase } from '../test/db.mjs';
import { loadBootstrapData } from './bootstrapRepository.mjs';

const id = (suffix) => `00000000-0000-4000-8000-${suffix.padStart(12, '0')}`;
const at = (value) => new Date(value);

const IDS = {
  admin: id('ad'), supervisor: id('5e'), ana: id('a1'), bia: id('b1'), cid: id('c1'),
  n1: id('101'), n2: id('102'), n3: id('103'), ub1: id('201'), ub2: id('202'), s1: id('301'), s2: id('302'),
};

const UNITS = [{ id: 'pu2', name: 'Beta' }, { id: 'pu1', name: 'Alfa' }];

const BADGES = [
  { id: 'b2', name: 'Zelo', description: 'd2', icon_name: '🎓', category: 'RH', points: 3, image_url: '/uploads/z.png', created_at: at('2024-02-01T00:00:00.000Z') },
  { id: 'b1', name: 'Agilidade', description: 'd1', icon_name: '⭐', category: 'Qualidade', points: 0, image_url: null, created_at: at('2024-01-01T00:00:00.000Z') },
];

const user = (key, overrides) => ({
  id: IDS[key],
  email: `${key}@example.com`,
  full_name: key.toUpperCase(),
  avatar_url: null,
  productive_unit_id: null,
  email_verified: false,
  is_active: true,
  ...overrides,
});

const USERS = [
  user('cid', { role: 'user', is_active: false, created_at: at('2024-01-05T00:00:00.000Z') }),
  user('admin', { role: 'admin', email_verified: true, created_at: at('2024-01-01T00:00:00.000Z') }),
  user('bia', { role: 'user', productive_unit_id: 'pu2', created_at: at('2024-01-04T00:00:00.000Z') }),
  user('supervisor', { role: 'supervisor', productive_unit_id: 'pu1', created_at: at('2024-01-02T00:00:00.000Z') }),
  user('ana', { role: 'user', productive_unit_id: 'pu1', avatar_url: '/uploads/ana.png', created_at: at('2024-01-03T00:00:00.000Z') }),
];

const NOTIFICATIONS = [
  { id: IDS.n1, user_id: IDS.ana, title: 'T1', message: 'M1', sent_at: at('2024-05-01T00:00:00.000Z'), read: true },
  { id: IDS.n2, user_id: IDS.ana, title: 'T2', message: 'M2', sent_at: at('2024-06-01T00:00:00.000Z'), read: false },
  { id: IDS.n3, user_id: IDS.bia, title: 'T3', message: 'M3', sent_at: at('2024-05-15T00:00:00.000Z'), read: false },
];

const USER_BADGES = [
  { id: IDS.ub1, user_id: IDS.ana, badge_id: 'b1', awarded_at: at('2024-03-01T00:00:00.000Z'), awarded_by: IDS.supervisor, tone: 'gold' },
  { id: IDS.ub2, user_id: IDS.bia, badge_id: 'b2', awarded_at: at('2024-04-01T00:00:00.000Z'), awarded_by: null, tone: 'loss_2' },
];

const SUBMISSIONS = [
  {
    id: IDS.s1, user_id: IDS.ana, badge_id: 'b1', proof_url: '/uploads/p.pdf', description: 'evidência', status: 'approved',
    submitted_at: at('2024-03-05T00:00:00.000Z'), reviewed_by: IDS.supervisor, reviewed_at: at('2024-03-06T00:00:00.000Z'), feedback: 'ok',
  },
  {
    id: IDS.s2, user_id: IDS.bia, badge_id: 'b2', proof_url: null, description: null, status: 'pending',
    submitted_at: at('2024-03-07T00:00:00.000Z'), reviewed_by: null, reviewed_at: null, feedback: null,
  },
];

const IMPORT_SOURCES = [
  {
    id: 'src2', name: 'Arquivada', productive_unit_column: 'u', user_column: 'c', badge_column: 's',
    archived_at: at('2024-02-01T00:00:00.000Z'), created_at: at('2024-01-01T00:00:00.000Z'),
  },
  {
    id: 'src1', name: 'Planilha', description: 'desc', productive_unit_column: 'Unidade', user_column: 'Nome',
    badge_column: 'Selo', tone_column: 'Cor', award_column: 'Pontos', created_at: at('2024-01-02T00:00:00.000Z'),
  },
];

const SEED_LEGENDS = {
  bronze: '1 selo no mês',
  silver: '2 selos no mês',
  gold: '3 selos ou mais no mês',
  loss_1: 'perda de 1 selo',
  loss_2: 'perda de 2 selos',
};

// Expected payload pieces, in the order the queries return them.
const byKey = (list) => Object.fromEntries(list.map((entry) => [entry.id, entry]));
const usersById = byKey(USERS);
const badgesById = byKey(BADGES);
const notification = (entry) => ({ id: entry.id, title: entry.title, message: entry.message, sent_at: entry.sent_at, read: entry.read });
const userRow = (key, notifications = []) => ({ ...usersById[IDS[key]], notifications });
const submissionRow = (submission) => ({
  ...submission, user_name: usersById[submission.user_id].full_name, badge_name: badgesById[submission.badge_id].name,
});

const EXPECTED = {
  badges: [BADGES[1], BADGES[0]].map(({ created_at: _createdAt, ...badge }) => badge),
  productiveUnits: [{ id: 'pu1', name: 'Alfa' }, { id: 'pu2', name: 'Beta' }],
  users: {
    admin: userRow('admin'),
    supervisor: userRow('supervisor'),
    ana: userRow('ana', [notification(NOTIFICATIONS[1]), notification(NOTIFICATIONS[0])]),
    bia: userRow('bia', [notification(NOTIFICATIONS[2])]),
    cid: userRow('cid'),
  },
  userBadges: { ub1: USER_BADGES[0], ub2: USER_BADGES[1] },
  submissions: { s1: submissionRow(SUBMISSIONS[0]), s2: submissionRow(SUBMISSIONS[1]) },
  importSources: [{
    id: 'src1', name: 'Planilha', description: 'desc',
    columns: { productive_unit: 'Unidade', user: 'Nome', badge: 'Selo', tone: 'Cor', award: 'Pontos' },
  }],
};

const FULL_PAYLOAD = {
  source: 'database',
  badges: EXPECTED.badges,
  productiveUnits: EXPECTED.productiveUnits,
  badgeLegends: SEED_LEGENDS,
  users: ['admin', 'supervisor', 'ana', 'bia', 'cid'].map((key) => EXPECTED.users[key]),
  userBadges: [EXPECTED.userBadges.ub2, EXPECTED.userBadges.ub1],
  submissions: [EXPECTED.submissions.s2, EXPECTED.submissions.s1],
  importSources: EXPECTED.importSources,
};

const caller = (key) => {
  const entry = usersById[IDS[key]];
  return { id: entry.id, role: entry.role, productive_unit_id: entry.productive_unit_id };
};

beforeEach(async () => {
  await resetDatabase();
  await prisma.productiveUnit.createMany({ data: UNITS });
  await prisma.badge.createMany({ data: BADGES });
  await prisma.user.createMany({ data: USERS.map((entry) => ({ ...entry, password_hash: 'h' })) });
  await prisma.notification.createMany({ data: NOTIFICATIONS });
  await prisma.userBadge.createMany({ data: USER_BADGES });
  await prisma.badgeSubmission.createMany({ data: SUBMISSIONS });
  await prisma.importSource.createMany({ data: IMPORT_SOURCES });
});

describe('loadBootstrapData', () => {
  it('gives an anonymous caller only the public reference data', async () => {
    expect(await loadBootstrapData(null)).toEqual({
      source: 'database',
      badges: EXPECTED.badges,
      productiveUnits: EXPECTED.productiveUnits,
      badgeLegends: SEED_LEGENDS,
      users: [],
      userBadges: [],
      submissions: [],
      importSources: [],
    });
  });

  it('gives a developer everything', async () => {
    expect(await loadBootstrapData({ id: IDS.admin, role: 'developer', productive_unit_id: null })).toEqual(FULL_PAYLOAD);
  });

  it('gives an admin everything', async () => {
    expect(await loadBootstrapData(caller('admin'))).toEqual(FULL_PAYLOAD);
  });

  it('scopes a supervisor to their productive unit', async () => {
    expect(await loadBootstrapData(caller('supervisor'))).toEqual({
      ...FULL_PAYLOAD,
      productiveUnits: [{ id: 'pu1', name: 'Alfa' }],
      users: [EXPECTED.users.supervisor, EXPECTED.users.ana],
      userBadges: [EXPECTED.userBadges.ub1],
      submissions: [EXPECTED.submissions.s1],
    });
  });

  it('gives a supervisor without a unit everything', async () => {
    expect(await loadBootstrapData({ id: IDS.supervisor, role: 'supervisor', productive_unit_id: null })).toEqual(FULL_PAYLOAD);
  });

  it('gives a user their unit colleagues and only their own badges and submissions', async () => {
    expect(await loadBootstrapData(caller('ana'))).toEqual({
      ...FULL_PAYLOAD,
      productiveUnits: [{ id: 'pu1', name: 'Alfa' }],
      users: [EXPECTED.users.supervisor, EXPECTED.users.ana],
      userBadges: [EXPECTED.userBadges.ub1],
      submissions: [EXPECTED.submissions.s1],
      importSources: [],
    });
  });

  it('gives a user without a unit only themselves', async () => {
    expect(await loadBootstrapData(caller('cid'))).toEqual({
      ...FULL_PAYLOAD,
      productiveUnits: [],
      users: [EXPECTED.users.cid],
      userBadges: [],
      submissions: [],
      importSources: [],
    });
  });

  it('uses the most recently saved legends when there are any', async () => {
    const legends = { bronze: 'B', silver: 'S', gold: 'G', loss_1: 'L1', loss_2: 'L2' };
    await prisma.badgeLegendSetting.createMany({
      data: [
        { ...legends, updated_at: at('2024-06-01T00:00:00.000Z') },
        { bronze: 'old', silver: 'old', gold: 'old', loss_1: 'old', loss_2: 'old', updated_at: at('2024-01-01T00:00:00.000Z') },
      ],
    });

    expect((await loadBootstrapData(null)).badgeLegends).toEqual(legends);
  });
});
