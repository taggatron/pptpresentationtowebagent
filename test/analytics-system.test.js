import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import {
  classifySlideLessonPhase,
  analyzeDeckLessonPhases,
  LESSON_PHASE_BENCHMARKS,
  LESSON_PHASES
} from "../src/lesson-phase-classifier.js";
import {
  startTrackingSession,
  recordSlideDwell,
  finishTrackingSession,
  getDeckAnalytics,
  formatDuration
} from "../src/analytics-db.js";
import { createApp } from "../src/server.js";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));

test("Lesson Phase Classifier defines correct pedagogical benchmarks matching reference image", () => {
  assert.equal(LESSON_PHASE_BENCHMARKS.starter.targetPercentage, 10);
  assert.equal(LESSON_PHASE_BENCHMARKS.starter.color, "#3c73a8");
  assert.equal(LESSON_PHASE_BENCHMARKS.direct_instruction.targetPercentage, 10);
  assert.equal(LESSON_PHASE_BENCHMARKS.direct_instruction.color, "#f28522");
  assert.equal(LESSON_PHASE_BENCHMARKS.modelling.targetPercentage, 10);
  assert.equal(LESSON_PHASE_BENCHMARKS.modelling.color, "#fb923c");
  assert.equal(LESSON_PHASE_BENCHMARKS.guided_practice.targetPercentage, 25);
  assert.equal(LESSON_PHASE_BENCHMARKS.guided_practice.color, "#e05353");
  assert.equal(LESSON_PHASE_BENCHMARKS.independent_practice.targetPercentage, 35);
  assert.equal(LESSON_PHASE_BENCHMARKS.independent_practice.color, "#65aba0");
  assert.equal(LESSON_PHASE_BENCHMARKS.plenary.targetPercentage, 10);
  assert.equal(LESSON_PHASE_BENCHMARKS.plenary.color, "#529c42");

  // Sum of all target percentages must equal 100%
  const total = Object.values(LESSON_PHASE_BENCHMARKS).reduce(
    (sum, p) => sum + p.targetPercentage,
    0
  );
  assert.equal(total, 100);
});

test("Lesson Phase Classifier maps Classic_Lesson_01_Ecosystems slides accurately", () => {
  const slide1 = classifySlideLessonPhase(
    { number: 1, title: "Ecosystems Title" },
    "Classic_Lesson_01_Ecosystems"
  );
  assert.equal(slide1.phaseKey, "direct_instruction");

  const slide2 = classifySlideLessonPhase(
    { number: 2, title: "Do Now Starter Recall" },
    "Classic_Lesson_01_Ecosystems"
  );
  assert.equal(slide2.phaseKey, "starter");

  const slide4 = classifySlideLessonPhase(
    { number: 4, title: "Teacher Modeling Demo" },
    "Classic_Lesson_01_Ecosystems"
  );
  assert.equal(slide4.phaseKey, "modelling");

  const slide5 = classifySlideLessonPhase(
    { number: 5, title: "Interactive Challenge" },
    "Classic_Lesson_01_Ecosystems"
  );
  assert.equal(slide5.phaseKey, "guided_practice");

  const slide8 = classifySlideLessonPhase(
    { number: 8, title: "OCR Exam Questions & Mark Scheme" },
    "Classic_Lesson_01_Ecosystems"
  );
  assert.equal(slide8.phaseKey, "independent_practice");

  const slide17 = classifySlideLessonPhase(
    { number: 17, title: "Exit Ticket & Summary" },
    "Classic_Lesson_01_Ecosystems"
  );
  assert.equal(slide17.phaseKey, "plenary");
});

