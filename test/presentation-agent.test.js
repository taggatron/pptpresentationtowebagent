import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AGENT_PATHWAYS,
  DEFAULT_AGENT_PATHWAY,
  normalizeAgentPathway
} from "../src/agent-config.js";
import { createStarterCellGrid } from "../src/gemini-segmenter.js";
import { generateGeminiSlideImage } from "../src/gemini-image-gen.js";
import {
  buildTargetedRevisionPrompt,
  createApp,
  normalizeEditTarget
} from "../src/server.js";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(TEST_DIR, "..");
const LESSON_ONE_MANIFEST = path.join(
  ROOT_DIR,
  "public",
  "decks",
  "Lesson_01_CELL_STRUCTURE",
  "manifest.json"
);

test("Google Gemini image chat is the default agent pathway", () => {
  assert.equal(DEFAULT_AGENT_PATHWAY, AGENT_PATHWAYS.GEMINI_IMAGE_CHAT);
  assert.equal(normalizeAgentPathway(undefined), AGENT_PATHWAYS.GEMINI_IMAGE_CHAT);
  assert.equal(normalizeAgentPathway("not-a-pathway"), AGENT_PATHWAYS.GEMINI_IMAGE_CHAT);
});

test("Lesson 1 starter grid contains six valid answer masks", () => {
  const cells = createStarterCellGrid();
  assert.equal(cells.length, 6);
  assert.deepEqual(
    cells.map((cell) => [cell.row, cell.col]),
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 0],
      [2, 1]
    ]
  );

  for (const cell of cells) {
    assert.ok(cell.question.length > 10);
    assert.ok(cell.expectedAnswer.length > 2);
    assert.ok(cell.answerBounds.x >= 0);
    assert.ok(cell.answerBounds.y >= 0);
    assert.ok(cell.answerBounds.x + cell.answerBounds.w <= 100);
    assert.ok(cell.answerBounds.y + cell.answerBounds.h <= 100);
  }
});

test("component editing is rendered in the sidebar, not a modal", async () => {
  const html = await fs.readFile(path.join(ROOT_DIR, "public", "index.html"), "utf-8");
  assert.match(html, /id="componentEditorView"/);
  assert.match(html, /id="componentList"/);
  assert.match(html, /id="agentPathwaySelect"/);
  assert.match(html, /id="editTargetOverlay"/);
  assert.match(html, /id="selectedTargetSummary"/);
  assert.match(html, /Typed instructions · no microphone/);
  assert.doesNotMatch(html, /id="componentEditorModal"/);
});

test("click targets are normalized and encoded into a selective edit prompt", () => {
  const target = normalizeEditTarget({
    type: "region",
    id: "region_4",
    label: "Cell diagram",
    bounds: { x: 71.2, y: 28.4, w: 40, h: 30 },
    point: { x: 82.5, y: 41.3 }
  });

  assert.deepEqual(target.bounds, { x: 71.2, y: 28.4, w: 28.8, h: 30 });
  assert.deepEqual(target.point, { x: 82.5, y: 41.3 });

  const prompt = buildTargetedRevisionPrompt(
    "Make this diagram larger.",
    target
  );
  assert.match(prompt, /Revise only the selected component/);
  assert.match(prompt, /Cell diagram/);
  assert.match(prompt, /left 71\.2%/);
  assert.match(prompt, /only editable area/);
  assert.match(prompt, /Do not return the target area/);
});

test("converted Biology Lesson 1 manifest is complete and interactive", async () => {
  const manifest = JSON.parse(await fs.readFile(LESSON_ONE_MANIFEST, "utf-8"));
  const slideTwo = manifest.slides.find((slide) => slide.number === 2);

  assert.equal(manifest.id, "Lesson_01_CELL_STRUCTURE");
  assert.equal(manifest.totalSlides, 15);
  assert.equal(manifest.agent.defaultPathway, AGENT_PATHWAYS.GEMINI_IMAGE_CHAT);
  assert.equal(slideTwo.interactiveCells.length, 6);
  assert.equal(slideTwo.serialAnimation.totalBuildSteps, 6);
  assert.equal(slideTwo.hasProgressiveBuilds, false);
  assert.equal(slideTwo.progressiveBuilds, undefined);
});

