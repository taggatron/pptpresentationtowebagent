import crypto from "node:crypto";
import fs from "node:fs/promises";
import { createWriteStream, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import yauzl from "yauzl";
import { analyzeSlideCognitiveLoad } from "./cognitive-model.js";
import { planSlideAnimation } from "./slide-animation-planner.js";
import { getCurrentStarterGrid } from "./current-slide-catalog.js";
import { getCurrentQuestionReveal } from "./current-question-catalog.js";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PDF2PNG_BIN = path.join(ROOT_DIR, "src", "tools", "pdf2png");

const PPT_CONTAINER_DATA = path.join(
  os.homedir(),
  "Library",
  "Containers",
  "com.microsoft.Powerpoint",
  "Data"
);

/**
 * Checks if Microsoft PowerPoint is installed on macOS and available for scripting.
 */
export async function isPowerPointAvailable() {
  if (process.platform !== "darwin") return false;
  const appPath = "/Applications/Microsoft PowerPoint.app";
  if (!existsSync(appPath)) return false;

  try {
    const { stdout } = await execFileAsync("osascript", [
      "-e",
      'tell application "Microsoft PowerPoint" to get version'
    ], { timeout: 4000 });
    return Boolean(stdout.trim());
  } catch {
    return false;
  }
}

/**
 * Sanitizes deck filename into a clean, URL-safe deck ID.
 */
export function sanitizeDeckId(filenameOrPath) {
  const base = path.basename(filenameOrPath, path.extname(filenameOrPath));
  return base
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "") || "powerpoint_deck";
}

/**
 * Parses OpenXML presentation structure: slide count, text contents,
 * relationships, and native p:timing animation nodes.
 */
