import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const artifactsDir = '/Users/danieltagg/.gemini/antigravity-ide/brain/b9189ef4-68a7-4279-a65a-a474af1efadf';

async function testSlide2Reveal() {
  console.log("=== Testing Slide 2 Blurred Reveal Boxes ===");

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1376, height: 768 }
  });

  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });

  await page.goto('http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=2', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);

  // 1. Verify 6 blur boxes are present
  const cardsInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.qa-card-overlay'));
    return cards.map(c => ({
      id: c.id,
      classes: c.className,
      left: c.style.left,
      top: c.style.top,
      width: c.style.width,
      height: c.style.height,
      ariaPressed: c.getAttribute('aria-pressed')
    }));
  });

  console.log(`Found ${cardsInfo.length} reveal cards on slide 2:`);
  console.log(JSON.stringify(cardsInfo, null, 2));

  if (cardsInfo.length !== 6) {
    throw new Error(`FAIL: Expected 6 blur cards, but found ${cardsInfo.length}`);
  }

  const allMasked = cardsInfo.every(c => c.classes.includes('masked-blur') && c.ariaPressed === 'false');
  if (!allMasked) {
    throw new Error('FAIL: Not all cards are in masked-blur state initially');
  }

  const maskedPath = path.join(artifactsDir, 'verify_slide_02_masked.png');
  await page.screenshot({ path: maskedPath });
  console.log('✓ Saved Masked Screenshot:', maskedPath);

  // 2. Click card 1 and card 5 to reveal them
  console.log('Clicking card 1 and card 5...');
  await page.click('#qa_card_reveal_2_cell_1');
  await page.waitForTimeout(300);
  await page.click('#qa_card_reveal_2_cell_5');
  await page.waitForTimeout(400);

  const partialCardsInfo = await page.evaluate(() => {
    const c1 = document.getElementById('qa_card_reveal_2_cell_1');
    const c5 = document.getElementById('qa_card_reveal_2_cell_5');
    return {
      c1Revealed: c1 ? c1.classList.contains('revealed') : false,
      c5Revealed: c5 ? c5.classList.contains('revealed') : false
    };
  });
  console.log('Partial reveal state:', partialCardsInfo);
  if (!partialCardsInfo.c1Revealed || !partialCardsInfo.c5Revealed) {
    throw new Error('FAIL: Cards 1 and 5 should be revealed after click');
  }

  const partialPath = path.join(artifactsDir, 'verify_slide_02_partially_revealed.png');
  await page.screenshot({ path: partialPath });
  console.log('✓ Saved Partially Revealed Screenshot:', partialPath);

  // 3. Click reveal all button if available or click remaining cards
  console.log('Revealing all remaining cards...');
  const revealAllBtn = await page.$('#revealAllBtn');
  if (revealAllBtn && await revealAllBtn.isVisible()) {
    await revealAllBtn.click();
  } else {
    for (const card of cardsInfo) {
      const isRev = await page.$eval(`#${card.id}`, el => el.classList.contains('revealed'));
      if (!isRev) await page.click(`#${card.id}`);
    }
  }
  await page.waitForTimeout(500);

  const allRevealedPath = path.join(artifactsDir, 'verify_slide_02_all_revealed.png');
  await page.screenshot({ path: allRevealedPath });
  console.log('✓ Saved All Revealed Screenshot:', allRevealedPath);

  await browser.close();
  console.log('\n🎉 ALL TESTS PASSED! Slide 2 blurred reveal boxes are functioning properly!');
}

testSlide2Reveal().catch(err => {
  console.error(err);
  process.exit(1);
});
