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

  // Set download behavior via CDP
  const client = await page.context().newCDPSession(page);
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadDir,
    eventsEnabled: true
  });
  console.log("Set download behavior to:", downloadDir);

  // Click More options
  const moreBtn = page.locator('button[aria-label="More options"]').last();
  await moreBtn.click();
  await page.waitForTimeout(500);

  const pptxItem = page.locator('button[role="menuitem"]:has-text("PowerPoint")');
  console.log("Clicking Download PowerPoint (.pptx)...");
  await pptxItem.click();

  console.log("Waiting 10s for download to complete...");
  await page.waitForTimeout(10000);

  const files = fs.readdirSync(downloadDir);
  console.log("Files in download dir:", files);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
