import crypto from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../shared/db/prisma.mjs';
import { resetDatabase } from '../test/db.mjs';
import { verifyPassword } from '../auth/crypto.mjs';
import { deleteUploadedFile } from '../uploads/uploadService.mjs';
import {
  bulkInviteUsers,
  deleteBadge,
  saveBadge,
  saveProductiveUnit,
  saveUser,
  seedIndicatorBadges,
  updateUserProfile,
} from './repository.mjs';

vi.mock('../uploads/uploadService.mjs', () => ({
  deleteUploadedFile: vi.fn().mockResolvedValue(undefined),
}));

const SHORT_ID = /^[0-9a-f]{8}$/;
const UUID = /^[0-9a-f-]{36}$/;

const BADGE_INPUT = { name: 'Selo A', description: 'desc A', category: 'Qualidade', icon_name: '⭐', points: 5 };

const insertUser = (overrides = {}) => prisma.user.create({
  data: {
    id: crypto.randomUUID(),
    email: 'ana@example.com',
    password_hash: 'hash-ana',
    full_name: 'Ana Souza',
    role: 'user',
    created_at: new Date('2024-01-01T10:00:00.000Z'),
    ...overrides,
  },
});

beforeEach(async () => {
  await resetDatabase();
  vi.mocked(deleteUploadedFile).mockClear();
  await prisma.productiveUnit.createMany({ data: [{ id: 'pu1', name: 'Unidade 1' }, { id: 'pu2', name: 'Unidade 2' }] });
});

describe('saveBadge', () => {
  it('creates a badge with a short generated id and a null image', async () => {
    const badge = await saveBadge(BADGE_INPUT);

    expect(badge).toEqual({ id: expect.stringMatching(SHORT_ID), ...BADGE_INPUT, image_url: null });
    expect(await prisma.badge.findUnique({ where: { id: badge.id } })).toMatchObject({ ...BADGE_INPUT, image_url: null });
  });

  it('keeps a given id and image', async () => {
    const badge = await saveBadge({ ...BADGE_INPUT, id: 'meu-selo', image_url: '/uploads/a.png' });

    expect(badge).toEqual({ id: 'meu-selo', ...BADGE_INPUT, image_url: '/uploads/a.png' });
  });

  it('updates every field of an existing badge with the same id', async () => {
    await saveBadge({ ...BADGE_INPUT, id: 'b1', image_url: '/uploads/a.png' });

    const updated = await saveBadge({
      id: 'b1', name: 'Selo B', description: 'desc B', category: 'RH', icon_name: '🎓', points: 9,
    });

    expect(updated).toEqual({
      id: 'b1', name: 'Selo B', description: 'desc B', category: 'RH', icon_name: '🎓', image_url: null, points: 9,
    });
    expect(await prisma.badge.count()).toBe(1);
  });

  it('rejects a new badge whose name is already taken', async () => {
    await saveBadge({ ...BADGE_INPUT, id: 'b1' });

    await expect(saveBadge({ ...BADGE_INPUT, id: 'b2' })).rejects.toThrow();
    expect(await prisma.badge.count()).toBe(1);
  });
});

describe('seedIndicatorBadges', () => {
  it('upserts the 13 indicator badges and returns them without image_url', async () => {
    const badges = await seedIndicatorBadges();

    expect(badges).toHaveLength(13);
    expect(badges[0]).toEqual({
      id: 'ind-nps', name: 'NPS', description: 'Net Promoter Score', category: 'Qualidade', icon_name: '⭐', points: 0,
    });
    expect(badges.map((badge) => badge.id)).toContain('ind-reincidente');
    expect(await prisma.badge.count()).toBe(13);
  });

  it('is idempotent and restores edited indicator badges', async () => {
    await seedIndicatorBadges();
    await prisma.badge.update({ where: { id: 'ind-nps' }, data: { description: 'editado', points: 7 } });

    await seedIndicatorBadges();

    expect(await prisma.badge.count()).toBe(13);
    expect(await prisma.badge.findUnique({ where: { id: 'ind-nps' } })).toMatchObject({ description: 'Net Promoter Score', points: 0 });
  });
});

