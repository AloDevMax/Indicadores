// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { parseEnv } from './env.mjs';

const DEV_BASE = { DATABASE_URL: 'postgresql://u:p@localhost:5432/labquest' };

const PROD_BASE = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://u:p@db:5432/labquest',
  AUTH_SECRET: 'segredo-de-producao',
  DEVELOPER_INITIAL_PASSWORD: 'senha-forte',
  STORAGE_DRIVER: 'supabase',
  SUPABASE_URL: 'https://ref.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
};

describe('parseEnv', () => {
  it('falha sem DATABASE_URL, em qualquer ambiente', () => {
    expect(() => parseEnv({})).toThrow('DATABASE_URL: obrigatória');
  });

  it('aplica os defaults de desenvolvimento quando só DATABASE_URL é definida', () => {
    const env = parseEnv(DEV_BASE);
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(4004);
    expect(env.DATABASE_URL).toBe('postgresql://u:p@localhost:5432/labquest');
    expect(env.ALLOWED_ORIGINS).toEqual(['http://localhost:3000']);
    expect(env.AUTH_SECRET).toBe('dev-only-auth-secret-change-me');
    expect(env.DEVELOPER_INITIAL_PASSWORD).toBe('2665398');
    expect(env.STORAGE_DRIVER).toBe('local');
    expect(env.SUPABASE_STORAGE_BUCKET).toBe('uploads');
  });

  it('converte PORT para número e separa ALLOWED_ORIGINS por vírgula', () => {
    const env = parseEnv({ ...DEV_BASE, PORT: '8080', ALLOWED_ORIGINS: 'https://a.com, https://b.com ,' });
    expect(env.PORT).toBe(8080);
    expect(env.ALLOWED_ORIGINS).toEqual(['https://a.com', 'https://b.com']);
  });

  it('não expõe DATABASE_SSL: o SSL do banco vem do sslmode da DATABASE_URL', () => {
    expect(parseEnv({ ...DEV_BASE, DATABASE_SSL: 'false' })).not.toHaveProperty('DATABASE_SSL');
  });

  it('trata string vazia como variável ausente', () => {
    expect(() => parseEnv({ DATABASE_URL: '' })).toThrow('DATABASE_URL: obrigatória');
  });

  it('aceita uma configuração de produção completa sem aplicar defaults de dev', () => {
    const env = parseEnv(PROD_BASE);
    expect(env.AUTH_SECRET).toBe('segredo-de-producao');
    expect(env.DEVELOPER_INITIAL_PASSWORD).toBe('senha-forte');
  });

  it.each(['AUTH_SECRET', 'DEVELOPER_INITIAL_PASSWORD'])(
    'falha em produção quando %s está ausente',
    (key) => {
      const source = { ...PROD_BASE, [key]: undefined };
      expect(() => parseEnv(source)).toThrow(`${key}: obrigatória em produção`);
    },
  );

  it('falha em produção quando STORAGE_DRIVER não é supabase', () => {
    expect(() => parseEnv({ ...PROD_BASE, STORAGE_DRIVER: 'local' })).toThrow(
      'STORAGE_DRIVER: deve ser "supabase" em produção',
    );
  });

  it('falha em produção quando STORAGE_DRIVER fica no default local', () => {
    expect(() => parseEnv({ ...PROD_BASE, STORAGE_DRIVER: undefined })).toThrow(
      'STORAGE_DRIVER: deve ser "supabase" em produção',
    );
  });

  it.each(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'])(
    'falha com STORAGE_DRIVER=supabase quando %s está ausente',
    (key) => {
      const source = { ...DEV_BASE, STORAGE_DRIVER: 'supabase', SUPABASE_URL: 'https://ref.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'k', [key]: '' };
      expect(() => parseEnv(source)).toThrow(`${key}: obrigatória com STORAGE_DRIVER=supabase`);
    },
  );

  it('aceita o driver supabase completo e o bucket customizado', () => {
    const env = parseEnv({ ...PROD_BASE, SUPABASE_STORAGE_BUCKET: 'midia' });
    expect(env.STORAGE_DRIVER).toBe('supabase');
    expect(env.SUPABASE_URL).toBe('https://ref.supabase.co');
    expect(env.SUPABASE_STORAGE_BUCKET).toBe('midia');
  });

  it('rejeita SUPABASE_URL que não é uma URL http(s)', () => {
    expect(() => parseEnv({ ...PROD_BASE, SUPABASE_URL: 'ref.supabase.co' })).toThrow(
      'SUPABASE_URL: deve ser uma URL http(s)',
    );
  });

  it('remove as barras finais da SUPABASE_URL', () => {
    expect(parseEnv({ ...PROD_BASE, SUPABASE_URL: 'https://ref.supabase.co//' }).SUPABASE_URL).toBe('https://ref.supabase.co');
  });

  it('não inclui o valor de nenhuma variável na mensagem de erro', () => {
    const secret = 'sb_secret_valor-que-nao-pode-vazar';
    const error = (() => {
      try {
        parseEnv({ ...PROD_BASE, SUPABASE_SERVICE_ROLE_KEY: secret, SUPABASE_URL: secret, PORT: secret });
      } catch (caught) {
        return caught;
      }
      return null;
    })();
    expect(error?.message).toMatch(/Variáveis de ambiente inválidas/);
    expect(error.message).not.toContain(secret);
  });

  it('rejeita STORAGE_DRIVER desconhecido', () => {
    expect(() => parseEnv({ ...DEV_BASE, STORAGE_DRIVER: 's3' })).toThrow(/STORAGE_DRIVER/);
  });

  it('rejeita PORT inválida com mensagem nomeando a variável', () => {
    expect(() => parseEnv({ ...DEV_BASE, PORT: 'abc' })).toThrow(/Variáveis de ambiente inválidas:[\s\S]*PORT/);
  });

  it('rejeita NODE_ENV desconhecido', () => {
    expect(() => parseEnv({ ...DEV_BASE, NODE_ENV: 'staging' })).toThrow(/NODE_ENV/);
  });

  it('retorna um objeto congelado', () => {
    expect(Object.isFrozen(parseEnv(DEV_BASE))).toBe(true);
  });
});
