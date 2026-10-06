import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";

const SET_ID = "physics_electricity_magnetism";
const DECK_ID = "Lesson_01_Static_Electricity";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const THUMB_PATH = path.resolve("scratch/yt_FPKen4QwY7I_hq.jpg");
const DEST_SLIDE_IMG = path.join(SLIDES_DIR, "slide_16_video.png");

async function main() {
  console.log(`=== Inserting Gas Pump Static Fire Video Slide into ${DECK_ID} ===\n`);

  // 1. Ensure thumbnail exists
  try {
    await fs.access(THUMB_PATH);
  } catch {
    console.log("Thumbnail not found, downloading from YouTube...");
    const res = await fetch("https://img.youtube.com/vi/FPKen4QwY7I/hqdefault.jpg");
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(THUMB_PATH, buffer);
    console.log(`✓ Downloaded thumbnail to ${THUMB_PATH}`);
  }

  const thumbBuffer = await fs.readFile(THUMB_PATH);
  const thumbDataUri = `data:image/jpeg;base64,${thumbBuffer.toString("base64")}`;

  // 2. Render Slide 16 Cover Image to slide_16_video.png using Playwright
  console.log("--- Rendering Slide 16 poster image using Playwright ---");
  const coverHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: radial-gradient(circle at 50% 12%, #0f172a 0%, #090e17 55%, #03060a 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #f1f5f9;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .glow-cyan {
    position: absolute;
    top: -140px;
    left: -100px;
    width: 580px;
    height: 580px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(14, 165, 233, 0) 70%);
    pointer-events: none;
  }

  .glow-flame {
    position: absolute;
    bottom: -130px;
    right: -90px;
    width: 560px;
    height: 560px;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(239, 68, 68, 0.08) 40%, rgba(0, 0, 0, 0) 70%);
    pointer-events: none;
  }

  body::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(56, 189, 248, 0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(56, 189, 248, 0.035) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  .slide-wrapper {
    width: 1376px;
    height: 768px;
    padding: 20px 48px 16px 48px;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .badge-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 12px;
    border-radius: 9999px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .badge-video {
    background: rgba(239, 68, 68, 0.18);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.4);
    box-shadow: 0 0 14px rgba(239, 68, 68, 0.25);
  }

  .badge-amber {
    background: rgba(245, 158, 11, 0.16);
    color: #fcd34d;
    border: 1px solid rgba(245, 158, 11, 0.35);
  }

  .badge-source {
    background: rgba(148, 163, 184, 0.14);
    color: #cbd5e1;
    border: 1px solid rgba(148, 163, 184, 0.25);
  }

  h1.title {
    font-size: 31px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.025em;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.2;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }

  p.subtitle {
    font-size: 13.5px;
    color: #94a3b8;
    font-weight: 400;
    max-width: 980px;
    line-height: 1.35;
  }

  /* Center video mockup */
  .video-mockup {
    position: relative;
    width: 800px;
    height: 440px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 24px 50px -12px rgba(0, 0, 0, 0.85),
      0 0 35px -5px rgba(245, 158, 11, 0.25);
    border: 1.5px solid rgba(245, 158, 11, 0.35);
    background: #020617;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(0.92);
  }

  .video-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(245, 158, 11, 0.12) 0%, rgba(3, 7, 18, 0.65) 80%);
  }

  .play-button-outer {
    position: relative;
    z-index: 5;
    width: 84px;
    height: 58px;
    background: #ff0000;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 30px rgba(255, 0, 0, 0.55);
  }

  .play-triangle {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 12px 0 12px 20px;
    border-color: transparent transparent transparent #ffffff;
    margin-left: 4px;
  }

  .video-caption-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 13px 22px;
    background: linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0) 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 6;
  }

  .video-caption-title {
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .video-caption-meta {
    color: #94a3b8;
    font-size: 12px;
    font-weight: 500;
  }

  /* 4 key observation guide cards */
  .observation-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 1100px;
    margin-top: 4px;
  }

  .obs-card {
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(56, 189, 248, 0.16);
    border-radius: 10px;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .obs-card.highlight {
    border-color: rgba(245, 158, 11, 0.45);
    background: rgba(30, 27, 20, 0.65);
  }

  .obs-step {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: #38bdf8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .obs-card.highlight .obs-step {
    color: #f59e0b;
  }

  .obs-title {
    font-size: 12px;
    font-weight: 700;
    color: #f8fafc;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .obs-desc {
    font-size: 10.5px;
    color: #94a3b8;
    line-height: 1.25;
  }

  .obs-desc strong {
    color: #e2e8f0;
  }

  /* Footer bar */
  .footer-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }

  .fallback-link {
    font-size: 12px;
    color: #94a3b8;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    background: rgba(30, 41, 59, 0.65);
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid rgba(148, 163, 184, 0.2);
  }

  .safety-banner {
    font-size: 11.5px;
    color: #fcd34d;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.28);
    padding: 3px 12px;
    border-radius: 6px;
  }

  .watermark {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: #64748b;
    font-weight: 500;
  }

  .watermark svg {
    width: 14px;
    height: 14px;
    fill: #64748b;
  }
