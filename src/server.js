import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractPptxDeck } from "./pptx-extractor.js";
import { generateSlideInteractivity } from "./gemini-segmenter.js";
import { editSlideComponentViaGemini } from "./gemini-editor.js";
import { generateGeminiSlideImage } from "./gemini-image-gen.js";
import {
  validateGeneratedSlideImage,
  validateVisualQaChecklist
} from "./image-build-qa.js";
import { triggerNotebookLMRevision } from "./notebooklm-revisor.js";
import {
  hasProtectedVideoMedia,
  isVideoMedia,
  normalizeMediaBuilds,
  removeGeneratedImageBuildsPreservingVideo,
  syncQaApprovedGeminiSequence
} from "./slide-animation-planner.js";
import {
  AGENT_PATHWAYS,
  AGENT_PATHWAY_OPTIONS,
  DEFAULT_AGENT_PATHWAY,
  normalizeAgentPathway
} from "./agent-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DECKS_DIR = path.join(PUBLIC_DIR, "decks");

function assertSafeDeckId(deckId) {
  if (!/^[A-Za-z0-9_.-]+$/.test(deckId)) {
    const error = new Error("Invalid deck id.");
    error.statusCode = 400;
    throw error;
  }
  return deckId;
}

function clampPercent(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function roundPercent(value) {
  return Math.round(value * 10) / 10;
}

export function normalizeEditTarget(editTarget, componentId = "slide") {
  if (!editTarget || typeof editTarget !== "object") {
    return {
      type: componentId && componentId !== "slide" ? "component" : "slide",
      id: String(componentId || "slide").slice(0, 120),
      label: componentId && componentId !== "slide" ? String(componentId) : "Whole slide",
      bounds: { x: 0, y: 0, w: 100, h: 100 },
      point: { x: 50, y: 50 }
    };
  }

  const requestedType = String(editTarget.type || "");
  const type = ["slide", "component", "region"].includes(requestedType)
    ? requestedType
    : "region";
  if (type === "slide") {
    return {
      type: "slide",
      id: "slide",
      label: String(editTarget.label || "Whole slide").slice(0, 240),
      bounds: { x: 0, y: 0, w: 100, h: 100 },
      point: { x: 50, y: 50 }
    };
  }

  const rawBounds = editTarget.bounds || {};
  const xValue = Number(rawBounds.x);
  const yValue = Number(rawBounds.y);
  const wValue = Number(rawBounds.w);
  const hValue = Number(rawBounds.h);
  const x = roundPercent(clampPercent(Number.isFinite(xValue) ? xValue : 0, 0, 99));
  const y = roundPercent(clampPercent(Number.isFinite(yValue) ? yValue : 0, 0, 99));
  const w = roundPercent(
    clampPercent(Number.isFinite(wValue) ? wValue : 100 - x, 1, 100 - x)
  );
  const h = roundPercent(
    clampPercent(Number.isFinite(hValue) ? hValue : 100 - y, 1, 100 - y)
  );
  const pointX = Number(editTarget.point?.x);
  const pointY = Number(editTarget.point?.y);

  return {
    type,
    id: String(editTarget.id || componentId || type).slice(0, 120),
    label: String(
      editTarget.label ||
        (type === "slide" ? "Whole slide" : type === "component" ? "Selected component" : "Custom region")
    ).slice(0, 240),
    bounds: { x, y, w, h },
    point: {
      x: roundPercent(
        clampPercent(Number.isFinite(pointX) ? pointX : x + w / 2, x, x + w)
      ),
      y: roundPercent(
        clampPercent(Number.isFinite(pointY) ? pointY : y + h / 2, y, y + h)
      )
    }
  };
}

export function buildTargetedRevisionPrompt(promptText, editTarget) {
  const instruction =
    String(promptText || "").trim() || "Improve the selected slide component.";
  const target = normalizeEditTarget(editTarget);

  if (target.type === "slide") {
    return [
      "Revise the supplied slide image.",
      `User edit instruction: ${instruction}`,
      "Preserve the slide dimensions and keep every element not named by the instruction unchanged.",
      "Return the complete slide canvas, not a crop or isolated target area."
    ].join("\n");
  }

  const { x, y, w, h } = target.bounds;
  const { x: pointX, y: pointY } = target.point;
  return [
    "Revise only the selected component in the supplied slide image.",
    `Selected target: ${target.label} (id: ${target.id}).`,
    `Target bounds as percentages of the full slide: left ${x.toFixed(1)}%, top ${y.toFixed(1)}%, width ${w.toFixed(1)}%, height ${h.toFixed(1)}%.`,
    `Pointer anchor: ${pointX.toFixed(1)}% from the left and ${pointY.toFixed(1)}% from the top.`,
    `User edit instruction: ${instruction}`,
    "Treat the target bounds as the only editable area. Keep every other element, position, type style, colour, background, and slide dimension unchanged.",
    "Return the complete slide canvas, not only the selected target area."
  ].join("\n");
}

function lessonSortValue(deck) {
  const match = deck.id?.match(/^Lesson_(\d+)/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

async function saveManifestFile(manifestPath, manifest) {
  const temporaryPath = `${manifestPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    await fs.writeFile(temporaryPath, `${JSON.stringify(manifest, null, 2)}\n`);
    await fs.rename(temporaryPath, manifestPath);
  } catch (error) {
    await fs.unlink(temporaryPath).catch(() => {});
    if (error.code === "EROFS" || error.code === "EACCES") {
      console.warn(`[Server] Read-only filesystem (${error.code}), skipped disk write for ${manifestPath}`);
    } else {
      throw error;
    }
  }
}

function replaceSlideContents(target, source) {
  Object.keys(target).forEach((key) => delete target[key]);
  Object.assign(target, source);
}

export function resolvePublicAssetPath(publicDir, assetUrlOrPath) {
  const requested = String(assetUrlOrPath || "").trim();
  if (!requested) {
    const error = new Error("A generated image URL or path is required.");
    error.statusCode = 400;
    throw error;
  }

  const publicRoot = path.resolve(publicDir);
  let resolvedPath;
  if (path.isAbsolute(requested) && !requested.startsWith("/decks/")) {
    resolvedPath = path.resolve(requested);
  } else {
    const pathname = decodeURIComponent(requested.split(/[?#]/, 1)[0]).replace(/^\/+/, "");
    resolvedPath = path.resolve(publicRoot, pathname);
  }

  if (resolvedPath !== publicRoot && !resolvedPath.startsWith(`${publicRoot}${path.sep}`)) {
    const error = new Error("Generated image must be stored inside the public workspace.");
    error.statusCode = 400;
    throw error;
  }
  return resolvedPath;
}

function publicAssetUrl(publicDir, assetUrlOrPath) {
  const resolvedPath = resolvePublicAssetPath(publicDir, assetUrlOrPath);
  const relative = path.relative(path.resolve(publicDir), resolvedPath).split(path.sep).join("/");
  return `/${relative}`;
}

async function readManifest(decksDir, deckId) {
  const safeDeckId = assertSafeDeckId(deckId);
  const manifestPath = path.join(decksDir, safeDeckId, "manifest.json");
  const raw = await fs.readFile(manifestPath, "utf-8");
  return { manifestPath, manifest: JSON.parse(raw) };
}

async function runRevision({
  decksDir,
  deckId,
  slideNum,
  promptText,
  componentId,
  editTarget,
  pathway,
  buildId = null,
  isAnimationStep = true,
  dispatch = true
}) {
  const selectedPathway = normalizeAgentPathway(pathway);
  const sNum = Number.parseInt(slideNum, 10);
  const { manifestPath, manifest } = await readManifest(decksDir, deckId);
  const slide = manifest.slides.find((candidate) => candidate.number === sNum);

  if (!slide) {
    const error = new Error(`Slide ${slideNum} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const normalizedEditTarget = normalizeEditTarget(editTarget, componentId);
  const targetedPrompt = buildTargetedRevisionPrompt(
    promptText,
    normalizedEditTarget
  );

  let result;
  if (selectedPathway === AGENT_PATHWAYS.GEMINI_IMAGE_CHAT) {
    const imagePath = path.join(decksDir, manifest.id, "slides", slide.imageFileName);
    result = await generateGeminiSlideImage(
      manifest.id,
      sNum,
      imagePath,
      targetedPrompt,
      { dispatch, decksDir }
    );
  } else if (selectedPathway === AGENT_PATHWAYS.NOTEBOOKLM_SLIDE_REVISION) {
    result = await triggerNotebookLMRevision(manifest.id, sNum, targetedPrompt);
  } else {
    result = await editSlideComponentViaGemini(
      manifest.id,
      sNum,
      normalizedEditTarget.id,
      targetedPrompt
    );
  }

  if (result.imageUrl || result.videoUrl) {
    if (isAnimationStep) {
      const builds = normalizeMediaBuilds(slide);
      const plannedCell = Array.isArray(slide.geminiImageCells)
        ? slide.geminiImageCells.find((cell) => cell.id === buildId)
        : null;

      if (result.imageUrl && hasProtectedVideoMedia(slide)) {
        // A still-image request must never replace or reorder an existing
        // Gemini video sequence. Keep the captured image outside playback.
        slide.generatedMedia = [
          ...(Array.isArray(slide.generatedMedia) ? slide.generatedMedia : []),
          {
            id: buildId || `image_build_${Date.now()}`,
            mediaType: "image",
            imageUrl: result.imageUrl,
            source: "gemini-image-chat",
            generationStatus: "generated-pending-qa",
            qaStatus: "pending",
            generatedAt: new Date().toISOString(),
            excludedFromPlayback: "protected-video"
          }
        ];
      } else if (plannedCell && result.imageUrl) {
        plannedCell.status = "generated-pending-qa";
        plannedCell.qaStatus = "pending";
        plannedCell.outputImageUrl = result.imageUrl;
        plannedCell.generatedAt = new Date().toISOString();
        plannedCell.qa = {
          status: "pending",
          generatedAt: plannedCell.generatedAt,
          reason: "Generated image is withheld from playback until technical and visual QA approval."
        };
        replaceSlideContents(slide, syncQaApprovedGeminiSequence(slide));
      } else {
        const nextVersion = builds.length + 1;
        const kind = result.videoUrl ? "video" : "image";
        const stepLabel = `Build ${nextVersion}: ${normalizedEditTarget.label || "Custom Edit"}`;
        const generatedEntry = {
          id: buildId || `${kind}_build_${Date.now()}`,
          version: nextVersion,
          kind,
          mediaType: kind,
          label: stepLabel,
          imageUrl: result.imageUrl || slide.imageUrl,
          ...(result.videoUrl
            ? {
                videoUrl: result.videoUrl,
                posterUrl: result.posterUrl || slide.imageUrl,
                protected: true,
                source: "gemini-video"
              }
            : {
                source: "gemini-image-chat",
                generationStatus: "generated-pending-qa",
                qaStatus: "pending"
              })
        };
        if (kind === "video") {
          builds.push(generatedEntry);
          slide.progressiveBuilds = builds.map((build, index) => ({
            ...build,
            version: index + 1
          }));
          slide.hasProgressiveBuilds = true;
          slide.serialAnimation = {
            totalBuildSteps: slide.progressiveBuilds.length,
            autoAdvanceDelayMs: slide.serialAnimation?.autoAdvanceDelayMs || 3200,
            serialSteps: slide.progressiveBuilds.map((build, index) => ({
              step: index + 1,
              buildId: build.id,
              title: build.label,
              componentIds: [build.id],
              targetBounds: build.targetBounds || normalizedEditTarget.bounds,
              revealType: isVideoMedia(build) ? "play-video" : "crossfade"
            }))
          };
        } else {
          slide.geminiImageCells = [
            ...(Array.isArray(slide.geminiImageCells) ? slide.geminiImageCells : []),
            {
              id: generatedEntry.id,
              order: (slide.geminiImageCells?.length || 0) + 1,
              kind: "image",
              mediaType: "image",
              source: "gemini-image-chat",
              label: generatedEntry.label,
              fullCanvas: true,
              cumulative: true,
              prompt: promptText,
              status: "generated-pending-qa",
              qaStatus: "pending",
              outputImageUrl: result.imageUrl,
              sourceImageUrl: slide.imageUrl,
              generatedAt: new Date().toISOString(),
              qa: {
                status: "pending",
                reason: "Generated image is withheld from playback until technical and visual QA approval."
              }
            }
          ];
          replaceSlideContents(slide, syncQaApprovedGeminiSequence(slide));
        }
      }
    } else {
      if (result.imageUrl) slide.imageUrl = result.imageUrl;
    }
    await saveManifestFile(manifestPath, manifest);
  }

  return {
    ...result,
    isAnimationStep,
    editTarget: normalizedEditTarget,
    qaRequired: Boolean(result.imageUrl && isAnimationStep),
    slide
  };
}

export async function reviewGeneratedBuildAsset({
  decksDir = DECKS_DIR,
  publicDir = path.dirname(decksDir),
  deckId,
  slideNum,
  buildId,
  imageUrl = null,
  imagePath = null,
  approved,
  visualChecks = null,
  reviewer = "presentation-agent",
  notes = ""
}) {
  const sNum = Number.parseInt(slideNum, 10);
  const { manifestPath, manifest } = await readManifest(decksDir, deckId);
  const slide = manifest.slides.find((candidate) => candidate.number === sNum);
  if (!slide) {
    const error = new Error(`Slide ${slideNum} not found.`);
    error.statusCode = 404;
    throw error;
  }
  if (hasProtectedVideoMedia(slide)) {
    const error = new Error("Protected video slides cannot be replaced by a still-image QA approval.");
    error.statusCode = 409;
    throw error;
  }

  const cell = Array.isArray(slide.geminiImageCells)
    ? slide.geminiImageCells.find((candidate) => candidate.id === buildId)
    : null;
  if (!cell) {
    const error = new Error(`Gemini image cell ${buildId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const requestedAsset = imageUrl || imagePath || cell.outputImageUrl;
  if (!requestedAsset) {
    const error = new Error("Generate or attach an image before recording QA.");
    error.statusCode = 400;
    throw error;
  }
  const normalizedImageUrl = publicAssetUrl(publicDir, requestedAsset);
  const outputPath = resolvePublicAssetPath(publicDir, normalizedImageUrl);
  const sourcePath = resolvePublicAssetPath(
    publicDir,
    cell.sourceImageUrl || slide.imageUrl
  );
  const technicalQa = await validateGeneratedSlideImage({ outputPath, sourcePath });
  const duplicateCell = slide.geminiImageCells.find(
    (candidate) =>
      candidate.id !== cell.id &&
      (candidate.outputImageUrl === normalizedImageUrl ||
        (technicalQa.sha256 && candidate.qa?.technical?.sha256 === technicalQa.sha256))
  );
  technicalQa.checks.push({
    id: "unique-build-image",
    passed: !duplicateCell,
    detail: duplicateCell
      ? `Matches generated build ${duplicateCell.id}.`
      : "Generated build is distinct from the other cells in this sequence."
  });
  technicalQa.passed = technicalQa.checks.every((check) => check.passed);
  const visualQa = validateVisualQaChecklist(visualChecks);
  const reviewedAt = new Date().toISOString();

  if (approved === true && (!technicalQa.passed || !visualQa.passed)) {
    const error = new Error(
      "Generated image failed QA and was not added to the click sequence."
    );
    error.statusCode = 422;
    error.qa = { technical: technicalQa, visual: visualQa };
    throw error;
  }

  cell.outputImageUrl = normalizedImageUrl;
  cell.generatedAt = cell.generatedAt || reviewedAt;
  cell.qaStatus = approved === true ? "approved" : "rejected";
  cell.status = approved === true ? "approved" : "generated-rejected";
  cell.qa = {
    status: cell.qaStatus,
    reviewedAt,
    reviewer: String(reviewer || "presentation-agent").slice(0, 120),
    notes: String(notes || "").slice(0, 2_000),
    technical: technicalQa,
    visual: visualQa
  };

  const synchronized = syncQaApprovedGeminiSequence(slide);
  if (synchronized.animationPlan) {
    synchronized.animationPlan = {
      ...synchronized.animationPlan,
      approvedCellCount: synchronized.progressiveBuilds?.length || 0,
      qaRequired: true
    };
  }
  replaceSlideContents(slide, synchronized);
  await saveManifestFile(manifestPath, manifest);

  return {
    success: true,
    approved: approved === true,
    qa: cell.qa,
    build: slide.geminiImageCells.find((candidate) => candidate.id === buildId),
    slide
  };
}

export function createApp({
  publicDir = PUBLIC_DIR,
  decksDir = DECKS_DIR
} = {}) {
  const app = express();

  app.use(express.json({ limit: "2mb" }));
  app.use(express.static(publicDir));

  app.get("/api/agent-pathways", (req, res) => {
    res.json({
      defaultPathway: DEFAULT_AGENT_PATHWAY,
      pathways: AGENT_PATHWAY_OPTIONS
    });
  });

  app.get("/api/decks", async (req, res) => {
    try {
      try {
        await fs.mkdir(decksDir, { recursive: true });
      } catch (err) {
        if (err.code !== "EROFS" && err.code !== "EEXIST") throw err;
      }
      const entries = await fs.readdir(decksDir, { withFileTypes: true });
      const decks = [];

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        try {
          const { manifest } = await readManifest(decksDir, entry.name);
          decks.push(manifest);
        } catch {
          // Ignore partial deck directories that do not yet contain a manifest.
        }
      }

      decks.sort(
        (a, b) =>
          lessonSortValue(a) - lessonSortValue(b) ||
          String(a.title).localeCompare(String(a.title))
      );
      res.json({ decks, defaultDeckId: decks[0]?.id || null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/decks/:deckId", async (req, res) => {
    try {
      const { manifest } = await readManifest(decksDir, req.params.deckId);
      res.json(manifest);
    } catch (error) {
      res.status(error.statusCode || 404).json({ error: "Deck not found" });
    }
  });

  app.post("/api/decks/:deckId/slides/:slideNum/revise", async (req, res) => {
    try {
      const result = await runRevision({
        decksDir,
        deckId: req.params.deckId,
        slideNum: req.params.slideNum,
        promptText: req.body.promptText,
        componentId: req.body.componentId,
        editTarget: req.body.editTarget,
        pathway: req.body.pathway,
        buildId: req.body.buildId,
        isAnimationStep: req.body.isAnimationStep !== false,
        dispatch: req.body.dispatch !== false
      });
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  });

  app.post("/api/decks/:deckId/slides/:slideNum/revert", async (req, res) => {
    try {
      const { manifestPath, manifest } = await readManifest(
        decksDir,
        req.params.deckId
      );
      const sNum = Number.parseInt(req.params.slideNum, 10);
      const slide = manifest.slides.find((candidate) => candidate.number === sNum);

      if (!slide) {
        return res.status(404).json({ error: `Slide ${req.params.slideNum} not found` });
      }

      const { versionId, imageUrl } = req.body;
      const targetVersion =
        slide.history?.find((v) => v.id === versionId || v.imageUrl === imageUrl) ||
        (versionId === "original" || versionId === "ver_orig"
          ? { imageUrl: slide.originalImageUrl || slide.imageUrl }
          : null);

      const restoredUrl = targetVersion?.imageUrl || imageUrl || slide.originalImageUrl || slide.imageUrl;
      if (restoredUrl) {
        slide.imageUrl = restoredUrl;
        await saveManifestFile(manifestPath, manifest);
      }

      res.json({ success: true, restoredUrl, slide });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  });

  app.post("/api/decks/:deckId/slides/:slideNum/clear-sequence", async (req, res) => {
    try {
      const { manifestPath, manifest } = await readManifest(decksDir, req.params.deckId);
      const sNum = Number.parseInt(req.params.slideNum, 10);
      const slide = manifest.slides.find((candidate) => candidate.number === sNum);

      if (!slide) {
        return res.status(404).json({ error: `Slide ${req.params.slideNum} not found` });
      }

      const clearedSlide = removeGeneratedImageBuildsPreservingVideo(slide);
      Object.keys(slide).forEach((key) => delete slide[key]);
      Object.assign(slide, clearedSlide);

      await saveManifestFile(manifestPath, manifest);

      res.json({ success: true, slide });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  });

  // Backward-compatible Gemini image endpoint. The generic revision route above
  // is used by the current sidebar and defaults to this pathway.
  app.post(
    "/api/decks/:deckId/slides/:slideNum/generate-gemini-image",
    async (req, res) => {
      try {
        const result = await runRevision({
          decksDir,
          deckId: req.params.deckId,
          slideNum: req.params.slideNum,
          promptText: req.body.promptText,
          componentId: req.body.componentId,
          editTarget: req.body.editTarget,
          pathway: AGENT_PATHWAYS.GEMINI_IMAGE_CHAT,
          dispatch: req.body.dispatch !== false
        });
        res.json(result);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
    }
  );

  app.post(
    "/api/decks/:deckId/slides/:slideNum/builds/:buildId/generate",
    async (req, res) => {
      try {
        const { manifest } = await readManifest(decksDir, req.params.deckId);
        const sNum = Number.parseInt(req.params.slideNum, 10);
        const slide = manifest.slides.find((candidate) => candidate.number === sNum);
        const cell = slide?.geminiImageCells?.find(
          (candidate) => candidate.id === req.params.buildId
        );
        if (!slide) {
          return res.status(404).json({ error: `Slide ${req.params.slideNum} not found` });
        }
        if (!cell || !cell.prompt) {
          return res.status(404).json({ error: `Gemini image cell ${req.params.buildId} not found` });
        }

        const result = await runRevision({
          decksDir,
          deckId: manifest.id,
          slideNum: sNum,
          promptText: cell.prompt,
          componentId: cell.id,
          editTarget: {
            type: "slide",
            id: "slide",
            label: cell.label
          },
          pathway: AGENT_PATHWAYS.GEMINI_IMAGE_CHAT,
          buildId: cell.id,
          isAnimationStep: true,
          dispatch: req.body.dispatch !== false
        });
        res.json(result);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
    }
  );

  app.post(
    "/api/decks/:deckId/slides/:slideNum/builds/:buildId/qa",
    async (req, res) => {
      try {
        if (typeof req.body.approved !== "boolean") {
          return res.status(400).json({ error: "approved must be true or false." });
        }
        const result = await reviewGeneratedBuildAsset({
          decksDir,
          publicDir,
          deckId: req.params.deckId,
          slideNum: req.params.slideNum,
          buildId: req.params.buildId,
          imageUrl: req.body.imageUrl,
          imagePath: req.body.imagePath,
          approved: req.body.approved,
          visualChecks: req.body.visualChecks,
          reviewer: req.body.reviewer,
          notes: req.body.notes
        });
        res.json(result);
      } catch (error) {
        res.status(error.statusCode || 500).json({
          error: error.message,
          ...(error.qa ? { qa: error.qa } : {})
        });
      }
    }
  );

  app.post(
    "/api/decks/:deckId/slides/:slideNum/edit-component",
    async (req, res) => {
      try {
        const { manifestPath, manifest } = await readManifest(
          decksDir,
          req.params.deckId
        );
        const sNum = Number.parseInt(req.params.slideNum, 10);
        const slide = manifest.slides.find((candidate) => candidate.number === sNum);

        if (!slide) {
          return res.status(404).json({ error: `Slide ${req.params.slideNum} not found` });
        }

        if (Array.isArray(req.body.serialSteps) && slide.serialAnimation) {
          slide.serialAnimation.serialSteps = req.body.serialSteps;
          slide.serialAnimation.totalBuildSteps = req.body.serialSteps.length;
        }

        await saveManifestFile(manifestPath, manifest);

        const agentResult = await runRevision({
          decksDir,
          deckId: manifest.id,
          slideNum: sNum,
          promptText: req.body.editPrompt,
          componentId: req.body.componentId,
          editTarget: req.body.editTarget,
          pathway: req.body.pathway,
          dispatch: req.body.dispatch !== false
        });

        res.json({ success: true, slide, agentResult });
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
    }
  );

  app.post(
    "/api/decks/:deckId/slides/:slideNum/revise-notebooklm",
    async (req, res) => {
      try {
        const result = await runRevision({
          decksDir,
          deckId: req.params.deckId,
          slideNum: req.params.slideNum,
          promptText: req.body.revisionPrompt,
          componentId: req.body.componentId,
          editTarget: req.body.editTarget,
          pathway: AGENT_PATHWAYS.NOTEBOOKLM_SLIDE_REVISION
        });
        res.json(result);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
    }
  );

  app.post("/api/decks/:deckId/slides/:slideNum/bounds", async (req, res) => {
    try {
      const { manifestPath, manifest } = await readManifest(
        decksDir,
        req.params.deckId
      );
      const sNum = Number.parseInt(req.params.slideNum, 10);
      const slide = manifest.slides.find((candidate) => candidate.number === sNum);

      if (!slide) {
        return res.status(404).json({ error: `Slide ${req.params.slideNum} not found` });
      }

      if (Array.isArray(req.body.interactiveCells)) {
        slide.interactiveCells = req.body.interactiveCells.map((cell) => ({
          ...cell,
          locked: true,
          provenance: "user-adjusted"
        }));
      } else if (req.body.cellId && req.body.bounds && slide.interactiveCells) {
        const cell = slide.interactiveCells.find(
          (candidate) => candidate.id === req.body.cellId
        );
        if (cell) {
          const previousBounds = cell.answerBounds;
          cell.answerBounds = { ...req.body.bounds };
          if (Array.isArray(cell.answerRegions) && previousBounds) {
            const sameBounds = (left, right) =>
              ["x", "y", "w", "h"].every(
                (key) => Number(left?.[key]) === Number(right?.[key])
              );
            cell.answerRegions = cell.answerRegions.map((region) =>
              sameBounds(region, previousBounds) ? { ...req.body.bounds } : region
            );
          }
          cell.locked = true;
          cell.provenance = "user-adjusted";
        }
      }

      await saveManifestFile(manifestPath, manifest);
      res.json({ success: true, slide });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  });

  app.post("/api/convert", async (req, res) => {
    try {
      const { pptxPath } = req.body;
      const pathway = normalizeAgentPathway(req.body.pathway);
      if (!pptxPath) {
        return res.status(400).json({ error: "pptxPath is required" });
      }

      const stat = await fs.stat(pptxPath);
      if (stat.isDirectory()) {
        const files = await fs.readdir(pptxPath);
        const pptxFiles = files.filter((file) => file.endsWith(".pptx")).sort();
        const manifests = [];
        for (const file of pptxFiles) {
          const manifest = await extractPptxDeck(
            path.join(pptxPath, file),
            decksDir
          );
          const enrichedManifest = await generateSlideInteractivity(manifest.id, decksDir, { pathway });
          manifests.push(enrichedManifest || manifest);
        }
        return res.json({
          success: true,
          pathway,
          count: manifests.length,
          decks: manifests
        });
      }

      const manifest = await extractPptxDeck(pptxPath, decksDir);
      const enrichedManifest = await generateSlideInteractivity(manifest.id, decksDir, { pathway });
      res.json({ success: true, pathway, deck: enrichedManifest || manifest });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return app;
}

export function startServer(port = Number(process.env.PORT) || 3000) {
  process.on("unhandledRejection", (reason) => {
    console.warn("[Presentation Web Agent] Suppressed unhandledRejection:", reason?.message || reason);
  });

  process.on("uncaughtException", (error) => {
    console.warn("[Presentation Web Agent] Suppressed uncaughtException:", error?.message || error);
  });

  const app = createApp();
  const server = app.listen(port, () => {
    console.log(`[Presentation Web Agent] Server listening at http://127.0.0.1:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn(
        `[Presentation Web Agent] Port ${port} is in use, trying port ${port + 1}...`
      );
      startServer(port + 1);
    } else {
      console.error("[Presentation Web Agent] Server error:", error);
    }
  });

  return server;
}

const defaultApp = createApp();
export default defaultApp;

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL && isDirectRun) {
  startServer();
}
