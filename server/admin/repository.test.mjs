// @vitest-environment node
import { beforeAll, describe, expect, it, vi } from 'vitest';
import crypto from 'node:crypto';
import {
  saveBadge,
  deleteBadge,
  saveProductiveUnit,
  updateUserProfile,
  saveUser,
  deleteUser,
  bulkInviteUsers,
} from './repository.mjs';
import { findUserByEmail } from '../auth/repository.mjs';
import { prisma } from '../shared/db/prisma.mjs';
import { resetDatabase } from '../test/db.mjs';

beforeAll(async () => {
  await resetDatabase();
  await prisma.productiveUnit.create({ data: { id: 'pu1', name: 'Fábrica Campinas' } });
});

vi.mock('../uploads/uploadService.mjs', () => ({
  deleteUploadedFile: vi.fn().mockResolvedValue(undefined),
}));

describe('saveBadge', () => {
  it('creates a badge with a generated id when none is given', async () => {
    const badge = await saveBadge({ name: 'Novo Selo', description: 'd', category: 'Qualidade', icon_name: '⭐', points: 5 });

    expect(badge.id).toBeTruthy();
    expect(await prisma.badge.findUnique({ where: { id: badge.id } })).toMatchObject({ name: 'Novo Selo', points: 5 });
  });

  it('updates an existing badge in place when the id matches', async () => {
    const created = await saveBadge({ name: 'Original', description: 'd', category: 'Qualidade', icon_name: '⭐', points: 5 });

    const updated = await saveBadge({ ...created, name: 'Atualizado', points: 10 });

    expect(updated.id).toBe(created.id);
    expect(await prisma.badge.count({ where: { id: created.id } })).toBe(1);
    expect((await prisma.badge.findUnique({ where: { id: created.id } })).name).toBe('Atualizado');
  });
});

describe('deleteBadge', () => {
  it('removes the badge from the store', async () => {
    const badge = await saveBadge({ name: 'Para Remover', description: 'd', category: 'Qualidade', icon_name: '⭐', points: 0 });

    const result = await deleteBadge(badge.id);

    expect(result).toEqual({ success: true });
    expect(await prisma.badge.findUnique({ where: { id: badge.id } })).toBeNull();
  });
});

describe('saveProductiveUnit', () => {
  it('creates a productive unit with a generated id', async () => {
    const unit = await saveProductiveUnit({ name: 'Unidade Teste' });
    expect(unit.id).toBeTruthy();
    expect(await prisma.productiveUnit.findUnique({ where: { id: unit.id } })).toMatchObject({ name: 'Unidade Teste' });
  });
});

describe('updateUserProfile', () => {
  it('throws when the user does not exist', async () => {
    await expect(updateUserProfile(crypto.randomUUID(), { full_name: 'X' }))
      .rejects.toThrow('Usuário não encontrado.');
  });

  it('applies partial updates to an existing user', async () => {
    const user = await saveUser({ email: `u-${crypto.randomUUID()}@test.com`, full_name: 'Antes', role: 'user' }, 'senha123');

    const updated = await updateUserProfile(user.id, { full_name: 'Depois' });

    expect(updated.full_name).toBe('Depois');
    expect(updated.email).toBe(user.email);
  });
});

describe('saveUser', () => {
  it('creates a new user with a hashed password', async () => {
    const email = `u-${crypto.randomUUID()}@test.com`;
    const user = await saveUser({ email, full_name: 'Novo Usuário', role: 'user' }, 'senha123');

    expect(user.email).toBe(email);
    expect(user.full_name).toBe('Novo Usuário');
    const stored = await findUserByEmail(email);
    expect(stored.id).toBe(user.id);
  });
});

describe('deleteUser', () => {
  it('removes the user from the store', async () => {
    const email = `u-${crypto.randomUUID()}@test.com`;
    const user = await saveUser({ email, full_name: 'Para Remover', role: 'user' }, 'senha123');

    const result = await deleteUser(user.id);

    expect(result).toEqual({ success: true });
    expect(await findUserByEmail(email)).toBeNull();
  });
});

describe('bulkInviteUsers', () => {
  it('creates users for new emails and skips already-registered ones', async () => {
    const existingEmail = `existing-${crypto.randomUUID()}@test.com`;
    await saveUser({ email: existingEmail, full_name: 'Já Existe', role: 'user' }, 'senha123');
    const newEmail = `new-${crypto.randomUUID()}@test.com`;

    const result = await bulkInviteUsers({ emails: [existingEmail, newEmail], productiveUnitId: 'pu1' });

    expect(result.skippedEmails).toEqual([existingEmail]);
    expect(result.createdUsers).toHaveLength(1);
    expect(result.createdUsers[0].email).toBe(newEmail);
  });

  it('deduplicates repeated emails in the input list', async () => {
    const email = `dup-${crypto.randomUUID()}@test.com`;

    const result = await bulkInviteUsers({ emails: [email, email.toUpperCase()], productiveUnitId: undefined });

    expect(result.createdUsers).toHaveLength(1);
  });
});
