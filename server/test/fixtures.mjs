import crypto from 'node:crypto';
import { prisma } from '../shared/db/prisma.mjs';
import { hashPassword } from '../auth/crypto.mjs';
import { publicUser } from '../auth/repository.mjs';
import { seedData } from '../data/seed.mjs';

/**
 * Database counterpart of the old upsertMemoryUser test helper: same input
 * (password or password_hash, optional id) and the same sanitized return
 * shape, but the user is written to the test database.
 */
export const createTestUser = async ({ password, password_hash: passwordHash, ...user }) => {
  const data = {
    id: user.id || crypto.randomUUID(),
    email: user.email,
    password_hash: passwordHash || await hashPassword(password || 'changeme123'),
    full_name: user.full_name,
    avatar_url: user.avatar_url ?? null,
    role: user.role,
    productive_unit_id: user.productive_unit_id ?? null,
    email_verified: user.email_verified ?? false,
    is_active: user.is_active ?? true,
  };

  const created = await prisma.user.upsert({ where: { id: data.id }, create: data, update: data });
  return publicUser(created);
};

/** The reference data the in-memory store used to start with. */
export const seedReferenceData = async () => {
  await prisma.productiveUnit.createMany({ data: seedData.productiveUnits });
  await prisma.badge.createMany({ data: seedData.badges });
  await prisma.importSource.createMany({
    data: seedData.importSources.map(({ columns, ...source }) => ({
      ...source,
      productive_unit_column: columns.productive_unit,
      user_column: columns.user,
      badge_column: columns.badge,
      tone_column: columns.tone,
      award_column: columns.award,
    })),
  });
};
