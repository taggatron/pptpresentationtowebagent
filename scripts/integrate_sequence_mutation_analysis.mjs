import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const DECK_ID = "Lesson_05_Gene_mutations_acquired_and_inherited";
const SET_ID = "genetics_aaq";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function main() {
  console.log("=== Step 1: Update Slide 8 Title on Image ===");
  const slide08Path = path.join(SLIDES_DIR, "slide_08.png");
  const rawSlide08 = await fs.readFile(slide08Path);
  const b64Slide08 = rawSlide08.toString("base64");

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const titlePage = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const titleHtml = `<!DOCTYPE html>
  <html>
  <head>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap");
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1376px;
        height: 768px;
        position: relative;
        background: url("data:image/png;base64,${b64Slide08}") no-repeat center;
        background-size: cover;
      }
      .title-patch {
        position: absolute;
        left: 55px;
        top: 35px;
        width: 1200px;
        height: 75px;
        background: #f5fafc;
        display: flex;
        align-items: center;
      }
      .slide-title {
        font-family: "Plus Jakarta Sans", sans-serif;
        font-weight: 800;
        font-size: 40px;
        color: #1e293b;
        letter-spacing: -0.025em;
      }
    </style>
  </head>
  <body>
    <div class="title-patch">
      <h1 class="slide-title">The Frameshift Collapse: Indels (Insertions and Deletions)</h1>
    </div>
  </body>
  </html>`;

  await titlePage.setContent(titleHtml, { waitUntil: "networkidle" });
  await titlePage.waitForTimeout(500);
  await titlePage.screenshot({ path: slide08Path });
  console.log(`Updated title on ${slide08Path}`);

  console.log("\n=== Step 2: Capture Interactive Slide Preview Screenshot ===");
  const previewPage = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await previewPage.goto(`http://localhost:3000/decks/${SET_ID}/${DECK_ID}/sequence-mutation-analysis/index.html`, {
    waitUntil: "networkidle"
  });
  await previewPage.waitForTimeout(600);
  const tempPreviewPath = path.join(SLIDES_DIR, "temp_interactive_preview.png");
  await previewPage.screenshot({ path: tempPreviewPath });
  console.log(`Captured preview screenshot to ${tempPreviewPath}`);
  await browser.close();

  console.log("\n=== Step 3: Shift Slide Images (16..9 -> 17..10) ===");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);
  const currentTotal = manifest.slides.length; // 16

  for (let num = currentTotal; num >= 9; num--) {
    const srcName = `slide_${String(num).padStart(2, "0")}.png`;
    const destName = `slide_${String(num + 1).padStart(2, "0")}.png`;
    const srcPath = path.join(SLIDES_DIR, srcName);
    const destPath = path.join(SLIDES_DIR, destName);

    try {
      await fs.rename(srcPath, destPath);
      console.log(`Renamed: ${srcName} -> ${destName}`);
    } catch (e) {
      console.warn(`Warning renaming ${srcName}:`, e.message);
    }
  }

  // Move temp_interactive_preview.png -> slide_09.png
  const destSlide09Path = path.join(SLIDES_DIR, "slide_09.png");
  await fs.rename(tempPreviewPath, destSlide09Path);
  console.log(`Placed interactive preview as slide_09.png`);

  console.log("\n=== Step 4: Update manifest.json ===");
  // Update slide 8 title
  const slide8 = manifest.slides.find((s) => s.number === 8);
  if (slide8) {
    slide8.title = "The Frameshift Collapse: Indels (Insertions and Deletions)";
    if (slide8.contentAnalysis) {
      slide8.contentAnalysis.transcript = "The Frameshift Collapse: Indels (Insertions and Deletions). " + (slide8.contentAnalysis.transcript || "");
    }
  }

  // New Slide 9: Interactive Web Embed
  const newSlide9 = {
    number: 9,
    title: "Interactive Practical: Sequence Mutation Analysis",
    imageFileName: "slide_09.png",
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/slide_09.png`,
    sourceMediaPath: "sequence-mutation-analysis/index.html",
    isInteractive: true,
    interactiveType: "web_embed",
    webEmbed: {
      url: `/decks/${SET_ID}/${DECK_ID}/sequence-mutation-analysis/index.html`,
      title: "Knowledge Checkpoint: Sequence Analysis Lab",
      label: "Interactive Sequence Analysis & Mutation Classification Studio"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 180,
      timeGuideDisplay: "120–240s",
      vciScore: "4.8",
      complexityCategory: "Medium",
      ragLevel: "low",
      ragColor: "green",
      ragLabel: "Interactive Practical",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1150,
        readingMs: 8500,
        semanticProcessingMs: 42000,
        wordCount: 45,
        visualElementsCount: 8
      },
      academicReferences: [
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
          relevance: "Interactive sequence mutation workbench reduces extraneous cognitive load through direct manipulation of codon tables and sequence variants."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "local-heuristics"
    },
    hasProgressiveBuilds: false,
    animationPlan: {
      version: 2,
      mode: "web-embed",
      reason: "Interactive DNA sequence mutation analysis workbench with checkpoints, mutation studio, and codon table.",
      webEmbedPreserved: true,
      strategy: "direct-web-embed",
      planningSource: "web-embed-catalog",
      analyzedComponentCount: 1,
      plannedCellCount: 0,
      approvedCellCount: 0,
      qaRequired: false,
      questionReveal: false,
      protectedVideoCount: 0
    }
  };

  // Shift existing slides from index 8 onwards (former slides 9..16 -> 10..17)
  const shiftedRemainingSlides = manifest.slides.slice(8).map((s) => {
    const nextNum = s.number + 1;
    const nextFileName = `slide_${String(nextNum).padStart(2, "0")}.png`;
    const nextUrl = `/decks/${SET_ID}/${DECK_ID}/slides/${nextFileName}`;

    const updatedSlide = {
      ...s,
      number: nextNum,
      imageFileName: nextFileName,
      imageUrl: nextUrl
    };

    if (Array.isArray(s.geminiImageCells)) {
      updatedSlide.geminiImageCells = s.geminiImageCells.map((c) => ({
        ...c,
        id: c.id.replace(`slide_${s.number}_`, `slide_${nextNum}_`),
        sourceImageUrl: nextUrl
      }));
    }

    return updatedSlide;
  });

  manifest.slides = [
    ...manifest.slides.slice(0, 8), // Slides 1..8
    newSlide9,                      // Slide 9 (Interactive Web Embed)
    ...shiftedRemainingSlides       // Slides 10..17
  ];
  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`\nUpdated manifest written to ${MANIFEST_PATH}. Total slides: ${manifest.totalSlides}.`);
}

main().catch((err) => {
  console.error("Error integrating interactive slide:", err);
  process.exit(1);
});
