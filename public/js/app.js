const DEFAULT_AGENT_PATHWAY = "gemini-image-chat";
const DEFAULT_TRIAL_DECK = "Lesson_01_CELL_STRUCTURE";

let currentDeck = null;
let currentSlideIndex = 0;
let currentMediaBuildStep = 0;
let answerStates = {};
let answerRevealOrder = {};
let autoPlayInterval = null;
let activeSidebarTab = "overview";
let autosaveTimer = null;
let presenterMode = true;
let touchStartX = null;
let agentPathways = [];
let editTargetsBySlide = {};
let geminiBuildRequestStates = {};
let geminiBuildRequestCounter = 0;
let deckSessionToken = 0;
let editPointerInteraction = null;
let slideAutoAdvanceTimer = null;

const deckSelect = document.getElementById("deckSelect");
const slideSetBtn = document.getElementById("slideSetBtn");
const setsModal = document.getElementById("setsModal");
const closeSetsModalBtn = document.getElementById("closeSetsModalBtn");
const setsCardsContainer = document.getElementById("setsCardsContainer");
const srDeckTitle = document.getElementById("srDeckTitle");
const deckTitle = document.getElementById("deckTitle");
let availableSlideSets = [];
let currentSlideSetId = null;
const slideImage = document.getElementById("slideImage");
const slideVideo = document.getElementById("slideVideo");
const videoPlayFallback = document.getElementById("videoPlayFallback");
const slideStage = document.getElementById("slideStage");
const slideWrapper = document.getElementById("slideWrapper");
const webEmbedLayer = document.getElementById("webEmbedLayer");
const webEmbedFrame = document.getElementById("webEmbedFrame");
const interactiveOverlay = document.getElementById("interactiveOverlay");
const editTargetOverlay = document.getElementById("editTargetOverlay");
const editTargetBox = document.getElementById("editTargetBox");
const editTargetBoxLabel = document.getElementById("editTargetBoxLabel");
const editTargetAnchor = document.querySelector(".edit-target-anchor");
const qaControls = document.getElementById("qaControls");
const buildControlsGroup = document.getElementById("buildControlsGroup");
const answerControlsGroup = document.getElementById("answerControlsGroup");
const answerActionsGroup = document.getElementById("answerActionsGroup");
const autoPlaySequenceGroup = document.getElementById("autoPlaySequenceGroup");
const qaControlsDivider = document.getElementById("qaControlsDivider");
const answerLiveRegion = document.getElementById("answerLiveRegion");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentSlideNum = document.getElementById("currentSlideNum");
const totalSlidesNum = document.getElementById("totalSlidesNum");
const progressBar = document.getElementById("progressBar");
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const thumbnailsGrid = document.getElementById("thumbnailsGrid");
const slideCountBadge = document.getElementById("slideCountBadge");
const slideOrderStatusBadge = document.getElementById("slideOrderStatusBadge");
let draggedSlideIndex = null;
let slideOrderSaveTimer = null;
const fullscreenBtn = document.getElementById("fullscreenBtn");
const revealAllBtn = document.getElementById("revealAllBtn");
const hideAllBtn = document.getElementById("hideAllBtn");
const serialStepBadge = document.getElementById("serialStepBadge");
const prevBuildStepBtn = document.getElementById("prevBuildStepBtn");
const nextBuildStepBtn = document.getElementById("nextBuildStepBtn");
const answerStepBadge = document.getElementById("answerStepBadge");
const prevAnswerBtn = document.getElementById("prevAnswerBtn");
const nextAnswerBtn = document.getElementById("nextAnswerBtn");
const autoPlayBuildsBtn = document.getElementById("autoPlayBuildsBtn");
const editComponentBtn = document.getElementById("editComponentBtn");
const componentList = document.getElementById("componentList");
const geminiEditInput = document.getElementById("geminiEditInput");
const sendGeminiEditBtn = document.getElementById("sendGeminiEditBtn");
const changeSlideHeading = document.getElementById("changeSlideHeading");
const cancelRevisionBtn = document.getElementById("cancelRevisionBtn");
const agentStatus = document.getElementById("agentStatus");
const agentPathwaySelect = document.getElementById("agentPathwaySelect");
const agentPathwayName = document.getElementById("agentPathwayName");
const agentPathwayDescription = document.getElementById("agentPathwayDescription");
const editModeBadge = document.getElementById("editModeBadge");
const selectedTargetSummary = document.getElementById("selectedTargetSummary");
const selectedTargetName = document.getElementById("selectedTargetName");
const selectedTargetMeta = document.getElementById("selectedTargetMeta");
const clearEditTargetBtn = document.getElementById("clearEditTargetBtn");
const tabOverviewBtn = document.getElementById("tabOverviewBtn");
const tabEditorBtn = document.getElementById("tabEditorBtn");
const componentEditorView = document.getElementById("componentEditorView");
const modeToggleBtn = document.getElementById("modeToggleBtn");
const modeText = document.getElementById("modeText");
const cognitiveBadge = document.getElementById("cognitiveBadge");
const cognitiveTimeText = document.getElementById("cognitiveTimeText");
const vciPill = document.getElementById("vciPill");
const cognitiveModal = document.getElementById("cognitiveModal");
const cognitiveModalBody = document.getElementById("cognitiveModalBody");
const closeModalBtn = document.getElementById("closeModalBtn");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundPercent(value) {
  return Math.round(value * 10) / 10;
}

function editTargetKey(slide = currentDeck?.slides[currentSlideIndex]) {
  if (!currentDeck || !slide) return null;
  return `${currentDeck.id}:${slide.number}`;
}

function getSelectedEditTarget(slide = currentDeck?.slides[currentSlideIndex]) {
  const key = editTargetKey(slide);
  return key ? editTargetsBySlide[key] || null : null;
}

function normalizeClientBounds(bounds) {
  const x = clamp(Number(bounds?.x) || 0, 0, 96);
  const y = clamp(Number(bounds?.y) || 0, 0, 96);
  const w = clamp(Number(bounds?.w) || 4, 4, 100 - x);
  const h = clamp(Number(bounds?.h) || 4, 4, 100 - y);
  return {
    x: roundPercent(x),
    y: roundPercent(y),
    w: roundPercent(w),
    h: roundPercent(h)
  };
}

function targetPointFromBounds(bounds) {
  return {
    x: roundPercent(bounds.x + bounds.w / 2),
    y: roundPercent(bounds.y + bounds.h / 2)
  };
}

function defaultRegionBounds(point) {
  const w = 24;
  const h = 18;
  return normalizeClientBounds({
    x: point.x - w / 2,
    y: point.y - h / 2,
    w,
    h
  });
}

function formatTargetBounds(bounds) {
  return `Left ${bounds.x.toFixed(1)}% · Top ${bounds.y.toFixed(1)}% · ${bounds.w.toFixed(1)}% × ${bounds.h.toFixed(1)}%`;
}

function isUsableAnswerBounds(bounds) {
  return Boolean(
    bounds &&
    Number.isFinite(Number(bounds.x)) &&
    Number.isFinite(Number(bounds.y)) &&
    Number.isFinite(Number(bounds.w)) &&
    Number.isFinite(Number(bounds.h)) &&
    Number(bounds.w) > 0 &&
    Number(bounds.h) > 0
  );
}

function answerBoundsSignature(bounds) {
  if (!isUsableAnswerBounds(bounds)) return "";
  const normalized = normalizeClientBounds(bounds);
  return [normalized.x, normalized.y, normalized.w, normalized.h].join(":");
}

function getAnswerRegionSet(cell) {
  const declaredRegions = Array.isArray(cell?.answerRegions)
    ? cell.answerRegions.filter(isUsableAnswerBounds)
    : [];
  const primarySource = isUsableAnswerBounds(cell?.answerBounds)
    ? cell.answerBounds
    : isUsableAnswerBounds(cell?.bounds)
      ? cell.bounds
      : declaredRegions[0] || null;

  if (!primarySource) return { primary: null, secondary: [], all: [] };

  const primary = normalizeClientBounds(primarySource);
  const seen = new Set();
  const all = [primary, ...declaredRegions.map(normalizeClientBounds)].filter((bounds) => {
    const signature = answerBoundsSignature(bounds);
    if (!signature || seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });

  return { primary, secondary: all.slice(1), all };
}

function setPrimaryAnswerBounds(cell, nextBounds) {
  const previousPrimary = getAnswerRegionSet(cell).primary;
  const previousSignature = answerBoundsSignature(previousPrimary);
  const normalizedNext = normalizeClientBounds(nextBounds);

  cell.answerBounds = { ...normalizedNext };
  if (Array.isArray(cell.answerRegions) && previousSignature) {
    cell.answerRegions = cell.answerRegions.map((region) =>
      answerBoundsSignature(region) === previousSignature
        ? { ...region, ...normalizedNext }
        : region
    );
  }
}

function renderEditTargetSelection() {
  if (!editTargetOverlay || !editTargetBox) return;
  const editingActive =
    activeSidebarTab === "editor" && presenterMode && !sidebar?.classList.contains("collapsed");
  const target = getSelectedEditTarget();

  editTargetOverlay.classList.toggle("active", editingActive);
  editTargetOverlay.classList.toggle("has-target", Boolean(target));

  if (!editingActive || !target) {
    editTargetBox.classList.add("hidden");
    editTargetBox.setAttribute("aria-hidden", "true");
    return;
  }

  const bounds = target.bounds;
  editTargetBox.style.left = `${bounds.x}%`;
  editTargetBox.style.top = `${bounds.y}%`;
  editTargetBox.style.width = `${bounds.w}%`;
  editTargetBox.style.height = `${bounds.h}%`;
  editTargetBoxLabel.textContent = target.label;
  if (editTargetAnchor) {
    editTargetAnchor.style.left = `${clamp(
      ((target.point.x - bounds.x) / bounds.w) * 100,
      0,
      100
    )}%`;
    editTargetAnchor.style.top = `${clamp(
      ((target.point.y - bounds.y) / bounds.h) * 100,
      0,
      100
    )}%`;
  }
  editTargetBox.classList.remove("hidden");
  editTargetBox.setAttribute("aria-hidden", "false");
}

function renderSelectedTargetSummary() {
  if (!selectedTargetSummary) return;
  const target = getSelectedEditTarget();

  selectedTargetSummary.classList.toggle("has-selection", Boolean(target));
  clearEditTargetBtn?.classList.toggle("hidden", !target);
  if (editModeBadge) {
    editModeBadge.textContent = target ? "Target locked" : "Select on slide";
  }

  if (!target) {
    selectedTargetName.textContent = "Whole slide";
    selectedTargetMeta.textContent = "Click the slide to isolate a component.";
    return;
  }

  selectedTargetName.textContent = target.label;
  selectedTargetMeta.textContent = formatTargetBounds(target.bounds);
}

function setSelectedEditTarget(target, { rerenderPanel = true, focusInput = false } = {}) {
  const key = editTargetKey();
  if (!key) return;

  if (target) {
    const bounds = normalizeClientBounds(target.bounds);
    const targetX = Number(target.point?.x);
    const targetY = Number(target.point?.y);
    editTargetsBySlide[key] = {
      type: target.type === "component" ? "component" : "region",
      id: String(target.id || `region_${currentDeck.slides[currentSlideIndex].number}`),
      label: String(target.label || "Custom region"),
      bounds,
      point: Number.isFinite(targetX) && Number.isFinite(targetY)
        ? {
            x: roundPercent(clamp(targetX, bounds.x, bounds.x + bounds.w)),
            y: roundPercent(clamp(targetY, bounds.y, bounds.y + bounds.h))
          }
        : targetPointFromBounds(bounds)
    };
  } else {
    delete editTargetsBySlide[key];
  }

  renderEditTargetSelection();
  renderSelectedTargetSummary();
  if (rerenderPanel) renderComponentEditorPanel();
  updateAgentPathwayCopy();
  if (focusInput) geminiEditInput?.focus();
}

function componentEditTarget(slide, cell, index) {
  const bounds = getAnswerRegionSet(cell).primary || normalizeClientBounds(cell.bounds);
  return {
    type: "component",
    id: cell.id,
    label: `Answer ${index + 1}: ${cell.question}`,
    bounds,
    point: targetPointFromBounds(bounds)
  };
}

function selectTargetAtPoint(point) {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  const cells = Array.isArray(slide.interactiveCells) ? slide.interactiveCells : [];
  const matchIndex = cells.findIndex((cell) => {
    const bounds = getAnswerRegionSet(cell).primary;
    if (!bounds) return false;
    return (
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.w &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.h
    );
  });

  if (matchIndex >= 0) {
    const cell = cells[matchIndex];
    setSelectedEditTarget(
      {
        ...componentEditTarget(slide, cell, matchIndex),
        point
      },
      { focusInput: true }
    );
    return;
  }

  setSelectedEditTarget(
    {
      type: "region",
      id: `region_${slide.number}`,
      label: `Custom region on slide ${slide.number}`,
      bounds: defaultRegionBounds(point),
      point
    },
    { focusInput: true }
  );
}

function pointFromPointerEvent(event) {
  const rect = editTargetOverlay.getBoundingClientRect();
  return {
    x: roundPercent(clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100)),
    y: roundPercent(clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100))
  };
}

function syncSelectedComponentBounds(target) {
  if (!currentDeck || target?.type !== "component") return;
  const slide = currentDeck.slides[currentSlideIndex];
  const cell = slide.interactiveCells?.find((candidate) => candidate.id === target.id);
  if (!cell) return;

  setPrimaryAnswerBounds(cell, target.bounds);
  triggerAutosaveBounds(slide);
  renderSlideStage(slide);
}

function answerKey(slide, cell) {
  return `${currentDeck.id}:${slide.number}:${cell.id}`;
}

function answerOrderKey(slide) {
  return `${currentDeck.id}:${slide.number}`;
}

function getInteractiveCells(slide) {
  const cells = Array.isArray(slide?.interactiveCells) ? slide.interactiveCells : [];
  cells.forEach((cell, index) => {
    if (cell && !cell.id) cell.id = `question_${index + 1}`;
  });
  return cells;
}

function isAnswerRevealed(slide, cell) {
  return answerStates[answerKey(slide, cell)] === true;
}

function setAnswerRevealed(slide, cell, revealed) {
  const key = answerKey(slide, cell);
  const orderKey = answerOrderKey(slide);
  const order = Array.isArray(answerRevealOrder[orderKey])
    ? answerRevealOrder[orderKey].filter((id) => id !== cell.id)
    : [];

  answerStates[key] = Boolean(revealed);
  if (revealed) order.push(cell.id);
  answerRevealOrder[orderKey] = order;
}

function getAnswerRevealOrder(slide) {
  const validIds = new Set(getInteractiveCells(slide).map((cell) => cell.id));
  const order = Array.isArray(answerRevealOrder[answerOrderKey(slide)])
    ? answerRevealOrder[answerOrderKey(slide)]
    : [];
  return order.filter((id) => validIds.has(id));
}

function getRevealedAnswerCount(slide) {
  return getInteractiveCells(slide).filter((cell) => isAnswerRevealed(slide, cell)).length;
}

function normalizeMediaStatus(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-");
}

function getGeminiCellForBuild(slide, step) {
  if (!step?.id || !Array.isArray(slide?.geminiImageCells)) return null;
  return slide.geminiImageCells.find((cell) => cell?.id === step.id) || null;
}

function approvedGeminiImageUrl(slide, step) {
  const cell = getGeminiCellForBuild(slide, step);
  const source = String(step?.source || cell?.source || "").toLowerCase();
  if (source !== DEFAULT_AGENT_PATHWAY) return null;

  const generationStatus = normalizeMediaStatus(
    step?.generationStatus || cell?.generationStatus || cell?.status
  );
  const qaStatus = normalizeMediaStatus(step?.qaStatus || cell?.qaStatus);
  const generationSignals = [
    step?.generationStatus,
    step?.status,
    cell?.generationStatus,
    cell?.status
  ]
    .map(normalizeMediaStatus)
    .filter(Boolean);
  const qaSignals = [step?.qaStatus, cell?.qaStatus]
    .map(normalizeMediaStatus)
    .filter(Boolean);
  const blockedGenerationStates = new Set([
    "planned",
    "failed",
    "error",
    "queued",
    "pending",
    "generating"
  ]);
  if (generationSignals.some((status) => blockedGenerationStates.has(status))) return null;
  if (qaSignals.some((status) => status !== "approved")) return null;
  if (generationStatus !== "ready" || qaStatus !== "approved") return null;

  const outputUrl =
    step?.outputImageUrl ||
    cell?.outputImageUrl ||
    step?.approvedImageUrl ||
    cell?.approvedImageUrl ||
    step?.imageUrl ||
    null;
  if (!outputUrl) return null;

  const normalizedOutputUrl = String(outputUrl).trim();
  const fallbackUrls = [
    step?.fallbackImageUrl,
    cell?.fallbackImageUrl,
    step?.sourceImageUrl,
    cell?.sourceImageUrl,
    slide?.originalImageUrl,
    slide?.imageUrl
  ]
    .filter(Boolean)
    .map((url) => String(url).trim());
  return fallbackUrls.includes(normalizedOutputUrl) ? null : normalizedOutputUrl;
}

