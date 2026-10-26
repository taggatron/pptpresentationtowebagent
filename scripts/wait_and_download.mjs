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

  try {
    const client = await ctx.newCDPSession(page);
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: OUTPUT_DIR,
    });
    console.log("Download directory configured:", OUTPUT_DIR);
  } catch (e) {
    console.log("CDP Download setup:", e.message);
  }

  console.log("Waiting for generation to finish...");
  for (let i = 0; i < 60; i++) {
    const isGen = await page.getByText(/Generating slide deck/i).isVisible().catch(() => false);
    if (!isGen) {
      console.log("Generation finished!");
      break;
    }
    const phaseText = await page.locator('.studio-panel').innerText().catch(() => "");
    const match = phaseText.match(/Generating slide deck\.\.\.\s*([^\n]+)/);
    console.log(`[${i * 5}s] Still generating:`, match ? match[1] : "in progress");
    await page.waitForTimeout(5000);
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scratch/after_generation_done.png" });
  console.log("Saved scratch/after_generation_done.png");

  // Let us see if a viewer or dialog opened or if it is in the studio list
  // Look for any download button first
  const downloadIcon = page.locator('button[aria-label*="Download"], button:has-text("Download")');
  if (await downloadIcon.first().isVisible().catch(() => false)) {
    console.log("Direct download button found!");
    await downloadIcon.first().click();
  } else {
    // Look for more button on the first artifact tile
    console.log("Looking for artifact More button...");
    const moreBtns = page.locator('.studio-panel button[aria-label="More"], artifact-library-item button[aria-label="More"], button[aria-label="More"]');
    const count = await moreBtns.count();
    console.log("Found more buttons count:", count);

    // Let us find the first more button in the studio panel
    const studioMore = moreBtns.first();
    await studioMore.click();
    console.log("Clicked More button");
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scratch/menu_after_click.png" });
  console.log("Saved scratch/menu_after_click.png");

  // Click Download PowerPoint
  const pptxMenuItem = page.locator('[role="menuitem"]:has-text("PowerPoint"), [role="menuitem"]:has-text("Download"), button:has-text("PowerPoint")').first();
  if (await pptxMenuItem.isVisible().catch(() => false)) {
    console.log("Found PPTX menu item! Clicking...");
    await pptxMenuItem.click();
    console.log("Clicked Download PowerPoint!");
  } else {
    console.log("Menu items visible:");
    const items = await page.locator('[role="menuitem"]').allInnerTexts().catch(() => []);
    console.log(items);
  }

  // Poll for downloaded file
  console.log("Polling for PPTX in:", OUTPUT_DIR);
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const files = await fs.readdir(OUTPUT_DIR).catch(() => []);
    const pptx = files.find(f => f.endsWith(".pptx") && !f.endsWith(".crdownload"));
    if (pptx) {
      const fullPath = path.join(OUTPUT_DIR, pptx);
      const stat = await fs.stat(fullPath);
      console.log(`Found PPTX: ${pptx} (${stat.size} bytes)`);
      if (stat.size > 20000) {
        if (fullPath !== TARGET_PPTX) {
          await fs.copyFile(fullPath, TARGET_PPTX);
        }
        console.log("Successfully saved target PPTX:", TARGET_PPTX);
        await page.screenshot({ path: "scratch/final_success.png" });
        await browser.close();
        return;
      }
    }
  }

  console.log("Finished wait_and_download.");
  await browser.close();
}

main().catch(err => {
  console.error("Wait and download error:", err);
  process.exit(1);
});
