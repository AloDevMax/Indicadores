import crypto from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../shared/db/prisma.mjs';
import { resetDatabase } from '../test/db.mjs';
import {
  awardBadges,
  createSubmission,
  findSubmissionOwnerUnit,
  importMonthlyBadges,
  removeUserBadge,
  reviewSubmission,
} from './repository.mjs';

const ADMIN_ID = '00000000-0000-4000-8000-00000000ad01';
const ANA_ID = '00000000-0000-4000-8000-0000000000a1';
const BIA_ID = '00000000-0000-4000-8000-0000000000b1';
const UUID = /^[0-9a-f-]{36}$/;

const iso = (date) => date.toISOString();
const id4 = (index) => `00000000-0000-4000-9000-${String(index).padStart(12, '0')}`;
const userBadgesOf = (userId) => prisma.userBadge.findMany({ where: { user_id: userId }, orderBy: { awarded_at: 'asc' } });

beforeEach(async () => {
  await resetDatabase();
  await prisma.productiveUnit.create({ data: { id: 'pu1', name: 'Unidade 1' } });
  await prisma.user.createMany({
    data: [
      { id: ADMIN_ID, email: 'admin@example.com', password_hash: 'h', full_name: 'Admin', role: 'admin' },
      { id: ANA_ID, email: 'ana@example.com', password_hash: 'h', full_name: 'Ana', role: 'user', productive_unit_id: 'pu1' },
      { id: BIA_ID, email: 'bia@example.com', password_hash: 'h', full_name: 'Bia', role: 'user' },
    ],
  });
  await prisma.badge.createMany({
    data: [
      { id: 'b1', name: 'Agilidade', description: 'd', category: 'Qualidade', icon_name: '⭐' },
      { id: 'b2', name: 'Zelo', description: 'd', category: 'Qualidade', icon_name: '⭐' },
    ],
  });
});

describe('createSubmission', () => {
  it('creates a pending submission and returns it with the user name, omitting empty fields', async () => {
    const submission = await createSubmission({ userId: ANA_ID, badgeId: 'b1', description: 'evidência' });

    expect(submission).toEqual({
      id: expect.stringMatching(UUID),
      user_id: ANA_ID,
      badge_id: 'b1',
      proof_url: undefined,
      description: 'evidência',
      status: 'pending',
      submitted_at: expect.any(Date),
      reviewed_by: undefined,
      reviewed_at: undefined,
      feedback: undefined,
      user_name: 'Ana',
      badge_name: undefined,
    });
    expect(await prisma.badgeSubmission.findUnique({ where: { id: submission.id } }))
      .toMatchObject({ status: 'pending', proof_url: null, description: 'evidência' });
  });

  it('stores the proof url', async () => {
    const submission = await createSubmission({ userId: ANA_ID, badgeId: 'b1', description: 'x', proofUrl: '/uploads/p.pdf' });

    expect(submission.proof_url).toBe('/uploads/p.pdf');
  });

  it('throws for an unknown user', async () => {
    await expect(createSubmission({ userId: crypto.randomUUID(), badgeId: 'b1', description: 'x' }))
      .rejects.toThrow('Usuário não encontrado.');
  });
});

describe('reviewSubmission', () => {
  it('approves, replaces any previous award of that badge with a bronze one and returns both', async () => {
    await prisma.userBadge.create({
      data: { user_id: ANA_ID, badge_id: 'b1', tone: 'gold', awarded_at: new Date('2023-01-01T00:00:00.000Z') },
    });
    const { id } = await createSubmission({ userId: ANA_ID, badgeId: 'b1', description: 'evidência' });

    const result = await reviewSubmission({ submissionId: id, reviewerId: ADMIN_ID, status: 'approved' });

    expect(result.submission).toEqual({
      id,
      user_id: ANA_ID,
      badge_id: 'b1',
      proof_url: undefined,
      description: 'evidência',
      status: 'approved',
      submitted_at: expect.any(Date),
      reviewed_by: ADMIN_ID,
      reviewed_at: expect.any(Date),
      feedback: undefined,
      user_name: 'Ana',
      badge_name: undefined,
    });
    expect(result.awardedBadge).toEqual({
      id: expect.stringMatching(UUID),
      user_id: ANA_ID,
      badge_id: 'b1',
      awarded_at: expect.any(Date),
      created_at: result.awardedBadge.awarded_at,
      awarded_by: ADMIN_ID,
      tone: 'bronze',
      productive_unit_id: 'pu1',
    });
    const stored = await userBadgesOf(ANA_ID);
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ id: result.awardedBadge.id, tone: 'bronze', awarded_by: ADMIN_ID });
  });

  it('rejects without touching awarded badges', async () => {
    const { id } = await createSubmission({ userId: BIA_ID, badgeId: 'b1', description: 'x' });

    const result = await reviewSubmission({ submissionId: id, reviewerId: ADMIN_ID, status: 'rejected' });

    expect(result.submission).toMatchObject({ status: 'rejected', reviewed_by: ADMIN_ID, user_name: 'Bia' });
    expect(result.awardedBadge).toBeNull();
    expect(await prisma.userBadge.count()).toBe(0);
  });

  it('throws for an unknown submission', async () => {
    await expect(reviewSubmission({ submissionId: crypto.randomUUID(), reviewerId: ADMIN_ID, status: 'approved' }))
      .rejects.toThrow('Solicitação não encontrada.');
  });

  it('refuses reviewers without permission', async () => {
    await expect(reviewSubmission({ submissionId: crypto.randomUUID(), reviewerId: ANA_ID, status: 'approved' }))
      .rejects.toThrow('Apenas administradores e supervisores podem revisar solicitações.');
  });
});

