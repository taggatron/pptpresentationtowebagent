import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  const url = 'http://localhost:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=20';
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const frameElement = await page.$('iframe');
  if (!frameElement) {
    throw new Error('No iframe found on slide 20');
  }
  const frame = await frameElement.contentFrame();

  const models = ['xs', '11pro', '12pro', '13pro', '14pro', '15pro', '16pro', '17pro', '18pro'];
  const components = ['battery', 'circuit_boards', 'other', 'display', 'aluminum', 'plastics', 'stainless_steel', 'glass'];

  console.log('Testing all models and components in interactive...');
  let totalChecked = 0;
  for (const m of models) {
    await frame.click(`[data-model="${m}"]`);
    await page.waitForTimeout(300);

    const baseHref = await frame.getAttribute('#phone-image', 'href');
    if (!baseHref || !baseHref.includes(m)) {
      console.error(`Base image mismatch for ${m}: ${baseHref}`);
    }

    for (const c of components) {
      await frame.click(`[data-component="${c}"]`);
      await page.waitForTimeout(100);

      const compHref = await frame.getAttribute('#component-image', 'href');
      const compOpacity = await frame.getAttribute('#component-image', 'opacity');

      if (compOpacity !== '1' || !compHref || !compHref.includes(`comp_${m}_${c}`)) {
        console.error(`Failed cutaway for ${m} ${c}: opacity=${compOpacity}, href=${compHref}`);
      } else {
        totalChecked++;
      }
    }
    // Test clicking on phone mesh directly
    const hotspot = await frame.$(`#hotspot-mesh-other`);
    if (hotspot) {
      await hotspot.click();
      await page.waitForTimeout(100);
      const activeHref = await frame.getAttribute('#component-image', 'href');
      if (!activeHref || !activeHref.includes(`comp_${m}_other`)) {
        console.error(`Mesh click failed for ${m} other: href=${activeHref}`);
      }
    }

    // Reset
    await frame.click('#reset');
  }

  console.log(`Successfully verified ${totalChecked} cutaway transitions across all 9 models!`);
  console.log('Total console errors caught:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  } else {
    console.log('✓ Zero console errors across all 9 models and all components!');
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
