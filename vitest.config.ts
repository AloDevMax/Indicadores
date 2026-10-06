import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { TEST_DATABASE_URL } from './server/test/globalSetup.mjs';

// Two projects: the frontend runs in jsdom, in parallel; the backend runs in
// node against a dedicated Postgres database (see server/test/globalSetup.mjs),
// one file at a time because that database is shared.

// Temporary (Fase 2): these files still build their fixtures through the
// in-memory fallback store. They run against an unreachable database so the
// pg repositories fall back to memory, exactly as before. Each file leaves this
// list when its repository moves to Prisma; the list is gone by the end of Fase 2.
const LEGACY_MEMORY_TESTS = [
  'server/index.test.mjs',
  'server/auth/service.test.mjs',
  'server/admin/repository.test.mjs',
  'server/operations/repository.test.mjs',
];
const UNREACHABLE_DATABASE_URL = 'postgresql://legacy:legacy@127.0.0.1:1/memory_fallback';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  test: {
    exclude: ['node_modules', 'dist', 'e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}', 'server/**/*.mjs'],
      exclude: ['src/**/*.test.{ts,tsx}', 'server/**/*.test.mjs', 'src/main.tsx'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'client',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'server',
          environment: 'node',
          include: ['server/**/*.test.mjs', 'scripts/**/*.test.mjs'],
          exclude: [...LEGACY_MEMORY_TESTS, 'node_modules', 'dist', 'e2e'],
          fileParallelism: false,
          globalSetup: ['./server/test/globalSetup.mjs'],
          env: { DATABASE_URL: TEST_DATABASE_URL, DIRECT_URL: TEST_DATABASE_URL, DATABASE_SSL: 'false' },
        },
      },
      {
        extends: true,
        test: {
          name: 'server-legacy',
          environment: 'node',
          include: LEGACY_MEMORY_TESTS,
          env: { DATABASE_URL: UNREACHABLE_DATABASE_URL, DATABASE_SSL: 'false' },
        },
      },
    ],
  },
});
