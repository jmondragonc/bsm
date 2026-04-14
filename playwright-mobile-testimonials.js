const { chromium, devices } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test');

(async () => {
  const browser = await chromium.launch({ ignoreHTTPSErrors: true });
  const iPhone = devices['iPhone 12'];
  const context = await browser.newContext({ 
    ...iPhone,
  });
  const page = await context.newPage();
  
  // Intercept CSS and log URLs
  page.on('response', async (resp) => {
    if (resp.url().includes('style') && resp.url().includes('css')) {
      console.log('CSS loaded:', resp.url(), resp.status());
    }
  });

  await page.goto('https://qa.bsm.pe?nocache=' + Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => {
    const el = document.querySelector('.testimonials-sticky-wrapper');
    if (!el) return { error: 'no wrapper' };
    // Check computed height
    const computed = window.getComputedStyle(el);
    return {
      height: el.offsetHeight,
      computedHeight: computed.height,
      offsetTop: el.offsetTop,
      vh: window.innerHeight,
      vw: window.innerWidth,
    };
  });
  console.log('INFO:', JSON.stringify(info, null, 2));

  if (info.error) { await browser.close(); return; }

  const { offsetTop, height } = info;

  const steps = [
    { name: 'before', scroll: offsetTop - 200 },
    { name: 'start', scroll: offsetTop },
    { name: 'quarter', scroll: offsetTop + height * 0.25 },
    { name: 'half', scroll: offsetTop + height * 0.5 },
    { name: 'threequarter', scroll: offsetTop + height * 0.75 },
    { name: 'end', scroll: offsetTop + height - 10 },
  ];

  for (const step of steps) {
    await page.evaluate((y) => window.scrollTo(0, y), step.scroll);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `/tmp/mob3-${step.name}.png` });
    console.log(`mob3-${step.name}.png @ scroll ${Math.round(step.scroll)}`);
  }

  await browser.close();
})();
