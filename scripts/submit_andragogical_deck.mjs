import { chromium } from "playwright";
import { PROMPT_ANDRAGOGICAL_INCLUSION } from "./generate_andragogical_inclusion_deck.mjs";

async function main() {
  console.log("Connecting to Edge on CDP port 9334...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  let page = ctx.pages().find(p => p.url().includes("5927de21-65f8-4f39-9744-2bfd02ceb489"));
  if (!page) throw new Error("Notebook tab not found");

  await page.bringToFront();

  // If dialog is not open, open it
  const dialogHeader = page.getByText("Customise slide deck");
  if (!await dialogHeader.isVisible().catch(() => false)) {
    console.log("Opening Slide deck dialog...");
    const btn = page.getByText("Slide deck").first();
    await btn.click();
    await page.waitForTimeout(1500);
  }

  // Select "Presenter slides"
  console.log("Selecting 'Presenter slides' format...");
  const presenterBtn = page.getByText("Presenter slides").first();
  await presenterBtn.click();
  await page.waitForTimeout(500);

  // Fill textarea
  console.log(`Filling prompt (${PROMPT_ANDRAGOGICAL_INCLUSION.length} characters)...`);
  const textarea = page.locator('textarea, [aria-label*="Describe the slide deck"]').first();
  await textarea.fill(PROMPT_ANDRAGOGICAL_INCLUSION);
  await page.waitForTimeout(1000);

  // Take screenshot before click
  await page.screenshot({ path: "scratch/prompt_filled_before_submit.png" });
  console.log("Saved scratch/prompt_filled_before_submit.png");

  // Click Generate now
  console.log("Clicking 'Generate now'...");
  const generateBtn = page.getByRole("button", { name: "Generate now" }).or(page.locator('button:has-text("Generate now")')).first();
  await generateBtn.click();
  console.log("Clicked 'Generate now'!");

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scratch/after_submit_generation.png" });
  console.log("Saved scratch/after_submit_generation.png");

  await browser.close();
}

main().catch(err => {
  console.error("Submission error:", err);
  process.exit(1);
});
