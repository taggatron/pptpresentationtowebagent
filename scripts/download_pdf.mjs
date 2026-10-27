import { chromium } from "playwright";
import path from "path";
import fs from "fs";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const downloadDir = path.resolve("public/decks");

  // Set download behavior via CDP
  const client = await page.context().newCDPSession(page);
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadDir,
    eventsEnabled: true
  });

  // Click More options
  const moreBtn = page.locator('button[aria-label="More options"]').last();
  await moreBtn.click();
  await page.waitForTimeout(500);

  const pdfItem = page.locator('button[role="menuitem"]:has-text("PDF")');
  console.log("Clicking Download PDF document (.pdf)...");
  await pdfItem.click();

  console.log("Waiting 10s for PDF download...");
  await page.waitForTimeout(10000);

  const files = fs.readdirSync(downloadDir);
  console.log("Files:", files);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
