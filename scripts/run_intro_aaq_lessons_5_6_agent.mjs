import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";
import { lessons } from "../src/configs/intro_aaq_human_bio.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_aaq_human_bio");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/intro_aaq_human_bio");

console.log("================================================================================");
console.log(" [Intro AAQ Human Bio Agent] Launching Gemini Notebook Slide Creation Flow");
console.log(" Lessons: 5 & 6 (F172 Genetics Mini Mock NEA Integration)");
console.log(" Working Dir:", NOTEBOOK_AGENT_DIR);
console.log(" Output Dir:", PPTX_OUTPUT_DIR);
console.log(" Public Decks Dir:", PUBLIC_DECKS_DIR);
console.log("================================================================================");

export async function runAgent() {
  return new Promise((resolve, reject) => {
    console.log("[Agent Runner] Spawning Playwright agent for Lessons 5 to 6...");
    const child = spawn("node", ["src/agent.js"], {
      cwd: NOTEBOOK_AGENT_DIR,
      env: {
        ...process.env,
        UNIT: "intro_aaq_human_bio",
        START_LESSON: "5",
        END_LESSON: "6",
        FORCE: "true",
      },
      stdio: "inherit",
    });

    child.on("error", (err) => {
      console.error("[Agent Runner] Process spawn error:", err);
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log("[Agent Runner] Agent completed successfully (exit code 0).");
        resolve();
      } else {
        reject(new Error(`Agent process exited with code ${code}`));
      }
    });
  });
}

