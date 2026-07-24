import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractPptxDeck } from "./pptx-extractor.js";
import { generateSlideInteractivity } from "./gemini-segmenter.js";

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

app.listen(PORT, () => {
  console.log(`[Presentation Web Agent] Server listening at http://localhost:${PORT}`);
});
