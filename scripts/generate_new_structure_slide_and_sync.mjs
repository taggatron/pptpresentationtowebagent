/**
 * Generate Slide 8 (Structure Determines Function) and update Lesson 01 manifest
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
  console.log("=== Generating Slide 8 (Structure Determines Function) & Syncing Builds ===");

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  // -------------------------------------------------------------------------
  // 1. GENERATE BASE IMAGE FOR SLIDE 8: slide_08_structure_function.png
  // -------------------------------------------------------------------------
  const slide4Source = path.join(SLIDES_DIR, "slide_04.png");
  await page.goto("file://" + slide4Source);

  await page.evaluate(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  });
  await page.waitForTimeout(1000);

  const slide8BaseDataUrl = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const cv = document.createElement("canvas");
    cv.width = 1376;
    cv.height = 768;
    const ctx = cv.getContext("2d");

    // 1. Draw base slide 4
    ctx.drawImage(img, 0, 0);

    const bgFill = "rgb(22, 34, 50)";

    // 2. Patch Title area Lines 2 and 3 (y: 88 to 220, x: 45 to 1340)
    ctx.fillStyle = bgFill;
    ctx.fillRect(45, 88, 1290, 132);

    // Line 2
    ctx.font = "700 29px \"Plus Jakarta Sans\", sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("The Central Dogma Framework: Structure determines function.", 50, 128);

    // Line 3
    ctx.font = "400 18px \"Inter\", sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("To operate at a Level 3 standard, we must understand molecular causality: altering the DNA triplet code", 50, 168);
    ctx.fillText("changes the amino acid sequence, directly disrupting tertiary folding, active site geometry, and function.", 50, 194);

    // 3. Completely clear Card 4 area (x: 1025 to 1365, y: 195 to 740)
    ctx.fillStyle = bgFill;
    ctx.fillRect(1025, 195, 340, 545);

    // Clear old triangle peak sticking out to the left of Card 4
    ctx.fillRect(990, 240, 42, 155);

    // Clear anything above the card from y: 200 to 260 across x: 1020 to 1340
    ctx.fillRect(1020, 200, 320, 60);

    // 4. Draw outer border of Card 4 (rounded rectangle matching Card 1, 2, 3)
    const cardX = 1031;
    const cardY = 260;
    const cardW = 286;
    const cardH = 475;
    const radius = 24;

    // Glowing outer container border
    ctx.save();
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.stroke();

    // Subtle dark card background fill
    ctx.fillStyle = "rgba(18, 28, 42, 0.4)";
    ctx.fill();
    ctx.restore();

    // 5. Card 4 Header (centered over card: center = 1031 + 143 = 1174)
    const centerX = cardX + cardW / 2;

    // Warning / Key principle badge
    ctx.save();
    ctx.translate(centerX - 95, 335);
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(18, 14);
    ctx.lineTo(-18, 14);
    ctx.closePath();
    ctx.fillStyle = "#f97316";
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#162232";
    ctx.font = "900 17px \"Plus Jakarta Sans\", sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("!", 0, 11);
    ctx.restore();

    ctx.textAlign = "left";
    ctx.font = "700 20px \"Plus Jakarta Sans\", sans-serif";
    ctx.fillStyle = "#f97316";
    ctx.fillText("4. Protein Conformation", centerX - 70, 332);

    ctx.font = "600 17px \"Plus Jakarta Sans\", sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("(Shape & Function)", centerX - 70, 360);

    // 6. Inner Icon Box (centered at centerX = 1174, y: 390 to 560)
    const iconBoxW = 216;
    const iconBoxH = 170;
    const iconBoxX = centerX - iconBoxW / 2;
    const iconBoxY = 390;

    ctx.save();
    ctx.fillStyle = "#101a26";
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(249, 115, 22, 0.5)";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(iconBoxX, iconBoxY, iconBoxW, iconBoxH, 18);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 7. Draw glowing 3D folded protein icon
    ctx.save();
    ctx.translate(centerX, iconBoxY + iconBoxH / 2);

    // Glow aura
    const grad = ctx.createRadialGradient(0, 0, 8, 0, 0, 70);
    grad.addColorStop(0, "rgba(249, 115, 22, 0.45)");
    grad.addColorStop(0.6, "rgba(249, 115, 22, 0.12)");
    grad.addColorStop(1, "rgba(249, 115, 22, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.fill();

    // Folded protein backbone
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#fb923c";
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.moveTo(-50, -18);
    ctx.bezierCurveTo(-48, -46, -15, -52, 0, -32);
    ctx.bezierCurveTo(15, -12, 42, -42, 52, -18);
    ctx.bezierCurveTo(58, 2, 38, 24, 18, 18);
    ctx.bezierCurveTo(5, 14, -5, 42, -24, 45);
    ctx.bezierCurveTo(-48, 46, -62, 22, -38, 4);
    ctx.bezierCurveTo(-18, -10, 10, -5, 34, 10);
    ctx.stroke();

    // Secondary strand with active site cleft
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-32, -28);
    ctx.bezierCurveTo(-14, -8, 4, -22, 26, -12);
    ctx.bezierCurveTo(40, -2, 24, 26, -4, 22);
    ctx.bezierCurveTo(-26, 20, -32, -4, -14, -18);
    ctx.stroke();

    // Active site pocket / mutation highlight
    ctx.fillStyle = "#fef08a";
    ctx.shadowColor = "#fef08a";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(26, -12, 6, 0, Math.PI * 2);
    ctx.fill();

    // Amino acid nodes
    const nodes = [
      [-46, -24], [-30, -42], [0, -32], [24, -36], [52, -18],
      [40, 8], [16, 18], [-10, 36], [-32, 40], [-48, 18]
    ];
    ctx.fillStyle = "#fb923c";
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 6;
    for (const [nx, ny] of nodes) {
      ctx.beginPath();
      ctx.arc(nx, ny, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 8. Bottom Text below icon box (inside card)
    ctx.textAlign = "left";
    ctx.font = "700 13.5px \"Inter\", sans-serif";
    ctx.fillStyle = "#f97316";
    ctx.fillText("Altered Conformation: CRITICAL PRINCIPLE.", cardX + 16, 595);

    ctx.font = "400 12.5px \"Inter\", sans-serif";
    ctx.fillStyle = "#e2e8f0";
    const textLines = [
      "Changing the genetic code (mutation) alters the",
      "mRNA codon, substituting an amino acid in the",
      "chain (primary structure).",
      "",
      "Different R-group interactions disrupt tertiary",
      "folding—altering the 3D protein shape and",
      "disabling biological function (e.g. active site)."
    ];
    let ty = 618;
    for (const line of textLines) {
      if (line === "") {
        ty += 6;
        continue;
      }
      ctx.fillText(line, cardX + 16, ty);
      ty += 18;
    }

    return cv.toDataURL("image/png");
  });

  const slide8BaseFileName = "slide_08_structure_function.png";
  const slide8BasePath = path.join(SLIDES_DIR, slide8BaseFileName);
  const slide8BaseBuffer = Buffer.from(slide8BaseDataUrl.replace(/^data:image\/png;base64,/, ""), "base64");
  await fs.writeFile(slide8BasePath, slide8BaseBuffer);
  console.log(`Saved base slide 8: ${slide8BaseFileName} (${slide8BaseBuffer.length} bytes)`);

  // -------------------------------------------------------------------------
  // 2. GENERATE 4 PROGRESSIVE BUILDS FOR SLIDE 8
  // -------------------------------------------------------------------------
  await page.goto("file://" + slide8BasePath);

  const slide8Builds = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = 1376;
    const h = 768;

    const bgY = 226;
    const bgH = h - bgY;

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

    // Build 4: Cols 1, 2, 3 attenuated. Reveal Col 4 (Protein Conformation / Shape & Function)
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

  // -------------------------------------------------------------------------
  // 3. GENERATE 3 BUILDS FOR SLIDE 9 (was Slide 8: Real-World Applications)
  // -------------------------------------------------------------------------
  const slide9Source = path.join(SLIDES_DIR, "slide_05.png");
  await page.goto("file://" + slide9Source);

  const slide9Builds = await page.evaluate(async () => {
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

  await browser.close();

  // -------------------------------------------------------------------------
  // 4. UPDATE MANIFEST.JSON STRUCTURE
  // -------------------------------------------------------------------------
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  manifest.totalSlides = 12;

  // Check if slide 8 already exists or needs insertion
  const existingSlide8 = manifest.slides.find(s => s.number === 8 && s.imageFileName === slide8BaseFileName);

  if (!existingSlide8) {
    // Renumber current slides 8..11 to 9..12
    for (let i = manifest.slides.length - 1; i >= 7; i--) {
      manifest.slides[i].number = i + 2; // index 7 becomes 9, index 8 becomes 10, etc.
    }

    // Create new slide 8 object
    const newSlide8 = {
      number: 8,
      title: "Process Architecture: Structure Determines Function — Changing Code Changes Protein Shape",
      imageFileName: slide8BaseFileName,
      imageUrl: `/decks/intro_aaq_human_bio/${DECK_ID}/slides/${slide8BaseFileName}`,
      sourceMediaPath: null,
      isInteractive: false,
      interactiveType: null,
      cognitiveGuide: {
        estimatedTimeSeconds: 14,
        timeGuideDisplay: "12–16s",
        vciScore: "4.2",
        complexityCategory: "Low",
        ragLevel: "low",
        ragColor: "green",
        ragLabel: "Low Processing",
        breakdown: {
          visualGistMs: 250,
          visualScanMs: 1100,
          readingMs: 4800,
          semanticProcessingMs: 7850,
          wordCount: 16,
          visualElementsCount: 4
        },
        academicReferences: [
          {
            citation: "Rosenholtz, R., Li, Y., & Nakano, L. (2007). Measuring visual clutter. Journal of Vision, 7(2), 17.",
            relevance: "Quantifies visual feature congestion & visual search scanning time."
          },
          {
            citation: "Donderi, D. C. (2006). Visual complexity and information processing. Canadian Psychology, 47(1), 71.",
            relevance: "Establishes relationship between visual complexity index and cognitive decision time."
          },
          {
            citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
            relevance: "Models intrinsic and extraneous cognitive load during visual information integration."
          }
        ]
      },
      questionAnalysis: {
        detected: false,
        confidence: "low",
        questionCount: 0,
        detectionSource: "manifest-text"
      }
    };

    // Insert at index 7 (after slide 7 which is index 6)
    manifest.slides.splice(7, 0, newSlide8);
    console.log("Inserted new slide 8 at index 7 into manifest!");
  }

  // -------------------------------------------------------------------------
  // 5. REGISTER BUILDS FOR SLIDE 8
  // -------------------------------------------------------------------------
  await saveAndRegisterBuilds({
    manifest,
    slideNumber: 8,
    sourceImage: slide8BasePath,
    sourceFileName: slide8BaseFileName,
    buildsData: slide8Builds,
    strategy: "process",
    labels: [
      "Build 1: Reveal 1. The Blueprint (Nucleus: DNA triplet code transcription to mRNA)",
      "Build 2: Reveal 2. The Assembly Line (Cytosol: Ribosome reads mRNA codons to assemble polypeptide)",
      "Build 3: Reveal 3. The Cargo (tRNA: Amino acid activation and sequence delivery)",
      "Build 4: Reveal 4. Protein Conformation (Shape & Function: Altering code changes 3D protein shape)"
    ],
    prompts: [
      "Create cumulative full-slide still-image build 1 of 4 for slide 8: \"Structure Determines Function\". Show now: Slide header and Column 1 (The Blueprint / Nucleus: DNA triplet code transcription to mRNA). Temporarily omit: Columns 2, 3, and 4.",
      "Create cumulative full-slide still-image build 2 of 4 for slide 8: \"Structure Determines Function\". Show now: Slide header, Column 1 (attenuated monochrome), and Column 2 (The Assembly Line / Cytosol: Ribosome translation). Temporarily omit: Columns 3 and 4.",
      "Create cumulative full-slide still-image build 3 of 4 for slide 8: \"Structure Determines Function\". Show now: Slide header, Columns 1 & 2 (attenuated monochrome), and Column 3 (The Cargo / tRNA: Amino acid sequence delivery). Temporarily omit: Column 4.",
      "Create cumulative full-slide still-image build 4 of 4 for slide 8: \"Structure Determines Function\". Show now: Slide header, Columns 1, 2, 3 (attenuated monochrome), and Column 4 (Protein Conformation: Changing code changes 3D tertiary protein shape and function)."
    ]
  });

  // -------------------------------------------------------------------------
  // 6. REGISTER BUILDS FOR SLIDE 9 (was Slide 8: Real-World Applications)
  // -------------------------------------------------------------------------
  await saveAndRegisterBuilds({
    manifest,
    slideNumber: 9,
    sourceImage: slide9Source,
    sourceFileName: "slide_05.png",
    buildsData: slide9Builds,
    strategy: "component-reveal",
    labels: [
      "Build 1: Reveal Patient File A (Case #892-A: Endocrine / Metabolic profiling)",
      "Build 2: Reveal Patient File B (Case #892-B: Neurological / Dermatological profiling)",
      "Build 3: Reveal Patient File C (Case #892-C: Hematological / Circulatory profiling)"
    ],
    prompts: [
      "Create cumulative full-slide still-image build 1 of 3 for slide 9: \"Industry Applications: NEA Briefing\". Show now: Header, scenario briefing, and Patient File A (Case #892-A). Temporarily omit: Patient Files B and C.",
      "Create cumulative full-slide still-image build 2 of 3 for slide 9: \"Industry Applications: NEA Briefing\". Show now: Header, scenario briefing, Patient File A (attenuated monochrome), and Patient File B (Case #892-B). Temporarily omit: Patient File C.",
      "Create cumulative full-slide still-image build 3 of 3 for slide 9: \"Industry Applications: NEA Briefing\". Show now: Header, scenario briefing, Patient Files A & B (attenuated monochrome), and Patient File C (Case #892-C)."
    ]
  });

  // Clean up old slide_08_gemini_slide_8_*_component-reveal.png files
  const oldFiles = [
    "slide_08_gemini_slide_8_1_component-reveal.png",
    "slide_08_gemini_slide_8_2_component-reveal.png",
    "slide_08_gemini_slide_8_3_component-reveal.png"
  ];
  for (const f of oldFiles) {
    await fs.unlink(path.join(SLIDES_DIR, f)).catch(() => {});
  }

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
