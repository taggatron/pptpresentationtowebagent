import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const GEMINI_LOGO_BASE64 = (await fs.readFile("scratch/gemini_logo.png")).toString("base64");
const MEME_IMAGE_PATH = "/Users/danieltagg/.gemini/antigravity-ide/brain/87dc87b4-bcce-4f72-9ce8-f0cc8f3036a4/.user_uploaded/media_1791549669182.png";
const MEME_BASE64 = (await fs.readFile(MEME_IMAGE_PATH)).toString("base64");

async function renderSlide() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0] || await browser.newContext();
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1376, height: 768 });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 1376px;
      height: 768px;
      overflow: hidden;
      background-color: #f8f6f0;
      background-image:
        linear-gradient(to right, rgba(160, 150, 130, 0.16) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(160, 150, 130, 0.16) 1px, transparent 1px);
      background-size: 22.933px 22.933px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #111827;
      position: relative;
    }

    .outer-frame {
      position: absolute;
      top: 36px;
      left: 40px;
      right: 40px;
      bottom: 36px;
      border: 1.5px solid #232b38;
      border-radius: 12px;
      background: rgba(253, 252, 249, 0.72);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      padding: 30px 44px;
      overflow: hidden;
    }

    .watermark {
      position: absolute;
      bottom: 12px;
      right: 42px;
      height: 20px;
      opacity: 0.85;
      pointer-events: none;
      z-index: 100;
    }

    .slide-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 20px;
    }

    .slide-title {
      font-family: 'Outfit', 'Inter', sans-serif;
      font-size: 38px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
    }

    .slide-subtitle {
      font-size: 19px;
      color: #475569;
      margin-top: 6px;
      font-weight: 400;
    }

    .layout-row {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: 28px;
      align-items: stretch;
    }

    .meme-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }

    .meme-img {
      max-height: 480px;
      width: auto;
      max-width: 100%;
      border-radius: 10px;
      border: 1.5px solid #0f172a;
      object-fit: contain;
    }

    .content-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      justify-content: center;
    }

    .info-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
    }

    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
    }

    .pill-cyan {
      background: rgba(14, 165, 233, 0.12);
      border: 1px solid rgba(14, 165, 233, 0.4);
      color: #0369a1;
    }

    .pill-amber {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #b45309;
    }

    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .card-text {
      font-size: 15px;
      color: #475569;
      line-height: 1.45;
    }
  </style>
</head>
<body>
  <div class="outer-frame">
    <div class="slide-header">
      <h1 class="slide-title">"Draw Me Like One of Your Circuit Diagrams..."</h1>
      <p class="slide-subtitle">Why electrical engineers communicate using standardized circuit symbols</p>
    </div>

    <div class="layout-row">
      <!-- Meme Image Card -->
      <div class="meme-card">
        <img class="meme-img" src="data:image/png;base64,${MEME_BASE64}" alt="Bender drawing circuit schematic meme" />
      </div>

      <!-- Explanatory Content Panel -->
      <div class="content-panel">
        <div class="info-card">
          <div class="pill-badge pill-cyan">Standardization</div>
          <div class="card-title">Clarity & Speed Over Realism</div>
          <div class="card-text">
            Drawing realistic physical components takes time and obscures the actual electrical pathway. Standardized circuit symbols convey the exact function instantly with zero artistic ambiguity.
          </div>
        </div>

        <div class="info-card">
          <div class="pill-badge pill-cyan">Universal Language</div>
          <div class="card-title">Global Engineering Shorthand</div>
          <div class="card-text">
            Circuit diagrams are an international standard. Whether designing a classroom filament lamp circuit or a microchip with billions of transistors, every physicist and engineer reads the exact same symbols.
          </div>
        </div>

        <div class="info-card" style="background: #fefce8; border-color: #fef08a;">
          <div class="pill-badge pill-amber">Up Next</div>
          <div class="card-title" style="color: #92400e;">⚡ 60-Second Challenge: Symbol Snap</div>
          <div class="card-text" style="color: #78350f;">
            Can you match every standardized GCSE component symbol to its correct name in under a minute?
          </div>
        </div>
      </div>
    </div>
  </div>
  <img class="watermark" src="data:image/png;base64,${GEMINI_LOGO_BASE64}" alt="Gemini Notebook" />
</body>
</html>
`;

  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scratch/new_slide_bender_schematic.png" });
  await page.close();
  console.log("Saved scratch/new_slide_bender_schematic.png");
}

renderSlide().catch(err => {
  console.error("Rendering failed:", err);
  process.exit(1);
});
