const { chromium } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test');

(async () => {
  const browser = await chromium.launch({ ignoreHTTPSErrors: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Capture console/network errors
  const errors = [];
  page.on('response', r => { if (!r.ok() && r.url().includes('font')) errors.push(`${r.status()} ${r.url()}`); });

  await page.goto('https://qa.bsm.pe', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Scroll a bit so nav is visible and on-purple
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(800);

  const state = await page.evaluate(() => {
    const nav = document.querySelector('.bsm-nav');
    return {
      classes: nav.className,
      links: ['WORK', 'ABOUT US', '¿LISTO PARA CAMBIAR?'].map(text => {
        const el = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === text);
        if (!el) return { text, error: 'not found' };
        const s = window.getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return { text, top: Math.round(r.top), fontFamily: s.fontFamily, fontSize: s.fontSize };
      })
    };
  });
  console.log('State:', JSON.stringify(state, null, 2));
  console.log('Font errors:', errors);

  await page.screenshot({ path: '/tmp/header-scrolled.png', clip: { x: 0, y: 0, width: 1440, height: 110 } });
  await browser.close();
})();
