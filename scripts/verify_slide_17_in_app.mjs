import { chromium } from "playwright";

async function verifyDeck() {
  console.log("=== Verifying Updated Lesson 5 in Browser ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("http://localhost:3000/?deck=Lesson_05_Gene_mutations_acquired_and_inherited", {
    waitUntil: "networkidle"
  });
  await page.waitForTimeout(1500);

  // Check total thumbnails
  const thumbs = await page.$$(".thumb-item");
  console.log(`Total thumbnail items found in UI: ${thumbs.length}`);

  // Navigate to Slide 16 (Clinical Phenotype & Inheritance)
  console.log("Navigating to Slide 16...");
  await page.click('.thumb-item[data-slide-index="15"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scratch/verify_slide_16_phenotype.png" });
  console.log("Captured scratch/verify_slide_16_phenotype.png");

  // Navigate to Slide 17 (The New NEA Pass Criteria & Causal Chain Slide)
  console.log("Navigating to Slide 17 (NEW NEA P3 Slide)...");
  await page.click('.thumb-item[data-slide-index="16"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scratch/verify_slide_17_nea_causal.png" });
  console.log("Captured scratch/verify_slide_17_nea_causal.png");

  // Navigate to Slide 18 (Plenary Summary)
  console.log("Navigating to Slide 18 (Plenary Summary)...");
  await page.click('.thumb-item[data-slide-index="17"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scratch/verify_slide_18_plenary.png" });
  console.log("Captured scratch/verify_slide_18_plenary.png");

  await browser.close();
  console.log("Verification finished successfully!");
}

verifyDeck().catch(err => {
  console.error(err);
  process.exit(1);
});
