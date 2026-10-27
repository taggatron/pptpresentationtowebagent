import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const count = await page.locator(':text("Gene Therapy Masterclass")').count();
  console.log("Locator count for 'Gene Therapy Masterclass':", count);
  for (let i = 0; i < count; i++) {
    const el = page.locator(':text("Gene Therapy Masterclass")').nth(i);
    const box = await el.boundingBox();
    const tag = await el.evaluate(e => e.outerHTML);
    console.log(`Element ${i}:`, { box, tag: tag.slice(0, 150) });
  }

  // Also let's check elements around (x: 50..300, y: 80..130) where the title is in the screenshot!
  const topBarElements = await page.evaluate(() => {
    const el = document.elementFromPoint(150, 95);
    return {
      tag: el?.tagName,
      className: el?.className,
      text: el?.innerText,
      outerHTML: el?.outerHTML?.slice(0, 300)
    };
  });
  console.log("Element at (150, 95):", topBarElements);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
