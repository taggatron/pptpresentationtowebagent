import fs from "node:fs/promises";
import path from "node:path";
import { generateSlideInteractivity } from "../src/gemini-segmenter.js";

const PUBLIC_DECKS_DIR = path.resolve("./public/decks/ecology_atmosphere_classic");
const DECK_ID = "Classic_Lesson_12_Recycling";
const MANIFEST_PATH = path.join(PUBLIC_DECKS_DIR, DECK_ID, "manifest.json");

const SLIDE_TITLES = {
  1: "12. Recycling",
  2: "Starter Activity: Knowledge Retrieval",
  3: "Earth’s Finite Resources",
  4: "The Sustainability Hierarchy",
  5: "The Mechanics: Recycling Metals",
  6: "The Mechanics: Recycling Plastics",
  7: "Checkpoint: Industrial Workflows",
  8: "The 'Why': Extraction vs. Recycling",
  9: "Energy Savings: By The Numbers",
  10: "Evaluating Decisions: Is Recycling Always Viable?",
  11: "Checkpoint: Pair-and-Share Evaluation",
  12: "The Human Element: Behavior & Design",
  13: "Summary: The Circular Economy",
  14: "Plenary: Concept Match",
};

async function main() {
  console.log(`[Finalizer] Loading manifest: ${MANIFEST_PATH}`);
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  manifest.title = "12. Recycling";
  manifest.slideSet = "ecology_atmosphere_classic";

  for (const slide of manifest.slides) {
    if (SLIDE_TITLES[slide.number]) {
      slide.title = SLIDE_TITLES[slide.number];
    }
  }

  // Configure Slide 2 Starter Grid
  if (manifest.slides.length >= 2) {
    const slide2 = manifest.slides[1];
    slide2.title = "Starter Activity: Knowledge Retrieval";
    slide2.isInteractive = true;
    slide2.interactiveType = "question_reveal";

    slide2.interactiveCells = [
      {
        id: "reveal_2_cell_1",
        question: "1. Name two finite resources extracted from the Earth's crust.",
        expectedAnswer: "Crude oil, metal ores",
        bounds: { x: 3.8, y: 8.5, w: 29.8, h: 40.5 },
        answerBounds: { x: 5.3, y: 39.4, w: 26.6, h: 5.7 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_2_cell_2",
        question: "2. What physical process separates crude oil into useful fractions?",
        expectedAnswer: "Fractional distillation",
        bounds: { x: 35.1, y: 8.5, w: 29.8, h: 40.5 },
        answerBounds: { x: 36.7, y: 39.4, w: 26.6, h: 5.7 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_2_cell_3",
        question: "3. What greenhouse gas is produced when carbon extracts iron from its ore?",
        expectedAnswer: "Carbon dioxide (CO2)",
        bounds: { x: 66.5, y: 8.5, w: 29.8, h: 40.5 },
        answerBounds: { x: 68.1, y: 39.4, w: 26.7, h: 5.7 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_2_cell_4",
        question: "4. Crude oil is the main raw material (feedstock) for which industry?",
        expectedAnswer: "Petrochemical industry",
        bounds: { x: 3.8, y: 53.0, w: 29.8, h: 40.5 },
        answerBounds: { x: 5.3, y: 84.2, w: 26.6, h: 5.7 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_2_cell_5",
        question: "5. Why must aluminium be extracted using electrolysis?",
        expectedAnswer: "It is more reactive than carbon",
        bounds: { x: 35.1, y: 53.0, w: 29.8, h: 40.5 },
        answerBounds: { x: 36.7, y: 84.2, w: 26.6, h: 5.7 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_2_cell_6",
        question: "6. Name one major environmental problem caused by open-pit mining.",
        expectedAnswer: "Habitat destruction / pollution",
        bounds: { x: 66.5, y: 53.0, w: 29.8, h: 40.5 },
        answerBounds: { x: 68.1, y: 84.2, w: 26.7, h: 5.7 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      }
    ];
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`[Finalizer] Saved updated titles and interactive cells to ${MANIFEST_PATH}`);

  console.log(`[Finalizer] Running cognitive segmentation and load metrics...`);
  await generateSlideInteractivity(DECK_ID, PUBLIC_DECKS_DIR);
  console.log(`[Finalizer] Cognitive segmentation complete!`);

  // Update NotebookLMagent checkpoint
  const checkpointPath = path.resolve("../NotebookLMagent/.state/checkpoint_ecology_atmosphere_sequence_classic.json");
  try {
    const cp = JSON.parse(await fs.readFile(checkpointPath, "utf8"));
    cp.lessons["12"] = {
      title: "Recycling",
      created: true,
      updatedAt: new Date().toISOString(),
      originalArtifact: {
        title: "The Closed Loop"
      },
      downloaded: true,
      file: path.resolve("../NotebookLMagent/output/powerpoints_ecology_atmosphere_sequence_classic/Lesson_12_Recycling.pptx")
    };
    await fs.writeFile(checkpointPath, JSON.stringify(cp, null, 2), "utf8");
    console.log(`[Finalizer] Updated checkpoint file at ${checkpointPath}`);
  } catch (err) {
    console.warn(`[Finalizer] Note: checkpoint file update:`, err.message);
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
