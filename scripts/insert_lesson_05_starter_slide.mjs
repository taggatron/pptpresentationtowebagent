import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const DECK_DIR = path.resolve("public/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const GEMINI_IMAGE_PATH = "/Users/danieltagg/.gemini/antigravity-ide/brain/2ae9d5c9-f884-49cb-9464-94e9224047aa/genetics_lesson_05_starter_slide_1791285081054.jpg";

const starterQuestions = [
  {
    q: "Explain what is meant by 'semiconservative replication' of DNA.",
    a: "Each newly synthesized DNA molecule contains one original (template) parental strand and one newly synthesized daughter strand."
  },
  {
    q: "Describe the function of the enzyme DNA Helicase.",
    a: "Unwinds and separates the parental double helix by breaking hydrogen bonds between complementary base pairs at the replication fork."
  },
  {
    q: "Explain the action of DNA Polymerase III in terms of synthesis direction (5' to 3').",
    a: "Synthesizes new DNA exclusively in the 5' to 3' direction by adding complementary nucleotides to the free 3'-OH end of the growing strand."
  },
  {
    q: "Describe how Okazaki fragments are joined on the lagging strand, and identify the enzyme involved.",
    a: "Joined by DNA ligase, which catalyzes phosphodiester bonds between discontinuous Okazaki fragments following RNA primer removal."
  },
  {
    q: "State the role of RNA Primase in the initiation of DNA replication.",
    a: "Synthesizes a short RNA primer to provide a free 3'-OH group required by DNA polymerase to begin nucleotide addition."
  },
  {
    q: "Explain the process of DNA proofreading and how it maintains high replication fidelity.",
    a: "DNA polymerase 3' to 5' exonuclease activity detects and excises mismatched bases immediately during synthesis, ensuring high fidelity."
  }
];

const interactiveCells = [
  {
    id: "cell_1",
    row: 0,
    col: 0,
    bounds: { x: 3.49, y: 25.78, w: 29.65, h: 32.16 },
    answerBounds: { x: 6.98, y: 47.53, w: 25.15, h: 8.2 },
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
    bounds: { x: 34.67, y: 25.78, w: 29.65, h: 32.16 },
    answerBounds: { x: 38.15, y: 47.53, w: 25.15, h: 8.2 },
    question: starterQuestions[1].q,
    expectedAnswer: starterQuestions[1].a,
    answerVisibleInImage: true,
    answerIsBaked: true,
    revealMode: "unmask",
    confidence: 1
  },
  {
    id: "cell_3",
    row: 0,
    col: 2,
    bounds: { x: 65.92, y: 25.78, w: 29.65, h: 32.16 },
    answerBounds: { x: 69.4, y: 47.53, w: 25.15, h: 8.2 },
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
    col: 0,
    bounds: { x: 3.49, y: 61.07, w: 29.65, h: 32.16 },
    answerBounds: { x: 6.98, y: 82.81, w: 25.15, h: 8.2 },
    question: starterQuestions[3].q,
    expectedAnswer: starterQuestions[3].a,
    answerVisibleInImage: true,
    answerIsBaked: true,
    revealMode: "unmask",
    confidence: 1
  },
  {
    id: "cell_5",
    row: 1,
    col: 1,
    bounds: { x: 34.67, y: 61.07, w: 29.65, h: 32.16 },
    answerBounds: { x: 38.15, y: 82.81, w: 25.15, h: 8.2 },
    question: starterQuestions[4].q,
    expectedAnswer: starterQuestions[4].a,
    answerVisibleInImage: true,
    answerIsBaked: true,
    revealMode: "unmask",
    confidence: 1
  },
  {
    id: "cell_6",
    row: 1,
    col: 2,
    bounds: { x: 65.92, y: 61.07, w: 29.65, h: 32.16 },
    answerBounds: { x: 69.4, y: 82.81, w: 25.15, h: 8.2 },
    question: starterQuestions[5].q,
    expectedAnswer: starterQuestions[5].a,
    answerVisibleInImage: true,
    answerIsBaked: true,
    revealMode: "unmask",
    confidence: 1
  }
];

async function main() {
  console.log("=== Step 1: Render Starter Slide with Baked Typography ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const rawImage = await fs.readFile(GEMINI_IMAGE_PATH);
  const dataUrl = `data:image/jpeg;base64,${rawImage.toString("base64")}`;

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@500;600;700&family=JetBrains+Mono:wght@600;700&display=swap");
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1376px;
        height: 768px;
        position: relative;
        background: url("${dataUrl}") no-repeat center;
        background-size: cover;
      }
      .box {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 5px 12px;
        color: white;
      }
      .cue {
        font-family: "JetBrains Mono", monospace;
        font-size: 11px;
        font-weight: 700;
        color: #4ade80;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin-bottom: 2px;
        text-shadow: 0 0 10px rgba(74, 222, 128, 0.4);
      }
      .ans {
        font-family: "Inter", sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
        line-height: 1.25;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      }
    </style>
  </head>
  <body>
    <div class="box" style="left: 96px; top: 365px; width: 346px; height: 63px;">
      <div class="cue">Expected Answer / Success Cue:</div>
      <div class="ans">One original template strand & one newly synthesized daughter strand.</div>
    </div>
    <div class="box" style="left: 525px; top: 365px; width: 346px; height: 63px;">
      <div class="cue">Expected Answer / Success Cue:</div>
      <div class="ans">Unwinds the double helix and breaks hydrogen bonds at replication fork.</div>
    </div>
    <div class="box" style="left: 955px; top: 365px; width: 346px; height: 63px;">
      <div class="cue">Expected Answer / Success Cue:</div>
      <div class="ans">Synthesizes new strand exclusively 5' to 3' via complementary base pairing.</div>
    </div>
    <div class="box" style="left: 96px; top: 636px; width: 346px; height: 63px;">
      <div class="cue">Expected Answer / Success Cue:</div>
      <div class="ans">DNA ligase joins Okazaki fragments via phosphodiester bonds on lagging strand.</div>
    </div>
    <div class="box" style="left: 525px; top: 636px; width: 346px; height: 63px;">
      <div class="cue">Expected Answer / Success Cue:</div>
      <div class="ans">Synthesizes short RNA primers providing free 3'-OH group for DNA polymerase.</div>
    </div>
    <div class="box" style="left: 955px; top: 636px; width: 346px; height: 63px;">
      <div class="cue">Expected Answer / Success Cue:</div>
      <div class="ans">3' to 5' exonuclease proofreading detects and excises mismatched bases.</div>
    </div>
  </body>
  </html>`;

  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const tempStarterPath = path.join(SLIDES_DIR, "temp_starter.png");
  await page.screenshot({ path: tempStarterPath });
  console.log(`Rendered starter slide to ${tempStarterPath}`);
  await browser.close();

  console.log("\n=== Step 2: Backup Manifest and Slide Files ===");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  await fs.writeFile(MANIFEST_PATH + ".bak", rawManifest, "utf8");

  console.log("\n=== Step 3: Shift Slide Images (15..2 -> 16..3) ===");
  for (let i = 15; i >= 2; i--) {
    const oldName = `slide_${String(i).padStart(2, "0")}.png`;
    const newName = `slide_${String(i + 1).padStart(2, "0")}.png`;
    const oldPath = path.join(SLIDES_DIR, oldName);
    const newPath = path.join(SLIDES_DIR, newName);
    await fs.rename(oldPath, newPath);
    console.log(`Renamed image: ${oldName} -> ${newName}`);
  }

  // Rename temp_starter.png to slide_02.png
  const finalSlide02Path = path.join(SLIDES_DIR, "slide_02.png");
  await fs.rename(tempStarterPath, finalSlide02Path);
  console.log(`Placed new starter image as slide_02.png`);

  console.log("\n=== Step 4: Construct Updated Manifest ===");
  const manifest = JSON.parse(rawManifest);

  // New Slide 2: Starter Activity
  const newSlide2 = {
    number: 2,
    title: "Starter Activity: Prior Knowledge Retrieval Grid",
    imageFileName: "slide_02.png",
    imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_02.png",
    sourceMediaPath: "gemini/genetics_lesson_05_starter_slide.png",
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
      reason: "The six-box starter grid is excluded from Gemini still-image builds.",
      protectedVideoCount: 0
    },
    questionAnalysis: {
      detected: true,
      confidence: "high",
      questionCount: 6,
      detectionSource: "manifest-cells"
    }
  };

  // Old Slide 2 (Learning Objectives), now Slide 3: completely clean, non-interactive
  const oldSlide2 = manifest.slides.find((s) => s.number === 2);
  const cleanedObjectivesSlide = {
    number: 3,
    title: "Learning Objectives",
    imageFileName: "slide_03.png",
    imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_03.png",
    sourceMediaPath: "ppt/media/image2.png",
    isInteractive: false,
    interactiveType: null,
    contentAnalysis: {
      schemaVersion: 1,
      status: "ready",
      source: "gemini-image-chat",
      transcript: "Learning Objectives. Distinguish Origins: Compare acquired (somatic) and inherited (germline) mutations; Identify triggers and heritability. Classify Mutations: Understand nucleotide substitutions and indels; Determine specific effects on protein synthesis. Clinical Deep Dive: Explore Huntington's disease molecular pathology; Map clinical phenotype to inheritance patterns.",
      role: "instructional-content",
      questions: [],
      questionCount: 0
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 24,
      timeGuideDisplay: "18–30s",
      vciScore: "3.2",
      complexityCategory: "Low",
      ragLevel: "low",
      ragColor: "green",
      ragLabel: "Low Processing",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1250,
        readingMs: 12500,
        semanticProcessingMs: 10000,
        wordCount: 42,
        visualElementsCount: 3
      },
      academicReferences: [
        {
          citation: "Rosenholtz, R., Li, Y., & Nakano, L. (2007). Measuring visual clutter. Journal of Vision, 7(2), 17.",
          relevance: "Quantifies visual feature congestion & visual search scanning time."
        },
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
          relevance: "Models intrinsic and extraneous cognitive load during visual information integration."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "manifest-text"
    },
    animationPlan: {
      version: 2,
      mode: "static-overview",
      reason: "Learning Objectives overview slide.",
      strategy: "static-overview"
    }
  };

  // Shift existing slides 3..15 to 4..16
  const shiftedRemainingSlides = manifest.slides.slice(2).map((s) => {
    const nextNum = s.number + 1;
    const nextFileName = `slide_${String(nextNum).padStart(2, "0")}.png`;
    const nextUrl = `/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/${nextFileName}`;

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

  manifest.slides = [
    manifest.slides[0],      // Slide 1 (Title)
    newSlide2,               // Slide 2 (New Starter Retrieval Grid)
    cleanedObjectivesSlide,  // Slide 3 (Clean Learning Objectives, no click-to-reveal)
    ...shiftedRemainingSlides// Slides 4..16
  ];
  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`\nSuccessfully updated manifest! Total slides: ${manifest.totalSlides}`);
}

main().catch((err) => {
  console.error("Failed to insert starter slide:", err);
  process.exit(1);
});