describe('awardBadges', () => {
  it('replaces previous awards, returns the award payloads and notifies each user', async () => {
    await prisma.userBadge.create({ data: { user_id: ANA_ID, badge_id: 'b2', tone: 'bronze' } });

    const results = await awardBadges({ reviewerId: ADMIN_ID, userIds: [ANA_ID, BIA_ID], badgeId: 'b2', tone: 'gold' });

    expect(results).toEqual([
      {
        id: expect.stringMatching(UUID),
        user_id: ANA_ID,
        badge_id: 'b2',
        awarded_at: expect.any(Date),
        created_at: results[0].awarded_at,
        awarded_by: ADMIN_ID,
        tone: 'gold',
        productive_unit_id: 'pu1',
      },
      expect.objectContaining({ user_id: BIA_ID, tone: 'gold', productive_unit_id: null }),
    ]);
    expect(await userBadgesOf(ANA_ID)).toEqual([expect.objectContaining({ id: results[0].id, tone: 'gold' })]);

    const notifications = await prisma.notification.findMany({ orderBy: { user_id: 'asc' } });
    expect(notifications).toEqual([
      {
        id: expect.stringMatching(UUID),
        user_id: ANA_ID,
        title: 'Selo concedido',
        message: 'Parabens Ana, voce recebeu o selo Zelo com marcacao Ouro.',
        sent_at: expect.any(Date),
        read: false,
      },
      expect.objectContaining({ user_id: BIA_ID, message: 'Parabens Bia, voce recebeu o selo Zelo com marcacao Ouro.' }),
    ]);
  });

  it('writes nothing when one of the users does not exist', async () => {
    await expect(awardBadges({ reviewerId: ADMIN_ID, userIds: [ANA_ID, crypto.randomUUID()], badgeId: 'b1', tone: 'silver' }))
      .rejects.toThrow();

    expect(await prisma.userBadge.count()).toBe(0);
    expect(await prisma.notification.count()).toBe(0);
  });
});

describe('removeUserBadge', () => {
  it('removes every award of that badge for the user, and only that', async () => {
    await prisma.userBadge.createMany({
      data: [
        { user_id: ANA_ID, badge_id: 'b1', tone: 'bronze' },
        { user_id: ANA_ID, badge_id: 'b1', tone: 'gold' },
        { user_id: ANA_ID, badge_id: 'b2', tone: 'gold' },
        { user_id: BIA_ID, badge_id: 'b1', tone: 'gold' },
      ],
    });

    expect(await removeUserBadge({ reviewerId: ADMIN_ID, userId: ANA_ID, badgeId: 'b1' })).toEqual({ success: true });

    expect((await userBadgesOf(ANA_ID)).map((entry) => entry.badge_id)).toEqual(['b2']);
    expect(await prisma.userBadge.count({ where: { user_id: BIA_ID } })).toBe(1);
  });
});

