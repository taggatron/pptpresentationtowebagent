import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // Click collapse/back button
  const closeBtn = page.locator('button[aria-label="Close slide deck"]').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(1000);
  }

  // Find exact position of "F172 - Genitic Engineering"
  const item = page.locator('text="F172 - Genitic Engineering"').first();
  const box = await item.boundingBox();
  console.log("F172 item bounding box:", box);

  if (box) {
    console.log(`Clicking F172 at ${box.x + box.width / 2}, ${box.y + box.height / 2}...`);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(2000);
  }

  await page.screenshot({ path: "scratch/edge_f172_open.png" });
  console.log("Saved scratch/edge_f172_open.png");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
