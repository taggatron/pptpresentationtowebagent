import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const dialogDetails = await page.evaluate(() => {
    // Find dialog or modal container
    const dialog = document.querySelector('mat-dialog-container, [role="dialog"], .dialog, .modal');
    if (!dialog) return { error: "No dialog found" };

    // Look for text elements, inputs, buttons in dialog
    const header = dialog.querySelector('.header, .title, [class*="title"], [class*="header"]');
    const allButtons = Array.from(dialog.querySelectorAll('button')).map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      icon: b.querySelector('mat-icon')?.innerText,
      text: b.innerText.trim(),
      className: b.className
    }));

    // Find the text "Gene Therapy Masterclass"
    const walker = document.createTreeWalker(dialog, NodeFilter.SHOW_TEXT);
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

    return {
      dialogTag: dialog.tagName,
      dialogClass: dialog.className,
      allButtons,
      matches
    };
  });

  console.log("Dialog Details:", JSON.stringify(dialogDetails, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
