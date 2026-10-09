import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_physics_electricity_magnetism");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/physics_electricity_magnetism");
const CDP_URL = "http://127.0.0.1:9333";
const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/40fbb05f-e884-4f79-828b-c4539e9a0d31";

export const LESSON_02_CONFIG = {
  number: 2,
  title: "Electrical Circuits – What Causes That Light Bulb Moment?",
  shortTitle: "Electric Circuits",
  teacher: "Greg",
  practicalsCount: 1,
  deckId: "Lesson_02_Circuits",
  starterQuestions: [
    {
      q: "Define static electricity.",
      a: "Build-up and separation of electrical charge carried by electrons, caused by friction.",
      cue: "Charge separation"
    },
    {
      q: "What force causes your hair to stand on end when rubbed with a balloon?",
      a: "Electrostatic repulsion (like charges repel).",
      cue: "Like charges..."
    },
    {
      q: "How would you calculate the Rf value of a spot?",
      a: "Rf = distance moved by spot ÷ distance moved by solvent (e.g. 4 cm ÷ 10 cm = 0.4).",
      cue: "Spot ÷ Solvent"
    },
    {
      q: "What are the main parts to natural selection?",
      a: "1. Variation (mutations), 2. Selection pressure, 3. Survival of the fittest, 4. Inheritance of advantageous alleles.",
      cue: "V-S-S-I"
    },
    {
      q: "Draw or describe metallic bonding.",
      a: "Regular lattice of positive metal ions surrounded by a sea of delocalised electrons.",
      cue: "Ions & delocalised electrons"
    },
    {
      q: "Challenge: What causes that 'light bulb moment' in an electrical circuit?",
      a: "Potential difference drives delocalised electrons through the filament wire against resistance, transferring electrical energy into light and heat.",
      cue: "Energy transfer & resistance"
    }
  ],
  interactives: [
    {
      title: "Interactive Practical: Circuit Construction Workbench",
      url: "/interactives/physics/circuit_builder.html",
      label: "Interactive Circuit Workbench"
    }
  ]
};

