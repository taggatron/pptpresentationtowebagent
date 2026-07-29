import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const context = browser.contexts()[0];
  const page = context.pages().find((p) => p.url().includes("gemini.google.com")) || context.pages()[0];

  console.log("Thread URL:", page.url());

  const buttons = await page.evaluate(() => {
    const elList = Array.from(document.querySelectorAll("button, [role='button'], input[type='file'], mat-icon, .mat-focus-indicator"));
    return elList.slice(-25).map((el) => ({
      tagName: el.tagName,
      className: el.className,
      ariaLabel: el.getAttribute("aria-label"),
      dataTestId: el.getAttribute("data-test-id"),
      text: el.textContent?.trim()?.slice(0, 30),
      outerHTML: el.outerHTML.slice(0, 150)
    }));
  });

  console.log("Recent interactive elements in Gemini thread prompt area:\n", JSON.stringify(buttons, null, 2));

  await browser.disconnect().catch(() => {});
}

main().catch(console.error);
