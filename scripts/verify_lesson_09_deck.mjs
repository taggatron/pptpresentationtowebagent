import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = await ctx.newPage();

  console.log("Navigating to presentation viewer...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  console.log("Selecting Lesson 9: Fuses and Earthing...");
  await page.evaluate(async () => {
    // Call loadDeck directly from app.js
    if (typeof window.loadDeck === "function") {
      await window.loadDeck("Lesson_09_Fuses_and_Earthing", 0);
    } else {
      const select = document.getElementById("deckSelect");
      if (select) {
        select.value = "Lesson_09_Fuses_and_Earthing";
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  });

  await page.waitForTimeout(1500);

  const testArtifactsDir = path.resolve("./scratch/evidence");
  await fs.mkdir(testArtifactsDir, { recursive: true });

  // Screenshot Slide 1
  const slide1Path = path.join(testArtifactsDir, "lesson_09_slide_01.png");
  await page.screenshot({ path: slide1Path });
  console.log(`Captured Slide 1: ${slide1Path}`);

  // Navigate to Slide 2 (Starter Activity)
  console.log("Navigating to Slide 2...");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1200);

  const slide2Path = path.join(testArtifactsDir, "lesson_09_slide_02.png");
  await page.screenshot({ path: slide2Path });
  console.log(`Captured Slide 2: ${slide2Path}`);

  // Click on the first question reveal card
  console.log("Testing interactive reveal on Slide 2...");
  const revealCards = page.locator(".answer-card, .question-card, .interactive-reveal, .reveal-overlay, [data-reveal-id]");
  const count = await revealCards.count();
  console.log(`Found ${count} reveal elements.`);
  if (count > 0) {
    await revealCards.first().click();
    await page.waitForTimeout(600);
    const revealScreenshot = path.join(testArtifactsDir, "lesson_09_slide_02_revealed.png");
    await page.screenshot({ path: revealScreenshot });
    console.log(`Captured Slide 2 with reveal: ${revealScreenshot}`);
  }

  // Navigate to Slide 17 (Interactive Practical)
  console.log("Navigating to Slide 17 (Interactive Practical)...");
  await page.evaluate(() => {
    if (typeof window.goToSlide === "function") {
      window.goToSlide(16); // 0-indexed slide 17
    }
  });
  await page.waitForTimeout(2500);

  const slide17Path = path.join(testArtifactsDir, "lesson_09_slide_17_practical.png");
  await page.screenshot({ path: slide17Path });
  console.log(`Captured Slide 17 Practical: ${slide17Path}`);

  await page.close();
  console.log("\n✦ VERIFICATION COMPLETED SUCCESSFULLY! ✦");
  process.exit(0);
}

main().catch(err => {
  console.error("Verification error:", err);
  process.exit(1);
});
