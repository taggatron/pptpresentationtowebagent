import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const deckDir = "public/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited";
const bgPath = path.join(deckDir, "bright_dna_backdrop_clean.jpg");
const trnaPath = path.join(deckDir, "trna_structure_diagram.jpg");

const bgBase64 = fs.readFileSync(bgPath).toString("base64");
const trnaBase64 = fs.readFileSync(trnaPath).toString("base64");

function buildHtml(qFontSize = "23px", qLineHeight = "1.25", q5FontSize = "20.5px") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700;800&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: #f8fafc;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    position: relative;
  }

  .canvas {
    width: 1376px;
    height: 768px;
    position: relative;
    background: 
      radial-gradient(circle at 12% 12%, rgba(14, 165, 233, 0.08) 0%, transparent 45%),
      radial-gradient(circle at 88% 18%, rgba(99, 102, 241, 0.08) 0%, transparent 45%),
      linear-gradient(180deg, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%);
    padding: 24px 44px 20px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .canvas::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("data:image/jpeg;base64,${bgBase64}") center center / cover no-repeat;
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }

  .canvas::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
    z-index: 0;
  }

  .header {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .badge-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 11px;
    border-radius: 9999px;
  }

  .badge-starter {
    background: #0284c7;
    color: #ffffff;
    box-shadow: 0 2px 4px rgba(2, 132, 199, 0.25);
  }

  .badge-time {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
  }

  .badge-unit {
    background: #f0fdf4;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }

  h1.title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 27px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 13px;
    font-weight: 500;
    color: #475569;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .info-pill {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    padding: 6px 14px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
    text-align: right;
  }

  .info-pill-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5px;
    font-weight: 800;
    color: #0f172a;
  }

  .info-pill-sub {
    font-size: 10.5px;
    color: #64748b;
    font-weight: 500;
  }

  /* Grid Layout: 2 rows x 3 columns - slightly wider 410px columns with 28px gaps */
  .grid-container {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(3, 410px);
    grid-template-rows: repeat(2, 264px);
    gap: 20px 29px;
  }

  .card {
    background: rgba(255, 255, 255, 0.96);
    border: 1.5px solid #cbd5e1;
    border-radius: 14px;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03);
    backdrop-filter: blur(8px);
    padding: 11px 15px 11px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .card-1 { border-top: 4px solid #0284c7; }
  .card-2 { border-top: 4px solid #0d9488; }
  .card-3 { border-top: 4px solid #8b5cf6; }
  .card-4 { border-top: 4px solid #2563eb; }
  .card-5 { border-top: 4px solid #ea580c; }
  .card-6 { border-top: 4px solid #16a34a; }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .q-number {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 3px 9px;
    border-radius: 6px;
    text-transform: uppercase;
  }

  .q-pill-1 { background: #e0f2fe; color: #0369a1; }
  .q-pill-2 { background: #ccfbf1; color: #0f766e; }
  .q-pill-3 { background: #f3e8ff; color: #7e22ce; }
  .q-pill-4 { background: #dbeafe; color: #1d4ed8; }
  .q-pill-5 { background: #ffedd5; color: #c2410c; }
  .q-pill-6 { background: #dcfce7; color: #15803d; }

  .q-topic {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5px;
    font-weight: 800;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .q-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 0 4px 0;
  }

  .q-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: ${qFontSize};
    font-weight: 800;
    color: #091322;
    line-height: ${qLineHeight};
    letter-spacing: -0.02em;
    hyphens: none;
  }

  .trna-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .trna-thumb {
    width: 78px;
    height: 78px;
    flex-shrink: 0;
    background: #ffffff;
    border: 1.5px solid #fed7aa;
    border-radius: 9px;
    padding: 3px;
    box-shadow: 0 2px 8px rgba(234, 88, 12, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .trna-thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .trna-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #ea580c;
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 9.5px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .ans-container {
    height: 64px;
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
    border: 1.5px solid #a7f3d0;
    border-radius: 8px;
    padding: 5px 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(16, 185, 129, 0.05);
  }

  .ans-cue {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 800;
    color: #15803d;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .ans-text {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #064e3b;
    line-height: 1.32;
  }

  .footer {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
    font-size: 11px;
    color: #64748b;
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .footer-left .dot {
    color: #0284c7;
  }

  .footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    color: #94a3b8;
  }
</style>
</head>
<body>
<div class="canvas">
  <div class="header">
    <div class="header-left">
      <div class="badge-row">
        <span class="badge badge-starter">Starter Activity</span>
        <span class="badge badge-time">5–10 Minutes</span>
        <span class="badge badge-unit">OCR Level 3 AAQ Human Biology · Unit F172</span>
      </div>
      <h1 class="title">Starter Activity: Prior Knowledge Retrieval Grid</h1>
      <p class="subtitle">Retrieval Check: DNA Replication, Transcription Mechanisms, Codons & Molecular Machinery</p>
    </div>
    <div class="header-right">
      <div class="info-pill">
        <div class="info-pill-title">Interactive Retrieval</div>
        <div class="info-pill-sub">Click any answer box to reveal</div>
      </div>
    </div>
  </div>

  <div class="grid-container">
    <div class="card card-1" id="card_1">
      <div class="card-top">
        <span class="q-number q-pill-1">Question 1</span>
        <span class="q-topic">DNA Replication</span>
      </div>
      <div class="q-body">
        <div class="q-text">Explain what is meant by 'semiconservative replication' of DNA.</div>
      </div>
      <div class="ans-container" id="ans_1">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">Each new DNA molecule contains one original (template) parental strand and one newly synthesized daughter strand.</div>
      </div>
    </div>

    <div class="card card-2" id="card_2">
      <div class="card-top">
        <span class="q-number q-pill-2">Question 2</span>
        <span class="q-topic">Replication Enzymes</span>
      </div>
      <div class="q-body">
        <div class="q-text">Describe the function of the enzyme DNA Helicase at the replication fork.</div>
      </div>
      <div class="ans-container" id="ans_2">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">Unwinds and separates the parental double helix by breaking hydrogen bonds between complementary base pairs.</div>
      </div>
    </div>

    <div class="card card-3" id="card_3">
      <div class="card-top">
        <span class="q-number q-pill-3">Question 3</span>
        <span class="q-topic">Transcription & Codons</span>
      </div>
      <div class="q-body">
        <div class="q-text">Define an mRNA 'codon' and explain how a triplet of bases codes for an amino acid.</div>
      </div>
      <div class="ans-container" id="ans_3">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">A sequence of 3 mRNA nucleotides that codes for a specific amino acid or stop signal according to the genetic code.</div>
      </div>
    </div>

    <div class="card card-4" id="card_4">
      <div class="card-top">
        <span class="q-number q-pill-4">Question 4</span>
        <span class="q-topic">Transcription Mechanism</span>
      </div>
      <div class="q-body">
        <div class="q-text">Describe the role of RNA Polymerase during the transcription of a gene.</div>
      </div>
      <div class="ans-container" id="ans_4">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">Binds promoter, unwinds DNA, and synthesizes single-stranded pre-mRNA 5' to 3' using complementary RNA nucleotides.</div>
      </div>
    </div>

    <div class="card card-5" id="card_5">
      <div class="card-top">
        <span class="q-number q-pill-5">Question 5</span>
        <span class="q-topic">Molecular Machinery</span>
      </div>
      <div class="q-body">
        <div class="trna-container">
          <div class="trna-thumb">
            <img src="data:image/jpeg;base64,${trnaBase64}" alt="tRNA Structure" />
            <span class="trna-badge">Fig. X</span>
          </div>
          <div class="q-text" style="font-size: ${q5FontSize}; line-height: 1.26;">Identify molecule 'X' shown in the diagram and state its primary role in translation.</div>
        </div>
      </div>
      <div class="ans-container" id="ans_5">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">Transfer RNA (tRNA); delivers its specific amino acid to the ribosome matching its anticodon to the mRNA codon.</div>
      </div>
    </div>

    <div class="card card-6" id="card_6">
      <div class="card-top">
        <span class="q-number q-pill-6">Question 6</span>
        <span class="q-topic">The Genetic Code</span>
      </div>
      <div class="q-body">
        <div class="q-text">Explain what is meant by the genetic code being 'degenerate' and 'non-overlapping'.</div>
      </div>
      <div class="ans-container" id="ans_6">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">Degenerate: multiple codons encode the same amino acid. Non-overlapping: each base is read in only one triplet frame.</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-left">
      <span>OCR Cambridge Advanced National (AAQ) in Human Biology</span>
      <span class="dot">•</span>
      <span>Unit F172: Genetics — Topic 1: Molecular Genetics & Gene Expression</span>
    </div>
    <div class="footer-right">
      <span>Self-Assessment Retrieval Grid</span>
    </div>
  </div>
</div>
</body>
</html>`;
}

async function renderBigger() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  // Test 23px
  await page.setContent(buildHtml("23px", "1.25", "20px"), { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scratch/test_bright_starter_23px.png", clip: { x: 0, y: 0, width: 1376, height: 768 } });

  // Test 24px
  await page.setContent(buildHtml("24px", "1.24", "20.5px"), { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scratch/test_bright_starter_24px.png", clip: { x: 0, y: 0, width: 1376, height: 768 } });

  await browser.close();
  console.log("Rendered 23px and 24px previews!");
}

renderBigger().catch(console.error);
