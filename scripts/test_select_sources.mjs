import { chromium } from "playwright";

async function main() {
  console.log("Connecting to Chrome on CDP port 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));
  if (!page) throw new Error("Notebook page not found");

  const dialog = page.locator(".cdk-overlay-pane");

  console.log("Clicking 'Select all' to uncheck all sources...");
  const selectAll = dialog.locator('div, span, button').filter({ hasText: /^Select all/ }).first();
  await selectAll.click();
  await page.waitForTimeout(500);

  // Now click on the 3 target sources
  console.log("Selecting source 1: # An Introduction To Photography...");
  const src1 = dialog.locator('div, span').filter({ hasText: /An Introduction To Photography — Adult Course/ }).first();
  await src1.click();
  await page.waitForTimeout(300);

  console.log("Selecting source 2: Visual Education...");
  const src2 = dialog.locator('div, span').filter({ hasText: /An introduction to photography - Visual Education/ }).first();
  await src2.click();
  await page.waitForTimeout(300);

  console.log("Selecting source 3: Yale Summer Session...");
  const src3 = dialog.locator('div, span').filter({ hasText: /Introductory Digital Photography - Yale Summer Session/ }).first();
  await src3.click();
  await page.waitForTimeout(300);

  await page.screenshot({ path: "scratch/sources_3_selected.png" });
  console.log("Saved scratch/sources_3_selected.png");

  // Click Confirm
  const confirmBtn = dialog.locator('button:has-text("Confirm")').first();
  await confirmBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: "scratch/dialog_after_confirm_sources.png" });
  console.log("Saved scratch/dialog_after_confirm_sources.png");

  await browser.close();
}

main().catch(err => {
  console.error("Error in source selection test:", err);
  process.exit(1);
});
