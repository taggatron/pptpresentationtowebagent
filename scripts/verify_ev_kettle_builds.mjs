import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";

async function main() {
  console.log("=== Verifying EV Power Lesson Slide 3 Builds ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto("http://localhost:3000/?set=physics_electricity_magnetism&deck=Lesson_05_EV_Power_Calculations", {
      waitUntil: "networkidle"
    });
    await page.waitForTimeout(2000);

    // Click specifically on thumbnail for Slide 3 (index 2)
    console.log("Clicking thumbnail for Slide 3 (index 2)...");
    await page.click('.thumb-item[data-slide-index="2"]');
    await page.waitForTimeout(1000);

    const slideNum = await page.$eval("#currentSlideNum", el => el.textContent.trim()).catch(() => "unknown");
    const deckHeader = await page.$eval("#deckTitle", el => el.textContent.trim()).catch(() => "unknown");
    console.log(`Current Deck: ${deckHeader}, Slide: ${slideNum}`);

    // Check Build 1 state
    const buildBadge = await page.$eval("#buildStepBadge", el => el.textContent.trim()).catch(() => "none");
    const slideImgSrc = await page.$eval("#slideImage", el => el.src).catch(() => "none");
    const buildControlsVisible = await page.$eval("#buildControlsGroup", el => !el.classList.contains("hidden")).catch(() => false);
    console.log(`Build 1 Badge: ${buildBadge}`);
    console.log(`Build Controls Visible: ${buildControlsVisible}`);
    console.log(`Build 1 Image: ${slideImgSrc}`);

    await fs.mkdir("scratch", { recursive: true });
    await page.screenshot({ path: "scratch/verify_ev_slide_03_build_1.png" });
    console.log("Saved scratch/verify_ev_slide_03_build_1.png");

    // Click on slide image to advance to Build 2
    console.log("Clicking slide image to trigger Build 2...");
    await page.click("#slideImage");
    await page.waitForTimeout(1000);

    // Check Build 2 state
    const buildBadge2 = await page.$eval("#buildStepBadge", el => el.textContent.trim()).catch(() => "none");
    const slideImgSrc2 = await page.$eval("#slideImage", el => el.src).catch(() => "none");
    console.log(`Build 2 Badge: ${buildBadge2}`);
    console.log(`Build 2 Image: ${slideImgSrc2}`);

    await page.screenshot({ path: "scratch/verify_ev_slide_03_build_2.png" });
    console.log("Saved scratch/verify_ev_slide_03_build_2.png");

  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
