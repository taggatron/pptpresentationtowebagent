import { chromium } from "playwright";

async function main() {
  console.log("Connecting to Chrome on CDP port 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));
  if (!page) throw new Error("Notebook page not found");

  const retryBtn = page.getByRole("button", { name: "Retry" }).first();
  const retryCount = await retryBtn.count();
  console.log(`Retry button count: ${retryCount}`);

  if (retryCount > 0 && await retryBtn.isVisible()) {
    console.log("Clicking Retry button...");
    await retryBtn.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "scratch/after_retry_click.png" });
    console.log("Saved scratch/after_retry_click.png");
  } else {
    console.log("Retry button not visible. Checking Studio panel...");
  }

  await browser.close();
}

main().catch(err => {
  console.error("Error in retry script:", err);
  process.exit(1);
});
