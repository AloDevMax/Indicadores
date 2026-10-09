import { describe, expect, it } from 'vitest';
import type { Profile } from '@/shared/types';
import { canSeeAwardDetails } from './badgeMetrics';

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

  it.each(['admin', 'developer'] as const)('lets a %s see everyone', (role) => {
    expect(canSeeAwardDetails(profile({ role, productive_unit_id: 'pu-b' }), target)).toBe(true);
  });
});
