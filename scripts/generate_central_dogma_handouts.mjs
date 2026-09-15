import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve('.');
const deckDir = path.join(projectRoot, 'public/decks/intro_aaq_human_bio/Lesson_01_Welcome_to_Human_Biology');
const slidesDir = path.join(deckDir, 'slides');
const assetsDir = path.join(deckDir, 'handout_assets');
const handoutsDir = path.join(deckDir, 'handouts');

async function imageToBase64(filePath) {
  const data = await fs.readFile(filePath);
  const ext = path.extname(filePath).replace('.', '') || 'png';
  return `data:image/${ext};base64,${data.toString('base64')}`;
}

async function prepareAssets() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  async function crop(slide, box, name) {
    await page.goto('file://' + path.join(slidesDir, slide));
    const dataUrl = await page.evaluate((b) => {
      const img = document.querySelector('img');
      const canvas = document.createElement('canvas');
      canvas.width = b.w;
      canvas.height = b.h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, b.x, b.y, b.w, b.h, 0, 0, b.w, b.h);
      return canvas.toDataURL('image/png');
    }, box);
    await fs.writeFile(path.join(assetsDir, name), Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64'));
  }

  // Pure isolated icons
  await crop('slide_08_gemini_slide_8_1_process.png', { x: 95, y: 345, w: 180, h: 180 }, 'pure_icon_1.png');
  await crop('slide_08_gemini_slide_8_2_process.png', { x: 430, y: 345, w: 170, h: 170 }, 'pure_icon_2.png');
  await crop('slide_08_gemini_slide_8_3_process.png', { x: 750, y: 345, w: 170, h: 170 }, 'pure_icon_3.png');
  await crop('slide_08_gemini_slide_8_4_process.png', { x: 1060, y: 395, w: 200, h: 160 }, 'pure_icon_4.png');

  // Full process flow diagram
  await crop('slide_08_gemini_slide_8_4_process.png', { x: 30, y: 245, w: 1315, h: 505 }, 'clean_process_flow.png');

  await browser.close();
}

