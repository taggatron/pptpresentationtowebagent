import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";

async function verify() {
  console.log("=== Verifying Lesson 02 Slide 3 Progressive Builds & Overlays ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Navigate to Slide 3 directly
  console.log("Loading Slide 3 in browser...");
  await page.goto("http://localhost:3000/?set=intro_aaq_human_bio&deck=Lesson_02_Working_like_a_Human_Biologist&slide=3", { waitUntil: "networkidle" });
  await page.waitForSelector("#slideImage", { state: "visible", timeout: 10000 });
  await page.waitForTimeout(1500);

  // Check Build 1 State
  const build1State = await page.evaluate(() => {
    const slide = window.currentDeck?.slides?.[window.currentSlideIndex];
    return {
      title: slide?.title,
      slideNumber: slide?.number,
      hasProgressiveBuilds: slide?.hasProgressiveBuilds,
      buildStepBadge: document.querySelector("#serialStepBadge")?.textContent?.trim(),
      slideImageSrc: document.querySelector("#slideImage")?.src,
      interactiveCardsCount: document.querySelectorAll(".qa-card-overlay").length
    };
  });
  console.log("Build 1 state:", build1State);

  // Screenshot Slide 3 Build 1
  const scratchDir = path.resolve("scratch");
  await fs.mkdir(scratchDir, { recursive: true });
  await page.screenshot({ path: "scratch/verify_slide_03_build_1_task_only.png" });
  console.log("Captured: scratch/verify_slide_03_build_1_task_only.png");

  // 2. Advance to Build 2
  console.log("\nAdvancing to Build 2 (Next Step)...");
  const nextBuildBtn = await page.$("#nextBuildStepBtn");
  if (nextBuildBtn) {
    await nextBuildBtn.click();
    await page.waitForTimeout(1000);
  } else {
    // Alternatively press ArrowDown
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(1000);
  }

  const build2State = await page.evaluate(() => {
    const slide = window.currentDeck?.slides?.[window.currentSlideIndex];
    return {
      title: slide?.title,
      slideNumber: slide?.number,
      buildStepBadge: document.querySelector("#serialStepBadge")?.textContent?.trim(),
      slideImageSrc: document.querySelector("#slideImage")?.src,
      interactiveCardsCount: document.querySelectorAll(".qa-card-overlay").length
    };
  });
  console.log("Build 2 state:", build2State);

  await page.screenshot({ path: "scratch/verify_slide_03_build_2_sop_unrevealed.png" });
  console.log("Captured: scratch/verify_slide_03_build_2_sop_unrevealed.png");

  // 3. Click all checkpoint buttons to reveal answers on Build 2
  console.log("\nRevealing all checkpoint answers on Build 2...");
  const cardCount = await page.$$eval(".qa-card-overlay", els => els.length);
  for (let i = 0; i < cardCount; i++) {
    const cards = await page.$$(".qa-card-overlay");
    if (cards[i]) {
      await cards[i].click();
      await page.waitForTimeout(300);
    }
  }
  await page.waitForTimeout(800);

  await page.screenshot({ path: "scratch/verify_slide_03_build_2_sop_revealed.png" });
  console.log("Captured: scratch/verify_slide_03_build_2_sop_revealed.png");

  await browser.close();
  console.log("\n=== Verification Completed Successfully ===");
}

verify().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