describe('deleteBadge', () => {
  it('deletes the badge and its image file', async () => {
    await saveBadge({ ...BADGE_INPUT, id: 'b1', image_url: '/uploads/a.png' });

    expect(await deleteBadge('b1')).toEqual({ success: true });

    expect(await prisma.badge.findUnique({ where: { id: 'b1' } })).toBeNull();
    expect(deleteUploadedFile).toHaveBeenCalledWith('/uploads/a.png');
  });

  it('does not touch files when the badge has no image', async () => {
    await saveBadge({ ...BADGE_INPUT, id: 'b1' });

    expect(await deleteBadge('b1')).toEqual({ success: true });

    expect(deleteUploadedFile).not.toHaveBeenCalled();
  });

  it('succeeds for an unknown badge', async () => {
    expect(await deleteBadge('nao-existe')).toEqual({ success: true });
    expect(deleteUploadedFile).not.toHaveBeenCalled();
  });

  it('keeps the image file when another badge still uses it', async () => {
    await saveBadge({ ...BADGE_INPUT, id: 'b1', image_url: '/uploads/a.png' });
    await saveBadge({ ...BADGE_INPUT, id: 'b2', name: 'Selo B', image_url: '/uploads/a.png' });

    expect(await deleteBadge('b1')).toEqual({ success: true });

    expect(await prisma.badge.findUnique({ where: { id: 'b1' } })).toBeNull();
    expect(deleteUploadedFile).not.toHaveBeenCalled();
  });

  it('keeps the image file when a user avatar points to it', async () => {
    await saveBadge({ ...BADGE_INPUT, id: 'b1', image_url: '/uploads/a.png' });
    await insertUser({ avatar_url: '/uploads/a.png' });

    await deleteBadge('b1');

    expect(deleteUploadedFile).not.toHaveBeenCalled();
  });
});

describe('saveProductiveUnit', () => {
  it('creates a unit with a short generated id', async () => {
    const unit = await saveProductiveUnit({ name: 'Unidade Nova' });

    expect(unit).toEqual({ id: expect.stringMatching(SHORT_ID), name: 'Unidade Nova' });
  });

  it('renames an existing unit', async () => {
    expect(await saveProductiveUnit({ id: 'pu1', name: 'Renomeada' })).toEqual({ id: 'pu1', name: 'Renomeada' });
    expect((await prisma.productiveUnit.findUnique({ where: { id: 'pu1' } })).name).toBe('Renomeada');
  });
});

describe('updateUserProfile', () => {
  it('updates only the given fields and returns the profile without is_active', async () => {
    const ana = await insertUser({ productive_unit_id: 'pu1', avatar_url: '/uploads/old.png' });

    const updated = await updateUserProfile(ana.id, { full_name: 'Ana Maria' });

    expect(updated).toEqual({
      id: ana.id,
      email: 'ana@example.com',
      full_name: 'Ana Maria',
      avatar_url: '/uploads/old.png',
      role: 'user',
      productive_unit_id: 'pu1',
      email_verified: false,
      created_at: expect.any(Date),
    });
    expect(updated.created_at.toISOString()).toBe('2024-01-01T10:00:00.000Z');
  });

  it('updates email, avatar and password', async () => {
    const ana = await insertUser();

    const updated = await updateUserProfile(ana.id, {
      email: 'ana.nova@example.com', avatar_url: '/uploads/new.png', password: 'nova-senha',
    });

    expect(updated).toMatchObject({ email: 'ana.nova@example.com', avatar_url: '/uploads/new.png' });
    const stored = await prisma.user.findUnique({ where: { id: ana.id } });
    expect(await verifyPassword('nova-senha', stored.password_hash)).toBe(true);
  });

  it('clears the change-password flag when the user sets a new password, and only then', async () => {
    const ana = await insertUser();
    await prisma.user.update({ where: { id: ana.id }, data: { must_change_password: true } });

    await updateUserProfile(ana.id, { full_name: 'Ana Maria' });
    expect((await prisma.user.findUnique({ where: { id: ana.id } })).must_change_password).toBe(true);

    await updateUserProfile(ana.id, { password: 'minha-senha-nova' });
    expect((await prisma.user.findUnique({ where: { id: ana.id } })).must_change_password).toBe(false);
  });

  it('bumps updated_at even with no fields to change', async () => {
    const ana = await insertUser({ updated_at: new Date('2020-01-01T00:00:00.000Z') });

    await updateUserProfile(ana.id, {});

    const stored = await prisma.user.findUnique({ where: { id: ana.id } });
    expect(stored.updated_at.getTime()).toBeGreaterThan(Date.parse('2024-01-01T00:00:00.000Z'));
  });

  it('throws when the user does not exist', async () => {
    await expect(updateUserProfile(crypto.randomUUID(), { full_name: 'X' })).rejects.toThrow('Usuário não encontrado.');
  });
});

