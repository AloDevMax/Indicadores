// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { maskDatabaseUrl, runDbCheck } from './dbCheck.mjs';

const makeFakeClient = ({ connectError, tables = ['users', 'badges'] } = {}) => {
  const instances = [];
  class FakeClient {
    constructor(config) {
      this.config = config;
      this.end = vi.fn().mockResolvedValue(undefined);
      instances.push(this);
    }
    async connect() {
      if (connectError) throw connectError;
    }
    async query(sql) {
      if (sql.includes('information_schema')) {
        return { rows: tables.map((table_name) => ({ table_name })) };
      }
      return { rows: [{ now: new Date('2026-10-06T12:00:00Z'), version: 'PostgreSQL 16.4, compiled by gcc' }] };
    }
  }
  return { FakeClient, instances };
};

describe('maskDatabaseUrl', () => {
  it('esconde a senha e mantém o resto da URL', () => {
    expect(maskDatabaseUrl('postgresql://labquest:segredo@db:5432/labquest'))
      .toBe('postgresql://labquest:****@db:5432/labquest');
  });
});

describe('runDbCheck', () => {
  it('retorna falha sem tentar conectar quando DATABASE_URL está ausente', async () => {
    const { FakeClient, instances } = makeFakeClient();
    const result = await runDbCheck({ databaseUrl: undefined, ssl: true, Client: FakeClient });
    expect(result).toEqual({ ok: false, error: 'DATABASE_URL não está definida' });
    expect(instances).toHaveLength(0);
  });

  it('retorna versão e tabelas e fecha a conexão em caso de sucesso', async () => {
    const { FakeClient, instances } = makeFakeClient();
    const result = await runDbCheck({ databaseUrl: 'postgresql://u:p@h:5432/d', ssl: false, Client: FakeClient });
    expect(result).toEqual({ ok: true, version: 'PostgreSQL 16.4', tables: ['users', 'badges'] });
    expect(instances[0].config).toMatchObject({ connectionString: 'postgresql://u:p@h:5432/d', ssl: false });
    expect(instances[0].end).toHaveBeenCalledTimes(1);
  });

  it('passa ssl com rejectUnauthorized=false quando ssl está ligado', async () => {
    const { FakeClient, instances } = makeFakeClient();
    await runDbCheck({ databaseUrl: 'postgresql://u:p@h:5432/d', ssl: true, Client: FakeClient });
    expect(instances[0].config.ssl).toEqual({ rejectUnauthorized: false });
  });

  it('retorna a mensagem de erro quando a conexão falha', async () => {
    const { FakeClient } = makeFakeClient({ connectError: new Error('ECONNREFUSED') });
    const result = await runDbCheck({ databaseUrl: 'postgresql://u:p@h:5432/d', ssl: true, Client: FakeClient });
    expect(result).toEqual({ ok: false, error: 'ECONNREFUSED' });
  });
});
