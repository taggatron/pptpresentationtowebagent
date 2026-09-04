import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import {
  isPowerPointAvailable,
  sanitizeDeckId,
  parseOpenXmlPresentation,
  ingestPowerPointDeck
} from "../src/powerpoint-slide-agent.js";
import { createApp } from "../src/server.js";
import { AGENT_PATHWAYS } from "../src/agent-config.js";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(TEST_DIR, "..");
const CELLBIO_DIR = "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/NotebookLMagent/output/powerpoints_cellbio_sequence_v2";
const LESSON_ONE_PATH = path.join(CELLBIO_DIR, "Lesson_01_CELL_STRUCTURE.pptx");
const DIGITAL_LITERACY_PATH = "/Users/danieltagg/Desktop/digital_literacy_conference_deck.pptx";

test("PowerPoint Agent: isPowerPointAvailable detects installed PowerPoint on macOS", async () => {
  const available = await isPowerPointAvailable();
  assert.equal(typeof available, "boolean");
  if (process.platform === "darwin") {
    assert.equal(available, true, "Microsoft PowerPoint should be available on this Mac");
  }
});

test("PowerPoint Agent: sanitizeDeckId correctly sanitizes paths and filenames", () => {
  assert.equal(sanitizeDeckId("Lesson_01_CELL_STRUCTURE.pptx"), "Lesson_01_CELL_STRUCTURE");
  assert.equal(sanitizeDeckId("My Awesome Presentation! (2026).pptx"), "My_Awesome_Presentation_2026");
  assert.equal(sanitizeDeckId("path/to/Sample-Deck.v1.2.pptx"), "Sample-Deck_v1_2");
});

test("PowerPoint Agent: parseOpenXmlPresentation parses cellbio slide structures", async () => {
  const data = await parseOpenXmlPresentation(LESSON_ONE_PATH);
  assert.ok(data);
  assert.equal(data.totalSlides, 16);
  assert.equal(data.slides.length, 16);
  assert.ok(data.slides[0].number === 1);
  assert.ok(data.slides[0].embeddedMediaTarget);
});

test("PowerPoint Agent: parseOpenXmlPresentation parses digital literacy conference deck", async () => {
  const data = await parseOpenXmlPresentation(DIGITAL_LITERACY_PATH);
  assert.ok(data);
  assert.equal(data.totalSlides, 22);
  assert.ok(data.slides[0].number === 1);
  assert.ok(data.slides[0].textContent.includes("Digital Natives"));
});

test("PowerPoint Agent: ingestPowerPointDeck generates valid manifest and slide files", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "ppt-agent-test-"));
  try {
    const manifest = await ingestPowerPointDeck(LESSON_ONE_PATH, tempDir, {
      deckId: "test_cell_bio"
    });

    assert.equal(manifest.id, "test_cell_bio");
    assert.equal(manifest.totalSlides, 16);
    assert.equal(manifest.slides.length, 16);

    // Verify slide 1
    const s1 = manifest.slides[0];
    assert.equal(s1.number, 1);
    assert.equal(s1.imageFileName, "slide_01.png");
    assert.ok(s1.imageUrl.includes("/decks/test_cell_bio/slides/slide_01.png"));
    assert.ok(s1.cognitiveAnalysis);
    assert.ok(s1.cognitiveAnalysis.vciScore >= 0);

    // Verify slide 2 starter grid is preserved
    const s2 = manifest.slides[1];
    assert.equal(s2.interactiveType, "starter_qa_grid");
    assert.equal(s2.interactiveCells.length, 6);

    // Verify slide image was written to disk
    const slide1File = path.join(tempDir, "test_cell_bio", "slides", "slide_01.png");
    const stat = await fs.stat(slide1File);
    assert.ok(stat.isFile() && stat.size > 10000);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("PowerPoint Agent: Express server exposes /api/powerpoint endpoints", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "server-ppt-test-"));
  const app = createApp({ decksDir: tempDir });
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    // 1. Check status endpoint
    const statusRes = await fetch(`http://127.0.0.1:${port}/api/powerpoint/status`);
    assert.equal(statusRes.status, 200);
    const statusData = await statusRes.json();
    assert.equal(typeof statusData.available, "boolean");

    // 2. Check ingestion endpoint validation
    const badRes = await fetch(`http://127.0.0.1:${port}/api/powerpoint/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    assert.equal(badRes.status, 400);

    // 3. Test successful ingestion via API
    const ingestRes = await fetch(`http://127.0.0.1:${port}/api/powerpoint/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pptxPath: LESSON_ONE_PATH,
        deckId: "api_test_deck"
      })
    });
    assert.equal(ingestRes.status, 200);
    const ingestData = await ingestRes.json();
    assert.equal(ingestData.success, true);
    assert.equal(ingestData.deck.totalSlides, 16);
  } finally {
    server.close();
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
