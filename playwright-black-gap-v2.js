const { chromium } = require('/Users/joseph/.nvm/versions/node/v23.11.1/lib/node_modules/@playwright/test');
const fs = require('fs');

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

  // First, let's inspect the structure of .bsm-full-experience at scroll 3200
  await page.evaluate(() => window.scrollTo(0, 3200));
  await page.waitForTimeout(300);

  const structure = await page.evaluate(() => {
    const section = document.querySelector('.bsm-full-experience');
    if (!section) return { error: 'Not found' };

    const sectionRect = section.getBoundingClientRect();

    // Get direct children info
    const children = Array.from(section.children).map(el => {
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        class: el.className,
        rect: { top: r.top.toFixed(1), bottom: r.bottom.toFixed(1), height: r.height.toFixed(1) },
        display: style.display,
        position: style.position,
        overflow: style.overflow,
        opacity: style.opacity,
        visibility: style.visibility
      };
    });

    // Also get sticky/fixed elements
    const stickyEls = Array.from(section.querySelectorAll('*')).filter(el => {
      const s = window.getComputedStyle(el);
      return s.position === 'sticky' || s.position === 'fixed';
    }).map(el => {
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        class: el.className.substring(0, 80),
        position: window.getComputedStyle(el).position,
        rect: { top: r.top.toFixed(1), bottom: r.bottom.toFixed(1) }
      };
    });

    return {
      sectionRect: { top: sectionRect.top.toFixed(1), bottom: sectionRect.bottom.toFixed(1), height: sectionRect.height.toFixed(1) },
      sectionPosition: window.getComputedStyle(section).position,
      children,
      stickyEls,
      scrollY: window.scrollY
    };
  });

  console.log('\n=== STRUCTURE at scroll 3200 ===');
  console.log(JSON.stringify(structure, null, 2));

  // Now go deeper into the container child
  const deepStructure = await page.evaluate(() => {
    const container = document.querySelector('.bsm-full-experience .container');
    if (!container) return { error: 'No container' };
    const r = container.getBoundingClientRect();

    const children = Array.from(container.querySelectorAll('*')).slice(0, 30).map(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        class: el.className.substring(0, 60),
        bottom: rect.bottom.toFixed(1),
        top: rect.top.toFixed(1),
        height: rect.height.toFixed(1),
        opacity: style.opacity,
        transform: style.transform !== 'none' ? style.transform.substring(0,40) : null,
        visibility: style.visibility,
        display: style.display
      };
    });

    return {
      containerRect: { top: r.top.toFixed(1), bottom: r.bottom.toFixed(1) },
      children
    };
  });

  console.log('\n=== DEEP CONTAINER STRUCTURE ===');
  console.log(JSON.stringify(deepStructure, null, 2));

  await browser.close();
})();