test("server exposes the Gemini default and the Lesson 1 deck", async (t) => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const pathwaysResponse = await fetch(`${baseUrl}/api/agent-pathways`);
  assert.equal(pathwaysResponse.status, 200);
  const pathways = await pathwaysResponse.json();
  assert.equal(pathways.defaultPathway, AGENT_PATHWAYS.GEMINI_IMAGE_CHAT);

  const decksResponse = await fetch(`${baseUrl}/api/decks`);
  assert.equal(decksResponse.status, 200);
  const decks = await decksResponse.json();
  assert.equal(decks.defaultDeckId, "Lesson_01_CELL_STRUCTURE");

  const deckResponse = await fetch(
    `${baseUrl}/api/decks/Lesson_01_CELL_STRUCTURE`
  );
  assert.equal(deckResponse.status, 200);
  const deck = await deckResponse.json();
  assert.equal(deck.totalSlides, 15);

  const revisionResponse = await fetch(
    `${baseUrl}/api/decks/Lesson_01_CELL_STRUCTURE/slides/2/revise`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptText: "Make the selected answer label larger.",
        componentId: "cell_1",
        editTarget: {
          type: "component",
          id: "cell_1",
          label: "Answer 1",
          bounds: { x: 5.2, y: 34.5, w: 43.6, h: 9 },
          point: { x: 27, y: 39 }
        },
        dispatch: false
      })
    }
  );
  assert.equal(revisionResponse.status, 200);
  const revision = await revisionResponse.json();
  assert.equal(revision.pathway, AGENT_PATHWAYS.GEMINI_IMAGE_CHAT);
  assert.equal(revision.dispatched, false);
  assert.equal(revision.editTarget.id, "cell_1");
  assert.match(revision.prompt, /Answer 1/);
  assert.match(revision.prompt, /Make the selected answer label larger/);

  const dedicatedEndpointResponse = await fetch(
    `${baseUrl}/api/decks/Lesson_01_CELL_STRUCTURE/slides/2/generate-gemini-image`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptText: "Dedicated endpoint prompt.",
        dispatch: false
      })
    }
  );
  assert.equal(dedicatedEndpointResponse.status, 200);
  const dedicatedResult = await dedicatedEndpointResponse.json();
  assert.equal(dedicatedResult.pathway, AGENT_PATHWAYS.GEMINI_IMAGE_CHAT);
  assert.equal(dedicatedResult.dispatched, false);
  assert.match(dedicatedResult.prompt, /Dedicated endpoint prompt/);
});

test("generateGeminiSlideImage handles missing images and queued dispatch", async () => {
  const slideImage = path.join(
    ROOT_DIR,
    "public",
    "decks",
    "Lesson_01_CELL_STRUCTURE",
    "slides",
    "slide_01.png"
  );

  const queued = await generateGeminiSlideImage(
    "Lesson_01_CELL_STRUCTURE",
    1,
    slideImage,
    "Test prompt",
    { dispatch: false }
  );

  assert.equal(queued.success, true);
  assert.equal(queued.pathway, AGENT_PATHWAYS.GEMINI_IMAGE_CHAT);
  assert.equal(queued.dispatched, false);
  assert.equal(queued.status, "Dispatch was disabled for this run.");

  await assert.rejects(
    async () => {
      await generateGeminiSlideImage(
        "Lesson_01_CELL_STRUCTURE",
        1,
        path.join(ROOT_DIR, "non_existent_slide.png"),
        "Test prompt",
        { dispatch: false }
      );
    },
    { code: "ENOENT" }
  );
});

test("generateGeminiSlideImage checks CDP tabs when dispatch is enabled", async (t) => {
  const server = http.createServer((req, res) => {
    if (req.url === "/json/list") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify([{ id: "1", url: "https://example.com" }]));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  const cdpEndpoint = `http://127.0.0.1:${address.port}`;
  const slideImage = path.join(
    ROOT_DIR,
    "public",
    "decks",
    "Lesson_01_CELL_STRUCTURE",
    "slides",
    "slide_01.png"
  );

  const result = await generateGeminiSlideImage(
    "Lesson_01_CELL_STRUCTURE",
    1,
    slideImage,
    "Test prompt with mock CDP",
    { cdpEndpoint, dispatch: true }
  );

  assert.equal(result.success, true);
  assert.equal(result.dispatched, false);
  assert.equal(result.status, "Chrome is connected, but no Gemini tab is open.");
});
