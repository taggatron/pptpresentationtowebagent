import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";

const DECK_DIR = path.resolve("public/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function main() {
  console.log("=== Launching Chrome to render Lesson 02 New Slides ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  // ---------------------------------------------------------------------------
  // 1. SLIDE 3: Starter Practical Challenge: Microscope Setup & Focus on Premade Slide
  // ---------------------------------------------------------------------------
  console.log("\n[1/2] Rendering slide_02b_microscope_setup_premade_slide.png...");

  const slide3Html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap");
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: #f8fafc;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    position: relative;
  }

  /* Blueprint Grid Pattern */
  .grid-bg {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(2, 132, 199, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(2, 132, 199, 0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  /* Soft decorative corner gradient */
  .corner-glow {
    position: absolute;
    top: -120px;
    right: -120px;
    width: 460px;
    height: 460px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }

  .slide-container {
    width: 1376px;
    height: 768px;
    padding: 30px 48px 24px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  /* Header Section */
  .header {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .badge-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #e0f2fe;
    color: #0284c7;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 9999px;
    border: 1px solid #bae6fd;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .header-meta {
    font-size: 13.5px;
    font-weight: 600;
    color: #64748b;
  }
  .title {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 34px;
    font-weight: 800;
    color: #091e42;
    letter-spacing: -0.025em;
    line-height: 1.15;
  }
  .subtitle {
    font-size: 15px;
    color: #475569;
    font-weight: 500;
  }

  /* 4 Pillars Grid */
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    flex: 1;
    margin: 18px 0 16px 0;
  }

  .pillar-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .pillar-header {
    padding: 14px 16px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card-p1 .pillar-header { background: linear-gradient(135deg, #091e42 0%, #0369a1 100%); }
  .card-p2 .pillar-header { background: linear-gradient(135deg, #0f172a 0%, #0d9488 100%); }
  .card-p3 .pillar-header { background: linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%); }
  .card-p4 .pillar-header { background: linear-gradient(135deg, #1e293b 0%, #d97706 100%); }

  .pillar-title {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .step-num {
    background: rgba(255, 255, 255, 0.2);
    font-size: 11px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 0.04em;
    font-family: "JetBrains Mono", monospace;
  }

  .pillar-divider {
    height: 4px;
    width: 100%;
  }
  .card-p1 .pillar-divider { background: linear-gradient(90deg, #0284c7, #38bdf8); }
  .card-p2 .pillar-divider { background: linear-gradient(90deg, #14b8a6, #2dd4bf); }
  .card-p3 .pillar-divider { background: linear-gradient(90deg, #818cf8, #a5b4fc); }
  .card-p4 .pillar-divider { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

  .pillar-body {
    padding: 18px 16px 14px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 14px;
    background: #ffffff;
  }

  /* Concise Action Directives */
  .action-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .action-main {
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.35;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .action-detail {
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    line-height: 1.45;
  }
  .action-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 9px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    font-family: "JetBrains Mono", monospace;
    width: fit-content;
    margin-top: 2px;
  }
  .card-p1 .action-tag { background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
  .card-p2 .action-tag { background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; }
  .card-p3 .action-tag { background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; }
  .card-p4 .action-tag { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

  /* Technical Checkpoint Area */
  .checkpoint-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 165px;
    position: relative;
    box-sizing: border-box;
  }
  .card-p1 .checkpoint-box { border-left: 4px solid #0284c7; }
  .card-p2 .checkpoint-box { border-left: 4px solid #0d9488; }
  .card-p3 .checkpoint-box { border-left: 4px solid #6366f1; }
  .card-p4 .checkpoint-box { border-left: 4px solid #d97706; }

  .checkpoint-label {
    font-size: 9.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: "JetBrains Mono", monospace;
  }
  .card-p1 .checkpoint-label { color: #0284c7; }
  .card-p2 .checkpoint-label { color: #0d9488; }
  .card-p3 .checkpoint-label { color: #6366f1; }
  .card-p4 .checkpoint-label { color: #d97706; }

  .checkpoint-question {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.35;
  }

  .interactive-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: auto;
  }
  .interactive-hint span {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    background: #f1f5f9;
    padding: 3px 8px;
    border-radius: 5px;
    border: 1px dashed #cbd5e1;
  }

  /* Bottom Callout Banner */
  .footer-banner {
    background: #091e42;
    border-radius: 10px;
    padding: 11px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #1e293b;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .banner-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .banner-pill {
    background: #0284c7;
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 6px;
    font-family: "JetBrains Mono", monospace;
  }
  .banner-text {
    font-size: 12.5px;
    color: #f1f5f9;
    font-weight: 500;
  }
  .banner-text strong {
    color: #38bdf8;
    font-weight: 700;
  }
  .banner-right {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 500;
  }
  .gemini-spark {
    width: 13px;
    height: 13px;
    fill: #38bdf8;
  }
</style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="corner-glow"></div>
  <div class="slide-container">
    
    <!-- Header -->
    <div class="header">
      <div class="badge-row">
        <div class="badge">Starter Practical Challenge</div>
        <div class="header-meta">5-Minute Lab Routine • 100× & 400× Focus</div>
      </div>
      <h1 class="title">Starter: Focus on Your Premade Slide</h1>
      <p class="subtitle">Complete the 4 steps below to set up your microscope and focus on your stained slide.</p>
    </div>

    <!-- 4 Pillars Grid -->
    <div class="pillars-grid">
      
      <!-- Step 1 -->
      <div class="pillar-card card-p1">
        <div class="pillar-header">
          <div class="pillar-title">⚙️ Setup & Power</div>
          <div class="step-num">01</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="action-block">
            <div class="action-main">Plug in and turn on light.</div>
            <div class="action-detail">Wipe lenses gently with lens paper only. Place base ≥10cm from edge.</div>
            <div class="action-tag">💡 Illuminator ON</div>
          </div>
          <div class="checkpoint-box">
            <div class="checkpoint-label">Checkpoint 1</div>
            <div class="checkpoint-question">Why use lens paper only?</div>
            <div class="interactive-hint"><span>Click to reveal answer</span></div>
          </div>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="pillar-card card-p2">
        <div class="pillar-header">
          <div class="pillar-title">🔬 Mount & Align</div>
          <div class="step-num">02</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="action-block">
            <div class="action-main">Click 10× lens into place.</div>
            <div class="action-detail">Clip premade slide onto stage and center specimen over light beam.</div>
            <div class="action-tag">🔍 10× Low Power</div>
          </div>
          <div class="checkpoint-box">
            <div class="checkpoint-label">Checkpoint 2</div>
            <div class="checkpoint-question">Why start on lowest power (10×)?</div>
            <div class="interactive-hint"><span>Click to reveal answer</span></div>
          </div>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="pillar-card card-p3">
        <div class="pillar-header">
          <div class="pillar-title">🎯 Focus Safely</div>
          <div class="step-num">03</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="action-block">
            <div class="action-main">Look from side to raise stage.</div>
            <div class="action-detail">Then look into eyepiece and lower stage slowly until focused.</div>
            <div class="action-tag">👀 Side View First</div>
          </div>
          <div class="checkpoint-box">
            <div class="checkpoint-label">Checkpoint 3</div>
            <div class="checkpoint-question">Why look from the side first?</div>
            <div class="interactive-hint"><span>Click to reveal answer</span></div>
          </div>
        </div>
      </div>

      <!-- Step 4 -->
      <div class="pillar-card card-p4">
        <div class="pillar-header">
          <div class="pillar-title">✨ 40× High Power</div>
          <div class="step-num">04</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="action-block">
            <div class="action-main">Switch to 40× objective.</div>
            <div class="action-detail">Sharpen image using FINE FOCUS only (never touch coarse focus!).</div>
            <div class="action-tag">⚠️ Fine Focus Only</div>
          </div>
          <div class="checkpoint-box">
            <div class="checkpoint-label">Checkpoint 4</div>
            <div class="checkpoint-question">Why no coarse focus at 40×?</div>
            <div class="interactive-hint"><span>Click to reveal answer</span></div>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Callout Banner -->
    <div class="footer-banner">
      <div class="banner-left">
        <div class="banner-pill">Golden Rule</div>
        <div class="banner-text"><strong>Zero Collision Protocol:</strong> Always look from the side when raising the stage. Never use coarse focus at 40×.</div>
      </div>
      <div class="banner-right">
        <svg class="gemini-spark" viewBox="0 0 24 24"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>
        <span>Gemini Notebook</span>
      </div>
    </div>

  </div>
</body>
</html>
  `;

  await page.setContent(slide3Html, { waitUntil: "networkidle" });
  const slide3Path = path.join(SLIDES_DIR, "slide_02b_microscope_setup_premade_slide.png");
  await page.screenshot({ path: slide3Path, type: "png" });
  console.log("Saved:", slide3Path);

  const qa3 = await validateGeneratedSlideImage({ outputPath: slide3Path });
  console.log("Slide 3 QA Validation:", qa3.passed ? "PASSED" : "FAILED", qa3.checks);
  if (!qa3.passed) throw new Error("Slide 3 image failed QA: " + JSON.stringify(qa3.checks));

  // ---------------------------------------------------------------------------
  // 2. SLIDE 10: Practical Protocol: Human Cheek Epithelial Cell Wet Mount Preparation
  // ---------------------------------------------------------------------------
  console.log("\n[2/2] Rendering slide_08b_human_cheek_practical.png...");

  const slide10Html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap");
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: #f8fafc;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    position: relative;
  }

  /* Blueprint Grid Pattern */
  .grid-bg {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(2, 132, 199, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(2, 132, 199, 0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  /* Soft decorative corner gradient */
  .corner-glow {
    position: absolute;
    top: -120px;
    right: -120px;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.10) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }

  .slide-container {
    width: 1376px;
    height: 768px;
    padding: 26px 44px 20px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  /* Header Section */
  .header {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .badge-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ecfdf5;
    color: #059669;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 9999px;
    border: 1px solid #a7f3d0;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .header-meta {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.02em;
  }
  .title {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #091e42;
    letter-spacing: -0.025em;
    line-height: 1.15;
  }
  .subtitle {
    font-size: 14px;
    color: #475569;
    font-weight: 500;
  }

  /* 4 Pillars Grid */
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    flex: 1;
    margin: 16px 0 16px 0;
  }

  .pillar-card {
    background: #ffffff;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 18px -2px rgba(15, 23, 42, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .pillar-header {
    padding: 12px 14px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .card-p1 .pillar-header { background: linear-gradient(135deg, #091e42 0%, #0284c7 100%); }
  .card-p2 .pillar-header { background: linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%); }
  .card-p3 .pillar-header { background: linear-gradient(135deg, #064e3b 0%, #059669 100%); }
  .card-p4 .pillar-header { background: linear-gradient(135deg, #1e293b 0%, #ea580c 100%); }

  .pillar-title {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 14.5px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 7px;
    letter-spacing: -0.01em;
  }
  .pillar-badge {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.85;
  }
  .pillar-divider {
    height: 3px;
    width: 100%;
  }
  .card-p1 .pillar-divider { background: linear-gradient(90deg, #0284c7, #38bdf8); }
  .card-p2 .pillar-divider { background: linear-gradient(90deg, #8b5cf6, #c084fc); }
  .card-p3 .pillar-divider { background: linear-gradient(90deg, #10b981, #34d399); }
  .card-p4 .pillar-divider { background: linear-gradient(90deg, #f97316, #fb923c); }

  .pillar-body {
    padding: 13px 13px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    background: #ffffff;
  }

  .pill-tag {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    font-family: "JetBrains Mono", monospace;
  }
  .card-p1 .pill-tag { background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
  .card-p2 .pill-tag { background: #faf5ff; color: #6b21a8; border: 1px solid #e9d5ff; }
  .card-p3 .pill-tag { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
  .card-p4 .pill-tag { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }

  .point-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7.5px;
    font-size: 12px;
    color: #334155;
    line-height: 1.42;
  }
  .point-list li {
    display: flex;
    gap: 6px;
    align-items: flex-start;
  }
  .point-list li::before {
    content: "•";
    color: #0284c7;
    font-weight: bold;
    font-size: 15px;
    line-height: 1;
  }
  .card-p2 .point-list li::before { color: #8b5cf6; }
  .card-p3 .point-list li::before { color: #059669; }
  .card-p4 .point-list li::before { color: #ea580c; }
  .point-list strong {
    color: #0f172a;
    font-weight: 600;
  }

  .diagnostic-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 11px;
    color: #475569;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .diagnostic-box strong {
    color: #0f172a;
  }

  /* Bottom Callout Banner */
  .footer-banner {
    background: #091e42;
    border-radius: 10px;
    padding: 10px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #1e293b;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .banner-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .banner-pill {
    background: #dc2626;
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 6px;
    font-family: "JetBrains Mono", monospace;
  }
  .banner-text {
    font-size: 12px;
    color: #f1f5f9;
    font-weight: 500;
  }
  .banner-text strong {
    color: #f87171;
    font-weight: 700;
  }
  .banner-right {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 500;
  }
  .gemini-spark {
    width: 13px;
    height: 13px;
    fill: #38bdf8;
  }
</style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="corner-glow"></div>
  <div class="slide-container">
    
    <!-- Header -->
    <div class="header">
      <div class="badge-row">
        <div class="badge">Core Laboratory Practical</div>
        <div class="header-meta">Unit F173: Biomedical Techniques • CLEAPSS Student Safety Sheet 61</div>
      </div>
      <h1 class="title">Practical Protocol: Human Cheek Epithelial Cell Wet Mount</h1>
      <p class="subtitle">Standard Operating Procedure: Aseptic Buccal Mucosa Sampling, Methylene Blue Staining & Biohazard Disinfection</p>
    </div>

    <!-- 4 Pillars Grid -->
    <div class="pillars-grid">
      
      <!-- Pillar 1 -->
      <div class="pillar-card card-p1">
        <div class="pillar-header">
          <div class="pillar-badge">Stage 01 • Sampling</div>
          <div class="pillar-title">🧪 Aseptic Cell Harvesting</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="pill-tag">
            <span>Target Tissue</span>
            <span>Stratified Squamous</span>
          </div>
          <ul class="point-list">
            <li><strong>Sterile Cotton Swab:</strong> Gently rotate swab against inside of cheek (buccal mucosa) for 5–10 seconds.</li>
            <li><strong>Cell Transfer:</strong> Rub and roll the swab in small circular motion onto the center of a clean glass slide.</li>
            <li><strong>Immediate Disinfection:</strong> Plunge used swab directly into 10% bleach discard jar (CLEAPSS GL113).</li>
          </ul>
          <div class="diagnostic-box">
            <strong>CLEAPSS Safety Control:</strong>
            Never scrape gums or teeth; discard swab immediately into disinfectant beaker.
          </div>
        </div>
      </div>

      <!-- Pillar 2 -->
      <div class="pillar-card card-p2">
        <div class="pillar-header">
          <div class="pillar-badge">Stage 02 • Staining</div>
          <div class="pillar-title">💧 Differential Staining</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="pill-tag">
            <span>Stain Solution</span>
            <span>1% Methylene Blue</span>
          </div>
          <ul class="point-list">
            <li><strong>Single Drop Reagent:</strong> Using dropping pipette, add exactly 1 drop of 1% methylene blue onto the cell smear.</li>
            <li><strong>Penetration Time:</strong> Allow dye to incubate for 60–90 seconds at room temperature for chromatin binding.</li>
            <li><strong>Electrostatic Binding:</strong> Cationic [MB]⁺ binds polyanionic phosphate groups in nuclear DNA/RNA.</li>
          </ul>
          <div class="diagnostic-box">
            <strong>Chemical Handling:</strong>
            Methylene blue causes permanent staining; wear gloves & safety glasses.
          </div>
        </div>
      </div>

      <!-- Pillar 3 -->
      <div class="pillar-card card-p3">
        <div class="pillar-header">
          <div class="pillar-badge">Stage 03 • Mounting</div>
          <div class="pillar-title">📐 45° Coverslip Placement</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="pill-tag">
            <span>Tolerance Spec</span>
            <span>0.17 mm Coverslip</span>
          </div>
          <ul class="point-list">
            <li><strong>45° Angle Resting:</strong> Rest one edge of a clean coverslip on the slide touching the edge of the liquid stain.</li>
            <li><strong>Mounted Needle Descent:</strong> Support opposite edge with mounted needle; slowly lower to displace air bubbles.</li>
            <li><strong>Wicking Excess:</strong> Touch bibulous filter paper gently to coverslip perimeter to absorb surplus dye.</li>
          </ul>
          <div class="diagnostic-box">
            <strong>Bubble Elimination:</strong>
            Trapped bubbles appear as thick black-ringed spheres that obscure diagnostic cells.
          </div>
        </div>
      </div>

      <!-- Pillar 4 -->
      <div class="pillar-card card-p4">
        <div class="pillar-header">
          <div class="pillar-badge">Stage 04 • Diagnostic</div>
          <div class="pillar-title">🔬 Diagnostic Examination</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="pill-tag">
            <span>Magnification</span>
            <span>100× → 400× Total</span>
          </div>
          <ul class="point-list">
            <li><strong>Low-to-High Power:</strong> Scan at 100× to find isolated polygonal cells; advance to 400× using fine focus only.</li>
            <li><strong>Observed Cytology:</strong> Dark blue nucleus (~8 µm), pale blue granular cytoplasm (~50–70 µm), thin membrane.</li>
            <li><strong>Oral Microbiota:</strong> Commensal bacteria appear as tiny dark blue rods/cocci adhering to cell margins.</li>
          </ul>
          <div class="diagnostic-box">
            <strong>Post-Lab Immersion:</strong>
            Finished slide must be soaked in 10% bleach disinfectant for ≥30 min before disposal.
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Callout Banner -->
    <div class="footer-banner">
      <div class="banner-left">
        <div class="banner-pill">CLEAPSS GL113 Biohazard</div>
        <div class="banner-text"><strong>Human Tissue Protocol:</strong> Cheek cells present Category 1 biological risk. Students must only harvest their own cells. All swabs and slides must enter disinfectant immediately.</div>
      </div>
      <div class="banner-right">
        <svg class="gemini-spark" viewBox="0 0 24 24"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>
        <span>Gemini Notebook</span>
      </div>
    </div>

  </div>
</body>
</html>
  `;

  await page.setContent(slide10Html, { waitUntil: "networkidle" });
  const slide10Path = path.join(SLIDES_DIR, "slide_08b_human_cheek_practical.png");
  await page.screenshot({ path: slide10Path, type: "png" });
  console.log("Saved:", slide10Path);

  const qa10 = await validateGeneratedSlideImage({ outputPath: slide10Path });
  console.log("Slide 10 QA Validation:", qa10.passed ? "PASSED" : "FAILED", qa10.checks);
  if (!qa10.passed) throw new Error("Slide 10 image failed QA: " + JSON.stringify(qa10.checks));

  await browser.close();

  // ---------------------------------------------------------------------------
  // 3. Update manifest.json with the new 13-slide sequence
  // ---------------------------------------------------------------------------
  console.log("\n=== Updating manifest.json for Lesson 02 ===");
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  manifest.totalSlides = 13;

  // New Slide 3 Entry
  const slide3ManifestEntry = {
    number: 3,
    title: "Starter: Focus on Your Premade Slide",
    imageFileName: "slide_02b_microscope_setup_premade_slide.png",
    imageUrl: "/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist/slides/slide_02b_microscope_setup_premade_slide.png",
    sourceMediaPath: null,
    isInteractive: true,
    interactiveType: "custom_reveals",
    starterQuestions: [
      {
        q: "Why use lens paper only?",
        a: "Paper towels scratch delicate anti-reflective lens coatings. Lens paper is non-abrasive and lint-free."
      },
      {
        q: "Why start on lowest power (10x)?",
        a: "Lowest power provides the widest field of view to easily find and center the specimen."
      },
      {
        q: "Why look from the side when raising?",
        a: "Looking from the side stops the objective lens from colliding with and crushing the glass slide."
      },
      {
        q: "Why no coarse focus at 40x?",
        a: "Working distance is <0.5 mm. Coarse focus moves too fast, risking crushing the slide and cracking the lens."
      }
    ],
    interactiveCells: [
      {
        id: "starter_focus_chk_1",
        bounds: {
          x: 3.5,
          y: 62.5,
          w: 22.1,
          h: 20.0
        },
        answerBounds: {
          x: 3.5,
          y: 62.5,
          w: 22.1,
          h: 20.0
        },
        question: "Why use lens paper only?",
        expectedAnswer: "Paper towels scratch delicate anti-reflective lens coatings. Lens paper is non-abrasive and lint-free.",
        answer: "Paper towels scratch delicate anti-reflective lens coatings. Lens paper is non-abrasive and lint-free.",
        overlayAnswer: true,
        revealMode: "overlay",
        confidence: 1
      },
      {
        id: "starter_focus_chk_2",
        bounds: {
          x: 27.1,
          y: 62.5,
          w: 22.1,
          h: 20.0
        },
        answerBounds: {
          x: 27.1,
          y: 62.5,
          w: 22.1,
          h: 20.0
        },
        question: "Why start on lowest power (10x)?",
        expectedAnswer: "Lowest power provides the widest field of view to easily find and center the specimen.",
        answer: "Lowest power provides the widest field of view to easily find and center the specimen.",
        overlayAnswer: true,
        revealMode: "overlay",
        confidence: 1
      },
      {
        id: "starter_focus_chk_3",
        bounds: {
          x: 50.7,
          y: 62.5,
          w: 22.1,
          h: 20.0
        },
        answerBounds: {
          x: 50.7,
          y: 62.5,
          w: 22.1,
          h: 20.0
        },
        question: "Why look from the side when raising?",
        expectedAnswer: "Looking from the side stops the objective lens from colliding with and crushing the glass slide.",
        answer: "Looking from the side stops the objective lens from colliding with and crushing the glass slide.",
        overlayAnswer: true,
        revealMode: "overlay",
        confidence: 1
      },
      {
        id: "starter_focus_chk_4",
        bounds: {
          x: 74.3,
          y: 62.5,
          w: 22.1,
          h: 20.0
        },
        answerBounds: {
          x: 74.3,
          y: 62.5,
          w: 22.1,
          h: 20.0
        },
        question: "Why no coarse focus at 40x?",
        expectedAnswer: "Working distance is <0.5 mm. Coarse focus moves too fast, risking crushing the slide and cracking the lens.",
        answer: "Working distance is <0.5 mm. Coarse focus moves too fast, risking crushing the slide and cracking the lens.",
        overlayAnswer: true,
        revealMode: "overlay",
        confidence: 1
      }
    ],
    cognitiveGuide: {
      estimatedTimeSeconds: 45,
      timeGuideDisplay: "40–50s",
      vciScore: "4.8",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Medium Processing",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1000,
        readingMs: 18000,
        semanticProcessingMs: 15000,
        wordCount: 54,
        visualElementsCount: 4
      },
      academicReferences: [
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
          relevance: "Reduces procedural split-attention effect by aligning hands-on optical steps with diagnostic reflection checkpoints."
        }
      ]
    },
    questionAnalysis: {
      detected: true,
      confidence: "high",
      questionCount: 4,
      format: "checkpoint_grid"
    }
  };

  // New Slide 10 Entry
  const slide10ManifestEntry = {
    number: 10,
    title: "Practical Protocol: Human Cheek Epithelial Cell Wet Mount Preparation",
    imageFileName: "slide_08b_human_cheek_practical.png",
    imageUrl: "/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist/slides/slide_08b_human_cheek_practical.png",
    sourceMediaPath: null,
    isInteractive: false,
    interactiveType: null,
    cognitiveGuide: {
      estimatedTimeSeconds: 40,
      timeGuideDisplay: "35–45s",
      vciScore: "4.9",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Medium Processing",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1100,
        readingMs: 18500,
        semanticProcessingMs: 16000,
        wordCount: 58,
        visualElementsCount: 4
      },
      academicReferences: [
        {
          citation: "CLEAPSS (2020). Student Safety Sheet 61: Cells and tissues. CLEAPSS Laboratory Safety.",
          relevance: "Directs aseptic buccal scraping and immediate disinfectant immersion protocol."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      format: "statement_only"
    }
  };

  // Build the 13-slide sequence:
  // Original slides:
  // 1 -> 1
  // 2 -> 2
  // [NEW Slide 3]
  // 3 -> 4
  // 4 -> 5
  // 5 -> 6 (koehler video)
  // 6 -> 7 (s1 enterprise)
  // 7 -> 8 (troubleshooting workshop)
  // 8 -> 9 (task execution wet mounts)
  // [NEW Slide 10: cheek practical]
  // 9 -> 11 (methylene blue mechanism)
  // 10 -> 12 (interactive 3d lab)
  // 11 -> 13 (plenary)

  const originalSlides = manifest.slides;
  const slide1 = originalSlides.find(s => s.number === 1);
  const slide2 = originalSlides.find(s => s.number === 2);
  const slide3Old = originalSlides.find(s => s.number === 3);
  const slide4Old = originalSlides.find(s => s.number === 4);
  const slide5Old = originalSlides.find(s => s.number === 5);
  const slide6Old = originalSlides.find(s => s.number === 6);
  const slide7Old = originalSlides.find(s => s.number === 7);
  const slide8Old = originalSlides.find(s => s.number === 8);
  const slide9Old = originalSlides.find(s => s.number === 9);
  const slide10Old = originalSlides.find(s => s.number === 10);
  const slide11Old = originalSlides.find(s => s.number === 11);

  // Re-number slides
  slide3Old.number = 4;
  slide4Old.number = 5;
  slide5Old.number = 6;
  slide6Old.number = 7;
  slide7Old.number = 8;
  slide8Old.number = 9;
  slide9Old.number = 11;
  slide10Old.number = 12;
  slide11Old.number = 13;

  manifest.slides = [
    slide1,
    slide2,
    slide3ManifestEntry,
    slide3Old,
    slide4Old,
    slide5Old,
    slide6Old,
    slide7Old,
    slide8Old,
    slide10ManifestEntry,
    slide9Old,
    slide10Old,
    slide11Old
  ];

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log("manifest.json successfully updated with 13 slides!");
}

main().catch(err => {
  console.error("FATAL ERROR in generate_lesson_02_new_slides:", err);
  process.exit(1);
});
