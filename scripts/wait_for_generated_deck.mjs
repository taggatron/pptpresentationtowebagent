import { chromium } from "playwright";

async function waitAndClick() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("5927de21-65f8-4f39-9744-2bfd02ceb489"));
  await page.bringToFront();

  console.log("Waiting for generation to finish...");
  for (let i = 0; i < 40; i++) {
    const isGenerating = await page.locator("text=Generating slide deck").isVisible().catch(() => false);
    if (!isGenerating) {
      console.log("Finished generating!");
      break;
    }
    console.log(`Still generating (step ${i + 1})...`);
    await page.waitForTimeout(3000);
  }

  await page.screenshot({ path: "scratch/gen_after_finish.png" });
  console.log("Saved scratch/gen_after_finish.png");

  // Inspect Studio panel
  const studioText = await page.locator(".studio-panel").innerText().catch(() => "");
  console.log("Studio panel text:\n", studioText.slice(0, 600));

  await browser.close();
  process.exit(0);
}

waitAndClick().catch(err => {
  console.error(err);
  process.exit(1);
});
