// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { createSupabaseStorage } from './supabaseStorage.mjs';

const SUPABASE_URL = 'https://ref.supabase.co';
const PUBLIC_URL = `${SUPABASE_URL}/storage/v1/object/public/uploads/a.png`;

const createFakeClient = ({ uploadError = null } = {}) => {
  const bucket = {
    upload: vi.fn(async () => (uploadError ? { data: null, error: uploadError } : { data: { path: 'a.png' }, error: null })),
    getPublicUrl: vi.fn((name) => ({ data: { publicUrl: `${SUPABASE_URL}/storage/v1/object/public/uploads/${name}` } })),
    remove: vi.fn(async () => ({ data: [], error: null })),
    exists: vi.fn(async (name) => (name === 'existe.png' ? { data: true, error: null } : { data: false, error: { status: 404 } })),
  };
  return { bucket, client: { storage: { from: vi.fn(() => bucket) } } };
};

const build = (options) => {
  const fake = createFakeClient(options);
  const storage = createSupabaseStorage({ client: fake.client, supabaseUrl: SUPABASE_URL, bucket: 'uploads' });
  return { ...fake, storage };
};

describe('createSupabaseStorage', () => {
  it('put envia o arquivo sem sobrescrever e retorna a URL pública', async () => {
    const { client, bucket, storage } = build();
    const buffer = Buffer.from('img');

    const url = await storage.put('a.png', buffer, 'image/png');

    expect(client.storage.from).toHaveBeenCalledWith('uploads');
    expect(bucket.upload).toHaveBeenCalledWith('a.png', buffer, { contentType: 'image/png', upsert: false });
    expect(url).toBe(PUBLIC_URL);
  });

  it('put converte o erro do upload em uma mensagem genérica, sem vazar detalhes', async () => {
    const { storage } = build({ uploadError: { message: 'invalid key sb_secret_xyz' } });
    const error = await storage.put('a.png', Buffer.from('img'), 'image/png').catch((caught) => caught);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Falha ao enviar arquivo para o storage');
    expect(error.message).not.toContain('sb_secret_xyz');
  });

  it('remove apaga o objeto a partir da URL pública do bucket', async () => {
    const { bucket, storage } = build();
    await storage.remove(PUBLIC_URL);
    expect(bucket.remove).toHaveBeenCalledWith(['a.png']);
  });

  it.each([
    '/uploads/a.png',
    'https://outro.supabase.co/storage/v1/object/public/uploads/a.png',
    `${SUPABASE_URL}/storage/v1/object/public/outro-bucket/a.png`,
    '',
    null,
  ])('remove ignora %s', async (url) => {
    const { bucket, storage } = build();
    await storage.remove(url);
    expect(bucket.remove).not.toHaveBeenCalled();
  });

  it('exists consulta o bucket e retorna true só quando o objeto existe', async () => {
    const { bucket, storage } = build();
    expect(await storage.exists('existe.png')).toBe(true);
    expect(await storage.exists('nao.png')).toBe(false);
    expect(bucket.exists).toHaveBeenCalledWith('existe.png');
  });

  it('urlFor retorna a URL pública do objeto sem enviar nada', () => {
    const { bucket, storage } = build();
    expect(storage.urlFor('a.png')).toBe(PUBLIC_URL);
    expect(bucket.upload).not.toHaveBeenCalled();
  });
});
