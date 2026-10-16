import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { getParticleModelStarterSlideHtml } from "./generate_lesson_02_alt_starter_html.mjs";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const DECK_DIR = path.resolve("public/decks/physics_matter_pressure_heat/Lesson_02_Pressure_Alternative");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

const starterQuestions = [
  {
    q: "How are particles arranged and how do they move in a solid compared to a gas?",
    a: "Solids: tightly packed in regular lattice, vibrating in place. Gases: far apart, rapid random motion.",
    cue: "Regular lattice vs random motion"
  },
  {
    q: "What does temperature measure in terms of the particle model?",
    a: "Temperature is directly proportional to the average kinetic energy (mean speed) of the particles.",
    cue: "Average kinetic energy & speed"
  },
  {
    q: "How do gas particles exert pressure on the walls of their container?",
    a: "Particles collide with container walls; each impact exerts a normal force. Pressure is total force divided by area (P = F / A).",
    cue: "Collision force per unit area (P = F / A)"
  },
  {
    q: "Why does heating a sealed aerosol can cause internal pressure to increase?",
    a: "Particles gain kinetic energy and speed, striking container walls harder (greater force) and more frequently.",
    cue: "Faster collisions + higher frequency"
  },
  {
    q: "If gas volume is halved at constant temperature, what happens to pressure and why?",
    a: "Pressure doubles (P ∝ 1/V); particles are crowded into half the space, doubling wall collision frequency.",
    cue: "More frequent wall collisions"
  },
  {
    q: "When ice melts or liquid boils, why is mass conserved and which bonds break?",
    a: "Particle number stays constant (mass conserved); weak intermolecular forces break, not strong covalent bonds.",
    cue: "Particle number stays constant"
  }
];

