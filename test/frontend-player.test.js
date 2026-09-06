import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(TEST_DIR, "..");
const APP_PATH = path.join(ROOT_DIR, "public", "js", "app.js");
const CSS_PATH = path.join(ROOT_DIR, "public", "css", "styles.css");

async function loadPlayerTestHooks() {
  const source = await fs.readFile(APP_PATH, "utf-8");
  const context = vm.createContext({
    console,
    document: {
      addEventListener() {},
      getElementById() {
        return null;
      },
      querySelector() {
        return null;
      }
    }
  });
  vm.runInContext(
    `${source}\n;globalThis.__playerTestHooks = {
      normalizeBuildSteps,
      getStageBuildSteps,
      shouldRenderDirectWebEmbed,
      isGeneratedQuestionAnswerSequence,
      moveMediaBuildStep,
      syncQuestionAnswersToCurrentBuild,
      setPlayerState(deck, slideIndex = 0, mediaStep = 0) {
        currentDeck = deck;
        currentSlideIndex = slideIndex;
        currentMediaBuildStep = mediaStep;
        answerStates = {};
        answerRevealOrder = {};
      },
      getPlayerState(slide) {
        return {
          mediaStep: currentMediaBuildStep,
          revealed: getInteractiveCells(slide).map((cell) => isAnswerRevealed(slide, cell))
        };
      }
    };`,
    context,
    { filename: APP_PATH }
  );
  return context.__playerTestHooks;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test("the player exposes only approved generated image assets as Gemini click builds", async () => {
  const { normalizeBuildSteps } = await loadPlayerTestHooks();
  const baseImageUrl = "/slides/base.png";
  const geminiImageCells = [
    {
      id: "planned",
      source: "gemini-image-chat",
      status: "planned",
      qaStatus: "pending-qa",
      fallbackImageUrl: baseImageUrl
    },
    {
      id: "failed",
      source: "gemini-image-chat",
      status: "failed",
      qaStatus: "rejected",
      outputImageUrl: "/slides/failed.png",
      fallbackImageUrl: baseImageUrl
    },
    {
      id: "pending-qa",
      source: "gemini-image-chat",
      status: "ready",
      qaStatus: "pending-qa",
      outputImageUrl: "/slides/pending.png",
      fallbackImageUrl: baseImageUrl
    },
    {
      id: "unapproved",
      source: "gemini-image-chat",
      status: "ready",
      qaStatus: "unapproved",
      outputImageUrl: "/slides/unapproved.png",
      fallbackImageUrl: baseImageUrl
    },
    {
      id: "stale-planned-cell",
      source: "gemini-image-chat",
      status: "planned",
      qaStatus: "approved",
      outputImageUrl: "/slides/stale.png",
      fallbackImageUrl: baseImageUrl
    },
    {
      id: "fallback-only",
      source: "gemini-image-chat",
      status: "ready",
      qaStatus: "approved",
      outputImageUrl: baseImageUrl,
      fallbackImageUrl: baseImageUrl
    },
    {
      id: "source-only",
      source: "gemini-image-chat",
      status: "ready",
      qaStatus: "approved",
      outputImageUrl: "/slides/source-copy.png",
      sourceImageUrl: "/slides/source-copy.png"
    },
    {
      id: "approved",
      source: "gemini-image-chat",
      status: "ready",
      qaStatus: "approved",
      outputImageUrl: "/slides/approved.png",
      fallbackImageUrl: baseImageUrl
    }
  ];
  const geminiBuild = (id, overrides = {}) => ({
    id,
    kind: "image",
    source: "gemini-image-chat",
    imageUrl: geminiImageCells.find((cell) => cell.id === id)?.outputImageUrl || baseImageUrl,
    fallbackImageUrl: baseImageUrl,
    generationStatus: id === "planned" ? "planned" : "ready",
    qaStatus: geminiImageCells.find((cell) => cell.id === id)?.qaStatus,
    ...overrides
  });

  const steps = plain(normalizeBuildSteps({
    number: 1,
    imageUrl: baseImageUrl,
    originalImageUrl: baseImageUrl,
    geminiImageCells,
    progressiveBuilds: [
      geminiBuild("planned"),
      geminiBuild("failed", { generationStatus: "failed" }),
      geminiBuild("pending-qa"),
      geminiBuild("unapproved"),
      geminiBuild("stale-planned-cell"),
      geminiBuild("fallback-only"),
      geminiBuild("source-only", {
        imageUrl: "/slides/source-copy.png",
        outputImageUrl: "/slides/source-copy.png",
        sourceImageUrl: "/slides/source-copy.png"
      }),
      geminiBuild("approved", { outputImageUrl: "/slides/approved.png" }),
      {
        id: "legacy-manual",
        kind: "image",
        source: "manual",
        imageUrl: "/slides/manual.png",
        label: "Authored image"
      },
      {
        id: "legacy-fallback",
        kind: "image",
        label: "Legacy image"
      },
      {
        id: "protected-video",
        kind: "video",
        source: "gemini-video",
        videoUrl: "/clips/lesson.mp4",
        posterUrl: "/slides/poster.png",
        startTime: 2.5,
        endTime: 7.75
      },
      {
        id: "original-frame",
        kind: "image",
        source: "original-slide",
        imageUrl: baseImageUrl,
        label: "Complete slide"
      }
    ]
  }));

  assert.deepEqual(
    steps.map((step) => step.id),
    ["approved", "legacy-manual", "legacy-fallback", "protected-video", "original-frame"]
  );
  assert.equal(steps[0].imageUrl, "/slides/approved.png");
  assert.equal(steps[2].imageUrl, baseImageUrl, "legacy non-Gemini fallback changed");
  assert.deepEqual(
    {
      videoUrl: steps[3].videoUrl,
      posterUrl: steps[3].posterUrl,
      startTime: steps[3].startTime,
      endTime: steps[3].endTime
    },
    {
      videoUrl: "/clips/lesson.mp4",
      posterUrl: "/slides/poster.png",
      startTime: 2.5,
      endTime: 7.75
    }
  );
});

test("approved web-embed builds play before the preserved live iframe", async () => {
  const { getStageBuildSteps, shouldRenderDirectWebEmbed } = await loadPlayerTestHooks();
  const sourceImageUrl = "/slides/web-source.png";
  const approvedCell = {
    id: "web-build-1",
    source: "gemini-image-chat",
    strategy: "component-reveal",
    status: "approved",
    qaStatus: "approved",
    outputImageUrl: "/slides/web-build-1.png",
    sourceImageUrl
  };
  const approvedBuild = {
    id: approvedCell.id,
    kind: "image",
    source: "gemini-image-chat",
    imageUrl: approvedCell.outputImageUrl,
    outputImageUrl: approvedCell.outputImageUrl,
    sourceImageUrl,
    generationStatus: "ready",
    qaStatus: "approved",
    label: "Build 1"
  };
  const approvedSlide = {
    number: 7,
    imageUrl: sourceImageUrl,
    interactiveType: "web_embed",
    webEmbed: {
      url: "https://example.test/live-activity",
      label: "Live investigation"
    },
    geminiImageCells: [approvedCell],
    progressiveBuilds: [approvedBuild]
  };

  const stages = plain(getStageBuildSteps(approvedSlide));
  assert.equal(shouldRenderDirectWebEmbed(approvedSlide), false);
  assert.deepEqual(stages.map((step) => step.kind), ["image", "web-embed"]);
  assert.equal(stages.at(-1).webEmbed.url, approvedSlide.webEmbed.url);
  assert.equal(stages.at(-1).label, "Live investigation");

  const plannedSlide = {
    ...approvedSlide,
    geminiImageCells: [
      {
        ...approvedCell,
        status: "planned",
        qaStatus: "not-started",
        outputImageUrl: null
      }
    ],
    progressiveBuilds: [
      {
        ...approvedBuild,
        imageUrl: sourceImageUrl,
        outputImageUrl: null,
        generationStatus: "planned",
        qaStatus: "not-started"
      }
    ]
  };
  assert.equal(shouldRenderDirectWebEmbed(plannedSlide), true);
  assert.deepEqual(plain(getStageBuildSteps(plannedSlide)), []);
});

test("question-answer image steps reveal and hide the matching masks on the same move", async () => {
  const hooks = await loadPlayerTestHooks();
  const sourceImageUrl = "/slides/question-source.png";
  const interactiveCells = [
    {
      id: "question_1",
      question: "Question one?",
      expectedAnswer: "Answer one.",
      answerBounds: { x: 10, y: 20, w: 30, h: 10 }
    },
    {
      id: "question_2",
      question: "Question two?",
      expectedAnswer: "Answer two.",
      answerBounds: { x: 10, y: 40, w: 30, h: 10 }
    }
  ];
  const geminiImageCells = [0, 1, 2].map((index) => ({
    id: `qa-build-${index + 1}`,
    source: "gemini-image-chat",
    strategy: "question-answer-reveal",
    status: "approved",
    qaStatus: "approved",
    outputImageUrl: `/slides/qa-build-${index + 1}.png`,
    sourceImageUrl
  }));
  const progressiveBuilds = geminiImageCells.map((cell, index) => ({
    id: cell.id,
    kind: "image",
    source: "gemini-image-chat",
    imageUrl: cell.outputImageUrl,
    outputImageUrl: cell.outputImageUrl,
    sourceImageUrl,
    generationStatus: "ready",
    qaStatus: "approved",
    label: index === 0 ? "Ask the questions" : `Reveal answer ${index}`
  }));
  const slide = {
    number: 4,
    imageUrl: sourceImageUrl,
    interactiveType: "question_reveal",
    animationPlan: { strategy: "question-answer-reveal" },
    interactiveCells,
    geminiImageCells,
    progressiveBuilds
  };
  const deck = { id: "qa-sync-deck", slides: [slide] };

  hooks.setPlayerState(deck, 0, 1);
  assert.equal(hooks.isGeneratedQuestionAnswerSequence(slide), true);
  hooks.syncQuestionAnswersToCurrentBuild(slide);
  assert.deepEqual(plain(hooks.getPlayerState(slide)), {
    mediaStep: 1,
    revealed: [false, false]
  });

  assert.equal(hooks.moveMediaBuildStep(slide, 1), true);
  assert.deepEqual(plain(hooks.getPlayerState(slide)), {
    mediaStep: 2,
    revealed: [true, false]
  });

  assert.equal(hooks.moveMediaBuildStep(slide, 1), true);
  assert.deepEqual(plain(hooks.getPlayerState(slide)), {
    mediaStep: 3,
    revealed: [true, true]
  });

  assert.equal(hooks.moveMediaBuildStep(slide, -1), true);
  assert.deepEqual(plain(hooks.getPlayerState(slide)), {
    mediaStep: 2,
    revealed: [true, false]
  });

  assert.equal(hooks.moveMediaBuildStep(slide, -1), true);
  assert.deepEqual(plain(hooks.getPlayerState(slide)), {
    mediaStep: 1,
    revealed: [false, false]
  });

  // Build 0 is removed for progressive builds: cannot regress below build 1
  assert.equal(hooks.moveMediaBuildStep(slide, -1), false);
  assert.deepEqual(plain(hooks.getPlayerState(slide)), {
    mediaStep: 1,
    revealed: [false, false]
  });

  const starterSlide = { ...slide, interactiveType: "starter_qa_grid" };
  assert.equal(hooks.isGeneratedQuestionAnswerSequence(starterSlide), false);
});

test("the player contains no focus halo, dimming, or serial-active visualization", async () => {
  const [appSource, cssSource] = await Promise.all([
    fs.readFile(APP_PATH, "utf-8"),
    fs.readFile(CSS_PATH, "utf-8")
  ]);
  const combined = `${appSource}\n${cssSource}`;

  assert.doesNotMatch(combined, /build-focus-halo/i);
  assert.doesNotMatch(combined, /appendBuildFocusHalo/);
  assert.doesNotMatch(combined, /serial-active/);
  assert.doesNotMatch(combined, /@keyframes\s+activeHalo/i);
  assert.doesNotMatch(combined, /is-loading-build/);
  assert.doesNotMatch(combined, /·\s*Initial view/i);
});

test("Lesson 1 Cell Structure slide 3 has build 3 identical to slide 03 original and no build 0", async () => {
  const manifestPath = path.join(ROOT_DIR, "public", "decks", "Lesson_01_CELL_STRUCTURE", "manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const slide3 = manifest.slides.find((s) => s.number === 3);
  assert.ok(slide3, "Slide 3 must exist");

  const build3 = slide3.progressiveBuilds.find((b) => b.version === 3 || b.id === "gemini_slide_3_3_staged_objectives");
  assert.ok(build3, "Build 3 must exist");

  const build3File = path.join(ROOT_DIR, "public", build3.imageUrl.replace(/^\//, ""));
  const baseSlideFile = path.join(ROOT_DIR, "public", slide3.imageUrl.replace(/^\//, ""));

  const [build3Buffer, baseSlideBuffer] = await Promise.all([
    fs.readFile(build3File),
    fs.readFile(baseSlideFile)
  ]);

  assert.equal(build3Buffer.equals(baseSlideBuffer), true, "Build 3 image must be identical to slide_03.png (build 0)");

  const steps = slide3.serialAnimation?.serialSteps || [];
  assert.ok(steps.length >= 3);
  assert.equal(steps.some((s) => s.step === 0), false, "There must be no step 0 in serial steps");
  assert.equal(steps[0].step, 1, "First build step must be 1");
});

test("Presenter and student mode toggle displays custom SVG icons instead of visible text", async () => {
  const [indexHtml, cssSource, appSource] = await Promise.all([
    fs.readFile(path.join(ROOT_DIR, "public", "index.html"), "utf-8"),
    fs.readFile(CSS_PATH, "utf-8"),
    fs.readFile(APP_PATH, "utf-8")
  ]);

  assert.match(indexHtml, /id="modeToggleBtn"/);
  assert.match(indexHtml, /class="[^"]*mode-icon-presenter[^"]*"/);
  assert.match(indexHtml, /class="[^"]*mode-icon-student[^"]*"/);
  assert.match(indexHtml, /<span id="modeText" class="sr-only">Presenter mode<\/span>/);

  assert.match(cssSource, /\.mode-icon-presenter/);
  assert.match(cssSource, /\.mode-icon-student/);
  assert.match(cssSource, /\.mode-badge\.is-student/);

  assert.match(appSource, /modeToggleBtn\?\.classList\.toggle\("is-presenter",\s*presenterMode\)/);
  assert.match(appSource, /modeToggleBtn\?\.classList\.toggle\("is-student",\s*!presenterMode\)/);
});

test("Cognitive load indicator pill uses custom SVG icon instead of visible processing text", async () => {
  const [indexHtml, cssSource] = await Promise.all([
    fs.readFile(path.join(ROOT_DIR, "public", "index.html"), "utf-8"),
    fs.readFile(CSS_PATH, "utf-8")
  ]);

  assert.match(indexHtml, /id="cognitiveBadge"/);
  assert.match(indexHtml, /class="[^"]*cognitive-svg-icon[^"]*"/);
  assert.match(indexHtml, /<span class="cognitive-label sr-only">Processing:<\/span>/);

  assert.match(cssSource, /\.cognitive-svg-icon/);
  assert.match(cssSource, /\.cognitive-badge\s*\{[^}]*white-space:\s*nowrap/);
});
