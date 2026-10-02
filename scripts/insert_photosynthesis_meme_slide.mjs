import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";
import { planSlideAnimation } from "../src/slide-animation-planner.js";

const SET_ID = "cell_biology";
const DECK_ID = "Lesson_11_PHOTOSYNTHESIS";
const PROJECT_ROOT = process.cwd();
const DECK_DIR = path.join(PROJECT_ROOT, "public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

const SOURCE_IMAGE_PATH = "/Users/danieltagg/.gemini/antigravity-ide/brain/2ab838bb-ca14-49da-9f87-c6ca081ad516/.user_uploaded/media_1790930676812.png";
const TARGET_IMAGE_NAME = "slide_05_photosynthesis_meme.png";
const TARGET_IMAGE_PATH = path.join(SLIDES_DIR, TARGET_IMAGE_NAME);

async function main() {
  console.log(`=== Step 1: Preprocessing & Rendering Meme Slide for ${DECK_ID} ===`);

  // 1. High-quality 3x Lanczos upscale for crisp rendering
  const scratchDir = path.join(PROJECT_ROOT, "scratch");
  await fs.mkdir(scratchDir, { recursive: true });
  const upscaledMemePath = path.join(scratchDir, "meme_upscaled_lanczos.png");

  const pythonScript = `
from PIL import Image
src = '${SOURCE_IMAGE_PATH}'
dest = '${upscaledMemePath}'
im = Image.open(src)
upscaled = im.resize((im.width * 3, im.height * 3), Image.Resampling.LANCZOS)
upscaled.save(dest, format='PNG')
print('Upscaled source meme to:', upscaled.size)
`;
  execSync(`python3 -c "${pythonScript.trim().replace(/\n/g, '; ')}"`, { stdio: "inherit" });

  // 2. Render 1376x768 slide matching Lesson 11 presentation theme
  const memeBase64 = (await fs.readFile(upscaledMemePath)).toString("base64");
  const memeDataUrl = `data:image/png;base64,${memeBase64}`;

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1376px;
    height: 768px;
    background: radial-gradient(ellipse 90% 80% at 50% 50%, #303f4a 0%, #222c33 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .card-glow {
    position: absolute;
    width: 476px;
    height: 700px;
    border-radius: 20px;
    box-shadow: 0 0 80px 10px rgba(0, 0, 0, 0.5);
    pointer-events: none;
  }
  .card {
    position: relative;
    height: 700px;
    width: 476px;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 
      0 24px 60px -12px rgba(0, 0, 0, 0.75),
      0 0 0 1px rgba(255, 255, 255, 0.16);
    background: #1c262c;
    display: flex;
  }
  .meme-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .watermark {
    position: absolute;
    bottom: 22px;
    right: 32px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #e8e9ea;
    font-size: 13px;
    font-weight: 500;
    opacity: 0.85;
  }
  .watermark svg {
    width: 15px;
    height: 15px;
    fill: currentColor;
  }
</style>
</head>
<body>
  <div class="card-glow"></div>
  <div class="card">
    <img class="meme-img" src="${memeDataUrl}" alt="Photosynthesis Meme" />
  </div>
  <div class="watermark">
    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
    NotebookLM
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: "load" });
  await page.waitForTimeout(200);
  await page.screenshot({ path: TARGET_IMAGE_PATH });
  await browser.close();
  console.log(`✓ Rendered slide image saved to: ${TARGET_IMAGE_PATH}`);

  // Clean up temporary candidate files in slides dir if present
  try { await fs.unlink(path.join(SLIDES_DIR, "candidate_A.png")); } catch {}
  try { await fs.unlink(path.join(SLIDES_DIR, "candidate_B.png")); } catch {}

  // 3. Update manifest.json
  console.log("\n=== Step 2: Updating manifest.json ===");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  await fs.writeFile(`${MANIFEST_PATH}.bak`, rawManifest, "utf8");
  console.log(`✓ Backed up manifest to ${MANIFEST_PATH}.bak`);

  const manifest = JSON.parse(rawManifest);

  // Remove existing meme slide if already present
  const existingIdx = manifest.slides.findIndex(
    (s) => s.imageFileName === TARGET_IMAGE_NAME || s.title?.includes("Photosynthesis Humor")
  );
  if (existingIdx !== -1) {
    console.log(`Removing existing entry at index ${existingIdx} to re-insert cleanly.`);
    manifest.slides.splice(existingIdx, 1);
  }

  // Find target insertion index before slide_05.png ("The Factory Floor: Inside the Eukaryotic Plant Cell")
  const targetIndex = manifest.slides.findIndex((s) => s.imageFileName === "slide_05.png");
  if (targetIndex === -1) {
    throw new Error("Could not find slide_05.png in manifest.slides!");
  }
  console.log(`Target insertion index: ${targetIndex} (before "${manifest.slides[targetIndex].text?.split("\n")[0] || manifest.slides[targetIndex].title}")`);

  const memeText = "SOMETIMES, I USE BIG WORDS I DON'T ALWAYS FULLY UNDERSTAND IN AN EFFORT TO MAKE MYSELF SOUND MORE PHOTOSYNTHESIS.";

  const newSlideRaw = {
    number: targetIndex + 1,
    title: "Photosynthesis Humor",
    imageFileName: TARGET_IMAGE_NAME,
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${TARGET_IMAGE_NAME}`,
    isInteractive: false,
    interactiveType: null,
    text: memeText,
    cognitiveGuide: analyzeSlideCognitiveLoad({
      number: targetIndex + 1,
      title: "Photosynthesis Humor",
      text: memeText
    }),
    contentAnalysis: {
      schemaVersion: 1,
      status: "ready",
      source: "user-uploaded-meme",
      sourceHash: "photosynthesis_meme_slide_v1",
      transcript: "Sometimes, I use big words I don't always fully understand in an effort to make myself sound more photosynthesis.",
      role: "instructional-content",
      questions: [],
      questionCount: 0
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "local-ocr-fallback"
    },
    hasProgressiveBuilds: false,
    deckTitle: manifest.title
  };

  const newSlidePlanned = planSlideAnimation(newSlideRaw);

  // Insert into slides array
  manifest.slides.splice(targetIndex, 0, newSlidePlanned);

  // Renumber slides sequentially and update animation plans for shifted slides
  manifest.slides = manifest.slides.map((s, idx) => {
    const updated = {
      ...s,
      number: idx + 1,
      deckTitle: manifest.title
    };

    // Keep starter grid as question-reveal if slide 2
    if (idx === 1 && updated.interactiveType === "starter_qa_grid") {
      return updated;
    }

    // Re-plan animation to sync cell IDs and prompts with new slide numbers
    return planSlideAnimation(updated);
  });

  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`✓ Updated manifest saved to ${MANIFEST_PATH}`);
  console.log(`Total slides: ${manifest.totalSlides}`);

  manifest.slides.forEach((s) => {
    console.log(`  Slide ${s.number}: "${s.title || (s.text ? s.text.split("\n")[0] : "")}" (${s.imageFileName})`);
  });
}

main().catch((err) => {
  console.error("Error inserting meme slide:", err);
  process.exit(1);
});
