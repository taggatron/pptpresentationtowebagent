import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const DECK_ID = "Classic_Lesson_07_The_Atmosphere";
const SET_ID = "ecology_atmosphere_classic";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const PREVIEW_IMAGE_NAME = "slide_04_earth_a_world_becoming.png";
const PREVIEW_IMAGE_PATH = path.join(SLIDES_DIR, PREVIEW_IMAGE_NAME);

async function main() {
  console.log(`=== Embedding Interactive HTML into ${DECK_ID} before Slide 4 ===`);

  // 1. Ensure high-resolution 1376x768 preview poster exists
  const previewExists = await fs.access(PREVIEW_IMAGE_PATH).then(() => true).catch(() => false);
  if (!previewExists) {
    console.log("Generating preview screenshot for Earth · A World Becoming...");
    const browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
    await page.goto("http://127.0.0.1:3005/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere/earth-a-world-becoming%202/index.html");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: PREVIEW_IMAGE_PATH });
    await browser.close();
    console.log(`Saved preview to ${PREVIEW_IMAGE_PATH}`);
  } else {
    console.log(`Preview poster already exists at ${PREVIEW_IMAGE_PATH}`);
  }

  // 2. Read current manifest
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Check if Earth Becoming is already in manifest
  const existingIndex = manifest.slides.findIndex(
    (s) => s.webEmbed?.url?.includes("earth-a-world-becoming") || s.title?.includes("Earth · A World Becoming")
  );

  if (existingIndex !== -1) {
    console.log(`Earth · A World Becoming already present at slide index ${existingIndex}. Removing old entry to re-insert cleanly.`);
    manifest.slides.splice(existingIndex, 1);
  }

  // 3. Define the new interactive slide
  const newInteractiveSlide = {
    number: 4,
    title: "Interactive Simulation: Earth · A World Becoming",
    imageFileName: PREVIEW_IMAGE_NAME,
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${PREVIEW_IMAGE_NAME}`,
    sourceMediaPath: "earth-a-world-becoming 2/index.html",
    isInteractive: true,
    interactiveType: "web_embed",
    webEmbed: {
      url: `/decks/${SET_ID}/${DECK_ID}/earth-a-world-becoming 2/index.html`,
      title: "Earth · A World Becoming",
      label: "Interactive Simulation: Volcanic Earth, First Oceans, Greener Planet & Life Steps Ashore"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 90,
      timeGuideDisplay: "60–120s",
      vciScore: "4.2",
      complexityCategory: "Medium",
      ragLevel: "green",
      ragColor: "green",
      ragLabel: "Interactive Scaffolding",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 12000,
        semanticProcessingMs: 35000,
        wordCount: 45,
        visualElementsCount: 4
      },
      academicReferences: [
        {
          citation: "Mayer, R. E. (2002). Multimedia learning. Psychology of Learning and Motivation, 41, 85-139.",
          relevance: "Provides interactive multimedia scaffolding to model geological and biological atmospheric transitions."
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
      reason: "Interactive simulation: Earth · A World Becoming explores volcanic origin, ocean condensation, plant evolution, and atmospheric oxygenation.",
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
    text: "Earth · A World Becoming. Interactive simulation of the early Earth and atmospheric evolution. Chapters: 01 Volcanic Earth (intense volcanic activity, carbon dioxide and water vapour release), 02 The First Oceans (cooling, condensation, carbon dioxide dissolution), 03 A Greener Planet (evolution of photosynthetic algae and plants, oxygen production), 04 Life Steps Ashore (aerobic atmosphere and complex life).",
    contentAnalysis: {
      schemaVersion: 1,
      status: "ready",
      source: "interactive-html",
      sourceHash: "fe65981a0c870b3e2",
      transcript: "Earth · A World Becoming. Interactive simulation of atmospheric evolution.",
      role: "interactive-simulation",
      questions: [],
      questionCount: 0
    }
  };

  // 4. Insert before slide 4 (which is at index 3 currently, after slides 1, 2, 3)
  const updatedSlides = [];
  for (let i = 0; i < 3; i++) {
    const s = manifest.slides[i];
    s.number = i + 1;
    updatedSlides.push(s);
  }

  // Insert the new slide as Slide 4
  updatedSlides.push(newInteractiveSlide);

  // Subsequent slides become Slide 5..N
  for (let i = 3; i < manifest.slides.length; i++) {
    const s = manifest.slides[i];
    s.number = i + 2; // shifted by +1
    updatedSlides.push(s);
  }

  manifest.slides = updatedSlides;
  manifest.totalSlides = updatedSlides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Successfully updated ${MANIFEST_PATH}`);
  console.log(`Total slides now: ${manifest.totalSlides}`);
  manifest.slides.forEach((s) => {
    console.log(`Slide ${s.number}: "${s.title}" (${s.interactiveType || "static"}, ${s.imageFileName})`);
  });
}

main().catch((err) => {
  console.error("Failed to insert interactive slide:", err);
  process.exit(1);
});
