import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  console.log("Navigating CDP browser tab to https://gemini.google.com/app...");
  await page.goto("https://gemini.google.com/app");
  console.log("Current page title:", await page.title());
  console.log("Current URL:", page.url());

  await browser.disconnect().catch(() => {});
}

main().catch(console.error);
