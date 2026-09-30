import fs from "node:fs/promises";
import path from "node:path";

const MANIFEST_PATH = path.resolve(
  "public/decks/ecology_atmosphere_classic/Classic_Lesson_10_Pollutants/manifest.json"
);

async function main() {
  const raw = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(raw);

  const slide4 = manifest.slides.find((s) => s.number === 4);
  if (!slide4) {
    throw new Error("Slide 4 not found in manifest");
  }

  slide4.title = "Identify the Missing Products: Word Equations";
  slide4.isInteractive = true;
  slide4.interactiveType = "question_reveal";

  slide4.interactiveCells = [
    {
      id: "reveal_4_cell_1",
      question: "What are the products of complete combustion of methane?",
      expectedAnswer: "Carbon dioxide + Water",
      bounds: {
        x: 11.5,
        y: 69.5,
        w: 32.5,
        h: 9.5
      },
      answerBounds: {
        x: 11.5,
        y: 69.5,
        w: 32.5,
        h: 9.5
      },
      revealMode: "blur",
      confidence: 1,
      provenance: "user-adjusted",
      locked: true,
      answerVisibleInImage: true,
      answerIsBaked: true
    },
    {
      id: "reveal_4_cell_2",
      question: "What are the products of incomplete combustion of methane?",
      expectedAnswer: "Carbon monoxide + Soot / Carbon",
      bounds: {
        x: 50.5,
        y: 69.5,
        w: 43.5,
        h: 9.5
      },
      answerBounds: {
        x: 50.5,
        y: 69.5,
        w: 43.5,
        h: 9.5
      },
      revealMode: "blur",
      confidence: 1,
      provenance: "user-adjusted",
      locked: true,
      answerVisibleInImage: true,
      answerIsBaked: true
    }
  ];

  slide4.questionAnalysis = {
    detected: true,
    confidence: "high",
    questionCount: 2,
    detectionSource: "user-configured"
  };

  slide4.animationPlan = {
    version: 2,
    mode: "gemini-image-cells",
    reason: "Interactive question reveal with blurred answer cards.",
    strategy: "question-base-overlay",
    planningSource: "user-adjusted",
    analyzedComponentCount: 2,
    plannedCellCount: 2,
    approvedCellCount: 2,
    qaRequired: false,
    questionReveal: true,
    webEmbedPreserved: false,
    protectedVideoCount: 0
  };

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log("Successfully updated Slide 4 in:", MANIFEST_PATH);
}

main().catch(console.error);
