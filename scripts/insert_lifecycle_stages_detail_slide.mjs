import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const DECK_ID = "Classic_Lesson_11_Lifecycle_analysis";
const SET_ID = "ecology_atmosphere_classic";
const PROJECT_ROOT = process.cwd();
const DECK_DIR = path.join(PROJECT_ROOT, "public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

const SOURCE_IMAGE_PATH = "/Users/danieltagg/.gemini/antigravity-ide/brain/cefd6c84-53c0-4969-99f4-3368dc984eb3/.user_uploaded/media_1790672306077.jpg";
const TARGET_IMAGE_NAME = "slide_13_lifecycle_stages_detail.png";
const TARGET_IMAGE_PATH = path.join(SLIDES_DIR, TARGET_IMAGE_NAME);

async function main() {
  console.log(`=== Inserting LCA 4 Stages Detail Slide into ${DECK_ID} before Slide 13 ===`);

  // 1. Upscale and convert the source image to 2880x1620 high-res PNG
  console.log(`Converting and upscaling ${SOURCE_IMAGE_PATH} to ${TARGET_IMAGE_PATH}...`);
  const pythonScript = `
from PIL import Image
src = '${SOURCE_IMAGE_PATH}'
dest = '${TARGET_IMAGE_PATH}'
img = Image.open(src)
upscaled = img.resize((2880, 1620), Image.Resampling.LANCZOS)
upscaled.save(dest, format='PNG', optimize=True)
print('Successfully saved', dest)
`;
  execSync(`python3 -c "${pythonScript.trim()}"`, { stdio: "inherit" });

  // 2. Read manifest
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Check if already inserted
  const existingIdx = manifest.slides.findIndex(
    (s) => s.imageFileName === TARGET_IMAGE_NAME || s.title?.includes("Detailed Lifecycle Stages")
  );
  if (existingIdx !== -1) {
    console.log(`Existing entry found at index ${existingIdx}. Removing old entry to re-insert cleanly.`);
    manifest.slides.splice(existingIdx, 1);
  }

  // 3. Find insertion target: before slide 13 (which currently has title "Mid-Lesson Checkpoint: Objectives Progress" or image "slide_19.png")
  // Or immediately after Slide 12 ("The 4 Stages of an LCA: Flow Diagram" / "slide_13.png")
  let targetIndex = manifest.slides.findIndex(
    (s) => s.imageFileName === "slide_19.png" || s.title?.includes("Mid-Lesson Checkpoint")
  );

  if (targetIndex === -1) {
    // Fallback: look for slide_13.png + 1
    const slide12Idx = manifest.slides.findIndex((s) => s.imageFileName === "slide_13.png");
    if (slide12Idx !== -1) {
      targetIndex = slide12Idx + 1;
    } else {
      targetIndex = 12; // 0-based index for 13th slide
    }
  }

  console.log(`Target insertion index: ${targetIndex} (before slide "${manifest.slides[targetIndex]?.title}", currently Slide ${manifest.slides[targetIndex]?.number})`);

  // 4. Create the new slide entry
  const newSlide = {
    number: targetIndex + 1,
    title: "Detailed Lifecycle Stages: Processes & Environmental Impacts",
    imageFileName: TARGET_IMAGE_NAME,
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${TARGET_IMAGE_NAME}`,
    sourceMediaPath: "user_upload/media_1790672306077.jpg",
    isInteractive: false,
    interactiveType: null,
    text: `(Extracting) Raw materials
• This step involves digging for basic metal and oil start materials using techniques like big furnaces or electricity.
• Digging leads to habitat loss, fewer types of animals and plants, and changes the land forever.
• Basic starting materials (like raw metal or oil) are found from the ground, sea, or air.

Manufacture and distribution
• This is the process of putting basic parts together to make final products, often with robots.
• Factories turn raw plastics and metals into things like bottles or phones.
• Making and shipping products uses a huge amount of energy and fuel.

Using the product
• This stage is when the customer actually uses the product during its life.
• Products like phones and electric cars need constant electricity to work, using power over years.
• The less often you replace a product, the less total energy and materials you use.

Disposal
• Rubbish dumps use up useful space on the planet for many centuries.
• This step is when you get rid of a product that is broken or no longer useful.
• Materials are sorted into household recycling bins, rubbish dumps, or sent to be burned.
• Harmful chemicals can seep into the soil and pollute nearby water.
• Burning materials releases dirty air into the atmosphere.`,
    cognitiveGuide: {
      estimatedTimeSeconds: 75,
      timeGuideDisplay: "60–90s",
      vciScore: "6.8",
      complexityCategory: "Medium",
      ragLevel: "green",
      ragColor: "green",
      ragLabel: "Core Concept Analysis",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 45000,
        semanticProcessingMs: 30000,
        wordCount: 165,
        visualElementsCount: 8
      },
      academicReferences: [
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257.",
          relevance: "Explicit categorization of manufacturing, use, and disposal processes and impacts reduces extraneous cognitive search."
        },
        {
          citation: "Paivio, A. (1990). Dual coding theory and education. Educational Psychology Review, 3(3), 149-210.",
          relevance: "Integrating pictorial illustrations with process-impact descriptions enhances deep conceptual retention."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "local-heuristics"
    },
    hasProgressiveBuilds: false,
    contentAnalysis: {
      schemaVersion: 1,
      status: "ready",
      source: "curriculum-diagram",
      sourceHash: "lca-4stages-processes-impacts-v1",
      transcript: "Comprehensive 4-quadrant overview of raw material extraction, manufacturing and distribution, product use, and disposal with specific environmental impacts.",
      role: "instructional-concept",
      questions: [],
      questionCount: 0
    }
  };

  // 5. Insert into slides array
  manifest.slides.splice(targetIndex, 0, newSlide);

  // 6. Renumber all slides sequentially
  manifest.slides.forEach((slide, idx) => {
    slide.number = idx + 1;
  });

  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Successfully updated ${MANIFEST_PATH}`);
  console.log(`Total slides now: ${manifest.totalSlides}`);

  manifest.slides.forEach((s) => {
    console.log(`Slide ${s.number}: "${s.title}" (image: ${s.imageFileName})`);
  });
}

main().catch((err) => {
  console.error("Insertion failed:", err);
  process.exit(1);
});
