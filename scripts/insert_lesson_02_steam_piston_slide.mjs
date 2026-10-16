import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const execFileAsync = promisify(execFile);

const DECK_DIR = path.resolve("public/decks/physics_matter_pressure_heat/Lesson_02_Pressure_Alternative");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const GENERATED_IMAGE_PATH = "/Users/danieltagg/.gemini/antigravity-ide/brain/20bf7750-2712-4333-8fa2-6aebef4f9ac6/steam_piston_engine_slide_1792139178268.jpg";

async function main() {
  console.log("=== Step 1: Loading manifest ===");
  const manifestRaw = await fs.readFile(MANIFEST_PATH, "utf-8");
  const manifest = JSON.parse(manifestRaw);

  const alreadyHasSlide = manifest.slides.some(s => s.title?.includes("Steam Engine Piston"));
  if (alreadyHasSlide) {
    console.log("Steam engine piston slide is already present in manifest!");
    return;
  }

  console.log(`Current slide count: ${manifest.slides.length}`);

  console.log("=== Step 2: Renaming slide files 8..end in reverse order ===");
  // We need to shift slides starting from index 7 (slide 8) up to 15
  // Renaming files on disk must go from the highest down to 8 to avoid overwriting!
  for (let num = manifest.slides.length; num >= 8; num--) {
    const slide = manifest.slides[num - 1];
    const oldFileName = slide.imageFileName;
    const isPractical = slide.webEmbed || oldFileName?.includes("practical");
    const newNum = num + 1;
    const newFileName = isPractical
      ? `slide_${String(newNum).padStart(2, "0")}_practical.png`
      : `slide_${String(newNum).padStart(2, "0")}.png`;

    const oldPath = path.join(SLIDES_DIR, oldFileName);
    const newPath = path.join(SLIDES_DIR, newFileName);

    try {
      await fs.access(oldPath);
      console.log(`Renaming ${oldFileName} -> ${newFileName}`);
      await fs.rename(oldPath, newPath);
    } catch (e) {
      console.warn(`File ${oldFileName} not found, skipping rename.`);
    }
  }

  console.log("=== Step 3: Converting and saving new slide_08.png ===");
  const targetSlide8Path = path.join(SLIDES_DIR, "slide_08.png");
  await execFileAsync("sips", ["-s", "format", "png", GENERATED_IMAGE_PATH, "--out", targetSlide8Path]);
  console.log(`Saved new Slide 8 to: ${targetSlide8Path}`);

  console.log("=== Step 4: Constructing new slide 8 and shifted slides ===");
  const slide8Obj = {
    number: 8,
    title: "Temperature, Pressure and Explosions: The Steam Engine Piston",
    imageFileName: "slide_08.png",
    imageUrl: "/decks/physics_matter_pressure_heat/Lesson_02_Pressure_Alternative/slides/slide_08.png",
    sourceMediaPath: "gemini_image_generator/steam_piston_engine_slide.png",
    isInteractive: false,
    interactiveType: null,
    text: [
      "Temperature, Pressure and Explosions",
      "Heated steam has a high pressure.",
      "This pushes the piston to turn the train's wheels."
    ],
    cognitiveGuide: analyzeSlideCognitiveLoad({
      number: 8,
      title: "Temperature, Pressure and Explosions: The Steam Engine Piston",
      isInteractive: false,
      text: [
        "Temperature, Pressure and Explosions",
        "Heated steam has a high pressure.",
        "This pushes the piston to turn the train's wheels."
      ]
    })
  };

  const preservedSlides = manifest.slides.slice(0, 7);
  const shiftedOldSlides = manifest.slides.slice(7).map((s) => {
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

  manifest.slides = [...preservedSlides, slide8Obj, ...shiftedOldSlides];
  manifest.totalSlides = manifest.slides.length;

  console.log(`New total slides: ${manifest.totalSlides}`);
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  console.log("=== Manifest updated successfully! ===");
}

main().catch(err => {
  console.error("Error inserting slide:", err);
  process.exit(1);
});
