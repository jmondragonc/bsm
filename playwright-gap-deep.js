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

  async function scrollTo(y) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(400);
  }

  // More precise gap check: what's the lowest visible content pixel in viewport?
  async function preciseGapCheck() {
    return await page.evaluate(() => {
      // Get all elements in viewport with background color or content
      const allEls = Array.from(document.querySelectorAll('*'));
      let lowestContentBottom = 0;
      let highestNextContentTop = 900;

      // Get the brand/experience section
      const brandSection = document.querySelector('.bsm-full-experience');
      const workSection = document.querySelector('.bsm-work');

      const brandRect = brandSection ? brandSection.getBoundingClientRect() : null;
      const workRect = workSection ? workSection.getBoundingClientRect() : null;

      // Check the sticky inner content position
      const stickyEl = brandSection ? brandSection.querySelector('[class*="sticky"], [style*="sticky"], [style*="position: sticky"]') : null;
      const innerEls = brandSection ? Array.from(brandSection.querySelectorAll('*')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < 900 && rect.height > 0;
      }) : [];

      // Find the bottom-most element within the brand section that's in viewport
      let brandContentBottom = 0;
      innerEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > brandContentBottom && rect.bottom <= 900) {
          brandContentBottom = rect.bottom;
        }
      });

      // The "gap" = from the bottom of visible brand content to viewport bottom (or work section top)
      const workTop = workRect ? workRect.top : 900;
      const effectiveGap = workTop > 900 ? (900 - brandContentBottom) : Math.max(0, workTop - brandContentBottom);

      return {
        scrollY: window.scrollY,
        brandSectionRect: brandRect ? { top: Math.round(brandRect.top), bottom: Math.round(brandRect.bottom) } : null,
        workSectionRect: workRect ? { top: Math.round(workRect.top), bottom: Math.round(workRect.bottom) } : null,
        brandContentBottom: Math.round(brandContentBottom),
        workSectionTop: Math.round(workTop),
        effectiveGap: Math.round(effectiveGap),
        viewportHeight: 900
      };
    });
  }

  // Also check by pixel sampling - look at background colors along a vertical strip
  async function samplePixelColors(x, yPositions) {
    // Use screenshot and check colors
    const screenshot = await page.screenshot({ fullPage: false });
    // We'll get element details at each y position instead
    return await page.evaluate((positions) => {
      return positions.map(y => {
        const el = document.elementFromPoint(720, y); // center x
        if (!el) return { y, element: null };
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          y,
          tagName: el.tagName,
          class: el.className ? el.className.toString().substring(0, 60) : '',
          bgColor: style.backgroundColor,
          rect: { top: Math.round(rect.top), bottom: Math.round(rect.bottom) }
        };
      });
    }, yPositions);
  }

  // Scan the transition range more carefully
  console.log('\n=== Precise gap scan across transition range ===');
  const scanPoints = [3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 5000, 5200, 5400];

  const results = [];
  for (const scrollY of scanPoints) {
    await scrollTo(scrollY);
    const gapInfo = await preciseGapCheck();

    // Sample pixels at key viewport heights
    const pixelSamples = await samplePixelColors(720, [100, 200, 300, 400, 500, 600, 700, 800, 870]);

    // Find where content ends (background switches from content to black/empty)
    const blackStart = pixelSamples.find(p => {
      return p.bgColor && (p.bgColor.includes('0, 0, 0') || p.bgColor === 'rgb(0, 0, 0)') &&
        p.class && p.class.includes('bsm');
    });

    console.log(`\nScroll ${scrollY}:`);
    console.log(`  Brand section bottom in viewport: ${gapInfo.brandSectionRect ? gapInfo.brandSectionRect.bottom : 'n/a'}`);
    console.log(`  Work section top in viewport: ${gapInfo.workSectionRect ? gapInfo.workSectionRect.top : 'n/a'}`);
    console.log(`  Brand content bottom: ${gapInfo.brandContentBottom}`);
    console.log(`  Effective gap: ${gapInfo.effectiveGap}px`);

    // Log what's at each y position
    console.log('  Pixel samples:');
    pixelSamples.forEach(p => {
      console.log(`    y=${p.y}: ${p.tagName} .${p.class.substring(0,30)} bg=${p.bgColor}`);
    });

    results.push({ scrollY, gapInfo });

    if (scrollY === 4000 || scrollY === 4200 || scrollY === 4400) {
      await page.screenshot({ path: path.join(outDir, `gap-scroll-${scrollY}.png`), fullPage: false });
    }
  }

  // Find max gap
  const maxGap = Math.max(...results.map(r => r.gapInfo.effectiveGap));
  console.log(`\n=== SUMMARY ===`);
  console.log(`Max effective gap: ${maxGap}px`);
  results.forEach(r => {
    console.log(`  scroll ${r.scrollY}: gap=${r.gapInfo.effectiveGap}px`);
  });

  await browser.close();
})();
