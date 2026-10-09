import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));

  const dialog = page.locator('mat-dialog-container, [role="dialog"]').first();
  console.log("Checking dialog options...");

  const presenterOpt = page.locator('div:has-text("Presenter slides"), mat-radio-button:has-text("Presenter slides"), [role="radio"]:has-text("Presenter slides"), div.format-option:has-text("Presenter slides")');
  console.log("Presenter options count:", await presenterOpt.count());

  const lengthChips = page.locator('mat-chip, [role="radio"], button, mat-button-toggle').filter({ hasText: /Short|Default|Long/ });
  console.log("Length chips count:", await lengthChips.count());
  for (let i = 0; i < await lengthChips.count(); i++) {
    console.log(`Length chip ${i + 1}:`, (await lengthChips.nth(i).innerText().catch(() => "")).trim());
  }

  const promptTextarea = page.locator('textarea[placeholder*="outline"], textarea[aria-label*="Describe"], textarea');
  console.log("Prompt textarea count:", await promptTextarea.count());

  const generateBtn = page.locator('button:has-text("Generate now")');
  console.log("Generate now button count:", await generateBtn.count());

  await browser.close();
}

main().catch(console.error);
