import { chromium } from "playwright";

async function main() {
  console.log("Connecting to Chrome on CDP port 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const contexts = browser.contexts();
  console.log(`Contexts count: ${contexts.length}`);
  
  let ctx = contexts[0];
  if (!ctx) {
    console.log("No context found, creating one if possible or using default");
  }
  let pages = ctx.pages();
  console.log(`Pages count: ${pages.length}`);
  for (let i = 0; i < pages.length; i++) {
    console.log(`Page ${i}: ${pages[i].url()} ("${await pages[i].title()}")`);
  }

  let page = pages.find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e") || p.url().includes("notebook"));
  if (!page) {
    console.log("Opening new page or reusing page 0...");
    page = pages[0] || await ctx.newPage();
  }

  const targetUrl = "https://notebook.google.com/notebook/9a800698-e8aa-4f55-a640-ee8f50b31f4e";
  if (!page.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e")) {
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  }

  console.log("Waiting 5s for page to settle...");
  await page.waitForTimeout(5000);
  console.log(`Current page title: "${await page.title()}"`);
  console.log(`Current page URL: ${page.url()}`);

  const bodyText = await page.innerText("body").catch(() => "");
  console.log(`Body text snippet (first 500 chars): ${bodyText.slice(0, 500).replace(/\s+/g, " ")}`);

  // Sources
  console.log("--- SOURCES ---");
  const sourceItems = page.locator('source-list-item, div.source-item, [role="listitem"], .source-title, mat-checkbox');
  const sCount = await sourceItems.count();
  console.log(`Source items count: ${sCount}`);
  for (let i = 0; i < Math.min(sCount, 15); i++) {
    const text = (await sourceItems.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    if (text) console.log(`Source ${i + 1}: ${text}`);
  }

  // Studio tabs / Artifacts
  console.log("--- STUDIO CARDS ---");
  const studioCards = page.locator('artifact-library-item, div:has(button[aria-description="Slide deck"]), [aria-label*="Slide deck"]');
  const cardCount = await studioCards.count();
  console.log(`Studio Cards count: ${cardCount}`);
  for (let i = 0; i < Math.min(cardCount, 10); i++) {
    console.log(`Card ${i + 1}: ${(await studioCards.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim()}`);
  }

  // Check Slide deck button
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"]');
  console.log(`Slide deck button visible: ${await slideDeckBtn.count()}`);
}

main().catch(err => {
  console.error("Error in inspect_photo_notebook:", err);
  process.exit(1);
});
