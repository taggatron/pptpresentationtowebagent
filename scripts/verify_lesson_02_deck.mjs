import { chromium } from "playwright";

async function verifyViewer() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0] || await browser.newContext();
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  console.log("Navigating to Lesson 02 in presentation player...");
  await page.goto("http://localhost:3000/#/deck/Lesson_02_Circuits/slide/1", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Take screenshot of Slide 1
  await page.screenshot({ path: "scratch/verify_lesson2_slide1.png" });
  console.log("Captured scratch/verify_lesson2_slide1.png");

  // Navigate to Slide 2 (Starter Grid)
  const nextBtn = page.locator("#next-slide-btn, button[aria-label='Next slide'], button:has-text('Next')").first();
  if (await nextBtn.isVisible()) {
    await nextBtn.click();
  } else {
    await page.goto("http://localhost:3000/#/deck/Lesson_02_Circuits/slide/2", { waitUntil: "networkidle" });
  }
  await page.waitForTimeout(2000);

  // Capture unrevealed starter grid
  await page.screenshot({ path: "scratch/verify_lesson2_slide2_unrevealed.png" });
  console.log("Captured scratch/verify_lesson2_slide2_unrevealed.png");

  // Reveal all questions / click reveal all if available or click cards
  const revealAllBtn = page.locator("button:has-text('Reveal all'), button:has-text('Reveal All'), #reveal-all-btn").first();
  if (await revealAllBtn.isVisible().catch(() => false)) {
    await revealAllBtn.click();
    console.log("Clicked Reveal All button!");
  } else {
    // Click on individual cards
    const cards = page.locator(".qa-card-overlay, .interactive-cell");
    const count = await cards.count();
    console.log(`Found ${count} interactive cards, clicking them...`);
    for (let i = 0; i < count; i++) {
      await cards.nth(i).click({ force: true }).catch(() => {});
      await page.waitForTimeout(200);
    }
  }
  await page.waitForTimeout(1500);

  // Capture revealed starter grid
  await page.screenshot({ path: "scratch/verify_lesson2_slide2_revealed.png" });
  console.log("Captured scratch/verify_lesson2_slide2_revealed.png");

  // Navigate to Slide 6 (Core Quantities Table)
  await page.goto("http://localhost:3000/#/deck/Lesson_02_Circuits/slide/6", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "scratch/verify_lesson2_slide6.png" });
  console.log("Captured scratch/verify_lesson2_slide6.png");

  // Navigate to Slide 10 (Practical Setup)
  await page.goto("http://localhost:3000/#/deck/Lesson_02_Circuits/slide/10", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "scratch/verify_lesson2_slide10.png" });
  console.log("Captured scratch/verify_lesson2_slide10.png");

  // Navigate to Slide 13 (Interactive Practical)
  await page.goto("http://localhost:3000/#/deck/Lesson_02_Circuits/slide/13", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/verify_lesson2_slide13_simulation.png" });
  console.log("Captured scratch/verify_lesson2_slide13_simulation.png");

  await page.close();
  console.log("Verification finished successfully!");
}

verifyViewer().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
