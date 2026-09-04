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
const slideSetSelect = document.getElementById("slideSetSelect");
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

  if (serialStepBadge) {
    serialStepBadge.textContent = currentMediaBuildStep === 0
      ? `0 / ${buildSteps.length} · Initial view`
      : `${currentMediaBuildStep} / ${buildSteps.length} · ${currentBuild?.label || `Build ${currentMediaBuildStep}`}`;
  }
  if (answerStepBadge) {
    answerStepBadge.textContent = revealedCount === 0
      ? `0 / ${cells.length} · hidden`
      : `${revealedCount} / ${cells.length} revealed`;
  }

  if (prevBuildStepBtn) prevBuildStepBtn.disabled = currentMediaBuildStep <= 0;
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
  cleanupVideoSegmentHandler(slideVideo);
  slideVideo.classList.add("hidden");
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
        .catch(() => {
          if (token !== videoPlaybackToken) return;
          pendingVideoReplay = attemptPlay;
          slideVideo.classList.add("playback-blocked");
          videoPlayFallback?.classList.remove("hidden");
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
  currentMediaBuildStep = clamp(currentMediaBuildStep, 0, buildSteps.length);
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
  const nextStep = clamp(currentMediaBuildStep + direction, 0, totalSteps);
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
  if (!currentDeck || currentMediaBuildStep <= 0) return false;
  const slide = currentDeck.slides[currentSlideIndex];
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

async function fetchSlideSets() {
  try {
    const response = await fetch("/api/slide-sets");
    if (!response.ok) throw new Error("Could not load slide sets.");
    const data = await response.json();

    if (data.slideSets?.length) {
      availableSlideSets = data.slideSets;

      if (slideSetSelect) {
        slideSetSelect.innerHTML = "";
        data.slideSets.forEach((set) => {
          const option = document.createElement("option");
          option.value = set.id;
          option.textContent = `${set.icon ? set.icon + " " : ""}${set.title} (${set.decks?.length || 0})`;
          slideSetSelect.appendChild(option);
        });
      }

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
      if (slideSetSelect) slideSetSelect.value = targetSet.id;

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
          const match = deck.id.match(/^Lesson_(\d+)_/i);
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
        if (slideSetSelect) slideSetSelect.value = parentSet.id;
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
  if (slide.imageUrl) slideImage.src = slide.imageUrl;
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
  thumbnailsGrid.innerHTML = "";
  currentDeck.slides.forEach((slide, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = `thumb-item ${index === currentSlideIndex ? "active" : ""}`;
    thumb.setAttribute("aria-label", `Go to slide ${index + 1}`);

    const image = document.createElement("img");
    image.src = slide.imageUrl;
    image.alt = "";
    image.loading = "lazy";

    const number = document.createElement("span");
    number.className = "thumb-num";
    number.textContent = String(index + 1);

    const rag = getRagStatus(slide.cognitiveGuide);
    const ragDot = document.createElement("span");
    ragDot.className = `thumb-rag-dot ${rag.class}`;
    ragDot.title = `${rag.label}: ~${slide.cognitiveGuide?.timeGuideDisplay || '20s'}`;

    thumb.append(image, number, ragDot);
    thumb.addEventListener("click", () => renderSlide(index));
    thumbnailsGrid.appendChild(thumb);
  });
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
  modeText.textContent = presenterMode ? "Presenter mode" : "Student mode";

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
  videoPlayFallback?.addEventListener("click", () => pendingVideoReplay?.());
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
          currentMediaBuildStep = 0;
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
  slideSetSelect?.addEventListener("change", (event) => {
    const newSetId = event.target.value;
    if (!newSetId) return;
    currentSlideSetId = newSetId;
    try {
      localStorage.setItem("vibe_deck_current_set", newSetId);
    } catch {}
    populateLessonsForSlideSet(newSetId);
    if (deckSelect?.value) {
      loadDeck(deckSelect.value);
    }
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

    const welcomeModal = document.getElementById("welcomeModal");
    if (event.key === "Escape" && welcomeModal && !welcomeModal.classList.contains("hidden")) {
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
    } else if (event.key.toLowerCase() === "t") {
      toggleSidebar();
    } else if (event.key.toLowerCase() === "f") {
      fullscreenBtn?.click();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
