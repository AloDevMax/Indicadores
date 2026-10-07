// NOTE: this file intentionally avoids TypeScript-only syntax (type
// annotations, `type` imports) — e2e/**/*.ts is not covered by a TS-aware
// ESLint parser project (see eslint.config.js, which only wires up
// @typescript-eslint for src/**/*.{ts,tsx}), matching the existing
// e2e/smoke.spec.ts and e2e/auth.setup.ts convention.
import { test, expect } from '@playwright/test';
import crypto from 'node:crypto';
import * as XLSX from 'xlsx';

// Characterization E2E suite for the flows currently implemented inside
// AdminPanel.tsx (submissions review, badge award, Excel import) — written
// as a regression safety net BEFORE that ~1600-line component is split into
// smaller pieces. These specs assert CURRENT behavior; if AdminPanel.tsx's
// UI changes shape during the refactor, these tests are the tripwire.
//
// Runs against the dedicated e2e database (see playwright.config.ts), which
// the backend migrates and seeds with `--demo` on startup: the built-in
// developer account plus the demo badge catalog (server/db/seed.mjs) that
// these tests rely on directly instead of creating their own fixtures.

const DEVELOPER_EMAIL = 'alo.de.castro@hotmail.com';
// Mirrors server/config/env.mjs — env var wins if set, otherwise the same
// dev-only default the seed uses outside production.
// eslint-disable-next-line no-undef -- process.env is a Node global in a Playwright spec, not a browser one
const DEVELOPER_PASSWORD = process.env.DEVELOPER_INITIAL_PASSWORD || '2665398';
const TEST_PASSWORD = 'Senha123!';

// Real badges from the demo seed (server/db/seed.mjs) — used
// so tests don't need to create a badge before exercising submission/award
// flows against a real one.
const BADGE_PROCESSOS = 'Mestre de Processos';
const BADGE_SEGURANCA = 'Segurança em Primeiro Lugar';
const BADGE_EFICIENCIA = 'Ninja da Eficiência';

// Portuguese month names, mirrored from AdminPanel.tsx's MONTH_NAMES_PT so the
// import fixture's sheet name always matches whatever month the import modal
// defaults to (the component defaults `importMonth` to the current month).
const MONTH_NAMES_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

/**
 * Logs in via the login form and waits for the authenticated app shell
 * (identified by the navbar's "Sair" (logout) button — see Navbar.tsx, whose
 * title="Sair" is its only accessible name since the button has no text,
 * only an SVG icon) rather than guessing which route each role lands on.
 */
async function login(page, email, password) {
  await page.goto('/#/login');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  // Login redirects through a client-side chain (App.tsx: "/login" -> "/" ->
  // "/admin" or "/dashboard" depending on role, each a separate <Navigate>).
  // Waiting only for the navbar risks calling page.goto() while that chain
  // is still in flight — a goto() issued mid-chain gets silently clobbered
  // when the app's own in-flight <Navigate> resolves afterwards, bouncing
  // back to the overview route. Wait for the chain to settle first.
  await page.waitForURL(/#\/(admin|dashboard)/);
}

async function logout(page) {
  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page.getByRole('button', { name: 'Sair' })).not.toBeVisible();
}

/**
 * Registers a brand-new plain user through the UI (unique email per call so
 * repeat runs against the same long-lived e2e database don't collide —
 * mirrors the crypto.randomUUID() discipline used in server/auth/service.test.mjs).
 *
 * NOTE on selectors: Register.tsx's inputs have <label> text but no
 * htmlFor/id association and no placeholders, so there is no accessible way
 * to target them individually — falling back to `input[type=...]` + document
 * order (text, email, password, password) is the only reliable selector.
 */
