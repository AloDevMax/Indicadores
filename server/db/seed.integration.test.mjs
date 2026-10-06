import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../shared/db/prisma.mjs';
import { resetDatabase } from '../test/db.mjs';
import { DEMO_DATA, runSeed } from './seed.mjs';

const DEVELOPER_EMAIL = 'alo.de.castro@hotmail.com';

const counts = async () => ({
  users: await prisma.user.count(),
  developers: await prisma.user.count({ where: { email: DEVELOPER_EMAIL } }),
  badges: await prisma.badge.count(),
  productiveUnits: await prisma.productiveUnit.count(),
  importSources: await prisma.importSource.count(),
});

beforeEach(async () => {
  await resetDatabase();
});

describe('runSeed', () => {
  it('only ensures the developer account by default, and can run twice', async () => {
    await runSeed();
    await runSeed();

    expect(await counts()).toEqual({ users: 1, developers: 1, badges: 0, productiveUnits: 0, importSources: 0 });
    expect(await prisma.user.findUnique({ where: { email: DEVELOPER_EMAIL } })).toMatchObject({
      full_name: 'Alo de Castro', role: 'admin', email_verified: true,
    });
  });

  it('also upserts the demo data with demo: true, and can run twice', async () => {
    await runSeed({ demo: true });
    await runSeed({ demo: true });

    expect(await counts()).toEqual({ users: 1, developers: 1, badges: 4, productiveUnits: 3, importSources: 1 });
    expect(await prisma.badge.findUnique({ where: { id: '1' } })).toMatchObject({ name: 'Mestre de Processos', points: 50 });
    expect(await prisma.productiveUnit.findUnique({ where: { id: 'pu1' } })).toMatchObject({ name: 'Fábrica Campinas' });
    expect(await prisma.importSource.findUnique({ where: { id: 'source-default' } })).toMatchObject({
      name: 'Planilha Operacional',
      productive_unit_column: 'unidade_produtiva',
      user_column: 'colaborador',
      badge_column: 'selo',
      tone_column: 'marcacao',
      award_column: 'premio',
    });
  });

  it('exposes the demo data it writes', () => {
    expect(DEMO_DATA.badges.map((badge) => badge.id)).toEqual(['1', '2', '3', '4']);
    expect(DEMO_DATA.productiveUnits.map((unit) => unit.id)).toEqual(['pu1', 'pu2', 'pu3']);
    expect(DEMO_DATA.importSources.map((source) => source.id)).toEqual(['source-default']);
  });
});
