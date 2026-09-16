import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve('.');
const deckDir = path.join(projectRoot, 'public/decks/ecology_atmosphere_classic/Classic_Lesson_04_Nitrogen_Cycle');
const handoutsDir = path.join(deckDir, 'assets/handouts');

async function imageToBase64(filePath) {
  const data = await fs.readFile(filePath);
  const ext = path.extname(filePath).replace('.', '') || 'jpeg';
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${data.toString('base64')}`;
}

async function buildHandoutHtml() {
  const diagramPath = path.join(handoutsDir, 'gemini_nitrogen_cycle_diagram.jpg');
  const diagramB64 = await imageToBase64(diagramPath);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Nitrogen Cycle: Step-by-Step Mechanism — Student Handout</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
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
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #e2e8f0;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      margin: 0 auto;
      padding: 7mm 9.5mm 6mm 9.5mm;
      background: #ffffff;
      page-break-after: always;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Top Bar */
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2mm;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 8.5pt;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .badge-biology {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #047857;
    }

    .badge-teacher {
      background: #fef3c7;
      border: 1px solid #fde68a;
      color: #b45309;
    }

    .spec-tag {
      font-size: 8.5pt;
      font-weight: 600;
      color: #64748b;
    }

    /* Main Titles */
    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 2mm;
      margin-bottom: 2.5mm;
    }

    .title-left h1 {
      margin: 0;
      font-size: 15.5pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
    }

    .title-left p {
      margin: 1mm 0 0 0;
      font-size: 8.5pt;
      color: #475569;
      font-weight: 500;
    }

    .format-badge {
      background: #e0f2fe;
      border: 1px solid #bae6fd;
      color: #0369a1;
      font-size: 8pt;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 999px;
      white-space: nowrap;
    }

    /* Student Info Bar */
    .student-info-bar {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3mm;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 2mm 3.5mm;
      margin-bottom: 2.5mm;
      font-size: 8.5pt;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #475569;
      font-weight: 600;
    }

    .info-line {
      flex: 1;
      border-bottom: 1px dashed #94a3b8;
      height: 12px;
    }

    .score-box {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 1px 6px;
      font-weight: 700;
      color: #0284c7;
      text-align: center;
    }

    /* Task Box */
    .task-box {
      background: #f0f9ff;
      border-left: 3.5px solid #0284c7;
      border-radius: 0 6px 6px 0;
      padding: 2mm 3mm;
      margin-bottom: 2.5mm;
      font-size: 8.2pt;
      line-height: 1.35;
      color: #0c4a6e;
    }

    .task-box strong {
      color: #0369a1;
      font-weight: 700;
    }

    /* Diagram Section with Overlaid Targets */
    .diagram-container {
      position: relative;
      width: 100%;
      height: 98mm;
      background: #f1f5f9;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 2.5mm;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .diagram-img {
      width: 100%;
      height: 100%;
      object-fit: fill;
      display: block;
    }

    /* Overlay Target Boxes */
    .target-slot {
      position: absolute;
      background: rgba(255, 255, 255, 0.94);
      border: 2px dashed #0284c7;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
      border-radius: 6px;
      padding: 3px 6px;
      display: flex;
      align-items: center;
      gap: 5px;
      z-index: 10;
      backdrop-filter: blur(2px);
    }

    .target-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #0284c7;
      color: #ffffff;
      font-size: 9pt;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .target-title {
      font-size: 7.2pt;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.15;
    }

    .target-answer-slot {
      width: 24px;
      height: 20px;
      border: 1.5px solid #94a3b8;
      border-radius: 4px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8.5pt;
      font-weight: 800;
      color: #0284c7;
    }

    /* Positions for Student Handout Target Badges */
    .target-pos-1 {
      top: 32%;
      left: 12%;
    }

    .target-pos-2 {
      top: 14%;
      left: 54%;
    }

    .target-pos-3 {
      top: 56%;
      left: 64%;
    }

    .target-pos-4 {
      top: 76%;
      left: 77%;
    }

    /* Cards Grid */
    .cards-section-title {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 8.5pt;
      font-weight: 700;
      color: #334155;
      margin-bottom: 1.5mm;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 2.2mm;
      flex: 1;
      margin-bottom: 2mm;
    }

    .mechanism-card {
      background: #ffffff;
      border: 1.2px solid #cbd5e1;
      border-radius: 6px;
      padding: 2.2mm 2.8mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5mm;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 1mm;
    }

    .card-title-group {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .card-badge {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      font-weight: 800;
      color: #ffffff;
    }

    .badge-card-a { background: #3b82f6; }
    .badge-card-b { background: #10b981; }
    .badge-card-c { background: #f59e0b; }
    .badge-card-d { background: #8b5cf6; }

    .card-title {
      font-size: 8.4pt;
      font-weight: 700;
      color: #0f172a;
    }

    .card-match-box {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 7.5pt;
      font-weight: 700;
      color: #64748b;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 1.5px 5px;
      border-radius: 4px;
    }

    .match-slot-blank {
      display: inline-block;
      width: 18px;
      height: 16px;
      border-bottom: 1.5px solid #0284c7;
      text-align: center;
      font-weight: 800;
      color: #0284c7;
    }

    .card-body {
      font-size: 7.2pt;
      line-height: 1.35;
      color: #334155;
      margin: 0;
      padding-left: 3.5mm;
    }

    .card-body li {
      margin-bottom: 1mm;
    }

    .card-body li:last-child {
      margin-bottom: 0;
    }

    .card-body strong {
      color: #0f172a;
    }

    /* Bottom Bar */
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5mm;
      border-top: 1px solid #e2e8f0;
      font-size: 7.5pt;
      color: #64748b;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .chk-label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
    }

    .chk-box {
      width: 10px;
      height: 10px;
      border: 1px solid #94a3b8;
      border-radius: 2px;
      display: inline-block;
    }

    /* Page 2: Teacher Mark Scheme Styles */
    .ms-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.4pt;
      margin-bottom: 2.5mm;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }

    .ms-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 4px 6px;
      border-bottom: 1.5px solid #cbd5e1;
      font-size: 7.6pt;
    }

    .ms-table td {
      padding: 4px 6px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
      line-height: 1.3;
      color: #334155;
    }

    .ms-table tr:last-child td {
      border-bottom: none;
    }

    .ms-table tr:nth-child(even) {
      background: #f8fafc;
    }

    .target-tag {
      display: inline-block;
      padding: 1.5px 5px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 7pt;
      color: #ffffff;
    }

    .misconception-box {
      background: #fffbeb;
      border-left: 3.5px solid #f59e0b;
      border-radius: 0 6px 6px 0;
      padding: 2.2mm 3.5mm;
      font-size: 7.4pt;
      line-height: 1.35;
      color: #92400e;
    }

    .misconception-box h3 {
      margin: 0 0 1mm 0;
      font-size: 8.2pt;
      font-weight: 800;
      color: #b45309;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .misconception-list {
      margin: 0;
      padding-left: 3.5mm;
    }

    .misconception-list li {
      margin-bottom: 1mm;
    }

    .misconception-list li:last-child {
      margin-bottom: 0;
    }

    /* Solved Overlay Badges for Page 2 */
    .solved-badge {
      position: absolute;
      background: rgba(16, 185, 129, 0.96);
      border: 1.5px solid #059669;
      color: #ffffff;
      border-radius: 6px;
      padding: 2.5px 7px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.22);
      font-size: 7.2pt;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 5px;
      z-index: 10;
    }

    .solved-badge .match-pill {
      background: #ffffff;
      color: #047857;
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 800;
      font-size: 7pt;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1: STUDENT HANDOUT ==================== -->
  <div class="page" id="studentHandoutPage">
    <div>
      <!-- Top header bar -->
      <div class="header-top">
        <span class="badge-pill badge-biology">🌱 GCSE Biology · Ecology & Atmosphere</span>
        <span class="spec-tag">OCR Gateway B7.1 / AQA 4.7 · Slide 7 Mechanism</span>
      </div>

      <!-- Main Title -->
      <div class="title-row">
        <div class="title-left">
          <h1>The Nitrogen Cycle: Step-by-Step Mechanism</h1>
          <p>Match the simplified mechanism cards to their correct numbered stages on the cycle</p>
        </div>
        <span class="format-badge">Student Handout · Printable A4</span>
      </div>

      <!-- Student Credentials -->
      <div class="student-info-bar">
        <div class="info-item">Name: <div class="info-line"></div></div>
        <div class="info-item">Date: <div class="info-line"></div></div>
        <div class="info-item">Class: <div class="info-line"></div></div>
        <div class="info-item">Score: <div class="score-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 4</div></div>
      </div>

      <!-- Instructions Box -->
      <div class="task-box">
        <strong>🎯 Instructions:</strong> Study the Gemini Nitrogen Cycle diagram below. The four circular mechanism cards from Slide 7 have been simplified into Cards A, B, C, and D below. Match each Card to its correct numbered target zone (<strong>[1]</strong>, <strong>[2]</strong>, <strong>[3]</strong>, or <strong>[4]</strong>) on the diagram. Write the matching Card Letter in the target box on the diagram, or write the Target Number on each card.
      </div>

      <!-- Overlaid Diagram -->
      <div class="diagram-container">
        <img class="diagram-img" src="${diagramB64}" alt="The Nitrogen Cycle Gemini Illustration" />

        <!-- Target Zone 1: Fixation -->
        <div class="target-slot target-pos-1">
          <div class="target-num">1</div>
          <div class="target-title">Target 1<br><span style="font-size:6.2pt;color:#64748b;">Air to Soil</span></div>
          <div class="target-answer-slot"></div>
        </div>

        <!-- Target Zone 2: Assimilation & Feeding -->
        <div class="target-slot target-pos-2">
          <div class="target-num">2</div>
          <div class="target-title">Target 2<br><span style="font-size:6.2pt;color:#64748b;">Soil to Life</span></div>
          <div class="target-answer-slot"></div>
        </div>

        <!-- Target Zone 3: Decomposition -->
        <div class="target-slot target-pos-3">
          <div class="target-num">3</div>
          <div class="target-title">Target 3<br><span style="font-size:6.2pt;color:#64748b;">Death to Ammonia</span></div>
          <div class="target-answer-slot"></div>
        </div>

        <!-- Target Zone 4: Nitrification & Denitrification -->
        <div class="target-slot target-pos-4">
          <div class="target-num">4</div>
          <div class="target-title">Target 4<br><span style="font-size:6.2pt;color:#64748b;">Recycling & Loss</span></div>
          <div class="target-answer-slot"></div>
        </div>
      </div>

      <!-- Mechanism Cards Section Header -->
      <div class="cards-section-title">
        <span>🃏 Simplified Slide 7 Mechanism Cards (A – D)</span>
      </div>

      <!-- 2x2 Mechanism Cards Grid -->
      <div class="cards-grid">
        <!-- Card A -->
        <div class="mechanism-card">
          <div class="card-header">
            <div class="card-title-group">
              <span class="card-badge badge-card-a">A</span>
              <span class="card-title">Fixation (Air to Soil)</span>
            </div>
            <div class="card-match-box">Match Target: <span class="match-slot-blank"></span></div>
          </div>
          <ul class="card-body">
            <li><strong>Nitrogen-fixing bacteria:</strong> Found free in soil or in root nodules of legumes (peas/clover); convert unreactive N₂ gas into nitrates.</li>
            <li><strong>Lightning:</strong> Provides high electrical energy forcing atmospheric N₂ to react with oxygen, forming nitrates washed into soil.</li>
          </ul>
        </div>

        <!-- Card B -->
        <div class="mechanism-card">
          <div class="card-header">
            <div class="card-title-group">
              <span class="card-badge badge-card-b">B</span>
              <span class="card-title">Assimilation & Feeding (Soil to Life)</span>
            </div>
            <div class="card-match-box">Match Target: <span class="match-slot-blank"></span></div>
          </div>
          <ul class="card-body">
            <li><strong>Plant Uptake:</strong> Plant roots absorb dissolved nitrates (NO₃⁻) from soil via active transport to synthesize amino acids & proteins.</li>
            <li><strong>Feeding:</strong> Animals consume plants, digesting and absorbing nitrogenous compounds to build their own animal proteins.</li>
          </ul>
        </div>

        <!-- Card C -->
        <div class="mechanism-card">
          <div class="card-header">
            <div class="card-title-group">
              <span class="card-badge badge-card-c">C</span>
              <span class="card-title">Decomposition (Death to Ammonia)</span>
            </div>
            <div class="card-match-box">Match Target: <span class="match-slot-blank"></span></div>
          </div>
          <ul class="card-body">
            <li><strong>Waste & Mortality:</strong> Plants and animals eventually die; animals also excrete nitrogen-rich urea and faeces during life.</li>
            <li><strong>Decomposers:</strong> Bacteria and fungi break down dead protein and waste (ammonification), releasing ammonia / ammonium into soil.</li>
          </ul>
        </div>

        <!-- Card D -->
        <div class="mechanism-card">
          <div class="card-header">
            <div class="card-title-group">
              <span class="card-badge badge-card-d">D</span>
              <span class="card-title">Nitrification & Denitrification</span>
            </div>
            <div class="card-match-box">Match Target: <span class="match-slot-blank"></span></div>
          </div>
          <ul class="card-body">
            <li><strong>Nitrification:</strong> Nitrifying bacteria in aerobic soil oxidize toxic ammonia → nitrites (NO₂⁻) → nitrates (NO₃⁻) usable by plants.</li>
            <li><strong>Denitrification:</strong> In waterlogged, anaerobic soil, denitrifying bacteria convert nitrates back into N₂ gas, reducing soil fertility.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Footer Bar -->
    <div class="footer-bar">
      <div class="checkbox-group">
        <span>Self-Assessment:</span>
        <label class="chk-label"><span class="chk-box"></span> Needs Review</label>
        <label class="chk-label"><span class="chk-box"></span> Got It</label>
        <label class="chk-label"><span class="chk-box"></span> Can Teach It</label>
      </div>
      <div>Teacher Checked: <span class="chk-box"></span></div>
      <div>Classic Ecology · Lesson 4 (Slide 7)</div>
    </div>
  </div>

  <!-- ==================== PAGE 2: TEACHER ANSWER KEY & MARK SCHEME ==================== -->
  <div class="page" id="teacherAnswerPage">
    <div>
      <!-- Top header bar -->
      <div class="header-top">
        <span class="badge-pill badge-teacher">🎓 Teacher Answer Key & OCR/AQA Mark Scheme</span>
        <span class="spec-tag">Max Score: 4 Marks · 1 Mark Per Stage</span>
      </div>

      <!-- Main Title -->
      <div class="title-row">
        <div class="title-left">
          <h1>The Nitrogen Cycle Mechanism — Teacher Answer Key</h1>
          <p>Official OCR Gateway B7.1 criteria, bacterial roles, and common examiner distinctions</p>
        </div>
        <span class="format-badge" style="background:#fef3c7;border-color:#fde68a;color:#b45309;">Mark Scheme & Misconceptions</span>
      </div>

      <!-- Diagram with Solved Badges -->
      <div class="diagram-container" style="height: 82mm; margin-bottom: 2mm;">
        <img class="diagram-img" src="${diagramB64}" alt="The Nitrogen Cycle Gemini Illustration" />

        <!-- Target 1: Card A -->
        <div class="solved-badge" style="top: 30%; left: 12%;">
          <span class="match-pill">TARGET 1 = CARD A</span>
          <span>Fixation (Air to Soil)</span>
        </div>

        <!-- Target 2: Card B -->
        <div class="solved-badge" style="top: 14%; left: 52%;">
          <span class="match-pill">TARGET 2 = CARD B</span>
          <span>Assimilation & Feeding</span>
        </div>

        <!-- Target 3: Card C -->
        <div class="solved-badge" style="top: 56%; left: 63%;">
          <span class="match-pill">TARGET 3 = CARD C</span>
          <span>Decomposition (Death to Ammonia)</span>
        </div>

        <!-- Target 4: Card D -->
        <div class="solved-badge" style="top: 76%; left: 75%;">
          <span class="match-pill">TARGET 4 = CARD D</span>
          <span>Nitrification & Denitrification</span>
        </div>
      </div>

      <!-- Mark Scheme Table -->
      <table class="ms-table">
        <thead>
          <tr>
            <th style="width:11%">Target</th>
            <th style="width:11%">Match</th>
            <th style="width:23%">Mechanism Stage & Chemistry</th>
            <th style="width:25%">Microorganism / Physical Agent</th>
            <th style="width:30%">Examiner Guidance & Criteria</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Target 1</strong></td>
            <td><span class="target-tag badge-card-a">Card A</span></td>
            <td><strong>Nitrogen Fixation</strong><br>N₂ gas in air (78%) → Nitrates (NO₃⁻) / Ammonia in soil.</td>
            <td>• <em>Rhizobium</em> in legume root nodules.<br>• Free-living soil bacteria.<br>• Lightning electrical discharge.</td>
            <td><strong>1 Mark:</strong> Must reference conversion of atmospheric nitrogen gas into a soluble form (nitrates/ammonium) that can enter soil.</td>
          </tr>
          <tr>
            <td><strong>Target 2</strong></td>
            <td><span class="target-tag badge-card-b">Card B</span></td>
            <td><strong>Assimilation & Feeding</strong><br>Soil nitrates → Plant protein → Animal protein.</td>
            <td>• Crop/legume root hair cells.<br>• Herbivorous / omnivorous animals (cow grazing).</td>
            <td><strong>1 Mark:</strong> Must specify plant root uptake (active transport) for protein synthesis followed by consumer feeding/digestion.</td>
          </tr>
          <tr>
            <td><strong>Target 3</strong></td>
            <td><span class="target-tag badge-card-c">Card C</span></td>
            <td><strong>Decomposition (Ammonification)</strong><br>Organic proteins / Urea → Ammonia (NH₃/NH₄⁺).</td>
            <td>• Saprobiontic fungi.<br>• Decomposing bacteria.<br>• Animal excretion (urea, faeces).</td>
            <td><strong>1 Mark:</strong> Decomposers break down nitrogen-rich organic waste & biomass, returning nitrogen to soil as ammonia/ammonium.</td>
          </tr>
          <tr>
            <td><strong>Target 4</strong></td>
            <td><span class="target-tag badge-card-d">Card D</span></td>
            <td><strong>Nitrification & Denitrification</strong><br>Nitrification: NH₄⁺ → NO₂⁻ → NO₃⁻.<br>Denitrification: NO₃⁻ → N₂ gas.</td>
            <td>• Nitrifying bacteria (<em>Nitrosomonas</em> & <em>Nitrobacter</em> in aerated soil).<br>• Denitrifying bacteria (<em>Pseudomonas</em> in anaerobic soil).</td>
            <td><strong>1 Mark:</strong> Both processes required: recycling toxic ammonia into nitrates (aerobic) AND loss of nitrates back to atmosphere as N₂ (anaerobic).</td>
          </tr>
        </tbody>
      </table>

      <!-- Examiner Guidance & Key Misconceptions -->
      <div class="misconception-box">
        <h3>⚠️ Critical GCSE Biology Misconceptions & Examiner Traps:</h3>
        <ul class="misconception-list">
          <li><strong>Trap 1: Confusing Nitrogen-Fixing with Nitrifying Bacteria:</strong> Nitrogen-fixing bacteria convert unreactive atmospheric <strong>N₂ gas into nitrates/ammonia</strong> (Stage 1). Nitrifying bacteria convert <strong>soil ammonia into nitrites and nitrates</strong> (Stage 4). Never award marks if these roles are interchanged.</li>
          <li><strong>Trap 2: Why Plants Cannot Absorb Atmospheric N₂:</strong> Nitrogen gas consists of diatomic molecules held by an extremely strong <strong>covalent triple bond (N≡N)</strong>. Plants lack the enzymes to break this bond; they can only absorb soluble nitrate ions (NO₃⁻) dissolved in water through root hair cells.</li>
          <li><strong>Trap 3: Denitrification Condition:</strong> Denitrifying bacteria are <strong>anaerobic</strong>; they thrive in waterlogged, compacted, poorly drained soils where oxygen is scarce, stripping oxygen from nitrates and releasing N₂ gas back into the atmosphere (reducing crop yield).</li>
        </ul>
      </div>
    </div>

    <!-- Footer Bar -->
    <div class="footer-bar">
      <div>Official OCR Gateway B7.1b & AQA 4.7.4 Specification Mark Scheme</div>
      <div>Classic Ecology · Lesson 4 (Nitrogen Cycle) · Slide 7 Handout Key</div>
    </div>
  </div>

</body>
</html>
`;
}