function normalizeBuildSteps(slide) {
  const rawSteps = Array.isArray(slide?.progressiveBuilds) ? slide.progressiveBuilds : [];
  let steps = rawSteps.map((rawStep, index) => {
    const step = rawStep && typeof rawStep === "object" ? rawStep : {};
    const matchingGeminiCell = getGeminiCellForBuild(slide, step);
    const explicitKind = String(step.kind || step.mediaType || step.type || "").toLowerCase();
    const videoUrl = step.videoUrl || step.video?.url || step.videoFileName || null;
    const source = String(step.source || matchingGeminiCell?.source || "").toLowerCase();
    const approvedImageUrl = approvedGeminiImageUrl(slide, step);
    const imageUrl = source === DEFAULT_AGENT_PATHWAY
      ? approvedImageUrl
      : step.outputImageUrl || step.imageUrl || step.image?.url || step.imageFileName || null;
    const kind = explicitKind.includes("video") || String(step.mimeType || "").startsWith("video/") || Boolean(videoUrl)
      ? "video"
      : "image";

    return {
      ...step,
      id: String(step.id || step.stepId || `build_${step.version || index + 1}`),
      version: Number(step.version) || index + 1,
      kind,
      source: source || step.source,
      label: String(step.label || `Build ${index + 1}`),
      imageUrl: imageUrl || (
        kind === "image" && source !== DEFAULT_AGENT_PATHWAY ? slide?.imageUrl : null
      ),
      videoUrl,
      posterUrl: step.posterUrl || step.fallbackImageUrl || imageUrl || slide?.imageUrl || "",
      startTime: Number.isFinite(Number(step.startTime)) ? Number(step.startTime) : 0,
      endTime: Number.isFinite(Number(step.endTime)) ? Number(step.endTime) : null
    };
  });

  // Legacy manifests sometimes stored a slide-level video and expected it to
  // occupy the first progressive step.
  const legacySlideVideoUrl = slide?.videoUrl || slide?.videoFileName;
  if (legacySlideVideoUrl) {
    if (steps.length === 0) {
      steps = [
        {
          id: "build_video_1",
          version: 1,
          kind: "video",
          label: slide.videoLabel || "Video",
          videoUrl: legacySlideVideoUrl,
          imageUrl: null,
          posterUrl: slide.posterUrl || slide.imageUrl || "",
          startTime: Number.isFinite(Number(slide.startTime)) ? Number(slide.startTime) : 0,
          endTime: Number.isFinite(Number(slide.endTime)) ? Number(slide.endTime) : null
        }
      ];
    } else if (!steps[0].videoUrl) {
      steps[0] = {
        ...steps[0],
        kind: "video",
        videoUrl: legacySlideVideoUrl,
        posterUrl: steps[0].posterUrl || slide.posterUrl || slide.imageUrl || ""
      };
    }
  }

  return steps.filter((step) =>
    step.kind === "video" ? Boolean(step.videoUrl) : Boolean(step.imageUrl)
  );
}

function isVideoMediaEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  const explicitKind = String(entry.kind || entry.mediaType || entry.type || "").toLowerCase();
  return (
    explicitKind.includes("video") ||
    String(entry.source || "").toLowerCase() === "gemini-video" ||
    String(entry.mimeType || "").toLowerCase().startsWith("video/") ||
    Boolean(entry.videoUrl || entry.videoFileName || entry.video?.url)
  );
}

function slideHasProtectedVideoMedia(slide) {
  if (!slide || typeof slide !== "object") return false;
  if (
    slide.protectedVideo === true ||
    slide.animationPlan?.mode === "protected-video" ||
    Number(slide.animationPlan?.protectedVideoCount) > 0
  ) {
    return true;
  }

  const mediaEntries = [
    slide,
    ...(Array.isArray(slide.progressiveBuilds) ? slide.progressiveBuilds : []),
    ...(Array.isArray(slide.mediaBuilds) ? slide.mediaBuilds : []),
    ...(Array.isArray(slide.generatedMedia) ? slide.generatedMedia : []),
    ...(Array.isArray(slide.media) ? slide.media : []),
    ...(Array.isArray(slide.history) ? slide.history : [])
  ];
  return mediaEntries.some(isVideoMediaEntry);
}

function getSidebarGeminiImageCells(slide) {
  if (slideHasProtectedVideoMedia(slide)) return [];
  const cells = Array.isArray(slide?.geminiImageCells) ? slide.geminiImageCells : [];
  return cells.filter(
    (cell) =>
      cell &&
      cell.source === DEFAULT_AGENT_PATHWAY &&
      Boolean(cell.id) &&
      Boolean(String(cell.prompt || "").trim())
  );
}

function geminiBuildRequestKey(deckId, slideNumber, buildId) {
  return `${deckId}:${slideNumber}:${buildId}`;
}

function hasLiveWebEmbed(slide) {
  return Boolean(slide?.interactiveType === "web_embed" && slide.webEmbed?.url);
}

function isApprovedGeminiImageStep(step) {
  return step?.kind === "image" && step.source === DEFAULT_AGENT_PATHWAY;
}

function getStageBuildSteps(slide) {
  const mediaSteps = normalizeBuildSteps(slide);
  const hasApprovedGeminiImages = mediaSteps.some(isApprovedGeminiImageStep);
  if (!hasLiveWebEmbed(slide) || !hasApprovedGeminiImages) return mediaSteps;

  return [
    ...mediaSteps,
    {
      id: `web_embed_${slide.number || "slide"}_live`,
      version: mediaSteps.length + 1,
      kind: "web-embed",
      label: slide.webEmbed.label || slide.webEmbed.title || "Live interactive",
      webEmbed: slide.webEmbed
    }
  ];
}

function shouldRenderDirectWebEmbed(slide) {
  return hasLiveWebEmbed(slide) && !normalizeBuildSteps(slide).some(isApprovedGeminiImageStep);
}

function isGeneratedQuestionAnswerSequence(slide) {
  if (
    slide?.interactiveType === "starter_qa_grid" ||
    getInteractiveCells(slide).length === 0
  ) {
    return false;
  }
  const usesQuestionAnswerStrategy =
    slide?.animationPlan?.strategy === "question-answer-reveal" ||
    slide?.geminiImageCells?.some(
      (cell) => cell?.strategy === "question-answer-reveal"
    );
  return Boolean(
    usesQuestionAnswerStrategy &&
    normalizeBuildSteps(slide).some(isApprovedGeminiImageStep)
  );
}

function questionAnswerBuildSteps(slide) {
  if (!isGeneratedQuestionAnswerSequence(slide)) return [];
  const strategyCellIds = new Set(
    (slide.geminiImageCells || [])
      .filter((cell) => cell?.strategy === "question-answer-reveal")
      .map((cell) => cell.id)
  );
  return normalizeBuildSteps(slide).filter(
    (step) =>
      isApprovedGeminiImageStep(step) &&
      (strategyCellIds.size === 0 || strategyCellIds.has(step.id))
  );
}

function questionAnswerRevealCountForCurrentStep(slide) {
  if (!isGeneratedQuestionAnswerSequence(slide)) return null;
  const stageSteps = getStageBuildSteps(slide);
  if (currentMediaBuildStep <= 0) return 0;
  const currentStep = stageSteps[currentMediaBuildStep - 1];
  const cells = getInteractiveCells(slide);
  if (currentStep?.kind === "web-embed") return cells.length;

  const answerBuilds = questionAnswerBuildSteps(slide);
  const answerBuildIndex = answerBuilds.findIndex((step) => step.id === currentStep?.id);
  if (answerBuildIndex >= 0) return clamp(answerBuildIndex, 0, cells.length);

  const currentStageIndex = stageSteps.findIndex((step) => step.id === currentStep?.id);
  const lastAnswerStageIndex = stageSteps.findIndex(
    (step) => step.id === answerBuilds.at(-1)?.id
  );
  return currentStageIndex > lastAnswerStageIndex ? cells.length : 0;
}

function syncQuestionAnswersToCurrentBuild(slide) {
  const revealCount = questionAnswerRevealCountForCurrentStep(slide);
  if (revealCount === null) return null;
  getInteractiveCells(slide).forEach((cell, index) => {
    setAnswerRevealed(slide, cell, index < revealCount);
  });
  return revealCount;
}

function setQuestionAnswerRevealCount(slide, requestedCount) {
  if (!isGeneratedQuestionAnswerSequence(slide)) return false;
  const cells = getInteractiveCells(slide);
  const answerBuilds = questionAnswerBuildSteps(slide);
  if (answerBuilds.length === 0) return false;
  const revealCount = clamp(Number(requestedCount) || 0, 0, cells.length);
  const targetBuild = answerBuilds[Math.min(revealCount, answerBuilds.length - 1)];
  const stageIndex = getStageBuildSteps(slide).findIndex(
    (step) => step.id === targetBuild?.id
  );
  if (stageIndex < 0) return false;
  currentMediaBuildStep = stageIndex + 1;
  syncQuestionAnswersToCurrentBuild(slide);
  return true;
}

function currentBuildForSlide(slide) {
  const steps = getStageBuildSteps(slide);
  return currentMediaBuildStep > 0 ? steps[currentMediaBuildStep - 1] || null : null;
}

function isSequenceComplete(slide) {
  const buildsComplete = currentMediaBuildStep >= getStageBuildSteps(slide).length;
  const answersComplete = getRevealedAnswerCount(slide) >= getInteractiveCells(slide).length;
  return buildsComplete && answersComplete;
}

function updateStageControls(slide) {
  const buildSteps = getStageBuildSteps(slide);
  const cells = getInteractiveCells(slide);
  const hasBuilds = buildSteps.length > 0;
  const hasAnswers = cells.length > 0;
  const synchronizedAnswers = isGeneratedQuestionAnswerSequence(slide);
  const revealedCount = getRevealedAnswerCount(slide);
  const currentBuild = currentBuildForSlide(slide);

  qaControls?.classList.toggle("hidden", !hasBuilds && !hasAnswers);
  buildControlsGroup?.classList.toggle("hidden", !hasBuilds);
  answerControlsGroup?.classList.toggle("hidden", !hasAnswers || synchronizedAnswers);
  answerActionsGroup?.classList.toggle("hidden", !hasAnswers);
  autoPlaySequenceGroup?.classList.toggle("hidden", !hasBuilds && !hasAnswers);
  qaControlsDivider?.classList.toggle("hidden", !hasAnswers);

  if (qaControls) {
    qaControls.setAttribute(
      "aria-label",
      synchronizedAnswers
        ? "Synchronized question and answer build controls"
        : hasBuilds && hasAnswers
        ? "Build and answer controls"
        : hasBuilds
          ? "Progressive build controls"
          : "Answer reveal controls"
    );
  }

  const minStep = buildSteps.length > 0 ? 1 : 0;
  if (serialStepBadge) {
    serialStepBadge.textContent = buildSteps.length > 0
      ? `${currentMediaBuildStep} / ${buildSteps.length} · ${currentBuild?.label || `Build ${currentMediaBuildStep}`}`
      : "0 / 0";
  }
  if (answerStepBadge) {
    answerStepBadge.textContent = revealedCount === 0
      ? `0 / ${cells.length} · hidden`
      : `${revealedCount} / ${cells.length} revealed`;
  }

  if (prevBuildStepBtn) prevBuildStepBtn.disabled = currentMediaBuildStep <= minStep;
  if (nextBuildStepBtn) nextBuildStepBtn.disabled = currentMediaBuildStep >= buildSteps.length;
  if (prevAnswerBtn) prevAnswerBtn.disabled = revealedCount === 0;
  if (nextAnswerBtn) nextAnswerBtn.disabled = revealedCount >= cells.length;
  if (revealAllBtn) revealAllBtn.disabled = !hasAnswers || revealedCount >= cells.length;
  if (hideAllBtn) hideAllBtn.disabled = !hasAnswers || revealedCount === 0;
  if (autoPlayBuildsBtn && !autoPlayInterval) {
    autoPlayBuildsBtn.disabled = isSequenceComplete(slide);
  }
}

function stopAutoPlay() {
  if (autoPlayInterval) clearTimeout(autoPlayInterval);
  autoPlayInterval = null;
  if (autoPlayBuildsBtn) {
    autoPlayBuildsBtn.classList.remove("active");
    autoPlayBuildsBtn.innerHTML = "<span>▶</span> Auto play";
  }
}

function autoPlayDelayForSlide(slide) {
  const currentBuild = currentBuildForSlide(slide);
  if (
    currentBuild?.kind === "video" &&
    currentBuild.endTime !== null &&
    currentBuild.endTime > currentBuild.startTime
  ) {
    return Math.max(800, (currentBuild.endTime - currentBuild.startTime) * 1000 + 200);
  }
  return Number(currentBuild?.autoAdvanceDelayMs) ||
    Number(slide.serialAnimation?.autoAdvanceDelayMs) ||
    2500;
}

function scheduleAutoPlay(slide) {
  autoPlayInterval = setTimeout(() => {
    if (currentDeck?.slides[currentSlideIndex] !== slide || isSequenceComplete(slide)) {
      stopAutoPlay();
      updateStageControls(slide);
      return;
    }
    advanceSerialBuildStep();
    if (!isSequenceComplete(slide)) scheduleAutoPlay(slide);
    else {
      stopAutoPlay();
      updateStageControls(slide);
    }
  }, autoPlayDelayForSlide(slide));
}

function toggleAutoPlay() {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  if (getStageBuildSteps(slide).length === 0 && getInteractiveCells(slide).length === 0) return;

  if (autoPlayInterval) {
    stopAutoPlay();
    updateStageControls(slide);
    return;
  }

  if (isSequenceComplete(slide)) return;

  autoPlayBuildsBtn?.classList.add("active");
  if (autoPlayBuildsBtn) {
    autoPlayBuildsBtn.disabled = false;
    autoPlayBuildsBtn.innerHTML = "<span>Ⅱ</span> Pause";
  }
  scheduleAutoPlay(slide);
}

let imageRenderToken = 0;
let videoPlaybackToken = 0;
let videoCleanupCallbacks = [];
let pendingVideoReplay = null;

function setSlideImageSource(imageUrl) {
  if (!slideImage || !imageUrl) return;
  const fullUrl = new URL(imageUrl, window.location.href).href;
  if (slideImage.src === fullUrl) return;

  const token = ++imageRenderToken;
  const preloader = new Image();
  preloader.decoding = "async";
  preloader.src = imageUrl;

  const commit = () => {
    if (token !== imageRenderToken) return;
    slideImage.src = imageUrl;
  };
  if (typeof preloader.decode === "function") {
    preloader.decode().then(commit).catch(commit);
  } else {
    preloader.addEventListener("load", commit, { once: true });
    preloader.addEventListener("error", commit, { once: true });
  }
}

function cleanupVideoSegmentHandler(videoEl = slideVideo) {
  videoPlaybackToken++;
  videoCleanupCallbacks.forEach((cleanup) => cleanup());
  videoCleanupCallbacks = [];
  pendingVideoReplay = null;
  videoPlayFallback?.classList.add("hidden");
  videoEl?.classList.remove("playback-blocked");
}

function addVideoListener(videoEl, eventName, handler, options) {
  videoEl.addEventListener(eventName, handler, options);
  videoCleanupCallbacks.push(() => videoEl.removeEventListener(eventName, handler, options));
}

function hideSlideVideo() {
  if (!slideVideo) return;
  slideVideo.pause();
  slideVideo.muted = false;
  cleanupVideoSegmentHandler(slideVideo);
  slideVideo.classList.add("hidden");
  slideVideo.classList.remove("playback-blocked");
  videoPlayFallback?.classList.add("hidden");
}

function showVideoBuild(slide, build) {
  if (!slideVideo || !build?.videoUrl) return;
  slideVideo.pause();
  cleanupVideoSegmentHandler(slideVideo);

  const token = videoPlaybackToken;
  const fullUrl = new URL(build.videoUrl, window.location.href).href;
  const posterUrl = build.posterUrl || build.imageUrl || slide.imageUrl || "";
  if (posterUrl) slideVideo.poster = posterUrl;
  slideVideo.controls = false;
  slideVideo.removeAttribute("controls");
  slideVideo.classList.remove("hidden");

  // Allow clicking anywhere on the video player to toggle play / pause or unmute
  addVideoListener(slideVideo, "click", () => {
    if (slideVideo.muted) {
      slideVideo.muted = false;
    }
    if (slideVideo.paused) {
      slideVideo.play().catch((err) => console.warn("Click play prevented:", err));
      slideVideo.classList.remove("playback-blocked");
      videoPlayFallback?.classList.add("hidden");
    } else {
      slideVideo.pause();
    }
  });

  addVideoListener(slideVideo, "error", () => {
    if (token !== videoPlaybackToken) return;
    console.error("Slide video error encountered:", slideVideo.error);
    slideVideo.classList.add("playback-blocked");
    if (videoPlayFallback) {
      videoPlayFallback.innerHTML = '<span aria-hidden="true">▶</span><span>Play video</span>';
      videoPlayFallback.classList.remove("hidden");
    }
  });

  if (slideVideo.src !== fullUrl) {
    slideVideo.src = build.videoUrl;
    slideVideo.load();
  }

  const startTime = Math.max(0, build.startTime || 0);
  const endTime = build.endTime !== null && build.endTime > startTime ? build.endTime : null;

  const attemptPlay = () => {
    if (token !== videoPlaybackToken) return;
    const playResult = slideVideo.play();
    if (playResult?.then) {
      playResult
        .then(() => {
          if (token !== videoPlaybackToken) return;
          pendingVideoReplay = null;
          slideVideo.classList.remove("playback-blocked");
          videoPlayFallback?.classList.add("hidden");
        })
        .catch((err) => {
          if (token !== videoPlaybackToken) return;
          console.warn("Unmuted autoplay restricted by browser policy; trying muted autoplay:", err);
          // Browsers allow muted autoplay without prior user interaction.
          slideVideo.muted = true;
          const mutedResult = slideVideo.play();
          if (mutedResult?.then) {
            mutedResult
              .then(() => {
                if (token !== videoPlaybackToken) return;
                // Video is playing smoothly muted. Provide unmute button.
                pendingVideoReplay = () => {
                  slideVideo.muted = false;
                  slideVideo.play().catch(() => {});
                  slideVideo.classList.remove("playback-blocked");
                  videoPlayFallback?.classList.add("hidden");
                };
                slideVideo.classList.add("playback-blocked");
                if (videoPlayFallback) {
                  videoPlayFallback.innerHTML = '<span aria-hidden="true">🔊</span><span>Unmute audio</span>';
                  videoPlayFallback.classList.remove("hidden");
                }
              })
              .catch(() => {
                // If even muted play was blocked, provide full play button
                pendingVideoReplay = () => {
                  slideVideo.muted = false;
                  slideVideo.play().catch(() => {});
                  slideVideo.classList.remove("playback-blocked");
                  videoPlayFallback?.classList.add("hidden");
                };
                slideVideo.classList.add("playback-blocked");
                if (videoPlayFallback) {
                  videoPlayFallback.innerHTML = '<span aria-hidden="true">▶</span><span>Play video</span>';
                  videoPlayFallback.classList.remove("hidden");
                }
              });
          }
        });
    }
  };

  const beginSegment = () => {
    if (token !== videoPlaybackToken) return;
    const safeStart = Number.isFinite(slideVideo.duration)
      ? Math.min(startTime, Math.max(0, slideVideo.duration - 0.05))
      : startTime;
    try {
      if (Math.abs(slideVideo.currentTime - safeStart) > 0.05) {
        slideVideo.currentTime = safeStart;
      }
    } catch (error) {
      console.warn("Could not seek video build:", error);
    }

    if (endTime !== null) {
      const stopAtSegmentEnd = () => {
        if (token !== videoPlaybackToken || slideVideo.currentTime < endTime) return;
        slideVideo.pause();
        try {
          slideVideo.currentTime = endTime;
        } catch (error) {}
      };
      addVideoListener(slideVideo, "timeupdate", stopAtSegmentEnd);
    }
    attemptPlay();
  };

  if (slideVideo.readyState >= HTMLMediaElement.HAVE_METADATA) beginSegment();
  else addVideoListener(slideVideo, "loadedmetadata", beginSegment, { once: true });
}

