import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.resolve("./output/powerpoints_andragogical_inclusion");
const TARGET_PPTX = path.join(OUTPUT_DIR, "Andragogical_Inclusion_CPD.pptx");

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log("Connecting to Edge on CDP port 9334 to monitor generation...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  let page = ctx.pages().find(p => p.url().includes("5927de21-65f8-4f39-9744-2bfd02ceb489"));
  if (!page) throw new Error("Notebook tab not found");

  // Ensure download behavior
  try {
    const client = await ctx.newCDPSession(page);
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: OUTPUT_DIR,
    });
    console.log("Download behavior set to:", OUTPUT_DIR);
  } catch (err) {
    console.log("CDP download behavior note:", err.message);
  }

  const startTime = Date.now();
  console.log("Waiting for slide deck generation to complete in Studio...");

  while (Date.now() - startTime < 600000) { // 10 min timeout
    const genText = page.getByText(/Generating slide deck/i);
    const isGenerating = (await genText.count()) > 0 && await genText.first().isVisible().catch(() => false);

    if (isGenerating) {
      console.log(`[${new Date().toISOString()}] Still generating slide deck...`);
      await page.waitForTimeout(6000);
      continue;
    }

    console.log("Generation spinner no longer visible! Checking Studio items...");
    await page.waitForTimeout(3000);

    // Look for the newest artifact card
    const topCard = page.locator('artifact-library-item, div:has-text("sources · Just now"), div:has-text("sources · 0m ago")').first();
    const topCardText = (await topCard.innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    console.log("Top card text:", topCardText);

    // Click the top card or its more menu to download PPTX
    // First, let's see if the viewer opened automatically
    const viewerMoreBtn = page.locator('.studio-panel button[aria-label="More options"], button[aria-label="More options"]').first();
    let moreClicked = false;

    if (await viewerMoreBtn.isVisible().catch(() => false)) {
      console.log("Clicking More options in slide viewer...");
      await viewerMoreBtn.click();
      moreClicked = true;
    } else {
      // Find more button on the top artifact card
      const cardMoreBtn = page.locator('artifact-library-item button[aria-label="More"], button[aria-label="More"]').first();
      if (await cardMoreBtn.isVisible().catch(() => false)) {
        console.log("Clicking More on top artifact card...");
        await cardMoreBtn.click();
        moreClicked = true;
      }
    }

    if (moreClicked) {
      await page.waitForTimeout(1000);
      const downloadPptxItem = page.locator('[role="menuitem"]:has-text("Download PowerPoint"), button:has-text("Download PowerPoint")').first();
      if (await downloadPptxItem.isVisible().catch(() => false)) {
        console.log("Found 'Download PowerPoint' menu item. Clicking...");
        await downloadPptxItem.click();
        console.log("Download initiated! Awaiting file on disk...");

        // Wait for downloaded file
        for (let i = 0; i < 30; i++) {
          await new Promise(r => setTimeout(r, 1000));
          const files = await fs.readdir(OUTPUT_DIR).catch(() => []);
          const pptx = files.find(f => f.endsWith(".pptx") && !f.endsWith(".crdownload"));
          if (pptx) {
            const downloadedPath = path.join(OUTPUT_DIR, pptx);
            const stat = await fs.stat(downloadedPath);
            if (stat.size > 50000) {
              console.log(`Downloaded PPTX: ${pptx} (${stat.size} bytes)!`);
              if (downloadedPath !== TARGET_PPTX) {
                await fs.copyFile(downloadedPath, TARGET_PPTX);
              }
              console.log("Saved target file:", TARGET_PPTX);
              await page.screenshot({ path: "scratch/download_complete.png" });
              await browser.close();
              return TARGET_PPTX;
            }
          }
        }
      }
    }

    await page.waitForTimeout(5000);
  }

  throw new Error("Generation / Download timed out.");
}

main().catch(err => {
  console.error("Monitor error:", err);
  process.exit(1);
});
