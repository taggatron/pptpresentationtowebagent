import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { getStarterSlideHtml } from "./generate_lesson_02_starter_slide.mjs";

const DECK_DIR = path.resolve("public/decks/genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function updateSlide02() {
  console.log("=== Rendering new Slide 2 with high brightness and larger typography ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  
  await page.setContent(getStarterSlideHtml(), { waitUntil: "load" });
  await page.waitForTimeout(500);

  const destSlide02Path = path.join(SLIDES_DIR, "slide_02.png");
  await page.screenshot({ path: destSlide02Path });
  console.log(`Rendered and saved to: ${destSlide02Path}`);

  // Calculate box metrics dynamically
  const metrics = await page.evaluate(() => {
    const results = {};
    for (let i = 1; i <= 6; i++) {
      const card = document.getElementById("card_cell_" + i).getBoundingClientRect();
      const box = document.getElementById("box_cell_" + i).getBoundingClientRect();
      results["cell_" + i] = {
        card: {
          x: +(card.left / 1376 * 100).toFixed(2),
          y: +(card.top / 768 * 100).toFixed(2),
          w: +(card.width / 1376 * 100).toFixed(2),
          h: +(card.height / 768 * 100).toFixed(2)
        },
        answerBox: {
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

  console.log("\n=== Updating manifest.json for Slide 2 ===");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  const slide2 = manifest.slides.find((s) => s.number === 2);
  if (!slide2) {
    throw new Error("Slide 2 not found in manifest");
  }

  // Update bounds for each cell
  slide2.interactiveCells = slide2.interactiveCells.map((cell, idx) => {
    const cellKey = `cell_${idx + 1}`;
    const m = metrics[cellKey];
    return {
      ...cell,
      bounds: m.card,
      answerBounds: m.answerBox
    };
  });

  // Update serial animation targetBounds
  if (slide2.serialAnimation?.serialSteps) {
    slide2.serialAnimation.serialSteps = slide2.serialAnimation.serialSteps.map((step, idx) => ({
      ...step,
      targetBounds: slide2.interactiveCells[idx].answerBounds
    }));
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Updated manifest written to ${MANIFEST_PATH}`);
}

updateSlide02().catch((err) => {
  console.error("Error updating slide 2:", err);
  process.exit(1);
});
