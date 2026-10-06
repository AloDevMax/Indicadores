#!/usr/bin/env node
// Diagnóstico de conexão com o PostgreSQL.
// Uso: npm run db:check  (dev, lê .env)  |  node scripts/dbCheck.mjs  (container)
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CONNECT_TIMEOUT_MS = 5000;

export const maskDatabaseUrl = (url) => url.replace(/:[^:@/]*@/, ':****@');

export const runDbCheck = async ({ databaseUrl, ssl, Client }) => {
  if (!databaseUrl) return { ok: false, error: 'DATABASE_URL não está definida' };

  const client = new Client({
    connectionString: databaseUrl,
    ssl: ssl ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
  });

  try {
    await client.connect();
  } catch (error) {
    return { ok: false, error: error.message };
  }

  try {
    const { rows: [info] } = await client.query('select now() as now, version() as version');
    const { rows: tableRows } = await client.query(
      `select table_name from information_schema.tables
       where table_schema = 'public' order by table_name`,
    );
    return {
      ok: true,
      version: info.version.split(',')[0],
      tables: tableRows.map((row) => row.table_name),
    };
  } catch (error) {
    return { ok: false, error: error.message };
  } finally {
    await client.end();
  }
};

const main = async () => {
  const { Client } = await import('pg');
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) console.log(`Conectando em ${maskDatabaseUrl(databaseUrl)}...`);

  const result = await runDbCheck({
    databaseUrl,
    ssl: process.env.DATABASE_SSL !== 'false',
    Client,
  });

  if (!result.ok) {
    console.error(`❌ Falha: ${result.error}`);
    process.exit(1);
  }

  console.log(`✅ Conectado: ${result.version}`);
  console.log(result.tables.length
    ? `Tabelas (${result.tables.length}): ${result.tables.join(', ')}`
    : '⚠️  Nenhuma tabela no schema public (rode as migrations)');
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
