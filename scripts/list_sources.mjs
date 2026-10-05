import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31")) || ctx.pages()[0];

  const sourceLabels = page.locator('.source-item-title, .source-title, mat-checkbox .mdc-label');
  const count = await sourceLabels.count();
  console.log(`Source count: ${count}`);
  for (let i = 0; i < count; i++) {
    console.log(`Source ${i+1}: ${(await sourceLabels.nth(i).innerText().catch(() => "")).trim()}`);
  }
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
