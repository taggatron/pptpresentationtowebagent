import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";

const GEMINI_LOGO_BASE64 = (await fs.readFile("scratch/gemini_logo.png")).toString("base64");

async function renderSlide(htmlContent, outputPath) {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0] || await browser.newContext();
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1376, height: 768 });
  await page.setContent(htmlContent, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: outputPath });
  await page.close();
  console.log(`Rendered slide to ${outputPath}`);
}

const COMMON_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background-color: #f8f6f0;
    background-image:
      linear-gradient(to right, rgba(160, 150, 130, 0.16) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(160, 150, 130, 0.16) 1px, transparent 1px);
    background-size: 22.933px 22.933px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #111827;
    position: relative;
  }

  .outer-frame {
    position: absolute;
    top: 36px;
    left: 40px;
    right: 40px;
    bottom: 36px;
    border: 1.5px solid #232b38;
    border-radius: 12px;
    background: rgba(253, 252, 249, 0.72);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    padding: 34px 44px;
    overflow: hidden;
  }

  .watermark {
    position: absolute;
    bottom: 12px;
    right: 42px;
    height: 20px;
    opacity: 0.85;
    pointer-events: none;
    z-index: 100;
  }

  .slide-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 22px;
  }

  .slide-title {
    font-family: 'Outfit', 'Inter', sans-serif;
    font-size: 38px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.5px;
  }

  .slide-subtitle {
    font-size: 19px;
    color: #475569;
    margin-top: 6px;
    font-weight: 400;
  }

  .pill-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
  }

  .pill-amber {
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.4);
    color: #b45309;
  }

  .pill-cyan {
    background: rgba(14, 165, 233, 0.12);
    border: 1px solid rgba(14, 165, 233, 0.4);
    color: #0369a1;
  }
`;

// Slide 1: What is electricity? (Ultra-clean, high-impact prompt)
const SLIDE_1_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${COMMON_CSS}
    
    .question-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .main-question-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 18px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
      padding: 60px 80px;
      text-align: center;
      max-width: 950px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .big-question {
      font-family: 'Outfit', 'Inter', sans-serif;
      font-size: 68px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -1.5px;
      line-height: 1.15;
      margin-bottom: 28px;
    }

    .circuit-graphic-wire {
      width: 100%;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
    }

    .prompts-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px 36px;
      display: flex;
      gap: 48px;
    }

    .prompt-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 17px;
      color: #334155;
      font-weight: 500;
    }

    .prompt-bullet {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #0ea5e9;
      box-shadow: 0 0 10px rgba(14, 165, 233, 0.6);
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="outer-frame">
    <div class="question-container">
      <div class="main-question-card">
        <div class="pill-badge pill-cyan">
          <span>⚡ Discussion Hook • Key Concept</span>
        </div>
        
        <h1 class="big-question">What is electricity?</h1>
        
        <div class="circuit-graphic-wire">
          <svg width="680" height="50" viewBox="0 0 680 50">
            <!-- Left wire -->
            <path d="M 10 25 L 290 25" stroke="#334155" stroke-width="4.5" stroke-linecap="round" />
            <!-- Flowing electron dots -->
            <circle cx="80" cy="25" r="8" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <text x="80" y="28" fill="#0f172a" font-size="10" font-weight="900" text-anchor="middle">-</text>
            <circle cx="170" cy="25" r="8" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <text x="170" y="28" fill="#0f172a" font-size="10" font-weight="900" text-anchor="middle">-</text>
            <circle cx="250" cy="25" r="8" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <text x="250" y="28" fill="#0f172a" font-size="10" font-weight="900" text-anchor="middle">-</text>
            
            <!-- Central glowing spark node -->
            <circle cx="340" cy="25" r="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="3" filter="drop-shadow(0 0 12px #fbbf24)" />
            <path d="M 331 25 L 337 15 L 344 15 L 339 23 L 349 23 L 335 37 L 338 27 L 331 27 Z" fill="#d97706" />
            
            <!-- Right wire -->
            <path d="M 390 25 L 670 25" stroke="#334155" stroke-width="4.5" stroke-linecap="round" />
            <circle cx="430" cy="25" r="8" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <text x="430" y="28" fill="#0f172a" font-size="10" font-weight="900" text-anchor="middle">-</text>
            <circle cx="510" cy="25" r="8" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <text x="510" y="28" fill="#0f172a" font-size="10" font-weight="900" text-anchor="middle">-</text>
            <circle cx="600" cy="25" r="8" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <text x="600" y="28" fill="#0f172a" font-size="10" font-weight="900" text-anchor="middle">-</text>
          </svg>
        </div>

        <div class="prompts-card">
          <div class="prompt-item">
            <div class="prompt-bullet"></div>
            <span>What subatomic particle is physically moving?</span>
          </div>
          <div class="prompt-item">
            <div class="prompt-bullet" style="background:#f59e0b; box-shadow: 0 0 10px rgba(245, 158, 11, 0.6);"></div>
            <span>How does this differ from static electricity?</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <img class="watermark" src="data:image/png;base64,${GEMINI_LOGO_BASE64}" alt="Gemini Notebook" />
</body>
</html>
`;

