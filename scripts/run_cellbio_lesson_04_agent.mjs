import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";
import { generateSlideInteractivity } from "../src/gemini-segmenter.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_cellbio_sequence_v2");
const PPTX_TARGET_FILE = path.join(PPTX_OUTPUT_DIR, "Lesson_04_DNA.pptx");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/cell_biology");

console.log(`[CellBio Lesson 4 Agent] Starting Gemini Notebook slide generator for Lesson 4...`);
console.log(`[CellBio Lesson 4 Agent] Working directory for agent: ${NOTEBOOK_AGENT_DIR}`);
console.log(`[CellBio Lesson 4 Agent] Expected output PPTX: ${PPTX_TARGET_FILE}`);

async function runAgent() {
  return new Promise((resolve, reject) => {
    const child = spawn("node", ["src/agent.js"], {
      cwd: NOTEBOOK_AGENT_DIR,
      env: {
        ...process.env,
        UNIT: "cellbio_sequence",
        START_LESSON: "4",
        END_LESSON: "4",
        FORCE: "true",
      },
      stdio: "inherit",
    });

    child.on("error", (err) => {
      console.error(`[CellBio Lesson 4 Agent] Child process error:`, err);
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`[CellBio Lesson 4 Agent] Playwright agent completed successfully with exit code 0.`);
        resolve();
      } else {
        reject(new Error(`Agent process exited with code ${code}`));
      }
    });
  });
}

async function ingestDeck() {
  console.log(`[CellBio Lesson 4 Ingestion] Checking PPTX output at: ${PPTX_TARGET_FILE}`);
  const stat = await fs.stat(PPTX_TARGET_FILE);
  console.log(`[CellBio Lesson 4 Ingestion] PPTX file size: ${stat.size} bytes (modified: ${stat.mtime.toISOString()})`);

  console.log(`[CellBio Lesson 4 Ingestion] Extracting presentation into ${PUBLIC_DECKS_DIR}...`);
  const manifest = await extractPptxDeck(PPTX_TARGET_FILE, PUBLIC_DECKS_DIR, "Lesson_04_DNA", {
    slideSet: "cell_biology",
  });
  console.log(`[CellBio Lesson 4 Ingestion] Extracted ${manifest.totalSlides} slides for ${manifest.id}.`);

  console.log(`[CellBio Lesson 4 Ingestion] Generating cognitive load metrics and interactivity overlays...`);
  await generateSlideInteractivity("Lesson_04_DNA", PUBLIC_DECKS_DIR);
  console.log(`[CellBio Lesson 4 Ingestion] Deck ingestion and interactivity generation complete.`);
}

async function main() {
  await runAgent();
  await ingestDeck();
  console.log(`[CellBio Lesson 4 Agent] All operations completed successfully!`);
}

main().catch((err) => {
  console.error(`[CellBio Lesson 4 Agent] Error:`, err);
  process.exit(1);
});