async function buildAllHandouts() {
  await prepareAssets();

  console.log('Loading base64 assets...');
  const diagramB64 = await imageToBase64(path.join(assetsDir, 'clean_process_flow.png'));
  const icon1B64 = await imageToBase64(path.join(assetsDir, 'pure_icon_1.png'));
  const icon2B64 = await imageToBase64(path.join(assetsDir, 'pure_icon_2.png'));
  const icon3B64 = await imageToBase64(path.join(assetsDir, 'pure_icon_3.png'));
  const icon4B64 = await imageToBase64(path.join(assetsDir, 'pure_icon_4.png'));

  const s81B64 = await imageToBase64(path.join(slidesDir, 'slide_08_gemini_slide_8_1_process.png'));
  const s82B64 = await imageToBase64(path.join(slidesDir, 'slide_08_gemini_slide_8_2_process.png'));
  const s83B64 = await imageToBase64(path.join(slidesDir, 'slide_08_gemini_slide_8_3_process.png'));
  const s84B64 = await imageToBase64(path.join(slidesDir, 'slide_08_gemini_slide_8_4_process.png'));

  // =========================================================================
  // 1. MASTER 2-PAGE STUDENT STUDY GUIDE & EXAM WORKSHEET
  // =========================================================================
  const masterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Central Dogma & Molecular Causality — Student Handout</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #cbd5e1;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      margin: 0 auto;
      padding: 6.5mm 9.5mm;
      background: #ffffff;
      page-break-after: always;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Top Header */
    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 3.5px;
      border-bottom: 2px solid #0f172a;
    }

    .badge-course {
      display: inline-flex;
      align-items: center;
      font-size: 7.5px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #0d9488;
      margin-bottom: 1px;
    }

    .header-title {
      font-size: 14.5px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
      margin: 0;
    }

    .header-sub {
      font-size: 8.5px;
      font-weight: 500;
      color: #475569;
      margin: 1px 0 0 0;
    }

    .header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2.5px;
    }

    .tag-lesson {
      background: #0f172a;
      color: #f8fafc;
      font-size: 7.8px;
      font-weight: 700;
      padding: 2.5px 7.5px;
      border-radius: 4px;
      letter-spacing: 0.4px;
    }

    .tag-type {
      font-size: 7px;
      font-weight: 700;
      color: #0d9488;
      background: #ccfbf1;
      padding: 1.5px 5.5px;
      border-radius: 3px;
      border: 1px solid #99f6e4;
    }

    /* Student Meta */
    .student-meta {
      display: grid;
      grid-template-columns: 2.2fr 1fr 1fr 1fr;
      gap: 7px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 3.5px 7px;
      margin-top: 3.5px;
      font-size: 7.5px;
    }

    .meta-field {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #475569;
    }

    .meta-label {
      font-weight: 700;
      color: #0f172a;
    }

    .meta-line {
      flex: 1;
      border-bottom: 1px dashed #94a3b8;
      height: 9px;
    }

    /* Hero Concept */
    .hero-concept {
      background: linear-gradient(135deg, #090e17 0%, #1e293b 100%);
      border-radius: 6px;
      padding: 4.5px 9px;
      margin-top: 3.5px;
      color: #f8fafc;
      border-left: 4px solid #14b8a6;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .hero-badge-icon {
      background: rgba(20, 184, 166, 0.15);
      border: 1px solid #14b8a6;
      border-radius: 4px;
      padding: 2.5px 5.5px;
      font-size: 9px;
      line-height: 1;
      color: #2dd4bf;
      font-weight: 800;
    }

    .hero-title {
      font-size: 8.5px;
      font-weight: 800;
      color: #2dd4bf;
      letter-spacing: 0.3px;
      margin-bottom: 1.5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .hero-badge-right {
      font-size: 6.8px;
      font-weight: 700;
      background: rgba(45, 212, 191, 0.2);
      color: #5eead4;
      padding: 1px 4.5px;
      border-radius: 3px;
    }

    .hero-desc {
      font-size: 7.5px;
      line-height: 1.32;
      color: #cbd5e1;
      margin: 0;
    }

    .hero-desc strong {
      color: #ffffff;
      font-weight: 700;
    }

    /* Diagram Section - Large & Crisp */
    .diagram-section {
      margin-top: 3.5px;
      background: #090e17;
      border-radius: 6px;
      padding: 3.5px 5.5px;
      border: 1px solid #1e293b;
    }

    .diagram-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
      padding: 0 4px;
    }

    .diagram-title {
      font-size: 7.5px;
      font-weight: 800;
      color: #38bdf8;
      letter-spacing: 0.3px;
    }

    .diagram-tag {
      font-size: 6.5px;
      color: #94a3b8;
      font-family: 'JetBrains Mono', monospace;
    }

    .diagram-img-wrap {
      width: 100%;
      height: 60mm;
      border-radius: 4px;
      overflow: hidden;
      background: #0a111a;
      border: 1px solid #1e293b;
    }

    .diagram-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: fill;
      display: block;
    }

    /* 4-Stage Columns */
    .stages-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5.5px;
      margin-top: 3.5px;
      flex: 1;
    }

    .stage-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 5px 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 2.5px;
    }

    .stage-card.stage-4 {
      background: #fff7ed;
      border-color: #fdba74;
    }

    .stage-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stage-pill {
      font-size: 6.6px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      padding: 1.5px 5px;
      border-radius: 3px;
      display: inline-block;
    }

    .stage-1 .stage-pill { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .stage-2 .stage-pill { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .stage-3 .stage-pill { background: #f0fdf4; color: #0d9488; border: 1px solid #99f6e4; }
    .stage-4 .stage-pill { background: #ffedd5; color: #c2410c; border: 1px solid #fed7aa; }

    .stage-loc-tag {
      font-size: 6.4px;
      font-weight: 700;
      color: #64748b;
    }

    .stage-card-title {
      font-size: 8.8px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
    }
    .stage-card.stage-4 .stage-card-title {
      color: #9a3412;
    }

    /* Isolated Icon Badge */
    .stage-icon-center {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 1px 0;
    }

    .stage-icon-box {
      width: 25mm;
      height: 25mm;
      border-radius: 6px;
      overflow: hidden;
      background: #0b1320;
      border: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    .stage-icon-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .stage-section-title {
      font-size: 6.6px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      color: #0369a1;
      margin-top: 1px;
    }
    .stage-2 .stage-section-title { color: #15803d; }
    .stage-3 .stage-section-title { color: #0d9488; }
    .stage-4 .stage-section-title { color: #c2410c; }

    .stage-steps-list {
      margin: 1px 0;
      padding-left: 9px;
      font-size: 6.5px;
      line-height: 1.28;
      color: #334155;
    }

    .stage-steps-list li {
      margin-bottom: 2px;
    }

    .stage-steps-list strong {
      color: #0f172a;
    }

    /* Key Terms Tags inside each card */
    .stage-terms-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 2.5px;
      margin: 1px 0;
    }

    .stage-term-badge {
      font-size: 6px;
      font-weight: 700;
      background: #e2e8f0;
      color: #334155;
      padding: 1px 4px;
      border-radius: 3px;
    }

    .stage-card.stage-4 .stage-term-badge {
      background: #ffedd5;
      color: #9a3412;
    }

    .stage-mini-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 3px 5px;
      font-size: 6.4px;
      line-height: 1.22;
      color: #475569;
    }

    .stage-card.stage-4 .stage-mini-box {
      background: #fff;
      border-color: #fdba74;
      color: #7c2d12;
    }

    .stage-check-prompt {
      border-top: 1px dashed #cbd5e1;
      padding-top: 2.5px;
      font-size: 6.5px;
      color: #475569;
    }

    .stage-check-prompt strong {
      color: #0f172a;
    }

    .stage-check-line {
      border-bottom: 1px dashed #94a3b8;
      height: 9px;
      margin-top: 1px;
    }

    /* Page 1 Bottom Bar */
    .page1-bottom-bar {
      margin-top: 3.5px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 5px;
      padding: 3.5px 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 7px;
    }

    .bottom-bar-left {
      flex: 1;
    }

    .bottom-bar-title {
      font-size: 7.2px;
      font-weight: 800;
      color: #1d4ed8;
      margin-bottom: 1px;
    }

    .bottom-bar-text {
      font-size: 6.8px;
      color: #1e40af;
      line-height: 1.22;
      margin: 0;
    }

    .bottom-bar-input {
      width: 220px;
      background: #ffffff;
      border: 1px dashed #93c5fd;
      border-radius: 4px;
      padding: 3px 6px;
      font-size: 6.6px;
      color: #64748b;
      min-height: 18px;
      display: flex;
      align-items: center;
    }

    /* Footer */
    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2.5px;
      border-top: 1px solid #cbd5e1;
      font-size: 6.8px;
      color: #64748b;
      font-weight: 500;
    }

    .footer-left {
      display: flex;
      gap: 12px;
    }

    .footer-right {
      font-weight: 700;
      color: #0f172a;
    }

    /* ============================================================
       PAGE 2: Molecular Causality & Exam Mastery
       ============================================================ */
    .page-2-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 3.5px;
      border-bottom: 2px solid #ea580c;
    }

    .alert-mutation-box {
      background: #fff7ed;
      border: 1.5px solid #ea580c;
      border-radius: 6px;
      padding: 5px 9px;
      margin-top: 3.5px;
    }

    .alert-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5px;
    }

    .alert-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #ea580c;
      color: #ffffff;
      font-size: 7.2px;
      font-weight: 800;
      padding: 1.5px 5.5px;
      border-radius: 3px;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }

    .alert-subtitle {
      font-size: 7px;
      font-weight: 700;
      color: #c2410c;
    }

    .alert-body {
      font-size: 7.2px;
      line-height: 1.32;
      color: #7c2d12;
      margin: 0;
    }

    .alert-body strong {
      color: #9a3412;
      font-weight: 700;
    }

    /* 6-Step Causal Chain */
    .causal-section {
      margin-top: 3.5px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 4.5px 7px;
    }

    .causal-title {
      font-size: 8px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 3.5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .causal-title span {
      font-size: 6.8px;
      font-weight: 600;
      color: #64748b;
    }

    .causal-flow {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 3.5px;
    }

    .causal-step {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 3.5px 4.5px;
      display: flex;
      flex-direction: column;
    }

    .causal-step.step-fail {
      background: #fef2f2;
      border-color: #fca5a5;
    }

    .step-num {
      font-size: 6.5px;
      font-weight: 800;
      color: #0284c7;
      margin-bottom: 1px;
      font-family: 'JetBrains Mono', monospace;
    }

    .causal-step.step-fail .step-num {
      color: #dc2626;
    }

    .step-heading {
      font-size: 7px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
      margin-bottom: 1.5px;
    }

    .step-text {
      font-size: 6.3px;
      line-height: 1.22;
      color: #475569;
    }

    /* Tertiary Bonding Matrix */
    .bonds-matrix-section {
      margin-top: 3.5px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4.5px;
    }

    .bond-card {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 3.5px 5.5px;
    }

    .bond-name {
      font-size: 7.2px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 1px;
      display: flex;
      align-items: center;
      gap: 2.5px;
    }

    .bond-rule {
      font-size: 6.4px;
      line-height: 1.22;
      color: #334155;
    }

    /* Level 3 Exam Question Box */
    .exam-box {
      margin-top: 3.5px;
      border: 1.5px solid #0f172a;
      border-radius: 6px;
      padding: 5px 8px;
      background: #ffffff;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5px;
    }

    .exam-badge {
      background: #0f172a;
      color: #ffffff;
      font-size: 7.2px;
      font-weight: 800;
      padding: 1.5px 5.5px;
      border-radius: 3px;
      letter-spacing: 0.3px;
    }

    .exam-marks {
      font-size: 7.2px;
      font-weight: 800;
      color: #dc2626;
      background: #fee2e2;
      padding: 1.5px 5.5px;
      border-radius: 3px;
      border: 1px solid #fca5a5;
    }

    .exam-prompt {
      font-size: 7.2px;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.32;
      margin-bottom: 3px;
      background: #f8fafc;
      padding: 3px 5.5px;
      border-left: 3px solid #0f172a;
      border-radius: 0 4px 4px 0;
    }

    .exam-lines-wrap {
      display: flex;
      flex-direction: column;
      gap: 2.5px;
      flex: 1;
      justify-content: space-around;
    }

    .exam-line-group {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .exam-line-label {
      font-size: 6.6px;
      font-weight: 700;
      color: #0369a1;
      display: flex;
      justify-content: space-between;
    }

    .exam-line-label span.cue {
      color: #64748b;
      font-weight: 500;
      font-style: italic;
    }

    .rule-line {
      width: 100%;
      border-bottom: 1px dashed #94a3b8;
      height: 9.5px;
    }

    /* Self Assessment Checklist */
    .checklist-section {
      margin-top: 3.5px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 5px;
      padding: 3.5px 7px;
    }

    .checklist-title {
      font-size: 7.2px;
      font-weight: 800;
      color: #15803d;
      margin-bottom: 2.5px;
      display: flex;
      justify-content: space-between;
    }

    .checklist-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px 10px;
    }

    .check-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 6.4px;
      color: #166534;
      line-height: 1.22;
    }

    .check-box {
      width: 8.5px;
      height: 8.5px;
      border: 1.2px solid #16a34a;
      border-radius: 2px;
      background: #ffffff;
      flex-shrink: 0;
    }

    /* Examiner Bar */
    .examiner-bar {
      margin-top: 3.5px;
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-left: 3px solid #f59e0b;
      border-radius: 4px;
      padding: 2.5px 7px;
      font-size: 6.6px;
      line-height: 1.28;
      color: #92400e;
    }

    .examiner-bar strong {
      color: #b45309;
      font-weight: 800;
    }
  </style>
</head>
<body>

  <!-- ============================================================
       PAGE 1: PROCESS ARCHITECTURE & THE CENTRAL DOGMA
       ============================================================ -->
  <div class="page">
    <!-- Top Header -->
    <div>
      <div class="header-banner">
        <div class="header-left">
          <span class="badge-course">Pearson BTEC / AAQ Level 3 in Human Biology &bull; Unit 1</span>
          <h1 class="header-title">The Central Dogma & Process Architecture</h1>
          <p class="header-sub">Core Concept Handout: How DNA Code Determines 3D Protein Structure and Biological Function</p>
        </div>
        <div class="header-right">
          <span class="tag-lesson">Lesson 01 Guide</span>
          <span class="tag-type">Student Theory & Revision</span>
        </div>
      </div>

      <!-- Student Metadata Bar -->
      <div class="student-meta">
        <div class="meta-field"><span class="meta-label">Student Name:</span><span class="meta-line"></span></div>
        <div class="meta-field"><span class="meta-label">Date:</span><span class="meta-line"></span></div>
        <div class="meta-field"><span class="meta-label">Class / Set:</span><span class="meta-line"></span></div>
        <div class="meta-field"><span class="meta-label">Target Grade:</span><span class="meta-line"></span></div>
      </div>

      <!-- Core Principle Anchor -->
      <div class="hero-concept">
        <div class="hero-badge-icon">&bull; RULE</div>
        <div class="hero-text">
          <div class="hero-title">
            <span>THE CENTRAL DOGMA FRAMEWORK: STRUCTURE DETERMINES FUNCTION</span>
            <span class="hero-badge-right">Level 3 Essential Standard</span>
          </div>
          <p class="hero-desc">
            To operate at a Level 3 standard, we must understand <strong>molecular causality</strong>: altering the DNA triplet code changes the amino acid sequence, directly disrupting tertiary folding, active site geometry, and biological function.
          </p>
        </div>
      </div>

      <!-- Hero Diagram from Slide 8.4 -->
      <div class="diagram-section">
        <div class="diagram-header">
          <div class="diagram-title">&bull; Full Technical Architecture & Progressive Pathway</div>
          <div class="diagram-tag">Fig 1.1 &bull; Molecular Pipeline from Nucleus to Active Conformation</div>
        </div>
        <div class="diagram-img-wrap">
          <img src="${diagramB64}" alt="The Central Dogma Process Flow">
        </div>
      </div>
    </div>

    <!-- 4 Sequential Stages Breakdown -->
    <div class="stages-grid">
      <!-- Stage 1 -->
      <div class="stage-card stage-1">
        <div>
          <div class="stage-card-header">
            <span class="stage-pill">Stage 1</span>
            <span class="stage-loc-tag">Nucleus</span>
          </div>
          <div class="stage-card-title">1. The Blueprint</div>
          <div class="stage-icon-center">
            <div class="stage-icon-box">
              <img src="${icon1B64}" alt="Stage 1 Nucleus">
            </div>
          </div>
          <div class="stage-section-title">Molecular Pathway</div>
          <ol class="stage-steps-list">
            <li><strong>Unwinding:</strong> DNA helicase breaks H-bonds to expose template strand triplet code.</li>
            <li><strong>Transcription:</strong> RNA polymerase links free RNA nucleotides (A-U, C-G).</li>
            <li><strong>Export:</strong> Pre-mRNA is spliced; mature single-stranded mRNA exits nuclear pore.</li>
          </ol>
          <div class="stage-terms-wrap">
            <span class="stage-term-badge">Triplet Code</span>
            <span class="stage-term-badge">RNA Polymerase</span>
            <span class="stage-term-badge">mRNA Transcript</span>
          </div>
          <div class="stage-mini-box">
            <strong>Protected Archive:</strong> DNA stays inside nucleus, shielding master genome from cytosol nucleases.
          </div>
        </div>
        <div class="stage-check-prompt">
          <strong>Check 1:</strong> Transcribe DNA triplet <em>3'-TAC-5'</em>:
          <div class="stage-check-line"></div>
          <strong>Check 2:</strong> Why is mRNA single-stranded?
          <div class="stage-check-line"></div>
        </div>
      </div>

      <!-- Stage 2 -->
      <div class="stage-card stage-2">
        <div>
          <div class="stage-card-header">
            <span class="stage-pill">Stage 2</span>
            <span class="stage-loc-tag">Cytosol / Ribosome</span>
          </div>
          <div class="stage-card-title">2. The Assembly Line</div>
          <div class="stage-icon-center">
            <div class="stage-icon-box">
              <img src="${icon2B64}" alt="Stage 2 Ribosome">
            </div>
          </div>
          <div class="stage-section-title">Molecular Pathway</div>
          <ol class="stage-steps-list">
            <li><strong>Binding:</strong> mRNA binds small ribosomal subunit at start codon (AUG).</li>
            <li><strong>Reading Frame:</strong> Ribosome reads transcript <strong>3 letters at a time</strong> non-overlappingly.</li>
            <li><strong>Translocation:</strong> Ribosome moves along mRNA transcript from 5' to 3' direction.</li>
          </ol>
          <div class="stage-terms-wrap">
            <span class="stage-term-badge">80S Ribosome</span>
            <span class="stage-term-badge">mRNA Codon</span>
            <span class="stage-term-badge">Reading Frame</span>
          </div>
          <div class="stage-mini-box">
            <strong>Workstation:</strong> The ribosome aligns mRNA codons with incoming aminoacyl-tRNA complexes.
          </div>
        </div>
        <div class="stage-check-prompt">
          <strong>Check 1:</strong> Number of bases in 1 codon:
          <div class="stage-check-line"></div>
          <strong>Check 2:</strong> Why is the code non-overlapping?
          <div class="stage-check-line"></div>
        </div>
      </div>

      <!-- Stage 3 -->
      <div class="stage-card stage-3">
        <div>
          <div class="stage-card-header">
            <span class="stage-pill">Stage 3</span>
            <span class="stage-loc-tag">tRNA &rarr; Ribosome</span>
          </div>
          <div class="stage-card-title">3. The Cargo</div>
          <div class="stage-icon-center">
            <div class="stage-icon-box">
              <img src="${icon3B64}" alt="Stage 3 tRNA">
            </div>
          </div>
          <div class="stage-section-title">Molecular Pathway</div>
          <ol class="stage-steps-list">
            <li><strong>Activation:</strong> Specific synthetase enzymes attach matching amino acids to tRNA.</li>
            <li><strong>Anticodon Pairing:</strong> tRNA anticodon pairs complementarily with mRNA codon.</li>
            <li><strong>Peptide Bond:</strong> Peptidyl transferase catalyses condensation between amino acids.</li>
          </ol>
          <div class="stage-terms-wrap">
            <span class="stage-term-badge">tRNA Anticodon</span>
            <span class="stage-term-badge">Peptide Bond</span>
            <span class="stage-term-badge">Polypeptide</span>
          </div>
          <div class="stage-mini-box">
            <strong>Fidelity:</strong> Accurate tRNA charging guarantees exact primary amino acid sequence.
          </div>
        </div>
        <div class="stage-check-prompt">
          <strong>Check 1:</strong> tRNA anticodon for codon AUG:
          <div class="stage-check-line"></div>
          <strong>Check 2:</strong> Bond linking adjacent amino acids:
          <div class="stage-check-line"></div>
        </div>
      </div>

      <!-- Stage 4 -->
      <div class="stage-card stage-4">
        <div>
          <div class="stage-card-header">
            <span class="stage-pill">Stage 4</span>
            <span class="stage-loc-tag">3D Folding & Shape</span>
          </div>
          <div class="stage-card-title">4. Protein Conformation</div>
          <div class="stage-icon-center">
            <div class="stage-icon-box">
              <img src="${icon4B64}" alt="Stage 4 Protein Folding">
            </div>
          </div>
          <div class="stage-section-title">Critical Principle</div>
          <ol class="stage-steps-list">
            <li><strong>Primary Sequence:</strong> Order of amino acids determines chemical R-group spacing.</li>
            <li><strong>3D Tertiary Folding:</strong> Hydrophobic core forms; ionic, H-, and disulfide bonds lock shape.</li>
            <li><strong>Active Geometry:</strong> Precise folding forms the specific catalytic active site.</li>
          </ol>
          <div class="stage-terms-wrap">
            <span class="stage-term-badge">Primary Structure</span>
            <span class="stage-term-badge">Tertiary Folding</span>
            <span class="stage-term-badge">Active Site</span>
          </div>
          <div class="stage-mini-box">
            <strong>Rule of Causality:</strong> <em>Structure strictly determines function!</em> Shape change = activity loss.
          </div>
        </div>
        <div class="stage-check-prompt">
          <strong>Check 1:</strong> What creates the active site?
          <div class="stage-check-line"></div>
          <strong>Check 2:</strong> Result if tertiary shape deforms:
          <div class="stage-check-line"></div>
        </div>
      </div>
    </div>

    <!-- Quick Check Prompt -->
    <div>
      <div class="page1-bottom-bar">
        <div class="bottom-bar-left">
          <div class="bottom-bar-title">&bull; Quick Retrieval Check: Architectural Protection</div>
          <p class="bottom-bar-text">Why does DNA remain inside the nucleus rather than travelling directly into the cytosol to ribosomes?</p>
        </div>
        <div class="bottom-bar-input">
          <span>Write response: </span>
        </div>
      </div>

      <!-- Footer -->
      <div class="page-footer" style="margin-top: 3.5px;">
        <div class="footer-left">
          <span>AAQ Human Biology &bull; Foundation Module</span>
          <span>Lesson 01: Welcome to Human Biology</span>
        </div>
        <div class="footer-right">Page 1 of 2 &bull; Process Architecture</div>
      </div>
    </div>
  </div>

  <!-- ============================================================
       PAGE 2: MOLECULAR CAUSALITY, MUTATION & EXAM MASTERY
       ============================================================ -->
  <div class="page">
    <div>
      <!-- Top Header Page 2 -->
      <div class="page-2-header">
        <div class="header-left">
          <span class="badge-course" style="color: #ea580c;">Pearson BTEC / AAQ Level 3 in Human Biology &bull; Lesson 01</span>
          <h2 class="header-title">Molecular Causality & Exam Mastery</h2>
          <p class="header-sub">The Critical Principle: How Genetic Alterations Disrupt 3D Conformation and Catalytic Activity</p>
        </div>
        <div class="header-right">
          <span class="tag-lesson" style="background: #ea580c;">Level 3 Application</span>
          <span class="tag-type" style="background: #ffedd5; color: #c2410c; border-color: #fdba74;">Exam Practice</span>
        </div>
      </div>

      <!-- Critical Principle Alert Box -->
      <div class="alert-mutation-box">
        <div class="alert-header">
          <div class="alert-badge">&bull; Altered Conformation: Critical Principle</div>
          <span class="alert-subtitle">Why Structure Strictly Dictates Function</span>
        </div>
        <p class="alert-body">
          Changing the genetic code (mutation) alters the <strong>mRNA codon</strong>, substituting a different amino acid into the polypeptide chain (<strong>primary structure</strong>). Different R-group chemical properties disrupt <strong>tertiary folding</strong> (hydrogen bonds, ionic bonds, disulfide bridges)—altering the 3D protein shape and disabling biological function (e.g. deforming the enzyme active site).
        </p>
      </div>

      <!-- 6-Step Causal Chain -->
      <div class="causal-section">
        <div class="causal-title">
          <span>&bull; The Level 3 Molecular Causality Chain (Memorise for Full Marks)</span>
          <span>Sequential Step-by-Step Mechanism</span>
        </div>
        <div class="causal-flow">
          <!-- Step 1 -->
          <div class="causal-step">
            <span class="step-num">STEP 01</span>
            <div class="step-heading">DNA Mutation</div>
            <div class="step-text">Base substitution alters triplet code sequence in the gene.</div>
          </div>
          <!-- Step 2 -->
          <div class="causal-step">
            <span class="step-num">STEP 02</span>
            <div class="step-heading">Altered mRNA</div>
            <div class="step-text">Transcription produces mRNA with an altered codon.</div>
          </div>
          <!-- Step 3 -->
          <div class="causal-step">
            <span class="step-num">STEP 03</span>
            <div class="step-heading">Different Amino Acid</div>
            <div class="step-text">tRNA delivers a substituted amino acid during translation.</div>
          </div>
          <!-- Step 4 -->
          <div class="causal-step step-fail">
            <span class="step-num">STEP 04</span>
            <div class="step-heading">R-Group Disruption</div>
            <div class="step-text">New R-group cannot form original ionic / hydrogen / disulfide bonds.</div>
          </div>
          <!-- Step 5 -->
          <div class="causal-step step-fail">
            <span class="step-num">STEP 05</span>
            <div class="step-heading">Altered Tertiary Shape</div>
            <div class="step-text">3D conformation folds abnormally, changing active site geometry.</div>
          </div>
          <!-- Step 6 -->
          <div class="causal-step step-fail">
            <span class="step-num">STEP 06</span>
            <div class="step-heading">Loss of Function</div>
            <div class="step-text">Substrate can no longer bind; zero enzyme-substrate complexes form!</div>
          </div>
        </div>
      </div>

      <!-- Tertiary Bonding Reference Matrix -->
      <div class="bonds-matrix-section">
        <div class="bond-card">
          <div class="bond-name">&bull; Disulfide Bridges</div>
          <div class="bond-rule">Covalent bonds between sulfur atoms in two cysteine R-groups. Strongest tertiary bond; stabilizes conformation.</div>
        </div>
        <div class="bond-card">
          <div class="bond-name">&bull; Ionic Bonds</div>
          <div class="bond-rule">Electrostatic attractions between oppositely charged R-groups (-NH<sub>3</sub><sup>+</sup> and -COO<sup>-</sup>). Easily broken by pH changes.</div>
        </div>
        <div class="bond-card">
          <div class="bond-name">&bull; Hydrogen Bonds</div>
          <div class="bond-rule">Numerous weak attractions between polar R-groups (e.g. -OH and -NH). Individually weak, collectively vital; heat sensitive.</div>
        </div>
        <div class="bond-card">
          <div class="bond-name">&bull; Hydrophobic Forces</div>
          <div class="bond-rule">Non-polar R-groups fold inwards away from aqueous cytoplasm, driving spontaneous 3D compact globular folding.</div>
        </div>
      </div>
    </div>

    <!-- Exam-Style Question Box -->
    <div class="exam-box">
      <div class="exam-header">
        <div class="exam-badge">&bull; Level 3 Exam Application Task</div>
        <div class="exam-marks">6 Marks &bull; High Yield Exam Question</div>
      </div>
      <div class="exam-prompt">
        <strong>Question:</strong> A patient carries a missense mutation involving a single base substitution in the gene encoding an essential metabolic enzyme. Explain step-by-step why this mutation causes the enzyme to lose its catalytic activity.
      </div>
      <div class="exam-lines-wrap">
        <div class="exam-line-group">
          <div class="exam-line-label"><span>1. Effect on transcription:</span> <span class="cue">(DNA triplet &rarr; mRNA codon) [1 Mark]</span></div>
          <div class="rule-line"></div>
        </div>
        <div class="exam-line-group">
          <div class="exam-line-label"><span>2. Primary structure & tRNA:</span> <span class="cue">(Substituted amino acid in chain) [1 Mark]</span></div>
          <div class="rule-line"></div>
        </div>
        <div class="exam-line-group">
          <div class="exam-line-label"><span>3. R-group chemical bonding:</span> <span class="cue">(Disrupted ionic, hydrogen, or disulfide bonds) [1 Mark]</span></div>
          <div class="rule-line"></div>
        </div>
        <div class="exam-line-group">
          <div class="exam-line-label"><span>4. 3D Tertiary folding:</span> <span class="cue">(Abnormal folding & altered active site cleft) [1 Mark]</span></div>
          <div class="rule-line"></div>
        </div>
        <div class="exam-line-group">
          <div class="exam-line-label"><span>5. Substrate complementarity:</span> <span class="cue">(Substrate no longer fits active site geometry) [1 Mark]</span></div>
          <div class="rule-line"></div>
        </div>
        <div class="exam-line-group">
          <div class="exam-line-label"><span>6. Biological & catalytic outcome:</span> <span class="cue">(Zero enzyme-substrate complexes & loss of function) [1 Mark]</span></div>
          <div class="rule-line"></div>
        </div>
      </div>
    </div>

    <!-- Self-Assessment Checklist & Examiner Bar -->
    <div>
      <div class="checklist-section">
        <div class="checklist-title">
          <span>&bull; Level 3 Examiner Mark Scheme Criteria (Tick Once Addressed in Your Answer)</span>
          <span>Self-Assessment Checklist</span>
        </div>
        <div class="checklist-grid">
          <div class="check-item"><div class="check-box"></div><span>Stated DNA mutation changes the transcribed mRNA codon.</span></div>
          <div class="check-item"><div class="check-box"></div><span>Stated different amino acid alters primary structure sequence.</span></div>
          <div class="check-item"><div class="check-box"></div><span>Named disrupted bonding (hydrogen, ionic, or disulfide bridges).</span></div>
          <div class="check-item"><div class="check-box"></div><span>Stated tertiary (3D) structure / conformation is altered.</span></div>
          <div class="check-item"><div class="check-box"></div><span>Explained active site is no longer complementary to substrate.</span></div>
          <div class="check-item"><div class="check-box"></div><span>Concluded no enzyme-substrate complexes form &rarr; loss of activity.</span></div>
        </div>
      </div>

      <div class="examiner-bar">
        <strong>Examiner's Top Tip for Distinction (Level 3):</strong> Never simply write "the protein doesn't work". Always link the chain: <em>Primary structure &rarr; R-group bonds &rarr; 3D tertiary conformation &rarr; active site complementarity &rarr; inability to form enzyme-substrate complexes</em>.
      </div>

      <!-- Footer Page 2 -->
      <div class="page-footer" style="margin-top: 3.5px;">
        <div class="footer-left">
          <span>AAQ Human Biology &bull; Foundation Module</span>
          <span>Lesson 01: Welcome to Human Biology</span>
        </div>
        <div class="footer-right">Page 2 of 2 &bull; Molecular Causality & Exam Mastery</div>
      </div>
    </div>
  </div>

</body>
</html>`;

  // Save HTML files
  const masterHtmlPath = path.join(handoutsDir, 'Central_Dogma_Student_Handout.html');
  const slideCompanionHtmlPath = path.join(handoutsDir, 'Central_Dogma_Slide_Companion.html');
  const completePackHtmlPath = path.join(handoutsDir, 'Central_Dogma_Complete_Student_Pack.html');

  const slideCompanionHtmlContent = await fs.readFile(slideCompanionHtmlPath, 'utf8');

  // Build combined pack HTML
  const completePackHtml = masterHtml.replace('</body>\n</html>', '') + `
  <!-- PAGE 3: Slide Companion Part 1 -->
  ${slideCompanionHtmlContent.slice(slideCompanionHtmlContent.indexOf('<div class="page">'), slideCompanionHtmlContent.lastIndexOf('</body>'))}
  </body>
</html>`;

  await fs.writeFile(masterHtmlPath, masterHtml, 'utf8');
  await fs.writeFile(completePackHtmlPath, completePackHtml, 'utf8');

  console.log('Saved all updated HTML files.');

  // Launch browser and render PDFs
  console.log('Rendering PDFs with Playwright Chrome channel...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  async function renderPdf(htmlPath, pdfName, previewPrefix) {
    const page = await browser.newPage();
    const fileUrl = 'file://' + htmlPath;
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    
    const pdfPath = path.join(handoutsDir, pdfName);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    console.log(`Generated ${pdfName}`);

    const pages = await page.$$('.page');
    console.log(`Found ${pages.length} pages in ${pdfName}`);
    for (let i = 0; i < pages.length; i++) {
      const shotPath = path.join(handoutsDir, `${previewPrefix}_page_${i + 1}.png`);
      await pages[i].screenshot({ path: shotPath });
      console.log(`  Saved preview: ${path.basename(shotPath)}`);
    }
    await page.close();
  }

  await renderPdf(masterHtmlPath, 'Central_Dogma_Student_Handout.pdf', 'master_handout');
  await renderPdf(slideCompanionHtmlPath, 'Central_Dogma_Slide_Companion.pdf', 'slide_companion');
  await renderPdf(completePackHtmlPath, 'Central_Dogma_Complete_Student_Pack.pdf', 'complete_pack');

  await browser.close();
  console.log('All PDF handouts rendered and updated successfully!');
}

buildAllHandouts().catch(err => {
  console.error('Error in buildAllHandouts:', err);
  process.exit(1);
});
