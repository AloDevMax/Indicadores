import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { TEST_DATABASE_URL } from './server/test/globalSetup.mjs';

// Two projects: the frontend runs in jsdom, in parallel; the backend runs in
// node against a dedicated Postgres database (see server/test/globalSetup.mjs),
// one file at a time because that database is shared. TZ=UTC matches the
// production container (timestamp columns have no time zone).

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
          fileParallelism: false,
          globalSetup: ['./server/test/globalSetup.mjs'],
          env: { DATABASE_URL: TEST_DATABASE_URL, DIRECT_URL: TEST_DATABASE_URL, TZ: 'UTC' },
        },
      },
    ],
  },
});
