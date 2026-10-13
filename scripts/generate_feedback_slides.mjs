import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const COMMON_CSS = `
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
      linear-gradient(to right, rgba(160, 150, 130, 0.14) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(160, 150, 130, 0.14) 1px, transparent 1px);
    background-size: 24px 24px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    position: relative;
  }

  .outer-frame {
    position: absolute;
    top: 24px;
    left: 28px;
    right: 28px;
    bottom: 24px;
    border: 1.5px solid #242c3d;
    border-radius: 14px;
    background: rgba(254, 253, 250, 0.92);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    padding: 24px 34px 22px 34px;
    overflow: hidden;
  }

  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    padding-bottom: 12px;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pill-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    width: fit-content;
  }

  .pill-emerald {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #047857;
  }

  .pill-amber {
    background: #fffbeb;
    border: 1px solid #fde68a;
    color: #b45309;
  }

  .slide-title {
    font-family: 'Outfit', 'Inter', sans-serif;
    font-size: 30px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.6px;
    line-height: 1.15;
  }

  .slide-subtitle {
    font-size: 14.5px;
    color: #475569;
    font-weight: 500;
  }

  .header-tag {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 6px 12px;
    text-align: right;
    font-size: 11.5px;
    color: #334155;
    font-weight: 600;
    line-height: 1.35;
  }
`;

