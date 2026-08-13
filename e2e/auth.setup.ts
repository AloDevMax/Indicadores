import { test as setup, expect } from '@playwright/test';

// Template for role-based authenticated E2E fixtures — one storageState file
// per role (user / supervisor / admin / developer), so specs can start
// pre-logged-in instead of repeating the login flow in every test.
//
// This file is DORMANT by default: Playwright's default testMatch only picks
// up `*.spec.ts` / `*.test.ts`, so `*.setup.ts` files are ignored unless you
// wire them into a dedicated project. To enable:
//
// 1. Seed (or already have) a real account for each role you want to cover
//    in whichever backend this runs against (memory-fallback dev or a real
//    Postgres dev DB — credentials are NOT portable between the two).
// 2. Provide credentials via env vars, e.g. in `.env.test`:
//      E2E_USER_EMAIL=joao@acme.com
//      E2E_USER_PASSWORD=joao123
//      E2E_ADMIN_EMAIL=admin@test.com
//      E2E_ADMIN_PASSWORD=admin123
//      E2E_SUPERVISOR_EMAIL=...
//      E2E_SUPERVISOR_PASSWORD=...
//      E2E_DEVELOPER_EMAIL=...
//      E2E_DEVELOPER_PASSWORD=...
// 3. Add a `setup` project to playwright.config.ts and make role-specific
//    projects depend on it, e.g.:
//      projects: [
//        { name: 'setup', testMatch: /.*\.setup\.ts/ },
//        {
//          name: 'chromium-admin',
//          use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/admin.json' },
//          dependencies: ['setup'],
//        },
//      ]
//
// Roles without configured credentials are skipped, not failed, so partial
// setups (e.g. only `admin` configured) still run cleanly.

// { role, emailEnvVar, passwordEnvVar }
const ROLE_FIXTURES = [
  { role: 'user', emailEnvVar: 'E2E_USER_EMAIL', passwordEnvVar: 'E2E_USER_PASSWORD' },
  { role: 'supervisor', emailEnvVar: 'E2E_SUPERVISOR_EMAIL', passwordEnvVar: 'E2E_SUPERVISOR_PASSWORD' },
  { role: 'admin', emailEnvVar: 'E2E_ADMIN_EMAIL', passwordEnvVar: 'E2E_ADMIN_PASSWORD' },
  { role: 'developer', emailEnvVar: 'E2E_DEVELOPER_EMAIL', passwordEnvVar: 'E2E_DEVELOPER_PASSWORD' },
];

for (const fixture of ROLE_FIXTURES) {
  setup(`authenticate as ${fixture.role}`, async ({ page }) => {
    // eslint-disable-next-line no-undef -- process.env is a Node global, not a browser one; see eslint.config.js
    const env = process.env;
    const email = env[fixture.emailEnvVar];
    const password = env[fixture.passwordEnvVar];

    setup.skip(!email || !password, `${fixture.emailEnvVar}/${fixture.passwordEnvVar} not configured`);

    await page.goto('/#/login');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(password);
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();

    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).not.toBeVisible();
    await page.context().storageState({ path: `playwright/.auth/${fixture.role}.json` });
  });
}
