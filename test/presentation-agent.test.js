import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AGENT_PATHWAYS,
  DEFAULT_AGENT_PATHWAY,
  normalizeAgentPathway
} from "../src/agent-config.js";
import { createStarterCellGrid } from "../src/gemini-segmenter.js";
import { generateGeminiSlideImage } from "../src/gemini-image-gen.js";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";
import {
  validateGeneratedSlideImage,
  validateVisualQaChecklist
} from "../src/image-build-qa.js";
import { CURRENT_STARTER_DECK_IDS, getCurrentStarterGrid } from "../src/current-slide-catalog.js";
import {
  getCurrentQuestionReveal,
  listCurrentQuestionRevealSlides
} from "../src/current-question-catalog.js";
import {
  hasProtectedVideoMedia,
  isSixBoxStarterQuestionSlide,
  isOverlyComplexSlide,
  planSlideAnimation,
  removeGeneratedImageBuildsPreservingVideo,
  syncQaApprovedGeminiSequence
} from "../src/slide-animation-planner.js";
import {
  buildTargetedRevisionPrompt,
  createApp,
  normalizeEditTarget,
  reviewGeneratedBuildAsset
} from "../src/server.js";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(TEST_DIR, "..");
const DECKS_DIR = path.join(ROOT_DIR, "public", "decks");
const LESSON_ONE_MANIFEST = path.join(
  ROOT_DIR,
  "public",
  "decks",
  "Lesson_01_CELL_STRUCTURE",
  "manifest.json"
);

async function readDeckManifest(deckId) {
  return JSON.parse(
    await fs.readFile(path.join(DECKS_DIR, deckId, "manifest.json"), "utf-8")
  );
}

function assertPercentBounds(bounds, message) {
  assert.ok(bounds && typeof bounds === "object", `${message}: bounds are required`);
  for (const key of ["x", "y", "w", "h"]) {
    assert.ok(Number.isFinite(bounds[key]), `${message}: ${key} must be finite`);
  }
  assert.ok(bounds.x >= 0 && bounds.y >= 0, `${message}: origin must be on canvas`);
  assert.ok(bounds.w > 0 && bounds.h > 0, `${message}: size must be positive`);
  assert.ok(bounds.x + bounds.w <= 100.001, `${message}: width exceeds canvas`);
  assert.ok(bounds.y + bounds.h <= 100.001, `${message}: height exceeds canvas`);
}

function questionCellContract(cell) {
  return {
    id: cell.id,
    question: cell.question,
    expectedAnswer: cell.expectedAnswer,
    questionBounds: cell.questionBounds,
    bounds: cell.bounds,
    answerBounds: cell.answerBounds,
    answerRegions: cell.answerRegions,
    revealMode: cell.revealMode,
    answerVisibleInImage: cell.answerVisibleInImage,
    confidence: cell.confidence,
    provenance: cell.provenance
  };
}

function hasLegacyGenericSerialStub(slide) {
  const componentIds = (slide.serialAnimation?.serialSteps || []).flatMap(
    (step) => step.componentIds || []
  );
  return (
    componentIds.length === 3 &&
    componentIds[0] === "header" &&
    componentIds[1] === "main_content" &&
    componentIds[2] === "footer_summary"
  );
}

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
  assert.match(prompt, /complete slide canvas/);
});

test("reviewed starter grids are deck-specific and stay within the slide", () => {
  assert.equal(CURRENT_STARTER_DECK_IDS.length, 11);
  const firstQuestions = new Set();

  for (const deckId of CURRENT_STARTER_DECK_IDS) {
    const starter = getCurrentStarterGrid(deckId);
    assert.equal(starter.cells.length, 6);
    firstQuestions.add(starter.cells[0].question);
    for (const cell of starter.cells) {
      assert.equal(cell.revealMode, "unmask");
      assert.ok(cell.question.length > 8);
      assert.ok(cell.expectedAnswer.length > 1);
      assert.ok(cell.answerBounds.x >= 0 && cell.answerBounds.y >= 0);
      assert.ok(cell.answerBounds.x + cell.answerBounds.w <= 100);
      assert.ok(cell.answerBounds.y + cell.answerBounds.h <= 100);
    }
  }

  assert.ok(firstQuestions.size > 6, "starter content should not be copied between decks");
});

