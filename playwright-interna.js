const { chromium } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test');

(async () => {
  const browser = await chromium.launch({ ignoreHTTPSErrors: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://qa.bsm.pe/proyecto/organa', { waitUntil: 'networkidle' });

  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const sections = [
    { name: 'hero',    y: 0 },
    { name: 'titulo',  y: 800 },
    { name: 'galeria', y: 1700 },
    { name: 'mas',     y: Math.max(0, pageHeight - 1800) },
    { name: 'footer',  y: Math.max(0, pageHeight - 900) },
  ];

  for (const s of sections) {
    const scrollY = Math.min(s.y, Math.max(0, pageHeight - 900));
    await page.evaluate(y => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `interna-${s.name}.png` });
  }

  await browser.close();
  console.log('Done, pageHeight:', pageHeight);
})();
