import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_electrical_installation_level_2");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/electrical_installation_diploma_level_2");
const CDP_URL = "http://127.0.0.1:9333";
const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/3286ca38-5b3b-44b1-a429-080a12b5fb04";

export const ELECTRICAL_LEVEL2_CONFIG = {
  number: 1,
  title: "Force, Energy, Work and Power",
  shortTitle: "Mechanics & Power",
  teacher: "Electrical Engineering Faculty",
  courseName: "Electrical Installation Diploma Level 2",
  slideSetId: "electrical_installation_diploma_level_2",
  deckId: "Lesson_01_Force_Energy_Work_Power",
  starterQuestions: [
    {
      q: "What is the SI unit of force, and what equation calculates it?",
      a: "Newton (N). Calculated using Newton's Second Law: Force = mass × acceleration (F = m × a).",
      cue: "F = ma & Newtons"
    },
    {
      q: "What is the fundamental difference between mass and weight?",
      a: "Mass (kg) is the constant quantity of matter in a body. Weight (N) is the downward gravitational force acting on that mass (W = m × g).",
      cue: "Matter vs Gravity"
    },
    {
      q: "State the Law of Conservation of Energy.",
      a: "Energy cannot be created or destroyed; it can only be transformed from one form into another.",
      cue: "Transformed, not destroyed"
    },
    {
      q: "How is power defined in mechanics and electrical science, and what is its SI unit?",
      a: "Power is the rate of doing work or transferring energy: Power = Work done ÷ time (P = W / t). Measured in Watts (W = 1 Joule/second).",
      cue: "Rate of work (Watts)"
    },
    {
      q: "What is the formula for the Mechanical Advantage (MA) of a simple machine?",
      a: "Mechanical Advantage = Load ÷ Effort (MA = Load / Effort). A mechanical advantage greater than 1 amplifies the applied force.",
      cue: "Load ÷ Effort"
    },
    {
      q: "Challenge: How does mechanical power relate to electrical power in a motor or winch system?",
      a: "Both mechanical power (P = W/t) and electrical power (P = V × I) are measured in Watts. 1 kW of mechanical output requires at least 1 kW of electrical input power plus extra to overcome heat and friction losses.",
      cue: "Watts = V × I = W/t"
    }
  ]
};

