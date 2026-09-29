import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

export function getCellCycleSlideHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700;800&display=swap");
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: radial-gradient(circle at 50% 18%, #4f607a 0%, #314053 50%, #202b3a 100%);
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #ffffff;
    position: relative;
  }

  /* Radiant ambient lighting mesh */
  .glow-top-left {
    position: absolute;
    top: -180px;
    left: -140px;
    width: 780px;
    height: 780px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.40) 0%, rgba(56, 189, 248, 0) 70%);
    pointer-events: none;
  }
  .glow-bottom-right {
    position: absolute;
    bottom: -160px;
    right: -120px;
    width: 750px;
    height: 750px;
    background: radial-gradient(circle, rgba(232, 121, 249, 0.32) 0%, rgba(232, 121, 249, 0) 70%);
    pointer-events: none;
  }
  .glow-center {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 900px;
    height: 500px;
    background: radial-gradient(ellipse at center, rgba(147, 197, 253, 0.18) 0%, rgba(147, 197, 253, 0) 70%);
    pointer-events: none;
  }

  /* Slide Container */
  .slide-container {
    width: 1376px;
    height: 768px;
    padding: 24px 44px 20px 44px;
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
    gap: 8px;
  }
  .badge-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .badge-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 13.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 5.5px 16px;
    border-radius: 9999px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .badge-topic {
    background: rgba(245, 158, 11, 0.32);
    color: #fef08a;
    border: 1.5px solid rgba(250, 204, 21, 0.85);
    box-shadow: 0 0 16px rgba(250, 204, 21, 0.35);
  }
  .badge-phase {
    background: rgba(6, 182, 212, 0.30);
    color: #a5f3fc;
    border: 1.5px solid rgba(6, 182, 212, 0.8);
    box-shadow: 0 0 16px rgba(6, 182, 212, 0.3);
  }
  .badge-gate {
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
  }
  .topic-tag {
    font-size: 15px;
    font-weight: 750;
    color: #f1f5f9;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    gap: 9px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  .topic-tag .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #00f0ff;
    box-shadow: 0 0 12px #00f0ff;
  }

  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  .slide-title {
    font-size: 33px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    font-family: "Plus Jakarta Sans", sans-serif;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
    white-space: nowrap;
  }
  .subtitle {
    font-size: 15.5px;
    color: #e2e8f0;
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    text-align: right;
  }

  /* Main Layout: Diagram on Left, 3 Checkpoint Cards on Right */
  .main-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-top: 4px;
    height: 580px;
  }

  /* Left Panel: Circular Diagram Glass Card */
  .diagram-panel {
    width: 550px;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.11) 100%);
    border: 1.8px solid rgba(255, 255, 255, 0.45);
    border-radius: 20px;
    padding: 14px 18px;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.55);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    backdrop-filter: blur(14px);
  }
  .diagram-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
    padding-bottom: 8px;
  }
  .diagram-title {
    font-size: 18px;
    font-weight: 800;
    color: #ffffff;
    font-family: "Plus Jakarta Sans", sans-serif;
    letter-spacing: -0.01em;
  }
  .diagram-subtag {
    font-size: 12px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 9999px;
    background: rgba(6, 182, 212, 0.22);
    color: #a5f3fc;
    border: 1px solid rgba(6, 182, 212, 0.6);
    font-family: "JetBrains Mono", monospace;
  }

  .svg-wrapper {
    width: 514px;
    height: 446px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .diagram-footer-note {
    font-size: 12.5px;
    font-weight: 600;
    color: #cbd5e1;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(15, 23, 42, 0.45);
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Right Panel: 3 Stacked Checkpoint Cards */
  .cards-panel {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;
  }

  .checkpoint-card {
    position: relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.12) 100%);
    border: 1.8px solid rgba(255, 255, 255, 0.45);
    border-radius: 17px;
    padding: 12px 20px 12px 24px;
    box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.38), inset 0 2px 4px rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    backdrop-filter: blur(14px);
    height: 180px;
  }

  /* Left vertical glowing neon bar */
  .neon-bar {
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 6.5px;
    border-radius: 0 4px 4px 0;
  }
  .bar-g1s { background: #facc15; box-shadow: 0 0 16px #facc15, 0 0 32px rgba(250, 204, 21, 0.7); }
  .bar-g2m { background: #00f0ff; box-shadow: 0 0 16px #00f0ff, 0 0 32px rgba(0, 240, 255, 0.7); }
  .bar-m   { background: #f43f5e; box-shadow: 0 0 16px #f43f5e, 0 0 32px rgba(244, 63, 94, 0.7); }

  .cp-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3px;
  }
  .cp-badge {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 3.5px 12px;
    border-radius: 9999px;
    font-family: "JetBrains Mono", monospace;
  }
  .cp-badge-g1s { background: rgba(250, 204, 21, 0.32); color: #fef08a; border: 1.5px solid rgba(250, 204, 21, 0.8); }
  .cp-badge-g2m { background: rgba(0, 240, 255, 0.32); color: #cffafe; border: 1.5px solid rgba(0, 240, 255, 0.8); }
  .cp-badge-m   { background: rgba(244, 63, 94, 0.32); color: #ffe4e6; border: 1.5px solid rgba(244, 63, 94, 0.8); }

  .cp-phase-tag {
    font-size: 13px;
    font-weight: 750;
    color: #e2e8f0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .cp-title {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.25;
    letter-spacing: -0.015em;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  }

  .cp-details {
    background: rgba(15, 23, 42, 0.45);
    border: 1.5px solid rgba(255, 255, 255, 0.36);
    border-radius: 11px;
    padding: 8px 14px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.32);
    height: 78px;
    justify-content: center;
  }
  .cp-cue {
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-family: "JetBrains Mono", monospace;
  }
  .cue-g1s { color: #fde047; }
  .cue-g2m { color: #38bdf8; }
  .cue-m   { color: #fb7185; }

  .cp-text {
    font-size: 14.5px;
    line-height: 1.32;
    color: #ffffff;
    font-weight: 600;
  }

  /* Footer */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #e2e8f0;
    font-weight: 600;
    padding-top: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  .footer-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .watermark {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #e2e8f0;
    font-size: 14px;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="glow-top-left"></div>
  <div class="glow-bottom-right"></div>
  <div class="glow-center"></div>

  <div class="slide-container">
    <!-- Header -->
    <div class="header">
      <div class="badge-row">
        <div class="badge-group">
          <span class="badge badge-topic">Cell Cycle Regulation</span>
          <span class="badge badge-phase">S-Phase Gateway</span>
          <span class="badge badge-gate">Genomic Integrity Surveillance</span>
        </div>
        <div class="topic-tag">
          <span class="dot"></span>
          OCR Level 3 Cambridge Advanced National (AAQ) Human Biology
        </div>
      </div>
      <div class="title-row">
        <h1 class="slide-title">Cell Cycle Checkpoints: The Gatekeepers of Replication</h1>
        <span class="subtitle">Surveillance mechanisms securing genetic stability prior to DNA synthesis</span>
      </div>
    </div>

    <!-- Main Content: Diagram (Left) & Checkpoint Cards (Right) -->
    <div class="main-content">
      <!-- Diagram Panel -->
      <div class="diagram-panel">
        <div class="diagram-header">
          <span class="diagram-title">Eukaryotic Cell Cycle & Surveillance Points</span>
          <span class="diagram-subtag">SURVEILLANCE TRACK</span>
        </div>

        <div class="svg-wrapper">
          <svg width="510" height="430" viewBox="0 0 510 430" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Gradients for Cycle Segments -->
              <linearGradient id="gradG1" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#2563eb" />
                <stop offset="100%" stop-color="#60a5fa" />
              </linearGradient>
              <linearGradient id="gradS" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0284c7" />
                <stop offset="100%" stop-color="#00f0ff" />
              </linearGradient>
              <linearGradient id="gradG2" x1="100%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#059669" />
                <stop offset="100%" stop-color="#34d399" />
              </linearGradient>
              <linearGradient id="gradM" x1="100%" y1="100%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#e11d48" />
                <stop offset="100%" stop-color="#fb7185" />
              </linearGradient>

              <!-- Filter Glow -->
              <filter id="neonGlowYellow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="neonGlowCyan" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="neonGlowRose" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Outer Orbit Guide Ring -->
            <circle cx="255" cy="205" r="160" stroke="rgba(255,255,255,0.12)" stroke-width="2" stroke-dasharray="4 4" />

            <!-- Track Segments: Center=(255, 205), R=142 -->
            <!-- G1 Phase Arc (Blue): Left quadrant -->
            <path d="M 115 215 A 142 142 0 0 1 180 82" stroke="url(#gradG1)" stroke-width="26" stroke-linecap="round" />
            
            <!-- S Phase Arc (Cyan Glowing - Target of Replication): Top right quadrant -->
            <path d="M 198 70 A 142 142 0 0 1 364 116" stroke="url(#gradS)" stroke-width="32" stroke-linecap="round" filter="drop-shadow(0 0 14px rgba(0,240,255,0.5))" />

            <!-- G2 Phase Arc (Green): Right quadrant -->
            <path d="M 374 130 A 142 142 0 0 1 334 316" stroke="url(#gradG2)" stroke-width="26" stroke-linecap="round" />

            <!-- M Phase Arc (Pink/Rose): Bottom quadrant -->
            <path d="M 320 328 A 142 142 0 0 1 140 250" stroke="url(#gradM)" stroke-width="26" stroke-linecap="round" />

            <!-- Central Hub (Glassmorphism circle) -->
            <circle cx="255" cy="205" r="86" fill="rgba(15, 23, 42, 0.78)" stroke="rgba(255, 255, 255, 0.38)" stroke-width="2" />
            <text x="255" y="190" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">CELL CYCLE</text>
            <text x="255" y="208" text-anchor="middle" fill="#94a3b8" font-size="12" font-weight="700" font-family="'JetBrains Mono', monospace">SURVEILLANCE</text>
            <text x="255" y="226" text-anchor="middle" fill="#38bdf8" font-size="11.5" font-weight="700">p53 / ATM / ATR / CDKs</text>

            <!-- Phase Labels on Segments -->
            <!-- G1 Label -->
            <text x="100" y="140" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">G₁ PHASE</text>
            <text x="100" y="158" text-anchor="middle" fill="#e2e8f0" font-size="11.5" font-weight="600">Growth &</text>
            <text x="100" y="174" text-anchor="middle" fill="#e2e8f0" font-size="11.5" font-weight="600">Preparation</text>

            <!-- S Phase Label (Prominent Neon Glow) -->
            <rect x="238" y="20" width="170" height="48" rx="10" fill="rgba(2, 132, 199, 0.88)" stroke="#00f0ff" stroke-width="1.8" filter="drop-shadow(0 0 14px rgba(0,240,255,0.65))" />
            <text x="323" y="39" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">★ S PHASE (NEXT)</text>
            <text x="323" y="56" text-anchor="middle" fill="#cffafe" font-size="11.5" font-weight="700">DNA Semiconservative Replication</text>

            <!-- G2 Label -->
            <text x="405" y="218" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">G₂ PHASE</text>
            <text x="405" y="236" text-anchor="middle" fill="#e2e8f0" font-size="11.5" font-weight="600">Pre-mitotic</text>
            <text x="405" y="252" text-anchor="middle" fill="#e2e8f0" font-size="11.5" font-weight="600">Fidelity Check</text>

            <!-- M Label (Mitosis) -->
            <text x="255" y="380" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">M PHASE (Mitosis)</text>

            <!-- CHECKPOINT 1: G1/S Checkpoint (Restriction Point) -->
            <g filter="url(#neonGlowYellow)">
              <circle cx="188" cy="74" r="14" fill="#facc15" stroke="#ffffff" stroke-width="2.5" />
              <text x="188" y="79" text-anchor="middle" fill="#000000" font-size="12" font-weight="900" font-family="'JetBrains Mono', monospace">1</text>
            </g>
            <rect x="44" y="42" width="132" height="28" rx="7" fill="rgba(250, 204, 21, 0.32)" stroke="#facc15" stroke-width="1.5" />
            <text x="110" y="60" text-anchor="middle" fill="#fef08a" font-size="11.5" font-weight="800">G₁/S CHECKPOINT</text>

            <!-- CHECKPOINT 2: G2/M Checkpoint -->
            <g filter="url(#neonGlowCyan)">
              <circle cx="328" cy="322" r="14" fill="#00f0ff" stroke="#ffffff" stroke-width="2.5" />
              <text x="328" y="327" text-anchor="middle" fill="#000000" font-size="12" font-weight="900" font-family="'JetBrains Mono', monospace">2</text>
            </g>
            <rect x="350" y="312" width="138" height="28" rx="7" fill="rgba(0, 240, 255, 0.28)" stroke="#00f0ff" stroke-width="1.5" />
            <text x="419" y="330" text-anchor="middle" fill="#cffafe" font-size="12" font-weight="800">G₂/M CHECKPOINT</text>

            <!-- CHECKPOINT 3: Spindle Checkpoint (SAC) -->
            <g filter="url(#neonGlowRose)">
              <circle cx="198" cy="316" r="13" fill="#f43f5e" stroke="#ffffff" stroke-width="2.5" />
              <text x="198" y="321" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900" font-family="'JetBrains Mono', monospace">3</text>
            </g>
            <rect x="100" y="336" width="108" height="26" rx="6" fill="rgba(244, 63, 94, 0.32)" stroke="#f43f5e" stroke-width="1.5" />
            <text x="154" y="353" text-anchor="middle" fill="#ffe4e6" font-size="11" font-weight="800">M / SAC CHECK</text>

            <!-- G0 Pathway Exit (Linking to Patient A / Senescence!) -->
            <path d="M 115 224 C 65 242 42 268 42 292" stroke="#c084fc" stroke-width="2.8" stroke-dasharray="4 3" fill="none" />
            <polygon points="42,298 37,288 47,288" fill="#c084fc" />
            <rect x="6" y="302" width="98" height="40" rx="8" fill="rgba(168, 85, 247, 0.3)" stroke="#c084fc" stroke-width="1.4" />
            <text x="55" y="318" text-anchor="middle" fill="#f3e8ff" font-size="11" font-weight="800">G₀ PHASE</text>
            <text x="55" y="332" text-anchor="middle" fill="#e9d5ff" font-size="9.5" font-weight="600">Senescence (Pt. A)</text>
          </svg>
        </div>

        <div class="diagram-footer-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Crucial Link: S-Phase replicates 3 billion bp; passing Checkpoint 1 commits cells irreversibly to division.
        </div>
      </div>

      <!-- Right Panel: 3 Checkpoint Detail Cards -->
      <div class="cards-panel">
        <!-- Card 1: G1/S Checkpoint -->
        <div class="checkpoint-card" id="card_cp_1">
          <div class="neon-bar bar-g1s"></div>
          <div>
            <div class="cp-top">
              <span class="cp-badge cp-badge-g1s">CHECKPOINT 1 · THE RESTRICTION POINT</span>
              <span class="cp-phase-tag">Late G₁ → S Gateway</span>
            </div>
            <h2 class="cp-title">G₁/S DNA Damage & Growth Checkpoint</h2>
          </div>
          <div class="cp-details" id="box_cp_1">
            <div class="cp-cue cue-g1s">Surveillance Focus & Molecular Mechanism:</div>
            <div class="cp-text">Verifies DNA template integrity, cell volume, and energy stores. Double-strand breaks trigger <strong>ATM/ATR kinase</strong> cascades that activate <strong>p53 transcription factor</strong>, upregulating <strong>p21</strong> to arrest CDK2/cyclin E and block replication fork initiation.</div>
          </div>
        </div>

        <!-- Card 2: G2/M Checkpoint -->
        <div class="checkpoint-card" id="card_cp_2">
          <div class="neon-bar bar-g2m"></div>
          <div>
            <div class="cp-top">
              <span class="cp-badge cp-badge-g2m">CHECKPOINT 2 · REPLICATION FIDELITY</span>
              <span class="cp-phase-tag">Post-Replication Surveillance</span>
            </div>
            <h2 class="cp-title">G₂/M DNA Replication Completeness Checkpoint</h2>
          </div>
          <div class="cp-details" id="box_cp_2">
            <div class="cp-cue cue-g2m">Surveillance Focus & Molecular Mechanism:</div>
            <div class="cp-text">Confirms that all 46 chromosomes have been <strong>fully and accurately duplicated</strong> in S phase without unresolved replication forks or unligated Okazaki fragments. Inhibits <strong>CDK1/cyclin B (MPF)</strong> until repair polymerases and ligases seal all gaps.</div>
          </div>
        </div>

        <!-- Card 3: Spindle Assembly Checkpoint -->
        <div class="checkpoint-card" id="card_cp_3">
          <div class="neon-bar bar-m"></div>
          <div>
            <div class="cp-top">
              <span class="cp-badge cp-badge-m">CHECKPOINT 3 · CHROMOSOME SEGREGATION</span>
              <span class="cp-phase-tag">Metaphase → Anaphase</span>
            </div>
            <h2 class="cp-title">Spindle Assembly Checkpoint (SAC)</h2>
          </div>
          <div class="cp-details" id="box_cp_3">
            <div class="cp-cue cue-m">Surveillance Focus & Molecular Mechanism:</div>
            <div class="cp-text">Monitors mechanical tension and bilateral attachment of spindle microtubules to sister kinetochores. Unattached kinetochores generate the <strong>Mitotic Checkpoint Complex (MCC)</strong>, inhibiting <strong>APC/C-Cdc20</strong> to prevent nondisjunction and catastrophic aneuploidy.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">
        <span>Lesson 2: DNA structure, telomeres & replication</span>
        <span>·</span>
        <span>Cell Cycle Surveillance Mechanisms</span>
        <span>·</span>
        <span>OCR Cambridge Advanced National (AAQ) Human Biology</span>
      </div>
      <div class="watermark">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Gemini Notebook
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function render() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  
  await page.setContent(getCellCycleSlideHtml(), { waitUntil: "load" });
  await page.waitForTimeout(500);

  // Measure bounding boxes of the 3 checkpoint cards and their detail boxes
  const metrics = await page.evaluate(() => {
    const results = {};
    for (let i = 1; i <= 3; i++) {
      const card = document.getElementById("card_cp_" + i).getBoundingClientRect();
      const box = document.getElementById("box_cp_" + i).getBoundingClientRect();
      results["checkpoint_" + i] = {
        card: {
          x: +(card.left / 1376 * 100).toFixed(2),
          y: +(card.top / 768 * 100).toFixed(2),
          w: +(card.width / 1376 * 100).toFixed(2),
          h: +(card.height / 768 * 100).toFixed(2)
        },
        detailBox: {
          x: +(box.left / 1376 * 100).toFixed(2),
          y: +(box.top / 768 * 100).toFixed(2),
          w: +(box.width / 1376 * 100).toFixed(2),
          h: +(box.height / 768 * 100).toFixed(2)
        }
      };
    }
    return results;
  });

  console.log("Calculated Checkpoint Metrics:", JSON.stringify(metrics, null, 2));

  await page.screenshot({ path: "scratch/test_cell_cycle_checkpoint.png" });
  console.log("Rendered test image: scratch/test_cell_cycle_checkpoint.png");

  await browser.close();
  return metrics;
}

if (process.argv[1] && process.argv[1].endsWith("generate_cell_cycle_checkpoint_slide.mjs")) {
  render().catch(console.error);
}
