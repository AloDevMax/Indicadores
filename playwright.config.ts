import { defineConfig, devices } from '@playwright/test';

// eslint-disable-next-line no-undef -- CI is a Node env var, not a browser global; see eslint.config.js
const isCI = !!process.env.CI;

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
      command: 'node --env-file=.env server/index.mjs',
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
