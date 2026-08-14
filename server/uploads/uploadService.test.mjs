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
    ['image/jpeg', 'jpg'],
    ['image/png', 'png'],
    ['image/webp', 'webp'],
    ['image/gif', 'gif'],
  ])('saves a %s file, returns a matching /uploads/*.%s URL, and writes the exact buffer contents', async (mimeType, ext) => {
    const buffer = Buffer.from(`fake-${ext}-bytes-${Date.now()}`, 'utf8');

    const imageUrl = await saveUploadedFile(buffer, mimeType, 'original-name.bin');
    trackFromUrl(imageUrl);

    expect(imageUrl).toMatch(new RegExp(`^/uploads/[0-9a-f]{16}-\\d+\\.${ext}$`));

    const filename = path.basename(imageUrl);
    const filePath = path.join(uploadsDir, filename);
    expect(fs.existsSync(filePath)).toBe(true);

    const written = await fs.promises.readFile(filePath);
    expect(written).toEqual(buffer);
  });

  it('generates distinct filenames on repeated calls with identical input', async () => {
    const buffer = Buffer.from('same-content', 'utf8');

    const url1 = await saveUploadedFile(buffer, 'image/png', 'a.png');
    trackFromUrl(url1);
    const url2 = await saveUploadedFile(buffer, 'image/png', 'a.png');
    trackFromUrl(url2);

    expect(url1).not.toBe(url2);
  });

  it('propagates validateImageFile\'s rejection for a disallowed mimeType and writes no file', async () => {
    const before = await fs.promises.readdir(uploadsDir);

    await expect(saveUploadedFile(Buffer.from('x'), 'application/pdf', 'a.pdf')).rejects.toThrow(
      'Tipo de arquivo não permitido. Tipos aceitos: image/jpeg, image/png, image/webp, image/gif'
    );

    const after = await fs.promises.readdir(uploadsDir);
    expect(after).toEqual(before);
  });

  it('propagates validateImageFile\'s rejection for an oversized buffer and writes no file', async () => {
    const before = await fs.promises.readdir(uploadsDir);
    const oversized = Buffer.alloc(5 * 1024 * 1024 + 1);

    await expect(saveUploadedFile(oversized, 'image/png', 'a.png')).rejects.toThrow(
      'Arquivo muito grande. Máximo: 5MB'
    );

    const after = await fs.promises.readdir(uploadsDir);
    expect(after).toEqual(before);
  });
});

describe('deleteUploadedFile', () => {
  it('removes a file previously created by saveUploadedFile', async () => {
    const buffer = Buffer.from('to-be-deleted', 'utf8');
    const imageUrl = await saveUploadedFile(buffer, 'image/png', 'a.png');
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
