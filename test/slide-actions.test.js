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

test("DELETE /api/decks/:deckId/slides/:slideNum deletes slide, renumbers remaining slides, and persists to disk", async () => {
  const tmpDecksDir = await fs.mkdtemp(path.join(os.tmpdir(), "decks-delete-test-"));
  const deckId = "test_deck_delete";
  const deckPath = path.join(tmpDecksDir, deckId);
  await fs.mkdir(deckPath, { recursive: true });

  const initialManifest = {
    id: deckId,
    title: "Test Deck Delete",
    totalSlides: 3,
    slides: [
      { number: 1, title: "Slide 1", imageUrl: "/slides/s1.png" },
      { number: 2, title: "Slide 2 to Delete", imageUrl: "/slides/s2.png" },
      { number: 3, title: "Slide 3", imageUrl: "/slides/s3.png" }
    ]
  };

  await fs.writeFile(path.join(deckPath, "manifest.json"), JSON.stringify(initialManifest, null, 2), "utf-8");

  const app = createApp({ decksDir: tmpDecksDir });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    // Delete slide number 2
    const res = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/slides/2`, {
      method: "DELETE"
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.totalSlides, 2);
    assert.equal(data.manifest.slides.length, 2);

    // Old Slide 3 is now Slide 2 with updated number
    assert.equal(data.manifest.slides[0].imageUrl, "/slides/s1.png");
    assert.equal(data.manifest.slides[0].number, 1);
    assert.equal(data.manifest.slides[1].imageUrl, "/slides/s3.png");
    assert.equal(data.manifest.slides[1].number, 2);
    assert.equal(data.manifest.slides[1].title, "Slide 2");

    // Check disk manifest persistence
    const saved = JSON.parse(await fs.readFile(path.join(deckPath, "manifest.json"), "utf-8"));
    assert.equal(saved.totalSlides, 2);
    assert.equal(saved.slides[1].imageUrl, "/slides/s3.png");
    assert.equal(saved.slides[1].number, 2);
  } finally {
    server.close();
    await fs.rm(tmpDecksDir, { recursive: true, force: true }).catch(() => {});
  }
});

test("DELETE /api/decks/:deckId/slides/:slideNum rejects deleting the only remaining slide", async () => {
  const tmpDecksDir = await fs.mkdtemp(path.join(os.tmpdir(), "decks-delete-single-"));
  const deckId = "test_deck_single";
  const deckPath = path.join(tmpDecksDir, deckId);
  await fs.mkdir(deckPath, { recursive: true });

  const initialManifest = {
    id: deckId,
    title: "Test Single Slide",
    totalSlides: 1,
    slides: [{ number: 1, title: "Sole Slide", imageUrl: "/slides/sole.png" }]
  };

  await fs.writeFile(path.join(deckPath, "manifest.json"), JSON.stringify(initialManifest, null, 2), "utf-8");

  const app = createApp({ decksDir: tmpDecksDir });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/slides/1`, {
      method: "DELETE"
    });

    assert.equal(res.status, 400);
    const err = await res.json();
    assert.match(err.error, /only remaining slide/i);
  } finally {
    server.close();
    await fs.rm(tmpDecksDir, { recursive: true, force: true }).catch(() => {});
  }
});

test("DELETE /api/decks/:deckId/slides/:slideNum returns 404 for invalid slide or missing deck", async () => {
  const tmpDecksDir = await fs.mkdtemp(path.join(os.tmpdir(), "decks-delete-404-"));
  const deckId = "test_deck_404";
  const deckPath = path.join(tmpDecksDir, deckId);
  await fs.mkdir(deckPath, { recursive: true });

  const initialManifest = {
    id: deckId,
    title: "Test Deck 404",
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
    // Missing slide number
    const res1 = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/slides/99`, {
      method: "DELETE"
    });
    assert.equal(res1.status, 404);

    // Missing deck
    const res2 = await fetch(`http://127.0.0.1:${port}/api/decks/non_existent_deck/slides/1`, {
      method: "DELETE"
    });
    assert.equal(res2.status, 404);
  } finally {
    server.close();
    await fs.rm(tmpDecksDir, { recursive: true, force: true }).catch(() => {});
  }
});