function renderMediaBuild(slide, build) {
  slideImage?.classList.remove("hidden");
  const imageUrl = build?.kind === "video"
    ? build.posterUrl || build.imageUrl || slide.imageUrl
    : build?.imageUrl || slide.imageUrl;
  setSlideImageSource(imageUrl);

  if (build?.kind === "video") showVideoBuild(slide, build);
  else hideSlideVideo();
}

function normalizeRevealMode(cell) {
  const explicitMode = String(cell?.revealMode || cell?.answerRevealMode || "").toLowerCase();
  if (
    explicitMode === "overlay" ||
    cell?.overlayAnswer === true ||
    cell?.answerIsBaked === false
  ) {
    return "overlay";
  }
  return "unmask";
}

function appendInteractiveGrid(slide) {
  const cells = getInteractiveCells(slide);

  cells.forEach((cell, index) => {
    const revealed = isAnswerRevealed(slide, cell);
    const revealMode = isGeneratedQuestionAnswerSequence(slide)
      ? "unmask"
      : normalizeRevealMode(cell);
    const regions = getAnswerRegionSet(cell);
    const bounds = regions.primary;
    if (!bounds) return;

    if (!revealed && revealMode === "unmask") {
      regions.secondary.forEach((secondaryBounds, regionIndex) => {
        const secondaryMask = document.createElement("div");
        secondaryMask.id = `qa_region_${cell.id}_${regionIndex + 2}`;
        secondaryMask.className = "qa-card-overlay qa-secondary-region masked";
        secondaryMask.setAttribute("aria-hidden", "true");
        secondaryMask.style.left = `${secondaryBounds.x}%`;
        secondaryMask.style.top = `${secondaryBounds.y}%`;
        secondaryMask.style.width = `${secondaryBounds.w}%`;
        secondaryMask.style.height = `${secondaryBounds.h}%`;
        interactiveOverlay.appendChild(secondaryMask);
      });
    }

    const card = document.createElement("button");

    card.type = "button";
    card.id = `qa_card_${cell.id}`;
    card.className = `qa-card-overlay ${revealed ? `revealed reveal-${revealMode}` : "masked"}`;
    card.style.left = `${bounds.x}%`;
    card.style.top = `${bounds.y}%`;
    card.style.width = `${bounds.w}%`;
    card.style.height = `${bounds.h}%`;
    card.title = revealed ? "Hide this answer" : `Reveal answer: ${cell.question || `Question ${index + 1}`}`;
    card.setAttribute("aria-pressed", String(revealed));
    card.setAttribute(
      "aria-label",
      revealed
        ? `Hide answer for ${cell.question || `question ${index + 1}`}`
        : `Reveal answer for ${cell.question || `question ${index + 1}`}`
    );

    const content = document.createElement("span");
    content.className = "qa-card-content";
    if (!revealed) {
      const prompt = document.createElement("span");
      prompt.className = "qa-prompt-badge";
      prompt.textContent = "Click to reveal";
      content.appendChild(prompt);
    } else if (revealMode === "overlay") {
      const answer = document.createElement("span");
      answer.className = "qa-answer-text";
      answer.textContent = cell.expectedAnswer || cell.answer || "Answer revealed";
      content.appendChild(answer);
    } else {
      const revealedStatus = document.createElement("span");
      revealedStatus.className = "sr-only";
      revealedStatus.textContent = "Answer revealed. Activate again to hide it.";
      content.appendChild(revealedStatus);
    }
    card.appendChild(content);

    card.addEventListener("click", () => {
      const shouldReveal = !isAnswerRevealed(slide, cell);
      if (isGeneratedQuestionAnswerSequence(slide)) {
        setQuestionAnswerRevealCount(slide, shouldReveal ? index + 1 : index);
      } else {
        setAnswerRevealed(slide, cell, shouldReveal);
      }
      if (answerLiveRegion) {
        answerLiveRegion.textContent = shouldReveal
          ? `Answer ${index + 1} revealed${cell.expectedAnswer ? `: ${cell.expectedAnswer}` : "."}`
          : `Answer ${index + 1} hidden.`;
      }
      announceAnswerReveal(cell, index, shouldReveal);
      renderSlideStage(slide);
      if (activeSidebarTab === "editor") renderComponentEditorPanel();
    });

    interactiveOverlay.appendChild(card);
  });
  return cells.length > 0;
}

function renderSlideStage(slide = currentDeck?.slides[currentSlideIndex]) {
  if (!slide) return;

  if (shouldRenderDirectWebEmbed(slide)) {
    renderWebEmbed(slide);
    return;
  }

  const buildSteps = getStageBuildSteps(slide);
  const minStep = buildSteps.length > 0 ? 1 : 0;
  currentMediaBuildStep = clamp(currentMediaBuildStep, minStep, buildSteps.length);
  const currentBuild = currentBuildForSlide(slide);
  syncQuestionAnswersToCurrentBuild(slide);

  if (currentBuild?.kind === "web-embed") {
    renderWebEmbed(slide, { preserveSequenceControls: true });
    updateStageControls(slide);
    renderEditTargetSelection();
    return;
  }

  hideWebEmbed();
  renderMediaBuild(slide, currentBuild);

  interactiveOverlay.innerHTML = "";
  const hasAnswers = appendInteractiveGrid(slide);
  interactiveOverlay.classList.toggle("hidden", !hasAnswers);
  updateStageControls(slide);
  renderEditTargetSelection();
}

function moveMediaBuildStep(slide, direction) {
  const totalSteps = getStageBuildSteps(slide).length;
  const minStep = totalSteps > 0 ? 1 : 0;
  const nextStep = clamp(currentMediaBuildStep + direction, minStep, totalSteps);
  if (nextStep === currentMediaBuildStep) return false;
  currentMediaBuildStep = nextStep;
  syncQuestionAnswersToCurrentBuild(slide);
  return true;
}

function advanceMediaBuildStep() {
  if (!currentDeck) return false;
  const slide = currentDeck.slides[currentSlideIndex];
  if (!moveMediaBuildStep(slide, 1)) return false;
  renderSlideStage(slide);
  if (activeSidebarTab === "editor") renderComponentEditorPanel();
  return true;
}

function regressMediaBuildStep() {
  if (!currentDeck) return false;
  const slide = currentDeck.slides[currentSlideIndex];
  const minStep = getStageBuildSteps(slide).length > 0 ? 1 : 0;
  if (currentMediaBuildStep <= minStep) return false;
  if (!moveMediaBuildStep(slide, -1)) return false;
  renderSlideStage(slide);
  if (activeSidebarTab === "editor") renderComponentEditorPanel();
  return true;
}

function revealNextAnswer() {
  if (!currentDeck) return false;
  const slide = currentDeck.slides[currentSlideIndex];
  const cells = getInteractiveCells(slide);
  if (isGeneratedQuestionAnswerSequence(slide)) {
    const revealedCount = getRevealedAnswerCount(slide);
    if (revealedCount >= cells.length) return false;
    setQuestionAnswerRevealCount(slide, revealedCount + 1);
    renderSlideStage(slide);
    if (activeSidebarTab === "editor") renderComponentEditorPanel();
    return true;
  }
  const nextCell = cells.find((cell) => !isAnswerRevealed(slide, cell));
  if (!nextCell) return false;
  setAnswerRevealed(slide, nextCell, true);
  renderSlideStage(slide);
  if (activeSidebarTab === "editor") renderComponentEditorPanel();
  return true;
}

function hidePreviousAnswer() {
  if (!currentDeck) return false;
  const slide = currentDeck.slides[currentSlideIndex];
  const cells = getInteractiveCells(slide);
  if (isGeneratedQuestionAnswerSequence(slide)) {
    const revealedCount = getRevealedAnswerCount(slide);
    if (revealedCount <= 0) return false;
    setQuestionAnswerRevealCount(slide, revealedCount - 1);
    renderSlideStage(slide);
    if (activeSidebarTab === "editor") renderComponentEditorPanel();
    return true;
  }
  const revealOrder = getAnswerRevealOrder(slide);
  const previousId = revealOrder.at(-1) || [...cells].reverse().find((cell) => isAnswerRevealed(slide, cell))?.id;
  const previousCell = cells.find((cell) => cell.id === previousId);
  if (!previousCell) return false;
  setAnswerRevealed(slide, previousCell, false);
  renderSlideStage(slide);
  if (activeSidebarTab === "editor") renderComponentEditorPanel();
  return true;
}

function advanceSerialBuildStep() {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  if (!advanceMediaBuildStep() && !revealNextAnswer()) {
    stopAutoPlay();
    updateStageControls(slide);
  }
}

function regressSerialBuildStep() {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  if (isGeneratedQuestionAnswerSequence(slide)) {
    regressMediaBuildStep();
    return;
  }
  if (!hidePreviousAnswer()) regressMediaBuildStep();
}

/* ==========================================================================
   ♿ VISUAL IMPAIRMENT (VI) & ACCESSIBILITY CONTROLLER
   RNIB / APH / Perkins / WCAG 2.2 Level AAA Educational Accommodations
   ========================================================================== */

const DEFAULT_VI_SETTINGS = {
  enabled: false,
  theme: "yellow-black", // "yellow-black", "cyan-black", "cream-black"
  fontScale: "large",    // "normal", "large", "xlarge"
  spacing: true,
  slideFilter: false,
  autoReadAnswer: true,

  zoomLevel: 1.0,
};

let viSettings = { ...DEFAULT_VI_SETTINGS };
let viPanState = { isPanning: false, startX: 0, startY: 0, panX: 0, panY: 0 };

function loadViSettings() {
  try {
    const raw = localStorage.getItem("vibeDeck_vi_settings");
    if (raw) {
      viSettings = { ...DEFAULT_VI_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn("Could not parse saved VI settings:", err);
  }
}

function saveViSettings() {
  try {
    localStorage.setItem("vibeDeck_vi_settings", JSON.stringify(viSettings));
  } catch (err) {
    console.warn("Could not save VI settings:", err);
  }
}

function applyViSettings() {
  const isEnabled = Boolean(viSettings.enabled);
  document.body.classList.toggle("vi-mode", isEnabled);

  // Clear existing VI theme and typography classes
  document.body.classList.remove(
    "vi-theme-yellow-black",
    "vi-theme-cyan-black",
    "vi-theme-cream",
    "vi-text-lg",
    "vi-text-xl"
  );

  if (isEnabled) {
    const themeClass =
      viSettings.theme === "cyan-black"
        ? "vi-theme-cyan-black"
        : viSettings.theme === "cream-black"
        ? "vi-theme-cream"
        : "vi-theme-yellow-black";
    document.body.classList.add(themeClass);

    if (viSettings.fontScale === "large") {
      document.body.classList.add("vi-text-lg");
    } else if (viSettings.fontScale === "xlarge") {
      document.body.classList.add("vi-text-xl");
    }

    document.body.classList.toggle("vi-spacing", Boolean(viSettings.spacing));
    if (slideImage) {
      slideImage.classList.toggle("vi-invert-filter", Boolean(viSettings.slideFilter));
    }
  } else {
    document.body.classList.remove("vi-spacing");
    if (slideImage) {
      slideImage.classList.remove("vi-invert-filter");
    }
    const savedTheme = localStorage.getItem("vibeDeck_theme") || "light";
    applyTheme(savedTheme);
  }



  // Header VI Toggle status
  const viToggleBtn = document.getElementById("viModeToggleBtn");
  if (viToggleBtn) {
    viToggleBtn.setAttribute("aria-pressed", String(isEnabled));
    viToggleBtn.setAttribute(
      "title",
      isEnabled
        ? "Visual Impairment Accommodations Active (Alt+A)"
        : "Visual Impairment & Accessibility Accommodations (Alt+A)"
    );
  }

  syncViModalInputs();
}

function syncViModalInputs() {
  const masterCb = document.getElementById("viModeMasterCheckbox");
  if (masterCb) masterCb.checked = Boolean(viSettings.enabled);

  const themeButtons = document.querySelectorAll(".vi-theme-choice");
  themeButtons.forEach((btn) => {
    const theme = btn.getAttribute("data-vi-theme");
    const isActive = theme === viSettings.theme;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-checked", String(isActive));
  });

  const fontSelect = document.getElementById("viTextScaleSelect");
  if (fontSelect) fontSelect.value = viSettings.fontScale || "large";

  const spacingCb = document.getElementById("viSpacingCheckbox");
  if (spacingCb) spacingCb.checked = Boolean(viSettings.spacing);

  const filterCb = document.getElementById("viSlideFilterCheckbox");
  if (filterCb) filterCb.checked = Boolean(viSettings.slideFilter);

  const autoReadCb = document.getElementById("viAutoReadAnswerCheckbox");
  if (autoReadCb) autoReadCb.checked = Boolean(viSettings.autoReadAnswer);


}

function openViSettingsModal() {
  const modal = document.getElementById("viSettingsModal");
  if (!modal) return;
  syncViModalInputs();
  modal.classList.remove("hidden");
  const masterCb = document.getElementById("viModeMasterCheckbox");
  masterCb?.focus();
}

function closeViSettingsModal() {
  const modal = document.getElementById("viSettingsModal");
  if (modal && !modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
    const viBtn = document.getElementById("viModeToggleBtn");
    viBtn?.focus();
  }
}

// Slide Zoom & Pan
function setSlideZoom(level) {
  const clamped = Math.min(2.5, Math.max(1.0, Math.round(level * 100) / 100));
  viSettings.zoomLevel = clamped;
  const zoomText = document.getElementById("zoomLevelText");
  if (zoomText) zoomText.textContent = `${Math.round(clamped * 100)}%`;

  if (clamped <= 1.0) {
    viPanState.panX = 0;
    viPanState.panY = 0;
    slideWrapper?.classList.remove("is-zoomed", "is-panning");
  } else {
    slideWrapper?.classList.add("is-zoomed");
  }

  applySlideTransform();
}

function resetSlideZoom() {
  setSlideZoom(1.0);
}

function applySlideTransform() {
  const { zoomLevel } = viSettings;
  const { panX, panY } = viPanState;
  const transform = zoomLevel > 1.0
    ? `scale(${zoomLevel}) translate(${panX / zoomLevel}px, ${panY / zoomLevel}px)`
    : "none";

  if (slideImage) slideImage.style.transform = transform;
  if (interactiveOverlay) interactiveOverlay.style.transform = transform;
  if (slideVideo) slideVideo.style.transform = transform;
}

// Text-to-Speech (TTS)
function speakText(text, isInterrupt = true) {
  if (!("speechSynthesis" in window) || !text) return;
  if (isInterrupt && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  const cleanText = String(text).replace(/[\n\r]+/g, " ").replace(/\s{2,}/g, " ").trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95; // Slightly measured rate for low-vision educational clarity
  utterance.pitch = 1.0;

  const speechBtn = document.getElementById("speechReadBtn");
  utterance.onstart = () => {
    speechBtn?.classList.add("is-speaking");
  };
  utterance.onend = utterance.onerror = () => {
    speechBtn?.classList.remove("is-speaking");
  };

  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  const speechBtn = document.getElementById("speechReadBtn");
  speechBtn?.classList.remove("is-speaking");
}

function readCurrentSlideAloud() {
  if (!currentDeck || !currentDeck.slides || !currentDeck.slides[currentSlideIndex]) {
    speakText("No slide is currently loaded.");
    return;
  }

  const slide = currentDeck.slides[currentSlideIndex];
  const total = currentDeck.totalSlides || currentDeck.slides.length;
  const title = slide.title || `Slide ${slide.number}`;

  let narration = `Slide ${currentSlideIndex + 1} of ${total}: ${title}. `;

  if (slide.cognitiveGuide) {
    narration += `Processing level: ${slide.cognitiveGuide.ragLabel || slide.cognitiveGuide.complexityCategory || "Standard"}. `;
  }

  if (slide.starterQuestions && slide.starterQuestions.length > 0) {
    narration += `Active retrieval slide with ${slide.starterQuestions.length} starter questions. `;
    slide.starterQuestions.forEach((q, idx) => {
      narration += `Question ${idx + 1}: ${q.question || q.label || ""}. `;
    });
  } else if (slide.text) {
    const cleanBody = slide.text
      .replace(/[\n\r]+/g, ". ")
      .replace(/[|—_]+/g, " ")
      .slice(0, 300);
    narration += `Content: ${cleanBody}. `;
  }

  speakText(narration);
}

function announceAnswerReveal(cell, index, revealed) {
  if (!viSettings.enabled || !viSettings.autoReadAnswer) return;
  const answer = cell.expectedAnswer || cell.label || "";
  const announcement = revealed
    ? `Answer ${index + 1} revealed: ${answer}`
    : `Answer ${index + 1} hidden.`;
  speakText(announcement, false);
}

function initVisualImpairmentMode() {
  loadViSettings();
  applyViSettings();

  const viToggleBtn = document.getElementById("viModeToggleBtn");
  viToggleBtn?.addEventListener("click", openViSettingsModal);

  const speechBtn = document.getElementById("speechReadBtn");
  speechBtn?.addEventListener("click", () => {
    if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
      stopSpeech();
    } else {
      readCurrentSlideAloud();
    }
  });

  const closeViBtn = document.getElementById("closeViModalBtn");
  closeViBtn?.addEventListener("click", closeViSettingsModal);

  const skipLink = document.getElementById("skipToViSettingsLink");
  skipLink?.addEventListener("click", (e) => {
    e.preventDefault();
    openViSettingsModal();
  });

  const modalReadBtn = document.getElementById("viModalReadAloudBtn");
  modalReadBtn?.addEventListener("click", () => {
    readCurrentSlideAloud();
  });

  // Master Checkbox
  const masterCb = document.getElementById("viModeMasterCheckbox");
  masterCb?.addEventListener("change", (e) => {
    viSettings.enabled = e.target.checked;
    saveViSettings();
    applyViSettings();
  });

  // Theme choices
  const themeChoices = document.querySelectorAll(".vi-theme-choice");
  themeChoices.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-vi-theme");
      if (theme) {
        viSettings.theme = theme;
        if (!viSettings.enabled) viSettings.enabled = true;
        saveViSettings();
        applyViSettings();
      }
    });
  });

  // Text Scaling
  const fontSelect = document.getElementById("viTextScaleSelect");
  fontSelect?.addEventListener("change", (e) => {
    viSettings.fontScale = e.target.value;
    if (!viSettings.enabled) viSettings.enabled = true;
    saveViSettings();
    applyViSettings();
  });

  // Spacing
  const spacingCb = document.getElementById("viSpacingCheckbox");
  spacingCb?.addEventListener("change", (e) => {
    viSettings.spacing = e.target.checked;
    saveViSettings();
    applyViSettings();
  });

  // Anti-glare slide filter
  const filterCb = document.getElementById("viSlideFilterCheckbox");
  filterCb?.addEventListener("change", (e) => {
    viSettings.slideFilter = e.target.checked;
    saveViSettings();
    applyViSettings();
  });

  // Auto read answers
  const autoReadCb = document.getElementById("viAutoReadAnswerCheckbox");
  autoReadCb?.addEventListener("change", (e) => {
    viSettings.autoReadAnswer = e.target.checked;
    saveViSettings();
  });



  // Zoom buttons
  const zoomInBtn = document.getElementById("zoomInBtn");
  zoomInBtn?.addEventListener("click", () => {
    setSlideZoom(viSettings.zoomLevel + 0.25);
  });

  const zoomOutBtn = document.getElementById("zoomOutBtn");
  zoomOutBtn?.addEventListener("click", () => {
    setSlideZoom(viSettings.zoomLevel - 0.25);
  });

  const zoomResetBtn = document.getElementById("zoomResetBtn");
  zoomResetBtn?.addEventListener("click", resetSlideZoom);

  // Drag pan on slide
  if (slideWrapper) {
    slideWrapper.addEventListener("mousedown", (e) => {
      if (viSettings.zoomLevel <= 1.0) return;
      viPanState.isPanning = true;
      viPanState.startX = e.clientX - viPanState.panX;
      viPanState.startY = e.clientY - viPanState.panY;
      slideWrapper.classList.add("is-panning");
    });
    window.addEventListener("mousemove", (e) => {
      if (!viPanState.isPanning) return;
      viPanState.panX = e.clientX - viPanState.startX;
      viPanState.panY = e.clientY - viPanState.startY;
      applySlideTransform();
    });
    window.addEventListener("mouseup", () => {
      if (viPanState.isPanning) {
        viPanState.isPanning = false;
        slideWrapper.classList.remove("is-panning");
      }
    });
  }


}

