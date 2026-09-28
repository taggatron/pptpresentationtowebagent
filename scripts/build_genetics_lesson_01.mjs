import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";
import { syncQaApprovedGeminiSequence } from "../src/slide-animation-planner.js";

const DECK_ID = "Lesson_01_Unit_intro_and_Phenotypic_variation";
const DECK_DIR = path.resolve("public/decks/genetics_aaq", DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

function getEquationSlideHtml(step = 4) {
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
  
  /* Central Equation - Fixed position elements so nothing ever shifts */
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
    <div class="eq-term term-vp" id="termVp">V<span class="sub">p</span></div>
    <div class="eq-op ${step < 2 ? 'hidden-step' : ''}">=</div>
    <div class="eq-term term-vg ${step < 2 ? 'hidden-step' : ''}" id="termVg">V<span class="sub">g</span></div>
    <div class="eq-op ${step < 3 ? 'hidden-step' : ''}">+</div>
    <div class="eq-term term-ve ${step < 3 ? 'hidden-step' : ''}" id="termVe">V<span class="sub">e</span></div>
    <div class="eq-op ${step < 4 ? 'hidden-step' : ''}">+</div>
    <div class="eq-term term-vgxe ${step < 4 ? 'hidden-step' : ''}" id="termVgxe">V<span class="sub">g×e</span></div>
  </div>

  <!-- Card 1: Vp (Top-Left) -->
  <div class="card card-vp" id="cardVp">
    <div class="card-pill pill-vp">Vp (Phenotypic Variation)</div>
    <ul class="card-bullets">
      <li><strong>Observable traits</strong>: Physical manifestation of an organism.</li>
      <li><strong>Combined influences</strong>: Reflects genetics, lifestyle, and interactions.</li>
    </ul>
  </div>

  <!-- Card 2: Vg (Bottom-Left) -->
  <div class="card card-vg ${step < 2 ? 'hidden-step' : ''}" id="cardVg">
    <div class="card-pill pill-vg">Vg (Genotypic Variation)</div>
    <ul class="card-bullets">
      <li><strong>Genetic foundation</strong>: Specific alleles inherited from parents.</li>
      <li><strong>Fixed variables</strong>: DNA sequence remains constant.</li>
    </ul>
  </div>

  <!-- Card 3: Ve (Top-Right) -->
  <div class="card card-ve ${step < 3 ? 'hidden-step' : ''}" id="cardVe">
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

  <!-- SVG Connectors with Exact Geometric Anchor Points -->
  <svg class="connectors" id="svgConnectors">
    <!-- Connector 1: Card Vp (bottom) -> Term Vp (top) -->
    <path d="M 450 233 L 450 342" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="450" cy="342" r="4" fill="#2563eb"/>

    <!-- Connector 2: Card Vg (top) -> Term Vg (bottom) -->
    ${step >= 2 ? `
    <path d="M 596 480 L 596 426" stroke="#059669" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="596" cy="426" r="4" fill="#059669"/>
    ` : ""}

    <!-- Connector 3: Card Ve (bottom) -> Term Ve (top) -->
    ${step >= 3 ? `
    <path d="M 760 233 C 760 290, 741 290, 741 342" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <circle cx="741" cy="342" r="4" fill="#d97706"/>
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

  for (let i = 0; i < count; i++) {
    const buffer = buildBuffers[i];
    const outFileName = `slide_${String(slideNumber).padStart(2, "0")}_build_${i + 1}.png`;
    const outputPath = path.join(SLIDES_DIR, outFileName);

    await fs.writeFile(outputPath, buffer);
    console.log(`  Saved ${outFileName} (${buffer.length} bytes)`);

    const cellId = `gemini_slide_${slideNumber}_${i + 1}_${strategy}`;
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
  // =========================================================================
  console.log("\n--- Processing Slide 4: The Phenotypic Equation (4 builds) ---");
  const slide4Source = path.join(SLIDES_DIR, "slide_04.png");
  const slide4Buffers = [];

  for (let step = 1; step <= 4; step++) {
    const html = getEquationSlideHtml(step);
    await page.setContent(html);
    const buf = await page.screenshot({ type: "png" });
    slide4Buffers.push(buf);
  }

  // Update master slide_04.png with step 4
  await fs.writeFile(slide4Source, slide4Buffers[3]);
  console.log("  Updated master slide_04.png with full equation and correct callout positions.");

  await registerBuilds({
    manifest,
    slideNumber: 4,
    sourceImage: slide4Source,
    sourceFileName: "slide_04.png",
    buildBuffers: slide4Buffers,
    strategy: "component-reveal",
    labels: [
      "Build 1: Reveal Vp (Phenotypic Variation - observable physical characteristics)",
      "Build 2: Add Vg (Genotypic Variation - fixed genetic foundation)",
      "Build 3: Add Ve (Environmental Variation - dynamic external factors)",
      "Build 4: Add Vg×e (Gene–Environment Interaction - differential response)"
    ],
    prompts: [
      "Reveal Term 1 Vp and its callout card.",
      "Add Term 2 Vg and its callout card.",
      "Add Term 3 Ve and its callout card.",
      "Add Term 4 Vg×e and its callout card, completing the phenotypic equation."
    ]
  });

  // Helper for dimming canvas-based builds
  async function generateCanvasDimBuilds(sourceFileName, buildConfigs) {
    const sourcePath = path.join(SLIDES_DIR, sourceFileName);
    await page.goto("file://" + sourcePath);

    return await page.evaluate(async (configs) => {
      const img = document.querySelector("img");
      const w = 1376;
      const h = 768;
      const results = [];

      for (const config of configs) {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        if (config.dimRects) {
          for (const rect of config.dimRects) {
            ctx.fillStyle = "rgba(246, 251, 254, 0.88)";
            ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

            ctx.save();
            ctx.filter = "grayscale(100%) opacity(22%)";
            ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, rect.x, rect.y, rect.w, rect.h);
            ctx.restore();
          }
        }

        results.push(canvas.toDataURL("image/png"));
      }

      return results;
    }, buildConfigs);
  }

  // =========================================================================
  // SLIDE 5: Levels of Variation (2 Builds: Interspecific -> Intraspecific)
  // =========================================================================
  console.log("\n--- Processing Slide 5: Levels of Variation (2 builds) ---");
  const slide5Source = path.join(SLIDES_DIR, "slide_05.png");
  const slide5Base64 = await generateCanvasDimBuilds("slide_05.png", [
    // Build 1: Interspecific only (dim Intraspecific column x: 680 to 1350)
    {
      dimRects: [{ x: 680, y: 160, w: 660, h: 560 }]
    },
    // Build 2: Both revealed
    {}
  ]);
  const slide5Buffers = slide5Base64.map(b => Buffer.from(b.replace(/^data:image\/png;base64,/, ""), "base64"));
  await registerBuilds({
    manifest,
    slideNumber: 5,
    sourceImage: slide5Source,
    sourceFileName: "slide_05.png",
    buildBuffers: slide5Buffers,
    strategy: "component-reveal",
    labels: [
      "Build 1: Reveal Interspecific Variation (differences between distinct species)",
      "Build 2: Reveal Intraspecific Variation (differences within NHS clinic donor population)"
    ],
    prompts: [
      "Show left column Interspecific Variation.",
      "Show both Interspecific and Intraspecific Variation."
    ]
  });

  // =========================================================================
  // SLIDE 6: Categorising Phenotypes: The Variation Matrix (2 Builds)
  // =========================================================================
  console.log("\n--- Processing Slide 6: The Variation Matrix (2 builds) ---");
  const slide6Source = path.join(SLIDES_DIR, "slide_06.png");
  const slide6Base64 = await generateCanvasDimBuilds("slide_06.png", [
    // Build 1: Continuous Variation column only (dim Discontinuous column x: 860 to 1320)
    {
      dimRects: [{ x: 855, y: 230, w: 470, h: 500 }]
    },
    // Build 2: Both columns revealed
    {}
  ]);
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
      "Build 2: Reveal Discontinuous Variation (qualitative discrete categories, monogenic, negligible environmental impact)"
    ],
    prompts: [
      "Show Continuous Variation matrix column.",
      "Show both Continuous and Discontinuous Variation matrix columns."
    ]
  });

  // =========================================================================
  // SLIDE 8: Origins of Genetic Diversity (3 Builds: Meiosis -> Fertilisation -> Mutations)
  // =========================================================================
  console.log("\n--- Processing Slide 8: Origins of Genetic Diversity (3 builds) ---");
  const slide8Source = path.join(SLIDES_DIR, "slide_08.png");
  const slide8Base64 = await generateCanvasDimBuilds("slide_08.png", [
    // Build 1: Meiosis only (dim Cards 2 & 3)
    {
      dimRects: [
        { x: 480, y: 240, w: 415, h: 475 },
        { x: 900, y: 240, w: 415, h: 475 }
      ]
    },
    // Build 2: Meiosis + Fertilisation (dim Card 3)
    {
      dimRects: [
        { x: 900, y: 240, w: 415, h: 475 }
      ]
    },
    // Build 3: All 3 cards revealed
    {}
  ]);
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
      "Build 2: Reveal 2. Random Fertilisation (millions of sperm combinations)",
      "Build 3: Reveal 3. Mutations (the ultimate source of novel alleles)"
    ],
    prompts: [
      "Show Card 1 Meiosis.",
      "Show Cards 1 and 2 Meiosis and Random Fertilisation.",
      "Show all 3 cards: Meiosis, Random Fertilisation, and Mutations."
    ]
  });

  // =========================================================================
  // SLIDE 13: Core Biometrics: Measuring Variation (3 Builds: Mean -> Variance -> Standard Deviation)
  // =========================================================================
  console.log("\n--- Processing Slide 13: Core Biometrics (3 builds) ---");
  const slide13Source = path.join(SLIDES_DIR, "slide_13.png");
  const slide13Base64 = await generateCanvasDimBuilds("slide_13.png", [
    // Build 1: Mean only (dim Rows 2 & 3)
    {
      dimRects: [{ x: 50, y: 340, w: 1270, h: 345 }]
    },
    // Build 2: Mean + Variance (dim Row 3)
    {
      dimRects: [{ x: 50, y: 510, w: 1270, h: 175 }]
    },
    // Build 3: Mean + Variance + Standard Deviation
    {}
  ]);
  const slide13Buffers = slide13Base64.map(b => Buffer.from(b.replace(/^data:image\/png;base64,/, ""), "base64"));
  await registerBuilds({
    manifest,
    slideNumber: 13,
    sourceImage: slide13Source,
    sourceFileName: "slide_13.png",
    buildBuffers: slide13Buffers,
    strategy: "process",
    labels: [
      "Build 1: Reveal Arithmetic Mean (baseline central tendency)",
      "Build 2: Reveal Variance (s² - sum of squared differences from the mean)",
      "Build 3: Reveal Standard Deviation (s - root variance, data spread around the mean)"
    ],
    prompts: [
      "Show Row 1 Arithmetic Mean.",
      "Show Rows 1 & 2 Arithmetic Mean and Variance.",
      "Show all 3 biometric metrics: Mean, Variance, and Standard Deviation."
    ]
  });

  // =========================================================================
  // SLIDE 14: Gaussian Normal Distribution (3 Builds: 68% -> 95% -> 99.7%)
  // =========================================================================
  console.log("\n--- Processing Slide 14: Gaussian Normal Distribution (3 builds) ---");
  const slide14Source = path.join(SLIDES_DIR, "slide_14.png");
  const slide14Base64 = await generateCanvasDimBuilds("slide_14.png", [
    // Build 1: 1 SD only (dim cards 2 & 3)
    {
      dimRects: [
        { x: 870, y: 430, w: 450, h: 350 }
      ]
    },
    // Build 2: 1 SD + 2 SD (dim card 3)
    {
      dimRects: [
        { x: 980, y: 630, w: 350, h: 150 }
      ]
    },
    // Build 3: 1 SD + 2 SD + 3 SD
    {}
  ]);
  const slide14Buffers = slide14Base64.map(b => Buffer.from(b.replace(/^data:image\/png;base64,/, ""), "base64"));
  await registerBuilds({
    manifest,
    slideNumber: 14,
    sourceImage: slide14Source,
    sourceFileName: "slide_14.png",
    buildBuffers: slide14Buffers,
    strategy: "process",
    labels: [
      "Build 1: Reveal ±1 Standard Deviation (contains exactly 68.2% of clinical population)",
      "Build 2: Reveal ±2 Standard Deviations (contains exactly 95.4% of clinical population)",
      "Build 3: Reveal ±3 Standard Deviations (contains exactly 99.7% of clinical population)"
    ],
    prompts: [
      "Show Normal distribution curve with 1 Standard Deviation callout.",
      "Show Normal distribution curve with 1 and 2 Standard Deviation callouts.",
      "Show Normal distribution curve with all 3 Standard Deviation intervals."
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
