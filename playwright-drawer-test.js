const { chromium } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test');

(async () => {
  const browser = await chromium.launch({ ignoreHTTPSErrors: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  const jsErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') jsErrors.push(msg.text()); });
  page.on('pageerror', err => jsErrors.push(err.message));

  await page.goto('https://bsm:8443/?v=' + Date.now(), { waitUntil: 'networkidle' });

  await page.click('#openContactDrawer');
  await page.waitForTimeout(700);

  const debug = await page.evaluate(() => {
    const drawer = document.getElementById('contactDrawer');
    const overlay = document.getElementById('contactDrawerOverlay');
    const rect = drawer.getBoundingClientRect();
    const style = window.getComputedStyle(drawer);
    return {
      isOpen: drawer.classList.contains('is-open'),
      rect: { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      transform: style.transform,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      zIndex: style.zIndex,
      overlayOpen: overlay.classList.contains('is-open'),
      bodyOverflow: window.getComputedStyle(document.body).overflow,
      htmlOverflow: window.getComputedStyle(document.documentElement).overflow,
      // Check if any ancestor has a transform
      ancestorTransforms: (() => {
        let el = drawer.parentElement;
        const results = [];
        while (el && el !== document.documentElement) {
          const t = window.getComputedStyle(el).transform;
          if (t && t !== 'none') results.push({ tag: el.tagName, class: el.className, transform: t });
          el = el.parentElement;
        }
        return results;
      })()
    };
  });

  console.log('Debug:', JSON.stringify(debug, null, 2));
  console.log('JS errors:', jsErrors.length ? jsErrors : 'none');

  await page.screenshot({ path: '/Users/joseph/Work/bsm/drawer-after.png', fullPage: false });
  await browser.close();
})();
