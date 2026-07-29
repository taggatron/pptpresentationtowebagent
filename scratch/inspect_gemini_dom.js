import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const context = browser.contexts()[0];
  const page = context.pages().find((p) => p.url().includes("gemini.google.com")) || context.pages()[0];

  console.log("Current Gemini URL:", page.url());

  const buttons = await page.evaluate(() => {
    const elList = Array.from(document.querySelectorAll("button, input[type='file'], [role='button'], mat-icon"));
    return elList.map((el) => ({
      tagName: el.tagName,
      className: el.className,
      ariaLabel: el.getAttribute("aria-label"),
      dataTestId: el.getAttribute("data-test-id"),
      text: el.textContent?.trim()?.slice(0, 40),
      outerHTML: el.outerHTML.slice(0, 150)
    }));
  });

  console.log("Found interactive elements in Gemini:", JSON.stringify(buttons, null, 2));

  await browser.disconnect();
}

main().catch(console.error);
