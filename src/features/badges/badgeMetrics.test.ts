import { describe, expect, it } from 'vitest';
import type { Profile, UserBadge } from '@/shared/types';
import { canSeeAwardDetails, findMonthlyAward } from './badgeMetrics';

const profile = (overrides: Partial<Profile>): Profile => ({
  id: 'viewer',
  email: 'viewer@example.com',
  full_name: 'Viewer',
  role: 'user',
  ...overrides,
} as Profile);

describe('canSeeAwardDetails', () => {
  const target = profile({ id: 'target', productive_unit_id: 'pu-a' });

  it('lets a plain user see a colleague from the same unit', () => {
    expect(canSeeAwardDetails(profile({ productive_unit_id: 'pu-a' }), target)).toBe(true);
  });

  it('hides a user from another unit from a plain user', () => {
    expect(canSeeAwardDetails(profile({ productive_unit_id: 'pu-b' }), target)).toBe(false);
  });

  it('lets a plain user without a unit see only themselves', () => {
    const viewer = profile({ productive_unit_id: undefined });

    expect(canSeeAwardDetails(viewer, target)).toBe(false);
    expect(canSeeAwardDetails(viewer, viewer)).toBe(true);
  });

  it('hides another unit from a supervisor with a unit', () => {
    expect(canSeeAwardDetails(profile({ role: 'supervisor', productive_unit_id: 'pu-b' }), target)).toBe(false);
  });

  it('lets a supervisor without a unit see everyone', () => {
    expect(canSeeAwardDetails(profile({ role: 'supervisor', productive_unit_id: undefined }), target)).toBe(true);
  });

  it('lets an admin from another unit see everyone', () => {
    expect(canSeeAwardDetails(profile({ role: 'admin', productive_unit_id: 'pu-b' }), target)).toBe(true);
  });
});

describe('findMonthlyAward', () => {
  const reference = new Date('2026-11-20T12:00:00.000Z');
  const award = (id: string, awardedAt: string, overrides: Partial<UserBadge> = {}): UserBadge => ({
    id, user_id: 'u1', badge_id: 'b1', awarded_at: awardedAt, tone: 'bronze', ...overrides,
  });

  it('returns the award of the reference month, skipping older months of the same badge', () => {
    const userBadges = [award('october', '2026-10-15T00:00:00.000Z'), award('november', '2026-11-02T00:00:00.000Z', { tone: 'gold' })];

    expect(findMonthlyAward('u1', 'b1', userBadges, reference)).toEqual(userBadges[1]);
  });

  it('returns undefined when the badge was only awarded in other months', () => {
    expect(findMonthlyAward('u1', 'b1', [award('october', '2026-10-31T23:59:59.000Z')], reference)).toBeUndefined();
  });

  it('ignores other users and other badges', () => {
    const userBadges = [award('other-user', '2026-11-02T00:00:00.000Z', { user_id: 'u2' }), award('other-badge', '2026-11-02T00:00:00.000Z', { badge_id: 'b2' })];

    expect(findMonthlyAward('u1', 'b1', userBadges, reference)).toBeUndefined();
  });
});
