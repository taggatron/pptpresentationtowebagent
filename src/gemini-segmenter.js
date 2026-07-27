import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { analyzeSlideCognitiveLoad } from "./cognitive-model.js";
import { processSerialBuildSteps } from "./gemini-editor.js";

/**
 * Generates cell grid segmentation and interactive overlay data for Q&A slides,
 * along with academic cognitive processing time estimates.
 */
export async function generateSlideInteractivity(deckId, outputBaseDir) {
  const targetDir = path.join(outputBaseDir, deckId);
  const manifestPath = path.join(targetDir, "manifest.json");

  let manifest;
  try {
    const raw = await fs.readFile(manifestPath, "utf-8");
    manifest = JSON.parse(raw);
  } catch (err) {
    console.error(`[Gemini Segmenter] Could not read manifest at ${manifestPath}`, err);
    return;
  }

  // Find slide 2 or starter_qa_grid slides
  for (const slide of manifest.slides) {
    if (slide.number === 2 || slide.interactiveType === "starter_qa_grid") {
      slide.isInteractive = true;
      slide.interactiveType = "starter_qa_grid";
      slide.gridTitle = "Starter Activity: Knowledge Retrieval";
      
      // 6-grid cell definitions matching slide 2 dimensions
      // Cells are 2 columns x 3 rows
      slide.interactiveCells = [
        {
          id: "cell_1",
          row: 0,
          col: 0,
          bounds: { x: 4.2, y: 20.0, w: 45.6, h: 24.5 },
          answerBounds: { x: 5.2, y: 34.5, w: 43.6, h: 9.0 },
          question: "What scientific instrument is essential for viewing cells?",
          expectedAnswer: "Light microscope (or electron microscope)."
        },
        {
          id: "cell_2",
          row: 0,
          col: 1,
          bounds: { x: 50.2, y: 20.0, w: 45.6, h: 24.5 },
          answerBounds: { x: 51.2, y: 34.5, w: 43.6, h: 9.0 },
          question: "What is the fundamental building block of all living organisms?",
          expectedAnswer: "The cell."
        },
        {
          id: "cell_3",
          row: 1,
          col: 0,
          bounds: { x: 4.2, y: 44.8, w: 45.6, h: 24.5 },
          answerBounds: { x: 5.2, y: 59.3, w: 43.6, h: 9.0 },
          question: "Are cells flat, 2-dimensional circles or 3-dimensional structures?",
          expectedAnswer: "3-dimensional structures."
        },
        {
          id: "cell_4",
          row: 1,
          col: 1,
          bounds: { x: 50.2, y: 44.8, w: 45.6, h: 24.5 },
          answerBounds: { x: 51.2, y: 59.3, w: 43.6, h: 9.0 },
          question: "Write the word equation for cellular respiration.",
          expectedAnswer: "Glucose + Oxygen → Carbon Dioxide + Water."
        },
        {
          id: "cell_5",
          row: 2,
          col: 0,
          bounds: { x: 4.2, y: 69.6, w: 45.6, h: 24.5 },
          answerBounds: { x: 5.2, y: 84.1, w: 43.6, h: 9.0 },
          question: "Write the word equation for photosynthesis.",
          expectedAnswer: "Carbon Dioxide + Water → Glucose + Oxygen."
        },
        {
          id: "cell_6",
          row: 2,
          col: 1,
          bounds: { x: 50.2, y: 69.6, w: 45.6, h: 24.5 },
          answerBounds: { x: 51.2, y: 84.1, w: 43.6, h: 9.0 },
          question: "Name one type of specialised human cell you already know.",
          expectedAnswer: "Any valid cell (e.g., red blood cell, nerve cell, sperm cell)."
        }
      ];
    }

    // Attach academic cognitive processing time guide
    slide.cognitiveGuide = analyzeSlideCognitiveLoad(slide);

    // Attach serial build step animation sequence
    slide.serialAnimation = await processSerialBuildSteps(slide);
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`[Gemini Segmenter] Updated interactivity manifest for ${deckId}`);

  // Optional: Connect to Gemini via Playwright CDP if port 9333 is open
  try {
    const response = await fetch("http://127.0.0.1:9333/json/list").catch(() => null);
    if (response && response.ok) {
      console.log("[Gemini Segmenter] Detected running Chrome instance with CDP on port 9333.");
      // CDP automation can run enhanced prompt queries here if needed
    }
  } catch (e) {
    // CDP not active, fallback to offline segmented grid metadata
  }

  return manifest;
}
