#!/usr/bin/env node
// Diagnóstico de conexão com o PostgreSQL.
// Uso: npm run db:check  (dev, lê .env)  |  node scripts/dbCheck.mjs  (container)
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const maskDatabaseUrl = (url) => url.replace(/:[^:@/]*@/, ':****@');

// createClient(databaseUrl) devolve um client com a interface do PrismaClient
// ($connect, $queryRaw, $disconnect); os testes injetam um fake.
export const runDbCheck = async ({ databaseUrl, createClient }) => {
  if (!databaseUrl) return { ok: false, error: 'DATABASE_URL não está definida' };

  const client = createClient(databaseUrl);

  try {
    await client.$connect();
    const [info] = await client.$queryRaw`select now() as now, version() as version`;
    const tableRows = await client.$queryRaw`
      select table_name from information_schema.tables
      where table_schema = 'public' order by table_name`;
    return {
      ok: true,
      version: info.version.split(',')[0],
      tables: tableRows.map((row) => row.table_name),
    };
  } catch (error) {
    return { ok: false, error: error.message };
  } finally {
    await client.$disconnect();
  }
};

const main = async () => {
  const { PrismaClient } = await import('@prisma/client');
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) console.log(`Conectando em ${maskDatabaseUrl(databaseUrl)}...`);

  const result = await runDbCheck({
    databaseUrl,
    createClient: (datasourceUrl) => new PrismaClient({ datasourceUrl }),
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
