import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));

  // Check dialog
  const overlayHeading = page.getByText("Customise slide deck", { exact: true });
  if (await overlayHeading.count() === 0) {
    console.log("Opening slide deck dialog...");
    const slideDeckBtn = page.locator('div.create-artifact-button-container[role="button"][aria-label="Slide deck"]').first();
    await slideDeckBtn.click();
    await overlayHeading.waitFor({ state: "visible", timeout: 10000 });
  }

  // Click "Presenter slides"
  console.log("Clicking Presenter slides...");
  const presenterCard = page.locator('div, span, mat-radio-button').filter({ hasText: /^Presenter slides/ }).first();
  await presenterCard.click();
  await page.waitForTimeout(500);

  // Check textarea
  const textarea = page.getByLabel("Describe the slide deck that you want to create", { exact: false })
    .or(page.locator('textarea'))
    .first();
  console.log("Textarea found:", await textarea.count());

  // Check Generate now button
  const generateBtn = page.locator('button:has-text("Generate now")').first();
  console.log("Generate now button found:", await generateBtn.count());
  console.log("Generate now button disabled?", await generateBtn.isDisabled());

  await browser.close();
}

main().catch(console.error);
