// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import {
  createSubmission,
  reviewSubmission,
  awardBadges,
  removeUserBadge,
  importMonthlyBadges,
} from './repository.mjs';
import { saveBadge } from '../admin/repository.mjs';
import { resetDatabase } from '../test/db.mjs';
import { createTestUser } from '../test/fixtures.mjs';

beforeAll(async () => {
  await resetDatabase();
});

const makeUser = async (overrides = {}) => createTestUser({
  id: crypto.randomUUID(),
  email: `user-${crypto.randomUUID()}@example.com`,
  full_name: 'Test User',
  role: 'user',
  ...overrides,
});

// Badge names are unique in the database.
const makeBadge = async () => saveBadge({
  name: `Test Badge ${crypto.randomUUID()}`,
  description: 'desc',
  category: 'Qualidade',
  icon_name: '⭐',
  points: 10,
});

describe('createSubmission', () => {
  it('throws when the user does not exist', async () => {
    await expect(createSubmission({ userId: crypto.randomUUID(), badgeId: 'b1', description: 'x' }))
      .rejects.toThrow('Usuário não encontrado.');
  });

  it('creates a pending submission for an existing user', async () => {
    const user = await makeUser();
    const badge = await makeBadge();

    const submission = await createSubmission({ userId: user.id, badgeId: badge.id, description: 'evidence' });

    expect(submission.status).toBe('pending');
    expect(submission.user_id).toBe(user.id);
    expect(submission.badge_id).toBe(badge.id);
    expect(submission.user_name).toBe(user.full_name);
  });
});

describe('reviewSubmission', () => {
  it('throws when the reviewer lacks permission', async () => {
    const requester = await makeUser({ role: 'user' });
    await expect(reviewSubmission({ submissionId: 'sub1', reviewerId: requester.id, status: 'approved' }))
      .rejects.toThrow('Apenas administradores e supervisores podem revisar solicitações.');
  });

  it('throws when the submission does not exist', async () => {
    const reviewer = await makeUser({ role: 'admin' });
    await expect(reviewSubmission({ submissionId: crypto.randomUUID(), reviewerId: reviewer.id, status: 'approved' }))
      .rejects.toThrow('Solicitação não encontrada.');
  });

  it('approves a submission and awards the badge', async () => {
    const applicant = await makeUser();
    const reviewer = await makeUser({ role: 'admin' });
    const badge = await makeBadge();
    const submission = await createSubmission({ userId: applicant.id, badgeId: badge.id, description: 'evidence' });

    const result = await reviewSubmission({ submissionId: submission.id, reviewerId: reviewer.id, status: 'approved' });

    expect(result.submission.status).toBe('approved');
    expect(result.submission.reviewed_by).toBe(reviewer.id);
    expect(result.awardedBadge).toMatchObject({ user_id: applicant.id, badge_id: badge.id, tone: 'bronze' });
  });

  it('rejects a submission without awarding a badge', async () => {
    const applicant = await makeUser();
    const reviewer = await makeUser({ role: 'admin' });
    const badge = await makeBadge();
    const submission = await createSubmission({ userId: applicant.id, badgeId: badge.id, description: 'evidence' });

    const result = await reviewSubmission({ submissionId: submission.id, reviewerId: reviewer.id, status: 'rejected' });

    expect(result.submission.status).toBe('rejected');
    expect(result.awardedBadge).toBeNull();
  });
});

describe('awardBadges', () => {
  it('throws when the reviewer lacks permission', async () => {
    const requester = await makeUser({ role: 'user' });
    await expect(awardBadges({ reviewerId: requester.id, userIds: ['u1'], badgeId: 'b1', tone: 'gold' }))
      .rejects.toThrow('Apenas administradores e supervisores podem conceder badges.');
  });

  it('awards a badge to every listed user', async () => {
    const reviewer = await makeUser({ role: 'admin' });
    const badge = await makeBadge();
    const recipients = await Promise.all([makeUser(), makeUser()]);

    const results = await awardBadges({
      reviewerId: reviewer.id,
      userIds: recipients.map((r) => r.id),
      badgeId: badge.id,
      tone: 'gold',
    });

    expect(results).toHaveLength(2);
    expect(results.map((r) => r.user_id).sort()).toEqual(recipients.map((r) => r.id).sort());
    expect(results.every((r) => r.tone === 'gold')).toBe(true);
  });
});

describe('removeUserBadge', () => {
  it('throws when the reviewer lacks permission', async () => {
    const requester = await makeUser({ role: 'user' });
    await expect(removeUserBadge({ reviewerId: requester.id, userId: 'u1', badgeId: 'b1' }))
      .rejects.toThrow('Apenas administradores e supervisores podem remover badges.');
  });

  it('removes a previously awarded badge', async () => {
    const reviewer = await makeUser({ role: 'admin' });
    const badge = await makeBadge();
    const recipient = await makeUser();
    await awardBadges({ reviewerId: reviewer.id, userIds: [recipient.id], badgeId: badge.id, tone: 'silver' });

    const result = await removeUserBadge({ reviewerId: reviewer.id, userId: recipient.id, badgeId: badge.id });

    expect(result).toEqual({ success: true });
  });
});

describe('importMonthlyBadges', () => {
  it('throws when the reviewer lacks permission', async () => {
    const requester = await makeUser({ role: 'user' });
    await expect(importMonthlyBadges({ reviewerId: requester.id, awards: [], month: 1, year: 2026 }))
      .rejects.toThrow('Apenas administradores e supervisores podem importar badges mensais.');
  });

  it('awards every entry in the batch', async () => {
    const reviewer = await makeUser({ role: 'admin' });
    const badge = await makeBadge();
    const recipient = await makeUser();

    const result = await importMonthlyBadges({
      reviewerId: reviewer.id,
      awards: [{ userId: recipient.id, badgeId: badge.id, tone: 'gold' }],
      month: 3,
      year: 2026,
    });

    expect(result.awardedCount).toBe(1);
  });
});
