import { test, expect } from '@playwright/test';

test.describe('Testes de Validação do Agendamento', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Deve bloquear agendamento quando a quantidade excede o estoque', async ({ page }) => {
    await page.click('#btnOpenNewModal');

    await page.fill('#inputProf', 'Prof. Agente de Testes');
    await page.fill('#inputSala', 'Sala 12');
    await page.fill('#inputTurma', '1º Ano A');
    await page.fill('#inputQty', '100');

    const stockBadge = page.locator('#stockCheckBadge');
    await expect(stockBadge).toContainText('Indisponível');

    const submitBtn = page.locator('#btnSaveBooking');
    await expect(submitBtn).toBeDisabled();
  });

  test('Deve realizar o login com sucesso no Painel Admin', async ({ page }) => {
    await page.click('#btnOpenAdmin');

    await page.fill('#inputAdminPassword', 'admin123');
    await page.click('#btnLoginAdmin');

    const adminContent = page.locator('#adminContentBox');
    await expect(adminContent).toBeVisible();
  });

});
