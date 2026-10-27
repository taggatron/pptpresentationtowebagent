import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { LESSONS, EDGE_CDP_PORT, BASE_OUTPUT_DIR } from "./f172_lessons_config.mjs";

async function main() {
  const lesson = LESSONS[0]; // Lesson 9
  console.log(`=== Starting Generation for ${lesson.title} ===`);

  const outputDir = path.join(BASE_OUTPUT_DIR, lesson.folder);
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${EDGE_CDP_PORT}`);
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Notebook tab not found in Edge");

  console.log("Attached to Edge tab:", await page.title());

  // Set download behavior via CDP
  const client = await ctx.newCDPSession(page);
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: outputDir,
  });
  console.log("Configured CDP download path:", outputDir);

  // 1. Ensure any open dialog or modal is closed
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  const closeBtn = page.locator('button[aria-label="Close slide deck"], button[aria-label="Close"]').first();
  if (await closeBtn.isVisible().catch(() => false)) {
    console.log("Closing open artifact view...");
    await closeBtn.click();
    await page.waitForTimeout(1000);
  }

  // Scroll studio to top if needed
  await page.evaluate(() => {
    const panels = document.querySelectorAll('.panel-content-scrollable, .studio-panel');
    panels.forEach(p => p.scrollTop = 0);
  });
  await page.waitForTimeout(500);

  // 2. Click "Slide deck"
  console.log("Finding 'Slide deck' button...");
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"], button:has-text("Slide deck")').first();
  await slideDeckBtn.waitFor({ state: "visible", timeout: 10000 });
  await slideDeckBtn.click();
  console.log("Clicked 'Slide deck'!");
  await page.waitForTimeout(1500);

  // 3. Wait for Customize overlay
  const overlay = page.locator(".cdk-overlay-pane, mat-dialog-container").first();
  await overlay.waitFor({ state: "visible", timeout: 10000 });
  console.log("Dialog is open!");

  // 4. Select "Presenter slides"
  const presenterCard = overlay.locator('div, span, [role="radio"]').filter({ hasText: /^Presenter slides/ }).first();
  if (await presenterCard.isVisible({ timeout: 5000 }).catch(() => false)) {
    await presenterCard.click();
    console.log("Selected 'Presenter slides' format.");
    await page.waitForTimeout(500);
  }

  // 5. Fill textarea with prompt
  const textarea = overlay.locator("textarea").first();
  await textarea.waitFor({ state: "visible", timeout: 5000 });
  await textarea.click();
  await textarea.fill(lesson.prompt);
  console.log(`Filled textarea with prompt (${lesson.prompt.length} chars).`);
  await page.waitForTimeout(500);

  // 6. Click "Generate now"
  const generateBtn = overlay.locator('button:has-text("Generate now")').first();
  await generateBtn.waitFor({ state: "visible", timeout: 5000 });
  await generateBtn.click();
  console.log("Clicked 'Generate now'!");

  await overlay.waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
  console.log("Generation started! Monitoring progress...");

  // 7. Monitor generation
  let finished = false;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(5000);
    const isGenerating = await page.getByText(/Generating slide deck|Generating\.\.\./i).first().isVisible().catch(() => false);
    console.log(`[Check ${i + 1}/40 - ${(i + 1) * 5}s] Generating: ${isGenerating}`);
    if (!isGenerating && i > 3) {
      console.log("Generation finished!");
      finished = true;
      break;
    }
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scratch/lesson_9_after_gen.png" });

  // 8. Rename artifact if title input is visible
  const titleInput = page.locator('input[aria-label="Artifact title"]').first();
  if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log("Renaming artifact to:", lesson.title);
    await titleInput.click();
    await titleInput.fill(lesson.title);
    await titleInput.press("Enter");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(1000);
  }

  // 9. Download PPTX
  console.log("Downloading PowerPoint (.pptx)...");
  const moreVert = page.locator('button:has(mat-icon:has-text("more_vert"))').last();
  await moreVert.waitFor({ state: "visible", timeout: 5000 });
  await moreVert.click();
  await page.waitForTimeout(1000);

  const pptxBtn = page.locator('[role="menuitem"]:has-text("PowerPoint"), button:has-text("PowerPoint")').first();
  await pptxBtn.waitFor({ state: "visible", timeout: 5000 });
  await pptxBtn.click();
  console.log("Clicked 'Download PowerPoint'!");

  // Poll for PPTX file in outputDir
  let pptxFile = null;
  for (let i = 0; i < 45; i++) {
    await page.waitForTimeout(1000);
    const files = await fs.readdir(outputDir).catch(() => []);
    const found = files.find(f => f.endsWith(".pptx") && !f.endsWith(".crdownload"));
    if (found) {
      const stat = await fs.stat(path.join(outputDir, found));
      if (stat.size > 20000) {
        pptxFile = path.join(outputDir, found);
        console.log(`Downloaded PPTX: ${found} (${stat.size} bytes)`);
        break;
      }
    }
  }

  // 10. Download PDF
  console.log("Downloading PDF...");
  await moreVert.click();
  await page.waitForTimeout(1000);

  const pdfBtn = page.locator('[role="menuitem"]:has-text("PDF"), button:has-text("PDF")').first();
  await pdfBtn.waitFor({ state: "visible", timeout: 5000 });
  await pdfBtn.click();
  console.log("Clicked 'Download PDF'!");

  let pdfFile = null;
  for (let i = 0; i < 45; i++) {
    await page.waitForTimeout(1000);
    const files = await fs.readdir(outputDir).catch(() => []);
    const found = files.find(f => f.endsWith(".pdf") && !f.endsWith(".crdownload"));
    if (found) {
      const stat = await fs.stat(path.join(outputDir, found));
      if (stat.size > 20000) {
        pdfFile = path.join(outputDir, found);
        console.log(`Downloaded PDF: ${found} (${stat.size} bytes)`);
        break;
      }
    }
  }

  // 11. Close artifact view
  const closeDeckBtn = page.locator('button[aria-label="Close slide deck"], button[aria-label="Close"]').first();
  if (await closeDeckBtn.isVisible().catch(() => false)) {
    await closeDeckBtn.click();
    console.log("Closed slide deck view.");
  } else {
    await page.keyboard.press("Escape");
  }

  console.log(`=== Finished Lesson 9! PPTX: ${pptxFile}, PDF: ${pdfFile} ===`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
