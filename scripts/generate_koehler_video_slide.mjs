import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";

const DECK_DIR = path.resolve("public/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function main() {
  console.log("=== Launching Chrome to render Köhler Illumination Video Slide Cover ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const coverHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: radial-gradient(circle at 50% 15%, #f0f7ff 0%, #e2effe 60%, #d4e7fa 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  body::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(2, 132, 199, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(2, 132, 199, 0.05) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  .slide-wrapper {
    width: 1376px;
    height: 768px;
    padding: 36px 64px 28px 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  .header {
    text-align: center;
    max-width: 1100px;
  }

  h1.title {
    font-size: 38px;
    font-weight: 800;
    color: #091e42;
    letter-spacing: -0.025em;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.25;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }

  .video-mockup {
    position: relative;
    width: 960px;
    height: 540px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 50px -8px rgba(15, 23, 42, 0.24), 0 12px 24px -6px rgba(15, 23, 42, 0.12);
    border: 2px solid rgba(255, 255, 255, 0.95);
    background: #020617;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* YouTube preview poster styling */
  .poster-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #091e42 0%, #0d2538 40%, #051329 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .poster-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(14, 165, 233, 0.15) 0%, rgba(2, 6, 23, 0.75) 80%);
  }

  .play-button-outer {
    position: relative;
    z-index: 5;
    width: 88px;
    height: 60px;
    background: #ff0000;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(255, 0, 0, 0.4);
    transition: transform 0.2s;
  }

  .play-triangle {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 13px 0 13px 22px;
    border-color: transparent transparent transparent #ffffff;
    margin-left: 4px;
  }

  .video-caption-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 24px;
    background: linear-gradient(to top, rgba(2, 6, 23, 0.92) 0%, rgba(2, 6, 23, 0) 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 6;
  }

  .video-caption-title {
    color: #ffffff;
    font-size: 15px;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: -0.01em;
  }

  .video-caption-meta {
    color: #94a3b8;
    font-size: 12.5px;
    font-weight: 500;
  }

  .footer-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
  }

  .fallback-link {
    font-size: 12.5px;
    color: #475569;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.7);
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid rgba(203, 213, 225, 0.8);
  }

  .watermark {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: #94a3b8;
    font-weight: 500;
  }

  .watermark svg {
    width: 14px;
    height: 14px;
    fill: #94a3b8;
  }
</style>
</head>
<body>
  <div class="slide-wrapper">
    <header class="header">
      <h1 class="title">List the stages in obtaining Köhler illumination</h1>
    </header>

    <div class="video-mockup">
      <div class="poster-bg">
        <div class="poster-overlay"></div>
        <div class="play-button-outer">
          <div class="play-triangle"></div>
        </div>
        <div class="video-caption-bar">
          <span class="video-caption-title">Koehler Illumination Microscope (YouTube Tutorial)</span>
          <span class="video-caption-meta">Duration: 4m 03s • High Definition</span>
        </div>
      </div>
    </div>

    <footer class="footer-bar">
      <div class="fallback-link">
        <span>↗</span> <span>Open video on YouTube (5MfZweoJ6A8)</span>
      </div>
      <div class="watermark">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <span>Gemini Notebook</span>
      </div>
    </footer>
  </div>
</body>
</html>
`;

  await page.setContent(coverHtml, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const coverImagePath = path.join(SLIDES_DIR, "slide_05_koehler_illumination_video.png");
  await page.screenshot({ path: coverImagePath, type: "png" });
  console.log(`Saved cover screenshot to: ${coverImagePath}`);

  await browser.close();

  // Validate QA
  await validateGeneratedSlideImage(coverImagePath, {
    label: "Slide 5: Köhler Illumination Video Slide Cover",
    requiredKeywords: ["stages", "Köhler illumination"]
  });

  // ---------------------------------------------------------------------------
  // Update manifest.json with the new slide sequence (11 slides total)
  // ---------------------------------------------------------------------------
  console.log("\n=== Updating manifest.json for Lesson 02 ===");
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));

  const newSlide5 = {
    number: 5,
    title: "List the stages in obtaining Köhler illumination",
    imageFileName: "slide_05_koehler_illumination_video.png",
    imageUrl: "/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist/slides/slide_05_koehler_illumination_video.png",
    sourceMediaPath: null,
    isInteractive: true,
    interactiveType: "web_embed",
    webEmbed: {
      url: "/decks/intro_aaq_human_bio/Lesson_02_Working_like_a_Human_Biologist/interactives/koehler_illumination_video.html",
      title: "List the stages in obtaining Köhler illumination",
      label: "Köhler Illumination Video"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 60,
      timeGuideDisplay: "45–60s",
      vciScore: "3.5",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Medium Processing",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 800,
        readingMs: 8000,
        semanticProcessingMs: 25000,
        wordCount: 8,
        visualElementsCount: 2
      },
      academicReferences: [
        {
          citation: "Mayer, R. E. (2002). Multimedia learning. Psychology of Learning and Motivation, 41, 85-139.",
          relevance: "Provides multimedia video scaffolding to consolidate optical alignment theory into procedural memory."
        }
      ]
    },
    questionAnalysis: {
      detected: true,
      confidence: "high",
      questionCount: 1,
      format: "open_prompt"
    }
  };

  // Build new slides array
  const updatedSlides = [];

  // Slides 1 to 4 remain slides 1 to 4
  for (let i = 1; i <= 4; i++) {
    const s = manifest.slides.find(slide => slide.number === i);
    if (s) updatedSlides.push(s);
  }

  // Insert new Slide 5
  updatedSlides.push(newSlide5);

  // Existing slides with number >= 5 shift by +1
  // Note: let's sort any remaining slides by their existing number
  const remainingSlides = manifest.slides
    .filter(s => s.number >= 5 && s.title !== newSlide5.title)
    .sort((a, b) => a.number - b.number);

  remainingSlides.forEach((s, idx) => {
    s.number = 6 + idx;
    updatedSlides.push(s);
  });

  manifest.totalSlides = updatedSlides.length;
  manifest.slides = updatedSlides;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Updated manifest.json: now has ${manifest.totalSlides} slides.`);
}

main().catch(err => {
  console.error("FATAL ERROR in generate_koehler_video_slide:", err);
  process.exit(1);
});
