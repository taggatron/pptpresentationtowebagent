import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import os from "node:os";

const PUBLIC_SLIDE_PATH = path.resolve(
  "./public/decks/intro_aaq_human_bio/Lesson_01_Welcome_to_Human_Biology/slides/slide_02.png"
);
const PPTX_PATH = "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/NotebookLMagent/output/powerpoints_aaq_human_bio/Lesson_01_Welcome_to_Human_Biology.pptx";

async function main() {
  console.log("Generating refined slide_02.png...");
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1376px;
    height: 768px;
    background: #f0f4f8;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
    position: relative;
    user-select: none;
  }
  
  /* Top Banner */
  .header-banner {
    position: absolute;
    top: 22px;
    left: 28px;
    width: 1320px;
    height: 60px;
    background: #ffffff;
    border: 2.5px solid #05284e;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(5, 40, 78, 0.08);
  }
  .header-banner h1 {
    font-size: 27px;
    font-weight: 800;
    color: #05284e;
    letter-spacing: -0.01em;
  }

  /* Grid of Cards */
  .card {
    position: absolute;
    width: 399px;
    height: 276px;
    background: #ffffff;
    border: 2.5px solid #05284e;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(5, 40, 78, 0.09);
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
  }

  .card-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }
  .card-num {
    font-size: 44px;
    font-weight: 900;
    color: #05284e;
    line-height: 0.9;
    flex-shrink: 0;
  }
  .card-title {
    font-size: 21px;
    font-weight: 800;
    color: #05284e;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  .card-question {
    font-size: 15.5px;
    font-weight: 500;
    color: #1e293b;
    line-height: 1.45;
  }

  /* Watermark */
  .watermark {
    position: absolute;
    bottom: 12px;
    right: 28px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    color: #334155;
    opacity: 0.85;
  }
  .watermark svg {
    width: 14px;
    height: 14px;
  }
</style>
</head>
<body>

  <div class="header-banner">
    <h1>Starter Activity Grid: Retrieval &amp; Reflection for Biomedical Leaders</h1>
  </div>

  <!-- Row 0 -->
  <div class="card" style="left: 41px; top: 123px;">
    <div class="card-top">
      <span class="card-num">1.</span>
      <span class="card-title">Cellular<br>Architecture</span>
    </div>
    <p class="card-question">Human cells are eukaryotic. What is the definitive characteristic of a eukaryotic cell compared to a bacterial pathogen?</p>
  </div>

  <div class="card" style="left: 488px; top: 123px;">
    <div class="card-top">
      <span class="card-num">2.</span>
      <span class="card-title">System<br>Organisation</span>
    </div>
    <p class="card-question">From smallest to largest, map the hierarchy of human biological organisation starting with 'Cell' and ending with 'Organism'.</p>
  </div>

  <div class="card" style="left: 936px; top: 123px;">
    <div class="card-top">
      <span class="card-num">3.</span>
      <span class="card-title">Metabolic<br>Energy</span>
    </div>
    <p class="card-question">What is the primary function of the mitochondria in a human muscle cell, and what gas is required for this process?</p>
  </div>

  <!-- Row 1 -->
  <div class="card" style="left: 41px; top: 453px;">
    <div class="card-top">
      <span class="card-num">4.</span>
      <span class="card-title">Cellular<br>Transport</span>
    </div>
    <p class="card-question">Which form of cellular transport moves substances against the concentration gradient, and what does it require to function?</p>
  </div>

  <div class="card" style="left: 488px; top: 453px;">
    <div class="card-top">
      <span class="card-num">5.</span>
      <span class="card-title">Reproductive<br>Endocrinology</span>
    </div>
    <p class="card-question">Name two of the four primary hormones involved in regulating the female menstrual cycle.</p>
  </div>

  <div class="card" style="left: 936px; top: 453px;">
    <div class="card-top">
      <span class="card-num">6.</span>
      <span class="card-title">Clinical<br>Microbiology</span>
    </div>
    <p class="card-question">What is the key difference between how we medically treat a bacterial infection versus a viral infection?</p>
  </div>

  <div class="watermark">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
    <span>Gemini Notebook</span>
  </div>

</body>
</html>`;

  await page.setContent(html);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: PUBLIC_SLIDE_PATH });
  await browser.close();
  console.log("Saved refined slide_02.png to", PUBLIC_SLIDE_PATH);

  // Synchronize PPTX
  try {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pptx_sync_"));
    const mediaDir = path.join(tmpDir, "ppt", "media");
    await fs.mkdir(mediaDir, { recursive: true });
    await fs.copyFile(PUBLIC_SLIDE_PATH, path.join(mediaDir, "image2.png"));
    execSync(`zip -u "${PPTX_PATH}" ppt/media/image2.png`, { cwd: tmpDir, stdio: "pipe" });
    await fs.rm(tmpDir, { recursive: true, force: true });
    console.log("Synchronized ppt/media/image2.png inside", PPTX_PATH);
  } catch (err) {
    console.warn("PPTX sync skipped or warning:", err.message);
  }
}

main();