const SLIDE_FEEDBACK_WWW_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${COMMON_CSS}

    .main-grid {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 12px;
    }

    .feedback-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 18px 22px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
    }

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1.5px solid #f1f5f9;
    }

    .card-icon-box {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 800;
    }

    .icon-emerald { background: #d1fae5; color: #047857; }
    .icon-blue { background: #dbeafe; color: #1d4ed8; }

    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 19px;
      font-weight: 700;
      color: #0f172a;
    }

    .bullet-list {
      display: flex;
      flex-direction: column;
      gap: 11px;
      flex: 1;
    }

    .bullet-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13.5px;
      line-height: 1.45;
      color: #334155;
    }

    .bullet-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
    }

    .dot-emerald { background: #10b981; }
    .dot-blue { background: #2563eb; }

    .bullet-item strong {
      color: #0f172a;
      font-weight: 700;
    }

    .pathway-banner {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 7px 12px;
      font-family: 'Outfit', sans-serif;
      font-size: 12.5px;
      font-weight: 700;
      color: #166534;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .pathway-arrow {
      color: #22c55e;
      font-weight: 900;
    }

    .bottom-summary-bar {
      background: #eff6ff;
      border: 1.5px solid #bfdbfe;
      border-radius: 10px;
      padding: 10px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .summary-badge {
      background: #1d4ed8;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 4px 10px;
      border-radius: 6px;
      white-space: nowrap;
    }

    .summary-text {
      font-size: 13px;
      color: #1e3a8a;
      line-height: 1.4;
    }

    .summary-text strong {
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="outer-frame">
    <!-- Header -->
    <div class="slide-header">
      <div class="header-left">
        <div class="pill-badge pill-emerald">
          <span>✓ Assessment Review • Mini-Mock NEA (Gene Expression & mRNA Vaccines)</span>
        </div>
        <h1 class="slide-title">Whole-Class Feedback: What Went Well</h1>
        <p class="slide-subtitle">Secure understanding of molecular gene expression and foundational clinical-trial methodology</p>
      </div>
      <div class="header-tag">
        <div><strong>Assessment Focus:</strong> Unit F172 NEA</div>
        <div style="color: #059669;">Criteria: P1, P2, P3, P4, M1</div>
      </div>
    </div>

    <!-- Main 2-Column Grid -->
    <div class="main-grid">
      <!-- Left Card: Biological Understanding -->
      <div class="feedback-card">
        <div class="card-title-row">
          <div class="card-icon-box icon-emerald">🧬</div>
          <h2 class="card-title">Strong Biological Understanding</h2>
        </div>

        <div class="pathway-banner">
          <span>DNA</span> <span class="pathway-arrow">→</span>
          <span>Transcription</span> <span class="pathway-arrow">→</span>
          <span>mRNA</span> <span class="pathway-arrow">→</span>
          <span>Ribosome Translation</span> <span class="pathway-arrow">→</span>
          <span>Amino Acid Sequence</span> <span class="pathway-arrow">→</span>
          <span>Protein</span>
        </div>

        <div class="bullet-list" style="margin-top: 10px;">
          <div class="bullet-item">
            <div class="bullet-dot dot-emerald"></div>
            <div>
              <strong>Cytoplasmic Translation:</strong> Most learners accurately explained that vaccine mRNA is translated exclusively in the cytoplasm by ribosomes, requiring <em>no nuclear entry</em> and causing <em>zero alteration to genomic DNA</em>.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-emerald"></div>
            <div>
              <strong>Unprotected mRNA Instability:</strong> Strong scientific justifications for why naked mRNA cannot be administered: rapid enzymatic degradation by circulating <em>RNases</em>, physiological instability, large molecular size, and negative electrostatic charge.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-emerald"></div>
            <div>
              <strong>Lipid Nanoparticles (LNPs):</strong> Highly effective explanations linking LNPs to protecting labile mRNA, facilitating cellular endocytosis across the phospholipid membrane, and releasing functional transcripts into cytosol.
            </div>
          </div>
        </div>
      </div>

      <!-- Right Card: Clinical Trial Evidence -->
      <div class="feedback-card">
        <div class="card-title-row">
          <div class="card-icon-box icon-blue">📊</div>
          <h2 class="card-title">Good Use of Clinical-Trial Evidence</h2>
        </div>

        <div class="bullet-list">
          <div class="bullet-item">
            <div class="bullet-dot dot-blue"></div>
            <div>
              <strong>Rigorous Trial Design Features:</strong> Learners successfully identified gold-standard trial parameters: <em>large sample sizes</em> (tens of thousands), <em>random allocation</em>, <em>placebo controls</em>, and <em>double-blinding</em> to minimise bias.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-blue"></div>
            <div>
              <strong>Quantitative Efficacy Verification:</strong> Frequent and accurate use of infection rate disparities between vaccinated and placebo cohorts to substantiate strong conclusions regarding short-term vaccine efficacy.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-blue"></div>
            <div>
              <strong>Association vs Causation:</strong> High-performing scripts recognised that an adverse medical event occurring sequentially <em>after</em> vaccination does not automatically establish physiological <em>causation</em>.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-blue"></div>
            <div>
              <strong>Balanced Critical Appraisal:</strong> Multiple responses effectively weighed strong primary efficacy evidence against inherent trial limitations (restricted longitudinal follow-up and low statistical power for ultra-rare adverse events).
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Summary Bar -->
    <div class="bottom-summary-bar">
      <div class="summary-badge">Teacher Evaluation</div>
      <div class="summary-text">
        <strong>Assessment Takeaway:</strong> Biological comprehension of transcription, translation, and vector delivery is secure across the cohort. The key progression step is translating this descriptive mastery into <strong>evidence-led analysis and critical evaluation (P3, P4, M2, D2)</strong>.
      </div>
    </div>
  </div>
</body>
</html>
`;

const SLIDE_FEEDBACK_EBI_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${COMMON_CSS}

    .main-grid {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1.15fr 0.95fr;
      gap: 16px;
      margin-bottom: 10px;
    }

    .ebi-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
    }

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 9px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1.5px solid #f1f5f9;
    }

    .card-icon-box {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
    }

    .icon-amber { background: #fef3c7; color: #b45309; }
    .icon-indigo { background: #e0e7ff; color: #4338ca; }
    .icon-teal { background: #ccfbf1; color: #0f766e; }

    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 16.5px;
      font-weight: 700;
      color: #0f172a;
    }

    .bullet-list {
      display: flex;
      flex-direction: column;
      gap: 9px;
      flex: 1;
    }

    .bullet-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 12.8px;
      line-height: 1.42;
      color: #334155;
    }

    .bullet-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
    }

    .dot-amber { background: #f59e0b; }
    .dot-indigo { background: #6366f1; }
    .dot-teal { background: #14b8a6; }

    .bullet-item strong {
      color: #0f172a;
      font-weight: 700;
    }

    /* Scaffold Steps in Centre Card */
    .scaffold-box {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 10px;
    }

    .scaffold-step {
      display: flex;
      align-items: baseline;
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 5px 8px;
      font-size: 12px;
      line-height: 1.35;
    }

    .scaffold-tag {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 11px;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .tag-e { background: #dbeafe; color: #1e40af; }
    .tag-x { background: #ede9fe; color: #5b21b6; }
    .tag-l { background: #fee2e2; color: #991b1b; }
    .tag-j { background: #dcfce7; color: #166534; }

    .exemplar-quote {
      background: #faf5ff;
      border-left: 3px solid #8b5cf6;
      border-radius: 0 8px 8px 0;
      padding: 8px 10px;
      font-size: 11.5px;
      line-height: 1.4;
      color: #4c1d95;
      font-style: italic;
    }

    .criteria-badges {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 4px;
    }

    .crit-pill {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 10.5px;
      font-weight: 700;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="outer-frame">
    <!-- Header -->
    <div class="slide-header">
      <div class="header-left">
        <div class="pill-badge pill-amber">
          <span>Target for Excellence • Moving to Merit & Distinction (P3, P4, M2, D1–D2)</span>
        </div>
        <h1 class="slide-title">Whole-Class Feedback: Even Better If</h1>
        <p class="slide-subtitle">Advancing from descriptive narrative to evidence-led analysis, scientific precision, and academic referencing</p>
      </div>
      <div class="header-tag">
        <div><strong>Key NEA Thresholds:</strong></div>
        <div style="color: #b45309;">M2 Analysis · D2 Judgement</div>
      </div>
    </div>

    <!-- 3-Column Grid -->
    <div class="main-grid">
      <!-- Column 1: Scientific Precision -->
      <div class="ebi-card">
        <div class="card-title-row">
          <div class="card-icon-box icon-amber">🎯</div>
          <h2 class="card-title">Scientific Precision</h2>
        </div>

        <div class="bullet-list">
          <div class="bullet-item">
            <div class="bullet-dot dot-amber"></div>
            <div>
              <strong>Transcription vs Translation:</strong> Clearly distinguish nuclear DNA transcription from cytoplasmic translation of vaccine mRNA.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-amber"></div>
            <div>
              <strong>Base-Pairing Location:</strong> tRNA anticodons align with complementary <em>codons on mRNA</em>, never with genomic DNA.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-amber"></div>
            <div>
              <strong>Exact Chemical Terms:</strong> Routinely use <em>transcribed</em>, <em>amino-acid sequence</em>, <em>peptide bonds</em>, and <em>clinical efficacy</em>.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-amber"></div>
            <div>
              <strong>Critical Epistemology:</strong> Never state a trial 'eliminates' chance or bias. Say trial design <em>minimises bias</em> and makes chance a <em>substantially less probable explanation</em>.
            </div>
          </div>
        </div>
      </div>

      <!-- Column 2: Analysis & Evaluation (The 4-Step Framework) -->
      <div class="ebi-card">
        <div class="card-title-row">
          <div class="card-icon-box icon-indigo">⚖️</div>
          <h2 class="card-title">Analysis & Evaluation (M2/D2)</h2>
        </div>

        <div class="scaffold-box">
          <div class="scaffold-step">
            <span class="scaffold-tag tag-e">Evidence</span>
            <span>What do the primary trial data / findings show?</span>
          </div>
          <div class="scaffold-step">
            <span class="scaffold-tag tag-x">Explanation</span>
            <span>Why does the methodology (e.g. blinding) make this evidence strong?</span>
          </div>
          <div class="scaffold-step">
            <span class="scaffold-tag tag-l">Limitation</span>
            <span>What can this clinical design <em>not</em> establish or control?</span>
          </div>
          <div class="scaffold-step">
            <span class="scaffold-tag tag-j">Judgement</span>
            <span>How convincing is the evidence base overall?</span>
          </div>
        </div>

        <div class="exemplar-quote">
          "The trial provides convincing evidence of short-term efficacy and supports safety due to its randomised, double-blind, placebo-controlled design. However, it cannot demonstrate long-term safety or exclude ultra-rare adverse events."
        </div>
      </div>

      <!-- Column 3: Referencing & Presentation -->
      <div class="ebi-card">
        <div class="card-title-row">
          <div class="card-icon-box icon-teal">📚</div>
          <h2 class="card-title">Presentation & Referencing</h2>
        </div>

        <div class="bullet-list">
          <div class="bullet-item">
            <div class="bullet-dot dot-teal"></div>
            <div>
              <strong>Consistent In-Text Citations:</strong> Insert <em>(Author, Year)</em> immediately following factual claims, with a complete reference list at the end.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-teal"></div>
            <div>
              <strong>Alphabetical Bibliography:</strong> Order full reference entries alphabetically by lead author surname; do <em>not</em> number references.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-teal"></div>
            <div>
              <strong>Proofreading Rigour:</strong> Audit for sentence length, spelling, and consistent biological terminology throughout.
            </div>
          </div>
          <div class="bullet-item">
            <div class="bullet-dot dot-teal"></div>
            <div>
              <strong>Criteria Headings:</strong> Structure portfolios with explicit headings mapped to assessment criteria for clear assessor verification.
            </div>
          </div>
        </div>

        <div class="criteria-badges" style="margin-top: 10px;">
          <span class="crit-pill">P1–P4 Pass</span>
          <span class="crit-pill" style="border-color:#818cf8; color:#3730a3;">M2 Merit</span>
          <span class="crit-pill" style="border-color:#34d399; color:#065f46;">D1–D2 Distinction</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

async function render() {
  console.log("Launching Chrome to render whole-class feedback slides...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  fs.mkdirSync("scratch/feedback_slides", { recursive: true });

  await page.setContent(SLIDE_FEEDBACK_WWW_HTML, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "scratch/feedback_slides/feedback_www.png" });
  console.log("Rendered scratch/feedback_slides/feedback_www.png");

  await page.setContent(SLIDE_FEEDBACK_EBI_HTML, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "scratch/feedback_slides/feedback_ebi.png" });
  console.log("Rendered scratch/feedback_slides/feedback_ebi.png");

  await browser.close();
}

render().catch(err => {
  console.error(err);
  process.exit(1);
});