// ==========================================================================
// Modified Large Print (MLP) Export System (RNIB / JCQ / APH Educational Specs)
// ==========================================================================

function openMlpExportModal() {
  const modal = document.getElementById("mlpExportModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  const scopeSelect = document.getElementById("mlpScopeSelect");
  scopeSelect?.focus();
}

function closeMlpExportModal() {
  const modal = document.getElementById("mlpExportModal");
  if (modal && !modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
    const exportBtn = document.getElementById("mlpExportBtn");
    exportBtn?.focus();
  }
}

function getSlideQuestions(slide) {
  if (Array.isArray(slide?.interactiveCells) && slide.interactiveCells.length > 0) {
    return slide.interactiveCells;
  }
  if (Array.isArray(slide?.starterQuestions) && slide.starterQuestions.length > 0) {
    return slide.starterQuestions;
  }
  return [];
}

function formatMlpBodyText(text) {
  if (!text) return "";
  const rawParagraphs = text.split(/\r?\n\r?\n/);
  return rawParagraphs
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return "";
      const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const isList = lines.length > 1 && lines.every((l) => /^[-•*]|\d+\.\s/.test(l));
      if (isList) {
        const items = lines
          .map((l) => `<li>${escapeHtml(l.replace(/^[-•*]|\d+\.\s*/, ""))}</li>`)
          .join("");
        return `<ul class="mlp-list">${items}</ul>`;
      }
      return `<p class="mlp-paragraph">${escapeHtml(trimmed.replace(/\s+/g, " "))}</p>`;
    })
    .filter(Boolean)
    .join("");
}

function generateMlpDocument(options = {}) {
  if (!currentDeck || !Array.isArray(currentDeck.slides)) {
    return `<!DOCTYPE html><html lang="en"><body><p>No presentation deck is currently loaded.</p></body></html>`;
  }

  const {
    scope = "all",
    fontSize = "18",
    theme = "black-white",
    mode = "study-guide",
    includeImages = true,
    includeText = true,
    includeQuestions = true,
    includeCognitive = false
  } = options;

  const slidesToExport = scope === "current"
    ? [currentDeck.slides[currentSlideIndex]].filter(Boolean)
    : currentDeck.slides;

  let bg = "#ffffff";
  let text = "#000000";
  let border = "#000000";
  let softBg = "#f8fafc";
  let answerBg = "#f1f5f9";
  let accent = "#222222";
  let themeLabel = "Black on White";

  if (theme === "black-cream") {
    bg = "#fffdec";
    text = "#0a0a0a";
    border = "#1a1a1a";
    softBg = "#f8f5df";
    answerBg = "#f2eed0";
    accent = "#2b2b2b";
    themeLabel = "Black on Soft Cream (Anti-Glare)";
  } else if (theme === "yellow-black") {
    bg = "#000000";
    text = "#ffff00";
    border = "#ffff00";
    softBg = "#141414";
    answerBg = "#1f1f00";
    accent = "#ffff55";
    themeLabel = "Yellow on Black (RNIB Low-Vision)";
  }

  const sizeConfigs = {
    "18": {
      body: "18pt",
      h1: "26pt",
      h2: "22pt",
      h3: "19pt",
      lineHeight: "1.65",
      letterSpacing: "0.02em",
      label: "18pt (Standard MLP Minimum)"
    },
    "24": {
      body: "24pt",
      h1: "34pt",
      h2: "28pt",
      h3: "25pt",
      lineHeight: "1.75",
      letterSpacing: "0.025em",
      label: "24pt (Large MLP)"
    },
    "36": {
      body: "36pt",
      h1: "44pt",
      h2: "38pt",
      h3: "36pt",
      lineHeight: "1.85",
      letterSpacing: "0.03em",
      label: "36pt (Super Large MLP)"
    }
  };

  const type = sizeConfigs[String(fontSize)] || sizeConfigs["18"];
  const deckTitle = currentDeck.title || "Lesson Presentation";
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const slidesHtml = slidesToExport
    .map((slide, sIdx) => {
      const slideNum = slide.number || (scope === "current" ? currentSlideIndex + 1 : sIdx + 1);
      const totalNum = currentDeck.totalSlides || currentDeck.slides.length;
      const slideTitle = slide.title || `Slide ${slideNum}`;

      let imageHtml = "";
      if (includeImages && slide.imageUrl) {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const resolvedUrl = slide.imageUrl.startsWith("http")
          ? slide.imageUrl
          : (origin ? `${origin}${slide.imageUrl.startsWith("/") ? "" : "/"}${slide.imageUrl}` : slide.imageUrl);

        imageHtml = `
          <figure class="mlp-figure">
            <img src="${escapeHtml(resolvedUrl)}" alt="${escapeHtml(slideTitle)}" class="mlp-img" />
            <figcaption class="mlp-caption">Diagram ${slideNum}: ${escapeHtml(slideTitle)}</figcaption>
          </figure>
        `;
      }

      let textHtml = "";
      if (includeText && slide.text) {
        textHtml = `
          <section class="mlp-text-block">
            <h3>Key Concepts &amp; Lesson Notes</h3>
            ${formatMlpBodyText(slide.text)}
          </section>
        `;
      }

      let questionsHtml = "";
      if (includeQuestions) {
        const questions = getSlideQuestions(slide);
        if (questions.length > 0) {
          const items = questions
            .map((q, qIdx) => {
              const qText = q.question || q.label || `Prompt ${qIdx + 1}`;
              const aText = q.expectedAnswer || q.label || "";
              let responseArea = "";

              if (mode === "worksheet") {
                responseArea = `
                  <div class="mlp-write-lines" aria-label="Ruled lines for written response">
                    <div class="mlp-line"></div>
                    <div class="mlp-line"></div>
                    <div class="mlp-line"></div>
                  </div>
                `;
              } else {
                responseArea = `
                  <div class="mlp-model-answer">
                    <div class="mlp-answer-heading">Model Answer / Key Fact:</div>
                    <div class="mlp-answer-text">${escapeHtml(aText || "Refer to teacher lesson commentary")}</div>
                  </div>
                `;
              }

              return `
                <div class="mlp-question-card">
                  <div class="mlp-q-prompt">
                    <strong>Question ${qIdx + 1}:</strong> ${escapeHtml(qText)}
                  </div>
                  ${responseArea}
                </div>
              `;
            })
            .join("");

          questionsHtml = `
            <section class="mlp-questions-block">
              <h3>Active Recall &amp; Knowledge Check</h3>
              ${items}
            </section>
          `;
        }
      }

      let cognitiveHtml = "";
      if (includeCognitive && slide.cognitiveGuide) {
        cognitiveHtml = `
          <div class="mlp-cognitive-box">
            <strong>Cognitive Load Pacing:</strong>
            Level ${escapeHtml(slide.cognitiveGuide.ragLabel || "Standard")} ·
            ${escapeHtml(slide.cognitiveGuide.complexityCategory || "Standard Pace")}
            ${slide.cognitiveGuide.timeGuideDisplay ? `(~${escapeHtml(slide.cognitiveGuide.timeGuideDisplay)})` : ""}
          </div>
        `;
      }

      return `
        <article class="mlp-slide-section">
          <header class="mlp-slide-heading">
            <div class="mlp-slide-kicker">Slide ${slideNum} of ${totalNum}</div>
            <h2 class="mlp-slide-h2">${escapeHtml(slideTitle)}</h2>
          </header>
          ${imageHtml}
          ${textHtml}
          ${questionsHtml}
          ${cognitiveHtml}
        </article>
      `;
    })
    .join("");

  const learnerBox = mode === "worksheet"
    ? `
      <div class="mlp-learner-box">
        <div><strong>Learner Name:</strong> ________________________________________________</div>
        <div><strong>Date:</strong> ________________________</div>
      </div>
    `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(deckTitle)} — Modified Large Print (${type.label})</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 16mm 18mm;
    }
    *, *:before, *:after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 24px;
      font-family: Arial, Helvetica, "Liberation Sans", sans-serif;
      font-size: ${type.body};
      line-height: ${type.lineHeight};
      letter-spacing: ${type.letterSpacing};
      background-color: ${bg};
      color: ${text};
      word-spacing: 0.08em;
      text-align: left;
    }
    .mlp-doc-header {
      border-bottom: 3px solid ${border};
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .mlp-doc-title {
      font-size: ${type.h1};
      font-weight: 800;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }
    .mlp-doc-meta {
      font-size: 0.76em;
      color: ${accent};
      display: flex;
      flex-wrap: wrap;
      gap: 10px 20px;
      margin-top: 10px;
      font-weight: 700;
    }
    .mlp-badge {
      display: inline-block;
      border: 2px solid ${border};
      padding: 4px 10px;
      border-radius: 4px;
      font-weight: 700;
      background-color: ${softBg};
    }
    .mlp-learner-box {
      margin-top: 16px;
      padding: 14px 18px;
      border: 2px solid ${border};
      background-color: ${softBg};
      font-weight: 700;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 16px;
    }
    .mlp-slide-section {
      page-break-after: always;
      break-after: page;
      padding-top: 16px;
      margin-bottom: 36px;
      border-bottom: 2px dashed ${border};
    }
    @media print {
      body {
        padding: 0;
      }
      .mlp-slide-section {
        border-bottom: none;
        margin-bottom: 0;
        padding-top: 0;
      }
      .no-print {
        display: none !important;
      }
    }
    .mlp-slide-heading {
      border-bottom: 2.5px solid ${border};
      padding-bottom: 8px;
      margin-bottom: 18px;
    }
    .mlp-slide-kicker {
      font-size: 0.72em;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 800;
      color: ${accent};
    }
    .mlp-slide-h2 {
      font-size: ${type.h2};
      margin: 4px 0 0 0;
      font-weight: 800;
      line-height: 1.25;
    }
    .mlp-figure {
      margin: 18px 0 24px 0;
      text-align: center;
    }
    .mlp-img {
      max-width: 100%;
      max-height: 460px;
      object-fit: contain;
      border: 2.5px solid ${border};
      border-radius: 4px;
      background: #ffffff;
      display: block;
      margin: 0 auto;
    }
    .mlp-caption {
      font-size: 0.74em;
      margin-top: 8px;
      font-weight: 700;
      text-align: left;
    }
    .mlp-text-block {
      margin: 20px 0;
    }
    .mlp-text-block h3, .mlp-questions-block h3 {
      font-size: ${type.h3};
      margin: 0 0 10px 0;
      font-weight: 800;
      text-decoration: underline;
    }
    .mlp-paragraph {
      margin: 0 0 14px 0;
    }
    .mlp-list {
      margin: 0 0 16px 0;
      padding-left: 28px;
    }
    .mlp-list li {
      margin-bottom: 8px;
    }
    .mlp-question-card {
      margin: 18px 0;
      padding: 16px 20px;
      border: 2px solid ${border};
      border-radius: 6px;
      background-color: ${softBg};
    }
    .mlp-q-prompt {
      margin: 0 0 12px 0;
      font-weight: 700;
    }
    .mlp-write-lines {
      margin-top: 14px;
      display: flex;
      flex-direction: column;
      gap: 15mm;
      padding-top: 4mm;
      padding-bottom: 2mm;
    }
    .mlp-line {
      border-bottom: 2px solid ${border};
      width: 100%;
    }
    .mlp-model-answer {
      margin-top: 12px;
      padding: 12px 16px;
      border: 2px solid ${border};
      border-radius: 4px;
      background-color: ${answerBg};
    }
    .mlp-answer-heading {
      font-weight: 800;
      margin-bottom: 6px;
      text-decoration: underline;
    }
    .mlp-answer-text {
      font-weight: 700;
    }
    .mlp-cognitive-box {
      margin: 18px 0;
      padding: 10px 14px;
      border: 2px solid ${border};
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: 700;
      background-color: ${softBg};
    }
    .mlp-print-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: ${softBg};
      border: 2px solid ${border};
      padding: 10px 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 6px;
    }
    .mlp-print-bar button {
      font-size: 16px;
      font-weight: bold;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      background: ${border};
      color: ${bg};
      border: none;
    }
  </style>
</head>
<body>
  <div class="mlp-print-bar no-print">
    <div><strong>Modified Large Print View (${escapeHtml(type.label)})</strong></div>
    <button type="button" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <header class="mlp-doc-header">
    <h1 class="mlp-doc-title">${escapeHtml(deckTitle)}</h1>
    <div class="mlp-doc-meta">
      <span class="mlp-badge">${escapeHtml(type.label)}</span>
      <span class="mlp-badge">${escapeHtml(themeLabel)}</span>
      <span class="mlp-badge">${mode === "worksheet" ? "Student Worksheet" : "Teacher / Study Guide"}</span>
      <span>Date: ${escapeHtml(dateStr)}</span>
      <span>Standards: RNIB / JCQ / APH</span>
    </div>
    ${learnerBox}
  </header>

  <main>
    ${slidesHtml}
  </main>