test("Analytics DB manages sessions, slide dwell recording, and aggregation", () => {
  const testDeckId = "test_deck_analytics_" + Date.now();
  const session = startTrackingSession(testDeckId, 17);

  assert.ok(session.id);
  assert.equal(session.deckId, testDeckId);
  assert.equal(session.status, "recording");

  // Record dwell on slide 1 (starter, 60s)
  const rec1 = recordSlideDwell(session.id, testDeckId, 0, 1, 60000, "starter");
  assert.equal(rec1.dwellMs, 60000);
  assert.equal(rec1.visitCount, 1);

  // Record dwell on slide 2 (direct instruction, 120s)
  const rec2 = recordSlideDwell(session.id, testDeckId, 1, 2, 120000, "direct_instruction");
  assert.equal(rec2.dwellMs, 120000);

  // Finish session
  const summary = finishTrackingSession(session.id, testDeckId);
  assert.ok(summary);
  assert.equal(summary.status, "completed");
  assert.ok(summary.durationMs >= 180000);

  // Query deck analytics
  const deckData = getDeckAnalytics(testDeckId);
  assert.equal(deckData.deckId, testDeckId);
  assert.equal(deckData.totalSessions, 1);
  assert.ok(deckData.totalDurationMs >= 180000);
  assert.equal(deckData.slides.length, 2);

  const starterPhase = deckData.phaseBreakdown.find((p) => p.phaseKey === "starter");
  assert.ok(starterPhase);
  assert.equal(starterPhase.totalDwellMs, 60000);
});

test("formatDuration formats milliseconds correctly", () => {
  assert.equal(formatDuration(0), "0s");
  assert.equal(formatDuration(45000), "45s");
  assert.equal(formatDuration(60000), "1m 00s");
  assert.equal(formatDuration(125000), "2m 05s");
});

test("Express Analytics Endpoints handle tracking lifecycle and deck inspection", async () => {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. GET /api/analytics/phase-definitions
    const defRes = await fetch(`${baseUrl}/api/analytics/phase-definitions`);
    assert.equal(defRes.status, 200);
    const defData = await defRes.json();
    assert.equal(defData.success, true);
    assert.ok(defData.benchmarks.starter);
    assert.ok(defData.benchmarks.independent_practice);

    // 2. POST /api/analytics/session/start
    const startRes = await fetch(`${baseUrl}/api/analytics/session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deckId: "Classic_Lesson_01_Ecosystems",
        totalSlides: 17
      })
    });
    assert.equal(startRes.status, 200);
    const startData = await startRes.json();
    assert.equal(startData.success, true);
    assert.ok(startData.session.id);
    const sessionId = startData.session.id;

    // 3. POST /api/analytics/session/heartbeat
    const beatRes = await fetch(`${baseUrl}/api/analytics/session/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        deckId: "Classic_Lesson_01_Ecosystems",
        slideIndex: 1,
        slideNumber: 2,
        dwellMs: 45000,
        phaseKey: "starter"
      })
    });
    assert.equal(beatRes.status, 200);
    const beatData = await beatRes.json();
    assert.equal(beatData.success, true);

    // 4. POST /api/analytics/session/finish
    const finishRes = await fetch(`${baseUrl}/api/analytics/session/finish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        deckId: "Classic_Lesson_01_Ecosystems"
      })
    });
    assert.equal(finishRes.status, 200);
    const finishData = await finishRes.json();
    assert.equal(finishData.success, true);

    // 5. GET /api/analytics/deck/Classic_Lesson_01_Ecosystems
    const deckRes = await fetch(`${baseUrl}/api/analytics/deck/Classic_Lesson_01_Ecosystems`);
    assert.equal(deckRes.status, 200);
    const deckAnalytics = await deckRes.json();
    assert.equal(deckAnalytics.success, true);
    assert.equal(deckAnalytics.deckId, "Classic_Lesson_01_Ecosystems");
    assert.equal(deckAnalytics.totalSlides, 17);
    assert.ok(deckAnalytics.phases.length >= 6);
    assert.ok(deckAnalytics.slides.length === 17);

    const starterPhase = deckAnalytics.phases.find((p) => p.phaseKey === "starter");
    assert.ok(starterPhase);
    assert.equal(starterPhase.targetPercentage, 10);
  } finally {
    server.close();
  }
});
