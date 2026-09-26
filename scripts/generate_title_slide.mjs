import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function generateSlide() {
  const bgImagePath = path.join(projectRoot, 'scratch/video_frames/frame_01.png');
  const bgBase64 = fs.readFileSync(bgImagePath).toString('base64');
  const bgDataUri = `data:image/png;base64,${bgBase64}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Product Lifecycle Analysis</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body, html {
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      background: #090d16;
      color: #fff;
    }
    .slide-container {
      position: relative;
      width: 1920px;
      height: 1080px;
      background: url('${bgDataUri}') center center / cover no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 55px 90px;
    }

    /* Dramatic cinematic scrim overlay: preserves rich landscape view while ensuring AAA text contrast */
    .scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(8, 14, 26, 0.90) 0%,
        rgba(9, 23, 40, 0.76) 42%,
        rgba(10, 38, 55, 0.38) 78%,
        rgba(5, 18, 30, 0.68) 100%
      );
      pointer-events: none;
    }

    /* Subtle grid lines */
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
      background-size: 80px 80px;
      pointer-events: none;
    }

    .content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    /* Top Bar */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badge-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 22px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(56, 189, 248, 0.45);
      backdrop-filter: blur(12px);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #38bdf8;
    }
    .pill-badge.secondary {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.25);
      color: #f1f5f9;
    }
    .curriculum-tag {
      font-size: 16px;
      font-weight: 600;
      color: rgba(226, 232, 240, 0.85);
      letter-spacing: 0.05em;
    }

    /* Hero Main Section - Dominates and fills the slide space */
    .hero-main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      max-width: 1740px;
      margin-top: auto;
      margin-bottom: auto;
      padding: 15px 0;
    }

    .topic-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: #06b6d4;
      margin-bottom: 24px;
      text-shadow: 0 2px 16px rgba(6, 182, 212, 0.5);
    }

    .topic-eyebrow::before {
      content: '';
      display: inline-block;
      width: 44px;
      height: 4px;
      background: #06b6d4;
      border-radius: 2px;
    }

    h1.hero-title {
      font-family: 'Outfit', sans-serif;
      font-size: 154px;
      font-weight: 900;
      line-height: 1.02;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-bottom: 28px;
      text-shadow: 0 6px 44px rgba(0, 0, 0, 0.9);
    }

    h1.hero-title span.highlight {
      background: linear-gradient(135deg, #38bdf8 0%, #2dd4bf 50%, #a7f3d0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 4px 30px rgba(45, 212, 191, 0.65));
    }

    .hero-subtitle {
      font-size: 38px;
      line-height: 1.46;
      font-weight: 400;
      color: #e2e8f0;
      max-width: 1700px;
      margin-bottom: 44px;
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);
    }

    .big-enquiry-box {
      display: flex;
      align-items: center;
      gap: 32px;
      padding: 28px 44px;
      background: rgba(13, 22, 38, 0.88);
      border: 2px solid rgba(45, 212, 191, 0.55);
      border-radius: 26px;
      backdrop-filter: blur(20px);
      box-shadow: 0 18px 52px rgba(0, 0, 0, 0.5), 0 0 40px rgba(45, 212, 191, 0.18);
      width: 100%;
      max-width: 1720px;
    }
    .enquiry-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 82px;
      height: 82px;
      border-radius: 22px;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      color: #fff;
      font-size: 46px;
      font-weight: 800;
      flex-shrink: 0;
      box-shadow: 0 4px 24px rgba(14, 165, 233, 0.45);
    }
    .enquiry-text {
      font-size: 34px;
      font-weight: 600;
      color: #f8fafc;
      line-height: 1.4;
      letter-spacing: -0.015em;
    }
    .enquiry-text span {
      color: #38bdf8;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="scrim"></div>
    <div class="grid-lines"></div>

    <div class="content">
      <!-- Top Bar -->
      <div class="top-bar">
        <div class="badge-group">
          <div class="pill-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            GCSE Chemistry
          </div>
          <div class="pill-badge secondary">
            OCR Specification
          </div>
        </div>
        <div class="curriculum-tag">
          OCR Gateway Science · Quantitative Environmental Science & Sustainability
        </div>
      </div>

      <!-- Hero Main -->
      <div class="hero-main">
        <div class="topic-eyebrow">Life Cycle Assessments (LCAs)</div>
        <h1 class="hero-title">Product Lifecycle <span class="highlight">Analysis</span></h1>
        <p class="hero-subtitle">
          Uncovering the true cradle-to-grave environmental footprint: evaluating energy, raw material depletion, and ecological impact across every stage of consumer goods.
        </p>
        <div class="big-enquiry-box">
          <div class="enquiry-icon">?</div>
          <div class="enquiry-text">
            Key Enquiry: <span>How do we quantify environmental cost from raw extraction to disposal?</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1.5 // Produces crisp 2880x1620 resolution
  });

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const destPath1 = path.join(projectRoot, 'public/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_analysis/slides/slide_01.png');
  const destPath2 = path.join(projectRoot, 'public/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_Assessments/slides/slide_01.png');

  await page.screenshot({ path: destPath1, type: 'png' });
  fs.copyFileSync(destPath1, destPath2);

  console.log(`Generated clean slide image at:\n${destPath1}\n${destPath2}`);
  await browser.close();
}

generateSlide().catch(err => {
  console.error(err);
  process.exit(1);
});