export function buildLessonPrompt() {
  return `Create a detailed classroom slide deck for GCSE Physics: Electricity and Magnetism.

Use the exact deck title: “Lesson 2: Electrical Circuits – What Causes That Light Bulb Moment?”.
Teacher: Greg (1 Core Practical)

Lesson Focus & Core Concepts based on the lesson plan:
1. Prerequisite & Hook:
   - Connect from static electricity (charge separation trapped on insulators via friction) to current electricity (continuous flow of electrons in a closed conducting loop).
   - Hook: "She's electric, she has a family full of eccentrics" (Oasis) — what actually makes an electrical circuit work?
   - The Light Bulb Moment: What causes that light bulb moment in an electrical circuit? Potential difference drives delocalised electrons through the filament wire against resistance, dissipating electrical energy as radiant light and thermal energy.

2. Prerequisite Retrieval (Starter 6-Cell Grid):
   - Cell 1: Define static electricity. [Cue: Charge separation] [Answer: Build-up and separation of electrical charge carried by electrons, caused by friction.]
   - Cell 2: What force causes hair to stand on end when rubbed with a balloon? [Cue: Like charges...] [Answer: Electrostatic repulsion (like charges repel).]
   - Cell 3: How do you calculate the Rf value of a chromatography spot? [Cue: Distance ratio] [Answer: Rf = distance moved by spot ÷ distance moved by solvent (e.g. 4 cm ÷ 10 cm = 0.4).]
   - Cell 4: What are the main parts of natural selection? [Cue: V-S-S-I] [Answer: Variation (mutations), Selection pressure, Survival of the fittest, Inheritance of advantageous alleles.]
   - Cell 5: Draw or describe metallic bonding. [Cue: Ions and electrons] [Answer: Regular lattice of positive metal ions surrounded by a sea of delocalised electrons.]
   - Cell 6: Challenge: What causes that "light bulb moment" in a circuit? [Cue: Energy transfer] [Answer: Potential difference from a power source pushes delocalised electrons through the filament wire against resistance, transferring electrical energy into light and heat.]

3. Learning Objectives & Key Terminology:
   - Define potential difference, electric current, and electrical resistance.
   - Construct simple DC circuits to accurately measure potential difference and current.
   - Challenge: Understand and apply the Ohm's law equation V = I × R.
   - Key Words: Electricity, Current, Potential difference, Voltage, Resistance, Amperes (Amps), Volts, Ohms.

4. Microscopic Mechanism of Conduction & How a Battery Works:
   - Delocalised electrons in a metallic conductor drift from higher electrical potential (negative terminal) to lower electrical potential (positive terminal).
   - How a battery works: Chemical reactions separate charges, establishing an electrical potential difference (a difference in electron density). When a closed circuit is connected, electron repulsion pushes electrons continuously through the circuit.
   - High Voltage vs High Current Paradox: A Van de Graaff dome reaches 50,000 V with tiny charge (safe spark), whereas 230 V mains electricity can deliver lethal current. "Current kills" — explain the crucial difference between energy per charge (voltage) and rate of flow (current).

5. The Three Core Quantities:
   - Electric Current (I): Rate of flow of electrical charge (electrons passing a point per second). Formula: Q = I × t. Unit: Amperes / Amps (A). River flow analogy (placid brook vs raging torrent).
   - Potential Difference / Voltage (V): Measure of energy transferred per unit charge (how much potential energy each electron carries). Formula: V = E / Q. Unit: Volts (V). Waterfall height analogy (higher vertical drop transfers greater gravitational potential energy).
   - Electrical Resistance (R): Opposition to current flow; measure of how difficult it is for electrons to pass through a material. Unit: Ohms (Ω). Microscopic cause: electrons collide with vibrating positive metal ions in the conductor lattice, generating thermal energy. No normal component is completely resistance-free. Analogies: Gauntlet obstacle course, rocky river bed, pinched hosepipe restricting water flow.

6. Standard Circuit Symbols & Schematics:
   - Clarity and speed in circuit design.
   - Essential symbols: Cell, battery, open switch, closed switch, lamp/bulb, ammeter, voltmeter, fixed resistor, variable resistor, thermistor, LDR, diode, LED, fuse.
   - Miniaturisation context: Modern microchips (Apple Silicon: 2 million transistors in the cross-section of a human hair).
   - Interactive 60-Second Challenge: "Symbol Snap" pair-and-share matching exercise.

7. Measuring Instruments & DC Circuit Construction:
   - Ammeter: Connected strictly in SERIES with the component to measure the flow rate of charge in Amps.
   - Voltmeter: Connected strictly in PARALLEL across the component to measure the potential difference (energy difference) in Volts.

8. Core Practical: Filament Lamp Characteristics:
   - Circuit setup: DC power pack / battery, variable supply, ammeter in series, filament lamp, voltmeter in parallel across lamp.
   - Method: Increase potential difference in 1 V steps from 1 V up to 10 V. Record potential difference (V) and current (A).
   - Results & Pattern: Higher potential difference produces higher current. Explain why the lamp becomes hotter and how increased ion vibrations increase resistance.

9. Ohm's Law Equation:
   - V = I × R (Potential Difference = Current × Resistance), with rearrangements I = V / R and R = V / I.
   - Clean worked calculation examples with units (Volts, Amps, Ohms).
   - Key rule: Increasing resistance decreases current at constant potential difference.

10. Model Evaluation & Synthesis (The Water Analogy):
    - Reservoir height / water pressure = Potential difference / Voltage.
    - Water flow rate (litres/sec) = Electric current (Amps).
    - Narrowing/constriction in pipe = Electrical resistance (Ohms).
    - Higher-level evaluation: Strengths and limitations of the hydraulic analogy (e.g. cutting a water pipe causes water to leak out, but opening an electrical switch stops all electron flow immediately; wires are pre-filled with mobile electrons).

CRITICAL REQUIREMENT - MAINTAIN BRIGHT CLARITY AND LOW COGNITIVE LOAD:
Every slide must feature exceptionally clean, luminous styling with bright, pure white backgrounds, clean glassmorphic floating cards, generous whitespace, and vivid high-contrast accents (cyan/amber electrical glows).
Limit content on each slide to essential concepts: use short, punchy bullet points (under 15 words each, max 3–4 bullets per card) with bold lead-in keywords. Avoid dense walls of text or cluttered arrangements.
Ensure all circuit schematics, tables, and analogy diagrams are large, crisp, well-spaced, and immediately legible from the back of a classroom.`;
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
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
  if (contexts[0] && contexts[0].pages().length > 0) {
    return contexts[0].pages()[0];
  }
  throw new Error("No open Notebook tab found on CDP port 9333.");
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
    const spinners = page.locator('mat-spinner, mat-progress-spinner, .studio-panel mat-progress-bar, .studio-panel .spinner');
    const spinCount = await spinners.count();
    for (let i = 0; i < spinCount; i++) {
      if (await spinners.nth(i).isVisible().catch(() => false)) return true;
    }
    const topCard = page.locator('artifact-library-item').first();
    if ((await topCard.count()) > 0) {
      const txt = await topCard.innerText().catch(() => "");
      if (/generating|sync\b/i.test(txt)) return true;
    }
  } catch (e) {}
  return false;
}

