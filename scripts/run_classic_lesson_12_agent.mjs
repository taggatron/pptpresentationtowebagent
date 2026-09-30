import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";
import { generateSlideInteractivity } from "../src/gemini-segmenter.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_ecology_atmosphere_sequence_classic");
const PPTX_TARGET_FILE = path.join(PPTX_OUTPUT_DIR, "Lesson_12_Recycling.pptx");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/ecology_atmosphere_classic");
const DECK_ID = "Classic_Lesson_12_Recycling";
const DECK_PATH = path.join(PUBLIC_DECKS_DIR, DECK_ID);
const CDP_URL = "http://127.0.0.1:9333";
const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/40fbb05f-e884-4f79-828b-c4539e9a0d31";

console.log("================================================================================");
console.log(" ✦ Gemini Notebook Slide Creation Agent Flow: Lesson 12 Recycling");
console.log(" Deck ID:", DECK_ID);
console.log(" PPTX Target File:", PPTX_TARGET_FILE);
console.log(" Public Decks Dir:", PUBLIC_DECKS_DIR);
console.log(" Notebook URL:", TARGET_NOTEBOOK_URL);
console.log("================================================================================");

const LESSON_12_PROMPT = `Create a detailed classroom slide deck for GCSE Science: Ecology, Atmosphere & Resources.

Use the exact deck title: “Lesson 12: Recycling”.

Lesson details: Sustainable development and conservation of the Earth's finite resources, principles of reducing, reusing, and recycling materials (metals, glass, plastics, paper), methods of recycling metals (melting, recasting) and plastics (sorting, shredding, reforming), energy consumption and environmental advantages of recycling compared to raw extraction and smelting/cracking, economic impacts, and the role of consumer behavior and policy.

Use UK English and draw factual teaching content from the selected notebook sources.

Pitch the lesson at GCSE Combined Science learners. Build a coherent teaching sequence with learning objectives, essential terminology, accurate explanations, context, worked examples or calculations where appropriate, safety and quality considerations where relevant, regular checks for understanding, and a concise plenary summary.

CRITICAL REQUIREMENT - BRIGHT, CLEAR SLIDES WITH LOW COGNITIVE LOAD: Every slide must feature bright, clear, exceptionally uncluttered layouts with generous whitespace, clean luminous visual styling, and high contrast. Use bright, clear slide designs that are fresh, well-lit, visually open, and immediately legible. Slides must NOT contain too much information, dark murky backgrounds, or dense walls of text.

Limit content on each slide to essential concepts: use short, punchy bullet points (under 15 words each, max 3–4 bullets per card/container) with bold lead-ins. Avoid long narrative paragraphs.

Ensure all diagrams, tables, and data callouts are large, well-spaced, high-contrast, bright, clear, and immediately readable from the back of a classroom.

Ensure that all lessons integrate knowledge checkpoints and learner activities (like labelling industrial flowcharts, comparing energy savings, or evaluating recycling decisions) at the correct part of the lesson to maintain active engagement.

For data interpretation, worked examples, and practical workflows (such as metal vs plastic recycling cycles), ensure practice tasks and exemplars have really clear, uncluttered step-by-step layouts with clean spacing between prompt, evidence, and explanation.

Make diagrams and layouts readable from the back of a classroom. Avoid invented references, unrealistic industrial procedures, and claims that are not supported by the notebook sources.

Ensure every slide features bright, clear, uncluttered slide visuals with generous whitespace, crisp modern typography, high visual hierarchy, and well-spaced layouts. Avoid dark muddiness, cognitive overload, visual clutter, dense walls of text, and overcrowded diagram elements.

For calculations and question slides, ensure worked examples and practice questions have really clear, uncluttered step-by-step layouts with clean spacing between the question, formula, substitutions, and final answers.

Make this lesson fully self-contained. Do not pre-teach content from later lessons.

Only reference prior lessons briefly where helpful for context, then return focus to this lesson's objectives.

Maximise student learning activity frequencies and interactive learning games throughout the deck.

Include frequent high-engagement checkpoints such as pair-and-share challenges, quick-fire retrieval games, diagram labelling exercises, calculation races, and interactive concept-matching games on slides.

Make the first slide a clear title slide without any learner activities. Immediately following the title slide, include exactly one 5–10 minute starter slide formatted as a 6-cell grid (2 columns x 3 rows).

Populate each of the 6 cells with one concise starter question directly related to this lesson topic, each with a short success cue or expected answer:
Cell 1: Name two finite resources extracted from the Earth's crust. [Success Cue: Think fuels and ores] [Answer: Crude oil, metal ores]
Cell 2: What physical process is used to separate crude oil into useful fractions? [Success Cue: Relies on different boiling points] [Answer: Fractional distillation]
Cell 3: What greenhouse gas is produced when carbon is used to extract iron from its ore? [Success Cue: C + O2 -> ?] [Answer: Carbon dioxide / CO2]
Cell 4: Crude oil is the main raw material (feedstock) for which major industry? [Success Cue: Used to make plastics] [Answer: Petrochemical industry]
Cell 5: Why must aluminium be extracted using electrolysis rather than heating with carbon? [Success Cue: Look at the reactivity series] [Answer: It is more reactive than carbon]
Cell 6: Name one major environmental problem caused by extracting metals via open-pit mining. [Success Cue: Think about habitats] [Answer: Habitat destruction / pollution]

Ensure the questions activate prerequisite knowledge, diagnostic misconceptions, or core concepts needed for this specific lesson.

Keep all other slides focused on core teaching, demonstrations, guided practice, and checks for understanding. Do not place starter grids or retrieval activities on other slides.`;

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
  throw new Error("No open NotebookLM / Gemini Notebook tab found on CDP port 9333.");
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