test("POST /api/decks/:deckId/slides/:slideNum/toggle-hide toggles slide.hidden status and persists to disk", async () => {
  const tmpDecksDir = await fs.mkdtemp(path.join(os.tmpdir(), "decks-hide-test-"));
  const deckId = "test_deck_hide";
  const deckPath = path.join(tmpDecksDir, deckId);
  await fs.mkdir(deckPath, { recursive: true });

  const initialManifest = {
    id: deckId,
    title: "Test Deck Hide",
    totalSlides: 2,
    slides: [
      { number: 1, title: "Slide 1", hidden: false },
      { number: 2, title: "Slide 2" }
    ]
  };

  await fs.writeFile(path.join(deckPath, "manifest.json"), JSON.stringify(initialManifest, null, 2), "utf-8");

  const app = createApp({ decksDir: tmpDecksDir });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    // Toggle slide 1 to hidden
    const res1 = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/slides/1/toggle-hide`, {
      method: "POST"
    });
    assert.equal(res1.status, 200);
    const data1 = await res1.json();
    assert.equal(data1.hidden, true);

    const saved1 = JSON.parse(await fs.readFile(path.join(deckPath, "manifest.json"), "utf-8"));
    assert.equal(saved1.slides[0].hidden, true);

    // Toggle slide 1 back to unhidden
    const res2 = await fetch(`http://127.0.0.1:${port}/api/decks/${deckId}/slides/1/toggle-hide`, {
      method: "POST"
    });
    assert.equal(res2.status, 200);
    const data2 = await res2.json();
    assert.equal(data2.hidden, false);

    const saved2 = JSON.parse(await fs.readFile(path.join(deckPath, "manifest.json"), "utf-8"));
    assert.equal(saved2.slides[0].hidden, false);
  } finally {
    server.close();
    await fs.rm(tmpDecksDir, { recursive: true, force: true }).catch(() => {});
  }
});

test("UI contains thumbnail action buttons and hidden indicators", async () => {
  const html = await fs.readFile(path.join(ROOT_DIR, "public", "index.html"), "utf-8");
  assert.match(html, /id="slideHiddenBadge"/, "index.html must include slideHiddenBadge in slide counter");

  const css = await fs.readFile(path.join(ROOT_DIR, "public", "css", "styles.css"), "utf-8");
  assert.match(css, /\.thumb-actions/, "styles.css must style .thumb-actions toolbar");
  assert.match(css, /\.thumb-action-btn/, "styles.css must style .thumb-action-btn");
  assert.match(css, /\.thumb-drag-handle/, "styles.css must style .thumb-drag-handle");
  assert.match(css, /\.thumb-hide-btn/, "styles.css must style .thumb-hide-btn");
  assert.match(css, /\.thumb-delete-btn/, "styles.css must style .thumb-delete-btn");
  assert.match(css, /\.thumb-item\.is-hidden/, "styles.css must style hidden thumbnail items");
  assert.match(css, /\.hidden-slide-viewer-badge/, "styles.css must style hidden-slide-viewer-badge");

  const js = await fs.readFile(path.join(ROOT_DIR, "public", "js", "app.js"), "utf-8");
  assert.match(js, /function\s+toggleHideSlide\s*\(/, "app.js must define toggleHideSlide");
  assert.match(js, /function\s+deleteSlide\s*\(/, "app.js must define deleteSlide");
  assert.match(js, /thumb-actions/, "app.js must construct thumb-actions toolbar");
  assert.match(js, /thumb-delete-btn/, "app.js must attach delete button");
  assert.match(js, /thumb-hide-btn/, "app.js must attach hide button");
});