export async function runGenerationAndIngestion() {
  log("Connecting to Chrome over CDP on port 9333...");
  const browser = await chromium.connectOverCDP(CDP_URL);
  const page = await findStudioPage(browser);
  await page.setViewportSize({ width: 1600, height: 1000 }).catch(() => {});

  if (!page.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31")) {
    log(`Navigating to target notebook URL: ${TARGET_NOTEBOOK_URL}`);
    await page.goto(TARGET_NOTEBOOK_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
  }

  // Ensure download behavior allows writing to PPTX_OUTPUT_DIR
  await fs.mkdir(PPTX_OUTPUT_DIR, { recursive: true });
  try {
    const client = await browser.contexts()[0].newCDPSession(page);
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: PPTX_OUTPUT_DIR,
    });
  } catch (err) {
    log(`CDP setDownloadBehavior notice: ${err.message}`);
  }

  // Close slide deck viewer if open
  const openCloseBtn = page.locator('.studio-panel button[aria-label="Close slide deck"], button[aria-label="Close slide deck"]').first();
  if ((await openCloseBtn.count()) > 0 && (await openCloseBtn.isVisible().catch(() => false))) {
    log("Closing previously open slide deck viewer...");
    await openCloseBtn.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  const getCards = () => page.locator("artifact-library-item");
  let prevTopCardText = "";
  const initialCardsCount = await getCards().count();
  if (initialCardsCount > 0) {
    prevTopCardText = (await getCards().first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
  }
  log(`Initial Studio state: ${initialCardsCount} artifact cards present. Top card: "${prevTopCardText}"`);

  if (await isGenerationVisible(page)) {
    log("An existing generation is active. Waiting for it to settle...");
    while (await isGenerationVisible(page)) {
      await page.waitForTimeout(5000);
    }
    log("Previous generation completed.");
  }

  // Ensure "Slide deck" dialog is open
  const dialogHeading = page.getByText("Customise slide deck", { exact: true });
  if (!(await dialogHeading.isVisible().catch(() => false))) {
    log("Opening 'Slide deck' creator dialog...");
    const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"]').first();
    await slideDeckBtn.waitFor({ state: "visible", timeout: 20000 });
    await slideDeckBtn.click();
    await page.waitForTimeout(1500);
    await dialogHeading.waitFor({ state: "visible", timeout: 15000 });
  }
  log("'Customise slide deck' dialog is open.");

  // Select "Presenter slides" format for bright clarity and visual cards
  const presenterSlidesBtn = page.locator("mat-dialog-container").getByText("Presenter slides").first();
  if ((await presenterSlidesBtn.count()) > 0) {
    await presenterSlidesBtn.click().catch(() => {});
    log("Selected 'Presenter slides' format.");
    await page.waitForTimeout(500);
  }

  const promptText = buildLessonPrompt();
  const promptBox = page.getByLabel("Describe the slide deck that you want to create", { exact: true });
  await promptBox.fill(promptText);
  log(`Injected customised prompt for Lesson 2 (${promptText.length} characters).`);
  await page.waitForTimeout(1000);

  const generateBtn = page.locator('mat-dialog-container button:has-text("Generate now"), button:has-text("Generate now")').first();
  await generateBtn.click();
  log("Clicked 'Generate now'. Generation is queued in Gemini Notebook!");

  await dialogHeading.waitFor({ state: "hidden", timeout: 30000 });
  log("Dialog closed. Monitoring generation progress in Studio...");

  const deadline = Date.now() + 15 * 60 * 1000;
  let settledChecks = 0;
  await page.waitForTimeout(6000);

  const titleKeywords = ["circuits", "electrical", "bulb", "light"];

  while (Date.now() < deadline) {
    const isViewerOpen = (await page.locator('.studio-panel button[aria-label="More options"]').count()) > 0;
    if (isViewerOpen) {
      log("Slide deck viewer opened! Generation is finished.");
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
        log("Slide deck generation complete!");
        break;
      }
    }

    await page.waitForTimeout(5000);
  }

  await page.waitForTimeout(3000);

  // Trigger PowerPoint download
  const pptxTargetFile = path.join(PPTX_OUTPUT_DIR, `${LESSON_02_CONFIG.deckId}.pptx`);
  const downloadStartTime = Date.now();
  log("Triggering PowerPoint (.pptx) download...");

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

  // Poll for downloaded file
  let downloadedPptx = null;
  const pollDeadline = Date.now() + 60000;
  while (Date.now() < pollDeadline) {
    await new Promise(r => setTimeout(r, 1000));
    const files = await fs.readdir(PPTX_OUTPUT_DIR).catch(() => []);
    for (const f of files) {
      if (f.endsWith(".pptx")) {
        const fullPath = path.join(PPTX_OUTPUT_DIR, f);
        const stat = await fs.stat(fullPath).catch(() => null);
        if (stat && stat.size > 100000 && stat.mtimeMs >= downloadStartTime - 5000) {
          downloadedPptx = fullPath;
          log(`Found downloaded PowerPoint file: ${f} (${stat.size} bytes).`);
          break;
        }
      }
    }
    if (downloadedPptx) break;
  }

  if (!downloadedPptx) {
    throw new Error(`Failed to find downloaded PPTX in ${PPTX_OUTPUT_DIR}`);
  }

  if (downloadedPptx !== pptxTargetFile) {
    await fs.copyFile(downloadedPptx, pptxTargetFile);
  }

  // Close viewer if open
  const closeViewerBtn = page.locator('.studio-panel button[aria-label="Close slide deck"]').first();
  if ((await closeViewerBtn.count()) > 0 && (await closeViewerBtn.isVisible().catch(() => false))) {
    await closeViewerBtn.click().catch(() => {});
    await page.waitForTimeout(1500);
  }

  // Ingest deck
  await ingestLessonDeck(pptxTargetFile);
}