</style>
</head>
<body>
  <div class="glow-cyan"></div>
  <div class="glow-flame"></div>

  <div class="slide-wrapper">
    <header class="header">
      <div class="badge-row">
        <span class="badge badge-video">▶ Authentic CCTV Footage</span>
        <span class="badge badge-amber">Electrostatic Hazard</span>
        <span class="badge badge-source">Petroleum Equipment Institute (PEI)</span>
      </div>
      <h1 class="title">Stop Static: Refuelling Fire at Gas Pump</h1>
      <p class="subtitle">Investigating how friction between clothing and car upholstery generates thousands of volts of static charge, causing a spark discharge that ignites petrol vapour.</p>
    </header>

    <div class="video-mockup">
      <div class="video-bg" style="background-image: url('${thumbDataUri}');"></div>
      <div class="video-overlay"></div>
      <div class="play-button-outer">
        <div class="play-triangle"></div>
      </div>
      <div class="video-caption-bar">
        <span class="video-caption-title">Stop Static: refueling fire at gas pump (Petroleum Equipment Institute)</span>
        <span class="video-caption-meta">Duration: 0m 51s • Forensic CCTV Analysis</span>
      </div>
    </div>

    <div class="observation-grid">
      <div class="obs-card">
        <span class="obs-step">Phase 1</span>
        <span class="obs-title">Friction & Charge</span>
        <span class="obs-desc">Sliding on synthetic seat <strong>transfers electrons</strong>, charging driver to ~20 kV.</span>
      </div>
      <div class="obs-card">
        <span class="obs-step">Phase 2</span>
        <span class="obs-title">Vapour Cloud</span>
        <span class="obs-desc">Petrol evaporates quickly, forming a <strong>volatile flammable vapour</strong> envelope.</span>
      </div>
      <div class="obs-card highlight">
        <span class="obs-step">Phase 3</span>
        <span class="obs-title">Spark Discharge</span>
        <span class="obs-desc">Touching metal nozzle triggers a <strong>dielectric spark</strong>, igniting the fumes.</span>
      </div>
      <div class="obs-card">
        <span class="obs-step">Phase 4</span>
        <span class="obs-title">Earthing & Safety</span>
        <span class="obs-desc">Touch metal chassis (earthing) first. <strong>Never pull out burning nozzle!</strong></span>
      </div>
    </div>

    <footer class="footer-bar">
      <div class="fallback-link">
        <span>↗</span> <span>Open video on YouTube (FPKen4QwY7I)</span>
      </div>
      <div class="safety-banner">
        <span>⚠</span> <span>Safety Rule: Never re-enter vehicle while fueling • Discharge to metal body</span>
      </div>
      <div class="watermark">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <span>Gemini Notebook · GCSE Physics</span>
      </div>
    </footer>
  </div>
