// NOTE: no TypeScript-only syntax here — e2e/**/*.ts is linted without a
// TS-aware parser (see the note at the top of e2e/admin-flows.spec.ts).
import { test, expect } from '@playwright/test';
import crypto from 'node:crypto';

const DEVELOPER_EMAIL = 'alo.de.castro@hotmail.com';
// eslint-disable-next-line no-undef -- process.env is a Node global in a Playwright spec, not a browser one
const DEVELOPER_PASSWORD = process.env.DEVELOPER_INITIAL_PASSWORD || '2665398';
const NEW_PASSWORD = 'MinhaSenha123';

async function submitLogin(page, email, password) {
  await page.goto('/#/login');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
}

async function logout(page) {
  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page.getByRole('button', { name: 'Sair' })).not.toBeVisible();
}

test.describe('Temporary password flow', () => {
  test('admin creates a user without a password, the user must change the temporary one on first login', async ({ page }) => {
    const uid = crypto.randomUUID();
    const email = `e2e-temp-${uid}@example.com`;
    const fullName = `E2E Temp ${uid.slice(0, 8)}`;

    // 1. The developer creates the account without typing a password.
    await submitLogin(page, DEVELOPER_EMAIL, DEVELOPER_PASSWORD);
    await page.waitForURL(/#\/admin/);
    await page.goto('/#/admin/users');
    await page.getByRole('button', { name: '+ Novo Colaborador' }).click();
    await page.locator('input[name="full_name"]').fill(fullName);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('select[name="productive_unit_id"]').selectOption('pu1');
    await page.getByRole('button', { name: 'Salvar', exact: true }).click();

    // 2. The generated password is shown once, then dismissed.
    const dialog = page.getByRole('dialog', { name: 'Senhas temporárias' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(email)).toBeVisible();
    const temporaryPassword = (await dialog.locator('code').textContent()) || '';
    expect(temporaryPassword).toMatch(/^[A-HJ-NP-Za-km-z2-9]{12}$/);
    await dialog.getByRole('button', { name: 'Já anotei' }).click();
    await expect(dialog).not.toBeVisible();
    await logout(page);

    // 3. First login with the temporary password lands on "Meu perfil" and nothing else is reachable.
    await submitLogin(page, email, temporaryPassword);
    await page.waitForURL(/#\/settings$/);
    await expect(page.getByText(/Defina uma nova senha para continuar/)).toBeVisible();
    await page.goto('/#/dashboard');
    await expect(page).toHaveURL(/#\/settings$/);

    // 4. Changing the password unlocks the app.
    await page.getByLabel('Senha atual').fill(temporaryPassword);
    await page.getByLabel('Nova senha', { exact: true }).fill(NEW_PASSWORD);
    await page.getByLabel('Confirmar nova senha').fill(NEW_PASSWORD);
    await page.getByRole('button', { name: 'Trocar senha' }).click();
    await expect(page.getByText('Senha alterada.')).toBeVisible();
    await expect(page.getByText(/Defina uma nova senha para continuar/)).not.toBeVisible();

    await page.goto('/#/dashboard');
    await expect(page).toHaveURL(/#\/dashboard$/);
    await logout(page);

    // 5. The new password works; the temporary one no longer does.
    await submitLogin(page, email, NEW_PASSWORD);
    await page.waitForURL(/#\/dashboard$/);
    await logout(page);

    await page.goto('/#/login');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(temporaryPassword);
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page.getByText('Credenciais inválidas.')).toBeVisible();
  });
});
