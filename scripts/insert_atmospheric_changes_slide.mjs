import fs from "node:fs/promises";
import path from "node:path";

const DECK_ID = "Classic_Lesson_07_The_Atmosphere";
const SET_ID = "ecology_atmosphere_classic";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const SLIDE_IMAGE_NAME = "slide_04_atmospheric_changes.png";

async function main() {
  console.log(`=== Inserting Atmospheric Changes Slide into ${DECK_ID} as Slide 4 ===`);

  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Check if Atmospheric Changes is already in manifest
  const existingIndex = manifest.slides.findIndex(
    (s) => s.imageFileName === SLIDE_IMAGE_NAME || s.title?.includes("Atmospheric Changes")
  );

  if (existingIndex !== -1) {
    console.log(`Atmospheric Changes already present at slide index ${existingIndex}. Removing to re-insert cleanly.`);
    manifest.slides.splice(existingIndex, 1);
  }

  const newSlide = {
    number: 4,
    title: "Atmospheric Changes: Planetary Evolution Overview",
    imageFileName: SLIDE_IMAGE_NAME,
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${SLIDE_IMAGE_NAME}`,
    sourceMediaPath: "ppt/media/atmospheric_changes.png",
    isInteractive: false,
    interactiveType: null,
    text: "ATMOSPHERIC CHANGES\nThe atmosphere has gone through several changes:\n- Early CO2 and water dense atmosphere\n- Formation of oceans + dissolving of CO2\n- Production of nitrogen\n- Evolution of green plants\n- Evolution of more complex organisms...",
    contentAnalysis: {
      schemaVersion: 1,
      status: "ready",
      source: "gemini-image-chat",
      sourceHash: "atmospheric_changes_slide_v1",
      transcript: "Atmospheric Changes: The atmosphere has gone through several changes: Early CO2 and water dense atmosphere; Formation of oceans + dissolving of CO2; Production of nitrogen; Evolution of green plants; Evolution of more complex organisms...",
      role: "instructional-content",
      questions: [],
      questionCount: 0
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 45,
      timeGuideDisplay: "35–55s",
      vciScore: "4.5",
      complexityCategory: "Medium",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Direct Instruction",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 18000,
        semanticProcessingMs: 12000,
        wordCount: 35,
        visualElementsCount: 3
      },
      academicReferences: [
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
          relevance: "Provides structured sequential overview prior to interactive simulation."
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
      mode: "static-overview",
      reason: "Direct visual anchor introducing the chronological sequence of atmospheric evolution.",
      strategy: "static-overview",
      planningSource: "gemini-slide-sequencer",
      analyzedComponentCount: 0,
      plannedCellCount: 0,
      approvedCellCount: 0,
      qaRequired: false,
      questionReveal: false,
      webEmbedPreserved: false,
      protectedVideoCount: 0
    }
  };

  // Find position before "Earth · A World Becoming" (which is currently Slide 4, index 3)
  // Rebuild the slides array
  const updatedSlides = [];
  
  // Slides 1, 2, 3
  for (let i = 0; i < 3; i++) {
    const s = manifest.slides[i];
    s.number = i + 1;
    updatedSlides.push(s);
  }

  // Slide 4: New slide
  updatedSlides.push(newSlide);

  // Remaining slides (Slide 5..13)
  for (let i = 3; i < manifest.slides.length; i++) {
    const s = manifest.slides[i];
    s.number = updatedSlides.length + 1;
    updatedSlides.push(s);
  }

  // Normalize numbers strictly 1..N
  updatedSlides.forEach((s, idx) => {
    s.number = idx + 1;
  });

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
  console.error("Failed to insert Atmospheric Changes slide:", err);
  process.exit(1);
});
