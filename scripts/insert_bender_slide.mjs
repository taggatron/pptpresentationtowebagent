import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const SLIDES_DIR = path.resolve("public/decks/physics_electricity_magnetism/Lesson_02_Circuits/slides");
const MANIFEST_PATH = path.resolve("public/decks/physics_electricity_magnetism/Lesson_02_Circuits/manifest.json");
const PPTX_PATH = path.resolve("../NotebookLMagent/output/powerpoints_physics_electricity_magnetism/Lesson_02_Circuits.pptx");

async function main() {
  console.log("1. Shifting slides 11..16 by +1 in filesystem...");
  const tempDir = path.join(SLIDES_DIR, "_temp_bender_shift");
  await fs.mkdir(tempDir, { recursive: true });

  // Shift slide_11..15 to slide_12..16
  for (let i = 15; i >= 11; i--) {
    const oldNumStr = String(i).padStart(2, "0");
    const newNumStr = String(i + 1).padStart(2, "0");
    const oldFile = path.join(SLIDES_DIR, `slide_${oldNumStr}.png`);
    const tempFile = path.join(tempDir, `slide_${newNumStr}.png`);
    try {
      await fs.copyFile(oldFile, tempFile);
      await fs.unlink(oldFile);
    } catch (e) {
      console.warn(`Could not shift slide_${oldNumStr}:`, e.message);
    }
  }

  // Shift practical slide 16 to 17
  const oldPractical = path.join(SLIDES_DIR, "slide_16_practical.png");
  const tempPractical = path.join(tempDir, "slide_17_practical.png");
  try {
    await fs.copyFile(oldPractical, tempPractical);
    await fs.unlink(oldPractical);
  } catch (e) {
    console.warn("Could not shift slide_16_practical:", e.message);
  }

  // Move temp files into SLIDES_DIR
  const tempFiles = await fs.readdir(tempDir);
  for (const f of tempFiles) {
    await fs.copyFile(path.join(tempDir, f), path.join(SLIDES_DIR, f));
    await fs.unlink(path.join(tempDir, f));
  }
  await fs.rmdir(tempDir);

  // Deploy new slide 11 (Bender meme)
  console.log("2. Deploying new slide_11.png (Bender schematic meme)...");
  await fs.copyFile("scratch/new_slide_bender_schematic.png", path.join(SLIDES_DIR, "slide_11.png"));

  console.log("3. Updating manifest.json...");
  const manifestRaw = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestRaw);

  const slides1To10 = manifest.slides.filter(s => s.number <= 10);
  const slidesAfter = manifest.slides.filter(s => s.number >= 11);

  const shiftedAfter = slidesAfter.map(s => {
    const newNum = s.number + 1;
    const isPractical = s.interactiveType === "web_embed" || s.imageFileName.includes("practical");
    const newFileName = isPractical ? `slide_17_practical.png` : `slide_${String(newNum).padStart(2, "0")}.png`;
    return {
      ...s,
      number: newNum,
      imageFileName: newFileName,
      imageUrl: `/decks/physics_electricity_magnetism/Lesson_02_Circuits/slides/${newFileName}`,
      sourceMediaPath: isPractical ? `web_embed/${newFileName}` : `ppt/media/image${newNum}.png`
    };
  });

  const benderSlide = {
    number: 11,
    title: '"Draw Me Like One of Your Circuit Diagrams..."',
    imageFileName: "slide_11.png",
    imageUrl: "/decks/physics_electricity_magnetism/Lesson_02_Circuits/slides/slide_11.png",
    sourceMediaPath: "ppt/media/image11.png",
    isInteractive: false,
    interactiveType: null,
    cognitiveGuide: {
      estimatedTimeSeconds: 60,
      timeGuideDisplay: "60s",
      vciScore: "2.4",
      complexityCategory: "Low",
      ragLevel: "green",
      ragColor: "emerald",
      ragLabel: "Schematics Hook"
    }
  };

  manifest.slides = [
    ...slides1To10,
    benderSlide,
    ...shiftedAfter
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

for i in range(1, 17):
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
  console.error("Failed to insert Bender slide:", err);
  process.exit(1);
});
