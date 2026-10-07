// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { maskDatabaseUrl, runDbCheck } from './dbCheck.mjs';

const makeFakeClient = ({ connectError, tables = ['users', 'badges'] } = {}) => {
  const instances = [];
  const createClient = (databaseUrl) => {
    const client = {
      databaseUrl,
      $connect: vi.fn(async () => {
        if (connectError) throw connectError;
      }),
      $queryRaw: vi.fn(async (strings) => {
        if (strings.join('').includes('information_schema')) {
          return tables.map((table_name) => ({ table_name }));
        }
        return [{ now: new Date('2026-10-06T12:00:00Z'), version: 'PostgreSQL 16.4, compiled by gcc' }];
      }),
      $disconnect: vi.fn().mockResolvedValue(undefined),
    };
    instances.push(client);
    return client;
  };
  return { createClient, instances };
};

describe('maskDatabaseUrl', () => {
  it('esconde a senha e mantém o resto da URL', () => {
    expect(maskDatabaseUrl('postgresql://labquest:segredo@db:5432/labquest'))
      .toBe('postgresql://labquest:****@db:5432/labquest');
  });
});

describe('runDbCheck', () => {
  it('retorna falha sem tentar conectar quando DATABASE_URL está ausente', async () => {
    const { createClient, instances } = makeFakeClient();
    const result = await runDbCheck({ databaseUrl: undefined, createClient });
    expect(result).toEqual({ ok: false, error: 'DATABASE_URL não está definida' });
    expect(instances).toHaveLength(0);
  });

  it('retorna versão e tabelas e fecha a conexão em caso de sucesso', async () => {
    const { createClient, instances } = makeFakeClient();
    const result = await runDbCheck({ databaseUrl: 'postgresql://u:p@h:5432/d', createClient });
    expect(result).toEqual({ ok: true, version: 'PostgreSQL 16.4', tables: ['users', 'badges'] });
    expect(instances[0].databaseUrl).toBe('postgresql://u:p@h:5432/d');
    expect(instances[0].$disconnect).toHaveBeenCalledTimes(1);
  });

  it('retorna a mensagem de erro quando a conexão falha, e fecha o client', async () => {
    const { createClient, instances } = makeFakeClient({ connectError: new Error('ECONNREFUSED') });
    const result = await runDbCheck({ databaseUrl: 'postgresql://u:p@h:5432/d', createClient });
    expect(result).toEqual({ ok: false, error: 'ECONNREFUSED' });
    expect(instances[0].$disconnect).toHaveBeenCalledTimes(1);
  });
});
