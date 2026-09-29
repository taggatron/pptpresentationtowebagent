import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";

export function getUpscaledCheckpointSlideHtml(stage = 1) {
  const configs = {
    1: {
      number: "01",
      badgeStage: "CHECKPOINT 1 OF 3",
      badgeFocus: "G₁/S RESTRICTION POINT",
      rightHeading: "Stage 1: G₁/S Restriction Gateway",
      colorTheme: "#d97706", // Amber
      colorLight: "#fef3c7",
      colorBorder: "#fcd34d",
      glowColor: "rgba(245, 158, 11, 0.16)",
      title: "G₁/S Restriction Checkpoint",
      subtitle: "The Master Commitment Point · Checks cell size & DNA integrity before S-phase",
      question: "Is DNA intact and the cell ready to duplicate its genome?",
      gatekeepers: [
        {
          symbol: "p53",
          name: "DNA Damage Brake",
          role: "Stops cycle if DNA is damaged; directs repair or triggers cell death."
        },
        {
          symbol: "p21",
          name: "CDK Inhibitor",
          role: "Directly blocks CDK2 to pause entry into replication."
        },
        {
          symbol: "CDK2",
          name: "S-Phase Motor",
          role: "Drives cell into DNA synthesis once damage is cleared."
        }
      ],
      passTitle: "PASS: Conditions Cleared",
      passDesc: "CDK2 activates → Cell enters S-phase replication.",
      haltTitle: "HALT: Damage Detected",
      haltDesc: "Cycle pauses in G₁ for repair; irreparable cells undergo apoptosis.",
      clinicalBadge: "CANCER LINK",
      clinicalText: "TP53 is mutated in >50% of cancers, disabling the G₁/S brake."
    },
    2: {
      number: "02",
      badgeStage: "CHECKPOINT 2 OF 3",
      badgeFocus: "G₂/M REPLICATION FIDELITY",
      rightHeading: "Stage 2: G₂/M Replication Fidelity Gateway",
      colorTheme: "#0284c7", // Sky/Cyan
      colorLight: "#e0f2fe",
      colorBorder: "#7dd3fc",
      glowColor: "rgba(14, 165, 233, 0.16)",
      title: "G₂/M Replication Fidelity Checkpoint",
      subtitle: "The Pre-Mitotic Quality Filter · Verifies complete, unblemished DNA replication",
      question: "Is all DNA fully replicated with zero damage or errors?",
      gatekeepers: [
        {
          symbol: "ATM / ATR",
          name: "Damage Sensors",
          role: "Detect breaks, unligated nicks, and stalled replication forks."
        },
        {
          symbol: "Chk1 / Chk2",
          name: "Signal Relays",
          role: "Keeps mitosis switch (CDK1) turned OFF during repair."
        },
        {
          symbol: "CDK1",
          name: "Mitosis Switch",
          role: "Drives cell into mitosis once all 46 chromosomes are copied."
        }
      ],
      passTitle: "PASS: Replication Complete",
      passDesc: "CDK1 activates → Cell safely enters mitosis.",
      haltTitle: "HALT: Incomplete / Damaged DNA",
      haltDesc: "Cycle pauses in G₂ while enzymes finish copying and repair.",
      clinicalBadge: "CHEMOTHERAPY",
      clinicalText: "Drugs like cisplatin induce DNA breaks that trigger G₂ arrest and cell death."
    },
    3: {
      number: "03",
      badgeStage: "CHECKPOINT 3 OF 3",
      badgeFocus: "SPINDLE ASSEMBLY (SAC)",
      rightHeading: "Stage 3: Spindle Assembly Gateway (SAC)",
      colorTheme: "#e11d48", // Rose
      colorLight: "#ffe4e6",
      colorBorder: "#fda4af",
      glowColor: "rgba(244, 63, 94, 0.16)",
      title: "Spindle Assembly Checkpoint (SAC)",
      subtitle: "Chromosome Segregation Gateway · Ensures equal spindle tension before anaphase",
      question: "Are all 46 chromosomes attached with equal spindle tension?",
      gatekeepers: [
        {
          symbol: "Kinetochore",
          name: "Tension Sensor",
          role: "Broadcasts a chemical STOP signal until spindle fibers attach."
        },
        {
          symbol: "Mad2 / MCC",
          name: "Mitotic Brake",
          role: "Blocks APC/C to prevent premature chromosome separation."
        },
        {
          symbol: "APC/C",
          name: "Separation Trigger",
          role: "Destroys securin to separate sister chromatids into anaphase."
        }
      ],
      passTitle: "PASS: Tension Verified",
      passDesc: "APC/C activates → Sister chromatids separate into anaphase.",
      haltTitle: "HALT: Kinetochore Unattached",
      haltDesc: "Mitosis pauses in metaphase; prevents chromosome errors (aneuploidy).",
      clinicalBadge: "TARGETED DRUGS",
      clinicalText: "Paclitaxel (Taxol) disrupts spindle fibers, locking cells in mitosis."
    }
  };

  const cfg = configs[stage] || configs[1];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@700;800&display=swap");

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background: #f8fafc;
    background-image:
      radial-gradient(circle at 88% 12%, ${cfg.glowColor} 0%, rgba(255,255,255,0) 55%),
      radial-gradient(circle at 12% 88%, rgba(2, 132, 199, 0.08) 0%, rgba(255,255,255,0) 55%),
      linear-gradient(to right, rgba(148, 163, 184, 0.09) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(148, 163, 184, 0.09) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    position: relative;
  }

  .slide-container {
    width: 1920px;
    height: 1080px;
    padding: 34px 54px 26px 54px;
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
    gap: 8px;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 6px 18px;
    border-radius: 9999px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .badge-stage {
    background: ${cfg.colorLight};
    color: ${cfg.colorTheme};
    border: 2px solid ${cfg.colorBorder};
    box-shadow: 0 2px 12px ${cfg.glowColor};
  }

  .badge-focus {
    background: #ffffff;
    color: #334155;
    border: 1.5px solid #cbd5e1;
  }

  .spec-tag {
    font-size: 17px;
    font-weight: 700;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .spec-tag .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: ${cfg.colorTheme};
  }

  .title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
  }

  .slide-title {
    font-size: 44px;
    font-weight: 900;
    color: #091e42;
    letter-spacing: -0.03em;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.15;
  }

  .subtitle {
    font-size: 20px;
    color: #475569;
    font-weight: 600;
    text-align: right;
  }

  /* Two Column Main Body */
  .main-content {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 36px;
    height: 830px;
    margin-top: 8px;
  }

  /* Left Panel: Cell Cycle Wheel */
  .left-panel {
    width: 580px;
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 24px;
    padding: 24px 28px;
    box-shadow: 0 12px 32px -6px rgba(15, 23, 42, 0.05);
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
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .panel-badge {
    font-size: 14px;
    font-weight: 800;
    padding: 5px 14px;
    border-radius: 8px;
    background: ${cfg.colorLight};
    color: ${cfg.colorTheme};
    border: 1.5px solid ${cfg.colorBorder};
  }

  /* SVG Wheel */
  .wheel-wrap {
    position: relative;
    width: 510px;
    height: 510px;
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
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .wheel-summary-icon {
    font-size: 28px;
    color: ${cfg.colorTheme};
    line-height: 1;
  }

  .wheel-summary-text {
    font-size: 16px;
    color: #334155;
    line-height: 1.4;
    font-weight: 600;
  }

  /* Right Panel: Dedicated Stage Card */
  .right-panel {
    flex: 1;
    background: #ffffff;
    border: 2.5px solid ${cfg.colorBorder};
    border-radius: 24px;
    padding: 32px 40px 28px 40px;
    box-shadow: 0 20px 42px -12px ${cfg.glowColor}, 0 8px 24px -6px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .stage-watermark-num {
    position: absolute;
    top: -25px;
    right: 28px;
    font-size: 180px;
    font-weight: 900;
    color: ${cfg.colorLight};
    font-family: 'Plus Jakarta Sans', sans-serif;
    pointer-events: none;
    line-height: 1;
    z-index: 1;
  }

  .right-top-bar {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .stage-tag {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${cfg.colorTheme};
    background: ${cfg.colorLight};
    padding: 6px 16px;
    border-radius: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .stage-tag-title {
    font-size: 24px;
    font-weight: 800;
    color: #091e42;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* 1. Core Question Banner */
  .question-banner {
    position: relative;
    z-index: 2;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-left: 7px solid ${cfg.colorTheme};
    border-radius: 18px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .question-icon {
    font-size: 32px;
    font-weight: 900;
    color: ${cfg.colorTheme};
    font-family: 'JetBrains Mono', monospace;
    background: ${cfg.colorLight};
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .question-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .question-label {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
  }

  .question-text {
    font-size: 24px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.3;
  }

  /* 2. Gatekeepers Section */
  .gatekeepers-section {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .section-label {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
  }

  .gatekeepers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .gatekeeper-card {
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 18px;
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  }

  .gk-symbol {
    font-family: 'JetBrains Mono', monospace;
    font-size: 26px;
    font-weight: 800;
    color: ${cfg.colorTheme};
    letter-spacing: -0.02em;
  }

  .gk-name {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .gk-role {
    font-size: 15px;
    color: #475569;
    line-height: 1.45;
    font-weight: 500;
  }

  /* 3. Decision Grid */
  .decision-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .decision-box {
    border-radius: 18px;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .decision-pass {
    background: #f0fdf4;
    border: 2px solid #86efac;
  }

  .decision-halt {
    background: #fef2f2;
    border: 2px solid #fca5a5;
  }

  .dec-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .decision-pass .dec-header { color: #15803d; }
  .decision-halt .dec-header { color: #b91c1c; }

  .dec-desc {
    font-size: 16px;
    line-height: 1.5;
    color: #1e293b;
    font-weight: 600;
  }

  /* 4. Clinical Strip */
  .clinical-strip {
    position: relative;
    z-index: 2;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
    padding: 14px 22px;
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .clinical-badge {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: #0f172a;
    color: #ffffff;
    padding: 7px 16px;
    border-radius: 8px;
    white-space: nowrap;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .clinical-text {
    font-size: 16.5px;
    color: #334155;
    line-height: 1.35;
    font-weight: 600;
  }

  /* Footer */
  .footer-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #64748b;
    font-weight: 600;
    border-top: 1.5px solid #e2e8f0;
    padding-top: 16px;
  }

  .watermark {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #64748b;
    font-weight: 700;
  }

  .watermark svg {
    width: 20px;
    height: 20px;
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
          <span class="badge badge-stage">${cfg.badgeStage}</span>
          <span class="badge badge-focus">${cfg.badgeFocus}</span>
        </div>
        <div class="spec-tag">
          <span class="dot"></span>
          <span>OCR AAQ Human Biology · Cell Cycle Regulation</span>
        </div>
      </div>
      <div class="title-row">
        <h1 class="slide-title">${cfg.title}</h1>
        <p class="subtitle">${cfg.subtitle}</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Left Panel: Cell Cycle Wheel -->
      <section class="left-panel">
        <div class="panel-header">
          <span class="panel-title">Eukaryotic Cell Cycle</span>
          <span class="panel-badge">${cfg.badgeStage}</span>
        </div>

        <div class="wheel-wrap">
          <svg viewBox="0 0 400 400">
            <!-- Arcs for the 4 Phases -->
            <!-- G1 Phase: Top-Right (indigo) -->
            <path d="M 200 45 A 155 155 0 0 1 335 125" fill="none" stroke="#818cf8" stroke-width="38" stroke-linecap="round" />
            
            <!-- S Phase: Right-Bottom (cyan) -->
            <path d="M 350 150 A 155 155 0 0 1 290 320" fill="none" stroke="#22d3ee" stroke-width="38" stroke-linecap="round" />
            
            <!-- G2 Phase: Bottom-Left (emerald) -->
            <path d="M 265 340 A 155 155 0 0 1 125 340" fill="none" stroke="#34d399" stroke-width="38" stroke-linecap="round" />
            
            <!-- M Phase: Left-Top (rose) -->
            <path d="M 100 320 A 155 155 0 0 1 175 48" fill="none" stroke="#fb7185" stroke-width="38" stroke-linecap="round" />

            <!-- Large Phase Labels -->
            <text x="290" y="80" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="900" fill="#3730a3">G₁</text>
            <text x="290" y="102" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#6366f1">Growth</text>

            <text x="325" y="275" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="900" fill="#0e7490">S</text>
            <text x="325" y="297" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#0891b2">Replicate</text>

            <text x="170" y="380" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="900" fill="#065f46">G₂</text>
            <text x="210" y="380" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#059669">Fidelity</text>

            <text x="45" y="180" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="900" fill="#9f1239">M</text>
            <text x="45" y="202" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#e11d48">Mitosis</text>

            <!-- Center Core -->
            <circle cx="200" cy="200" r="90" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3" />
            <circle cx="200" cy="200" r="74" fill="#ffffff" stroke="${cfg.colorBorder}" stroke-width="3.5" />
            
            <text x="200" y="182" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="800" fill="${cfg.colorTheme}" letter-spacing="1.5">SURVEILLANCE</text>
            <text x="200" y="208" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="900" fill="#0f172a">GATEWAY ${stage}</text>
            <text x="200" y="230" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#64748b">STAGE ${stage} OF 3</text>

            <!-- Checkpoint Pins on Perimeter -->
            <!-- CP 1: G1/S boundary (approx x=345, y=138) -->
            <g transform="translate(345, 138)">
              ${stage === 1 ? `<circle cx="0" cy="0" r="32" fill="none" stroke="#d97706" stroke-width="3" opacity="0.4" />` : ''}
              <circle cx="0" cy="0" r="${stage === 1 ? '23' : '15'}" fill="${stage === 1 ? '#d97706' : '#ffffff'}" stroke="${stage === 1 ? '#fef3c7' : '#d97706'}" stroke-width="${stage === 1 ? '4' : '3'}" />
              <text x="0" y="${stage === 1 ? '7' : '5'}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="${stage === 1 ? '17' : '13'}" font-weight="900" fill="${stage === 1 ? '#ffffff' : '#d97706'}">1</text>
            </g>

            <!-- CP 2: G2/M boundary (approx x=120, y=330) -->
            <g transform="translate(120, 330)">
              ${stage === 2 ? `<circle cx="0" cy="0" r="32" fill="none" stroke="#0284c7" stroke-width="3" opacity="0.4" />` : ''}
              <circle cx="0" cy="0" r="${stage === 2 ? '23' : '15'}" fill="${stage === 2 ? '#0284c7' : '#ffffff'}" stroke="${stage === 2 ? '#e0f2fe' : '#0284c7'}" stroke-width="${stage === 2 ? '4' : '3'}" />
              <text x="0" y="${stage === 2 ? '7' : '5'}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="${stage === 2 ? '17' : '13'}" font-weight="900" fill="${stage === 2 ? '#ffffff' : '#0284c7'}">2</text>
            </g>

            <!-- CP 3: M phase Spindle SAC (approx x=85, y=140) -->
            <g transform="translate(85, 140)">
              ${stage === 3 ? `<circle cx="0" cy="0" r="32" fill="none" stroke="#e11d48" stroke-width="3" opacity="0.4" />` : ''}
              <circle cx="0" cy="0" r="${stage === 3 ? '23' : '15'}" fill="${stage === 3 ? '#e11d48' : '#ffffff'}" stroke="${stage === 3 ? '#ffe4e6' : '#e11d48'}" stroke-width="${stage === 3 ? '4' : '3'}" />
              <text x="0" y="${stage === 3 ? '7' : '5'}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="${stage === 3 ? '17' : '13'}" font-weight="900" fill="${stage === 3 ? '#ffffff' : '#e11d48'}">3</text>
            </g>
          </svg>
        </div>

        <div class="wheel-summary-box">
          <span class="wheel-summary-icon">◉</span>
          <p class="wheel-summary-text"><strong>Molecular Gate:</strong> The cycle cannot progress until the surveillance question is satisfied.</p>
        </div>
      </section>

      <!-- Right Panel: Single Dedicated Stage Card taking up the entire right hand side -->
      <section class="right-panel">
        <span class="stage-watermark-num">${cfg.number}</span>

        <!-- Right Top Bar -->
        <div class="right-top-bar">
          <span class="stage-tag">ACTIVE SURVEILLANCE</span>
          <h2 class="stage-tag-title">${cfg.rightHeading}</h2>
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
          <span class="section-label">Key Molecular Gatekeepers</span>
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
              <span style="font-size: 24px;">✓</span>
              <span>${cfg.passTitle}</span>
            </div>
            <p class="dec-desc">${cfg.passDesc}</p>
          </div>

          <div class="decision-box decision-halt">
            <div class="dec-header">
              <span style="font-size: 24px;">✕</span>
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

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  
  // Render at 1920x1080 with deviceScaleFactor: 2 for pristine upscaled 3840x2160 resolution!
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });

  for (const stage of [1, 2, 3]) {
    const html = getUpscaledCheckpointSlideHtml(stage);
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    const outPath = `scratch/upscaled_stage_${stage}.png`;
    await page.screenshot({ path: outPath, type: "png" });
    console.log(`Rendered upscaled stage ${stage} to ${outPath}`);

    const qa = await validateGeneratedSlideImage({ outputPath: outPath });
    console.log(`  QA check passed: ${qa.passed}, dimensions:`, qa.dimensions);
  }

  await browser.close();
}

run().catch(console.error);
