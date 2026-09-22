import fs from "node:fs/promises";
import path from "node:path";

const DECK_ID = "Classic_Lesson_07_The_Atmosphere";
const SET_ID = "ecology_atmosphere_classic";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const PREVIEW_IMAGE_NAME = "slide_06_organic_laboratory.png";

async function main() {
  console.log(`=== Inserting Organic Laboratory Interactive Slide into ${DECK_ID} ===`);

  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Find the target slide that uses slide_05.png
  const targetIndex = manifest.slides.findIndex(
    (s) => s.imageFileName === "slide_05.png" || s.imageUrl?.includes("slide_05.png")
  );

  if (targetIndex === -1) {
    throw new Error("Could not find slide with slide_05.png in manifest!");
  }

  console.log(`Found slide with slide_05.png at current index ${targetIndex} (Slide ${manifest.slides[targetIndex].number}).`);

  // Remove any preexisting organic-laboratory entry if already inserted
  const existingOrgIndex = manifest.slides.findIndex(
    (s) => s.webEmbed?.url?.includes("organic-laboratory") || s.title?.includes("Organic — From Chemistry to Cells")
  );
  if (existingOrgIndex !== -1) {
    console.log(`Removing existing organic-laboratory slide at index ${existingOrgIndex}`);
    manifest.slides.splice(existingOrgIndex, 1);
  }

  // Recalculate target index after any cleanup
  const finalTargetIndex = manifest.slides.findIndex(
    (s) => s.imageFileName === "slide_05.png" || s.imageUrl?.includes("slide_05.png")
  );

  const newOrganicLabSlide = {
    number: finalTargetIndex + 1,
    title: "Interactive Laboratory: Organic — From Chemistry to Cells (Miller-Urey)",
    imageFileName: PREVIEW_IMAGE_NAME,
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${PREVIEW_IMAGE_NAME}`,
    sourceMediaPath: "slides/organic-laboratory 2/index.html",
    isInteractive: true,
    interactiveType: "web_embed",
    webEmbed: {
      url: `/decks/${SET_ID}/${DECK_ID}/slides/organic-laboratory 2/index.html`,
      title: "Organic · The Living Laboratory (Miller-Urey Simulation)",
      label: "Interactive Miller-Urey Experiment & Prebiotic Synthesis Simulation"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 120,
      timeGuideDisplay: "90–150s",
      vciScore: "4.8",
      complexityCategory: "Medium",
      ragLevel: "green",
      ragColor: "green",
      ragLabel: "Interactive Practical Scaffolding",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 22000,
        semanticProcessingMs: 45000,
        wordCount: 75,
        visualElementsCount: 5
      },
      academicReferences: [
        {
          citation: "Miller, S. L. (1953). A production of amino acids under possible primitive earth conditions. Science, 117(3046), 528-529.",
          relevance: "Empirical foundation for prebiotic synthesis of organic compounds from early atmospheric gases."
        },
        {
          citation: "Mayer, R. E. (2002). Multimedia learning. Psychology of Learning and Motivation, 41, 85-139.",
          relevance: "Interactive exploration of reaction vessels reduces extraneous cognitive load in biochemical pathway learning."
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
      reason: "Interactive simulation: Organic — The Living Laboratory recreates the Miller-Urey experiment demonstrating prebiotic synthesis from early atmospheric gases.",
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
    text: "Organic · The Living Laboratory. Miller-Urey Experiment: From chemistry to cells. Investigate how early atmospheric gases (H2O water vapour, CH4 methane, NH3 ammonia, H2 hydrogen) subjected to electrical discharge / lightning produced fundamental organic molecules (amino acids, urea) that formed the prebiotic building blocks for early cellular life.",
    contentAnalysis: {
      schemaVersion: 1,
      status: "ready",
      source: "interactive-html",
      sourceHash: "704c2e1a0c872e1ed",
      transcript: "Organic · The Living Laboratory. Miller-Urey experiment and prebiotic organic synthesis.",
      role: "interactive-simulation",
      questions: [],
      questionCount: 0
    }
  };

  // Insert before the target slide
  manifest.slides.splice(finalTargetIndex, 0, newOrganicLabSlide);

  // Renumber all slides sequentially 1..N
  manifest.slides.forEach((slide, idx) => {
    slide.number = idx + 1;
  });

  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Successfully inserted slide and saved ${MANIFEST_PATH}`);
  console.log(`Total slides: ${manifest.totalSlides}`);
  manifest.slides.forEach((s) => {
    console.log(`Slide ${s.number}: "${s.title}" (type: ${s.interactiveType || "static"}, image: ${s.imageFileName})`);
  });
}

main().catch((err) => {
  console.error("Error inserting slide:", err);
  process.exit(1);
});
