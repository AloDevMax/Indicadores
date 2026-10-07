import { execSync } from 'node:child_process';

export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'postgresql://labquest:labquest@localhost:5432/labquest_test';

export default function setup() {
  const databaseName = new URL(TEST_DATABASE_URL).pathname.slice(1);
  if (!databaseName.endsWith('_test')) {
    throw new Error(`Recusando rodar testes contra "${databaseName}": o banco de teste deve terminar em _test`);
  }

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL, DIRECT_URL: TEST_DATABASE_URL },
  });
}
