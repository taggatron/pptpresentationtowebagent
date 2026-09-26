import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve('.');
const deckDir = path.join(projectRoot, 'public/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_analysis');
const slidesDir = path.join(deckDir, 'slides');
const examPdfDir = path.join(deckDir, 'assets/exam_pdf');

async function imageToBase64(filePath) {
  const data = await fs.readFile(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

async function run() {
  const page1B64 = await imageToBase64(path.join(examPdfDir, 'page-1.png'));
  const page2B64 = await imageToBase64(path.join(examPdfDir, 'page-2.png'));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Slide 23 Poster - Life Cycle Assessment Exam Checkpoint</title>
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
      background: radial-gradient(120% 120% at 50% 10%, #064e3b 0%, #022c22 100%);
      color: #f8fafc;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 32px 48px 24px 48px;
    }

    /* Ambient glow elements */
    .glow-cyan {
      position: absolute;
      top: -120px;
      left: 20%;
      width: 500px;
      height: 350px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%);
      filter: blur(60px);
      pointer-events: none;
    }

    .glow-emerald {
      position: absolute;
      bottom: -80px;
      right: 15%;
      width: 450px;
      height: 300px;
      background: radial-gradient(circle, rgba(52, 211, 153, 0.18) 0%, transparent 70%);
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
      max-width: 960px;
    }

    .pill-group {
      display: flex;
      gap: 10px;
      margin-bottom: 8px;
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
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(52, 211, 153, 0.4);
      color: #6ee7b7;
    }

    .badge-target {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #7dd3fc;
    }

    .badge-qer {
      background: rgba(245, 158, 11, 0.2);
      border: 1px solid rgba(251, 191, 36, 0.4);
      color: #fde68a;
    }

    h1.slide-title {
      font-size: 32px;
      font-weight: 800;
      line-height: 1.2;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin-bottom: 4px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    p.slide-subtitle {
      font-size: 15px;
      color: #a7f3d0;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
    }

    .marks-badge {
      background: #10b981;
      color: #022c22;
      font-size: 20px;
      font-weight: 800;
      padding: 6px 18px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
    }

    .time-indicator {
      font-size: 12px;
      color: #6ee7b7;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* Main Showcase Arena */
    .showcase-arena {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 28px;
      align-items: center;
      flex: 1;
      margin: 12px 0;
    }

    /* Left Card: Document Preview */
    .preview-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(20px);
      border-radius: 18px;
      padding: 16px;
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
      display: flex;
      gap: 16px;
      position: relative;
    }

    .page-thumb-wrap {
      flex: 1;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      position: relative;
      background: #ffffff;
      aspect-ratio: 1 / 1.414;
    }

    .page-thumb-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .thumb-label {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.2);
      color: #ffffff;
      font-size: 10.5px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }

    /* Right Card: Question Brief & Success Criteria */
    .criteria-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .prompt-box {
      background: rgba(6, 78, 59, 0.6);
      border: 1px solid rgba(52, 211, 153, 0.3);
      border-left: 4px solid #10b981;
      border-radius: 12px;
      padding: 14px 16px;
    }

    .prompt-box-title {
      font-size: 12px;
      font-weight: 800;
      color: #6ee7b7;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .prompt-box-text {
      font-size: 14px;
      line-height: 1.45;
      color: #f1f5f9;
      font-weight: 600;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
    }

    .feature-icon {
      width: 26px;
      height: 26px;
      border-radius: 7px;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      flex-shrink: 0;
    }

    .interactive-launch-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: #10b981;
      color: #022c22;
      font-size: 13.5px;
      font-weight: 800;
      padding: 10px 20px;
      border-radius: 10px;
      margin-top: 4px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35);
      letter-spacing: -0.01em;
    }

    /* Footer */
    .footer {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 10px;
      font-size: 12px;
      color: #6ee7b7;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="glow-cyan"></div>
  <div class="glow-emerald"></div>

  <header class="header">
    <div class="header-left">
      <div class="pill-group">
        <span class="badge badge-ocr">OCR GCSE Science</span>
        <span class="badge badge-target">Higher Tier (HT)</span>
        <span class="badge badge-qer">6-Mark QER Checkpoint</span>
      </div>
      <h1 class="slide-title">Life Cycle Assessment (LCA): Smartphone</h1>
      <p class="slide-subtitle">Evaluate the environmental impact from cradle to grave: Raw Materials, Manufacturing, Use, Disposal</p>
    </div>

    <div class="header-right">
      <div class="marks-badge">6 Marks</div>
      <div class="time-indicator">⏱ Suggested: 8–10 mins</div>
    </div>
  </header>

  <main class="showcase-arena">
    <div class="preview-card">
      <div class="page-thumb-wrap">
        <img src="${page1B64}" alt="Exam Question Paper Page 1" />
        <span class="thumb-label">📄 Question Paper</span>
      </div>
      <div class="page-thumb-wrap">
        <img src="${page2B64}" alt="Official Mark Scheme Page 2" />
        <span class="thumb-label">✅ Official Mark Scheme</span>
      </div>
    </div>

    <div class="criteria-card">
      <div class="prompt-box">
        <div class="prompt-box-title">Examination Challenge</div>
        <div class="prompt-box-text">
          Describe the four stages that are assessed in a life cycle assessment. Give at least one matching example from the smartphone list for each stage.
        </div>
      </div>

      <div class="features-list">
        <div class="feature-item">
          <div class="feature-icon">1</div>
          <span><strong>Stage 1:</strong> Raw Materials (oil extraction, copper ore)</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">2</div>
          <span><strong>Stage 2:</strong> Manufacturing (making plastics, assembly, packaging)</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">3</div>
          <span><strong>Stage 3:</strong> Use &amp; Operation (watching videos, charging)</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">4</div>
          <span><strong>Stage 4:</strong> Disposal &amp; End of Life (dismantling, recycling copper)</span>
        </div>
      </div>

      <div class="interactive-launch-pill">
        <span>✦ Interactive Split-Screen PDF Viewer &amp; Mark Scheme Active</span>
      </div>
    </div>
  </main>

  <footer class="footer">
    <span>OCR Gateway Science B (J257 / J247) · Topic C6.2 / B6.3 Sustainable Resources</span>
    <span>Use Key 1 (Questions), Key 2 (Split 50:50), Key 3 (Mark Scheme), Key A (Reveal Answers)</span>
  </footer>
</body>
</html>`;

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await page.setContent(html, { waitUntil: 'networkidle' });

  const posterPath = path.join(slidesDir, 'slide_23_exam_checkpoint.png');
  const slide23Path = path.join(slidesDir, 'slide_23.png');

  await page.screenshot({ path: posterPath });
  await page.screenshot({ path: slide23Path });

  console.log('Saved slide 23 poster to:', posterPath);
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
