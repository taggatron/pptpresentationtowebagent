import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve('.');
const deckDir = path.join(projectRoot, 'public/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere');
const examPdfDir = path.join(deckDir, 'assets/exam_pdf');
const slidesDir = path.join(deckDir, 'slides');

async function imageToBase64(filePath) {
  const data = await fs.readFile(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

async function run() {
  const page1B64 = await imageToBase64(path.join(examPdfDir, 'page-1.png'));
  const page2B64 = await imageToBase64(path.join(examPdfDir, 'page-2.png'));
  const page3B64 = await imageToBase64(path.join(examPdfDir, 'page-3.png'));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Slide 09 Poster</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1376px;
      height: 768px;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: radial-gradient(120% 120% at 50% 10%, #0f172a 0%, #020617 100%);
      color: #f8fafc;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 38px 48px 34px 48px;
    }

    /* Ambient glow elements */
    .glow-cyan {
      position: absolute;
      top: -120px;
      left: 20%;
      width: 500px;
      height: 350px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
      filter: blur(60px);
      pointer-events: none;
    }

    .glow-emerald {
      position: absolute;
      bottom: -80px;
      right: 15%;
      width: 450px;
      height: 300px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, transparent 70%);
      filter: blur(50px);
      pointer-events: none;
    }

    /* Header Section */
    .header {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-left {
      max-width: 900px;
    }

    .pill-group {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    .badge {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .badge-ocr {
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38bdf8;
    }

    .badge-marks {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(251, 191, 36, 0.35);
      color: #fbbf24;
    }

    .badge-interactive {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(52, 211, 153, 0.35);
      color: #34d399;
    }

    .title {
      font-size: 32px;
      font-weight: 800;
      line-height: 1.18;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
    }

    .subtitle {
      font-size: 14.5px;
      font-weight: 500;
      color: #94a3b8;
      line-height: 1.4;
    }

    /* Cards Preview Area */
    .cards-row {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: center;
      gap: 32px;
      margin: 18px 0;
    }

    .preview-card {
      width: 255px;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease;
    }

    .card-top {
      padding: 8px 12px;
      background: rgba(30, 41, 59, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      font-size: 11px;
      font-weight: 700;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .card-tag {
      font-size: 9.5px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(56, 189, 248, 0.15);
      color: #7dd3fc;
    }

    .card-img-wrap {
      width: 100%;
      height: 350px;
      overflow: hidden;
      background: #ffffff;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .card-img-wrap img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* Bottom Dock Bar */
    .bottom-dock {
      position: relative;
      z-index: 2;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 14px;
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
    }

    .dock-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .icon-bubble {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
    }

    .dock-text-title {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2px;
    }

    .dock-text-sub {
      font-size: 12px;
      color: #94a3b8;
    }

    .dock-pills {
      display: flex;
      gap: 10px;
    }

    .dock-pill {
      font-size: 11.5px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 8px;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dock-pill.active {
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.4);
      color: #6ee7b7;
    }
  </style>
</head>
<body>
  <div class="glow-cyan"></div>
  <div class="glow-emerald"></div>

  <!-- Header -->
  <header class="header">
    <div class="header-left">
      <div class="pill-group">
        <span class="badge badge-ocr">OCR GCSE Combined Science</span>
        <span class="badge badge-marks">13 Marks Total</span>
        <span class="badge badge-interactive">Interactive PDF Viewer</span>
      </div>
      <h1 class="title">The Earth's Atmosphere: Exam Practice & Mark Scheme</h1>
      <p class="subtitle">Complete question paper covering early vs. modern atmosphere data, calculation of percentage decrease, photosynthesis oxygenation, and carbon sinks.</p>
    </div>
  </header>

  <!-- Cards Row -->
  <main class="cards-row">
    <!-- Card 1: Page 1 -->
    <div class="preview-card">
      <div class="card-top">
        <span class="card-title">📄 Page 1 • Questions (a)–(c)</span>
        <span class="card-tag">7 Marks</span>
      </div>
      <div class="card-img-wrap">
        <img src="${page1B64}" alt="Page 1 Preview" />
      </div>
    </div>

    <!-- Card 2: Page 2 -->
    <div class="preview-card">
      <div class="card-top">
        <span class="card-title">📄 Page 2 • Questions (d)–(e)</span>
        <span class="card-tag">6 Marks</span>
      </div>
      <div class="card-img-wrap">
        <img src="${page2B64}" alt="Page 2 Preview" />
      </div>
    </div>

    <!-- Card 3: Page 3 (Mark Scheme) -->
    <div class="preview-card">
      <div class="card-top">
        <span class="card-title">✅ Page 3 • Official Mark Scheme</span>
        <span class="card-tag" style="background:rgba(16, 185, 129, 0.2); color:#6ee7b7;">Guidance</span>
      </div>
      <div class="card-img-wrap">
        <img src="${page3B64}" alt="Page 3 Preview" />
      </div>
    </div>
  </main>

  <!-- Bottom Interactive Dock -->
  <footer class="bottom-dock">
    <div class="dock-left">
      <div class="icon-bubble">⚡</div>
      <div>
        <div class="dock-text-title">Interactive Split-Screen Viewer Active</div>
        <div class="dock-text-sub">Seamlessly examine the student questions and teacher mark scheme simultaneously side-by-side</div>
      </div>
    </div>
    <div class="dock-pills">
      <div class="dock-pill active">
        <span>🔀</span>
        <span>50:50 Split View</span>
      </div>
      <div class="dock-pill">
        <span>💡</span>
        <span>Model Answer Overlays</span>
      </div>
      <div class="dock-pill">
        <span>🔍</span>
        <span>Smooth Zoom</span>
      </div>
      <div class="dock-pill">
        <span>📥</span>
        <span>Printable A4 PDF</span>
      </div>
    </div>
  </footer>
</body>
</html>`;

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1376, height: 768 },
    deviceScaleFactor: 2
  });

  await page.setContent(html, { waitUntil: 'networkidle' });
  const outputPath = path.join(slidesDir, 'slide_09_exam_checkpoint.png');
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();
  console.log(`Generated Slide 9 poster at ${outputPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
