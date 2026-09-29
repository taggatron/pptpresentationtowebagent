import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const DECK_DIR = path.resolve("public/decks/genetics_aaq/Lesson_01_Unit_intro_and_Phenotypic_variation");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const RAW_IMAGE_PATH = path.join(SLIDES_DIR, "marching_band_raw.jpg");

export function getLivingHistogramSlideHtml(imageSrc) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1376px;
    height: 768px;
    background: #f8fafc;
    background-image: 
      linear-gradient(to right, rgba(14, 165, 233, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(14, 165, 233, 0.08) 1px, transparent 1px);
    background-size: 32px 32px;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    color: #0f172a;
    position: relative;
    overflow: hidden;
  }
  
  .slide-header {
    position: absolute;
    top: 28px;
    left: 48px;
    z-index: 10;
  }
  .badge-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-radius: 9999px;
    border: 1px solid #bae6fd;
    margin-bottom: 6px;
  }
  .slide-title {
    font-size: 38px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.025em;
    line-height: 1.15;
  }
  .slide-subtitle {
    font-size: 17px;
    color: #475569;
    font-weight: 500;
    margin-top: 4px;
  }

  .main-content {
    position: absolute;
    top: 132px;
    left: 48px;
    right: 48px;
    bottom: 36px;
    display: grid;
    grid-template-columns: 800px 456px;
    gap: 24px;
    align-items: stretch;
  }

  /* Photo Container */
  .photo-card {
    position: relative;
    background: #0f172a;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(15, 23, 42, 0.08);
    border: 2px solid #cbd5e1;
    display: flex;
    flex-direction: column;
  }
  .photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Overlay Graphics on the Photo */
  .photo-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
  }

  .overlay-top-badge {
    align-self: flex-start;
    background: rgba(15, 23, 42, 0.78);
    backdrop-filter: blur(8px);
    color: #f8fafc;
    padding: 6px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .overlay-top-badge .dot {
    width: 8px;
    height: 8px;
    background: #38bdf8;
    border-radius: 50%;
    box-shadow: 0 0 8px #38bdf8;
  }

  /* SVG Bell Curve Overlay */
  .bell-curve-svg {
    position: absolute;
    top: 25%;
    left: 6%;
    width: 88%;
    height: 60%;
    pointer-events: none;
  }

  /* Axis Bars at bottom of photo */
  .axis-overlay {
    background: rgba(15, 23, 42, 0.88);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 10px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: #ffffff;
  }
  .axis-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #94a3b8;
    text-transform: uppercase;
  }
  .axis-scale-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 14px;
    font-weight: 600;
  }
  .axis-scale-row .mean-label {
    color: #38bdf8;
    font-size: 15px;
    font-weight: 800;
    background: rgba(56, 189, 248, 0.18);
    padding: 2px 10px;
    border-radius: 6px;
    border: 1px solid rgba(56, 189, 248, 0.4);
  }
  .axis-scale-row .extreme-label {
    color: #cbd5e1;
    font-size: 13px;
  }

  /* Side Cards */
  .side-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: space-between;
  }

  .info-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 20px 22px;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04);
    border: 1.5px solid #cbd5e1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .card-pill-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .card-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .pill-blue { background: #dbeafe; color: #1e40af; border: 1.5px solid #bfdbfe; }
  .pill-emerald { background: #d1fae5; color: #065f46; border: 1.5px solid #a7f3d0; }
  .pill-purple { background: #ede9fe; color: #5b21b6; border: 1.5px solid #ddd6fe; }

  .card-title {
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.015em;
  }

  .card-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .card-list li {
    font-size: 15px;
    line-height: 1.45;
    color: #334155;
    position: relative;
    padding-left: 20px;
  }
  .card-list li::before {
    content: "•";
    position: absolute;
    left: 2px;
    font-weight: 900;
    font-size: 18px;
    line-height: 1.2;
    color: #0284c7;
  }
  .card-list strong {
    color: #0f172a;
    font-weight: 700;
  }

  /* Key Equation Callout Banner */
  .equation-callout {
    background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
    border: 1.5px solid #93c5fd;
    border-radius: 14px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .eq-text {
    font-size: 14px;
    color: #1e3a8a;
    font-weight: 600;
  }
  .eq-formula {
    font-size: 18px;
    font-weight: 800;
    color: #1d4ed8;
    background: #ffffff;
    padding: 4px 12px;
    border-radius: 8px;
    border: 1px solid #bfdbfe;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.06);
  }

  /* Watermark */
  .watermark {
    position: absolute;
    bottom: 14px;
    right: 32px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="slide-header">
    <div class="badge-tag">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      Real-World Biometric Exemplar
    </div>
    <h1 class="slide-title">The Living Histogram: Continuous Variation</h1>
    <div class="slide-subtitle">Marching band performers arranged by height along football field yard lines</div>
  </div>

  <div class="main-content">
    <!-- Left: Photo with Axis & Bell Curve Overlay -->
    <div class="photo-card">
      <img src="${imageSrc}" class="photo-img" alt="Marching band arranged into a living histogram on an American football field">
      
      <!-- SVG Fitted Bell Curve -->
      <svg class="bell-curve-svg" viewBox="0 0 800 360" fill="none">
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.40"/>
            <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <!-- Bell curve fill -->
        <path d="M 65 320 C 145 320, 220 310, 290 220 C 350 135, 372 26, 400 26 C 428 26, 450 135, 510 220 C 580 310, 655 320, 735 320 Z" fill="url(#curveGrad)" />
        <!-- Bell curve stroke -->
        <path d="M 65 320 C 145 320, 220 310, 290 220 C 350 135, 372 26, 400 26 C 428 26, 450 135, 510 220 C 580 310, 655 320, 735 320" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round" filter="url(#glow)"/>
        <!-- Apex indicator dot -->
        <circle cx="400" cy="26" r="5.5" fill="#38bdf8" stroke="#ffffff" stroke-width="2.5"/>
      </svg>

      <!-- HTML Floating Apex Pill for perfect sharpness -->
      <div style="position: absolute; top: calc(25% - 14px); left: 50%; transform: translateX(-50%); z-index: 5; pointer-events: none;">
        <div style="background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(8px); border: 1.5px solid #38bdf8; border-radius: 9999px; padding: 3px 12px; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
          <span style="width: 7px; height: 7px; background: #38bdf8; border-radius: 50%; box-shadow: 0 0 6px #38bdf8;"></span>
          <span style="color: #ffffff; font-size: 11.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">Modal Class &bull; Population Mean (&mu;)</span>
        </div>
      </div>

      <div class="photo-overlay">
        <div class="overlay-top-badge">
          <div class="dot"></div>
          Physical Demonstration: Columns = Class Intervals (Bins)
        </div>

        <div class="axis-overlay">
          <div class="axis-title-row">
            <span>◀ Shortest Stature</span>
            <span>Continuous Phenotypic Spectrum</span>
            <span>Tallest Stature ▶</span>
          </div>
          <div class="axis-scale-row">
            <span class="extreme-label">10-yd line (~150 cm)</span>
            <span class="mean-label">50-yd line: Mean Height &mu; (~175 cm)</span>
            <span class="extreme-label">10-yd line (~200 cm)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Theoretical & Syllabus Insights -->
    <div class="side-column">
      <!-- Card 1 -->
      <div class="info-card">
        <div class="card-pill-header">
          <span class="card-pill pill-blue">Field Architecture</span>
          <h2 class="card-title">The "Living" Histogram</h2>
        </div>
        <ul class="card-list">
          <li><strong>Contiguous Bins</strong>: Each yard line forms a continuous class interval with <strong>no spaces</strong> between lines.</li>
          <li><strong>Column Length = Frequency</strong>: The number of marchers standing along a yard line reflects the exact count of individuals in that height bracket.</li>
          <li><strong>Central Clustering</strong>: Highest frequency clusters at the 50-yard line (population mean &mu;).</li>
        </ul>
      </div>

      <!-- Card 2 -->
      <div class="info-card">
        <div class="card-pill-header">
          <span class="card-pill pill-emerald">Quantitative Genetics</span>
          <h2 class="card-title">Why a Bell-Shaped Curve?</h2>
        </div>
        <ul class="card-list">
          <li><strong>Polygenic Inheritance (V<sub>g</sub>)</strong>: Over 700 independent loci exert tiny additive effects, producing a smooth distribution of genotypes.</li>
          <li><strong>Environmental Modulation (V<sub>e</sub>)</strong>: Childhood nutrition, sleep, and health blur discrete allele steps into a seamless Gaussian curve.</li>
        </ul>

        <div class="equation-callout">
          <div class="eq-text">The Phenotypic Equation:</div>
          <div class="eq-formula">V<sub>p</sub> = V<sub>g</sub> + V<sub>e</sub></div>
        </div>
      </div>
    </div>
  </div>

  <div class="watermark">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    Gemini Notebook
  </div>
</body>
</html>`;
}

async function testRender() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const imgBuf = await fs.readFile(RAW_IMAGE_PATH);
  const base64Img = `data:image/jpeg;base64,${imgBuf.toString("base64")}`;

  const html = getLivingHistogramSlideHtml(base64Img);
  await page.setContent(html, { waitUntil: "load" });
  await page.waitForTimeout(500);

  const outPath = path.resolve("scratch/test_slide_living_histogram.png");
  await page.screenshot({ path: outPath });
  console.log(`Rendered preview to ${outPath}`);

  await browser.close();
}

testRender().catch(console.error);
