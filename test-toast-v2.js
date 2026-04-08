const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Interceptar respostas da API
  page.on('response', async (response) => {
    if (response.url().includes('/auth/register')) {
      console.log('\n📡 API Response Status:', response.status());
      try {
        const body = await response.text();
        console.log('📦 Response Body:', body.substring(0, 300));
      } catch (e) {}
    }
  });

  console.log('Abrindo página de registro...');
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle' });

  // Esperar carregar
  await page.waitForTimeout(2000);

  console.log('Preenchendo formulário...');
  await page.fill('input[name="name"]', 'Teste');
  await page.fill('input[name="lastName"]', 'User');
  await page.fill('input[name="phoneCountryCode"]', '55');
  await page.fill('input[name="phoneAreaCode"]', '88');
  await page.fill('input[name="phoneNumber"]', '999999999');
  await page.fill('input[name="email"]', 'marcelo_macedo01@hotmail.com');
  await page.fill('input[name="password"]', 'Test123456');
  await page.fill('input[name="confirmPassword"]', 'Test123456');

  console.log('Clicando no botão...');
  await page.click('button[type="submit"]');

  console.log('Aguardando 10 segundos para toast aparecer...');
  await page.waitForTimeout(10000);

  // Procurar toast de várias formas
  const selectors = [
    '.toast',
    '[role="alert"]',
    '.toast-title',
    '.toast-description',
    'div[class*="toast"]',
    'div[class*="alert"]',
    '.destructive'
  ];

  for (const selector of selectors) {
    const elements = await page.$$(selector);
    if (elements.length > 0) {
      console.log(`\n✅ Encontrado ${elements.length} elemento(s) com "${selector}":`);
      for (let i = 0; i < Math.min(elements.length, 3); i++) {
        const text = await elements[i].textContent();
        console.log(`   [${i}] ${text?.substring(0, 150)}`);
      }
    }
  }

  // Tirar screenshot para visualização
  await page.screenshot({ path: 'test-toast-screenshot.png', fullPage: true });
  console.log('\n📸 Screenshot salvo: test-toast-screenshot.png');

  console.log('\nNavegador aberto para você verificar manualmente.');
  console.log('Pressione Enter para fechar...\n');

  process.stdin.once('data', () => {
    browser.close();
    process.exit(0);
  });

})();
