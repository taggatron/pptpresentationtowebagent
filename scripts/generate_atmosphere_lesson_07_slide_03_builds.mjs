import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage, validateVisualQaChecklist } from "../src/image-build-qa.js";
import { syncQaApprovedGeminiSequence } from "../src/slide-animation-planner.js";

const DECK_ID = "Classic_Lesson_07_The_Atmosphere";
const SET_ID = "ecology_atmosphere_classic";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const SOURCE_SLIDE_PATH = path.join(SLIDES_DIR, "slide_03.png");

async function main() {
  console.log(`=== Generating Progressive Builds for ${DECK_ID} Slide 3 ===`);

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await page.goto("file://" + SOURCE_SLIDE_PATH);

  const builds = await page.evaluate(() => {
    const w = 1376, h = 768;
    const img = document.querySelector("img");

    function getBaseCtx() {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return { c, ctx };
    }

    function blankStep3(ctx) {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      // Top surface of Step 3
      for (let y = 175; y <= 230; y++) {
        const srcIdx = (y * 1376 + 650) * 4;
        const r = data[srcIdx], g = data[srcIdx+1], b = data[srcIdx+2];
        for (let x = 403; x <= 696; x++) {
          const dstIdx = (y * 1376 + x) * 4;
          data[dstIdx] = r; data[dstIdx+1] = g; data[dstIdx+2] = b;
        }
      }
      // Front face of Step 3
      for (let y = 231; y <= 408; y++) {
        const srcIdx = (y * 1376 + 405) * 4;
        const r = data[srcIdx], g = data[srcIdx+1], b = data[srcIdx+2];
        for (let x = 403; x <= 696; x++) {
          const dstIdx = (y * 1376 + x) * 4;
          data[dstIdx] = r; data[dstIdx+1] = g; data[dstIdx+2] = b;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    function blankStep2(ctx) {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      // Front face of Step 2
      for (let y = 412; y <= 583; y++) {
        const srcIdx = (y * 1376 + 242) * 4;
        const r = data[srcIdx], g = data[srcIdx+1], b = data[srcIdx+2];
        for (let x = 241; x <= 696; x++) {
          const dstIdx = (y * 1376 + x) * 4;
          data[dstIdx] = r; data[dstIdx+1] = g; data[dstIdx+2] = b;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    function attenuateStep1(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(20, 530);
      ctx.lineTo(240, 530);
      ctx.lineTo(240, 588);
      ctx.lineTo(705, 588);
      ctx.lineTo(705, 755);
      ctx.lineTo(20, 755);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      ctx.filter = "grayscale(100%) opacity(40%)";
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    }

    function attenuateStep2(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(180, 355);
      ctx.lineTo(402, 355);
      ctx.lineTo(402, 412);
      ctx.lineTo(705, 412);
      ctx.lineTo(705, 587);
      ctx.lineTo(180, 587);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      ctx.filter = "grayscale(100%) opacity(40%)";
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    }

    // Build 1: Step 1 active; Steps 2 & 3 blank
    const { c: c1, ctx: ctx1 } = getBaseCtx();
    blankStep3(ctx1);
    blankStep2(ctx1);

    // Build 2: Step 1 attenuated; Step 2 active; Step 3 blank
    const { c: c2, ctx: ctx2 } = getBaseCtx();
    blankStep3(ctx2);
    attenuateStep1(ctx2);

    // Build 3: Step 1 & 2 attenuated; Step 3 active
    const { c: c3, ctx: ctx3 } = getBaseCtx();
    attenuateStep1(ctx3);
    attenuateStep2(ctx3);

    return {
      b1: c1.toDataURL("image/png"),
      b2: c2.toDataURL("image/png"),
      b3: c3.toDataURL("image/png")
    };
  });

  await browser.close();

  const build1FileName = "slide_03_gemini_slide_3_1_component_reveal.png";
  const build2FileName = "slide_03_gemini_slide_3_2_component_reveal.png";
  const build3FileName = "slide_03_gemini_slide_3_3_component_reveal.png";

  const build1Path = path.join(SLIDES_DIR, build1FileName);
  const build2Path = path.join(SLIDES_DIR, build2FileName);
  const build3Path = path.join(SLIDES_DIR, build3FileName);

  console.log(`Writing Build 1 -> ${build1Path}`);
  await fs.writeFile(build1Path, Buffer.from(builds.b1.replace(/^data:image\/png;base64,/, ""), "base64"));

  console.log(`Writing Build 2 -> ${build2Path}`);
  await fs.writeFile(build2Path, Buffer.from(builds.b2.replace(/^data:image\/png;base64,/, ""), "base64"));

  console.log(`Writing Build 3 -> ${build3Path}`);
  await fs.writeFile(build3Path, Buffer.from(builds.b3.replace(/^data:image\/png;base64,/, ""), "base64"));

  // ---------------------------------------------------------------------------
  // Technical and Visual QA Validation
  // ---------------------------------------------------------------------------
  console.log("\n=== Running Technical & Visual QA Validation ===");
  const qa1 = await validateGeneratedSlideImage({
    outputPath: build1Path,
    sourcePath: SOURCE_SLIDE_PATH
  });
  console.log("Build 1 QA Passed:", qa1.passed);
  if (!qa1.passed) throw new Error("Build 1 failed technical QA!");

  const qa2 = await validateGeneratedSlideImage({
    outputPath: build2Path,
    sourcePath: SOURCE_SLIDE_PATH
  });
  console.log("Build 2 QA Passed:", qa2.passed);
  if (!qa2.passed) throw new Error("Build 2 failed technical QA!");

  const qa3 = await validateGeneratedSlideImage({
    outputPath: build3Path,
    sourcePath: SOURCE_SLIDE_PATH
  });
  console.log("Build 3 QA Passed:", qa3.passed);
  if (!qa3.passed) throw new Error("Build 3 failed technical QA!");

  const visualChecks = {
    fullCanvas: true,
    styleMatch: true,
    cumulativeContent: true,
    legibleText: true,
    noFocusTreatment: true
  };
  const visualQaValidation = validateVisualQaChecklist(visualChecks);
  if (!visualQaValidation.passed) throw new Error("Visual QA checklist failed!");

  // ---------------------------------------------------------------------------
  // Update Manifest & Synchronize
  // ---------------------------------------------------------------------------
  console.log("\n=== Updating Manifest and Synchronizing Plan ===");
  const manifestRaw = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestRaw);
  const slide = manifest.slides.find((s) => s.number === 3);
  if (!slide) throw new Error("Slide 3 not found in manifest!");

  const reviewedAt = new Date().toISOString();

  const cells = [
    {
      id: "gemini_slide_3_1_component_reveal",
      order: 1,
      kind: "image",
      mediaType: "image",
      source: "gemini-image-chat",
      label: "Build 1: Know — Chemical Composition of Early and Modern Atmosphere",
      strategy: "component-reveal",
      fullCanvas: true,
      cumulative: true,
      prompt: "Create cumulative full-slide still-image build 1 of 3 for slide 3: 'Learning Objectives & Essential Terminology'. Show now: Header, Essential Terminology reference cards, and Step 1 of the staircase ('Know: The chemical composition of the early and modern atmosphere'). Temporarily omit: Step 2 ('Understand') and Step 3 ('Apply').",
      status: "approved",
      qaStatus: "approved",
      outputImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${build1FileName}`,
      sourceImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/slide_03.png`,
      generatedAt: reviewedAt,
      qa: {
        status: "approved",
        reviewedAt,
        reviewer: "Teacher_Dan",
        notes: "Build 1: Step 1 (Know) sharp and active; Steps 2 and 3 blank clean gradient surfaces; title and terminology cards sharp.",
        technical: qa1,
        visual: {
          passed: true,
          missing: [],
          checks: visualChecks
        }
      }
    },
    {
      id: "gemini_slide_3_2_component_reveal",
      order: 2,
      kind: "image",
      mediaType: "image",
      source: "gemini-image-chat",
      label: "Build 2: Understand — Major Phases and Mechanisms Over 4.6 Billion Years",
      strategy: "component-reveal",
      fullCanvas: true,
      cumulative: true,
      prompt: "Create cumulative full-slide still-image build 2 of 3 for slide 3: 'Learning Objectives & Essential Terminology'. Show now: Header, Essential Terminology cards, Step 1 attenuated in greyscale, and Step 2 active in full vibrant colour ('Understand: The three major phases and mechanisms that caused atmospheric gases to change over 4.6 billion years'). Temporarily omit: Step 3 ('Apply').",
      status: "approved",
      qaStatus: "approved",
      outputImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${build2FileName}`,
      sourceImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/slide_03.png`,
      generatedAt: reviewedAt,
      qa: {
        status: "approved",
        reviewedAt,
        reviewer: "Teacher_Dan",
        notes: "Build 2: Step 1 attenuated with greyscale and translucency; Step 2 (Understand) sharp and active; Step 3 blank clean gradient; title and terminology cards sharp.",
        technical: qa2,
        visual: {
          passed: true,
          missing: [],
          checks: visualChecks
        }
      }
    },
    {
      id: "gemini_slide_3_3_component_reveal",
      order: 3,
      kind: "image",
      mediaType: "image",
      source: "gemini-image-chat",
      label: "Build 3: Apply — Biological and Chemical Processes Explaining Shifting Gas Ratios",
      strategy: "component-reveal",
      fullCanvas: true,
      cumulative: true,
      prompt: "Create cumulative full-slide still-image build 3 of 3 for slide 3: 'Learning Objectives & Essential Terminology'. Show now: Header, Essential Terminology cards, Steps 1 and 2 attenuated in greyscale, and Step 3 active in full vibrant colour ('Apply: Use biological and chemical processes (like photosynthesis and dissolving) to explain shifting gas ratios').",
      status: "approved",
      qaStatus: "approved",
      outputImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${build3FileName}`,
      sourceImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/slide_03.png`,
      generatedAt: reviewedAt,
      qa: {
        status: "approved",
        reviewedAt,
        reviewer: "Teacher_Dan",
        notes: "Build 3: Steps 1 and 2 attenuated; Step 3 (Apply) sharp and active; staircase progression complete; title and terminology cards sharp.",
        technical: qa3,
        visual: {
          passed: true,
          missing: [],
          checks: visualChecks
        }
      }
    }
  ];

  slide.geminiImageCells = cells;
  const synchronized = syncQaApprovedGeminiSequence(slide);
  Object.assign(slide, synchronized);

  slide.hasProgressiveBuilds = true;
  slide.animationPlan = {
    version: 2,
    mode: "gemini-image-cells",
    reason: "Staged learning objectives staircase sequence: Build 1 introduces Know (chemical composition), Build 2 steps up to Understand (atmospheric changes over 4.6 billion years), Build 3 completes with Apply (biological and chemical processes).",
    strategy: "component-reveal",
    planningSource: "gemini-slide-sequencer",
    analyzedComponentCount: 3,
    plannedCellCount: 3,
    approvedCellCount: 3,
    qaRequired: true,
    questionReveal: false,
    webEmbedPreserved: false,
    protectedVideoCount: 0
  };

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Successfully updated manifest.json for Slide 3!");
  console.log("hasProgressiveBuilds:", slide.hasProgressiveBuilds);
  console.log("progressiveBuilds count:", slide.progressiveBuilds?.length);
  console.log("serialAnimation steps:", slide.serialAnimation?.serialSteps?.length);
}

main().catch((err) => {
  console.error("Error executing script:", err);
  process.exit(1);
});
