import { chromium } from "playwright";

async function verify() {
  console.log("=== Verifying Lesson 02 in Web Application ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Navigate to Slide 3 directly
  console.log("Loading Slide 3 in browser...");
  await page.goto("http://localhost:3000/?set=intro_aaq_human_bio&deck=Lesson_02_Working_like_a_Human_Biologist&slide=3", { waitUntil: "networkidle" });
  await page.waitForSelector("#slideImage", { state: "visible", timeout: 10000 });
  await page.waitForTimeout(1500);

  // Check slide deck info in UI
  const deckInfo = await page.evaluate(() => {
    return {
      title: window.currentDeck?.title,
      totalSlides: window.currentDeck?.slides?.length,
      currentSlideNumber: window.currentDeck?.slides?.[window.currentSlideIndex]?.number,
      interactiveCardsCount: document.querySelectorAll(".qa-card-overlay").length,
      overviewBadge: document.querySelector(".slide-count-badge, #slideOverviewCount")?.textContent?.trim()
    };
  });
  console.log("Deck status in web app:", deckInfo);

  // Screenshot Slide 3 unrevealed
  await page.screenshot({ path: "scratch/verify_slide_03_unrevealed.png" });
  console.log("Captured: scratch/verify_slide_03_unrevealed.png");

  // Click Reveal all
  const revealBtn = await page.$("#revealAllBtn");
  if (revealBtn) {
    await revealBtn.click();
    console.log("Clicked #revealAllBtn");
    await page.waitForTimeout(1000);
  } else {
    // Alternatively click individual cards
    const cards = await page.$$(".qa-card-overlay");
    for (const card of cards) {
      await card.click();
    }
  }

  // Screenshot Slide 3 revealed
  await page.screenshot({ path: "scratch/verify_slide_03_revealed.png" });
  console.log("Captured: scratch/verify_slide_03_revealed.png");

  // 2. Navigate to Slide 10 directly
  console.log("\nLoading Slide 10 in browser...");
  await page.goto("http://localhost:3000/?set=intro_aaq_human_bio&deck=Lesson_02_Working_like_a_Human_Biologist&slide=10", { waitUntil: "networkidle" });
  await page.waitForSelector("#slideImage", { state: "visible", timeout: 10000 });
  await page.waitForTimeout(1500);

  const slide10Info = await page.evaluate(() => {
    return {
      currentSlideNumber: window.currentDeck?.slides?.[window.currentSlideIndex]?.number,
      title: window.currentDeck?.slides?.[window.currentSlideIndex]?.title,
      imageSrc: document.querySelector("#slideImage")?.src
    };
  });
  console.log("Slide 10 status:", slide10Info);

  // Screenshot Slide 10
  await page.screenshot({ path: "scratch/verify_slide_10_cheek_practical.png" });
  console.log("Captured: scratch/verify_slide_10_cheek_practical.png");

  await browser.close();
  console.log("\n=== Verification Completed Successfully ===");
}

verify().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
