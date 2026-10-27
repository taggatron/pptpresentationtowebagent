import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { LESSONS, EDGE_CDP_PORT, BASE_OUTPUT_DIR } from "./f172_lessons_config.mjs";

async function generateLesson(lessonIndex) {
  const lesson = LESSONS[lessonIndex];
  if (!lesson) {
    throw new Error(`Invalid lesson index: ${lessonIndex}`);
  }

  console.log(`\n======================================================`);
  console.log(`=== STARTING DECK GENERATION: ${lesson.title} ===`);
  console.log(`======================================================`);

  const outputDir = path.join(BASE_OUTPUT_DIR, lesson.folder);
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${EDGE_CDP_PORT}`);
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Genetics Notebook tab not found in Edge browser!");

  console.log("Attached to Edge tab:", await page.title());

  // Configure CDP download behavior
  const client = await ctx.newCDPSession(page);
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: outputDir,
  });
  console.log("Configured CDP download path:", outputDir);

  // 1. Ensure any open modal or viewer is closed
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  const closeViewerBtn = page.locator('button[aria-label="Close slide deck"], button[aria-label="Close"]').first();
  if (await closeViewerBtn.isVisible().catch(() => false)) {
    console.log("Closing open viewer...");
    await closeViewerBtn.click();
    await page.waitForTimeout(1000);
  }

  // Scroll studio panel to top
  await page.evaluate(() => {
    const panels = document.querySelectorAll('.panel-content-scrollable, .studio-panel');
    panels.forEach(p => p.scrollTop = 0);
  });
  await page.waitForTimeout(500);

  // 2. Click "Slide deck" button
  console.log("Clicking 'Slide deck' button...");
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"], button:has-text("Slide deck")').first();
  await slideDeckBtn.waitFor({ state: "visible", timeout: 15000 });
  await slideDeckBtn.click();
  console.log("Clicked 'Slide deck' button.");
  await page.waitForTimeout(1500);

  // 3. Wait for Customize overlay
  const overlay = page.locator(".cdk-overlay-pane, mat-dialog-container").first();
  await overlay.waitFor({ state: "visible", timeout: 15000 });
  console.log("Dialog opened successfully.");

  // 4. Select "Presenter slides" format
  const presenterCard = overlay.locator('div, span, [role="radio"]').filter({ hasText: /^Presenter slides/ }).first();
  if (await presenterCard.isVisible({ timeout: 5000 }).catch(() => false)) {
    await presenterCard.click();
    console.log("Selected 'Presenter slides' format.");
    await page.waitForTimeout(500);
  }

  // 5. Fill prompt in textarea
  const textarea = overlay.locator("textarea").first();
  await textarea.waitFor({ state: "visible", timeout: 5000 });
  await textarea.click();
  await textarea.fill(lesson.prompt);
  console.log(`Filled prompt (${lesson.prompt.length} chars).`);
  await page.waitForTimeout(500);

  // 6. Click "Generate now"
  const generateBtn = overlay.locator('button:has-text("Generate now")').first();
  await generateBtn.waitFor({ state: "visible", timeout: 5000 });
  await generateBtn.click();
  console.log("Clicked 'Generate now' button!");

  await overlay.waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
  console.log("Generation started! Monitoring progress in Studio...");

  // 7. Monitor generation until complete
  let generating = true;
  let elapsed = 0;
  for (let i = 0; i < 50; i++) { // up to 250s
    await page.waitForTimeout(5000);
    elapsed += 5;
    
    // Check if progress indicator is visible
    const status = await page.evaluate(() => {
      const panel = document.querySelector('.studio-panel');
      const text = panel ? panel.innerText : '';
      const isGen = /Generating slide deck|Generating\.\.\.|Bringing it to life|Creating the content|Shaping the output|Rendering visual details|Wrapping things up/i.test(text);
      const activity = !!document.querySelector('.progress_activity, mat-progress-spinner, [class*="progress"]');
      return { isGen, activity, textSample: text.slice(0, 150) };
    });

    console.log(`[${elapsed}s] Generating: ${status.isGen || status.activity}`);
    if (!status.isGen && !status.activity && elapsed > 25) {
      console.log("Generation complete!");
      generating = false;
      break;
    }
  }

  if (generating) {
    console.warn("Reached maximum wait time, checking artifact list...");
  }

  await page.waitForTimeout(3000);

  // 8. Open the newly generated slide deck
  console.log("Opening newly generated slide deck from Studio list...");
  const firstItem = page.locator("artifact-library-item").first();
  await firstItem.waitFor({ state: "visible", timeout: 10000 });
  
  const titleContainer = firstItem.locator(".title-container, button.artifact-stretched-button").first();
  await titleContainer.click();
  console.log("Clicked top artifact item. Waiting for viewer to open...");

  // Wait for viewer to open
  const viewerClose = page.locator('button[aria-label="Close slide deck"], button[aria-label="Close"]').first();
  await viewerClose.waitFor({ state: "visible", timeout: 20000 });
  console.log("Slide deck viewer is open!");
  await page.waitForTimeout(2000);

  // 9. Rename artifact
  const titleInput = page.locator('input[aria-label="Artifact title"]').first();
  if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log("Renaming artifact to:", lesson.title);
    await titleInput.click();
    await titleInput.fill(lesson.title);
    await titleInput.press("Enter");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(1000);
    console.log("Renamed successfully.");
  }

  // 10. Download PowerPoint (.pptx)
  console.log("Initiating PowerPoint (.pptx) download...");
  const moreVert = page.locator('button:has(mat-icon:has-text("more_vert"))').last();
  await moreVert.waitFor({ state: "visible", timeout: 5000 });
  await moreVert.click();
  await page.waitForTimeout(1000);

  const pptxBtn = page.locator('[role="menuitem"]:has-text("PowerPoint"), button:has-text("PowerPoint")').first();
  await pptxBtn.waitFor({ state: "visible", timeout: 5000 });
  await pptxBtn.click();
  console.log("Clicked 'Download PowerPoint'. Waiting for file to complete...");

  let pptxFile = null;
  for (let i = 0; i < 45; i++) {
    await page.waitForTimeout(1000);
    const files = await fs.readdir(outputDir).catch(() => []);
    const found = files.find(f => f.endsWith(".pptx") && !f.endsWith(".crdownload"));
    if (found) {
      const stat = await fs.stat(path.join(outputDir, found));
      if (stat.size > 50000) {
        pptxFile = path.join(outputDir, found);
        console.log(`✓ PPTX Downloaded: ${found} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
        break;
      }
    }
  }

  if (!pptxFile) {
    throw new Error("PPTX download timed out or file too small");
  }

  // 11. Download PDF (.pdf)
  console.log("Initiating PDF (.pdf) download...");
  await moreVert.click();
  await page.waitForTimeout(1000);

  const pdfBtn = page.locator('[role="menuitem"]:has-text("PDF"), button:has-text("PDF")').first();
  await pdfBtn.waitFor({ state: "visible", timeout: 5000 });
  await pdfBtn.click();
  console.log("Clicked 'Download PDF'. Waiting for file to complete...");

  let pdfFile = null;
  for (let i = 0; i < 45; i++) {
    await page.waitForTimeout(1000);
    const files = await fs.readdir(outputDir).catch(() => []);
    const found = files.find(f => f.endsWith(".pdf") && !f.endsWith(".crdownload"));
    if (found) {
      const stat = await fs.stat(path.join(outputDir, found));
      if (stat.size > 50000) {
        pdfFile = path.join(outputDir, found);
        console.log(`✓ PDF Downloaded: ${found} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
        break;
      }
    }
  }

  if (!pdfFile) {
    throw new Error("PDF download timed out or file too small");
  }

  // 12. Close viewer to return to Studio root
  console.log("Closing slide deck viewer to return to Studio root...");
  if (await viewerClose.isVisible().catch(() => false)) {
    await viewerClose.click();
  } else {
    await page.keyboard.press("Escape");
  }
  await page.waitForTimeout(2000);

  // Verify slideDeckBtn is visible again
  const isReady = await slideDeckBtn.isVisible({ timeout: 5000 }).catch(() => false);
  console.log(`Studio root ready for next action: ${isReady}`);

  await browser.close();

  console.log(`======================================================`);
  console.log(`=== SUCCESSFULLY COMPLETED: ${lesson.title} ===`);
  console.log(`PPTX: ${pptxFile}`);
  console.log(`PDF:  ${pdfFile}`);
  console.log(`======================================================\n`);

  return { pptxFile, pdfFile };
}

const targetLessonIndex = parseInt(process.argv[2], 10);
if (isNaN(targetLessonIndex)) {
  console.error("Usage: node generate_lesson_deck.mjs <lesson_index>");
  console.error("  1: Lesson 10 (Clinical Trials & ANT-130 / NEA Task 2)");
  console.error("  2: Lesson 11 (Genetic Engineering vs Gene Therapy)");
  console.error("  3: Lesson 12 (CRISPR-Cas9 & Research Workshop)");
  process.exit(1);
}

generateLesson(targetLessonIndex)
  .then(() => process.exit(0))
  .catch(err => {
    console.error("ERROR generating lesson deck:", err);
    process.exit(1);
  });
