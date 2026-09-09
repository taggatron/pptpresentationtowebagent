import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { createApp } from "../src/server.js";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(TEST_DIR, "..");

test("reorder-slides endpoint reorders slides by fromIndex and toIndex and persists manifest to disk", async () => {
  const tmpDecksDir = await fs.mkdtemp(path.join(os.tmpdir(), "decks-reorder-test-"));
  const deckId = "test_deck_reorder";
  const deckPath = path.join(tmpDecksDir, deckId);
  await fs.mkdir(deckPath, { recursive: true });

  const initialManifest = {
    id: deckId,
    title: "Test Deck Reorder",
    totalSlides: 3,
    slides: [
      { number: 1, title: "Slide 1", imageUrl: "/slides/s1.png", cognitiveLoad: { score: 1 } },
      { number: 2, title: "Custom Concept", imageUrl: "/slides/s2.png", cognitiveLoad: { score: 2 } },
      { number: 3, title: "Slide 3", imageUrl: "/slides/s3.png", cognitiveLoad: { score: 3 } }
    ]
  };

  await fs.writeFile(path.join(deckPath, "manifest.json"), JSON.stringify(initialManifest, null, 2), "utf-8");

  const app = createApp({ decksDir: tmpDecksDir });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    // Move slide 0 ("Slide 1") to index 2 (end of array)
    const res = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/reorder-slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromIndex: 0, toIndex: 2 })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.manifest.slides.length, 3);

    // Slide 2 moved to index 0 -> new number 1, retains custom title
    assert.equal(data.manifest.slides[0].number, 1);
    assert.equal(data.manifest.slides[0].title, "Custom Concept");
    assert.equal(data.manifest.slides[0].imageUrl, "/slides/s2.png");

    // Slide 3 moved to index 1 -> new number 2, generic title updated to "Slide 2"
    assert.equal(data.manifest.slides[1].number, 2);
    assert.equal(data.manifest.slides[1].title, "Slide 2");
    assert.equal(data.manifest.slides[1].imageUrl, "/slides/s3.png");

    // Old Slide 1 moved to index 2 -> new number 3, generic title updated to "Slide 3"
    assert.equal(data.manifest.slides[2].number, 3);
    assert.equal(data.manifest.slides[2].title, "Slide 3");
    assert.equal(data.manifest.slides[2].imageUrl, "/slides/s1.png");

    // Check disk manifest persistence
    const savedContent = JSON.parse(await fs.readFile(path.join(deckPath, "manifest.json"), "utf-8"));
    assert.equal(savedContent.totalSlides, 3);
    assert.equal(savedContent.slides[0].title, "Custom Concept");
    assert.equal(savedContent.slides[0].number, 1);
    assert.equal(savedContent.slides[1].number, 2);
    assert.equal(savedContent.slides[2].number, 3);
  } finally {
    server.close();
    await fs.rm(tmpDecksDir, { recursive: true, force: true }).catch(() => {});
  }
});

test("reorder-slides endpoint reorders slides by explicit order array and persists manifest", async () => {
  const tmpDecksDir = await fs.mkdtemp(path.join(os.tmpdir(), "decks-order-array-test-"));
  const deckId = "test_deck_order_array";
  const deckPath = path.join(tmpDecksDir, deckId);
  await fs.mkdir(deckPath, { recursive: true });

  const initialManifest = {
    id: deckId,
    title: "Test Deck Order Array",
    totalSlides: 4,
    slides: [
      { number: 1, title: "Slide 1", imageUrl: "/slides/s1.png" },
      { number: 2, title: "Slide 2", imageUrl: "/slides/s2.png" },
      { number: 3, title: "Slide 3", imageUrl: "/slides/s3.png" },
      { number: 4, title: "Slide 4", imageUrl: "/slides/s4.png" }
    ]
  };

  await fs.writeFile(path.join(deckPath, "manifest.json"), JSON.stringify(initialManifest, null, 2), "utf-8");

  const app = createApp({ decksDir: tmpDecksDir });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    // Reverse order: [4, 3, 2, 1]
    const res = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/reorder-slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: [4, 3, 2, 1] })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.manifest.slides.length, 4);

    // Verify renumbering and ordering
    assert.equal(data.manifest.slides[0].imageUrl, "/slides/s4.png");
    assert.equal(data.manifest.slides[0].number, 1);
    assert.equal(data.manifest.slides[1].imageUrl, "/slides/s3.png");
    assert.equal(data.manifest.slides[1].number, 2);
    assert.equal(data.manifest.slides[2].imageUrl, "/slides/s2.png");
    assert.equal(data.manifest.slides[2].number, 3);
    assert.equal(data.manifest.slides[3].imageUrl, "/slides/s1.png");
    assert.equal(data.manifest.slides[3].number, 4);

    // Verify file on disk
    const diskManifest = JSON.parse(await fs.readFile(path.join(deckPath, "manifest.json"), "utf-8"));
    assert.equal(diskManifest.slides[0].imageUrl, "/slides/s4.png");
    assert.equal(diskManifest.slides[0].number, 1);
    assert.equal(diskManifest.slides[3].imageUrl, "/slides/s1.png");
    assert.equal(diskManifest.slides[3].number, 4);
  } finally {
    server.close();
    await fs.rm(tmpDecksDir, { recursive: true, force: true }).catch(() => {});
  }
});

