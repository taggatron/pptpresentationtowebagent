import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  // Rename title to "F172 - Genitic Engineering"
  const titleText = page.locator("text=Gene Therapy Masterclass").first();
  const editIcon = page.locator('mat-icon:has-text("edit"), [aria-label*="Edit" i]').first();
  if (await editIcon.isVisible().catch(() => false)) {
    await editIcon.click();
    await page.waitForTimeout(500);
    const input = page.locator("input:focus, input.artifact-title-input").first();
    if (await input.isVisible().catch(() => false)) {
      await input.fill("F172 - Genitic Engineering");
      await input.press("Enter");
      console.log("Renamed artifact to F172 - Genitic Engineering!");
    }
  }

  // Click Slide 4 (Clinical Trials & NEA Task 2)
  const slide4Thumb = page.locator('div:has-text("4"), [aria-label*="Slide 4"]').filter({ hasText: /4/ }).last();
  await slide4Thumb.click({ force: true });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "scratch/f172_slide_04_preview.png" });
  console.log("Saved scratch/f172_slide_04_preview.png");

  // Click Slide 5 (AMT-130 Clinical Trial)
  const slide5Thumb = page.locator('div:has-text("5"), [aria-label*="Slide 5"]').filter({ hasText: /5/ }).last();
  await slide5Thumb.click({ force: true });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "scratch/f172_slide_05_preview.png" });
  console.log("Saved scratch/f172_slide_05_preview.png");

  // Scroll thumbnails list down to see remaining slides
  const thumbList = page.locator('.thumbnails-container, .slide-list, .slides-nav, mat-dialog-content').last();
  await thumbList.hover().catch(() => {});
  await page.mouse.wheel(500, 1000);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "scratch/f172_slide_list_scrolled.png" });
  console.log("Saved scratch/f172_slide_list_scrolled.png");
}

main().catch(console.error);
