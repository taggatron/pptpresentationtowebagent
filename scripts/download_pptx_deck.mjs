import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.resolve("./output/powerpoints_andragogical_inclusion");
const TARGET_PPTX = path.join(OUTPUT_DIR, "Andragogical_Inclusion_CPD.pptx");

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log("Connecting to Edge on CDP port 9334...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("5927de21-65f8-4f39-9744-2bfd02ceb489"));
  if (!page) throw new Error("Notebook tab not found");

  const client = await ctx.newCDPSession(page);
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: OUTPUT_DIR,
  });

  // 1. Press Escape to clear any overlays
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // 2. Click the newly created deck: "Designing Inclusive Adult Learning"
  console.log("Clicking Designing Inclusive Adult Learning...");
  const deckTitle = page.locator('.studio-panel span.artifact-title:has-text("Designing Inclusive Adult"), span:has-text("Designing Inclusive Adult")').first();
  await deckTitle.click({ force: true });
  console.log("Clicked deck card!");
  await page.waitForTimeout(3000);

  await page.screenshot({ path: "scratch/viewer_opened.png" });
  console.log("Saved scratch/viewer_opened.png");

  // 3. Inspect what buttons/menu options are visible now
  const allButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("button, [role=\"button\"], a")).map(b => ({
      tag: b.tagName,
      ariaLabel: b.getAttribute("aria-label"),
      text: b.innerText?.trim()?.slice(0, 50),
      className: b.className
    })).filter(b => b.ariaLabel || b.text);
  });
  console.log("Interactive elements:", JSON.stringify(allButtons.slice(-25), null, 2));

  // Look for download or export button
  const downloadBtn = page.locator('button[aria-label*="Download"], [aria-label*="download"], button:has-text("Download")').first();
  const moreBtn = page.locator('button[aria-label="More options"], button[aria-label="More"]').last();

  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log("Clicking Download button directly...");
    await downloadBtn.click();
  } else if (await moreBtn.isVisible().catch(() => false)) {
    console.log("Clicking More options...");
    await moreBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "scratch/viewer_more_menu.png" });
    const pptxItem = page.locator('[role="menuitem"]:has-text("PowerPoint"), [role="menuitem"]:has-text("Download"), button:has-text("PowerPoint")').first();
    if (await pptxItem.isVisible().catch(() => false)) {
      console.log("Clicking PowerPoint menu item...");
      await pptxItem.click();
    } else {
      console.log("Menu items in viewer:", await page.locator('[role="menuitem"]').allInnerTexts().catch(() => []));
    }
  }

  // 4. Poll for downloaded file
  console.log("Waiting for PPTX in:", OUTPUT_DIR);
  for (let i = 0; i < 40; i++) {
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
        console.log("Final target PPTX saved at:", TARGET_PPTX);
        await page.screenshot({ path: "scratch/download_success.png" });
        await browser.close();
        return;
      }
    }
  }

  console.log("No file downloaded yet. Keeping browser open.");
  await browser.close();
}

main().catch(err => {
  console.error("Main error:", err);
  process.exit(1);
});
