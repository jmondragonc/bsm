/**
 * Fine-grained scroll test for the "CREAMOS UNA EXPERIENCIA DE MARCA COMPLETA" section.
 * Checks A, B, C, D as specified.
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = '/Users/joseph/Work/bsm/scroll-screenshots/finegrain';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function scrollTo(page, y) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await sleep(200);
}

async function getState(page) {
  return page.evaluate(() => {
    // Find the experience section — try several selectors
    const section =
      document.querySelector('.bsm-full-experience') ||
      document.querySelector('[class*="full-experience"]') ||
      document.querySelector('[class*="full_experience"]') ||
      Array.from(document.querySelectorAll('section')).find(s =>
        s.textContent.includes('EXPERIENCIA DE MARCA COMPLETA')
      );

    const wrapper =
      document.querySelector('.bsm-experience-wrapper') ||
      document.querySelector('[class*="experience-wrapper"]') ||
      document.querySelector('[class*="experience_wrapper"]') ||
      (section && section.closest('[class*="wrapper"]'));

    // Find h2 with title text
    const h2 = section
      ? (section.querySelector('h2') || section.querySelector('h1'))
      : document.querySelector('h2');

    // Find tags — try various selectors
    const tagContainerSelectors = [
      '.services-tags',
      '[class*="services-tags"]',
      '[class*="tags"]',
      '.tags-list',
      '[class*="tag-list"]',
    ];
    let tagItems = [];
    if (section) {
      for (const sel of tagContainerSelectors) {
        const found = section.querySelectorAll(`${sel} > *`);
        if (found.length > 0) { tagItems = Array.from(found); break; }
      }
      // Also try direct children of section with tag-like classes
      if (tagItems.length === 0) {
        const possible = section.querySelectorAll('[class*="tag"]');
        if (possible.length > 0) tagItems = Array.from(possible);
      }
    }

    const vh = window.innerHeight;
    const vw = window.innerWidth;

    function rectOf(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), height: Math.round(r.height) };
    }

    function inView(el) {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < vh && r.bottom > 0;
    }

    function fullyInView(el) {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= vh;
    }

    const h2Rect = rectOf(h2);
    const sectionRect = rectOf(section);
    const wrapperRect = rectOf(wrapper);

    const tagData = tagItems.map((t, i) => ({
      index: i,
      text: t.textContent.trim().substring(0, 40),
      ...rectOf(t),
      inView: inView(t),
      fullyInView: fullyInView(t),
    }));

    const tagsInView = tagData.filter(t => t.inView).length;
    const tagsFullyInView = tagData.filter(t => t.fullyInView).length;

    // Check if h2 is "fully" visible (entire element within viewport)
    const h2FullyInView = h2Rect ? (h2Rect.top >= 0 && h2Rect.bottom <= vh) : false;
    const h2InView = inView(h2);

    // Count lines of h2 by checking child spans/divs or estimating from height
    const h2Lines = h2 ? h2.querySelectorAll('span, div, br').length : 0;

    return {
      scrollY: Math.round(window.scrollY),
      vh, vw,
      section: section ? { classes: section.className.substring(0, 100), tag: section.tagName } : null,
      wrapper: wrapper ? { classes: wrapper.className.substring(0, 100), offsetTop: wrapper.offsetTop } : null,
      h2Rect,
      h2InView,
      h2FullyInView,
      h2Lines,
      sectionRect,
      wrapperRect,
      totalTags: tagData.length,
      tagsInView,
      tagsFullyInView,
      tagData,
    };
  });
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${name}.png`), fullPage: false });
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

  // Try HTTPS first, then fallbacks
  const urls = ['https://bsm:8443', 'http://bsm.test', 'http://localhost:8888'];
  let connected = false;
  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 12000 });
      await sleep(1500);
      console.log(`Connected: ${url} — "${await page.title()}"`);
      connected = true;
      break;
    } catch (e) {
      console.log(`Failed ${url}: ${e.message.split('\n')[0]}`);
    }
  }
  if (!connected) { await browser.close(); process.exit(1); }

  // ── Step 1: Discover section geometry ────────────────────────────────────
  const initialState = await getState(page);
  console.log('\n=== INITIAL STATE ===');
  console.log('Section found:', initialState.section);
  console.log('Wrapper found:', initialState.wrapper);
  console.log('Total tags found:', initialState.totalTags);
  console.log('h2 lines/children:', initialState.h2Lines);

  // Get precise geometry at scroll=0
  const geo = await page.evaluate(() => {
    const section =
      document.querySelector('.bsm-full-experience') ||
      document.querySelector('[class*="full-experience"]') ||
      Array.from(document.querySelectorAll('section')).find(s =>
        s.textContent.includes('EXPERIENCIA DE MARCA COMPLETA')
      );
    const wrapper =
      document.querySelector('.bsm-experience-wrapper') ||
      document.querySelector('[class*="experience-wrapper"]') ||
      (section && section.closest('[class*="wrapper"]'));

    // Walk up from section to find the scroll-controlling wrapper
    let scrollWrapper = section;
    let el = section;
    while (el) {
      if (el.scrollHeight > el.clientHeight + 100) {
        // This element creates scroll space
      }
      el = el.parentElement;
    }

    return {
      sectionOffsetTop: section ? section.offsetTop : null,
      sectionScrollHeight: section ? section.scrollHeight : null,
      sectionClientHeight: section ? section.clientHeight : null,
      wrapperOffsetTop: wrapper ? wrapper.offsetTop : null,
      wrapperScrollHeight: wrapper ? wrapper.scrollHeight : null,
      wrapperClientHeight: wrapper ? wrapper.clientHeight : null,
      docScrollHeight: document.documentElement.scrollHeight,
      // Also grab sections and their offsets
      sections: Array.from(document.querySelectorAll('section')).map(s => ({
        id: s.id,
        classes: s.className.substring(0, 80),
        offsetTop: s.offsetTop,
        scrollHeight: s.scrollHeight,
        clientHeight: s.clientHeight,
        textSnippet: s.textContent.trim().substring(0, 60),
      })),
    };
  });

  console.log('\n=== PAGE GEOMETRY ===');
  console.log('Doc scroll height:', geo.docScrollHeight);
  console.log('Section offsetTop:', geo.sectionOffsetTop, '| scrollHeight:', geo.sectionScrollHeight, '| clientHeight:', geo.sectionClientHeight);
  console.log('Wrapper offsetTop:', geo.wrapperOffsetTop, '| scrollHeight:', geo.wrapperScrollHeight, '| clientHeight:', geo.wrapperClientHeight);
  console.log('\nAll sections:');
  geo.sections.forEach(s => {
    console.log(`  [${s.offsetTop}] ${s.classes.substring(0,60)} — "${s.textSnippet}"`);
  });

  // ── Step 2: Determine scroll range ───────────────────────────────────────
  // The sticky section is pinned while the wrapper scrolls.
  // Wrapper is 900px (viewport) sticky, so the scroll range = wrapper.scrollHeight - 900
  // Animation runs from wrapperOffsetTop to wrapperOffsetTop + (wrapperScrollHeight - 900)

  const VH = 900;
  const wTop = geo.wrapperOffsetTop || geo.sectionOffsetTop || 2200;
  const wScrollH = geo.wrapperScrollHeight || 3600;

  // Section enters viewport when: scrollY = wTop - VH
  const enterViewport = Math.max(0, wTop - VH);
  // Section pins when: scrollY = wTop (wrapper top reaches viewport top)
  const pinStart = wTop;
  // Section unpins when: scrollY = wTop + wScrollH - VH
  const pinEnd = wTop + wScrollH - VH;

  console.log(`\n=== SCROLL RANGE CALCULATION ===`);
  console.log(`Wrapper top: ${wTop}, scrollHeight: ${wScrollH}`);
  console.log(`Section enters viewport at scroll: ~${enterViewport}`);
  console.log(`Section pins (rect.top=0) at scroll: ~${pinStart}`);
  console.log(`Section unpins at scroll: ~${pinEnd}`);
  console.log(`Total pinned scroll range: ${pinEnd - pinStart}px`);

  // ── Step 3: CHECK B — Approach scroll (before pinning) ───────────────────
  console.log('\n\n=== CHECK B: TITLE ENTRY TIMING ===');
  console.log('Scanning from section-enters-viewport to pin-start...');

  const approachSamples = 10;
  const checkBData = [];
  for (let i = 0; i <= approachSamples; i++) {
    const scrollY = enterViewport + (pinStart - enterViewport) * (i / approachSamples);
    await scrollTo(page, scrollY);
    const state = await getState(page);
    checkBData.push({
      scrollY: state.scrollY,
      h2InView: state.h2InView,
      h2Top: state.h2Rect ? state.h2Rect.top : null,
      sectionTop: state.sectionRect ? state.sectionRect.top : null,
      tagsInView: state.tagsInView,
    });
    console.log(`  scroll=${state.scrollY}: sectionTop=${state.sectionRect?.top ?? 'N/A'} h2InView=${state.h2InView} h2Top=${state.h2Rect?.top ?? 'N/A'} tags=${state.tagsInView}`);
  }

  // Find first scroll where h2 is visible
  const h2FirstVisible = checkBData.find(d => d.h2InView);
  const pinnedMoment = checkBData.find(d => d.sectionTop !== null && d.sectionTop <= 5 && d.sectionTop >= -5);
  console.log(`\nCHECK B result:`);
  console.log(`  h2 first becomes visible at scroll: ${h2FirstVisible ? h2FirstVisible.scrollY : 'never'} (sectionTop at that moment: ${h2FirstVisible ? checkBData.find(d=>d.scrollY===h2FirstVisible.scrollY)?.sectionTop : 'N/A'})`);
  console.log(`  Section pins (sectionTop≈0) at scroll: ~${pinnedMoment ? pinnedMoment.scrollY : pinStart}`);

  // Screenshot at approach midpoint
  await scrollTo(page, enterViewport + (pinStart - enterViewport) * 0.5);
  await screenshot(page, 'checkB-approach-mid');
  await scrollTo(page, pinStart - 50);
  await screenshot(page, 'checkB-just-before-pin');

  // ── Step 4: Fine-grained scan through entire pinned range ─────────────────
  console.log('\n\n=== FINE-GRAINED SCROLL SCAN (200px steps) ===');

  const step = 200;
  const scanResults = [];
  let firstAllVisible = null;

  for (let y = Math.max(0, wTop - 400); y <= pinEnd + 600; y += step) {
    const clampedY = Math.min(y, geo.docScrollHeight - VH);
    await scrollTo(page, clampedY);
    const state = await getState(page);
    scanResults.push(state);

    const allVisible = state.tagsInView === state.totalTags && state.h2FullyInView && state.totalTags > 0;
    if (allVisible && !firstAllVisible) firstAllVisible = state;

    const marker = allVisible ? ' <<< ALL VISIBLE (title+tags)' : '';
    console.log(`  scroll=${state.scrollY}: sectionTop=${state.sectionRect?.top ?? 'N/A'} h2=[${state.h2Rect?.top},${state.h2Rect?.bottom}] h2InView=${state.h2InView}(fully:${state.h2FullyInView}) tags=${state.tagsInView}/${state.totalTags}${marker}`);

    // Take screenshot at key moments
    const label = String(y).padStart(5, '0');
    await screenshot(page, `scan-y${label}`);
  }

  // ── Step 5: Check A — Find stable frame ──────────────────────────────────
  console.log('\n\n=== CHECK A: STABLE FRAME ===');
  if (firstAllVisible) {
    console.log(`CHECK A: YES — all ${firstAllVisible.totalTags} tags + full title visible at scroll ${firstAllVisible.scrollY}`);
    console.log(`  h2 rect: top=${firstAllVisible.h2Rect?.top}, bottom=${firstAllVisible.h2Rect?.bottom}`);
    console.log(`  Tags: ${firstAllVisible.tagsInView}/${firstAllVisible.totalTags} in view`);
    // Screenshot specifically at this position
    await scrollTo(page, firstAllVisible.scrollY);
    await screenshot(page, 'CHECK-A-stable-frame');
  } else {
    // Also try with h2 merely in view (not fully in view)
    const partialAllVisible = scanResults.find(s => s.tagsInView === s.totalTags && s.h2InView && s.totalTags > 0);
    if (partialAllVisible) {
      console.log(`CHECK A: YES (partial) — all ${partialAllVisible.totalTags} tags + title (at least partially) visible at scroll ${partialAllVisible.scrollY}`);
      console.log(`  h2 rect: top=${partialAllVisible.h2Rect?.top}, bottom=${partialAllVisible.h2Rect?.bottom}`);
      await scrollTo(page, partialAllVisible.scrollY);
      await screenshot(page, 'CHECK-A-stable-frame-partial');
    } else {
      console.log('CHECK A: NO stable frame found where all tags + full title visible simultaneously');
      // Report best candidate
      const best = scanResults.reduce((best, s) => {
        const score = (s.tagsInView || 0) + (s.h2InView ? 5 : 0);
        const bestScore = (best?.tagsInView || 0) + (best?.h2InView ? 5 : 0);
        return score > bestScore ? s : best;
      }, null);
      if (best) {
        console.log(`  Best candidate: scroll=${best.scrollY} tags=${best.tagsInView}/${best.totalTags} h2InView=${best.h2InView}`);
      }
    }
  }

  // ── Step 6: Check C — Black gap after section ─────────────────────────────
  console.log('\n\n=== CHECK C: BLACK GAP ===');

  // Find where everything has exited
  const lastContentVisible = [...scanResults].reverse().find(s => s.tagsInView > 0 || s.h2InView);
  const afterContent = lastContentVisible ? lastContentVisible.scrollY + step : pinEnd;

  // Check a range after last content is visible
  const gapCheckResults = [];
  for (let y = afterContent; y <= afterContent + 1200; y += 200) {
    const clampedY = Math.min(y, geo.docScrollHeight - VH);
    await scrollTo(page, clampedY);
    const state = await getState(page);

    // Check for next section content
    const nextSectionInfo = await page.evaluate(() => {
      const candidates = [
        'TRABAJAMOS CON CLIENTES',
        'TRABAJAMOS',
        'CLIENTES',
      ];
      for (const text of candidates) {
        const els = Array.from(document.querySelectorAll('*')).filter(el =>
          el.children.length === 0 && el.textContent.trim().includes(text)
        );
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) {
            return { text: el.textContent.trim().substring(0, 60), top: Math.round(r.top) };
          }
        }
      }
      return null;
    });

    // Check pixel color at center of screen to detect black area
    const centerPixel = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      // We can't use getImageData from an off-screen element easily,
      // but we can check what element is at center
      const centerEl = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      return {
        centerTag: centerEl ? centerEl.tagName : 'none',
        centerClasses: centerEl ? centerEl.className.substring(0, 80) : '',
        centerText: centerEl ? centerEl.textContent.trim().substring(0, 50) : '',
      };
    });

    gapCheckResults.push({ scrollY: state.scrollY, tagsInView: state.tagsInView, h2InView: state.h2InView, nextSection: nextSectionInfo, centerEl: centerPixel });
    console.log(`  scroll=${state.scrollY}: tags=${state.tagsInView} h2=${state.h2InView} nextSection=${nextSectionInfo ? `"${nextSectionInfo.text}" at top=${nextSectionInfo.top}` : 'not visible'}`);
    console.log(`    center element: <${centerPixel.centerTag}> "${centerPixel.centerText}" [${centerPixel.centerClasses}]`);

    const label = String(y).padStart(5, '0');
    await screenshot(page, `checkC-gap-y${label}`);
  }

  // ── Step 7: Check D — Tags exit before section releases ───────────────────
  console.log('\n\n=== CHECK D: TAGS EXIT BEFORE SECTION RELEASES ===');

  // Scan the last 500px of the pinned range
  const checkDResults = [];
  for (let y = pinEnd - 600; y <= pinEnd + 100; y += 100) {
    const clampedY = Math.min(y, geo.docScrollHeight - VH);
    await scrollTo(page, clampedY);
    const state = await getState(page);
    checkDResults.push(state);
    console.log(`  scroll=${state.scrollY}: sectionTop=${state.sectionRect?.top ?? 'N/A'} tags=${state.tagsInView}/${state.totalTags} h2InView=${state.h2InView} h2Top=${state.h2Rect?.top}`);
  }

  // Find last scroll where tags are visible AND section is still pinned (sectionTop ~0)
  const tagsVisibleWhilePinned = checkDResults.filter(s =>
    s.tagsInView > 0 && s.sectionRect && s.sectionRect.top <= 10 && s.sectionRect.top >= -10
  );
  const allTagsExitBeforeRelease = tagsVisibleWhilePinned.length === 0 ||
    tagsVisibleWhilePinned[tagsVisibleWhilePinned.length - 1].scrollY < pinEnd;

  console.log(`\nCHECK D: Last scroll with tags visible while pinned: ${tagsVisibleWhilePinned.length > 0 ? tagsVisibleWhilePinned[tagsVisibleWhilePinned.length-1].scrollY : 'none'}`);
  console.log(`Pin releases at: ~${pinEnd}`);

  // Screenshot near pinEnd
  await scrollTo(page, pinEnd - 50);
  await screenshot(page, 'CHECK-D-near-pin-end');
  await scrollTo(page, pinEnd);
  await screenshot(page, 'CHECK-D-at-pin-end');
  await scrollTo(page, pinEnd + 100);
  await screenshot(page, 'CHECK-D-after-pin');

  // ── SUMMARY ──────────────────────────────────────────────────────────────
  console.log('\n\n========================================');
  console.log('SUMMARY OF ALL 4 CHECKS');
  console.log('========================================');

  // Check A
  if (firstAllVisible) {
    console.log(`CHECK A (Stable frame): YES — scroll=${firstAllVisible.scrollY}, all ${firstAllVisible.totalTags} tags + full title visible`);
  } else {
    const partial = scanResults.find(s => s.tagsInView === s.totalTags && s.h2InView && s.totalTags > 0);
    if (partial) {
      console.log(`CHECK A (Stable frame): YES (title partially clipped) — scroll=${partial.scrollY}, tags=${partial.tagsInView}/${partial.totalTags} visible`);
    } else {
      console.log(`CHECK A (Stable frame): NO — title and all tags never simultaneously visible`);
    }
  }

  // Check B
  const h2BeforePin = checkBData.find(d => d.h2InView && d.sectionTop > 5);
  if (h2BeforePin) {
    console.log(`CHECK B (Title entry timing): Title starts moving DURING APPROACH (sectionTop=${h2BeforePin.sectionTop} at scroll=${h2BeforePin.scrollY}) — NOT good`);
  } else if (h2FirstVisible && pinnedMoment && h2FirstVisible.scrollY >= pinnedMoment.scrollY - 100) {
    console.log(`CHECK B (Title entry timing): Title starts ONLY after pinning — GOOD (h2 first visible at scroll=${h2FirstVisible?.scrollY})`);
  } else {
    console.log(`CHECK B (Title entry timing): h2 first visible at scroll=${h2FirstVisible?.scrollY ?? 'N/A'}, section pins at ~${pinnedMoment?.scrollY ?? pinStart}`);
  }

  // Check C
  const firstNextSection = gapCheckResults.find(r => r.nextSection);
  const gapAfterContent = firstNextSection ? firstNextSection.scrollY - (lastContentVisible?.scrollY || afterContent) : 'unknown';
  console.log(`CHECK C (Black gap): ${firstNextSection ? `Next section appears at scroll=${firstNextSection.scrollY}, gap ≈ ${gapAfterContent}px` : 'Next section not found in range checked'}`);

  // Check D
  const lastTagsAtPin = checkDResults.filter(s => s.tagsInView > 0).pop();
  console.log(`CHECK D (Tags exit): Last tags visible at scroll=${lastTagsAtPin?.scrollY ?? 'N/A'} (pinEnd≈${pinEnd}). ${lastTagsAtPin && lastTagsAtPin.scrollY < pinEnd ? 'ALL tags exit BEFORE section releases — GOOD' : 'Some tags still visible AT/AFTER section releases — potential issue'}`);

  await browser.close();
  console.log(`\nScreenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log('Files:', fs.readdirSync(SCREENSHOTS_DIR).sort().join(', '));
}

main().catch(console.error);