test("reorder-slides endpoint rejects invalid fromIndex / toIndex bounds", async () => {
  const tmpDecksDir = await fs.mkdtemp(path.join(os.tmpdir(), "decks-invalid-bounds-"));
  const deckId = "test_deck_bounds";
  const deckPath = path.join(tmpDecksDir, deckId);
  await fs.mkdir(deckPath, { recursive: true });

  const initialManifest = {
    id: deckId,
    title: "Test Deck Bounds",
    totalSlides: 2,
    slides: [
      { number: 1, title: "Slide 1" },
      { number: 2, title: "Slide 2" }
    ]
  };

  await fs.writeFile(path.join(deckPath, "manifest.json"), JSON.stringify(initialManifest, null, 2), "utf-8");

  const app = createApp({ decksDir: tmpDecksDir });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    // fromIndex negative
    const res1 = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/reorder-slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromIndex: -1, toIndex: 1 })
    });
    assert.equal(res1.status, 400);
    const err1 = await res1.json();
    assert.match(err1.error, /out of range/i);

    // toIndex out of upper bound
    const res2 = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/reorder-slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromIndex: 0, toIndex: 5 })
    });
    assert.equal(res2.status, 400);
    const err2 = await res2.json();
    assert.match(err2.error, /out of range/i);

    // Missing both fromIndex/toIndex and order
    const res3 = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/reorder-slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    assert.equal(res3.status, 400);
  } finally {
    server.close();
    await fs.rm(tmpDecksDir, { recursive: true, force: true }).catch(() => {});
  }
});

test("reorder-slides endpoint rejects invalid order arrays", async () => {
  const tmpDecksDir = await fs.mkdtemp(path.join(os.tmpdir(), "decks-invalid-order-"));
  const deckId = "test_deck_invalid_order";
  const deckPath = path.join(tmpDecksDir, deckId);
  await fs.mkdir(deckPath, { recursive: true });

  const initialManifest = {
    id: deckId,
    title: "Test Deck Invalid Order",
    totalSlides: 3,
    slides: [
      { number: 1, title: "Slide 1" },
      { number: 2, title: "Slide 2" },
      { number: 3, title: "Slide 3" }
    ]
  };

  await fs.writeFile(path.join(deckPath, "manifest.json"), JSON.stringify(initialManifest, null, 2), "utf-8");

  const app = createApp({ decksDir: tmpDecksDir });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    // Array length mismatch
    const res1 = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/reorder-slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: [1, 2] })
    });
    assert.equal(res1.status, 400);
    const err1 = await res1.json();
    assert.match(err1.error, /must match slide count/i);

    // Duplicate slide numbers
    const res2 = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/reorder-slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: [1, 1, 3] })
    });
    assert.equal(res2.status, 400);
    const err2 = await res2.json();
    assert.match(err2.error, /duplicate slide number/i);

    // Non-existent slide number
    const res3 = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/reorder-slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: [1, 2, 99] })
    });
    assert.equal(res3.status, 400);
    const err3 = await res3.json();
    assert.match(err3.error, /does not exist/i);
  } finally {
    server.close();
    await fs.rm(tmpDecksDir, { recursive: true, force: true }).catch(() => {});
  }
});

test("reorder-slides returns 404 for nonexistent deck", async () => {
  const tmpDecksDir = await fs.mkdtemp(path.join(os.tmpdir(), "decks-404-"));
  const app = createApp({ decksDir: tmpDecksDir });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/decks/non_existent_deck/reorder-slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromIndex: 0, toIndex: 1 })
    });
    assert.equal(res.status, 404);
  } finally {
    server.close();
    await fs.rm(tmpDecksDir, { recursive: true, force: true }).catch(() => {});
  }
});

test("UI templates and scripts contain slide drag-and-drop elements and handlers", async () => {
  const html = await fs.readFile(path.join(ROOT_DIR, "public", "index.html"), "utf-8");
  assert.match(html, /id="slideOrderStatusBadge"/, "index.html must include slideOrderStatusBadge");

  const css = await fs.readFile(path.join(ROOT_DIR, "public", "css", "styles.css"), "utf-8");
  assert.match(css, /\.thumb-item\[draggable="true"\]/, "styles.css must have draggable thumbnail rule");
  assert.match(css, /\.thumb-item\.is-dragging/, "styles.css must style dragging state");
  assert.match(css, /\.drop-target-above/, "styles.css must have drop-target-above indicator");
  assert.match(css, /\.drop-target-below/, "styles.css must have drop-target-below indicator");
  assert.match(css, /\.slide-order-status/, "styles.css must style slide-order-status badge");

  const js = await fs.readFile(path.join(ROOT_DIR, "public", "js", "app.js"), "utf-8");
  assert.match(js, /function\s+moveSlideOrder\s*\(/, "app.js must define moveSlideOrder");
  assert.match(js, /function\s+persistSlideOrder\s*\(/, "app.js must define persistSlideOrder");
  assert.match(js, /\/api\/decks\/.*\/reorder-slides/, "app.js must invoke reorder-slides endpoint");
  assert.match(js, /thumb\.setAttribute\("draggable",\s*"true"\)/, "app.js must set draggable on thumb items");
  assert.match(js, /dragstart/, "app.js must listen for dragstart");
  assert.match(js, /dragover/, "app.js must listen for dragover");
  assert.match(js, /drop/, "app.js must listen for drop");
});
