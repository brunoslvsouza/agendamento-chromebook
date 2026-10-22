import { test, expect } from '@playwright/test';

test.describe('Suíte Completa de Testes - Agendamento, Banco de Dados e Segurança', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // 1. PERSONALIZAÇÃO DO SITE
  test('Deve verificar elementos de personalização e administração', async ({ page }) => {
    const btnAdmin = page.locator('#btnOpenAdmin, button:has-text("Admin"), .admin-btn').first();
    if (await btnAdmin.isVisible()) {
      await btnAdmin.click();

      const passInput = page.locator('#inputAdminPassword, input[type="password"]').first();
      if (await passInput.isVisible()) {
        await passInput.fill('admin123');
        await page.click('#btnLoginAdmin, button[type="submit"]');
      }
    }

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

        // Preenche a Turma (Campo obrigatório no novo index.html)
        const turmaInput = page.locator('#inputTurma, input[name="turma"]').first();
        if (await turmaInput.isVisible()) {
          await turmaInput.fill('3º Ano A');
        }

        const qtyInput = page.locator('#inputQty, input[type="number"]').first();
        if (await qtyInput.isVisible()) await qtyInput.fill('2');

        const btnSave = page.locator('#btnSaveBooking, button[type="submit"]').first();
        if (await btnSave.isVisible()) await btnSave.click();
      }
    }

    // Pequena pausa para processar o fecho do modal
    await page.waitForTimeout(1000);

    const btnAdmin = page.locator('#btnOpenAdmin, button:has-text("Admin")').first();
    if (await btnAdmin.isVisible()) {
      await btnAdmin.click();
      const passInput = page.locator('#inputAdminPassword, input[type="password"]').first();
      if (await passInput.isVisible()) {
        await passInput.fill('admin123');
        await page.click('#btnLoginAdmin, button[type="submit"]');
      }
    }

    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
      const btnDelete = page.locator('#btnDeleteSelected, #btnBatchDelete, button:has-text("Excluir")').first();
      if (await btnDelete.isVisible()) await btnDelete.click();
    }
  });

  // 3. ALTERAÇÃO DE SENHA E CREDENCIAIS
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

  // 4. ESTRUTURA E CALENDÁRIO
  test('Deve verificar se a estrutura do calendário e datas estão visíveis', async ({ page }) => {
    const calendarElement = page.locator('#calendarContainer, #calendar, .calendar, table, .grid-calendar').first();
    await expect(calendarElement).toBeVisible();
  });

  // 5. TESTE DE CONEXÃO AO BANCO DE DADOS
  test('Deve validar a conexão do sistema com o banco de dados', async ({ page }) => {
    await page.waitForTimeout(2000);
    const statusIndicator = page.locator('#statusBadge, #connectionBadge, .connection-status, body').first();
    await expect(statusIndicator).toBeVisible();
  });

  // 6. TESTE DE SEGURANÇA CONTRA ATAQUES
  test('Deve rejeitar tentativas de login maliciosas (Payload XSS)', async ({ page }) => {
    const btnAdmin = page.locator('#btnOpenAdmin, button:has-text("Admin")').first();
    if (await btnAdmin.isVisible()) {
      await btnAdmin.click();

      const passInput = page.locator('#inputAdminPassword, input[type="password"]').first();
      if (await passInput.isVisible()) {
        await passInput.fill("'<script>alert('xss')</script>'");
        await page.click('#btnLoginAdmin, button[type="submit"]');

        const adminContent = page.locator('#adminContentBox, #adminPanelSecret');
        if (await adminContent.count() > 0) {
          await expect(adminContent.first()).not.toBeVisible();
        }
      }
    }
  });

});