test("every current deck materializes its own reviewed slide-2 starter grid", async () => {
  const lessonOneQuestions = getCurrentStarterGrid("Lesson_01_CELL_STRUCTURE").cells.map(
    (cell) => cell.question
  );
  const starterSignatures = new Set();

  for (const deckId of CURRENT_STARTER_DECK_IDS) {
    const expected = getCurrentStarterGrid(deckId);
    const manifest = await readDeckManifest(deckId);
    const slide = manifest.slides.find((candidate) => candidate.number === 2);

    assert.ok(slide, `${deckId}: slide 2 is missing`);
    assert.equal(slide.interactiveType, "starter_qa_grid", `${deckId}: wrong mode`);
    assert.equal(slide.animationPlan?.mode, "question-reveal", `${deckId}: not reveal-planned`);
    assert.equal(slide.gridTitle, expected.title, `${deckId}: title is not catalogued`);
    assert.equal(slide.interactiveCells?.length, 6, `${deckId}: expected six cells`);
    assert.equal(slide.serialAnimation?.totalBuildSteps, 6, `${deckId}: reveal count drifted`);
    assert.equal(slide.hasProgressiveBuilds, false, `${deckId}: starter must not image-build`);
    assert.equal(slide.progressiveBuilds, undefined, `${deckId}: starter has media builds`);

    const actualContract = slide.interactiveCells.map(questionCellContract);
    const expectedContract = expected.cells.map(questionCellContract);
    assert.deepEqual(actualContract, expectedContract, `${deckId}: manifest/catalog mismatch`);
    starterSignatures.add(expected.cells.map((cell) => cell.question).join("\n"));

    if (deckId !== "Lesson_01_CELL_STRUCTURE") {
      assert.notDeepEqual(
        expected.cells.map((cell) => cell.question),
        lessonOneQuestions,
        `${deckId}: inherited Lesson 1's legacy starter content`
      );
    }
  }

  // Lessons 11 and 12 intentionally share the same photosynthesis retrieval
  // set; every other current deck has independently reviewed content.
  assert.equal(starterSignatures.size, 10);
});

test("reviewed question-reveal catalog separates source masks from answer overlays", () => {
  const catalogSlides = listCurrentQuestionRevealSlides();
  assert.ok(catalogSlides.length >= 14);

  const overlayCells = getCurrentQuestionReveal(
    "Lesson_08_Aerobic_respiration",
    "slide_06.png"
  );
  assert.equal(overlayCells.length, 5);
  assert.ok(overlayCells.every((cell) => cell.revealMode === "overlay"));
  assert.ok(overlayCells.every((cell) => cell.answerVisibleInImage === false));

  const maskCells = getCurrentQuestionReveal(
    "Lesson_10_FERMENTATION_PRACTICAL",
    "slide_12.png"
  );
  assert.equal(maskCells.length, 3);
  assert.ok(maskCells.every((cell) => cell.revealMode === "unmask"));
  assert.ok(maskCells.every((cell) => cell.answerVisibleInImage === true));
});

test("every reviewed question-reveal catalog entry is applied to its manifest", async () => {
  const catalogSlides = listCurrentQuestionRevealSlides();
  assert.ok(catalogSlides.length >= 30, "expected the complete Lessons 1–13 review catalog");

  for (const { deckId, imageFileName } of catalogSlides) {
    const expectedCells = getCurrentQuestionReveal(deckId, imageFileName);
    const manifest = await readDeckManifest(deckId);
    const slide = manifest.slides.find(
      (candidate) => candidate.imageFileName === imageFileName
    );
    const label = `${deckId}/${imageFileName}`;

    assert.ok(slide, `${label}: catalog points to a missing slide`);
    assert.equal(slide.interactiveType, "question_reveal", `${label}: wrong interaction`);
    assert.equal(slide.animationPlan?.mode, "gemini-image-cells", `${label}: wrong plan`);
    assert.equal(slide.animationPlan?.questionReveal, true, `${label}: Q&A semantics lost`);
    assert.equal(slide.hasProgressiveBuilds, false, `${label}: image builds replaced Q&A`);
    assert.equal(slide.progressiveBuilds, undefined, `${label}: progressive builds remain`);
    assert.equal(
      slide.geminiImageCells?.length,
      1,
      `${label}: expected one unanswered Gemini base image`
    );
    assert.equal(slide.geminiImageCells[0].strategy, "question-base-overlay");
    assert.match(slide.geminiImageCells[0].prompt, /unanswered base image/i);
    assert.ok(slide.geminiImageCells.every((cell) => cell.qaStatus === "not-started"));
    assert.equal(
      slide.serialAnimation?.totalBuildSteps,
      expectedCells.length,
      `${label}: reveal step count drifted`
    );
    assert.deepEqual(
      slide.interactiveCells.map(questionCellContract),
      expectedCells.map((cell) =>
        questionCellContract({
          ...cell,
          revealMode: "overlay",
          answerVisibleInImage: false
        })
      ),
      `${label}: applied cells differ from the reviewed catalog`
    );

    for (const [index, cell] of slide.interactiveCells.entries()) {
      assertPercentBounds(cell.bounds, `${label} cell ${index + 1} question`);
      assertPercentBounds(cell.answerBounds, `${label} cell ${index + 1} answer`);
      for (const [regionIndex, region] of (cell.answerRegions || []).entries()) {
        assertPercentBounds(region, `${label} cell ${index + 1} region ${regionIndex + 1}`);
      }
    }
  }
});

