import test from "node:test";
import assert from "node:assert/strict";
import {
  SLIDE_ANALYSIS_SCHEMA_VERSION,
  buildGeminiSlideAnalysisPrompt,
  normalizeGeminiSlideAnalysis,
  processSerialBuildSteps
} from "../src/gemini-editor.js";

function component(id, role, dependencies = [], overrides = {}) {
  return {
    id,
    role,
    position: "whole-slide region",
    visibleText: id,
    dependencies,
    ...overrides
  };
}

function validAnalysis(overrides = {}) {
  return {
    schemaVersion: SLIDE_ANALYSIS_SCHEMA_VERSION,
    title: "The Visible Slide Title",
    description: "A title above two related instructional regions.",
    layout: "Title across the top, content flowing from left to right.",
    components: [
      component("Title Block", "title"),
      component("First Panel", "content-panel", ["Title Block"]),
      component("Second Panel", "content-panel", ["First Panel"])
    ],
    isQuestionSlide: false,
    recommendedStrategy: "component reveal",
    recommendedBuilds: [
      {
        id: "Build 1",
        label: "Title and first panel",
        componentIds: ["Title Block", "First Panel"],
        cumulative: true
      },
      {
        id: "Build 2",
        label: "Complete slide",
        componentIds: ["Title Block", "First Panel", "Second Panel"],
        cumulative: true
      }
    ],
    ...overrides
  };
}

test("slide-analysis prompt establishes the pixel-grounded JSON contract", () => {
  const prompt = buildGeminiSlideAnalysisPrompt({
    deckTitle: "11. Photosynthesis",
    slideNumber: 8,
    knownQuestionCount: 4
  });

  assert.match(prompt, /sole visual and factual authority/i);
  assert.match(prompt, /Deck context: 11\. Photosynthesis/);
  assert.match(prompt, /Slide number: 8/);
  assert.match(prompt, /Known reviewed question count: 4/);
  assert.match(prompt, /"schemaVersion": 1/);
  assert.match(prompt, /"title": "exact visible slide title"/);
  assert.match(prompt, /"description"/);
  assert.match(prompt, /"layout"/);
  assert.match(prompt, /"visibleText"/);
  assert.match(prompt, /"dependencies"/);
  assert.match(prompt, /"recommendedBuilds"/);
  assert.match(prompt, /between 1 and 4 full-canvas cumulative builds/i);
  assert.match(prompt, /Do not invent a process, sequence, comparison, equation/i);
  assert.match(prompt, /cropping, zooming, spotlighting, dimming/i);
  assert.match(prompt, /exactly one unanswered full-slide base build/i);
  assert.match(prompt, /reviewed answers will be rendered later as exact web overlays/i);
  assert.match(prompt, /Return JSON only/i);
});

test("normalizer sanitizes stable ids and preserves a valid cumulative plan", () => {
  const normalized = normalizeGeminiSlideAnalysis(
    `\n\`\`\`json\n${JSON.stringify(validAnalysis())}\n\`\`\`\n`,
    { slide: {} }
  );

  assert.equal(normalized.schemaVersion, SLIDE_ANALYSIS_SCHEMA_VERSION);
  assert.equal(normalized.title, "The Visible Slide Title");
  assert.equal(normalized.recommendedStrategy, "component-reveal");
  assert.deepEqual(
    normalized.components.map((entry) => entry.id),
    ["title_block", "first_panel", "second_panel"]
  );
  assert.deepEqual(normalized.components[1].dependencies, ["title_block"]);
  assert.deepEqual(normalized.recommendedBuilds[0].componentIds, [
    "title_block",
    "first_panel"
  ]);
  assert.deepEqual(normalized.recommendedBuilds[1].componentIds, [
    "title_block",
    "first_panel",
    "second_panel"
  ]);
  assert.ok(normalized.recommendedBuilds.every((build) => build.cumulative === true));
});

test("normalizer rejects unknown, non-cumulative, and incomplete build references", () => {
  const unknown = validAnalysis();
  unknown.recommendedBuilds[0].componentIds.push("Invented Diagram");
  assert.throws(
    () => normalizeGeminiSlideAnalysis(unknown),
    /unknown component Invented Diagram/i
  );

  const nonCumulative = validAnalysis();
  nonCumulative.recommendedBuilds[1].componentIds = ["Title Block", "Second Panel"];
  assert.throws(
    () => normalizeGeminiSlideAnalysis(nonCumulative),
    /not cumulative.*(?:first_panel|First Panel)/i
  );

  const incomplete = validAnalysis();
  incomplete.recommendedBuilds = [incomplete.recommendedBuilds[0]];
  assert.throws(
    () => normalizeGeminiSlideAnalysis(incomplete),
    /Final build is incomplete.*second_panel/i
  );
});

test("normalizer enforces dependency validity and acyclic component analysis", () => {
  const missingDependency = validAnalysis();
  missingDependency.recommendedBuilds[0].componentIds = ["First Panel"];
  assert.throws(
    () => normalizeGeminiSlideAnalysis(missingDependency),
    /without dependency title_block/i
  );

  const cyclic = validAnalysis();
  cyclic.components[0].dependencies = ["Second Panel"];
  assert.throws(() => normalizeGeminiSlideAnalysis(cyclic), /dependency cycle/i);
});

