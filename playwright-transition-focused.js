const { chromium } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = '/Users/joseph/Work/bsm/scroll-screenshots/transition-focused';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--ignore-certificate-errors', '--disable-web-security']
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('Loading page with cache bust...');
  await page.goto('https://bsm:8443/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await sleep(2000);

  console.log('Page loaded:', await page.title());

  // Get layout info
  const layoutInfo = await page.evaluate(() => {
    const wrapper = document.querySelector('.bsm-experience-wrapper');
    const work = document.querySelector('.bsm-work');
    const experience = document.querySelector('.bsm-experience');

    const info = {
      wrapper: null,
      work: null,
      experience: null,
      totalHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight
    };

    if (wrapper) {
      info.wrapper = {
        offsetTop: wrapper.offsetTop,
        offsetHeight: wrapper.offsetHeight,
        endsAt: wrapper.offsetTop + wrapper.offsetHeight
      };
    }

    if (work) {
      info.work = {
        offsetTop: work.offsetTop,
        offsetHeight: work.offsetHeight
      };
    }

    if (experience) {
      info.experience = {
        offsetTop: experience.offsetTop,
        offsetHeight: experience.offsetHeight,
        scrollHeight: experience.scrollHeight
      };
    }

    return info;
  });

  console.log('\n=== LAYOUT INFO ===');
  console.log(JSON.stringify(layoutInfo, null, 2));
  console.log('==================\n');

  // Now take screenshots every 50px from 3600 to 5000
  const results = [];

  for (let scrollY = 3600; scrollY <= 5000; scrollY += 50) {
    // Scroll to position
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await sleep(150); // Let scroll-driven animations settle

    const actualScroll = await page.evaluate(() => window.scrollY);

    // Capture pixel data and element visibility
    const analysis = await page.evaluate((scrollPos) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Check visibility of key elements
      const wrapper = document.querySelector('.bsm-experience-wrapper');
      const work = document.querySelector('.bsm-work');
      const experience = document.querySelector('.bsm-experience');

      const getElInfo = (el, name) => {
        if (!el) return { name, found: false };
        const rect = el.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(vh, rect.bottom);
        const visiblePx = Math.max(0, visibleBottom - visibleTop);
        return {
          name,
          found: true,
          rectTop: Math.round(rect.top),
          rectBottom: Math.round(rect.bottom),
          visiblePx: Math.round(visiblePx),
          isVisible: visiblePx > 0
        };
      };

      // Sample background colors at multiple points in viewport
      // Use getComputedStyle on elements at various vertical positions
      const colorSamples = [];
      const samplePoints = [0, 150, 300, 450, 600, 750, 899];

      for (const y of samplePoints) {
        const el = document.elementFromPoint(vw / 2, y);
        if (el) {
          let bgColor = 'transparent';
          let current = el;
          while (current && current !== document.body) {
            const style = window.getComputedStyle(current);
            const bg = style.backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
              bgColor = bg;
              break;
            }
            current = current.parentElement;
          }
          if (bgColor === 'transparent') {
            bgColor = window.getComputedStyle(document.body).backgroundColor;
          }
          colorSamples.push({ y, color: bgColor, tag: el.tagName, cls: (el.className || '').substring(0, 60) });
        } else {
          colorSamples.push({ y, color: 'none', tag: 'none', cls: '' });
        }
      }

      // Check how much of viewport is black (rgb(0,0,0) or very dark)
      const blackSamples = colorSamples.filter(s => {
        const c = s.color;
        return c === 'rgb(0, 0, 0)' || c === '#000' || c === '#000000' ||
          (c.startsWith('rgb(') && (() => {
            const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (!m) return false;
            return parseInt(m[1]) < 20 && parseInt(m[2]) < 20 && parseInt(m[3]) < 20;
          })());
      });

      return {
        scrollPos,
        actualScrollY: window.scrollY,
        wrapper: getElInfo(wrapper, 'bsm-experience-wrapper'),
        work: getElInfo(work, 'bsm-work'),
        experience: getElInfo(experience, 'bsm-experience'),
        colorSamples,
        blackSamplesCount: blackSamples.length,
        estimatedBlackPx: blackSamples.length > 0 ? Math.round((blackSamples.length / samplePoints.length) * 900) : 0
      };
    }, scrollY);

    // Take screenshot
    const filename = `scroll-${String(scrollY).padStart(5, '0')}.png`;
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: false });

    results.push(analysis);

    // Log key info
    const workVisible = analysis.work?.visiblePx || 0;
    const black = analysis.estimatedBlackPx;
    const wrapperVisible = analysis.wrapper?.visiblePx || 0;

    console.log(`Scroll ${scrollY}px | black~${black}px | work=${workVisible}px visible | wrapper=${wrapperVisible}px visible`);

    // Print color samples for this frame
    const colorDesc = analysis.colorSamples.map(s => `y${s.y}:${s.color}`).join(', ');
    console.log(`  Colors: ${colorDesc}`);
  }

  // Print summary of the "all black" zone
  console.log('\n=== TRANSITION ANALYSIS ===');
  const allBlackFrames = results.filter(r => r.estimatedBlackPx > 800);
  const noContentFrames = results.filter(r => {
    const workVisible = r.work?.visiblePx || 0;
    const wrapperVisible = r.wrapper?.visiblePx || 0;
    return workVisible === 0 && wrapperVisible < 10;
  });

  console.log(`Frames where viewport appears entirely black (>800px black): ${allBlackFrames.length}`);
  if (allBlackFrames.length > 0) {
    const first = allBlackFrames[0].scrollPos;
    const last = allBlackFrames[allBlackFrames.length - 1].scrollPos;
    console.log(`  Range: scroll ${first} - ${last} (${last - first + 50}px of scroll)`);
  }

  console.log(`Frames with NO content from either section: ${noContentFrames.length}`);
  if (noContentFrames.length > 0) {
    const first = noContentFrames[0].scrollPos;
    const last = noContentFrames[noContentFrames.length - 1].scrollPos;
    console.log(`  Range: scroll ${first} - ${last} (${last - first + 50}px of scroll)`);
  }

  // Show when bsm-work first appears
  const workFirstVisible = results.find(r => (r.work?.visiblePx || 0) > 0);
  if (workFirstVisible) {
    console.log(`bsm-work first visible at scroll: ${workFirstVisible.scrollPos} (${workFirstVisible.work.visiblePx}px)`);
  }

  // Show when bsm-experience-wrapper last visible
  const wrapperLastVisible = [...results].reverse().find(r => (r.wrapper?.visiblePx || 0) > 0);
  if (wrapperLastVisible) {
    console.log(`bsm-experience-wrapper last visible at scroll: ${wrapperLastVisible.scrollPos} (${wrapperLastVisible.wrapper.visiblePx}px)`);
  }

  console.log('\nLayout summary:');
  console.log(JSON.stringify(layoutInfo, null, 2));

  await browser.close();
  console.log('\nDone! Screenshots saved to:', SCREENSHOTS_DIR);
}

main().catch(console.error);
