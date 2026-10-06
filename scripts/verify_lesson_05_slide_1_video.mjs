import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";

const ARTIFACTS_DIR = "/Users/danieltagg/.gemini/antigravity-ide/brain/2ae9d5c9-f884-49cb-9464-94e9224047aa";

async function verifyLesson05Slide1Video() {
  console.log("=== Verifying Lesson 5 Slide 1 Video Sequence ===");

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

  const testUrl = "http://127.0.0.1:3000/?set=genetics_aaq&deck=Lesson_05_Gene_mutations_acquired_and_inherited&slide=1";
  console.log(`Navigating to: ${testUrl}`);
  await page.goto(testUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // 1. Initial State (Step 1 in sequence: Original Slide Image)
  console.log("\n--- Checking Step 1 in Sequence ---");
  const step1State = await page.evaluate(() => {
    const slideImg = document.getElementById("slideImage");
    const slideVideo = document.getElementById("slideVideo");
    const serialBadge = document.getElementById("serialStepBadge");
    const prevBtn = document.getElementById("prevBuildStepBtn");
    const nextBtn = document.getElementById("nextBuildStepBtn");
    return {
      serialBadgeText: serialBadge?.textContent,
      prevBtnDisabled: prevBtn?.disabled,
      nextBtnDisabled: nextBtn?.disabled,
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
  if (!step1State.serialBadgeText?.startsWith("1 / 2")) {
    throw new Error(`FAIL: Expected badge to start with '1 / 2', got: ${step1State.serialBadgeText}`);
  }
  if (!step1State.prevBtnDisabled) {
    throw new Error("FAIL: Expected prev button to be disabled at Step 1!");
  }
  if (step1State.nextBtnDisabled) {
    throw new Error("FAIL: Expected next button to be enabled at Step 1!");
  }
  console.log("✓ Step 1 verified: Original slide image is displayed first in sequence.");

  const step1Screenshot = path.join(ARTIFACTS_DIR, "lesson_05_slide_1_step_1_image.png");
  await page.screenshot({ path: step1Screenshot });
  console.log(`✓ Saved Step 1 screenshot: ${step1Screenshot}`);

  // 2. Advance to Step 2 in sequence (Video Build - 2nd click sequence position)
  console.log("\n--- Advancing to Step 2 in Sequence (Click #slideStage) ---");
  await page.click("#slideStage");
  await page.waitForTimeout(1000);

  const step2InitialState = await page.evaluate(() => {
    const slideVideo = document.getElementById("slideVideo");
    const slideImg = document.getElementById("slideImage");
    const serialBadge = document.getElementById("serialStepBadge");
    const prevBtn = document.getElementById("prevBuildStepBtn");
    const nextBtn = document.getElementById("nextBuildStepBtn");
    const toggleBtn = document.getElementById("stageVideoToggleBtn");
    return {
      serialBadgeText: serialBadge?.textContent,
      prevBtnDisabled: prevBtn?.disabled,
      nextBtnDisabled: nextBtn?.disabled,
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
  if (!step2InitialState.videoSrc?.includes("gemini_generated_video_e811233a.mp4")) {
    throw new Error(`FAIL: Video source unexpected: ${step2InitialState.videoSrc}`);
  }
  if (!step2InitialState.serialBadgeText?.startsWith("2 / 2")) {
    throw new Error(`FAIL: Expected badge to start with '2 / 2', got: ${step2InitialState.serialBadgeText}`);
  }
  if (step2InitialState.prevBtnDisabled) {
    throw new Error("FAIL: Expected prev button to be enabled at Step 2!");
  }
  if (!step2InitialState.nextBtnDisabled) {
    throw new Error("FAIL: Expected next button to be disabled at Step 2!");
  }
  console.log("✓ Step 2 verified: Video is displayed second in sequence at 2nd click position.");

  // Play video if paused
  if (step2InitialState.videoPaused) {
    console.log("Starting video playback...");
    await page.evaluate(() => {
      const vid = document.getElementById("slideVideo");
      return vid?.play();
    });
    await page.waitForTimeout(1000);
  }

  const step2PlaybackState = await page.evaluate(() => {
    const vid = document.getElementById("slideVideo");
    return {
      paused: vid?.paused,
      currentTime: vid?.currentTime,
      duration: vid?.duration
    };
  });
  console.log("Step 2 Playback State:", JSON.stringify(step2PlaybackState, null, 2));

  const step2Screenshot = path.join(ARTIFACTS_DIR, "lesson_05_slide_1_step_2_video.png");
  await page.screenshot({ path: step2Screenshot });
  console.log(`✓ Saved Step 2 screenshot: ${step2Screenshot}`);

  // 3. Test Step Backward (Back to Step 1)
  console.log("\n--- Testing Step Backward (Prev Build Button) ---");
  await page.click("#prevBuildStepBtn");
  await page.waitForTimeout(500);

  const backToStep1State = await page.evaluate(() => {
    const slideImg = document.getElementById("slideImage");
    const slideVideo = document.getElementById("slideVideo");
    const serialBadge = document.getElementById("serialStepBadge");
    return {
      serialBadgeText: serialBadge?.textContent,
      slideImgVisible: slideImg && !slideImg.classList.contains("hidden"),
      videoVisible: slideVideo && !slideVideo.classList.contains("hidden")
    };
  });
  console.log("Back to Step 1 State:", JSON.stringify(backToStep1State, null, 2));
  if (!backToStep1State.serialBadgeText?.startsWith("1 / 2") || !backToStep1State.slideImgVisible || backToStep1State.videoVisible) {
    throw new Error("FAIL: Reverting to Step 1 failed!");
  }
  console.log("✓ Step backward to Step 1 verified.");

  // 4. Test Step Forward (Back to Step 2)
  console.log("\n--- Testing Step Forward (Next Build Button) ---");
  await page.click("#nextBuildStepBtn");
  await page.waitForTimeout(500);

  const forwardToStep2State = await page.evaluate(() => {
    const slideVideo = document.getElementById("slideVideo");
    const serialBadge = document.getElementById("serialStepBadge");
    return {
      serialBadgeText: serialBadge?.textContent,
      videoVisible: slideVideo && !slideVideo.classList.contains("hidden")
    };
  });
  console.log("Forward to Step 2 State:", JSON.stringify(forwardToStep2State, null, 2));
  if (!forwardToStep2State.serialBadgeText?.startsWith("2 / 2") || !forwardToStep2State.videoVisible) {
    throw new Error("FAIL: Advancing back to Step 2 failed!");
  }
  console.log("✓ Step forward back to Step 2 verified.");

  await browser.close();
  console.log("\n=== ALL VIDEO INTEGRATION TESTS PASSED SUCCESSFULLY! ===");
}

verifyLesson05Slide1Video().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
