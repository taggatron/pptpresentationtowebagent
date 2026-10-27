import { chromium } from "playwright";
import path from "path";
import fs from "fs";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const downloadDir = path.resolve("public/decks");
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  // Open "More options"
  const moreBtn = page.locator('button[aria-label="More options"]').last();
  await moreBtn.click();
  await page.waitForTimeout(500);

  // Set up download listener
  const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(e => {
    console.log("No standard download event fired, checking CDP download...");
    return null;
  });

  const pptxItem = page.locator('button[role="menuitem"]:has-text("PowerPoint")');
  console.log("Clicking Download PowerPoint (.pptx)...");
  await pptxItem.click();

  const download = await downloadPromise;
  if (download) {
    const filename = download.suggestedFilename();
    const savePath = path.join(downloadDir, filename);
    await download.saveAs(savePath);
    console.log(`Saved PowerPoint to: ${savePath}`);
  } else {
    console.log("Download event was handled by browser directly. Waiting 5s for file in Downloads folder...");
    await page.waitForTimeout(5000);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
