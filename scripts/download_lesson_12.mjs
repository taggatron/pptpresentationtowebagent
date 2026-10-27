import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import { LESSONS, EDGE_CDP_PORT, BASE_OUTPUT_DIR } from "./f172_lessons_config.mjs";

async function main() {
  const lesson = LESSONS[3]; // Lesson 12
  console.log(`=== Completing Download and Ingestion for ${lesson.title} ===`);

  const outputDir = path.join(BASE_OUTPUT_DIR, lesson.folder);
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${EDGE_CDP_PORT}`);
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Notebook tab not found in Edge");

  console.log("Attached to Edge tab:", await page.title());

  const client = await ctx.newCDPSession(page);
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: outputDir,
  });
  console.log("Configured CDP download path:", outputDir);

  // Check if viewer is open
  const viewerClose = page.locator('button[aria-label="Close slide deck"], button[aria-label="Close"]').first();
  const isOpen = await viewerClose.isVisible().catch(() => false);
  console.log("Viewer open:", isOpen);

  if (!isOpen) {
    // Open top artifact
    console.log("Opening top artifact...");
    await page.evaluate(() => {
      const el = document.querySelector('artifact-library-item button.artifact-stretched-button, artifact-library-item .title-container');
      if (el) el.click();
    });
    await viewerClose.waitFor({ state: "visible", timeout: 20000 });
  }

  // 1. Rename if needed
  const titleInput = page.locator('input[aria-label="Artifact title"]').first();
  if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    const curVal = await titleInput.inputValue();
    if (!curVal.includes("Lesson 12")) {
      console.log("Renaming artifact to:", lesson.title);
      await titleInput.click();
      await titleInput.fill(lesson.title);
      await titleInput.press("Enter");
      await page.keyboard.press("Tab");
      await page.waitForTimeout(1000);
    }
  }

  // 2. Download PowerPoint (.pptx)
  console.log("Initiating PowerPoint (.pptx) download...");
  const moreVert = page.locator('button:has(mat-icon:has-text("more_vert"))').last();
  await moreVert.waitFor({ state: "visible", timeout: 5000 });
  await moreVert.click();
  await page.waitForTimeout(1000);

  const pptxBtn = page.locator('[role="menuitem"]:has-text("PowerPoint"), button:has-text("PowerPoint")').first();
  await pptxBtn.waitFor({ state: "visible", timeout: 5000 });
  await pptxBtn.click();
  console.log("Clicked 'Download PowerPoint'. Waiting up to 90s for file...");

  let pptxFile = null;
  for (let i = 0; i < 90; i++) {
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
    if ((i + 1) % 10 === 0) {
      console.log(`[Waiting for PPTX... ${i + 1}s] files in dir:`, files);
    }
  }

  if (!pptxFile) throw new Error("PPTX download timed out");

  // 3. Download PDF (.pdf)
  console.log("Initiating PDF (.pdf) download...");
  await moreVert.click();
  await page.waitForTimeout(1000);

  const pdfBtn = page.locator('[role="menuitem"]:has-text("PDF"), button:has-text("PDF")').first();
  await pdfBtn.waitFor({ state: "visible", timeout: 5000 });
  await pdfBtn.click();
  console.log("Clicked 'Download PDF'. Waiting up to 90s for file...");

  let pdfFile = null;
  for (let i = 0; i < 90; i++) {
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
    if ((i + 1) % 10 === 0) {
      console.log(`[Waiting for PDF... ${i + 1}s] files in dir:`, files);
    }
  }

  if (!pdfFile) throw new Error("PDF download timed out");

  // 4. Close viewer to return to Studio root
  console.log("Closing slide deck viewer to return to Studio root...");
  if (await viewerClose.isVisible().catch(() => false)) {
    await viewerClose.click();
  } else {
    await page.keyboard.press("Escape");
  }
  await page.waitForTimeout(2000);

  await browser.close();

  // 5. Ingest into web app
  console.log(`Ingesting Lesson ${lesson.number} into web app...`);
  execSync(`node scripts/ingest_f172_lessons.mjs ${lesson.number}`, { stdio: "inherit" });

  console.log(`\n✓ SUCCESS! Lesson ${lesson.number} fully completed and ingested!`);
}

main().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
