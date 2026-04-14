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

  // Inspect the actual visual elements at scroll 3200 to understand what's "content"
  await page.evaluate(() => window.scrollTo(0, 3200));
  await page.waitForTimeout(300);

  const contentScan = await page.evaluate(() => {
    const section = document.querySelector('.bsm-full-experience');
    const sRect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // Get all leaf-level or meaningful visual elements
    const allEls = Array.from(section.querySelectorAll('*'));

    // Find elements that have actual rendered visual content
    // (not just wrappers)
    const visualEls = allEls.filter(el => {
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (style.display === 'none') return false;
      if (r.width < 10 || r.height < 10) return false;
      if (r.bottom < 0 || r.top > vh) return false;

      // Has children? Is it a pure wrapper?
      const hasTextContent = el.childNodes.length > 0 &&
        Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
      const hasVisualChildren = el.querySelector('img, svg, canvas, video') !== null;
      const isLeaf = el.children.length === 0;
      const isSpan = el.tagName === 'SPAN';

      return isLeaf || isSpan || hasTextContent || hasVisualChildren;
    });

    return visualEls.map(el => {
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        class: el.className.substring(0, 50),
        bottom: r.bottom.toFixed(1),
        top: r.top.toFixed(1),
        left: r.left.toFixed(1),
        right: r.right.toFixed(1),
        opacity: style.opacity,
        transform: style.transform !== 'none' ? style.transform.substring(0, 30) : null,
        textContent: el.textContent.substring(0, 30).trim()
      };
    });
  });

  console.log('\n=== VISUAL ELEMENTS at scroll 3200 ===');
  contentScan.forEach(el => {
    console.log(`${el.tag}.${el.class} | bottom=${el.bottom} | opacity=${el.opacity} | text="${el.textContent}"`);
  });

  // Now scan with proper gap measurement - only leaf/real content elements
  // Key insight: the H2 has translateY(900) - it's below viewport in section coords
  // The .services-tags > .tag spans are the actual visual content
  // Let's measure the real gap by checking tags visibility

  console.log('\n=== TAG VISIBILITY SCAN (exit range) ===');

  const results = [];
  let maxGap = 0;
  let maxGapScroll = 3200;

  // Screenshot at stable
  await page.evaluate(() => window.scrollTo(0, 3200));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/Users/joseph/Work/bsm/gap-v4-stable-3200.png' });

  for (let scroll = 3200; scroll <= 5400; scroll += 100) {
    await page.evaluate((s) => window.scrollTo(0, s), scroll);
    await page.waitForTimeout(150);

    const m = await page.evaluate(() => {
      const section = document.querySelector('.bsm-full-experience');
      if (!section) return null;
      const sRect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      const visibleTop = Math.max(sRect.top, 0);
      const visibleBottom = Math.min(sRect.bottom, vh);

      if (visibleBottom <= visibleTop) return { visible: false };

      // Find all .tag spans and the H2 text lines (BR-split lines)
      // Also check the actual painted bottom of the h2
      const tags = Array.from(section.querySelectorAll('.services-tags .tag'));
      const h2 = section.querySelector('h2');

      let lowestBottom = null;
      let lowestEl = 'none';

      // Check tags
      tags.forEach(tag => {
        const style = window.getComputedStyle(tag);
        const op = parseFloat(style.opacity);
        if (op < 0.05) return;
        const r = tag.getBoundingClientRect();
        if (r.bottom < visibleTop || r.top > visibleBottom) return;
        if (r.width < 5 || r.height < 5) return;
        const elBot = Math.min(r.bottom, visibleBottom);
        if (lowestBottom === null || elBot > lowestBottom) {
          lowestBottom = elBot;
          lowestEl = tag.tagName + '.' + tag.className;
        }
      });

      // Check H2 - it may have text lines visible
      // H2 has a translateY transform, so its getBoundingClientRect already accounts for transform
      if (h2) {
        const style = window.getComputedStyle(h2);
        const op = parseFloat(style.opacity);
        const r = h2.getBoundingClientRect();
        if (op >= 0.05 && r.bottom >= visibleTop && r.top <= visibleBottom) {
          const elBot = Math.min(r.bottom, visibleBottom);
          if (lowestBottom === null || elBot > lowestBottom) {
            lowestBottom = elBot;
            lowestEl = 'H2.mobile-break';
          }
        }
      }

      // Also check any other direct non-wrapper children
      const allLeaves = Array.from(section.querySelectorAll('span, p, li, img, svg, canvas, video'));
      allLeaves.forEach(el => {
        const style = window.getComputedStyle(el);
        const op = parseFloat(style.opacity);
        if (op < 0.05) return;
        if (style.display === 'none' || style.visibility === 'hidden') return;
        const r = el.getBoundingClientRect();
        if (r.bottom < visibleTop || r.top > visibleBottom) return;
        if (r.width < 5 || r.height < 5) return;
        const elBot = Math.min(r.bottom, visibleBottom);
        if (lowestBottom === null || elBot > lowestBottom) {
          lowestBottom = elBot;
          lowestEl = el.tagName + '.' + el.className.substring(0,30);
        }
      });

      const gap = lowestBottom !== null ? visibleBottom - lowestBottom : visibleBottom - visibleTop;

      return {
        scrollY: window.scrollY,
        sectionTop: sRect.top.toFixed(1),
        sectionBottom: sRect.bottom.toFixed(1),
        visibleTop: visibleTop.toFixed(1),
        visibleBottom: visibleBottom.toFixed(1),
        contentBottom: lowestBottom ? lowestBottom.toFixed(1) : null,
        contentEl: lowestEl,
        gap: gap.toFixed(1),
        visible: true
      };
    });

    if (!m) continue;
    results.push({ scroll, ...m });

    if (m.visible) {
      const gapVal = parseFloat(m.gap || 0);
      if (gapVal > maxGap) {
        maxGap = gapVal;
        maxGapScroll = scroll;
      }
      console.log(`scroll=${scroll} | secTop=${m.sectionTop} secBot=${m.sectionBottom} | visBot=${m.visibleBottom} | contBot=${m.contentBottom} | gap=${m.gap} | el=${m.contentEl}`);
    } else {
      console.log(`scroll=${scroll} | NOT VISIBLE`);
    }
  }

  // Screenshot at max gap
  await page.evaluate((s) => window.scrollTo(0, s), maxGapScroll);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `/Users/joseph/Work/bsm/gap-v4-maxgap-${maxGapScroll}.png` });
  console.log(`\nScreenshot: max gap=${maxGap.toFixed(1)}px at scroll=${maxGapScroll}`);

  // Screenshot at work/next section entering
  // Section exits at 5400, so ~5000-5200 shows it halfway out
  await page.evaluate(() => window.scrollTo(0, 5000));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/Users/joseph/Work/bsm/gap-v4-work-entering-5000.png' });
  console.log('Screenshot: section half-exited at 5000');

  console.log('\n=== SUMMARY ===');
  console.log(`Maximum black gap: ${maxGap.toFixed(1)}px at scroll position ${maxGapScroll}`);
  console.log(`Target: ≤270px | Status: ${maxGap <= 270 ? 'PASS' : 'FAIL'}`);

  await browser.close();
})();
