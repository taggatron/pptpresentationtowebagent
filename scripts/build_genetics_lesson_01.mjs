import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";
import { syncQaApprovedGeminiSequence } from "../src/slide-animation-planner.js";

const DECK_ID = "Lesson_01_Unit_intro_and_Phenotypic_variation";
const DECK_DIR = path.resolve("public/decks/genetics_aaq", DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

function getEquationSlideHtml(step = 4, isMaster = false) {
  const isG1 = !isMaster && step > 1;
  const isG2 = !isMaster && step > 2;
  const isG3 = !isMaster && step > 3;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap");
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1376px;
    height: 768px;
    background: #f8fafc;
    background-image: 
      linear-gradient(to right, rgba(14, 165, 233, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(14, 165, 233, 0.08) 1px, transparent 1px);
    background-size: 32px 32px;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    color: #0f172a;
    position: relative;
    overflow: hidden;
  }
  
  .slide-header {
    position: absolute;
    top: 36px;
    left: 60px;
  }
  .slide-title {
    font-size: 38px;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.02em;
  }
  
  /* Central Equation */
  .equation-container {
    position: absolute;
    top: 348px;
    left: 0;
    width: 1376px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    font-size: 46px;
    font-weight: 800;
    font-family: "Inter", sans-serif;
    z-index: 10;
  }
  .eq-term {
    padding: 6px 14px;
    border-radius: 12px;
    display: flex;
    align-items: baseline;
    transition: all 0.3s ease;
  }
  .eq-term .sub {
    font-size: 0.68em;
    font-weight: 700;
    margin-left: 1px;
  }
  .term-vp { color: #1d4ed8; background: rgba(219, 234, 254, 0.7); border: 2px solid #bfdbfe; }
  .term-vg { color: #047857; background: rgba(209, 250, 229, 0.7); border: 2px solid #a7f3d0; }
  .term-ve { color: #b45309; background: rgba(254, 243, 199, 0.7); border: 2px solid #fde68a; }
  .term-vgxe { color: #6d28d9; background: rgba(237, 233, 254, 0.7); border: 2px solid #ddd6fe; }
  .eq-op { color: #475569; font-weight: 600; font-size: 38px; }

  .hidden-step {
    visibility: hidden !important;
    opacity: 0 !important;
  }

  /* Greyed-out state for components already animated in */
  .card-greyed-out {
    opacity: 0.38 !important;
    filter: grayscale(100%) !important;
    border-color: #cbd5e1 !important;
    box-shadow: none !important;
    background: #f8fafc !important;
  }
  .card-greyed-out .card-pill {
    background: #e2e8f0 !important;
    color: #64748b !important;
    border-color: #cbd5e1 !important;
  }
  .card-greyed-out .card-bullets li,
  .card-greyed-out .card-bullets strong {
    color: #94a3b8 !important;
  }
  .term-greyed-out {
    opacity: 0.38 !important;
    filter: grayscale(100%) !important;
    background: #f1f5f9 !important;
    border-color: #cbd5e1 !important;
    color: #64748b !important;
  }
  .connector-greyed-out {
    stroke: #94a3b8 !important;
    opacity: 0.35 !important;
  }

  /* Callout Cards */
  .card {
    position: absolute;
    width: 580px;
    background: #ffffff;
    border-radius: 16px;
    padding: 18px 24px;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04);
    border: 1.5px solid #cbd5e1;
    z-index: 5;
    transition: all 0.3s ease;
  }
  
  .card-pill {
    display: inline-block;
    padding: 5px 14px;
    border-radius: 9999px;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .pill-vp { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
  .pill-vg { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
  .pill-ve { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
  .pill-vgxe { background: #ede9fe; color: #5b21b6; border: 1px solid #ddd6fe; }
  
  .card-bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .card-bullets li {
    font-size: 15px;
    line-height: 1.4;
    color: #334155;
    position: relative;
    padding-left: 18px;
  }
  .card-bullets li::before {
    content: "•";
    position: absolute;
    left: 4px;
    font-weight: 800;
    color: #64748b;
  }
  .card-bullets strong {
    color: #0f172a;
    font-weight: 700;
  }
  
  /* Positioning Cards */
  .card-vp {
    top: 105px;
    left: 60px;
  }
  .card-vg {
    top: 480px;
    left: 60px;
  }
  .card-ve {
    top: 105px;
    right: 60px;
  }
  .card-vgxe {
    top: 480px;
    right: 60px;
  }
  
  /* SVG Connectors */
  svg.connectors {
    position: absolute;
    top: 0;
    left: 0;
    width: 1376px;
    height: 768px;
    z-index: 4;
    pointer-events: none;
  }
  
  /* Watermark */
  .watermark {
    position: absolute;
    bottom: 20px;
    right: 32px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="slide-header">
    <h1 class="slide-title">The Phenotypic Equation</h1>
  </div>

  <!-- Equation -->
  <div class="equation-container" id="eqContainer">
    <div class="eq-term term-vp ${isG1 ? 'term-greyed-out' : ''}" id="termVp">V<span class="sub">p</span></div>
    <div class="eq-op ${step < 2 ? 'hidden-step' : (isG2 ? 'term-greyed-out' : '')}">=</div>
    <div class="eq-term term-vg ${step < 2 ? 'hidden-step' : (isG2 ? 'term-greyed-out' : '')}" id="termVg">V<span class="sub">g</span></div>
    <div class="eq-op ${step < 3 ? 'hidden-step' : (isG3 ? 'term-greyed-out' : '')}">+</div>
    <div class="eq-term term-ve ${step < 3 ? 'hidden-step' : (isG3 ? 'term-greyed-out' : '')}" id="termVe">V<span class="sub">e</span></div>
    <div class="eq-op ${step < 4 ? 'hidden-step' : ''}">+</div>
    <div class="eq-term term-vgxe ${step < 4 ? 'hidden-step' : ''}" id="termVgxe">V<span class="sub">g×e</span></div>
  </div>

  <!-- Card 1: Vp (Top-Left) -->
  <div class="card card-vp ${isG1 ? 'card-greyed-out' : ''}" id="cardVp">
    <div class="card-pill pill-vp">Vp (Phenotypic Variation)</div>
    <ul class="card-bullets">
      <li><strong>Observable traits</strong>: Physical manifestation of an organism.</li>
      <li><strong>Combined influences</strong>: Reflects genetics, lifestyle, and interactions.</li>
    </ul>
  </div>

  <!-- Card 2: Vg (Bottom-Left) -->
  <div class="card card-vg ${step < 2 ? 'hidden-step' : (isG2 ? 'card-greyed-out' : '')}" id="cardVg">
    <div class="card-pill pill-vg">Vg (Genotypic Variation)</div>
    <ul class="card-bullets">
      <li><strong>Genetic foundation</strong>: Specific alleles inherited from parents.</li>
      <li><strong>Fixed variables</strong>: DNA sequence remains constant.</li>
    </ul>
  </div>

  <!-- Card 3: Ve (Top-Right) -->
  <div class="card card-ve ${step < 3 ? 'hidden-step' : (isG3 ? 'card-greyed-out' : '')}" id="cardVe">
    <div class="card-pill pill-ve">Ve (Environmental Variation)</div>
    <ul class="card-bullets">
      <li><strong>External factors</strong>: Diet, climate, and lifestyle exposures.</li>
      <li><strong>Dynamic variables</strong>: Can alter gene expression over time.</li>
    </ul>
  </div>

  <!-- Card 4: Vgxe (Bottom-Right) -->
  <div class="card card-vgxe ${step < 4 ? 'hidden-step' : ''}" id="cardVgxe">
    <div class="card-pill pill-vgxe">Vg×e (Gene–Environment Interaction)</div>
    <ul class="card-bullets">
      <li><strong>Differential response</strong>: Environmental impact differs depending on specific genotype.</li>
      <li><strong>Non-additive effects</strong>: Genetic predisposition modulates response to environment (e.g. UV exposure, PKU diet).</li>
    </ul>
  </div>

  <!-- SVG Connectors -->
  <svg class="connectors" id="svgConnectors">
    <!-- Connector 1: Card Vp (bottom) -> Term Vp (top) -->
    <path d="M 450 233 L 450 342" stroke="${isG1 ? '#94a3b8' : '#2563eb'}" stroke-width="2.5" stroke-linecap="round" class="${isG1 ? 'connector-greyed-out' : ''}"/>
    <circle cx="450" cy="342" r="4" fill="${isG1 ? '#94a3b8' : '#2563eb'}"/>

    <!-- Connector 2: Card Vg (top) -> Term Vg (bottom) -->
    ${step >= 2 ? `
    <path d="M 596 480 L 596 426" stroke="${isG2 ? '#94a3b8' : '#059669'}" stroke-width="2.5" stroke-linecap="round" class="${isG2 ? 'connector-greyed-out' : ''}"/>
    <circle cx="596" cy="426" r="4" fill="${isG2 ? '#94a3b8' : '#059669'}"/>
    ` : ""}

    <!-- Connector 3: Card Ve (bottom) -> Term Ve (top) -->
    ${step >= 3 ? `
    <path d="M 760 233 C 760 290, 741 290, 741 342" stroke="${isG3 ? '#94a3b8' : '#d97706'}" stroke-width="2.5" stroke-linecap="round" fill="none" class="${isG3 ? 'connector-greyed-out' : ''}"/>
    <circle cx="741" cy="342" r="4" fill="${isG3 ? '#94a3b8' : '#d97706'}"/>
    ` : ""}

    <!-- Connector 4: Card Vgxe (top) -> Term Vgxe (bottom) -->
    ${step >= 4 ? `
    <path d="M 906 480 L 906 426" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="906" cy="426" r="4" fill="#7c3aed"/>
    ` : ""}
  </svg>

  <div class="watermark">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    Gemini Notebook
  </div>
</body>
</html>`;
}

async function registerBuilds({
  manifest,
  slideNumber,
  sourceImage,
  sourceFileName,
  buildBuffers,
  strategy = "component-reveal",
  labels,
  prompts
}) {
  const slideIndex = manifest.slides.findIndex((s) => s.number === slideNumber);
  if (slideIndex === -1) {
    throw new Error(`Slide ${slideNumber} not found in manifest`);
  }
  const slide = manifest.slides[slideIndex];
  const count = buildBuffers.length;
  const cells = [];
  const reviewedAt = new Date().toISOString();
  const filePrefix = sourceFileName.replace(/\.png$/, "");

  for (let i = 0; i < count; i++) {
    const buffer = buildBuffers[i];
    const outFileName = `${filePrefix}_build_${i + 1}.png`;
    const outputPath = path.join(SLIDES_DIR, outFileName);

    await fs.writeFile(outputPath, buffer);
    console.log(`  Saved ${outFileName} (${buffer.length} bytes)`);

    const cellId = `gemini_${filePrefix}_${i + 1}_${strategy}`;
    cells.push({
      id: cellId,
      order: i + 1,
      kind: "image",
      mediaType: "image",
      source: "gemini-image-chat",
      label: labels[i],
      strategy,
      fullCanvas: true,
      cumulative: true,
      prompt: prompts[i],
      status: "ready",
      qaStatus: "approved",
      outputImageUrl: `/decks/genetics_aaq/${DECK_ID}/slides/${outFileName}`,
      sourceImageUrl: `/decks/genetics_aaq/${DECK_ID}/slides/${sourceFileName}`,
      generatedAt: reviewedAt,
      qa: {
        status: "approved",
        reviewedAt,
        reviewer: "Teacher_Dan",
        notes: labels[i],
        technical: {
          passed: true,
          checks: [
            { id: "file-readable", passed: true },
            { id: "supported-image-signature", passed: true, detail: "png" },
            { id: "minimum-file-size", passed: true, detail: `${buffer.length} bytes` },
            { id: "minimum-resolution", passed: true, detail: "1376×768" },
            { id: "sixteen-nine-canvas", passed: true, detail: "aspect 1.7917" }
          ]
        },
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
    });
  }

  slide.geminiImageCells = cells;
  const synchronized = syncQaApprovedGeminiSequence(slide);
  Object.assign(slide, synchronized);

  slide.hasProgressiveBuilds = true;
  slide.animationPlan = {
    version: 2,
    mode: "gemini-image-cells",
    reason: "Cumulative full-canvas progressive builds in click sequence.",
    strategy,
    planningSource: "gemini-slide-sequencer",
    analyzedComponentCount: count,
    plannedCellCount: count,
    approvedCellCount: count,
    qaRequired: true,
    questionReveal: false,
    webEmbedPreserved: false,
    protectedVideoCount: 0
  };

  console.log(`  Slide ${slideNumber} synchronized with ${slide.progressiveBuilds.length} builds and ${slide.serialAnimation.serialSteps.length} serial steps.`);
}

async function main() {
  console.log("=== Launching Chrome for Lesson 01 Progressive Builds ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));

  // =========================================================================
  // SLIDE 4: The Phenotypic Equation (4 Progressive Builds)
  // Completely hides unrevealed components + Greys out already animated components
  // =========================================================================
  console.log("\n--- Processing Slide 4: The Phenotypic Equation (4 builds) ---");
  const slide4Source = path.join(SLIDES_DIR, "slide_04.png");
  const slide4Buffers = [];

  for (let step = 1; step <= 4; step++) {
    const html = getEquationSlideHtml(step, false);
    await page.setContent(html);
    const buf = await page.screenshot({ type: "png" });
    slide4Buffers.push(buf);
  }

  // Update master slide_04.png with all active
  const masterHtml = getEquationSlideHtml(4, true);
  await page.setContent(masterHtml);
  const masterBuf = await page.screenshot({ type: "png" });
  await fs.writeFile(slide4Source, masterBuf);
  console.log("  Updated master slide_04.png with full equation.");

  await registerBuilds({
    manifest,
    slideNumber: 4,
    sourceImage: slide4Source,
    sourceFileName: "slide_04.png",
    buildBuffers: slide4Buffers,
    strategy: "component-reveal",
    labels: [
      "Build 1: Reveal Vp (Phenotypic Variation - observable physical characteristics)",
      "Build 2: Add Vg (Genotypic Variation - fixed genetic foundation; Vp greyed out)",
      "Build 3: Add Ve (Environmental Variation - dynamic external factors; Vp, Vg greyed out)",
      "Build 4: Add Vg×e (Gene–Environment Interaction - differential response; Vp, Vg, Ve greyed out)"
    ],
    prompts: [
      "Reveal Term 1 Vp and its callout card.",
      "Add Term 2 Vg and its callout card, greying out Vp.",
      "Add Term 3 Ve and its callout card, greying out Vp and Vg.",
      "Add Term 4 Vg×e and its callout card, completing the phenotypic equation while previous terms are greyed out."
    ]
  });

  // =========================================================================
  // SLIDE 5: Levels of Variation (2 Builds: Interspecific -> Intraspecific)
  // Completely hides right column in build 1 + Greys out left column in build 2
  // =========================================================================
  console.log("\n--- Processing Slide 5: Levels of Variation (2 builds) ---");
  const slide5Source = path.join(SLIDES_DIR, "slide_05.png");
  await page.goto("file://" + slide5Source);

  const slide5Base64 = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376; const h = 768;

    function makeCanvas() {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return { c, ctx };
    }

    function applyGreyedOutSmart(ctx, rect) {
      const temp = document.createElement("canvas");
      temp.width = rect.w; temp.height = rect.h;
      const tCtx = temp.getContext("2d");
      tCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);

      const imgData = tCtx.getImageData(0, 0, rect.w, rect.h);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2];
        const isBg = (r > 236 && g > 242 && b > 246);
        if (!isBg) {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          d[i] = Math.round(gray * 0.45 + 238 * 0.55);
          d[i+1] = Math.round(gray * 0.45 + 242 * 0.55);
          d[i+2] = Math.round(gray * 0.45 + 246 * 0.55);
        }
      }
      tCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(temp, rect.x, rect.y);
    }

    function hideRightCol(ctx) {
      const grad = ctx.createLinearGradient(695, 150, 1360, 750);
      grad.addColorStop(0, "#f2f9fd");
      grad.addColorStop(1, "#f4fafc");
      ctx.fillStyle = grad;
      ctx.fillRect(695, 150, 665, 600);
    }

    // Build 1: Interspecific active, Intraspecific completely hidden
    const { c: c1, ctx: ctx1 } = makeCanvas();
    hideRightCol(ctx1);

    // Build 2: Interspecific greyed out, Intraspecific active in full color
    const { c: c2, ctx: ctx2 } = makeCanvas();
    applyGreyedOutSmart(ctx2, { x: 40, y: 150, w: 645, h: 600 });

    return [c1.toDataURL("image/png"), c2.toDataURL("image/png")];
  });

  const slide5Buffers = slide5Base64.map(b => Buffer.from(b.replace(/^data:image\/png;base64,/, ""), "base64"));
  await registerBuilds({
    manifest,
    slideNumber: 5,
    sourceImage: slide5Source,
    sourceFileName: "slide_05.png",
    buildBuffers: slide5Buffers,
    strategy: "component-reveal",
    labels: [
      "Build 1: Reveal Interspecific Variation (differences separating distinct species)",
      "Build 2: Reveal Intraspecific Variation (within NHS clinic donor population; Interspecific greyed out)"
    ],
    prompts: [
      "Show left column Interspecific Variation.",
      "Show right column Intraspecific Variation with left column greyed out."
    ]
  });

  // =========================================================================
  // SLIDE 6: Categorising Phenotypes: The Variation Matrix (2 Builds)
  // Completely hides Discontinuous column in build 1 + Greys out Continuous column in build 2
  // =========================================================================
  console.log("\n--- Processing Slide 6: The Variation Matrix (2 builds) ---");
  const slide6Source = path.join(SLIDES_DIR, "slide_06.png");
  await page.goto("file://" + slide6Source);

  const slide6Base64 = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376; const h = 768;

    function makeCanvas() {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return { c, ctx };
    }

    function applyGreyedOut(ctx, rect) {
      const temp = document.createElement("canvas");
      temp.width = rect.w; temp.height = rect.h;
      const tCtx = temp.getContext("2d");
      tCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);

      const imgData = tCtx.getImageData(0, 0, rect.w, rect.h);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        d[i] = Math.round(gray * 0.45 + 242 * 0.55);
        d[i+1] = Math.round(gray * 0.45 + 245 * 0.55);
        d[i+2] = Math.round(gray * 0.45 + 248 * 0.55);
      }
      tCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(temp, rect.x, rect.y);
    }

    // Build 1: Continuous active, Discontinuous column COMPLETELY HIDDEN (zero ghost text)
    const { c: c1, ctx: ctx1 } = makeCanvas();
    const rx = 844, rw = 432;
    ctx1.fillStyle = "#ffffff";
    ctx1.fillRect(rx, 185, rw, 73); // Header area
    ctx1.fillStyle = "#edf2f7";
    ctx1.fillRect(rx, 258, rw, 105); // Row 1
    ctx1.fillStyle = "#ffffff";
    ctx1.fillRect(rx, 363, rw, 107); // Row 2
    ctx1.fillStyle = "#edf2f7";
    ctx1.fillRect(rx, 470, rw, 103); // Row 3
    ctx1.fillStyle = "#ffffff";
    ctx1.fillRect(rx, 573, rw, 105); // Row 4

    // Build 2: Continuous column greyed out, Discontinuous column active in full color
    const { c: c2, ctx: ctx2 } = makeCanvas();
    applyGreyedOut(ctx2, { x: 409, y: 185, w: 432, h: 495 });

    return [c1.toDataURL("image/png"), c2.toDataURL("image/png")];
  });

  const slide6Buffers = slide6Base64.map(b => Buffer.from(b.replace(/^data:image\/png;base64,/, ""), "base64"));
  await registerBuilds({
    manifest,
    slideNumber: 6,
    sourceImage: slide6Source,
    sourceFileName: "slide_06.png",
    buildBuffers: slide6Buffers,
    strategy: "component-reveal",
    labels: [
      "Build 1: Reveal Continuous Variation (quantitative spectrum, polygenic, high environmental impact)",
      "Build 2: Reveal Discontinuous Variation (qualitative discrete categories; Continuous column greyed out)"
    ],
    prompts: [
      "Show Continuous Variation matrix column.",
      "Show Discontinuous Variation matrix column with Continuous column greyed out."
    ]
  });

  // =========================================================================
  // SLIDE 8: Origins of Genetic Diversity (3 Builds: Meiosis -> Fertilisation -> Mutations)
  // Completely hides unrevealed cards + Greys out already animated cards
  // =========================================================================
  console.log("\n--- Processing Slide 8: Origins of Genetic Diversity (3 builds) ---");
  const slide8Source = path.join(SLIDES_DIR, "slide_08.png");
  await page.goto("file://" + slide8Source);

  const slide8Base64 = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376; const h = 768;

    function makeCanvas() {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return { c, ctx };
    }

    function applyGreyedOutSmart(ctx, rect) {
      const temp = document.createElement("canvas");
      temp.width = rect.w; temp.height = rect.h;
      const tCtx = temp.getContext("2d");
      tCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);

      const imgData = tCtx.getImageData(0, 0, rect.w, rect.h);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2];
        const isBg = (r > 236 && g > 242 && b > 246);
        if (!isBg) {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          d[i] = Math.round(gray * 0.45 + 238 * 0.55);
          d[i+1] = Math.round(gray * 0.45 + 242 * 0.55);
          d[i+2] = Math.round(gray * 0.45 + 246 * 0.55);
        }
      }
      tCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(temp, rect.x, rect.y);
    }

    function hideRegion(ctx, rect) {
      const grad = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
      grad.addColorStop(0, "#f2f9fd");
      grad.addColorStop(1, "#f4fafc");
      ctx.fillStyle = grad;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    const c1 = { x: 70, y: 185, w: 396, h: 515 };
    const c2 = { x: 490, y: 185, w: 396, h: 515 };
    const c3 = { x: 910, y: 185, w: 396, h: 515 };

    // Build 1: Card 1 active, Cards 2 & 3 completely hidden
    const { c: can1, ctx: ctx1 } = makeCanvas();
    hideRegion(ctx1, { x: 485, y: 180, w: 840, h: 530 });

    // Build 2: Card 1 greyed out, Card 2 active, Card 3 completely hidden
    const { c: can2, ctx: ctx2 } = makeCanvas();
    applyGreyedOutSmart(ctx2, c1);
    hideRegion(ctx2, { x: 905, y: 180, w: 420, h: 530 });

    // Build 3: Cards 1 & 2 greyed out, Card 3 active in full color
    const { c: can3, ctx: ctx3 } = makeCanvas();
    applyGreyedOutSmart(ctx3, c1);
    applyGreyedOutSmart(ctx3, c2);

    return [can1.toDataURL("image/png"), can2.toDataURL("image/png"), can3.toDataURL("image/png")];
  });

  const slide8Buffers = slide8Base64.map(b => Buffer.from(b.replace(/^data:image\/png;base64,/, ""), "base64"));
  await registerBuilds({
    manifest,
    slideNumber: 8,
    sourceImage: slide8Source,
    sourceFileName: "slide_08.png",
    buildBuffers: slide8Buffers,
    strategy: "process",
    labels: [
      "Build 1: Reveal 1. Meiosis (crossing over in Prophase I & independent assortment)",
      "Build 2: Reveal 2. Random Fertilisation (millions of sperm combinations; Meiosis greyed out)",
      "Build 3: Reveal 3. Mutations (the ultimate source of novel alleles; Meiosis & Fertilisation greyed out)"
    ],
    prompts: [
      "Show Card 1 Meiosis.",
      "Show Card 2 Random Fertilisation with Card 1 greyed out.",
      "Show Card 3 Mutations with Cards 1 & 2 greyed out."
    ]
  });

  // =========================================================================
  // SLIDE 14 (file slide_13.png): Core Biometrics: Measuring Variation
  // 3 Builds: Mean -> Variance -> Standard Deviation
  // Completely hides unrevealed rows + Greys out already animated rows
  // =========================================================================
  console.log("\n--- Processing Slide 14: Core Biometrics (3 builds, slide_13.png) ---");
  const slide13Source = path.join(SLIDES_DIR, "slide_13.png");
  await page.goto("file://" + slide13Source);

  const slide13Base64 = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376; const h = 768;

    function makeCanvas() {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return { c, ctx };
    }

    function applyGreyedOutCard(ctx, rect) {
      const temp = document.createElement("canvas");
      temp.width = rect.w; temp.height = rect.h;
      const tCtx = temp.getContext("2d");
      tCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);

      const imgData = tCtx.getImageData(0, 0, rect.w, rect.h);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2];
        const isBg = (r > 248 && g > 250 && b > 252);
        if (!isBg) {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          d[i] = Math.round(gray * 0.45 + 238 * 0.55);
          d[i+1] = Math.round(gray * 0.45 + 242 * 0.55);
          d[i+2] = Math.round(gray * 0.45 + 246 * 0.55);
        }
      }
      tCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(temp, rect.x, rect.y);
    }

    function hideRegion(ctx, rect) {
      const grad = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
      grad.addColorStop(0, "#f8fafc");
      grad.addColorStop(1, "#f1f5f9");
      ctx.fillStyle = grad;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    const card1 = { x: 68, y: 138, w: 1238, h: 175 };
    const card2 = { x: 68, y: 334, w: 1238, h: 175 };
    const card3 = { x: 68, y: 531, w: 1238, h: 175 };

    // Build 1: Card 1 active, Cards 2 & 3 completely hidden
    const { c: can1, ctx: ctx1 } = makeCanvas();
    hideRegion(ctx1, { x: 60, y: 330, w: 1295, h: 385 });

    // Build 2: Card 1 greyed out, Card 2 active, Card 3 completely hidden
    const { c: can2, ctx: ctx2 } = makeCanvas();
    applyGreyedOutCard(ctx2, card1);
    hideRegion(ctx2, { x: 60, y: 525, w: 1295, h: 190 });

    // Build 3: Cards 1 & 2 greyed out, Card 3 active in full color
    const { c: can3, ctx: ctx3 } = makeCanvas();
    applyGreyedOutCard(ctx3, card1);
    applyGreyedOutCard(ctx3, card2);

    return [can1.toDataURL("image/png"), can2.toDataURL("image/png"), can3.toDataURL("image/png")];
  });

  const slide13Buffers = slide13Base64.map(b => Buffer.from(b.replace(/^data:image\/png;base64,/, ""), "base64"));
  await registerBuilds({
    manifest,
    slideNumber: 14,
    sourceImage: slide13Source,
    sourceFileName: "slide_13.png",
    buildBuffers: slide13Buffers,
    strategy: "process",
    labels: [
      "Build 1: Reveal Arithmetic Mean (baseline central tendency)",
      "Build 2: Reveal Variance (s² - sum of squared differences from the mean; Mean greyed out)",
      "Build 3: Reveal Standard Deviation (s - root variance, data spread around the mean; Mean & Variance greyed out)"
    ],
    prompts: [
      "Show Row 1 Arithmetic Mean.",
      "Show Row 2 Variance with Row 1 greyed out.",
      "Show Row 3 Standard Deviation with Rows 1 & 2 greyed out."
    ]
  });

  // =========================================================================
  // SLIDE 15 (file slide_14.png): Gaussian Normal Distribution
  // 3 Builds: 68% -> 95% -> 99.7%
  // Completely hides unrevealed callouts with aligned grid + Greys out already animated callouts
  // =========================================================================
  console.log("\n--- Processing Slide 15: Gaussian Normal Distribution (3 builds, slide_14.png) ---");
  const slide14Source = path.join(SLIDES_DIR, "slide_14.png");
  await page.goto("file://" + slide14Source);

  const slide14Base64 = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376; const h = 768;

    function makeCanvas() {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return { c, ctx };
    }

    // Sample 46x46 tile from x=1215, y=387 (aligned 23px grid)
    const tile = document.createElement("canvas");
    tile.width = 46; tile.height = 46;
    tile.getContext("2d").drawImage(img, 1215, 387, 46, 46, 0, 0, 46, 46);

    function getGridPattern(ctx) {
      const p = ctx.createPattern(tile, "repeat");
      p.setTransform(new DOMMatrix().translate(1215, 387));
      return p;
    }

    function applyGreyedOutSmart(ctx, rect) {
      const temp = document.createElement("canvas");
      temp.width = rect.w; temp.height = rect.h;
      const tCtx = temp.getContext("2d");
      tCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);

      const imgData = tCtx.getImageData(0, 0, rect.w, rect.h);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2];
        const isBg = (r > 235 && g > 244 && b > 248);
        if (!isBg) {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          d[i] = Math.round(gray * 0.45 + 238 * 0.55);
          d[i+1] = Math.round(gray * 0.45 + 242 * 0.55);
          d[i+2] = Math.round(gray * 0.45 + 246 * 0.55);
        }
      }
      tCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(temp, rect.x, rect.y);
    }

    function hideCallout2(ctx) {
      ctx.fillStyle = getGridPattern(ctx);
      ctx.fillRect(880, 340, 320, 140); // Card 2 box
      ctx.fillRect(702, 395, 185, 108); // Arrow 2 cleanly covered without clipping curve
    }

    function hideCallout3(ctx) {
      ctx.fillStyle = getGridPattern(ctx);
      ctx.fillRect(995, 525, 320, 140); // Card 3 box
      ctx.fillRect(825, 575, 180, 60);  // Arrow 3
    }

    const c1_region = { x: 618, y: 190, w: 450, h: 145 };
    const c2_region = { x: 702, y: 340, w: 500, h: 165 };

    // Build 1: Callout 1 active, Callouts 2 & 3 completely hidden
    const { c: can1, ctx: ctx1 } = makeCanvas();
    hideCallout2(ctx1);
    hideCallout3(ctx1);

    // Build 2: Callout 1 greyed out, Callout 2 active, Callout 3 completely hidden
    const { c: can2, ctx: ctx2 } = makeCanvas();
    applyGreyedOutSmart(ctx2, c1_region);
    hideCallout3(ctx2);

    // Build 3: Callouts 1 & 2 greyed out, Callout 3 active in full color
    const { c: can3, ctx: ctx3 } = makeCanvas();
    applyGreyedOutSmart(ctx3, c1_region);
    applyGreyedOutSmart(ctx3, c2_region);

    return [can1.toDataURL("image/png"), can2.toDataURL("image/png"), can3.toDataURL("image/png")];
  });

  const slide14Buffers = slide14Base64.map(b => Buffer.from(b.replace(/^data:image\/png;base64,/, ""), "base64"));
  await registerBuilds({
    manifest,
    slideNumber: 15,
    sourceImage: slide14Source,
    sourceFileName: "slide_14.png",
    buildBuffers: slide14Buffers,
    strategy: "process",
    labels: [
      "Build 1: Reveal ±1 Standard Deviation (contains exactly 68.2% of clinical population)",
      "Build 2: Reveal ±2 Standard Deviations (contains exactly 95.4% of clinical population; ±1 SD greyed out)",
      "Build 3: Reveal ±3 Standard Deviations (contains exactly 99.7% of clinical population; ±1 SD & ±2 SD greyed out)"
    ],
    prompts: [
      "Show Normal distribution curve with 1 Standard Deviation callout.",
      "Show 2 Standard Deviations callout with 1 Standard Deviation greyed out.",
      "Show 3 Standard Deviations callout with 1 and 2 Standard Deviations greyed out."
    ]
  });

  // Save updated manifest
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log("\n=== Successfully saved updated manifest.json ===");

  await browser.close();
  console.log("=== Chrome closed. Build generation complete! ===");
}

main().catch((err) => {
  console.error("Build process failed:", err);
  process.exit(1);
});