export function buildLessonPrompt() {
  return `Create a high-engagement, luminous classroom slide deck for Electrical Installation Diploma Level 2 (City & Guilds 2365 / EAL Unit 202: Principles of Electrical Science).

Use the exact deck title: "Lesson 1: Force, Energy, Work and Power".
Course: Electrical Installation Diploma Level 2
Target Audience: Vocational electrical apprentice electricians and engineers.

PEDAGOGICAL & VISUAL REQUIREMENTS:
- Aesthetic: Bright, minimalist, ultra-clean modern technology theme (pure white / pale neutral backgrounds, high-contrast typography, crisp accents in electric cyan, cobalt blue, and warm amber).
- Cognitive Load Management: Low cognitive load, zero walls of text, strict adherence to Mayer's multimedia principles. Use dedicated floating cards, bold lead-in keywords, side-by-side comparative callouts, and clean formula boxes.
- Real-World Relevance: Direct application to electrical installation trade (cable pulling, conduit bending, motor hoists, transformer rigging, cable tray load ratings, winch gearboxes).

STRUCTURE & CONTENT PER SLIDE:
Slide 1: Lesson Title & Overview
- Title: "Force, Energy, Work and Power"
- Subtitle: "City & Guilds 2365 Level 2 Diploma in Electrical Installations · Unit 202: Principles of Electrical Science"
- Feature portraits and contributions of Sir Isaac Newton (Laws of Motion, Force) and James Prescott Joule (Mechanical Equivalent of Heat, Energy & Power).

Slide 2: Starter Knowledge Retrieval (6-Cell Grid)
- 6 dedicated clean retrieval boxes with clear prompts:
  1. Unit of force and formula (F = ma, Newtons).
  2. Mass (kg, invariant matter) vs Weight (N, gravitational force W = mg).
  3. Law of Conservation of Energy (energy transformed, never created or destroyed).
  4. Definition of Power and its SI unit (Rate of doing work: P = W/t, Watts).
  5. Mechanical Advantage formula (MA = Load / Effort).
  6. Challenge: Linking mechanical power to electrical circuits (P = V × I = W/t in Watts).

Slide 3: CRITICAL ENGAGING HOOK
- Title: "The 1-Tonne Industrial Cable Pull: Why Electricians Must Master Mechanical Physics"
- Trade Scenario: You are rigging a motorized winch and pulley snatch-block to pull an 80-metre, 1,000 kg 240mm² steel wire armoured (SWA) sub-main cable into an industrial switchroom.
- The Dilemma: What happens if you miscalculate friction forces, turning moments, and mechanical advantage?
- The Consequence: The cable tensile sheath tears, the containment rigging snaps, or the winch motor draws massive overload current (I²R) and burns out!
- The Takeaway: "Electricians don't just wire circuits—they control the mechanical forces that power modern infrastructure."

Slide 4: Learning Objectives & Core Vocabulary
- Define scalar vs vector quantities (speed vs velocity).
- Calculate force using Newton's Second Law (F = ma) and weight (W = mg).
- Calculate mechanical work done (W = F × d) and gravitational potential energy (PE = mgh).
- Calculate kinetic energy (KE = ½mv²) and rate of energy transfer (P = W/t).
- Apply the principle of moments to levers (Class 1, 2, 3) and calculate machine efficiency.
- Vocabulary: Force (N), Mass (kg), Weight (N), Acceleration (m/s²), Work (J), Power (W), Torque (Nm), Mechanical Advantage.

Slide 5: Newton's Second Law & Calculating Force
- Force = mass × acceleration (F = m × a).
- Definition of the Newton: The force required to give a 1 kg mass an acceleration of 1 m/s².
- Clean formula triangle (F on top, m and a on bottom).
- Step-by-step worked calculation: Calculating force required to accelerate machinery and loads on site.

Slide 6: Mass vs Weight in Electrical Installations
- Mass (m): Quantity of matter in a body (measured in kg, constant anywhere in the universe).
- Weight (W): Downward gravitational force acting on mass (measured in Newtons, W = m × g, where g = 9.81 m/s² on Earth).
- Site context: Calculating the static downward force of heavy switchgear and cable trays on ceiling anchor bolts.

Slide 7: Speed, Velocity and Acceleration
- Speed: Scalar quantity (magnitude only, e.g. 50 km/h).
- Velocity: Vector quantity (magnitude AND direction, e.g. 50 km/h due West).
- Acceleration (a): Rate of change in velocity over time (a = Δv / Δt in m/s²).

Slide 8: The Principle of Levers & Turning Moments (Torque)
- Turning moment (Torque): Force × perpendicular distance from fulcrum (T = F × d, unit: Newton-metres, Nm).
- Law of the Lever: Load × Distance_load = Effort × Distance_effort.
- Worked lever calculation for balancing loads.

Slide 9: The Three Classes of Levers in the Electrical Trade
- Class 1: Fulcrum in middle (e.g. Crowbar pulling trunking, claw hammer removing conduit fixings).
- Class 2: Load in middle (e.g. Wheelbarrow transporting heavy drums of SWA cable).
- Class 3: Effort in middle (e.g. Side-cutters, cable snips, crimping pliers).

Slide 10: Mechanical Advantage & Pulley Systems
- Mechanical Advantage (MA) = Load Force ÷ Effort Force.
- Hoisting heavy electrical equipment: Multi-rope block and tackle pulleys.
- 4-rope pulley system formula: Effort F = mg / 4 (reduces required operator pulling force by 75%).

Slide 11: Gears & Transmission Ratios in Cable Winches
- Gear ratio = Driven teeth (Gear B) ÷ Driver teeth (Gear A).
- Torque multiplication and speed reduction: How winch motors trade speed for immense pulling torque to haul cables safely.

Slide 12: Work Done & Gravitational Potential Energy
- Work Done = Force × Distance moved (W = F × s, measured in Joules).
- Vertical lifting work: Work = mass × gravity × height (W = mgh).
- 1 Joule = Work done when 1 Newton moves an object through 1 metre.

Slide 13: Forms of Energy & Kinetic Energy
- Energy: Capacity to do work (Joules).
- Potential Energy (stored energy): PE = m × g × h.
- Kinetic Energy (energy of motion): KE = ½ × m × v².
- Law of Conservation of Energy: PE converts to KE in falling bodies and swinging loads.

Slide 14: Power in Mechanical & Electrical Systems
- Power = Work Done ÷ Time Taken (P = W / t). Unit: Watts (W) = 1 Joule per second.
- The Universal Bridge to Electrical Science: Mechanical Power (Watts) = Electrical Power (P = V × I in Watts).
- 1 Horsepower ≈ 746 Watts. Sizing electrical motors to deliver required mechanical work.

Slide 15: Machine Efficiency & Electrical Energy Losses
- Efficiency % = (Useful Output Power ÷ Total Input Power) × 100.
- Energy dissipation: Heat loss (I²R resistance in copper windings), friction in bearings, acoustic noise.
- Practical worked example: Sizing an electric hoist motor accounting for 85% mechanical efficiency.

Slide 16: Summary, Formula Sheet & Exam-Style Check
- Comprehensive summary table of all formulas: F = ma, W = mg, W = Fd, P = W/t, MA = Load/Effort, Efficiency % = (P_out/P_in) × 100.
- Key exam tips for City & Guilds 2365 Unit 202 assessments.`;
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function findStudioPage(browser) {
  const contexts = browser.contexts();
  for (const ctx of contexts) {
    for (const p of ctx.pages()) {
      if (p.url().includes("3286ca38-5b3b-44b1-a429-080a12b5fb04") || p.url().includes("notebook")) {
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

  log(`Target Notebook URL: ${TARGET_NOTEBOOK_URL}`);
  if (!page.url().includes("3286ca38-5b3b-44b1-a429-080a12b5fb04")) {
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
    const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"], button:has-text("Slide deck")').first();
    await slideDeckBtn.waitFor({ state: "visible", timeout: 20000 });
    await slideDeckBtn.click();
    await page.waitForTimeout(1500);
    await dialogHeading.waitFor({ state: "visible", timeout: 15000 });
  }
  log("'Customise slide deck' dialog is open.");

  // Select "Presenter slides" format for luminous visual cards
  const presenterSlidesBtn = page.locator("mat-dialog-container").getByText("Presenter slides").first();
  if ((await presenterSlidesBtn.count()) > 0) {
    await presenterSlidesBtn.click().catch(() => {});
    log("Selected 'Presenter slides' format.");
    await page.waitForTimeout(500);
  }

  const promptText = buildLessonPrompt();
  const promptBox = page.getByLabel("Describe the slide deck that you want to create", { exact: true });
  await promptBox.fill(promptText);
  log(`Injected customised prompt for Electrical Installation Level 2 (${promptText.length} characters).`);
  await page.waitForTimeout(1000);

  const generateBtn = page.locator('mat-dialog-container button:has-text("Generate now"), button:has-text("Generate now")').first();
  await generateBtn.click();
  log("Clicked 'Generate now'. Generation is queued in Gemini Notebook!");

  await dialogHeading.waitFor({ state: "hidden", timeout: 30000 }).catch(() => {});
  log("Dialog closed. Monitoring generation progress in Studio...");

  const deadline = Date.now() + 15 * 60 * 1000;
  let settledChecks = 0;
  await page.waitForTimeout(6000);

  const titleKeywords = ["force", "energy", "work", "power", "electrical", "mechanics"];

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
      log(`Gemini Notebook is generating slide deck (${currentTopText.slice(0, 60)}...)...`);
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
  const pptxTargetFile = path.join(PPTX_OUTPUT_DIR, `${ELECTRICAL_LEVEL2_CONFIG.deckId}.pptx`);
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

  await browser.close();

  // Ingest deck
  await ingestLessonDeck(pptxTargetFile);
}

export async function ingestLessonDeck(pptxTargetFile) {
  log(`Ingesting PPTX into web decks at ${PUBLIC_DECKS_DIR}...`);
  await fs.mkdir(PUBLIC_DECKS_DIR, { recursive: true });

  const deckFolder = ELECTRICAL_LEVEL2_CONFIG.deckId;
  const deckTargetDir = path.join(PUBLIC_DECKS_DIR, deckFolder);

  const manifest = await extractPptxDeck(pptxTargetFile, PUBLIC_DECKS_DIR, deckFolder, {
    slideSet: ELECTRICAL_LEVEL2_CONFIG.slideSetId,
    title: `1. ${ELECTRICAL_LEVEL2_CONFIG.title}`,
  });
  log(`Extracted ${manifest.totalSlides} slides into ${deckTargetDir}.`);

  const manifestPath = path.join(deckTargetDir, "manifest.json");
  const currentManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  currentManifest.title = `1. ${ELECTRICAL_LEVEL2_CONFIG.title}`;
  currentManifest.shortTitle = ELECTRICAL_LEVEL2_CONFIG.shortTitle;
  currentManifest.slideSet = ELECTRICAL_LEVEL2_CONFIG.slideSetId;
  currentManifest.courseName = ELECTRICAL_LEVEL2_CONFIG.courseName;
  currentManifest.teacher = ELECTRICAL_LEVEL2_CONFIG.teacher;

  // Configure Slide 1 metadata
  if (currentManifest.slides && currentManifest.slides.length >= 1) {
    currentManifest.slides[0].title = "1. Force, Energy, Work and Power (Course Introduction)";
  }

  // Configure Slide 2 as interactive 6-cell starter retrieval grid
  if (currentManifest.slides && currentManifest.slides.length >= 2) {
    const slide2 = currentManifest.slides[1];
    slide2.title = `Starter Activity: Knowledge Retrieval (Forces & Power)`;
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

    slide2.reveals = ELECTRICAL_LEVEL2_CONFIG.starterQuestions.map((sq, idx) => {
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

  // Configure Slide 3 as the Hook
  if (currentManifest.slides && currentManifest.slides.length >= 3) {
    currentManifest.slides[2].title = "Trade Hook: The 1-Tonne Cable Pull & Why Electricians Need Mechanical Physics";
  }

  await fs.writeFile(manifestPath, JSON.stringify(currentManifest, null, 2), "utf8");
  log(`Updated manifest for ${deckFolder} (${currentManifest.slides.length} slides).`);

  // Create alias for "Electrical Installation Diploma Level 2" directory if needed
  const aliasDir = path.resolve("./public/decks/Electrical Installation Diploma Level 2");
  try {
    const stat = await fs.lstat(aliasDir).catch(() => null);
    if (!stat) {
      await fs.symlink(PUBLIC_DECKS_DIR, aliasDir, "dir");
      log(`Created symlink alias at: ${aliasDir}`);
    }
  } catch (err) {
    log(`Notice on symlink creation: ${err.message}`);
  }
}

if (process.argv[1] && process.argv[1].endsWith("generate_electrical_level2_deck.mjs")) {
  runGenerationAndIngestion().catch(err => {
    console.error("FATAL SCRIPT ERROR:", err);
    process.exit(1);
  });
}