test("grouped multi-region answers survive catalog cloning and manifest planning", async () => {
  const groupedCases = [
    {
      deckId: "Lesson_03_MAGNIFICATION_CALCULATIONS",
      imageFileName: "slide_10.png",
      expectedCellCount: 1
    },
    {
      deckId: "Lesson_04_DNA",
      imageFileName: "slide_12.png",
      expectedCellCount: 4
    }
  ];

  for (const { deckId, imageFileName, expectedCellCount } of groupedCases) {
    const catalogCells = getCurrentQuestionReveal(deckId, imageFileName);
    const manifest = await readDeckManifest(deckId);
    const slide = manifest.slides.find(
      (candidate) => candidate.imageFileName === imageFileName
    );
    const label = `${deckId}/${imageFileName}`;

    assert.equal(catalogCells?.length, expectedCellCount, `${label}: catalog cell count`);
    assert.equal(slide?.interactiveCells?.length, expectedCellCount, `${label}: manifest cell count`);

    for (const [index, catalogCell] of catalogCells.entries()) {
      const appliedCell = slide.interactiveCells[index];
      assert.equal(catalogCell.revealMode, "unmask", `${label}: reveal mode changed`);
      assert.equal(catalogCell.answerRegions?.length, 2, `${label}: catalog lost a region`);
      assert.deepEqual(
        catalogCell.answerBounds,
        catalogCell.answerRegions[0],
        `${label}: primary answerBounds must be the first grouped region`
      );
      assert.deepEqual(
        appliedCell.answerRegions,
        catalogCell.answerRegions,
        `${label}: planning did not preserve grouped answer regions for cell ${index + 1}`
      );
      assert.deepEqual(appliedCell.answerBounds, appliedCell.answerRegions[0]);
    }
  }
});

test("dense slides receive cumulative full-canvas Gemini cells gated by QA", () => {
  const slide = {
    number: 7,
    title: "Aerobic versus anaerobic respiration",
    imageUrl: "/slides/slide_07.png",
    text: "Compare oxygen requirements, products, ATP yield, and the biological consequences of both pathways.",
    cognitiveGuide: {
      estimatedTimeSeconds: 48,
      vciScore: "8.1",
      complexityCategory: "High",
      breakdown: { wordCount: 88, visualElementsCount: 9 }
    }
  };

  assert.equal(isOverlyComplexSlide(slide), true);
  const planned = planSlideAnimation(slide);
  assert.equal(planned.animationPlan.mode, "gemini-image-cells");
  assert.equal(planned.geminiImageCells.length, 3);
  assert.equal(planned.progressiveBuilds, undefined);
  assert.equal(planned.hasProgressiveBuilds, false);
  assert.match(planned.geminiImageCells[0].prompt, /full-slide still-image build 1 of 3/i);
  assert.match(planned.geminiImageCells[0].prompt, /do not.*video/i);
  assert.match(planned.geminiImageCells[0].prompt, /do not spotlight, dim, blur, outline, crop, zoom/i);
  assert.ok(planned.geminiImageCells.every((cell) => cell.fullCanvas === true));
  assert.ok(planned.geminiImageCells.every((cell) => cell.qaStatus === "not-started"));
  assert.ok(planned.geminiImageCells.every((cell) => !("focusBounds" in cell)));
});

test("build count follows source density without inventing duplicate stages", () => {
  const base = { number: 5, title: "Visible title", imageUrl: "/slides/title.png" };
  const sparse = planSlideAnimation({
    ...base,
    cognitiveGuide: { breakdown: { wordCount: 5, visualElementsCount: 1 } }
  });
  const medium = planSlideAnimation({
    ...base,
    cognitiveGuide: { breakdown: { wordCount: 24, visualElementsCount: 2 } }
  });
  const dense = planSlideAnimation({
    ...base,
    cognitiveGuide: { breakdown: { wordCount: 55, visualElementsCount: 3 } }
  });
  assert.equal(sparse.geminiImageCells.length, 1);
  assert.equal(medium.geminiImageCells.length, 2);
  assert.equal(dense.geminiImageCells.length, 3);
});

test("visible transcript title and myth/reality sequence override shifted manifest metadata", async () => {
  const manifest = await readDeckManifest("Lesson_01_CELL_STRUCTURE");
  const source = manifest.slides.find((slide) => slide.imageFileName === "slide_04.png");
  assert.notEqual(source.title, "The 3D Reality", "fixture must retain shifted metadata");
  const planned = planSlideAnimation({ ...source, deckTitle: manifest.title });

  assert.equal(planned.animationPlan.strategy, "comparison");
  assert.equal(planned.geminiImageCells.length, 3);
  assert.match(planned.geminiImageCells[0].prompt, /slide 4: "The 3D Reality"/);
  assert.match(planned.geminiImageCells[0].prompt, /The Myth component/i);
  assert.match(planned.geminiImageCells[1].prompt, /real 3D cell image/i);
  assert.match(planned.geminiImageCells[2].prompt, /Key Insight container/i);
});

