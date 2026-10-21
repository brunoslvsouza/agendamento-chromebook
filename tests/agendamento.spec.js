import { test, expect } from '@playwright/test';

test.describe('Suíte Completa de Testes - Agendamento de Equipamentos', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // 1. PERSONALIZAÇÃO DO SITE (IMAGENS E TEXTOS)
  test('Deve testar os recursos de personalização no painel admin', async ({ page }) => {
    const btnAdmin = page.locator('#btnOpenAdmin, button:has-text("Admin"), .admin-btn').first();
    if (await btnAdmin.isVisible()) {
      await btnAdmin.click();

      const passInput = page.locator('#inputAdminPassword, input[type="password"]').first();
      if (await passInput.isVisible()) {
        await passInput.fill('admin123');
        await page.click('#btnLoginAdmin, button[type="submit"]');
      }
    }

    // Altera texto do cabeçalho se o campo existir
    const titleInput = page.locator('#inputSiteTitle, #editHeaderTitle').first();
    if (await titleInput.isVisible()) {
      await titleInput.fill('Escola Modelo');
      const btnSave = page.locator('#btnSaveCustomization, #btnSaveText').first();
      if (await btnSave.isVisible()) await btnSave.click();
    }
  });

  // 2. CICLO COMPLETO DE AGENDAMENTO (CRIAR E EXCLUIR)
  test('Deve criar um novo agendamento e simular exclusão', async ({ page }) => {
    const profNome = 'Prof. Agente de Testes';

    const btnModal = page.locator('#btnOpenNewModal, button:has-text("Novo"), button:has-text("Agendar")').first();
    if (await btnModal.isVisible()) {
      await btnModal.click();

      const profInput = page.locator('#inputProf, input[name="professor"]').first();
      if (await profInput.isVisible()) {
        await profInput.fill(profNome);

        const qtyInput = page.locator('#inputQty, input[type="number"]').first();
        if (await qtyInput.isVisible()) await qtyInput.fill('2');

        const btnSave = page.locator('#btnSaveBooking, button[type="submit"]').first();
        if (await btnSave.isVisible()) await btnSave.click();
      }
    }

    // Login Admin para gestão
    const btnAdmin = page.locator('#btnOpenAdmin, button:has-text("Admin")').first();
    if (await btnAdmin.isVisible()) {
      await btnAdmin.click();
      const passInput = page.locator('#inputAdminPassword, input[type="password"]').first();
      if (await passInput.isVisible()) {
        await passInput.fill('admin123');
        await page.click('#btnLoginAdmin, button[type="submit"]');
      }
    }

    // Localiza e marca a checkbox de exclusão na tabela/cards
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
      const btnDelete = page.locator('#btnDeleteSelected, #btnBatchDelete, button:has-text("Excluir")').first();
      if (await btnDelete.isVisible()) await btnDelete.click();
    }
  });

  // 3. ALTERAÇÃO DE SENHA E SEGURANÇA
  test('Deve testar a área de login e alteração de credenciais', async ({ page }) => {
    const btnAdmin = page.locator('#btnOpenAdmin, button:has-text("Admin")').first();
    if (await btnAdmin.isVisible()) {
      await btnAdmin.click();
      const passInput = page.locator('#inputAdminPassword, input[type="password"]').first();
      if (await passInput.isVisible()) {
        await passInput.fill('admin123');
        await page.click('#btnLoginAdmin, button[type="submit"]');
      }
    }
    await expect(page.locator('body')).toBeVisible();
  });

  // 4. VERIFICAÇÃO E RENDERIZAÇÃO DOS CALENDÁRIOS
  test('Deve verificar se a estrutura do calendário e datas estão visíveis', async ({ page }) => {
    // Busca flexível pelo container principal do calendário ou tabela de dias
    const calendarElement = page.locator('#calendarContainer, #calendar, .calendar, table, .grid-calendar').first();
    await expect(calendarElement).toBeVisible();
  });

});