</body>
</html>`;
}

function launchMlpPrint(options) {
  const docHtml = generateMlpDocument(options);
  const printIframe = document.createElement("iframe");
  printIframe.style.position = "fixed";
  printIframe.style.right = "0";
  printIframe.style.bottom = "0";
  printIframe.style.width = "0";
  printIframe.style.height = "0";
  printIframe.style.border = "0";
  printIframe.id = "mlpPrintIframe";
  document.body.appendChild(printIframe);

  const frameDoc = printIframe.contentDocument || printIframe.contentWindow.document;
  frameDoc.open();
  frameDoc.write(docHtml);
  frameDoc.close();

  const triggerPrint = () => {
    try {
      printIframe.contentWindow.focus();
      printIframe.contentWindow.print();
    } catch (e) {
      console.warn("Iframe print error, falling back to window popup:", e);
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.open();
        printWin.document.write(docHtml);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => printWin.print(), 500);
      }
    } finally {
      setTimeout(() => {
        if (printIframe.parentNode) {
          printIframe.parentNode.removeChild(printIframe);
        }
      }, 3000);
    }
  };

  const imgs = frameDoc.querySelectorAll("img");
  if (imgs.length === 0) {
    setTimeout(triggerPrint, 300);
  } else {
    let loaded = 0;
    const checkAllLoaded = () => {
      loaded++;
      if (loaded >= imgs.length) {
        setTimeout(triggerPrint, 300);
      }
    };
    imgs.forEach((img) => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.addEventListener("load", checkAllLoaded);
        img.addEventListener("error", checkAllLoaded);
      }
    });
    setTimeout(triggerPrint, 2500);
  }
}

function downloadMlpFile(options) {
  const docHtml = generateMlpDocument(options);
  const deckTitle = currentDeck?.title || "Lesson";
  const slug = deckTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "lesson";
  const filename = `${slug}_Modified_Large_Print_${options.fontSize || 18}pt_${options.mode || "study-guide"}.html`;

  const blob = new Blob([docHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getMlpFormOptions() {
  const scopeSelect = document.getElementById("mlpScopeSelect");
  const sizeSelect = document.getElementById("mlpSizeSelect");
  const themeSelect = document.getElementById("mlpThemeSelect");
  const modeSelect = document.getElementById("mlpModeSelect");
  const includeImagesCb = document.getElementById("mlpIncludeImages");
  const includeTextCb = document.getElementById("mlpIncludeText");
  const includeQuestionsCb = document.getElementById("mlpIncludeQuestions");
  const includeCognitiveCb = document.getElementById("mlpIncludeCognitive");

  return {
    scope: scopeSelect?.value || "all",
    fontSize: sizeSelect?.value || "18",
    theme: themeSelect?.value || "black-white",
    mode: modeSelect?.value || "study-guide",
    includeImages: includeImagesCb ? includeImagesCb.checked : true,
    includeText: includeTextCb ? includeTextCb.checked : true,
    includeQuestions: includeQuestionsCb ? includeQuestionsCb.checked : true,
    includeCognitive: includeCognitiveCb ? includeCognitiveCb.checked : false
  };
}

function initMlpExport() {
  const exportBtn = document.getElementById("mlpExportBtn");
  const closeBtn = document.getElementById("closeMlpModalBtn");
  const viLaunchBtn = document.getElementById("viLaunchMlpBtn");
  const printBtn = document.getElementById("mlpPrintBtn");
  const downloadBtn = document.getElementById("mlpDownloadBtn");
  const modal = document.getElementById("mlpExportModal");

  exportBtn?.addEventListener("click", openMlpExportModal);
  closeBtn?.addEventListener("click", closeMlpExportModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeMlpExportModal();
    }
  });

  viLaunchBtn?.addEventListener("click", () => {
    closeViSettingsModal();
    openMlpExportModal();
  });

  printBtn?.addEventListener("click", () => {
    const options = getMlpFormOptions();
    launchMlpPrint(options);
  });

  downloadBtn?.addEventListener("click", () => {
    const options = getMlpFormOptions();
    downloadMlpFile(options);
  });
}

function initTheme() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const savedTheme = localStorage.getItem("vibeDeck_theme") || "light";

  applyTheme(savedTheme);

  themeToggleBtn?.addEventListener("click", () => {
    const isCurrentlyDark = document.body.classList.contains("theme-dark");
    const newTheme = isCurrentlyDark ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("vibeDeck_theme", newTheme);
  });
}

function applyTheme(theme) {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const isDark = theme === "dark";

  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);

  if (themeToggleBtn) {
    themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
    themeToggleBtn.setAttribute(
      "title",
      isDark ? "Switch to Light theme" : "Switch to Dark theme"
    );
    themeToggleBtn.setAttribute(
      "aria-label",
      isDark ? "Switch to Light theme" : "Switch to Dark theme"
    );
  }
}

async function init() {
  initTheme();
  initVisualImpairmentMode();
  initMlpExport();
  setupEventListeners();
  initWelcomeModal();
  await loadAgentPathways();
  await fetchSlideSets();
}

async function loadAgentPathways() {
  try {
    const response = await fetch("/api/agent-pathways");
    if (!response.ok) throw new Error("Agent pathway configuration is unavailable.");
    const data = await response.json();
    agentPathways = data.pathways || [];

    if (agentPathwaySelect && agentPathways.length) {
      agentPathwaySelect.innerHTML = "";
      agentPathways.forEach((pathway) => {
        const option = document.createElement("option");
        option.value = pathway.id;
        option.textContent = pathway.label;
        agentPathwaySelect.appendChild(option);
      });
      agentPathwaySelect.value = data.defaultPathway || DEFAULT_AGENT_PATHWAY;
    }
  } catch (error) {
    console.warn(error.message);
    if (agentPathwaySelect) agentPathwaySelect.value = DEFAULT_AGENT_PATHWAY;
  }

  updateAgentPathwayCopy();
}

function renderSlideSetsCards() {
  if (!setsCardsContainer || !availableSlideSets?.length) return;
  setsCardsContainer.innerHTML = "";

  availableSlideSets.forEach((set) => {
    const card = document.createElement("button");
    const isActive = set.id === currentSlideSetId;
    card.type = "button";
    card.className = `set-card${isActive ? " is-active-set" : ""}`;
    card.setAttribute("aria-pressed", isActive ? "true" : "false");

    const lessonCount = set.decks?.length || set.totalLessons || 0;
    const categoryLabel = set.category || "Curriculum";

    card.innerHTML = `
      <div class="set-card-top">
        <span class="set-card-icon" aria-hidden="true">${set.icon || "📁"}</span>
        <div class="set-card-badges">
          <span class="set-card-category">${escapeHtml(categoryLabel)}</span>
          ${isActive ? '<span class="set-card-active-tag">Active</span>' : ""}
        </div>
      </div>
      <div class="set-card-content">
        <h4 class="set-card-title">${escapeHtml(set.title)}</h4>
        ${set.description ? `<p class="set-card-description">${escapeHtml(set.description)}</p>` : ""}
      </div>
      <div class="set-card-footer">
        <span class="set-card-count">📚 ${lessonCount} ${lessonCount === 1 ? "Lesson" : "Lessons"}</span>
        <span class="set-card-action">Select →</span>
      </div>
    `;

    card.addEventListener("click", () => {
      currentSlideSetId = set.id;
      try {
        localStorage.setItem("vibe_deck_current_set", set.id);
      } catch {}
      populateLessonsForSlideSet(set.id);
      if (deckSelect?.value) {
        loadDeck(deckSelect.value);
      }
      if (setsModal) setsModal.classList.add("hidden");
    });

    setsCardsContainer.appendChild(card);
  });
}

async function fetchSlideSets() {
  try {
    const response = await fetch("/api/slide-sets");
    if (!response.ok) throw new Error("Could not load slide sets.");
    const data = await response.json();

    if (data.slideSets?.length) {
      availableSlideSets = data.slideSets;
      renderSlideSetsCards();

      // Check URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const urlDeck = urlParams.get("deck");
      const urlSet = urlParams.get("set");
      const urlSlide = parseInt(urlParams.get("slide"), 10);

      let targetSet = null;
      if (urlSet) {
        targetSet = data.slideSets.find((s) => s.id === urlSet);
      }
      if (!targetSet && urlDeck) {
        targetSet = data.slideSets.find((s) =>
          s.decks.some((d) => d.id === urlDeck)
        );
      }
      if (!targetSet) {
        const savedSetId = localStorage.getItem("vibe_deck_current_set");
        if (savedSetId) {
          targetSet = data.slideSets.find((s) => s.id === savedSetId);
        }
      }
      if (!targetSet) {
        targetSet =
          data.slideSets.find((s) => s.id === data.defaultSlideSetId) ||
          data.slideSets[0];
      }

      currentSlideSetId = targetSet.id;

      let targetDeckId = null;
      if (urlDeck && targetSet.decks.some((d) => d.id === urlDeck)) {
        targetDeckId = urlDeck;
      } else {
        const savedDeckId = localStorage.getItem("vibe_deck_current_deck");
        if (savedDeckId && targetSet.decks.some((d) => d.id === savedDeckId)) {
          targetDeckId = savedDeckId;
        } else {
          targetDeckId = targetSet.decks[0]?.id;
        }
      }

      populateLessonsForSlideSet(targetSet.id, targetDeckId);

      const targetSlideIdx = !isNaN(urlSlide) && urlSlide > 0 ? urlSlide - 1 : 0;
      await loadDeck(targetDeckId || targetSet.decks[0]?.id, targetSlideIdx);
      return;
    }
  } catch (error) {
    console.warn("Could not load slide sets, falling back to /api/decks:", error);
  }

  // Fallback to fetchDecks
  await fetchDecks();
}

function populateLessonsForSlideSet(setId, targetDeckId = null) {
  const set = availableSlideSets.find((s) => s.id === setId);
  if (!set || !deckSelect) return;

  if (slideSetBtn) {
    const shortTitle = set.title.includes("·") ? set.title.split("·")[1].trim() : set.title;
    slideSetBtn.innerHTML = `${set.icon || "📁"} ${escapeHtml(shortTitle)}`;
    slideSetBtn.setAttribute("title", `Current Slide Set: ${set.title}. Click to switch sets.`);
  }

  deckSelect.innerHTML = "";
  set.decks.forEach((deck) => {
    const option = document.createElement("option");
    option.value = deck.id;
    option.textContent = deck.title || deck.id;
    deckSelect.appendChild(option);
  });

  if (targetDeckId && set.decks.some((d) => d.id === targetDeckId)) {
    deckSelect.value = targetDeckId;
  } else if (set.decks.length > 0) {
    deckSelect.value = set.decks[0].id;
  }
}

async function fetchDecks() {
  try {
    const response = await fetch("/api/decks");
    if (!response.ok) throw new Error("Could not load converted decks.");
    const data = await response.json();

    if (deckSelect) deckSelect.innerHTML = "";
    if (data.decks?.length) {
      data.decks.forEach((deck) => {
        const option = document.createElement("option");
        option.value = deck.id;
        let displayTitle = deck.title || deck.id;
        if (!/^\d+\./.test(displayTitle)) {
          const match = deck.id.match(/^(?:Classic_)?Lesson_(\d+)_/i);
          if (match) {
            displayTitle = `${parseInt(match[1], 10)}. ${displayTitle}`;
          }
        }
        option.textContent = displayTitle;
        if (deckSelect) deckSelect.appendChild(option);
      });

      const trialDeck = data.decks.find((deck) => deck.id === DEFAULT_TRIAL_DECK);
      await loadDeck(trialDeck?.id || data.defaultDeckId || data.decks[0].id);
      return;
    }

    if (deckTitle) deckTitle.textContent = "Converting trial deck…";
    if (srDeckTitle) srDeckTitle.textContent = "Converting trial deck…";
    const convertResponse = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pathway: DEFAULT_AGENT_PATHWAY,
        pptxPath:
          "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/NotebookLMagent/output/powerpoints_cellbio_sequence_v2/Lesson_01_CELL_STRUCTURE.pptx"
      })
    });

    if (convertResponse.ok) await fetchDecks();
  } catch (error) {
    if (deckTitle) deckTitle.textContent = "Presentation unavailable";
    if (srDeckTitle) srDeckTitle.textContent = "Presentation unavailable";
    console.error("Error loading decks:", error);
  }
}

async function loadDeck(deckId, initialSlideIndex = 0) {
  const loadSessionToken = ++deckSessionToken;
  try {
    const response = await fetch(`/api/decks/${encodeURIComponent(deckId)}`);
    if (!response.ok) throw new Error(`Deck ${deckId} could not be loaded.`);
    const loadedDeck = await response.json();
    if (loadSessionToken !== deckSessionToken) return;
    currentDeck = loadedDeck;
    answerStates = {};
    answerRevealOrder = {};
    editTargetsBySlide = {};
    geminiBuildRequestStates = {};
    currentSlideIndex = 0;
    currentMediaBuildStep = 0;
    if (answerLiveRegion) answerLiveRegion.textContent = "";

    // Sync slide set dropdown if needed
    if (availableSlideSets?.length) {
      const parentSet = availableSlideSets.find((s) =>
        s.decks?.some((d) => d.id === currentDeck.id)
      );
      if (parentSet && parentSet.id !== currentSlideSetId) {
        currentSlideSetId = parentSet.id;
        populateLessonsForSlideSet(parentSet.id, currentDeck.id);
      }
    }

    if (deckSelect) deckSelect.value = currentDeck.id;
    if (deckTitle) deckTitle.textContent = currentDeck.title || deckId;
    if (srDeckTitle) srDeckTitle.textContent = currentDeck.title || deckId;
    document.title = `${currentDeck.title || deckId} · Vibe Deck Agent`;
    try {
      localStorage.setItem("vibe_deck_current_deck", currentDeck.id);
      if (currentSlideSetId)
        localStorage.setItem("vibe_deck_current_set", currentSlideSetId);
    } catch {}

    totalSlidesNum.textContent = currentDeck.totalSlides;
    slideCountBadge.textContent = `${currentDeck.totalSlides} slides`;
    progressBar.setAttribute("aria-valuemax", String(currentDeck.totalSlides));

    renderThumbnails();
    const safeSlideIndex = Math.min(
      Math.max(0, initialSlideIndex),
      (currentDeck.slides?.length || 1) - 1
    );
    renderSlide(safeSlideIndex);
  } catch (error) {
    console.error(`Error loading deck ${deckId}:`, error);
  }
}

function restoreSavedBoundsForSlide(slide) {
  if (!currentDeck || !slide?.interactiveCells) return;
  const storageKey = `deck_bounds_${currentDeck.id}_slide_${slide.number}`;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!saved) return;
    slide.interactiveCells.forEach((cell) => {
      if (saved[cell.id]) {
        setPrimaryAnswerBounds(cell, saved[cell.id]);
      }
    });
  } catch (error) {
    console.warn("Could not restore saved component bounds:", error);
  }
}

function hideWebEmbed() {
  if (!webEmbedLayer) return;
  webEmbedLayer.classList.add("hidden");
  if (webEmbedFrame && webEmbedFrame.src !== "about:blank") {
    webEmbedFrame.src = "about:blank";
  }
}

function renderWebEmbed(slide, { preserveSequenceControls = false } = {}) {
  const embed = slide?.webEmbed;
  if (!embed?.url || !webEmbedLayer || !webEmbedFrame) return false;

  hideSlideVideo();
  slideImage.classList.add("hidden");
  interactiveOverlay.classList.add("hidden");
  interactiveOverlay.innerHTML = "";
  if (!preserveSequenceControls) qaControls?.classList.add("hidden");

  if (webEmbedFrame.getAttribute("src") !== embed.url) {
    webEmbedFrame.src = embed.url;
  }

  webEmbedLayer.classList.remove("hidden");
  return true;
}

function getRagStatus(cognitiveGuide) {
  if (!cognitiveGuide) {
    return { level: "low", label: "Low Processing", color: "green", class: "rag-low", badgeText: "Low" };
  }
  const category = (cognitiveGuide.complexityCategory || "").toLowerCase();
  const vci = Number(cognitiveGuide.vciScore) || 0;
  const time = cognitiveGuide.estimatedTimeSeconds || 0;

  if (category === "high" || vci >= 7.0 || time >= 36) {
    return { level: "high", label: "High Processing", color: "red", class: "rag-high", badgeText: "High" };
  }
  if (category === "moderate" || category === "medium" || vci >= 4.5 || time >= 20) {
    return { level: "medium", label: "Medium Processing", color: "amber", class: "rag-medium", badgeText: "Med" };
  }
  return { level: "low", label: "Low Processing", color: "green", class: "rag-low", badgeText: "Low" };
}

function renderSlide(index) {
  if (!currentDeck || index < 0 || index >= currentDeck.slides.length) return;

  if (slideAutoAdvanceTimer) {
    clearTimeout(slideAutoAdvanceTimer);
    slideAutoAdvanceTimer = null;
  }

  stopAutoPlay();
  stopSpeech();
  resetSlideZoom();
  hideSlideVideo();
  hideWebEmbed();
  slideImage.classList.remove("hidden");
  if (answerLiveRegion) answerLiveRegion.textContent = "";

  currentSlideIndex = index;
  const slide = currentDeck.slides[index];
  const buildSteps = getStageBuildSteps(slide);
  currentMediaBuildStep = buildSteps.length > 0 ? 1 : 0;
  restoreSavedBoundsForSlide(slide);

  const mainContentEl = document.querySelector(".main-content");
  if (mainContentEl) mainContentEl.scrollLeft = 0;
  if (slideStage) slideStage.scrollLeft = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;

  imageRenderToken++;
  const initialImageUrl = buildSteps.length > 0
    ? (buildSteps[0].imageUrl || slide.imageUrl)
    : slide.imageUrl;
  if (initialImageUrl) slideImage.src = initialImageUrl;
  slideImage.alt = slide.title || `Slide ${slide.number} of ${currentDeck.totalSlides}`;
  currentSlideNum.textContent = String(index + 1);

  const progress = ((index + 1) / currentDeck.slides.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", String(index + 1));
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === currentDeck.slides.length - 1;

  updateActiveThumbnail(index);

  const rag = getRagStatus(slide.cognitiveGuide);
  if (cognitiveBadge) {
    cognitiveBadge.classList.remove("rag-low", "rag-medium", "rag-high");
    cognitiveBadge.classList.add(rag.class);
  }

  if (slide.cognitiveGuide) {
    cognitiveTimeText.textContent = `~${slide.cognitiveGuide.timeGuideDisplay}`;
    vciPill.textContent = `VCI: ${slide.cognitiveGuide.vciScore}`;
    if (cognitiveBadge) {
        cognitiveBadge.setAttribute(
          "title",
          `Cognitive Load: ${rag.label} (~${slide.cognitiveGuide.timeGuideDisplay}, VCI: ${slide.cognitiveGuide.vciScore}). Click for full breakdown.`
        );
    }
  } else {
    cognitiveTimeText.textContent = "~30–45s";
    vciPill.textContent = "VCI: 5.0";
    if (cognitiveBadge) {
        cognitiveBadge.setAttribute(
          "title",
          "View academic cognitive load & processing time analysis"
        );
    }
  }

  renderSlideStage(slide);

  if (Number.isFinite(slide.autoAdvanceMs) && slide.autoAdvanceMs > 0 && index < currentDeck.slides.length - 1) {
    slideAutoAdvanceTimer = setTimeout(() => {
      renderSlide(index + 1);
    }, slide.autoAdvanceMs);
  }

  if (activeSidebarTab === "editor") renderComponentEditorPanel();
  renderSelectedTargetSummary();
}

function setAllAnswersRevealed(revealed) {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  const cells = getInteractiveCells(slide);
  if (cells.length === 0) return;

  if (isGeneratedQuestionAnswerSequence(slide)) {
    setQuestionAnswerRevealCount(slide, revealed ? cells.length : 0);
  } else {
    cells.forEach((cell) => setAnswerRevealed(slide, cell, revealed));
  }
  if (answerLiveRegion) {
    answerLiveRegion.textContent = revealed ? "All answers revealed." : "All answers hidden.";
  }
  renderSlideStage(slide);
  if (activeSidebarTab === "editor") renderComponentEditorPanel();
}

function renderThumbnails() {
  if (!thumbnailsGrid || !currentDeck?.slides) return;
  thumbnailsGrid.innerHTML = "";
  currentDeck.slides.forEach((slide, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = `thumb-item ${index === currentSlideIndex ? "active" : ""}`;
    thumb.setAttribute(
      "aria-label",
      `Slide ${index + 1}: ${slide.title || "Slide"}. Press Enter to view, Alt+Up/Down to reorder, or drag to move.`
    );
    thumb.setAttribute("draggable", "true");
    thumb.dataset.slideIndex = String(index);

    const image = document.createElement("img");
    image.src = slide.imageUrl;
    image.alt = "";
    image.loading = "lazy";
    image.draggable = false;

    const number = document.createElement("span");
    number.className = "thumb-num";
    number.textContent = String(index + 1);

    const rag = getRagStatus(slide.cognitiveGuide);
    const ragDot = document.createElement("span");
    ragDot.className = `thumb-rag-dot ${rag.class}`;
    ragDot.title = `${rag.label}: ~${slide.cognitiveGuide?.timeGuideDisplay || "20s"}`;

    const dragHandle = document.createElement("span");
    dragHandle.className = "thumb-drag-handle";
    dragHandle.setAttribute("aria-hidden", "true");
    dragHandle.title = "Drag to reorder slide";
    dragHandle.textContent = "⋮⋮";

    thumb.append(image, number, ragDot, dragHandle);
    thumb.addEventListener("click", () => renderSlide(index));

    // Keyboard accessibility for reordering (Alt+ArrowUp, Alt+ArrowDown)
    thumb.addEventListener("keydown", async (e) => {
      if ((e.altKey || e.metaKey) && e.key === "ArrowUp" && index > 0) {
        e.preventDefault();
        await moveSlideOrder(index, index - 1);
        const updatedThumb = thumbnailsGrid.children[index - 1];
        updatedThumb?.focus();
      } else if (
        (e.altKey || e.metaKey) &&
        e.key === "ArrowDown" &&
        index < currentDeck.slides.length - 1
      ) {
        e.preventDefault();
        await moveSlideOrder(index, index + 1);
        const updatedThumb = thumbnailsGrid.children[index + 1];
        updatedThumb?.focus();
      }
    });

    // Drag-and-drop event handlers
    thumb.addEventListener("dragstart", (e) => {
      draggedSlideIndex = index;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
      setTimeout(() => thumb.classList.add("is-dragging"), 0);
    });

    thumb.addEventListener("dragend", () => {
      draggedSlideIndex = null;
      thumbnailsGrid.querySelectorAll(".thumb-item").forEach((el) => {
        el.classList.remove("is-dragging", "drop-target-above", "drop-target-below");
      });
    });

    thumb.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (draggedSlideIndex === null || draggedSlideIndex === index) {
        thumb.classList.remove("drop-target-above", "drop-target-below");
        return;
      }

      const rect = thumb.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const isAbove = e.clientY < midpoint;

      thumb.classList.toggle("drop-target-above", isAbove);
      thumb.classList.toggle("drop-target-below", !isAbove);
    });

    thumb.addEventListener("dragleave", (e) => {
      if (!thumb.contains(e.relatedTarget)) {
        thumb.classList.remove("drop-target-above", "drop-target-below");
      }
    });

    thumb.addEventListener("drop", async (e) => {
      e.preventDefault();
      thumb.classList.remove("drop-target-above", "drop-target-below");
      const rawSource = e.dataTransfer.getData("text/plain");
      const sourceIdx =
        draggedSlideIndex ??
        (rawSource !== "" ? Number.parseInt(rawSource, 10) : null);
      if (sourceIdx === null || !Number.isInteger(sourceIdx) || sourceIdx === index) return;

      const rect = thumb.getBoundingClientRect();
      const isAbove = e.clientY < rect.top + rect.height / 2;
      let targetIdx = index;
      if (!isAbove && sourceIdx > index) {
        targetIdx = index + 1;
      } else if (isAbove && sourceIdx < index) {
        targetIdx = index - 1;
      }

      await moveSlideOrder(sourceIdx, targetIdx);
    });

    thumbnailsGrid.appendChild(thumb);
  });
}

async function moveSlideOrder(fromIndex, toIndex) {
  if (!currentDeck?.slides || fromIndex === toIndex) return;
  const targetIndex = clamp(toIndex, 0, currentDeck.slides.length - 1);
  if (fromIndex === targetIndex) return;

  const currentActiveSlide = currentDeck.slides[currentSlideIndex];
  const [movedSlide] = currentDeck.slides.splice(fromIndex, 1);
  currentDeck.slides.splice(targetIndex, 0, movedSlide);

  currentDeck.slides.forEach((slide, idx) => {
    slide.number = idx + 1;
  });

  const newActiveIndex = currentDeck.slides.indexOf(currentActiveSlide);
  currentSlideIndex = newActiveIndex >= 0 ? newActiveIndex : 0;

  renderThumbnails();
  updateActiveThumbnail(currentSlideIndex);
  if (currentSlideNum) currentSlideNum.textContent = String(currentSlideIndex + 1);
  if (totalSlidesNum) totalSlidesNum.textContent = String(currentDeck.slides.length);
  if (progressBar) {
    const progress = ((currentSlideIndex + 1) / currentDeck.slides.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute("aria-valuenow", String(currentSlideIndex + 1));
  }
  if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
  if (nextBtn) nextBtn.disabled = currentSlideIndex === currentDeck.slides.length - 1;

  if (answerLiveRegion) {
    answerLiveRegion.textContent = `Slide moved from position ${fromIndex + 1} to position ${targetIndex + 1}.`;
  }

  await persistSlideOrder(currentDeck.id, fromIndex, targetIndex);
}

async function persistSlideOrder(deckId, fromIndex, targetIndex) {
  if (!deckId) return;

  if (slideOrderStatusBadge) {
    slideOrderStatusBadge.className = "slide-order-status saving";
    slideOrderStatusBadge.innerHTML = '<span aria-hidden="true">⏳</span><span>Saving…</span>';
    slideOrderStatusBadge.classList.remove("hidden");
  }

  try {
    const response = await fetch(`/api/decks/${encodeURIComponent(deckId)}/reorder-slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromIndex, toIndex: targetIndex })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to save slide order.");
    }

    if (slideOrderStatusBadge) {
      slideOrderStatusBadge.className = "slide-order-status saved";
      slideOrderStatusBadge.innerHTML = '<span aria-hidden="true">✓</span><span>Saved</span>';
      if (slideOrderSaveTimer) clearTimeout(slideOrderSaveTimer);
      slideOrderSaveTimer = setTimeout(() => {
        slideOrderStatusBadge.classList.add("hidden");
      }, 2400);
    }
  } catch (error) {
    console.error("Error saving slide order:", error);
    if (slideOrderStatusBadge) {
      slideOrderStatusBadge.className = "slide-order-status error";
      slideOrderStatusBadge.innerHTML = '<span aria-hidden="true">⚠️</span><span>Save failed</span>';
      if (slideOrderSaveTimer) clearTimeout(slideOrderSaveTimer);
      slideOrderSaveTimer = setTimeout(() => {
        slideOrderStatusBadge.classList.add("hidden");
      }, 3500);
    }
  }
}

