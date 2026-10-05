import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31")) || ctx.pages()[0];

  // Inspect sources
  console.log("--- SOURCES ---");
  const sourceItems = page.locator('source-list-item, div.source-item, [role="listitem"], .source-title, mat-checkbox');
  const count = await sourceItems.count();
  console.log(`Potential source items count: ${count}`);
  for (let i = 0; i < Math.min(count, 15); i++) {
    const text = (await sourceItems.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    if (text) console.log(`Source ${i + 1}: ${text}`);
  }

  // Switch to Studio tab if available
  console.log("--- STUDIO TABS ---");
  const tabs = page.locator('[role="tab"], button:has-text("Studio"), button:has-text("Chat"), button:has-text("Sources")');
  const tabCount = await tabs.count();
  console.log(`Tabs found: ${tabCount}`);
  for (let i = 0; i < tabCount; i++) {
    console.log(`Tab ${i + 1}: ${await tabs.nth(i).innerText().catch(() => "")}`);
  }

  // Check artifacts currently in Studio
  const studioCards = page.locator('artifact-library-item, div:has(button[aria-description="Slide deck"]), [aria-label*="Slide deck"]');
  const cardCount = await studioCards.count();
  console.log(`Studio Cards count: ${cardCount}`);
  for (let i = 0; i < Math.min(cardCount, 10); i++) {
    console.log(`Studio Card ${i + 1}: ${(await studioCards.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim()}`);
  }

  await browser.close();
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
