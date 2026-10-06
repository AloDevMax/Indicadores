import { afterAll, describe, expect, it } from 'vitest';
import { prisma } from './prisma.mjs';
import { resetDatabase } from '../../test/db.mjs';

describe('shared prisma client', () => {
  afterAll(async () => {
    await resetDatabase();
  });

  it('connects to the test database', async () => {
    const [{ current_database: name }] = await prisma.$queryRaw`select current_database()`;

    expect(name).toBe('labquest_test');
  });

  it('resetDatabase empties every table', async () => {
    await prisma.productiveUnit.create({ data: { id: 'pu-reset', name: 'Unidade reset' } });

    await resetDatabase();

    expect(await prisma.productiveUnit.count()).toBe(0);
  });
});
