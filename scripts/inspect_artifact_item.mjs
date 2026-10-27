import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // Locate the artifact item
  const item = page.locator('text="F172 - Genitic Engineering"').first();
  console.log("Found artifact item:", await item.isVisible());

  // Check its parent or container to see the three dots menu button
  const container = item.locator('xpath=ancestor::*[contains(@class, "studio-item") or contains(@class, "artifact") or contains(@class, "mat-mdc-list-item") or self::div][1]');
  
  // Find menu button next to it
  const menuBtn = container.locator('button:has(mat-icon:has-text("more_vert"))').first();
  if (await menuBtn.isVisible()) {
    console.log("Clicking menu button for F172 artifact...");
    await menuBtn.click();
    await page.waitForTimeout(800);
    const menuItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[role="menuitem"], .mat-mdc-menu-item')).map(el => el.innerText.trim());
    });
    console.log("Artifact Menu Options:", menuItems);
    await page.keyboard.press("Escape");
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
