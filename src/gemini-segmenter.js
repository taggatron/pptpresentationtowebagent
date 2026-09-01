import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeSlideCognitiveLoad } from "./cognitive-model.js";
import { planSlideAnimation } from "./slide-animation-planner.js";
import { getCurrentStarterGrid } from "./current-slide-catalog.js";
import { getCurrentQuestionReveal } from "./current-question-catalog.js";
import {
  AGENT_PATHWAYS,
  DEFAULT_AGENT_PATHWAY,
  normalizeAgentPathway
} from "./agent-config.js";

export function createStarterCellGrid() {
  return [
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

function isLegacyLessonOneStarterGrid(cells) {
  if (!Array.isArray(cells) || cells.length !== 6) return false;
  const defaults = createStarterCellGrid();
  return cells.every(
    (cell, index) =>
      cell?.question === defaults[index].question &&
      cell?.expectedAnswer === defaults[index].expectedAnswer
  );
}

async function loadGeminiSlideAnalysis(targetDir, slide) {
  const slideNumber = Number(slide?.number);
  if (!Number.isFinite(slideNumber)) return null;
  const analysisPath = path.join(
    targetDir,
    "analysis",
    `slide_${String(slideNumber).padStart(2, "0")}.json`
  );

  try {
    const sidecar = JSON.parse(await fs.readFile(analysisPath, "utf8"));
    if (!sidecar?.analysis || !sidecar?.sourceHash) return null;
    const sourceFileName = path.basename(
      String(slide.imageUrl || slide.imageFileName || "")
    );
    if (!sourceFileName) return null;
    const sourceBuffer = await fs.readFile(path.join(targetDir, "slides", sourceFileName));
    const sourceHash = crypto.createHash("sha256").update(sourceBuffer).digest("hex");
    if (sourceHash !== sidecar.sourceHash) return null;
    return {
      schemaVersion: Number(sidecar.schemaVersion) || 1,
      provider: sidecar.provider || "Google Gemini",
      analyzedAt: sidecar.analyzedAt || null,
      sourceHash,
      analysis: sidecar.analysis
    };
  } catch {
    return null;
  }
}

/**
 * Generates cell grid segmentation and interactive overlay data for Q&A slides,
 * along with academic cognitive processing time estimates.
 */
export async function generateSlideInteractivity(
  deckId,
  outputBaseDir,
  { pathway = DEFAULT_AGENT_PATHWAY } = {}
) {
  const selectedPathway = normalizeAgentPathway(pathway);
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

  manifest.agent = {
    defaultPathway: DEFAULT_AGENT_PATHWAY,
    selectedPathway,
    imageChatProvider: "Google Gemini",
    offlineFallback: AGENT_PATHWAYS.LOCAL_GRID_SEGMENTATION,
    updatedAt: new Date().toISOString()
  };

  for (let index = 0; index < manifest.slides.length; index += 1) {
    const sourceSlide = manifest.slides[index];
    let slide = {
      ...sourceSlide,
      deckId: manifest.id,
      deckTitle: manifest.title,
      lessonTitle: manifest.title
    };

    const slideDecomposition = await loadGeminiSlideAnalysis(targetDir, slide);
    if (slideDecomposition) {
      slide.agentAnalysis = {
        ...(slide.agentAnalysis || {}),
        slideDecomposition,
        pathway: selectedPathway,
        segmentationSource: "gemini-multimodal-slide-analysis",
        status: "Gemini described the slide, identified its components, and proposed a cumulative click sequence."
      };
    }

    const reviewedStarter = slide.number === 2 ? getCurrentStarterGrid(manifest.id) : null;
    if (reviewedStarter) {
      const existingById = new Map(
        (Array.isArray(slide.interactiveCells) ? slide.interactiveCells : []).map((cell) => [
          cell.id,
          cell
        ])
      );
      slide.gridTitle = reviewedStarter.title;
      slide.title = slide.title || reviewedStarter.title;
      slide.isInteractive = true;
      slide.interactiveType = "starter_qa_grid";
      slide.interactiveCells = reviewedStarter.cells.map((cell) => {
        const existing = existingById.get(cell.id);
        if (!existing?.locked) return cell;
        return {
          ...cell,
          bounds: existing.bounds || cell.bounds,
          answerBounds: existing.answerBounds || cell.answerBounds,
          locked: true,
          provenance: existing.provenance || "user-adjusted"
        };
      });
      slide.contentAnalysis = {
        ...(slide.contentAnalysis || {}),
        source: "reviewed-current-slide-catalog",
        status: "ready",
        questionCount: slide.interactiveCells.length
      };
    }

    const reviewedQuestions = reviewedStarter
      ? null
      : getCurrentQuestionReveal(manifest.id, slide.imageFileName);
    if (reviewedQuestions?.length) {
      const existingById = new Map(
        (Array.isArray(slide.interactiveCells) ? slide.interactiveCells : []).map((cell) => [
          cell.id,
          cell
        ])
      );
      slide.isInteractive = true;
      slide.interactiveType = "question_reveal";
      slide.interactiveCells = reviewedQuestions.map((cell) => {
        const existing = existingById.get(cell.id);
        if (!existing?.locked) return cell;
        return {
          ...cell,
          bounds: existing.bounds || cell.bounds,
          questionBounds: existing.questionBounds || cell.questionBounds,
          answerBounds: existing.answerBounds || cell.answerBounds,
          answerRegions: existing.answerRegions || cell.answerRegions,
          locked: true,
          provenance: existing.provenance || "user-adjusted"
        };
      });
      slide.contentAnalysis = {
        ...(slide.contentAnalysis || {}),
        source: "reviewed-current-slide-catalog",
        status: "ready",
        questionCount: slide.interactiveCells.length
      };
    }

    // Older conversions copied Lesson 1's answer text onto slide 2 of every
    // deck. Never retain those false answers. Current-deck enrichment or a
    // Gemini structured analysis supplies deck-specific cells instead.
    if (
      !reviewedStarter &&
      !reviewedQuestions &&
      manifest.id !== "Lesson_01_CELL_STRUCTURE" &&
      isLegacyLessonOneStarterGrid(slide.interactiveCells)
    ) {
      delete slide.interactiveCells;
      slide.isInteractive = false;
      slide.interactiveType = null;
      slide.questionAnalysis = {
        detected: true,
        confidence: "medium",
        status: "awaiting-deck-specific-analysis",
        detectionSource: "legacy-grid-rejected"
      };
    }

    // The trial deck is the only place where this fallback answer set is
    // verified. It remains available for fresh Lesson 1 conversions.
    if (
      manifest.id === "Lesson_01_CELL_STRUCTURE" &&
      slide.number === 2 &&
      !Array.isArray(slide.interactiveCells)
    ) {
      slide.isInteractive = true;
      slide.interactiveType = "starter_qa_grid";
      slide.gridTitle = "Starter Activity: Knowledge Retrieval";
      slide.interactiveCells = createStarterCellGrid();
    }

    if (Array.isArray(slide.interactiveCells) && slide.interactiveCells.length > 0) {
      slide.agentAnalysis = {
        ...(slide.agentAnalysis || {}),
        pathway: selectedPathway,
        segmentationSource:
          slide.contentAnalysis?.source || slide.agentAnalysis?.segmentationSource || "manifest-cells",
        status: "Question and answer targets are ready for reveal."
      };
    }

    // Complexity is measured before an animation is attached so the build
    // sequence cannot inflate its own cognitive-load score on repeat runs.
    const cognitiveInput = {
      ...slide,
      serialAnimation: undefined,
      progressiveBuilds: undefined,
      revisionData: undefined
    };
    slide.cognitiveGuide = analyzeSlideCognitiveLoad(cognitiveInput);
    slide = planSlideAnimation(slide);
    delete slide.deckId;
    delete slide.deckTitle;
    delete slide.lessonTitle;
    delete slide.revisionData;
    manifest.slides[index] = slide;
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

async function runCli() {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const outputBaseDir = path.resolve(moduleDir, "..", "public", "decks");
  const deckId = process.argv[2] || "Lesson_01_CELL_STRUCTURE";
  if (deckId === "--all") {
    const entries = await fs.readdir(outputBaseDir, { withFileTypes: true });
    for (const entry of entries.filter((candidate) => candidate.isDirectory())) {
      await generateSlideInteractivity(entry.name, outputBaseDir, {
        pathway: DEFAULT_AGENT_PATHWAY
      });
    }
    return;
  }
  await generateSlideInteractivity(deckId, outputBaseDir, {
    pathway: DEFAULT_AGENT_PATHWAY
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error("[Gemini Segmenter] Agent run failed:", error);
    process.exitCode = 1;
  });
}