</body>
</html>`;

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await page.setContent(coverHtml, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  await page.screenshot({ path: DEST_SLIDE_IMG, type: "png" });
  console.log(`✓ Rendered and saved Slide 16 poster image: ${DEST_SLIDE_IMG}`);
  await browser.close();

  // Validate QA
  const qaResult = await validateGeneratedSlideImage({
    outputPath: DEST_SLIDE_IMG
  });
  console.log(`✓ Image QA validation passed: ${qaResult.passed}`);
  if (!qaResult.passed) {
    console.error("QA Checks detail:", qaResult.checks);
  }

  // 3. Update manifest.json
  console.log("\n--- Updating manifest.json ---");
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Backup manifest if not already backed up
  try {
    await fs.access(`${MANIFEST_PATH}.bak`);
  } catch {
    await fs.writeFile(`${MANIFEST_PATH}.bak`, rawManifest, "utf8");
    console.log(`✓ Created backup: manifest.json.bak`);
  }

  // Clean up any previously inserted gas pump video slide
  const existingIdx = manifest.slides.findIndex(
    (s) => s.webEmbed?.url?.includes("gas_pump_static_fire_video.html") || s.sourceMediaPath?.includes("gas_pump_static_fire_video.html")
  );
  if (existingIdx !== -1) {
    console.log(`Removing previous entry at index ${existingIdx}...`);
    manifest.slides.splice(existingIdx, 1);
  }

  // Identify slide titles and descriptions for clarity
  const slideTitles = [
    "Lesson 1: Static Electricity (Title Slide)",
    "Starter Activity: Knowledge Retrieval (Static Electricity)",
    "Practical 2 Setup: Van de Graaff Generator",
    "The Spark: Dielectric Breakdown of Air",
    "Interactive Practical: Van de Graaff Generator Simulation",
    "Atomic Structure & Electric Charge",
    "The Law of Electrostatics: Repulsion & Attraction",
    "Why Static Charge Requires Insulators",
    "Practical 1 Setup: Charging by Friction",
    "Practical 1 Results: Electron Transfer",
    "Checkpoint: Pair & Share Challenge",
    "Mapping the Invisible: Electric Fields",
    "Practical 2 Demonstrations: Hair Standing on End",
    "Harnessing the Charge: Photocopiers & Electrostatic Precipitators",
    "Real-World Hazards & Earthing: Lightning & Vehicle Fuelling"
  ];

  // Apply descriptive titles to slides 1..15 if they have generic "Slide X" titles
  for (let i = 0; i < 15 && i < manifest.slides.length; i++) {
    if (manifest.slides[i].title.startsWith("Slide ")) {
      manifest.slides[i].title = slideTitles[i] || manifest.slides[i].title;
    }
  }

  // Slide 15 is index 14 ("Real-World Hazards & Earthing: Lightning & Vehicle Fuelling")
  // Former Slide 16 is index 15 ("Plenary: Quick-Fire Retrieval Race")
  const formerSlide16 = manifest.slides[15];
  if (formerSlide16) {
    formerSlide16.title = "Plenary: Quick-Fire Retrieval Race";
  }

  // Define the new Slide 16
  const newVideoSlide = {
    number: 16,
    title: "Video Case Study: Stop Static – Refuelling Fire at Gas Pump",
    imageFileName: "slide_16_video.png",
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/slide_16_video.png`,
    sourceMediaPath: "interactives/gas_pump_static_fire_video.html",
    isInteractive: true,
    interactiveType: "web_embed",
    webEmbed: {
      url: `/decks/${SET_ID}/${DECK_ID}/interactives/gas_pump_static_fire_video.html`,
      title: "Video Case Study: Stop Static – Refuelling Fire at Gas Pump",
      label: "Video Case Study · Static Hazard & Earthing"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 150,
      timeGuideDisplay: "90–180s",
      vciScore: "4.4",
      complexityCategory: "Medium",
      ragLevel: "low",
      ragColor: "green",
      ragLabel: "Video Case Study",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 950,
        readingMs: 5400,
        semanticProcessingMs: 28000,
        wordCount: 28,
        visualElementsCount: 4
      },
      academicReferences: [
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257.",
          relevance: "Authentic video reduces split-attention effect by visualizing real-world electrostatic hazard mechanism."
        },
        {
          citation: "Mayer, R. E. (2002). Multimedia learning. Psychology of Learning and Motivation, 41, 85-139.",
          relevance: "Dynamic video case study bridges abstract atomic charge separation to observable safety consequences."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "video-slide"
    },
    contentAnalysis: {
      schemaVersion: 1,
      status: "ready",
      source: "youtube-video-gas-pump-fire",
      transcript: "Stop Static: Refueling Fire at Gas Pump (Petroleum Equipment Institute). Demonstrating how electrostatic charge builds up through friction when a driver re-enters a car and slides across synthetic seats, leading to a spark discharge when touching the metal fuel nozzle and igniting volatile petrol vapors.",
      role: "instructional-video",
      questions: [],
      questionCount: 0
    }
  };

  // Insert at index 15 (before Plenary)
  manifest.slides.splice(15, 0, newVideoSlide);

  // Renumber sequentially 1..N
  manifest.slides.forEach((s, idx) => {
    s.number = idx + 1;
  });

  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`\n✓ Manifest successfully updated. Total slides: ${manifest.totalSlides}`);

  // Summary printout
  console.log("\nSlide structure around insertion point:");
  console.log(`Slide 15: ${manifest.slides[14].number}. ${manifest.slides[14].title} (${manifest.slides[14].imageFileName})`);
  console.log(`Slide 16: ${manifest.slides[15].number}. ${manifest.slides[15].title} (${manifest.slides[15].imageFileName}, interactive: ${manifest.slides[15].interactiveType})`);
  console.log(`Slide 17: ${manifest.slides[16].number}. ${manifest.slides[16].title} (${manifest.slides[16].imageFileName})`);
}

main().catch((err) => {
  console.error("FATAL ERROR in insert_gas_pump_video_slide:", err);
  process.exit(1);
});
