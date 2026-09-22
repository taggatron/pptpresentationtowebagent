import { chromium } from 'playwright';
import path from 'node:path';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const url = 'file://' + path.resolve('public/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere/interactives/exam_pdf_viewer.html');
  await page.goto(url, { waitUntil: 'networkidle' });

  // 1. Questions Only
  await page.screenshot({ path: 'scratch/exam_viewer_questions.png' });
  console.log('Saved scratch/exam_viewer_questions.png');

  // 2. Reveal Model Answer
  await page.click('#btnToggleAnswers');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'scratch/exam_viewer_model_answer.png' });
  console.log('Saved scratch/exam_viewer_model_answer.png');

  // 3. Split 50:50
  await page.click('#modeBtnSplit');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/exam_viewer_split.png' });
  console.log('Saved scratch/exam_viewer_split.png');

  // 4. Mark Scheme Only
  await page.click('#modeBtnMarkScheme');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/exam_viewer_markscheme.png' });
  console.log('Saved scratch/exam_viewer_markscheme.png');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
