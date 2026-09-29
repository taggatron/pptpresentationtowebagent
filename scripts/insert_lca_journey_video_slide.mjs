import fs from "node:fs/promises";
import path from "node:path";

const DECK_ID = "Classic_Lesson_11_Lifecycle_analysis";
const SET_ID = "ecology_atmosphere_classic";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

const VIDEO_NAME = "lca_journey_of_a_phone_animation.mp4";
const POSTER_NAME = "slide_13_lca_journey_of_a_phone_poster.png";

const VIDEO_URL = `/decks/${SET_ID}/${DECK_ID}/slides/${VIDEO_NAME}`;
const POSTER_URL = `/decks/${SET_ID}/${DECK_ID}/slides/${POSTER_NAME}`;

async function main() {
  console.log(`=== Inserting LCA Phone Journey Video Slide into ${DECK_ID} after Slide 12 ===`);

  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Check if already inserted
  const existingIdx = manifest.slides.findIndex(
    (s) => s.videoUrl?.includes("lca_journey_of_a_phone_animation") || s.title?.includes("Journey of a Phone")
  );
  if (existingIdx !== -1) {
    console.log(`Removing existing entry at index ${existingIdx} to re-insert cleanly.`);
    manifest.slides.splice(existingIdx, 1);
  }

  // Find slide 12 ("The 4 Stages of an LCA: Flow Diagram" / image slide_13.png)
  const slide12Index = manifest.slides.findIndex(
    (s) => s.imageFileName === "slide_13.png" || s.title?.includes("The 4 Stages of an LCA")
  );

  if (slide12Index === -1) {
    throw new Error("Could not find Slide 12 (slide_13.png) in manifest!");
  }

  console.log(`Found Slide 12 at index ${slide12Index}: "${manifest.slides[slide12Index].title}"`);

  const newVideoSlide = {
    number: 13,
    title: "Video Case Study: 4 Stages of an LCA – The Journey of a Phone",
    imageFileName: POSTER_NAME,
    imageUrl: POSTER_URL,
    posterUrl: POSTER_URL,
    videoUrl: VIDEO_URL,
    sourceMediaPath: `slides/${VIDEO_NAME}`,
    isInteractive: false,
    interactiveType: null,
    hasProgressiveBuilds: true,
    animationPlan: {
      version: 2,
      mode: "protected-video",
      reason: "Complete 60-second video case study illustrating the cradle-to-grave stages of a smartphone lifecycle: raw material extraction, manufacturing, distribution & use, disposal, and circular recycling.",
      protectedVideoCount: 1
    },
    progressiveBuilds: [
      {
        id: "slide_13_video_build_1",
        version: 1,
        kind: "video",
        label: "Build 1: Video Case Study (The Journey of a Phone · 60s)",
        videoUrl: VIDEO_URL,
        imageUrl: POSTER_URL,
        posterUrl: POSTER_URL
      }
    ],
    history: [
      {
        id: "ver_video_full",
        label: "Video Case Study: The Journey of a Phone",
        videoUrl: VIDEO_URL,
        imageUrl: POSTER_URL
      }
    ],
    text: "LCA: The Journey of a Phone\n1. Raw Material Extraction: Excavator digging basic metal ores and crude oil\n2. Manufacturing: Conveyor assembling phones and components\n3. Distribution & Use: Customer operation and daily electrical energy consumption\n4. Disposal & Recycling: Discarded electronics and circular recycling loop",
    cognitiveGuide: {
      estimatedTimeSeconds: 60,
      timeGuideDisplay: "60s",
      vciScore: "6.2",
      complexityCategory: "Medium",
      ragLevel: "green",
      ragColor: "green",
      ragLabel: "Video Case Study",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 6000,
        semanticProcessingMs: 52700,
        wordCount: 32,
        visualElementsCount: 6
      },
      academicReferences: [
        {
          citation: "Mayer, R. E. (2002). Multimedia learning. Psychology of Learning and Motivation, 41, 85-139.",
          relevance: "Dynamic animation of multi-stage lifecycles reinforces temporal and causal schema formation in environmental science."
        },
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257.",
          relevance: "Animated transitions between lifecycle stages reduce cognitive load compared to split static diagrams."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "local-heuristics"
    },
    contentAnalysis: {
      schemaVersion: 1,
      status: "ready",
      source: "joined-video-case-study",
      sourceHash: "lca-journey-of-phone-60s-v1",
      transcript: "LCA: The Journey of a Phone. Complete 6-part animated case study illustrating cradle-to-grave stages: raw material extraction, manufacturing, distribution and use, disposal in landfill, and closing the circular loop with recycling.",
      role: "instructional-video",
      questions: [],
      questionCount: 0
    }
  };

  // Insert AFTER slide 12 (at index slide12Index + 1)
  const insertIndex = slide12Index + 1;
  manifest.slides.splice(insertIndex, 0, newVideoSlide);

  // Renumber all slides sequentially 1..N
  manifest.slides.forEach((slide, idx) => {
    slide.number = idx + 1;
  });
  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Successfully inserted slide after Slide 12 (at index ${insertIndex}). Total slides: ${manifest.totalSlides}`);
}

main().catch((err) => {
  console.error("Failed to insert video slide:", err);
  process.exit(1);
});