export async function ingestLessonDeck(pptxTargetFile) {
  log("Ingesting PPTX into web decks for Lesson 02...");
  await fs.mkdir(PUBLIC_DECKS_DIR, { recursive: true });

  const deckFolder = LESSON_02_CONFIG.deckId;
  const deckTargetDir = path.join(PUBLIC_DECKS_DIR, deckFolder);

  const manifest = await extractPptxDeck(pptxTargetFile, PUBLIC_DECKS_DIR, deckFolder, {
    slideSet: "physics_electricity_magnetism",
    title: `2. ${LESSON_02_CONFIG.title}`,
  });
  log(`Extracted ${manifest.totalSlides} slides into ${deckTargetDir}.`);

  const manifestPath = path.join(deckTargetDir, "manifest.json");
  const currentManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  currentManifest.title = `2. ${LESSON_02_CONFIG.title}`;
  currentManifest.shortTitle = LESSON_02_CONFIG.shortTitle;
  currentManifest.slideSet = "physics_electricity_magnetism";
  currentManifest.courseName = "GCSE Physics: Electricity and Magnetism";
  currentManifest.teacher = LESSON_02_CONFIG.teacher;
  currentManifest.practicalsCount = LESSON_02_CONFIG.practicalsCount;

  // Configure Slide 2 as interactive 6-cell starter retrieval grid
  if (currentManifest.slides && currentManifest.slides.length >= 2) {
    const slide2 = currentManifest.slides[1];
    slide2.title = `Starter Activity: Knowledge Retrieval (Electrical Circuits)`;
    slide2.isInteractive = true;
    slide2.interactiveType = "question_reveal";

    const standardCells = [
      { x: 9.5, y: 38.5, w: 27, h: 6.5 },
      { x: 38.0, y: 38.5, w: 27, h: 6.5 },
      { x: 66.5, y: 38.5, w: 27, h: 6.5 },
      { x: 9.5, y: 72.0, w: 27, h: 6.5 },
      { x: 38.0, y: 72.0, w: 27, h: 6.5 },
      { x: 66.5, y: 72.0, w: 27, h: 6.5 },
    ];

    slide2.reveals = LESSON_02_CONFIG.starterQuestions.map((sq, idx) => {
      const b = standardCells[idx] || standardCells[0];
      return {
        id: `reveal_s2_cell_${idx + 1}`,
        question: `${idx + 1}. ${sq.q}`,
        expectedAnswer: sq.a,
        bounds: { ...b },
        answerBounds: { ...b },
        revealMode: "overlay",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: false,
        answerIsBaked: false
      };
    });
  }

  // Integrate interactive simulator
  if (LESSON_02_CONFIG.interactives && LESSON_02_CONFIG.interactives.length > 0) {
    for (const interactive of LESSON_02_CONFIG.interactives) {
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
        imageUrl: `/decks/physics_electricity_magnetism/${deckFolder}/slides/${embedSlideFileName}`,
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
      log(`Integrated interactive simulation slide: "${interactive.title}" -> ${interactive.url}`);
    }
  }

  await fs.writeFile(manifestPath, JSON.stringify(currentManifest, null, 2), "utf8");
  log(`Updated manifest for ${deckFolder} (${currentManifest.slides.length} slides).`);
}

if (process.argv[1] && process.argv[1].endsWith("generate_lesson_02_from_pdf_prompt.mjs")) {
  runGenerationAndIngestion().catch(err => {
    console.error("FATAL SCRIPT ERROR:", err);
    process.exit(1);
  });
}

