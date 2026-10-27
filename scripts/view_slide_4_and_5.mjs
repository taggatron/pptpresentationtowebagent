import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // Click Slide 4 thumbnail at (1050, 500)
  console.log("Clicking slide 4 thumbnail at 1050, 500...");
  await page.mouse.click(1050, 500);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/f172_slide_04.png" });
  console.log("Saved scratch/f172_slide_04.png");

  // Click Slide 5 thumbnail at (1050, 610)
  console.log("Clicking slide 5 thumbnail at 1050, 610...");
  await page.mouse.click(1050, 610);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/f172_slide_05.png" });
  console.log("Saved scratch/f172_slide_05.png");

  // Rename the artifact title properly if not already done
  await page.evaluate(() => {
    const editBtn = document.querySelector('button[aria-label*="Rename"], [aria-label*="Edit title"]');
    if (editBtn) editBtn.click();
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const input = document.querySelector('input.artifact-title-input, input[aria-label*="title"]');
    if (input) {
      input.value = "F172 - Genitic Engineering";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    }
  });
}

main().catch(console.error);