test("objectives and key-terms slides cannot be misplanned as invented processes", () => {
  const planned = planSlideAnimation({
    number: 3,
    imageUrl: "/slides/slide_03.png",
    text: "Objectives & Key Terms Fermentation: Anaerobic respiration in yeast. Rate of Reaction. Precision. Accuracy. Anomalous.",
    contentAnalysis: {
      role: "objectives",
      source: "local-ocr",
      transcript: "Objectives & Key Terms Fermentation: Anaerobic\nDesign: Plan a valid investigation\nRate of Reaction: How fast a product is formed over time."
    },
    cognitiveGuide: {
      complexityCategory: "High",
      breakdown: { wordCount: 75, visualElementsCount: 9 }
    }
  });

  assert.equal(planned.animationPlan.strategy, "objectives-key-terms");
  assert.match(planned.geminiImageCells[0].prompt, /slide 3: "Objectives & Key Terms"/i);
  assert.match(planned.geminiImageCells[0].prompt, /PARTIAL-BUILD CONSTRUCTION RULE/);
  assert.match(planned.geminiImageCells[0].prompt, /no arrows, equations, molecules/i);
  assert.doesNotMatch(planned.geminiImageCells[0].prompt, /first stage of the process/i);
});

test("Gemini multimodal analysis drives exact components and cumulative click prompts", () => {
  const planned = planSlideAnimation({
    number: 3,
    imageFileName: "slide_03.png",
    imageUrl: "/slides/slide_03.png",
    agentAnalysis: {
      slideDecomposition: {
        analysis: {
          title: "Objectives & Key Terms",
          description: "Objectives at left and a framed key-terms panel at right.",
          layout: "Two columns separated by a vertical rule.",
          isQuestionSlide: false,
          recommendedStrategy: "two-column-reveal",
          components: [
            {
              id: "slide_title",
              label: "Slide title",
              role: "title",
              position: "top left",
              visibleText: "Objectives & Key Terms",
              dependsOn: []
            },
            {
              id: "objectives_list",
              label: "Lesson objectives",
              role: "instruction",
              position: "left",
              visibleText: "Design; Measure; Interpret",
              dependsOn: ["slide_title"]
            },
            {
              id: "key_terms_box",
              label: "Key terms",
              role: "evidence",
              position: "right",
              visibleText: "Fermentation; Rate; Precision; Accuracy; Anomalous",
              dependsOn: ["slide_title"]
            }
          ],
          recommendedBuilds: [
            {
              label: "Reveal Objectives",
              showComponentIds: ["slide_title", "objectives_list"],
              temporarilyOmitComponentIds: ["key_terms_box"],
              rationale: "Establish the lesson goals first."
            },
            {
              label: "Reveal Key Terms",
              showComponentIds: ["slide_title", "objectives_list", "key_terms_box"],
              temporarilyOmitComponentIds: [],
              rationale: "Add the vocabulary after the goals."
            }
          ]
        }
      }
    },
    cognitiveGuide: { breakdown: { wordCount: 80, visualElementsCount: 9 } }
  });

  assert.equal(planned.animationPlan.strategy, "two-column-reveal");
  assert.equal(planned.geminiImageCells.length, 2);
  assert.match(planned.geminiImageCells[0].prompt, /slide 3: "Objectives & Key Terms"/);
  assert.match(planned.geminiImageCells[0].prompt, /Lesson objectives at left/);
  assert.match(planned.geminiImageCells[0].prompt, /Key terms at right/);
  assert.match(planned.geminiImageCells[0].prompt, /Establish the lesson goals first/);
  assert.match(planned.geminiImageCells[1].prompt, /Fermentation; Rate; Precision/);
});

test("a Gemini click sequence is materialized only after every planned image is approved", () => {
  const planned = planSlideAnimation({
    number: 5,
    title: "Three-component slide",
    imageUrl: "/slides/source.png",
    cognitiveGuide: { breakdown: { wordCount: 60, visualElementsCount: 3 } }
  });
  planned.geminiImageCells[0].outputImageUrl = "/slides/build-1.png";
  planned.geminiImageCells[0].status = "approved";
  planned.geminiImageCells[0].qaStatus = "approved";
  const partial = syncQaApprovedGeminiSequence(planned);
  assert.equal(partial.progressiveBuilds, undefined);
  assert.equal(partial.hasProgressiveBuilds, false);

  for (const [index, cell] of planned.geminiImageCells.entries()) {
    cell.outputImageUrl = `/slides/build-${index + 1}.png`;
    cell.status = "approved";
    cell.qaStatus = "approved";
  }
  const complete = syncQaApprovedGeminiSequence(planned);
  assert.equal(complete.progressiveBuilds.length, 3);
  assert.ok(
    complete.progressiveBuilds.every(
      (build) => build.generationStatus === "ready" && build.qaStatus === "approved"
    )
  );
});

