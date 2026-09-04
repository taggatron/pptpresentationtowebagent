import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import {
  createApp,
  formatDisplayTitle,
  inferSlideSetId,
  KNOWN_SLIDE_SETS
} from "../src/server.js";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(TEST_DIR, "..");

test("formatDisplayTitle formats lesson filenames into human titles", () => {
  assert.equal(formatDisplayTitle("Lesson_01_CELL_STRUCTURE"), "1. Cell Structure");
  assert.equal(formatDisplayTitle("Lesson_02_MICROSCOPES"), "2. Microscopes");
  assert.equal(formatDisplayTitle("Lesson_11_PHOTOSYNTHESIS"), "11. Photosynthesis");
  assert.equal(formatDisplayTitle("digital_literacy_conference_deck"), "Digital literacy conference deck");
});

test("inferSlideSetId maps decks to appropriate slide set categories", () => {
  assert.equal(inferSlideSetId("Lesson_01_CELL_STRUCTURE"), "cell_biology");
  assert.equal(inferSlideSetId("Lesson_02_MICROSCOPES"), "cell_biology");
  assert.equal(inferSlideSetId("digital_literacy_conference_deck"), "digital_literacy");
  assert.equal(inferSlideSetId("Lesson_01_THE_PERIODIC_TABLE"), "chemistry");
  assert.equal(inferSlideSetId("Lesson_01_Forces_and_NEWTON_S_1st_LAW"), "forces_energy");
  assert.equal(inferSlideSetId("Lesson_01_Reaction_rates"), "reaction_rates");
  assert.equal(inferSlideSetId("custom_deck_123"), "other");
});

test("Slide Sets API returns categorized slide sets and default IDs", async () => {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/slide-sets`);
    assert.equal(res.status, 200);
    const data = await res.json();

    assert.ok(Array.isArray(data.slideSets));
    assert.ok(data.slideSets.length >= 2, "Should return multiple slide sets");

    // Verify cell biology slide set is present
    const cellBioSet = data.slideSets.find((s) => s.id === "cell_biology");
    assert.ok(cellBioSet, "Cell biology slide set should be present");
    assert.ok(cellBioSet.decks.length >= 11, "Cell biology should contain at least 11 lessons");
    assert.ok(cellBioSet.decks.some((d) => d.id === "Lesson_01_CELL_STRUCTURE"));

    // Verify digital literacy slide set is present
    const digitalSet = data.slideSets.find((s) => s.id === "digital_literacy");
    assert.ok(digitalSet, "Digital literacy slide set should be present");
    assert.ok(digitalSet.decks.some((d) => d.id === "digital_literacy_conference_deck"));

    // Verify default IDs
    assert.equal(data.defaultSlideSetId, "cell_biology");
    assert.ok(data.defaultDeckId);
  } finally {
    server.close();
  }
});

test("index.html contains slide set and lesson selectors without visible duplicate title", async () => {
  const html = await fs.readFile(path.join(ROOT_DIR, "public", "index.html"), "utf-8");

  // Verify slide set selector exists
  assert.match(html, /id="slideSetSelect"/);
  assert.match(html, /class="[^"]*slide-set-select[^"]*"/);

  // Verify lesson selector exists
  assert.match(html, /id="deckSelect"/);

  // Verify no visible duplicate header-center deck title
  assert.doesNotMatch(html, /<div class="header-center">\s*<h1 id="deckTitle"/);

  // Verify accessible screen reader heading exists
  assert.match(html, /id="srDeckTitle"\s+class="sr-only"/);
});

test("GET /api/decks/:deckId automatically extracts unextracted deck from available sequence", async () => {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/decks/Lesson_01_THE_PERIODIC_TABLE`);
    assert.equal(res.status, 200);
    const manifest = await res.json();
    assert.equal(manifest.id, "Lesson_01_THE_PERIODIC_TABLE");
    assert.ok(manifest.totalSlides > 0);
    assert.ok(manifest.slides.length > 0);
  } finally {
    server.close();
  }
});

