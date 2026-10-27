import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // Click the close (X) button on the modal
  const closeBtn = page.locator('button[aria-label="Close"], button:has(mat-icon:has-text("close"))').last();
  if (await closeBtn.isVisible()) {
    console.log("Clicking close (X) button on modal...");
    await closeBtn.click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: "scratch/edge_after_close.png" });
  console.log("Saved scratch/edge_after_close.png");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