// Slide 2: Definition - Flow of electrons
const SLIDE_2_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${COMMON_CSS}

    .content-grid {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .hero-definition-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 16px;
      padding: 24px 38px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .hero-primary {
      font-family: 'Outfit', 'Inter', sans-serif;
      font-size: 35px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.25;
    }

    .hero-primary span.highlight {
      color: #0284c7;
      border-bottom: 3.5px solid #38bdf8;
      padding-bottom: 2px;
    }

    .hero-secondary {
      font-size: 20px;
      color: #475569;
      margin-top: 10px;
      max-width: 900px;
      line-height: 1.45;
    }

    .lower-row {
      flex: 1;
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 22px;
    }

    .diagram-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 14px;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
    }

    .three-takeaways {
      display: flex;
      flex-direction: column;
      gap: 12px;
      justify-content: space-between;
    }

    .takeaway-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 16px 22px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    .takeaway-title {
      font-size: 16.5px;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .takeaway-text {
      font-size: 14.5px;
      color: #475569;
      line-height: 1.42;
    }
  </style>
</head>
<body>
  <div class="outer-frame">
    <div class="slide-header" style="margin-bottom: 18px;">
      <h1 class="slide-title">Defining Electricity</h1>
    </div>

    <div class="content-grid">
      <!-- Top Hero Definition Card -->
      <div class="hero-definition-card">
        <h2 class="hero-primary">
          Electricity is the <span class="highlight">flow of electrical charge</span>.
        </h2>
        <p class="hero-secondary">
          In metal wires and circuits, this electrical charge is carried by <strong>delocalised electrons</strong> drifting continuously through the conductor.
        </p>
      </div>

      <!-- Lower Split View -->
      <div class="lower-row">
        <!-- Visual Cutaway Diagram -->
        <div class="diagram-card">
          <div style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;">
            Microscopic View Inside a Metal Conductor
          </div>
          <svg width="560" height="230" viewBox="0 0 560 230">
            <!-- Wire Boundary -->
            <rect x="20" y="30" width="520" height="155" rx="14" fill="#f8fafc" stroke="#334155" stroke-width="3" />
            
            <!-- Positive copper lattice ions -->
            <!-- Row 1 -->
            <circle cx="80" cy="72" r="22" fill="#1e293b" />
            <text x="80" y="79" fill="#ffffff" font-size="22" font-weight="bold" text-anchor="middle">+</text>
            <circle cx="190" cy="72" r="22" fill="#1e293b" />
            <text x="190" y="79" fill="#ffffff" font-size="22" font-weight="bold" text-anchor="middle">+</text>
            <circle cx="300" cy="72" r="22" fill="#1e293b" />
            <text x="300" y="79" fill="#ffffff" font-size="22" font-weight="bold" text-anchor="middle">+</text>
            <circle cx="410" cy="72" r="22" fill="#1e293b" />
            <text x="410" y="79" fill="#ffffff" font-size="22" font-weight="bold" text-anchor="middle">+</text>

            <!-- Row 2 -->
            <circle cx="135" cy="142" r="22" fill="#1e293b" />
            <text x="135" y="149" fill="#ffffff" font-size="22" font-weight="bold" text-anchor="middle">+</text>
            <circle cx="245" cy="142" r="22" fill="#1e293b" />
            <text x="245" y="149" fill="#ffffff" font-size="22" font-weight="bold" text-anchor="middle">+</text>
            <circle cx="355" cy="142" r="22" fill="#1e293b" />
            <text x="355" y="149" fill="#ffffff" font-size="22" font-weight="bold" text-anchor="middle">+</text>
            <circle cx="465" cy="142" r="22" fill="#1e293b" />
            <text x="465" y="149" fill="#ffffff" font-size="22" font-weight="bold" text-anchor="middle">+</text>

            <!-- Drifting Delocalised Electrons with Direction Arrows -->
            <g transform="translate(60, 128)">
              <circle cx="0" cy="0" r="10" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
              <text x="0" y="4" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">-</text>
              <path d="M 12 0 L 28 0 M 23 -4 L 28 0 L 23 4" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
            </g>
            <g transform="translate(130, 77)">
              <circle cx="0" cy="0" r="10" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
              <text x="0" y="4" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">-</text>
              <path d="M 12 0 L 28 0 M 23 -4 L 28 0 L 23 4" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
            </g>
            <g transform="translate(235, 77)">
              <circle cx="0" cy="0" r="10" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
              <text x="0" y="4" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">-</text>
              <path d="M 12 0 L 28 0 M 23 -4 L 28 0 L 23 4" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
            </g>
            <g transform="translate(190, 132)">
              <circle cx="0" cy="0" r="10" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
              <text x="0" y="4" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">-</text>
              <path d="M 12 0 L 28 0 M 23 -4 L 28 0 L 23 4" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
            </g>
            <g transform="translate(310, 132)">
              <circle cx="0" cy="0" r="10" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
              <text x="0" y="4" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">-</text>
              <path d="M 12 0 L 28 0 M 23 -4 L 28 0 L 23 4" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
            </g>
            <g transform="translate(360, 77)">
              <circle cx="0" cy="0" r="10" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
              <text x="0" y="4" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">-</text>
              <path d="M 12 0 L 28 0 M 23 -4 L 28 0 L 23 4" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
            </g>
            <g transform="translate(470, 77)">
              <circle cx="0" cy="0" r="10" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
              <text x="0" y="4" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">-</text>
              <path d="M 12 0 L 28 0 M 23 -4 L 28 0 L 23 4" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
            </g>

            <!-- Drift Banner at bottom -->
            <rect x="130" y="195" width="300" height="28" rx="6" fill="#0284c7" />
            <text x="280" y="214" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">Direction of Electron Flow (Drift) →</text>
          </svg>
        </div>

        <!-- 3 Side Takeaway Cards -->
        <div class="three-takeaways">
          <div class="takeaway-card">
            <div class="takeaway-title">
              <span style="color:#0284c7;">●</span> The Charge Carrier
            </div>
            <div class="takeaway-text">
              Electrons carry a tiny negative charge. Because they are not bound to individual atoms, they move freely.
            </div>
          </div>

          <div class="takeaway-card">
            <div class="takeaway-title">
              <span style="color:#0284c7;">●</span> Conductors vs Insulators
            </div>
            <div class="takeaway-text">
              Metals have a 'sea' of delocalised electrons that conduct easily. Insulators hold electrons tightly.
            </div>
          </div>

          <div class="takeaway-card">
            <div class="takeaway-title">
              <span style="color:#f59e0b;">●</span> Electric Current (I)
            </div>
            <div class="takeaway-text">
              Current is defined as the <strong>rate of flow of charge</strong> — how many coulombs of electrons pass per second (Amperes).
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <img class="watermark" src="data:image/png;base64,${GEMINI_LOGO_BASE64}" alt="Gemini Notebook" />
</body>
</html>
`;

// Slide 3: Battery Operation - From Static to Flowing (Redesigned with prominent, beautiful vector battery)
const SLIDE_3_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${COMMON_CSS}

    .layout-row {
      flex: 1;
      display: grid;
      grid-template-columns: 1.42fr 1fr;
      gap: 24px;
      align-items: stretch;
    }

    .diagram-panel {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 14px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
      position: relative;
    }

    .cards-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      justify-content: space-between;
    }

    .expl-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 18px 22px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    .expl-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
    }

    .badge-blue { background: #e0f2fe; color: #0369a1; }
    .badge-amber { background: #fef3c7; color: #b45309; }
    .badge-emerald { background: #d1fae5; color: #047857; }

    .expl-title {
      font-size: 16.5px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .expl-body {
      font-size: 14.5px;
      color: #475569;
      line-height: 1.45;
    }
  </style>
</head>
<body>
  <div class="outer-frame">
    <div class="slide-header" style="margin-bottom: 14px;">
      <h1 class="slide-title">From Static to Flowing: How a Battery Works</h1>
      <p class="slide-subtitle">Using chemical charge separation to drive a continuous loop of moving electrons</p>
    </div>

    <div class="layout-row">
      <!-- Battery Schematic Diagram -->
      <div class="diagram-panel">
        <svg width="620" height="460" viewBox="0 0 620 460">
          <defs>
            <linearGradient id="batteryNegativeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            <linearGradient id="batteryPositiveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#f1f5f9" />
              <stop offset="100%" stop-color="#ffffff" />
            </linearGradient>
          </defs>

          <!-- EXTERNAL CIRCUIT WIRE LOOP -->
          <!-- Top Wire: from negative terminal cap around to positive -->
          <path d="M 80 200 L 80 45 L 540 45 L 540 200" fill="none" stroke="#334155" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Bottom Wire loop -->
          <path d="M 80 260 L 80 405 L 540 405 L 540 260" fill="none" stroke="#334155" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Flow Direction Arrows along Circuit Wire Loop -->
          <!-- Top Wire (flowing away from negative cap) -->
          <path d="M 80 120 L 80 100 M 75 106 L 80 97 L 85 106" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 300 45 L 325 45 M 319 40 L 327 45 L 319 50" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 540 100 L 540 120 M 535 114 L 540 123 L 545 114" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Bottom Wire (flowing from negative side towards positive side) -->
          <path d="M 80 340 L 80 360 M 75 354 L 80 363 L 85 354" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 300 405 L 325 405 M 319 400 L 327 405 L 319 410" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 540 340 L 540 320 M 535 326 L 540 317 L 545 326" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Drifting Electrons along Circuit Wire -->
          <!-- Top Wire Electrons -->
          <g transform="translate(190, 45)">
            <circle cx="0" cy="0" r="9" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <text x="0" y="3.5" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">-</text>
          </g>
          <g transform="translate(430, 45)">
            <circle cx="0" cy="0" r="9" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <text x="0" y="3.5" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">-</text>
          </g>
          <!-- Bottom Wire Electrons -->
          <g transform="translate(190, 405)">
            <circle cx="0" cy="0" r="9" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <text x="0" y="3.5" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">-</text>
          </g>
          <g transform="translate(430, 405)">
            <circle cx="0" cy="0" r="9" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <text x="0" y="3.5" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">-</text>
          </g>

          <!-- BATTERY CUTAWAY BODY -->
          <!-- Main Battery Container -->
          <rect x="110" y="150" width="400" height="155" rx="10" fill="#ffffff" stroke="#0f172a" stroke-width="4" filter="drop-shadow(0 8px 20px rgba(0,0,0,0.12))" />

          <!-- Left Anode (Negative Terminal: Dark chamber) -->
          <rect x="110" y="150" width="160" height="155" fill="url(#batteryNegativeGrad)" />
          <!-- Battery Cap (-) on left -->
          <rect x="92" y="190" width="18" height="75" rx="4" fill="#334155" stroke="#0f172a" stroke-width="3" />
          <text x="145" y="185" fill="#38bdf8" font-size="24" font-weight="900" text-anchor="middle">−</text>

          <!-- Right Cathode (Positive Terminal: Light chamber) -->
          <rect x="270" y="150" width="240" height="155" fill="url(#batteryPositiveGrad)" />
          <text x="475" y="185" fill="#64748b" font-size="24" font-weight="900" text-anchor="middle">+</text>

          <!-- Electrolyte Barrier / Porous Separator -->
          <line x1="270" y1="150" x2="270" y2="305" stroke="#0f172a" stroke-width="2.5" stroke-dasharray="6 6" />

          <!-- CLUSTERED ELECTRONS IN NEGATIVE TERMINAL (Crowded Excess) -->
          <circle cx="150" cy="210" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="175" cy="195" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="160" cy="240" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="195" cy="225" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="225" cy="205" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="185" cy="265" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="230" cy="250" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="215" cy="180" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="140" cy="270" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="245" cy="280" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="248" cy="225" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <circle cx="145" cy="175" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />

          <!-- SPARSE ELECTRONS IN POSITIVE TERMINAL (Electron Deficit) -->
          <circle cx="340" cy="210" r="7" fill="#bfdbfe" stroke="#3b82f6" stroke-width="1.5" />
          <circle cx="430" cy="250" r="7" fill="#bfdbfe" stroke="#3b82f6" stroke-width="1.5" />
          <circle cx="390" cy="185" r="7" fill="#bfdbfe" stroke="#3b82f6" stroke-width="1.5" />

          <!-- Terminal Labels Above Battery -->
          <text x="190" y="132" fill="#0f172a" font-size="14" font-weight="800" text-anchor="middle">Excess Electrons (−)</text>
          <text x="390" y="132" fill="#0f172a" font-size="14" font-weight="800" text-anchor="middle">Deficit of Electrons (+)</text>

          <!-- POTENTIAL DIFFERENCE CALLOUT (Below Battery, clearly separated) -->
          <g transform="translate(0, 315)">
            <!-- Golden Double-Arrow Bar -->
            <path d="M 115 10 L 505 10" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" />
            <!-- Left Arrowhead -->
            <polygon points="115,10 128,5 128,15" fill="#f59e0b" />
            <!-- Right Arrowhead -->
            <polygon points="505,10 492,5 492,15" fill="#f59e0b" />
            
            <!-- Central Badge -->
            <rect x="135" y="24" width="350" height="28" rx="14" fill="#0f172a" stroke="#fbbf24" stroke-width="1.5" />
            <text x="310" y="42" fill="#ffffff" font-size="11.5" font-weight="800" text-anchor="middle" letter-spacing="0.6px">
              ELECTRICAL POTENTIAL DIFFERENCE (VOLTAGE)
            </text>
            
            <!-- Subtitle -->
            <text x="310" y="68" fill="#b45309" font-size="12" font-weight="700" text-anchor="middle">
              Difference in electron concentration & electrical potential energy
            </text>
          </g>
        </svg>
      </div>

      <!-- Explanatory Structured Cards -->
      <div class="cards-panel">
        <!-- Step 1 -->
        <div class="expl-card">
          <div class="expl-badge badge-blue">1. Chemical Charge Separation</div>
          <div class="expl-title">Separating Charge via Chemistry</div>
          <div class="expl-body">
            A battery uses chemical reactions to pull electrons away from the positive terminal and pack them onto the negative terminal — just like charge separation in static electricity, but maintained continuously!
          </div>
        </div>

        <!-- Step 2 -->
        <div class="expl-card">
          <div class="expl-badge badge-amber">2. The Conducting Loop</div>
          <div class="expl-title">Providing an Escape Route</div>
          <div class="expl-body">
            Adding a closed circuit wire provides a pathway for crowded electrons to escape the high-density negative terminal and flow back around to the area of fewer electrons.
          </div>
        </div>

        <!-- Step 3 -->
        <div class="expl-card">
          <div class="expl-badge badge-emerald">3. Electron Repulsion</div>
          <div class="expl-title">The Microscopic 'Push'</div>
          <div class="expl-body">
            Because like charges repel, each electron pushes the neighboring electron along the wire through electrostatic repulsion. This creates an immediate, steady electric current throughout the entire loop.
          </div>
        </div>
      </div>
    </div>
  </div>
  <img class="watermark" src="data:image/png;base64,${GEMINI_LOGO_BASE64}" alt="Gemini Notebook" />
</body>
</html>
`;

console.log("Generating Slide 1: What is electricity?...");
await renderSlide(SLIDE_1_HTML, "scratch/new_slide_03_what_is_electricity.png");

console.log("Generating Slide 2: Definition...");
await renderSlide(SLIDE_2_HTML, "scratch/new_slide_04_definition.png");

console.log("Generating Slide 3: Battery Operation...");
await renderSlide(SLIDE_3_HTML, "scratch/new_slide_05_battery_flow.png");

console.log("All 3 slides rendered successfully!");
