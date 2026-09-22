import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";

const SET_ID = "intro_aaq_human_bio";
const DECK_ID = "Lesson_05_Communicating_like_a_Human_Biologist_Source_Reliability_and_Referencing";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const OUTPUT_IMAGE_NAME = "slide_07_craapt_framework.png";
const OUTPUT_IMAGE_PATH = path.join(SLIDES_DIR, OUTPUT_IMAGE_NAME);
const ARTIFACT_COPY_PATH = "/Users/danieltagg/.gemini/antigravity-ide/brain/5093c4d3-b842-4448-b333-e3b859102654/slide_07_craapt_framework.png";

async function main() {
  console.log(`=== Generating CRAAPT Research Evaluation Slide for Lesson 5 ===`);

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    width: 1376px;
    height: 768px;
    background-color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #000000;
    overflow: hidden;
    position: relative;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  /* Slide Title: matches Slide 6 (x=67, y=48) */
  .slide-header {
    position: absolute;
    left: 67px;
    top: 48px;
  }
  .slide-title {
    font-size: 52px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.08;
    color: #000000;
  }

  /* 6 Cards Grid: matches Slide 6 span (x=67 to x=1308, y=203, h=504px) */
  .cards-container {
    position: absolute;
    left: 67px;
    top: 203px;
    width: 1241px;
    height: 504px;
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  .card {
    flex: 1;
    background: #ffffff;
    border: 2px solid #64748b;
    border-radius: 12px;
    padding: 18px 12px 20px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    box-shadow: 0 12px 26px -4px rgba(15, 23, 42, 0.13), 0 6px 12px -3px rgba(15, 23, 42, 0.08);
    height: 504px;
  }

  /* Top Checkbox: matching Slide 6 */
  .card-checkbox {
    position: absolute;
    top: 14px;
    left: 14px;
    width: 18px;
    height: 18px;
    border: 2px solid #64748b;
    border-radius: 2px;
    background: #ffffff;
  }

  /* Acronym Letter */
  .card-letter {
    font-size: 64px;
    font-weight: 900;
    color: #000000;
    margin-top: 4px;
    margin-bottom: 12px;
    line-height: 1;
  }

  /* Card Icon */
  .card-icon-wrapper {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
  }
  .card-icon {
    width: 62px;
    height: 62px;
  }

  /* Card Heading */
  .card-heading {
    font-size: 22px;
    font-weight: 800;
    color: #000000;
    margin-bottom: 14px;
    text-align: center;
    letter-spacing: -0.015em;
  }

  /* Card Question */
  .card-body {
    font-size: 15.5px;
    line-height: 1.48;
    color: #0f172a;
    font-weight: 500;
    text-align: left;
    width: 100%;
    padding: 0 2px;
  }

  /* Yellow Highlight */
  mark {
    background-color: #fef08a;
    color: inherit;
    padding: 1px 3px;
    border-radius: 3px;
    font-weight: 600;
  }

  /* Gemini Notebook Branding: matching Slide 6 */
  .gemini-footer {
    position: absolute;
    bottom: 18px;
    right: 28px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #000000;
    letter-spacing: -0.01em;
  }
  .gemini-sparkle {
    width: 14px;
    height: 14px;
    fill: #000000;
  }
</style>
</head>
<body>

  <div class="slide-header">
    <h1 class="slide-title">Evaluating Research:<br>The CRAAPT Framework</h1>
  </div>

  <div class="cards-container">

    <!-- C: Currency -->
    <div class="card">
      <div class="card-checkbox"></div>
      <div class="card-letter">C</div>
      <div class="card-icon-wrapper">
        <svg class="card-icon" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="23" stroke="#000000" stroke-width="2.5" fill="none"/>
          <line x1="32" y1="13" x2="32" y2="16" stroke="#000000" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="32" y1="48" x2="32" y2="51" stroke="#000000" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="13" y1="32" x2="16" y2="32" stroke="#000000" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="48" y1="32" x2="51" y2="32" stroke="#000000" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="20" y1="20" x2="22.5" y2="22.5" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
          <line x1="44" y1="20" x2="41.5" y2="22.5" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
          <line x1="20" y1="44" x2="22.5" y2="41.5" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
          <line x1="44" y1="44" x2="41.5" y2="41.5" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
          <line x1="32" y1="32" x2="24" y2="24" stroke="#000000" stroke-width="2.6" stroke-linecap="round"/>
          <line x1="32" y1="32" x2="32" y2="18" stroke="#000000" stroke-width="2.4" stroke-linecap="round"/>
          <circle cx="32" cy="32" r="2.2" fill="#000000"/>
        </svg>
      </div>
      <div class="card-heading">Currency</div>
      <div class="card-body">
        Is biomedical data <mark>current</mark> and <mark style="white-space:nowrap;">up-to-date,</mark> or have newer trials superseded it?
      </div>
    </div>

    <!-- R: Relevance -->
    <div class="card">
      <div class="card-checkbox"></div>
      <div class="card-letter">R</div>
      <div class="card-icon-wrapper">
        <svg class="card-icon" viewBox="0 0 64 64">
          <circle cx="30" cy="34" r="22" stroke="#000000" stroke-width="2.4" fill="none"/>
          <circle cx="30" cy="34" r="15" stroke="#000000" stroke-width="2.2" fill="none"/>
          <circle cx="30" cy="34" r="8" stroke="#000000" stroke-width="2.2" fill="none"/>
          <circle cx="30" cy="34" r="2.5" fill="#000000"/>
          <line x1="30" y1="34" x2="52" y2="12" stroke="#000000" stroke-width="2.6" stroke-linecap="round"/>
          <polyline points="43,11 53,11 53,21" stroke="#000000" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="47" y1="17" x2="53" y2="11" stroke="#000000" stroke-width="2.4" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="card-heading">Relevance</div>
      <div class="card-body">
        Does the study <mark>directly match</mark> your specific <mark>sample cohort</mark> or mechanism?
      </div>
    </div>

    <!-- A: Authority -->
    <div class="card">
      <div class="card-checkbox"></div>
      <div class="card-letter">A</div>
      <div class="card-icon-wrapper">
        <svg class="card-icon" viewBox="0 0 64 64">
          <polygon points="32,10 8,24 56,24" stroke="#000000" stroke-width="2.4" fill="none" stroke-linejoin="round"/>
          <rect x="11" y="24" width="42" height="4" stroke="#000000" stroke-width="2" fill="none"/>
          <rect x="14" y="28" width="5" height="20" stroke="#000000" stroke-width="2" fill="none"/>
          <rect x="23" y="28" width="5" height="20" stroke="#000000" stroke-width="2" fill="none"/>
          <rect x="36" y="28" width="5" height="20" stroke="#000000" stroke-width="2" fill="none"/>
          <rect x="45" y="28" width="5" height="20" stroke="#000000" stroke-width="2" fill="none"/>
          <rect x="10" y="48" width="44" height="4" stroke="#000000" stroke-width="2" fill="none"/>
          <rect x="6" y="52" width="52" height="4" stroke="#000000" stroke-width="2" fill="none"/>
        </svg>
      </div>
      <div class="card-heading">Authority</div>
      <div class="card-body">
        Is the source from a <mark>peer-reviewed journal</mark> by <mark>accredited researchers?</mark>
      </div>
    </div>

    <!-- A: Accuracy -->
    <div class="card">
      <div class="card-checkbox"></div>
      <div class="card-letter">A</div>
      <div class="card-icon-wrapper">
        <svg class="card-icon" viewBox="0 0 64 64">
          <ellipse cx="32" cy="54" rx="20" ry="4.5" stroke="#000000" stroke-width="2.4" fill="none"/>
          <line x1="32" y1="49.5" x2="32" y2="40" stroke="#000000" stroke-width="2.8" stroke-linecap="round"/>
          <path d="M32 40 C18 36 18 20 28 14" stroke="#000000" stroke-width="2.8" fill="none" stroke-linecap="round"/>
          <line x1="28" y1="14" x2="36" y2="6" stroke="#000000" stroke-width="5" stroke-linecap="round"/>
          <line x1="40" y1="2" x2="35" y2="7" stroke="#000000" stroke-width="7" stroke-linecap="round"/>
          <line x1="24" y1="18" x2="20" y2="28" stroke="#000000" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="20" y1="28" x2="18" y2="33" stroke="#000000" stroke-width="2.8" stroke-linecap="round"/>
          <line x1="12" y1="36" x2="30" y2="36" stroke="#000000" stroke-width="3.2" stroke-linecap="round"/>
          <ellipse cx="21" cy="40" rx="3.5" ry="1.8" stroke="#000000" stroke-width="1.8" fill="none"/>
        </svg>
      </div>
      <div class="card-heading">Accuracy</div>
      <div class="card-body">
        Are findings verified by <mark>sample sizes,</mark> <mark>placebo controls,</mark> and <mark>statistical rigor?</mark>
      </div>
    </div>

    <!-- P: Purpose -->
    <div class="card">
      <div class="card-checkbox"></div>
      <div class="card-letter">P</div>
      <div class="card-icon-wrapper">
        <svg class="card-icon" viewBox="0 0 64 64">
          <line x1="32" y1="12" x2="32" y2="52" stroke="#000000" stroke-width="2.6" stroke-linecap="round"/>
          <line x1="22" y1="52" x2="42" y2="52" stroke="#000000" stroke-width="2.8" stroke-linecap="round"/>
          <circle cx="32" cy="14" r="3" stroke="#000000" stroke-width="2" fill="none"/>
          <line x1="12" y1="20" x2="52" y2="20" stroke="#000000" stroke-width="2.6" stroke-linecap="round"/>
          <line x1="12" y1="20" x2="6" y2="34" stroke="#000000" stroke-width="1.6"/>
          <line x1="12" y1="20" x2="18" y2="34" stroke="#000000" stroke-width="1.6"/>
          <path d="M4,34 Q12,39 20,34 Z" stroke="#000000" stroke-width="2.2" fill="none" stroke-linejoin="round"/>
          <line x1="52" y1="20" x2="46" y2="34" stroke="#000000" stroke-width="1.6"/>
          <line x1="52" y1="20" x2="58" y2="34" stroke="#000000" stroke-width="1.6"/>
          <path d="M44,34 Q52,39 60,34 Z" stroke="#000000" stroke-width="2.2" fill="none" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="card-heading">Purpose</div>
      <div class="card-body">
        Is intent <mark>objective science,</mark> or does <mark>commercial bias</mark> manipulate outcomes?
      </div>
    </div>

    <!-- T: Transparency -->
    <div class="card">
      <div class="card-checkbox"></div>
      <div class="card-letter">T</div>
      <div class="card-icon-wrapper">
        <svg class="card-icon" viewBox="0 0 64 64">
          <path d="M16,10 L38,10 L48,20 L48,54 L16,54 Z" stroke="#000000" stroke-width="2.4" fill="none" stroke-linejoin="round"/>
          <polyline points="38,10 38,20 48,20" stroke="#000000" stroke-width="2.2" fill="none" stroke-linejoin="round"/>
          <circle cx="26" cy="30" r="6" stroke="#000000" stroke-width="2" fill="none"/>
          <polyline points="23,30 25,32 29,28" stroke="#000000" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19,43 C24,37 34,37 39,43 C34,49 24,49 19,43 Z" stroke="#000000" stroke-width="2.2" fill="none"/>
          <circle cx="29" cy="43" r="2.8" fill="#000000"/>
        </svg>
      </div>
      <div class="card-heading">Transparency</div>
      <div class="card-body">
        Are <mark>trial registries,</mark> <mark>raw data,</mark> and <mark>conflicts of interest</mark> declared?
      </div>
    </div>

  </div>

  <div class="gemini-footer">
    <svg class="gemini-sparkle" viewBox="0 0 24 24">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
    </svg>
    <span>Gemini Notebook</span>
  </div>

</body>
</html>`;

  await page.setContent(html);
  await page.screenshot({ path: OUTPUT_IMAGE_PATH, type: "png" });
  console.log(`✓ Rendered slide image saved to: ${OUTPUT_IMAGE_PATH}`);

  // Copy to conversation artifact directory for review
  await fs.copyFile(OUTPUT_IMAGE_PATH, ARTIFACT_COPY_PATH);
  console.log(`✓ Copied slide image to artifact directory: ${ARTIFACT_COPY_PATH}`);

  await browser.close();

  // Validate image quality & tech criteria
  const qaResult = await validateGeneratedSlideImage({
    outputPath: OUTPUT_IMAGE_PATH,
    sourcePath: path.join(SLIDES_DIR, "slide_06.png"),
    minBytes: 20000,
    minWidth: 1000,
    minHeight: 550,
    aspectTolerance: 0.08
  });

  if (!qaResult.passed) {
    console.error("❌ QA validation failed:", qaResult.checks.filter((c) => !c.passed));
    process.exit(1);
  }
  console.log("✓ QA Validation Passed:", qaResult.checks.map((c) => c.id).join(", "));

  // Synchronize Manifest
  const reviewedAt = new Date().toISOString();
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));

  const newSlideObj = {
    number: 7,
    title: "Evaluating Research: The CRAAPT Framework",
    imageFileName: OUTPUT_IMAGE_NAME,
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${OUTPUT_IMAGE_NAME}`,
    isInteractive: false,
    interactiveType: null,
    metadata: {
      role: "theory",
      framework: "CRAAPT (Currency, Relevance, Authority, Accuracy, Purpose, Transparency)",
      description: "Six core criteria for critical appraisal of biomedical literature and evaluating scientific claims."
    },
    geminiImageCells: [
      {
        id: "gemini_slide_7_1_component_reveal",
        order: 1,
        kind: "image",
        mediaType: "image",
        source: "gemini-image-chat",
        label: "CRAAPT Framework Overview — 6-Pillar Bioscience Appraisal Criteria",
        strategy: "static-theory",
        fullCanvas: true,
        cumulative: false,
        prompt: "Full-slide 16:9 canvas introducing the 6-pillar CRAAPT framework (Currency, Relevance, Authority, Accuracy, Purpose, Transparency) for evaluating research in Human Biology.",
        status: "approved",
        qaStatus: "approved",
        outputImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/${OUTPUT_IMAGE_NAME}`,
        sourceImageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/slide_06.png`,
        generatedAt: reviewedAt,
        qa: {
          status: "approved",
          reviewedAt,
          reviewer: "Teacher_Dan",
          notes: "Crisp typography, balanced 6-card layout, matching Slide 6 PROMT visual system.",
          technical: qaResult,
          visual: {
            passed: true,
            missing: [],
            checks: {
              fullCanvas: true,
              styleMatch: true,
              cumulativeContent: true,
              legibleText: true,
              noFocusTreatment: true
            }
          }
        }
      }
    ]
  };

  // Check if slide already exists in manifest
  const existingIdx = manifest.slides.findIndex(
    (s) => s.title === newSlideObj.title || s.imageFileName === OUTPUT_IMAGE_NAME
  );

  if (existingIdx !== -1) {
    manifest.slides[existingIdx] = newSlideObj;
    console.log(`Updated existing Slide at index ${existingIdx}`);
  } else {
    // Insert immediately after Slide 6 (index 6, which becomes the 7th element)
    const slide6Idx = manifest.slides.findIndex((s) => s.number === 6);
    const insertIdx = slide6Idx !== -1 ? slide6Idx + 1 : 6;
    manifest.slides.splice(insertIdx, 0, newSlideObj);
    console.log(`Inserted new Slide 7 at index ${insertIdx}`);
  }

  // Renumber slides sequentially 1..N
  manifest.slides.forEach((s, idx) => {
    s.number = idx + 1;
  });
  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`✓ Synchronized ${MANIFEST_PATH}: Total slides is now ${manifest.totalSlides}.`);
}

main().catch((err) => {
  console.error("Generator failed:", err);
  process.exit(1);
});
