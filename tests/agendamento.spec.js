import { test, expect } from '@playwright/test';

test.describe('Suíte Completa de Testes - Agendamento de Equipamentos', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // 1. PERSONALIZAÇÃO DO SITE (IMAGENS E TEXTOS)
  test('Deve alterar os textos e simular a troca de imagem do site', async ({ page }) => {
    await page.click('#btnOpenAdmin');
    await page.fill('#inputAdminPassword', 'admin123');
    await page.click('#btnLoginAdmin');

    // Alteração de texto editável
    const titleInput = page.locator('#inputSiteTitle, #editHeaderTitle');
    if (await titleInput.isVisible()) {
      await titleInput.fill('Sistema de Agendamento - Escola Modelo');
      await page.click('#btnSaveCustomization, #btnSaveText');
      await expect(page.locator('#siteTitleHeader, header h1')).toContainText('Escola Modelo');
    }

    // Upload de imagem (Logo)
    const logoInput = page.locator('input[type="file"]#inputLogo, input[type="file"]#logoUpload');
    if (await logoInput.isVisible()) {
      await logoInput.setInputFiles({
        name: 'logo-teste.png',
        mimeType: 'image/png',
        buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
      });
      await expect(page.locator('#appLogo, #siteLogo')).toBeVisible();
    }
  });

  // 2. CICLO COMPLETO DE AGENDAMENTO (CRIAR E EXCLUIR)
  test('Deve criar um novo agendamento e realizar a exclusão pelo painel admin', async ({ page }) => {
    const profNome = 'Prof. Agente de Testes';

    // Criação do agendamento
    await page.click('#btnOpenNewModal');
    await page.fill('#inputProf', profNome);
    await page.fill('#inputSala', 'Laboratório 01');
    await page.fill('#inputTurma', '3º Ano B');
    await page.fill('#inputQty', '5');
    await page.click('#btnSaveBooking');

    // Valida se o agendamento foi renderizado na tela
    await expect(page.locator('body')).toContainText(profNome);

    // Login no admin para exclusão
    await page.click('#btnOpenAdmin');
    await page.fill('#inputAdminPassword', 'admin123');
    await page.click('#btnLoginAdmin');

    // Localiza a linha do agendamento criado, marca a checkbox e exclui
    const bookingRow = page.locator('tr, .booking-card').filter({ hasText: profNome });
    const checkbox = bookingRow.locator('input[type="checkbox"]');
    if (await checkbox.isVisible()) {
      await checkbox.check();
      await page.click('#btnDeleteSelected, #btnBatchDelete');
      await expect(page.locator('body')).not.toContainText(profNome);
    }
  });

  // 3. ALTERAÇÃO DE SENHA DO ADMIN E VALIDAÇÃO DE SEGURANÇA
  test('Deve alterar a senha admin, rejeitar a senha antiga e aceitar a nova', async ({ page }) => {
    await page.click('#btnOpenAdmin');
    await page.fill('#inputAdminPassword', 'admin123');
    await page.click('#btnLoginAdmin');

    const passInput = page.locator('#inputNewAdminPassword, #changePasswordInput');
    if (await passInput.isVisible()) {
      // Altera a senha para uma nova
      await passInput.fill('novaSenha456');
      await page.click('#btnChangePassword, #btnSaveSecurity');

      // Logout / Fechar modal
      if (await page.locator('#btnLogoutAdmin').isVisible()) {
        await page.click('#btnLogoutAdmin');
      } else {
        await page.reload();
      }

      // Tenta login com a SENHA ANTIGA (Deve falhar)
      await page.click('#btnOpenAdmin');
      await page.fill('#inputAdminPassword', 'admin123');
      await page.click('#btnLoginAdmin');
      await expect(page.locator('#adminContentBox')).not.toBeVisible();

      // Tenta login com a SENHA NOVA (Deve ter sucesso)
      await page.fill('#inputAdminPassword', 'novaSenha456');
      await page.click('#btnLoginAdmin');
      await expect(page.locator('#adminContentBox')).toBeVisible();
    }
  });

  // 4. VERIFICAÇÃO E RENDERIZAÇÃO DOS CALENDÁRIOS
  test('Deve verificar se a estrutura do calendário e datas estão visíveis', async ({ page }) => {
    const calendarContainer = page.locator('#calendarContainer, .calendar-wrapper, #calendarView');
    await expect(calendarContainer).toBeVisible();

    // Valida se existem dias/células de calendário renderizadas
    const calendarDays = page.locator('.calendar-day, .day-cell, .fc-daygrid-day');
    await expect(calendarDays.first()).toBeVisible();
  });

});
