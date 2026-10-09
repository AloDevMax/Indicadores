import crypto from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../shared/db/prisma.mjs';
import { resetDatabase } from '../test/db.mjs';
import {
  getBadgeLegends,
  listBadges,
  listProductiveUnits,
  listSubmissions,
  listMonthlyRanking,
  listUserBadges,
  listUsers,
} from './resourceRepository.mjs';

const DEFAULT_LEGENDS = {
  bronze: 'Bronze - Boa performance',
  silver: 'Prata - Excelente performance',
  gold: 'Ouro - Desempenho excepcional',
  loss_1: 'Perda 1 - Expectativa não atendida',
  loss_2: 'Perda 2 - Falha grave',
};

const ANA_ID = '00000000-0000-4000-8000-0000000000a1';
const BIA_ID = '00000000-0000-4000-8000-0000000000b1';

const badge = (id, name, overrides = {}) => ({
  id, name, description: `desc ${name}`, category: 'Qualidade', icon_name: '⭐', points: 1, ...overrides,
});

beforeEach(async () => {
  await resetDatabase();
  await prisma.productiveUnit.create({ data: { id: 'pu1', name: 'Unidade 1' } });
  await prisma.user.createMany({
    data: [
      {
        id: BIA_ID, email: 'bia@example.com', password_hash: 'h', full_name: 'Bia', role: 'supervisor',
        productive_unit_id: 'pu1', created_at: new Date('2024-02-01T00:00:00.000Z'),
      },
      {
        id: ANA_ID, email: 'ana@example.com', password_hash: 'h', full_name: 'Ana', role: 'user',
        avatar_url: '/uploads/ana.png', email_verified: true, created_at: new Date('2024-03-01T00:00:00.000Z'),
      },
    ],
  });
  await prisma.badge.createMany({
    data: [badge('b2', 'Zelo', { image_url: '/uploads/z.png' }), badge('b1', 'Agilidade', { points: 7 })],
  });
});

describe('listBadges', () => {
  it('lists badges by name with their public fields', async () => {
    expect(await listBadges()).toEqual([
      { id: 'b1', name: 'Agilidade', description: 'desc Agilidade', category: 'Qualidade', icon_name: '⭐', image_url: null, points: 7 },
      { id: 'b2', name: 'Zelo', description: 'desc Zelo', category: 'Qualidade', icon_name: '⭐', image_url: '/uploads/z.png', points: 1 },
    ]);
  });
});

describe('listUsers', () => {
  it('lists users by full name, without password hashes', async () => {
    const users = await listUsers();

    expect(users).toEqual([
      {
        id: ANA_ID,
        email: 'ana@example.com',
        full_name: 'Ana',
        role: 'user',
        productive_unit_id: null,
        avatar_url: '/uploads/ana.png',
        email_verified: true,
        is_active: true,
        created_at: expect.any(Date),
      },
      expect.objectContaining({ id: BIA_ID, full_name: 'Bia', role: 'supervisor', productive_unit_id: 'pu1' }),
    ]);
    expect(users[0].created_at.toISOString()).toBe('2024-03-01T00:00:00.000Z');
  });
});

describe('listUserBadges', () => {
  it('lists awarded badges newest first', async () => {
    const older = crypto.randomUUID();
    const newer = crypto.randomUUID();
    await prisma.userBadge.createMany({
      data: [
        { id: older, user_id: ANA_ID, badge_id: 'b1', tone: 'bronze', awarded_by: BIA_ID, awarded_at: new Date('2024-04-01T08:00:00.000Z') },
        { id: newer, user_id: BIA_ID, badge_id: 'b2', tone: 'loss_1', awarded_at: new Date('2024-05-01T08:00:00.000Z') },
      ],
    });

    const userBadges = await listUserBadges();

    expect(userBadges).toEqual([
      { id: newer, user_id: BIA_ID, badge_id: 'b2', tone: 'loss_1', awarded_at: expect.any(Date) },
      { id: older, user_id: ANA_ID, badge_id: 'b1', tone: 'bronze', awarded_at: expect.any(Date) },
    ]);
    expect(userBadges.map((entry) => entry.awarded_at.toISOString()))
      .toEqual(['2024-05-01T08:00:00.000Z', '2024-04-01T08:00:00.000Z']);
  });

  it('returns an empty list when nothing was awarded', async () => {
    expect(await listUserBadges()).toEqual([]);
  });
});

