import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  // Open with full presentation resolution 1920x1080
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=20', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const frameElement = await page.$('iframe');
  const frame = await frameElement.contentFrame();

  const testCases = [
    { model: '11pro', comp: 'other', filename: 'inspect_11pro_taptic.png' },
    { model: '11pro', comp: 'battery', filename: 'inspect_11pro_battery.png' },
    { model: '12pro', comp: 'other', filename: 'inspect_12pro_magsafe.png' },
    { model: '13pro', comp: 'battery', filename: 'inspect_13pro_battery.png' },
    { model: '16pro', comp: 'battery', filename: 'inspect_16pro_battery.png' },
    { model: '18pro', comp: 'circuit_boards', filename: 'inspect_18pro_soc.png' },
    { model: '18pro', comp: 'other', filename: 'inspect_18pro_other.png' },
  ];

  for (const tc of testCases) {
    await frame.evaluate(({ m, c }) => {
      const modelBtn = document.querySelector(`[data-model="${m}"]`);
      if (modelBtn && modelBtn.getAttribute('aria-pressed') !== 'true') modelBtn.click();
      const compBtn = document.querySelector(`#component-list [data-component="${c}"]`);
      if (compBtn) compBtn.click();
    }, { m: tc.model, c: tc.comp });

    await page.waitForTimeout(400);

    const stage = await frame.$('#interactive-stage');
    if (stage) {
      await stage.screenshot({
        path: `/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/${tc.filename}`
      });
      console.log(`Saved stage screenshot: ${tc.filename}`);
    }
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
