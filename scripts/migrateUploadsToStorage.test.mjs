// @vitest-environment node
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../server/shared/db/prisma.mjs';
import { resetDatabase } from '../server/test/db.mjs';
import { createTestUser } from '../server/test/fixtures.mjs';
import { migrateUploads } from './migrateUploadsToStorage.mjs';

const STORAGE_PREFIX = 'https://ref.supabase.co/storage/v1/object/public/uploads/';

const createFakeStorage = ({ failOn = [] } = {}) => {
  const objects = new Map();
  return {
    objects,
    putCalls: [],
    async exists(name) {
      return objects.has(name);
    },
    async put(name, buffer, mimeType) {
      this.putCalls.push({ name, mimeType });
      if (failOn.includes(name)) throw new Error('Falha ao enviar arquivo para o storage');
      objects.set(name, buffer);
      return this.urlFor(name);
    },
    urlFor(name) {
      return `${STORAGE_PREFIX}${name}`;
    },
  };
};

let dir;
let user;
const silentLog = () => {};

const writeUpload = (name) => fs.writeFileSync(path.join(dir, name), `conteudo-${name}`);

const createBadge = (id, imageUrl) => prisma.badge.create({
  data: { id, name: `Selo ${id}`, description: 'd', category: 'Qualidade', icon_name: '⭐', points: 1, image_url: imageUrl },
});

beforeEach(async () => {
  await resetDatabase();
  dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'labquest-migrate-'));
  user = await createTestUser({ email: 'a@b.com', full_name: 'A', role: 'user', avatar_url: '/uploads/avatar.png' });
  await createBadge('b1', '/uploads/badge.jpg');
  await createBadge('b2', `${STORAGE_PREFIX}ja-migrado.png`);
  await createBadge('b3', null);
  await prisma.badgeSubmission.create({
    data: { id: crypto.randomUUID(), user_id: user.id, badge_id: 'b1', proof_url: '/uploads/prova.webp' },
  });
  writeUpload('avatar.png');
  writeUpload('badge.jpg');
  writeUpload('prova.webp');
});

afterEach(async () => {
  await fs.promises.rm(dir, { recursive: true, force: true });
});

const urls = async () => ({
  avatar: (await prisma.user.findUnique({ where: { id: user.id } })).avatar_url,
  b1: (await prisma.badge.findUnique({ where: { id: 'b1' } })).image_url,
  b2: (await prisma.badge.findUnique({ where: { id: 'b2' } })).image_url,
  b3: (await prisma.badge.findUnique({ where: { id: 'b3' } })).image_url,
  proof: (await prisma.badgeSubmission.findFirst()).proof_url,
});

describe('migrateUploads', () => {
  it('dry-run não envia nem altera nada e o resumo conta o que seria migrado', async () => {
    const storage = createFakeStorage();

    const summary = await migrateUploads({ prisma, storage, dir, apply: false, log: silentLog });

    expect(summary).toEqual({ migrados: 3, pulados: 1, ausentes: 0, falhas: 0 });
    expect(storage.putCalls).toEqual([]);
    expect(await urls()).toEqual({
      avatar: '/uploads/avatar.png',
      b1: '/uploads/badge.jpg',
      b2: `${STORAGE_PREFIX}ja-migrado.png`,
      b3: null,
      proof: '/uploads/prova.webp',
    });
  });

  it('--apply envia os arquivos com o mesmo nome e reescreve as URLs', async () => {
    const storage = createFakeStorage();

    const summary = await migrateUploads({ prisma, storage, dir, apply: true, log: silentLog });

    expect(summary).toEqual({ migrados: 3, pulados: 1, ausentes: 0, falhas: 0 });
    expect(storage.putCalls).toEqual(expect.arrayContaining([
      { name: 'avatar.png', mimeType: 'image/png' },
      { name: 'badge.jpg', mimeType: 'image/jpeg' },
      { name: 'prova.webp', mimeType: 'image/webp' },
    ]));
    expect(storage.objects.get('badge.jpg').toString()).toBe('conteudo-badge.jpg');
    expect(await urls()).toEqual({
      avatar: `${STORAGE_PREFIX}avatar.png`,
      b1: `${STORAGE_PREFIX}badge.jpg`,
      b2: `${STORAGE_PREFIX}ja-migrado.png`,
      b3: null,
      proof: `${STORAGE_PREFIX}prova.webp`,
    });
  });

  it('é idempotente: a segunda execução não migra nada', async () => {
    const storage = createFakeStorage();
    await migrateUploads({ prisma, storage, dir, apply: true, log: silentLog });
    storage.putCalls.length = 0;

    const summary = await migrateUploads({ prisma, storage, dir, apply: true, log: silentLog });

    expect(summary).toEqual({ migrados: 0, pulados: 4, ausentes: 0, falhas: 0 });
    expect(storage.putCalls).toEqual([]);
  });

  it('não reenvia arquivo que já existe no bucket, mas reescreve a URL', async () => {
    const storage = createFakeStorage();
    storage.objects.set('badge.jpg', Buffer.from('ja-estava'));

    await migrateUploads({ prisma, storage, dir, apply: true, log: silentLog });

    expect(storage.putCalls.map((call) => call.name)).not.toContain('badge.jpg');
    expect(storage.objects.get('badge.jpg').toString()).toBe('ja-estava');
    expect((await urls()).b1).toBe(`${STORAGE_PREFIX}badge.jpg`);
  });

  it('arquivo ausente na pasta entra no resumo e mantém a URL antiga', async () => {
    fs.rmSync(path.join(dir, 'badge.jpg'));
    const storage = createFakeStorage();

    const summary = await migrateUploads({ prisma, storage, dir, apply: true, log: silentLog });

    expect(summary).toEqual({ migrados: 2, pulados: 1, ausentes: 1, falhas: 0 });
    expect((await urls()).b1).toBe('/uploads/badge.jpg');
  });

  it('falha de upload é contada e mantém a URL antiga', async () => {
    const storage = createFakeStorage({ failOn: ['avatar.png'] });

    const summary = await migrateUploads({ prisma, storage, dir, apply: true, log: silentLog });

    expect(summary).toEqual({ migrados: 2, pulados: 1, ausentes: 0, falhas: 1 });
    expect((await urls()).avatar).toBe('/uploads/avatar.png');
  });

  it('não lê arquivos fora da pasta mesmo com URL maliciosa', async () => {
    fs.writeFileSync(path.join(path.dirname(dir), 'segredo.png'), 'x');
    await prisma.badge.update({ where: { id: 'b1' }, data: { image_url: '/uploads/../segredo.png' } });
    const storage = createFakeStorage();

    const summary = await migrateUploads({ prisma, storage, dir, apply: true, log: silentLog });

    expect(summary.ausentes).toBe(1);
    expect(storage.objects.has('segredo.png')).toBe(false);
    fs.rmSync(path.join(path.dirname(dir), 'segredo.png'));
  });

  it('URL que aponta para uma pasta conta como ausente, não como falha', async () => {
    fs.mkdirSync(path.join(dir, 'uploads'));
    await prisma.badge.update({ where: { id: 'b1' }, data: { image_url: '/uploads/' } });
    const storage = createFakeStorage();

    const summary = await migrateUploads({ prisma, storage, dir, apply: true, log: silentLog });

    expect(summary).toEqual({ migrados: 2, pulados: 1, ausentes: 1, falhas: 0 });
    expect((await urls()).b1).toBe('/uploads/');
  });
});
