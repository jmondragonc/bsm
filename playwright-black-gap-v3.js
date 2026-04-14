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

  // Find total page height and locate .bsm-full-experience section boundaries
  const pageInfo = await page.evaluate(() => {
    const section = document.querySelector('.bsm-full-experience');
    const el = document.body;

    // Get the section's offsetTop and total height in document
    let offsetTop = 0;
    let elem = section;
    while (elem) {
      offsetTop += elem.offsetTop || 0;
      elem = elem.offsetParent;
    }

    // Find next sibling section
    let next = section.nextElementSibling;
    let nextOffsetTop = 0;
    if (next) {
      let e = next;
      while (e) {
        nextOffsetTop += e.offsetTop || 0;
        e = e.offsetParent;
      }
    }

    return {
      pageHeight: document.body.scrollHeight,
      sectionOffsetTop: section.offsetTop,
      sectionOffsetHeight: section.offsetHeight,
      sectionScrollHeight: section.scrollHeight,
      nextSiblingClass: next ? next.className : 'none',
      nextSiblingOffsetTop: next ? next.offsetTop : null
    };
  });

  console.log('\n=== PAGE INFO ===');
  console.log(JSON.stringify(pageInfo, null, 2));

  // Scan a wider range to find where the section exits
  // Check where .bsm-full-experience leaves the viewport
  console.log('\n=== SCANNING FOR EXIT (wider range) ===');

  for (let scroll = 2000; scroll <= 6000; scroll += 200) {
    const info = await page.evaluate((s) => {
      window.scrollTo(0, s);
      const section = document.querySelector('.bsm-full-experience');
      if (!section) return null;
      const r = section.getBoundingClientRect();

      // Check if section is exiting
      const h2 = section.querySelector('h2');
      const tags = section.querySelector('.services-tags');
      const h2Rect = h2 ? h2.getBoundingClientRect() : null;
      const tagsRect = tags ? tags.getBoundingClientRect() : null;

      // Check opacity/transform on section and children
      const sStyle = window.getComputedStyle(section);
      const h2Style = h2 ? window.getComputedStyle(h2) : null;
      const tagsStyle = tags ? window.getComputedStyle(tags) : null;

      return {
        scroll: s,
        sectionTop: r.top.toFixed(1),
        sectionBottom: r.bottom.toFixed(1),
        sectionOpacity: sStyle.opacity,
        sectionTransform: sStyle.transform !== 'none' ? sStyle.transform.substring(0, 40) : null,
        h2Bottom: h2Rect ? h2Rect.bottom.toFixed(1) : null,
        h2Opacity: h2Style ? h2Style.opacity : null,
        h2Transform: h2Style && h2Style.transform !== 'none' ? h2Style.transform.substring(0,40) : null,
        tagsBottom: tagsRect ? tagsRect.bottom.toFixed(1) : null,
        tagsOpacity: tagsStyle ? tagsStyle.opacity : null,
      };
    }, scroll);

    if (info) {
      const changing = info.sectionTop !== '0.0' || info.sectionBottom !== '900.0' ||
                       parseFloat(info.sectionOpacity) < 1 ||
                       info.sectionTransform;
      if (changing || scroll % 1000 === 0) {
        console.log(`scroll=${scroll} | secTop=${info.sectionTop} secBot=${info.sectionBottom} | secOp=${info.sectionOpacity} | secTr=${info.sectionTransform} | h2Tr=${info.h2Transform} | h2Op=${info.h2Opacity}`);
      }
    }
  }

  await browser.close();
})();
