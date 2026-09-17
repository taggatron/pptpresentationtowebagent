import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";
import { generateSlideInteractivity } from "../src/gemini-segmenter.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_ecology_atmosphere_sequence_classic");
const PPTX_TARGET_FILE_1 = path.join(PPTX_OUTPUT_DIR, "Lesson_05_Carbon_Cycle.pptx");
const PPTX_TARGET_FILE_2 = path.join(PPTX_OUTPUT_DIR, "Lesson_05_Carbon_and_Water_Cycle.pptx");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/ecology_atmosphere_classic");
const DECK_ID = "Classic_Lesson_05_Carbon_and_Water_Cycle";
const DECK_PATH = path.join(PUBLIC_DECKS_DIR, DECK_ID);

console.log(`[Classic Lesson 5 Agent] Starting Gemini Notebook slide generator for Classic Lesson 5 (Carbon Cycle)...`);
console.log(`[Classic Lesson 5 Agent] Working directory for agent: ${NOTEBOOK_AGENT_DIR}`);
console.log(`[Classic Lesson 5 Agent] PPTX Output Dir: ${PPTX_OUTPUT_DIR}`);

export async function runAgent() {
  return new Promise((resolve, reject) => {
    console.log(`[Classic Lesson 5 Agent] Launching Playwright NotebookLM agent...`);
    const child = spawn("node", ["src/agent.js"], {
      cwd: NOTEBOOK_AGENT_DIR,
      env: {
        ...process.env,
        UNIT: "ecology_atmosphere_sequence",
        START_LESSON: "5",
        END_LESSON: "5",
        FORCE: "true",
      },
      stdio: "inherit",
    });

    child.on("error", (err) => {
      console.error(`[Classic Lesson 5 Agent] Child process error:`, err);
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`[Classic Lesson 5 Agent] Playwright agent completed successfully with exit code 0.`);
        resolve();
      } else {
        reject(new Error(`Agent process exited with code ${code}`));
      }
    });
  });
}

export async function ingestDeck() {
  console.log(`[Classic Lesson 5 Ingestion] Locating generated PPTX file...`);
  
  let targetFile = null;
  const file1Exists = await fs.stat(PPTX_TARGET_FILE_1).then(s => s.size > 0).catch(() => false);
  const file2Exists = await fs.stat(PPTX_TARGET_FILE_2).then(s => s.size > 0).catch(() => false);

  if (file1Exists && file2Exists) {
    const s1 = await fs.stat(PPTX_TARGET_FILE_1);
    const s2 = await fs.stat(PPTX_TARGET_FILE_2);
    targetFile = s1.mtimeMs >= s2.mtimeMs ? PPTX_TARGET_FILE_1 : PPTX_TARGET_FILE_2;
  } else if (file1Exists) {
    targetFile = PPTX_TARGET_FILE_1;
  } else if (file2Exists) {
    targetFile = PPTX_TARGET_FILE_2;
  } else {
    // Check for any freshly generated Lesson_05 pptx in output dir
    const files = await fs.readdir(PPTX_OUTPUT_DIR).catch(() => []);
    const match = files.find(f => f.startsWith("Lesson_05") && f.endsWith(".pptx"));
    if (match) {
      targetFile = path.join(PPTX_OUTPUT_DIR, match);
    } else {
      throw new Error(`No PPTX file found for Lesson 5 in ${PPTX_OUTPUT_DIR}`);
    }
  }

  const stat = await fs.stat(targetFile);
  console.log(`[Classic Lesson 5 Ingestion] Using PPTX file: ${targetFile} (${stat.size} bytes, modified: ${stat.mtime.toISOString()})`);

  // Ensure both standard filenames exist
  await fs.copyFile(targetFile, PPTX_TARGET_FILE_1).catch(() => {});
  await fs.copyFile(targetFile, PPTX_TARGET_FILE_2).catch(() => {});

  console.log(`[Classic Lesson 5 Ingestion] Extracting presentation into ${PUBLIC_DECKS_DIR} as ${DECK_ID}...`);
  const manifest = await extractPptxDeck(targetFile, PUBLIC_DECKS_DIR, DECK_ID, {
    slideSet: "ecology_atmosphere_classic",
    title: "5. Carbon Cycle",
  });
  console.log(`[Classic Lesson 5 Ingestion] Extracted ${manifest.totalSlides} slides for ${manifest.id}.`);

  return manifest;
}

export async function configureInteractivityAndMetrics() {
  console.log(`[Classic Lesson 5 Interactivity] Generating cognitive load metrics, starter grids, and question reveals...`);
  await generateSlideInteractivity(DECK_ID, PUBLIC_DECKS_DIR);

  // Read manifest to inject interactive activities if not already present
  const manifestPath = path.join(DECK_PATH, "manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

  // Ensure title reflects Carbon Cycle
  manifest.title = "5. Carbon Cycle";

  // Check if an interactive simulation slide or web embed exists
  const interactivesDir = path.join(DECK_PATH, "interactives");
  await fs.mkdir(interactivesDir, { recursive: true });

  const interactiveHtmlPath = "/decks/ecology_atmosphere_classic/Classic_Lesson_05_Carbon_and_Water_Cycle/interactives/carbon_cycle_interactive.html";
  
  // Find suitable overview or core cycle slide to attach webEmbed or interactive activity
  let embedAttached = false;
  for (const slide of manifest.slides) {
    const text = (slide.text || slide.title || "").toLowerCase();
    if (text.includes("carbon cycle") && !text.includes("starter") && !embedAttached) {
      slide.isInteractive = true;
      slide.interactiveType = "web_embed";
      slide.webEmbed = {
        url: interactiveHtmlPath,
        title: "Interactive Carbon Cycle Flow & Reservoir Simulator",
        label: "Interactive Carbon Cycle"
      };
      embedAttached = true;
      console.log(`[Classic Lesson 5 Interactivity] Attached carbon_cycle_interactive.html to Slide ${slide.number}.`);
      break;
    }
  }

  // If no match found, attach to slide 4 or slide 5
  if (!embedAttached && manifest.slides.length >= 4) {
    const targetSlide = manifest.slides.find(s => s.number === 4) || manifest.slides[3];
    targetSlide.isInteractive = true;
    targetSlide.interactiveType = "web_embed";
    targetSlide.webEmbed = {
      url: interactiveHtmlPath,
      title: "Interactive Carbon Cycle Flow & Reservoir Simulator",
      label: "Interactive Carbon Cycle"
    };
    console.log(`[Classic Lesson 5 Interactivity] Attached carbon_cycle_interactive.html to Slide ${targetSlide.number}.`);
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`[Classic Lesson 5 Interactivity] Saved updated manifest with interactive embeds.`);
}

async function main() {
  await runAgent();
  await ingestDeck();
  await configureInteractivityAndMetrics();
  console.log(`[Classic Lesson 5 Agent] All operations completed successfully!`);
}

import { fileURLToPath } from "node:url";

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  main().catch((err) => {
    console.error(`[Classic Lesson 5 Agent] Error:`, err);
    process.exit(1);
  });
}
