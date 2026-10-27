import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.resolve("./output/powerpoints_andragogical_inclusion");
const TARGET_PPTX = path.join(OUTPUT_DIR, "Andragogical_Inclusion_CPD.pptx");

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log("Connecting to Edge on port 9334...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("5927de21-65f8-4f39-9744-2bfd02ceb489"));
  if (!page) throw new Error("Notebook tab not found");

  const client = await ctx.newCDPSession(page);
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: OUTPUT_DIR,
  });

  // Ensure More options menu is open
  const moreBtn = page.locator('button[aria-label="More options"]').first();
  if (await moreBtn.isVisible()) {
    console.log("Clicking 'More options' button...");
    await moreBtn.click();
    await page.waitForTimeout(1000);
  }

  // Click "Download PowerPoint (.pptx)"
  console.log("Looking for 'Download PowerPoint (.pptx)'...");
  const pptxBtn = page.getByText(/Download PowerPoint/i).first();
  if (!await pptxBtn.isVisible()) {
    console.log("Not visible yet, checking all menu items...");
    console.log(await page.locator('[role="menuitem"]').allInnerTexts().catch(() => []));
  } else {
    console.log("Clicking 'Download PowerPoint (.pptx)'...");
    await pptxBtn.click();
    console.log("Clicked! Waiting for download...");
  }

  // Poll for .pptx file
  for (let i = 0; i < 45; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const files = await fs.readdir(OUTPUT_DIR).catch(() => []);
    const pptx = files.find(f => f.endsWith(".pptx") && !f.endsWith(".crdownload"));
    if (pptx) {
      const fullPath = path.join(OUTPUT_DIR, pptx);
      const stat = await fs.stat(fullPath);
      if (stat.size > 20000) {
        console.log(`Downloaded PPTX: ${pptx} (${stat.size} bytes)!`);
        if (fullPath !== TARGET_PPTX) {
          await fs.copyFile(fullPath, TARGET_PPTX);
        }
        console.log("Saved target PPTX to:", TARGET_PPTX);
        await page.screenshot({ path: "scratch/download_pptx_success.png" });
        await browser.close();
        return TARGET_PPTX;
      }
    }
  }

  console.log("Files currently in directory:", await fs.readdir(OUTPUT_DIR));
  await browser.close();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
