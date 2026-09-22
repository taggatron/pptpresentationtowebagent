import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve('.');
const deckDir = path.join(projectRoot, 'public/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere');
const examPdfDir = path.join(deckDir, 'assets/exam_pdf');
const downloadsDir = '/Users/danieltagg/Downloads';

async function imageToBase64(filePath) {
  const data = await fs.readFile(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

async function main() {
  await fs.mkdir(examPdfDir, { recursive: true });

  // Source images
  const qsImgPath = path.join(downloadsDir, 'atmosexamqs.png');
  const msImgPath = path.join(downloadsDir, 'atmosexamqsMS.png');

  const qsB64 = await imageToBase64(qsImgPath);
  const msB64 = await imageToBase64(msImgPath);

  // Copy source images into assets/exam_pdf for direct reference
  await fs.copyFile(qsImgPath, path.join(examPdfDir, 'atmosexamqs_original.png'));
  await fs.copyFile(msImgPath, path.join(examPdfDir, 'atmosexamqsMS_original.png'));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OCR Combined Science - Mars and Earth Atmosphere Question</title>
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
      padding: 16mm 18mm 14mm 18mm;
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
      padding-bottom: 10px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .exam-badge-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .ocr-pill {
      background: #1e3a8a;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .tier-pill {
      border: 1px solid #1e3a8a;
      color: #1e3a8a;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
    }

    .exam-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.01em;
    }

    .exam-subtitle {
      font-size: 11px;
      color: #4b5563;
      font-weight: 500;
      margin-top: 2px;
    }

    .header-right {
      text-align: right;
    }

    .mark-allocation {
      font-size: 14px;
      font-weight: 800;
      color: #b45309;
      background: #fef3c7;
      border: 1px solid #fde68a;
      padding: 3px 10px;
      border-radius: 6px;
      display: inline-block;
    }

    .target-grade {
      font-size: 10px;
      font-weight: 700;
      color: #4b5563;
      margin-top: 4px;
    }

    /* Candidate fields bar */
    .candidate-bar {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 7px 12px;
      font-size: 11px;
      margin-bottom: 14px;
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
      height: 12px;
    }

    /* Question Container */
    .question-box {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 14px;
      background: #ffffff;
      margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }

    .q-number-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }

    .q-num {
      background: #0f172a;
      color: #ffffff;
      font-size: 12px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 4px;
    }

    .q-prompt-title {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
    }

    .q-source-image-wrapper {
      text-align: center;
      margin: 4px 0 8px 0;
    }

    .q-source-image {
      max-width: 100%;
      height: auto;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }

    /* Answer Area */
    .answer-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-top: 4px;
    }

    .answer-guidance-pill {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      font-weight: 600;
      color: #475569;
      background: #f1f5f9;
      padding: 5px 10px;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .dotted-lines-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 2px 0;
    }

    .answer-dotted-line {
      width: 100%;
      border-bottom: 1px dotted #94a3b8;
      height: 22px;
      position: relative;
    }

    .mark-tag-bottom {
      text-align: right;
      font-size: 13px;
      font-weight: 800;
      color: #111827;
      margin-top: 6px;
    }

    /* Footer */
    .page-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #64748b;
    }

    /* --- PAGE 2: MARK SCHEME --- */
    .ms-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }

    .ms-grid-2col {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 14px;
      align-items: start;
    }

    .ms-original-crop {
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px;
      background: #f8fafc;
      text-align: center;
    }

    .ms-original-crop img {
      width: 100%;
      height: auto;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .ms-badge-title {
      font-size: 10.5px;
      font-weight: 700;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
      display: block;
    }

    .ms-points-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 14px;
    }

    .ms-points-title {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .ms-points-list {
      list-style: none;
      font-size: 10.5px;
      line-height: 1.45;
      color: #334155;
    }

    .ms-points-list li {
      position: relative;
      padding-left: 14px;
      margin-bottom: 4px;
    }

    .ms-points-list li::before {
      content: "•";
      position: absolute;
      left: 2px;
      color: #0284c7;
      font-weight: 800;
    }

    .levels-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      margin-top: 6px;
    }

    .levels-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 6px 10px;
      border-bottom: 1.5px solid #cbd5e1;
    }

    .levels-table td {
      padding: 6px 10px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
      line-height: 1.35;
    }

    .levels-table tr:last-child td {
      border-bottom: none;
    }

    .lvl-badge {
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
      white-space: nowrap;
    }

    .lvl-3 { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .lvl-2 { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .lvl-1 { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }

    .examiner-note-box {
      background: #eff6ff;
      border-left: 4px solid #0284c7;
      padding: 8px 12px;
      border-radius: 0 6px 6px 0;
      font-size: 10.5px;
      line-height: 1.4;
      color: #1e3a8a;
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
            <span class="tier-pill">GCSE Combined Science B</span>
            <span class="tier-pill">Higher / Foundation</span>
          </div>
          <h1 class="exam-title">The Earth and Mars: Atmospheric Evolution</h1>
          <p class="exam-subtitle">Topic B6: Global Challenges · Extended Response Assessment</p>
        </div>
        <div class="header-right">
          <span class="mark-allocation">6 Marks</span>
          <div class="target-grade">Target: Grades up to A / A*</div>
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
          <span class="q-prompt-title">Atmospheric composition and planetary evolution</span>
        </div>
        <div class="q-source-image-wrapper">
          <img class="q-source-image" src="${qsB64}" alt="Exam Question: Mars and Earth Atmosphere Comparison Table" />
        </div>
      </main>
    </div>

    <section class="answer-section">
      <div class="answer-guidance-pill">
        <span>✍️ In your answer, you should compare changes on both planets and give scientific reasons for changes on Earth.</span>
        <span style="color:#0284c7; font-weight:700; white-space: nowrap; margin-left: 12px;">[QER · 6 Marks]</span>
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
        <div class="answer-dotted-line"></div>
        <div class="answer-dotted-line"></div>
        <div class="answer-dotted-line"></div>
        <div class="answer-dotted-line"></div>
      </div>

      <div class="mark-tag-bottom">[6 Marks]</div>
    </section>

    <footer class="page-footer">
      <span>OCR GCSE Combined Science Practice Assessment</span>
      <span>Page 1 of 2</span>
      <span>Turn over for Mark Scheme ➔</span>
    </footer>
  </div>

  <!-- PAGE 2: OFFICIAL MARK SCHEME -->
  <div class="page" id="page2">
    <div>
      <header class="exam-header">
        <div>
          <div class="exam-badge-group">
            <span class="ocr-pill" style="background:#047857;">OCR TEACHER KEY</span>
            <span class="tier-pill" style="border-color:#047857; color:#047857;">Mark Scheme &amp; Guidance</span>
          </div>
          <h1 class="exam-title">Official Mark Scheme: Atmospheric Evolution</h1>
          <p class="exam-subtitle">Scoris Level-of-Response Assessment Criteria (Grades up to A / A*)</p>
        </div>
        <div class="header-right">
          <span class="mark-allocation" style="background:#ecfdf5; border-color:#a7f3d0; color:#047857;">Max 6 Marks</span>
          <div class="target-grade">Use L1, L2, L3 in Scoris</div>
        </div>
      </header>

      <div class="ms-container">
        <div class="ms-grid-2col">
          <!-- Left: Official Crop from Exam Board -->
          <div class="ms-original-crop">
            <span class="ms-badge-title">Official Exam Board Key</span>
            <img src="${msB64}" alt="Original OCR Mark Scheme Document" />
          </div>

          <!-- Right: Clear Categorized Breakdown -->
          <div class="ms-points-card">
            <div class="ms-points-title">
              <span>📋</span>
              <span>Indicative Scientific Points (Examiner Guidance)</span>
            </div>
            <ul class="ms-points-list">
              <li><strong>Mars changes:</strong> Percentage CO₂ increased (now 95%); water vapour decreased to trace amounts; some oxygen appeared (traces).</li>
              <li><strong>Water vapour removal:</strong> Water vapour disappeared from both Earth and Mars by condensation or freezing (Mars average -55 °C).</li>
              <li><strong>Earth changes:</strong> Percentage CO₂ decreased drastically (from ~95% to 0.04%); water vapour decreased; oxygen increased (to 21%).</li>
              <li><strong>Oceans formed:</strong> Water vapour condensed to form oceans as Earth cooled below 100 °C.</li>
              <li><strong>CO₂ dissolved:</strong> Carbon dioxide dissolved in oceans and formed insoluble carbonate precipitates/sedimentary rocks (e.g., limestone).</li>
              <li><strong>Biological terraforming:</strong> Algae and plants evolved; carried out photosynthesis, adding oxygen and removing CO₂.</li>
              <li><strong>Nitrogen accumulation:</strong> Lowering CO₂ and inertness of N₂ gave a much higher proportion of nitrogen (78%).</li>
            </ul>

            <div style="margin-top: 10px; padding: 6px 10px; background: #fefce8; border: 1px solid #fef08a; border-radius: 5px; font-size: 10px; color: #854d0e;">
              <strong>Special Examiner Acceptance:</strong> Accept statement that atmosphere on Mars is <em>very small / thin</em> compared to that on Earth.
            </div>
          </div>
        </div>

        <!-- Levels of Response Grid -->
        <table class="levels-table">
          <thead>
            <tr>
              <th style="width: 85px;">Level</th>
              <th style="width: 55px;">Marks</th>
              <th>Description of Student Performance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="lvl-badge lvl-3">Level 3</span></td>
              <td><strong>5–6</strong></td>
              <td>
                <strong>Comprehensive &amp; Detailed:</strong> Compares atmospheric changes on <em>both Mars and Earth</em>, and provides clear, correct scientific reasons for changes to Earth's atmosphere (oceans condensing, CO₂ dissolving/rocks, photosynthesis). Coherent, well-structured scientific argument with specialist terms used accurately.
              </td>
            </tr>
            <tr>
              <td><span class="lvl-badge lvl-2">Level 2</span></td>
              <td><strong>3–4</strong></td>
              <td>
                <strong>Sound Understanding:</strong> Describes changes to both atmospheres with at least one correct scientific reason given for Earth, OR explains reasons for changes on Earth with limited comparison to Mars. Communication is clear with some relevant scientific terminology.
              </td>
            </tr>
            <tr>
              <td><span class="lvl-badge lvl-1">Level 1</span></td>
              <td><strong>1–2</strong></td>
              <td>
                <strong>Basic / Limited:</strong> States one or two changes to the atmosphere of Mars or Earth (e.g., CO₂ decreased on Earth / increased on Mars / oxygen increased) without linking to reasons. Fragmented reasoning.
              </td>
            </tr>
            <tr>
              <td><span class="lvl-badge" style="background:#f1f5f9; color:#64748b;">Level 0</span></td>
              <td><strong>0</strong></td>
              <td>No creditworthy response.</td>
            </tr>
          </tbody>
        </table>

        <div class="examiner-note-box">
          <strong>⚠️ Scoris Annotation Instruction:</strong> Use the <strong>L1, L2, L3</strong> annotations in Scoris; <strong>do not use ticks</strong>. Award 6 marks for full comparison + mechanisms (oceans, carbonate rocks, photosynthesis, and temperature/freezing).
        </div>
      </div>
    </div>

    <footer class="page-footer">
      <span>OCR GCSE Combined Science Practice Assessment</span>
      <span>Page 2 of 2 (Mark Scheme)</span>
      <span>Official Examination Material</span>
    </footer>
  </div>

</body>
</html>`;

  const htmlPath = path.join(examPdfDir, 'mars_earth_exam_doc.html');
  await fs.writeFile(htmlPath, html, 'utf8');
  console.log('Saved exam document HTML to:', htmlPath);

  // Generate PDF via Playwright
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });

  const pdfPath = path.join(examPdfDir, 'ocr_atmosphere_checkpoint.pdf');
  const namedPdfPath = path.join(examPdfDir, 'ocr_mars_earth_atmosphere_exam.pdf');

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  await fs.copyFile(pdfPath, namedPdfPath);
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

  // Keep compatibility aliases
  await fs.copyFile(path.join(examPdfDir, 'page-1.png'), path.join(examPdfDir, 'slide_01.png'));
  await fs.copyFile(path.join(examPdfDir, 'page-2.png'), path.join(examPdfDir, 'slide_02.png'));

  console.log('Exported page-1.png and page-2.png at ultra-high resolution');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
