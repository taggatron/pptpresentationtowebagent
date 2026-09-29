import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";

export function getBrightCheckpointSlideHtml(stage = 1) {
  const configs = {
    1: {
      number: "01",
      badgeStage: "★ CHECKPOINT 1 OF 3: G₁/S",
      badgeFocus: "THE RESTRICTION POINT (START)",
      colorTheme: "#d97706", // Amber
      colorLight: "#fef3c7",
      colorBorder: "#fcd34d",
      glowColor: "rgba(245, 158, 11, 0.14)",
      accentTag: "LATE G₁ → S COMMITMENT",
      title: "G₁/S Restriction Checkpoint",
      subtitle: "The Master Commitment Point · Surveillance of DNA integrity before S-phase replication",
      wheelHighlight: "g1_s",
      question: "Is the cell large enough, with intact DNA and sufficient energy reserves to duplicate its genome?",
      gatekeepers: [
        {
          symbol: "p53",
          name: "Guardian of the Genome",
          role: "Nuclear transcription factor activated by DNA double-strand breaks."
        },
        {
          symbol: "p21",
          name: "CDK Inhibitor (CKI)",
          role: "Upregulated by p53; directly arrests CDK2/Cyclin E complexes."
        },
        {
          symbol: "CDK2",
          name: "S-Phase Engine",
          role: "Phosphorylates targets to fire replication origins once cleared."
        }
      ],
      passTitle: "PASS: Conditions Cleared",
      passDesc: "CDK2/Cyclin E activated → Irreversible entry into S-phase; DNA synthesis begins.",
      haltTitle: "HALT: Damage Detected",
      haltDesc: "Cycle arrested in G₁ for repair. If damage is irreparable, p53 activates apoptosis or senescence.",
      clinicalBadge: "ONCOLOGY & PATHOLOGY",
      clinicalText: "TP53 is the most frequently mutated gene in human cancer (>50%). Loss of p53 eliminates the G₁/S brake, allowing mutated cells to divide uncontrollably."
    },
    2: {
      number: "02",
      badgeStage: "★ CHECKPOINT 2 OF 3: G₂/M",
      badgeFocus: "REPLICATION FIDELITY GATEWAY",
      colorTheme: "#0284c7", // Sky/Cyan
      colorLight: "#e0f2fe",
      colorBorder: "#7dd3fc",
      glowColor: "rgba(14, 165, 233, 0.14)",
      accentTag: "POST-REPLICATION S → G₂ → M",
      title: "G₂/M Replication Fidelity Checkpoint",
      subtitle: "The Pre-Mitotic Quality Filter · Verifying complete, unblemished chromosome duplication",
      wheelHighlight: "g2_m",
      question: "Has every one of the 3 billion base pairs been fully copied without stalled forks or unligated nicks?",
      gatekeepers: [
        {
          symbol: "ATM/ATR",
          name: "DNA Damage Sensors",
          role: "Protein kinases that detect stalled replication forks and uncopied ssDNA gaps."
        },
        {
          symbol: "Chk1/Chk2",
          name: "Checkpoint Kinases",
          role: "Inactivate Cdc25 phosphatase to keep mitosis factor MPF phosphorylated and OFF."
        },
        {
          symbol: "CDK1",
          name: "MPF Mitotic Switch",
          role: "Complexed with Cyclin B; drives nuclear envelope breakdown and mitotic entry."
        }
      ],
      passTitle: "PASS: Genome Fully Copied",
      passDesc: "Cdc25 dephosphorylates CDK1/Cyclin B (MPF) → Cell enters prophase of mitosis.",
      haltTitle: "HALT: Incomplete Replication",
      haltDesc: "MPF remains inactive; cell pauses in G₂ while DNA polymerases and ligases seal all remaining gaps.",
      clinicalBadge: "THERAPEUTIC TARGET",
      clinicalText: "Chemotherapeutics (e.g. cisplatin, doxorubicin) induce massive DNA adducts and replication fork collapse, forcing tumors to arrest and self-destruct at G₂/M."
    },
    3: {
      number: "03",
      badgeStage: "★ CHECKPOINT 3 OF 3: SPINDLE SAC",
      badgeFocus: "CHROMOSOME SEGREGATION GATEWAY",
      colorTheme: "#e11d48", // Rose
      colorLight: "#ffe4e6",
      colorBorder: "#fda4af",
      glowColor: "rgba(244, 63, 94, 0.14)",
      accentTag: "METAPHASE → ANAPHASE TRANSITION",
      title: "Spindle Assembly Checkpoint (SAC)",
      subtitle: "Mechanical Surveillance · Ensuring bilateral spindle tension before chromosome separation",
      wheelHighlight: "sac",
      question: "Are all 46 pairs of sister chromatids attached to opposite spindle poles with amphitelic tension?",
      gatekeepers: [
        {
          symbol: "Kinetochore",
          name: "Tension Biomechanosensors",
          role: "Unattached kinetochores generate a diffusible chemical stop-signal."
        },
        {
          symbol: "Mad2/BubR1",
          name: "Mitotic Checkpoint Complex",
          role: "Binds and inhibits Cdc20, preventing premature activation of APC/C."
        },
        {
          symbol: "APC/C",
          name: "Anaphase-Promoting Complex",
          role: "Ubiquitin ligase that destroys securin to unleash separase for chromatid cleavage."
        }
      ],
      passTitle: "PASS: Equal Spindle Tension",
      passDesc: "MCC disassembles → APC/C activates → Separase cleaves cohesin rings → Anaphase begins.",
      haltTitle: "HALT: Unattached Kinetochore",
      haltDesc: "Even a single unattached kinetochore holds the entire cell in metaphase, preventing nondisjunction.",
      clinicalBadge: "GENOMIC STABILITY",
      clinicalText: "Spindle poisons (e.g. paclitaxel/Taxol) disrupt microtubule dynamics. They persistently trigger the SAC, trapping cancer cells in mitotic catastrophe and apoptosis."
    }
  };

  const cfg = configs[stage] || configs[1];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700;800&display=swap");

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: #f8fafc;
    background-image:
      radial-gradient(circle at 85% 15%, ${cfg.glowColor} 0%, rgba(255,255,255,0) 60%),
      radial-gradient(circle at 15% 85%, rgba(2, 132, 199, 0.08) 0%, rgba(255,255,255,0) 60%),
      linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 32px 32px, 32px 32px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    position: relative;
  }

  .slide-container {
    width: 1376px;
    height: 768px;
    padding: 24px 44px 18px 44px;
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
    justify-content: space-between;
  }

  .badge-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 9999px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .badge-topic {
    background: #e2e8f0;
    color: #334155;
    border: 1px solid #cbd5e1;
  }

  .badge-stage {
    background: ${cfg.colorLight};
    color: ${cfg.colorTheme};
    border: 1.5px solid ${cfg.colorBorder};
    box-shadow: 0 2px 8px ${cfg.glowColor};
  }

  .badge-tag {
    background: #ffffff;
    color: #475569;
    border: 1px solid #e2e8f0;
    font-weight: 700;
  }

  .spec-tag {
    font-size: 12.5px;
    font-weight: 700;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .spec-tag .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${cfg.colorTheme};
  }

  .title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 20px;
  }

  .slide-title {
    font-size: 30px;
    font-weight: 900;
    color: #091e42;
    letter-spacing: -0.025em;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 13.5px;
    color: #475569;
    font-weight: 500;
    text-align: right;
  }

  /* Two Column Layout */
  .main-content {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 28px;
    height: 590px;
    margin-top: 4px;
  }

  /* Left Column: Cell Cycle Wheel */
  .left-panel {
    width: 460px;
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 20px;
    padding: 18px 20px;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .panel-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .panel-title {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .panel-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
  }

  /* SVG Wheel Container */
  .wheel-wrap {
    position: relative;
    width: 380px;
    height: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wheel-wrap svg {
    width: 100%;
    height: 100%;
  }

  .wheel-summary-box {
    width: 100%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .wheel-summary-icon {
    font-size: 18px;
    color: ${cfg.colorTheme};
  }

  .wheel-summary-text {
    font-size: 11.5px;
    color: #334155;
    line-height: 1.35;
    font-weight: 500;
  }

  /* Right Column: Dedicated Stage Card (Takes up the entire right side) */
  .right-panel {
    flex: 1;
    background: #ffffff;
    border: 2px solid ${cfg.colorBorder};
    border-radius: 20px;
    padding: 22px 26px 18px 26px;
    box-shadow: 0 16px 36px -10px ${cfg.glowColor}, 0 6px 16px -4px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .stage-watermark-num {
    position: absolute;
    top: -15px;
    right: 15px;
    font-size: 120px;
    font-weight: 900;
    color: ${cfg.colorLight};
    font-family: 'Plus Jakarta Sans', sans-serif;
    pointer-events: none;
    line-height: 1;
    z-index: 1;
  }

  .right-header {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .right-tag-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .right-tag {
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${cfg.colorTheme};
    background: ${cfg.colorLight};
    padding: 3px 10px;
    border-radius: 6px;
  }

  .right-title {
    font-size: 26px;
    font-weight: 800;
    color: #091e42;
    letter-spacing: -0.02em;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* Question Banner */
  .question-banner {
    position: relative;
    z-index: 2;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-left: 4px solid ${cfg.colorTheme};
    border-radius: 10px;
    padding: 10px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .question-icon {
    font-size: 16px;
    font-weight: 900;
    color: ${cfg.colorTheme};
    font-family: 'JetBrains Mono', monospace;
    line-height: 1.2;
  }

  .question-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .question-label {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #64748b;
  }

  .question-text {
    font-size: 13.5px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.3;
  }

  /* Gatekeepers Grid */
  .gatekeepers-section {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .section-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #64748b;
  }

  .gatekeepers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .gatekeeper-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
    transition: transform 0.15s, border-color 0.15s;
  }

  .gk-symbol {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 800;
    color: ${cfg.colorTheme};
  }

  .gk-name {
    font-size: 11px;
    font-weight: 700;
    color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .gk-role {
    font-size: 10px;
    color: #64748b;
    line-height: 1.3;
  }

  /* Decision Outcomes */
  .decision-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .decision-box {
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .decision-pass {
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
  }

  .decision-halt {
    background: #fef2f2;
    border: 1.5px solid #fecaca;
  }

  .dec-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .decision-pass .dec-header { color: #166534; }
  .decision-halt .dec-header { color: #991b1b; }

  .dec-desc {
    font-size: 11px;
    line-height: 1.35;
    color: #334155;
  }

  /* Clinical Strip */
  .clinical-strip {
    position: relative;
    z-index: 2;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .clinical-badge {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: #0f172a;
    color: #ffffff;
    padding: 3px 8px;
    border-radius: 4px;
    white-space: nowrap;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .clinical-text {
    font-size: 11px;
    color: #475569;
    line-height: 1.3;
    font-weight: 500;
  }

  /* Footer Section */
  .footer-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11.5px;
    color: #94a3b8;
    font-weight: 500;
    border-top: 1px solid #e2e8f0;
    padding-top: 10px;
  }

  .watermark {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-weight: 600;
  }

  .watermark svg {
    width: 14px;
    height: 14px;
    fill: #64748b;
  }
</style>
</head>
<body>
  <div class="slide-container">
    <!-- Header -->
    <header class="header">
      <div class="badge-row">
        <div class="badge-group">
          <span class="badge badge-topic">Cell Cycle Regulation</span>
          <span class="badge badge-stage">${cfg.badgeStage}</span>
          <span class="badge badge-tag">${cfg.badgeFocus}</span>
        </div>
        <div class="spec-tag">
          <span class="dot"></span>
          <span>OCR Cambridge Advanced National (AAQ) Human Biology</span>
        </div>
      </div>
      <div class="title-row">
        <h1 class="slide-title">${cfg.title}</h1>
        <p class="subtitle">${cfg.subtitle}</p>
      </div>
    </header>

    <!-- Main Content: Left Wheel + Right Dedicated Stage Panel -->
    <main class="main-content">
      <!-- Left Panel: Cell Cycle Wheel -->
      <section class="left-panel">
        <div class="panel-header">
          <span class="panel-title">Eukaryotic Cell Cycle</span>
          <span class="panel-badge">${cfg.accentTag}</span>
        </div>

        <div class="wheel-wrap">
          <svg viewBox="0 0 320 320">
            <defs>
              <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Base Tracks -->
            <!-- G1 Phase: 120 to 230 deg (soft indigo #6366f1) -->
            <path d="M 160 40 A 120 120 0 0 1 264 100" fill="none" stroke="#818cf8" stroke-width="26" stroke-linecap="round" />
            
            <!-- S Phase: 230 to 330 deg (soft cyan #06b6d4) -->
            <path d="M 275 120 A 120 120 0 0 1 230 250" fill="none" stroke="#22d3ee" stroke-width="26" stroke-linecap="round" />
            
            <!-- G2 Phase: 330 to 45 deg (soft emerald #10b981) -->
            <path d="M 210 266 A 120 120 0 0 1 100 266" fill="none" stroke="#34d399" stroke-width="26" stroke-linecap="round" />
            
            <!-- M Phase: 45 to 120 deg (soft rose #f43f5e) -->
            <path d="M 80 250 A 120 120 0 0 1 140 42" fill="none" stroke="#fb7185" stroke-width="26" stroke-linecap="round" />

            <!-- Labels on Arcs -->
            <text x="235" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#4338ca">G₁ PHASE</text>
            <text x="240" y="84" font-family="'Inter', sans-serif" font-size="9" font-weight="600" fill="#6366f1">Growth & Prep</text>

            <text x="245" y="195" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#0e7490">S PHASE</text>
            <text x="245" y="209" font-family="'Inter', sans-serif" font-size="9" font-weight="600" fill="#0891b2">DNA Copying</text>

            <text x="125" y="295" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#047857">G₂ PHASE</text>
            <text x="125" y="308" font-family="'Inter', sans-serif" font-size="9" font-weight="600" fill="#059669">Fidelity Check</text>

            <text x="40" y="150" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#be123c">M PHASE</text>
            <text x="40" y="164" font-family="'Inter', sans-serif" font-size="9" font-weight="600" fill="#e11d48">Mitosis</text>

            <!-- Center Core -->
            <circle cx="160" cy="160" r="66" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />
            <circle cx="160" cy="160" r="54" fill="#ffffff" stroke="${cfg.colorBorder}" stroke-width="2.5" />
            
            <text x="160" y="146" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="800" fill="${cfg.colorTheme}" letter-spacing="1">SURVEILLANCE</text>
            <text x="160" y="165" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="900" fill="#0f172a">STAGE ${stage} OF 3</text>
            <text x="160" y="180" text-anchor="middle" font-family="'Inter', sans-serif" font-size="9.5" font-weight="700" fill="#64748b">ACTIVE GATEWAY</text>

            <!-- Checkpoint Pins on Perimeter -->
            <!-- CP 1: G1/S boundary (approx x=270, y=110) -->
            <g transform="translate(270, 110)">
              <circle cx="0" cy="0" r="${stage === 1 ? '16' : '11'}" fill="${stage === 1 ? '#d97706' : '#ffffff'}" stroke="${stage === 1 ? '#fef3c7' : '#d97706'}" stroke-width="${stage === 1 ? '3' : '2'}" />
              <text x="0" y="4" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="${stage === 1 ? '11' : '9'}" font-weight="900" fill="${stage === 1 ? '#ffffff' : '#d97706'}">1</text>
            </g>

            <!-- CP 2: G2/M boundary (approx x=95, y=260) -->
            <g transform="translate(95, 260)">
              <circle cx="0" cy="0" r="${stage === 2 ? '16' : '11'}" fill="${stage === 2 ? '#0284c7' : '#ffffff'}" stroke="${stage === 2 ? '#e0f2fe' : '#0284c7'}" stroke-width="${stage === 2 ? '3' : '2'}" />
              <text x="0" y="4" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="${stage === 2 ? '11' : '9'}" font-weight="900" fill="${stage === 2 ? '#ffffff' : '#0284c7'}">2</text>
            </g>

            <!-- CP 3: M phase Spindle SAC (approx x=65, y=110) -->
            <g transform="translate(65, 110)">
              <circle cx="0" cy="0" r="${stage === 3 ? '16' : '11'}" fill="${stage === 3 ? '#e11d48' : '#ffffff'}" stroke="${stage === 3 ? '#ffe4e6' : '#e11d48'}" stroke-width="${stage === 3 ? '3' : '2'}" />
              <text x="0" y="4" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="${stage === 3 ? '11' : '9'}" font-weight="900" fill="${stage === 3 ? '#ffffff' : '#e11d48'}">3</text>
            </g>
          </svg>
        </div>

        <div class="wheel-summary-box">
          <span class="wheel-summary-icon">◉</span>
          <p class="wheel-summary-text"><strong>Cell Cycle Context:</strong> Each checkpoint acts as a molecular clutch preventing premature entry into the next phase until all criteria are met.</p>
        </div>
      </section>

      <!-- Right Panel: Single Dedicated Stage Card taking up the entire right hand side -->
      <section class="right-panel">
        <span class="stage-watermark-num">${cfg.number}</span>

        <!-- Right Header -->
        <div class="right-header">
          <div class="right-tag-row">
            <span class="right-tag">PRIMARY STAGE ${stage} SURVEILLANCE</span>
            <span style="font-size: 11.5px; font-weight: 700; color: #64748b;">${cfg.accentTag}</span>
          </div>
          <h2 class="right-title">${cfg.title}</h2>
        </div>

        <!-- 1. The Core Question -->
        <div class="question-banner">
          <span class="question-icon">?</span>
          <div class="question-content">
            <span class="question-label">Core Surveillance Question</span>
            <p class="question-text">"${cfg.question}"</p>
          </div>
        </div>

        <!-- 2. Molecular Gatekeepers -->
        <div class="gatekeepers-section">
          <span class="section-label">Key Molecular Gatekeepers & Regulators</span>
          <div class="gatekeepers-grid">
            ${cfg.gatekeepers.map(gk => `
              <div class="gatekeeper-card">
                <span class="gk-symbol">${gk.symbol}</span>
                <span class="gk-name">${gk.name}</span>
                <p class="gk-role">${gk.role}</p>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- 3. Decision Outcomes: PASS vs HALT -->
        <div class="decision-grid">
          <div class="decision-box decision-pass">
            <div class="dec-header">
              <span>✓</span>
              <span>${cfg.passTitle}</span>
            </div>
            <p class="dec-desc">${cfg.passDesc}</p>
          </div>

          <div class="decision-box decision-halt">
            <div class="dec-header">
              <span>✕</span>
              <span>${cfg.haltTitle}</span>
            </div>
            <p class="dec-desc">${cfg.haltDesc}</p>
          </div>
        </div>

        <!-- 4. Clinical Significance -->
        <div class="clinical-strip">
          <span class="clinical-badge">${cfg.clinicalBadge}</span>
          <p class="clinical-text">${cfg.clinicalText}</p>
        </div>
      </section>
    </main>

    <!-- Footer Bar -->
    <footer class="footer-bar">
      <span>Lesson 2: DNA structure, telomeres & replication · Checkpoint Stage ${stage} of 3 · OCR AAQ Human Biology</span>
      <div class="watermark">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <span>Gemini Notebook</span>
      </div>
    </footer>
  </div>
</body>
</html>`;
}

async function main() {
  console.log("=== Testing Bright Simplified Checkpoint Slides (1, 2, 3) ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  for (const stage of [1, 2, 3]) {
    const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
    const html = getBrightCheckpointSlideHtml(stage);
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    const outPath = path.resolve(`scratch/bright_checkpoint_stage_${stage}.png`);
    await page.screenshot({ path: outPath, type: "png" });
    console.log(`✓ Rendered Stage ${stage} to ${outPath}`);

    const qa = await validateGeneratedSlideImage({
      outputPath: outPath
    });
    console.log(`  QA check passed: ${qa.passed}`);
    await page.close();
  }

  await browser.close();
}

main().catch(err => {
  console.error("Error in test script:", err);
  process.exit(1);
});