describe('saveUser', () => {
  it('creates an unverified user with the given password and returns it without the hash', async () => {
    const user = await saveUser({ email: 'bia@example.com', full_name: 'Bia', role: 'supervisor', productive_unit_id: 'pu2' }, 'senha123');

    expect(user).toEqual({
      id: expect.stringMatching(UUID),
      email: 'bia@example.com',
      full_name: 'Bia',
      avatar_url: null,
      role: 'supervisor',
      productive_unit_id: 'pu2',
      email_verified: false,
      is_active: true,
      created_at: expect.any(Date),
    });
    const stored = await prisma.user.findUnique({ where: { id: user.id } });
    expect(await verifyPassword('senha123', stored.password_hash)).toBe(true);
  });

  it('generates a temporary password when none is given, returns it once, and stores an empty unit as null', async () => {
    const user = await saveUser({ email: 'cid@example.com', full_name: 'Cid', role: 'user', productive_unit_id: '', is_active: false });

    expect(user.productive_unit_id).toBeNull();
    expect(user.is_active).toBe(false);
    expect(user.temporary_password).toMatch(/^[A-HJ-NP-Za-km-z2-9]{12}$/);
    const stored = await prisma.user.findUnique({ where: { id: user.id } });
    expect(await verifyPassword(user.temporary_password, stored.password_hash)).toBe(true);
    expect(await verifyPassword('changeme123', stored.password_hash)).toBe(false);
  });

  it('flags every admin-created user to change the password, even when the admin chose it', async () => {
    const generated = await saveUser({ email: 'gen@example.com', full_name: 'Gen', role: 'user' });
    const chosen = await saveUser({ email: 'chosen@example.com', full_name: 'Chosen', role: 'user' }, 'senha123');

    expect(chosen.temporary_password).toBeUndefined();
    const stored = await prisma.user.findMany({ where: { id: { in: [generated.id, chosen.id] } } });
    expect(stored.map((user) => user.must_change_password)).toEqual([true, true]);
  });

  it('flags the user to change the password when an admin resets it, but not on other edits', async () => {
    const ana = await insertUser();
    const bia = await insertUser({ email: 'bia@example.com' });

    await saveUser({ id: ana.id, email: 'ana@example.com', full_name: 'Ana', role: 'user' }, 'resetada1');
    await saveUser({ id: bia.id, email: 'bia@example.com', full_name: 'Bia Renomeada', role: 'user' });

    expect((await prisma.user.findUnique({ where: { id: ana.id } })).must_change_password).toBe(true);
    expect((await prisma.user.findUnique({ where: { id: bia.id } })).must_change_password).toBe(false);
  });

  it('updates an existing user by id, keeping the password when none is given', async () => {
    const ana = await insertUser({ productive_unit_id: 'pu1', avatar_url: '/uploads/a.png' });

    const updated = await saveUser({
      id: ana.id, email: 'ana2@example.com', full_name: 'Ana 2', role: 'supervisor', productive_unit_id: 'pu2',
    });

    expect(updated).toEqual({
      id: ana.id,
      email: 'ana2@example.com',
      full_name: 'Ana 2',
      avatar_url: '/uploads/a.png',
      role: 'supervisor',
      productive_unit_id: 'pu2',
      email_verified: false,
      is_active: true,
      created_at: expect.any(Date),
    });
    expect((await prisma.user.findUnique({ where: { id: ana.id } })).password_hash).toBe('hash-ana');
  });

  it('updates avatar, active flag and password when given', async () => {
    const ana = await insertUser({ avatar_url: '/uploads/a.png' });

    const updated = await saveUser({
      id: ana.id, email: 'ana@example.com', full_name: 'Ana', role: 'user', avatar_url: null, is_active: false,
    }, 'trocada1');

    expect(updated).toMatchObject({ avatar_url: null, is_active: false });
    const stored = await prisma.user.findUnique({ where: { id: ana.id } });
    expect(await verifyPassword('trocada1', stored.password_hash)).toBe(true);
  });

  it('creates a new user with a fresh id when the given id does not exist', async () => {
    const missingId = crypto.randomUUID();

    const user = await saveUser({ id: missingId, email: 'novo@example.com', full_name: 'Novo', role: 'user' }, 'senha123');

    expect(user.id).toMatch(UUID);
    expect(user.id).not.toBe(missingId);
    expect(await prisma.user.count()).toBe(1);
  });
});

