// @vitest-environment node
//
// Round-trips saveUploadedFile()/deleteUploadedFile() against the real
// filesystem. uploadService.mjs hardcodes its target directory relative to
// its own module location (public/uploads/ in this repo) with no injection
// point for an alternate directory, so these tests write real files there.
// Every file this test suite creates is tracked and removed in afterEach —
// nothing pre-existing is ever touched or deleted.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import { deleteUploadedFile, saveUploadedFile, validateImageFile } from './uploadService.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../public/uploads');

// Tracks every filename this suite creates via saveUploadedFile so afterEach
// can remove exactly those files and nothing else.
let createdFilenames = [];

afterEach(async () => {
  for (const filename of createdFilenames) {
    const filePath = path.join(uploadsDir, filename);
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      // Already removed by the test itself (e.g. via deleteUploadedFile) — fine.
      if (error.code !== 'ENOENT') throw error;
    }
  }
  createdFilenames = [];
});

const realImage = (width, height, format) =>
  sharp({ create: { width, height, channels: 3, background: '#DD3244' } }).toFormat(format).toBuffer();

const trackFromUrl = (imageUrl) => {
  const filename = path.basename(imageUrl);
  createdFilenames.push(filename);
  return filename;
};

describe('validateImageFile', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])(
    'accepts %s at exactly the 5MB limit',
    (mimeType) => {
      expect(() => validateImageFile(mimeType, 5 * 1024 * 1024)).not.toThrow();
    }
  );

  it('rejects a disallowed mimeType with the exact expected message', () => {
    expect(() => validateImageFile('application/pdf', 1024)).toThrow(
      'Tipo de arquivo não permitido. Tipos aceitos: image/jpeg, image/png, image/webp, image/gif'
    );
  });

  it('rejects a file over the 5MB limit with the exact expected message', () => {
    expect(() => validateImageFile('image/png', 5 * 1024 * 1024 + 1)).toThrow(
      'Arquivo muito grande. Máximo: 5MB'
    );
  });
});

describe('saveUploadedFile', () => {
  it.each([
    ['image/jpeg', 'jpeg'],
    ['image/png', 'png'],
    ['image/webp', 'webp'],
    ['image/gif', 'gif'],
  ])('converte um %s para WebP otimizado e grava em /uploads/*.webp', async (mimeType, format) => {
    const buffer = await realImage(1200, 900, format);

    const imageUrl = await saveUploadedFile(buffer, mimeType, 'badge');
    trackFromUrl(imageUrl);

    expect(imageUrl).toMatch(/^\/uploads\/[0-9a-f]{16}-\d+\.webp$/);

    const written = await fs.promises.readFile(path.join(uploadsDir, path.basename(imageUrl)));
    const meta = await sharp(written).metadata();
    expect(meta).toMatchObject({ format: 'webp', width: 512, height: 384 });
  });

  it('usa o tamanho do avatar quando o tipo de upload é avatar', async () => {
    const imageUrl = await saveUploadedFile(await realImage(800, 600, 'png'), 'image/png', 'avatar');
    trackFromUrl(imageUrl);

    const written = await fs.promises.readFile(path.join(uploadsDir, path.basename(imageUrl)));
    expect(await sharp(written).metadata()).toMatchObject({ width: 256, height: 256 });
  });

  it('generates distinct filenames on repeated calls with identical input', async () => {
    const buffer = await realImage(10, 10, 'png');

    const url1 = await saveUploadedFile(buffer, 'image/png', 'badge');
    trackFromUrl(url1);
    const url2 = await saveUploadedFile(buffer, 'image/png', 'badge');
    trackFromUrl(url2);

    expect(url1).not.toBe(url2);
  });

  it('rejeita bytes que não são uma imagem e não grava arquivo', async () => {
    const before = await fs.promises.readdir(uploadsDir);

    await expect(saveUploadedFile(Buffer.from('fake-png'), 'image/png', 'badge')).rejects.toThrow(
      'Arquivo de imagem inválido ou corrompido.'
    );

    expect(await fs.promises.readdir(uploadsDir)).toEqual(before);
  });

  it('propagates validateImageFile\'s rejection for a disallowed mimeType and writes no file', async () => {
    const before = await fs.promises.readdir(uploadsDir);

    await expect(saveUploadedFile(Buffer.from('x'), 'application/pdf', 'badge')).rejects.toThrow(
      'Tipo de arquivo não permitido. Tipos aceitos: image/jpeg, image/png, image/webp, image/gif'
    );

    const after = await fs.promises.readdir(uploadsDir);
    expect(after).toEqual(before);
  });

  it('propagates validateImageFile\'s rejection for an oversized buffer and writes no file', async () => {
    const before = await fs.promises.readdir(uploadsDir);
    const oversized = Buffer.alloc(5 * 1024 * 1024 + 1);

    await expect(saveUploadedFile(oversized, 'image/png', 'badge')).rejects.toThrow(
      'Arquivo muito grande. Máximo: 5MB'
    );

    const after = await fs.promises.readdir(uploadsDir);
    expect(after).toEqual(before);
  });
});

describe('deleteUploadedFile', () => {
  it('removes a file previously created by saveUploadedFile', async () => {
    const imageUrl = await saveUploadedFile(await realImage(10, 10, 'png'), 'image/png', 'badge');
    const filename = trackFromUrl(imageUrl);
    const filePath = path.join(uploadsDir, filename);

    expect(fs.existsSync(filePath)).toBe(true);

    await deleteUploadedFile(imageUrl);

    expect(fs.existsSync(filePath)).toBe(false);
  });

  it('never throws for a well-formed but nonexistent /uploads/ path', async () => {
    await expect(deleteUploadedFile('/uploads/does-not-exist-abc123.png')).resolves.toBeUndefined();
  });

  it('no-ops without throwing for a falsy fileUrl', async () => {
    await expect(deleteUploadedFile(undefined)).resolves.toBeUndefined();
    await expect(deleteUploadedFile(null)).resolves.toBeUndefined();
    await expect(deleteUploadedFile('')).resolves.toBeUndefined();
  });

  it('no-ops without throwing for a path not prefixed with /uploads/', async () => {
    await expect(deleteUploadedFile('/etc/passwd')).resolves.toBeUndefined();
    expect(fs.existsSync('/etc/passwd')).toBe(true);
  });
});
