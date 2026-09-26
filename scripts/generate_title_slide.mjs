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

  // Also include small thumbnails of the other stages for the 4-stage strip:
  const frame04Base64 = fs.readFileSync(path.join(projectRoot, 'scratch/video_frames/frame_04.png')).toString('base64');
  const frame06Base64 = fs.readFileSync(path.join(projectRoot, 'scratch/video_frames/frame_06.png')).toString('base64');
  const frame08Base64 = fs.readFileSync(path.join(projectRoot, 'scratch/video_frames/frame_08.png')).toString('base64');

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
      padding: 60px 80px;
    }

    /* Dramatic cinematic scrim overlay to guarantee text legibility while showing the beautiful turquoise ponds */
    .scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(8, 14, 26, 0.90) 0%,
        rgba(9, 23, 40, 0.78) 45%,
        rgba(10, 38, 55, 0.45) 75%,
        rgba(5, 18, 30, 0.85) 100%
      );
      pointer-events: none;
    }

    /* Subtle grid overlay */
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
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
      gap: 14px;
    }
    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(56, 189, 248, 0.4);
      backdrop-filter: blur(12px);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #38bdf8;
    }
    .pill-badge.secondary {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #e2e8f0;
    }
    .curriculum-tag {
      font-size: 14px;
      font-weight: 600;
      color: rgba(226, 232, 240, 0.8);
      letter-spacing: 0.05em;
    }

    /* Hero Section */
    .hero-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      margin-bottom: auto;
      gap: 60px;
    }

    .hero-text {
      max-width: 960px;
    }

    .topic-eyebrow {
      display: inline-block;
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #06b6d4;
      margin-bottom: 16px;
      text-shadow: 0 2px 10px rgba(6, 182, 212, 0.4);
    }

    h1.hero-title {
      font-family: 'Outfit', sans-serif;
      font-size: 78px;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin-bottom: 22px;
      text-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
    }

    h1.hero-title span.highlight {
      background: linear-gradient(135deg, #38bdf8 0%, #2dd4bf 50%, #a7f3d0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 12px rgba(45, 212, 191, 0.4));
    }

    .hero-subtitle {
      font-size: 24px;
      line-height: 1.45;
      font-weight: 400;
      color: #cbd5e1;
      max-width: 820px;
      margin-bottom: 30px;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
    }

    .big-enquiry-box {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      padding: 14px 24px;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(45, 212, 191, 0.35);
      border-radius: 14px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
    }
    .enquiry-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      color: #fff;
      font-size: 20px;
      font-weight: 800;
    }
    .enquiry-text {
      font-size: 17px;
      font-weight: 600;
      color: #f1f5f9;
    }
    .enquiry-text span {
      color: #38bdf8;
    }

    /* Right side: Interactive Play Callout Card */
    .play-card-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .play-cta-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 44px 48px;
      background: rgba(13, 22, 40, 0.82);
      border: 2px solid rgba(56, 189, 248, 0.5);
      border-radius: 28px;
      backdrop-filter: blur(20px);
      box-shadow: 
        0 20px 50px rgba(0, 0, 0, 0.5),
        0 0 40px rgba(56, 189, 248, 0.25);
      transition: all 0.3s ease;
      max-width: 440px;
    }

    .play-pulse-ring {
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(56, 189, 248, 0.2);
      top: 36px;
      pointer-events: none;
      filter: blur(8px);
    }

    .play-button-icon {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: linear-gradient(135deg, #38bdf8 0%, #0284c7 60%, #0369a1 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 
        0 10px 25px rgba(2, 132, 199, 0.5),
        inset 0 2px 4px rgba(255, 255, 255, 0.5);
      margin-bottom: 24px;
      position: relative;
      z-index: 2;
    }

    .play-button-icon svg {
      width: 42px;
      height: 42px;
      fill: #ffffff;
      transform: translateX(3px);
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    .play-cta-title {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
    }

    .play-cta-desc {
      font-size: 15px;
      line-height: 1.5;
      color: #94a3b8;
      margin-bottom: 20px;
    }

    .play-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      font-size: 13px;
      font-weight: 600;
      color: #7dd3fc;
    }

    /* Bottom: 4 Stages Timeline Strip */
    .stages-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      background: rgba(11, 19, 35, 0.75);
      padding: 18px 24px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .stage-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 14px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .stage-num {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: rgba(56, 189, 248, 0.2);
      border: 1px solid rgba(56, 189, 248, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: #38bdf8;
      flex-shrink: 0;
    }
    .stage-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .stage-title {
      font-size: 14px;
      font-weight: 700;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .stage-desc {
      font-size: 12px;
      color: #94a3b8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            GCSE Chemistry
          </div>
          <div class="pill-badge secondary">
            AQA Specification 4.10.1.2
          </div>
        </div>
        <div class="curriculum-tag">
          Unit 10 · Using Resources · Quantitative Environmental Science
        </div>
      </div>

      <!-- Hero Main -->
      <div class="hero-main">
        <div class="hero-text">
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

        <!-- Right Side: Play Card CTA -->
        <div class="play-card-container">
          <div class="play-cta-card">
            <div class="play-pulse-ring"></div>
            <div class="play-button-icon">
              <svg viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <div class="play-cta-title">Click to Play Video</div>
            <div class="play-cta-desc">
              Watch the 10-second smartphone case study illustrating extraction, manufacturing, use, and e-waste disposal.
            </div>
            <div class="play-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              10s HD Overview · Click to Start
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom 4 Stages Strip -->
      <div class="stages-strip">
        <div class="stage-item">
          <div class="stage-num">1</div>
          <div class="stage-info">
            <div class="stage-title">Raw Materials</div>
            <div class="stage-desc">Quarrying, mining & lithium extraction</div>
          </div>
        </div>
        <div class="stage-item">
          <div class="stage-num">2</div>
          <div class="stage-info">
            <div class="stage-title">Manufacturing</div>
            <div class="stage-desc">Refining, circuit synthesis & packaging</div>
          </div>
        </div>
        <div class="stage-item">
          <div class="stage-num">3</div>
          <div class="stage-info">
            <div class="stage-title">Product Use</div>
            <div class="stage-desc">Lifespan, recharge cycles & cleaning</div>
          </div>
        </div>
        <div class="stage-item">
          <div class="stage-num">4</div>
          <div class="stage-info">
            <div class="stage-title">Disposal / E-Waste</div>
            <div class="stage-desc">Recycling, incineration & landfill cost</div>
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
  // Wait for Google fonts
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const destPath1 = path.join(projectRoot, 'public/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_analysis/slides/slide_01.png');
  const destPath2 = path.join(projectRoot, 'public/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_Assessments/slides/slide_01.png');

  await page.screenshot({ path: destPath1, type: 'png' });
  fs.copyFileSync(destPath1, destPath2);

  console.log(`Generated slide image at:\n${destPath1}\n${destPath2}`);
  await browser.close();
}

generateSlide().catch(err => {
  console.error(err);
  process.exit(1);
});
