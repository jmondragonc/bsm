const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = '/Users/joseph/Work/bsm/scroll-screenshots';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function tryURL(browser, url) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { timeout: 8000, waitUntil: 'domcontentloaded' });
    await sleep(1000);
    const title = await page.title();
    console.log(`Connected to ${url} — title: ${title}`);
    return page;
  } catch (e) {
    console.log(`Failed ${url}: ${e.message.split('\n')[0]}`);
    await page.close();
    return null;
  }
}

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--ignore-certificate-errors', '--disable-web-security']
  });

  const urls = [
    'https://bsm:8443',
    'http://bsm.test',
    'http://localhost:8888',
    'http://localhost'
  ];

  let page = null;
  for (const url of urls) {
    page = await tryURL(browser, url);
    if (page) break;
  }

  if (!page) {
    console.error('Could not connect to any URL');
    await browser.close();
    process.exit(1);
  }

  // Set viewport
  await page.setViewportSize({ width: 1440, height: 900 });
  await sleep(2000);

  // Screenshot 0: Homepage initial view
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '00-homepage.png'), fullPage: false });
  console.log('Screenshot 00: homepage initial view');

  // Find the "Full Experience" section
  const sectionHandle = await page.evaluate(() => {
    // Look for the section containing "CREAMOS UNA EXPERIENCIA DE MARCA COMPLETA"
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('CREAMOS UNA EXPERIENCIA DE MARCA COMPLETA') && el.children.length > 0) {
        const rect = el.getBoundingClientRect();
        if (rect.height > 100) {
          return {
            offsetTop: el.offsetTop,
            id: el.id,
            className: el.className.substring(0, 100),
            tag: el.tagName
          };
        }
      }
    }
    return null;
  });

  console.log('Section found:', JSON.stringify(sectionHandle));

  // Also find the section's scroll start position
  const sectionInfo = await page.evaluate(() => {
    const selectors = [
      '.full-experience',
      '[class*="experiencia"]',
      '[class*="full-exp"]',
      'section',
    ];

    for (const sel of selectors) {
      const els = document.querySelectorAll(sel);
      for (const el of els) {
        if (el.textContent && el.textContent.includes('EXPERIENCIA DE MARCA COMPLETA')) {
          const rect = el.getBoundingClientRect();
          return {
            selector: sel,
            offsetTop: el.offsetTop,
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight,
            id: el.id,
            classes: el.className.substring(0, 200),
            tag: el.tagName,
            windowScrollY: window.scrollY,
            documentHeight: document.documentElement.scrollHeight,
            viewportHeight: window.innerHeight
          };
        }
      }
    }
    return null;
  });

  console.log('Section info:', JSON.stringify(sectionInfo, null, 2));

  if (!sectionInfo) {
    // Try to get all sections with their positions
    const sections = await page.evaluate(() => {
      const secs = document.querySelectorAll('section');
      return Array.from(secs).map(s => ({
        id: s.id,
        classes: s.className.substring(0, 100),
        offsetTop: s.offsetTop,
        text: s.textContent.substring(0, 80).trim()
      }));
    });
    console.log('All sections:', JSON.stringify(sections, null, 2));
  }

  // Get the total document height and find where the section is
  const scrollData = await page.evaluate(() => {
    return {
      totalHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight
    };
  });
  console.log('Scroll data:', scrollData);

  // Phase 1: Scroll slowly from beginning towards the section
  // First do a rough scroll to get near the section
  const targetScrollTop = sectionInfo ? Math.max(0, sectionInfo.offsetTop - 200) : scrollData.totalHeight * 0.3;

  console.log(`Scrolling to approximately ${targetScrollTop}px to approach the section`);

  // Scroll in steps to approach section
  const approachSteps = 20;
  for (let i = 0; i <= approachSteps; i++) {
    const scrollPos = (targetScrollTop / approachSteps) * i;
    await page.evaluate((y) => window.scrollTo(0, y), scrollPos);
    await sleep(50);
  }

  await sleep(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-approaching-section.png'), fullPage: false });
  console.log('Screenshot 01: approaching section');

  // Now scroll through the section more carefully
  // The section likely has a sticky animation with multiple phases
  // Capture screenshots at fine intervals through the section scroll range

  const currentScroll = await page.evaluate(() => window.scrollY);
  const totalScrollRange = sectionInfo ?
    sectionInfo.scrollHeight + 300 :
    scrollData.totalHeight * 0.5;

  // Define the range we want to capture (around the section)
  const startScroll = Math.max(0, targetScrollTop - 100);
  const endScroll = Math.min(scrollData.totalHeight - scrollData.viewportHeight, targetScrollTop + totalScrollRange);

  console.log(`Capturing scroll range: ${startScroll} to ${endScroll}`);

  // Take screenshots at specific positions through the animation
  const capturePoints = [
    { label: '02-phase1-start', desc: 'Section just entering viewport', fraction: 0.0 },
    { label: '03-phase1-mid', desc: 'Mid Phase 1 - tags coming up', fraction: 0.15 },
    { label: '04-phase1-late', desc: 'Phase 1 late - more tags visible', fraction: 0.28 },
    { label: '05-stable-frame', desc: 'Stable frame - all tags AND title visible', fraction: 0.40 },
    { label: '06-stable-frame-2', desc: 'Stable frame continued', fraction: 0.50 },
    { label: '07-phase2-start', desc: 'Phase 2 start - title stable, tags spreading', fraction: 0.60 },
    { label: '08-phase2-mid', desc: 'Phase 2 mid - title starting to move up', fraction: 0.72 },
    { label: '09-phase2-late', desc: 'Phase 2 late - title moving up more', fraction: 0.83 },
    { label: '10-phase2-end', desc: 'Phase 2 end - everything exiting', fraction: 0.92 },
    { label: '11-after-section', desc: 'After section - checking for black gap', fraction: 1.0 },
    { label: '12-next-section', desc: 'Next section fully in view', fraction: 1.05 },
  ];

  for (const point of capturePoints) {
    const scrollPos = startScroll + (endScroll - startScroll) * point.fraction;
    const clampedPos = Math.min(Math.max(0, scrollPos), scrollData.totalHeight - scrollData.viewportHeight);

    // Scroll smoothly to position
    const currentPos = await page.evaluate(() => window.scrollY);
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const pos = currentPos + (clampedPos - currentPos) * (i / steps);
      await page.evaluate((y) => window.scrollTo(0, y), pos);
      await sleep(30);
    }
    await sleep(400); // Let animations settle

    const actualScroll = await page.evaluate(() => window.scrollY);

    // Check what's visible
    const visibleInfo = await page.evaluate(() => {
      const tags = document.querySelectorAll('[class*="tag"], .experience-tag, [class*="experience"] li');
      const title = document.querySelector('[class*="experience"] h2, [class*="experience"] h1, [class*="full-exp"] h2');
      const viewport = { top: window.scrollY, bottom: window.scrollY + window.innerHeight };

      let visibleTagsCount = 0;
      const tagRects = [];
      tags.forEach(tag => {
        const rect = tag.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          visibleTagsCount++;
          tagRects.push({ top: Math.round(rect.top), bottom: Math.round(rect.bottom), text: tag.textContent.trim().substring(0, 30) });
        }
      });

      let titleVisible = false;
      let titleRect = null;
      if (title) {
        const rect = title.getBoundingClientRect();
        titleVisible = rect.top < window.innerHeight && rect.bottom > 0;
        titleRect = { top: Math.round(rect.top), bottom: Math.round(rect.bottom) };
      }

      return { visibleTagsCount, tagRects, titleVisible, titleRect, scrollY: window.scrollY };
    });

    console.log(`Screenshot ${point.label} (scroll: ${actualScroll}px): ${point.desc}`);
    console.log(`  Tags visible: ${visibleInfo.visibleTagsCount}, Title visible: ${visibleInfo.titleVisible}`);
    if (visibleInfo.titleRect) console.log(`  Title rect: top=${visibleInfo.titleRect.top}, bottom=${visibleInfo.titleRect.bottom}`);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${point.label}.png`), fullPage: false });
  }

  // Also capture a few extra frames right after the section ends
  const afterSectionScroll = endScroll + 200;
  await page.evaluate((y) => window.scrollTo(0, y), Math.min(afterSectionScroll, scrollData.totalHeight - scrollData.viewportHeight));
  await sleep(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13-well-after-section.png'), fullPage: false });
  console.log('Screenshot 13: well after section');

  await browser.close();
  console.log('\nDone! Screenshots saved to:', SCREENSHOTS_DIR);
}

main().catch(console.error);
