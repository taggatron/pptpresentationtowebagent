import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";
import { getParticleModelStarterSlideHtml } from "./generate_lesson_02_alt_starter_html.mjs";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_physics_matter_pressure_heat");
const LOCAL_PPTX_DIR = path.resolve("./output/powerpoints_physics_matter_pressure_heat");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/physics_matter_pressure_heat");
const CDP_URL = "http://127.0.0.1:9333";
const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/40fbb05f-e884-4f79-828b-c4539e9a0d31";

export const LESSON_CONFIG = {
  number: 2,
  title: "Pressure and Temperature (Alternative)",
  fullTitle: "Pressure, Temperature & the Particle Model – Why Should We Not Heat Up Aerosol Cans?",
  shortTitle: "Pressure & Temperature (Alt)",
  teacher: "Dan",
  practicalsCount: 1,
  deckId: "Lesson_02_Pressure_Alternative",
  practicalNames: ["Investigating the Effect of Temperature on Gas Pressure (Bicarbonate of Soda & Acid Bung Release)"],
  details: `Classroom slide deck based directly on the authentic GCSE Combined Science lesson guide "Pressure, Temperature & the Particle Model – Why Should We Not Heat Up Aerosol Cans?":

1. Framing & Overarching Question:
   - "Why should we not heat up aerosol cans?" (Real-world hazard and safety framing).
2. Prerequisite Retrieval (Previously: Physical States & Latent Heat):
   - Solid, liquid, and gaseous water molecular models.
   - Breaking intermolecular forces (bonds) during state changes vs strong intramolecular bonds.
   - Internal energy and temperature as average particle kinetic energy.
3. Learning Objectives & Keyword Toolkit:
   - Objective 1: Define pressure and temperature in terms of the particle model.
   - Objective 2: Explain how changing the temperature affects gas pressure.
   - Key Words: Pressure, Force, Kinetic energy, Kinetic theory.
4. Microscopic Mechanism of Gas Pressure:
   - Pressure is a force per unit area: P = F / A (Pascals, Pa or N/m²).
   - Gas particles are small and continually moving randomly; when they collide with the walls of a container or surface, each impact exerts a tiny force. Billions of simultaneous impacts produce measurable pressure.
5. The 3 Factors Affecting Gas Pressure within a Container:
   - Factor 1: Number of particles (more particles = more frequent collisions with container walls).
   - Factor 2: Temperature (higher temperature = higher average kinetic energy = particles move faster and strike walls with greater force and higher frequency).
   - Factor 3: Volume of container (smaller volume = particles crowded closer = more collisions per unit area).
   - PhET "Gas Properties" simulation connection.
6. Engineering Applications & Historical Disasters:
   - Steam engine operation: heated steam under high pressure pushes pistons to turn train wheels.
   - The danger of overpressure: excessive boiler pressure can cause catastrophic structural failure and explosion.
7. Household Hazard Application:
   - Deodorant aerosol cans: why heating an aerosol can leads to an explosion (sealed rigid container with fixed volume; heating drastically increases particle speed and collision rate until the metal seam ruptures).
8. Core Classroom Practical Investigation:
   - "Bicarb and Soda: Investigating the effect of temperature on gas pressure."
   - Equipment: boiling tube, rubber bung, stopwatch, measuring cylinder, balance, water baths at 4 temperatures.
   - Method: Vinegar (ethanoic acid) at 4 different temperatures reacted with bicarbonate of soda; sealed with a bung; timing how long it takes for gas pressure buildup to pop the bung off the tube.
   - Recording Table: Temperature of Acid (°C) vs Time for bung to be released (s).
   - Analysis & Evaluation questions: interpreting temperature vs pressure, experimental reliability, improving accuracy, and investigating concentration.
9. Comprehension & Reasoning Questions:
   - Effect of temperature on gas volume/rate, why increasing container size reduces pressure, and why carbonated drink cans fizz when opened (sudden pressure drop releases dissolved CO₂).
10. GCSE 6-Mark Exam Practice Question:
    - Structured question: Explaining properties of solids (fixed shape, difficult to compress) vs gases (spreads to fill container, easily compressed) using kinetic theory (particle spacing, particle movement, intermolecular forces).
11. Plenary Synthesis:
    - Definite, fully explained scientific answer to: "Why should we not heat up deodorant aerosol cans?"`,
  starterQuestions: [
    {
      q: "What must be broken or overcome when a substance changes physical state?",
      a: "Intermolecular forces (or bonds) between particles",
      cue: "Forces between molecules"
    },
    {
      q: "How do intermolecular forces compare in strength to intramolecular forces?",
      a: "Intermolecular forces are much weaker than intramolecular forces",
      cue: "Weaker or stronger?"
    },
    {
      q: "State the equation linking pressure, force, and area.",
      a: "Pressure = Force / Area (P = F / A)",
      cue: "P = F / ..."
    },
    {
      q: "In which state of matter do particles have the highest kinetic energy?",
      a: "Gas (steam / vapour)",
      cue: "Fastest moving particles"
    },
    {
      q: "What is temperature a measure of in terms of the particle model?",
      a: "The average kinetic energy (speed) of the particles",
      cue: "Average kinetic energy"
    },
    {
      q: "What causes gas pressure on the inside walls of a container?",
      a: "Collisions of gas particles exerting a force per unit area on the walls",
      cue: "Particle impacts on walls"
    }
  ],
  interactives: [
    {
      title: "Interactive Simulation: Gas Properties & Pressure",
      url: "https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_en.html",
      label: "PhET Simulation · Gas Properties & Particle Kinetic Lab"
    }
  ]
};

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function buildLessonPrompt(lesson) {
  return `Create a detailed classroom slide deck for GCSE Physics: Matter, Pressure & Thermal Physics based directly on the provided teacher reference slides.

Use the exact deck title: “Lesson 2: ${lesson.fullTitle}”.
Teacher: ${lesson.teacher} (${lesson.practicalsCount} Practical)

Lesson details and sequence:
${lesson.details}

Use UK English and draw factual teaching content from the selected notebook sources and the lesson sequence.

Pitch the lesson at GCSE Combined Science learners. Build a coherent teaching sequence with clear learning objectives, essential terminology, accurate explanations, context, worked examples or calculations where appropriate, safety and quality considerations for all practicals, regular checks for understanding, and a concise plenary summary.

CRITICAL REQUIREMENT - CLEAR AND BRIGHT SLIDES WITH LOW COGNITIVE LOAD: Every slide must be designed as clear and bright slides with exceptionally uncluttered layouts, generous whitespace, clean luminous visual styling, and high contrast. Use clear and bright slides that are fresh, well-lit, visually open, engaging, and immediately legible from the back of a classroom. Slides must NOT contain too much information, dark murky backgrounds, or dense walls of text.

Limit content on each slide to essential concepts: use short, punchy bullet points (under 15 words each, max 3–4 bullets per card/container) with bold lead-ins. Avoid long narrative paragraphs.

Ensure all diagrams, tables, and data callouts are large, well-spaced, high-contrast, clear and bright slides, and immediately readable from the back of a classroom.

Ensure that all lessons integrate knowledge checkpoints and learner activities at the correct part of the lesson to maintain active engagement.

For data interpretation, worked examples, and practical workflows, ensure practice tasks and exemplars have really clear, uncluttered step-by-step layouts with clean spacing between prompt, equipment, method, results, and explanation.

Make diagrams and layouts readable from the back of a classroom. Avoid invented references, unrealistic lab procedures, and claims that are not supported by the notebook sources.

Make this lesson fully self-contained. Do not pre-teach content from later lessons.

Maximise student learning activity frequencies and interactive learning games throughout the deck.

Include frequent high-engagement checkpoints such as pair-and-share challenges, quick-fire retrieval games, diagram labelling exercises, calculation races, and interactive concept-matching games on slides.

Make the first slide a clear title slide without any learner activities, featuring the big framing question: "Why should we not heat up aerosol cans?". Immediately following the title slide, include exactly one 5–10 minute starter slide formatted as a 6-cell grid (2 columns x 3 rows).

Populate each of the 6 cells with one concise starter question directly related to this lesson topic, each with a short success cue or expected answer:
${lesson.starterQuestions.map((sq, i) => `Cell ${i + 1}: ${sq.q} [Success Cue: ${sq.cue}] [Answer: ${sq.a}]`).join("\n")}

Ensure the questions activate prerequisite knowledge (intermolecular forces, physical states, latent heat, kinetic energy) needed for this specific lesson.

Include the Bicarbonate of Soda & Acid bung-release practical with the temperature vs time data table and evaluation questions. Include the 6-mark exam question comparing solids and gases. Conclude with a clear plenary answering the aerosol can explosion question.`;
}

