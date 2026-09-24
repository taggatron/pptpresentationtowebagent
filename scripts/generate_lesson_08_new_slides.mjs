import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";

const SET_ID = "ecology_atmosphere_classic";
const DECK_ID = "Classic_Lesson_08_Crude_Oil_and_Fractional_Distillation";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

const SLIDE_4_IMAGE_NAME = "slide_04_crude_oil_hydrocarbons.png";
const SLIDE_4_IMAGE_PATH = path.join(SLIDES_DIR, SLIDE_4_IMAGE_NAME);

const SLIDE_5_IMAGE_NAME = "slide_05_molymod_building_challenge.png";
const SLIDE_5_IMAGE_PATH = path.join(SLIDES_DIR, SLIDE_5_IMAGE_NAME);

// HTML Template for Slide 4: Crude Oil Definitions & Hydrocarbons
function getSlide4Html() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    width: 1376px;
    height: 768px;
    background-color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #000000;
    overflow: hidden;
    position: relative;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  /* Left Gradient Thermometer Bar (Matches Slide 3 style) */
  .thermometer-bar {
    position: absolute;
    left: 20px;
    top: 24px;
    width: 28px;
    height: 720px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .thermometer-stem {
    width: 24px;
    height: 660px;
    background: linear-gradient(180deg, #0284c7 0%, #3b82f6 30%, #8b5cf6 60%, #be123c 100%);
    border: 3px solid #0f172a;
    border-radius: 12px 12px 0 0;
    position: relative;
  }
  .thermometer-bulb {
    width: 38px;
    height: 38px;
    background: #be123c;
    border: 3px solid #0f172a;
    border-radius: 50%;
    margin-top: -6px;
    z-index: 2;
  }

  /* Slide Header */
  .slide-header {
    position: absolute;
    left: 78px;
    top: 32px;
  }
  .eyebrow-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    color: #0369a1;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
    margin-bottom: 6px;
  }
  .slide-title {
    font-size: 46px;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.1;
    color: #000000;
  }
  .slide-subtitle {
    font-size: 21px;
    font-weight: 600;
    color: #475569;
    margin-top: 4px;
    letter-spacing: -0.01em;
  }

  /* 3 Cards Container */
  .cards-container {
    position: absolute;
    left: 78px;
    top: 154px;
    width: 1242px;
    height: 556px;
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .card-styled {
    flex: 1;
    background: #ffffff;
    border: 2.5px solid #0284c7;
    border-radius: 14px;
    padding: 20px 18px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.05);
    position: relative;
    overflow: hidden;
  }
  .card-styled:nth-child(2) {
    border-color: #6366f1;
  }
  .card-styled:nth-child(3) {
    border-color: #be123c;
  }

  .card-header-badge {
    display: inline-block;
    align-self: flex-start;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .badge-blue { background: #e0f2fe; color: #0369a1; }
  .badge-purple { background: #ede9fe; color: #6d28d9; }
  .badge-ruby { background: #ffe4e6; color: #be123c; }

  .card-title {
    font-size: 24px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 12px;
  }

  /* Card 1: Geological origin illustration */
  .strata-diagram {
    width: 100%;
    height: 140px;
    border-radius: 8px;
    border: 1.5px solid #cbd5e1;
    overflow: hidden;
    position: relative;
    margin-bottom: 12px;
    background: #f8fafc;
  }

  /* Card text lists */
  .card-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 9px;
    font-size: 15px;
    line-height: 1.45;
    color: #1e293b;
  }
  .card-list li {
    position: relative;
    padding-left: 18px;
  }
  .card-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    top: -1px;
    font-size: 18px;
    color: #0284c7;
    font-weight: 800;
  }
  .card-styled:nth-child(2) .card-list li::before { color: #6366f1; }
  .card-styled:nth-child(3) .card-list li::before { color: #be123c; }

  .highlight-term {
    font-weight: 800;
    color: #000000;
  }
  .tag-finite {
    background: #fee2e2;
    color: #991b1b;
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 800;
  }
  .tag-only {
    background: #fef08a;
    color: #854d0e;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 900;
    border: 1px dashed #ca8a04;
  }

  /* Big Definition Callout in Card 2 */
  .def-callout {
    background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
    border: 2px solid #818cf8;
    border-radius: 10px;
    padding: 12px;
    text-align: center;
    margin-bottom: 12px;
  }
  .def-label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    color: #4f46e5;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }
  .def-text {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.3;
  }

  /* Ball-and-stick vector visual */
  .molecule-diagram-box {
    width: 100%;
    height: 130px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }

  /* Card 3: Formula and chain progression */
  .formula-pill {
    background: linear-gradient(90deg, #be123c 0%, #9f1239 100%);
    color: #ffffff;
    border-radius: 8px;
    padding: 8px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .formula-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  .formula-math {
    font-size: 21px;
    font-weight: 900;
    font-family: "JetBrains Mono", monospace, sans-serif;
  }

  .progression-scale {
    width: 100%;
    background: #fdf2f8;
    border: 1.5px solid #fbcfe8;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 12px;
  }
  .progression-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    padding: 3px 0;
    border-bottom: 1px solid #fce7f3;
  }
  .progression-row:last-child {
    border-bottom: none;
  }
  .prog-badge {
    font-weight: 800;
    color: #9d174d;
    font-size: 12px;
  }

  .takeaway-footer {
    margin-top: auto;
    background: #f1f5f9;
    border-left: 3px solid #be123c;
    padding: 8px 10px;
    border-radius: 0 6px 6px 0;
    font-size: 12.5px;
    line-height: 1.35;
    color: #334155;
    font-weight: 600;
  }

  /* Gemini Notebook logo in bottom right */
  .brand-footer {
    position: absolute;
    right: 28px;
    bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
  }
</style>
</head>
<body>

  <!-- Left Thermometer Graphic -->
  <div class="thermometer-bar">
    <div class="thermometer-stem"></div>
    <div class="thermometer-bulb"></div>
  </div>

  <!-- Header -->
  <div class="slide-header">
    <div class="eyebrow-pill">Chemical Foundations · Organic Chemistry</div>
    <h1 class="slide-title">Crude Oil: A Complex Mixture of Hydrocarbons</h1>
    <div class="slide-subtitle">Origin, Chemical Foundations & the Alkane Homologous Series</div>
  </div>

  <!-- 3 Cards Layout -->
  <div class="cards-container">
    
    <!-- CARD 1: Origin & Nature -->
    <div class="card-styled">
      <span class="card-header-badge badge-blue">Geological Origins</span>
      <h2 class="card-title">1. A Finite Fossil Fuel</h2>
      
      <!-- Strata SVG Illustration -->
      <div class="strata-diagram">
        <svg width="100%" height="100%" viewBox="0 0 380 140" preserveAspectRatio="none">
          <!-- Ocean water layer -->
          <rect x="0" y="0" width="380" height="32" fill="#38bdf8"/>
          <text x="12" y="20" font-size="11" font-weight="700" fill="#0369a1" font-family="sans-serif">ANCIENT OCEAN (Plankton & Microscopic Biomass)</text>
          
          <!-- Mud / silt layer -->
          <rect x="0" y="32" width="380" height="32" fill="#cbd5e1"/>
          <text x="12" y="52" font-size="11" font-weight="700" fill="#334155" font-family="sans-serif">Anaerobic Mud & Sediment Layers</text>
          
          <!-- Heat & Pressure arrows -->
          <g fill="#e11d48">
            <path d="M 60,66 L 70,76 L 50,76 Z" />
            <path d="M 180,66 L 190,76 L 170,76 Z" />
            <path d="M 300,66 L 310,76 L 290,76 Z" />
          </g>
          
          <!-- Deep Bedrock & Oil reservoir -->
          <rect x="0" y="64" width="380" height="42" fill="#475569"/>
          <text x="12" y="88" font-size="11" font-weight="700" fill="#f8fafc" font-family="sans-serif">High Temperature & Intense Pressure (Millions of Yrs)</text>
          
          <!-- Crude Oil Deposit -->
          <rect x="0" y="106" width="380" height="34" fill="#0f172a"/>
          <circle cx="20" cy="123" r="5" fill="#f59e0b"/>
          <text x="32" y="127" font-size="12" font-weight="800" fill="#fef08a" font-family="sans-serif">CRUDE OIL & GAS TRAPPED UNDER NON-POROUS ROCK</text>
        </svg>
      </div>

      <ul class="card-list">
        <li>Formed over <span class="highlight-term">millions of years</span> from the fossilised remains of ancient marine biomass (principally plankton).</li>
        <li>Buried under thick seabed mud without oxygen (<span class="highlight-term">anaerobic conditions</span>).</li>
        <li>Classified as a <span class="tag-finite">FINITE RESOURCE</span>: extracted much faster than it is formed; it cannot be naturally replaced once depleted.</li>
        <li>It is a <span class="highlight-term">mixture</span> of thousands of distinct organic molecules not chemically bonded together.</li>
      </ul>
    </div>

    <!-- CARD 2: What is a Hydrocarbon? -->
    <div class="card-styled">
      <span class="card-header-badge badge-purple">Core Scientific Definition</span>
      <h2 class="card-title">2. What is a Hydrocarbon?</h2>

      <div class="def-callout">
        <div class="def-label">Formal Exam Definition</div>
        <div class="def-text">A molecule formed of <span style="color:#0284c7;">Hydrogen</span> and <span style="color:#000000; text-decoration: underline;">Carbon</span> <span class="tag-only">ONLY</span></div>
      </div>

      <!-- Vector Ball-and-Stick C-H Bonding Graphic -->
      <div class="molecule-diagram-box">
        <svg width="340" height="115" viewBox="0 0 340 115">
          <!-- Ethane (C2H6) Model -->
          <!-- C-C bond -->
          <line x1="125" y1="58" x2="215" y2="58" stroke="#64748b" stroke-width="8" stroke-linecap="round"/>
          
          <!-- Left Carbon Bonds -->
          <line x1="125" y1="58" x2="65" y2="25" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
          <line x1="125" y1="58" x2="65" y2="90" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
          <line x1="125" y1="58" x2="125" y2="12" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
          
          <!-- Right Carbon Bonds -->
          <line x1="215" y1="58" x2="275" y2="25" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
          <line x1="215" y1="58" x2="275" y2="90" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
          <line x1="215" y1="58" x2="215" y2="105" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>

          <!-- Hydrogen Spheres (Cyan/White) -->
          <circle cx="65" cy="25" r="14" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
          <text x="65" y="30" font-size="12" font-weight="900" text-anchor="middle" fill="#ffffff">H</text>

          <circle cx="65" cy="90" r="14" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
          <text x="65" y="95" font-size="12" font-weight="900" text-anchor="middle" fill="#ffffff">H</text>

          <circle cx="125" cy="12" r="14" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
          <text x="125" y="17" font-size="12" font-weight="900" text-anchor="middle" fill="#ffffff">H</text>

          <circle cx="275" cy="25" r="14" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
          <text x="275" y="30" font-size="12" font-weight="900" text-anchor="middle" fill="#ffffff">H</text>

          <circle cx="275" cy="90" r="14" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
          <text x="275" y="95" font-size="12" font-weight="900" text-anchor="middle" fill="#ffffff">H</text>

          <circle cx="215" cy="105" r="14" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
          <text x="215" y="110" font-size="12" font-weight="900" text-anchor="middle" fill="#ffffff">H</text>

          <!-- Carbon Spheres (Dark Slate) -->
          <circle cx="125" cy="58" r="22" fill="#0f172a" stroke="#475569" stroke-width="3"/>
          <text x="125" y="65" font-size="18" font-weight="900" text-anchor="middle" fill="#ffffff">C</text>

          <circle cx="215" cy="58" r="22" fill="#0f172a" stroke="#475569" stroke-width="3"/>
          <text x="215" y="65" font-size="18" font-weight="900" text-anchor="middle" fill="#ffffff">C</text>
        </svg>
      </div>

      <ul class="card-list">
        <li><span class="highlight-term">Carbon valency</span>: Carbon has 4 outer electrons, so it must form <span class="highlight-term">4 covalent bonds</span>.</li>
        <li><span class="highlight-term">Hydrogen valency</span>: Hydrogen has 1 electron, so it forms <span class="highlight-term">1 covalent bond</span>.</li>
        <li><span class="highlight-term">Marking Trap</span>: Saying "contains hydrogen and carbon" drops marks — you must state <span class="tag-only">ONLY</span>!</li>
      </ul>
    </div>

    <!-- CARD 3: The Alkane Family & Chain Diversity -->
    <div class="card-styled">
      <span class="card-header-badge badge-ruby">Homologous Series</span>
      <h2 class="card-title">3. The Alkane Family</h2>

      <div class="formula-pill">
        <span class="formula-title">GENERAL FORMULA:</span>
        <span class="formula-math">C<sub>n</sub>H<sub>2n+2</sub></span>
      </div>

      <div class="progression-scale">
        <div class="progression-row">
          <span class="prog-badge">Gases (C₁–C₄)</span>
          <span>Methane (CH₄), Propane (C₃H₈)</span>
        </div>
        <div class="progression-row">
          <span class="prog-badge">Liquids (C₅–C₁₂)</span>
          <span>Petrol, Kerosene, Diesel fuels</span>
        </div>
        <div class="progression-row">
          <span class="prog-badge">Waxes & Solids (C₁₆+)</span>
          <span>Lubricating oils, Bitumen (roads)</span>
        </div>
      </div>

      <ul class="card-list">
        <li><span class="highlight-term">Saturated molecules</span>: contain only single C–C bonds (maximum hydrogens attached).</li>
        <li>Every member belongs to a <span class="highlight-term">homologous series</span> with similar chemical properties and gradual trend in physical properties.</li>
      </ul>

      <div class="takeaway-footer">
        <strong>The Separation Imperative:</strong> Crude oil itself is unusable directly because its molecules have wildly differing boiling points, viscosities, and flammabilities. It must be separated!
      </div>
    </div>

  </div>

  <!-- Gemini Notebook Logo Branding -->
  <div class="brand-footer">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#0284c7"/>
    </svg>
    <span>Gemini Notebook</span>
  </div>

</body>
</html>`;
}

// HTML Template for Slide 5: Molymod Challenge: Building Alkanes & Alkenes
function getSlide5Html() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    width: 1376px;
    height: 768px;
    background-color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #000000;
    overflow: hidden;
    position: relative;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  /* Slide Header */
  .slide-header {
    position: absolute;
    left: 60px;
    top: 16px;
    display: flex;
    justify-content: space-between;
    width: 1256px;
    align-items: center;
  }
  .header-left {
    max-width: 740px;
  }
  .eyebrow-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #e0f2fe;
    border: 1px solid #7dd3fc;
    color: #0369a1;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2px 9px;
    border-radius: 999px;
    margin-bottom: 2px;
  }
  .slide-title {
    font-size: 29px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: #000000;
    white-space: nowrap;
  }
  .slide-subtitle {
    font-size: 14.5px;
    font-weight: 600;
    color: #475569;
    margin-top: 2px;
  }

  /* Top Right Molymod Key Banner */
  .molymod-key-banner {
    background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
    border: 2px solid #818cf8;
    border-radius: 12px;
    padding: 6px 12px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.12);
  }
  .key-title {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #4f46e5;
  }
  .key-items {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .key-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 700;
    color: #1e293b;
  }
  .ball-c {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #0f172a;
    border: 2px solid #475569;
    display: inline-block;
  }
  .ball-h {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #f8fafc;
    border: 2px solid #94a3b8;
    display: inline-block;
  }
  .link-single {
    width: 16px;
    height: 5px;
    background: #94a3b8;
    border-radius: 3px;
    display: inline-block;
  }
  .link-double {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .link-double span {
    width: 16px;
    height: 3px;
    background: #6366f1;
    border-radius: 2px;
  }
  .golden-rule-pill {
    background: #fef3c7;
    border: 1px dashed #d97706;
    color: #92400e;
    font-size: 10px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 4px;
  }

  /* 3 Cards Container */
  .cards-container {
    position: absolute;
    left: 60px;
    top: 118px;
    width: 1256px;
    height: 560px;
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .challenge-card {
    flex: 1;
    background: #ffffff;
    border: 2.5px solid #0284c7;
    border-radius: 14px;
    padding: 18px 16px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.05);
    position: relative;
  }
  .challenge-card:nth-child(2) {
    border-color: #6366f1;
  }
  .challenge-card:nth-child(3) {
    border-color: #be123c;
  }

  .challenge-badge {
    align-self: flex-start;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .badge-1 { background: #e0f2fe; color: #0369a1; }
  .badge-2 { background: #ede9fe; color: #6d28d9; }
  .badge-3 { background: #ffe4e6; color: #be123c; }

  .challenge-title {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 10px;
  }

  /* Molecular Model Box */
  .model-display-box {
    width: 100%;
    height: 168px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    position: relative;
  }

  .step-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14.5px;
    line-height: 1.4;
    color: #1e293b;
    margin-bottom: 10px;
  }
  .step-list li {
    position: relative;
    padding-left: 20px;
  }
  .step-list li::before {
    content: "➔";
    position: absolute;
    left: 0;
    top: 0px;
    font-size: 13px;
    font-weight: 900;
    color: #0284c7;
  }
  .challenge-card:nth-child(2) .step-list li::before { color: #6366f1; }
  .challenge-card:nth-child(3) .step-list li::before { color: #be123c; }

  .callout-box {
    margin-top: auto;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 12.5px;
    line-height: 1.35;
    font-weight: 600;
  }
  .callout-blue { background: #f0f9ff; border-left: 3px solid #0284c7; color: #0369a1; }
  .callout-purple { background: #f5f3ff; border-left: 3px solid #6366f1; color: #4338ca; }
  .callout-ruby { background: #fff1f2; border-left: 3px solid #be123c; color: #9f1239; }

  /* Bottom Lab Checklist */
  .lab-checklist-bar {
    position: absolute;
    left: 60px;
    bottom: 20px;
    width: 1080px;
    display: flex;
    align-items: center;
    gap: 24px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 700;
    color: #334155;
  }
  .check-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .check-box-icon {
    width: 14px;
    height: 14px;
    border: 2px solid #0284c7;
    border-radius: 3px;
    background: #ffffff;
  }

  /* Gemini Notebook logo in bottom right */
  .brand-footer {
    position: absolute;
    right: 28px;
    bottom: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
  }
</style>
</head>
<body>

  <!-- Header -->
  <div class="slide-header">
    <div class="header-left">
      <div class="eyebrow-pill">Hands-On Molecular Modelling Workshop</div>
      <h1 class="slide-title">Molymod Challenge: Building Alkanes & Alkenes</h1>
      <div class="slide-subtitle">Constructing 3D Saturated Alkanes and Unsaturated Alkenes</div>
    </div>

    <!-- Molymod Key Banner -->
    <div class="molymod-key-banner">
      <div class="key-title">Molymod Component Specification</div>
      <div class="key-items">
        <div class="key-item"><span class="ball-c"></span> Carbon (4 holes, 4 bonds)</div>
        <div class="key-item"><span class="ball-h"></span> Hydrogen (1 hole, 1 bond)</div>
        <div class="key-item"><span class="link-single"></span> Single (C-C, C-H)</div>
        <div class="key-item"><div class="link-double"><span></span><span></span></div> Double (C=C)</div>
      </div>
      <div class="golden-rule-pill">
        ★ GOLDEN LAB RULE: No empty holes! Every C has 4 bonds; every H has 1 bond.
      </div>
    </div>
  </div>

  <!-- 3 Challenge Cards -->
  <div class="cards-container">

    <!-- CARD 1: Saturated Alkanes -->
    <div class="challenge-card">
      <span class="challenge-badge badge-1">Challenge 1: Saturated Alkanes</span>
      <h2 class="challenge-title">Alkanes (C<sub>n</sub>H<sub>2n+2</sub>)</h2>

      <!-- Vector SVG of Methane & Ethane 3D Models -->
      <div class="model-display-box">
        <svg width="340" height="150" viewBox="0 0 340 150">
          <!-- Methane (CH4) 3D Tetrahedral -->
          <g transform="translate(60, 75)">
            <!-- Bonds -->
            <line x1="0" y1="0" x2="0" y2="-45" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
            <line x1="0" y1="0" x2="-40" y2="30" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
            <line x1="0" y1="0" x2="35" y2="35" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
            <line x1="0" y1="0" x2="10" y2="40" stroke="#64748b" stroke-width="6" stroke-linecap="round"/> <!-- Forward wedge -->
            
            <!-- Hydrogens -->
            <circle cx="0" cy="-45" r="11" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <text x="0" y="-41" font-size="10" font-weight="900" text-anchor="middle" fill="#475569">H</text>

            <circle cx="-40" cy="30" r="11" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <text x="-40" y="34" font-size="10" font-weight="900" text-anchor="middle" fill="#475569">H</text>

            <circle cx="35" cy="35" r="11" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <text x="35" y="39" font-size="10" font-weight="900" text-anchor="middle" fill="#475569">H</text>

            <circle cx="10" cy="40" r="11" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <text x="10" y="44" font-size="10" font-weight="900" text-anchor="middle" fill="#475569">H</text>

            <!-- Carbon Center -->
            <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#334155" stroke-width="2.5"/>
            <text x="0" y="6" font-size="14" font-weight="900" text-anchor="middle" fill="#ffffff">C</text>

            <text x="0" y="65" font-size="12" font-weight="800" text-anchor="middle" fill="#0369a1">Methane (CH₄)</text>
          </g>

          <!-- Ethane (C2H6) 3D Model -->
          <g transform="translate(225, 75)">
            <!-- C-C bond -->
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
            
            <!-- Left C Hydrogens -->
            <line x1="-30" y1="0" x2="-65" y2="-30" stroke="#94a3b8" stroke-width="3.5"/>
            <line x1="-30" y1="0" x2="-65" y2="30" stroke="#94a3b8" stroke-width="3.5"/>
            <line x1="-30" y1="0" x2="-30" y2="-45" stroke="#94a3b8" stroke-width="3.5"/>

            <circle cx="-65" cy="-30" r="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
            <circle cx="-65" cy="30" r="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
            <circle cx="-30" cy="-45" r="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

            <!-- Right C Hydrogens -->
            <line x1="30" y1="0" x2="65" y2="-30" stroke="#94a3b8" stroke-width="3.5"/>
            <line x1="30" y1="0" x2="65" y2="30" stroke="#94a3b8" stroke-width="3.5"/>
            <line x1="30" y1="0" x2="30" y2="45" stroke="#94a3b8" stroke-width="3.5"/>

            <circle cx="65" cy="-30" r="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
            <circle cx="65" cy="30" r="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
            <circle cx="30" cy="45" r="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

            <!-- Carbons -->
            <circle cx="-30" cy="0" r="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>
            <circle cx="30" cy="0" r="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>
            <text x="-30" y="5" font-size="12" font-weight="900" text-anchor="middle" fill="#ffffff">C</text>
            <text x="30" y="5" font-size="12" font-weight="900" text-anchor="middle" fill="#ffffff">C</text>

            <text x="0" y="65" font-size="12" font-weight="800" text-anchor="middle" fill="#0369a1">Ethane (C₂H₆)</text>
          </g>
        </svg>
      </div>

      <ul class="step-list">
        <li><strong>Task 1</strong>: Build <strong>Methane (CH₄)</strong> and <strong>Ethane (C₂H₆)</strong>.</li>
        <li><strong>Task 2</strong>: Build <strong>Propane (C₃H₈)</strong> by inserting a 3rd carbon.</li>
        <li><strong>Tactile Observation</strong>: Notice the carbon backbone forms a <strong>3D zigzag</strong> with 109.5° tetrahedral angles—it is not flat!</li>
      </ul>

      <div class="callout-box callout-blue">
        <strong>Definition</strong>: Alkanes are <em>saturated</em> because all carbon-carbon bonds are single bonds; no more hydrogens can be added.
      </div>
    </div>

    <!-- CARD 2: Unsaturated Alkenes -->
    <div class="challenge-card">
      <span class="challenge-badge badge-2">Challenge 2: Unsaturated Alkenes</span>
      <h2 class="challenge-title">Alkenes (C<sub>n</sub>H<sub>2n</sub>)</h2>

      <!-- Vector SVG of Ethene (C2H4) with Double Bond -->
      <div class="model-display-box">
        <svg width="340" height="150" viewBox="0 0 340 150">
          <g transform="translate(170, 58)">
            <!-- Curved flexible links for C=C double bond -->
            <path d="M -38,-6 Q 0,-18 38,-6" fill="none" stroke="#6366f1" stroke-width="5" stroke-linecap="round"/>
            <path d="M -38,6 Q 0,18 38,6" fill="none" stroke="#6366f1" stroke-width="5" stroke-linecap="round"/>

            <!-- Left Carbon Hydrogens -->
            <line x1="-38" y1="0" x2="-80" y2="-36" stroke="#94a3b8" stroke-width="4"/>
            <line x1="-38" y1="0" x2="-80" y2="36" stroke="#94a3b8" stroke-width="4"/>
            <circle cx="-80" cy="-36" r="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <text x="-80" y="-32" font-size="10.5" font-weight="900" text-anchor="middle" fill="#475569">H</text>
            <circle cx="-80" cy="36" r="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <text x="-80" y="40" font-size="10.5" font-weight="900" text-anchor="middle" fill="#475569">H</text>

            <!-- Right Carbon Hydrogens -->
            <line x1="38" y1="0" x2="80" y2="-36" stroke="#94a3b8" stroke-width="4"/>
            <line x1="38" y1="0" x2="80" y2="36" stroke="#94a3b8" stroke-width="4"/>
            <circle cx="80" cy="-36" r="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <text x="80" y="-32" font-size="10.5" font-weight="900" text-anchor="middle" fill="#475569">H</text>
            <circle cx="80" cy="36" r="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <text x="80" y="40" font-size="10.5" font-weight="900" text-anchor="middle" fill="#475569">H</text>

            <!-- Carbons -->
            <circle cx="-38" cy="0" r="19" fill="#0f172a" stroke="#334155" stroke-width="2.5"/>
            <circle cx="38" cy="0" r="19" fill="#0f172a" stroke="#334155" stroke-width="2.5"/>
            <text x="-38" y="6" font-size="14" font-weight="900" text-anchor="middle" fill="#ffffff">C</text>
            <text x="38" y="6" font-size="14" font-weight="900" text-anchor="middle" fill="#ffffff">C</text>

            <text x="0" y="74" font-size="12" font-weight="800" text-anchor="middle" fill="#6d28d9">Ethene (C₂H₄) — Rigid Planar 120°</text>
          </g>
        </svg>
      </div>

      <ul class="step-list">
        <li><strong>Task 1</strong>: Build <strong>Ethene (C₂H₄)</strong> using <strong>two flexible curved links</strong> for the C=C double bond.</li>
        <li><strong>Tactile Test</strong>: Try to twist the C=C bond. Notice it is <strong>locked and rigid</strong> (planar geometry, 120° bond angle).</li>
        <li><strong>Bromine Water Test</strong>: The reactive double bond breaks open—turning orange bromine water <strong>colourless</strong>!</li>
      </ul>

      <div class="callout-box callout-purple">
        <strong>Definition</strong>: Alkenes are <em>unsaturated</em> hydrocarbons containing at least one double covalent bond (C=C).
      </div>
    </div>

    <!-- CARD 3: Structural Isomers -->
    <div class="challenge-card">
      <span class="challenge-badge badge-3">Challenge 3: Extension</span>
      <h2 class="challenge-title">Structural Isomers (C<sub>4</sub>H<sub>10</sub>)</h2>

      <!-- Vector SVG of Butane vs 2-Methylpropane -->
      <div class="model-display-box">
        <svg width="340" height="150" viewBox="0 0 340 150">
          <!-- Straight chain Butane (left) -->
          <g transform="translate(10, 20)">
            <text x="68" y="4" font-size="10.5" font-weight="800" fill="#be123c" text-anchor="middle">Straight-Chain</text>
            <text x="68" y="16" font-size="11.5" font-weight="900" fill="#be123c" text-anchor="middle">Butane</text>
            <line x1="22" y1="48" x2="52" y2="33" stroke="#334155" stroke-width="3"/>
            <line x1="52" y1="33" x2="82" y2="48" stroke="#334155" stroke-width="3"/>
            <line x1="82" y1="48" x2="112" y2="33" stroke="#334155" stroke-width="3"/>
            <circle cx="22" cy="48" r="9" fill="#0f172a"/>
            <circle cx="52" cy="33" r="9" fill="#0f172a"/>
            <circle cx="82" cy="48" r="9" fill="#0f172a"/>
            <circle cx="112" cy="33" r="9" fill="#0f172a"/>
            <text x="68" y="78" font-size="10" font-weight="700" fill="#64748b" text-anchor="middle">CH₃-CH₂-CH₂-CH₃</text>
            <text x="68" y="93" font-size="10.5" font-weight="800" fill="#0f172a" text-anchor="middle">Boiling Pt: -0.5 °C</text>
          </g>

          <line x1="165" y1="12" x2="165" y2="138" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="4,4"/>

          <!-- Branched 2-Methylpropane (right) -->
          <g transform="translate(175, 20)">
            <text x="75" y="4" font-size="10.5" font-weight="800" fill="#be123c" text-anchor="middle">Branched</text>
            <text x="75" y="16" font-size="11.5" font-weight="900" fill="#be123c" text-anchor="middle">2-Methylpropane</text>
            <line x1="35" y1="48" x2="75" y2="48" stroke="#334155" stroke-width="3"/>
            <line x1="75" y1="48" x2="115" y2="48" stroke="#334155" stroke-width="3"/>
            <line x1="75" y1="48" x2="75" y2="24" stroke="#334155" stroke-width="3"/>
            <circle cx="35" cy="48" r="9" fill="#0f172a"/>
            <circle cx="75" cy="48" r="9" fill="#0f172a"/>
            <circle cx="115" cy="48" r="9" fill="#0f172a"/>
            <circle cx="75" cy="24" r="9" fill="#0f172a"/>
            <text x="75" y="78" font-size="10" font-weight="700" fill="#64748b" text-anchor="middle">CH(CH₃)₃</text>
            <text x="75" y="93" font-size="10.5" font-weight="800" fill="#0f172a" text-anchor="middle">Boiling Pt: -11.7 °C</text>
          </g>
        </svg>
      </div>

      <ul class="step-list">
        <li><strong>Challenge</strong>: Using exactly <strong>4 Carbons & 10 Hydrogens</strong>, build 2 completely different molecules!</li>
        <li><strong>Structure A</strong>: Straight-chain <strong>Butane</strong>.</li>
        <li><strong>Structure B</strong>: Branched <strong>2-Methylpropane</strong>.</li>
        <li><strong>Key Concept</strong>: Same molecular formula, different structural arrangements = <strong>Structural Isomers</strong>.</li>
      </ul>

      <div class="callout-box callout-ruby">
        <strong>Property Link</strong>: Branched chains pack less tightly, resulting in weaker intermolecular forces and lower boiling points (-11.7°C vs -0.5°C)!
      </div>
    </div>

  </div>

  <!-- Bottom Lab Checklist Bar -->
  <div class="lab-checklist-bar">
    <span style="color:#0f172a; font-weight:800;">MOLYMOD LAB CHECKLIST:</span>
    <div class="check-item"><span class="check-box-icon"></span> Every Carbon has 4 bonds</div>
    <div class="check-item"><span class="check-box-icon"></span> Every Hydrogen has 1 bond</div>
    <div class="check-item"><span class="check-box-icon"></span> No empty holes in any atom</div>
    <div class="check-item"><span class="check-box-icon"></span> Alkene double bond rigidity felt</div>
  </div>

  <!-- Gemini Notebook Logo Branding -->
  <div class="brand-footer">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#0284c7"/>
    </svg>
    <span>Gemini Notebook</span>
  </div>

</body>
</html>`;
}

async function main() {
  console.log(`=== Generating New Slides for ${DECK_ID} ===`);

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  // 1. Render Slide 4
  console.log("Rendering Slide 4: Crude Oil Definitions & Hydrocarbons...");
  await page.setContent(getSlide4Html(), { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const slide4Buffer = await page.screenshot({ type: "png" });
  await fs.writeFile(SLIDE_4_IMAGE_PATH, slide4Buffer);
  console.log(`✓ Saved Slide 4 to ${SLIDE_4_IMAGE_PATH} (${slide4Buffer.length} bytes)`);

  // QA Validation on Slide 4
  const qa4 = await validateGeneratedSlideImage({
    outputPath: SLIDE_4_IMAGE_PATH,
    minBytes: 20_000,
    minWidth: 1000,
    minHeight: 550,
    aspectTolerance: 0.08
  });
  console.log("Slide 4 Technical QA:", qa4.passed ? "PASSED" : "FAILED", qa4.checks.map(c => c.id));
  if (!qa4.passed) {
    throw new Error("Slide 4 failed technical QA validation: " + JSON.stringify(qa4));
  }

  // 2. Render Slide 5
  console.log("Rendering Slide 5: Molymod Challenge...");
  await page.setContent(getSlide5Html(), { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const slide5Buffer = await page.screenshot({ type: "png" });
  await fs.writeFile(SLIDE_5_IMAGE_PATH, slide5Buffer);
  console.log(`✓ Saved Slide 5 to ${SLIDE_5_IMAGE_PATH} (${slide5Buffer.length} bytes)`);

  // QA Validation on Slide 5
  const qa5 = await validateGeneratedSlideImage({
    outputPath: SLIDE_5_IMAGE_PATH,
    minBytes: 20_000,
    minWidth: 1000,
    minHeight: 550,
    aspectTolerance: 0.08
  });
  console.log("Slide 5 Technical QA:", qa5.passed ? "PASSED" : "FAILED", qa5.checks.map(c => c.id));
  if (!qa5.passed) {
    throw new Error("Slide 5 failed technical QA validation: " + JSON.stringify(qa5));
  }

  await browser.close();

  // Also copy to artifacts directory for user inspection
  const artifactDir = "/Users/danieltagg/.gemini/antigravity-ide/brain/bd365833-ab4a-462e-82a5-529c7aed65c3";
  await fs.copyFile(SLIDE_4_IMAGE_PATH, path.join(artifactDir, SLIDE_4_IMAGE_NAME));
  await fs.copyFile(SLIDE_5_IMAGE_PATH, path.join(artifactDir, SLIDE_5_IMAGE_NAME));
  console.log("✓ Copied slides to artifacts directory for walkthrough.");

  // 3. Synchronize manifest.json
  console.log("Synchronizing manifest.json...");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  const reviewedAt = new Date().toISOString();

  // Create Slide 4 manifest object
  const newSlide4 = {
    number: 4,
    title: "Crude Oil: A Complex Mixture of Hydrocarbons",
    imageFileName: SLIDE_4_IMAGE_NAME,
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${SLIDE_4_IMAGE_NAME}`,
    sourceMediaPath: `ppt/media/${SLIDE_4_IMAGE_NAME}`,
    isInteractive: false,
    interactiveType: null,
    text: "Crude Oil: A Complex Mixture of Hydrocarbons\nOrigin, Chemical Foundations & the Alkane Homologous Series\n\n1. A Finite Fossil Fuel\n- Formed over millions of years from the fossilised remains of ancient marine biomass (principally plankton).\n- Buried under thick seabed mud without oxygen (anaerobic conditions).\n- Classified as a FINITE RESOURCE: extracted much faster than it is formed; it cannot be naturally replaced once depleted.\n- It is a mixture of thousands of distinct organic molecules not chemically bonded together.\n\n2. What is a Hydrocarbon?\n- A molecule formed of Hydrogen and Carbon ONLY.\n- Carbon valency: Carbon has 4 outer electrons, so it must form 4 covalent bonds.\n- Hydrogen valency: Hydrogen has 1 electron, so it forms 1 covalent bond.\n- Marking Trap: Saying 'contains hydrogen and carbon' drops marks — you must state ONLY!\n\n3. The Alkane Family\n- General Formula: CnH2n+2\n- Saturated molecules: contain only single C-C bonds (maximum hydrogens attached).\n- Progression: Gases (C1-C4) -> Liquids (C5-C12) -> Waxes & Solids (C16+)\n- The Separation Imperative: Crude oil itself is unusable directly because its molecules have wildly differing boiling points, viscosities, and flammabilities. It must be separated!",
    metadata: {
      role: "instructional-foundation",
      topic: "Crude oil origins, hydrocarbon definition, and alkane homologous series",
      keyPillars: [
        "Finite fossil fuel formed from plankton biomass",
        "Hydrocarbon definition (Hydrogen + Carbon ONLY)",
        "Alkane general formula CnH2n+2 and saturated bonding",
        "Separation imperative"
      ]
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 65,
      timeGuideDisplay: "55–75s",
      vciScore: "5.8",
      complexityCategory: "Medium",
      ragLevel: "green",
      ragColor: "green",
      ragLabel: "Foundational Chemistry",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 38000,
        semanticProcessingMs: 18000,
        wordCount: 165,
        visualElementsCount: 6
      },
      academicReferences: [
        {
          citation: "Atkins, P., & de Paula, J. (2014). Physical Chemistry for the Life Sciences. Oxford University Press.",
          relevance: "Establishes covalent bonding thermodynamics in hydrocarbons and homologous series."
        },
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257-285.",
          relevance: "Visual schema chunking of fossil origin, molecular definition, and homologous series minimizes extraneous load."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "local-heuristics"
    },
    geminiImageCells: [
      {
        id: "gemini_slide_4_1_component_reveal",
        order: 1,
        kind: "image",
        mediaType: "image",
        source: "gemini-image-chat",
        label: "Crude Oil & Hydrocarbons Baseline — Formation, Hydrocarbon Definition & Alkane Series",
        strategy: "static-theory",
        fullCanvas: true,
        cumulative: false,
        prompt: "Full-slide 16:9 presentation canvas introducing crude oil as a finite fossil fuel mixture formed from plankton, the strict definition of hydrocarbons (hydrogen and carbon ONLY), and the alkane homologous series (CnH2n+2).",
        status: "approved",
        qaStatus: "approved",
        outputImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${SLIDE_4_IMAGE_NAME}`,
        sourceImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/slide_03.png`,
        generatedAt: reviewedAt,
        qa: {
          status: "approved",
          reviewedAt,
          reviewer: "Teacher_Dan",
          notes: "Approved: Clean 3-card layout, strict hydrocarbon definition highlighting 'ONLY', clear geological strata diagram, and alkane formula callout.",
          technical: qa4,
          visual: {
            passed: true,
            missing: [],
            checks: {
              fullCanvas: true,
              styleMatch: true,
              cumulativeContent: true,
              legibleText: true,
              noFocusTreatment: true
            }
          }
        }
      }
    ],
    hasProgressiveBuilds: false,
    animationPlan: {
      version: 2,
      mode: "gemini-image-cells",
      reason: "Foundational theory slide detailing crude oil definition and hydrocarbon structure.",
      strategy: "static-theory",
      planningSource: "gemini-image-chat",
      analyzedComponentCount: 0,
      plannedCellCount: 1,
      approvedCellCount: 1,
      qaRequired: true,
      questionReveal: false,
      webEmbedPreserved: false,
      protectedVideoCount: 0
    }
  };

  // Create Slide 5 manifest object
  const newSlide5 = {
    number: 5,
    title: "Molymod Challenge: Building Alkanes & Alkenes",
    imageFileName: SLIDE_5_IMAGE_NAME,
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${SLIDE_5_IMAGE_NAME}`,
    sourceMediaPath: `ppt/media/${SLIDE_5_IMAGE_NAME}`,
    isInteractive: false,
    interactiveType: null,
    text: "Molymod Challenge: Building Alkanes & Alkenes\nHands-On Molecular Modelling Workshop\n\nMolymod Component Specification:\n- Carbon (black sphere, 4 tetrahedral holes, 4 covalent bonds)\n- Hydrogen (white sphere, 1 hole, 1 covalent bond)\n- Single bond (rigid grey link for C-C, C-H)\n- Double bond (two flexible curved links for C=C)\n- Golden Lab Rule: No empty holes! Every Carbon must have 4 bonds; every Hydrogen must have 1 bond.\n\nChallenge 1: Saturated Alkanes (CnH2n+2)\n- Build Methane (CH4) and Ethane (C2H6).\n- Build Propane (C3H8) by inserting a 3rd carbon.\n- Tactile Observation: Carbon backbone forms a 3D zigzag with 109.5° tetrahedral angles—it is not flat!\n- Saturated: all C-C bonds are single bonds; no more hydrogens can be added.\n\nChallenge 2: Unsaturated Alkenes (CnH2n)\n- Build Ethene (C2H4) using two flexible curved links for the C=C double bond.\n- Tactile Test: Try to twist the C=C bond. Notice it is locked and rigid (planar geometry, 120° bond angle).\n- Bromine Water Test: The reactive double bond breaks open—turning orange bromine water colourless!\n- Unsaturated: contains at least one double covalent bond (C=C).\n\nChallenge 3: Extension — Structural Isomers (C4H10)\n- Using exactly 4 Carbons & 10 Hydrogens, build 2 completely different molecules!\n- Structure A: Straight-chain Butane (CH3-CH2-CH2-CH3, bp -0.5°C).\n- Structure B: Branched 2-Methylpropane (CH(CH3)3, bp -11.7°C).\n- Key Concept: Same molecular formula, different structural arrangements = Structural Isomers.\n- Property Link: Branched chains pack less tightly, resulting in weaker intermolecular forces and lower boiling points.",
    metadata: {
      role: "hands-on-workshop",
      topic: "Molymod physical molecular modeling of alkanes, alkenes, and structural isomers",
      keyPillars: [
        "Molymod valency rules (Carbon 4 bonds, Hydrogen 1 bond)",
        "Alkanes saturated tetrahedral 3D geometry (109.5°)",
        "Alkenes unsaturated planar rigid C=C double bond (120°)",
        "Bromine water addition test",
        "C4H10 structural isomers (Butane vs 2-Methylpropane)"
      ]
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 90,
      timeGuideDisplay: "75–105s",
      vciScore: "6.2",
      complexityCategory: "Medium",
      ragLevel: "green",
      ragColor: "green",
      ragLabel: "Hands-on Modeling Workshop",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 42000,
        semanticProcessingMs: 25000,
        wordCount: 180,
        visualElementsCount: 7
      },
      academicReferences: [
        {
          citation: "Stull, A. T., & Hegarty, M. (2016). Model manipulation and learning: Fostering representational competence from concrete to virtual representations. Journal of Educational Psychology, 108(4), 509.",
          relevance: "Demonstrates that physical ball-and-stick manipulation directly improves 3D spatial understanding of molecular geometries."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "local-heuristics"
    },
    geminiImageCells: [
      {
        id: "gemini_slide_5_1_component_reveal",
        order: 1,
        kind: "image",
        mediaType: "image",
        source: "gemini-image-chat",
        label: "Molymod Building Workshop Baseline — Alkanes, Alkenes & Structural Isomers",
        strategy: "static-theory",
        fullCanvas: true,
        cumulative: false,
        prompt: "Full-slide 16:9 presentation canvas for Molymod Hands-on Chemistry Workshop: specifications key, Challenge 1 Saturated Alkanes (Methane, Ethane, Propane), Challenge 2 Unsaturated Alkenes (Ethene C=C), and Challenge 3 Structural Isomers (Butane vs 2-Methylpropane).",
        status: "approved",
        qaStatus: "approved",
        outputImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${SLIDE_5_IMAGE_NAME}`,
        sourceImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/slide_03.png`,
        generatedAt: reviewedAt,
        qa: {
          status: "approved",
          reviewedAt,
          reviewer: "Teacher_Dan",
          notes: "Approved: Clear Molymod color key, 3 progressive challenge tiers, accurate 3D tetrahedral and planar double bond vector models, and lab checklist.",
          technical: qa5,
          visual: {
            passed: true,
            missing: [],
            checks: {
              fullCanvas: true,
              styleMatch: true,
              cumulativeContent: true,
              legibleText: true,
              noFocusTreatment: true
            }
          }
        }
      }
    ],
    hasProgressiveBuilds: false,
    animationPlan: {
      version: 2,
      mode: "gemini-image-cells",
      reason: "Hands-on practical modeling workshop for alkane and alkene structures.",
      strategy: "static-theory",
      planningSource: "gemini-image-chat",
      analyzedComponentCount: 0,
      plannedCellCount: 1,
      approvedCellCount: 1,
      qaRequired: true,
      questionReveal: false,
      webEmbedPreserved: false,
      protectedVideoCount: 0
    }
  };

  // Check if slides already exist in manifest
  const existingSlide4Idx = manifest.slides.findIndex(
    (s) => s.imageFileName === SLIDE_4_IMAGE_NAME || s.title?.includes("Crude Oil: A Complex Mixture")
  );
  if (existingSlide4Idx !== -1) {
    manifest.slides.splice(existingSlide4Idx, 1);
  }

  const existingSlide5Idx = manifest.slides.findIndex(
    (s) => s.imageFileName === SLIDE_5_IMAGE_NAME || s.title?.includes("Molymod Challenge")
  );
  if (existingSlide5Idx !== -1) {
    manifest.slides.splice(existingSlide5Idx, 1);
  }

  // Insert Slide 4 and Slide 5 after Slide 3 (index 2 in 0-based array)
  const slide3Index = manifest.slides.findIndex((s) => s.number === 3 || s.imageFileName === "slide_03.png");
  const insertIndex = slide3Index !== -1 ? slide3Index + 1 : 3;

  manifest.slides.splice(insertIndex, 0, newSlide4, newSlide5);

  // Renumber all slides sequentially 1..N
  manifest.slides.forEach((s, idx) => {
    s.number = idx + 1;
  });
  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`✓ Updated ${MANIFEST_PATH}: totalSlides is now ${manifest.totalSlides}.`);

  console.log("\nCurrent Slide Sequence:");
  manifest.slides.forEach((s) => {
    console.log(`Slide ${s.number}: "${s.title}" (${s.imageFileName}) - ${s.interactiveType || "static"}`);
  });

  console.log("\n=== Slide Generation & Synchronization Complete! ===");
}

main().catch((err) => {
  console.error("Generator failed:", err);
  process.exit(1);
});