describe('bulkInviteUsers', () => {
  it('creates normalized, deduplicated users and skips registered emails', async () => {
    await insertUser({ email: 'ana@example.com' });

    const result = await bulkInviteUsers({
      emails: ['  Bia@Example.com', 'bia@example.com', 'ana@example.com', '', 'cid@example.com'],
      productiveUnitId: 'pu1',
    });

    expect(result.skippedEmails).toEqual(['ana@example.com']);
    expect(result.createdUsers).toEqual([
      {
        id: expect.stringMatching(UUID),
        email: 'bia@example.com',
        full_name: 'bia',
        role: 'user',
        productive_unit_id: 'pu1',
        email_verified: false,
        created_at: expect.any(Date),
      },
      expect.objectContaining({ email: 'cid@example.com', full_name: 'cid', productive_unit_id: 'pu1' }),
    ]);
  });

  it('gives each invited user their own temporary password and flags them to change it', async () => {
    const result = await bulkInviteUsers({ emails: ['bia@example.com', 'cid@example.com'], productiveUnitId: 'pu1' });

    const passwords = result.temporaryPasswords;
    expect(passwords).toEqual([
      { email: 'bia@example.com', temporary_password: expect.stringMatching(/^[A-HJ-NP-Za-km-z2-9]{12}$/) },
      { email: 'cid@example.com', temporary_password: expect.stringMatching(/^[A-HJ-NP-Za-km-z2-9]{12}$/) },
    ]);
    expect(passwords[0].temporary_password).not.toBe(passwords[1].temporary_password);

    const bia = await prisma.user.findUnique({ where: { email: 'bia@example.com' } });
    expect(await verifyPassword(passwords[0].temporary_password, bia.password_hash)).toBe(true);
    expect(await verifyPassword('changeme123', bia.password_hash)).toBe(false);
    expect(bia.must_change_password).toBe(true);
  });

  it('stores a missing unit as null', async () => {
    const result = await bulkInviteUsers({ emails: ['dan@example.com'], productiveUnitId: undefined });

    expect(result.createdUsers[0].productive_unit_id).toBeNull();
  });

  it('writes nothing when an insert fails', async () => {
    await expect(bulkInviteUsers({ emails: ['eva@example.com'], productiveUnitId: 'unidade-inexistente' })).rejects.toThrow();

    expect(await prisma.user.count()).toBe(0);
  });
});