test("clearing a Gemini still-image plan removes every planner-owned step", () => {
  const planned = planSlideAnimation({
    number: 6,
    title: "A dense biological process",
    imageUrl: "/slides/slide_06.png",
    text: "A long process with inputs, intermediate stages, outputs, annotations, and linked explanatory detail.",
    cognitiveGuide: {
      estimatedTimeSeconds: 55,
      vciScore: "8.5",
      complexityCategory: "High",
      breakdown: { wordCount: 100, visualElementsCount: 11 }
    }
  });

  assert.equal(planned.geminiImageCells.length, 3);
  assert.equal(planned.progressiveBuilds, undefined);
  const cleared = removeGeneratedImageBuildsPreservingVideo(planned);
  assert.equal(cleared.hasProgressiveBuilds, false);
  assert.equal(cleared.progressiveBuilds, undefined);
  assert.equal(cleared.geminiImageCells, undefined);
  assert.equal(cleared.serialAnimation, undefined);
  assert.equal(cleared.animationPlan.mode, "static");
});

test("question slides plan one unanswered Gemini base with exact answer overlays", () => {
  const planned = planSlideAnimation({
    number: 4,
    imageUrl: "/slides/slide_04.png",
    text: "What is the answer? Expected answer: A cell.",
    interactiveCells: [
      {
        id: "q1",
        question: "What is the answer?",
        expectedAnswer: "A cell.",
        bounds: { x: 5, y: 20, w: 90, h: 60 },
        answerBounds: { x: 50, y: 60, w: 40, h: 15 }
      }
    ],
    cognitiveGuide: {
      estimatedTimeSeconds: 70,
      vciScore: "9.0",
      complexityCategory: "High",
      breakdown: { wordCount: 120, visualElementsCount: 12 }
    }
  });

  assert.equal(planned.animationPlan.mode, "gemini-image-cells");
  assert.equal(planned.animationPlan.questionReveal, true);
  assert.equal(planned.hasProgressiveBuilds, false);
  assert.equal(planned.interactiveCells.length, 1);
  assert.equal(planned.progressiveBuilds, undefined);
  assert.equal(planned.geminiImageCells.length, 1);
  assert.equal(planned.geminiImageCells[0].strategy, "question-base-overlay");
  assert.match(planned.geminiImageCells[0].prompt, /unanswered base image/i);
  assert.equal(planned.interactiveCells[0].revealMode, "overlay");
  assert.equal(planned.interactiveCells[0].answerVisibleInImage, false);
  assert.equal(planned.serialAnimation.totalBuildSteps, 1);
});

test("protected Gemini video sequences are preserved byte-for-byte", () => {
  const videoBuilds = [
    {
      version: 1,
      label: "Video segment one",
      videoUrl: "/generated.mp4",
      startTime: 0,
      endTime: 3.3,
      imageUrl: "/poster.png"
    },
    {
      version: 2,
      label: "Video segment two",
      videoUrl: "/generated.mp4",
      startTime: 3.3,
      endTime: 6.6,
      imageUrl: "/poster.png"
    }
  ];
  const slide = {
    number: 3,
    imageUrl: "/poster.png",
    progressiveBuilds: structuredClone(videoBuilds),
    hasProgressiveBuilds: true,
    history: [{ id: "video", videoUrl: "/generated.mp4", imageUrl: "/poster.png" }],
    interactiveCells: [
      {
        id: "q1",
        question: "A question that must not delete video?",
        expectedAnswer: "No.",
        bounds: { x: 0, y: 0, w: 100, h: 100 }
      }
    ],
    cognitiveGuide: {
      estimatedTimeSeconds: 60,
      vciScore: "9.0",
      complexityCategory: "High",
      breakdown: { wordCount: 100, visualElementsCount: 10 }
    }
  };

  assert.equal(hasProtectedVideoMedia(slide), true);
  const planned = planSlideAnimation(slide);
  assert.equal(planned.animationPlan.mode, "protected-video");
  assert.deepEqual(planned.progressiveBuilds, videoBuilds);

  const cleared = removeGeneratedImageBuildsPreservingVideo(planned);
  assert.deepEqual(cleared.progressiveBuilds, videoBuilds);
  assert.deepEqual(cleared.history, slide.history);
});