export async function ingestDecks() {
  console.log("\n[Ingestion] Ingesting generated PPTX files into web decks...");
  const files = await fs.readdir(PPTX_OUTPUT_DIR);

  for (const lessonNum of [5, 6]) {
    const lessonConfig = lessons.find((l) => l.number === lessonNum);
    if (!lessonConfig) continue;

    console.log(`\n--- Ingesting Lesson ${lessonNum}: ${lessonConfig.title} ---`);

    // Find newest matching PPTX
    let matchingFiles = files.filter((f) => {
      if (!f.endsWith(".pptx") || f.startsWith("~$")) return false;
      const fLower = f.toLowerCase();
      if (lessonNum === 5) {
        return fLower.includes("lesson_05") || fLower.includes("source_reliability") || fLower.includes("referencing");
      }
      if (lessonNum === 6) {
        return fLower.includes("lesson_06") || fLower.includes("mrna") || fLower.includes("f172") || fLower.includes("genetics") || fLower.includes("mock_nea");
      }
      return false;
    });

    if (matchingFiles.length === 0) {
      console.warn(`[Ingestion] Warning: No PPTX found matching Lesson ${lessonNum} in ${PPTX_OUTPUT_DIR}`);
      continue;
    }

    // Sort by mtime descending
    const filesWithStats = await Promise.all(
      matchingFiles.map(async (name) => {
        const full = path.join(PPTX_OUTPUT_DIR, name);
        const stat = await fs.stat(full);
        return { name, full, mtime: stat.mtimeMs, size: stat.size };
      })
    );
    filesWithStats.sort((a, b) => b.mtime - a.mtime);
    const targetFile = filesWithStats[0].full;
    console.log(`[Ingestion] Using PPTX: ${path.basename(targetFile)} (${filesWithStats[0].size} bytes)`);

    const targetDeckId = lessonConfig.deckId;
    const manifest = await extractPptxDeck(targetFile, PUBLIC_DECKS_DIR, targetDeckId, {
      slideSet: "intro_aaq_human_bio",
      title: lessonConfig.title,
    });

    const targetDeckDir = path.join(PUBLIC_DECKS_DIR, targetDeckId);
    const manifestPath = path.join(targetDeckDir, "manifest.json");

    // Enrich manifest
    manifest.lessonNumber = lessonConfig.number;
    manifest.courseName = "OCR Level 3 Cambridge Advanced National (AAQ) in Human Biology";
    manifest.teacher = lessonConfig.teacher || "Dan";
    manifest.title = lessonConfig.title;
    manifest.focus = lessonConfig.focus;
    manifest.deliverable = lessonConfig.deliverable;
    manifest.objectives = lessonConfig.objectives || null;
    manifest.terminology = lessonConfig.terminology || null;
    manifest.theoryPoints = lessonConfig.theoryPoints || null;
    manifest.workedExample = lessonConfig.workedExample || null;
    manifest.hingeQuestions = lessonConfig.hingeQuestions || null;
    manifest.examQuestion = lessonConfig.examQuestion || null;
    manifest.plenary = lessonConfig.plenary || null;

    // Slide 2: Interactive 6-cell starter grid
    if (manifest.slides && manifest.slides.length >= 2 && lessonConfig.starterQuestions?.length > 0) {
      manifest.slides[1].isInteractive = true;
      manifest.slides[1].interactiveType = "six_cell_grid";
      manifest.slides[1].title = `Starter Activity: 6-Cell Knowledge Retrieval`;
      manifest.slides[1].starterQuestions = lessonConfig.starterQuestions;

      const cellBounds = [
        { row: 0, col: 0, bounds: { x: 6.8, y: 30.5, w: 41.5, h: 22.0 } },
        { row: 0, col: 1, bounds: { x: 51.5, y: 30.5, w: 41.5, h: 22.0 } },
        { row: 1, col: 0, bounds: { x: 6.8, y: 55.0, w: 41.5, h: 22.0 } },
        { row: 1, col: 1, bounds: { x: 51.5, y: 55.0, w: 41.5, h: 22.0 } },
        { row: 2, col: 0, bounds: { x: 6.8, y: 78.5, w: 41.5, h: 18.5 } },
        { row: 2, col: 1, bounds: { x: 51.5, y: 78.5, w: 41.5, h: 18.5 } },
      ];

      manifest.slides[1].interactiveCells = lessonConfig.starterQuestions.slice(0, 6).map((qObj, idx) => ({
        id: `cell_${idx + 1}`,
        row: cellBounds[idx].row,
        col: cellBounds[idx].col,
        bounds: cellBounds[idx].bounds,
        question: qObj.q,
        expectedAnswer: qObj.a,
        answer: qObj.a,
        overlayAnswer: true,
        revealMode: "overlay",
        confidence: 1,
      }));
      manifest.slides[1].cells = manifest.slides[1].interactiveCells;
      console.log(`[Ingestion] Configured 6-cell starter grid on Slide 2 of Lesson ${lessonNum}.`);
    }

    // Special handling for Lesson 5: Attach RefMaster Referencing Game interactive
    if (lessonNum === 5 && manifest.slides && manifest.slides.length >= 8) {
      const targetSlideIndex = manifest.slides.length >= 9 ? 8 : manifest.slides.length - 2;
      const targetSlide = manifest.slides[targetSlideIndex];
      targetSlide.isInteractive = true;
      targetSlide.interactiveType = "web_embed";
      targetSlide.title = "Interactive Referencing Lab: RefMaster Academic Challenge";
      targetSlide.webEmbed = {
        url: "https://taggatron.github.io/Referencinggame/",
        title: "RefMaster Harvard Referencing Interactive Game",
        label: "Interactive Referencing Challenge",
        instructions: "Complete the interactive Harvard referencing challenges. Master in-text citation conventions and reference list construction.",
      };
      console.log(`[Ingestion] Embedded RefMaster game onto Slide ${targetSlide.number} of Lesson 5.`);
    }

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
    console.log(`[Ingestion] Saved updated manifest for ${targetDeckId} (${manifest.slides?.length || 0} slides).`);
  }
}

async function main() {
  await runAgent();
  await ingestDecks();
  console.log("\n================================================================================");
  console.log(" [Intro AAQ Human Bio Agent] All operations completed successfully!");
  console.log("================================================================================\n");
}

main().catch((err) => {
  console.error("\n[Intro AAQ Human Bio Agent] Fatal error:", err);
  process.exit(1);
});
