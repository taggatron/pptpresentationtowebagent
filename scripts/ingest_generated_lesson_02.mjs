import path from "node:path";
import { ingestLessonDeck } from "./generate_lesson_02_from_pdf_prompt.mjs";

const pptxTargetFile = path.resolve("../NotebookLMagent/output/powerpoints_physics_electricity_magnetism/Lesson_02_Circuits.pptx");

console.log("Starting ingestion for:", pptxTargetFile);
await ingestLessonDeck(pptxTargetFile);
console.log("✦ Ingestion complete!");
