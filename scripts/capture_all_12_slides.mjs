import { chromium } from "playwright";
import fs from "fs";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // Press Escape to dismiss any open menu
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Ensure output dir exists
  const outDir = "scratch/f172_slides";
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Find all thumbnail elements
  const thumbs = page.locator('.thumbnail-list div.cdk-drag');
  const count = await thumbs.count();
  console.log(`Found ${count} slide thumbnails`);

  for (let i = 0; i < count; i++) {
    const thumb = thumbs.nth(i);
    // Scroll thumbnail into view
    await thumb.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Click the thumbnail
    await thumb.click({ force: true });
    await page.waitForTimeout(1500);

    // Save screenshot of full modal or slide area
    const slideNumber = String(i + 1).padStart(2, '0');
    const filename = `${outDir}/slide_${slideNumber}.png`;

    // Take screenshot of the slide container if possible, otherwise page
    const slideViewer = page.locator('.slide-viewer, .presentation-viewer, .preview-container, .main-slide-container').first();
    if (await slideViewer.isVisible()) {
      await slideViewer.screenshot({ path: filename });
    } else {
      await page.screenshot({ path: filename });
    }
    console.log(`Captured Slide ${i + 1} -> ${filename}`);
  }

  console.log("All slides captured successfully!");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
