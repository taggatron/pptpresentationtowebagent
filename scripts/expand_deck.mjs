import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const expandBtn = page.locator('button[aria-label="Expand"]').first();
  if (await expandBtn.isVisible()) {
    console.log("Clicking Expand button...");
    await expandBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "scratch/edge_expanded_view.png" });
    console.log("Saved scratch/edge_expanded_view.png");
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
