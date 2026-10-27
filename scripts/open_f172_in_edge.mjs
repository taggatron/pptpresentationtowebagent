import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // Hover and click the artifact item
  console.log("Opening F172 - Genitic Engineering in Edge...");
  await page.mouse.move(1020, 497);
  await page.waitForTimeout(300);
  await page.mouse.click(1020, 497);
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: "scratch/edge_opened_deck.png" });
  console.log("Saved scratch/edge_opened_deck.png");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
