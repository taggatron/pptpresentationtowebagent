import path from "node:path";
import fs from "node:fs/promises";
import { ingestPowerPointDeck } from "../src/powerpoint-slide-agent.js";

const ROOT_DIR = path.resolve(".");
const PPTX_PATH = path.join(ROOT_DIR, "public", "decks", "Essential Skills Training 1 - Final.pptx");
const DECKS_DIR = path.join(ROOT_DIR, "public", "decks");

async function main() {
  console.log(`[Ingest Essential Skills] Ingesting PowerPoint presentation: ${PPTX_PATH}`);
  
  const manifest = await ingestPowerPointDeck(PPTX_PATH, DECKS_DIR, {
    deckId: "Essential_Skills_Training_1",
    slideSet: "essential_skills",
    title: "Essential Skills Training 1: Starting Stronger",
    scale: 2.0,
    forcePowerPointRender: true
  });

  console.log(`[Ingest Essential Skills] Successfully ingested deck: ${manifest.id}`);
  console.log(`Total slides: ${manifest.totalSlides}`);
  console.log(`Manifest saved to: public/decks/essential_skills/Essential_Skills_Training_1/manifest.json`);
}

main().catch((err) => {
  console.error("[Ingest Essential Skills] Error:", err);
  process.exit(1);
});
