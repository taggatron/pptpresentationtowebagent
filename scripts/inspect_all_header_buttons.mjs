import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const headerButtons = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).filter(b => {
      const rect = b.getBoundingClientRect();
      return rect.top >= 70 && rect.top <= 120;
    });
    return btns.map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      icon: b.querySelector('mat-icon')?.innerText,
      text: b.innerText.trim(),
      left: b.getBoundingClientRect().left,
      top: b.getBoundingClientRect().top
    }));
  });

  console.log("All buttons top 70-120:", JSON.stringify(headerButtons, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
