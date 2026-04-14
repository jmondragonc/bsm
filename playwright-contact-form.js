const { chromium, devices } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test');

(async () => {
  const browser = await chromium.launch({ ignoreHTTPSErrors: true });

  // Desktop
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://qa.bsm.pe', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { document.getElementById('contactDrawer').classList.add('is-open'); });
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/tmp/cf-desktop-after.png' });

  // Mobile
  const iPhone = devices['iPhone 12'];
  const mob = await browser.newPage({ ...iPhone });
  await mob.goto('https://qa.bsm.pe', { waitUntil: 'networkidle', timeout: 30000 });
  await mob.waitForTimeout(2000);
  await mob.evaluate(() => { document.getElementById('contactDrawer').classList.add('is-open'); });
  await mob.waitForTimeout(600);
  await mob.screenshot({ path: '/tmp/cf-mobile-after.png' });

  await browser.close();
  console.log('Done');
})();
