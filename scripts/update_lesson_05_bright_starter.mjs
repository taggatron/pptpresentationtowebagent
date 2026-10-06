import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import { starterQuestions, getStarterSlideHtml } from "./test_render_bright_starter.mjs";

const deckDir = "public/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited";
const slide02Path = path.join(deckDir, "slides/slide_02.png");
const manifestPath = path.join(deckDir, "manifest.json");

async function updateStarterSlide() {
  console.log("=== Step 1: Render new bright slide_02.png ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await page.setContent(getStarterSlideHtml(), { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // Take the 1376x768 screenshot for slide_02.png
  await page.screenshot({ path: slide02Path, clip: { x: 0, y: 0, width: 1376, height: 768 } });
  console.log(`Saved new bright starter slide image to ${slide02Path}`);
  await browser.close();

  console.log("=== Step 2: Update manifest.json Slide 2 ===");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  const slide2 = manifest.slides.find(s => s.number === 2);
  if (!slide2) throw new Error("Could not find slide 2 in manifest!");

  // New questions array for manifest
  const newStarterQuestions = starterQuestions.map(item => ({
    q: item.q,
    a: item.a
  }));

  // Measured coordinates
  const newInteractiveCells = [
    {
      id: "cell_1",
      row: 0,
      col: 0,
      bounds: { x: 3.49, y: 18.69, w: 29.43, h: 33.85 },
      answerBounds: { x: 4.65, y: 41.87, w: 27.11, h: 8.85 },
      question: newStarterQuestions[0].q,
      expectedAnswer: newStarterQuestions[0].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cell_2",
      row: 0,
      col: 1,
      bounds: { x: 35.25, y: 18.69, w: 29.43, h: 33.85 },
      answerBounds: { x: 36.41, y: 41.87, w: 27.11, h: 8.85 },
      question: newStarterQuestions[1].q,
      expectedAnswer: newStarterQuestions[1].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cell_3",
      row: 0,
      col: 2,
      bounds: { x: 67.01, y: 18.69, w: 29.43, h: 33.85 },
      answerBounds: { x: 68.17, y: 41.87, w: 27.11, h: 8.85 },
      question: newStarterQuestions[2].q,
      expectedAnswer: newStarterQuestions[2].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cell_4",
      row: 1,
      col: 0,
      bounds: { x: 3.49, y: 55.67, w: 29.43, h: 33.85 },
      answerBounds: { x: 4.65, y: 78.85, w: 27.11, h: 8.85 },
      question: newStarterQuestions[3].q,
      expectedAnswer: newStarterQuestions[3].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cell_5",
      row: 1,
      col: 1,
      bounds: { x: 35.25, y: 55.67, w: 29.43, h: 33.85 },
      answerBounds: { x: 36.41, y: 78.85, w: 27.11, h: 8.85 },
      question: newStarterQuestions[4].q,
      expectedAnswer: newStarterQuestions[4].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    },
    {
      id: "cell_6",
      row: 1,
      col: 2,
      bounds: { x: 67.01, y: 55.67, w: 29.43, h: 33.85 },
      answerBounds: { x: 68.17, y: 78.85, w: 27.11, h: 8.85 },
      question: newStarterQuestions[5].q,
      expectedAnswer: newStarterQuestions[5].a,
      answerVisibleInImage: true,
      answerIsBaked: true,
      revealMode: "unmask",
      confidence: 1
    }
  ];

  slide2.title = "Starter Activity: Prior Knowledge Retrieval Grid";
  slide2.gridTitle = "Starter Activity: Prior Knowledge Retrieval Grid";
  slide2.starterQuestions = newStarterQuestions;
  slide2.interactiveCells = newInteractiveCells;
  slide2.sourceMediaPath = "gemini/bright_dna_backdrop_clean.jpg";

  // Serial animation steps update
  if (slide2.serialAnimation) {
    slide2.serialAnimation.serialSteps = newInteractiveCells.map((c, idx) => ({
      step: idx + 1,
      title: `Reveal: ${c.question}`,
      targetId: c.id,
      revealMode: "unmask",
      durationMs: 800
    }));
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Successfully updated manifest.json for Slide 2!");
}

updateStarterSlide().catch(err => {
  console.error(err);
  process.exit(1);
});
