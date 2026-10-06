import { chromium } from "playwright";

async function verifySlide13() {
  console.log("=== Verifying Slide 13 (DNA Replication Slippage) in Browser ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("http://localhost:3000/?deck=Lesson_05_Gene_mutations_acquired_and_inherited", {
    waitUntil: "networkidle"
  });
  await page.waitForTimeout(1500);

  // Check total thumbnails count
  const thumbs = await page.$$(".thumb-item");
  console.log(`Total thumbnail items found in UI: ${thumbs.length}`);

  // Navigate to Slide 13 (index 12)
  console.log("Navigating to Slide 13 (DNA Replication Slippage: How CAG Repeats Expand)...");
  await page.click('.thumb-item[data-slide-index="12"]');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scratch/verify_slide_13_slippage.png" });
  console.log("Captured scratch/verify_slide_13_slippage.png");

  // Get slide title text or indicator from UI if present
  const paginationText = await page.textContent("#slideIndicator, .slide-counter, .pagination, .slide-number").catch(() => null);
  console.log("Pagination/slide indicator text:", paginationText);

  // Also check Slide 12 (index 11) and Slide 14 (index 13) to ensure adjacent flow
  console.log("Navigating to Slide 12...");
  await page.click('.thumb-item[data-slide-index="11"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: "scratch/verify_slide_12_adjacent.png" });

  console.log("Navigating to Slide 14...");
  await page.click('.thumb-item[data-slide-index="13"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: "scratch/verify_slide_14_adjacent.png" });

  await browser.close();
  console.log("Slide 13 browser verification completed successfully!");
}

verifySlide13().catch(err => {
  console.error(err);
  process.exit(1);
});
