import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // Let's see what buttons are in Studio header
  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      text: b.innerText.trim(),
      rect: b.getBoundingClientRect()
    })).filter(b => b.rect.x > 600 && b.rect.y < 150);
  });
  console.log("Studio header buttons:", btns);

  // If there is a back button or close button:
  const backOrClose = page.locator('button[aria-label*="Back"], button[aria-label*="Close"], button:has(mat-icon:has-text("arrow_back")), button:has(mat-icon:has-text("close"))').last();
  if (await backOrClose.isVisible()) {
    console.log("Clicking back/close...");
    await backOrClose.click();
  } else {
    // click the collapse/back icon at top right of studio panel
    await page.mouse.click(968, 104);
  }
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scratch/studio_after_back.png" });
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
