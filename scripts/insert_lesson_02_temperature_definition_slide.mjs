import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const execFileAsync = promisify(execFile);

const DECK_DIR = path.resolve("public/decks/physics_matter_pressure_heat/Lesson_02_Pressure_Alternative");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const GENERATED_IMAGE_PATH = "/Users/danieltagg/.gemini/antigravity-ide/brain/20bf7750-2712-4333-8fa2-6aebef4f9ac6/defining_temperature_slide_1792140485594.jpg";

async function main() {
  console.log("=== Step 1: Loading manifest ===");
  const manifestRaw = await fs.readFile(MANIFEST_PATH, "utf-8");
  const manifest = JSON.parse(manifestRaw);

  const alreadyHasSlide = manifest.slides.some(s => s.title?.includes("What is Temperature?"));
  if (alreadyHasSlide) {
    console.log("Temperature definition slide is already present in manifest!");
    return;
  }

  console.log(`Current slide count: ${manifest.slides.length}`);

  console.log("=== Step 2: Renaming slide files 7..end in reverse order ===");
  // We need to shift slides starting from index 6 (slide 7) up to 16
  for (let num = manifest.slides.length; num >= 7; num--) {
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

  console.log("=== Step 3: Converting and saving new slide_07.png ===");
  const targetSlide7Path = path.join(SLIDES_DIR, "slide_07.png");
  await execFileAsync("sips", ["-s", "format", "png", GENERATED_IMAGE_PATH, "--out", targetSlide7Path]);
  console.log(`Saved new Slide 7 to: ${targetSlide7Path}`);

  console.log("=== Step 4: Constructing new slide 7 and shifted slides ===");
  const slide7Obj = {
    number: 7,
    title: "What is Temperature? (Particle Kinetic Energy & Speed)",
    imageFileName: "slide_07.png",
    imageUrl: "/decks/physics_matter_pressure_heat/Lesson_02_Pressure_Alternative/slides/slide_07.png",
    sourceMediaPath: "gemini_image_generator/defining_temperature_slide.png",
    isInteractive: false,
    interactiveType: null,
    text: [
      "What is Temperature?",
      "Temperature is a measure of the average speed of particles (kinetic energy)",
      "Lower Temperature (Slower Movement) vs Higher Temperature (Faster Movement)",
      "Heating transfers thermal energy into particle kinetic energy.",
      "Higher temperature = particles move faster and collide with greater force."
    ],
    cognitiveGuide: analyzeSlideCognitiveLoad({
      number: 7,
      title: "What is Temperature? (Particle Kinetic Energy & Speed)",
      isInteractive: false,
      text: [
        "What is Temperature?",
        "Temperature is a measure of the average speed of particles (kinetic energy)",
        "Heating transfers thermal energy into particle kinetic energy.",
        "Higher temperature = particles move faster and collide with greater force."
      ]
    })
  };

  const preservedSlides = manifest.slides.slice(0, 6); // slides 1..6
  const shiftedOldSlides = manifest.slides.slice(6).map((s) => {
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

  manifest.slides = [...preservedSlides, slide7Obj, ...shiftedOldSlides];
  manifest.totalSlides = manifest.slides.length;

  console.log(`New total slides: ${manifest.totalSlides}`);
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  console.log("=== Manifest updated successfully! ===");
}

main().catch(err => {
  console.error("Error inserting slide:", err);
  process.exit(1);
});
