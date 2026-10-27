import { extractPptxDeck } from "../src/pptx-extractor.js";
import path from "node:path";

async function run() {
  const pptxPath = path.resolve("./output/powerpoints_andragogical_inclusion/Andragogical_Inclusion_CPD.pptx");
  const outputDir = path.resolve("./public/decks");
  console.log("Extracting PPTX:", pptxPath);
  const result = await extractPptxDeck(pptxPath, outputDir, "andragogical_inclusion", {
    title: "Andragogical Inclusion: A Professional Knowledge Exchange"
  });
  console.log("Extraction complete!");
  console.log("Deck details:", {
    title: result.title,
    slideCount: result.slides?.length
  });
}

run().catch(console.error);
