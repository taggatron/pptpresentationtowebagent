import { chromium } from 'playwright';
import path from 'node:path';

const artifactDir = '/Users/danieltagg/.gemini/antigravity-ide/brain/954d7c94-13f8-49f2-8ab6-0745323ca411';

async function captureEvidence() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1376, height: 768 },
    deviceScaleFactor: 1
  });

  // 1. Slide 2 with blurs
  await page.goto('http://127.0.0.1:3005/?set=ecology_atmosphere_classic&deck=Classic_Lesson_07_The_Atmosphere&slide=2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, 'evidence_slide_02_blurs.png') });

  // 2. Slide 7 (Task only, clean pie charts)
  await page.goto('http://127.0.0.1:3005/?set=ecology_atmosphere_classic&deck=Classic_Lesson_07_The_Atmosphere&slide=7', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, 'evidence_slide_07_task_only.png') });

  // 3. Slide 8 (Step model answers with 3 blurs)
  await page.goto('http://127.0.0.1:3005/?set=ecology_atmosphere_classic&deck=Classic_Lesson_07_The_Atmosphere&slide=8', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, 'evidence_slide_08_blurs.png') });

  // 4. Slide 8 with Step 1 clicked / revealed
  const cards = await page.$$('.qa-card-overlay');
  if (cards.length > 0) {
    await cards[0].click();
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: path.join(artifactDir, 'evidence_slide_08_step1_revealed.png') });

  // 5. Slide 9 (Exam Checkpoint iframe in Split 50:50 mode with revealed answers)
  await page.goto('http://127.0.0.1:3005/?set=ecology_atmosphere_classic&deck=Classic_Lesson_07_The_Atmosphere&slide=9', { waitUntil: 'networkidle' });
  await page.waitForSelector('iframe', { timeout: 8000 });
  await page.waitForTimeout(1000);

  const frameHandle = await page.$('iframe');
  const frame = await frameHandle.contentFrame();
  if (frame) {
    const btnSplit = await frame.$('#modeBtnSplit');
    if (btnSplit) await btnSplit.click();
    const btnAnswers = await frame.$('#btnToggleAnswers');
    if (btnAnswers) await btnAnswers.click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(artifactDir, 'evidence_slide_09_exam_split_answers.png') });

  // 6. Slide 10 (Plenary)
  await page.goto('http://127.0.0.1:3005/?set=ecology_atmosphere_classic&deck=Classic_Lesson_07_The_Atmosphere&slide=10', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, 'evidence_slide_10_plenary.png') });

  await browser.close();
  console.log("Captured all visual evidence screenshots successfully.");
}

captureEvidence().catch(err => {
  console.error(err);
  process.exit(1);
});
