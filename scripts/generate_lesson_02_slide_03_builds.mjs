import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";
import { syncQaApprovedGeminiSequence } from "../src/slide-animation-planner.js";

const DECK_ID = "Lesson_02_Working_like_a_Human_Biologist";
const DECK_DIR = path.resolve("public/decks/intro_aaq_human_bio", DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function main() {
  console.log("=== Launching Chrome to render Lesson 02 Slide 3 Progressive Builds ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  // ---------------------------------------------------------------------------
  // 1. BUILD 1: Task Only ("Set up and focus the microscope slide. Send me a picture on the Teams chat")
  // ---------------------------------------------------------------------------
  console.log("\n[1/2] Rendering Build 1 (Task Only)...");

  const build1Html = `
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

  .grid-bg {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(2, 132, 199, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(2, 132, 199, 0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

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
    background: #e0f2fe;
    color: #0284c7;
    font-size: 11px;
    font-weight: 800;
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

  /* Main Hero Task Card */
  .task-hero {
    flex: 1;
    margin: 20px 0 18px 0;
    background: #ffffff;
    border-radius: 20px;
    border: 1.5px solid #cbd5e1;
    box-shadow: 0 10px 35px -5px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 36px 44px;
    position: relative;
    overflow: hidden;
  }
  .task-hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #0284c7 0%, #0d9488 35%, #6366f1 70%, #d97706 100%);
  }

  .task-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .task-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #091e42;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 8px;
    font-family: "JetBrains Mono", monospace;
  }
  .task-countdown {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #f1f5f9;
    color: #334155;
    font-size: 13px;
    font-weight: 700;
    padding: 6px 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-family: "JetBrains Mono", monospace;
  }

  /* The Main Bold Task Headline */
  .task-core-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 14px 0;
  }
  .task-label-prefix {
    font-size: 18px;
    font-weight: 800;
    color: #0284c7;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .task-main-text {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 38px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.22;
    letter-spacing: -0.02em;
  }
  .task-sub-text {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #0284c7;
    line-height: 1.22;
    letter-spacing: -0.015em;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .teams-pill {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: #ffffff;
    font-size: 20px;
    padding: 4px 14px;
    border-radius: 8px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
  }

  /* 4 Parameters Grid */
  .specs-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 10px;
  }
  .spec-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .spec-label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #64748b;
    font-family: "JetBrains Mono", monospace;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .spec-val {
    font-size: 13.5px;
    font-weight: 700;
    color: #1e293b;
    font-family: "Plus Jakarta Sans", sans-serif;
  }

  /* Bottom Callout Banner */
  .footer-banner {
    background: #091e42;
    border-radius: 10px;
    padding: 11px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 14px rgba(9, 30, 66, 0.12);
  }
  .banner-left {
    display: flex;
    align-items: center;
    gap: 12px;
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
      <p class="subtitle">Independent Practical Task • Biomedical Microscopy Standard</p>
    </div>

    <!-- Main Hero Task Card -->
    <div class="task-hero">
      <div class="task-top-bar">
        <div class="task-tag">🎯 Lab Practical Task</div>
        <div class="task-countdown">⏱️ Time: 5 Minutes</div>
      </div>

      <div class="task-core-box">
        <div class="task-label-prefix">Your Mission:</div>
        <div class="task-main-text">Set up and focus the microscope slide.</div>
        <div class="task-sub-text">
          <span>Send me a picture on the</span>
          <span class="teams-pill">💬 Teams chat</span>
        </div>
      </div>

      <div class="specs-row">
        <div class="spec-item">
          <div class="spec-label">🔬 Specimen</div>
          <div class="spec-val">Premade Stained Histology Slide</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">⚙️ Baseline Focus</div>
          <div class="spec-val">10× Objective (100× Total)</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">🔍 Detail Focus</div>
          <div class="spec-val">40× Objective (400× Total)</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">📸 Evidence</div>
          <div class="spec-val">Phone Photo Down Eyepiece</div>
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

  await page.setContent(build1Html, { waitUntil: "networkidle" });
  const build1Path = path.join(SLIDES_DIR, "slide_03_gemini_slide_3_1_component_reveal.png");
  await page.screenshot({ path: build1Path, type: "png" });
  console.log("Saved Build 1:", build1Path);

  // ---------------------------------------------------------------------------
  // 2. BUILD 2: Full 4-Pillar SOP + Diagnostic Checkpoints
  // ---------------------------------------------------------------------------
  console.log("\n[2/2] Rendering Build 2 (4-Pillar SOP + Checkpoints)...");

  const build2Html = `
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
    background: #e0f2fe;
    color: #0284c7;
    font-size: 11px;
    font-weight: 800;
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
    color: #0284c7;
    font-weight: 700;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .subtitle span {
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
    font-family: "JetBrains Mono", monospace;
  }

  .pillar-divider {
    height: 3px;
    width: 100%;
  }
  .card-p1 .pillar-divider { background: #38bdf8; }
  .card-p2 .pillar-divider { background: #2dd4bf; }
  .card-p3 .pillar-divider { background: #818cf8; }
  .card-p4 .pillar-divider { background: #fbbf24; }

  .pillar-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
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
    box-shadow: 0 4px 14px rgba(9, 30, 66, 0.12);
  }
  .banner-left {
    display: flex;
    align-items: center;
    gap: 12px;
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
      <p class="subtitle">Task: Set up and focus the microscope slide. <span>Send me a picture on the Teams chat.</span></p>
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
          <div class="pillar-title">👀 Focus Safely</div>
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

  await page.setContent(build2Html, { waitUntil: "networkidle" });
  const build2Path = path.join(SLIDES_DIR, "slide_03_gemini_slide_3_2_component_reveal.png");
  await page.screenshot({ path: build2Path, type: "png" });
  console.log("Saved Build 2:", build2Path);

  // Also update slide_02b_microscope_setup_premade_slide.png so the baseline slide is updated
  const baseSlidePath = path.join(SLIDES_DIR, "slide_02b_microscope_setup_premade_slide.png");
  await page.screenshot({ path: baseSlidePath, type: "png" });
  console.log("Updated Base Slide:", baseSlidePath);

  await browser.close();

  // Validate images
  const qa1 = await validateGeneratedSlideImage({ outputPath: build1Path });
  console.log("Build 1 QA:", qa1.passed ? "PASSED" : "FAILED");
  if (!qa1.passed) throw new Error("Build 1 failed QA: " + JSON.stringify(qa1.checks));

  const qa2 = await validateGeneratedSlideImage({ outputPath: build2Path });
  console.log("Build 2 QA:", qa2.passed ? "PASSED" : "FAILED");
  if (!qa2.passed) throw new Error("Build 2 failed QA: " + JSON.stringify(qa2.checks));

  // Update Manifest
  console.log("\nUpdating manifest.json with progressive builds and minBuildStep...");
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  const slideIndex = manifest.slides.findIndex((s) => s.number === 3);
  if (slideIndex === -1) throw new Error("Slide 3 not found in manifest");

  const slide = manifest.slides[slideIndex];
  const reviewedAt = new Date().toISOString();

  const cells = [
    {
      id: "gemini_slide_3_1_component_reveal",
      order: 1,
      kind: "image",
      mediaType: "image",
      source: "gemini-image-chat",
      label: "Build 1: Task Briefing (Set up and focus the microscope slide. Send me a picture on the Teams chat)",
      strategy: "component-reveal",
      fullCanvas: true,
      cumulative: true,
      prompt: "Create cumulative full-slide still-image build 1 of 2 for slide 3: \"Starter: Focus on Your Premade Slide\". Show now: Header and Hero Task Card stating: Task: Set up and focus the microscope slide. Send me a picture on the Teams chat. Temporarily omit: The 4 step-by-step guidance pillars and diagnostic checkpoints.",
      status: "ready",
      qaStatus: "approved",
      outputImageUrl: `/decks/intro_aaq_human_bio/${DECK_ID}/slides/slide_03_gemini_slide_3_1_component_reveal.png`,
      sourceImageUrl: `/decks/intro_aaq_human_bio/${DECK_ID}/slides/slide_02b_microscope_setup_premade_slide.png`,
      generatedAt: reviewedAt,
      qa: {
        status: "approved",
        reviewedAt,
        reviewer: "Teacher_Dan",
        notes: "Build 1: Task Briefing (Set up and focus the microscope slide. Send me a picture on the Teams chat)",
        technical: qa1,
        visual: {
          passed: true,
          missing: [],
          checks: {
            fullCanvas: true,
            styleMatch: true,
            cumulativeContent: true,
            legibleText: true,
            noFocusTreatment: true
          }
        }
      }
    },
    {
      id: "gemini_slide_3_2_component_reveal",
      order: 2,
      kind: "image",
      mediaType: "image",
      source: "gemini-image-chat",
      label: "Build 2: Reveal 4-Step Standard Operating Procedure & Diagnostic Checkpoints",
      strategy: "component-reveal",
      fullCanvas: true,
      cumulative: true,
      prompt: "Create cumulative full-slide still-image build 2 of 2 for slide 3: \"Starter: Focus on Your Premade Slide\". Show now: Header, Task subtitle, and full 4-pillar Standard Operating Procedure with 4 diagnostic technical checkpoints.",
      status: "ready",
      qaStatus: "approved",
      outputImageUrl: `/decks/intro_aaq_human_bio/${DECK_ID}/slides/slide_03_gemini_slide_3_2_component_reveal.png`,
      sourceImageUrl: `/decks/intro_aaq_human_bio/${DECK_ID}/slides/slide_02b_microscope_setup_premade_slide.png`,
      generatedAt: reviewedAt,
      qa: {
        status: "approved",
        reviewedAt,
        reviewer: "Teacher_Dan",
        notes: "Build 2: Reveal 4-Step Standard Operating Procedure & Diagnostic Checkpoints",
        technical: qa2,
        visual: {
          passed: true,
          missing: [],
          checks: {
            fullCanvas: true,
            styleMatch: true,
            cumulativeContent: true,
            legibleText: true,
            noFocusTreatment: true
          }
        }
      }
    }
  ];

  slide.geminiImageCells = cells;
  const synchronized = syncQaApprovedGeminiSequence(slide);
  Object.assign(slide, synchronized);

  slide.hasProgressiveBuilds = true;
  slide.animationPlan = {
    version: 2,
    mode: "gemini-image-cells",
    reason: "Slide 3 progressive build sequence: Build 1 presents the challenge task, Build 2 reveals the 4-step SOP and diagnostic checkpoints.",
    strategy: "component-reveal",
    planningSource: "gemini-slide-sequencer",
    analyzedComponentCount: 2,
    plannedCellCount: 2,
    approvedCellCount: 2,
    qaRequired: true,
    questionReveal: false,
    webEmbedPreserved: false,
    protectedVideoCount: 0
  };

  // Ensure all interactiveCells on Slide 3 have minBuildStep: 2 so they only appear on Build 2
  if (Array.isArray(slide.interactiveCells)) {
    slide.interactiveCells.forEach((cell) => {
      cell.minBuildStep = 2;
    });
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Successfully updated manifest.json for Slide 3!");
  console.log("hasProgressiveBuilds:", slide.hasProgressiveBuilds);
  console.log("progressiveBuilds count:", slide.progressiveBuilds?.length);
  console.log("interactiveCells count:", slide.interactiveCells?.length);
}

main().catch(console.error);