async function findStudioPage(browser) {
  const contexts = browser.contexts();
  for (const ctx of contexts) {
    for (const p of ctx.pages()) {
      if (p.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31") || p.url().includes("notebook")) {
        return p;
      }
    }
  }
  if (contexts[0]) {
    log(`Creating a new tab for notebook: ${TARGET_NOTEBOOK_URL}`);
    const page = await contexts[0].newPage();
    await page.goto(TARGET_NOTEBOOK_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
    return page;
  }
  throw new Error("No open context found on CDP port 9333.");
}

async function dismissTransientDialogs(page) {
  const candidates = [
    page.getByRole("button", { name: "Got it", exact: true }),
    page.getByRole("button", { name: "Dismiss", exact: true }),
    page.getByRole("button", { name: "No thanks", exact: true }),
  ];
  for (const c of candidates) {
    if ((await c.count()) === 1 && (await c.isVisible().catch(() => false))) {
      await c.click().catch(() => {});
    }
  }
}

async function isGenerationVisible(page) {
  try {
    const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"]').first();
    if ((await slideDeckBtn.count()) > 0) {
      const cls = (await slideDeckBtn.getAttribute("class").catch(() => "")) || "";
      if (cls.includes("disabled-tile")) return true;
    }
    const generatingText = page.getByText(/Generating\.\.\./i);
    const count = await generatingText.count();
    for (let i = 0; i < count; i++) {
      if (await generatingText.nth(i).isVisible().catch(() => false)) return true;
    }
    const spinners = page.locator('mat-spinner, mat-progress-spinner, mat-progress-bar, .spinner, [role="progressbar"]');
    const spinCount = await spinners.count();
    for (let i = 0; i < spinCount; i++) {
      if (await spinners.nth(i).isVisible().catch(() => false)) return true;
    }
  } catch (e) {}
  return false;
}

export async function generateAndIngestLesson(browser, lesson) {
  log(`\n================================================================================`);
  log(`✦ Starting Flow for Lesson ${lesson.number}: ${lesson.fullTitle} (${lesson.teacher})`);
  log(`================================================================================`);

  const page = await findStudioPage(browser);
  await page.setViewportSize({ width: 1600, height: 1000 }).catch(() => {});

  if (!page.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31")) {
    log(`Navigating page to target notebook URL: ${TARGET_NOTEBOOK_URL}`);
    await page.goto(TARGET_NOTEBOOK_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
  }

  await fs.mkdir(PPTX_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(LOCAL_PPTX_DIR, { recursive: true });
  try {
    const client = await browser.contexts()[0].newCDPSession(page);
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: PPTX_OUTPUT_DIR,
    });
  } catch (err) {
    log(`CDP setDownloadBehavior notice: ${err.message}`);
  }

  // Close slide deck viewer if currently open in Studio
  const openCloseBtn = page.locator('.studio-panel button[aria-label="Close slide deck"], button[aria-label="Close slide deck"]').first();
  if ((await openCloseBtn.count()) > 0 && (await openCloseBtn.isVisible().catch(() => false))) {
    log("Closing previously open slide deck viewer...");
    await openCloseBtn.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  // Close any open mat-dialog-container
  const openDialog = page.locator('mat-dialog-container');
  if ((await openDialog.count()) > 0) {
    log("Closing leftover dialog...");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);
  }

  await dismissTransientDialogs(page);

  // If Studio panel is collapsed, expand it
  const studioHeader = page.locator('.panel-header-clickable:has-text("Studio"), .panel-header-content:has-text("Studio")').first();
  if ((await studioHeader.count()) > 0 && !(await page.locator('div.create-artifact-button-container[aria-label="Slide deck"]').isVisible().catch(() => false))) {
    await studioHeader.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  const getCards = () => page.locator("artifact-library-item");
  let prevTopCardText = "";
  const initialCardsCount = await getCards().count();
  if (initialCardsCount > 0) {
    prevTopCardText = (await getCards().first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
  }
  log(`Initial Studio state: ${initialCardsCount} artifact cards present. Top card: "${prevTopCardText.slice(0, 50)}"`);

  if (await isGenerationVisible(page)) {
    log("An existing generation is active. Waiting for it to settle...");
    while (await isGenerationVisible(page)) {
      await page.waitForTimeout(5000);
    }
    log("Previous generation completed.");
  }

  // Open "Slide deck" dialog
  log(`Opening 'Slide deck' creator for Lesson ${lesson.number}...`);
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"]').first();
  await slideDeckBtn.waitFor({ state: "visible", timeout: 20000 });
  await slideDeckBtn.click();
  await page.waitForTimeout(1500);

  const dialogHeading = page.getByText("Customise slide deck", { exact: true });
  await dialogHeading.waitFor({ state: "visible", timeout: 15000 });
  log("'Customise slide deck' dialog is open.");

  const presenterSlidesBtn = page.getByText("Presenter slides", { exact: true });
  if ((await presenterSlidesBtn.count()) > 0) {
    await presenterSlidesBtn.click();
    log("Selected 'Presenter slides' mode.");
    await page.waitForTimeout(500);
  }

  const promptText = buildLessonPrompt(lesson);
  const promptBox = page.getByLabel("Describe the slide deck that you want to create", { exact: true });
  await promptBox.fill(promptText);
  log(`Injected customised prompt for ${lesson.title} (${promptText.length} chars).`);
  await page.waitForTimeout(1000);

  const generateBtn = page.locator('mat-dialog-container button:has-text("Generate now"), button:has-text("Generate now")').first();
  await generateBtn.click();
  log("Clicked 'Generate now'. Generation is queued!");

  await dialogHeading.waitFor({ state: "hidden", timeout: 30000 });
  log("Dialog closed. Monitoring generation progress in Studio...");

  const deadline = Date.now() + 15 * 60 * 1000;
  let settledChecks = 0;
  await page.waitForTimeout(6000);

  const titleKeywords = ["pressure", "aerosol", "temperature", "particle"];

  while (Date.now() < deadline) {
    const isViewerOpen = (await page.locator('.studio-panel button[aria-label="More options"]').count()) > 0;
    if (isViewerOpen) {
      log(`Slide deck viewer opened! Generation is finished.`);
      break;
    }

    const isGenerating = await isGenerationVisible(page);
    const cards = getCards();
    const currentCount = await cards.count();
    let currentTopText = "";
    if (currentCount > 0) {
      currentTopText = (await cards.first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    }

    const isTopCardGenerating = /generating|sync\b/i.test(currentTopText);
    const matchesTitle = titleKeywords.some(kw => currentTopText.toLowerCase().includes(kw));

    if (isGenerating || isTopCardGenerating) {
      settledChecks = 0;
      log(`NotebookLM is generating slide deck (${currentTopText.slice(0, 60)}...)...`);
    } else if (matchesTitle || /just now/i.test(currentTopText)) {
      settledChecks += 1;
      log(`Detected completed artifact card: "${currentTopText.slice(0, 60)}" (settled check ${settledChecks}/2)`);
      if (settledChecks >= 2) {
        log(`Slide deck generation complete!`);
        break;
      }
    }

    await page.waitForTimeout(5000);
  }

  await page.waitForTimeout(3000);

  // Trigger PowerPoint download
  const pptxTargetFile = path.join(PPTX_OUTPUT_DIR, `${lesson.deckId}.pptx`);
  const localPptxFile = path.join(LOCAL_PPTX_DIR, `${lesson.deckId}.pptx`);
  const downloadStartTime = Date.now();
  log(`Triggering PowerPoint (.pptx) download...`);

  const viewerMoreBtn = page.locator('.studio-panel button[aria-label="More options"]').first();
  if ((await viewerMoreBtn.count()) > 0 && (await viewerMoreBtn.isVisible().catch(() => false))) {
    log("Opening More options menu from Studio viewer...");
    await viewerMoreBtn.click();
  } else {
    log("Opening More menu from top artifact card in list...");
    const cardMoreBtn = page.locator('artifact-library-item button[aria-label="More"]').first();
    await cardMoreBtn.waitFor({ state: "visible", timeout: 10000 });
    await cardMoreBtn.click();
  }

  await page.waitForTimeout(1000);
  const pptxMenuItem = page.locator('[role="menuitem"]:has-text("Download PowerPoint")').first();
  await pptxMenuItem.waitFor({ state: "visible", timeout: 10000 });
  await pptxMenuItem.click();
  log("Clicked 'Download PowerPoint (.pptx)'. Awaiting file on disk...");

  // Poll for downloaded file in PPTX_OUTPUT_DIR or ~/Downloads
  let downloadedPptx = null;
  const downloadsDir = path.join(process.env.HOME || "/Users/danieltagg", "Downloads");
  const pollDeadline = Date.now() + 60000;
  while (Date.now() < pollDeadline) {
    await new Promise(r => setTimeout(r, 1000));
    
    // Check PPTX_OUTPUT_DIR
    const files = await fs.readdir(PPTX_OUTPUT_DIR).catch(() => []);
    for (const f of files) {
      if (f.endsWith(".pptx")) {
        const fullPath = path.join(PPTX_OUTPUT_DIR, f);
        const stat = await fs.stat(fullPath).catch(() => null);
        if (stat && stat.size > 50000 && stat.mtimeMs >= downloadStartTime - 5000) {
          downloadedPptx = fullPath;
          log(`Found downloaded PowerPoint file in PPTX_OUTPUT_DIR: ${f} (${stat.size} bytes).`);
          break;
        }
      }
    }
    if (downloadedPptx) break;

    // Fallback: Check ~/Downloads
    const dlFiles = await fs.readdir(downloadsDir).catch(() => []);
    for (const f of dlFiles) {
      if (f.endsWith(".pptx")) {
        const fullPath = path.join(downloadsDir, f);
        const stat = await fs.stat(fullPath).catch(() => null);
        if (stat && stat.size > 50000 && stat.mtimeMs >= downloadStartTime - 5000) {
          downloadedPptx = fullPath;
          log(`Found downloaded PowerPoint file in ~/Downloads: ${f} (${stat.size} bytes).`);
          break;
        }
      }
    }
    if (downloadedPptx) break;
  }

  if (!downloadedPptx) {
    throw new Error(`Failed to find downloaded PPTX for Lesson ${lesson.number}`);
  }

  if (downloadedPptx !== pptxTargetFile) {
    await fs.copyFile(downloadedPptx, pptxTargetFile);
  }
  await fs.copyFile(downloadedPptx, localPptxFile);

  // Close viewer if open to return to studio root
  const closeViewerBtn = page.locator('.studio-panel button[aria-label="Close slide deck"]').first();
  if ((await closeViewerBtn.count()) > 0 && (await closeViewerBtn.isVisible().catch(() => false))) {
    await closeViewerBtn.click().catch(() => {});
    await page.waitForTimeout(1500);
  }

  // Now extract PPTX and generate web deck
  await ingestAndEnhanceDeck(localPptxFile, lesson);
}

export async function ingestAndEnhanceDeck(pptxTargetFile, lesson) {
  log(`Ingesting PPTX into web decks for ${lesson.deckId}...`);
  await fs.mkdir(PUBLIC_DECKS_DIR, { recursive: true });

  const deckFolder = lesson.deckId;
  const deckTargetDir = path.join(PUBLIC_DECKS_DIR, deckFolder);

  const manifest = await extractPptxDeck(pptxTargetFile, PUBLIC_DECKS_DIR, deckFolder, {
    slideSet: "physics_matter_pressure_heat",
    title: `2. ${lesson.title}`,
  });
  log(`Extracted ${manifest.totalSlides} slides into ${deckTargetDir}.`);

  const manifestPath = path.join(deckTargetDir, "manifest.json");
  const currentManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  currentManifest.title = `2. ${lesson.title}`;
  currentManifest.shortTitle = lesson.shortTitle;
  currentManifest.fullTitle = lesson.fullTitle;
  currentManifest.slideSet = "physics_matter_pressure_heat";
  currentManifest.courseName = "GCSE Physics: Matter, Pressure & Thermal Physics";
  currentManifest.teacher = lesson.teacher;
  currentManifest.practicalsCount = lesson.practicalsCount;

  // Integrate Gemini Generated Video on Slide 1 as Click 2
  if (currentManifest.slides && currentManifest.slides.length >= 1) {
    const slide1 = currentManifest.slides[0];
    const videoFileName = "gemini_generated_video_13f6cac2.mp4";
    const videoUrl = `/decks/physics_matter_pressure_heat/${deckFolder}/slides/${videoFileName}`;
    
    // Ensure video is copied to slides directory if present in deckFolder
    const rootVideo = path.join(deckTargetDir, videoFileName);
    const slidesVideo = path.join(deckTargetDir, "slides", videoFileName);
    try {
      const stat = await fs.stat(rootVideo).catch(() => null);
      if (stat && stat.size > 0) {
        await fs.copyFile(rootVideo, slidesVideo);
      }
    } catch {}

    slide1.hasProgressiveBuilds = true;
    slide1.videoUrl = videoUrl;
    slide1.posterUrl = slide1.imageUrl;
    slide1.originalImageUrl = slide1.imageUrl;
    slide1.progressiveBuilds = [
      {
        id: "build_1_title",
        version: 1,
        kind: "image",
        label: "Build 1: Hook Question – Why should we not heat up aerosol cans?",
        imageUrl: slide1.imageUrl,
        posterUrl: slide1.imageUrl
      },
      {
        id: "build_2_video",
        version: 2,
        kind: "video",
        label: "Build 2: Aerosol Can Explosion Video",
        videoUrl: videoUrl,
        imageUrl: slide1.imageUrl,
        posterUrl: slide1.imageUrl,
        startTime: 0,
        transition: "crossfade"
      }
    ];
    slide1.serialAnimation = {
      totalBuildSteps: 2,
      autoAdvanceDelayMs: 3200,
      serialSteps: [
        {
          step: 1,
          buildId: "build_1_title",
          title: "Build 1: Hook Question – Why should we not heat up aerosol cans?",
          componentIds: ["build_1_title"],
          targetBounds: { x: 0, y: 0, w: 100, h: 100 },
          revealType: "crossfade"
        },
        {
          step: 2,
          buildId: "build_2_video",
          title: "Build 2: Aerosol Can Explosion Video",
          componentIds: ["build_2_video"],
          targetBounds: { x: 0, y: 0, w: 100, h: 100 },
          revealType: "crossfade"
        }
      ]
    };
    slide1.history = [
      {
        id: "ver_orig",
        label: "Build 1: Hook Question – Why should we not heat up aerosol cans?",
        imageUrl: slide1.imageUrl
      },
      {
        id: "ver_video_intro",
        label: "Build 2: Aerosol Can Explosion Video",
        videoUrl: videoUrl,
        imageUrl: slide1.imageUrl
      }
    ];
  }

  // Insert or update Slide 2 as a dedicated 6-section Particle Model starter retrieval grid
  if (currentManifest.slides && currentManifest.slides.length >= 2) {
    const slide2IsAlreadyStarter = currentManifest.slides[1]?.interactiveType === "starter_qa_grid";
    const slideDir = path.join(deckTargetDir, "slides");

    const starterCellsMetrics = [
      { bounds: { x: 2.91, y: 19.53, w: 46.08, h: 25.52 }, answerBounds: { x: 4.91, y: 34.05, w: 42.66, h: 9.38 } },
      { bounds: { x: 51.02, y: 19.53, w: 46.08, h: 25.52 }, answerBounds: { x: 53.02, y: 34.05, w: 42.66, h: 9.38 } },
      { bounds: { x: 2.91, y: 46.88, w: 46.08, h: 25.52 }, answerBounds: { x: 4.91, y: 61.39, w: 42.66, h: 9.38 } },
      { bounds: { x: 51.02, y: 46.88, w: 46.08, h: 25.52 }, answerBounds: { x: 53.02, y: 61.39, w: 42.66, h: 9.38 } },
      { bounds: { x: 2.91, y: 74.22, w: 46.08, h: 25.52 }, answerBounds: { x: 4.91, y: 88.74, w: 42.66, h: 9.38 } },
      { bounds: { x: 51.02, y: 74.22, w: 46.08, h: 25.52 }, answerBounds: { x: 53.02, y: 88.74, w: 42.66, h: 9.38 } }
    ];

    const interactiveCells = lesson.starterQuestions.map((qObj, idx) => {
      const metric = starterCellsMetrics[idx] || starterCellsMetrics[0];
      return {
        id: `cell_${idx + 1}`,
        row: Math.floor(idx / 2),
        col: idx % 2,
        bounds: metric.bounds,
        answerBounds: metric.answerBounds,
        question: qObj.q,
        expectedAnswer: qObj.a,
        answerVisibleInImage: true,
        answerIsBaked: true,
        revealMode: "unmask",
        confidence: 1
      };
    });

    const slide2Obj = {
      number: 2,
      title: "Starter Activity: Particle Model Retrieval Grid",
      imageFileName: "slide_02.png",
      imageUrl: `/decks/physics_matter_pressure_heat/${deckFolder}/slides/slide_02.png`,
      isInteractive: true,
      interactiveType: "starter_qa_grid",
      gridTitle: "Starter Activity: Particle Model Retrieval Grid",
      starterQuestions: lesson.starterQuestions,
      interactiveCells,
      cognitiveGuide: analyzeSlideCognitiveLoad({
        number: 2,
        title: "Starter Activity: Particle Model Retrieval Grid",
        isInteractive: true,
        interactiveType: "starter_qa_grid",
        interactiveCells
      }),
      serialAnimation: {
        totalBuildSteps: 6,
        autoAdvanceDelayMs: 3200,
        serialSteps: interactiveCells.map((c, idx) => ({
          step: idx + 1,
          title: `Reveal: ${c.question}`,
          componentIds: [c.id],
          targetBounds: c.answerBounds,
          revealType: "unmask"
        }))
      },
      animationPlan: {
        mode: "starter-grid-unmask",
        strategy: "unmask-grid",
        totalSteps: 6
      }
    };

    if (!slide2IsAlreadyStarter) {
      const slide1 = currentManifest.slides[0];
      const shiftedOldSlides = currentManifest.slides.slice(1).map((s) => {
        const nextNum = s.number + 1;
        const isPractical = s.webEmbed || s.imageFileName?.includes("practical");
        const nextFileName = isPractical
          ? `slide_${String(nextNum).padStart(2, "0")}_practical.png`
          : `slide_${String(nextNum).padStart(2, "0")}.png`;
        return {
          ...s,
          number: nextNum,
          imageFileName: nextFileName,
          imageUrl: `/decks/physics_matter_pressure_heat/${deckFolder}/slides/${nextFileName}`
        };
      });
      currentManifest.slides = [slide1, slide2Obj, ...shiftedOldSlides];
    } else {
      currentManifest.slides[1] = slide2Obj;
    }
    currentManifest.totalSlides = currentManifest.slides.length;
  }

  // Integrate relevant interactive HTML practicals
  if (lesson.interactives && lesson.interactives.length > 0) {
    for (const interactive of lesson.interactives) {
      const practicalSlideNum = currentManifest.slides.length + 1;
      const slideDir = path.join(deckTargetDir, "slides");
      await fs.mkdir(slideDir, { recursive: true });

      const embedSlideFileName = `slide_${String(practicalSlideNum).padStart(2, "0")}_practical.png`;
      const fallbackSlideImg = path.join(slideDir, embedSlideFileName);
      
      const existingSlideImg = path.join(slideDir, currentManifest.slides[0]?.imageFileName || "slide_01.png");
      try {
        await fs.copyFile(existingSlideImg, fallbackSlideImg);
      } catch {}

      const interactiveSlide = {
        number: practicalSlideNum,
        title: interactive.title,
        imageFileName: embedSlideFileName,
        imageUrl: `/decks/physics_matter_pressure_heat/${deckFolder}/slides/${embedSlideFileName}`,
        sourceMediaPath: `web_embed/${embedSlideFileName}`,
        isInteractive: false,
        interactiveType: "web_embed",
        webEmbed: {
          url: interactive.url,
          title: interactive.title,
          label: interactive.label || "Live Practical Simulation"
        },
        cognitiveGuide: {
          estimatedTimeSeconds: 45,
          timeGuideDisplay: "40–60s",
          vciScore: "4.8",
          complexityCategory: "Moderate",
          ragLevel: "medium",
          ragColor: "amber",
          ragLabel: "Active Simulation",
          breakdown: {
            visualGistMs: 250,
            visualScanMs: 1100,
            readingMs: 18000,
            semanticProcessingMs: 12000,
            wordCount: 45,
            visualElementsCount: 4
          }
        }
      };

      currentManifest.slides.push(interactiveSlide);
      currentManifest.totalSlides = currentManifest.slides.length;
      log(`Integrated interactive HTML practical slide: "${interactive.title}" -> ${interactive.url}`);
    }
  }

  await fs.writeFile(manifestPath, JSON.stringify(currentManifest, null, 2), "utf8");
  log(`Updated manifest for ${deckFolder} (${currentManifest.slides.length} slides).`);
}

async function main() {
  log("Connecting to Google Chrome over CDP on port 9333...");
  const browser = await chromium.connectOverCDP(CDP_URL);
  try {
    await generateAndIngestLesson(browser, LESSON_CONFIG);
  } finally {
    await browser.close().catch(() => {});
  }
  log("\n✦ LESSON 2 ALTERNATIVE VERSION GENERATED AND IMPORTED SUCCESSFULLY! ✦");
}

main().catch(err => {
  console.error("FATAL RUNNER ERROR:", err);
  process.exit(1);
});
