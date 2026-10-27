import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const results = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    const matches = [];
    while (node = walker.nextNode()) {
      if (node.nodeValue.includes("Gene Therapy Masterclass")) {
        matches.push({
          parentTag: node.parentElement.tagName,
          parentClass: node.parentElement.className,
          parentHTML: node.parentElement.outerHTML
        });
      }
    }
    return matches;
  });

  console.log("Matches:", JSON.stringify(results, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
