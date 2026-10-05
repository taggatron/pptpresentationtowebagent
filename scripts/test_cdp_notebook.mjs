import { chromium } from "playwright";

async function main() {
  console.log("Connecting to Chrome on port 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const contexts = browser.contexts();
  console.log(`Contexts: ${contexts.length}`);
  const ctx = contexts[0];
  let page = ctx.pages().find(p => p.url().includes("notebook")) || ctx.pages()[0];
  if (!page) {
    page = await ctx.newPage();
  }
  console.log(`Current page URL: ${page.url()}`);
  
  const targetUrl = "https://notebook.google.com/notebook/40fbb05f-e884-4f79-828b-c4539e9a0d31";
  if (!page.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31")) {
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  }

  await page.waitForTimeout(5000);
  console.log(`Page Title: "${await page.title()}"`);
  console.log(`Page URL: ${page.url()}`);

  // Check if sign-in or notebook is loaded
  const bodyText = await page.innerText("body").catch(() => "");
  console.log(`Body text snippet (first 300 chars): ${bodyText.slice(0, 300).replace(/\s+/g, " ")}`);

  // Check for slide deck button or create artifact button
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"]');
  const count = await slideDeckBtn.count();
  console.log(`Slide deck button count: ${count}`);

  // Check artifact cards
  const cards = page.locator('artifact-library-item, div:has(button[aria-description="Slide deck"])');
  const cardCount = await cards.count();
  console.log(`Artifact cards count: ${cardCount}`);
  for (let i = 0; i < Math.min(cardCount, 5); i++) {
    const text = (await cards.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    console.log(`Card ${i + 1}: ${text}`);
  }
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
