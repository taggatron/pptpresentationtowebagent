import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const info = await page.evaluate(() => {
    // Find text F172 - Genitic Engineering
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    let target = null;
    while (node = walker.nextNode()) {
      if (node.nodeValue.includes("F172 - Genitic Engineering")) {
        target = node.parentElement;
        break;
      }
    }
    if (!target) return { error: "Not found" };

    const rect = target.getBoundingClientRect();
    const parent = target.closest('button, a, [role="button"], mat-list-item, .studio-item, div');
    const parentRect = parent ? parent.getBoundingClientRect() : null;

    return {
      tag: target.tagName,
      className: target.className,
      rect,
      parentTag: parent?.tagName,
      parentClass: parent?.className,
      parentRect,
      outerHTML: parent?.outerHTML?.slice(0, 300)
    };
  });

  console.log("F172 item DOM info:", JSON.stringify(info, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
