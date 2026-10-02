import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { planSlideAnimation } from "../src/slide-animation-planner.js";

const SET_ID = "cell_biology";
const DECK_ID = "Lesson_11_PHOTOSYNTHESIS";
const PROJECT_ROOT = process.cwd();
const DECK_DIR = path.join(PROJECT_ROOT, "public/decks", SET_ID, DECK_ID);
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

const VIDEO_FILE_NAME = "gemini_generated_video_c5bd9581.mp4";
const VIDEO_URL = `/decks/${SET_ID}/${DECK_ID}/slides/${VIDEO_FILE_NAME}`;
const SLIDE_IMAGE_NAME = "slide_05.png";
const SLIDE_IMAGE_URL = `/decks/${SET_ID}/${DECK_ID}/slides/${SLIDE_IMAGE_NAME}`;

async function main() {
  console.log(`=== Step 1: Updating manifest.json for ${DECK_ID} ===`);

  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  const slideIndex = manifest.slides.findIndex((s) => s.imageFileName === SLIDE_IMAGE_NAME);
  if (slideIndex === -1) {
    throw new Error(`Could not find slide with imageFileName: ${SLIDE_IMAGE_NAME}`);
  }

  const slide = manifest.slides[slideIndex];
  console.log(`Found target slide at index ${slideIndex} (Slide ${slide.number}): "${slide.title || slide.text?.split("\n")[0]}"`);

  const slideNum = slide.number;

  // Configure progressive builds with image as Step 1 and video as Step 2 (second click)
  const imageBuildId = `slide_${String(slideNum).padStart(2, "0")}_image_build_1`;
  const videoBuildId = `slide_${String(slideNum).padStart(2, "0")}_video_build_2`;

  const progressiveBuilds = [
    {
      id: imageBuildId,
      version: 1,
      kind: "image",
      label: "Build 1: The Factory Floor (Inside the Eukaryotic Plant Cell)",
      imageUrl: SLIDE_IMAGE_URL
    },
    {
      id: videoBuildId,
      version: 2,
      kind: "video",
      label: "Build 2: Chloroplast Machinery Video",
      videoUrl: VIDEO_URL,
      imageUrl: SLIDE_IMAGE_URL,
      posterUrl: SLIDE_IMAGE_URL,
      transition: "blur-disintegrate"
    }
  ];

  const serialSteps = [
    {
      step: 1,
      buildId: imageBuildId,
      title: "Build 1: The Factory Floor (Inside the Eukaryotic Plant Cell)",
      componentIds: [imageBuildId],
      targetBounds: { x: 0, y: 0, w: 100, h: 100 },
      revealType: "crossfade"
    },
    {
      step: 2,
      buildId: videoBuildId,
      title: "Build 2: Chloroplast Machinery Video",
      componentIds: [videoBuildId],
      targetBounds: { x: 0, y: 0, w: 100, h: 100 },
      revealType: "play-video"
    }
  ];

  const history = [
    {
      id: "ver_orig",
      label: "Build 1: The Factory Floor (Inside the Eukaryotic Plant Cell)",
      imageUrl: SLIDE_IMAGE_URL
    },
    {
      id: "ver_video",
      label: "Build 2: Chloroplast Machinery Video",
      videoUrl: VIDEO_URL,
      imageUrl: SLIDE_IMAGE_URL
    }
  ];

  const updatedSlideRaw = {
    ...slide,
    hasProgressiveBuilds: true,
    videoUrl: VIDEO_URL,
    posterUrl: SLIDE_IMAGE_URL,
    originalImageUrl: SLIDE_IMAGE_URL,
    progressiveBuilds,
    history,
    serialAnimation: {
      totalBuildSteps: 2,
      autoAdvanceDelayMs: 3200,
      serialSteps
    },
    deckTitle: manifest.title
  };

  delete updatedSlideRaw.geminiImageCells;

  const plannedSlide = planSlideAnimation(updatedSlideRaw, { preserveVideo: true });

  manifest.slides[slideIndex] = plannedSlide;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`✓ Successfully updated ${MANIFEST_PATH}`);
  console.log(`  Slide ${plannedSlide.number}: animation mode = "${plannedSlide.animationPlan.mode}", progressiveBuilds = ${plannedSlide.progressiveBuilds.length}`);

  // Step 2: Verification with Playwright
  console.log("\n=== Step 2: Verifying Video Sequence in Browser ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const url = `http://127.0.0.1:3000/?set=${SET_ID}&deck=${DECK_ID}&slide=${slideNum}`;
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Check Step 1 state
  const step1State = await page.evaluate(() => {
    const slideImg = document.getElementById("slideImage");
    const slideVid = document.getElementById("slideVideo");
    const badge = document.getElementById("buildIndicator") || document.getElementById("serialStepBadge");
    return {
      imgVisible: slideImg && !slideImg.classList.contains("hidden"),
      imgSrc: slideImg?.src,
      vidHidden: slideVid && slideVid.classList.contains("hidden"),
      vidPaused: slideVid?.paused,
      badgeText: badge?.innerText
    };
  });
  console.log("Step 1 State (Initial view):", JSON.stringify(step1State, null, 2));

  if (!step1State.imgVisible) throw new Error("FAIL: Step 1 slide image should be visible!");
  if (!step1State.vidHidden) throw new Error("FAIL: Step 1 video should be hidden!");

  const scratchDir = path.join(PROJECT_ROOT, "scratch");
  await page.screenshot({ path: path.join(scratchDir, "verify_slide_06_step_1_image.png") });
  console.log("✓ Saved Step 1 screenshot");

  // Click slide image to advance to Step 2 (Video Reveal)
  console.log("Advancing to Step 2 by clicking #slideImage...");
  await page.click("#slideImage");
  await page.waitForTimeout(1200);

  const step2State = await page.evaluate(() => {
    const slideVid = document.getElementById("slideVideo");
    const badge = document.getElementById("buildIndicator") || document.getElementById("serialStepBadge");
    return {
      vidVisible: slideVid && !slideVid.classList.contains("hidden"),
      vidSrc: slideVid?.src || slideVid?.currentSrc,
      vidPaused: slideVid?.paused,
      vidTime: slideVid?.currentTime,
      badgeText: badge?.innerText
    };
  });
  console.log("Step 2 State (Video active):", JSON.stringify(step2State, null, 2));

  if (!step2State.vidVisible) throw new Error("FAIL: Video should be visible in Step 2!");
  if (!step2State.vidSrc?.includes(VIDEO_FILE_NAME)) {
    throw new Error(`FAIL: Video src does not match ${VIDEO_FILE_NAME}, got ${step2State.vidSrc}`);
  }

  await page.screenshot({ path: path.join(scratchDir, "verify_slide_06_step_2_video.png") });
  console.log("✓ Saved Step 2 screenshot");

  // Test Regression back to Step 1
  console.log("Testing regression back to Step 1...");
  const prevBtn = await page.$("#serialPrevBtn");
  if (prevBtn) {
    await prevBtn.click();
    await page.waitForTimeout(600);
    const regressedState = await page.evaluate(() => {
      const slideImg = document.getElementById("slideImage");
      const slideVid = document.getElementById("slideVideo");
      return {
        imgVisible: slideImg && !slideImg.classList.contains("hidden"),
        vidHidden: slideVid && slideVid.classList.contains("hidden")
      };
    });
    console.log("Regressed State:", JSON.stringify(regressedState, null, 2));
    if (!regressedState.imgVisible || !regressedState.vidHidden) {
      throw new Error("FAIL: Regressing back to Step 1 failed!");
    }
    console.log("✓ Regression to Step 1 verified successfully.");
  }

  await browser.close();
  console.log("\n🎉 ALL CHECKS PASSED: Video successfully integrated as second click in sequence!");
}

main().catch((err) => {
  console.error("Error integrating video:", err);
  process.exit(1);
});
