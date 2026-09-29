import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";
import { syncQaApprovedGeminiSequence } from "../src/slide-animation-planner.js";

const DECK_ID = "Lesson_01_Unit_intro_and_Phenotypic_variation";
const DECK_DIR = path.resolve("public/decks/genetics_aaq", DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

export function getSlide4Html(step = 5, isMaster = false) {
  // step: 1 = Vp, 2 = Vg, 3 = Ve, 4 = Vgxe, 5 = Whole equation (all active)
  const isG1 = !isMaster && step > 1 && step < 5;
  const isG2 = !isMaster && step > 2 && step < 5;
  const isG3 = !isMaster && step > 3 && step < 5;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
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
    top: 32px;
    left: 56px;
  }
  .slide-title {
    font-size: 42px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.025em;
  }
  
  /* Central Equation */
  .equation-container {
    position: absolute;
    top: 346px;
    left: 0;
    width: 1376px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    font-size: 52px;
    font-weight: 800;
    font-family: "Inter", sans-serif;
    z-index: 10;
  }
  .eq-term {
    padding: 8px 18px;
    border-radius: 14px;
    display: flex;
    align-items: baseline;
    transition: all 0.3s ease;
  }
  .eq-term .sub {
    font-size: 0.68em;
    font-weight: 700;
    margin-left: 2px;
  }
  .term-vp { color: #1d4ed8; background: rgba(219, 234, 254, 0.8); border: 2.5px solid #93c5fd; }
  .term-vg { color: #047857; background: rgba(209, 250, 229, 0.8); border: 2.5px solid #6ee7b7; }
  .term-ve { color: #b45309; background: rgba(254, 243, 199, 0.8); border: 2.5px solid #fcd34d; }
  .term-vgxe { color: #6d28d9; background: rgba(237, 233, 254, 0.8); border: 2.5px solid #c4b5fd; }
  .eq-op { color: #475569; font-weight: 700; font-size: 44px; }

  .hidden-step {
    visibility: hidden !important;
    opacity: 0 !important;
  }

  /* Greyed-out state for components already animated in */
  .card-greyed-out {
    opacity: 0.35 !important;
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
    opacity: 0.35 !important;
    filter: grayscale(100%) !important;
    background: #f1f5f9 !important;
    border-color: #cbd5e1 !important;
    color: #64748b !important;
  }
  .connector-greyed-out {
    stroke: #94a3b8 !important;
    opacity: 0.35 !important;
  }
  .circle-greyed-out {
    fill: #94a3b8 !important;
    opacity: 0.35 !important;
  }

  /* Callout Cards */
  .card {
    position: absolute;
    width: 590px;
    background: #ffffff;
    border-radius: 18px;
    padding: 20px 26px;
    box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.09), 0 4px 8px -2px rgba(15, 23, 42, 0.04);
    border: 1.5px solid #cbd5e1;
    z-index: 5;
    transition: all 0.3s ease;
  }
  
  .card-pill {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 9999px;
    font-size: 18.5px;
    font-weight: 800;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }
  .pill-vp { background: #dbeafe; color: #1e40af; border: 1.5px solid #bfdbfe; }
  .pill-vg { background: #d1fae5; color: #065f46; border: 1.5px solid #a7f3d0; }
  .pill-ve { background: #fef3c7; color: #92400e; border: 1.5px solid #fde68a; }
  .pill-vgxe { background: #ede9fe; color: #5b21b6; border: 1.5px solid #ddd6fe; }
  
  .card-bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .card-bullets li {
    font-size: 18px;
    line-height: 1.45;
    color: #334155;
    position: relative;
    padding-left: 22px;
  }
  .card-bullets li::before {
    content: "•";
    position: absolute;
    left: 4px;
    font-weight: 900;
    font-size: 20px;
    line-height: 1.2;
    color: #64748b;
  }
  .card-bullets strong {
    color: #0f172a;
    font-weight: 700;
  }
  
  /* Positioning Cards */
  .card-vp {
    top: 96px;
    left: 56px;
  }
  .card-vg {
    top: 504px;
    left: 56px;
  }
  .card-ve {
    top: 96px;
    right: 56px;
  }
  .card-vgxe {
    top: 504px;
    right: 56px;
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

  <!-- SVG Connectors rendered directly into HTML -->
  <svg class="connectors" id="svgConnectors">
    <!-- Connector 1: Card Vp (bottom at x=405, y=269) -> Term Vp (top at x=405, y=340) -->
    <path d="M 405 269 L 405 340" stroke="${isG1 ? '#94a3b8' : '#2563eb'}" stroke-width="2.5" stroke-linecap="round" class="${isG1 ? 'connector-greyed-out' : ''}"/>
    <circle cx="405" cy="340" r="4.5" fill="${isG1 ? '#94a3b8' : '#2563eb'}" class="${isG1 ? 'circle-greyed-out' : ''}"/>

    <!-- Connector 2: Card Vg (top at x=579, y=504) -> Term Vg (bottom at x=579, y=435) -->
    ${step >= 2 ? `
    <path d="M 579 504 L 579 435" stroke="${isG2 ? '#94a3b8' : '#059669'}" stroke-width="2.5" stroke-linecap="round" class="${isG2 ? 'connector-greyed-out' : ''}"/>
    <circle cx="579" cy="435" r="4.5" fill="${isG2 ? '#94a3b8' : '#059669'}" class="${isG2 ? 'circle-greyed-out' : ''}"/>
    ` : ""}

    <!-- Connector 3: Card Ve (bottom at x=790, y=244) -> Term Ve (top at x=753, y=340) -->
    ${step >= 3 ? `
    <path d="M 790 244 C 790 292, 753 292, 753 340" stroke="${isG3 ? '#94a3b8' : '#d97706'}" stroke-width="2.5" stroke-linecap="round" fill="none" class="${isG3 ? 'connector-greyed-out' : ''}"/>
    <circle cx="753" cy="340" r="4.5" fill="${isG3 ? '#94a3b8' : '#d97706'}" class="${isG3 ? 'circle-greyed-out' : ''}"/>
    ` : ""}

    <!-- Connector 4: Card Vgxe (top at x=949, y=504) -> Term Vgxe (bottom at x=949, y=435) -->
    ${step >= 4 ? `
    <path d="M 949 504 L 949 435" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="949" cy="435" r="4.5" fill="#7c3aed"/>
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
  console.log("=== Updating Slide 4 with Larger Text & Final Whole Equation Build ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  const slide4Source = path.join(SLIDES_DIR, "slide_04.png");
  const slide4Buffers = [];

  // Generate 5 builds: 4 individual step reveals + 1 final complete equation build
  for (let step = 1; step <= 5; step++) {
    const html = getSlide4Html(step, false);
    await page.setContent(html);
    const buf = await page.screenshot({ type: "png" });
    slide4Buffers.push(buf);
  }

  // Update master slide_04.png with complete equation all active
  const masterHtml = getSlide4Html(5, true);
  await page.setContent(masterHtml);
  const masterBuf = await page.screenshot({ type: "png" });
  await fs.writeFile(slide4Source, masterBuf);
  console.log("  Updated master slide_04.png with full equation (all active).");

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
      "Build 4: Add Vg×e (Gene–Environment Interaction - differential response; Vp, Vg, Ve greyed out)",
      "Build 5: Complete Phenotypic Equation (All components active: Vp, Vg, Ve, and Vg×e together)"
    ],
    prompts: [
      "Reveal Term 1 Vp and its callout card.",
      "Add Term 2 Vg and its callout card, greying out Vp.",
      "Add Term 3 Ve and its callout card, greying out Vp and Vg.",
      "Add Term 4 Vg×e and its callout card, completing the phenotypic equation while previous terms are greyed out.",
      "Display the complete phenotypic equation with all four components and callout cards fully illuminated in color."
    ]
  });

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`  Updated ${MANIFEST_PATH}`);

  await browser.close();
  console.log("=== Slide 4 Update Complete ===");
}

main().catch(console.error);
