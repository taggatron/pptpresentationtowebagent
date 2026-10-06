import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const deckDir = "public/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited";
const bgPath = path.join(deckDir, "bright_dna_backdrop_clean.jpg");
const trnaPath = path.join(deckDir, "trna_structure_diagram.jpg");

const bgBase64 = fs.readFileSync(bgPath).toString("base64");
const trnaBase64 = fs.readFileSync(trnaPath).toString("base64");

export const starterQuestions = [
  {
    q: "Explain what is meant by 'semiconservative replication' of DNA.",
    a: "Each newly synthesized DNA molecule contains one original (template) parental strand and one newly formed daughter strand."
  },
  {
    q: "Describe the function of the enzyme DNA Helicase at the replication fork.",
    a: "Unwinds and separates the parental double helix by breaking hydrogen bonds between complementary base pairs."
  },
  {
    q: "Define an mRNA 'codon' and explain how a triplet of bases codes for an amino acid.",
    a: "A sequence of 3 mRNA nucleotides that codes for a specific amino acid or stop signal according to the genetic code."
  },
  {
    q: "Describe the role of RNA Polymerase during the transcription of a gene.",
    a: "Binds promoter, unwinds DNA, and synthesizes single-stranded pre-mRNA 5' to 3' using complementary RNA nucleotides."
  },
  {
    q: "Identify molecule 'X' shown in the diagram and state its primary role in translation.",
    a: "Transfer RNA (tRNA); delivers its specific amino acid to the ribosome matching its anticodon to the complementary mRNA codon."
  },
  {
    q: "Explain what is meant by the genetic code being 'degenerate' and 'non-overlapping'.",
    a: "Degenerate: multiple codons encode the same amino acid. Non-overlapping: each base is read in only one triplet frame."
  }
];

export function getStarterSlideHtml() {
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

  /* Slide Background: Luminous, high-contrast, clean medical lab aesthetic */
  .canvas {
    width: 1376px;
    height: 768px;
    position: relative;
    background: 
      radial-gradient(circle at 12% 12%, rgba(14, 165, 233, 0.08) 0%, transparent 45%),
      radial-gradient(circle at 88% 18%, rgba(99, 102, 241, 0.08) 0%, transparent 45%),
      linear-gradient(180deg, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%);
    padding: 28px 48px 24px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Subtle background DNA graphics overlay from generated image */
  .canvas::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("data:image/jpeg;base64,${bgBase64}") center center / cover no-repeat;
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }

  /* Grid overlay for crisp layout */
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

  /* Header Section */
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
    gap: 6px;
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

  /* Grid Layout: 2 rows x 3 columns */
  .grid-container {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(3, 405px);
    grid-template-rows: repeat(2, 260px);
    gap: 24px 32px;
  }

  .card {
    background: rgba(255, 255, 255, 0.95);
    border: 1.5px solid #cbd5e1;
    border-radius: 14px;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03);
    backdrop-filter: blur(8px);
    padding: 13px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  /* Vibrant Accent Top Borders */
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
    margin-bottom: 10px;
  }

  .q-number {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 3.5px 9px;
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
    justify-content: flex-start;
  }

  .q-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 17.5px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.38;
    letter-spacing: -0.015em;
  }

  /* Question 5: tRNA visual layout */
  .trna-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .trna-thumb {
    width: 86px;
    height: 86px;
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

  /* Answer Container at bottom of each card */
  .ans-container {
    height: 68px;
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
    border: 1.5px solid #a7f3d0;
    border-radius: 8px;
    padding: 6px 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(16, 185, 129, 0.05);
  }

  .ans-cue {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
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
    line-height: 1.34;
  }

  /* Footer bar */
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
  <!-- Header -->
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

  <!-- 6-Box Grid -->
  <div class="grid-container">
    <!-- Card 1 -->
    <div class="card card-1">
      <div class="card-top">
        <span class="q-number q-pill-1">Question 1</span>
        <span class="q-topic">DNA Replication</span>
      </div>
      <div class="q-body">
        <div class="q-text">Explain what is meant by 'semiconservative replication' of DNA.</div>
      </div>
      <div class="ans-container">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">Each new DNA molecule contains one original (template) parental strand and one newly synthesized daughter strand.</div>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="card card-2">
      <div class="card-top">
        <span class="q-number q-pill-2">Question 2</span>
        <span class="q-topic">Replication Enzymes</span>
      </div>
      <div class="q-body">
        <div class="q-text">Describe the function of the enzyme DNA Helicase at the replication fork.</div>
      </div>
      <div class="ans-container">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">Unwinds and separates the parental double helix by breaking hydrogen bonds between complementary base pairs.</div>
      </div>
    </div>

    <!-- Card 3 -->
    <div class="card card-3">
      <div class="card-top">
        <span class="q-number q-pill-3">Question 3</span>
        <span class="q-topic">Transcription & Codons</span>
      </div>
      <div class="q-body">
        <div class="q-text">Define an mRNA 'codon' and explain how a triplet of bases codes for an amino acid.</div>
      </div>
      <div class="ans-container">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">A sequence of 3 mRNA nucleotides that codes for a specific amino acid or stop signal according to the genetic code.</div>
      </div>
    </div>

    <!-- Card 4 -->
    <div class="card card-4">
      <div class="card-top">
        <span class="q-number q-pill-4">Question 4</span>
        <span class="q-topic">Transcription Mechanism</span>
      </div>
      <div class="q-body">
        <div class="q-text">Describe the role of RNA Polymerase during the transcription of a gene.</div>
      </div>
      <div class="ans-container">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">Binds promoter, unwinds DNA, and synthesizes single-stranded pre-mRNA 5' to 3' using complementary RNA nucleotides.</div>
      </div>
    </div>

    <!-- Card 5 (tRNA Image Question) -->
    <div class="card card-5">
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
          <div class="q-text" style="font-size: 16px; line-height: 1.35;">Identify molecule 'X' shown in the diagram and state its primary role in translation.</div>
        </div>
      </div>
      <div class="ans-container">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">Transfer RNA (tRNA); delivers its specific amino acid to the ribosome matching its anticodon to the mRNA codon.</div>
      </div>
    </div>

    <!-- Card 6 -->
    <div class="card card-6">
      <div class="card-top">
        <span class="q-number q-pill-6">Question 6</span>
        <span class="q-topic">The Genetic Code</span>
      </div>
      <div class="q-body">
        <div class="q-text">Explain what is meant by the genetic code being 'degenerate' and 'non-overlapping'.</div>
      </div>
      <div class="ans-container">
        <div class="ans-cue">Expected Answer / Success Cue:</div>
        <div class="ans-text">Degenerate: multiple codons encode the same amino acid. Non-overlapping: each base is read in only one triplet frame.</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
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

async function renderPreview() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await page.setContent(getStarterSlideHtml(), { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scratch/test_bright_starter.png", clip: { x: 0, y: 0, width: 1376, height: 768 } });
  console.log("Saved scratch/test_bright_starter.png");
  await browser.close();
}

if (process.argv[1] && process.argv[1].endsWith("test_render_bright_starter.mjs")) {
  renderPreview().catch(console.error);
}
