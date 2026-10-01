import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";

const ARTIFACTS_DIR = "/Users/danieltagg/.gemini/antigravity-ide/brain/98b52b02-7306-4d82-98ad-8a53c58a95f4";

async function verifyLesson12Slide1Video() {
  console.log("=== Verifying Classic Lesson 12 Recycling Slide 1 Video Sequence ===");

  await fs.mkdir(ARTIFACTS_DIR, { recursive: true });

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1376, height: 768 }
  });

  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("PAGE ERROR:", msg.text());
  });

  const testUrl = "http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_12_Recycling&slide=1";
  console.log(`Navigating to: ${testUrl}`);
  await page.goto(testUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // 1. Initial State (Step 1 in sequence)
  console.log("\n--- Checking Step 1 in Sequence ---");
  const step1State = await page.evaluate(() => {
    const slideImg = document.getElementById("slideImage");
    const slideVideo = document.getElementById("slideVideo");
    const buildIndicator = document.getElementById("buildIndicator");
    const currentBuildStep = window.currentMediaBuildStep;
    return {
      currentBuildStep,
      buildIndicatorText: buildIndicator?.innerText,
      slideImgVisible: slideImg && !slideImg.classList.contains("hidden"),
      slideImgSrc: slideImg?.src,
      videoVisible: slideVideo && !slideVideo.classList.contains("hidden"),
      videoPaused: slideVideo?.paused,
      videoCurrentTime: slideVideo?.currentTime
    };
  });
  console.log("Step 1 State:", JSON.stringify(step1State, null, 2));

  if (!step1State.slideImgVisible) {
    throw new Error("FAIL: Step 1 slide image should be visible!");
  }
  if (step1State.videoVisible) {
    throw new Error("FAIL: Video should be hidden during Step 1 (first in sequence)!");
  }
  console.log("✓ Step 1 verified: Original slide image is displayed first in sequence.");

  const step1Screenshot = path.join(ARTIFACTS_DIR, "lesson_12_slide_1_step_1_image.png");
  await page.screenshot({ path: step1Screenshot });
  console.log(`✓ Saved Step 1 screenshot: ${step1Screenshot}`);

  // 2. Advance to Step 2 in sequence (Video Build)
  console.log("\n--- Advancing to Step 2 in Sequence ---");
  // Click on the slide stage to advance the progressive build
  await page.click("#slideStage");
  await page.waitForTimeout(1000);

  const step2InitialState = await page.evaluate(() => {
    const slideVideo = document.getElementById("slideVideo");
    const buildIndicator = document.getElementById("buildIndicator");
    const toggleBtn = document.getElementById("stageVideoToggleBtn");
    return {
      currentBuildStep: window.currentMediaBuildStep,
      buildIndicatorText: buildIndicator?.innerText,
      videoVisible: slideVideo && !slideVideo.classList.contains("hidden"),
      videoSrc: slideVideo?.src,
      videoPaused: slideVideo?.paused,
      videoCurrentTime: slideVideo?.currentTime,
      videoDuration: slideVideo?.duration,
      toggleBtnVisible: toggleBtn && !toggleBtn.classList.contains("hidden")
    };
  });
  console.log("Step 2 Initial State:", JSON.stringify(step2InitialState, null, 2));

  if (!step2InitialState.videoVisible) {
    throw new Error("FAIL: Video should be visible in Step 2!");
  }
  if (!step2InitialState.videoSrc?.includes("gemini_generated_video_55869289.mp4")) {
    throw new Error(`FAIL: Video source unexpected: ${step2InitialState.videoSrc}`);
  }
  console.log("✓ Step 2 verified: Video is displayed second in sequence.");

  // If video is paused and waiting for click, click it to play
  if (step2InitialState.videoPaused) {
    console.log("Clicking video to start playback...");
    await page.click("#slideVideo");
    await page.waitForTimeout(500);
  }

  // 3. Monitor video playback for 3 seconds
  console.log("\n--- Monitoring 3-second Playback ---");
  await page.waitForTimeout(1200);

  const playingState = await page.evaluate(() => {
    const slideVideo = document.getElementById("slideVideo");
    return {
      paused: slideVideo?.paused,
      currentTime: slideVideo?.currentTime,
      duration: slideVideo?.duration
    };
  });
  console.log(`Video playing at time: ${playingState.currentTime.toFixed(2)}s (paused: ${playingState.paused})`);

  const playingScreenshot = path.join(ARTIFACTS_DIR, "lesson_12_slide_1_step_2_playing.png");
  await page.screenshot({ path: playingScreenshot });
  console.log(`✓ Saved playing screenshot: ${playingScreenshot}`);

  // Wait for 3-second segment to finish
  console.log("Waiting for video to reach 3.0s segment end...");
  await page.waitForTimeout(2500);

  const endedState = await page.evaluate(() => {
    const slideVideo = document.getElementById("slideVideo");
    return {
      paused: slideVideo?.paused,
      currentTime: slideVideo?.currentTime,
      duration: slideVideo?.duration
    };
  });
  console.log("Segment End State:", JSON.stringify(endedState, null, 2));

  if (!endedState.paused) {
    throw new Error(`FAIL: Video should be paused at segment end, but paused=${endedState.paused}`);
  }
  if (Math.abs(endedState.currentTime - 3.0) > 0.3) {
    throw new Error(`FAIL: Video expected to pause at ~3.0s, actual currentTime=${endedState.currentTime}`);
  }
  console.log(`✓ 3-second playback verified: Video played first 3 seconds and paused at ${endedState.currentTime.toFixed(2)}s.`);

  const endedScreenshot = path.join(ARTIFACTS_DIR, "lesson_12_slide_1_step_2_segment_end.png");
  await page.screenshot({ path: endedScreenshot });
  console.log(`✓ Saved segment end screenshot: ${endedScreenshot}`);

  // 4. Test replay functionality
  console.log("\n--- Testing Replay Functionality ---");
  await page.click("#slideVideo");
  await page.waitForTimeout(600);

  const replayingState = await page.evaluate(() => {
    const slideVideo = document.getElementById("slideVideo");
    return {
      paused: slideVideo?.paused,
      currentTime: slideVideo?.currentTime
    };
  });
  console.log("Replay State after click:", JSON.stringify(replayingState, null, 2));

  if (replayingState.paused) {
    throw new Error("FAIL: Video should resume playback on click!");
  }
  if (replayingState.currentTime > 2.0) {
    throw new Error(`FAIL: Video should have restarted from startTime, but currentTime=${replayingState.currentTime}`);
  }
  console.log(`✓ Replay verified: Resumed from start (${replayingState.currentTime.toFixed(2)}s).`);

  await browser.close();
  console.log("\n================================================================================");
  console.log("🎉 ALL CHECKS PASSED: First 3 seconds of video play second in sequence on Slide 1!");
  console.log("================================================================================");
}

verifyLesson12Slide1Video().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
