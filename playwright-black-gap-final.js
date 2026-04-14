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

  // Screenshot at stable frame ~3200
  await page.evaluate(() => window.scrollTo(0, 3200));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/Users/joseph/Work/bsm/gap-v2-stable-3200.png', fullPage: false });
  console.log('Screenshot: stable at 3200');

  const results = [];
  let maxGap = 0;
  let maxGapScroll = 4500;

  // The section exits from scroll ~4500 to ~5400
  // Scan 3200 to 5500 in steps of 100
  for (let scroll = 3200; scroll <= 5500; scroll += 100) {
    await page.evaluate((s) => window.scrollTo(0, s), scroll);
    await page.waitForTimeout(150);

    const m = await page.evaluate(() => {
      const section = document.querySelector('.bsm-full-experience');
      if (!section) return { error: 'No section' };

      const sRect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // sectionBottom in viewport: clamped to what's visible
      // The visible part of the section is from max(sRect.top,0) to min(sRect.bottom, vh)
      const visibleTop = Math.max(sRect.top, 0);
      const visibleBottom = Math.min(sRect.bottom, vh);

      if (visibleBottom <= visibleTop) {
        return { scroll: window.scrollY, sectionVisible: false };
      }

      // Find the LOWEST visible content element within the section
      // Exclude the container/wrapper divs that span the full section
      const allEls = Array.from(section.querySelectorAll('*'));
      let lowestBottom = null;
      let lowestEl = null;

      allEls.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return;

        const op = parseFloat(style.opacity);
        if (op < 0.05) return; // effectively invisible

        const r = el.getBoundingClientRect();

        // Must be in the visible portion of the section
        if (r.bottom <= visibleTop || r.top >= visibleBottom) return;
        // Must have meaningful size
        if (r.width < 5 || r.height < 5) return;

        // Skip wrapper containers that span the full section height (they're not "content")
        const isFullSpan = (r.top <= sRect.top + 5) && (r.bottom >= sRect.bottom - 5);
        if (isFullSpan) return;

        // The visible bottom of this element
        const elVisibleBottom = Math.min(r.bottom, visibleBottom);

        if (lowestBottom === null || elVisibleBottom > lowestBottom) {
          lowestBottom = elVisibleBottom;
          lowestEl = el.tagName + (el.className ? '.' + Array.from(el.classList).slice(0,2).join('.') : '');
        }
      });

      // gap = space between lowest content and bottom of visible section
      const gap = lowestBottom !== null ? visibleBottom - lowestBottom : null;

      return {
        scrollY: window.scrollY,
        sectionTop: sRect.top.toFixed(1),
        sectionBottom: sRect.bottom.toFixed(1),
        visibleTop: visibleTop.toFixed(1),
        visibleBottom: visibleBottom.toFixed(1),
        contentBottom: lowestBottom ? lowestBottom.toFixed(1) : null,
        contentEl: lowestEl,
        gap: gap !== null ? gap.toFixed(1) : null,
        sectionVisible: true
      };
    });

    results.push({ scroll, ...m });

    if (m.sectionVisible && m.gap !== null) {
      const gapVal = parseFloat(m.gap);
      if (gapVal > maxGap) {
        maxGap = gapVal;
        maxGapScroll = scroll;
      }
      console.log(`scroll=${scroll} | secTop=${m.sectionTop} secBot=${m.sectionBottom} | visBot=${m.visibleBottom} | contBot=${m.contentBottom} | gap=${m.gap} | el=${m.contentEl}`);
    } else if (!m.sectionVisible) {
      console.log(`scroll=${scroll} | section NOT visible`);
    }
  }

  // Screenshot at max gap
  await page.evaluate((s) => window.scrollTo(0, s), maxGapScroll);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `/Users/joseph/Work/bsm/gap-v2-maxgap-${maxGapScroll}.png`, fullPage: false });
  console.log(`\nScreenshot: max gap at scroll=${maxGapScroll}, gap=${maxGap.toFixed(1)}px`);

  // Screenshot at work section entering (find where next section enters)
  // From scan, section exits around 5400, so next section enters ~5200-5400
  await page.evaluate(() => window.scrollTo(0, 5200));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/Users/joseph/Work/bsm/gap-v2-next-section-5200.png', fullPage: false });
  console.log('Screenshot: next section entering at 5200');

  console.log('\n=== SUMMARY ===');
  console.log(`Maximum black gap: ${maxGap.toFixed(1)}px at scroll position ${maxGapScroll}`);
  console.log(`Target: ≤270px | Status: ${maxGap <= 270 ? 'PASS ✓' : 'FAIL ✗'}`);

  await browser.close();
})();
