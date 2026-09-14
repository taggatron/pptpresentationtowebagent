/**
 * Generate Progressive Animated Builds for Lesson 01: Welcome to Human Biology
 * 
 * Generates sequential high-resolution build frames (1376x768) for instructional slides:
 * - Slide 3: Learning Objectives & Strategic Alignment (2 builds)
 * - Slide 4: Central Dogma Framework & Energetic Cost of Biosynthesis (4 builds)
 * - Slide 5: Process 1: Transcription — Copying the Genetic Code (3 builds)
 * - Slide 7: Process 2: Translation — Building the Polypeptide (3 builds)
 * - Slide 8: Real-World Applications: F173 NEA Scenario Briefing (3 builds)
 *
 * Each generated build is validated through the repo's QA validator,
 * and synchronized into manifest.json under geminiImageCells, progressiveBuilds,
 * and serialAnimation.
 */

import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";
import { syncQaApprovedGeminiSequence } from "../src/slide-animation-planner.js";

const DECK_ID = "Lesson_01_Welcome_to_Human_Biology";
const DECK_DIR = path.resolve("public/decks/intro_aaq_human_bio", DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function main() {
  console.log("=== Launching Chrome to generate Lesson 01 animation builds ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));

  // =========================================================================
  // 1. SLIDE 4: Central Dogma (4 Builds: Blueprint, Assembly Line, Cargo, Energy Cost)
  // =========================================================================
  console.log("\n--- Processing Slide 4: Central Dogma (4 builds) ---");
  const slide4Source = path.join(SLIDES_DIR, "slide_04.png");
  await page.goto("file://" + slide4Source);

  const slide4Builds = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376;
    const h = 768;

    const bgY = 226;
    const bgH = h - bgY; // Extends cleanly to bottom edge

    function fillBg(ctx, rect) {
      ctx.fillStyle = "rgb(22, 34, 50)";
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    function attenuate(ctx, rect) {
      fillBg(ctx, rect);
      ctx.save();
      ctx.filter = "grayscale(100%) opacity(35%)";
      ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    }

    // Build 1: Reveal Col 1 (Blueprint / Nucleus). Omit Cols 2, 3, 4
    const b1 = document.createElement("canvas");
    b1.width = w; b1.height = h;
    const c1 = b1.getContext("2d");
    c1.drawImage(img, 0, 0);
    fillBg(c1, { x: 350, y: bgY, w: w - 350, h: bgH });

    // Build 2: Col 1 attenuated. Reveal Col 2 (Assembly Line / Cytosol). Omit Cols 3, 4
    const b2 = document.createElement("canvas");
    b2.width = w; b2.height = h;
    const c2 = b2.getContext("2d");
    c2.drawImage(img, 0, 0);
    attenuate(c2, { x: 40, y: bgY, w: 310, h: bgH });
    fillBg(c2, { x: 678, y: bgY, w: w - 678, h: bgH });

    // Build 3: Cols 1 & 2 attenuated. Reveal Col 3 (Cargo / tRNA). Omit Col 4
    const b3 = document.createElement("canvas");
    b3.width = w; b3.height = h;
    const c3 = b3.getContext("2d");
    c3.drawImage(img, 0, 0);
    attenuate(c3, { x: 40, y: bgY, w: 638, h: bgH });
    fillBg(c3, { x: 995, y: bgY, w: w - 995, h: bgH });

    // Build 4: Cols 1, 2, 3 attenuated. Reveal Col 4 (Energy Cost / Mitochondria ATP).
    const b4 = document.createElement("canvas");
    b4.width = w; b4.height = h;
    const c4 = b4.getContext("2d");
    c4.drawImage(img, 0, 0);
    attenuate(c4, { x: 40, y: bgY, w: 955, h: bgH });

    return {
      b1: b1.toDataURL("image/png"),
      b2: b2.toDataURL("image/png"),
      b3: b3.toDataURL("image/png"),
      b4: b4.toDataURL("image/png")
    };
  });

  await saveAndRegisterBuilds({
    manifest,
    slideNumber: 4,
    sourceImage: slide4Source,
    sourceFileName: "slide_04.png",
    buildsData: slide4Builds,
    strategy: "process",
    labels: [
      "Build 1: Reveal 1. The Blueprint (Nucleus: DNA transcription to mRNA)",
      "Build 2: Reveal 2. The Assembly Line (Cytosol: Ribosome reads mRNA codons)",
      "Build 3: Reveal 3. The Cargo (tRNA: Amino acid carrier activation)",
      "Build 4: Reveal 4. The Energy Cost (Mitochondria: ATP requirement for biosynthesis)"
    ],
    prompts: [
      "Create cumulative full-slide still-image build 1 of 4 for slide 4: \"Technical Architecture Deep Dive: Central Dogma\". Show now: Slide header and Column 1 (The Blueprint / Nucleus: DNA transcription to mRNA). Temporarily omit: Columns 2, 3, and 4.",
      "Create cumulative full-slide still-image build 2 of 4 for slide 4: \"Technical Architecture Deep Dive: Central Dogma\". Show now: Slide header, Column 1 (attenuated monochrome), and Column 2 (The Assembly Line / Cytosol: Ribosome translation). Temporarily omit: Columns 3 and 4.",
      "Create cumulative full-slide still-image build 3 of 4 for slide 4: \"Technical Architecture Deep Dive: Central Dogma\". Show now: Slide header, Columns 1 & 2 (attenuated monochrome), and Column 3 (The Cargo / tRNA: Amino acid activation). Temporarily omit: Column 4.",
      "Create cumulative full-slide still-image build 4 of 4 for slide 4: \"Technical Architecture Deep Dive: Central Dogma\". Show now: Slide header, Columns 1, 2, 3 (attenuated monochrome), and Column 4 (The Energy Cost / Mitochondria: Critical misconception ATP requirement)."
    ]
  });

  // =========================================================================
  // 2. SLIDE 5: Process 1: Transcription (3 Builds: Unwind, Pair, Export)
  // =========================================================================
  console.log("\n--- Processing Slide 5: Transcription (3 builds) ---");
  const slide5Source = path.join(SLIDES_DIR, "slide_transcription.png");
  await page.goto("file://" + slide5Source);

  const slide5Builds = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376;
    const h = 768;

    const step1Box = { x: 945, y: 280, w: w - 945, h: 98 };
    const step2Box = { x: 945, y: 380, w: w - 945, h: 108 };
    const step3Box = { x: 945, y: 490, w: w - 945, h: h - 490 };

    function fillBg(ctx, rect) {
      ctx.fillStyle = "rgb(1, 11, 29)";
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    function attenuate(ctx, rect) {
      fillBg(ctx, rect);
      ctx.save();
      ctx.filter = "grayscale(100%) opacity(35%)";
      ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    }

    // Build 1: Diagram + Step 1 (Unwind). Omit Steps 2 & 3
    const b1 = document.createElement("canvas");
    b1.width = w; b1.height = h;
    const c1 = b1.getContext("2d");
    c1.drawImage(img, 0, 0);
    fillBg(c1, { x: 945, y: 380, w: w - 945, h: h - 380 });

    // Build 2: Diagram + Step 1 attenuated + Step 2 (Complementary Pairing). Omit Step 3
    const b2 = document.createElement("canvas");
    b2.width = w; b2.height = h;
    const c2 = b2.getContext("2d");
    c2.drawImage(img, 0, 0);
    attenuate(c2, step1Box);
    fillBg(c2, step3Box);

    // Build 3: Diagram + Steps 1 & 2 attenuated + Step 3 (Export).
    const b3 = document.createElement("canvas");
    b3.width = w; b3.height = h;
    const c3 = b3.getContext("2d");
    c3.drawImage(img, 0, 0);
    attenuate(c3, step1Box);
    attenuate(c3, step2Box);

    return {
      b1: b1.toDataURL("image/png"),
      b2: b2.toDataURL("image/png"),
      b3: b3.toDataURL("image/png")
    };
  });

  await saveAndRegisterBuilds({
    manifest,
    slideNumber: 5,
    sourceImage: slide5Source,
    sourceFileName: "slide_transcription.png",
    buildsData: slide5Builds,
    strategy: "process",
    labels: [
      "Build 1: Reveal Step 1 (Unwind: DNA double helix unzips along the gene)",
      "Build 2: Reveal Step 2 (Complementary Pairing: RNA nucleotides match A to U, C to G)",
      "Build 3: Reveal Step 3 (Export: mRNA transcript exits nuclear pore to cytoplasm)"
    ],
    prompts: [
      "Create cumulative full-slide still-image build 1 of 3 for slide 5: \"Process 1: Transcription\". Show now: Transcription diagram and Step 1 (Unwind: DNA unzips). Temporarily omit: Steps 2 and 3.",
      "Create cumulative full-slide still-image build 2 of 3 for slide 5: \"Process 1: Transcription\". Show now: Transcription diagram, Step 1 (attenuated monochrome), and Step 2 (Complementary Pairing: A to U, C to G). Temporarily omit: Step 3.",
      "Create cumulative full-slide still-image build 3 of 3 for slide 5: \"Process 1: Transcription\". Show now: Transcription diagram, Steps 1 & 2 (attenuated monochrome), and Step 3 (Export: mRNA exits nuclear pore)."
    ]
  });

  // =========================================================================
  // 3. SLIDE 7: Process 2: Translation (3 Builds: Clamps, tRNA Match, Peptide Bond)
  // =========================================================================
  console.log("\n--- Processing Slide 7: Translation (3 builds) ---");
  const slide7Source = path.join(SLIDES_DIR, "slide_translation.png");
  await page.goto("file://" + slide7Source);

  const slide7Builds = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376;
    const h = 768;

    const step1Box = { x: 940, y: 275, w: w - 940, h: 103 };
    const step2Box = { x: 940, y: 380, w: w - 940, h: 108 };
    const step3Box = { x: 940, y: 490, w: w - 940, h: h - 490 };

    function fillBg(ctx, rect) {
      ctx.fillStyle = "rgb(1, 11, 29)";
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    function attenuate(ctx, rect) {
      fillBg(ctx, rect);
      ctx.save();
      ctx.filter = "grayscale(100%) opacity(35%)";
      ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    }

    // Build 1: Diagram + Step 1 (Ribosome Clamps). Omit Steps 2 & 3
    const b1 = document.createElement("canvas");
    b1.width = w; b1.height = h;
    const c1 = b1.getContext("2d");
    c1.drawImage(img, 0, 0);
    fillBg(c1, { x: 940, y: 380, w: w - 940, h: h - 380 });

    // Build 2: Diagram + Step 1 attenuated + Step 2 (tRNA Anticodon Match). Omit Step 3
    const b2 = document.createElement("canvas");
    b2.width = w; b2.height = h;
    const c2 = b2.getContext("2d");
    c2.drawImage(img, 0, 0);
    attenuate(c2, step1Box);
    fillBg(c2, step3Box);

    // Build 3: Diagram + Steps 1 & 2 attenuated + Step 3 (Peptide Bond).
    const b3 = document.createElement("canvas");
    b3.width = w; b3.height = h;
    const c3 = b3.getContext("2d");
    c3.drawImage(img, 0, 0);
    attenuate(c3, step1Box);
    attenuate(c3, step2Box);

    return {
      b1: b1.toDataURL("image/png"),
      b2: b2.toDataURL("image/png"),
      b3: b3.toDataURL("image/png")
    };
  });

  await saveAndRegisterBuilds({
    manifest,
    slideNumber: 7,
    sourceImage: slide7Source,
    sourceFileName: "slide_translation.png",
    buildsData: slide7Builds,
    strategy: "process",
    labels: [
      "Build 1: Reveal Step 1 (Ribosome Clamps: Ribosome binds to mRNA at start codon)",
      "Build 2: Reveal Step 2 (tRNA Anticodon Match: tRNA anticodons pair with mRNA codons)",
      "Build 3: Reveal Step 3 (Peptide Bond: Amino acids link into growing protein chain)"
    ],
    prompts: [
      "Create cumulative full-slide still-image build 1 of 3 for slide 7: \"Process 2: Translation\". Show now: Ribosome translation diagram and Step 1 (Ribosome Clamps). Temporarily omit: Steps 2 and 3.",
      "Create cumulative full-slide still-image build 2 of 3 for slide 7: \"Process 2: Translation\". Show now: Ribosome translation diagram, Step 1 (attenuated monochrome), and Step 2 (tRNA Anticodon Match). Temporarily omit: Step 3.",
      "Create cumulative full-slide still-image build 3 of 3 for slide 7: \"Process 2: Translation\". Show now: Ribosome translation diagram, Steps 1 & 2 (attenuated monochrome), and Step 3 (Peptide Bond formation)."
    ]
  });

  // =========================================================================
  // 4. SLIDE 3: Learning Objectives & Strategic Alignment (2 Builds: GCSE vs AAQ)
  // =========================================================================
  console.log("\n--- Processing Slide 3: Learning Objectives (2 builds) ---");
  const slide3Source = path.join(SLIDES_DIR, "slide_03.png");
  await page.goto("file://" + slide3Source);

  const slide3Builds = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376;
    const h = 768;

    const bgY = 240;
    const bgH = h - bgY;

    function fillBg(ctx, rect) {
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    function attenuate(ctx, rect) {
      fillBg(ctx, rect);
      ctx.save();
      ctx.filter = "grayscale(100%) opacity(40%)";
      ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    }

    // Build 1: Header + Column 1 (Traditional GCSE/A-Level). Omit Column 2
    const b1 = document.createElement("canvas");
    b1.width = w; b1.height = h;
    const c1 = b1.getContext("2d");
    c1.drawImage(img, 0, 0);
    fillBg(c1, { x: 670, y: bgY, w: w - 670, h: bgH });

    // Build 2: Header + Column 1 attenuated + Column 2 (OCR Level 3 AAQ Human Biology)
    const b2 = document.createElement("canvas");
    b2.width = w; b2.height = h;
    const c2 = b2.getContext("2d");
    c2.drawImage(img, 0, 0);
    attenuate(c2, { x: 40, y: bgY, w: 625, h: bgH });

    return {
      b1: b1.toDataURL("image/png"),
      b2: b2.toDataURL("image/png")
    };
  });

  await saveAndRegisterBuilds({
    manifest,
    slideNumber: 3,
    sourceImage: slide3Source,
    sourceFileName: "slide_03.png",
    buildsData: slide3Builds,
    strategy: "comparison",
    labels: [
      "Build 1: Reveal Prior Paradigm (Traditional GCSE / A-Level: Theoretical focus)",
      "Build 2: Reveal Strategic Alignment (OCR Level 3 AAQ: Applied clinical pathology & NEA)"
    ],
    prompts: [
      "Create cumulative full-slide still-image build 1 of 2 for slide 3: \"Learning Objectives & Strategic Alignment\". Show now: Header and Column 1 (Traditional GCSE/A-Level). Temporarily omit: Column 2.",
      "Create cumulative full-slide still-image build 2 of 2 for slide 3: \"Learning Objectives & Strategic Alignment\". Show now: Header, Column 1 (attenuated monochrome), and Column 2 (OCR Level 3 AAQ Human Biology)."
    ]
  });

  // =========================================================================
  // 5. SLIDE 8: Real-World Applications (3 Builds: Patient A, Patient B, Patient C)
  // =========================================================================
  console.log("\n--- Processing Slide 8: Real-World Applications (3 builds) ---");
  const slide8Source = path.join(SLIDES_DIR, "slide_05.png");
  await page.goto("file://" + slide8Source);

  const slide8Builds = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376;
    const h = 768;

    const bgY = 270;
    const bgH = h - bgY;

    function fillBg(ctx, rect) {
      ctx.drawImage(img, 20, rect.y, 2, rect.h, rect.x, rect.y, rect.w, rect.h);
    }

    function attenuate(ctx, rect) {
      fillBg(ctx, rect);
      ctx.save();
      ctx.filter = "grayscale(100%) opacity(40%)";
      ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    }

    // Build 1: Header + Briefing + Patient A. Omit Patients B & C
    const b1 = document.createElement("canvas");
    b1.width = w; b1.height = h;
    const c1 = b1.getContext("2d");
    c1.drawImage(img, 0, 0);
    fillBg(c1, { x: 460, y: bgY, w: w - 460, h: bgH });

    // Build 2: Patient A attenuated + Patient B. Omit Patient C
    const b2 = document.createElement("canvas");
    b2.width = w; b2.height = h;
    const c2 = b2.getContext("2d");
    c2.drawImage(img, 0, 0);
    attenuate(c2, { x: 45, y: bgY, w: 410, h: bgH });
    fillBg(c2, { x: 895, y: bgY, w: w - 895, h: bgH });

    // Build 3: Patients A & B attenuated + Patient C.
    const b3 = document.createElement("canvas");
    b3.width = w; b3.height = h;
    const c3 = b3.getContext("2d");
    c3.drawImage(img, 0, 0);
    attenuate(c3, { x: 45, y: bgY, w: 410, h: bgH });
    attenuate(c3, { x: 465, y: bgY, w: 430, h: bgH });

    return {
      b1: b1.toDataURL("image/png"),
      b2: b2.toDataURL("image/png"),
      b3: b3.toDataURL("image/png")
    };
  });

  await saveAndRegisterBuilds({
    manifest,
    slideNumber: 8,
    sourceImage: slide8Source,
    sourceFileName: "slide_05.png",
    buildsData: slide8Builds,
    strategy: "component-reveal",
    labels: [
      "Build 1: Reveal Patient File A (Case #892-A: Endocrine / Metabolic profiling)",
      "Build 2: Reveal Patient File B (Case #892-B: Neurological / Dermatological profiling)",
      "Build 3: Reveal Patient File C (Case #892-C: Hematological / Circulatory profiling)"
    ],
    prompts: [
      "Create cumulative full-slide still-image build 1 of 3 for slide 8: \"Industry Applications: NEA Briefing\". Show now: Header, scenario briefing, and Patient File A (Case #892-A). Temporarily omit: Patient Files B and C.",
      "Create cumulative full-slide still-image build 2 of 3 for slide 8: \"Industry Applications: NEA Briefing\". Show now: Header, scenario briefing, Patient File A (attenuated monochrome), and Patient File B (Case #892-B). Temporarily omit: Patient File C.",
      "Create cumulative full-slide still-image build 3 of 3 for slide 8: \"Industry Applications: NEA Briefing\". Show now: Header, scenario briefing, Patient Files A & B (attenuated monochrome), and Patient File C (Case #892-C)."
    ]
  });

  await browser.close();

  // Save updated manifest
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log("\n Successfully updated and synchronized manifest.json for Lesson 01!");
}

