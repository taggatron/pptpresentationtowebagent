import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const artifactsDir = '/Users/danieltagg/.gemini/antigravity-ide/brain/b9189ef4-68a7-4279-a65a-a474af1efadf';

async function testSlide8VideoSequence() {
  console.log("=== Testing Slide 8 Blur & Disintegrate Video Sequence ===");

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

  console.log("Navigating to slide 8...");
  await page.goto('http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=8', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);

  // 1. Verify Stage 1 State: Slide image (slide_08.png) visible, video hidden, badge = 1/2
  const stage1Data = await page.evaluate(() => {
    const slideImg = document.getElementById('slideImage');
    const slideVid = document.getElementById('slideVideo');
    const buildBadge = document.getElementById('serialStepBadge');
    return {
      imageVisible: slideImg ? !slideImg.classList.contains('hidden') : false,
      imageSrc: slideImg ? slideImg.src : null,
      videoHidden: slideVid ? slideVid.classList.contains('hidden') : true,
      videoPaused: slideVid ? slideVid.paused : true,
      badgeText: buildBadge ? buildBadge.innerText : null
    };
  });
  console.log("\n[Stage 1] Initial Image State (Slide 8):", JSON.stringify(stage1Data, null, 2));

  if (!stage1Data.imageVisible) throw new Error("FAIL: Stage 1 image (slide_08.png) should be visible!");
  if (!stage1Data.videoHidden) throw new Error("FAIL: Stage 1 video should be hidden!");

  const stage1ScreenshotPath = path.join(artifactsDir, 'verify_slide_08_stage_1.png');
  await page.screenshot({ path: stage1ScreenshotPath });
  console.log("✓ Saved Stage 1 Screenshot:", stage1ScreenshotPath);

  // 2. Click the image to trigger blur & disintegrate transition!
  console.log("\n[Clicking Image] Clicking #slideImage to advance to video case study...");
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
      videoStarted: slideVid ? !slideVid.paused : false
    };
  });
  console.log("[Mid-Transition State]:", JSON.stringify(midTransitionData, null, 2));

  const midTransitionScreenshotPath = path.join(artifactsDir, 'verify_slide_08_disintegrating.png');
  await page.screenshot({ path: midTransitionScreenshotPath });
  console.log("✓ Saved Mid-Transition Screenshot:", midTransitionScreenshotPath);

  // 3. Wait for transition to complete and video to be actively playing (~1.5s total)
  await page.waitForTimeout(1500);
  const stage2Data = await page.evaluate(() => {
    const slideImg = document.getElementById('slideImage');
    const slideVid = document.getElementById('slideVideo');
    const buildBadge = document.getElementById('serialStepBadge');
    return {
      imageHidden: slideImg ? slideImg.classList.contains('hidden') : true,
      videoPlaying: slideVid ? !slideVid.paused : false,
      videoCurrentTime: slideVid ? slideVid.currentTime : 0,
      videoSrc: slideVid ? slideVid.currentSrc || slideVid.src : null,
      badgeText: buildBadge ? buildBadge.innerText : null
    };
  });
  console.log("\n[Stage 2] Video Active State (Slide 8):", JSON.stringify(stage2Data, null, 2));

  if (!stage2Data.videoPlaying) throw new Error("FAIL: Video should be playing in Stage 2!");
  if (stage2Data.videoCurrentTime <= 0) throw new Error("FAIL: Video currentTime should be advancing!");

  const stage2ScreenshotPath = path.join(artifactsDir, 'verify_slide_08_stage_2_video.png');
  await page.screenshot({ path: stage2ScreenshotPath });
  console.log("✓ Saved Stage 2 Screenshot:", stage2ScreenshotPath);

  // 4. Test regression back to Stage 1
  console.log("\n[Testing Step Regression] Clicking Previous Build Step...");
  const prevBtn = await page.$('#serialPrevBtn');
  if (prevBtn) {
    await prevBtn.click();
    await page.waitForTimeout(600);
    const regressedData = await page.evaluate(() => {
      const slideImg = document.getElementById('slideImage');
      const slideVid = document.getElementById('slideVideo');
      return {
        imageVisible: slideImg ? !slideImg.classList.contains('hidden') : false,
        videoHidden: slideVid ? slideVid.classList.contains('hidden') : true,
        videoPaused: slideVid ? slideVid.paused : true
      };
    });
    console.log("Regressed State:", JSON.stringify(regressedData, null, 2));
    if (!regressedData.imageVisible || !regressedData.videoHidden) {
      throw new Error("FAIL: Should cleanly return to Stage 1 poster image on Previous Step!");
    }
    console.log("✓ Successfully verified regression to Stage 1!");

    // Advance forward again to verify re-entry
    console.log("[Testing Step Forward] Clicking Next Build Step...");
    const nextBtn = await page.$('#serialNextBtn');
    if (nextBtn) {
      await nextBtn.click();
      await page.waitForTimeout(1000);
      const reEnteredVideo = await page.evaluate(() => {
        const slideVid = document.getElementById('slideVideo');
        return slideVid ? !slideVid.paused : false;
      });
      console.log("Re-entered Stage 2 video playing:", reEnteredVideo);
    }
  }

  // Also verify secondary deck (Classic_Lesson_11_Lifecycle_Assessments) slide 8
  console.log("\n=== Testing Secondary Deck Slide 8 ===");
  await page.goto('http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_Assessments&slide=8', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(1500);

  const secStage1 = await page.evaluate(() => {
    const slideImg = document.getElementById('slideImage');
    const slideVid = document.getElementById('slideVideo');
    return {
      imageVisible: slideImg ? !slideImg.classList.contains('hidden') : false,
      videoHidden: slideVid ? slideVid.classList.contains('hidden') : true
    };
  });
  console.log("Secondary Deck Stage 1:", secStage1);
  if (!secStage1.imageVisible) throw new Error("Secondary deck stage 1 failed");

  await page.click('#slideImage');
  await page.waitForTimeout(1500);

  const secStage2 = await page.evaluate(() => {
    const slideVid = document.getElementById('slideVideo');
    return {
      videoPlaying: slideVid ? !slideVid.paused : false,
      videoCurrentTime: slideVid ? slideVid.currentTime : 0
    };
  });
  console.log("Secondary Deck Stage 2 Video Playing:", secStage2);
  if (!secStage2.videoPlaying) throw new Error("Secondary deck stage 2 video failed");

  console.log("\n ALL TESTS PASSED! Both decks verified successfully!");

  await browser.close();
}

testSlide8VideoSequence().catch(err => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
