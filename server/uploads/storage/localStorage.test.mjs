// @vitest-environment node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorage } from './localStorage.mjs';

let dir;

beforeEach(async () => {
  dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'labquest-uploads-'));
});

afterEach(async () => {
  await fs.promises.rm(dir, { recursive: true, force: true });
});

describe('createLocalStorage', () => {
  it('put grava o arquivo no diretório e retorna /uploads/<nome>', async () => {
    const storage = createLocalStorage({ dir });

    const url = await storage.put('a.png', Buffer.from('img'), 'image/png');

    expect(url).toBe('/uploads/a.png');
    expect(fs.readFileSync(path.join(dir, 'a.png'), 'utf8')).toBe('img');
  });

  it('remove apaga o arquivo da URL', async () => {
    const storage = createLocalStorage({ dir });
    await storage.put('a.png', Buffer.from('img'), 'image/png');

    await storage.remove('/uploads/a.png');

    expect(fs.existsSync(path.join(dir, 'a.png'))).toBe(false);
  });

  it('remove de um arquivo inexistente não lança erro', async () => {
    const storage = createLocalStorage({ dir });
    await expect(storage.remove('/uploads/nao-existe.png')).resolves.toBeUndefined();
  });

  it('remove ignora URLs fora de /uploads/', async () => {
    const storage = createLocalStorage({ dir });
    await storage.put('a.png', Buffer.from('img'), 'image/png');

    await storage.remove('https://ref.supabase.co/storage/v1/object/public/uploads/a.png');

    expect(fs.existsSync(path.join(dir, 'a.png'))).toBe(true);
  });

  it('cria o diretório quando ele não existe', async () => {
    const nested = path.join(dir, 'nested');
    const storage = createLocalStorage({ dir: nested });

    await storage.put('a.png', Buffer.from('img'), 'image/png');

    expect(fs.existsSync(path.join(nested, 'a.png'))).toBe(true);
  });
});
