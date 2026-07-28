import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractPptxDeck } from "./pptx-extractor.js";
import { generateSlideInteractivity } from "./gemini-segmenter.js";
import { editSlideComponentViaGemini } from "./gemini-editor.js";
import { generateGeminiSlideImage } from "./gemini-image-gen.js";
import { triggerNotebookLMRevision } from "./notebooklm-revisor.js";
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
      "Preserve the slide dimensions and keep every element not named by the instruction unchanged."
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
    "Treat the target bounds as the only editable area. Keep every other element, position, type style, colour, background, and slide dimension unchanged."
  ].join("\n");
}

function lessonSortValue(deck) {
  const match = deck.id?.match(/^Lesson_(\d+)/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
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
  dispatch = true
}) {
  const selectedPathway = normalizeAgentPathway(pathway);
  const sNum = Number.parseInt(slideNum, 10);
  const { manifest } = await readManifest(decksDir, deckId);
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

  if (selectedPathway === AGENT_PATHWAYS.GEMINI_IMAGE_CHAT) {
    const imagePath = path.join(decksDir, manifest.id, "slides", slide.imageFileName);
    const result = await generateGeminiSlideImage(
      manifest.id,
      sNum,
      imagePath,
      targetedPrompt,
      { dispatch }
    );
    return { ...result, editTarget: normalizedEditTarget };
  }

  if (selectedPathway === AGENT_PATHWAYS.NOTEBOOKLM_SLIDE_REVISION) {
    const result = await triggerNotebookLMRevision(manifest.id, sNum, targetedPrompt);
    return { ...result, pathway: selectedPathway, editTarget: normalizedEditTarget };
  }

  const result = await editSlideComponentViaGemini(
    manifest.id,
    sNum,
    normalizedEditTarget.id,
    targetedPrompt
  );

  return {
    ...result,
    pathway: selectedPathway,
    editTarget: normalizedEditTarget,
    dispatched: false,
    status: "Component edit was registered using the local segmentation fallback."
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
      await fs.mkdir(decksDir, { recursive: true });
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
          String(a.title).localeCompare(String(b.title))
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
        dispatch: req.body.dispatch !== false
      });
      res.json(result);
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

        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

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
        slide.interactiveCells = req.body.interactiveCells;
      } else if (req.body.cellId && req.body.bounds && slide.interactiveCells) {
        const cell = slide.interactiveCells.find(
          (candidate) => candidate.id === req.body.cellId
        );
        if (cell) {
          cell.answerBounds = { ...req.body.bounds };
          cell.bounds = { ...req.body.bounds };
        }
      }

      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
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
          await generateSlideInteractivity(manifest.id, decksDir, { pathway });
          manifests.push(manifest);
        }
        return res.json({
          success: true,
          pathway,
          count: manifests.length,
          decks: manifests
        });
      }

      const manifest = await extractPptxDeck(pptxPath, decksDir);
      await generateSlideInteractivity(manifest.id, decksDir, { pathway });
      res.json({ success: true, pathway, deck: manifest });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return app;
}

export function startServer(
  port = Number(process.env.PORT) || 3000,
  host = process.env.HOST || "127.0.0.1"
) {
  process.on("unhandledRejection", (reason) => {
    console.warn("[Presentation Web Agent] Suppressed unhandledRejection:", reason?.message || reason);
  });

  process.on("uncaughtException", (error) => {
    console.warn("[Presentation Web Agent] Suppressed uncaughtException:", error?.message || error);
  });

  const app = createApp();
  const server = app.listen(port, host, () => {
    console.log(`[Presentation Web Agent] Server listening at http://${host}:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn(
        `[Presentation Web Agent] Port ${port} is in use, trying port ${port + 1}...`
      );
      startServer(port + 1, host);
    } else {
      console.error("[Presentation Web Agent] Server error:", error);
    }
  });

  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  startServer();
}