export async function parseOpenXmlPresentation(pptxPath) {
  const entries = new Map();

  await new Promise((resolve, reject) => {
    yauzl.open(pptxPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        entries.set(entry.fileName, entry);
        zipfile.readEntry();
      });
      zipfile.on("end", resolve);
      zipfile.on("error", reject);
    });
  });

  // Collect slide numbers
  const slideNumbers = [];
  for (const [name] of entries) {
    const match = name.match(/^ppt\/slides\/slide(\d+)\.xml$/);
    if (match) {
      slideNumbers.push(parseInt(match[1], 10));
    }
  }
  slideNumbers.sort((a, b) => a - b);

  // Extract metadata / presentation title
  let presentationTitle = "";
  if (entries.has("docProps/core.xml")) {
    try {
      const coreXml = await readZipEntryToString(pptxPath, entries.get("docProps/core.xml"));
      const titleMatch = coreXml.match(/<dc:title\b[^>]*>([\s\S]*?)<\/dc:title>/i);
      if (titleMatch && titleMatch[1].trim()) {
        presentationTitle = titleMatch[1].trim();
      }
    } catch {
      // Ignore core.xml parse failure
    }
  }

  const slidesData = [];

  for (const slideNum of slideNumbers) {
    const slideXmlPath = `ppt/slides/slide${slideNum}.xml`;
    const relsXmlPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`;
    let slideXml = "";
    let relsXml = "";

    if (entries.has(slideXmlPath)) {
      slideXml = await readZipEntryToString(pptxPath, entries.get(slideXmlPath));
    }
    if (entries.has(relsXmlPath)) {
      relsXml = await readZipEntryToString(pptxPath, entries.get(relsXmlPath));
    }

    // 1. Text extraction & title detection
    const textRuns = [];
    const textMatches = slideXml.match(/<a:t\b[^>]*>([\s\S]*?)<\/a:t>/gi) || [];
    for (const tag of textMatches) {
      const content = tag.replace(/<[^>]+>/g, "").trim();
      if (content) textRuns.push(content);
    }

    const title = textRuns.length > 0 ? textRuns[0].slice(0, 120) : `Slide ${slideNum}`;

    // 2. Embedded full-slide image detection
    let embeddedMediaTarget = null;
    if (relsXml) {
      const relationshipTags = relsXml.match(/<Relationship\b[^>]*>/g) || [];
      const imageRel = relationshipTags.find((tag) => {
        const type = tag.match(/\bType="([^"]+)"/)?.[1] || "";
        const target = tag.match(/\bTarget="([^"]+)"/)?.[1] || "";
        return (
          type.endsWith("/image") &&
          /^\.\.\/media\//.test(target) &&
          /\.(?:png|jpe?g|gif|bmp|tiff?|webp)$/i.test(target)
        );
      });
      const targetRel = imageRel?.match(/\bTarget="\.\.\/media\/([^"]+)"/)?.[1];
      if (targetRel && entries.has(`ppt/media/${targetRel}`)) {
        embeddedMediaTarget = `ppt/media/${targetRel}`;
      }
    }

    // 3. Animation extraction from OpenXML p:timing
    const animationInfo = parseSlideTimingXml(slideXml);

    slidesData.push({
      number: slideNum,
      title,
      textRuns,
      textContent: textRuns.join(" "),
      embeddedMediaTarget,
      animationInfo
    });
  }

  return {
    title: presentationTitle || path.basename(pptxPath, path.extname(pptxPath)).replace(/_/g, " "),
    totalSlides: slidesData.length,
    slides: slidesData
  };
}

/**
 * Parses <p:timing> block inside a slide's OpenXML to identify
 * sequential click effects, animation effects, and targeted shape IDs.
 */
function parseSlideTimingXml(slideXml) {
  const timingMatch = slideXml.match(/<p:timing[\s\S]*?<\/p:timing>/);
  if (!timingMatch) {
    return {
      hasAnimations: false,
      clickCount: 0,
      buildSteps: [],
      effects: []
    };
  }

  const timingXml = timingMatch[0];
  const effects = [];
  const buildSteps = [];

  // Match condition time nodes with clickEffect
  const clickNodes = timingXml.match(/<p:cTn\b[^>]*\bnodeType="clickEffect"[\s\S]*?<\/p:cTn>/gi) || [];
  
  // Also look for seq nodes
  const seqNodes = timingXml.match(/<p:seq\b[^>]*>[\s\S]*?<\/p:seq>/gi) || [];

  // Extract targeted shape IDs
  const shapeTargetMatches = timingXml.match(/<p:spTgt\b[^>]*\bspid="([^"]+)"/gi) || [];
  const targetShapeIds = shapeTargetMatches.map((m) => {
    const match = m.match(/\bspid="([^"]+)"/i);
    return match ? match[1] : null;
  }).filter(Boolean);

  // Extract animation effect types
  const animEffectMatches = timingXml.match(/<p:animEffect\b[^>]*\bfilter="([^"]+)"/gi) || [];
  for (const match of animEffectMatches) {
    const filter = match.match(/\bfilter="([^"]+)"/i)?.[1];
    if (filter) effects.push(filter);
  }

  const clickCount = Math.max(clickNodes.length, seqNodes.length > 0 ? clickNodes.length || 1 : 0);

  for (let i = 0; i < clickCount; i++) {
    buildSteps.push({
      step: i + 1,
      targetShapeId: targetShapeIds[i] || null,
      effect: effects[i] || "appear"
    });
  }

  return {
    hasAnimations: clickCount > 0,
    clickCount,
    buildSteps,
    effects,
    targetShapeIds
  };
}

/**
 * Renders slides using Microsoft PowerPoint on macOS via its sandboxed container.
 * Exports whole presentation to high-resolution PDF, then uses compiled pdf2png tool.
 */
export async function renderSlidesWithPowerPoint(pptxPath, slidesDir, { scale = 2.0 } = {}) {
  await fs.mkdir(slidesDir, { recursive: true });
  await fs.mkdir(PPT_CONTAINER_DATA, { recursive: true });

  const sessionHash = crypto.randomBytes(6).toString("hex");
  const tempPptxName = `agent_input_${sessionHash}.pptx`;
  const tempPdfName = `agent_output_${sessionHash}.pdf`;
  const containerPptxPath = path.join(PPT_CONTAINER_DATA, tempPptxName);
  const containerPdfPath = path.join(PPT_CONTAINER_DATA, tempPdfName);

  // Copy presentation to PowerPoint container
  await fs.copyFile(pptxPath, containerPptxPath);

  // Strip macOS quarantine attribute to prevent modal alert
  try {
    await execFileAsync("xattr", ["-c", containerPptxPath], { timeout: 3000 });
  } catch {
    // Ignore if no attributes
  }

  let printSteps = [];
  let slideCount = 0;

  try {
    const appleScript = `
set targetPath to "${containerPptxPath}"
set pdfPath to "${containerPdfPath}"
tell application "Microsoft PowerPoint"
    open (POSIX file targetPath)
    set thePres to active presentation
    set sCount to count of slides of thePres
    set psList to {}
    try
        set psList to print steps of every slide of thePres
    end try
    save thePres in (POSIX file pdfPath) as save as PDF
    close thePres saving no
    return {sCount, psList}
end tell
`;

    const { stdout } = await execFileAsync("osascript", ["-e", appleScript], {
      timeout: 30000
    });

    const parts = stdout.trim().split(",").map((s) => s.trim());
    if (parts.length > 0) {
      slideCount = parseInt(parts[0], 10) || 0;
      if (parts.length > 1) {
        printSteps = parts.slice(1).map((val) => parseInt(val, 10) || 1);
      }
    }

    // Ensure PDF was created
    const pdfStat = await fs.stat(containerPdfPath);
    if (!pdfStat.isFile() || pdfStat.size === 0) {
      throw new Error("PowerPoint exported an empty or missing PDF.");
    }

    // Rasterize PDF pages to 2x Retina PNGs using native pdf2png
    if (!existsSync(PDF2PNG_BIN)) {
      // Auto-compile if not yet built
      await compilePdf2Png();
    }

    await execFileAsync(PDF2PNG_BIN, [
      containerPdfPath,
      slidesDir,
      String(scale)
    ], { timeout: 60000 });

  } finally {
    // Clean up temporary container files
    await fs.unlink(containerPptxPath).catch(() => {});
    await fs.unlink(containerPdfPath).catch(() => {});
  }

  // Verify slide images
  const files = await fs.readdir(slidesDir);
  const slideImages = files
    .filter((f) => /^slide_\d+\.png$/i.test(f))
    .sort();

  return {
    success: slideImages.length > 0,
    slideCount: slideImages.length || slideCount,
    printSteps,
    slideImages
  };
}

/**
 * Compiles the native pdf2png utility if not present.
 */
export async function compilePdf2Png() {
  const sourcePath = path.join(ROOT_DIR, "src", "tools", "pdf2png.m");
  const binDir = path.dirname(PDF2PNG_BIN);
  await fs.mkdir(binDir, { recursive: true });

  await execFileAsync("clang", [
    "-O3",
    "-framework", "Foundation",
    "-framework", "PDFKit",
    "-framework", "AppKit",
    sourcePath,
    "-o", PDF2PNG_BIN
  ], { timeout: 15000 });

  await fs.chmod(PDF2PNG_BIN, 0o755);
}

/**
 * Reads a specific entry from a ZIP archive into a UTF-8 string.
 */
function readZipEntryToString(zipPath, entry) {
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      zipfile.openReadStream(entry, (err, readStream) => {
        if (err) return reject(err);
        let data = "";
        readStream.on("data", (chunk) => { data += chunk.toString("utf8"); });
        readStream.on("end", () => resolve(data));
        readStream.on("error", reject);
      });
    });
  });
}

/**
 * Extracts a specific entry from a ZIP archive into a destination file.
 */
function extractZipEntryToFile(zipPath, entry, targetFilePath) {
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      zipfile.openReadStream(entry, (err, readStream) => {
        if (err) return reject(err);
        const writeStream = createWriteStream(targetFilePath);
        readStream.pipe(writeStream);
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
    });
  });
}

/**
 * Main agent entrypoint: Ingests any PowerPoint (.pptx) presentation,
 * extracts high-resolution slide images, extracts and constructs slide animations,
 * models cognitive complexity, and creates a fully interactive web presentation deck.
 */
export async function ingestPowerPointDeck(pptxPath, outputBaseDir, options = {}) {
  const resolvedPptx = path.resolve(pptxPath);
  const stat = await fs.stat(resolvedPptx);
  if (!stat.isFile()) {
    throw new Error(`Invalid PowerPoint presentation file: ${resolvedPptx}`);
  }

  const deckId = options.deckId || sanitizeDeckId(resolvedPptx);
  const targetDir = path.join(outputBaseDir, deckId);
  const slidesDir = path.join(targetDir, "slides");
  await fs.mkdir(slidesDir, { recursive: true });

  console.log(`[PowerPoint Agent] Starting ingestion for: ${deckId}`);

  // 1. Parse OpenXML structure, text, and native animations
  const xmlData = await parseOpenXmlPresentation(resolvedPptx);
  console.log(`[PowerPoint Agent] OpenXML detected ${xmlData.totalSlides} slides in ${deckId}`);

  // 2. Check if all slides have embedded whole-slide images
  const allHaveEmbeddedImages =
    xmlData.slides.length > 0 &&
    xmlData.slides.every((s) => s.embeddedMediaTarget);

  let slideImages = [];
  let printSteps = [];

  if (allHaveEmbeddedImages && options.forcePowerPointRender !== true) {
    console.log(`[PowerPoint Agent] Found pre-rendered whole-slide media inside archive.`);
    // Extract embedded images directly from zip
    const zipEntries = new Map();
    await new Promise((resolve, reject) => {
      yauzl.open(resolvedPptx, { lazyEntries: true }, (err, zipfile) => {
        if (err) return reject(err);
        zipfile.readEntry();
        zipfile.on("entry", (e) => { zipEntries.set(e.fileName, e); zipfile.readEntry(); });
        zipfile.on("end", resolve);
        zipfile.on("error", reject);
      });
    });

    for (const slide of xmlData.slides) {
      const ext = path.extname(slide.embeddedMediaTarget) || ".png";
      const outSlideFileName = `slide_${String(slide.number).padStart(2, "0")}${ext}`;
      const outSlidePath = path.join(slidesDir, outSlideFileName);
      await extractZipEntryToFile(resolvedPptx, zipEntries.get(slide.embeddedMediaTarget), outSlidePath);
      slideImages.push(outSlideFileName);
    }
  } else {
    // Use Microsoft PowerPoint native high-resolution render bridge
    const pptAvailable = await isPowerPointAvailable();
    if (!pptAvailable) {
      throw new Error(
        "Microsoft PowerPoint is not available on this system to render vector shapes/text."
      );
    }

    console.log(`[PowerPoint Agent] Rendering vector slide pages via PowerPoint & PDFKit...`);
    const renderResult = await renderSlidesWithPowerPoint(resolvedPptx, slidesDir, {
      scale: options.scale || 2.0
    });

    slideImages = renderResult.slideImages;
    printSteps = renderResult.printSteps;
    console.log(`[PowerPoint Agent] Successfully rendered ${slideImages.length} slide images.`);
  }

  // 3. Load or initialize manifest
  const manifestPath = path.join(targetDir, "manifest.json");
  let previousManifest = null;
  try {
    previousManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch {
    // New deck manifest
  }

  const slides = [];

  for (let i = 0; i < xmlData.slides.length; i++) {
    const slideMeta = xmlData.slides[i];
    const slideNum = slideMeta.number;
    const imageFileName = slideImages[i] || `slide_${String(slideNum).padStart(2, "0")}.png`;
    const imageUrl = `/decks/${deckId}/slides/${imageFileName}`;
    const nativeSteps = printSteps[i] || (slideMeta.animationInfo?.hasAnimations ? slideMeta.animationInfo.clickCount + 1 : 1);

    const baseSlide = {
      number: slideNum,
      title: slideMeta.title || `Slide ${slideNum}`,
      imageFileName,
      imageUrl,
      deckId,
      deckTitle: xmlData.title,
      lessonTitle: xmlData.title,
      textContent: slideMeta.textContent,
      notes: "",
      isInteractive: false,
      interactiveType: null,
      powerPointAnimation: {
        hasNativeAnimations: slideMeta.animationInfo?.hasAnimations || nativeSteps > 1,
        nativeBuildSteps: nativeSteps,
        clickCount: slideMeta.animationInfo?.clickCount || (nativeSteps > 1 ? nativeSteps - 1 : 0),
        effects: slideMeta.animationInfo?.effects || []
      }
    };

    // Check for reviewed starter grid or question reveals
    const sourceDeckId = sanitizeDeckId(resolvedPptx);
    const reviewedStarter = slideNum === 2 ? (getCurrentStarterGrid(deckId) || getCurrentStarterGrid(sourceDeckId)) : null;
    const reviewedQuestion = reviewedStarter ? null : (getCurrentQuestionReveal(deckId, slideNum) || getCurrentQuestionReveal(sourceDeckId, slideNum));

    if (reviewedStarter) {
      baseSlide.gridTitle = reviewedStarter.title;
      baseSlide.title = reviewedStarter.title || baseSlide.title;
      baseSlide.isInteractive = true;
      baseSlide.interactiveType = "starter_qa_grid";
      baseSlide.interactiveCells = reviewedStarter.cells;
    } else if (reviewedQuestion) {
      baseSlide.title = reviewedQuestion.title || baseSlide.title;
      baseSlide.isInteractive = true;
      baseSlide.interactiveType = "question_reveal";
      baseSlide.interactiveCells = reviewedQuestion.cells;
    }

    // Build progressive animation steps for slides with native animations or builds
    if (nativeSteps > 1 && !baseSlide.progressiveBuilds) {
      const buildCount = nativeSteps;
      const progressiveBuilds = [];
      const serialSteps = [];

      for (let s = 1; s <= buildCount; s++) {
        const buildId = `${deckId}_slide_${slideNum}_build_${s}`;
        const buildLabel =
          s === 1
            ? "Stage 1: Initial presentation state"
            : `Stage ${s}: Reveal sequential animation element ${s - 1}`;

        progressiveBuilds.push({
          id: buildId,
          version: s,
          kind: "image",
          mediaType: "image",
          label: buildLabel,
          imageUrl: imageUrl, // Base slide image
          transition: "crossfade",
          qaStatus: "approved",
          source: "powerpoint-native-animation"
        });

        serialSteps.push({
          step: s,
          buildId,
          title: buildLabel,
          componentIds: [buildId],
          targetBounds: { x: 0, y: 0, w: 100, h: 100 },
          revealType: "crossfade"
        });
      }

      baseSlide.progressiveBuilds = progressiveBuilds;
      baseSlide.hasProgressiveBuilds = true;
      baseSlide.serialAnimation = {
        totalBuildSteps: buildCount,
        autoAdvanceDelayMs: 3200,
        serialSteps
      };
    }

    // Apply cognitive load analysis & animation planning
    const withAnimationPlan = planSlideAnimation(baseSlide);
    const cognitiveAnalysis = analyzeSlideCognitiveLoad(withAnimationPlan);
    withAnimationPlan.cognitiveAnalysis = cognitiveAnalysis;

    // Merge with any preserved prior user edits
    const prevSlide = previousManifest?.slides?.find((s) => s.number === slideNum);
    slides.push(
      prevSlide
        ? {
            ...prevSlide,
            ...withAnimationPlan,
            title: prevSlide.title || withAnimationPlan.title
          }
        : withAnimationPlan
    );
  }

  const manifest = {
    ...(previousManifest || {}),
    id: deckId,
    title: previousManifest?.title || xmlData.title,
    filename: path.basename(resolvedPptx),
    totalSlides: slides.length,
    agent: {
      provider: "PowerPoint-to-Slide Agent",
      generatedAt: new Date().toISOString(),
      nativeAnimationsExtracted: slides.some((s) => s.powerPointAnimation?.hasNativeAnimations),
      highResScale: options.scale || 2.0
    },
    slides
  };

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log(
    `[PowerPoint Agent] Ingestion complete for ${deckId}: ${slides.length} slides, ${
      slides.filter((s) => s.hasProgressiveBuilds).length
    } animated slides.`
  );

  return manifest;
}
