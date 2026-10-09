import { chromium } from "playwright";
import path from "node:path";

async function main() {
  console.log("Connecting to Chrome on 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));
  if (!page) throw new Error("Notebook page not found");

  console.log("Locating Slide deck button...");
  // Look for slide deck button in Studio
  const slideDeckBtn = page.locator('div.create-artifact-button-container[role="button"][aria-label="Slide deck"], button:has-text("Slide deck"), span:has-text("Slide deck")').first();
  console.log(`Found slide deck button count: ${await slideDeckBtn.count()}`);
  await slideDeckBtn.click();

  console.log("Waiting 3s for dialog...");
  await page.waitForTimeout(3000);

  const screenshotPath = path.resolve("scratch/slide_deck_dialog.png");
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot saved to ${screenshotPath}`);

  // Inspect dialog text and inputs
  const dialog = page.locator('mat-dialog-container, [role="dialog"]');
  const dCount = await dialog.count();
  console.log(`Dialog count: ${dCount}`);
  if (dCount > 0) {
    const text = await dialog.first().innerText().catch(() => "");
    console.log("Dialog text:\n" + text);
    
    // Check buttons inside dialog
    const dButtons = dialog.first().locator('button');
    const bCount = await dButtons.count();
    console.log(`Dialog buttons (${bCount}):`);
    for (let i = 0; i < bCount; i++) {
      console.log(`  Button ${i + 1}: "${(await dButtons.nth(i).innerText().catch(() => '')).replace(/\s+/g, ' ')}" [aria-label="${await dButtons.nth(i).getAttribute('aria-label')}"]`);
    }

    // Check textarea / input
    const inputs = dialog.first().locator('textarea, input[type="text"]');
    const inCount = await inputs.count();
    console.log(`Dialog inputs (${inCount}):`);
    for (let i = 0; i < inCount; i++) {
      console.log(`  Input ${i + 1}: placeholder="${await inputs.nth(i).getAttribute('placeholder')}" [aria-label="${await inputs.nth(i).getAttribute('aria-label')}"]`);
    }
  }

  await browser.close();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
