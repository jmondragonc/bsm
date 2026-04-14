const { chromium } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test');
const path = require('path');
const fs = require('fs');

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

  // Screenshot at stable frame ~3000
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/joseph/Work/bsm/gap-screenshot-stable-3000.png', fullPage: false });
  console.log('Screenshot taken at scroll 3000');

  const results = [];
  let maxGap = 0;
  let maxGapScroll = 0;

  // Scroll from 3200 to 4500 in steps of 100
  for (let scroll = 3200; scroll <= 4500; scroll += 100) {
    await page.evaluate((s) => window.scrollTo(0, s), scroll);
    await page.waitForTimeout(200);

    const measurements = await page.evaluate(() => {
      const section = document.querySelector('.bsm-full-experience');
      if (!section) return { error: 'No .bsm-full-experience found' };

      const sectionRect = section.getBoundingClientRect();
      const sectionBottom = sectionRect.bottom;
      const sectionTop = sectionRect.top;

      // Find all visible content elements inside the section
      // Look for direct children and meaningful content elements
      const contentSelectors = [
        '.bsm-full-experience .experience-content',
        '.bsm-full-experience .bsm-experience-content',
        '.bsm-full-experience [class*="content"]',
        '.bsm-full-experience [class*="slide"]',
        '.bsm-full-experience [class*="item"]',
        '.bsm-full-experience [class*="panel"]',
        '.bsm-full-experience p',
        '.bsm-full-experience h1',
        '.bsm-full-experience h2',
        '.bsm-full-experience h3',
        '.bsm-full-experience ul',
        '.bsm-full-experience li',
        '.bsm-full-experience img',
        '.bsm-full-experience svg',
        '.bsm-full-experience video',
      ];

      let lowestBottom = null;
      let lowestElement = null;

      // Get all elements inside section
      const allElements = section.querySelectorAll('*');

      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return;

        const rect = el.getBoundingClientRect();
        // Only consider elements that are at least partially in viewport
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        // Only consider elements with some visual size
        if (rect.width < 10 || rect.height < 10) return;

        if (lowestBottom === null || rect.bottom > lowestBottom) {
          lowestBottom = rect.bottom;
          lowestElement = el.tagName + (el.className ? '.' + el.className.split(' ').slice(0,2).join('.') : '');
        }
      });

      const gap = lowestBottom !== null ? sectionBottom - lowestBottom : null;

      return {
        sectionTop,
        sectionBottom,
        sectionHeight: sectionRect.height,
        contentBottom: lowestBottom,
        contentElement: lowestElement,
        gap,
        scrollY: window.scrollY,
        viewportHeight: window.innerHeight
      };
    });

    results.push({ scroll, ...measurements });

    if (measurements.gap !== null && measurements.gap > maxGap) {
      maxGap = measurements.gap;
      maxGapScroll = scroll;
    }

    console.log(`scroll=${scroll} | sectionBottom=${measurements.sectionBottom?.toFixed(1)} | contentBottom=${measurements.contentBottom?.toFixed(1)} | gap=${measurements.gap?.toFixed(1)} | elem=${measurements.contentElement}`);
  }

  // Screenshot at max gap
  await page.evaluate((s) => window.scrollTo(0, s), maxGapScroll);
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/joseph/Work/bsm/gap-screenshot-maxgap-' + maxGapScroll + '.png', fullPage: false });
  console.log(`Screenshot taken at max gap scroll=${maxGapScroll}, gap=${maxGap.toFixed(1)}px`);

  // Screenshot at work section entering (~4400-4500)
  await page.evaluate(() => window.scrollTo(0, 4400));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/joseph/Work/bsm/gap-screenshot-work-entering-4400.png', fullPage: false });
  console.log('Screenshot taken at scroll 4400 (work section entering)');

  console.log('\n=== SUMMARY ===');
  console.log(`Maximum black gap: ${maxGap.toFixed(1)}px at scroll position ${maxGapScroll}`);
  console.log(`Target: ≤270px | Status: ${maxGap <= 270 ? 'PASS' : 'FAIL'}`);

  // Print full table
  console.log('\nFull measurements:');
  console.log('scroll | sectionBottom | contentBottom | gap');
  results.forEach(r => {
    console.log(`${r.scroll.toString().padStart(5)} | ${(r.sectionBottom||'N/A').toString().padStart(13)} | ${(r.contentBottom||'N/A').toString().padStart(13)} | ${(r.gap||'N/A').toString().padStart(6)}`);
  });

  await browser.close();
})();