async function registerUser(page) {
  const uid = crypto.randomUUID();
  const email = `e2e-${uid}@example.com`;
  const fullName = `E2E User ${uid.slice(0, 8)}`;

  await page.goto('/#/register');
  await page.locator('input[type="text"]').fill(fullName);
  await page.locator('input[type="email"]').fill(email);
  const passwordInputs = page.locator('input[type="password"]');
  await passwordInputs.nth(0).fill(TEST_PASSWORD);
  await passwordInputs.nth(1).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Criar minha conta' }).click();

  // Successful registration auto-logs-in (AuthContext.register sets user)
  // and App.tsx navigates away from /register once `user` is set, through
  // the same "/" -> "/dashboard" redirect chain login() waits out below.
  await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  await page.waitForURL(/#\/dashboard/);
  return { email, fullName };
}

/**
 * Opens the "Solicitar Selo" modal from the plain-user Dashboard (the
 * desktop-visible trigger is Dashboard.tsx's "Solicitar meu selo" button,
 * `hidden md:flex` — visible at Playwright's default desktop viewport) and
 * submits a request for a real seeded badge.
 */
async function submitBadgeRequest(page, badgeName, description) {
  await page.goto('/#/dashboard');
  await page.getByRole('button', { name: 'Solicitar meu selo' }).click();
  await expect(page.getByRole('heading', { name: 'Solicitar Selo' })).toBeVisible();
  await page.locator('select').selectOption({ label: badgeName });
  await page.getByPlaceholder('Detalhe sua ação de qualidade aqui...').fill(description);
  await page.getByRole('button', { name: 'Enviar Solicitação', exact: true }).click();
  await expect(
    page.getByText('Solicitação enviada com sucesso! Sua solicitação será revisada pelo Gestor.'),
  ).toBeVisible();
}

/**
 * Scopes to the single pending-submission card matching a given badge +
 * submitter name. AdminPanel.tsx gives submission cards no accessible role
 * or test id, so this is a structural fallback: `.space-y-4 > div` is the
 * pending-submissions list's direct children (each list item is one card),
 * narrowed further by the badge/user text unique to this test's fixture.
 */
function submissionCard(page, badgeName, userFullName) {
  return page
    .locator('div.space-y-4 > div')
    .filter({ hasText: badgeName })
    .filter({ hasText: userFullName });
}

/**
 * Scopes to the app-wide ConfirmDialog (ConfirmDialog.tsx) by its title
 * heading, then clicks the button with the given label *within* that dialog.
 * Necessary because the dialog's confirmLabel frequently repeats the text of
 * the button that triggered it (e.g. "Validar & Premiar" appears both on the
 * submission row and, again, as the dialog's confirm button), so an
 * unscoped getByRole('button', { name }) would match two elements at once.
 */
function confirmDialog(page, title) {
  return page.getByRole('heading', { name: title }).locator('xpath=..');
}

test.describe('Submission review flow', () => {
  test('a plain user requests a badge and the developer approves it', async ({ page }) => {
    const { fullName } = await registerUser(page);

    const description = `E2E approval proof ${crypto.randomUUID()}`;
    await submitBadgeRequest(page, BADGE_PROCESSOS, description);

    await logout(page);
    await login(page, DEVELOPER_EMAIL, DEVELOPER_PASSWORD);

    await page.goto('/#/admin/submissions');
    const card = submissionCard(page, BADGE_PROCESSOS, fullName);
    await expect(card).toHaveCount(1);
    await expect(card.getByText(description)).toBeVisible();

    await card.getByRole('button', { name: 'Validar & Premiar', exact: true }).click();

    const dialog = confirmDialog(page, 'Validar solicitação?');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(BADGE_PROCESSOS)).toBeVisible();
    await dialog.getByRole('button', { name: 'Validar & Premiar', exact: true }).click();

    await expect(page.getByText('Solicitação aprovada e selo concedido.')).toBeVisible();
    // The approved submission leaves the pending queue.
    await expect(submissionCard(page, BADGE_PROCESSOS, fullName)).toHaveCount(0);
  });
});

test.describe('Submission rejection flow', () => {
  test('the developer rejects a submission, distinctly from approval', async ({ page }) => {
    const { fullName } = await registerUser(page);

    const description = `E2E rejection proof ${crypto.randomUUID()}`;
    await submitBadgeRequest(page, BADGE_SEGURANCA, description);

    await logout(page);
    await login(page, DEVELOPER_EMAIL, DEVELOPER_PASSWORD);

    await page.goto('/#/admin/submissions');
    const card = submissionCard(page, BADGE_SEGURANCA, fullName);
    await expect(card).toHaveCount(1);

    await card.getByRole('button', { name: 'Recusar', exact: true }).click();

    const dialog = confirmDialog(page, 'Recusar solicitação?');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Recusar', exact: true }).click();

    // Rejection's toast text is distinguishable from approval's — it never
    // mentions the badge being granted.
    await expect(page.getByText('Solicitação rejeitada.')).toBeVisible();
    await expect(submissionCard(page, BADGE_SEGURANCA, fullName)).toHaveCount(0);
  });
});