test("Lesson 9's real Gemini videos and segment timing survive planning and clear", async () => {
  const manifest = await readDeckManifest("Lesson_09_ANAEROBIC_RESPIRATION");
  const intro = manifest.slides.find((slide) => slide.number === 1);
  const segmented = manifest.slides.find((slide) => slide.number === 3);

  assert.equal(intro.progressiveBuilds[0].videoUrl, "/L9_anaerobic_resp_into.mp4");
  assert.deepEqual(
    segmented.progressiveBuilds.map(({ videoUrl, startTime, endTime }) => ({
      videoUrl,
      startTime,
      endTime
    })),
    [
      { videoUrl: "/Please_take_this_slide_and_cre.mp4", startTime: 0, endTime: 3.3 },
      { videoUrl: "/Please_take_this_slide_and_cre.mp4", startTime: 3.3, endTime: 6.6 },
      { videoUrl: "/Please_take_this_slide_and_cre.mp4", startTime: 6.6, endTime: 10 }
    ]
  );

  for (const sourceSlide of [intro, segmented]) {
    const original = structuredClone(sourceSlide);
    const planned = planSlideAnimation(structuredClone(sourceSlide));
    const cleared = removeGeneratedImageBuildsPreservingVideo(structuredClone(planned));
    const label = `Lesson 9 slide ${sourceSlide.number}`;

    assert.equal(planned.animationPlan.mode, "protected-video", `${label}: planner route`);
    assert.equal(cleared.animationPlan.mode, "protected-video", `${label}: clear route`);
    assert.equal(planned.geminiImageCells, undefined, `${label}: still cells replaced video`);
    assert.equal(cleared.geminiImageCells, undefined, `${label}: clear added still cells`);
    assert.deepEqual(planned.progressiveBuilds, original.progressiveBuilds, `${label}: builds changed`);
    assert.deepEqual(cleared.progressiveBuilds, original.progressiveBuilds, `${label}: clear changed builds`);
    assert.deepEqual(planned.history, original.history, `${label}: history changed`);
    assert.deepEqual(cleared.history, original.history, `${label}: clear changed history`);
    assert.deepEqual(planned.serialAnimation, original.serialAnimation, `${label}: sequence changed`);
    assert.deepEqual(cleared.serialAnimation, original.serialAnimation, `${label}: clear changed sequence`);
  }
});

test("web embeds retain the live embed while receiving QA-gated Gemini still builds", async () => {
  const manifest = await readDeckManifest("Lesson_13_PHOTOSYNTHESIS_INVESTIGATION");
  const embedded = manifest.slides.find(
    (slide) => slide.imageFileName === "slide_07_web_embed.png"
  );
  assert.ok(embedded?.webEmbed?.url);
  assert.equal(isOverlyComplexSlide(embedded), false);

  const deliberatelyDense = {
    ...embedded,
    cognitiveGuide: {
      estimatedTimeSeconds: 120,
      vciScore: "10.0",
      complexityCategory: "High",
      breakdown: { wordCount: 300, visualElementsCount: 30 }
    }
  };
  const planned = planSlideAnimation(deliberatelyDense);
  assert.equal(planned.animationPlan.mode, "gemini-image-cells");
  assert.equal(planned.animationPlan.webEmbedPreserved, true);
  assert.equal(planned.hasProgressiveBuilds, false);
  assert.equal(planned.progressiveBuilds, undefined);
  assert.ok(planned.geminiImageCells.length >= 1);
  assert.deepEqual(planned.webEmbed, embedded.webEmbed);
});

test("animation planning is idempotent across every current slide", async () => {
  let checkedSlides = 0;

  for (const deckId of CURRENT_STARTER_DECK_IDS) {
    const manifest = await readDeckManifest(deckId);
    for (const slide of manifest.slides) {
      const withDeckContext = {
        ...structuredClone(slide),
        deckTitle: manifest.title,
        lessonTitle: manifest.title
      };
      const once = planSlideAnimation(withDeckContext);
      const twice = planSlideAnimation(structuredClone(once));
      assert.deepEqual(
        twice,
        once,
        `${deckId} slide ${slide.number}: repeat planning changed the manifest`
      );
      checkedSlides += 1;
    }
  }

  assert.equal(checkedSlides, 150);
});

test("global routing covers 137 slides with only videos and six-box starters excluded", async () => {
  let total = 0;
  let videos = 0;
  let starters = 0;
  let eligible = 0;
  let webEmbeds = 0;

  for (const deckId of CURRENT_STARTER_DECK_IDS) {
    const manifest = await readDeckManifest(deckId);
    for (const slide of manifest.slides) {
      total += 1;
      if (hasProtectedVideoMedia(slide)) {
        videos += 1;
        assert.equal(slide.animationPlan?.mode, "protected-video");
        assert.equal(slide.geminiImageCells, undefined);
        continue;
      }
      if (isSixBoxStarterQuestionSlide(slide)) {
        starters += 1;
        assert.equal(slide.animationPlan?.mode, "question-reveal");
        assert.equal(slide.geminiImageCells, undefined);
        continue;
      }

      eligible += 1;
      if (slide.webEmbed?.url) webEmbeds += 1;
      assert.equal(slide.animationPlan?.mode, "gemini-image-cells");
      assert.ok(slide.geminiImageCells?.length >= 1);
      assert.ok(slide.geminiImageCells.every((cell) => cell.fullCanvas === true));
      assert.ok(slide.geminiImageCells.every((cell) => !("focusBounds" in cell)));
      if (slide.progressiveBuilds?.length) {
        assert.equal(slide.progressiveBuilds.length, slide.geminiImageCells.length);
        assert.ok(slide.geminiImageCells.every((cell) => cell.qaStatus === "approved"));
      }
    }
  }

  assert.deepEqual({ total, videos, starters, eligible, webEmbeds }, {
    total: 150,
    videos: 2,
    starters: 11,
    eligible: 137,
    webEmbeds: 1
  });
});