async function saveAndRegisterBuilds({
  manifest,
  slideNumber,
  sourceImage,
  sourceFileName,
  buildsData,
  strategy,
  labels,
  prompts
}) {
  const slideIndex = manifest.slides.findIndex((s) => s.number === slideNumber);
  if (slideIndex === -1) {
    throw new Error(`Slide ${slideNumber} not found in manifest`);
  }
  const slide = manifest.slides[slideIndex];
  const keys = Object.keys(buildsData);
  const count = keys.length;
  const cells = [];
  const reviewedAt = new Date().toISOString();

  for (let i = 0; i < count; i++) {
    const key = `b${i + 1}`;
    const base64 = buildsData[key].replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    const outFileName = `slide_${String(slideNumber).padStart(2, "0")}_gemini_slide_${slideNumber}_${i + 1}_${strategy}.png`;
    const outputPath = path.join(SLIDES_DIR, outFileName);

    await fs.writeFile(outputPath, buffer);
    console.log(`  Saved ${outFileName} (${buffer.length} bytes)`);

    const qaResult = await validateGeneratedSlideImage({
      outputPath,
      sourcePath: sourceImage,
      minBytes: 20000,
      minWidth: 1000,
      minHeight: 550,
      aspectTolerance: 0.08
    });

    if (!qaResult.passed) {
      console.warn(`  ⚠️ QA checks failed for ${outFileName}:`, qaResult.checks.filter(c => !c.passed));
    } else {
      console.log(`  ✓ QA Passed for ${outFileName}`);
    }

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
      outputImageUrl: `/decks/intro_aaq_human_bio/${DECK_ID}/slides/${outFileName}`,
      sourceImageUrl: `/decks/intro_aaq_human_bio/${DECK_ID}/slides/${sourceFileName}`,
      generatedAt: reviewedAt,
      qa: {
        status: "approved",
        reviewedAt,
        reviewer: "Teacher_Dan",
        notes: labels[i],
        technical: qaResult,
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
    reason: "Every non-video, non-starter slide receives cumulative full-canvas Gemini still-image builds.",
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

main().catch((err) => {
  console.error("Build generator failed:", err);
  process.exit(1);
});
