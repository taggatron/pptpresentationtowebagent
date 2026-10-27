import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // 1. Rename Artifact title input
  const titleInput = page.locator('input[aria-label="Artifact title"]').first();
  if (await titleInput.isVisible()) {
    console.log("Found Artifact title input. Current value:", await titleInput.inputValue());
    await titleInput.click();
    await titleInput.fill("F172 - Genitic Engineering");
    await titleInput.press("Enter");
    await page.keyboard.press("Tab");
    console.log("Updated Artifact title to:", await titleInput.inputValue());
  }

  // 2. Click the more_vert button in the modal header
  // Let's locate the more_vert button in the modal header
  const headerMenuBtn = page.locator('button:has(mat-icon:has-text("more_vert"))').last();
  console.log("Clicking modal header more_vert button...");
  await headerMenuBtn.click();
  await page.waitForTimeout(1000);

  // Take screenshot of menu
  await page.screenshot({ path: "scratch/modal_menu.png" });
  console.log("Saved scratch/modal_menu.png");

  // List all menu items visible
  const menuItems = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[role="menuitem"], .mat-mdc-menu-item'));
    return items.map(i => ({
      text: i.innerText.trim(),
      ariaLabel: i.getAttribute('aria-label')
    }));
  });
  console.log("Menu items:", JSON.stringify(menuItems, null, 2));

  // Press Escape to close menu for now
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
