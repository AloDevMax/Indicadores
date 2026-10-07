import { defineConfig, devices } from '@playwright/test';

// eslint-disable-next-line no-undef -- CI is a Node env var, not a browser global; see eslint.config.js
const isCI = !!process.env.CI;

// E2E runs against its own database so it never touches the dev data. The
// backend entry migrates it and writes the demo seed (badges, units, import
// source) before listening; specs rely on those demo badges.
// eslint-disable-next-line no-undef -- process.env is a Node global; see eslint.config.js
const E2E_DATABASE_URL = process.env.E2E_DATABASE_URL || 'postgresql://labquest:labquest@localhost:5432/labquest_e2e';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Two separate entries (not `npm run dev:full`) so Playwright waits for each
  // service's own port — the backend connects to the database before it
  // starts listening (and exits if it can't), independent of Vite being
  // ready. A single readiness check on :3000 let tests start firing requests
  // at a backend that wasn't listening yet.
  webServer: [
    {
      command: 'npx prisma migrate deploy && node server/db/seed.mjs --demo && node server/index.mjs',
      env: { DATABASE_URL: E2E_DATABASE_URL, DIRECT_URL: E2E_DATABASE_URL, STORAGE_DRIVER: 'local', PORT: '4004' },
      port: 4004,
      reuseExistingServer: !isCI,
      timeout: 120 * 1000,
    },
    {
      command: 'npm run dev:client',
      url: 'http://localhost:3000',
      reuseExistingServer: !isCI,
      timeout: 120 * 1000,
    },
  ],
});
