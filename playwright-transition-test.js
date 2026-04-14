const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = '/Users/joseph/Work/bsm/scroll-screenshots/transition-test-' + Date.now();

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--ignore-certificate-errors', '--disable-web-security']
  });

  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Loading page with cache disabled...');
  await page.goto('https://bsm:8443/?v=' + Date.now(), { waitUntil: 'networkidle' });
  console.log('Page loaded.');

  await sleep(2000);

  // Get document info
  const docInfo = await page.evaluate(() => ({
    totalHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight
  }));
  console.log('Document height:', docInfo.totalHeight, 'Viewport:', docInfo.viewportHeight);

  // Find the "TRABAJAMOS CON CLIENTES" section position
  const nextSectionInfo = await page.evaluate(() => {
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      if (el.textContent && el.textContent.includes('TRABAJAMOS CON CLIENTES') && el.children.length > 0) {
        const rect = el.getBoundingClientRect();
        if (rect.height > 50) {
          return {
            tag: el.tagName,
            id: el.id,
            classes: el.className.substring(0, 200),
            offsetTop: el.offsetTop,
            scrollY: window.scrollY,
            rectTop: rect.top
          };
        }
      }
    }
    return null;
  });
  console.log('Next section ("TRABAJAMOS"):', JSON.stringify(nextSectionInfo));

  // Find "EXPERIENCIA DE MARCA" section info
  const expSectionInfo = await page.evaluate(() => {
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      if (el.textContent && el.textContent.includes('CREAMOS UNA EXPERIENCIA DE MARCA COMPLETA') && el.children.length > 0) {
        const rect = el.getBoundingClientRect();
        if (rect.height > 100) {
          return {
            tag: el.tagName,
            id: el.id,
            classes: el.className.substring(0, 200),
            offsetTop: el.offsetTop,
            scrollHeight: el.scrollHeight
          };
        }
      }
    }
    return null;
  });
  console.log('Experience section:', JSON.stringify(expSectionInfo));

  const results = [];

  // Take screenshots at every 100px from 3900 to 5500
  for (let scrollPos = 3900; scrollPos <= 5500; scrollPos += 100) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollPos);
    await sleep(300); // let scroll-driven animations settle

    const actualScroll = await page.evaluate(() => window.scrollY);

    // Analyze what's visible
    const analysis = await page.evaluate(() => {
      const scrollY = window.scrollY;
      const vpHeight = window.innerHeight;

      // Check for black area - look at what elements are in viewport
      // and whether there's empty/black space
      const body = document.body;
      const bodyBg = window.getComputedStyle(body).backgroundColor;

      // Find "CREAMOS UNA EXPERIENCIA" content
      let expContentVisible = false;
      let expContentRect = null;
      const expEls = document.querySelectorAll('[class*="full-exp"], [class*="experiencia"], [class*="experience"]');
      for (const el of expEls) {
        if (el.textContent && el.textContent.includes('EXPERIENCIA DE MARCA')) {
          const rect = el.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < vpHeight) {
            expContentVisible = true;
            expContentRect = { top: Math.round(rect.top), bottom: Math.round(rect.bottom) };
            break;
          }
        }
      }

      // Find "TRABAJAMOS CON CLIENTES" section
      let trabajamosVisible = false;
      let trabajamosRect = null;
      let trabajamosText = '';
      const allEls = document.querySelectorAll('section, div[class*="client"], div[class*="Client"], div[id*="client"]');
      for (const el of allEls) {
        if (el.textContent && el.textContent.includes('TRABAJAMOS CON CLIENTES')) {
          const rect = el.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < vpHeight) {
            trabajamosVisible = true;
            trabajamosRect = { top: Math.round(rect.top), bottom: Math.round(rect.bottom) };
            trabajamosText = el.textContent.substring(0, 60).trim();
            break;
          }
        }
      }

      // More generic search for trabajamos
      if (!trabajamosVisible) {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent.includes('TRABAJAMOS CON CLIENTES')) {
            const el = node.parentElement;
            const rect = el.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < vpHeight) {
              trabajamosVisible = true;
              trabajamosRect = { top: Math.round(rect.top), bottom: Math.round(rect.bottom) };
              break;
            }
          }
        }
      }

      // Check viewport pixel colors by looking at elements covering the viewport
      // Find the element at the center of screen to see if it's a black empty area
      const centerEl = document.elementFromPoint(720, 450);
      const centerElInfo = centerEl ? {
        tag: centerEl.tagName,
        id: centerEl.id,
        classes: centerEl.className.substring(0, 100),
        bg: window.getComputedStyle(centerEl).backgroundColor,
        text: centerEl.textContent.substring(0, 50).trim()
      } : null;

      // Check element at top of viewport
      const topEl = document.elementFromPoint(720, 50);
      const topElInfo = topEl ? {
        tag: topEl.tagName,
        classes: topEl.className.substring(0, 100),
        bg: window.getComputedStyle(topEl).backgroundColor,
        text: topEl.textContent.substring(0, 50).trim()
      } : null;

      // Check element at bottom of viewport
      const bottomEl = document.elementFromPoint(720, 850);
      const bottomElInfo = bottomEl ? {
        tag: bottomEl.tagName,
        classes: bottomEl.className.substring(0, 100),
        bg: window.getComputedStyle(bottomEl).backgroundColor,
        text: bottomEl.textContent.substring(0, 50).trim()
      } : null;

      return {
        scrollY,
        expContentVisible,
        expContentRect,
        trabajamosVisible,
        trabajamosRect,
        centerEl: centerElInfo,
        topEl: topElInfo,
        bottomEl: bottomElInfo
      };
    });

    const filename = `scroll-${String(scrollPos).padStart(5, '0')}.png`;
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: false });

    // Determine if there's a black gap
    const isBlack = (elInfo) => {
      if (!elInfo) return false;
      const bg = elInfo.bg || '';
      return bg.includes('rgb(0, 0, 0)') || bg.includes('rgba(0, 0, 0') || elInfo.classes.includes('black') || elInfo.classes.includes('dark');
    };

    const centerIsBlack = isBlack(analysis.centerEl);
    const hasBlackGap = centerIsBlack && !analysis.expContentVisible && !analysis.trabajamosVisible;

    const report = {
      scrollPos,
      actualScroll: analysis.scrollY,
      expContentVisible: analysis.expContentVisible,
      expContentRect: analysis.expContentRect,
      trabajamosVisible: analysis.trabajamosVisible,
      trabajamosRect: analysis.trabajamosRect,
      blackGapSuspected: hasBlackGap,
      centerElement: analysis.centerEl ? `${analysis.centerEl.tag}.${analysis.centerEl.classes.substring(0,40)} bg=${analysis.centerEl.bg}` : 'none',
      screenshot: filename
    };

    results.push(report);

    // Console report
    console.log(`\n--- Scroll ${scrollPos}px ---`);
    console.log(`  Actual scroll: ${analysis.scrollY}`);
    console.log(`  Exp section visible: ${analysis.expContentVisible}${analysis.expContentRect ? ` (top=${analysis.expContentRect.top}, bottom=${analysis.expContentRect.bottom})` : ''}`);
    console.log(`  TRABAJAMOS visible: ${analysis.trabajamosVisible}${analysis.trabajamosRect ? ` (top=${analysis.trabajamosRect.top}, bottom=${analysis.trabajamosRect.bottom})` : ''}`);
    console.log(`  BLACK GAP: ${hasBlackGap ? 'YES - POSSIBLE BLACK AREA' : 'no'}`);
    console.log(`  Center elem: ${analysis.centerEl ? `${analysis.centerEl.tag} bg=${analysis.centerEl.bg} "${analysis.centerEl.text.substring(0,40)}"` : 'none'}`);
  }

  // Now find the "stable frame" - where all tags AND full title are visible
  console.log('\n\n=== LOOKING FOR STABLE FRAME ===');

  // Scroll through 1500-3500 range to find the stable frame
  let stableFrameFound = false;
  for (let scrollPos = 1500; scrollPos <= 3900; scrollPos += 50) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollPos);
    await sleep(200);

    const stableCheck = await page.evaluate(() => {
      // Look for all experience tags
      const tags = document.querySelectorAll('[class*="tag"], [class*="Tag"]');
      let visibleTags = 0;
      let totalTags = 0;
      tags.forEach(tag => {
        if (tag.textContent.trim().length > 0 && tag.offsetParent !== null) {
          totalTags++;
          const rect = tag.getBoundingClientRect();
          if (rect.top >= 0 && rect.bottom <= window.innerHeight && rect.top < window.innerHeight) {
            visibleTags++;
          }
        }
      });

      // Look for the full title "CREAMOS UNA EXPERIENCIA DE MARCA COMPLETA"
      let titleFullyVisible = false;
      let titleRect = null;
      const headings = document.querySelectorAll('h1, h2, h3');
      for (const h of headings) {
        if (h.textContent.includes('CREAMOS UNA EXPERIENCIA') || h.textContent.includes('EXPERIENCIA DE MARCA')) {
          const rect = h.getBoundingClientRect();
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            titleFullyVisible = true;
            titleRect = { top: Math.round(rect.top), bottom: Math.round(rect.bottom) };
          }
        }
      }

      return { visibleTags, totalTags, titleFullyVisible, titleRect };
    });

    if (stableCheck.totalTags > 0 && stableCheck.visibleTags >= stableCheck.totalTags * 0.8 && stableCheck.titleFullyVisible) {
      console.log(`Stable frame found at scroll ${scrollPos}!`);
      console.log(`  Tags: ${stableCheck.visibleTags}/${stableCheck.totalTags} visible`);
      console.log(`  Title fully visible: ${stableCheck.titleFullyVisible}, rect:`, stableCheck.titleRect);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'STABLE-FRAME.png'), fullPage: false });
      stableFrameFound = true;
      break;
    }
  }

  if (!stableFrameFound) {
    console.log('Stable frame not found automatically, checking best candidates...');
    // Try to find where both are most visible
    for (let scrollPos of [2000, 2200, 2400, 2600, 2800, 3000, 3200]) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollPos);
      await sleep(300);
      const check = await page.evaluate(() => {
        const tags = document.querySelectorAll('[class*="tag"], [class*="Tag"]');
        let visibleTags = 0;
        tags.forEach(tag => {
          const rect = tag.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) visibleTags++;
        });
        const headings = document.querySelectorAll('h1, h2, h3');
        let titleVisible = false;
        for (const h of headings) {
          if (h.textContent.includes('EXPERIENCIA DE MARCA') || h.textContent.includes('CREAMOS UNA')) {
            const rect = h.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) { titleVisible = true; break; }
          }
        }
        return { visibleTags, titleVisible };
      });
      console.log(`Scroll ${scrollPos}: tags=${check.visibleTags}, title=${check.titleVisible}`);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `stable-candidate-${scrollPos}.png`), fullPage: false });
    }
  }

  // Save summary
  const summary = {
    screenshotsDir: SCREENSHOTS_DIR,
    stableFrameFound,
    transitions: results
  };
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'summary.json'), JSON.stringify(summary, null, 2));

  console.log('\n\nSCREENSHOTS SAVED TO:', SCREENSHOTS_DIR);
  console.log('Total screenshots:', results.length);

  await browser.close();
}

main().catch(console.error);
