import { chromium } from "playwright";

async function verify() {
  console.log("=== Testing Lesson 5 Updates in Browser ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Navigate to Lesson 5
  await page.goto("http://localhost:3000/?deck=Lesson_05_Gene_mutations_acquired_and_inherited", {
    waitUntil: "networkidle"
  });
  await page.waitForTimeout(1500);

  // 1. Check Slide 2 (Starter Retrieval Grid)
  console.log("Page loaded. Clicking slide 2 thumbnail...");
  await page.click('.thumb-item[data-slide-index="1"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scratch/verify_slide_02_starter.png" });
  console.log("Saved scratch/verify_slide_02_starter.png");

  // Check interactive cells on Slide 2
  const overlays = await page.$$(".qa-card-overlay");
  console.log(`Slide 2 interactive overlay elements count: ${overlays.length}`);

  // Click first cell to reveal
  if (overlays.length > 0) {
    await overlays[0].click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "scratch/verify_slide_02_revealed.png" });
    console.log("Saved scratch/verify_slide_02_revealed.png");
  }

  // 2. Check Slide 3 (Learning Objectives)
  console.log("Navigating to Slide 3 (Learning Objectives)...");
  await page.click('.thumb-item[data-slide-index="2"]');
  await page.waitForTimeout(800);
  const slide3Overlays = await page.$$(".qa-card-overlay");
  console.log(`Slide 3 interactive overlay elements count: ${slide3Overlays.length} (Expected: 0)`);
  await page.screenshot({ path: "scratch/verify_slide_03_clean_objectives.png" });
  console.log("Saved scratch/verify_slide_03_clean_objectives.png");

  // 3. Check Slide 8 (The Frameshift Collapse with updated title)
  console.log("Navigating to Slide 8 (Frameshift Collapse)...");
  await page.click('.thumb-item[data-slide-index="7"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scratch/verify_slide_08_frameshift.png" });
  console.log("Saved scratch/verify_slide_08_frameshift.png");

  // 4. Check Slide 9 (Interactive Sequence Mutation Analysis Web Embed)
  console.log("Navigating to Slide 9 (Sequence Mutation Analysis)...");
  await page.click('.thumb-item[data-slide-index="8"]');
  await page.waitForTimeout(1500);
  const iframe = await page.$("iframe");
  console.log(`Slide 9 iframe found: ${Boolean(iframe)}`);
  if (iframe) {
    const src = await iframe.getAttribute("src");
    console.log(`Slide 9 iframe src: ${src}`);
  }
  await page.screenshot({ path: "scratch/verify_slide_09_interactive.png" });
  console.log("Saved scratch/verify_slide_09_interactive.png");

  await browser.close();
  console.log("=== Verification Completed Successfully! ===");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
