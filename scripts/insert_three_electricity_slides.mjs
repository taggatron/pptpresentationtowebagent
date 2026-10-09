import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const SLIDES_DIR = path.resolve("public/decks/physics_electricity_magnetism/Lesson_02_Circuits/slides");
const MANIFEST_PATH = path.resolve("public/decks/physics_electricity_magnetism/Lesson_02_Circuits/manifest.json");
const PPTX_PATH = path.resolve("../NotebookLMagent/output/powerpoints_physics_electricity_magnetism/Lesson_02_Circuits.pptx");

async function main() {
  console.log("1. Backing up existing slides and moving files to shift numbers...");
  
  // Make a temp directory for shifting
  const tempDir = path.join(SLIDES_DIR, "_temp_shift");
  await fs.mkdir(tempDir, { recursive: true });

  // Move former slides 3..12 to temp as slide_06..15
  for (let i = 12; i >= 3; i--) {
    const oldNumStr = String(i).padStart(2, "0");
    const newNumStr = String(i + 3).padStart(2, "0");
    const oldFile = path.join(SLIDES_DIR, `slide_${oldNumStr}.png`);
    const tempFile = path.join(tempDir, `slide_${newNumStr}.png`);
    try {
      await fs.copyFile(oldFile, tempFile);
      await fs.unlink(oldFile);
    } catch (e) {
      console.warn(`Could not shift slide_${oldNumStr}:`, e.message);
    }
  }

  // Move former slide 13 practical to 16
  const oldPractical = path.join(SLIDES_DIR, "slide_13_practical.png");
  const tempPractical = path.join(tempDir, "slide_16_practical.png");
  try {
    await fs.copyFile(oldPractical, tempPractical);
    await fs.unlink(oldPractical);
  } catch (e) {
    console.warn("Could not shift slide_13_practical:", e.message);
  }

  // Copy shifted files back to SLIDES_DIR
  const tempFiles = await fs.readdir(tempDir);
  for (const f of tempFiles) {
    await fs.copyFile(path.join(tempDir, f), path.join(SLIDES_DIR, f));
    await fs.unlink(path.join(tempDir, f));
  }
  await fs.rmdir(tempDir);

  // Copy the 3 new rendered slides into place
  console.log("2. Deploying the 3 new slides...");
  await fs.copyFile("scratch/new_slide_03_what_is_electricity.png", path.join(SLIDES_DIR, "slide_03.png"));
  await fs.copyFile("scratch/new_slide_04_definition.png", path.join(SLIDES_DIR, "slide_04.png"));
  await fs.copyFile("scratch/new_slide_05_battery_flow.png", path.join(SLIDES_DIR, "slide_05.png"));

  console.log("3. Updating manifest.json with 16 slides...");
  const manifestRaw = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestRaw);

  const slide1 = manifest.slides.find(s => s.number === 1);
  const slide2 = manifest.slides.find(s => s.number === 2);
  const oldSlides = manifest.slides.filter(s => s.number >= 3);

  // Shift old slides
  const shiftedOldSlides = oldSlides.map(s => {
    const newNum = s.number + 3;
    const isPractical = s.interactiveType === "web_embed" || s.imageFileName.includes("practical");
    const newFileName = isPractical ? `slide_16_practical.png` : `slide_${String(newNum).padStart(2, "0")}.png`;
    return {
      ...s,
      number: newNum,
      imageFileName: newFileName,
      imageUrl: `/decks/physics_electricity_magnetism/Lesson_02_Circuits/slides/${newFileName}`,
      sourceMediaPath: isPractical ? `web_embed/${newFileName}` : `ppt/media/image${newNum}.png`
    };
  });

  const newSlide3 = {
    number: 3,
    title: "Inquiry: What is Electricity?",
    imageFileName: "slide_03.png",
    imageUrl: "/decks/physics_electricity_magnetism/Lesson_02_Circuits/slides/slide_03.png",
    sourceMediaPath: "ppt/media/image3.png",
    isInteractive: false,
    interactiveType: null,
    cognitiveGuide: {
      estimatedTimeSeconds: 60,
      timeGuideDisplay: "60s",
      vciScore: "2.2",
      complexityCategory: "Low",
      ragLevel: "green",
      ragColor: "emerald",
      ragLabel: "Discussion Hook"
    }
  };

  const newSlide4 = {
    number: 4,
    title: "Defining Electricity: The Flow of Electrons",
    imageFileName: "slide_04.png",
    imageUrl: "/decks/physics_electricity_magnetism/Lesson_02_Circuits/slides/slide_04.png",
    sourceMediaPath: "ppt/media/image4.png",
    isInteractive: false,
    interactiveType: null,
    cognitiveGuide: {
      estimatedTimeSeconds: 90,
      timeGuideDisplay: "1–2 min",
      vciScore: "3.0",
      complexityCategory: "Low",
      ragLevel: "green",
      ragColor: "emerald",
      ragLabel: "Core Definition"
    }
  };

  const newSlide5 = {
    number: 5,
    title: "From Static to Flowing: How a Battery Works",
    imageFileName: "slide_05.png",
    imageUrl: "/decks/physics_electricity_magnetism/Lesson_02_Circuits/slides/slide_05.png",
    sourceMediaPath: "ppt/media/image5.png",
    isInteractive: false,
    interactiveType: null,
    cognitiveGuide: {
      estimatedTimeSeconds: 120,
      timeGuideDisplay: "2 min",
      vciScore: "3.6",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Battery Mechanism"
    }
  };

  manifest.slides = [
    slide1,
    slide2,
    newSlide3,
    newSlide4,
    newSlide5,
    ...shiftedOldSlides
  ];

  manifest.totalSlides = manifest.slides.length;
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Manifest updated with ${manifest.totalSlides} slides.`);

  console.log("4. Updating PowerPoint presentation via python-pptx...");
  const pythonScript = `
from pptx import Presentation
from pptx.util import Inches
import os

prs = Presentation()
prs.slide_width = Inches(17.77777777777778)
prs.slide_height = Inches(10.0)

blank_layout = prs.slide_layouts[6]

slides_dir = '${SLIDES_DIR}'

for i in range(1, 16):
    img_name = f'slide_{i:02d}.png'
    img_path = os.path.join(slides_dir, img_name)
    if os.path.exists(img_path):
        slide = prs.slides.add_slide(blank_layout)
        slide.shapes.add_picture(img_path, Inches(0), Inches(0), width=prs.slide_width, height=prs.slide_height)
        print(f'Added {img_name} to presentation')

prs.save('${PPTX_PATH}')
print('Successfully saved updated PPTX presentation!')
`;

  execSync(`python3 -c "${pythonScript}"`, { stdio: "inherit" });
  console.log("✦ All updates successfully completed!");
}

main().catch(err => {
  console.error("Failed to insert slides:", err);
  process.exit(1);
});
