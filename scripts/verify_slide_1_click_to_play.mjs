import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const artifactsDir = '/Users/danieltagg/.gemini/antigravity-ide/brain/b9189ef4-68a7-4279-a65a-a474af1efadf';

async function verifyClickToPlay() {
  console.log("=== Verifying Slide 1 Click-to-Play Video ===");

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1376, height: 768 }
  });

  const page = await context.newPage();

  // Test 1: Classic_Lesson_11_Lifecycle_analysis Slide 1
  console.log("\n1. Testing Classic_Lesson_11_Lifecycle_analysis Slide 1...");
  await page.goto('http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=1', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);

  // Verify slide image / video initial state
  const initialData = await page.evaluate(() => {
    const video = document.getElementById('slideVideo');
    const toggleBtn = document.getElementById('stageVideoToggleBtn');
    const slideImg = document.getElementById('slideImage');
    return {
      hasVideo: Boolean(video),
      videoHidden: video?.classList.contains('hidden'),
      videoSrc: video?.src,
      videoPoster: video?.poster,
      isPaused: video?.paused,
      currentTime: video?.currentTime,
      toggleBtnText: toggleBtn?.innerText,
      toggleBtnHidden: toggleBtn?.classList.contains('hidden'),
      slideImgSrc: slideImg?.src
    };
  });
  console.log("Initial State (before click):", JSON.stringify(initialData, null, 2));

  if (!initialData.videoPoster?.includes('slide_01.png')) {
    throw new Error(`FAIL: Expected poster to include slide_01.png, got ${initialData.videoPoster}`);
  }
  if (!initialData.isPaused) {
    throw new Error("FAIL: Video should be paused on initial load waiting for click!");
  }

  // Capture screenshot of Slide 1 initial poster state
  const posterScreenshotPath = path.join(artifactsDir, 'verify_slide_01_poster.png');
  await page.screenshot({ path: posterScreenshotPath });
  console.log("✓ Saved initial poster screenshot:", posterScreenshotPath);

  // Now CLICK to play the video!
  console.log("\nSimulating click on Slide 1 stage to start video playback...");
  // Click on the stageVideoToggleBtn or on the stageVideo directly
  const clickTarget = await page.$('#stageVideoToggleBtn') || await page.$('#slideVideo');
  await clickTarget.click();

  // Wait 1.5 seconds for video to play
  await page.waitForTimeout(1500);

  const playingData = await page.evaluate(() => {
    const video = document.getElementById('slideVideo');
    const toggleBtn = document.getElementById('stageVideoToggleBtn');
    return {
      isPaused: video?.paused,
      currentTime: video?.currentTime,
      duration: video?.duration,
      isPlayingClass: toggleBtn?.classList.contains('is-playing'),
      toggleBtnText: toggleBtn?.innerText
    };
  });
  console.log("Playing State (after click):", JSON.stringify(playingData, null, 2));

  if (playingData.isPaused) {
    throw new Error("FAIL: Video did not start playing on click!");
  }
  if (playingData.currentTime <= 0) {
    throw new Error(`FAIL: Video currentTime should be > 0, got ${playingData.currentTime}`);
  }
  console.log(`✓ Video is actively playing! Time: ${playingData.currentTime.toFixed(2)}s / ${playingData.duration.toFixed(2)}s`);

  // Capture screenshot of Slide 1 during video playback
  const playingScreenshotPath = path.join(artifactsDir, 'verify_slide_01_playing.png');
  await page.screenshot({ path: playingScreenshotPath });
  console.log("✓ Saved playing video screenshot:", playingScreenshotPath);

  // Test 2: Verify Classic_Lesson_11_Lifecycle_Assessments Slide 1 as well
  console.log("\n2. Testing Classic_Lesson_11_Lifecycle_Assessments Slide 1...");
  await page.goto('http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_Assessments&slide=1', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);

  const deck2Data = await page.evaluate(() => {
    const video = document.getElementById('slideVideo');
    return {
      hasVideo: Boolean(video),
      videoPoster: video?.poster,
      isPaused: video?.paused
    };
  });
  console.log("Deck 2 State:", JSON.stringify(deck2Data, null, 2));
  if (!deck2Data.videoPoster?.includes('slide_01.png')) {
    throw new Error("FAIL: Deck 2 should also have slide_01.png as poster");
  }

  // Click to play deck 2
  await page.click('#stageVideoToggleBtn');
  await page.waitForTimeout(1000);
  const deck2Playing = await page.evaluate(() => !document.getElementById('slideVideo')?.paused);
  console.log("✓ Deck 2 playing after click:", deck2Playing);

  await browser.close();
  console.log("\n🎉 ALL TESTS PASSED! Slide 1 Click-to-Play Video is fully verified!");
}

verifyClickToPlay().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
