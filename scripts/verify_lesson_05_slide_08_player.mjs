import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

async function verifySlide8() {
  console.log("Starting verification of Lesson 5 Slide 8 in player...");

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const url = "http://127.0.0.1:3001/?set=intro_aaq_human_bio&deck=Lesson_05_Communicating_like_a_Human_Biologist_Source_Reliability_and_Referencing&slide=8";
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Jump to slide 8 via thumbnail if needed
  const slide8Thumb = `.thumb-item[data-slide-index="7"]`;
  try {
    await page.waitForSelector(slide8Thumb, { timeout: 4000 });
    await page.click(slide8Thumb);
    await page.waitForTimeout(1000);
  } catch {
    console.log("Direct URL opened slide 8");
  }

  // Helper to read current player state
  async function getState() {
    return await page.evaluate(() => {
      const badge = document.getElementById("serialStepBadge")?.textContent || "";
      const img = document.getElementById("slideImage")?.src || "";
      const buildCount = document.querySelectorAll(".serial-step-chip")?.length || 0;
      return { badge, img, buildCount };
    });
  }

  // --- BUILD 1 ---
  const state1 = await getState();
  console.log("Build 1 state:", state1);
  await page.screenshot({ path: "scratch/player_verified_b1.png" });
  console.log("✓ Captured Build 1 screenshot");

  // --- BUILD 2 ---
  await page.click("#nextBuildStepBtn");
  await page.waitForTimeout(800);
  const state2 = await getState();
  console.log("Build 2 state:", state2);
  await page.screenshot({ path: "scratch/player_verified_b2.png" });
  console.log("✓ Captured Build 2 screenshot");

  // --- BUILD 3 ---
  await page.click("#nextBuildStepBtn");
  await page.waitForTimeout(800);
  const state3 = await getState();
  console.log("Build 3 state:", state3);
  await page.screenshot({ path: "scratch/player_verified_b3.png" });
  console.log("✓ Captured Build 3 screenshot");

  // --- BUILD 4 ---
  await page.click("#nextBuildStepBtn");
  await page.waitForTimeout(800);
  const state4 = await getState();
  console.log("Build 4 state:", state4);
  await page.screenshot({ path: "scratch/player_verified_b4.png" });
  console.log("✓ Captured Build 4 screenshot");

  // Copy screenshots to brain directory
  const brainDir = "/Users/danieltagg/.gemini/antigravity-ide/brain/8e0d4b0f-ebf8-4339-93e1-69956788e3a6";
  for (let i = 1; i <= 4; i++) {
    const src = path.resolve(`scratch/player_verified_b${i}.png`);
    const dst = path.join(brainDir, `player_verified_b${i}.png`);
    await fs.copyFile(src, dst);
  }
  console.log("✓ All player screenshots copied to brain directory");

  await browser.close();
  process.exit(0);
}

verifySlide8().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
