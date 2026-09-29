import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { getStarterSlideHtml } from "./generate_lesson_02_starter_slide.mjs";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const DECK_DIR = path.resolve("public/decks/genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function main() {
  console.log("=== Step 1: Shifting existing slide image files (2..15 -> 3..16) ===");
  for (let i = 15; i >= 2; i--) {
    const oldName = `slide_${String(i).padStart(2, "0")}.png`;
    const newName = `slide_${String(i + 1).padStart(2, "0")}.png`;
    const oldPath = path.join(SLIDES_DIR, oldName);
    const newPath = path.join(SLIDES_DIR, newName);
    await fs.rename(oldPath, newPath);
    console.log(`Renamed ${oldName} -> ${newName}`);
  }

  console.log("\n=== Step 2: Rendering new Slide 2 (Starter Retrieval Grid) to slide_02.png ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  
  await page.setContent(getStarterSlideHtml(), { waitUntil: "load" });
  await page.waitForTimeout(500);

  const destSlide02Path = path.join(SLIDES_DIR, "slide_02.png");
  await page.screenshot({ path: destSlide02Path });
  console.log(`Rendered and saved: ${destSlide02Path}`);

  await browser.close();

  console.log("\n=== Step 3: Updating manifest.json ===");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Shift existing slides from index 1 upwards
  const shiftedSlides = manifest.slides.slice(1).map((s) => {
    const nextNum = s.number + 1;
    const nextFileName = `slide_${String(nextNum).padStart(2, "0")}.png`;
    const nextUrl = `/decks/genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication/slides/${nextFileName}`;

    const updatedSlide = {
      ...s,
      number: nextNum,
      imageFileName: nextFileName,
      imageUrl: nextUrl
    };

    if (Array.isArray(s.geminiImageCells)) {
      updatedSlide.geminiImageCells = s.geminiImageCells.map((c) => ({
        ...c,
        id: c.id.replace(`slide_${s.number}_`, `slide_${nextNum}_`),
        sourceImageUrl: nextUrl
      }));
    }

    return updatedSlide;
  });

  // Construct new Slide 2
  const starterQuestions = [
    {
      q: "What chemical bond links adjacent nucleotides within a single DNA polynucleotide strand?",
      a: "A 3'-5' phosphodiester bond between the 3' hydroxyl group of one deoxyribose and the 5' phosphate of the next."
    },
    {
      q: "Why are the two polynucleotide chains in double-stranded DNA described as antiparallel?",
      a: "One strand runs in the 5' to 3' direction, while the complementary antiparallel strand runs in the 3' to 5' direction."
    },
    {
      q: "State the number of hydrogen bonds between A-T and G-C base pairs.",
      a: "A-T pairs have 2 hydrogen bonds; G-C pairs have 3 hydrogen bonds."
    },
    {
      q: "Which enzyme synthesizes RNA primers required to initiate DNA synthesis?",
      a: "RNA primase."
    },
    {
      q: "Why is the lagging strand synthesized discontinuously as Okazaki fragments?",
      a: "DNA polymerase can only synthesize in the 5' to 3' direction, requiring backward synthesis away from the advancing fork."
    },
    {
      q: "What repetitive nucleotide sequence comprises human telomeres?",
      a: "TTAGGG tandem repeats."
    }
  ];

  const interactiveCells = [
    {
      id: "cell_1",
      row: 0,
      col: 0,
      bounds: { x: 3.49, y: 16.21, w: 45.06, h: 23.7 },
      answerBounds: { x: 5.16, y: 29.88, w: 42.01, h: 8.07 },
      question: starterQuestions[0].q,
      expectedAnswer: starterQuestions[0].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cell_2",
      row: 0,
      col: 1,
      bounds: { x: 51.45, y: 16.21, w: 45.06, h: 23.7 },
      answerBounds: { x: 53.13, y: 29.88, w: 42.01, h: 8.07 },
      question: starterQuestions[1].q,
      expectedAnswer: starterQuestions[1].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cell_3",
      row: 1,
      col: 0,
      bounds: { x: 3.49, y: 42.25, w: 45.06, h: 23.7 },
      answerBounds: { x: 5.16, y: 55.92, w: 42.01, h: 8.07 },
      question: starterQuestions[2].q,
      expectedAnswer: starterQuestions[2].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cell_4",
      row: 1,
      col: 1,
      bounds: { x: 51.45, y: 42.25, w: 45.06, h: 23.7 },
      answerBounds: { x: 53.13, y: 55.92, w: 42.01, h: 8.07 },
      question: starterQuestions[3].q,
      expectedAnswer: starterQuestions[3].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cell_5",
      row: 2,
      col: 0,
      bounds: { x: 3.49, y: 68.29, w: 45.06, h: 23.7 },
      answerBounds: { x: 5.16, y: 81.97, w: 42.01, h: 8.07 },
      question: starterQuestions[4].q,
      expectedAnswer: starterQuestions[4].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cell_6",
      row: 2,
      col: 1,
      bounds: { x: 51.45, y: 68.29, w: 45.06, h: 23.7 },
      answerBounds: { x: 53.13, y: 81.97, w: 42.01, h: 8.07 },
      question: starterQuestions[5].q,
      expectedAnswer: starterQuestions[5].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    }
  ];

  const slide2Obj = {
    number: 2,
    title: "Starter Activity: Prior Knowledge Retrieval Grid",
    imageFileName: "slide_02.png",
    imageUrl: "/decks/genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication/slides/slide_02.png",
    isInteractive: true,
    interactiveType: "starter_qa_grid",
    gridTitle: "Starter Activity: Prior Knowledge Retrieval Grid",
    starterQuestions,
    interactiveCells,
    cognitiveGuide: analyzeSlideCognitiveLoad({
      number: 2,
      title: "Starter Activity: Prior Knowledge Retrieval Grid",
      isInteractive: true,
      interactiveType: "starter_qa_grid",
      interactiveCells
    }),
    serialAnimation: {
      totalBuildSteps: 6,
      autoAdvanceDelayMs: 3200,
      serialSteps: interactiveCells.map((c, idx) => ({
        step: idx + 1,
        title: `Reveal: ${c.question}`,
        componentIds: [c.id],
        targetBounds: c.answerBounds,
        revealType: "unmask"
      }))
    },
    animationPlan: {
      version: 2,
      mode: "question-reveal",
      reason: "The six-box starter grid is intentionally excluded from Gemini still-image builds.",
      protectedVideoCount: 0
    },
    questionAnalysis: {
      detected: true,
      confidence: "high",
      questionCount: 6,
      detectionSource: "manifest-cells"
    }
  };

  manifest.slides = [
    manifest.slides[0], // Slide 1
    slide2Obj,          // New Slide 2
    ...shiftedSlides    // Slides 3 to 16
  ];
  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Updated manifest written to ${MANIFEST_PATH}. Total slides: ${manifest.totalSlides}.`);
}

main().catch((err) => {
  console.error("Error inserting starter slide:", err);
  process.exit(1);
});
