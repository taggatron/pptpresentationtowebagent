import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const moreBtn = page.locator('button[aria-label="More options"]').last();
  if (await moreBtn.isVisible()) {
    console.log("Clicking More options...");
    await moreBtn.click();
    await page.waitForTimeout(500);
    const menuItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[role="menuitem"], .mat-mdc-menu-item')).map(el => el.innerText.trim());
    });
    console.log("Menu items under More options:", menuItems);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }

  // Check aria-labels of buttons near top of studio panel
  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      rect: b.getBoundingClientRect()
    })).filter(b => b.rect.y > 100 && b.rect.y < 200 && b.rect.x > 700);
  });
  console.log("Studio panel buttons:", JSON.stringify(btns, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
