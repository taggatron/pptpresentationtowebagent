import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // Inspect the top bar of the modal
  const headerInfo = await page.evaluate(() => {
    const titleEl = document.querySelector('h1, h2, h3, [role="heading"], .title, .artifact-header');
    const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      text: b.innerText.trim(),
      className: b.className
    })).filter(b => b.ariaLabel || b.text);
    return {
      titleText: titleEl ? titleEl.innerText : null,
      buttons: buttons.slice(0, 30)
    };
  });
  console.log("Header & Buttons:", JSON.stringify(headerInfo, null, 2));

  // Let's check the 3 dots menu on the top right
  const moreVert = page.locator('button:has(mat-icon:has-text("more_vert"))').first();
  if (await moreVert.isVisible()) {
    console.log("Found more_vert button");
  }

  // Check thumbnails count
  const count = await page.evaluate(() => {
    const thumbs = document.querySelectorAll('div.cdk-drag');
    return thumbs.length;
  });
  console.log("Total slide thumbnails:", count);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
