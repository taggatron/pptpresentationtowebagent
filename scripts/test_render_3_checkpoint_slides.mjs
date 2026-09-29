import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

export function getCellCycleSlideHtml({ activeStage = 1 } = {}) {
  // Config per stage
  const stageConfigs = {
    1: {
      badgeStage: "★ STAGE 1 OF 3: G₁/S GATEWAY",
      badgeStageClass: "badge-active-1",
      badgeFocus: "THE RESTRICTION POINT",
      slideTitle: "Cell Cycle Checkpoints: The G₁/S Restriction Gateway",
      subtitle: "Stage 1 of 3 · Surveillance of template integrity & metabolic readiness before S-phase",
      subtag: "STAGE 1 FOCUS: G₁ → S",
      centerStageTitle: "STAGE 1 FOCUS",
      centerStageName: "G₁/S RESTRICTION",
      centerStageNameColor: "#facc15",
      centerStageProteins: "p53 · ATM/ATR · p21 · CDK2",
      footerIconStroke: "#facc15",
      footerNote: "Stage 1 Focus: Passing G₁/S commits cell to replication; uncorrected damage activates p53 to block CDK2.",
      card1Role: "active",
      card2Role: "upcoming",
      card3Role: "upcoming"
    },
    2: {
      badgeStage: "★ STAGE 2 OF 3: G₂/M GATEWAY",
      badgeStageClass: "badge-active-2",
      badgeFocus: "REPLICATION FIDELITY",
      slideTitle: "Cell Cycle Checkpoints: The G₂/M Replication Fidelity Gateway",
      subtitle: "Stage 2 of 3 · Surveillance of replication completeness & structural integrity prior to mitosis",
      subtag: "STAGE 2 FOCUS: S → G₂ → M",
      centerStageTitle: "STAGE 2 FOCUS",
      centerStageName: "G₂/M FIDELITY",
      centerStageNameColor: "#00f0ff",
      centerStageProteins: "ATR · Chk1 · Cdc25 · CDK1/MPF",
      footerIconStroke: "#00f0ff",
      footerNote: "Stage 2 Focus: All 3 billion bp must be fully replicated; ATR/Chk1 inhibits MPF until nicks & forks resolve.",
      card1Role: "passed",
      card2Role: "active",
      card3Role: "upcoming"
    },
    3: {
      badgeStage: "★ STAGE 3 OF 3: SPINDLE SAC",
      badgeStageClass: "badge-active-3",
      badgeFocus: "CHROMOSOME SEGREGATION",
      slideTitle: "Cell Cycle Checkpoints: The Spindle Assembly Gateway (SAC)",
      subtitle: "Stage 3 of 3 · Surveillance of kinetochore tension & chromosome alignment before anaphase",
      subtag: "STAGE 3 FOCUS: METAPHASE → ANAPHASE",
      centerStageTitle: "STAGE 3 FOCUS",
      centerStageName: "SPINDLE ASSEMBLY",
      centerStageNameColor: "#fb7185",
      centerStageProteins: "MCC (Mad2/BubR1) · APC/C-Cdc20",
      footerIconStroke: "#fb7185",
      footerNote: "Stage 3 Focus: MCC inhibits APC/C until all kinetochores achieve amphitelic spindle tension, preventing aneuploidy.",
      card1Role: "passed",
      card2Role: "passed",
      card3Role: "active"
    }
  };

  const cfg = stageConfigs[activeStage] || stageConfigs[1];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700;800;900&display=swap");
  
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
    background: radial-gradient(circle, rgba(56, 189, 248, 0.38) 0%, rgba(56, 189, 248, 0) 70%);
    pointer-events: none;
  }
  .glow-bottom-right {
    position: absolute;
    bottom: -160px;
    right: -120px;
    width: 750px;
    height: 750px;
    background: radial-gradient(circle, rgba(232, 121, 249, 0.30) 0%, rgba(232, 121, 249, 0) 70%);
    pointer-events: none;
  }
  .glow-center {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 900px;
    height: 500px;
    background: radial-gradient(ellipse at center, rgba(147, 197, 253, 0.16) 0%, rgba(147, 197, 253, 0) 70%);
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
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 5px 15px;
    border-radius: 9999px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .badge-topic {
    background: rgba(255, 255, 255, 0.16);
    color: #f1f5f9;
    border: 1.5px solid rgba(255, 255, 255, 0.45);
  }
  .badge-active-1 {
    background: rgba(245, 158, 11, 0.35);
    color: #fef08a;
    border: 1.5px solid rgba(250, 204, 21, 0.9);
    box-shadow: 0 0 16px rgba(250, 204, 21, 0.45);
  }
  .badge-active-2 {
    background: rgba(6, 182, 212, 0.35);
    color: #a5f3fc;
    border: 1.5px solid rgba(6, 182, 212, 0.9);
    box-shadow: 0 0 16px rgba(6, 182, 212, 0.45);
  }
  .badge-active-3 {
    background: rgba(244, 63, 94, 0.35);
    color: #ffe4e6;
    border: 1.5px solid rgba(244, 63, 94, 0.9);
    box-shadow: 0 0 16px rgba(244, 63, 94, 0.45);
  }
  .badge-gate {
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
  }
  .topic-tag {
    font-size: 14.5px;
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
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    font-family: "Plus Jakarta Sans", sans-serif;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
    white-space: nowrap;
  }
  .subtitle {
    font-size: 14.5px;
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
    width: 540px;
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
    font-size: 17.5px;
    font-weight: 800;
    color: #ffffff;
    font-family: "Plus Jakarta Sans", sans-serif;
    letter-spacing: -0.01em;
  }
  .diagram-subtag {
    font-size: 11.5px;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 9999px;
    background: rgba(6, 182, 212, 0.22);
    color: #a5f3fc;
    border: 1px solid rgba(6, 182, 212, 0.6);
    font-family: "JetBrains Mono", monospace;
  }

  .svg-wrapper {
    width: 504px;
    height: 440px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .diagram-footer-note {
    font-size: 12px;
    font-weight: 600;
    color: #f1f5f9;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(15, 23, 42, 0.55);
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    line-height: 1.3;
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

  /* Generic Card Styles */
  .checkpoint-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    backdrop-filter: blur(14px);
    transition: all 0.3s ease;
  }

  /* Left vertical glowing neon bar */
  .neon-bar {
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 6.5px;
    border-radius: 0 4px 4px 0;
  }
  .bar-g1s { background: #facc15; box-shadow: 0 0 16px #facc15, 0 0 32px rgba(250, 204, 21, 0.7); }
  .bar-g2m { background: #00f0ff; box-shadow: 0 0 16px #00f0ff, 0 0 32px rgba(0, 240, 255, 0.7); }
  .bar-m   { background: #f43f5e; box-shadow: 0 0 16px #f43f5e, 0 0 32px rgba(244, 63, 94, 0.7); }
  .bar-passed { background: #22c55e; box-shadow: 0 0 12px #22c55e; }

  /* ACTIVE CARD (Hero size ~292px) */
  .card-active {
    height: 294px;
    padding: 13px 18px 13px 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .card-active-1 {
    background: linear-gradient(135deg, rgba(250, 204, 21, 0.22) 0%, rgba(15, 23, 42, 0.85) 100%);
    border: 2px solid rgba(250, 204, 21, 0.9);
    box-shadow: 0 0 24px rgba(250, 204, 21, 0.32), 0 16px 36px -8px rgba(0, 0, 0, 0.45), inset 0 2px 6px rgba(255, 255, 255, 0.6);
  }
  .card-active-2 {
    background: linear-gradient(135deg, rgba(0, 240, 255, 0.22) 0%, rgba(15, 23, 42, 0.85) 100%);
    border: 2px solid rgba(0, 240, 255, 0.9);
    box-shadow: 0 0 24px rgba(0, 240, 255, 0.32), 0 16px 36px -8px rgba(0, 0, 0, 0.45), inset 0 2px 6px rgba(255, 255, 255, 0.6);
  }
  .card-active-3 {
    background: linear-gradient(135deg, rgba(244, 63, 94, 0.22) 0%, rgba(15, 23, 42, 0.85) 100%);
    border: 2px solid rgba(244, 63, 94, 0.9);
    box-shadow: 0 0 24px rgba(244, 63, 94, 0.32), 0 16px 36px -8px rgba(0, 0, 0, 0.45), inset 0 2px 6px rgba(255, 255, 255, 0.6);
  }

  .active-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
  }
  .active-badge-g1s {
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.05em;
    padding: 3.5px 12px;
    border-radius: 9999px;
    background: rgba(250, 204, 21, 0.4);
    color: #fef08a;
    border: 1.5px solid #facc15;
    font-family: "JetBrains Mono", monospace;
  }
  .active-badge-g2m {
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.05em;
    padding: 3.5px 12px;
    border-radius: 9999px;
    background: rgba(0, 240, 255, 0.4);
    color: #cffafe;
    border: 1.5px solid #00f0ff;
    font-family: "JetBrains Mono", monospace;
  }
  .active-badge-m {
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.05em;
    padding: 3.5px 12px;
    border-radius: 9999px;
    background: rgba(244, 63, 94, 0.4);
    color: #ffe4e6;
    border: 1.5px solid #f43f5e;
    font-family: "JetBrains Mono", monospace;
  }
  .active-phase-tag {
    font-size: 12.5px;
    font-weight: 800;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
  .active-title {
    font-size: 21px;
    font-weight: 850;
    color: #ffffff;
    line-height: 1.22;
    letter-spacing: -0.015em;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  }

  .active-details-box {
    background: rgba(15, 23, 42, 0.6);
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    border-radius: 10px;
    padding: 7px 12px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.32);
  }
  .cp-cue {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-family: "JetBrains Mono", monospace;
  }
  .cue-g1s { color: #fde047; }
  .cue-g2m { color: #38bdf8; }
  .cue-m   { color: #fb7185; }

  .active-text {
    font-size: 13.5px;
    line-height: 1.34;
    color: #ffffff;
    font-weight: 600;
  }

  /* Active Deep-Dive Subgrid (2 Columns) */
  .active-subgrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
  }
  .subbox {
    background: rgba(15, 23, 42, 0.55);
    border-radius: 8px;
    padding: 6px 10px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .subbox-label {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.05em;
    font-family: "JetBrains Mono", monospace;
  }
  .subbox-val {
    font-size: 11.5px;
    line-height: 1.25;
    color: #e2e8f0;
    font-weight: 600;
  }

  /* COMPACT / SECONDARY CARD (~120px) */
  .card-compact {
    height: 122px;
    padding: 10px 16px 10px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .card-passed {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.14) 0%, rgba(15, 23, 42, 0.65) 100%);
    border: 1.4px solid rgba(34, 197, 94, 0.55);
    box-shadow: 0 10px 24px -6px rgba(0, 0, 0, 0.3);
  }
  .card-upcoming {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(15, 23, 42, 0.55) 100%);
    border: 1.2px solid rgba(255, 255, 255, 0.25);
    box-shadow: 0 10px 24px -6px rgba(0, 0, 0, 0.25);
    opacity: 0.72;
  }

  .compact-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .badge-passed {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 2.5px 9px;
    border-radius: 9999px;
    background: rgba(34, 197, 94, 0.3);
    color: #86efac;
    border: 1px solid #22c55e;
    font-family: "JetBrains Mono", monospace;
  }
  .badge-upcoming {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 2.5px 9px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.14);
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, 0.35);
    font-family: "JetBrains Mono", monospace;
  }
  .compact-phase-tag {
    font-size: 11.5px;
    font-weight: 700;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .compact-title {
    font-size: 16px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }
  .compact-text {
    font-size: 12.5px;
    line-height: 1.28;
    color: #cbd5e1;
    font-weight: 500;
    background: rgba(15, 23, 42, 0.35);
    padding: 5px 10px;
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  /* Footer */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13.5px;
    color: #cbd5e1;
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
    font-size: 13.5px;
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
          <span class="badge ${cfg.badgeStageClass}">${cfg.badgeStage}</span>
          <span class="badge badge-gate">${cfg.badgeFocus}</span>
        </div>
        <div class="topic-tag">
          <span class="dot"></span>
          OCR Level 3 Cambridge Advanced National (AAQ) Human Biology
        </div>
      </div>
      <div class="title-row">
        <h1 class="slide-title">${cfg.slideTitle}</h1>
        <span class="subtitle">${cfg.subtitle}</span>
      </div>
    </div>

    <!-- Main Content: Diagram (Left) & Checkpoint Cards (Right) -->
    <div class="main-content">
      <!-- Diagram Panel -->
      <div class="diagram-panel">
        <div class="diagram-header">
          <span class="diagram-title">Eukaryotic Cell Cycle & Surveillance Points</span>
          <span class="diagram-subtag">${cfg.subtag}</span>
        </div>

        <div class="svg-wrapper">
          <svg width="504" height="430" viewBox="0 0 510 430" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
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

              <!-- Neon Glow Filters -->
              <filter id="neonGlowYellow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="neonGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="neonGlowRose" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Outer Orbit Guide Ring -->
            <circle cx="255" cy="205" r="160" stroke="rgba(255,255,255,0.12)" stroke-width="2" stroke-dasharray="4 4" />

            <!-- Track Segments: Center=(255, 205), R=142 -->
            <!-- G1 Phase Arc (Blue): Left quadrant -->
            <path d="M 115 215 A 142 142 0 0 1 180 82" stroke="url(#gradG1)" stroke-width="${activeStage === 1 ? '32' : '26'}" stroke-linecap="round" ${activeStage === 1 ? 'filter="drop-shadow(0 0 12px rgba(96,165,250,0.6))"' : ''} />
            
            <!-- S Phase Arc (Cyan Glowing - Target of Replication): Top right quadrant -->
            <path d="M 198 70 A 142 142 0 0 1 364 116" stroke="url(#gradS)" stroke-width="32" stroke-linecap="round" filter="drop-shadow(0 0 14px rgba(0,240,255,0.5))" />

            <!-- G2 Phase Arc (Green): Right quadrant -->
            <path d="M 374 130 A 142 142 0 0 1 334 316" stroke="url(#gradG2)" stroke-width="${activeStage === 2 ? '32' : '26'}" stroke-linecap="round" ${activeStage === 2 ? 'filter="drop-shadow(0 0 12px rgba(52,211,153,0.6))"' : ''} />

            <!-- M Phase Arc (Pink/Rose): Bottom quadrant -->
            <path d="M 320 328 A 142 142 0 0 1 140 250" stroke="url(#gradM)" stroke-width="${activeStage === 3 ? '32' : '26'}" stroke-linecap="round" ${activeStage === 3 ? 'filter="drop-shadow(0 0 12px rgba(251,113,133,0.6))"' : ''} />

            <!-- Central Hub (Glassmorphism circle) -->
            <circle cx="255" cy="205" r="86" fill="rgba(15, 23, 42, 0.82)" stroke="rgba(255, 255, 255, 0.38)" stroke-width="2" />
            <text x="255" y="186" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="850" font-family="'Plus Jakarta Sans', sans-serif">${cfg.centerStageTitle}</text>
            <text x="255" y="205" text-anchor="middle" fill="${cfg.centerStageNameColor}" font-size="12" font-weight="850" font-family="'JetBrains Mono', monospace">${cfg.centerStageName}</text>
            <text x="255" y="224" text-anchor="middle" fill="#cbd5e1" font-size="11" font-weight="700">${cfg.centerStageProteins}</text>

            <!-- Phase Labels on Segments -->
            <!-- G1 Label -->
            <text x="100" y="140" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">G₁ PHASE</text>
            <text x="100" y="158" text-anchor="middle" fill="#e2e8f0" font-size="11.5" font-weight="600">Growth &</text>
            <text x="100" y="174" text-anchor="middle" fill="#e2e8f0" font-size="11.5" font-weight="600">Preparation</text>

            <!-- S Phase Label -->
            <rect x="238" y="20" width="170" height="48" rx="10" fill="rgba(2, 132, 199, 0.88)" stroke="#00f0ff" stroke-width="1.8" filter="drop-shadow(0 0 14px rgba(0,240,255,0.65))" />
            <text x="323" y="39" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">★ S PHASE (NEXT)</text>
            <text x="323" y="56" text-anchor="middle" fill="#cffafe" font-size="11.5" font-weight="700">DNA Semiconservative Replication</text>

            <!-- G2 Label -->
            <text x="405" y="218" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">G₂ PHASE</text>
            <text x="405" y="236" text-anchor="middle" fill="#e2e8f0" font-size="11.5" font-weight="600">Pre-mitotic</text>
            <text x="405" y="252" text-anchor="middle" fill="#e2e8f0" font-size="11.5" font-weight="600">Fidelity Check</text>

            <!-- M Label (Mitosis) -->
            <text x="255" y="380" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">M PHASE (Mitosis)</text>

            <!-- CHECKPOINT 1 SVG NODE -->
            ${activeStage === 1 ? `
              <!-- Active Beacon Stage 1 -->
              <circle cx="188" cy="74" r="23" stroke="#facc15" stroke-width="2.5" stroke-dasharray="4 3" opacity="0.85" />
              <g filter="url(#neonGlowYellow)">
                <circle cx="188" cy="74" r="15" fill="#facc15" stroke="#ffffff" stroke-width="2.5" />
                <text x="188" y="79" text-anchor="middle" fill="#000000" font-size="12.5" font-weight="900" font-family="'JetBrains Mono', monospace">1</text>
              </g>
              <rect x="36" y="38" width="144" height="28" rx="7" fill="rgba(250, 204, 21, 0.45)" stroke="#facc15" stroke-width="1.8" filter="drop-shadow(0 0 10px rgba(250,204,21,0.6))" />
              <text x="108" y="56" text-anchor="middle" fill="#fef08a" font-size="11.5" font-weight="900">★ G₁/S CHECKPOINT</text>
            ` : `
              <!-- Cleared Stage 1 -->
              <circle cx="188" cy="74" r="13" fill="#15803d" stroke="#4ade80" stroke-width="2" />
              <text x="188" y="78" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900">✓</text>
              <rect x="44" y="42" width="132" height="24" rx="6" fill="rgba(34, 197, 94, 0.28)" stroke="#22c55e" stroke-width="1.2" />
              <text x="110" y="58" text-anchor="middle" fill="#86efac" font-size="11" font-weight="800">G₁/S PASSED ✓</text>
            `}

            <!-- CHECKPOINT 2 SVG NODE -->
            ${activeStage === 2 ? `
              <!-- Active Beacon Stage 2 -->
              <circle cx="328" cy="322" r="23" stroke="#00f0ff" stroke-width="2.5" stroke-dasharray="4 3" opacity="0.85" />
              <g filter="url(#neonGlowCyan)">
                <circle cx="328" cy="322" r="15" fill="#00f0ff" stroke="#ffffff" stroke-width="2.5" />
                <text x="328" y="327" text-anchor="middle" fill="#000000" font-size="12.5" font-weight="900" font-family="'JetBrains Mono', monospace">2</text>
              </g>
              <rect x="344" y="308" width="150" height="28" rx="7" fill="rgba(0, 240, 255, 0.45)" stroke="#00f0ff" stroke-width="1.8" filter="drop-shadow(0 0 10px rgba(0,240,255,0.6))" />
              <text x="419" y="326" text-anchor="middle" fill="#cffafe" font-size="11.5" font-weight="900">★ G₂/M CHECKPOINT</text>
            ` : (activeStage > 2 ? `
              <!-- Cleared Stage 2 -->
              <circle cx="328" cy="322" r="13" fill="#15803d" stroke="#4ade80" stroke-width="2" />
              <text x="328" y="326" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900">✓</text>
              <rect x="350" y="312" width="134" height="24" rx="6" fill="rgba(34, 197, 94, 0.28)" stroke="#22c55e" stroke-width="1.2" />
              <text x="417" y="328" text-anchor="middle" fill="#86efac" font-size="11" font-weight="800">G₂/M PASSED ✓</text>
            ` : `
              <!-- Upcoming Stage 2 -->
              <circle cx="328" cy="322" r="12" fill="rgba(6, 182, 212, 0.4)" stroke="rgba(0, 240, 255, 0.6)" stroke-width="1.6" />
              <text x="328" y="326" text-anchor="middle" fill="#cffafe" font-size="11" font-weight="800" font-family="'JetBrains Mono', monospace">2</text>
              <rect x="350" y="312" width="134" height="24" rx="6" fill="rgba(6, 182, 212, 0.2)" stroke="rgba(0, 240, 255, 0.4)" stroke-width="1" />
              <text x="417" y="328" text-anchor="middle" fill="#a5f3fc" font-size="11" font-weight="700">2: G₂/M (Next)</text>
            `)}

            <!-- CHECKPOINT 3 SVG NODE -->
            ${activeStage === 3 ? `
              <!-- Active Beacon Stage 3 -->
              <circle cx="198" cy="316" r="23" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="4 3" opacity="0.85" />
              <g filter="url(#neonGlowRose)">
                <circle cx="198" cy="316" r="15" fill="#f43f5e" stroke="#ffffff" stroke-width="2.5" />
                <text x="198" y="321" text-anchor="middle" fill="#ffffff" font-size="12.5" font-weight="900" font-family="'JetBrains Mono', monospace">3</text>
              </g>
              <rect x="90" y="334" width="130" height="28" rx="7" fill="rgba(244, 63, 94, 0.45)" stroke="#f43f5e" stroke-width="1.8" filter="drop-shadow(0 0 10px rgba(244,63,94,0.6))" />
              <text x="155" y="352" text-anchor="middle" fill="#ffe4e6" font-size="11.5" font-weight="900">★ M / SAC CHECK</text>
            ` : `
              <!-- Upcoming Stage 3 -->
              <circle cx="198" cy="316" r="12" fill="rgba(244, 63, 94, 0.35)" stroke="rgba(244, 63, 94, 0.6)" stroke-width="1.6" />
              <text x="198" y="320" text-anchor="middle" fill="#ffe4e6" font-size="11" font-weight="800" font-family="'JetBrains Mono', monospace">3</text>
              <rect x="100" y="336" width="108" height="24" rx="6" fill="rgba(244, 63, 94, 0.18)" stroke="rgba(244, 63, 94, 0.4)" stroke-width="1" />
              <text x="154" y="352" text-anchor="middle" fill="#fecdd3" font-size="11" font-weight="700">3: SAC (Stage 3)</text>
            `}

            <!-- G0 Pathway Exit (Linking to Patient A / Senescence!) -->
            <path d="M 115 224 C 65 242 42 268 42 292" stroke="#c084fc" stroke-width="2.8" stroke-dasharray="4 3" fill="none" />
            <polygon points="42,298 37,288 47,288" fill="#c084fc" />
            <rect x="6" y="302" width="98" height="40" rx="8" fill="rgba(168, 85, 247, 0.3)" stroke="#c084fc" stroke-width="1.4" />
            <text x="55" y="318" text-anchor="middle" fill="#f3e8ff" font-size="11" font-weight="800">G₀ PHASE</text>
            <text x="55" y="332" text-anchor="middle" fill="#e9d5ff" font-size="9.5" font-weight="600">Senescence (Pt. A)</text>
          </svg>
        </div>

        <div class="diagram-footer-note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${cfg.footerIconStroke}" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          ${cfg.footerNote}
        </div>
      </div>

      <!-- Right Panel: 3 Checkpoint Cards -->
      <div class="cards-panel">
        
        <!-- CARD 1 -->
        ${cfg.card1Role === "active" ? `
          <div class="checkpoint-card card-active card-active-1" id="card_cp_1">
            <div class="neon-bar bar-g1s"></div>
            <div>
              <div class="active-top">
                <span class="active-badge-g1s">★ ACTIVE FOCUS · CHECKPOINT 1</span>
                <span class="active-phase-tag">Late G₁ → S Gateway · The Restriction Point</span>
              </div>
              <h2 class="active-title">G₁/S DNA Damage & Cell Growth Checkpoint</h2>
            </div>
            <div class="active-details-box" id="box_active_cp_1">
              <div class="cp-cue cue-g1s">Surveillance Focus & Molecular Mechanism:</div>
              <div class="active-text">Verifies DNA template integrity, cell volume, and energy stores. Double-strand breaks trigger <strong>ATM/ATR kinase</strong> cascades that activate <strong>p53 transcription factor</strong>, upregulating <strong>p21</strong> to arrest CDK2/cyclin E and block replication fork initiation.</div>
            </div>
            <div class="active-subgrid">
              <div class="subbox">
                <span class="subbox-label cue-g1s">MOLECULAR PATHWAY:</span>
                <span class="subbox-val">DNA Damage → ATM/ATR → p53 stabilized → p21 (CIP1) ↑ → CDK2/Cyclin E blocked → S-phase entry halted.</span>
              </div>
              <div class="subbox">
                <span class="subbox-label cue-g1s">BIOMEDICAL IMPORTANCE:</span>
                <span class="subbox-val">Guardian of the Genome. TP53 mutation in >50% of cancers bypasses G₁ arrest, causing uncorrected mutation accumulation.</span>
              </div>
            </div>
          </div>
        ` : (cfg.card1Role === "passed" ? `
          <div class="checkpoint-card card-compact card-passed" id="card_cp_1">
            <div class="neon-bar bar-passed"></div>
            <div class="compact-top">
              <span class="badge-passed">✓ CHECKPOINT 1 CLEARED</span>
              <span class="compact-phase-tag">Late G₁ → S Passed</span>
            </div>
            <h3 class="compact-title">G₁/S DNA Damage Checkpoint (Passed)</h3>
            <div class="compact-text">DNA template integrity and metabolic stores verified; p53 approved CDK2 activation, allowing progression into S-phase.</div>
          </div>
        ` : `
          <div class="checkpoint-card card-compact card-upcoming" id="card_cp_1">
            <div class="neon-bar bar-g1s"></div>
            <div class="compact-top">
              <span class="badge-upcoming">CHECKPOINT 1</span>
              <span class="compact-phase-tag">Late G₁ → S</span>
            </div>
            <h3 class="compact-title">G₁/S DNA Damage & Growth Checkpoint</h3>
            <div class="compact-text">Verifies DNA template integrity and cell volume via ATM/ATR, p53, and p21 inhibition of CDK2/Cyclin E.</div>
          </div>
        `)}

        <!-- CARD 2 -->
        ${cfg.card2Role === "active" ? `
          <div class="checkpoint-card card-active card-active-2" id="card_cp_2">
            <div class="neon-bar bar-g2m"></div>
            <div>
              <div class="active-top">
                <span class="active-badge-g2m">★ ACTIVE FOCUS · CHECKPOINT 2</span>
                <span class="active-phase-tag">Post-Replication Surveillance · G₂ → M Gateway</span>
              </div>
              <h2 class="active-title">G₂/M DNA Replication Completeness Checkpoint</h2>
            </div>
            <div class="active-details-box" id="box_active_cp_2">
              <div class="cp-cue cue-g2m">Surveillance Focus & Molecular Mechanism:</div>
              <div class="active-text">Confirms that all 46 chromosomes have been <strong>fully and accurately duplicated</strong> in S phase without unresolved replication forks or unligated Okazaki fragments. Inhibits <strong>CDK1/cyclin B (MPF)</strong> until repair polymerases and ligases seal all gaps.</div>
            </div>
            <div class="active-subgrid">
              <div class="subbox">
                <span class="subbox-label cue-g2m">MOLECULAR PATHWAY:</span>
                <span class="subbox-val">Stalled Forks/Nicks → ATR/Chk1 kinases → Inactivates Cdc25 phosphatase → Inhibitory phosphate stays on CDK1 → Mitosis arrested.</span>
              </div>
              <div class="subbox">
                <span class="subbox-label cue-g2m">REPLICATION COUPLING:</span>
                <span class="subbox-val">Ensures lagging strand synthesis (Okazaki fragment sealing by DNA ligase) finishes completely before mitotic spindle pulls DNA apart.</span>
              </div>
            </div>
          </div>
        ` : (cfg.card2Role === "passed" ? `
          <div class="checkpoint-card card-compact card-passed" id="card_cp_2">
            <div class="neon-bar bar-passed"></div>
            <div class="compact-top">
              <span class="badge-passed">✓ CHECKPOINT 2 CLEARED</span>
              <span class="compact-phase-tag">G₂ → M Passed</span>
            </div>
            <h3 class="compact-title">G₂/M DNA Replication Completeness Checkpoint (Passed)</h3>
            <div class="compact-text">All 46 chromosomes verified fully duplicated with sealed Okazaki fragments; CDK1/Cyclin B activated to enter mitosis.</div>
          </div>
        ` : `
          <div class="checkpoint-card card-compact card-upcoming" id="card_cp_2">
            <div class="neon-bar bar-g2m"></div>
            <div class="compact-top">
              <span class="badge-upcoming">CHECKPOINT 2 (NEXT)</span>
              <span class="compact-phase-tag">Post-Replication · G₂ → M</span>
            </div>
            <h3 class="compact-title">G₂/M DNA Replication Completeness Checkpoint</h3>
            <div class="compact-text">Confirms all 46 chromosomes are duplicated without unresolved replication forks or nicks before activating MPF.</div>
          </div>
        `)}

        <!-- CARD 3 -->
        ${cfg.card3Role === "active" ? `
          <div class="checkpoint-card card-active card-active-3" id="card_cp_3">
            <div class="neon-bar bar-m"></div>
            <div>
              <div class="active-top">
                <span class="active-badge-m">★ ACTIVE FOCUS · CHECKPOINT 3</span>
                <span class="active-phase-tag">Metaphase → Anaphase Gateway · Spindle Integrity</span>
              </div>
              <h2 class="active-title">Spindle Assembly Checkpoint (SAC)</h2>
            </div>
            <div class="active-details-box" id="box_active_cp_3">
              <div class="cp-cue cue-m">Surveillance Focus & Molecular Mechanism:</div>
              <div class="active-text">Monitors mechanical tension and bilateral attachment of spindle microtubules to sister kinetochores. Unattached kinetochores generate the <strong>Mitotic Checkpoint Complex (MCC)</strong>, inhibiting <strong>APC/C-Cdc20</strong> to prevent nondisjunction and catastrophic aneuploidy.</div>
            </div>
            <div class="active-subgrid">
              <div class="subbox">
                <span class="subbox-label cue-m">MOLECULAR PATHWAY:</span>
                <span class="subbox-val">Unattached Kinetochore → Mad2/BubR1/Bub3 form MCC → Inhibits APC/C-Cdc20 → Securin preserved → Separase inhibited → Cohesin locked.</span>
              </div>
              <div class="subbox">
                <span class="subbox-label cue-m">GENETIC FIDELITY LINK:</span>
                <span class="subbox-val">Bipolar tension dissociates MCC; APC/C degrades Securin & Cyclin B, triggering Separase to cleave Cohesin for equal anaphase disjunction.</span>
              </div>
            </div>
          </div>
        ` : `
          <div class="checkpoint-card card-compact card-upcoming" id="card_cp_3">
            <div class="neon-bar bar-m"></div>
            <div class="compact-top">
              <span class="badge-upcoming">CHECKPOINT 3</span>
              <span class="compact-phase-tag">Metaphase → Anaphase</span>
            </div>
            <h3 class="compact-title">Spindle Assembly Checkpoint (SAC)</h3>
            <div class="compact-text">Monitors bilateral kinetochore tension on spindle fibers; MCC inhibits APC/C-Cdc20 to prevent aneuploidy.</div>
          </div>
        `}

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

async function renderTest() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  
  for (const stage of [1, 2, 3]) {
    const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
    await page.setContent(getCellCycleSlideHtml({ activeStage: stage }), { waitUntil: "load" });
    await page.waitForTimeout(400);

    const outPath = `scratch/test_cell_cycle_stage_${stage}.png`;
    await page.screenshot({ path: outPath });
    console.log(`Rendered stage ${stage} to ${outPath}`);

    // Check bounds of active card and details box
    const metrics = await page.evaluate((stageNum) => {
      const card = document.getElementById("card_cp_" + stageNum).getBoundingClientRect();
      const box = document.getElementById("box_active_cp_" + stageNum).getBoundingClientRect();
      return {
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
    }, stage);
    console.log(`Metrics stage ${stage}:`, metrics);
    await page.close();
  }

  await browser.close();
}

renderTest().catch(console.error);