test.describe('Award flow', () => {
  test('the developer awards a badge directly to a user', async ({ page }) => {
    await login(page, DEVELOPER_EMAIL, DEVELOPER_PASSWORD);
    await page.goto('/#/admin/award');

    // Awarding to the developer's own seeded account keeps this test
    // self-contained — no second user needed, and the account is guaranteed
    // to exist without extra setup.
    await page.getByPlaceholder('Buscar colaborador...').fill('Alo de Castro');
    await page.getByRole('button', { name: 'Alo de Castro', exact: true }).click();

    // Badge/tone tiles render two text nodes each (name + category, or label
    // + legend), so their accessible name is a concatenation — scope by
    // role + hasText instead of an exact name match.
    await page.getByRole('button').filter({ hasText: BADGE_EFICIENCIA }).click();
    await page.getByRole('button').filter({ hasText: 'Prata' }).click();

    await page.getByRole('button', { name: 'Conceder selos agora', exact: true }).click();

    const dialog = confirmDialog(page, 'Conceder selos?');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(BADGE_EFICIENCIA)).toBeVisible();
    await dialog.getByRole('button', { name: 'Conceder', exact: true }).click();

    await expect(page.getByText('1 colaboradores foram premiados!')).toBeVisible();
  });
});

test.describe('Excel import — monthly badge assignment', () => {
  test('the import modal renders its entry point (month/year selects, file input)', async ({ page }) => {
    await login(page, DEVELOPER_EMAIL, DEVELOPER_PASSWORD);
    await page.goto('/#/admin/award');

    await page.getByRole('button', { name: 'Importar Planilha Mensal', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Importar Planilha Mensal' })).toBeVisible();
    await expect(page.locator('select').filter({ hasText: 'Janeiro' })).toBeVisible();
    await expect(page.locator('select').filter({ hasText: '2026' })).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('a matching .xlsx file is parsed, matched, previewed, and imported end to end', async ({ page }) => {
    await login(page, DEVELOPER_EMAIL, DEVELOPER_PASSWORD);
    await page.goto('/#/admin/award');
    await page.getByRole('button', { name: 'Importar Planilha Mensal', exact: true }).click();

    // Ensure the "ind-nps" indicator badge actually exists in the catalog
    // (it's only pre-seeded on demand via this button — see
    // EXCEL_COLUMN_TO_BADGE_ID / handleExcelUpload in AdminPanel.tsx) so the
    // import produces a real, named badge award instead of a dangling id.
    await page.getByRole('button', { name: 'Criar selos de indicadores (executar uma vez)', exact: true }).click();
    const seedDialog = confirmDialog(page, 'Criar/atualizar selos de indicadores?');
    await expect(seedDialog).toBeVisible();
    await seedDialog.getByRole('button', { name: 'Confirmar', exact: true }).click();
    await expect(page.getByText('Selos de indicadores criados/atualizados com sucesso!')).toBeVisible();

    // Build a minimal workbook matching the import modal's default month
    // (AdminPanel.tsx defaults `importMonth` to the current month) with a
    // header row containing a "nome" column and an indicator keyword column
    // (see EXCEL_COLUMN_TO_BADGE_ID's 'nps' -> 'ind-nps' mapping), and one
    // data row for the developer's own seeded account so the name-matching
    // step auto-matches with 100% confidence (stringSimilarity requires an
    // exact normalized match to auto-match).
    const sheetName = MONTH_NAMES_PT[new Date().getMonth()];
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Nome do Colaborador', 'NPS'],
      ['Alo de Castro', 3], // 3 -> TONE_FROM_VALUE gold
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const fileBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    await page.locator('input[type="file"]').setInputFiles({
      name: 'indicadores.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: fileBuffer,
    });

    // Matching step: exactly one row, auto-matched to the developer account.
    // (Scoped to the truncated name cell specifically — "Alo de Castro" also
    // appears in the still-mounted award-page user list behind the modal and
    // in the row's manual-reassign <select>'s option, so an unscoped
    // getByText would be ambiguous.)
    await expect(page.getByText('1 colaboradores encontrados')).toBeVisible();
    await expect(page.locator('div.truncate').filter({ hasText: 'Alo de Castro' })).toBeVisible();

    await page.getByRole('button', { name: 'Ver preview →', exact: true }).click();

    await expect(page.getByText(`Preview — ${sheetName} ${new Date().getFullYear()}`)).toBeVisible();

    await page.getByRole('button', { name: 'Confirmar importação', exact: true }).click();
    const importDialog = confirmDialog(page, 'Confirmar importação?');
    await expect(importDialog).toBeVisible();
    await expect(importDialog.getByText('1 selo(s) serão importados')).toBeVisible();
    await importDialog.getByRole('button', { name: 'Confirmar importação', exact: true }).click();

    await expect(page.getByText('1 selos importados')).toBeVisible();
  });
});
