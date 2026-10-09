import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  console.log("Connecting to Chrome on 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  let page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));
  
  if (!page) {
    page = ctx.pages()[0];
  }
  
  console.log(`Current page URL: ${page.url()}`);
  if (!page.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e")) {
    console.log("Navigating to https://notebook.google.com/notebook/9a800698-e8aa-4f55-a640-ee8f50b31f4e ...");
    await page.goto("https://notebook.google.com/notebook/9a800698-e8aa-4f55-a640-ee8f50b31f4e", {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });
  }

  await page.waitForTimeout(6000);
  console.log(`Page title: "${await page.title()}"`);
  console.log(`Final URL: ${page.url()}`);

  // Take a screenshot to inspect
  const screenshotPath = path.resolve("scratch/notebook_photography_screen.png");
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  // Inspect source panel
  const sources = page.locator('source-list-item, div.source-item, [role="listitem"], .source-title, mat-checkbox');
  const sourceCount = await sources.count();
  console.log(`Sources count: ${sourceCount}`);
  for (let i = 0; i < Math.min(sourceCount, 15); i++) {
    const text = (await sources.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    if (text) console.log(`  Source ${i + 1}: ${text}`);
  }

  // Inspect studio artifacts
  const studioCards = page.locator('artifact-library-item, div:has(button[aria-description="Slide deck"]), [aria-label*="Slide deck"]');
  const cardCount = await studioCards.count();
  console.log(`Studio Cards count: ${cardCount}`);
  for (let i = 0; i < Math.min(cardCount, 10); i++) {
    const text = (await studioCards.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    console.log(`  Artifact ${i + 1}: ${text}`);
  }

  // Check buttons
  const buttons = page.locator('button');
  const btnCount = await buttons.count();
  console.log(`Total buttons: ${btnCount}`);
  for (let i = 0; i < Math.min(btnCount, 25); i++) {
    const aria = await buttons.nth(i).getAttribute("aria-label").catch(() => "");
    const txt = (await buttons.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    if (aria || txt) {
      console.log(`  Btn ${i + 1}: aria="${aria}", text="${txt}"`);
    }
  }

  await browser.close();
}

main().catch(err => {
  console.error("Error in check_photography_notebook:", err);
  process.exit(1);
});
