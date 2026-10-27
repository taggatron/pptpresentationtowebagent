import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // Click on slide 4 thumbnail at (875, 600)
  console.log("Clicking slide 4 thumbnail...");
  await page.mouse.click(875, 600);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/slide_04_full.png" });
  console.log("Saved scratch/slide_04_full.png");

  // Click on slide 5 thumbnail at (875, 725)
  console.log("Clicking slide 5 thumbnail...");
  await page.mouse.click(875, 725);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/slide_05_full.png" });
  console.log("Saved scratch/slide_05_full.png");

  // Scroll the thumbnail bar on the right down
  console.log("Scrolling thumbnail list...");
  await page.mouse.move(875, 600);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/slides_thumbnail_list_scrolled.png" });
  console.log("Saved scratch/slides_thumbnail_list_scrolled.png");
}

main().catch(console.error);
