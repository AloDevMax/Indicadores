import crypto from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../shared/db/prisma.mjs';
import { resetDatabase } from '../test/db.mjs';
import {
  awardBadges,
  createSubmission,
  importMonthlyBadges,
  persistImportRun,
  removeUserBadge,
  reviewSubmission,
} from './repository.mjs';

const ADMIN_ID = '00000000-0000-4000-8000-00000000ad01';
const ANA_ID = '00000000-0000-4000-8000-0000000000a1';
const BIA_ID = '00000000-0000-4000-8000-0000000000b1';
const UUID = /^[0-9a-f-]{36}$/;

const iso = (date) => date.toISOString();
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

describe('persistImportRun', () => {
  const SOURCE = { id: 'src-1', name: 'Planilha X', productive_unit_column: 'u', user_column: 'c', badge_column: 's' };

  it('records a run with no rows', async () => {
    await prisma.importSource.create({ data: SOURCE });

    const result = await persistImportRun({
      reviewerId: ADMIN_ID, sourceId: 'src-1', sourceName: 'Planilha X', matchedColumns: { user: 'Nome' }, rows: [],
    });

    expect(result).toEqual({
      importRun: {
        id: expect.stringMatching(UUID),
        source_id: 'src-1',
        source_name: 'Planilha X',
        imported_by: ADMIN_ID,
        imported_at: expect.any(Date),
        status: 'completed',
        matched_columns: { user: 'Nome' },
        summary: { total: 0, valid: 0, invalid: 0 },
      },
      awardedBadges: [],
      summary: { total: 0, valid: 0, invalid: 0 },
    });
  });

  it('records every row and awards valid rows, replacing this month award', async () => {
    await prisma.importSource.create({ data: SOURCE });
    await prisma.userBadge.create({ data: { user_id: ANA_ID, badge_id: 'b1', tone: 'bronze' } });

    const result = await persistImportRun({
      reviewerId: ADMIN_ID,
      sourceId: 'src-1',
      sourceName: 'Planilha X',
      matchedColumns: { user: 'Nome' },
      rows: [
        { row: { Nome: 'Ana' }, user_id: ANA_ID, badge_id: 'b1', tone: 'gold', status: 'valid' },
        { row: { Nome: 'Ninguém' }, status: 'invalid', reason: 'Usuário não encontrado' },
      ],
    });

    expect(result.summary).toEqual({ total: 2, valid: 1, invalid: 1 });
    expect(result.awardedBadges).toEqual([
      expect.objectContaining({ user_id: ANA_ID, badge_id: 'b1', tone: 'gold', awarded_by: ADMIN_ID, productive_unit_id: 'pu1' }),
    ]);
    expect(await userBadgesOf(ANA_ID)).toEqual([expect.objectContaining({ id: result.awardedBadges[0].id, tone: 'gold' })]);

    const rows = await prisma.importRunRow.findMany({ orderBy: { row_number: 'asc' } });
    expect(rows).toEqual([
      {
        id: expect.stringMatching(UUID),
        import_run_id: result.importRun.id,
        row_number: 1,
        raw_payload: { Nome: 'Ana' },
        normalized_payload: { user_id: ANA_ID, badge_id: 'b1', tone: 'gold' },
        status: 'imported',
        reason: null,
      },
      {
        id: expect.stringMatching(UUID),
        import_run_id: result.importRun.id,
        row_number: 2,
        raw_payload: { Nome: 'Ninguém' },
        normalized_payload: { user_id: null, badge_id: null, tone: null },
        status: 'invalid',
        reason: 'Usuário não encontrado',
      },
    ]);
  });

  it('writes nothing when a valid row points to a missing badge', async () => {
    await prisma.importSource.create({ data: SOURCE });

    await expect(persistImportRun({
      reviewerId: ADMIN_ID,
      sourceId: 'src-1',
      sourceName: 'Planilha X',
      matchedColumns: {},
      rows: [{ row: {}, user_id: ANA_ID, badge_id: 'nao-existe', tone: 'gold', status: 'valid' }],
    })).rejects.toThrow();

    expect(await prisma.importRun.count()).toBe(0);
    expect(await prisma.importRunRow.count()).toBe(0);
    expect(await prisma.userBadge.count()).toBe(0);
  });
});