function updateActiveThumbnail(index) {
  const items = thumbnailsGrid.querySelectorAll(".thumb-item");
  items.forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
    item.setAttribute("aria-current", itemIndex === index ? "true" : "false");
    if (itemIndex === index && thumbnailsGrid) {
      const containerTop = thumbnailsGrid.scrollTop;
      const containerHeight = thumbnailsGrid.clientHeight;
      const itemTop = item.offsetTop;
      const itemHeight = item.offsetHeight;

      if (itemTop < containerTop) {
        thumbnailsGrid.scrollTo({ top: itemTop, behavior: "smooth" });
      } else if (itemTop + itemHeight > containerTop + containerHeight) {
        thumbnailsGrid.scrollTo({
          top: itemTop + itemHeight - containerHeight,
          behavior: "smooth"
        });
      }
    }
  });
}

function switchSidebarTab(tabName) {
  activeSidebarTab = tabName;
  sidebar.classList.remove("collapsed");
  toggleSidebarBtn?.setAttribute("aria-expanded", "true");

  const editorActive = tabName === "editor";
  tabOverviewBtn?.classList.toggle("active", !editorActive);
  tabOverviewBtn?.setAttribute("aria-selected", String(!editorActive));
  tabEditorBtn?.classList.toggle("active", editorActive);
  tabEditorBtn?.setAttribute("aria-selected", String(editorActive));
  thumbnailsGrid?.classList.toggle("hidden", editorActive);
  componentEditorView?.classList.toggle("hidden", !editorActive);

  if (editorActive) {
    renderComponentEditorPanel();
    updateAgentPathwayCopy();
  }
  renderEditTargetSelection();
}

function editorSubsectionHeading(title, description) {
  const heading = document.createElement("div");
  heading.className = "component-subsection-heading";

  const titleElement = document.createElement("strong");
  titleElement.textContent = title;
  heading.appendChild(titleElement);

  if (description) {
    const descriptionElement = document.createElement("span");
    descriptionElement.textContent = description;
    heading.appendChild(descriptionElement);
  }
  return heading;
}

function getGeminiBuildStatus(slide, cell) {
  const requestKey = geminiBuildRequestKey(currentDeck?.id, slide.number, cell.id);
  const requestState = geminiBuildRequestStates[requestKey] || null;
  const matchingBuild = Array.isArray(slide.progressiveBuilds)
    ? slide.progressiveBuilds.find((build) => build?.id === cell.id)
    : null;
  const storedStatus = normalizeMediaStatus(
    matchingBuild?.generationStatus || cell.generationStatus || cell.status || "planned"
  );
  const qaStatus = normalizeMediaStatus(matchingBuild?.qaStatus || cell.qaStatus);

  if (requestState) return { ...requestState, storedStatus, qaStatus };
  if (approvedGeminiImageUrl(slide, matchingBuild || cell)) {
    return { state: "success", label: "Approved", message: "", storedStatus, qaStatus };
  }
  if (
    storedStatus === "error" ||
    storedStatus === "failed" ||
    qaStatus === "failed" ||
    qaStatus === "rejected" ||
    qaStatus === "unapproved"
  ) {
    return {
      state: "error",
      label: qaStatus === "rejected" || qaStatus === "unapproved" ? "Not approved" : "Error",
      message: qaStatus === "rejected" || qaStatus === "unapproved"
        ? "This image did not pass approval and is not in the click sequence."
        : "Generation failed.",
      storedStatus,
      qaStatus
    };
  }
  if (
    storedStatus === "ready" ||
    storedStatus === "queued" ||
    storedStatus === "pending" ||
    qaStatus === "pending" ||
    qaStatus === "pending-qa" ||
    qaStatus === "awaiting-approval"
  ) {
    const awaitingQa = storedStatus === "ready" || qaStatus.includes("pending") || qaStatus === "awaiting-approval";
    return {
      state: "queued",
      label: awaitingQa ? "Pending QA" : "Queued",
      message: awaitingQa
        ? "Generated image is awaiting approval and is not yet a click build."
        : "Generation is queued.",
      storedStatus,
      qaStatus
    };
  }
  return { state: "planned", label: "Planned", message: "", storedStatus, qaStatus };
}

function setGeminiBuildRequestState(deckId, slideNumber, buildId, state) {
  geminiBuildRequestStates[geminiBuildRequestKey(deckId, slideNumber, buildId)] = state;
}

function clearGeminiBuildRequestStatesForSlide(deckId, slideNumber) {
  const keyPrefix = `${deckId}:${slideNumber}:`;
  Object.keys(geminiBuildRequestStates).forEach((key) => {
    if (key.startsWith(keyPrefix)) delete geminiBuildRequestStates[key];
  });
}

function slideHasWorkingGeminiRequest(deckId, slideNumber) {
  const keyPrefix = `${deckId}:${slideNumber}:`;
  return Object.entries(geminiBuildRequestStates).some(
    ([key, state]) => key.startsWith(keyPrefix) && state?.state === "working"
  );
}

function isCurrentGeminiBuildRequest(deckId, slideNumber, buildId, requestToken) {
  return geminiBuildRequestStates[
    geminiBuildRequestKey(deckId, slideNumber, buildId)
  ]?.requestToken === requestToken;
}

function updateGeneratedImageFallback(slide, buildId, imageUrl, qaStatus = null) {
  if (!imageUrl || slideHasProtectedVideoMedia(slide)) return;
  const cell = slide.geminiImageCells?.find((candidate) => candidate?.id === buildId);
  if (cell) {
    cell.status = "ready";
    cell.generationStatus = "ready";
    cell.qaStatus = qaStatus || cell.qaStatus || "pending-qa";
    cell.outputImageUrl = imageUrl;
  }
  const build = slide.progressiveBuilds?.find((candidate) => candidate?.id === buildId);
  if (build && !isVideoMediaEntry(build)) {
    build.kind = "image";
    build.mediaType = "image";
    build.imageUrl = imageUrl;
    build.outputImageUrl = imageUrl;
    build.generationStatus = "ready";
    build.qaStatus = qaStatus || build.qaStatus || cell?.qaStatus || "pending-qa";
  }
}

