import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

async function main() {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap");
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
  .slide-container {
    width: 1376px;
    height: 768px;
    padding: 34px 46px 20px 46px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  }

  /* Header */
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
    background: #e2f0d7;
    color: #166534;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 9999px;
    border: 1px solid #bbf7d0;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .header-meta {
    font-size: 14.5px;
    font-weight: 500;
    color: #64748b;
  }
  .title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  h1 {
    font-size: 33px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.025em;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .title-subtitle {
    font-size: 15px;
    font-weight: 600;
    color: #64748b;
  }

  /* Grid of 3 Objectives */
  .objectives-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
    margin-top: 12px;
    margin-bottom: 12px;
    flex: 1;
  }

  .card {
    background: #ffffff;
    border-radius: 20px;
    padding: 24px 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
  }
  .card-1::before { background: linear-gradient(90deg, #0284c7, #38bdf8); }
  .card-2::before { background: linear-gradient(90deg, #16a34a, #4ade80); }
  .card-3::before { background: linear-gradient(90deg, #d97706, #fbbf24); }

  .card-top {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .step-pill {
    display: inline-flex;
    align-items: center;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 8px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .card-1 .step-pill { background: #e0f2fe; color: #0284c7; }
  .card-2 .step-pill { background: #dcfce7; color: #16a34a; }
  .card-3 .step-pill { background: #fef3c7; color: #d97706; }

  .icon-cluster {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 3px 9px;
    border-radius: 9999px;
    font-size: 15px;
  }

  .card-title {
    font-size: 24px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    letter-spacing: -0.015em;
    font-family: "Plus Jakarta Sans", sans-serif;
  }

  /* Content Chunks */
  .content-chunks {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 2px;
  }

  .chunk {
    border-radius: 12px;
    padding: 13px 14px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .chunk-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .chunk-label {
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .chunk-badge {
    font-size: 10.5px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 5px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .chunk-text {
    font-size: 14px;
    line-height: 1.45;
    color: #334155;
    font-weight: 500;
  }
  .chunk-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 3px;
  }
  .pill-item {
    font-size: 11.5px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 5px;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    color: #1e293b;
  }

  /* Card 1 Specifics */
  .card-1 .chunk-abiotic { background: #f0f9ff; border: 1px solid #bae6fd; }
  .card-1 .chunk-abiotic .chunk-label { color: #0284c7; }
  .card-1 .chunk-abiotic .chunk-badge { background: #e0f2fe; color: #0369a1; }

  .card-1 .chunk-biotic { background: #f8fafc; border: 1px solid #e2e8f0; }
  .card-1 .chunk-biotic .chunk-label { color: #334155; }
  .card-1 .chunk-biotic .chunk-badge { background: #f1f5f9; color: #475569; }

  /* Card 2 Specifics */
  .hierarchy-chain {
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 12px 13px;
    margin-top: 2px;
  }
  .hierarchy-step {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 9px;
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #dcfce7;
  }
  .hierarchy-tag {
    font-size: 11.5px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
    background: #dcfce7;
    color: #15803d;
    min-width: 88px;
    text-align: center;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .hierarchy-desc {
    font-size: 12.5px;
    font-weight: 500;
    color: #334155;
    flex: 1;
  }
  .hierarchy-connector {
    display: flex;
    justify-content: center;
    font-size: 9px;
    color: #16a34a;
    line-height: 1;
    margin: -3px 0;
  }

  /* Card 3 Specifics */
  .card-3 .chunk-inter { background: #fffbeb; border: 1px solid #fde68a; }
  .card-3 .chunk-inter .chunk-label { color: #b45309; }
  .card-3 .chunk-inter .chunk-badge { background: #fef3c7; color: #92400e; }

  .card-3 .chunk-knockon { background: #f8fafc; border: 1px solid #e2e8f0; }
  .card-3 .chunk-knockon .chunk-label { color: #334155; }
  .card-3 .chunk-knockon .chunk-badge { background: #f1f5f9; color: #475569; }

  /* Takeaway Banner */
  .card-takeaway {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 14px;
    border-radius: 11px;
    font-size: 13.5px;
    font-weight: 700;
    font-family: "Plus Jakarta Sans", sans-serif;
    margin-top: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  .card-1 .card-takeaway { background: #0284c7; color: #ffffff; }
  .card-2 .card-takeaway { background: #16a34a; color: #ffffff; }
  .card-3 .card-takeaway { background: #d97706; color: #ffffff; }

  /* Terminology Bar */
  .terms-bar {
    background: #ffffff;
    border-radius: 16px;
    padding: 14px 22px;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .terms-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .terms-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .terms-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .term-item {
    font-size: 11.5px;
    color: #475569;
    line-height: 1.35;
  }
  .term-name {
    font-weight: 800;
    color: #0f172a;
    font-size: 12.5px;
    display: block;
    margin-bottom: 2px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }

  .watermark {
    position: absolute;
    bottom: 10px;
    right: 32px;
    font-size: 10px;
    font-weight: 500;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .watermark svg {
    width: 12px;
    height: 12px;
    fill: #94a3b8;
  }

  .attenuated {
    filter: grayscale(100%) opacity(35%);
  }
  .hidden-element {
    visibility: hidden !important;
  }
</style>
</head>
<body>
<div class="slide-container" id="slide">
  <!-- Header -->
  <div class="header">
    <div class="badge-row">
      <span class="badge">🌱 Ecology &amp; Atmosphere · Lesson 1</span>
      <span class="header-meta">GCSE &amp; OCR Gateway Biology</span>
    </div>
    <div class="title-row">
      <h1>Lesson Objectives: Ecosystems</h1>
      <span class="title-subtitle">3 Core Competencies &amp; Key Terminology</span>
    </div>
  </div>

  <!-- Clear Objectives Grid -->
  <div class="objectives-grid">
    <!-- Card 1 -->
    <div class="card card-1" id="card1">
      <div class="card-top">
        <div class="card-header-row">
          <div class="step-pill">Step 1 · Know</div>
          <div class="icon-cluster">☀️ 🌡️ 🌿</div>
        </div>
        <div class="card-title">Abiotic &amp; Biotic Factors</div>
        <div class="content-chunks">
          <div class="chunk chunk-abiotic">
            <div class="chunk-head">
              <span class="chunk-label">☀️ Abiotic Factors</span>
              <span class="chunk-badge">Non-Living</span>
            </div>
            <span class="chunk-text">Physical environmental factors:</span>
            <div class="chunk-pills">
              <span class="pill-item">Light Intensity</span>
              <span class="pill-item">Temperature</span>
              <span class="pill-item">Moisture</span>
              <span class="pill-item">Soil pH</span>
            </div>
          </div>
          <div class="chunk chunk-biotic">
            <div class="chunk-head">
              <span class="chunk-label">🦊 Biotic Factors</span>
              <span class="chunk-badge">Living</span>
            </div>
            <span class="chunk-text">Biological community factors:</span>
            <div class="chunk-pills">
              <span class="pill-item">Food Supply</span>
              <span class="pill-item">Predators</span>
              <span class="pill-item">Competition</span>
              <span class="pill-item">Pathogens</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-takeaway">
        <span>✓</span>
        <span>Classify physical vs. biological factors</span>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="card card-2" id="card2">
      <div class="card-top">
        <div class="card-header-row">
          <div class="step-pill">Step 2 · Understand</div>
          <div class="icon-cluster">🌲 🦌 🌍</div>
        </div>
        <div class="card-title">Levels of Organisation</div>
        <div class="hierarchy-chain">
          <div class="hierarchy-step">
            <span class="hierarchy-tag">Individual</span>
            <span class="hierarchy-desc">A single living organism</span>
          </div>
          <div class="hierarchy-connector">▼</div>
          <div class="hierarchy-step">
            <span class="hierarchy-tag">Population</span>
            <span class="hierarchy-desc">All members of one species</span>
          </div>
          <div class="hierarchy-connector">▼</div>
          <div class="hierarchy-step">
            <span class="hierarchy-tag">Community</span>
            <span class="hierarchy-desc">All interacting populations</span>
          </div>
          <div class="hierarchy-connector">▼</div>
          <div class="hierarchy-step">
            <span class="hierarchy-tag">Ecosystem</span>
            <span class="hierarchy-desc">Community + abiotic environment</span>
          </div>
        </div>
      </div>
      <div class="card-takeaway">
        <span>✓</span>
        <span>Map hierarchy: Individual → Ecosystem</span>
      </div>
    </div>

    <!-- Card 3 -->
    <div class="card card-3" id="card3">
      <div class="card-top">
        <div class="card-header-row">
          <div class="step-pill">Step 3 · Apply</div>
          <div class="icon-cluster">⚖️ 🔄 📉</div>
        </div>
        <div class="card-title">Interdependence &amp; Dynamics</div>
        <div class="content-chunks">
          <div class="chunk chunk-inter">
            <div class="chunk-head">
              <span class="chunk-label">🤝 Mutual Reliance</span>
              <span class="chunk-badge">Interdependence</span>
            </div>
            <span class="chunk-text">Species depend on each other:</span>
            <div class="chunk-pills">
              <span class="pill-item">Food</span>
              <span class="pill-item">Shelter</span>
              <span class="pill-item">Pollination</span>
              <span class="pill-item">Seed Dispersal</span>
            </div>
          </div>
          <div class="chunk chunk-knockon">
            <div class="chunk-head">
              <span class="chunk-label">⚡ Knock-On Effects</span>
              <span class="chunk-badge">Food Webs</span>
            </div>
            <span class="chunk-text">A change in one population triggers:</span>
            <div class="chunk-pills" style="width: 100%;">
              <span class="pill-item" style="flex: 1; text-align: center;">Predictable shifts across connected species</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-takeaway">
        <span>✓</span>
        <span>Predict knock-on impacts on food webs</span>
      </div>
    </div>
  </div>

  <!-- Terminology Bar -->
  <div class="terms-bar" id="termsBar">
    <div class="terms-header">
      <div class="terms-label">
        <span>🔑</span>
        <span>Key Scientific Terminology</span>
      </div>
      <span style="font-size: 11px; color: #64748b; font-weight: 600;">Core GCSE Vocabulary</span>
    </div>
    <div class="terms-grid">
      <div class="term-item">
        <span class="term-name">Ecosystem</span>
        Interaction between a community of living organisms and their non-living environment.
      </div>
      <div class="term-item">
        <span class="term-name">Abiotic Factor</span>
        Non-living physical or chemical factor affecting organisms (e.g. sunlight, pH, moisture).
      </div>
      <div class="term-item">
        <span class="term-name">Biotic Factor</span>
        Living factor affecting other organisms (e.g. food availability, predation, disease).
      </div>
      <div class="term-item">
        <span class="term-name">Interdependence</span>
        Mutual reliance between species in a community where one change impacts others.
      </div>
    </div>
  </div>

  <div class="watermark">
    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
    <span>Gemini Notebook</span>
  </div>
</div>
</body>
</html>
  `;

  await page.setContent(htmlContent);
  await page.waitForTimeout(500);

  const targetDir = "public/decks/Classic_Lesson_01_Ecosystems/slides";
  const artifactDir = "/Users/danieltagg/.gemini/antigravity-ide/brain/3b62ba40-ed80-4a5b-a1d9-5ed29cc55a93";

  // 1. MASTER IMAGE: All elements active and unattenuated
  await page.evaluate(() => {
    document.getElementById("card1").className = "card card-1";
    document.getElementById("card2").className = "card card-2";
    document.getElementById("card3").className = "card card-3";
    document.getElementById("termsBar").className = "terms-bar";
  });
  const masterPath = path.join(targetDir, "slide_02_objectives.png");
  await page.screenshot({ path: masterPath });
  await page.screenshot({ path: path.join(artifactDir, "objectives_master.png") });
  console.log("Captured slide_02_objectives.png (master)");

  // 2. BUILD 1: Step 1 active; Steps 2, 3, Terminology hidden
  await page.evaluate(() => {
    document.getElementById("card1").className = "card card-1";
    document.getElementById("card2").className = "card card-2 hidden-element";
    document.getElementById("card3").className = "card card-3 hidden-element";
    document.getElementById("termsBar").className = "terms-bar hidden-element";
  });
  const b1Path = path.join(targetDir, "slide_03_gemini_slide_3_1_staged_objectives.png");
  await page.screenshot({ path: b1Path });
  await page.screenshot({ path: path.join(targetDir, "slide_02_gemini_slide_2_1_staged_objectives.png") });
  await page.screenshot({ path: path.join(artifactDir, "objectives_build1.png") });
  console.log("Captured build 1");

  // 3. BUILD 2: Step 1 attenuated; Step 2 active; Step 3, Terminology hidden
  await page.evaluate(() => {
    document.getElementById("card1").className = "card card-1 attenuated";
    document.getElementById("card2").className = "card card-2";
    document.getElementById("card3").className = "card card-3 hidden-element";
    document.getElementById("termsBar").className = "terms-bar hidden-element";
  });
  const b2Path = path.join(targetDir, "slide_03_gemini_slide_3_2_staged_objectives.png");
  await page.screenshot({ path: b2Path });
  await page.screenshot({ path: path.join(targetDir, "slide_02_gemini_slide_2_2_staged_objectives.png") });
  await page.screenshot({ path: path.join(artifactDir, "objectives_build2.png") });
  console.log("Captured build 2");

  // 4. BUILD 3: Steps 1 & 2 attenuated; Step 3 & Terminology active
  await page.evaluate(() => {
    document.getElementById("card1").className = "card card-1 attenuated";
    document.getElementById("card2").className = "card card-2 attenuated";
    document.getElementById("card3").className = "card card-3";
    document.getElementById("termsBar").className = "terms-bar";
  });
  const b3Path = path.join(targetDir, "slide_03_gemini_slide_3_3_staged_objectives.png");
  await page.screenshot({ path: b3Path });
  await page.screenshot({ path: path.join(targetDir, "slide_02_gemini_slide_2_3_staged_objectives.png") });
  await page.screenshot({ path: path.join(artifactDir, "objectives_build3.png") });
  console.log("Captured build 3");

  await browser.close();

  // Compute file sizes and hashes
  const files = [
    { name: "slide_02_objectives.png", path: masterPath },
    { name: "build1", path: b1Path },
    { name: "build2", path: b2Path },
    { name: "build3", path: b3Path }
  ];

  for (const f of files) {
    const buf = await fs.readFile(f.path);
    const hash = crypto.createHash("sha256").update(buf).digest("hex");
    console.log(`${f.name}: ${buf.length} bytes, sha256: ${hash}`);
  }
}

main().catch(console.error);
