const { chromium } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test');

(async () => {
  const browser = await chromium.launch({ ignoreHTTPSErrors: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  // Disable cache
  await context.route('**/*', route => route.continue());
  await page.setCacheEnabled ? page.setCacheEnabled(false) : null;

  console.log('Loading page...');
  await page.goto('https://bsm:8443/?v=' + Date.now(), { waitUntil: 'networkidle' });
  console.log('Page loaded.');

  // 1. Wrapper height
  const wrapperHeight = await page.evaluate(() => {
    const el = document.querySelector('.bsm-experience-wrapper');
    return el ? el.offsetHeight : null;
  });
  console.log(`\n1. .bsm-experience-wrapper offsetHeight = ${wrapperHeight}px`);
  const expected = Math.round(2.2 * 900);
  console.log(`   Expected ~${expected}px (220vh × 900px) — diff: ${wrapperHeight - expected}px`);

  // 2. Scroll from 2800 to 4500 every 150px
  console.log('\n2. Scroll measurements (2800–4500 step 150):');
  console.log('   scroll | sec.top | sec.bottom | h2.bottom | gap');

  let maxGap = -Infinity;
  let maxGapScroll = null;

  for (let scroll = 2800; scroll <= 4500; scroll += 150) {
    await page.evaluate(y => window.scrollTo(0, y), scroll);
    await page.waitForTimeout(80);

    const data = await page.evaluate(() => {
      const sec = document.querySelector('.bsm-full-experience');
      const h2 = document.querySelector('.bsm-full-experience h2');
      if (!sec || !h2) return null;
      const sr = sec.getBoundingClientRect();
      const h2r = h2.getBoundingClientRect();
      return {
        secTop: Math.round(sr.top),
        secBottom: Math.round(sr.bottom),
        h2Bottom: Math.round(h2r.bottom),
        gap: Math.round(sr.bottom - h2r.bottom)
      };
    });

    if (!data) {
      console.log(`   scroll=${scroll} | no elements found`);
      continue;
    }

    console.log(`   scroll=${scroll} | secTop=${data.secTop} secBottom=${data.secBottom} h2Bottom=${data.h2Bottom} gap=${data.gap}`);

    if (data.gap > maxGap) {
      maxGap = data.gap;
      maxGapScroll = scroll;
    }
  }

  // Take screenshot at max gap scroll
  if (maxGapScroll !== null) {
    await page.evaluate(y => window.scrollTo(0, y), maxGapScroll);
    await page.waitForTimeout(100);
    const screenshotPath = `/Users/joseph/Work/bsm/quick-test-maxgap-${maxGapScroll}.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`\n   Screenshot at max gap scroll: ${screenshotPath}`);
  }

  // 3. Report
  console.log('\n3. Results:');
  console.log(`   Max gap = ${maxGap}px at scroll=${maxGapScroll}`);
  console.log(`   Exceeds 270px (30% of 900px)? ${maxGap > 270 ? 'YES (' + maxGap + 'px > 270px)' : 'NO (' + maxGap + 'px ≤ 270px)'}`);

  await browser.close();
})();