async function generateGeminiBuildCell(slide, cell) {
  if (!currentDeck || !slide || !cell?.id) return;

  const requestedDeckId = currentDeck.id;
  const requestedDeckSessionToken = deckSessionToken;
  const requestedSlideNumber = slide.number;
  const requestedBuildId = cell.id;
  if (
    slideHasProtectedVideoMedia(slide) ||
    slideHasWorkingGeminiRequest(requestedDeckId, requestedSlideNumber)
  ) return;
  const requestToken = ++geminiBuildRequestCounter;
  const initialBuild = slide.progressiveBuilds?.find(
    (candidate) => candidate?.id === requestedBuildId
  );
  const previousGeneratedImageUrl =
    cell.outputImageUrl ||
    (initialBuild?.generationStatus === "ready" ? initialBuild.imageUrl : "") ||
    "";

  setGeminiBuildRequestState(requestedDeckId, requestedSlideNumber, requestedBuildId, {
    state: "working",
    label: "Generating",
    message: "Sending this planned build to Gemini…",
    requestToken
  });
  if (activeSidebarTab === "editor") renderComponentEditorPanel();

  try {
    const response = await fetch(
      `/api/decks/${encodeURIComponent(requestedDeckId)}/slides/${encodeURIComponent(requestedSlideNumber)}/builds/${encodeURIComponent(requestedBuildId)}/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      }
    );
    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }
    if (!response.ok) {
      throw new Error(data.error || `Gemini generation failed (${response.status}).`);
    }

    // A slow request may finish after the user changes decks. Never merge its
    // response into a different deck, and re-check protected media before any
    // client-side slide mutation.
    if (
      !currentDeck ||
      currentDeck.id !== requestedDeckId ||
      deckSessionToken !== requestedDeckSessionToken ||
      !isCurrentGeminiBuildRequest(
        requestedDeckId,
        requestedSlideNumber,
        requestedBuildId,
        requestToken
      )
    ) return;
    const liveSlide = currentDeck.slides.find(
      (candidate) => Number(candidate.number) === Number(requestedSlideNumber)
    );
    if (!liveSlide) return;
    if (slideHasProtectedVideoMedia(liveSlide)) {
      throw new Error("Image generation is unavailable while this slide contains protected video.");
    }

    if (data.protectedVideoDetected && !data.imageUrl) {
      throw new Error(
        String(data.status || "Gemini returned protected video instead of the requested image build.")
      );
    }

    if (data.slide && typeof data.slide === "object") {
      const liveInteractiveCells = liveSlide.interactiveCells;
      Object.assign(liveSlide, data.slide);
      if (liveInteractiveCells) liveSlide.interactiveCells = liveInteractiveCells;
    }
    if (data.imageUrl) {
      updateGeneratedImageFallback(
        liveSlide,
        requestedBuildId,
        data.imageUrl,
        data.qaStatus || null
      );
    }

    const returnedCell = liveSlide.geminiImageCells?.find(
      (candidate) => candidate?.id === requestedBuildId
    );
    const matchingBuild = liveSlide.progressiveBuilds?.find(
      (candidate) => candidate?.id === requestedBuildId
    );
    const returnedGeneratedImageUrl =
      returnedCell?.outputImageUrl ||
      (matchingBuild?.generationStatus === "ready" ? matchingBuild.imageUrl : "") ||
      "";
    const hasGeneratedImage = Boolean(
      data.imageUrl ||
      (returnedGeneratedImageUrl && returnedGeneratedImageUrl !== previousGeneratedImageUrl)
    );
    const isApproved = Boolean(
      matchingBuild && approvedGeminiImageUrl(liveSlide, matchingBuild)
    );
    setGeminiBuildRequestState(requestedDeckId, requestedSlideNumber, requestedBuildId, {
      state: isApproved ? "success" : "queued",
      label: isApproved ? "Approved" : hasGeneratedImage ? "Pending QA" : "Queued",
      message: isApproved
        ? "Approved image added to the click sequence."
        : hasGeneratedImage
          ? "Generated image is awaiting approval and is not yet a click build."
          : String(data.status || "Generation queued in Gemini.")
    });

    if (currentDeck.slides[currentSlideIndex] === liveSlide) {
      if (isApproved) {
        const generatedStepIndex = normalizeBuildSteps(liveSlide).findIndex(
          (build) => build.id === requestedBuildId
        );
        if (generatedStepIndex >= 0) currentMediaBuildStep = generatedStepIndex + 1;
      }
      renderSlideStage(liveSlide);
      if (activeSidebarTab === "editor") renderComponentEditorPanel();
    }
  } catch (error) {
    if (
      !currentDeck ||
      currentDeck.id !== requestedDeckId ||
      deckSessionToken !== requestedDeckSessionToken ||
      !isCurrentGeminiBuildRequest(
        requestedDeckId,
        requestedSlideNumber,
        requestedBuildId,
        requestToken
      )
    ) return;
    setGeminiBuildRequestState(requestedDeckId, requestedSlideNumber, requestedBuildId, {
      state: "error",
      label: "Error",
      message: error.message || "Gemini generation failed."
    });
    if (
      activeSidebarTab === "editor" &&
      Number(currentDeck.slides[currentSlideIndex]?.number) === Number(requestedSlideNumber)
    ) {
      renderComponentEditorPanel();
    }
  }
}

function appendGeminiBuildSection(container, slide, cells) {
  const section = document.createElement("section");
  section.className = "component-editor-section gemini-build-section";
  const slideGenerationInFlight = cells.some(
    (candidate) => getGeminiBuildStatus(slide, candidate).state === "working"
  );
  section.appendChild(
    editorSubsectionHeading(
      "Gemini image builds",
      `${cells.length} image ${cells.length === 1 ? "cell" : "cells"}`
    )
  );

  cells.forEach((cell, index) => {
    const status = getGeminiBuildStatus(slide, cell);
    const working = status.state === "working";
    const card = document.createElement("article");
    card.className = `gemini-build-card status-${status.state}${working ? " is-working" : ""}`;
    card.setAttribute("aria-busy", String(working));
    card.setAttribute("aria-disabled", String(working));

    const header = document.createElement("div");
    header.className = "gemini-build-card-header";
    const label = document.createElement("strong");
    label.textContent = cell.label || `Gemini image build ${index + 1}`;
    const badge = document.createElement("span");
    badge.className = `gemini-build-status status-${status.state}`;
    badge.textContent = status.label;
    header.append(label, badge);

    const promptDetails = document.createElement("details");
    promptDetails.className = "gemini-build-prompt";
    if (working) {
      promptDetails.setAttribute("aria-disabled", "true");
      promptDetails.setAttribute("inert", "");
    }
    const promptSummary = document.createElement("summary");
    promptSummary.textContent = "View Gemini prompt";
    const promptText = document.createElement("p");
    promptText.textContent = cell.prompt;
    promptDetails.append(promptSummary, promptText);

    const footer = document.createElement("div");
    footer.className = "gemini-build-card-footer";
    const feedback = document.createElement("span");
    feedback.className = "gemini-build-feedback";
    if (status.message) {
      feedback.setAttribute("role", "status");
      feedback.setAttribute("aria-live", "polite");
    }
    feedback.textContent = status.message || "Still-image build; video assets are left unchanged.";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-secondary-small gemini-build-generate-btn";
    button.disabled = slideGenerationInFlight;
    button.textContent = working
      ? "Generating…"
      : status.storedStatus === "ready" || status.state === "success"
        ? "Regenerate"
        : status.state === "queued" || status.state === "error"
          ? "Retry"
          : "Generate";
    button.setAttribute(
      "aria-label",
      `${button.textContent} ${cell.label || `Gemini image build ${index + 1}`}`
    );
    button.addEventListener("click", () => generateGeminiBuildCell(slide, cell));

    footer.append(feedback, button);
    card.append(header, promptDetails, footer);
    section.appendChild(card);
  });

  container.appendChild(section);
}

function renderComponentEditorPanel() {
  if (!currentDeck || !componentList) return;
  const slide = currentDeck.slides[currentSlideIndex];
  const selectedTarget = getSelectedEditTarget(slide);
  const interactiveCells = getInteractiveCells(slide);
  const geminiImageCells = getSidebarGeminiImageCells(slide);
  changeSlideHeading.textContent = `Edit slide ${slide.number}`;
  componentList.innerHTML = "";
  renderSelectedTargetSummary();
  renderEditTargetSelection();

  if (geminiImageCells.length > 0) {
    appendGeminiBuildSection(componentList, slide, geminiImageCells);
  }

  if (interactiveCells.length === 0 && geminiImageCells.length === 0) {
    componentList.innerHTML = `
      <div class="empty-editor-state">
        <strong>No pre-detected reveal components.</strong>
        <span>Click anywhere on the slide to create a custom edit region.</span>
      </div>
    `;
    renderVersionHistoryOptions(slide);
    return;
  }

  const questionSection = document.createElement("section");
  questionSection.className = "component-editor-section question-component-section";
  if (interactiveCells.length > 0) {
    questionSection.appendChild(
      editorSubsectionHeading(
        "Answer reveals",
        `${interactiveCells.length} interactive ${interactiveCells.length === 1 ? "answer" : "answers"}`
      )
    );
  }

  interactiveCells.forEach((cell, index) => {
    const revealed = isAnswerRevealed(slide, cell);
    const bounds = getAnswerRegionSet(cell).primary || { x: 0, y: 0, w: 20, h: 20 };
    const card = document.createElement("div");
    const isSelected =
      selectedTarget?.type === "component" && selectedTarget.id === cell.id;
    card.className = `component-card-editor ${isSelected ? "selected" : ""}`;
    card.dataset.cellId = cell.id;
    card.innerHTML = `
      <div class="component-card-header">
        <div>
          <span class="component-title-text">Answer ${index + 1}</span>
          <div class="component-question-sub" title="${escapeHtml(cell.question)}">${escapeHtml(cell.question)}</div>
        </div>
        <div class="component-header-actions">
          <button class="select-component-btn" type="button" aria-pressed="${isSelected}">
            ${isSelected ? "⌖ Targeted" : "⌖ Target"}
          </button>
          <button class="btn btn-outline-small toggle-reveal-btn" type="button">
            ${revealed ? "◉ Revealed" : "● Masked"}
          </button>
        </div>
      </div>
      <div class="boundary-grid">
        ${[
          ["x", "X", bounds.x],
          ["y", "Y", bounds.y],
          ["w", "W", bounds.w],
          ["h", "H", bounds.h]
        ]
          .map(
            ([key, label, value]) => `
              <label class="boundary-field">
                <span>${label} (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  class="bounds-input input-${key}"
                  value="${Number(value).toFixed(1)}"
                  aria-label="${label} boundary percentage for answer ${index + 1}"
                >
              </label>
            `
          )
          .join("")}
      </div>
    `;

    card.querySelector(".select-component-btn").addEventListener("click", () => {
      setSelectedEditTarget(componentEditTarget(slide, cell, index), {
        focusInput: true
      });
    });

    card.querySelector(".toggle-reveal-btn").addEventListener("click", () => {
      if (isGeneratedQuestionAnswerSequence(slide)) {
        setQuestionAnswerRevealCount(slide, revealed ? index : index + 1);
      } else {
        setAnswerRevealed(slide, cell, !revealed);
      }
      renderSlideStage(slide);
      renderComponentEditorPanel();
    });

    const inputs = {
      x: card.querySelector(".input-x"),
      y: card.querySelector(".input-y"),
      w: card.querySelector(".input-w"),
      h: card.querySelector(".input-h")
    };

    const updateBoundaryValues = () => {
      const x = clamp(Number.parseFloat(inputs.x.value) || 0, 0, 99);
      const y = clamp(Number.parseFloat(inputs.y.value) || 0, 0, 99);
      const w = clamp(Number.parseFloat(inputs.w.value) || 1, 1, 100 - x);
      const h = clamp(Number.parseFloat(inputs.h.value) || 1, 1, 100 - y);
      const updatedBounds = { x, y, w, h };
      setPrimaryAnswerBounds(cell, updatedBounds);
      const activeTarget = getSelectedEditTarget(slide);
      if (activeTarget?.type === "component" && activeTarget.id === cell.id) {
        setSelectedEditTarget(
          {
            ...activeTarget,
            bounds: updatedBounds,
            point: targetPointFromBounds(updatedBounds)
          },
          { rerenderPanel: false }
        );
      }

      const overlayCard = document.getElementById(`qa_card_${cell.id}`);
      if (overlayCard) {
        overlayCard.style.left = `${x}%`;
        overlayCard.style.top = `${y}%`;
        overlayCard.style.width = `${w}%`;
        overlayCard.style.height = `${h}%`;
      }
      triggerAutosaveBounds(slide);
    };

    Object.values(inputs).forEach((input) => {
      input.addEventListener("input", updateBoundaryValues);
      input.addEventListener("focus", () => {
        if (getSelectedEditTarget(slide)?.id !== cell.id) {
          setSelectedEditTarget(componentEditTarget(slide, cell, index), {
            rerenderPanel: false
          });
        }
        card.classList.add("active-editing");
      });
      input.addEventListener("blur", () => {
        card.classList.remove("active-editing");
      });
    });

    questionSection.appendChild(card);
  });

  if (interactiveCells.length > 0) componentList.appendChild(questionSection);

  renderVersionHistoryOptions(slide);
}

function renderVersionHistoryOptions(slide) {
  const versionSelect = document.getElementById("versionSelect");
  if (!versionSelect) return;

  const history =
    slide.history && slide.history.length > 0
      ? slide.history
      : [
          {
            id: "original",
            label: "Original Slide Image",
            imageUrl: slide.originalImageUrl || slide.imageUrl
          }
        ];

  versionSelect.innerHTML = history
    .map(
      (entry) => `
      <option value="${escapeHtml(entry.id)}" data-url="${escapeHtml(entry.imageUrl)}">
        ${escapeHtml(entry.label)}
      </option>
    `
    )
    .join("");
}

function triggerAutosaveBounds(slide) {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  const storageKey = `deck_bounds_${currentDeck.id}_slide_${slide.number}`;
  const boundsMap = Object.fromEntries(
    slide.interactiveCells.map((cell) => [cell.id, getAnswerRegionSet(cell).primary])
  );
  localStorage.setItem(storageKey, JSON.stringify(boundsMap));

  autosaveTimer = setTimeout(async () => {
    try {
      const response = await fetch(
        `/api/decks/${encodeURIComponent(currentDeck.id)}/slides/${slide.number}/bounds`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interactiveCells: slide.interactiveCells })
        }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Boundary save failed (${response.status}).`);
      }
    } catch (error) {
      console.error("Autosave error:", error);
    }
  }, 400);
}

function selectedAgentPathway() {
  return agentPathwaySelect?.value || DEFAULT_AGENT_PATHWAY;
}

function updateAgentPathwayCopy({ resetStatus = true } = {}) {
  const selected = selectedAgentPathway();
  const pathway = agentPathways.find((candidate) => candidate.id === selected);
  const target = getSelectedEditTarget();
  const label = pathway?.label ||
    (selected === DEFAULT_AGENT_PATHWAY
      ? "Google Gemini · Image chat"
      : agentPathwaySelect?.selectedOptions[0]?.textContent);

  if (agentPathwayName) agentPathwayName.textContent = label;
  if (agentPathwayDescription) {
    agentPathwayDescription.textContent =
      pathway?.description ||
      "The slide image and your instruction are sent through the active Gemini image chat.";
  }
  if (agentStatus && resetStatus) {
    agentStatus.className = "agent-status";
    agentStatus.textContent = target
      ? `Ready to edit “${target.label}” through ${label}.`
      : `No component selected. The instruction will apply to the whole slide through ${label}.`;
  }

  if (sendGeminiEditBtn) {
    sendGeminiEditBtn.innerHTML = "<span>↗</span> Apply typed edit";
  }
}

async function sendRevisionInstruction() {
  if (!currentDeck) return;
  const promptText = geminiEditInput?.value.trim();
  if (!promptText) {
    agentStatus.textContent = "Add a revision instruction before sending.";
    geminiEditInput?.focus();
    return;
  }

  const slide = currentDeck.slides[currentSlideIndex];
  const originalImageBeforeRevision = slide.originalImageUrl || slide.imageUrl;
  const pathway = selectedAgentPathway();
  const selectedTarget = getSelectedEditTarget(slide);
  const isAnimationStepCheckbox = document.getElementById("isAnimationStepCheckbox");
  const isAnimationStep = Boolean(isAnimationStepCheckbox?.checked);

  const editTarget = selectedTarget || {
    type: "slide",
    id: "slide",
    label: `Whole slide ${slide.number}`,
    bounds: { x: 0, y: 0, w: 100, h: 100 },
    point: { x: 50, y: 50 }
  };
  sendGeminiEditBtn.disabled = true;
  sendGeminiEditBtn.innerHTML = "<span>◌</span> Applying…";
  agentStatus.className = "agent-status working";
  agentStatus.textContent = `Preparing ${editTarget.label.toLowerCase()} and your typed instruction…`;

  try {
    const response = await fetch(
      `/api/decks/${encodeURIComponent(currentDeck.id)}/slides/${slide.number}/revise`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptText,
          pathway,
          componentId: editTarget.id,
          editTarget,
          isAnimationStep
        })
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Revision request failed.");

    const returnedSlide = data.slide || data.updatedSlide;
    if (returnedSlide && typeof returnedSlide === "object") {
      Object.assign(slide, returnedSlide);
    } else if (Array.isArray(data.progressiveBuilds)) {
      slide.progressiveBuilds = data.progressiveBuilds;
    }

    if (data.imageUrl) {
      if (data.isAnimationStep) {
        slide.hasProgressiveBuilds = true;
        if (!Array.isArray(slide.progressiveBuilds) || slide.progressiveBuilds.length === 0) {
          slide.progressiveBuilds = [
            {
              id: "build_1",
              version: 1,
              kind: "image",
              label: "Build 1: Initial View",
              imageUrl: originalImageBeforeRevision
            }
          ];
        }
        const serverReturnedSequence = Boolean(returnedSlide?.progressiveBuilds || data.progressiveBuilds);
        const alreadyPresent = slide.progressiveBuilds.some((build) => build.imageUrl === data.imageUrl);
        if (!serverReturnedSequence && !alreadyPresent) {
          const nextVersion = slide.progressiveBuilds.length + 1;
          const buildLabel = `Build ${nextVersion}: ${editTarget.label || "Custom Edit"}`;
          slide.progressiveBuilds.push({
            id: `build_${Date.now()}`,
            version: nextVersion,
            kind: "image",
            source: "gemini-image",
            label: buildLabel,
            imageUrl: data.imageUrl
          });
        }
        if (slide.serialAnimation) {
          slide.serialAnimation.totalBuildSteps = normalizeBuildSteps(slide).length;
        }
        currentMediaBuildStep = normalizeBuildSteps(slide).length;
      } else {
        slide.imageUrl = data.imageUrl;
        currentMediaBuildStep = 0;
      }

      if (!Array.isArray(slide.history)) {
        slide.history = [
          {
            id: "ver_orig",
            label: "Original Slide Image",
            imageUrl: originalImageBeforeRevision
          }
        ];
      }
      if (!slide.history.some((entry) => entry.imageUrl === data.imageUrl)) {
        slide.history.push({
          id: `ver_${Date.now()}`,
          label: data.isAnimationStep
            ? `Build ${normalizeBuildSteps(slide).length}: ${editTarget.label}`
            : `Edit: ${editTarget.label}`,
          imageUrl: data.imageUrl
        });
      }
      renderVersionHistoryOptions(slide);
      renderSlideStage(slide);
    }

    agentStatus.className = `agent-status ${data.dispatched ? "success" : "queued"}`;
    agentStatus.textContent =
      data.status || `Edit registered for ${editTarget.label.toLowerCase()}.`;
  } catch (error) {
    agentStatus.className = "agent-status error";
    agentStatus.textContent = error.message;
  } finally {
    sendGeminiEditBtn.disabled = false;
    updateAgentPathwayCopy({ resetStatus: false });
  }
}

function startEditPointerInteraction(event) {
  if (
    activeSidebarTab !== "editor" ||
    !presenterMode ||
    sidebar?.classList.contains("collapsed")
  ) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  const target = getSelectedEditTarget();
  const resizeHandle = event.target.closest?.(".edit-resize-handle");
  const targetBox = event.target.closest?.(".edit-target-box");

  if (target && (resizeHandle || targetBox)) {
    editPointerInteraction = {
      pointerId: event.pointerId,
      mode: resizeHandle ? "resize" : "move",
      startPoint: pointFromPointerEvent(event),
      originalTarget: {
        ...target,
        bounds: { ...target.bounds },
        point: { ...target.point }
      }
    };
    editTargetOverlay.setPointerCapture?.(event.pointerId);
    return;
  }

  selectTargetAtPoint(pointFromPointerEvent(event));
}

function moveEditPointerInteraction(event) {
  if (!editPointerInteraction || editPointerInteraction.pointerId !== event.pointerId) {
    return;
  }

  event.preventDefault();
  const pointer = pointFromPointerEvent(event);
  const { mode, startPoint, originalTarget } = editPointerInteraction;
  const dx = pointer.x - startPoint.x;
  const dy = pointer.y - startPoint.y;
  const original = originalTarget.bounds;
  let bounds;

  if (mode === "move") {
    bounds = normalizeClientBounds({
      ...original,
      x: clamp(original.x + dx, 0, 100 - original.w),
      y: clamp(original.y + dy, 0, 100 - original.h)
    });
  } else {
    bounds = normalizeClientBounds({
      ...original,
      w: clamp(original.w + dx, 4, 100 - original.x),
      h: clamp(original.h + dy, 4, 100 - original.y)
    });
  }

  setSelectedEditTarget(
    {
      ...originalTarget,
      bounds,
      point:
        mode === "move"
          ? {
              x: originalTarget.point.x + (bounds.x - original.x),
              y: originalTarget.point.y + (bounds.y - original.y)
            }
          : originalTarget.point
    },
    { rerenderPanel: false }
  );
}

function finishEditPointerInteraction(event) {
  if (!editPointerInteraction || editPointerInteraction.pointerId !== event.pointerId) {
    return;
  }

  editTargetOverlay.releasePointerCapture?.(event.pointerId);
  editPointerInteraction = null;
  const target = getSelectedEditTarget();
  syncSelectedComponentBounds(target);
  renderComponentEditorPanel();
  geminiEditInput?.focus();
}

function togglePresenterMode() {
  presenterMode = !presenterMode;
  document.body.classList.toggle("presenter-mode", presenterMode);
  document.body.classList.toggle("student-mode", !presenterMode);
  modeToggleBtn?.setAttribute("aria-pressed", String(presenterMode));
  modeToggleBtn?.classList.toggle("is-presenter", presenterMode);
  modeToggleBtn?.classList.toggle("is-student", !presenterMode);
  modeToggleBtn?.setAttribute(
    "title",
    presenterMode
      ? "Presenter mode (click for Student mode)"
      : "Student mode (click for Presenter mode)"
  );
  modeToggleBtn?.setAttribute(
    "aria-label",
    presenterMode
      ? "Presenter mode active. Click to switch to Student mode"
      : "Student mode active. Click to switch to Presenter mode"
  );
  if (modeText) {
    modeText.textContent = presenterMode ? "Presenter mode" : "Student mode";
  }

  if (!presenterMode && activeSidebarTab === "editor") {
    switchSidebarTab("overview");
  }
  renderEditTargetSelection();
}