describe('listMonthlyRanking', () => {
  it('sums each user\'s awards in the UTC month into score, counts and per-category scores', async () => {
    await prisma.badge.update({ where: { id: 'b2' }, data: { category: 'Segurança' } });
    await prisma.userBadge.createMany({
      data: [
        { user_id: ANA_ID, badge_id: 'b1', tone: 'gold', awarded_at: new Date('2024-04-01T00:00:00.000Z') },
        { user_id: ANA_ID, badge_id: 'b2', tone: 'loss_1', awarded_at: new Date('2024-04-30T23:59:59.000Z') },
        { user_id: BIA_ID, badge_id: 'b1', tone: 'bronze', awarded_at: new Date('2024-04-10T00:00:00.000Z') },
        { user_id: BIA_ID, badge_id: 'b1', tone: 'gold', awarded_at: new Date('2024-05-01T00:00:00.000Z') },
      ],
    });

    const ranking = await listMonthlyRanking({ year: 2024, month: 4 });

    expect(ranking).toHaveLength(2);
    expect(ranking).toEqual(expect.arrayContaining([
      { user_id: ANA_ID, monthly_score: 2, positive_count: 1, loss_count: 1, category_scores: { Qualidade: 3, 'Segurança': -1 } },
      { user_id: BIA_ID, monthly_score: 1, positive_count: 1, loss_count: 0, category_scores: { Qualidade: 1 } },
    ]));
  });

  it('returns an empty list for a month without awards', async () => {
    expect(await listMonthlyRanking({ year: 2024, month: 4 })).toEqual([]);
  });
});

describe('listSubmissions', () => {
  it('lists submissions newest first with the badge and submitter names', async () => {
    const older = crypto.randomUUID();
    const newer = crypto.randomUUID();
    await prisma.badgeSubmission.createMany({
      data: [
        { id: older, user_id: ANA_ID, badge_id: 'b1', description: 'evidência', proof_url: '/uploads/p.pdf', submitted_at: new Date('2024-04-01T00:00:00.000Z') },
        { id: newer, user_id: BIA_ID, badge_id: 'b2', status: 'approved', submitted_at: new Date('2024-06-01T00:00:00.000Z') },
      ],
    });

    const submissions = await listSubmissions();

    expect(submissions).toEqual([
      {
        id: newer, user_id: BIA_ID, user_name: 'Bia', badge_id: 'b2', badge_name: 'Zelo', description: null, status: 'approved',
        submitted_at: expect.any(Date), proof_url: null,
      },
      {
        id: older, user_id: ANA_ID, user_name: 'Ana', badge_id: 'b1', badge_name: 'Agilidade', description: 'evidência', status: 'pending',
        submitted_at: expect.any(Date), proof_url: '/uploads/p.pdf',
      },
    ]);
    expect(submissions[0].submitted_at.toISOString()).toBe('2024-06-01T00:00:00.000Z');
  });
});

describe('getBadgeLegends', () => {
  it('returns the default legends when none were saved', async () => {
    expect(await getBadgeLegends()).toEqual(DEFAULT_LEGENDS);
  });

  it('returns the most recently updated legends', async () => {
    const legends = (label) => ({ bronze: `${label} b`, silver: `${label} s`, gold: `${label} g`, loss_1: `${label} 1`, loss_2: `${label} 2` });
    await prisma.badgeLegendSetting.createMany({
      data: [
        { ...legends('nova'), updated_at: new Date('2024-06-01T00:00:00.000Z') },
        { ...legends('velha'), updated_at: new Date('2024-01-01T00:00:00.000Z') },
      ],
    });

    expect(await getBadgeLegends()).toEqual(legends('nova'));
  });
});

describe('listProductiveUnits', () => {
  it('lists units by name with id and name only', async () => {
    await prisma.productiveUnit.create({ data: { id: 'pu0', name: 'Alfa' } });

    expect(await listProductiveUnits()).toEqual([{ id: 'pu0', name: 'Alfa' }, { id: 'pu1', name: 'Unidade 1' }]);
  });
});