async function main() {
  console.log("=== Step 1: Render and Measure Starter Slide HTML via Playwright ===");
  const browser = await chromium.connectOverCDP("http://localhost:9333");
  const context = browser.contexts()[0] || await browser.newContext({ viewport: { width: 1376, height: 768 } });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1376, height: 768 });

  await page.setContent(getParticleModelStarterSlideHtml(), { waitUntil: "load" });
  await page.waitForTimeout(500);

  // Measure exact bounding boxes of cards and answer boxes
  const measuredMetrics = await page.evaluate(() => {
    const results = [];
    for (let i = 1; i <= 6; i++) {
      const card = document.getElementById("card_cell_" + i).getBoundingClientRect();
      const box = document.getElementById("box_cell_" + i).getBoundingClientRect();
      results.push({
        id: `cell_${i}`,
        bounds: {
          x: +(card.left / 1376 * 100).toFixed(2),
          y: +(card.top / 768 * 100).toFixed(2),
          w: +(card.width / 1376 * 100).toFixed(2),
          h: +(card.height / 768 * 100).toFixed(2)
        },
        answerBounds: {
          x: +(box.left / 1376 * 100).toFixed(2),
          y: +(box.top / 768 * 100).toFixed(2),
          w: +(box.width / 1376 * 100).toFixed(2),
          h: +(box.height / 768 * 100).toFixed(2)
        }
      });
    }
    return results;
  });

  console.log("Calculated metrics for 6 cards:", JSON.stringify(measuredMetrics, null, 2));

  // Render to a temporary screenshot
  const tempScreenshot = path.resolve("scratch/starter_slide_02_pressure.png");
  await page.screenshot({ path: tempScreenshot });
  console.log(`Rendered screenshot to ${tempScreenshot}`);
  await page.close();

  console.log("\n=== Step 2: Read current manifest and prepare slide shift ===");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Check if Slide 2 is already a starter_qa_grid
  const slide2IsAlreadyStarter = manifest.slides[1]?.interactiveType === "starter_qa_grid";

  if (!slide2IsAlreadyStarter) {
    console.log("Shifting slide files (from current 2..13 upwards to 3..14, and practical 14 -> 15)...");
    const existingFiles = await fs.readdir(SLIDES_DIR);
    
    // Check if slide_14_practical.png exists
    if (existingFiles.includes("slide_14_practical.png")) {
      await fs.rename(
        path.join(SLIDES_DIR, "slide_14_practical.png"),
        path.join(SLIDES_DIR, "slide_15_practical.png")
      );
      console.log("Renamed slide_14_practical.png -> slide_15_practical.png");
    }

    // Shift numeric slides from 13 down to 2
    for (let i = 13; i >= 2; i--) {
      const oldName = `slide_${String(i).padStart(2, "0")}.png`;
      const newName = `slide_${String(i + 1).padStart(2, "0")}.png`;
      const oldPath = path.join(SLIDES_DIR, oldName);
      const newPath = path.join(SLIDES_DIR, newName);
      try {
        await fs.rename(oldPath, newPath);
        console.log(`Renamed ${oldName} -> ${newName}`);
      } catch (err) {
        console.warn(`Could not rename ${oldName}:`, err.message);
      }
    }
  } else {
    console.log("Slide 2 is already a starter grid; replacing slide_02.png in-place without shifting.");
  }

  // Copy rendered image to slide_02.png
  const destSlide02Path = path.join(SLIDES_DIR, "slide_02.png");
  await fs.copyFile(tempScreenshot, destSlide02Path);
  console.log(`Saved new Slide 2 image to: ${destSlide02Path}`);

  console.log("\n=== Step 3: Constructing interactiveCells and Slide 2 definition ===");
  const interactiveCells = starterQuestions.map((qObj, idx) => {
    const metric = measuredMetrics[idx];
    return {
      id: `cell_${idx + 1}`,
      row: Math.floor(idx / 2),
      col: idx % 2,
      bounds: metric.bounds,
      answerBounds: metric.answerBounds,
      question: qObj.q,
      expectedAnswer: qObj.a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    };
  });

  const slide2Obj = {
    number: 2,
    title: "Starter Activity: Particle Model Retrieval Grid",
    imageFileName: "slide_02.png",
    imageUrl: "/decks/physics_matter_pressure_heat/Lesson_02_Pressure_Alternative/slides/slide_02.png",
    isInteractive: true,
    interactiveType: "starter_qa_grid",
    gridTitle: "Starter Activity: Particle Model Retrieval Grid",
    starterQuestions,
    interactiveCells,
    cognitiveGuide: analyzeSlideCognitiveLoad({
      number: 2,
      title: "Starter Activity: Particle Model Retrieval Grid",
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
      mode: "starter-grid-unmask",
      strategy: "unmask-grid",
      totalSteps: 6
    }
  };

  let newSlides = [];
  if (!slide2IsAlreadyStarter) {
    // Preserve slide 1
    const slide1 = manifest.slides[0];

    // Shift old slides 2..end
    const shiftedOldSlides = manifest.slides.slice(1).map((s, idx) => {
      const nextNum = s.number + 1;
      const isPractical = s.webEmbed || s.imageFileName?.includes("practical");
      const nextFileName = isPractical
        ? `slide_${String(nextNum).padStart(2, "0")}_practical.png`
        : `slide_${String(nextNum).padStart(2, "0")}.png`;
      const nextUrl = `/decks/physics_matter_pressure_heat/Lesson_02_Pressure_Alternative/slides/${nextFileName}`;

      return {
        ...s,
        number: nextNum,
        imageFileName: nextFileName,
        imageUrl: nextUrl
      };
    });

    newSlides = [slide1, slide2Obj, ...shiftedOldSlides];
  } else {
    // Replace slide 2 in place
    newSlides = manifest.slides.map((s, idx) => (idx === 1 ? slide2Obj : s));
  }

  manifest.totalSlides = newSlides.length;
  manifest.slides = newSlides;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Updated ${MANIFEST_PATH} with ${newSlides.length} slides.`);
  console.log("=== Starter slide insertion complete! ===");
}

main().catch(console.error);
