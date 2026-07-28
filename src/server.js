import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractPptxDeck } from "./pptx-extractor.js";
import { generateSlideInteractivity } from "./gemini-segmenter.js";
import { editSlideComponentViaGemini } from "./gemini-editor.js";
import { triggerNotebookLMRevision } from "./notebooklm-revisor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DECKS_DIR = path.join(PUBLIC_DIR, "decks");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// API to list all converted decks
app.get("/api/decks", async (req, res) => {
  try {
    await fs.mkdir(DECKS_DIR, { recursive: true });
    const entries = await fs.readdir(DECKS_DIR, { withFileTypes: true });
    const decks = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const manifestPath = path.join(DECKS_DIR, entry.name, "manifest.json");
        try {
          const raw = await fs.readFile(manifestPath, "utf-8");
          decks.push(JSON.parse(raw));
        } catch {}
      }
    }

    res.json({ decks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get a specific deck manifest
app.get("/api/decks/:deckId", async (req, res) => {
  try {
    const { deckId } = req.params;
    const manifestPath = path.join(DECKS_DIR, deckId, "manifest.json");
    const raw = await fs.readFile(manifestPath, "utf-8");
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(404).json({ error: "Deck not found" });
  }
});

// API to edit a selective component or serial animation step on a slide
app.post("/api/decks/:deckId/slides/:slideNum/edit-component", async (req, res) => {
  try {
    const { deckId, slideNum } = req.params;
    const { componentId, editPrompt, serialSteps } = req.body;

    const manifestPath = path.join(DECKS_DIR, deckId, "manifest.json");
    const raw = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(raw);

    const sNum = parseInt(slideNum, 10);
    const slide = manifest.slides.find((s) => s.number === sNum);

    if (!slide) {
      return res.status(404).json({ error: `Slide ${slideNum} not found` });
    }

    if (serialSteps && slide.serialAnimation) {
      slide.serialAnimation.serialSteps = serialSteps;
      slide.serialAnimation.totalBuildSteps = serialSteps.length;
    }

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    const geminiResult = await editSlideComponentViaGemini(deckId, sNum, componentId, editPrompt || "Selective animation update");
    res.json({ success: true, slide, geminiResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to trigger live NotebookLM slide revisions
app.post("/api/decks/:deckId/slides/:slideNum/revise-notebooklm", async (req, res) => {
  try {
    const { deckId, slideNum } = req.params;
    const { revisionPrompt } = req.body;

    const sNum = parseInt(slideNum, 10);
    const nlmResult = await triggerNotebookLMRevision(deckId, sNum, revisionPrompt);

    res.json({ success: true, deckId, slideNum: sNum, revisionPrompt, nlmResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to save updated component boundary size and position
app.post("/api/decks/:deckId/slides/:slideNum/bounds", async (req, res) => {
  try {
    const { deckId, slideNum } = req.params;
    const { cellId, bounds, interactiveCells } = req.body;

    const manifestPath = path.join(DECKS_DIR, deckId, "manifest.json");
    const raw = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(raw);

    const sNum = parseInt(slideNum, 10);
    const slide = manifest.slides.find((s) => s.number === sNum);

    if (!slide) {
      return res.status(404).json({ error: `Slide ${slideNum} not found` });
    }

    if (interactiveCells && Array.isArray(interactiveCells)) {
      slide.interactiveCells = interactiveCells;
    } else if (cellId && bounds && slide.interactiveCells) {
      const cell = slide.interactiveCells.find((c) => c.id === cellId);
      if (cell) {
        cell.answerBounds = { ...bounds };
        cell.bounds = { ...bounds };
      }
    }

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    res.json({ success: true, slide });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// API to trigger conversion of a PPTX file or directory
app.post("/api/convert", async (req, res) => {
  try {
    const { pptxPath } = req.body;
    if (!pptxPath) {
      return res.status(400).json({ error: "pptxPath is required" });
    }

    const stat = await fs.stat(pptxPath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(pptxPath);
      const pptxFiles = files.filter((f) => f.endsWith(".pptx"));
      const manifests = [];
      for (const file of pptxFiles) {
        const fullPath = path.join(pptxPath, file);
        const m = await extractPptxDeck(fullPath, DECKS_DIR);
        await generateSlideInteractivity(m.id, DECKS_DIR);
        manifests.push(m);
      }
      return res.json({ success: true, count: manifests.length, decks: manifests });
    }

    const manifest = await extractPptxDeck(pptxPath, DECKS_DIR);
    await generateSlideInteractivity(manifest.id, DECKS_DIR);
    res.json({ success: true, deck: manifest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`[Presentation Web Agent] Server listening at http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`[Presentation Web Agent] Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("[Presentation Web Agent] Server error:", err);
    }
  });
}

startServer(PORT);
