import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { getCellCycleSlideHtml } from "./generate_cell_cycle_checkpoint_slide.mjs";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const DECK_DIR = path.resolve("public/decks/genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function main() {
  console.log("=== Step 1: Shifting existing slide images (8..18 -> 10..20) ===");
  for (let i = 18; i >= 8; i--) {
    const oldName = `slide_${String(i).padStart(2, "0")}.png`;
    const newName = `slide_${String(i + 2).padStart(2, "0")}.png`;
    const oldPath = path.join(SLIDES_DIR, oldName);
    const newPath = path.join(SLIDES_DIR, newName);
    try {
      await fs.rename(oldPath, newPath);
      console.log(`Renamed ${oldName} -> ${newName}`);
    } catch (err) {
      console.error(`Failed to rename ${oldName}:`, err.message);
    }
  }

  console.log("\n=== Step 2: Rendering 3 Cell Cycle Checkpoint Slides (Stages 1, 2, 3) ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const metrics = {};

  for (const stage of [1, 2, 3]) {
    const slideNumber = 6 + stage; // 7, 8, 9
    const fileName = `slide_${String(slideNumber).padStart(2, "0")}.png`;
    const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
    
    await page.setContent(getCellCycleSlideHtml({ activeStage: stage }), { waitUntil: "load" });
    await page.waitForTimeout(500);

    const destPath = path.join(SLIDES_DIR, fileName);
    await page.screenshot({ path: destPath });
    console.log(`Rendered and saved Slide ${slideNumber} (Stage ${stage} emphasised): ${destPath}`);

    // Measure active card and detail box bounds
    const stageMetrics = await page.evaluate((stageNum) => {
      const card = document.getElementById("card_cp_" + stageNum).getBoundingClientRect();
      const box = document.getElementById("box_active_cp_" + stageNum).getBoundingClientRect();
      return {
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
    }, stage);

    metrics[stage] = stageMetrics;
    await page.close();
  }

  await browser.close();

  console.log("\n=== Step 3: Updating manifest.json ===");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Slides 1 to 6 remain intact
  const headSlides = manifest.slides.slice(0, 6);

  // Shift existing slides from index 7 upwards (old Slide 8 onwards, which now become Slide 10 onwards)
  const shiftedSlides = manifest.slides.slice(7).map((s) => {
    const nextNum = s.number + 2;
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

  // Construct Slide 7 (Stage 1 Emphasised: G1/S Restriction Gateway)
  const slide7Obj = {
    number: 7,
    title: "Cell Cycle Checkpoints: The G₁/S Restriction Gateway",
    imageFileName: "slide_07.png",
    imageUrl: "/decks/genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication/slides/slide_07.png",
    isInteractive: true,
    interactiveType: "custom_reveals",
    interactiveCells: [
      {
        id: "cp_stage_1_cell",
        bounds: metrics[1].card,
        answerBounds: metrics[1].detailBox,
        question: "What is the surveillance focus and molecular control of the G1/S Restriction Point?",
        expectedAnswer: "Verifies DNA template integrity, cell volume, and energy stores. Double-strand breaks trigger ATM/ATR kinase cascades that activate p53 transcription factor, upregulating p21 to arrest CDK2/cyclin E and block replication fork initiation.",
        answer: "Verifies DNA template integrity, cell volume, and energy stores. Double-strand breaks trigger ATM/ATR kinase cascades that activate p53 transcription factor, upregulating p21 to arrest CDK2/cyclin E and block replication fork initiation.",
        answerVisibleInImage: true,
        answerIsBaked: true,
        revealMode: "unmask",
        confidence: 1
      }
    ],
    cognitiveGuide: analyzeSlideCognitiveLoad({
      number: 7,
      title: "Cell Cycle Checkpoints: The G₁/S Restriction Gateway",
      isInteractive: true,
      interactiveType: "custom_reveals",
      interactiveCells: [
        {
          question: "What is the surveillance focus and molecular control of the G1/S Restriction Point?",
          expectedAnswer: "Verifies DNA template integrity, cell volume, and energy stores. Double-strand breaks trigger ATM/ATR kinase cascades that activate p53 transcription factor, upregulating p21 to arrest CDK2/cyclin E and block replication fork initiation."
        }
      ]
    }),
    serialAnimation: {
      totalBuildSteps: 1,
      autoAdvanceDelayMs: 3400,
      serialSteps: [
        {
          step: 1,
          title: "Reveal: Checkpoint 1 Mechanism",
          componentIds: ["cp_stage_1_cell"],
          targetBounds: metrics[1].detailBox,
          revealType: "unmask"
        }
      ]
    },
    animationPlan: {
      version: 2,
      mode: "question-reveal",
      reason: "Interactive unmasking for the G1/S Restriction Point molecular mechanism.",
      protectedVideoCount: 0
    },
    questionAnalysis: {
      detected: true,
      confidence: "high",
      questionCount: 1,
      detectionSource: "manifest-cells"
    }
  };

  // Construct Slide 8 (Stage 2 Emphasised: G2/M Replication Fidelity Gateway)
  const slide8Obj = {
    number: 8,
    title: "Cell Cycle Checkpoints: The G₂/M Replication Fidelity Gateway",
    imageFileName: "slide_08.png",
    imageUrl: "/decks/genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication/slides/slide_08.png",
    isInteractive: true,
    interactiveType: "custom_reveals",
    interactiveCells: [
      {
        id: "cp_stage_2_cell",
        bounds: metrics[2].card,
        answerBounds: metrics[2].detailBox,
        question: "How does the cell verify replication fidelity at the G2/M Checkpoint before mitosis?",
        expectedAnswer: "Confirms that all 46 chromosomes have been fully and accurately duplicated in S phase without unresolved replication forks or unligated Okazaki fragments. Inhibits CDK1/cyclin B (MPF) until repair polymerases and ligases seal all gaps.",
        answer: "Confirms that all 46 chromosomes have been fully and accurately duplicated in S phase without unresolved replication forks or unligated Okazaki fragments. Inhibits CDK1/cyclin B (MPF) until repair polymerases and ligases seal all gaps.",
        answerVisibleInImage: true,
        answerIsBaked: true,
        revealMode: "unmask",
        confidence: 1
      }
    ],
    cognitiveGuide: analyzeSlideCognitiveLoad({
      number: 8,
      title: "Cell Cycle Checkpoints: The G₂/M Replication Fidelity Gateway",
      isInteractive: true,
      interactiveType: "custom_reveals",
      interactiveCells: [
        {
          question: "How does the cell verify replication fidelity at the G2/M Checkpoint before mitosis?",
          expectedAnswer: "Confirms that all 46 chromosomes have been fully and accurately duplicated in S phase without unresolved replication forks or unligated Okazaki fragments. Inhibits CDK1/cyclin B (MPF) until repair polymerases and ligases seal all gaps."
        }
      ]
    }),
    serialAnimation: {
      totalBuildSteps: 1,
      autoAdvanceDelayMs: 3400,
      serialSteps: [
        {
          step: 1,
          title: "Reveal: Checkpoint 2 Mechanism",
          componentIds: ["cp_stage_2_cell"],
          targetBounds: metrics[2].detailBox,
          revealType: "unmask"
        }
      ]
    },
    animationPlan: {
      version: 2,
      mode: "question-reveal",
      reason: "Interactive unmasking for the G2/M Replication Fidelity Checkpoint molecular mechanism.",
      protectedVideoCount: 0
    },
    questionAnalysis: {
      detected: true,
      confidence: "high",
      questionCount: 1,
      detectionSource: "manifest-cells"
    }
  };

  // Construct Slide 9 (Stage 3 Emphasised: Spindle Assembly Gateway SAC)
  const slide9Obj = {
    number: 9,
    title: "Cell Cycle Checkpoints: The Spindle Assembly Gateway (SAC)",
    imageFileName: "slide_09.png",
    imageUrl: "/decks/genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication/slides/slide_09.png",
    isInteractive: true,
    interactiveType: "custom_reveals",
    interactiveCells: [
      {
        id: "cp_stage_3_cell",
        bounds: metrics[3].card,
        answerBounds: metrics[3].detailBox,
        question: "What does the Spindle Assembly Checkpoint (SAC) monitor during metaphase?",
        expectedAnswer: "Monitors mechanical tension and bilateral attachment of spindle microtubules to sister kinetochores. Unattached kinetochores generate the Mitotic Checkpoint Complex (MCC), inhibiting APC/C-Cdc20 to prevent nondisjunction and catastrophic aneuploidy.",
        answer: "Monitors mechanical tension and bilateral attachment of spindle microtubules to sister kinetochores. Unattached kinetochores generate the Mitotic Checkpoint Complex (MCC), inhibiting APC/C-Cdc20 to prevent nondisjunction and catastrophic aneuploidy.",
        answerVisibleInImage: true,
        answerIsBaked: true,
        revealMode: "unmask",
        confidence: 1
      }
    ],
    cognitiveGuide: analyzeSlideCognitiveLoad({
      number: 9,
      title: "Cell Cycle Checkpoints: The Spindle Assembly Gateway (SAC)",
      isInteractive: true,
      interactiveType: "custom_reveals",
      interactiveCells: [
        {
          question: "What does the Spindle Assembly Checkpoint (SAC) monitor during metaphase?",
          expectedAnswer: "Monitors mechanical tension and bilateral attachment of spindle microtubules to sister kinetochores. Unattached kinetochores generate the Mitotic Checkpoint Complex (MCC), inhibiting APC/C-Cdc20 to prevent nondisjunction and catastrophic aneuploidy."
        }
      ]
    }),
    serialAnimation: {
      totalBuildSteps: 1,
      autoAdvanceDelayMs: 3400,
      serialSteps: [
        {
          step: 1,
          title: "Reveal: Checkpoint 3 Mechanism",
          componentIds: ["cp_stage_3_cell"],
          targetBounds: metrics[3].detailBox,
          revealType: "unmask"
        }
      ]
    },
    animationPlan: {
      version: 2,
      mode: "question-reveal",
      reason: "Interactive unmasking for the Spindle Assembly Checkpoint (SAC) molecular mechanism.",
      protectedVideoCount: 0
    },
    questionAnalysis: {
      detected: true,
      confidence: "high",
      questionCount: 1,
      detectionSource: "manifest-cells"
    }
  };

  manifest.slides = [
    ...headSlides,  // Slides 1 to 6
    slide7Obj,      // Slide 7 (Stage 1)
    slide8Obj,      // Slide 8 (Stage 2)
    slide9Obj,      // Slide 9 (Stage 3)
    ...shiftedSlides // Slides 10 to 20
  ];
  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`\n✓ Updated manifest written to ${MANIFEST_PATH}. Total slides: ${manifest.totalSlides}.`);
}

main().catch((err) => {
  console.error("Error expanding cell cycle checkpoint slides:", err);
  process.exit(1);
});
