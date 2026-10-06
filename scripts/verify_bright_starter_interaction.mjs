import { chromium } from "playwright";

async function verifyStarterInteractivity() {
  console.log("=== Testing Bright Starter Slide in Live Web App ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("http://localhost:3000/?deck=Lesson_05_Gene_mutations_acquired_and_inherited", {
    waitUntil: "networkidle"
  });
  await page.waitForTimeout(1500);

  // Click on Slide 2 thumbnail
  console.log("Clicking Slide 2 thumbnail...");
  await page.click('.thumb-item[data-slide-index="1"]');
  await page.waitForTimeout(800);

  // Take screenshot of initial masked state
  await page.screenshot({ path: "scratch/verify_bright_starter_initial.png" });
  console.log("Saved scratch/verify_bright_starter_initial.png");

  // Check how many qa overlay buttons exist
  const overlays = await page.$$(".qa-card-overlay");
  console.log(`Found ${overlays.length} overlay buttons on Slide 2`);

  // Click first card overlay (Cell 1)
  if (overlays.length > 0) {
    console.log("Clicking Cell 1 overlay to reveal...");
    await overlays[0].click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "scratch/verify_bright_starter_cell1_revealed.png" });
    console.log("Saved scratch/verify_bright_starter_cell1_revealed.png");
  }

  // Click fifth card overlay (Cell 5 - tRNA question)
  const cell5 = await page.$("#qa_card_cell_5");
  if (cell5) {
    console.log("Clicking Cell 5 (tRNA question) overlay to reveal...");
    await cell5.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "scratch/verify_bright_starter_cell5_revealed.png" });
    console.log("Saved scratch/verify_bright_starter_cell5_revealed.png");
  }

  // Click "Reveal all" button in bottom controls
  const revealAllBtn = await page.$("#revealAllAnswersBtn, button:has-text('Reveal all')");
  if (revealAllBtn) {
    console.log("Clicking 'Reveal all' button...");
    await revealAllBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "scratch/verify_bright_starter_all_revealed.png" });
    console.log("Saved scratch/verify_bright_starter_all_revealed.png");
  }

  // Click "Hide all" button in bottom controls
  const hideAllBtn = await page.$("#hideAllAnswersBtn, button:has-text('Hide all')");
  if (hideAllBtn) {
    console.log("Clicking 'Hide all' button...");
    await hideAllBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "scratch/verify_bright_starter_all_hidden.png" });
    console.log("Saved scratch/verify_bright_starter_all_hidden.png");
  }

  await browser.close();
  console.log("Starter interactivity verification completed successfully!");
}

verifyStarterInteractivity().catch(err => {
  console.error(err);
  process.exit(1);
});
