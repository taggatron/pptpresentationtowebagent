import fs from "node:fs/promises";
import path from "node:path";

const DECK_ID = "Lesson_02_DNA_structure_telomeres_and_replication";
const SET_ID = "genetics_aaq";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const PREVIEW_SOURCE = path.resolve("scratch/test_auto_focus.png");

async function main() {
  console.log(`=== Inserting Meselson–Stahl Interactive Lab as Slide 8 in ${DECK_ID} ===\n`);

  // 1. Verify preview source exists
  try {
    await fs.access(PREVIEW_SOURCE);
    console.log(`✓ Verified preview image exists at ${PREVIEW_SOURCE}`);
  } catch (err) {
    console.error(`✗ Preview source not found at ${PREVIEW_SOURCE}`);
    process.exit(1);
  }

  // 2. Read and backup manifest.json
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  await fs.writeFile(`${MANIFEST_PATH}.bak`, rawManifest, "utf8");
  console.log(`✓ Backed up manifest.json to manifest.json.bak`);

  const manifest = JSON.parse(rawManifest);
  const currentTotal = manifest.slides.length;
  console.log(`Current slide count: ${currentTotal}`);

  // 3. Shift slide image files on disk in reverse order (currentTotal down to 8)
  console.log("\n--- Shifting slide images on disk ---");
  for (let num = currentTotal; num >= 8; num--) {
    const srcName = `slide_${String(num).padStart(2, "0")}.png`;
    const destName = `slide_${String(num + 1).padStart(2, "0")}.png`;
    const srcPath = path.join(SLIDES_DIR, srcName);
    const destPath = path.join(SLIDES_DIR, destName);

    try {
      await fs.access(srcPath);
      await fs.rename(srcPath, destPath);
      console.log(`  Renamed ${srcName} -> ${destName}`);
    } catch (e) {
      console.warn(`  Warning: could not find ${srcName} to rename.`);
    }
  }

  // 4. Copy preview image to slide_08.png
  const slide8ImgPath = path.join(SLIDES_DIR, "slide_08.png");
  await fs.copyFile(PREVIEW_SOURCE, slide8ImgPath);
  console.log(`✓ Copied test_auto_focus.png -> slide_08.png`);

  // 5. Build the new Slide 8 manifest entry
  const newInteractiveSlide = {
    number: 8,
    title: "Practical Lab: Meselson–Stahl DNA Replication",
    imageFileName: "slide_08.png",
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/slide_08.png`,
    sourceMediaPath: "interactives/meselson-stahl/index.html",
    isInteractive: true,
    interactiveType: "web_embed",
    webEmbed: {
      url: `/decks/${SET_ID}/${DECK_ID}/interactives/meselson-stahl/index.html`,
      title: "Meselson–Stahl DNA Replication Virtual Lab",
      label: "Interactive Practical Lab: CsCl Density Gradient Ultracentrifugation"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 180,
      timeGuideDisplay: "120–240s",
      vciScore: "4.5",
      complexityCategory: "Medium",
      ragLevel: "low",
      ragColor: "green",
      ragLabel: "Interactive Practical",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 8000,
        semanticProcessingMs: 40000,
        wordCount: 35,
        visualElementsCount: 6
      },
      academicReferences: [
        {
          citation: "Meselson, M., & Stahl, F. W. (1958). The replication of DNA in Escherichia coli. Proceedings of the National Academy of Sciences, 44(7), 671–682.",
          relevance: "Empirical proof of the semiconservative model of DNA replication via equilibrium density-gradient centrifugation."
        },
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
          relevance: "Interactive 3D simulation reduces extraneous cognitive load through direct manipulation of experimental controls."
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
    animationPlan: {
      version: 2,
      mode: "web-embed",
      reason: "Interactive virtual practical lab: Meselson–Stahl DNA replication with CsCl density gradient ultracentrifugation.",
      webEmbedPreserved: true,
      strategy: "direct-web-embed",
      planningSource: "web-embed-catalog",
      analyzedComponentCount: 1,
      plannedCellCount: 0,
      approvedCellCount: 0,
      qaRequired: false,
      questionReveal: false,
      protectedVideoCount: 0
    }
  };

  // 6. Update manifest slide array
  // Slides 1-7 (indices 0..6) remain unchanged
  const headSlides = manifest.slides.slice(0, 7);

  // Existing slides 8-17 (indices 7 onwards) shift up by 1
  const shiftedSlides = manifest.slides.slice(7).map((s) => {
    const nextNum = s.number + 1;
    const nextFileName = `slide_${String(nextNum).padStart(2, "0")}.png`;
    const nextUrl = `/decks/${SET_ID}/${DECK_ID}/slides/${nextFileName}`;

    const updatedSlide = {
      ...s,
      number: nextNum,
      imageFileName: nextFileName,
      imageUrl: nextUrl
    };

    if (Array.isArray(s.geminiImageCells)) {
      updatedSlide.geminiImageCells = s.geminiImageCells.map((c) => ({
        ...c,
        id: c.id.replace(`slide_${s.number}_`, `slide_${nextNum}_`),
        sourceImageUrl: nextUrl
      }));
    }

    return updatedSlide;
  });

  const updatedSlides = [...headSlides, newInteractiveSlide, ...shiftedSlides];

  manifest.totalSlides = updatedSlides.length;
  manifest.slides = updatedSlides;

  // 7. Write updated manifest
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`\n✓ Successfully wrote manifest.json with ${manifest.totalSlides} total slides!`);

  // Verify slide order
  console.log("\n--- Slide Sequence Summary ---");
  for (const s of manifest.slides) {
    console.log(`  Slide ${s.number}: [${s.interactiveType || "static"}] "${s.title}" (${s.imageFileName})`);
  }
}

main().catch((err) => {
  console.error("Error inserting slide:", err);
  process.exit(1);
});
