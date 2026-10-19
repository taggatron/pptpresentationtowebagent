import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const DECK_DIR = path.resolve("public/decks/physics_electricity_magnetism/Lesson_09_Fuses_and_Earthing");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

export const starterQuestions = [
  {
    q: "What is the voltage and frequency of UK domestic mains electricity?",
    cue: "Standard UK domestic supply",
    a: "230 V AC at 50 Hz (alternating current)."
  },
  {
    q: "State the colours of the live, neutral, and earth wires in a UK 3-pin plug.",
    cue: "B-L-U-E = bottom left; B-R-O-W-N = bottom right",
    a: "Live = Brown, Neutral = Blue, Earth = Green/Yellow stripes."
  },
  {
    q: "Which wire in a plug contains the fuse and why?",
    cue: "Cuts off high voltage",
    a: "Live wire, so melting isolates the appliance from the 230 V live supply."
  },
  {
    q: "How does an earth wire and fuse together prevent electric shock?",
    cue: "Low-resistance path to ground",
    a: "Fault current surges safely to earth, instantly melting the fuse and cutting power."
  },
  {
    q: "Calculate the current drawn by a 2300 W kettle connected to 230 V mains.",
    cue: "I = P ÷ V",
    a: "10 A (I = P / V = 2300 / 230 = 10 A → requires 13 A fuse)."
  },
  {
    q: "What does the double insulation symbol (two concentric squares) mean?",
    cue: "Plastic casing, 2-core cable",
    a: "Appliance has an insulating plastic casing; cannot become live so needs no earth wire."
  }
];

function getStarterGridHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap");

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1920px;
    height: 1080px;
    background: #f8fafc;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    display: flex;
    flex-direction: column;
    padding: 38px 60px 40px 60px;
    position: relative;
    overflow: hidden;
  }

  .title-header {
    text-align: center;
    margin-bottom: 28px;
  }

  .title-header h1 {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 52px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 24px 32px;
    flex: 1;
  }

  .card {
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 18px;
    padding: 24px 28px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-top {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .question {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.25;
    color: #0f172a;
  }

  .cue-pill {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    padding: 5px 14px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 700;
    background: #e0f2fe;
    color: #0284c7;
    border: 1px solid #bae6fd;
  }

  .cue-pill.amber {
    background: #fef3c7;
    color: #d97706;
    border-color: #fde68a;
  }

  .cue-pill.rose {
    background: #ffe4e6;
    color: #e11d48;
    border-color: #fecdd3;
  }

  .divider {
    height: 1px;
    background: #e2e8f0;
    margin: 10px 0;
  }

  .answer-line {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.35;
    color: #334155;
  }

  .answer-line strong {
    color: #0f172a;
    font-weight: 700;
  }

  .watermark {
    position: absolute;
    bottom: 16px;
    right: 32px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #94a3b8;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="title-header">
    <h1>Luminous Blueprint</h1>
  </div>

  <div class="grid-container">
    <!-- Card 1 -->
    <div class="card">
      <div class="card-top">
        <div class="question">What is the voltage and frequency of UK domestic mains electricity?</div>
        <div class="cue-pill">Success Cue: Standard UK domestic supply</div>
      </div>
      <div class="divider"></div>
      <div class="answer-line"><strong>Answer:</strong> 230 V AC at 50 Hz (alternating current).</div>
    </div>

    <!-- Card 2 -->
    <div class="card">
      <div class="card-top">
        <div class="question">State the colours of the live, neutral, and earth wires in a UK 3-pin plug.</div>
        <div class="cue-pill amber">Success Cue: Wire insulation colours</div>
      </div>
      <div class="divider"></div>
      <div class="answer-line"><strong>Answer:</strong> Live = Brown, Neutral = Blue, Earth = Green/Yellow stripes.</div>
    </div>

    <!-- Card 3 -->
    <div class="card">
      <div class="card-top">
        <div class="question">Which wire in a plug contains the fuse and why?</div>
        <div class="cue-pill rose">Success Cue: Cuts off high voltage</div>
      </div>
      <div class="divider"></div>
      <div class="answer-line"><strong>Answer:</strong> Live wire, so melting isolates appliance from 230 V supply.</div>
    </div>

    <!-- Card 4 -->
    <div class="card">
      <div class="card-top">
        <div class="question">How does an earth wire and fuse together prevent electric shock?</div>
        <div class="cue-pill">Success Cue: Low-resistance path to ground</div>
      </div>
      <div class="divider"></div>
      <div class="answer-line"><strong>Answer:</strong> Fault current surges safely to earth, instantly melting the fuse.</div>
    </div>

    <!-- Card 5 -->
    <div class="card">
      <div class="card-top">
        <div class="question">Calculate the current drawn by a 2300 W kettle connected to 230 V mains.</div>
        <div class="cue-pill amber">Success Cue: I = P ÷ V</div>
      </div>
      <div class="divider"></div>
      <div class="answer-line"><strong>Answer:</strong> 10 A (I = P / V = 2300 / 230 = 10 A → 13 A fuse).</div>
    </div>

    <!-- Card 6 -->
    <div class="card">
      <div class="card-top">
        <div class="question">What does the double insulation symbol (two concentric squares) mean?</div>
        <div class="cue-pill rose">Success Cue: Plastic casing, 2-core cable</div>
      </div>
      <div class="divider"></div>
      <div class="answer-line"><strong>Answer:</strong> Appliance has plastic casing; cannot become live so needs no earth wire.</div>
    </div>
  </div>

  <div class="watermark">
    <span>✦ Gemini Notebook</span>
  </div>
</body>
</html>`;
}

async function main() {
  console.log("=== Step 1: Checking slide files ===");
  // Check if slide_03 exists and slide_02 does not (already shifted)
  const slide03Exists = await fs.access(path.join(SLIDES_DIR, "slide_03.png")).then(() => true).catch(() => false);
  const slide02Exists = await fs.access(path.join(SLIDES_DIR, "slide_02.png")).then(() => true).catch(() => false);

  if (!slide03Exists) {
    // Rename practical slide first if exists
    const oldPractical = path.join(SLIDES_DIR, "slide_16_practical.png");
    const newPractical = path.join(SLIDES_DIR, "slide_17_practical.png");
    try {
      await fs.rename(oldPractical, newPractical);
      console.log("Renamed practical slide -> slide_17_practical.png");
    } catch {}

    for (let i = 15; i >= 2; i--) {
      const oldName = `slide_${String(i).padStart(2, "0")}.png`;
      const newName = `slide_${String(i + 1).padStart(2, "0")}.png`;
      const oldPath = path.join(SLIDES_DIR, oldName);
      const newPath = path.join(SLIDES_DIR, newName);
      try {
        await fs.rename(oldPath, newPath);
        console.log(`Renamed ${oldName} -> ${newName}`);
      } catch {}
    }
  } else {
    console.log("Slides already shifted (slide_03.png exists).");
  }

  console.log("\n=== Step 2: Rendering Luminous Blueprint Starter Grid to slide_02.png via CDP ===");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.setContent(getStarterGridHtml(), { waitUntil: "load" });
  await page.waitForTimeout(600);

  const slide02Path = path.join(SLIDES_DIR, "slide_02.png");
  await page.screenshot({ path: slide02Path });
  console.log(`Saved pristine starter slide: ${slide02Path}`);
  await page.close();

  console.log("\n=== Step 3: Updating manifest.json ===");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Define Slide 2 with standard interactive reveals
  const standardCells = [
    { x: 9.5, y: 38.5, w: 27, h: 6.5 },
    { x: 38.0, y: 38.5, w: 27, h: 6.5 },
    { x: 66.5, y: 38.5, w: 27, h: 6.5 },
    { x: 9.5, y: 72.0, w: 27, h: 6.5 },
    { x: 38.0, y: 72.0, w: 27, h: 6.5 },
    { x: 66.5, y: 72.0, w: 27, h: 6.5 },
  ];

  const slide2Object = {
    number: 2,
    title: "Starter Activity: Knowledge Retrieval (Fuses and Earthing)",
    imageFileName: "slide_02.png",
    imageUrl: "/decks/physics_electricity_magnetism/Lesson_09_Fuses_and_Earthing/slides/slide_02.png",
    sourceMediaPath: "rendered/slide_02.png",
    isInteractive: true,
    interactiveType: "question_reveal",
    reveals: starterQuestions.map((sq, idx) => {
      const b = standardCells[idx] || standardCells[0];
      return {
        id: `reveal_s2_cell_${idx + 1}`,
        question: `${idx + 1}. ${sq.q}`,
        expectedAnswer: sq.a,
        bounds: { ...b },
        answerBounds: { ...b },
        revealMode: "overlay",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: false,
        answerIsBaked: false
      };
    })
  };

  // Titles for the content slides
  const contentSlideTitles = [
    "Learning Objectives",
    "The UK Mains Supply",
    "Anatomy of the 3-Pin Plug",
    "Inside the Cable (Wire Colours & Roles)",
    "The Fuse (Structure & Properties)",
    "How Fuses Work (Heating & Breaking)",
    "Choosing the Right Fuse (I = P ÷ V)",
    "Knowledge Checkpoint",
    "The Hazard: Electric Shock",
    "The Hero: Earthing & Low Resistance",
    "The Sequence of Protection",
    "Double Insulation (Class II Appliances)",
    "Practical: Fuses & Earthing Workflow",
    "Plenary Summary & Core Equations"
  ];

  const newSlidesList = [manifest.slides[0], slide2Object];

  // Map shifted content slides 3..16
  for (let i = 1; i <= 14; i++) {
    const slideNum = i + 2; // 3..16
    const fileName = `slide_${String(slideNum).padStart(2, "0")}.png`;
    const s = {
      number: slideNum,
      title: contentSlideTitles[i - 1] || `Slide ${slideNum}`,
      imageFileName: fileName,
      imageUrl: `/decks/physics_electricity_magnetism/Lesson_09_Fuses_and_Earthing/slides/${fileName}`,
      sourceMediaPath: `ppt/media/image${i + 1}.png`,
      isInteractive: false,
      interactiveType: null
    };
    newSlidesList.push(s);
  }

  // Slide 17: Interactive practical simulator
  newSlidesList.push({
    number: 17,
    title: "Interactive Practical: Appliance Fuses, Earthing & Fault Protection Lab",
    imageFileName: "slide_17_practical.png",
    imageUrl: "/decks/physics_electricity_magnetism/Lesson_09_Fuses_and_Earthing/slides/slide_17_practical.png",
    sourceMediaPath: "web_embed/slide_17_practical.png",
    isInteractive: false,
    interactiveType: "web_embed",
    webEmbed: {
      url: "/interactives/physics/fuses_and_earthing_sim.html",
      title: "Interactive Practical: Appliance Fuses, Earthing & Fault Protection Lab",
      label: "Fuses & Earthing Simulation Lab"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 45,
      timeGuideDisplay: "40–60s",
      vciScore: "4.8",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Active Simulation",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1100,
        readingMs: 18000,
        semanticProcessingMs: 12000,
        wordCount: 45,
        visualElementsCount: 4
      }
    }
  });

  // Calculate cognitive load guide for every slide
  for (const s of newSlidesList) {
    if (!s.cognitiveGuide) {
      s.cognitiveGuide = analyzeSlideCognitiveLoad(s);
    }
  }

  manifest.totalSlides = newSlidesList.length;
  manifest.slides = newSlidesList;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Manifest updated successfully! Total slides: ${manifest.totalSlides}`);
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
