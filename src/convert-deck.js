import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "./pptx-extractor.js";
import { generateSlideInteractivity } from "./gemini-segmenter.js";

const DEFAULT_INPUT_DIR = "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/NotebookLMagent/output/powerpoints_cellbio_sequence_v2";
const DEFAULT_PPTX = path.join(DEFAULT_INPUT_DIR, "Lesson_01_CELL_STRUCTURE.pptx");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks");

async function main() {
  const targetPath = process.argv[2] || DEFAULT_PPTX;
  console.log(`[Convert Agent] Target path: ${targetPath}`);

  await fs.mkdir(PUBLIC_DECKS_DIR, { recursive: true });

  const stat = await fs.stat(targetPath);

  if (stat.isDirectory()) {
    const files = await fs.readdir(targetPath);
    const pptxFiles = files.filter((f) => f.endsWith(".pptx"));
    console.log(`[Convert Agent] Found ${pptxFiles.length} PPTX files in directory.`);
    for (const file of pptxFiles) {
      const fullPath = path.join(targetPath, file);
      await processSinglePptx(fullPath);
    }
  } else if (stat.isFile() && targetPath.endsWith(".pptx")) {
    await processSinglePptx(targetPath);
  } else {
    console.error(`[Convert Agent] Invalid PPTX path: ${targetPath}`);
    process.exit(1);
  }
}

async function processSinglePptx(pptxPath) {
  console.log(`[Convert Agent] Processing: ${pptxPath}`);
  const manifest = await extractPptxDeck(pptxPath, PUBLIC_DECKS_DIR);
  await generateSlideInteractivity(manifest.id, PUBLIC_DECKS_DIR);
  console.log(`[Convert Agent] Finished conversion for: ${manifest.id}`);
}

main().catch((err) => {
  console.error("[Convert Agent] Error converting deck:", err);
  process.exit(1);
});
