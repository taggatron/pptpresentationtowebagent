import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve('.');
const deckDir = path.join(projectRoot, 'public/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_analysis');
const examPdfDir = path.join(deckDir, 'assets/exam_pdf');
const uploadedPage1Path = path.join(projectRoot, 'scratch/uploaded_pdf/page-1.png');

async function imageToBase64(filePath) {
  const data = await fs.readFile(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

async function main() {
  await fs.mkdir(examPdfDir, { recursive: true });

  let page1ImgB64 = '';
  try {
    page1ImgB64 = await imageToBase64(uploadedPage1Path);
  } catch (err) {
    console.warn("Could not load uploaded page 1 png directly:", err.message);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OCR GCSE Science - Life Cycle Assessment of Smartphones: Evaluation & Mark Scheme (6 Marks)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #111827;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      height: 297mm;
      padding: 10mm 14mm 9mm 14mm;
      position: relative;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
      overflow: hidden;
    }

    /* Page Header */
    .exam-header {
      border-bottom: 2px solid #111827;
      padding-bottom: 5px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .exam-badge-group {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 3px;
    }

    .ocr-pill {
      background: #1e3a8a;
      color: #ffffff;
      font-size: 10.5px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .tier-pill {
      background: #f1f5f9;
      color: #334155;
      font-size: 10.5px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }

    .exam-title {
      font-size: 16.5px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin-bottom: 2px;
    }

    .exam-subtitle {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }

    .header-right {
      text-align: right;
    }

    .mark-allocation {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
      background: #f8fafc;
      padding: 2px 9px;
      border: 1.5px solid #0f172a;
      border-radius: 6px;
      display: inline-block;
    }

    .target-grade {
      font-size: 9px;
      font-weight: 700;
      color: #0369a1;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Candidate info bar */
    .candidate-bar {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 12px;
      padding: 4px 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      font-size: 10px;
      margin-bottom: 6px;
    }

    .candidate-field {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #475569;
    }

    .field-line {
      flex: 1;
      border-bottom: 1px dotted #94a3b8;
      height: 11px;
    }

    /* Question Box */
    .question-box {
      border: 1.5px solid #cbd5e1;
      border-radius: 7px;
      padding: 8px 12px;
      background: #ffffff;
      margin-bottom: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }

    .q-number-bar {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 5px;
    }

    .q-num {
      background: #0f172a;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      padding: 1.5px 6px;
      border-radius: 4px;
    }

    .q-prompt-title {
      font-size: 12px;
      font-weight: 700;
      color: #1e293b;
    }

    .intro-text {
      font-size: 11px;
      line-height: 1.4;
      color: #1e293b;
      margin-bottom: 6px;
    }

    /* Data Table Styling */
    .data-table-container {
      margin: 5px 0 6px 0;
      border: 1.5px solid #cbd5e1;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }

    .lca-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
      line-height: 1.32;
      background: #ffffff;
    }

    .lca-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      padding: 4px 6px;
      border-bottom: 1.5px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
      text-align: left;
      font-size: 9px;
      letter-spacing: 0.02em;
    }

    .lca-table th:last-child {
      border-right: none;
    }

    .lca-table th.center-col, .lca-table td.center-col {
      text-align: center;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .lca-table td {
      padding: 4px 6px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      vertical-align: top;
      color: #334155;
    }

    .lca-table td:last-child {
      border-right: none;
    }

    .lca-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }

    .stage-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 10px;
      display: block;
      margin-bottom: 1px;
    }

    .stage-desc-short {
      font-size: 9px;
      color: #475569;
      line-height: 1.25;
    }

    .stage-badge {
      display: inline-block;
      font-size: 8px;
      font-weight: 800;
      padding: 1px 4px;
      border-radius: 3px;
      margin-bottom: 2px;
      letter-spacing: 0.03em;
    }

    .badge-s1 { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .badge-s2 { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-s3 { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }
    .badge-s4 { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }

    .val-highlight {
      font-weight: 700;
      font-size: 10px;
      color: #0f172a;
    }

    .val-sub {
      font-size: 8px;
      color: #64748b;
      display: block;
      margin-top: 1px;
    }

    .total-row {
      background: #f1f5f9 !important;
      font-weight: 700;
      border-top: 1.5px solid #cbd5e1;
    }

    .total-row td {
      border-bottom: none;
      color: #0f172a;
      padding: 4px 6px;
    }

    .prompt-highlight {
      font-size: 11px;
      color: #0f172a;
      line-height: 1.38;
      margin-top: 5px;
      padding: 6px 10px;
      background: #eff6ff;
      border-left: 4px solid #0284c7;
      border-radius: 0 5px 5px 0;
    }

    .prompt-highlight strong {
      color: #0369a1;
      font-weight: 800;
    }

    .prompt-highlight ul {
      margin: 3px 0 0 16px;
      line-height: 1.35;
      font-size: 10.5px;
      color: #1e293b;
    }

    /* Answer Area */
    .answer-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-top: 2px;
    }

    .answer-guidance-pill {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      font-weight: 600;
      color: #475569;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 4px;
      margin-bottom: 4px;
      gap: 10px;
    }

    .dotted-lines-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1px 0;
    }

    .answer-dotted-line {
      width: 100%;
      border-bottom: 1px dotted #94a3b8;
      height: 18px;
      position: relative;
    }

    .mark-tag-bottom {
      text-align: right;
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      padding-top: 2px;
    }

    /* Page Footer */
    .page-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 4px;
      margin-top: 3px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94a3b8;
      font-weight: 500;
    }

    /* PAGE 2: MARK SCHEME */
    .ms-header {
      border-bottom: 2px solid #047857;
      padding-bottom: 5px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .ms-title {
      font-size: 16px;
      font-weight: 800;
      color: #064e3b;
      letter-spacing: -0.02em;
      margin-bottom: 2px;
    }

    .ms-tag {
      background: #ecfdf5;
      color: #047857;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 4px;
      border: 1px solid #a7f3d0;
      letter-spacing: 0.05em;
    }

    .levels-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
      border: 1.5px solid #cbd5e1;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 6px;
    }

    .levels-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 4px 7px;
      border-bottom: 1.5px solid #cbd5e1;
      font-size: 9.5px;
    }

    .levels-table td {
      padding: 4px 7px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
      line-height: 1.32;
    }

    .lvl-badge {
      font-weight: 800;
      padding: 1.5px 5px;
      border-radius: 3px;
      display: inline-block;
      white-space: nowrap;
      font-size: 9.5px;
    }

    .lvl-3 { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .lvl-2 { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .lvl-1 { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }

    .indicative-content-card {
      border: 1.5px solid #e2e8f0;
      border-radius: 5px;
      padding: 6px 9px;
      background: #ffffff;
      margin-bottom: 5px;
    }

    .indicative-title {
      font-size: 10.5px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stages-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      margin-bottom: 4px;
    }

    .stage-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 5px 7px;
    }

    .stage-name {
      font-size: 10px;
      font-weight: 800;
      color: #0369a1;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stage-desc {
      font-size: 9px;
      color: #334155;
      line-height: 1.3;
    }

    .stage-desc strong {
      color: #0f172a;
    }

    .evaluation-synthesis-card {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 4px;
      padding: 5px 7px;
      margin-top: 4px;
      font-size: 9px;
      color: #1e3a8a;
      line-height: 1.32;
    }

    .evaluation-synthesis-card strong {
      color: #1d4ed8;
      font-weight: 800;
    }

    .examiner-note-box {
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 5px 9px;
      border-radius: 0 4px 4px 0;
      font-size: 9px;
      line-height: 1.32;
      color: #064e3b;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: EXAM QUESTION PAPER -->
  <div class="page" id="page1">
    <div>
      <header class="exam-header">
        <div>
          <div class="exam-badge-group">
            <span class="ocr-pill">OCR</span>
            <span class="tier-pill">GCSE Science / Chemistry</span>
            <span class="tier-pill">Higher Tier (HT)</span>
          </div>
          <h1 class="exam-title">Life Cycle Assessment (LCA): Smartphone Evaluation</h1>
          <p class="exam-subtitle">Topic C6 / B6: Environmental Chemistry, Resource Security &amp; Sustainability</p>
        </div>
        <div class="header-right">
          <span class="mark-allocation">6 Marks</span>
          <div class="target-grade">Extended Response (QER)</div>
        </div>
      </header>

      <div class="candidate-bar">
        <div class="candidate-field">
          <span>Candidate Name:</span>
          <div class="field-line"></div>
        </div>
        <div class="candidate-field">
          <span>Class / Set:</span>
          <div class="field-line"></div>
        </div>
        <div class="candidate-field">
          <span>Date:</span>
          <div class="field-line"></div>
        </div>
      </div>

      <main class="question-box">
        <div class="q-number-bar">
          <span class="q-num">1</span>
          <span class="q-prompt-title">Comparative evaluation of smartphone life cycle stages</span>
        </div>

        <p class="intro-text">
          A life cycle assessment (LCA) is carried out to assess the environmental impacts and sustainability of a product throughout its entire lifespan from cradle to grave.
          The table below gives data on the relative energy consumed, greenhouse gases released, financial costs, and main environmental impacts for the four stages in the life cycle of a smartphone.
        </p>

        <!-- LCA Comparative Data Table -->
        <div class="data-table-container">
          <table class="lca-table">
            <thead>
              <tr>
                <th style="width: 25%;">Life Cycle Stage &amp; Key Processes</th>
                <th class="center-col" style="width: 14%;">Energy Used<br>(MJ)</th>
                <th class="center-col" style="width: 14%;">CO₂ Released<br>(kg CO₂e)</th>
                <th class="center-col" style="width: 13%;">Estimated Cost<br>(£ per device)</th>
                <th style="width: 34%;">Key Environmental &amp; Resource Impacts</th>
              </tr>
            </thead>
            <tbody>
              <!-- Stage 1 -->
              <tr>
                <td>
                  <span class="stage-badge badge-s1">Stage 1</span>
                  <span class="stage-title">Raw Materials</span>
                  <span class="stage-desc-short">Mining copper, gold, lithium; drilling crude oil for plastics; quarrying silica</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight">220</span>
                  <span class="val-sub">~23% of total</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight">18</span>
                  <span class="val-sub">Mining &amp; smelting</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight">£45</span>
                  <span class="val-sub">Precious metals</span>
                </td>
                <td>
                  Open-cast mining causes severe habitat destruction, deforestation, soil erosion, toxic acid mine drainage, and rapid depletion of finite non-renewable mineral reserves.
                </td>
              </tr>
              <!-- Stage 2 -->
              <tr>
                <td>
                  <span class="stage-badge badge-s2">Stage 2</span>
                  <span class="stage-title">Manufacturing &amp; Packaging</span>
                  <span class="stage-desc-short">Semiconductor chip etching, screen assembly, battery fabrication, packaging</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight" style="color:#b91c1c;">560</span>
                  <span class="val-sub" style="color:#b91c1c; font-weight:700;">~58% (Highest)</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight" style="color:#b91c1c;">46</span>
                  <span class="val-sub" style="color:#b91c1c; font-weight:700;">~57% (Highest)</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight" style="color:#b91c1c;">£180</span>
                  <span class="val-sub">Cleanrooms &amp; robotics</span>
                </td>
                <td>
                  Immense electricity consumption for cleanroom silicon lithography; emission of potent fluorinated greenhouse gases; industrial wastewater containing toxic chemical solvents.
                </td>
              </tr>
              <!-- Stage 3 -->
              <tr>
                <td>
                  <span class="stage-badge badge-s3">Stage 3</span>
                  <span class="stage-title">Product Use (3-Year Lifespan)</span>
                  <span class="stage-desc-short">Daily battery recharging via mains power grid (~1000 full recharge cycles)</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight">150</span>
                  <span class="val-sub">~16% of total</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight">12</span>
                  <span class="val-sub">Grid electricity</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight">£25</span>
                  <span class="val-sub">Electricity bills</span>
                </td>
                <td>
                  Recharging depends on fossil fuel combustion (gas/coal) at power stations releasing CO₂ into the atmosphere. Battery degradation reduces performance, driving early replacement.
                </td>
              </tr>
              <!-- Stage 4 -->
              <tr>
                <td>
                  <span class="stage-badge badge-s4">Stage 4</span>
                  <span class="stage-title">End-of-Life Disposal</span>
                  <span class="stage-desc-short">Option A: Municipal landfill dump<br>Option B: Dismantling &amp; metal recycling</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight">10 / 35</span>
                  <span class="val-sub">Landfill vs Recycling</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight">4 / 2</span>
                  <span class="val-sub">Net 2 kg if recycled</span>
                </td>
                <td class="center-col">
                  <span class="val-highlight">£5 / £15</span>
                  <span class="val-sub">Landfill vs Recycling</span>
                </td>
                <td>
                  <strong>Landfill:</strong> Toxic heavy metals (lead, arsenic, lithium) leach into soil and aquifers; non-biodegradable plastics persist.<br>
                  <strong>Recycling:</strong> Recovers scarce precious metals; avoids toxic runoff; offsets virgin mining.
                </td>
              </tr>
              <!-- Total Row -->
              <tr class="total-row">
                <td><strong>Total (Full Life Cycle)</strong></td>
                <td class="center-col"><strong>940 – 965 MJ</strong></td>
                <td class="center-col"><strong>76 – 80 kg CO₂e</strong></td>
                <td class="center-col"><strong>£255 – £265</strong></td>
                <td><em>Cumulative cradle-to-grave environmental and carbon footprint per smartphone</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="prompt-highlight">
          <strong>Evaluate the costs and environmental impacts associated with each of the four stages in the life cycle of a smartphone.</strong><br>
          In your answer you should:
          <ul>
            <li>Use data from the table to compare the <strong>energy consumed</strong> and <strong>CO₂ released</strong> across each stage.</li>
            <li>Evaluate the <strong>financial costs</strong> and <strong>environmental trade-offs</strong> at each stage, including disposal options.</li>
            <li>Give a <strong>justified conclusion</strong> stating which stage has the greatest overall impact and suggest how this could be reduced.</li>
          </ul>
        </div>
      </main>
    </div>

    <section class="answer-section">
      <div class="answer-guidance-pill">
        <span>✍️ Continuous prose: compare data (energy &amp; CO₂), weigh economic vs environmental trade-offs, and justify your conclusion.</span>
        <span style="color:#0284c7; font-weight:800; white-space:nowrap; flex-shrink:0;">[6 Marks]</span>
      </div>

      <div class="dotted-lines-area">
        <div class="answer-dotted-line"></div>
        <div class="answer-dotted-line"></div>
        <div class="answer-dotted-line"></div>
        <div class="answer-dotted-line"></div>
        <div class="answer-dotted-line"></div>
        <div class="answer-dotted-line"></div>
        <div class="answer-dotted-line"></div>
        <div class="answer-dotted-line"></div>
      </div>

      <div class="mark-tag-bottom">[Total: 6 marks]</div>
    </section>

    <footer class="page-footer">
      <span>OCR Gateway Science / Chemistry Specification Reference C6.2 / B6.3 · Higher Tier (HT)</span>
      <span>Page 1 of 2</span>
      <span>Turn Over For Mark Scheme ➔</span>
    </footer>
  </div>

  <!-- PAGE 2: MARK SCHEME -->
  <div class="page" id="page2">
    <div>
      <header class="ms-header">
        <div>
          <div class="exam-badge-group">
            <span class="ms-tag">MARK SCHEME</span>
            <span class="tier-pill">OCR GCSE Science</span>
            <span class="tier-pill">Higher Tier (HT)</span>
          </div>
          <h1 class="ms-title">Teacher Mark Scheme: 6-Mark Smartphone LCA Evaluation</h1>
          <p class="exam-subtitle">Assessment Objectives: AO1 (Demonstrate knowledge) · AO2 (Apply data &amp; analyze) · AO3 (Evaluate, conclude &amp; mitigate)</p>
        </div>
        <div class="header-right">
          <span class="mark-allocation" style="border-color:#047857; color:#047857; background:#ecfdf5;">Max: 6</span>
        </div>
      </header>

      <!-- Generic Level Descriptors Table -->
      <table class="levels-table">
        <thead>
          <tr>
            <th style="width: 17%;">Level (Marks)</th>
            <th style="width: 48%;">Generic Description</th>
            <th style="width: 35%;">Indicative Level Criteria</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="lvl-badge lvl-3">Level 3 (5–6)</span></td>
            <td>
              A comprehensive, well-structured evaluative response assessing both <strong>environmental impacts</strong> and <strong>costs</strong> across <strong>all four stages</strong> of the smartphone life cycle. Accurately uses and compares quantitative data (energy in MJ and CO₂ in kg) from the table. Thoroughly weighs up environmental and economic trade-offs (including disposal/recycling). Formulates a reasoned, justified conclusion identifying the stage with the greatest impact (manufacturing) and suggests plausible reduction strategies.
            </td>
            <td>
              • Evaluates all 4 stages (impacts &amp; costs).<br>
              • Compares numerical data for energy (MJ) &amp; CO₂ (kg).<br>
              • Evaluates end-of-life trade-offs (recycling vs landfill).<br>
              • Justified conclusion + realistic reduction strategies.<br>
              • Coherent scientific terminology and structured prose.
            </td>
          </tr>
          <tr>
            <td><span class="lvl-badge lvl-2">Level 2 (3–4)</span></td>
            <td>
              A sound evaluation covering at least <strong>two or three stages</strong>, or outlines all four stages with less depth. Includes some quantitative comparison of energy or CO₂ data from the table. Discusses environmental impacts or costs, with some awareness of trade-offs (e.g. recycling benefits or mining destruction). May provide a conclusion, but with weak justification or lacking reduction strategies.
            </td>
            <td>
              • Evaluates 2–3 stages, or superficial coverage of all 4.<br>
              • Quotes/compares some table data (e.g. manufacturing has highest energy/CO₂).<br>
              • Discusses impacts or costs with some trade-off analysis.<br>
              • Basic conclusion given without full justification.
            </td>
          </tr>
          <tr>
            <td><span class="lvl-badge lvl-1">Level 1 (1–2)</span></td>
            <td>
              Identifies some life cycle stages and quotes isolated data or makes simple, isolated descriptions of environmental impacts or costs. Little or no comparative evaluation, trade-off analysis, or justified conclusion.
            </td>
            <td>
              • Names 1–2 stages or quotes isolated numbers from the table.<br>
              • Simple recall statements without synthesis.<br>
              • No evaluation, trade-offs, or justified conclusion.
            </td>
          </tr>
          <tr>
            <td><span class="lvl-badge" style="background:#f1f5f9; color:#64748b; border:1px solid #cbd5e1;">0 marks</span></td>
            <td>No creditworthy response or content completely irrelevant.</td>
            <td>No relevant scientific content.</td>
          </tr>
        </tbody>
      </table>

      <!-- Indicative Scientific Content -->
      <div class="indicative-content-card">
        <div class="indicative-title">
          <span>📋</span>
          <span>Indicative Scientific Content (Evaluation of the 4 Stages, Costs, Impacts &amp; Data)</span>
        </div>

        <div class="stages-grid">
          <!-- Stage 1 -->
          <div class="stage-item">
            <div class="stage-name">
              <span>⛏️</span>
              <span>Stage 1: Raw Materials (220 MJ · 18 kg CO₂ · £45)</span>
            </div>
            <div class="stage-desc">
              <strong>Environmental Impacts:</strong> Open-cast mining for copper, gold, lithium, and rare earths causes habitat loss, deforestation, soil erosion, and acid mine drainage/toxic chemical runoff into river ecosystems. Drilling crude oil for polymers risks spills and depletes finite fossil reserves.<br>
              <strong>Cost &amp; Energy:</strong> High upfront purchasing costs (£45) due to mineral scarcity and global supply chains; smelting and purification require 220 MJ (23% of total).
            </div>
          </div>

          <!-- Stage 2 -->
          <div class="stage-item">
            <div class="stage-name">
              <span>🏭</span>
              <span>Stage 2: Manufacturing &amp; Packaging (560 MJ · 46 kg CO₂ · £180)</span>
            </div>
            <div class="stage-desc">
              <strong>Dominant Stage:</strong> Accounts for over 58% of energy and 57% of total greenhouse gas emissions (highest of all stages).<br>
              <strong>Environmental Impacts:</strong> Silicon wafer etching and cleanroom microchip fabrication demand massive electrical power; releases potent fluorinated gases and toxic solvent wastewater.<br>
              <strong>Cost:</strong> By far highest financial cost (£180, ~68% of total device cost) due to advanced micro-engineering, cleanrooms, precision robotics, and packaging.
            </div>
          </div>

          <!-- Stage 3 -->
          <div class="stage-item">
            <div class="stage-name">
              <span>📱</span>
              <span>Stage 3: Product Use Over 3 Years (150 MJ · 12 kg CO₂ · £25)</span>
            </div>
            <div class="stage-desc">
              <strong>Environmental Impacts:</strong> Charging phone daily draws electricity from the national grid; fossil fuels (coal/gas) burned in power stations release 12 kg CO₂ into the atmosphere, contributing to global warming. Battery capacity degrades over time.<br>
              <strong>Cost:</strong> Very cheap to consumer (~£8/year, £25 total over 3 years). This low financial running cost often blinds consumers to the hidden embodied environmental cost of manufacturing.
            </div>
          </div>

          <!-- Stage 4 -->
          <div class="stage-item">
            <div class="stage-name">
              <span>♻️</span>
              <span>Stage 4: Disposal Trade-offs (10–35 MJ · 2–4 kg CO₂ · £5–£15)</span>
            </div>
            <div class="stage-desc">
              <strong>Option A (Landfill - £5, 4 kg CO₂):</strong> Cheap upfront, but toxic heavy metals (lead, arsenic, lithium) leach into groundwater, polluting ecosystems; non-biodegradable plastics persist; scarce finite metals are permanently lost.<br>
              <strong>Option B (Recycling - £15, 35 MJ, net 2 kg CO₂):</strong> Requires collection/sorting energy and higher initial cost (£15), but recovers finite valuable metals, conserves virgin ores, prevents toxic leaching, and reduces future Stage 1 extraction impact.
            </div>
          </div>
        </div>

        <!-- Evaluative Synthesis Card -->
        <div class="evaluation-synthesis-card">
          <strong>🎯 Evaluative Conclusion &amp; Mitigation Strategies (Essential for Level 3):</strong><br>
          • <strong>Justified Judgment:</strong> Stage 2 (Manufacturing) has by far the most severe environmental and financial impact (560 MJ energy, 46 kg CO₂, £180 cost).<br>
          • <strong>Mitigation 1 (Extend Lifespan):</strong> Keeping phones for 5–6 years instead of 2–3 halves annual manufacturing impact.<br>
          • <strong>Mitigation 2 (Modular Design):</strong> Designing phones with easily replaceable batteries and screens (right to repair) prevents premature discarding.<br>
          • <strong>Mitigation 3 (Renewable Energy):</strong> Powering semiconductor factories and server centres with 100% renewable solar/wind energy.<br>
          • <strong>Mitigation 4 (Closed-Loop Recycling):</strong> Mandatory manufacturer buy-back schemes to replace virgin mined ores with recycled metals.
        </div>
      </div>

      <!-- Examiner Guidance Box -->
      <div class="examiner-note-box">
        <strong>Examiner Guidance &amp; Common Pitfalls:</strong><br>
        • <strong>Evaluate Command Word:</strong> Higher Tier Level 3 requires weighing up advantages/disadvantages, costs, and environmental impacts across all stages, backed by quantitative data, plus a supported conclusion. Mere description of data caps marks at Level 2.<br>
        • <strong>Quantitative Comparison:</strong> Candidates must compare specific values (e.g. manufacturing emits nearly 4× more CO₂ than use: 46 kg vs 12 kg).<br>
        • <strong>Economic vs Environmental Trade-offs:</strong> High marks require recognizing that the cheapest disposal option (landfill at £5) causes the greatest long-term ecological damage, whereas recycling (£15) conserves scarce finite resources.<br>
        • <strong>Transport:</strong> Transport occurs across all 4 stages and is embedded in the data (do NOT accept transport as a 5th stage).
      </div>
    </div>

    <footer class="page-footer">
      <span>OCR Gateway Science B (J257 / J247) · Specification Checkpoint C6.2 / B6.3</span>
      <span>Page 2 of 2 (Teacher Mark Scheme)</span>
      <span>Official Examination Material</span>
    </footer>
  </div>

</body>
</html>`;

  const htmlPath = path.join(examPdfDir, 'lifecycle_assessment_exam_doc.html');
  await fs.writeFile(htmlPath, html, 'utf8');
  console.log('Saved exam document HTML to:', htmlPath);

  // Generate PDF and PNGs via Playwright
  console.log('Launching browser to render PDF and high-res images...');
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });

  const pdfPath = path.join(examPdfDir, 'lifecycle_assessment_checkpoint.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  console.log('Generated PDF at:', pdfPath);

  // Render Page 1 and Page 2 as ultra-high-resolution PNGs
  const page1Element = await page.$('#page1');
  const page2Element = await page.$('#page2');

  await page1Element.screenshot({
    path: path.join(examPdfDir, 'page-1.png'),
    scale: 'device'
  });
  await page2Element.screenshot({
    path: path.join(examPdfDir, 'page-2.png'),
    scale: 'device'
  });

  console.log('Exported page-1.png and page-2.png at ultra-high resolution');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
