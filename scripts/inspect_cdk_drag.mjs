import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const drags = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('div.cdk-drag'));
    return list.map((el, i) => {
      const rect = el.getBoundingClientRect();
      const parent = el.parentElement;
      return {
        index: i,
        className: el.className,
        parentClass: parent?.className,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        text: el.innerText.trim().slice(0, 50)
      };
    });
  });

  console.log("CDK Drags:", JSON.stringify(drags, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