describe('importMonthlyBadges', () => {
  it('replaces that month awards, dated on the first day of the month, keeping other months', async () => {
    await prisma.userBadge.createMany({
      data: [
        { user_id: ANA_ID, badge_id: 'b1', tone: 'bronze', awarded_at: new Date('2026-03-20T15:00:00.000Z') },
        { user_id: ANA_ID, badge_id: 'b1', tone: 'silver', awarded_at: new Date('2026-02-10T00:00:00.000Z') },
      ],
    });

    const result = await importMonthlyBadges({
      reviewerId: ADMIN_ID,
      awards: [
        { userId: ANA_ID, badgeId: 'b1', tone: 'silver' },
        { userId: BIA_ID, badgeId: 'b2', tone: 'loss_1' },
        { userId: ANA_ID, badgeId: 'b1', tone: 'gold' },
      ],
      month: 3,
      year: 2026,
    });

    expect(result).toEqual({
      awardedCount: 2,
      awardedBadges: [
        { id: expect.stringMatching(UUID), user_id: ANA_ID, badge_id: 'b1', awarded_at: expect.any(Date), awarded_by: ADMIN_ID, tone: 'gold' },
        { id: expect.stringMatching(UUID), user_id: BIA_ID, badge_id: 'b2', awarded_at: expect.any(Date), awarded_by: ADMIN_ID, tone: 'loss_1' },
      ],
    });
    expect(iso(result.awardedBadges[0].awarded_at)).toBe('2026-03-01T00:00:00.000Z');
    expect((await userBadgesOf(ANA_ID)).map((entry) => [iso(entry.awarded_at), entry.tone])).toEqual([
      ['2026-02-10T00:00:00.000Z', 'silver'],
      ['2026-03-01T00:00:00.000Z', 'gold'],
    ]);
  });

  it('imports a full spreadsheet (300 users x 13 badges) in one go', async () => {
    const userIds = Array.from({ length: 300 }, (_, index) => id4(index));
    const badgeIds = Array.from({ length: 13 }, (_, index) => `ind-${index}`);
    await prisma.user.createMany({
      data: userIds.map((userId, index) => ({
        id: userId, email: `bulk${index}@example.com`, password_hash: 'h', full_name: `Bulk ${index}`, role: 'user',
      })),
    });
    await prisma.badge.createMany({
      data: badgeIds.map((badgeId) => ({ id: badgeId, name: badgeId, description: 'd', category: 'Qualidade', icon_name: '⭐' })),
    });
    const awards = userIds.flatMap((userId) => badgeIds.map((badgeId) => ({ userId, badgeId, tone: 'gold' })));

    const result = await importMonthlyBadges({ reviewerId: ADMIN_ID, awards, month: 3, year: 2026 });

    expect(result.awardedCount).toBe(3900);
    expect(result.awardedBadges[0]).toMatchObject({ user_id: userIds[0], badge_id: 'ind-0', tone: 'gold' });
    expect(result.awardedBadges[3899]).toMatchObject({ user_id: userIds[299], badge_id: 'ind-12' });
    expect(await prisma.userBadge.count()).toBe(3900);
  }, 30_000);

  it('returns an empty result for an empty batch', async () => {
    expect(await importMonthlyBadges({ reviewerId: ADMIN_ID, awards: [], month: 3, year: 2026 }))
      .toEqual({ awardedCount: 0, awardedBadges: [] });
  });

  it('accepts month and year as strings', async () => {
    const result = await importMonthlyBadges({
      reviewerId: ADMIN_ID, awards: [{ userId: ANA_ID, badgeId: 'b1', tone: 'gold' }], month: '12', year: '2025',
    });

    expect(iso(result.awardedBadges[0].awarded_at)).toBe('2025-12-01T00:00:00.000Z');
  });

  it('writes nothing when one of the users does not exist', async () => {
    await expect(importMonthlyBadges({
      reviewerId: ADMIN_ID,
      awards: [{ userId: ANA_ID, badgeId: 'b1', tone: 'gold' }, { userId: crypto.randomUUID(), badgeId: 'b1', tone: 'gold' }],
      month: 3,
      year: 2026,
    })).rejects.toThrow();

    expect(await prisma.userBadge.count()).toBe(0);
  });
});

describe('findSubmissionOwnerUnit', () => {
  it("returns the submission owner's productive unit", async () => {
    const { id } = await createSubmission({ userId: ANA_ID, badgeId: 'b1', description: 'x' });

    expect(await findSubmissionOwnerUnit(id)).toEqual({ productive_unit_id: 'pu1' });
  });

  it('returns a null unit when the owner has none', async () => {
    const { id } = await createSubmission({ userId: BIA_ID, badgeId: 'b1', description: 'x' });

    expect(await findSubmissionOwnerUnit(id)).toEqual({ productive_unit_id: null });
  });

  it('returns null for an unknown submission', async () => {
    expect(await findSubmissionOwnerUnit(crypto.randomUUID())).toBeNull();
  });
});
