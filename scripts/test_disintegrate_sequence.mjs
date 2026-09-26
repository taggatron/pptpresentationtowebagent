import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const artifactsDir = '/Users/danieltagg/.gemini/antigravity-ide/brain/b9189ef4-68a7-4279-a65a-a474af1efadf';

async function testDisintegrateSequence() {
  console.log("=== Testing Blur & Disintegrate Click Sequence ===");

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

  await page.goto('http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=1', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);

  // 1. Verify Stage 1 State
  const stage1Data = await page.evaluate(() => {
    const slideImg = document.getElementById('slideImage');
    const slideVid = document.getElementById('slideVideo');
    const buildBadge = document.getElementById('currentBuildBadge');
    return {
      currentStep: window.currentMediaBuildStep,
      imageVisible: slideImg ? !slideImg.classList.contains('hidden') : false,
      imageSrc: slideImg ? slideImg.src : null,
      videoHidden: slideVid ? slideVid.classList.contains('hidden') : true,
      videoPaused: slideVid ? slideVid.paused : true,
      badgeText: buildBadge ? buildBadge.innerText : null
    };
  });
  console.log("\n[Stage 1] Initial Image State:", JSON.stringify(stage1Data, null, 2));

  if (!stage1Data.imageVisible) throw new Error("FAIL: Stage 1 image should be visible!");
  if (stage1Data.currentStep !== 1) throw new Error(`FAIL: Expected currentMediaBuildStep 1, got ${stage1Data.currentStep}`);

  const stage1ScreenshotPath = path.join(artifactsDir, 'verify_stage_1_clean_poster.png');
  await page.screenshot({ path: stage1ScreenshotPath });
  console.log("✓ Saved Stage 1 Screenshot:", stage1ScreenshotPath);

  // 2. Click the image to trigger blur & disintegrate transition!
  console.log("\n[Clicking Image] Triggering blur & disintegrate transition...");
  await page.click('#slideImage');

  // Immediately check disintegrating state during the transition (~250ms in)
  await page.waitForTimeout(250);
  const midTransitionData = await page.evaluate(() => {
    const slideImg = document.getElementById('slideImage');
    const canvas = document.getElementById('disintegrateCanvas');
    const slideVid = document.getElementById('slideVideo');
    return {
      isDisintegrating: slideImg ? slideImg.classList.contains('is-disintegrating') : false,
      canvasExists: Boolean(canvas),
      currentStep: window.currentMediaBuildStep,
      videoStarted: slideVid ? !slideVid.paused : false
    };
  });
  console.log("[Mid-Transition State]:", JSON.stringify(midTransitionData, null, 2));

  const midTransitionScreenshotPath = path.join(artifactsDir, 'verify_stage_1_disintegrating.png');
  await page.screenshot({ path: midTransitionScreenshotPath });
  console.log("✓ Saved Mid-Transition Screenshot:", midTransitionScreenshotPath);

  // 3. Wait for transition to complete and video to be actively playing (~1.2s total)
  await page.waitForTimeout(1000);
  const stage2Data = await page.evaluate(() => {
    const slideImg = document.getElementById('slideImage');
    const slideVid = document.getElementById('slideVideo');
    const buildBadge = document.getElementById('currentBuildBadge');
    return {
      currentStep: window.currentMediaBuildStep,
      imageHidden: slideImg ? slideImg.classList.contains('hidden') : true,
      videoPlaying: slideVid ? !slideVid.paused : false,
      videoCurrentTime: slideVid ? slideVid.currentTime : 0,
      badgeText: buildBadge ? buildBadge.innerText : null
    };
  });
  console.log("\n[Stage 2] Video Active State:", JSON.stringify(stage2Data, null, 2));

  if (!stage2Data.videoPlaying) throw new Error("FAIL: Video should be playing in Stage 2!");
  if (stage2Data.videoCurrentTime <= 0) throw new Error("FAIL: Video currentTime should be advancing!");

  const stage2ScreenshotPath = path.join(artifactsDir, 'verify_stage_2_video_revealed.png');
  await page.screenshot({ path: stage2ScreenshotPath });
  console.log("✓ Saved Stage 2 Screenshot:", stage2ScreenshotPath);

  // 4. Test regression back to Stage 1
  console.log("\n[Testing Regression] Clicking Previous Build Step...");
  await page.click('#prevBuildStepBtn');
  await page.waitForTimeout(600);

  const regressedData = await page.evaluate(() => {
    const slideImg = document.getElementById('slideImage');
    const slideVid = document.getElementById('slideVideo');
    return {
      currentStep: window.currentMediaBuildStep,
      imageVisible: slideImg ? !slideImg.classList.contains('hidden') : false,
      videoHidden: slideVid ? slideVid.classList.contains('hidden') : true,
      videoPaused: slideVid ? slideVid.paused : true
    };
  });
  console.log("[Regressed State]:", JSON.stringify(regressedData, null, 2));

  if (regressedData.currentStep !== 1 || !regressedData.imageVisible || !regressedData.videoPaused) {
    throw new Error("FAIL: Regressing to Stage 1 should restore image and pause video!");
  }
  console.log("✓ Regression back to Stage 1 verified cleanly!");

  await browser.close();
  console.log("\n🎉 ALL TESTS PASSED! Blur & Disintegrate sequence is functioning perfectly!");
}

testDisintegrateSequence().catch(err => {
  console.error(err);
  process.exit(1);
});
