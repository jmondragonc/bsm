const { chromium } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true, ignoreHTTPSErrors: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  const outDir = '/Users/joseph/Work/bsm/brand-section-screenshots';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  console.log('Loading page...');
  await page.goto('https://bsm:8443/?v=' + Date.now(), { waitUntil: 'networkidle' });
  console.log('Page loaded.');

  // Helper: scroll to position and wait
  async function scrollTo(y) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(400);
  }

  // Helper: get h2 info in the brand section
  async function getH2Info() {
    return await page.evaluate(() => {
      // Find the h2 in the CREAMOS section
      const h2s = Array.from(document.querySelectorAll('h2'));
      const h2 = h2s.find(el => el.textContent.includes('CREAMOS') || el.textContent.includes('EXPERIENCIA'));
      if (!h2) return { error: 'h2 not found', allH2s: h2s.map(el => el.textContent.trim().substring(0, 50)) };
      const rect = h2.getBoundingClientRect();
      const style = window.getComputedStyle(h2);
      return {
        text: h2.textContent.trim().substring(0, 80),
        rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width, height: rect.height },
        transform: style.transform,
        opacity: style.opacity,
        visibility: style.visibility
      };
    });
  }

  // Helper: check tags visibility
  async function getTagsInfo() {
    return await page.evaluate(() => {
      // Find tag elements in the brand section
      const section = document.querySelector('.brand-section, [class*="brand"], [class*="experience"], [class*="creamos"]');
      // Try to find tags by common patterns
      const tags = Array.from(document.querySelectorAll('.tag, [class*="tag"], .pill, [class*="pill"]'));
      const visibleTags = tags.filter(t => {
        const rect = t.getBoundingClientRect();
        return rect.top < 900 && rect.bottom > 0 && rect.width > 0;
      });
      return {
        totalTags: tags.length,
        visibleTags: visibleTags.length,
        tagTexts: visibleTags.slice(0, 10).map(t => t.textContent.trim().substring(0, 30)),
        sectionFound: !!section,
        sectionClass: section ? section.className : null
      };
    });
  }

  // Helper: measure black gap between sections
  async function measureBlackGap() {
    return await page.evaluate(() => {
      // Look for the brand/experience section and the work section after it
      const allSections = Array.from(document.querySelectorAll('section, [class*="section"], .wp-block-group'));

      // Find the sticky/hero brand section
      const brandSection = allSections.find(s =>
        s.textContent.includes('CREAMOS') && s.textContent.includes('EXPERIENCIA')
      );

      if (!brandSection) {
        // Try finding by scroll position - look for sections near current view
        const viewportSections = allSections.filter(s => {
          const rect = s.getBoundingClientRect();
          return rect.bottom > 0 && rect.top < 900;
        });
        return {
          error: 'brandSection not found',
          viewportSections: viewportSections.map(s => ({
            class: s.className.substring(0, 50),
            rect: { top: Math.round(s.getBoundingClientRect().top), bottom: Math.round(s.getBoundingClientRect().bottom) }
          }))
        };
      }

      const brandRect = brandSection.getBoundingClientRect();

      // Find next visible section
      const nextSection = allSections.find(s => {
        if (s === brandSection) return false;
        const rect = s.getBoundingClientRect();
        return rect.top >= brandRect.bottom - 10;
      });

      const blackGap = nextSection ?
        Math.max(0, nextSection.getBoundingClientRect().top - Math.max(0, brandRect.bottom)) :
        Math.max(0, 900 - Math.max(0, brandRect.bottom));

      return {
        brandSectionBottom: Math.round(brandRect.bottom),
        nextSectionTop: nextSection ? Math.round(nextSection.getBoundingClientRect().top) : null,
        nextSectionClass: nextSection ? nextSection.className.substring(0, 50) : null,
        blackGap: Math.round(blackGap),
        scrollY: window.scrollY
      };
    });
  }

  // STEP 1: Scroll to ~3000 (stable frame area)
  console.log('\n=== STEP 1: Scroll to 3000 (stable frame) ===');
  await scrollTo(3000);
  const h2_3000 = await getH2Info();
  const tags_3000 = await getTagsInfo();
  console.log('H2 at 3000:', JSON.stringify(h2_3000, null, 2));
  console.log('Tags at 3000:', JSON.stringify(tags_3000, null, 2));
  await page.screenshot({ path: path.join(outDir, '01-scroll-3000.png'), fullPage: false });

  // STEP 2: Sample at 3500, 3700, 3900 — h2 transform check
  const collapseScrollPositions = [3500, 3700, 3900];
  const collapseData = [];

  for (const scrollY of collapseScrollPositions) {
    console.log(`\n=== Scroll to ${scrollY} ===`);
    await scrollTo(scrollY);
    const h2Info = await getH2Info();
    const tagsInfo = await getTagsInfo();
    console.log(`H2 at ${scrollY}:`, JSON.stringify(h2Info, null, 2));
    console.log(`Tags at ${scrollY}:`, JSON.stringify(tagsInfo, null, 2));
    await page.screenshot({ path: path.join(outDir, `02-scroll-${scrollY}.png`), fullPage: false });
    collapseData.push({ scrollY, h2Info, tagsInfo });
  }

  // STEP 3: Check black gap at 4000, 4200, 4400
  const gapScrollPositions = [4000, 4200, 4400];
  const gapData = [];

  for (const scrollY of gapScrollPositions) {
    console.log(`\n=== Scroll to ${scrollY} (gap check) ===`);
    await scrollTo(scrollY);
    const h2Info = await getH2Info();
    const gapInfo = await measureBlackGap();
    console.log(`H2 at ${scrollY}:`, JSON.stringify(h2Info, null, 2));
    console.log(`Gap at ${scrollY}:`, JSON.stringify(gapInfo, null, 2));
    await page.screenshot({ path: path.join(outDir, `03-scroll-${scrollY}.png`), fullPage: false });
    gapData.push({ scrollY, h2Info, gapInfo });
  }

  // Also do a broader scan for stable frame - check when all tags visible
  console.log('\n=== Scanning for stable frame (2500-3500 range) ===');
  const stableScan = [];
  for (const scrollY of [2500, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500]) {
    await scrollTo(scrollY);
    const h2Info = await getH2Info();
    const tagsInfo = await getTagsInfo();
    stableScan.push({
      scrollY,
      h2Transform: h2Info.transform,
      h2Top: h2Info.rect ? h2Info.rect.top : null,
      visibleTags: tagsInfo.visibleTags,
      totalTags: tagsInfo.totalTags
    });
  }
  console.log('\nStable frame scan:');
  stableScan.forEach(s => console.log(JSON.stringify(s)));

  // Final: get all section info at current scroll to understand layout
  console.log('\n=== Layout exploration at scroll 3000 ===');
  await scrollTo(3000);
  const layoutInfo = await page.evaluate(() => {
    const allSections = Array.from(document.querySelectorAll('section, .wp-block-group, [class*="section"]'));
    return allSections
      .filter(s => s.textContent.length > 20)
      .map(s => {
        const rect = s.getBoundingClientRect();
        return {
          tag: s.tagName,
          class: s.className.substring(0, 60),
          textSnippet: s.textContent.trim().substring(0, 40),
          rect: { top: Math.round(rect.top), bottom: Math.round(rect.bottom), height: Math.round(rect.height) },
          scrollTop: Math.round(window.scrollY + rect.top)
        };
      })
      .filter(s => s.rect.height > 50)
      .slice(0, 20);
  });
  console.log('\nLayout info:');
  layoutInfo.forEach(s => console.log(JSON.stringify(s)));

  await browser.close();
  console.log('\nDone! Screenshots saved to:', outDir);
})();
