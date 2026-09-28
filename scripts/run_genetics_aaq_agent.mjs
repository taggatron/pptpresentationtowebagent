import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";
import { generateSlideInteractivity } from "../src/gemini-segmenter.js";
import { lessons, COURSE_NAME, NOTEBOOK_URL } from "../src/configs/genetics_aaq.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_aaq_genetics");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/genetics_aaq");

console.log("================================================================================");
console.log(" ✦ AAQ Human Biology Genetics Unit Agent (Unit F172)");
console.log(" Course:", COURSE_NAME);
console.log(" Endpoint:", NOTEBOOK_URL);
console.log(" Working Dir:", NOTEBOOK_AGENT_DIR);
console.log(" PPTX Output Dir:", PPTX_OUTPUT_DIR);
console.log(" Public Decks Dir:", PUBLIC_DECKS_DIR);
console.log("================================================================================");

export async function runAgent(startLesson = 1, endLesson = 8) {
  return new Promise((resolve, reject) => {
    console.log(`[Agent Runner] Spawning Playwright NotebookLM agent for Lessons ${startLesson} to ${endLesson}...`);
    const child = spawn("node", ["src/agent.js"], {
      cwd: NOTEBOOK_AGENT_DIR,
      env: {
        ...process.env,
        UNIT: "genetics_aaq",
        START_LESSON: String(startLesson),
        END_LESSON: String(endLesson),
      },
      stdio: "inherit",
    });

    child.on("error", (err) => {
      console.error("[Agent Runner] Process spawn error:", err);
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`[Agent Runner] Playwright agent completed successfully (exit code 0).`);
        resolve();
      } else {
        reject(new Error(`Agent process exited with code ${code}`));
      }
    });
  });
}

export async function ingestDecks(startLesson = 1, endLesson = 8) {
  console.log("\n[Ingestion] Ingesting generated PPTX files into web decks...");
  await fs.mkdir(PUBLIC_DECKS_DIR, { recursive: true });
  await fs.mkdir(PPTX_OUTPUT_DIR, { recursive: true });

  const files = await fs.readdir(PPTX_OUTPUT_DIR).catch(() => []);

  for (let lessonNum = startLesson; lessonNum <= endLesson; lessonNum++) {
    const lessonConfig = lessons.find((l) => l.number === lessonNum);
    if (!lessonConfig) continue;

    console.log(`\n--- Ingesting Lesson ${lessonNum}: ${lessonConfig.title} ---`);

    // Match PPTX file
    let matchingFiles = files.filter((f) => {
      if (!f.endsWith(".pptx") || f.startsWith("~$")) return false;
      const fLower = f.toLowerCase();
      const numPrefix = `lesson_${String(lessonNum).padStart(2, "0")}`;
      if (fLower.startsWith(numPrefix)) return true;

      if (lessonNum === 1) return fLower.includes("phenotypic") || fLower.includes("variation") || fLower.includes("intro");
      if (lessonNum === 2) return fLower.includes("dna") || fLower.includes("telomere") || fLower.includes("replication");
      if (lessonNum === 3) return fLower.includes("central") || fLower.includes("dogma") || fLower.includes("transcription");
      if (lessonNum === 4) return fLower.includes("expression") || fLower.includes("transcriptional") || fLower.includes("regulation");
      if (lessonNum === 5) return fLower.includes("mutation") || fLower.includes("acquired") || fLower.includes("inherited");
      if (lessonNum === 6) return fLower.includes("single") || fLower.includes("disorder") || fLower.includes("cystic") || fLower.includes("sickle");
      if (lessonNum === 7) return fLower.includes("chromosomal") || fLower.includes("abnormalit") || fLower.includes("aneuploidy") || fLower.includes("karyotyp");
      if (lessonNum === 8) return fLower.includes("polygenic") || fLower.includes("complex") || fLower.includes("traits") || fLower.includes("gwas");

      return false;
    });

    if (matchingFiles.length === 0) {
      console.warn(`[Ingestion] Warning: No PPTX found for Lesson ${lessonNum} in ${PPTX_OUTPUT_DIR}`);
      continue;
    }

    // Sort newest first
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
      slideSet: "genetics_aaq",
      title: `Lesson ${lessonConfig.number}: ${lessonConfig.title}`,
    });

    const targetDeckDir = path.join(PUBLIC_DECKS_DIR, targetDeckId);
    const manifestPath = path.join(targetDeckDir, "manifest.json");

    // Enrich manifest with curriculum metadata
    manifest.lessonNumber = lessonConfig.number;
    manifest.courseName = COURSE_NAME;
    manifest.teacher = lessonConfig.teacher || "Dan";
    manifest.title = `Lesson ${lessonConfig.number}: ${lessonConfig.title}`;
    manifest.focus = lessonConfig.focus;
    manifest.deliverable = lessonConfig.deliverable;
    manifest.objectives = lessonConfig.objectives || null;
    manifest.terminology = lessonConfig.terminology || null;
    manifest.theoryPoints = lessonConfig.theoryPoints || null;
    manifest.workedExample = lessonConfig.workedExample || null;
    manifest.hingeQuestions = lessonConfig.hingeQuestions || null;
    manifest.examQuestion = lessonConfig.examQuestion || null;
    manifest.plenary = lessonConfig.plenary || null;

    // Slide 2: Interactive 6-cell starter retrieval grid
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
      }));
    }

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
    console.log(`[Ingestion] Updated manifest for ${targetDeckId} (${manifest.slides?.length || 0} slides).`);

    // Run cognitive segmentation & question reveal generation
    try {
      await generateSlideInteractivity(targetDeckId, PUBLIC_DECKS_DIR);
      console.log(`[Ingestion] Cognitive load & interactivity metrics applied.`);
    } catch (metricErr) {
      console.warn(`[Ingestion] Note: Interactivity segmentation warning: ${metricErr.message}`);
    }
  }

  console.log("\n[Ingestion] Deck ingestion completed successfully!");
}

async function main() {
  const args = process.argv.slice(2);
  const isIngestOnly = args.includes("--ingest-only");

  let startLesson = 1;
  let endLesson = 8;

  const numericArgs = args.filter((a) => /^\d+$/.test(a)).map(Number);
  if (numericArgs.length === 1) {
    startLesson = numericArgs[0];
    endLesson = numericArgs[0];
  } else if (numericArgs.length >= 2) {
    startLesson = numericArgs[0];
    endLesson = numericArgs[1];
  }

  console.log(`[Target Range] Lessons ${startLesson} to ${endLesson}`);

  if (!isIngestOnly) {
    await runAgent(startLesson, endLesson);
  }

  await ingestDecks(startLesson, endLesson);
}

if (process.argv[1] && process.argv[1].endsWith("run_genetics_aaq_agent.mjs")) {
  main().catch((err) => {
    console.error("[Fatal Error]:", err);
    process.exit(1);
  });
}
