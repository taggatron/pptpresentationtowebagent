import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const pdfSource = "/Users/danieltagg/.gemini/antigravity-ide/brain/e5ab2aa9-8066-4012-b3d0-daf783ffe472/.user_uploaded/media_1791565076217.pdf";
  const pdfDest = path.resolve("scratch/Introduction_to_Photography_Adult_Course.pdf");
  await fs.copyFile(pdfSource, pdfDest);
  console.log(`Copied PDF to ${pdfDest}`);

  console.log("Connecting to Chrome on CDP port 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));
  if (!page) throw new Error("Notebook page not found");

  // Check if Add sources dialog is open, if not open it
  const dialog = page.locator("mat-dialog-container, [role=\"dialog\"]");
  if ((await dialog.count()) === 0 || !(await dialog.first().isVisible())) {
    console.log("Opening Add sources dialog...");
    const addSourcesBtn = page.locator("button:has-text(\"Add sources\")").first();
    await addSourcesBtn.click();
    await page.waitForTimeout(1500);
  }

  console.log("Setting up filechooser listener...");
  const uploadBtn = page.locator("button:has-text(\"Upload files\")").first();
  
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser", { timeout: 10000 }),
    uploadBtn.click()
  ]);

  console.log("FileChooser intercepted! Uploading PDF...");
  await fileChooser.setFiles(pdfDest);
  console.log("PDF file sent to chooser. Waiting for upload processing...");

  await page.waitForTimeout(5000);
  await page.screenshot({ path: "scratch/after_pdf_upload.png" });
  console.log("Saved scratch/after_pdf_upload.png");

  await browser.close();
}

main().catch(err => {
  console.error("Error uploading PDF:", err);
  process.exit(1);
});
