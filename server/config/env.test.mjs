// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { parseEnv } from './env.mjs';

const PROD_BASE = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://u:p@db:5432/labquest',
  AUTH_SECRET: 'segredo-de-producao',
  DEVELOPER_INITIAL_PASSWORD: 'senha-forte',
};

describe('parseEnv', () => {
  it('aplica os defaults de desenvolvimento quando nada é definido', () => {
    const env = parseEnv({});
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(4004);
    expect(env.DATABASE_URL).toBeUndefined();
    expect(env.DATABASE_SSL).toBe(true);
    expect(env.ALLOWED_ORIGINS).toEqual(['http://localhost:3000']);
    expect(env.AUTH_SECRET).toBe('dev-only-auth-secret-change-me');
    expect(env.DEVELOPER_INITIAL_PASSWORD).toBe('2665398');
  });

  it('converte PORT para número e separa ALLOWED_ORIGINS por vírgula', () => {
    const env = parseEnv({ PORT: '8080', ALLOWED_ORIGINS: 'https://a.com, https://b.com ,' });
    expect(env.PORT).toBe(8080);
    expect(env.ALLOWED_ORIGINS).toEqual(['https://a.com', 'https://b.com']);
  });

  it('mantém a semântica atual de DATABASE_SSL: só "false" desliga', () => {
    expect(parseEnv({ DATABASE_SSL: 'false' }).DATABASE_SSL).toBe(false);
    expect(parseEnv({ DATABASE_SSL: 'true' }).DATABASE_SSL).toBe(true);
    expect(parseEnv({ DATABASE_SSL: 'qualquer' }).DATABASE_SSL).toBe(true);
  });

  it('trata string vazia como variável ausente', () => {
    expect(parseEnv({ DATABASE_URL: '' }).DATABASE_URL).toBeUndefined();
  });

  it('aceita uma configuração de produção completa sem aplicar defaults de dev', () => {
    const env = parseEnv(PROD_BASE);
    expect(env.AUTH_SECRET).toBe('segredo-de-producao');
    expect(env.DEVELOPER_INITIAL_PASSWORD).toBe('senha-forte');
  });

  it.each(['DATABASE_URL', 'AUTH_SECRET', 'DEVELOPER_INITIAL_PASSWORD'])(
    'falha em produção quando %s está ausente',
    (key) => {
      const source = { ...PROD_BASE, [key]: undefined };
      expect(() => parseEnv(source)).toThrow(`${key}: obrigatória em produção`);
    },
  );

  it('rejeita PORT inválida com mensagem nomeando a variável', () => {
    expect(() => parseEnv({ PORT: 'abc' })).toThrow(/Variáveis de ambiente inválidas:[\s\S]*PORT/);
  });

  it('rejeita NODE_ENV desconhecido', () => {
    expect(() => parseEnv({ NODE_ENV: 'staging' })).toThrow(/NODE_ENV/);
  });

  it('retorna um objeto congelado', () => {
    expect(Object.isFrozen(parseEnv({}))).toBe(true);
  });
});