async function run() {
  console.log('Generating Nitrogen Cycle Student Handout HTML...');
  const html = await buildHandoutHtml();
  const htmlPath = path.join(handoutsDir, 'nitrogen_cycle_mechanism_handout.html');
  await fs.writeFile(htmlPath, html, 'utf8');
  console.log('Saved HTML to:', htmlPath);

  console.log('Launching Chrome to render PDF and preview PNGs...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 2 });

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });

  // Generate PDF
  const pdfPath = path.join(handoutsDir, 'nitrogen_cycle_mechanism_handout.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  console.log('Generated PDF:', pdfPath);

  // Capture Page 1 PNG (Student Handout)
  const page1El = await page.$('#studentHandoutPage');
  const page1PngPath = path.join(handoutsDir, 'page-1.png');
  await page1El.screenshot({ path: page1PngPath });
  console.log('Generated Page 1 PNG:', page1PngPath);

  // Capture Page 2 PNG (Teacher Answer Key)
  const page2El = await page.$('#teacherAnswerPage');
  const page2PngPath = path.join(handoutsDir, 'page-2.png');
  await page2El.screenshot({ path: page2PngPath });
  console.log('Generated Page 2 PNG:', page2PngPath);

  await browser.close();
  console.log('All handout assets generated successfully!');
}

run().catch(err => {
  console.error('Handout generation failed:', err);
  process.exit(1);
});
