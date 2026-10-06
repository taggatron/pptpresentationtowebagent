import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const deckDir = "public/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited";
const slidesDir = path.join(deckDir, "slides");
const manifestPath = path.join(deckDir, "manifest.json");

async function main() {
  console.log("=== Step 1: Shifting slide_17.png -> slide_18.png ===");
  const oldSlide17 = path.join(slidesDir, "slide_17.png");
  const newSlide18 = path.join(slidesDir, "slide_18.png");

  if (fs.existsSync(oldSlide17)) {
    fs.copyFileSync(oldSlide17, newSlide18);
    console.log(`Copied ${oldSlide17} -> ${newSlide18}`);
  } else {
    throw new Error("Old slide_17.png does not exist!");
  }

  console.log("=== Step 2: Rendering new slide_17.png ===");
  const imgPath = path.join(deckDir, "ocr_aaq_p3_criteria.png");
  const imgBase64 = fs.readFileSync(imgPath).toString("base64");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: #0b1120;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* Slide Background: High-tech subtle grid and luminous medical glow */
  .slide-container {
    width: 1376px;
    height: 768px;
    background: 
      radial-gradient(circle at 10% 15%, rgba(56, 189, 248, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 90% 85%, rgba(99, 102, 241, 0.08) 0%, transparent 45%),
      linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 34px 44px 30px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  /* Decorative subtle grid overlay */
  .slide-container::before {
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
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .top-badges {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .course-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #0284c7;
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 9999px;
    box-shadow: 0 2px 4px rgba(2, 132, 199, 0.25);
  }

  .nea-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 9999px;
  }

  .nea-badge .dot {
    width: 6px;
    height: 6px;
    background: #2563eb;
    border-radius: 50%;
  }

  h1.slide-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 27px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .slide-subtitle {
    font-size: 13.5px;
    color: #475569;
    font-weight: 500;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .unit-tag {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    padding: 7px 14px;
    border-radius: 10px;
    text-align: right;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .unit-tag .tag-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 800;
    color: #0f172a;
  }

  .unit-tag .tag-sub {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
  }

  /* Main Body: 2 Columns */
  .content-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 530px 1fr;
    gap: 22px;
    flex: 1;
    min-height: 0;
  }

  /* Left Column: NEA Pass Criteria & Assessment Context */
  .left-col {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .criteria-card {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 14px;
    padding: 16px 18px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .card-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 10px;
  }

  .card-label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #334155;
  }

  .status-pill {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #047857;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10.5px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .image-wrapper {
    background: #ffffff;
    border: 1.5px solid #94a3b8;
    border-radius: 10px;
    padding: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .image-wrapper img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 6px;
  }

  /* Assessment Guidance Breakdown */
  .guidance-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 16px 18px;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.03);
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .guidance-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .guidance-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .guidance-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    line-height: 1.45;
    color: #334155;
  }

  .guidance-num {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    background: #0284c7;
    color: #ffffff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 700;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }

  .guidance-item strong {
    color: #0f172a;
    font-weight: 700;
  }

  /* Right Column: Flow Chart of Steps */
  .right-col {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 14px;
    padding: 16px 20px;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
    display: flex;
    flex-direction: column;
  }

  .flow-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 10px;
    margin-bottom: 12px;
  }

  .flow-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: -0.01em;
  }

  .flow-sub {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
  }

  .steps-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    gap: 4px;
  }

  .step-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px 14px;
    transition: all 0.2s ease;
  }

  .step-node.highlight-variant {
    background: #f0fdf4;
    border-color: #86efac;
    box-shadow: 0 2px 6px rgba(34, 197, 94, 0.08);
  }

  .step-node.highlight-terminal {
    background: #fef2f2;
    border-color: #fca5a5;
  }

  .step-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .step-idx {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    width: 22px;
    height: 22px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-node.highlight-variant .step-idx {
    background: #dcfce7;
    border-color: #86efac;
    color: #15803d;
  }

  .step-content {
    display: flex;
    flex-direction: column;
  }

  .step-main-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .step-node.highlight-variant .step-main-text {
    color: #14532d;
  }

  .step-node.highlight-terminal .step-main-text {
    color: #991b1b;
  }

  .step-desc {
    font-size: 10.5px;
    color: #64748b;
    font-weight: 500;
  }

  .step-badge {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  .badge-checked {
    background: #16a34a;
    color: #ffffff;
    box-shadow: 0 2px 4px rgba(22, 163, 74, 0.2);
  }

  .badge-neutral {
    background: #e2e8f0;
    color: #475569;
  }

  .badge-outcome {
    background: #dc2626;
    color: #ffffff;
  }

  /* Connector Arrow */
  .step-arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 14px;
    color: #94a3b8;
  }

  .step-arrow svg {
    width: 14px;
    height: 14px;
  }

  /* Footer bar */
  .footer-bar {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
    font-size: 11px;
    color: #64748b;
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .footer-left .bullet {
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
<div class="slide-container">
  <!-- Header -->
  <div class="header">
    <div class="header-left">
      <div class="top-badges">
        <span class="course-badge">OCR AAQ Level 3 Human Biology</span>
        <span class="nea-badge"><span class="dot"></span>Unit F172: Genetics NEA Assignment</span>
        <span class="nea-badge" style="background: #f0fdf4; color: #166534; border-color: #bbf7d0;"><span class="dot" style="background: #16a34a;"></span>Pass Criterion P3</span>
      </div>
      <h1 class="slide-title">Genetic Variation to Disease: The Huntington's Causal Chain</h1>
      <p class="slide-subtitle">Synthesizing the molecular mechanism into coursework evidence for Pass Criterion P3 (PO4)</p>
    </div>
    <div class="header-right">
      <div class="unit-tag">
        <div class="tag-title">Assessment Link</div>
        <div class="tag-sub">NEA Portfolio Task 2</div>
      </div>
    </div>
  </div>

  <!-- Main Grid -->
  <div class="content-grid">
    <!-- Left Column: The Attached Image & Guidance -->
    <div class="left-col">
      <div class="criteria-card">
        <div class="card-top-row">
          <span class="card-label">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Official Assessment Specification
          </span>
          <span class="status-pill">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Grading Target
          </span>
        </div>

        <!-- The User Attached Image -->
        <div class="image-wrapper">
          <img src="data:image/png;base64,${imgBase64}" alt="OCR AAQ Level 3 F172 Genetics NEA Pass criteria (P3)" />
        </div>
      </div>

      <!-- Assessment Criteria Breakdown -->
      <div class="guidance-card">
        <div class="guidance-title">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#0284c7" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How Your Coursework Must Address Criterion P3:
        </div>
        <ul class="guidance-list">
          <li class="guidance-item">
            <div class="guidance-num">1</div>
            <div><strong>Identify the Type of Genetic Variation:</strong> Clearly state that Huntington's is driven by an unstable <em>CAG trinucleotide repeat expansion</em> (an insertion variant) in exon 1 of the <em>HTT</em> gene on chromosome 4p16.3.</div>
          </li>
          <li class="guidance-item">
            <div class="guidance-num">2</div>
            <div><strong>Explain the Molecular Mechanism:</strong> Describe how expanded CAG codons transcribe and translate into an abnormally elongated <em>polyglutamine (polyQ)</em> tract within the huntingtin protein.</div>
          </li>
          <li class="guidance-item">
            <div class="guidance-num">3</div>
            <div><strong>Bridge Genotype to Clinical Phenotype:</strong> Explain how the altered mutant protein misfolds (toxic gain-of-function), aggregates into nuclear inclusions, and triggers striatal neuronal death to produce Huntington's clinical phenotype.</div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Right Column: Flow Chart with the User-Supplied Text -->
    <div class="right-col">
      <div class="flow-header">
        <div class="flow-title">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#0284c7" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          The Causal Pathway: Genotype to Phenotype
        </div>
        <div class="flow-sub">Structured Logical Chain</div>
      </div>

      <div class="steps-container">
        <!-- Node 1 -->
        <div class="step-node">
          <div class="step-left">
            <div class="step-idx">01</div>
            <div class="step-content">
              <div class="step-main-text">Phenotypic variation</div>
              <div class="step-desc">Observable physical, physiological, and clinical diversity across individuals</div>
            </div>
          </div>
          <span class="step-badge badge-neutral">Baseline Observation</span>
        </div>

        <div class="step-arrow">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
        </div>

        <!-- Node 2 -->
        <div class="step-node highlight-variant">
          <div class="step-left">
            <div class="step-idx">02</div>
            <div class="step-content">
              <div class="step-main-text">
                Genotypic variation
                <span style="color:#16a34a; font-weight:800; font-size:14px;">✅</span>
              </div>
              <div class="step-desc">Underlying inherited differences in DNA nucleotide sequences</div>
            </div>
          </div>
          <span class="step-badge badge-checked">✅ Criterion Met</span>
        </div>

        <div class="step-arrow">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
        </div>

        <!-- Node 3 -->
        <div class="step-node highlight-variant">
          <div class="step-left">
            <div class="step-idx">03</div>
            <div class="step-content">
              <div class="step-main-text">
                caused by a gene variant
                <span style="color:#16a34a; font-weight:800; font-size:14px;">✅</span>
              </div>
              <div class="step-desc">A specific structural modification in a functional gene locus</div>
            </div>
          </div>
          <span class="step-badge badge-checked">✅ Criterion Met</span>
        </div>

        <div class="step-arrow">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
        </div>

        <!-- Node 4 -->
        <div class="step-node highlight-variant">
          <div class="step-left">
            <div class="step-idx">04</div>
            <div class="step-content">
              <div class="step-main-text">
                specifically a CAG trinucleotide repeat expansion in HTT
                <span style="color:#16a34a; font-weight:800; font-size:14px;">✅</span>
              </div>
              <div class="step-desc">Exon 1 insertion exceeding diagnostic full-penetrance threshold (≥40 CAG repeats)</div>
            </div>
          </div>
          <span class="step-badge badge-checked">✅ Primary Trigger</span>
        </div>

        <div class="step-arrow">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
        </div>

        <!-- Node 5 -->
        <div class="step-node">
          <div class="step-left">
            <div class="step-idx">05</div>
            <div class="step-content">
              <div class="step-main-text">produces an abnormally long polyglutamine tract</div>
              <div class="step-desc">Ribosomes translate expanded CAG codons into an elongated polyQ domain</div>
            </div>
          </div>
          <span class="step-badge badge-neutral">Translation Effect</span>
        </div>

        <div class="step-arrow">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
        </div>

        <!-- Node 6 -->
        <div class="step-node">
          <div class="step-left">
            <div class="step-idx">06</div>
            <div class="step-content">
              <div class="step-main-text">altered huntingtin protein</div>
              <div class="step-desc">Toxic gain-of-function: misfolding into β-sheet aggregates & nuclear inclusions</div>
            </div>
          </div>
          <span class="step-badge badge-neutral">Pathological Protein</span>
        </div>

        <div class="step-arrow">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
        </div>

        <!-- Node 7 -->
        <div class="step-node highlight-terminal">
          <div class="step-left">
            <div class="step-idx" style="color:#b91c1c; border-color:#fca5a5; background:#fee2e2;">07</div>
            <div class="step-content">
              <div class="step-main-text">Huntington's phenotype.</div>
              <div class="step-desc">Striatal neurodegeneration: motor chorea, cognitive decline & psychiatric symptoms</div>
            </div>
          </div>
          <span class="step-badge badge-outcome">Clinical Outcome</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer Bar -->
  <div class="footer-bar">
    <div class="footer-left">
      <span>OCR Cambridge Advanced National (AAQ) in Human Biology</span>
      <span class="bullet">•</span>
      <span>Unit F172: Genetics — Topic 1.2 Mutational Mechanisms & Disorders</span>
    </div>
    <div class="footer-right">
      <span>P3 / PO4 Assessment Portfolio Reference</span>
    </div>
  </div>
</div>
</body>
</html>`;

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const destSlide17 = path.join(slidesDir, "slide_17.png");
  await page.screenshot({ path: destSlide17, clip: { x: 0, y: 0, width: 1376, height: 768 } });
  console.log(`Saved new slide image to ${destSlide17}`);
  await browser.close();

  console.log("=== Step 3: Updating manifest.json ===");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.totalSlides = 18;

  // Find the old slide 17 (which is at index 16)
  const oldSlide17Obj = manifest.slides[16];
  if (!oldSlide17Obj) {
    throw new Error("Could not find slide at index 16 in manifest");
  }

  // Update old slide 17 to become slide 18
  const updatedSlide18Obj = {
    ...oldSlide17Obj,
    number: 18,
    title: "Plenary Summary",
    imageFileName: "slide_18.png",
    imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_18.png",
    geminiImageCells: oldSlide17Obj.geminiImageCells ? oldSlide17Obj.geminiImageCells.map(c => ({
      ...c,
      id: c.id.replace("slide_17", "slide_18"),
      sourceImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_18.png"
    })) : []
  };

  // Create new slide 17 object
  const newSlide17Obj = {
    number: 17,
    title: "NEA Pass Criteria P3: Genetic Variation Causal Chain",
    imageFileName: "slide_17.png",
    imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_17.png",
    sourceMediaPath: "gemini/huntingtons_nea_p3_causal_pathway.png",
    isInteractive: false,
    interactiveType: null,
    cognitiveGuide: {
      estimatedTimeSeconds: 15,
      timeGuideDisplay: "12–18s",
      vciScore: "3.2",
      complexityCategory": "Moderate",
      ragLevel": "low",
      ragColor": "green",
      ragLabel": "Assessment Alignment",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1200,
        readingMs: 1500,
        semanticProcessingMs: 12000,
        wordCount: 85,
        visualElementsCount: 4
      },
      academicReferences: [
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
          relevance: "Reduces split-attention effect by integrating NEA rubric criterion directly alongside biological causal model."
        },
        {
          citation: "Mayer, R. E. (2002). Multimedia learning. Psychology of Learning and Motivation, 41, 85-139.",
          relevance: "Applies spatial contiguity principle linking criterion specification with structured step-by-step pathway."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "manifest-text"
    },
    geminiImageCells: [
      {
        id: "gemini_slide_17_1_component_reveal",
        order: 1,
        kind: "image",
        mediaType: "image",
        source: "gemini-image-chat",
        label: "Build 1: Complete the instructional build",
        strategy: "component-reveal",
        fullCanvas: true,
        cumulative: true,
        prompt: "NEA Pass Criteria P3: Genetic Variation to Huntington's Disease Causal Chain",
        status: "planned",
        qaStatus: "approved",
        outputImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_17.png",
        sourceImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_17.png"
      }
    ],
    hasProgressiveBuilds: false,
    animationPlan: {
      version: 2,
      mode: "gemini-image-cells",
      reason: "Static synthesis and NEA coursework alignment slide.",
      strategy: "component-reveal",
      planningSource: "local-slide-heuristics",
      analyzedComponentCount: 0,
      plannedCellCount: 1,
      approvedCellCount: 1,
      qaRequired: false,
      questionReveal: false,
      webEmbedPreserved: false,
      protectedVideoCount: 0
    }
  };

  // Replace slide at index 16 with newSlide17Obj, and append updatedSlide18Obj
  manifest.slides[16] = newSlide17Obj;
  manifest.slides[17] = updatedSlide18Obj;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Successfully updated manifest.json to 18 slides!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
