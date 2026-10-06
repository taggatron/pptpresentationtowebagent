import fs from "node:fs/promises";
import path from "node:path";

const PROJECT_ROOT = process.cwd();
const MANIFEST_PATH = path.join(
  PROJECT_ROOT,
  "public/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/manifest.json"
);

const VIDEO_REL_URL =
  "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/gemini_generated_video_e811233a.mp4";
const SLIDE_IMAGE_REL_URL =
  "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_01.png";

async function main() {
  console.log(`Reading manifest: ${MANIFEST_PATH}`);
  const raw = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(raw);

  const slideIndex = manifest.slides.findIndex((s) => s.number === 1);
  if (slideIndex === -1) {
    throw new Error("Could not find Slide 1 in manifest!");
  }

  const slide = manifest.slides[slideIndex];
  console.log(`Found Slide 1: "${slide.title}"`);

  const imageBuildId = "image_build_1";
  const videoBuildId = "video_build_2";

  const progressiveBuilds = [
    {
      id: imageBuildId,
      version: 1,
      kind: "image",
      label: "Build 1: Lesson 5: Gene mutations: acquired and inherited (Title)",
      imageUrl: SLIDE_IMAGE_REL_URL
    },
    {
      id: videoBuildId,
      version: 2,
      kind: "video",
      label: "Build 2: Video Intro (Gene Mutations)",
      videoUrl: VIDEO_REL_URL,
      imageUrl: SLIDE_IMAGE_REL_URL,
      posterUrl: SLIDE_IMAGE_REL_URL,
      startTime: 0,
      endTime: 10,
      transition: "blur-disintegrate"
    }
  ];

  const serialSteps = [
    {
      step: 1,
      buildId: imageBuildId,
      title: "Build 1: Lesson 5: Gene mutations: acquired and inherited (Title)",
      componentIds: [imageBuildId],
      targetBounds: { x: 0, y: 0, w: 100, h: 100 },
      revealType: "crossfade"
    },
    {
      step: 2,
      buildId: videoBuildId,
      title: "Build 2: Video Intro (Gene Mutations)",
      componentIds: [videoBuildId],
      targetBounds: { x: 0, y: 0, w: 100, h: 100 },
      revealType: "play-video"
    }
  ];

  const history = [
    {
      id: "ver_orig",
      label: "Build 1: Lesson 5: Gene mutations: acquired and inherited (Title)",
      imageUrl: SLIDE_IMAGE_REL_URL
    },
    {
      id: "ver_video_intro",
      label: "Build 2: Video Intro (Gene Mutations)",
      videoUrl: VIDEO_REL_URL,
      imageUrl: SLIDE_IMAGE_REL_URL,
      startTime: 0,
      endTime: 10
    }
  ];

  const updatedSlide = {
    ...slide,
    hasProgressiveBuilds: true,
    animationPlan: {
      version: 2,
      mode: "protected-video",
      reason: "Introductory video hook illustrating gene mutations.",
      protectedVideoCount: 1
    },
    videoUrl: VIDEO_REL_URL,
    originalImageUrl: SLIDE_IMAGE_REL_URL,
    posterUrl: SLIDE_IMAGE_REL_URL,
    startTime: 0,
    endTime: 10,
    progressiveBuilds,
    history,
    serialAnimation: {
      totalBuildSteps: 2,
      autoAdvanceDelayMs: 3200,
      serialSteps
    }
  };

  delete updatedSlide.geminiImageCells;

  manifest.slides[slideIndex] = updatedSlide;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log("Successfully updated Slide 1 in manifest.json!");
}

main().catch((err) => {
  console.error("Error updating manifest:", err);
  process.exit(1);
});
