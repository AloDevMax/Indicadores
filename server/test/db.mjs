import { prisma } from '../shared/db/prisma.mjs';

export const resetDatabase = async () => {
  const tables = await prisma.$queryRaw`
    select tablename from pg_tables
    where schemaname = 'public' and tablename <> '_prisma_migrations'`;
  if (tables.length === 0) return;
  const list = tables.map(({ tablename }) => `"${tablename}"`).join(', ');
  await prisma.$executeRawUnsafe(`truncate ${list} restart identity cascade`);
};
