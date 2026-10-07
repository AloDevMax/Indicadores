import crypto from 'node:crypto';
import { prisma } from '../shared/db/prisma.mjs';
import { hashPassword } from '../auth/crypto.mjs';
import { publicUser } from '../auth/repository.mjs';
import { DEMO_DATA } from '../db/seed.mjs';

/**
 * Creates (or updates, by id) a user in the test database. Takes a raw
 * password or a password_hash and returns the sanitized public user.
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

/** The reference data the app used to start with (now the seed demo data). */
export const seedReferenceData = async () => {
  await prisma.productiveUnit.createMany({ data: DEMO_DATA.productiveUnits });
  await prisma.badge.createMany({ data: DEMO_DATA.badges });
};