export async function runAgentFlow() {
  log("Connecting to Google Chrome over CDP on port 9333...");
  const browser = await chromium.connectOverCDP(CDP_URL);
  const page = await findStudioPage(browser);
  await page.setViewportSize({ width: 1600, height: 1000 }).catch(() => {});
  log(`Found Notebook page: "${await page.title()}" (${page.url()})`);

  if (!page.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31")) {
    log(`Navigating page to target notebook URL: ${TARGET_NOTEBOOK_URL}`);
    await page.goto(TARGET_NOTEBOOK_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
  }

  await dismissTransientDialogs(page);

  // Read current top artifact cards text
  const getCards = () => page.locator('artifact-library-item, div:has(button[aria-description="Slide deck"])');
  let prevTopCardText = "";
  const initialCardsCount = await getCards().count();
  if (initialCardsCount > 0) {
    prevTopCardText = (await getCards().first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
  }
  log(`Initial Studio state: ${initialCardsCount} artifact cards present. Top card: "${prevTopCardText}"`);

  // Check if any generation is currently active
  if (await isGenerationVisible(page)) {
    log("An existing generation is active. Waiting for it to finish...");
    while (await isGenerationVisible(page)) {
      await page.waitForTimeout(5000);
    }
    log("Existing generation finished.");
  }

  // Open the "Slide deck" dialog
  log("Opening the 'Slide deck' creator in Studio...");
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"]').first();
  await slideDeckBtn.click();
  await page.waitForTimeout(1500);

  const dialogHeading = page.getByText("Customise slide deck", { exact: true });
  await dialogHeading.waitFor({ state: "visible", timeout: 15000 });
  log("'Customise slide deck' dialog is open.");

  // Select "Presenter slides"
  const presenterSlidesBtn = page.getByText("Presenter slides", { exact: true });
  if ((await presenterSlidesBtn.count()) > 0) {
    await presenterSlidesBtn.click();
    log("Selected 'Presenter slides' mode.");
    await page.waitForTimeout(500);
  }

  // Fill in the prompt
  const promptBox = page.getByLabel("Describe the slide deck that you want to create", { exact: true });
  await promptBox.fill(LESSON_12_PROMPT);
  log("Injected amended Lesson 12 Recycling prompt with bright clear slides requirement.");
  await page.waitForTimeout(1000);

  // Click "Generate now"
  const generateBtn = page.locator('mat-dialog-container button:has-text("Generate now"), button:has-text("Generate now")').first();
  await generateBtn.click();
  log("Clicked 'Generate now'. Generation is queued!");

  // Wait for dialog to dismiss
  await dialogHeading.waitFor({ state: "hidden", timeout: 30000 });
  log("Dialog closed. Monitoring generation progress in Studio...");

  // Wait for generation to start and then complete
  const deadline = Date.now() + 15 * 60 * 1000; // 15 minute timeout
  let settledChecks = 0;
  let newestCard = null;

  // Initial wait for backend initiation
  await page.waitForTimeout(5000);

  while (Date.now() < deadline) {
    const isGenerating = await isGenerationVisible(page);
    const cards = getCards();
    const currentCount = await cards.count();
    let currentTopText = "";
    if (currentCount > 0) {
      currentTopText = (await cards.first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    }

    const isTopCardGenerating = /generating|sync\b/i.test(currentTopText);
    const isNewCard = currentTopText !== prevTopCardText || currentCount > initialCardsCount || /just now|\b[1-5]m ago/i.test(currentTopText);
    const isRecyclingCard = /recycling|materials|finite|circular/i.test(currentTopText);

    if (isGenerating || isTopCardGenerating) {
      settledChecks = 0;
      log(`Generating presentation in NotebookLM: (${currentTopText || "Generating..."})...`);
    } else if (isNewCard && (isRecyclingCard || /just now/i.test(currentTopText))) {
      settledChecks += 1;
      log(`Detected completed new artifact card: "${currentTopText}" (settled check ${settledChecks}/2)`);
      if (settledChecks >= 2) {
        newestCard = cards.first();
        log(`Slide deck generation complete! Card: "${currentTopText}"`);
        break;
      }
    } else {
      // Check top 3 cards in case top card was slightly delayed
      for (let i = 0; i < Math.min(currentCount, 3); i++) {
        const text = (await cards.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
        if (/recycling|materials|finite/i.test(text) && !/generating/i.test(text)) {
          settledChecks += 1;
          if (settledChecks >= 2) {
            newestCard = cards.nth(i);
            log(`Found completed Recycling card [${i}]: "${text}"`);
            break;
          }
        }
      }
      if (newestCard) break;
    }

    await page.waitForTimeout(5000);
  }

  if (!newestCard) {
    throw new Error("Timed out waiting for Lesson 12 Recycling slide deck generation.");
  }

  // Open the newly generated slide deck artifact
  log("Opening slide deck artifact in Notebook viewer...");
  const cardButton = newestCard.locator('button.artifact-stretched-button, [role="button"]').first();
  await cardButton.click();
  await page.waitForTimeout(3000);

  // Locate the viewer page or tab
  let viewerPage = page;
  for (const p of browser.contexts()[0].pages()) {
    const hasViewerControls = await p.locator('button[mattooltip="Revise"], button[aria-label="Revise"], button[aria-label*="More" i]').count();
    if (hasViewerControls > 0) {
      viewerPage = p;
      break;
    }
  }
  log(`Viewer tab found: "${await viewerPage.title()}"`);

  // Ensure output directory exists
  await fs.mkdir(PPTX_OUTPUT_DIR, { recursive: true });

  // Setup download handler
  log("Triggering PowerPoint (.pptx) download...");
  const moreBtn = viewerPage.locator('button[aria-label*="More" i], button:has-text("More options"), button[mattooltip*="More" i]').first();
  await moreBtn.waitFor({ state: "visible", timeout: 15000 });
  await moreBtn.click();
  await viewerPage.waitForTimeout(1000);

  const pptxOptionLabels = [
    "Download PowerPoint (.pptx)",
    "Download as PowerPoint (.pptx)",
    "PowerPoint (.pptx)",
    "Download PowerPoint",
    "Export to PowerPoint",
  ];

  let pptxMenuItem = null;
  for (const label of pptxOptionLabels) {
    const candidate = viewerPage.getByText(label, { exact: true });
    if ((await candidate.count()) > 0 && (await candidate.first().isVisible().catch(() => false))) {
      pptxMenuItem = candidate.first();
      break;
    }
  }

  if (!pptxMenuItem) {
    pptxMenuItem = viewerPage.locator('[role="menuitem"]:has-text("PowerPoint"), button:has-text("PowerPoint")').first();
  }

  const [download] = await Promise.all([
    viewerPage.waitForEvent("download", { timeout: 60000 }),
    pptxMenuItem.click(),
  ]);

  log(`Download initiated: ${download.suggestedFilename()}`);
  await download.saveAs(PPTX_TARGET_FILE);
  const stat = await fs.stat(PPTX_TARGET_FILE);
  log(`Saved PPTX to ${PPTX_TARGET_FILE} (${stat.size} bytes).`);

  // Close viewer if close button exists
  const closeBtn = viewerPage.getByRole("button", { name: /Close slide deck|Close/ });
  if ((await closeBtn.count()) > 0 && (await closeBtn.first().isVisible().catch(() => false))) {
    await closeBtn.first().click().catch(() => {});
  }

  log("Notebook slide creation and download completed successfully!");
}

export async function ingestAndSegmentDeck() {
  log(`Checking PPTX output at: ${PPTX_TARGET_FILE}`);
  const stat = await fs.stat(PPTX_TARGET_FILE);
  log(`PPTX file verified: ${stat.size} bytes (modified: ${stat.mtime.toISOString()})`);

  log(`Extracting PPTX presentation into ${PUBLIC_DECKS_DIR} as ${DECK_ID}...`);
  const manifest = await extractPptxDeck(PPTX_TARGET_FILE, PUBLIC_DECKS_DIR, DECK_ID, {
    slideSet: "ecology_atmosphere_classic",
    title: "12. Recycling",
  });
  log(`Extracted ${manifest.totalSlides} slides for ${manifest.id}.`);

  // Configure Slide 2 interactive starter retrieval grid if applicable
  const manifestPath = path.join(DECK_PATH, "manifest.json");
  const currentManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  currentManifest.title = "12. Recycling";
  currentManifest.slideSet = "ecology_atmosphere_classic";

  if (currentManifest.slides && currentManifest.slides.length >= 2) {
    const slide2 = currentManifest.slides[1];
    slide2.title = "Starter Activity: Knowledge Retrieval";
    slide2.isInteractive = true;
    slide2.interactiveType = "question_reveal";

    // Standard 6-cell grid retrieval coordinates (2 cols x 3 rows)
    const starterCells = [
      {
        id: "reveal_2_cell_1",
        question: "1. Name two finite resources extracted from the Earth's crust.",
        expectedAnswer: "Crude oil, metal ores",
        bounds: { x: 9.5, y: 38.5, w: 27, h: 6.5 },
        answerBounds: { x: 9.5, y: 38.5, w: 27, h: 6.5 },
        revealMode: "overlay",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: false,
        answerIsBaked: false
      },
      {
        id: "reveal_2_cell_2",
        question: "2. What physical process is used to separate crude oil into useful fractions?",
        expectedAnswer: "Fractional distillation",
        bounds: { x: 56, y: 38.5, w: 27.5, h: 6.5 },
        answerBounds: { x: 56, y: 38.5, w: 27.5, h: 6.5 },
        revealMode: "overlay",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: false,
        answerIsBaked: false
      },
      {
        id: "reveal_2_cell_3",
        question: "3. What greenhouse gas is produced when carbon is used to extract iron from its ore?",
        expectedAnswer: "Carbon dioxide / CO2",
        bounds: { x: 9.5, y: 63, w: 27, h: 6.5 },
        answerBounds: { x: 9.5, y: 63, w: 27, h: 6.5 },
        revealMode: "overlay",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: false,
        answerIsBaked: false
      },
      {
        id: "reveal_2_cell_4",
        question: "4. Crude oil is the main raw material (feedstock) for which major industry?",
        expectedAnswer: "Petrochemical industry",
        bounds: { x: 56, y: 63, w: 29, h: 6.5 },
        answerBounds: { x: 56, y: 63, w: 29, h: 6.5 },
        revealMode: "overlay",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: false,
        answerIsBaked: false
      },
      {
        id: "reveal_2_cell_5",
        question: "5. Why must aluminium be extracted using electrolysis rather than heating with carbon?",
        expectedAnswer: "It is more reactive than carbon",
        bounds: { x: 9.5, y: 88, w: 35, h: 6.5 },
        answerBounds: { x: 9.5, y: 88, w: 35, h: 6.5 },
        revealMode: "overlay",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: false,
        answerIsBaked: false
      },
      {
        id: "reveal_2_cell_6",
        question: "6. Name one major environmental problem caused by extracting metals via open-pit mining.",
        expectedAnswer: "Habitat destruction / pollution",
        bounds: { x: 56, y: 88, w: 35, h: 6.5 },
        answerBounds: { x: 56, y: 88, w: 35, h: 6.5 },
        revealMode: "overlay",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: false,
        answerIsBaked: false
      }
    ];

    slide2.interactiveCells = starterCells;
  }

  await fs.writeFile(manifestPath, JSON.stringify(currentManifest, null, 2), "utf8");
  log("Saved manifest with configured interactive starter grid.");

  log("Running cognitive segmentation and calculating load metrics...");
  await generateSlideInteractivity(DECK_ID, PUBLIC_DECKS_DIR);
  log("Cognitive segmentation and metrics generation complete!");
}

async function main() {
  const isIngestOnly = process.argv.includes("--ingest-only");
  if (!isIngestOnly) {
    await runAgentFlow();
  }
  await ingestAndSegmentDeck();
  log("All steps completed successfully!");
}

main().catch((err) => {
  console.error("[Fatal Error]:", err);
  process.exit(1);
});
