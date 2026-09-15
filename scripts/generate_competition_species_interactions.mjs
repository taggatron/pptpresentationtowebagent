/**
 * Species Interactions & Predator-Prey Slide Pipeline for Lesson 3 Competition
 * Deck: ecology_atmosphere_classic / Classic_Lesson_03_Competition
 * Slides:
 *   - slide_15.png: Beyond Competition: Mutualism vs. Parasitism (+/+ vs +/-)
 *   - slide_16.png: Ecological Dossier: Mutualism in Action (Clownfish & Anemone)
 *   - slide_17.png: The Parasite Arsenal: Exploiting the Host (Ecto- vs Endoparasites)
 *   - slide_18.png: Predator-Prey Dynamics: The Population Seesaw (Lynx vs Hare with Lag Curves)
 *   - slide_19.png: Active Retrieval: Classify the Species Interaction (4-Quadrant Challenge)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DECK_DIR = path.join(REPO_ROOT, "public", "decks", "ecology_atmosphere_classic", "Classic_Lesson_03_Competition");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

export async function verifyLesson03Slides() {
  console.log("=== Verifying Classic Lesson 03 Species Interaction Slides ===");
  const manifestRaw = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestRaw);

  console.log(`Deck: ${manifest.title} (${manifest.id})`);
  console.log(`Reported Total Slides: ${manifest.totalSlides}`);
  console.log(`Slides in Array: ${manifest.slides.length}`);

  const targetSlides = [15, 16, 17, 18, 19];
  for (const num of targetSlides) {
    const slideDef = manifest.slides.find((s) => s.number === num);
    if (!slideDef) {
      throw new Error(`Missing slide ${num} in manifest.`);
    }

    const imgPath = path.join(SLIDES_DIR, slideDef.imageFileName);
    const stat = await fs.stat(imgPath);
    console.log(`  Slide ${num}: ${slideDef.title}`);
    console.log(`    File: ${slideDef.imageFileName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  }

  console.log("\nAll 5 species interaction slides successfully verified in manifest and filesystem!");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  verifyLesson03Slides().catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
  });
}
