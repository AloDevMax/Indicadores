import { test, expect } from '@playwright/test';

// Doesn't require any seeded account or auth state — safe to run against any
// environment (memory-fallback dev, or a real Postgres-backed dev DB).
test.describe('Login page', () => {
  test('renders the login form with email, password, and submit', async ({ page }) => {
    await page.goto('/#/login');

    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible();
  });

  test('links to the registration page', async ({ page }) => {
    await page.goto('/#/login');

    await page.getByRole('link', { name: 'Cadastre-se' }).click();
    await expect(page).toHaveURL(/#\/register$/);
  });

  test('shows an error message on invalid credentials', async ({ page }) => {
    await page.goto('/#/login');

    await page.getByPlaceholder('seu@email.com').fill('nao-existe@example.com');
    await page.getByPlaceholder('••••••••').fill('senha-errada');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();

    await expect(page.getByText('Credenciais inválidas.')).toBeVisible();
  });
});
