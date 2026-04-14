const { chromium } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = '/Users/joseph/Work/bsm/transition-screenshots';

async function run() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const browser = await chromium.launch({
    ignoreHTTPSErrors: true,
    args: ['--ignore-certificate-errors']
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Loading page...');
  await page.goto('https://bsm:8443/?v=' + Date.now(), {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  console.log('Page loaded:', await page.title());

  // Step 1: Get experience wrapper height
  const wrapperInfo = await page.evaluate(() => {
    const el = document.querySelector('.bsm-experience-wrapper');
    if (!el) return { error: 'not found' };
    return {
      offsetHeight: el.offsetHeight,
      clientHeight: el.clientHeight,
      boundingRect: el.getBoundingClientRect(),
      offsetTop: el.offsetTop
    };
  });
  console.log('\n=== STEP 1: .bsm-experience-wrapper ===');
  console.log(JSON.stringify(wrapperInfo, null, 2));

  // Also get info about next section
  const nextSectionInfo = await page.evaluate(() => {
    // Find the "TRABAJAMOS CON CLIENTES" section
    const sections = document.querySelectorAll('section, .section, [class*="clients"], [class*="trabajamos"]');
    const results = [];
    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      const text = s.textContent?.substring(0, 100).trim();
      if (text && text.includes('TRABAJAMOS')) {
        results.push({
          tag: s.tagName,
          className: s.className.substring(0, 80),
          offsetTop: s.offsetTop,
          offsetHeight: s.offsetHeight,
          text: text.substring(0, 80)
        });
      }
    });
    // Also try to find by text
    const allEls = document.querySelectorAll('*');
    const found = [];
    for (const el of allEls) {
      if (el.children.length === 0 && el.textContent?.includes('TRABAJAMOS CON CLIENTES')) {
        const rect = el.getBoundingClientRect();
        found.push({
          tag: el.tagName,
          className: el.className?.substring?.(0, 80),
          offsetTop: el.offsetTop,
          closestSection: el.closest('section')?.offsetTop
        });
      }
    }
    return { sections: results, textMatches: found };
  });
  console.log('\n=== Next section info ===');
  console.log(JSON.stringify(nextSectionInfo, null, 2));

  // Step 2: Scroll from 3000 to 5000 in 100px steps, take screenshots at key points
  // Take ~15 screenshots spread across the range
  const scrollPositions = [];
  for (let pos = 3000; pos <= 5000; pos += 100) {
    scrollPositions.push(pos);
  }

  // Take screenshots at every other step (every 200px) to keep count ~10-15
  const screenshotPositions = scrollPositions.filter((_, i) => i % 2 === 0);

  console.log('\n=== STEP 2: Scrolling and measuring ===');

  const results = [];

  for (const pos of scrollPositions) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), pos);
    await page.waitForTimeout(150);

    const measurements = await page.evaluate((scrollY) => {
      const viewportHeight = window.innerHeight; // 900

      // Experience wrapper
      const expWrapper = document.querySelector('.bsm-experience-wrapper');
      const expRect = expWrapper ? expWrapper.getBoundingClientRect() : null;

      // Tags
      const tags = document.querySelectorAll('.bsm-experience-tag, [class*="tag"], .tag');
      const visibleTags = [];
      tags.forEach(t => {
        const r = t.getBoundingClientRect();
        if (r.top < viewportHeight && r.bottom > 0) {
          visibleTags.push({ text: t.textContent?.trim().substring(0, 30), top: r.top, bottom: r.bottom });
        }
      });

      // Title
      const titles = document.querySelectorAll('h1, h2, h3, [class*="title"]');
      const visibleTitles = [];
      titles.forEach(t => {
        const r = t.getBoundingClientRect();
        if (r.top < viewportHeight && r.bottom > 0 && t.textContent?.trim().length > 5) {
          visibleTitles.push({ text: t.textContent?.trim().substring(0, 50), top: Math.round(r.top), bottom: Math.round(r.bottom) });
        }
      });

      // Next section
      const allSections = document.querySelectorAll('section');
      const visibleSections = [];
      allSections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.top < viewportHeight && r.bottom > 0) {
          visibleSections.push({
            className: s.className?.substring?.(0, 60),
            top: Math.round(r.top),
            bottom: Math.round(r.bottom),
            visibleHeight: Math.round(Math.min(r.bottom, viewportHeight) - Math.max(r.top, 0))
          });
        }
      });

      // Estimate black/empty area
      // Look at what's visible in viewport
      let contentCoverage = 0;
      const allVisible = document.querySelectorAll('*');
      // Instead, let's estimate by checking the experience section and next section coverage

      let expVisibleBottom = expRect ? Math.min(expRect.bottom, viewportHeight) : 0;
      let expVisibleTop = expRect ? Math.max(expRect.top, 0) : 0;
      let expVisibleHeight = Math.max(0, expVisibleBottom - expVisibleTop);

      // Find next section after experience
      let nextSectionTop = viewportHeight;
      let nextSectionVisible = 0;
      allSections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (expRect && r.top > expRect.bottom - 10 && r.top < viewportHeight) {
          nextSectionTop = Math.min(nextSectionTop, r.top);
          nextSectionVisible = Math.max(0, Math.min(r.bottom, viewportHeight) - Math.max(r.top, 0));
        }
      });

      // Gap between experience wrapper bottom and next section
      const gapTop = expRect ? Math.max(0, expRect.bottom) : 0;
      const gapBottom = nextSectionTop < viewportHeight ? nextSectionTop : viewportHeight;
      const gapVisible = Math.max(0, Math.min(gapBottom, viewportHeight) - Math.max(gapTop, 0));

      // Check sticky content in experience section
      const stickyEls = document.querySelectorAll('[style*="sticky"], .sticky, [class*="sticky"]');
      const visibleSticky = [];
      stickyEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < viewportHeight && r.bottom > 0) {
          visibleSticky.push({ className: el.className?.substring?.(0, 40), top: Math.round(r.top), bottom: Math.round(r.bottom) });
        }
      });

      return {
        scrollY,
        viewportHeight,
        expRect: expRect ? { top: Math.round(expRect.top), bottom: Math.round(expRect.bottom), height: Math.round(expRect.height) } : null,
        expVisibleHeight: Math.round(expVisibleHeight),
        nextSectionTop: Math.round(nextSectionTop),
        nextSectionVisible: Math.round(nextSectionVisible),
        gapVisible: Math.round(gapVisible),
        gapPercent: Math.round(gapVisible / viewportHeight * 100),
        visibleSections: visibleSections.slice(0, 5),
        visibleTitlesCount: visibleTitles.length,
        visibleTitles: visibleTitles.slice(0, 3),
        visibleTagsCount: visibleTags.length,
        visibleStickyCount: visibleSticky.length,
        visibleSticky: visibleSticky.slice(0, 3)
      };
    }, pos);

    results.push(measurements);

    const shouldScreenshot = screenshotPositions.includes(pos);
    if (shouldScreenshot) {
      const filename = path.join(SCREENSHOTS_DIR, `scroll-${pos}.png`);
      await page.screenshot({ path: filename });
      console.log(`Screenshot at ${pos}: ${filename}`);
    }

    const gapFlag = measurements.gapVisible > 270 ? ' *** BIG GAP ***' : '';
    const emptyFlag = measurements.gapPercent > 30 ? ' *** EMPTY >30% ***' : '';
    console.log(`pos=${pos}: expBottom=${measurements.expRect?.bottom}, gap=${measurements.gapVisible}px (${measurements.gapPercent}%), nextVisible=${measurements.nextSectionVisible}px, tags=${measurements.visibleTagsCount}, titles=${measurements.visibleTitlesCount}${gapFlag}${emptyFlag}`);
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  const bigGaps = results.filter(r => r.gapPercent > 30);
  if (bigGaps.length === 0) {
    console.log('GOOD: No scroll position had >30% empty black area');
  } else {
    console.log(`WARNING: ${bigGaps.length} positions had >30% empty black:`);
    bigGaps.forEach(r => console.log(`  pos=${r.scrollY}: gap=${r.gapVisible}px (${r.gapPercent}%)`));
  }

  // Find stable frame with all content visible
  const stableFrames = results.filter(r => r.visibleTagsCount >= 3 && r.visibleTitlesCount >= 1);
  console.log(`\nStable frames (tags>=3 + title>=1): ${stableFrames.length}`);
  if (stableFrames.length > 0) {
    const f = stableFrames[0];
    console.log(`First stable frame at scroll ${f.scrollY}: tags=${f.visibleTagsCount}, titles=${f.visibleTitlesCount}`);
  }

  // Save full results JSON
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'results.json'), JSON.stringify(results, null, 2));
  console.log(`\nFull results saved to ${SCREENSHOTS_DIR}/results.json`);

  // Take a final screenshot at the "stable frame" if found
  if (stableFrames.length > 0) {
    const stablePos = stableFrames[Math.floor(stableFrames.length / 2)].scrollY;
    await page.evaluate((y) => window.scrollTo(0, y), stablePos);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'stable-frame.png') });
    console.log(`Stable frame screenshot at scroll ${stablePos}`);
  }

  await browser.close();
  console.log('\nDone.');
}

run().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
