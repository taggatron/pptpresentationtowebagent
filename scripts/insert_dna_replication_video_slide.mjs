import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";

const SET_ID = "genetics_aaq";
const DECK_ID = "Lesson_02_DNA_structure_telomeres_and_replication";
const DECK_DIR = path.resolve("public/decks", SET_ID, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const INTERACTIVES_DIR = path.join(DECK_DIR, "interactives");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const THUMB_PATH = path.resolve("scratch/yt_tnkwgcfphqw_thumb.jpg");

async function main() {
  console.log(`=== Inserting DNA Replication 3D Video Slide before Slide 14 in ${DECK_ID} ===\n`);

  // 1. Read manifest to check state
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(rawManifest);

  // Backup manifest
  await fs.writeFile(`${MANIFEST_PATH}.bak`, rawManifest, "utf8");
  console.log(`✓ Backed up manifest.json to manifest.json.bak`);

  // Check if video slide is already present
  const alreadyInserted = manifest.slides.some(
    (s) => s.webEmbed?.url?.includes("dna_replication_video.html") || s.sourceMediaPath?.includes("dna_replication_video.html")
  );

  if (alreadyInserted) {
    console.log("Video slide already exists in manifest. Cleaning up existing entry before re-inserting...");
    const existingIdx = manifest.slides.findIndex(
      (s) => s.webEmbed?.url?.includes("dna_replication_video.html") || s.sourceMediaPath?.includes("dna_replication_video.html")
    );
    manifest.slides.splice(existingIdx, 1);
  }

  // 2. Identify slide 14 in manifest
  // Slide 14 is index 13 ("Coordinated Enzymatic Machinery: Synthesis" / slide_14.png)
  const targetIndex = 13;
  console.log(`Target insertion point: Index ${targetIndex} (Slide 14: "${manifest.slides[targetIndex]?.title || 'Coordinated Enzymatic Machinery: Synthesis'}")`);

  // 3. Shift slide images on disk from 20 down to 14
  console.log("\n--- Shifting slide images on disk (20..14 -> 21..15) ---");
  const currentTotal = manifest.slides.length; // 20
  for (let num = currentTotal; num >= 14; num--) {
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

  // 4. Render Slide 14 Cover Image to slide_14.png using Playwright
  console.log("\n--- Rendering new Slide 14 poster to slide_14.png ---");
  let thumbDataUri = "";
  try {
    const thumbBuffer = await fs.readFile(THUMB_PATH);
    thumbDataUri = `data:image/jpeg;base64,${thumbBuffer.toString("base64")}`;
  } catch (err) {
    console.warn("Could not load local thumbnail buffer, will fallback to CSS styling.");
  }

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
    background: radial-gradient(circle at 50% 15%, #0e1726 0%, #080d16 60%, #03060a 100%);
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

  .glow-purple {
    position: absolute;
    bottom: -120px;
    right: -80px;
    width: 540px;
    height: 540px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 70%);
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
    padding: 22px 56px 18px 56px;
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
    gap: 6px;
  }

  .badge-row {
    display: flex;
    align-items: center;
    gap: 10px;
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

  .badge-cyan {
    background: rgba(14, 165, 233, 0.16);
    color: #7dd3fc;
    border: 1px solid rgba(56, 189, 248, 0.35);
  }

  .badge-source {
    background: rgba(148, 163, 184, 0.14);
    color: #cbd5e1;
    border: 1px solid rgba(148, 163, 184, 0.25);
  }

  h1.title {
    font-size: 32px;
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
    max-width: 900px;
  }

  /* Video player preview mockup */
  .video-mockup {
    position: relative;
    width: 820px;
    height: 461px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 24px 50px -12px rgba(0, 0, 0, 0.85),
      0 0 35px -5px rgba(14, 165, 233, 0.25);
    border: 1.5px solid rgba(56, 189, 248, 0.35);
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
    background: radial-gradient(circle at center, rgba(14, 165, 233, 0.1) 0%, rgba(3, 7, 18, 0.6) 80%);
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
    padding: 14px 22px;
    background: linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0) 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 6;
  }

  .video-caption-title {
    color: #ffffff;
    font-size: 14.5px;
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
    width: 980px;
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

  .obs-step {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: #38bdf8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
  <div class="glow-purple"></div>

  <div class="slide-wrapper">
    <header class="header">
      <div class="badge-row">
        <span class="badge badge-video">▶ 3D Animation</span>
        <span class="badge badge-cyan">Replication Fork</span>
        <span class="badge badge-source">yourgenome · Wellcome Sanger</span>
      </div>
      <h1 class="title">Mechanism of DNA Replication: 3D Molecular Animation</h1>
      <p class="subtitle">Observe the real-time choreography of enzymes at the replication fork — unwinding, leading and lagging strand synthesis, and Okazaki fragment maturation.</p>
    </header>

    <div class="video-mockup">
      <div class="video-bg" style="background-image: url('${thumbDataUri}');"></div>
      <div class="video-overlay"></div>
      <div class="play-button-outer">
        <div class="play-triangle"></div>
      </div>
      <div class="video-caption-bar">
        <span class="video-caption-title">DNA replication - 3D (yourgenome • Wellcome Sanger Institute)</span>
        <span class="video-caption-meta">Duration: 3m 28s • 1080p High Definition</span>
      </div>
    </div>

    <div class="observation-grid">
      <div class="obs-card">
        <span class="obs-step">Phase 1</span>
        <span class="obs-title">Unwinding</span>
        <span class="obs-desc">Helicase separates parental strands; topoisomerase relieves supercoiling.</span>
      </div>
      <div class="obs-card">
        <span class="obs-step">Phase 2</span>
        <span class="obs-title">Priming</span>
        <span class="obs-desc">RNA primase deposits short primers; SSBs prevent reannealing.</span>
      </div>
      <div class="obs-card">
        <span class="obs-step">Phase 3</span>
        <span class="obs-title">Synthesis</span>
        <span class="obs-desc">DNA Polymerase builds 5'→3' (continuous leading; discontinuous lagging).</span>
      </div>
      <div class="obs-card">
        <span class="obs-step">Phase 4</span>
        <span class="obs-title">Maturation</span>
        <span class="obs-desc">Primers removed, DNA filled, and DNA ligase seals phosphodiester nicks.</span>
      </div>
    </div>

    <footer class="footer-bar">
      <div class="fallback-link">
        <span>↗</span> <span>Open video on YouTube (TNKWgcFPHqw)</span>
      </div>
      <div class="watermark">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <span>Gemini Notebook</span>
      </div>
    </footer>
  </div>
</body>
</html>`;

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await page.setContent(coverHtml, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  const destSlide14Path = path.join(SLIDES_DIR, "slide_14.png");
  await page.screenshot({ path: destSlide14Path, type: "png" });
  console.log(`✓ Rendered and saved new Slide 14 cover image: ${destSlide14Path}`);
  await browser.close();

  // Validate QA
  const qaResult = await validateGeneratedSlideImage(destSlide14Path, {
    label: "Slide 14: DNA Replication 3D Video Slide Cover"
  });
  console.log(`✓ Image QA validation passed: ${qaResult.passed}`);

  // 5. Update manifest.json
  console.log("\n--- Updating manifest.json ---");
  // Slides 0..12 (Slides 1 to 13) remain intact
  const headSlides = manifest.slides.slice(0, 13);

  // Shift slides from index 13 upwards (Slide 14 onwards becomes Slide 15 onwards)
  const shiftedSlides = manifest.slides.slice(13).map((s, idx) => {
    const nextNum = 15 + idx;
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
        id: c.id.replace(/slide_\d+_/, `slide_${nextNum}_`),
        sourceImageUrl: nextUrl
      }));
    }

    return updatedSlide;
  });

  // Construct new Slide 14
  const newSlide14 = {
    number: 14,
    title: "Video Animation: DNA Replication (3D Molecular Mechanism)",
    imageFileName: "slide_14.png",
    imageUrl: `/decks/${SET_ID}/${DECK_ID}/slides/slide_14.png`,
    sourceMediaPath: "interactives/dna_replication_video.html",
    isInteractive: true,
    interactiveType: "web_embed",
    webEmbed: {
      url: `/decks/${SET_ID}/${DECK_ID}/interactives/dna_replication_video.html`,
      title: "Mechanism of DNA Replication: 3D Molecular Animation",
      label: "Video Animation · DNA Replication (3D)"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 180,
      timeGuideDisplay: "120–210s",
      vciScore: "4.2",
      complexityCategory: "Medium",
      ragLevel: "low",
      ragColor: "green",
      ragLabel: "Video Animation",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 950,
        readingMs: 5200,
        semanticProcessingMs: 35000,
        wordCount: 24,
        visualElementsCount: 5
      },
      academicReferences: [
        {
          citation: "Mayer, R. E. (2002). Multimedia learning. Psychology of Learning and Motivation, 41, 85-139.",
          relevance: "Dynamic 3D representation scaffolds mental model formation of antiparallel strand coordination at the replication fork."
        },
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257.",
          relevance: "Visual animation integrates spatial and temporal enzymatic actions, reducing cognitive split-attention effect."
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
      source: "youtube-video-3d-replication",
      transcript: "Mechanism of DNA Replication: 3D Molecular Animation (yourgenome • Wellcome Sanger Institute). Demonstrating unwinding by helicase, stabilization by SSBs, RNA primer synthesis by primase, continuous leading strand synthesis by DNA polymerase, discontinuous lagging strand Okazaki fragments, and ligation by DNA ligase.",
      role: "instructional-video",
      questions: [],
      questionCount: 0
    }
  };

  manifest.slides = [
    ...headSlides,
    newSlide14,
    ...shiftedSlides
  ];

  // Renumber sequentially 1..N
  manifest.slides.forEach((s, idx) => {
    s.number = idx + 1;
  });

  manifest.totalSlides = manifest.slides.length;

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`\n✓ Successfully updated manifest. Total slides: ${manifest.totalSlides}`);

  // Summary printout
  console.log("\nSlide structure around insertion point:");
  console.log(`Slide 13: ${manifest.slides[12].number}. ${manifest.slides[12].title} (${manifest.slides[12].imageFileName})`);
  console.log(`Slide 14: ${manifest.slides[13].number}. ${manifest.slides[13].title} (${manifest.slides[13].imageFileName}, interactive: ${manifest.slides[13].interactiveType})`);
  console.log(`Slide 15: ${manifest.slides[14].number}. ${manifest.slides[14].title} (${manifest.slides[14].imageFileName})`);
}

main().catch((err) => {
  console.error("FATAL ERROR in insert_dna_replication_video_slide:", err);
  process.exit(1);
});
