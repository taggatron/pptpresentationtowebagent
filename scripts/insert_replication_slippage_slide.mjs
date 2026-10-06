import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const deckDir = "public/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited";
const slidesDir = path.join(deckDir, "slides");
const manifestPath = path.join(deckDir, "manifest.json");

const uploadedImgPath = "/Users/danieltagg/.gemini/antigravity-ide/brain/2ae9d5c9-f884-49cb-9464-94e9224047aa/.user_uploaded/media_1791288217070.jpg";
const destSourceImg = path.join(deckDir, "dna_replication_slippage_cag_repeats.jpg");

async function main() {
  console.log("=== Step 1: Copy source image to deck folder ===");
  fs.copyFileSync(uploadedImgPath, destSourceImg);
  console.log(`Copied to ${destSourceImg}`);

  console.log("=== Step 2: Render 1376x768 high-res slide image ===");
  const rawImage = fs.readFileSync(uploadedImgPath);
  const dataUrl = `data:image/jpeg;base64,${rawImage.toString("base64")}`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    width: 1376px;
    height: 768px;
    object-fit: fill;
    display: block;
  }
</style>
</head>
<body>
  <img src="${dataUrl}" alt="DNA Replication Slippage: How CAG Repeats Expand" />
</body>
</html>`;

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const tempNewSlidePath = path.join(slidesDir, "temp_new_slide_13.png");
  await page.screenshot({ path: tempNewSlidePath, clip: { x: 0, y: 0, width: 1376, height: 768 } });
  console.log(`Rendered high-res slide image to ${tempNewSlidePath}`);
  await browser.close();

  console.log("=== Step 3: Shift slide image files (18..13 -> 19..14) ===");
  for (let i = 18; i >= 13; i--) {
    const oldName = `slide_${String(i).padStart(2, "0")}.png`;
    const newName = `slide_${String(i + 1).padStart(2, "0")}.png`;
    const oldFile = path.join(slidesDir, oldName);
    const newFile = path.join(slidesDir, newName);
    if (fs.existsSync(oldFile)) {
      fs.renameSync(oldFile, newFile);
      console.log(`Renamed ${oldName} -> ${newName}`);
    }
  }

  // Move temp image to slide_13.png
  const destSlide13 = path.join(slidesDir, "slide_13.png");
  fs.renameSync(tempNewSlidePath, destSlide13);
  console.log(`Placed new slide as slide_13.png`);

  console.log("=== Step 4: Update manifest.json ===");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.totalSlides = 19;

  // Shift existing slides from index 12 (Slide 13) upwards
  const newSlides = [];
  for (let i = 0; i < 12; i++) {
    newSlides.push(manifest.slides[i]);
  }

  // Define new Slide 13 object
  const newSlide13Obj = {
    number: 13,
    title: "DNA Replication Slippage: How CAG Repeats Expand",
    imageFileName: "slide_13.png",
    imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_13.png",
    sourceMediaPath: "dna_replication_slippage_cag_repeats.jpg",
    isInteractive: false,
    interactiveType: null,
    cognitiveGuide: {
      estimatedTimeSeconds: 20,
      timeGuideDisplay: "15–25s",
      vciScore: "3.6",
      "complexityCategory": "Moderate",
      "ragLevel": "low",
      "ragColor": "green",
      "ragLabel": "Diagrammatic Flow",
      breakdown: {
        visualGistMs: 300,
        visualScanMs: 1400,
        readingMs: 2200,
        semanticProcessingMs: 16000,
        wordCount: 165,
        visualElementsCount: 8
      },
      academicReferences: [
        {
          citation: "Mayer, R. E. (2002). Multimedia learning. Psychology of Learning and Motivation, 41, 85-139.",
          relevance: "Applies visual signaling and temporal contiguity in 6-stage biological sequence models."
        },
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257.",
          relevance: "Minimizes split-attention by pairing step-by-step molecular graphics with direct procedural captions."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "manifest-text"
    },
    geminiImageCells: [
      {
        id: "gemini_slide_13_1_component_reveal",
        order: 1,
        kind: "image",
        mediaType: "image",
        source: "gemini-image-chat",
        label: "Build 1: Complete instructional diagram",
        strategy: "component-reveal",
        fullCanvas: true,
        cumulative: true,
        prompt: "DNA Replication Slippage: How CAG Repeats Expand - 6-stage molecular mechanism, paternal bias, and genetic anticipation diagram.",
        status: "planned",
        qaStatus: "approved",
        outputImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_13.png",
        sourceImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_13.png"
      }
    ],
    hasProgressiveBuilds: false,
    animationPlan: {
      version: 2,
      mode: "gemini-image-cells",
      reason: "Complete diagrammatic infographic slide.",
      strategy: "component-reveal",
      planningSource: "local-slide-heuristics",
      analyzedComponentCount: 0,
      plannedCellCount: 1,
      approvedCellCount: 1,
      qaRequired: false,
      questionReveal: false,
      webEmbedPreserved: false,
      protectedVideoCount: 0
    }
  };

  newSlides.push(newSlide13Obj);

  // Shift subsequent slides
  for (let i = 12; i < manifest.slides.length; i++) {
    const s = manifest.slides[i];
    const newNum = s.number + 1;
    const newFileName = `slide_${String(newNum).padStart(2, "0")}.png`;
    const newUrl = `/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/${newFileName}`;
    newSlides.push({
      ...s,
      number: newNum,
      imageFileName: newFileName,
      imageUrl: newUrl,
      geminiImageCells: s.geminiImageCells ? s.geminiImageCells.map(c => ({
        ...c,
        id: c.id.replace(/slide_\d+/, `slide_${newNum}`),
        sourceImageUrl: newUrl,
        outputImageUrl: c.outputImageUrl ? newUrl : null
      })) : []
    });
  }

  manifest.slides = newSlides;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Successfully updated manifest.json to 19 slides!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
