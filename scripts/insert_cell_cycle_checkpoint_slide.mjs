import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { getCellCycleSlideHtml } from "./generate_cell_cycle_checkpoint_slide.mjs";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const DECK_DIR = path.resolve("public/decks/genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function main() {
  console.log("=== Step 1: Shifting existing slide images (7..16 -> 8..17) ===");
  for (let i = 16; i >= 7; i--) {
    const oldName = `slide_${String(i).padStart(2, "0")}.png`;
    const newName = `slide_${String(i + 1).padStart(2, "0")}.png`;
    const oldPath = path.join(SLIDES_DIR, oldName);
    const newPath = path.join(SLIDES_DIR, newName);
    await fs.rename(oldPath, newPath);
    console.log(`Renamed ${oldName} -> ${newName}`);
  }

  console.log("\n=== Step 2: Rendering new Slide 7 (Cell Cycle Checkpoints) to slide_07.png ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  
  await page.setContent(getCellCycleSlideHtml(), { waitUntil: "load" });
  await page.waitForTimeout(500);

  const destSlide07Path = path.join(SLIDES_DIR, "slide_07.png");
  await page.screenshot({ path: destSlide07Path });
  console.log(`Rendered and saved: ${destSlide07Path}`);

  // Calculate exact box metrics for interactive unmasks
  const metrics = await page.evaluate(() => {
    const results = {};
    for (let i = 1; i <= 3; i++) {
      const card = document.getElementById("card_cp_" + i).getBoundingClientRect();
      const box = document.getElementById("box_cp_" + i).getBoundingClientRect();
      results["checkpoint_" + i] = {
        card: {
          x: +(card.left / 1376 * 100).toFixed(2),
          y: +(card.top / 768 * 100).toFixed(2),
          w: +(card.width / 1376 * 100).toFixed(2),
          h: +(card.height / 768 * 100).toFixed(2)
        },
        detailBox: {
          x: +(box.left / 1376 * 100).toFixed(2),
          y: +(box.top / 768 * 100).toFixed(2),
          w: +(box.width / 1376 * 100).toFixed(2),
          h: +(box.height / 768 * 100).toFixed(2)
        }
      };
    }
    return results;
  });

  await browser.close();

  console.log("\n=== Step 3: Updating manifest.json ===");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Slides 1 to 6 remain intact
  const headSlides = manifest.slides.slice(0, 6);

  // Shift existing slides from index 6 upwards (Slide 7 onwards)
  const shiftedSlides = manifest.slides.slice(6).map((s) => {
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

  // Construct new Slide 7 (Cell Cycle Checkpoints Diagram Slide)
  const interactiveCells = [
    {
      id: "cp_cell_1",
      bounds: metrics.checkpoint_1.card,
      answerBounds: metrics.checkpoint_1.detailBox,
      question: "What is the surveillance focus and molecular control of the G1/S Restriction Point?",
      expectedAnswer: "Verifies DNA template integrity, cell volume, and energy stores. Double-strand breaks activate p53/p21 to halt CDK2/cyclin E and block replication fork initiation.",
      answer: "Verifies DNA template integrity, cell volume, and energy stores. Double-strand breaks activate p53/p21 to halt CDK2/cyclin E and block replication fork initiation.",
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cp_cell_2",
      bounds: metrics.checkpoint_2.card,
      answerBounds: metrics.checkpoint_2.detailBox,
      question: "How does the cell verify replication fidelity at the G2/M Checkpoint before mitosis?",
      expectedAnswer: "Confirms all 46 chromosomes are fully replicated without unresolved replication forks or Okazaki nicks, inhibiting CDK1/cyclin B (MPF) until repair is complete.",
      answer: "Confirms all 46 chromosomes are fully replicated without unresolved replication forks or Okazaki nicks, inhibiting CDK1/cyclin B (MPF) until repair is complete.",
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cp_cell_3",
      bounds: metrics.checkpoint_3.card,
      answerBounds: metrics.checkpoint_3.detailBox,
      question: "What does the Spindle Assembly Checkpoint (SAC) monitor during metaphase?",
      expectedAnswer: "Monitors bilateral kinetochore tension on spindle microtubules. Unattached kinetochores produce MCC to inhibit APC/C-Cdc20, preventing nondisjunction and aneuploidy.",
      answer: "Monitors bilateral kinetochore tension on spindle microtubules. Unattached kinetochores produce MCC to inhibit APC/C-Cdc20, preventing nondisjunction and aneuploidy.",
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    }
  ];

  const slide7Obj = {
    number: 7,
    title: "Cell Cycle Checkpoints: The Gatekeepers of Replication",
    imageFileName: "slide_07.png",
    imageUrl: "/decks/genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication/slides/slide_07.png",
    isInteractive: true,
    interactiveType: "custom_reveals",
    interactiveCells,
    cognitiveGuide: analyzeSlideCognitiveLoad({
      number: 7,
      title: "Cell Cycle Checkpoints: The Gatekeepers of Replication",
      isInteractive: true,
      interactiveType: "custom_reveals",
      interactiveCells
    }),
    serialAnimation: {
      totalBuildSteps: 3,
      autoAdvanceDelayMs: 3400,
      serialSteps: interactiveCells.map((c, idx) => ({
        step: idx + 1,
        title: `Reveal: Checkpoint ${idx + 1}`,
        componentIds: [c.id],
        targetBounds: c.answerBounds,
        revealType: "unmask"
      }))
    },
    animationPlan: {
      version: 2,
      mode: "question-reveal",
      reason: "Interactive unmasking for each cell cycle checkpoint mechanism.",
      protectedVideoCount: 0
    },
    questionAnalysis: {
      detected: true,
      confidence: "high",
      questionCount: 3,
      detectionSource: "manifest-cells"
    }
  };

  manifest.slides = [
    ...headSlides,  // Slides 1 to 6
    slide7Obj,      // New Slide 7
    ...shiftedSlides // Slides 8 to 17
  ];
  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Updated manifest written to ${MANIFEST_PATH}. Total slides: ${manifest.totalSlides}.`);
}

main().catch((err) => {
  console.error("Error inserting cell cycle checkpoint slide:", err);
  process.exit(1);
});
