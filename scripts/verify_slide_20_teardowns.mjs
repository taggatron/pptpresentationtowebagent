import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const deckUrl = 'http://localhost:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=20';
  console.log('Navigating to:', deckUrl);
  await page.goto(deckUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const frameElement = await page.$('iframe');
  if (!frameElement) {
    console.error('No iframe found on slide 20!');
    process.exit(1);
  }
  const frame = await frameElement.contentFrame();
  await frame.waitForSelector('#phone-image');
  console.log('Interactive loaded inside iframe.');
  
  // Screenshot 1: Default XS view
  await page.screenshot({ path: '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/verify_slide20_xs_default.png' });
  console.log('Screenshot 1: verify_slide20_xs_default.png saved.');
  
  // Click Battery (XS)
  await frame.click('[data-component="battery"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/verify_slide20_xs_battery.png' });
  console.log('Screenshot 2: verify_slide20_xs_battery.png saved.');
  
  // Click Other (XS - Qi Coil & Taptic)
  await frame.click('[data-component="other"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/verify_slide20_xs_other.png' });
  console.log('Screenshot 3: verify_slide20_xs_other.png saved.');

  // Switch to iPhone 11 Pro
  await frame.click('[data-model="11pro"]');
  await page.waitForTimeout(600);
  // Click Other (11 Pro - Taptic & Magnets)
  await frame.click('[data-component="other"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/verify_slide20_11pro_taptic.png' });
  console.log('Screenshot 4: verify_slide20_11pro_taptic.png saved.');

  // Click Battery (11 Pro - L-shaped battery)
  await frame.click('[data-component="battery"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/verify_slide20_11pro_battery.png' });
  console.log('Screenshot 5: verify_slide20_11pro_battery.png saved.');

  // Switch to iPhone 12 Pro
  await frame.click('[data-model="12pro"]');
  await page.waitForTimeout(600);
  // Click Other (12 Pro - MagSafe Array & Taptic)
  await frame.click('[data-component="other"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/verify_slide20_12pro_magsafe.png' });
  console.log('Screenshot 6: verify_slide20_12pro_magsafe.png saved.');
  
  // Switch to iPhone 16 Pro
  await frame.click('[data-model="16pro"]');
  await page.waitForTimeout(600);
  // Click Battery (16 Pro - Laser-welded steel battery)
  await frame.click('[data-component="battery"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/verify_slide20_16pro_battery.png' });
  console.log('Screenshot 7: verify_slide20_16pro_battery.png saved.');

  // Switch to iPhone 18 Pro
  await frame.click('[data-model="18pro"]');
  await page.waitForTimeout(600);
  // Click Circuit Boards (18 Pro - Central A20 SoC)
  await frame.click('[data-component="circuit_boards"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/verify_slide20_18pro_soc.png' });
  console.log('Screenshot 8: verify_slide20_18pro_soc.png saved.');

  // Click Other (18 Pro - Lower MagSafe & Taptic)
  await frame.click('[data-component="other"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/verify_slide20_18pro_other.png' });
  console.log('Screenshot 9: verify_slide20_18pro_other.png saved.');

  await browser.close();
  console.log('All verification screenshots captured!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
