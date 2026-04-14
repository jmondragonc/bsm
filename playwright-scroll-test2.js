const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = '/Users/joseph/Work/bsm/scroll-screenshots';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function scrollTo(page, y) {
  const current = await page.evaluate(() => window.scrollY);
  const steps = 15;
  for (let i = 1; i <= steps; i++) {
    const pos = current + (y - current) * (i / steps);
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), pos);
    await sleep(40);
  }
  await sleep(300);
}

async function captureState(page, label, desc) {
  const state = await page.evaluate(() => {
    const section = document.querySelector('.bsm-full-experience');
    const wrapper = document.querySelector('.bsm-experience-wrapper');
    const h2 = section?.querySelector('h2');
    const tags = section?.querySelectorAll('.services-tags > *') || [];
    const viewport = { h: window.innerHeight, w: window.innerWidth };

    const inView = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < viewport.h && r.bottom > 0;
    };

    const tagInfo = Array.from(tags).map((t, i) => {
      const r = t.getBoundingClientRect();
      return {
        index: i,
        text: t.textContent.trim().substring(0, 30),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        inView: inView(t)
      };
    });

    const h2Rect = h2 ? h2.getBoundingClientRect() : null;
    const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : null;
    const sectionRect = section ? section.getBoundingClientRect() : null;

    return {
      scrollY: Math.round(window.scrollY),
      tagsInView: tagInfo.filter(t => t.inView).length,
      totalTags: tagInfo.length,
      tagInfo,
      h2Top: h2Rect ? Math.round(h2Rect.top) : null,
      h2Bottom: h2Rect ? Math.round(h2Rect.bottom) : null,
      h2InView: inView(h2),
      sectionTop: sectionRect ? Math.round(sectionRect.top) : null,
      wrapperTop: wrapperRect ? Math.round(wrapperRect.top) : null,
      wrapperBottom: wrapperRect ? Math.round(wrapperRect.bottom) : null,
    };
  });

  console.log(`\n[${label}] ${desc}`);
  console.log(`  scroll: ${state.scrollY}px | tags in view: ${state.tagsInView}/${state.totalTags} | h2 in view: ${state.h2InView}`);
  console.log(`  h2: top=${state.h2Top} bottom=${state.h2Bottom}`);
  console.log(`  section top: ${state.sectionTop} | wrapper: top=${state.wrapperTop} bottom=${state.wrapperBottom}`);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${label}.png`), fullPage: false });
  return state;
}

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--ignore-certificate-errors', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://bsm:8443', { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(2000);

  console.log('Connected. Starting scroll capture...');

  // Known values: wrapper starts at 2250, has height 3150, so ends at 5400
  // The sticky section (900px) stays fixed during entire scroll of wrapper
  // Scroll range for the animation: 2250 to 5400 (with viewport = 900, the scroll range is 2250 to ~4500)
  // The actual scroll positions where animation is active: from 2250 to (5400 - 900) = 4500

  const wrapperStart = 2250;
  const wrapperEnd = 5400;
  const viewportH = 900;
  const animStart = wrapperStart;           // When wrapper top hits viewport top
  const animEnd = wrapperEnd - viewportH;   // When wrapper bottom hits viewport bottom = 4500

  // But section enters viewport earlier — when wrapper top hits viewport bottom
  const sectionEnter = wrapperStart - viewportH; // 1350 — wrapper starts to appear

  console.log(`\nSection wrapper: ${wrapperStart} to ${wrapperEnd}`);
  console.log(`Section enters viewport at scroll: ~${sectionEnter}`);
  console.log(`Animation active: ${animStart} to ${animEnd}`);
  console.log(`Total animation scroll: ${animEnd - animStart}px\n`);

  // Screenshot 00: Before section
  await scrollTo(page, 0);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '00-homepage-top.png'), fullPage: false });
  console.log('[00] Homepage top');

  // Screenshot 01: Section just entering viewport (section wrapper top near viewport bottom)
  await scrollTo(page, sectionEnter + 50);
  await captureState(page, '01-section-entering', 'Phase 1 start — section just entering viewport from below');

  // Phase 1: scroll from sectionEnter to animStart
  // Spread across 4 captures
  await scrollTo(page, animStart + 100);
  await captureState(page, '02-phase1-early', 'Phase 1 early — first tags appearing');

  await scrollTo(page, animStart + 300);
  await captureState(page, '03-phase1-mid', 'Phase 1 mid — more tags coming up');

  await scrollTo(page, animStart + 600);
  await captureState(page, '04-phase1-late', 'Phase 1 late — most tags visible');

  // The "stable frame" — section fully pinned with all content visible
  // This should be at the midpoint of the wrapper scroll range
  const totalAnimScroll = animEnd - animStart; // 2250
  const stableCenter = animStart + totalAnimScroll * 0.45;
  await scrollTo(page, stableCenter);
  await captureState(page, '05-stable-frame-expected', 'Expected stable frame — all 8 tags + full title visible simultaneously');

  // A bit further into stable zone
  await scrollTo(page, animStart + totalAnimScroll * 0.55);
  await captureState(page, '06-stable-frame-2', 'Stable frame 2 — confirming stable state');

  // Phase 2 start
  await scrollTo(page, animStart + totalAnimScroll * 0.65);
  await captureState(page, '07-phase2-start', 'Phase 2 start — title stable, tags spreading/collapsing');

  // Phase 2 mid
  await scrollTo(page, animStart + totalAnimScroll * 0.78);
  await captureState(page, '08-phase2-mid', 'Phase 2 mid — title beginning to move up');

  // Phase 2 late
  await scrollTo(page, animStart + totalAnimScroll * 0.90);
  await captureState(page, '09-phase2-late', 'Phase 2 late — title exiting, tags collapsing');

  // Phase 2 end — just before section unsticks
  await scrollTo(page, animEnd - 50);
  await captureState(page, '10-phase2-end', 'Phase 2 end — everything nearly exited');

  // Right at the transition point
  await scrollTo(page, animEnd);
  await captureState(page, '11-transition-point', 'At exact transition — section about to unstick');

  // Just past transition — checking for black gap
  await scrollTo(page, animEnd + 50);
  await captureState(page, '12-just-past-transition', 'Just past transition — checking for black gap');

  await scrollTo(page, animEnd + 200);
  await captureState(page, '13-after-section', 'After section — next section appearing');

  await scrollTo(page, animEnd + 500);
  await captureState(page, '14-next-section', 'Next section fully in view');

  // Fine-grained scan around the stable zone (40%-60%) to find THE stable frame
  console.log('\n--- Fine-grained scan for stable frame ---');
  const stableZoneStart = animStart + totalAnimScroll * 0.30;
  const stableZoneEnd = animStart + totalAnimScroll * 0.70;
  const fineSteps = 8;
  for (let i = 0; i <= fineSteps; i++) {
    const pos = stableZoneStart + (stableZoneEnd - stableZoneStart) * (i / fineSteps);
    await scrollTo(page, pos);
    const state = await page.evaluate(() => {
      const h2 = document.querySelector('.bsm-full-experience h2');
      const tags = document.querySelector('.bsm-full-experience .services-tags');
      const h2r = h2?.getBoundingClientRect();
      const tagsr = tags?.getBoundingClientRect();
      const vh = window.innerHeight;
      const tagItems = document.querySelectorAll('.bsm-full-experience .services-tags > *');
      let tagsInView = 0;
      tagItems.forEach(t => {
        const r = t.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) tagsInView++;
      });
      return {
        scrollY: Math.round(window.scrollY),
        tagsInView,
        totalTags: tagItems.length,
        h2Top: h2r ? Math.round(h2r.top) : null,
        h2Bottom: h2r ? Math.round(h2r.bottom) : null,
        h2InView: h2r ? (h2r.top < vh && h2r.bottom > 0) : false,
        tagsContainerTop: tagsr ? Math.round(tagsr.top) : null,
        tagsContainerBottom: tagsr ? Math.round(tagsr.bottom) : null,
      };
    });
    const marker = (state.tagsInView === state.totalTags && state.h2InView) ? ' <<< ALL VISIBLE!' : '';
    console.log(`  scroll=${state.scrollY}: tags=${state.tagsInView}/${state.totalTags} h2=${state.h2InView} (top=${state.h2Top},bot=${state.h2Bottom})${marker}`);
    if (state.tagsInView === state.totalTags && state.h2InView) {
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `STABLE-FRAME-scroll${state.scrollY}.png`), fullPage: false });
      console.log(`  -> STABLE FRAME screenshot saved!`);
    }
  }

  await browser.close();
  console.log('\n\nDone! Screenshots saved to:', SCREENSHOTS_DIR);
  console.log('Files:', fs.readdirSync(SCREENSHOTS_DIR).join(', '));
}

main().catch(console.error);