test("question slides normalize to one unanswered base and exclude answer components", () => {
  const raw = {
    schemaVersion: SLIDE_ANALYSIS_SCHEMA_VERSION,
    title: "Knowledge Check",
    description: "One visible question with its answer printed below.",
    layout: "Question at top and answer box at bottom.",
    components: [
      component("Question", "question"),
      component("Diagram", "diagram", ["Question"]),
      component("Reviewed Answer", "answer", ["Question"])
    ],
    isQuestionSlide: true,
    recommendedStrategy: "question-base-overlay",
    recommendedBuilds: [
      {
        id: "Unanswered Base",
        label: "Question only",
        componentIds: ["Question", "Diagram"],
        cumulative: true
      }
    ]
  };

  const normalized = normalizeGeminiSlideAnalysis(raw, {
    slide: { interactiveCells: [{ question: "What is shown?" }] }
  });
  assert.equal(normalized.isQuestionSlide, true);
  assert.equal(normalized.recommendedBuilds.length, 1);
  assert.deepEqual(normalized.recommendedBuilds[0].componentIds, ["question", "diagram"]);

  const answerLeaked = structuredClone(raw);
  answerLeaked.recommendedBuilds[0].componentIds.push("Reviewed Answer");
  assert.throws(
    () => normalizeGeminiSlideAnalysis(answerLeaked),
    /must omit answer component reviewed_answer/i
  );

  const twoBuilds = structuredClone(raw);
  twoBuilds.recommendedBuilds.push({
    id: "Answer Build",
    label: "Answer",
    componentIds: ["Question", "Diagram", "Reviewed Answer"],
    cumulative: true
  });
  assert.throws(
    () => normalizeGeminiSlideAnalysis(twoBuilds),
    /exactly one unanswered base build/i
  );
});

test("normalizer does not permit reviewed question slides to be downgraded", () => {
  assert.throws(
    () =>
      normalizeGeminiSlideAnalysis(validAnalysis(), {
        slide: { interactiveCells: [{ question: "Name the structure" }] }
      }),
    /must be marked as a question slide/i
  );
});

test("normalizer rejects invalid JSON, self-dependencies, and missing required properties", () => {
  assert.throws(
    () => normalizeGeminiSlideAnalysis("not valid json"),
    /not valid JSON|must be a JSON object/i
  );

  assert.throws(
    () => normalizeGeminiSlideAnalysis(JSON.stringify(["array instead of object"])),
    /JSON must contain one object/i
  );

  const missingTitle = validAnalysis({ title: "" });
  assert.throws(
    () => normalizeGeminiSlideAnalysis(missingTitle),
    /Slide analysis title is required/i
  );

  const selfDep = validAnalysis();
  selfDep.components[0].dependencies = ["Title Block"];
  assert.throws(
    () => normalizeGeminiSlideAnalysis(selfDep),
    /cannot depend on itself/i
  );
});

test("processSerialBuildSteps delegates to the real slide animation planner instead of hardcoded stubs", async () => {
  const slide = {
    number: 4,
    title: "The Myth of the Normal Cell",
    text: "The Myth: cells are flat 2D circles.\nThe Reality: cells are complex 3D structures.\nKey Insight: 3D geometry affects organelle positioning.",
    contentAnalysis: {
      transcript: "The Myth: cells are flat 2D circles.\nThe Reality: cells are complex 3D structures.\nKey Insight: 3D geometry affects organelle positioning.",
      role: "instructional-content"
    }
  };

  const serial = await processSerialBuildSteps(slide);
  assert.ok(serial.totalBuildSteps >= 1);
  assert.ok(Array.isArray(serial.serialSteps));
  // Must NOT have legacy stubs like ["header", "main_content", "footer_summary"]
  const allIds = serial.serialSteps.flatMap((s) => s.componentIds || []);
  assert.equal(allIds.includes("header") && allIds.includes("footer_summary"), false);
});

test("queue runner configures 1 Gemini call at a time with concurrency 1", async () => {
  const {
    buildAnalysisQueues,
    buildMissingQueues,
    runParallelBrowserQueue,
    createGeminiBrowserQueueRunner
  } = await import("../scripts/gemini-browser-queue-runner.mjs");

  const repoRoot = process.cwd();
  const deckGroups = [["Lesson_01_CELL_STRUCTURE"]];
  const analysisQueues = await buildAnalysisQueues(repoRoot, deckGroups);
  const missingQueues = await buildMissingQueues(repoRoot, deckGroups);

  assert.equal(analysisQueues.length, 1);
  assert.equal(missingQueues.length, 1);

  const runner = createGeminiBrowserQueueRunner({
    repoRoot,
    totalPlanned: 5
  });
  assert.equal(runner.progress.totalPlanned, 5);
  assert.equal(runner.progress.saved, 0);
  assert.equal(runner.progress.failed, 0);

  // When no CDP port is active, it reports clear status without crashing
  const result = await runParallelBrowserQueue({
    repoRoot,
    cdpEndpoint: "http://127.0.0.1:59999",
    concurrency: 1
  });
  assert.equal(result.success, false);
  assert.match(result.error, /Could not connect to Chrome CDP/);
});


