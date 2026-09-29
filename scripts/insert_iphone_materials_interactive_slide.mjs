import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const DECK_ID = "Classic_Lesson_11_Lifecycle_analysis";
const SET_ID = "ecology_atmosphere_classic";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const PREVIEW_IMAGE_NAME = "slide_20_inside_iphone_interactive.png";
const PREVIEW_IMAGE_PATH = path.join(SLIDES_DIR, PREVIEW_IMAGE_NAME);

async function main() {
  console.log(`=== Integrating Inside iPhone Interactive HTML into ${DECK_ID} before Slide 20 ===`);

  // 1. Ensure high-resolution 1920x1080 preview poster exists
  const previewExists = await fs.access(PREVIEW_IMAGE_PATH).then(() => true).catch(() => false);
  if (!previewExists) {
    console.log("Generating preview screenshot for Inside iPhone · Materials & Carbon...");
    const browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto("http://127.0.0.1:3000/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_analysis/interactivehtmls/index.html", {
      waitUntil: "networkidle"
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: PREVIEW_IMAGE_PATH });
    await browser.close();
    console.log(`Saved preview to ${PREVIEW_IMAGE_PATH}`);
  } else {
    console.log(`Preview poster already exists at ${PREVIEW_IMAGE_PATH}`);
  }

  // 2. Read current manifest
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Check if Inside iPhone is already in manifest
  const existingIndex = manifest.slides.findIndex(
    (s) => s.webEmbed?.url?.includes("interactivehtmls") || s.title?.includes("Inside iPhone")
  );

  if (existingIndex !== -1) {
    console.log(`Inside iPhone interactive already present at slide index ${existingIndex}. Removing old entry to re-insert cleanly.`);
    manifest.slides.splice(existingIndex, 1);
  }

  // 3. Define the new interactive slide
  const newInteractiveSlide = {
    number: 20,
    title: "Interactive Exploration: Inside iPhone · Materials & Carbon Footprint",
    imageFileName: PREVIEW_IMAGE_NAME,
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${PREVIEW_IMAGE_NAME}`,
    sourceMediaPath: "interactivehtmls/index.html",
    isInteractive: true,
    interactiveType: "web_embed",
    webEmbed: {
      url: `/decks/${SET_ID}/${DECK_ID}/interactivehtmls/index.html`,
      title: "Inside iPhone · Materials & Carbon Lifecycle Explorer",
      label: "Interactive Lifecycle Explorer: Component Cutaways, Material Mass & Carbon Trends"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 120,
      timeGuideDisplay: "90–150s",
      vciScore: "5.5",
      complexityCategory: "Medium",
      ragLevel: "green",
      ragColor: "green",
      ragLabel: "Interactive Practical Scaffolding",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 18000,
        semanticProcessingMs: 42000,
        wordCount: 65,
        visualElementsCount: 6
      },
      academicReferences: [
        {
          citation: "Mayer, R. E. (2002). Multimedia learning. Psychology of Learning and Motivation, 41, 85-139.",
          relevance: "Interactive exploration of cradle-to-grave component impacts enhances conceptual synthesis in lifecycle assessment."
        },
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257.",
          relevance: "Visual dissection and isolated metric analysis prevent cognitive overload when evaluating multi-material electronics."
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
      reason: "Interactive lifecycle investigation: Inside iPhone explores material composition, cradle-to-grave carbon footprint, and generational lifecycle trends across device components.",
      webEmbedPreserved: true,
      strategy: "direct-web-embed",
      planningSource: "web-embed-catalog",
      analyzedComponentCount: 1,
      plannedCellCount: 0,
      approvedCellCount: 0,
      qaRequired: false,
      questionReveal: false,
      protectedVideoCount: 0
    },
    text: "Inside iPhone · Materials & Carbon Lifecycle Explorer. Interactive cradle-to-grave analysis across iPhone models (iPhone Xs to iPhone 18 Pro). Dissect smartphone components (battery, circuit boards, display, enclosure, glass) to evaluate lifecycle greenhouse gas emissions (production, use, transport, recycling) and material mass trends.",
    contentAnalysis: {
      schemaVersion: 1,
      status: "ready",
      source: "interactive-html",
      sourceHash: "iphone-materials-carbon-v1",
      transcript: "Inside iPhone: Materials and Carbon Lifecycle Explorer. Cradle-to-grave environmental impact of smartphone components across multiple generations.",
      role: "interactive-simulation",
      questions: [],
      questionCount: 0
    }
  };

  // 4. Find the target slide before which to insert:
  // "just before slide 20" (Comparative Analysis: Materials & Energy, currently slide_20.png)
  const targetIndex = manifest.slides.findIndex(
    (s) => s.imageFileName === "slide_20.png" || s.title?.includes("Comparative Analysis")
  );

  if (targetIndex === -1) {
    throw new Error("Could not find target slide 20 (slide_20.png / Comparative Analysis) in manifest!");
  }

  console.log(`Inserting before slide at index ${targetIndex}: "${manifest.slides[targetIndex].title}" (currently Slide ${manifest.slides[targetIndex].number})`);

  // Insert before target slide
  manifest.slides.splice(targetIndex, 0, newInteractiveSlide);

  // Renumber all slides sequentially 1..N
  manifest.slides.forEach((slide, idx) => {
    slide.number = idx + 1;
  });

  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Successfully inserted slide and saved ${MANIFEST_PATH}`);
  console.log(`Total slides now: ${manifest.totalSlides}`);
  manifest.slides.forEach((s) => {
    console.log(`Slide ${s.number}: "${s.title}" (type: ${s.interactiveType || "static"}, image: ${s.imageFileName})`);
  });
}

main().catch((err) => {
  console.error("Failed to insert interactive slide:", err);
  process.exit(1);
});
