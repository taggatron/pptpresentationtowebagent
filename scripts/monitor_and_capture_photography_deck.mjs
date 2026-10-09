import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.resolve("scratch/photography_slides");

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log("Connecting to Chrome on CDP port 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));
  if (!page) throw new Error("Notebook page not found");

  console.log("Monitoring slide deck generation in Studio...");
  const deadline = Date.now() + 15 * 60 * 1000; // 15 mins
  let isDone = false;
  let artifactCard = null;

  while (Date.now() < deadline) {
    const generating = await page.locator('artifact-library-item:has-text("Generating slide deck")').count();
    const errorCard = await page.locator('artifact-library-item:has-text("Slide deck generation failed")').count();
    
    if (errorCard > 0) {
      console.error("Slide deck generation failed!");
      await page.screenshot({ path: path.join(OUTPUT_DIR, "generation_failed.png") });
      break;
    }

    if (generating === 0) {
      // Check if there is a completed slide deck artifact
      const deckCards = page.locator('artifact-library-item');
      const count = await deckCards.count();
      for (let i = 0; i < count; i++) {
        const text = (await deckCards.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
        if (/slide deck/i.test(text) || /photography/i.test(text) || /presentation/i.test(text) || /introduction/i.test(text)) {
          console.log(`Found completed artifact card: "${text}"`);
          artifactCard = deckCards.nth(i);
          isDone = true;
          break;
        }
      }
      if (isDone) break;
    }

    const timestamp = new Date().toISOString().slice(11, 19);
    console.log(`[${timestamp}] Still generating... checking again in 8s`);
    await page.waitForTimeout(8000);
  }

  if (!isDone || !artifactCard) {
    throw new Error("Slide deck generation did not complete successfully within deadline.");
  }

  console.log("🎉 Generation complete! Opening slide deck viewer...");
  await page.screenshot({ path: path.join(OUTPUT_DIR, "studio_completed.png") });

  // Click on the artifact card button to open viewer
  const cardBtn = artifactCard.locator('button').first();
  await cardBtn.click();
  await page.waitForTimeout(3000);

  // Take screenshot of opened viewer
  await page.screenshot({ path: path.join(OUTPUT_DIR, "viewer_opened.png") });
  console.log("Saved viewer_opened.png");

  // Inspect viewer controls: next slide, slide counter, download menu
  const slidesInfo = [];
  
  // Try to find total slides count or navigate through slides
  let slideIndex = 1;
  const maxSlides = 20;

  while (slideIndex <= maxSlides) {
    console.log(`Inspecting Slide ${slideIndex}...`);
    const slideScreenPath = path.join(OUTPUT_DIR, `slide_${String(slideIndex).padStart(2, '0')}.png`);
    await page.screenshot({ path: slideScreenPath });

    // Extract slide text visible on page
    const viewerContent = page.locator('.studio-panel, mat-dialog-container, [class*="viewer"], [class*="slide"]');
    const slideText = (await viewerContent.first().innerText().catch(() => "")).replace(/\s+/g, " ");
    slidesInfo.push({
      index: slideIndex,
      text: slideText.slice(0, 300),
      screenshot: slideScreenPath
    });

    // Look for next slide button
    const nextBtn = page.locator('button[aria-label*="Next"], button[aria-label*="next"], [aria-label*="Next slide"]').first();
    const canGoNext = (await nextBtn.count() > 0) && (await nextBtn.isEnabled().catch(() => false));
    if (!canGoNext) {
      console.log(`No more slides or Next button disabled at slide ${slideIndex}.`);
      break;
    }
    await nextBtn.click();
    await page.waitForTimeout(1500);
    slideIndex++;
  }

  // Check More options to download PPTX
  console.log("Checking More options menu for PPTX export...");
  const moreBtn = page.locator('button[aria-label="More options"], button[aria-label="More"]').first();
  if (await moreBtn.isVisible()) {
    await moreBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "more_menu.png") });
    
    // Look for Download PowerPoint
    const pptxItem = page.locator('[role="menuitem"]:has-text("Download PowerPoint")').first();
    if (await pptxItem.isVisible()) {
      console.log("Found 'Download PowerPoint' option! Triggering download...");
      const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
      await pptxItem.click();
      const download = await downloadPromise;
      if (download) {
        const pptxSavePath = path.resolve("scratch/Photography_Adults_Course.pptx");
        await download.saveAs(pptxSavePath);
        console.log(`🎉 Downloaded PPTX to ${pptxSavePath}!`);
      }
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, "slides_data.json"),
    JSON.stringify(slidesInfo, null, 2)
  );
  console.log("Saved slides_data.json");

  await browser.close();
}

main().catch(err => {
  console.error("Error monitoring/capturing slide deck:", err);
  process.exit(1);
});