test("auto-planned non-video slides contain no legacy generic serial stubs", async () => {
  for (const deckId of CURRENT_STARTER_DECK_IDS) {
    const manifest = await readDeckManifest(deckId);
    for (const slide of manifest.slides) {
      if (hasProtectedVideoMedia(slide)) continue;
      assert.equal(
        hasLegacyGenericSerialStub(slide),
        false,
        `${deckId} slide ${slide.number}: generic header/main/footer stub remains`
      );
    }
  }
});

test("every current local slide, build, poster, and video URL resolves to an asset", async () => {
  for (const deckId of CURRENT_STARTER_DECK_IDS) {
    const manifest = await readDeckManifest(deckId);
    for (const slide of manifest.slides) {
      const references = [["slide", slide.imageUrl]];
      for (const build of slide.progressiveBuilds || []) {
        references.push(
          ["build image", build.imageUrl],
          ["video", build.videoUrl],
          ["poster", build.posterUrl]
        );
      }

      for (const [kind, url] of references) {
        if (!url || !url.startsWith("/")) continue;
        const relativePath = decodeURIComponent(url.split(/[?#]/, 1)[0]).replace(/^\/+/, "");
        await assert.doesNotReject(
          fs.access(path.join(ROOT_DIR, "public", relativePath)),
          `${deckId} slide ${slide.number}: missing ${kind} ${url}`
        );
      }
    }
  }
});

test("converted Biology Lesson 1 manifest is complete and interactive", async () => {
  const manifest = JSON.parse(await fs.readFile(LESSON_ONE_MANIFEST, "utf-8"));
  const slideTwo = manifest.slides.find((slide) => slide.number === 2);

  assert.equal(manifest.id, "Lesson_01_CELL_STRUCTURE");
  assert.equal(manifest.totalSlides, 16);
  assert.equal(manifest.agent.defaultPathway, AGENT_PATHWAYS.GEMINI_IMAGE_CHAT);
  assert.equal(slideTwo.interactiveCells.length, 6);
  assert.equal(slideTwo.serialAnimation.totalBuildSteps, 6);
  assert.equal(slideTwo.hasProgressiveBuilds, false);
  assert.equal(slideTwo.progressiveBuilds, undefined);
});

test("generated image QA checks the file and requires a complete visual checklist", async () => {
  const sourcePath = path.join(
    ROOT_DIR,
    "public/decks/Lesson_01_CELL_STRUCTURE/slides/slide_01.png"
  );
  const outputPath = path.join(
    ROOT_DIR,
    "public/decks/Lesson_01_CELL_STRUCTURE/slides/slide_04.png"
  );
  const technical = await validateGeneratedSlideImage({ outputPath, sourcePath });
  assert.equal(technical.passed, true);
  assert.deepEqual(technical.dimensions, { format: "png", width: 1376, height: 768 });

  const unchanged = await validateGeneratedSlideImage({
    outputPath: sourcePath,
    sourcePath
  });
  assert.equal(unchanged.passed, false);
  assert.equal(
    unchanged.checks.find((check) => check.id === "distinct-from-source").passed,
    false
  );

  assert.equal(validateVisualQaChecklist({ fullCanvas: true }).passed, false);
  assert.equal(
    validateVisualQaChecklist({
      fullCanvas: true,
      styleMatch: true,
      cumulativeContent: true,
      legibleText: true,
      noFocusTreatment: true
    }).passed,
    true
  );
});

test("local Gemini assets are atomically approved and enter playback only after QA", async (t) => {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "vibe-deck-qa-"));
  t.after(() => fs.rm(temporaryRoot, { recursive: true, force: true }));
  const publicDir = path.join(temporaryRoot, "public");
  const decksDir = path.join(publicDir, "decks");
  const slideDir = path.join(decksDir, "QaDeck", "slides");
  await fs.mkdir(slideDir, { recursive: true });
  await fs.copyFile(
    path.join(ROOT_DIR, "public/decks/Lesson_01_CELL_STRUCTURE/slides/slide_01.png"),
    path.join(slideDir, "source.png")
  );
  await fs.copyFile(
    path.join(ROOT_DIR, "public/decks/Lesson_01_CELL_STRUCTURE/slides/slide_04.png"),
    path.join(slideDir, "build.png")
  );
  await fs.writeFile(
    path.join(decksDir, "QaDeck", "manifest.json"),
    JSON.stringify({
      id: "QaDeck",
      slides: [
        {
          number: 1,
          imageUrl: "/decks/QaDeck/slides/source.png",
          imageFileName: "source.png",
          geminiImageCells: [
            {
              id: "gemini_slide_1_1_component_reveal",
              order: 1,
              label: "Build 1",
              source: "gemini-image-chat",
              sourceImageUrl: "/decks/QaDeck/slides/source.png",
              outputImageUrl: "/decks/QaDeck/slides/build.png",
              status: "generated-pending-qa",
              qaStatus: "pending"
            }
          ],
          animationPlan: { mode: "gemini-image-cells", qaRequired: true }
        }
      ]
    })
  );

  await assert.rejects(
    reviewGeneratedBuildAsset({
      decksDir,
      publicDir,
      deckId: "QaDeck",
      slideNum: 1,
      buildId: "gemini_slide_1_1_component_reveal",
      approved: true,
      visualChecks: { fullCanvas: true }
    }),
    (error) => error.statusCode === 422 && error.qa.visual.passed === false
  );

  const result = await reviewGeneratedBuildAsset({
    decksDir,
    publicDir,
    deckId: "QaDeck",
    slideNum: 1,
    buildId: "gemini_slide_1_1_component_reveal",
    imagePath: path.join(slideDir, "build.png"),
    approved: true,
    visualChecks: {
      fullCanvas: true,
      styleMatch: true,
      cumulativeContent: true,
      legibleText: true,
      noFocusTreatment: true
    },
    reviewer: "test-agent"
  });
  assert.equal(result.approved, true);
  assert.equal(result.build.qaStatus, "approved");
  assert.equal(result.slide.progressiveBuilds.length, 1);
  assert.equal(result.slide.progressiveBuilds[0].generationStatus, "ready");
  assert.equal(result.slide.progressiveBuilds[0].qaStatus, "approved");

  const saved = JSON.parse(
    await fs.readFile(path.join(decksDir, "QaDeck", "manifest.json"), "utf8")
  );
  assert.equal(saved.slides[0].progressiveBuilds.length, 1);
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
  assert.equal(deck.totalSlides, 16);

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

test("cognitive model dynamically adjusts processing time and metrics based on slide content", () => {
  const titleSlide = {
    number: 1,
    title: "1. Cell Structure"
  };

  const simpleSlide = {
    number: 5,
    title: "Key Definitions",
    text: "Cells are basic units of life."
  };

  const complexScientificSlide = {
    number: 6,
    title: "Mitochondria Respiration & Chloroplast Photosynthesis",
    text: "Glucose + Oxygen → Carbon Dioxide + Water. Mitochondria produce ATP energy through cellular respiration. Chloroplast organelles perform photosynthesis in plant cytoplasm.",
    components: [
      { label: "Mitochondria Diagram", text: "Inner membrane folds" },
      { label: "Chloroplast Diagram", text: "Thylakoid stacks" }
    ]
  };

  const loadTitle = analyzeSlideCognitiveLoad(titleSlide);
  const loadSimple = analyzeSlideCognitiveLoad(simpleSlide);
  const loadComplex = analyzeSlideCognitiveLoad(complexScientificSlide);

  assert.ok(loadTitle.estimatedTimeSeconds < loadSimple.estimatedTimeSeconds);
  assert.ok(loadSimple.estimatedTimeSeconds < loadComplex.estimatedTimeSeconds);

  assert.ok(loadComplex.breakdown.wordCount > loadSimple.breakdown.wordCount);
  assert.ok(loadComplex.breakdown.visualElementsCount > loadSimple.breakdown.visualElementsCount);
  assert.ok(loadComplex.breakdown.semanticProcessingMs > loadSimple.breakdown.semanticProcessingMs);

  assert.notEqual(loadSimple.timeGuideDisplay, loadComplex.timeGuideDisplay);
  assert.equal(loadTitle.ragColor, "green");
  assert.equal(loadTitle.ragLevel, "low");
  assert.ok(["amber", "red"].includes(loadComplex.ragColor));
});

test("welcome modal and RAG guide are present in index.html", async () => {
  const html = await fs.readFile(path.join(ROOT_DIR, "public", "index.html"), "utf-8");
  assert.match(html, /id="welcomeModal"/);
  assert.match(html, /id="aboutAppBtn"/);
  assert.match(html, /id="closeWelcomeModalBtn"/);
  assert.match(html, /id="getStartedBtn"/);
  assert.match(html, /id="dontShowWelcomeCheckbox"/);
  assert.match(html, /RAG Cognitive Processing Time Guide/);
  assert.match(html, /rag-pill-green/);
  assert.match(html, /rag-pill-amber/);
  assert.match(html, /rag-pill-red/);
});

test("light theme is default and theme toggle button is present", async () => {
  const html = await fs.readFile(path.join(ROOT_DIR, "public", "index.html"), "utf-8");
  assert.match(html, /class="theme-light presenter-mode"/);
  assert.match(html, /id="themeToggleBtn"/);

  const js = await fs.readFile(path.join(ROOT_DIR, "public", "js", "app.js"), "utf-8");
  assert.match(js, /initTheme\(\)/);
  assert.match(js, /applyTheme/);
  assert.match(js, /vibeDeck_theme/);

  const css = await fs.readFile(path.join(ROOT_DIR, "public", "css", "styles.css"), "utf-8");
  assert.match(css, /--bg-app:\s*#f8fafc/);
  assert.match(css, /body\.theme-dark/);
});
