import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=20', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const frameElement = await page.$('iframe');
  const frame = await frameElement.contentFrame();

  const models = ['xs', '11pro', '12pro', '13pro', '14pro', '15pro', '16pro', '17pro', '18pro'];
  const components = ['battery', 'circuit_boards', 'other', 'display', 'aluminum', 'plastics', 'stainless_steel', 'glass'];

  let allPassed = true;
  for (const m of models) {
    for (const c of components) {
      const result = await frame.evaluate(({ model, comp }) => {
        const modelBtn = document.querySelector(`[data-model="${model}"]`);
        if (modelBtn && modelBtn.getAttribute('aria-pressed') !== 'true') {
          modelBtn.click();
        }
        
        const compBtn = document.querySelector(`#component-list [data-component="${comp}"]`);
        if (compBtn) {
          compBtn.click();
        }

        const img = document.getElementById('component-image');
        return {
          href: img ? img.getAttribute('href') : null,
          opacity: img ? img.getAttribute('opacity') : null
        };
      }, { model: m, comp: c });

      const expectedHref = `assets/comp_${m}_${c}.png`;
      if (result.href !== expectedHref) {
        console.error(`MISMATCH for ${m} ${c}: expected ${expectedHref}, got ${result.href}`);
        allPassed = false;
      }
    }
  }

  if (allPassed) {
    console.log('✓ ALL 72 CUTAWAYS MATCH 100% PERFECTLY ACROSS ALL 9 MODELS!');
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
