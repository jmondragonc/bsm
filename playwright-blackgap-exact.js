const { chromium } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test');

(async () => {
  const browser = await chromium.launch({
    ignoreHTTPSErrors: true,
    args: ['--ignore-certificate-errors']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  console.log('Loading page...');
  await page.goto('https://bsm:8443/?v=' + Date.now(), { waitUntil: 'networkidle' });
  console.log('Page loaded.');

  const scrollPositions = [3200, 3400, 3600, 3800, 4000, 4100, 4200, 4400];
  const results = [];

  for (const scrollPos of scrollPositions) {
    await page.evaluate((s) => window.scrollTo(0, s), scrollPos);
    await page.waitForTimeout(300);

    const data = await page.evaluate(() => {
      const section = document.querySelector('.bsm-full-experience');
      const sRect = section.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // Clamp section to viewport
      const sTop = Math.max(0, sRect.top);
      const sBottom = Math.min(viewportH, sRect.bottom);
      const sectionVisibleH = Math.max(0, sBottom - sTop);

      // Find lowest visible content within section
      let lowestContentBottom = sTop; // start at top of visible section
      const allElements = section.querySelectorAll('h2, .tag');
      allElements.forEach(el => {
        const r = el.getBoundingClientRect();
        const elBottom = Math.min(r.bottom, sBottom);
        const elTop = Math.max(r.top, sTop);
        if (elTop < sBottom && elBottom > sTop) {
          // element is at least partially visible in the viewport
          lowestContentBottom = Math.max(lowestContentBottom, elBottom);
        }
      });

      // Black gap = visible section bottom - lowest content bottom
      const blackGap = Math.max(0, sBottom - lowestContentBottom);

      return {
        scroll: window.scrollY,
        sectionTop: Math.round(sRect.top),
        sectionBottom: Math.round(sRect.bottom),
        sectionVisibleH: Math.round(sectionVisibleH),
        lowestContentBottom: Math.round(lowestContentBottom),
        blackGap: Math.round(blackGap)
      };
    });

    results.push(data);
    console.log(JSON.stringify(data));
  }

  // Find max blackGap
  let maxGapEntry = results[0];
  for (const r of results) {
    if (r.blackGap > maxGapEntry.blackGap) maxGapEntry = r;
  }

  console.log('\n=== RESULTS TABLE ===');
  console.log('scroll | sectionTop | sectionBottom | sectionVisibleH | lowestContentBottom | blackGap');
  for (const r of results) {
    const flag = r.blackGap > 270 ? ' *** EXCEEDS 270px ***' : '';
    console.log(`${String(r.scroll).padStart(6)} | ${String(r.sectionTop).padStart(10)} | ${String(r.sectionBottom).padStart(13)} | ${String(r.sectionVisibleH).padStart(15)} | ${String(r.lowestContentBottom).padStart(19)} | ${String(r.blackGap).padStart(8)}${flag}`);
  }

  console.log(`\nMax blackGap: ${maxGapEntry.blackGap}px at scroll=${maxGapEntry.scroll}`);
  console.log(`Threshold 270px: ${maxGapEntry.blackGap <= 270 ? 'PASS' : 'FAIL'}`);

  // Screenshot at max gap scroll
  await page.evaluate((s) => window.scrollTo(0, s), maxGapEntry.scroll);
  await page.waitForTimeout(500);
  const maxGapPath = `/Users/joseph/Work/bsm/blackgap-maxgap-scroll${maxGapEntry.scroll}.png`;
  await page.screenshot({ path: maxGapPath, fullPage: false });
  console.log(`Screenshot at max gap (scroll=${maxGapEntry.scroll}): ${maxGapPath}`);

  // Screenshot at scroll 3400
  await page.evaluate(() => window.scrollTo(0, 3400));
  await page.waitForTimeout(500);
  const stablePath = `/Users/joseph/Work/bsm/blackgap-stable-3400.png`;
  await page.screenshot({ path: stablePath, fullPage: false });
  console.log(`Screenshot at scroll 3400: ${stablePath}`);

  await browser.close();
})();