function openCognitiveModal() {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  const guide = slide?.cognitiveGuide;
  if (!guide) return;

  const rag = getRagStatus(guide);

  cognitiveModalBody.innerHTML = `
    <div class="cognitive-rag-banner ${rag.class}">
      <div class="rag-banner-left">
        <span class="rag-banner-dot" aria-hidden="true"></span>
        <div>
          <span class="rag-banner-kicker">Slide ${slide.number} · Cognitive Demand</span>
          <strong class="rag-banner-title">${rag.label}</strong>
        </div>
      </div>
      <span class="rag-banner-pill">~${escapeHtml(guide.timeGuideDisplay)}</span>
    </div>

    <div class="metric-grid">
      <div class="metric-box">
        <label>Recommended processing time</label>
        <div class="val">~${escapeHtml(guide.timeGuideDisplay)}</div>
      </div>
      <div class="metric-box">
        <label>Visual complexity index</label>
        <div class="val">${escapeHtml(guide.vciScore)} / 10 <span class="vci-cat-label">(${guide.complexityCategory})</span></div>
      </div>
      <div class="metric-box">
        <label>Reading and scan burden</label>
        <div class="val metric-secondary">${guide.breakdown.wordCount} words · ${guide.breakdown.visualElementsCount} zones</div>
      </div>
      <div class="metric-box">
        <label>Semantic integration load</label>
        <div class="val metric-secondary">${(guide.breakdown.semanticProcessingMs / 1000).toFixed(1)}s active decoding</div>
      </div>
    </div>

    <div class="rag-modal-scale-card">
      <div class="rag-scale-title">
        <span aria-hidden="true">🚥</span>
        <strong>RAG Processing Time Reference</strong>
      </div>
      <div class="rag-scale-row">
        <div class="rag-scale-badge rag-pill-green">
          <span class="rag-dot" aria-hidden="true"></span>
          <span><strong>Low (~5–19s)</strong>: Quick orientation / summary</span>
        </div>
        <div class="rag-scale-badge rag-pill-amber">
          <span class="rag-dot" aria-hidden="true"></span>
          <span><strong>Medium (~20–35s)</strong>: Multi-zone concept decoding</span>
        </div>
        <div class="rag-scale-badge rag-pill-red">
          <span class="rag-dot" aria-hidden="true"></span>
          <span><strong>High (~36s+)</strong>: Dense diagrams &amp; active recall</span>
        </div>
      </div>
    </div>

    <div class="academic-section">
      <h4>Research foundations</h4>
      <ul class="reference-list">
        ${guide.academicReferences
          .map(
            (reference) => `
              <li class="reference-item">
                <strong>${escapeHtml(reference.citation)}</strong>
                <span>${escapeHtml(reference.relevance)}</span>
              </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;
  cognitiveModal.classList.remove("hidden");
}

function closeCognitiveModal() {
  cognitiveModal?.classList.add("hidden");
}

function initWelcomeModal() {
  const welcomeModal = document.getElementById("welcomeModal");
  const closeWelcomeModalBtn = document.getElementById("closeWelcomeModalBtn");
  const getStartedBtn = document.getElementById("getStartedBtn");
  const aboutAppBtn = document.getElementById("aboutAppBtn");
  const dontShowWelcomeCheckbox = document.getElementById("dontShowWelcomeCheckbox");

  const hidePref = localStorage.getItem("vibeDeck_hide_welcome_modal") === "true";
  if (dontShowWelcomeCheckbox) {
    dontShowWelcomeCheckbox.checked = hidePref;
  }

  // Open automatically on startup unless explicitly opted out
  if (!hidePref && welcomeModal) {
    welcomeModal.classList.remove("hidden");
  }

  function closeWelcome() {
    if (dontShowWelcomeCheckbox) {
      localStorage.setItem("vibeDeck_hide_welcome_modal", String(dontShowWelcomeCheckbox.checked));
    }
    welcomeModal?.classList.add("hidden");
  }

  function openWelcome() {
    welcomeModal?.classList.remove("hidden");
  }

  closeWelcomeModalBtn?.addEventListener("click", closeWelcome);
  getStartedBtn?.addEventListener("click", closeWelcome);
  aboutAppBtn?.addEventListener("click", openWelcome);

  welcomeModal?.addEventListener("click", (event) => {
    if (event.target === welcomeModal) closeWelcome();
  });
}

function goToPreviousSlide() {
  if (currentSlideIndex > 0) renderSlide(currentSlideIndex - 1);
}

function goToNextSlide() {
  if (currentDeck && currentSlideIndex < currentDeck.slides.length - 1) {
    renderSlide(currentSlideIndex + 1);
  }
}

function toggleSidebar() {
  const collapsed = sidebar.classList.toggle("collapsed");
  toggleSidebarBtn?.setAttribute("aria-expanded", String(!collapsed));
  renderEditTargetSelection();
}

function setupEventListeners() {
  prevBtn?.addEventListener("click", goToPreviousSlide);
  nextBtn?.addEventListener("click", goToNextSlide);
  prevBuildStepBtn?.addEventListener("click", regressMediaBuildStep);
  nextBuildStepBtn?.addEventListener("click", advanceMediaBuildStep);
  prevAnswerBtn?.addEventListener("click", hidePreviousAnswer);
  nextAnswerBtn?.addEventListener("click", revealNextAnswer);
  autoPlayBuildsBtn?.addEventListener("click", toggleAutoPlay);
  videoPlayFallback?.addEventListener("click", () => {
    if (slideVideo) slideVideo.muted = false;
    if (typeof pendingVideoReplay === "function") {
      pendingVideoReplay();
    } else if (slideVideo) {
      slideVideo.play().catch((err) => console.warn("Fallback play error:", err));
      slideVideo.classList.remove("playback-blocked");
      videoPlayFallback.classList.add("hidden");
    }
  });
  editComponentBtn?.addEventListener("click", () => switchSidebarTab("editor"));
  cancelRevisionBtn?.addEventListener("click", () => {
    geminiEditInput.value = "";
    agentStatus.textContent = "Typed instruction cleared. The current target is unchanged.";
    geminiEditInput.focus();
  });
  clearEditTargetBtn?.addEventListener("click", () => {
    setSelectedEditTarget(null, { focusInput: true });
  });
  sendGeminiEditBtn?.addEventListener("click", sendRevisionInstruction);
  const revertVersionBtn = document.getElementById("revertVersionBtn");
  if (revertVersionBtn) {
    revertVersionBtn.addEventListener("click", async () => {
      if (!currentDeck) return;
      const slide = currentDeck.slides[currentSlideIndex];
      const versionSelect = document.getElementById("versionSelect");
      const selectedOption = versionSelect?.selectedOptions[0];
      const versionId = versionSelect?.value;
      const imageUrl = selectedOption?.getAttribute("data-url");
      const protectedBuilds = Array.isArray(slide.progressiveBuilds)
        ? slide.progressiveBuilds.map((build) => ({ ...build }))
        : null;

      try {
        revertVersionBtn.disabled = true;
        revertVersionBtn.textContent = "Reverting...";
        const res = await fetch(
          `/api/decks/${encodeURIComponent(currentDeck.id)}/slides/${slide.number}/revert`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ versionId, imageUrl })
          }
        );
        
        let data = {};
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          throw new Error(`Server returned non-JSON error (${res.status}): ${text.replace(/<[^>]*>/g, " ").trim().slice(0, 100)}`);
        }

        if (!res.ok) throw new Error(data.error || "Revert failed.");

        if (data.restoredUrl) {
          const returnedSlide = data.slide || data.updatedSlide;
          if (returnedSlide && typeof returnedSlide === "object") {
            const { progressiveBuilds: ignoredBuilds, ...safeSlideUpdate } = returnedSlide;
            Object.assign(slide, safeSlideUpdate);
          }
          slide.imageUrl = data.restoredUrl;
          if (protectedBuilds) {
            slide.progressiveBuilds = protectedBuilds;
            slide.hasProgressiveBuilds = protectedBuilds.length > 0;
          }
          currentMediaBuildStep = protectedBuilds?.length > 0 ? 1 : 0;
          renderSlideStage(slide);
        }
        agentStatus.className = "agent-status success";
        agentStatus.textContent = "Slide successfully reverted to selected version!";
      } catch (err) {
        agentStatus.className = "agent-status error";
        agentStatus.textContent = err.message;
      } finally {
        revertVersionBtn.disabled = false;
        revertVersionBtn.textContent = "Revert to selected version";
      }
    });
  }

  const clearSequenceBtn = document.getElementById("clearSequenceBtn");
  if (clearSequenceBtn) {
    clearSequenceBtn.addEventListener("click", async () => {
      if (!currentDeck) return;
      const slide = currentDeck.slides[currentSlideIndex];
      const protectedVideoBuilds = Array.isArray(slide.progressiveBuilds)
        ? slide.progressiveBuilds
            .filter(isVideoMediaEntry)
            .map((build) => ({ ...build }))
        : [];
      try {
        clearSequenceBtn.disabled = true;
        clearSequenceBtn.textContent = "Clearing...";
        const res = await fetch(
          `/api/decks/${encodeURIComponent(currentDeck.id)}/slides/${slide.number}/clear-sequence`,
          { method: "POST" }
        );

        let data = {};
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          throw new Error(`Server returned error (${res.status}): ${text.replace(/<[^>]*>/g, " ").trim().slice(0, 100)}`);
        }

        if (!res.ok) throw new Error(data.error || "Clear image builds failed.");

        const returnedSlide = data.slide || data.updatedSlide;
        const authoritativeBuilds = Array.isArray(returnedSlide?.progressiveBuilds)
          ? returnedSlide.progressiveBuilds
          : Array.isArray(data.progressiveBuilds)
            ? data.progressiveBuilds
            : null;
        if (returnedSlide && typeof returnedSlide === "object") {
          const liveInteractiveCells = slide.interactiveCells;
          Object.assign(slide, returnedSlide);
          if (liveInteractiveCells) slide.interactiveCells = liveInteractiveCells;
        }

        let retainedBuilds;
        if (authoritativeBuilds) {
          // The server owns the final sequence. It may intentionally contain
          // protected video plus authored non-Gemini frames, so keep its array
          // and order intact instead of filtering it down to videos.
          slide.progressiveBuilds = authoritativeBuilds;
          retainedBuilds = authoritativeBuilds;
          slide.hasProgressiveBuilds = authoritativeBuilds.length > 0;
          if (
            authoritativeBuilds.length === 0 &&
            !Object.prototype.hasOwnProperty.call(returnedSlide || {}, "serialAnimation")
          ) {
            delete slide.serialAnimation;
          }
          currentMediaBuildStep = authoritativeBuilds.length > 0 ? 1 : 0;
        } else if (protectedVideoBuilds.length > 0) {
          // Compatibility fallback for older servers that return no updated
          // sequence at all. Preserve the local video entries verbatim.
          retainedBuilds = protectedVideoBuilds;
          slide.progressiveBuilds = protectedVideoBuilds;
          slide.hasProgressiveBuilds = true;
          slide.serialAnimation = {
            ...(slide.serialAnimation || {}),
            totalBuildSteps: protectedVideoBuilds.length
          };
          currentMediaBuildStep = 1;
        } else {
          retainedBuilds = [];
          slide.hasProgressiveBuilds = false;
          delete slide.progressiveBuilds;
          delete slide.serialAnimation;
          currentMediaBuildStep = 0;
        }
        clearGeminiBuildRequestStatesForSlide(currentDeck.id, slide.number);
        renderSlideStage(slide);
        if (activeSidebarTab === "editor") renderComponentEditorPanel();

        const retainedVideoCount = retainedBuilds.filter(isVideoMediaEntry).length;
        const retainedFrameCount = retainedBuilds.length - retainedVideoCount;
        const retainedDescriptions = [];
        if (retainedVideoCount > 0) {
          retainedDescriptions.push(
            `${retainedVideoCount} protected video ${retainedVideoCount === 1 ? "build" : "builds"}`
          );
        }
        if (retainedFrameCount > 0) {
          retainedDescriptions.push(
            `${retainedFrameCount} authored ${retainedFrameCount === 1 ? "frame" : "frames"}`
          );
        }
        agentStatus.className = "agent-status success";
        agentStatus.textContent = retainedBuilds.length > 0
          ? `Generated image builds cleared. Retained ${retainedDescriptions.join(" and ")}.`
          : "Generated image builds cleared for this slide.";
      } catch (err) {
        agentStatus.className = "agent-status error";
        agentStatus.textContent = err.message;
      } finally {
        clearSequenceBtn.disabled = false;
        clearSequenceBtn.textContent = "Clear image builds";
      }
    });
  }
  geminiEditInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      sendRevisionInstruction();
    }
  });
  agentPathwaySelect?.addEventListener("change", updateAgentPathwayCopy);
  tabOverviewBtn?.addEventListener("click", () => switchSidebarTab("overview"));
  tabEditorBtn?.addEventListener("click", () => switchSidebarTab("editor"));
  slideSetBtn?.addEventListener("click", () => {
    renderSlideSetsCards();
    if (setsModal) setsModal.classList.remove("hidden");
  });
  closeSetsModalBtn?.addEventListener("click", () => {
    if (setsModal) setsModal.classList.add("hidden");
  });
  setsModal?.addEventListener("click", (event) => {
    if (event.target === setsModal) setsModal.classList.add("hidden");
  });
  deckSelect?.addEventListener("change", (event) => {
    if (event.target.value) loadDeck(event.target.value);
  });
  toggleSidebarBtn?.addEventListener("click", toggleSidebar);
  modeToggleBtn?.addEventListener("click", togglePresenterMode);
  revealAllBtn?.addEventListener("click", () => setAllAnswersRevealed(true));
  hideAllBtn?.addEventListener("click", () => setAllAnswersRevealed(false));
  cognitiveBadge?.addEventListener("click", openCognitiveModal);
  closeModalBtn?.addEventListener("click", closeCognitiveModal);
  cognitiveModal?.addEventListener("click", (event) => {
    if (event.target === cognitiveModal) closeCognitiveModal();
  });
  editTargetOverlay?.addEventListener("pointerdown", startEditPointerInteraction);
  editTargetOverlay?.addEventListener("pointermove", moveEditPointerInteraction);
  editTargetOverlay?.addEventListener("pointerup", finishEditPointerInteraction);
  editTargetOverlay?.addEventListener("pointercancel", finishEditPointerInteraction);

  const updateFullscreenClass = () => {
    const isFS = Boolean(document.fullscreenElement || document.webkitIsFullScreen);
    document.body.classList.toggle("is-fullscreen", isFS);
  };

  fullscreenBtn?.addEventListener("click", () => {
    if (!document.fullscreenElement && !document.webkitIsFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  });

  document.addEventListener("fullscreenchange", updateFullscreenClass);
  document.addEventListener("webkitfullscreenchange", updateFullscreenClass);

  slideStage?.addEventListener(
    "touchstart",
    (event) => {
      if (activeSidebarTab === "editor") return;
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    },
    { passive: true }
  );
  slideStage?.addEventListener(
    "touchend",
    (event) => {
      if (activeSidebarTab === "editor") return;
      if (touchStartX === null) return;
      const distance = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
      touchStartX = null;
      if (Math.abs(distance) < 50) return;
      if (distance < 0) goToNextSlide();
      else goToPreviousSlide();
    },
    { passive: true }
  );

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target?.isContentEditable;
    if (typing) return;

    const viModal = document.getElementById("viSettingsModal");
    const mlpModal = document.getElementById("mlpExportModal");
    const welcomeModal = document.getElementById("welcomeModal");

    if (event.altKey && event.key.toLowerCase() === "p") {
      event.preventDefault();
      if (mlpModal && !mlpModal.classList.contains("hidden")) {
        closeMlpExportModal();
      } else {
        openMlpExportModal();
      }
      return;
    }

    if (event.altKey && (event.key.toLowerCase() === "a" || event.key.toLowerCase() === "v")) {
      event.preventDefault();
      if (viModal && !viModal.classList.contains("hidden")) {
        closeViSettingsModal();
      } else {
        openViSettingsModal();
      }
      return;
    }

    if (event.altKey && event.key.toLowerCase() === "r") {
      event.preventDefault();
      if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
        stopSpeech();
      } else {
        readCurrentSlideAloud();
      }
      return;
    }

    if (event.key === "Escape" && mlpModal && !mlpModal.classList.contains("hidden")) {
      closeMlpExportModal();
    } else if (event.key === "Escape" && viModal && !viModal.classList.contains("hidden")) {
      closeViSettingsModal();
    } else if (event.key === "Escape" && welcomeModal && !welcomeModal.classList.contains("hidden")) {
      welcomeModal.classList.add("hidden");
    } else if (event.key === "Escape" && !cognitiveModal?.classList.contains("hidden")) {
      closeCognitiveModal();
    } else if (
      event.key === "Escape" &&
      activeSidebarTab === "editor" &&
      getSelectedEditTarget()
    ) {
      setSelectedEditTarget(null);
    } else if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
      event.preventDefault();
      goToNextSlide();
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      goToPreviousSlide();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      advanceSerialBuildStep();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      regressSerialBuildStep();
    } else if (event.key === "Home") {
      event.preventDefault();
      renderSlide(0);
    } else if (event.key === "End" && currentDeck) {
      event.preventDefault();
      renderSlide(currentDeck.slides.length - 1);
    } else if (event.key === "+" || event.key === "=") {
      if (!event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setSlideZoom(viSettings.zoomLevel + 0.25);
      }
    } else if (event.key === "-" || event.key === "_") {
      if (!event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setSlideZoom(viSettings.zoomLevel - 0.25);
      }
    } else if (event.key === "0") {
      if (!event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        resetSlideZoom();
      }
    } else if (event.key.toLowerCase() === "t") {
      toggleSidebar();
    } else if (event.key.toLowerCase() === "f") {
      fullscreenBtn?.click();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
