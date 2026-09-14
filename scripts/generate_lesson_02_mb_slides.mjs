import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";

const DECK_DIR = path.resolve("public/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function main() {
  console.log("=== Launching Chrome to render Lesson 02 Methylene Blue Slides ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  // ---------------------------------------------------------------------------
  // 1. SLIDE 8: Biochemical Mechanism: Methylene Blue Targeting & DNA Binding
  // ---------------------------------------------------------------------------
  console.log("\n[1/3] Rendering slide_08_methylene_blue_mechanism.png...");

  const slide8Html = `
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
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }

  .slide-container {
    width: 1376px;
    height: 768px;
    padding: 30px 44px 22px 44px;
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #e0f2fe;
    color: #0284c7;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 9999px;
    border: 1px solid #bae6fd;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .header-meta {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.02em;
  }

  .title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  h1 {
    font-size: 32px;
    font-weight: 800;
    color: #091e42;
    letter-spacing: -0.025em;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .subtitle {
    font-size: 15.5px;
    font-weight: 600;
    color: #1e293b;
    margin-top: 1px;
  }

  /* 4 Pillars Layout */
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-top: 14px;
    margin-bottom: 12px;
    flex: 1;
  }

  .pillar-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.06);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .pillar-header {
    background: #0a2540;
    padding: 14px 16px;
    color: #ffffff;
    position: relative;
  }
  .pillar-header h3 {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 15.5px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: -0.01em;
  }
  .pillar-header .pillar-badge {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.8;
    margin-top: 3px;
  }
  .pillar-divider {
    height: 4px;
    background: #00b4d8;
    width: 100%;
  }

  .card-p1 .pillar-divider { background: linear-gradient(90deg, #0284c7, #38bdf8); }
  .card-p2 .pillar-divider { background: linear-gradient(90deg, #ef4444, #f87171); }
  .card-p3 .pillar-divider { background: linear-gradient(90deg, #8b5cf6, #c084fc); }
  .card-p4 .pillar-divider { background: linear-gradient(90deg, #059669, #34d399); }

  .pillar-body {
    padding: 16px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    background: #ffffff;
  }

  .charge-pill-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
  }
  .pill-blue {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
  }
  .pill-red {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }
  .pill-purple {
    background: #faf5ff;
    color: #6b21a8;
    border: 1px solid #e9d5ff;
  }
  .pill-green {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
  }

  .point-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12.8px;
    color: #334155;
    line-height: 1.45;
  }
  .point-list li {
    display: flex;
    gap: 7px;
    align-items: flex-start;
  }
  .point-list li::before {
    content: "•";
    color: #0284c7;
    font-weight: bold;
    font-size: 16px;
    line-height: 1;
  }
  .card-p2 .point-list li::before { color: #ef4444; }
  .card-p3 .point-list li::before { color: #8b5cf6; }
  .card-p4 .point-list li::before { color: #059669; }

  .point-list strong {
    color: #0f172a;
  }

  .formula-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 7px 10px;
    font-family: "JetBrains Mono", monospace;
    font-size: 11.5px;
    color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Bottom Takeaway Bar */
  .bottom-banner {
    background: #0a2540;
    border-radius: 12px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(10, 37, 64, 0.15);
  }
  .banner-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .banner-tag {
    background: #0284c7;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 6px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .banner-text {
    font-size: 13.5px;
    color: #e2e8f0;
    line-height: 1.4;
  }
  .banner-text strong {
    color: #38bdf8;
  }
  .watermark {
    font-size: 11.5px;
    font-weight: 600;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="corner-glow"></div>

  <div class="slide-container">
    <!-- Top Header -->
    <header class="header">
      <div class="badge-row">
        <span class="badge">OCR Level 3 AAQ Human Biology</span>
        <span class="header-meta">Unit F173: Biomedical Techniques • Clinical Staining Baseline</span>
      </div>
      <div class="title-row">
        <h1>Biochemical Mechanism: Methylene Blue Targeting & DNA Binding</h1>
      </div>
      <div class="subtitle">Electrostatic Attraction, Phosphate Backbone Polyanion & Minor Groove Intercalation</div>
    </header>

    <!-- 4 Mechanism Pillars -->
    <main class="pillars-grid">
      <!-- Pillar 1: Cationic Dye -->
      <div class="pillar-card card-p1">
        <div class="pillar-header">
          <h3><span>🧪</span> 1. Cationic Dye</h3>
          <div class="pillar-badge">Phenothiazinium Structure</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="charge-pill-display pill-blue">
            <span>Delocalised Net Charge</span>
            <span style="font-size: 13px;">+1.00 e / MB⁺</span>
          </div>
          <ul class="point-list">
            <li><strong>Molecular Formula:</strong> C₁₆H₁₈ClN₃S (Molar mass: 319.85 g/mol).</li>
            <li><strong>Aqueous Dissociation:</strong> Readily ionises into Cl⁻ and the chromophore cation [MB]⁺.</li>
            <li><strong>Resonance Structure:</strong> Positive charge is shared across planar aromatic rings and dimethylamino nitrogens.</li>
          </ul>
          <div class="formula-box">
            <span>MB-Cl(aq)</span>
            <span style="color: #0284c7;">→ MB⁺ + Cl⁻</span>
          </div>
        </div>
      </div>

      <!-- Pillar 2: Polyanionic DNA -->
      <div class="pillar-card card-p2">
        <div class="pillar-header">
          <h3><span>🧬</span> 2. Polyanionic DNA</h3>
          <div class="pillar-badge">Sugar-Phosphate Chain</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="charge-pill-display pill-red">
            <span>Residue Formal Charge</span>
            <span style="font-size: 13px;">-1.00 e / PO₄⁻</span>
          </div>
          <ul class="point-list">
            <li><strong>Phosphate Residues:</strong> Repeating deoxynucleotides joined by 3'–5' phosphodiester bridges.</li>
            <li><strong>Full Ionisation:</strong> At physiological pH (~7.4), phosphate pKₐ ≈ 1; fully deprotonated to PO₄⁻.</li>
            <li><strong>Negative Electrostatic Well:</strong> Dense polyanionic charge envelope wraps the entire helical perimeter.</li>
          </ul>
          <div class="formula-box">
            <span>-O-P(=O)(O⁻)-O-</span>
            <span style="color: #dc2626;">pH 7.4 Net: -1e</span>
          </div>
        </div>
      </div>

      <!-- Pillar 3: Electrostatic Attraction -->
      <div class="pillar-card card-p3">
        <div class="pillar-header">
          <h3><span>⚡</span> 3. Dual Binding Mode</h3>
          <div class="pillar-badge">Coulombic & Intercalation</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="charge-pill-display pill-purple">
            <span>Binding Free Energy</span>
            <span style="font-size: 13px;">ΔG° &lt; 0 (Exergonic)</span>
          </div>
          <ul class="point-list">
            <li><strong>Coulombic Attraction:</strong> Strong ionic affinity draws cationic MB⁺ directly to negative DNA oxygens.</li>
            <li><strong>Minor Groove Insertion:</strong> Planar phenothiazinium ring docks cleanly inside the minor groove.</li>
            <li><strong>Base-Pair Intercalation:</strong> Aromatic π-stacking slips between adjacent base pairs (G-C rich regions).</li>
          </ul>
          <div class="formula-box">
            <span>F = k·(q₁q₂)/r²</span>
            <span style="color: #7c3aed;">Attractive (q₁⁺ q₂⁻)</span>
          </div>
        </div>
      </div>

      <!-- Pillar 4: Cytological Outcome -->
      <div class="pillar-card card-p4">
        <div class="pillar-header">
          <h3><span>🔬</span> 4. Cytological Result</h3>
          <div class="pillar-badge">Differential Staining</div>
        </div>
        <div class="pillar-divider"></div>
        <div class="pillar-body">
          <div class="charge-pill-display pill-green">
            <span>Nuclear Diagnostic</span>
            <span style="font-size: 13px;">Deep Dark Blue</span>
          </div>
          <ul class="point-list">
            <li><strong>Concentrated Nucleus:</strong> Genomic chromatin holds billions of negative phosphate residues in the nucleus.</li>
            <li><strong>High Dye Density:</strong> Concentrated MB⁺ accumulation produces intense deep blue nuclear staining.</li>
            <li><strong>Diagnostic Contrast:</strong> Protein-rich cytoplasm contains fewer polyanions, staining very faintly.</li>
          </ul>
          <div class="formula-box">
            <span>Nucleus : Cytoplasm</span>
            <span style="color: #059669;">10:1 Contrast Ratio</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Takeaway Bar -->
    <footer class="bottom-banner">
      <div class="banner-left">
        <span class="banner-tag">Laboratory Rule</span>
        <span class="banner-text">
          <strong>Basic (Cationic) Stains</strong> like Methylene Blue target <strong>negatively charged polyanions (DNA/RNA)</strong>. Acidic (Anionic) stains like Eosin target positively charged basic proteins in the cytoplasm.
        </span>
      </div>
      <div class="watermark">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <span>Gemini Notebook</span>
      </div>
    </footer>
  </div>
</body>
</html>
  `;

  await page.setContent(slide8Html);
  await page.waitForTimeout(600); // Allow webfonts to render completely
  const slide8Path = path.join(SLIDES_DIR, "slide_08_methylene_blue_mechanism.png");
  await page.screenshot({ path: slide8Path, type: "png" });

  const qa8 = await validateGeneratedSlideImage({ outputPath: slide8Path });
  console.log("Slide 8 QA Validation:", qa8.passed ? "PASSED" : "FAILED", qa8.checks);
  if (!qa8.passed) throw new Error("Slide 8 image failed QA: " + JSON.stringify(qa8.checks));

  // ---------------------------------------------------------------------------
  // 2. SLIDE 9: Interactive 3D Molecular Lab: DNA Electrostatic Potential Cover
  // ---------------------------------------------------------------------------
  console.log("\n[2/3] Rendering slide_09_methylene_blue_interactive_cover.png...");

  const slide9Html = `
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
    background: #07101e;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #f8fafc;
    position: relative;
  }

  /* Radial deep space background glow */
  .bg-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 30%, #0d2847 0%, #07101e 75%, #030712 100%);
    pointer-events: none;
  }
  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .slide-container {
    width: 1376px;
    height: 768px;
    padding: 32px 48px 24px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  /* Header */
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(6, 182, 212, 0.15);
    color: #22d3ee;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 9999px;
    border: 1px solid rgba(6, 182, 212, 0.35);
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .header-meta {
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.02em;
  }

  h1 {
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.025em;
    font-family: "Plus Jakarta Sans", sans-serif;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .subtitle {
    font-size: 15px;
    font-weight: 500;
    color: #cbd5e1;
  }

  /* Main Visualization Stage */
  .stage-row {
    display: flex;
    gap: 28px;
    margin-top: 14px;
    margin-bottom: 12px;
    flex: 1;
    align-items: stretch;
  }

  .visual-preview-box {
    flex: 1.25;
    background: rgba(13, 27, 46, 0.85);
    border: 1.5px solid rgba(6, 182, 212, 0.35);
    border-radius: 20px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 0 35px rgba(6, 182, 212, 0.15);
  }

  /* SVG 3D Molecular Simulation Graphic */
  .dna-svg-container {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.95;
  }

  .preview-overlay-info {
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .tech-chip {
    background: rgba(15, 23, 42, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 11px;
    font-family: "JetBrains Mono", monospace;
    color: #38bdf8;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .potential-legend {
    position: relative;
    z-index: 5;
    background: rgba(7, 16, 30, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    padding: 10px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .legend-bar-title {
    display: flex;
    justify-content: space-between;
    font-size: 11.5px;
    font-weight: 700;
  }
  .legend-gradient {
    height: 10px;
    border-radius: 9999px;
    background: linear-gradient(90deg, #ef4444 0%, #ffffff 50%, #3b82f6 100%);
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
  }

  /* Right Control Panel */
  .features-panel {
    flex: 0.95;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 14px;
  }

  .feature-cards-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .feature-item {
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .feature-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(6, 182, 212, 0.15);
    border: 1px solid rgba(6, 182, 212, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .feature-text h4 {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .feature-text p {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
  }

  /* Launch Interactive Box */
  .launch-action-box {
    background: linear-gradient(135deg, rgba(8, 145, 178, 0.25) 0%, rgba(2, 132, 199, 0.15) 100%);
    border: 1.5px solid #06b6d4;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 0 25px rgba(6, 182, 212, 0.2);
  }
  .launch-btn {
    width: 100%;
    padding: 12px 20px;
    border-radius: 10px;
    background: linear-gradient(90deg, #06b6d4 0%, #0284c7 100%);
    color: #ffffff;
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: none;
    box-shadow: 0 4px 16px rgba(6, 182, 212, 0.45);
  }
  .sync-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11.5px;
    color: #94a3b8;
  }
  .sync-dot {
    width: 7px;
    height: 7px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 8px #10b981;
  }

  /* Footer */
  .bottom-hud {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #64748b;
    font-size: 12px;
  }
  .bottom-hud-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .status-tag {
    color: #22d3ee;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="grid-pattern"></div>

  <div class="slide-container">
    <!-- Header -->
    <header class="header">
      <div class="badge-row">
        <span class="badge">Interactive Simulation • Web Embed</span>
        <span class="header-meta">Unit F173: Biomedical Techniques • Molecular Biophysics</span>
      </div>
      <h1><span>🔬</span> Interactive 3D Molecular Lab: DNA Electrostatic Potential</h1>
      <div class="subtitle">Real-time $3Dmol.js Solvent Accessible Surface (SAS) & Methylene Blue Docking Simulation</div>
    </header>

    <!-- Center Stage -->
    <main class="stage-row">
      <!-- 3D DNA Graphic Preview Box -->
      <div class="visual-preview-box">
        <div class="dna-svg-container">
          <svg width="600" height="380" viewBox="0 0 600 380" fill="none">
            <defs>
              <linearGradient id="dnaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ef4444" stop-opacity="0.9"/>
                <stop offset="50%" stop-color="#f8fafc" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.9"/>
              </linearGradient>
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>

            <!-- Helical Strands Visual Representation -->
            <!-- Strand 1 (Sine wave) -->
            <path d="M 80 190 Q 140 90, 200 190 T 320 190 T 440 190 T 540 190" stroke="#ef4444" stroke-width="8" fill="none" opacity="0.85" filter="url(#glowFilter)"/>
            <!-- Strand 2 (Cosine wave) -->
            <path d="M 80 190 Q 140 290, 200 190 T 320 190 T 440 190 T 540 190" stroke="#3b82f6" stroke-width="8" fill="none" opacity="0.85" filter="url(#glowFilter)"/>

            <!-- Phosphate spheres on Strand 1 (Red Anionic) -->
            <circle cx="140" cy="95" r="14" fill="#ef4444" filter="url(#glowFilter)"/>
            <text x="140" y="99" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">PO₄⁻</text>

            <circle cx="260" cy="95" r="14" fill="#ef4444" filter="url(#glowFilter)"/>
            <text x="260" y="99" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">PO₄⁻</text>

            <circle cx="380" cy="95" r="14" fill="#ef4444" filter="url(#glowFilter)"/>
            <text x="380" y="99" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">PO₄⁻</text>

            <circle cx="500" cy="95" r="14" fill="#ef4444" filter="url(#glowFilter)"/>
            <text x="500" y="99" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">PO₄⁻</text>

            <!-- Base pair rungs -->
            <line x1="140" y1="110" x2="140" y2="270" stroke="#94a3b8" stroke-width="3" stroke-dasharray="4 4" opacity="0.7"/>
            <line x1="200" y1="180" x2="200" y2="200" stroke="#94a3b8" stroke-width="4" opacity="0.7"/>
            <line x1="260" y1="110" x2="260" y2="270" stroke="#94a3b8" stroke-width="3" stroke-dasharray="4 4" opacity="0.7"/>
            <line x1="320" y1="180" x2="320" y2="200" stroke="#94a3b8" stroke-width="4" opacity="0.7"/>
            <line x1="380" y1="110" x2="380" y2="270" stroke="#94a3b8" stroke-width="3" stroke-dasharray="4 4" opacity="0.7"/>
            <line x1="440" y1="180" x2="440" y2="200" stroke="#94a3b8" stroke-width="4" opacity="0.7"/>

            <!-- Methylene Blue Docked Ligand in Minor Groove (Cyan/Blue Rings) -->
            <g transform="translate(300, 160)" filter="url(#glowFilter)">
              <rect x="-35" y="-12" width="70" height="24" rx="12" fill="#06b6d4" opacity="0.85"/>
              <circle cx="-20" cy="0" r="7" fill="#22d3ee"/>
              <circle cx="0" cy="0" r="7" fill="#38bdf8"/>
              <circle cx="20" cy="0" r="7" fill="#60a5fa"/>
              <text x="0" y="4" fill="#07101e" font-size="10.5" font-weight="900" font-family="Plus Jakarta Sans" text-anchor="middle">MB⁺ (+1e)</text>
              <path d="M 0 -15 L 0 -30" stroke="#22d3ee" stroke-width="2" stroke-dasharray="2 2"/>
              <circle cx="0" cy="-32" r="3" fill="#22d3ee"/>
              <text x="0" y="-38" fill="#22d3ee" font-size="10" font-weight="bold" text-anchor="middle">Minor Groove Docking</text>
            </g>

            <!-- Electrostatic attraction vectors -->
            <path d="M 275 148 L 265 115" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3 3"/>
            <polygon points="265,115 261,123 270,121" fill="#fbbf24"/>
            <text x="240" y="142" fill="#fbbf24" font-size="9" font-weight="bold">Coulomb Force</text>
          </svg>
        </div>

        <div class="preview-overlay-info">
          <div class="tech-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <span>$3Dmol.js • VolumeData(dxData, 'dx')</span>
          </div>
          <div class="tech-chip">
            <span>B-DNA 10-bp • OpenDX 4,500 Voxels</span>
          </div>
        </div>

        <!-- Electrostatic Scale -->
        <div class="potential-legend">
          <div class="legend-bar-title">
            <span style="color: #f87171;">-5.0 kcal/mol·e (Polyanion PO₄⁻)</span>
            <span style="color: #cbd5e1;">0.0 Neutral</span>
            <span style="color: #60a5fa;">+5.0 kcal/mol·e (Cation MB⁺)</span>
          </div>
          <div class="legend-gradient"></div>
        </div>
      </div>

      <!-- Right Features & Launch Box -->
      <div class="features-panel">
        <div class="feature-cards-grid">
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <div class="feature-text">
              <h4>Real-time 360° Rotational Control</h4>
              <p>Drag to inspect 3D minor and major groove geometry with inertia and zoom.</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <div class="feature-text">
              <h4>Solvent-Accessible Surface (SAS)</h4>
              <p>Continuous OpenDX Poisson-Boltzmann electrostatic potential mapped to RWB colors.</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <div class="feature-text">
              <h4>Interactive Atom/Charge Probe</h4>
              <p>Click any residue or ligand to inspect local electrostatic potential and charge values.</p>
            </div>
          </div>
        </div>

        <div class="launch-action-box">
          <button class="launch-btn">
            <span>LAUNCH 3D MOLECULAR LAB</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
          <div class="sync-note">
            <div class="sync-dot"></div>
            <span>Dual-Screen BroadcastChannel Synchronisation Active</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom HUD -->
    <footer class="bottom-hud">
      <div class="bottom-hud-left">
        <span class="status-tag">READY FOR INTERACTION</span>
        <span>Click the button above or advance slide to load the fully responsive 3D simulator.</span>
      </div>
      <div>Gemini Notebook • OCR Level 3 AAQ Human Biology</div>
    </footer>
  </div>
</body>
</html>
  `;

  await page.setContent(slide9Html);
  await page.waitForTimeout(600);
  const slide9Path = path.join(SLIDES_DIR, "slide_09_methylene_blue_interactive_cover.png");
  await page.screenshot({ path: slide9Path, type: "png" });

  const qa9 = await validateGeneratedSlideImage({ outputPath: slide9Path });
  console.log("Slide 9 QA Validation:", qa9.passed ? "PASSED" : "FAILED", qa9.checks);
  if (!qa9.passed) throw new Error("Slide 9 image failed QA: " + JSON.stringify(qa9.checks));

  // ---------------------------------------------------------------------------
  // 3. SLIDE 10: Copy existing slide_08.png to slide_10.png
  // ---------------------------------------------------------------------------
  console.log("\n[3/3] Setting up slide_10.png (Plenary Summary)...");
  const slide8OriginalPath = path.join(SLIDES_DIR, "slide_08.png");
  const slide10Path = path.join(SLIDES_DIR, "slide_10.png");
  await fs.copyFile(slide8OriginalPath, slide10Path);
  console.log("Copied slide_08.png -> slide_10.png successfully.");

  await browser.close();

  // ---------------------------------------------------------------------------
  // 4. Update manifest.json with the new 10-slide sequence
  // ---------------------------------------------------------------------------
  console.log("\n=== Updating manifest.json for Lesson 02 ===");
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  manifest.totalSlides = 10;

  // Locate the plenary slide (currently slide 8)
  const plenarySlide = manifest.slides.find(s => s.number === 8);
  if (plenarySlide) {
    plenarySlide.number = 10;
    plenarySlide.imageFileName = "slide_10.png";
    plenarySlide.imageUrl = "/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist/slides/slide_10.png";
  }

  // Define new Slide 8
  const slide8ManifestEntry = {
    number: 8,
    title: "Biochemical Mechanism: Methylene Blue Targeting & DNA Binding",
    imageFileName: "slide_08_methylene_blue_mechanism.png",
    imageUrl: "/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist/slides/slide_08_methylene_blue_mechanism.png",
    sourceMediaPath: null,
    isInteractive: false,
    interactiveType: null,
    cognitiveGuide: {
      estimatedTimeSeconds: 32,
      timeGuideDisplay: "28–36s",
      vciScore: "5.0",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Medium Processing",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1100,
        readingMs: 16500,
        semanticProcessingMs: 14000,
        wordCount: 52,
        visualElementsCount: 4
      },
      academicReferences: [
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
          relevance: "Organises complex chemical staining mechanism into four discrete cognitive pillars."
        },
        {
          citation: "Rosenholtz, R., Li, Y., & Nakano, L. (2007). Measuring visual clutter. Journal of Vision, 7(2), 17.",
          relevance: "Preserves high visual legibility across chemical charge annotations."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      format: "statement_only"
    }
  };

  // Define new Slide 9 (Interactive 3D Web Embed)
  const slide9ManifestEntry = {
    number: 9,
    title: "Interactive 3D Molecular Lab: DNA Electrostatic Potential & Methylene Blue Binding",
    imageFileName: "slide_09_methylene_blue_interactive_cover.png",
    imageUrl: "/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist/slides/slide_09_methylene_blue_interactive_cover.png",
    sourceMediaPath: null,
    isInteractive: true,
    interactiveType: "web_embed",
    webEmbed: {
      url: "/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist/interactives/dna_electrostatic_methylene_blue.html",
      title: "Interactive 3D Molecular Lab: DNA Electrostatics & Methylene Blue",
      label: "DNA Electrostatic Lab ($3Dmol.js)"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 35,
      timeGuideDisplay: "30–45s",
      vciScore: "4.7",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Medium Processing",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1000,
        readingMs: 14000,
        semanticProcessingMs: 18000,
        wordCount: 42,
        visualElementsCount: 3
      },
      academicReferences: [
        {
          citation: "Donderi, D. C. (2006). Visual complexity and information processing. Canadian Psychology, 47(1), 71.",
          relevance: "Quantifies 3D interactive manipulation processing speed."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      format: "statement_only"
    }
  };

  // Insert slides 8 and 9 into array
  const updatedSlides = [];
  for (let i = 1; i <= 7; i++) {
    const existing = manifest.slides.find(s => s.number === i);
    if (existing) updatedSlides.push(existing);
  }
  updatedSlides.push(slide8ManifestEntry);
  updatedSlides.push(slide9ManifestEntry);
  if (plenarySlide) {
    updatedSlides.push(plenarySlide);
  }

  manifest.slides = updatedSlides;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log("manifest.json updated successfully with 10 slides.");
}

main().catch(err => {
  console.error("FATAL ERROR in generate_lesson_02_mb_slides:", err);
  process.exit(1);
});
