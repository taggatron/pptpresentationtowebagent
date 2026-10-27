import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  await page.mouse.click(947, 497);
  await page.waitForTimeout(1000);

  const menuItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="menuitem"], .mat-mdc-menu-item')).map(el => el.innerText.trim());
  });
  console.log("Artifact Menu Options:", menuItems);

  await page.screenshot({ path: "scratch/artifact_menu_open.png" });
  await page.keyboard.press("Escape");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
