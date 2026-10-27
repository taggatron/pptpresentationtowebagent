import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const DOWNLOAD_DIR = path.resolve("./output/powerpoints_andragogical_inclusion/new_downloads");
const FINAL_DIR = path.resolve("./output/powerpoints_andragogical_inclusion");

async function main() {
  await fs.mkdir(DOWNLOAD_DIR, { recursive: true });
  console.log("Connecting to Edge on port 9334...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("5927de21-65f8-4f39-9744-2bfd02ceb489"));
  if (!page) throw new Error("Notebook tab not found");

  await page.bringToFront();

  const client = await ctx.newCDPSession(page);
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: DOWNLOAD_DIR,
  });

  // Open the More menu if not open
  const menu = page.locator(".mat-mdc-menu-panel, [role=\"menu\"]");
  if (!await menu.isVisible().catch(() => false)) {
    const moreBtn = page.locator(".studio-panel button:has-text(\"more_vert\"), .studio-panel [aria-label*=\"More options\"], .studio-panel [mattooltip=\"More options\"]").first();
    console.log("Clicking More options button...");
    await moreBtn.click();
    await page.waitForTimeout(1000);
  }

  // Click "Download PowerPoint (.pptx)"
  console.log("Clicking 'Download PowerPoint (.pptx)'...");
  const pptxBtn = page.locator("[role=\"menuitem\"]:has-text(\"Download PowerPoint\"), button:has-text(\"PowerPoint\")").first();
  await pptxBtn.click();
  console.log("Clicked PowerPoint download! Waiting for file...");

  // Wait for pptx file to download
  let downloadedPptx = null;
  for (let i = 0; i < 45; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const files = await fs.readdir(DOWNLOAD_DIR).catch(() => []);
    const f = files.find(name => name.endsWith(".pptx") && !name.endsWith(".crdownload"));
    if (f) {
      const fullPath = path.join(DOWNLOAD_DIR, f);
      const stat = await fs.stat(fullPath);
      if (stat.size > 20000) {
        downloadedPptx = fullPath;
        console.log(`Successfully downloaded: ${f} (${stat.size} bytes)`);
        break;
      }
    }
  }

  if (!downloadedPptx) {
    throw new Error("Timed out waiting for PPTX download.");
  }

  // Also download PDF
  console.log("Opening menu again for PDF...");
  const moreBtn2 = page.locator(".studio-panel button:has-text(\"more_vert\"), .studio-panel [aria-label*=\"More options\"]").first();
  await moreBtn2.click();
  await page.waitForTimeout(1000);

  const pdfBtn = page.locator("[role=\"menuitem\"]:has-text(\"Download PDF\"), button:has-text(\"Download PDF\")").first();
  console.log("Clicking 'Download PDF document (.pdf)'...");
  await pdfBtn.click();

  let downloadedPdf = null;
  for (let i = 0; i < 45; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const files = await fs.readdir(DOWNLOAD_DIR).catch(() => []);
    const f = files.find(name => name.endsWith(".pdf") && !name.endsWith(".crdownload"));
    if (f) {
      const fullPath = path.join(DOWNLOAD_DIR, f);
      const stat = await fs.stat(fullPath);
      if (stat.size > 20000) {
        downloadedPdf = fullPath;
        console.log(`Successfully downloaded: ${f} (${stat.size} bytes)`);
        break;
      }
    }
  }

  // Copy files to target locations
  const targetPptx = path.join(FINAL_DIR, "Andragogical_Inclusion_Light_Bright_Notebook.pptx");
  await fs.copyFile(downloadedPptx, targetPptx);
  console.log("Saved Notebook PPTX to:", targetPptx);

  if (downloadedPdf) {
    const targetPdf = path.join(FINAL_DIR, "Andragogical_Inclusion_Light_Bright_Notebook.pdf");
    await fs.copyFile(downloadedPdf, targetPdf);
    console.log("Saved Notebook PDF to:", targetPdf);
  }

  await browser.close();
  process.exit(0);
}

main().catch(err => {
  console.error("Download error:", err);
  process.exit(1);
});
