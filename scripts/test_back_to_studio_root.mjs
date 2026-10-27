import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const closeBtn = page.locator('button[aria-label="Close slide deck"]').first();
  if (await closeBtn.isVisible()) {
    console.log("Clicking Close slide deck...");
    await closeBtn.click();
    await page.waitForTimeout(1000);
  }

  // Verify Slide deck creation button is visible in Studio
  const slideDeckBtn = page.locator('button:has-text("Slide deck")').first();
  console.log("Slide deck button visible:", await slideDeckBtn.isVisible());

  await page.screenshot({ path: "scratch/studio_root.png" });
  console.log("Saved scratch/studio_root.png");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
