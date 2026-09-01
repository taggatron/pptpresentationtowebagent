import { execFile } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { generateSlideInteractivity } from "./gemini-segmenter.js";

const execFileAsync = promisify(execFile);
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DECKS_DIR = path.resolve(moduleDir, "..", "public", "decks");

function cleanOcrText(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(
      (line) =>
        line &&
        !/^['`\s]*(?:A\\|AY|A\||\\A)?\s*NotebookL[MV]/i.test(line) &&
        !/^Gemini is AI/i.test(line) &&
        !/^Describe your image/i.test(line)
    )
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractQuestionPrompts(text) {
  const compact = String(text || "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  const matches = compact.match(
    /(?:Question\s*\d+\s*[:.)-]?\s*)?(?:What|Why|How|Which|Where|When|Who|Is|Are|Name|State|Identify|Explain|Describe|Calculate|Predict|Suggest|Write|Complete|Compare|Evaluate)\b[^?]{3,240}\?/gi
  );
  return [...new Set((matches || []).map((question) => question.trim()))].slice(0, 12);
}

function inferRole(slide, text) {
  const lower = text.toLowerCase();
  if (slide.number === 1 || lower.split(/\s+/).length < 14) return "title";
  if (/(?:knowledge check|checkpoint|retrieval|starter|practice|exit ticket|question)/.test(lower)) {
    return "learner-question";
  }
  if (/(?:learning objectives|today.s blueprint|objectives & key)/.test(lower)) return "objectives";
  if (/(?:worked example|calculate|calculation|formula|equation)/.test(lower)) return "worked-example";
  if (/(?:table|matrix|graph|chart)/.test(lower)) return "data";
  if (/(?:process|pathway|timeline|procedure|method)/.test(lower)) return "process";
  return "instructional-content";
}

async function analyzeSlideImage(imagePath) {
  const imageBuffer = await fs.readFile(imagePath);
  const sourceHash = crypto.createHash("sha256").update(imageBuffer).digest("hex");
  const { stdout } = await execFileAsync(
    "tesseract",
    [imagePath, "stdout", "--psm", "6"],
    { maxBuffer: 8 * 1024 * 1024 }
  );
  const transcript = cleanOcrText(stdout);
  const questions = extractQuestionPrompts(transcript);
  return { sourceHash, transcript, questions };
}

async function mapWithConcurrency(items, limit, mapper) {
  const output = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      output[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return output;
}

export async function enrichCurrentDecks({ decksDir = DEFAULT_DECKS_DIR, concurrency = 6 } = {}) {
  const entries = await fs.readdir(decksDir, { withFileTypes: true });
  const deckIds = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const jobs = [];
  const manifests = new Map();

  for (const deckId of deckIds) {
    const manifestPath = path.join(decksDir, deckId, "manifest.json");
    let manifest;
    try {
      manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    } catch {
      continue;
    }
    manifests.set(deckId, { manifest, manifestPath });
    for (const slide of manifest.slides || []) {
      jobs.push({
        deckId,
        slide,
        imagePath: path.join(decksDir, deckId, "slides", slide.imageFileName)
      });
    }
  }

  await mapWithConcurrency(jobs, concurrency, async ({ deckId, slide, imagePath }) => {
    try {
      const analysis = await analyzeSlideImage(imagePath);
      const existingSource = slide.contentAnalysis?.source;
      const keepGeminiAnalysis =
        typeof existingSource === "string" &&
        existingSource.startsWith("gemini") &&
        slide.contentAnalysis?.sourceHash === analysis.sourceHash;

      if (!keepGeminiAnalysis) {
        slide.text = analysis.transcript;
        slide.contentAnalysis = {
          ...(slide.contentAnalysis || {}),
          schemaVersion: 1,
          status: "ready",
          source: "local-ocr-fallback",
          sourceHash: analysis.sourceHash,
          transcript: analysis.transcript,
          role: inferRole(slide, analysis.transcript),
          questions: analysis.questions.map((question, index) => ({
            id: `ocr_question_${index + 1}`,
            question,
            confidence: "candidate",
            status: "needs-gemini-bounds-or-review"
          })),
          questionCount: analysis.questions.length
        };
      }
    } catch (error) {
      slide.contentAnalysis = {
        ...(slide.contentAnalysis || {}),
        schemaVersion: 1,
        status: "unavailable",
        source: "local-ocr-fallback",
        error: error.code === "ENOENT" ? "Tesseract is not installed." : error.message
      };
      console.warn(`[Current Deck Enricher] ${deckId} slide ${slide.number}: ${error.message}`);
    }
  });

  for (const [deckId, { manifest, manifestPath }] of manifests) {
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    await generateSlideInteractivity(deckId, decksDir);
  }

  return {
    deckCount: manifests.size,
    slideCount: jobs.length,
    decks: [...manifests.keys()]
  };
}

async function runCli() {
  const summary = await enrichCurrentDecks();
  console.log(
    `[Current Deck Enricher] Analysed ${summary.slideCount} slides across ${summary.deckCount} decks.`
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error("[Current Deck Enricher] Failed:", error);
    process.exitCode = 1;
  });
}
