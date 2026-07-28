const DEFAULT_AGENT_PATHWAY = "gemini-image-chat";
const DEFAULT_TRIAL_DECK = "Lesson_01_CELL_STRUCTURE";

let currentDeck = null;
let currentSlideIndex = 0;
let currentBuildStep = 0;
let answerStates = {};
let autoPlayInterval = null;
let activeSidebarTab = "overview";
let autosaveTimer = null;
let presenterMode = true;
let touchStartX = null;
let agentPathways = [];
let editTargetsBySlide = {};
let editPointerInteraction = null;

const deckSelect = document.getElementById("deckSelect");
const deckTitle = document.getElementById("deckTitle");
const slideImage = document.getElementById("slideImage");
const slideStage = document.getElementById("slideStage");
const slideWrapper = document.getElementById("slideWrapper");
const interactiveOverlay = document.getElementById("interactiveOverlay");
const editTargetOverlay = document.getElementById("editTargetOverlay");
const editTargetBox = document.getElementById("editTargetBox");
const editTargetBoxLabel = document.getElementById("editTargetBoxLabel");
const editTargetAnchor = document.querySelector(".edit-target-anchor");
const qaControls = document.getElementById("qaControls");
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
  const bounds = normalizeClientBounds(cell.answerBounds || cell.bounds);
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
    const bounds = normalizeClientBounds(cell.answerBounds || cell.bounds);
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

  cell.answerBounds = { ...target.bounds };
  triggerAutosaveBounds(slide);
  renderInteractiveGrid(slide);
}

function answerKey(slide, cell) {
  return `${currentDeck.id}:${slide.number}:${cell.id}`;
}

function isAnswerRevealed(slide, cell) {
  return answerStates[answerKey(slide, cell)] === true;
}

function setAnswerRevealed(slide, cell, revealed) {
  answerStates[answerKey(slide, cell)] = revealed;
}

function getTotalBuildSteps(slide) {
  if (slide?.isInteractive && Array.isArray(slide.interactiveCells)) {
    return slide.serialAnimation?.totalBuildSteps || slide.interactiveCells.length;
  }
  if (Array.isArray(slide?.progressiveBuilds) && slide.progressiveBuilds.length) {
    return slide.progressiveBuilds.length;
  }
  return 1;
}

function updateBuildStepButtons(slide) {
  const totalSteps = getTotalBuildSteps(slide);
  const revealedCount = slide?.interactiveCells
    ? slide.interactiveCells.filter((cell) => isAnswerRevealed(slide, cell)).length
    : currentBuildStep;

  if (serialStepBadge) {
    serialStepBadge.textContent =
      revealedCount === 0 ? `0 / ${totalSteps} · all hidden` : `${revealedCount} / ${totalSteps} revealed`;
  }
  if (prevBuildStepBtn) prevBuildStepBtn.disabled = currentBuildStep <= 0;
  if (nextBuildStepBtn) nextBuildStepBtn.disabled = currentBuildStep >= totalSteps;
}

function applyInteractiveBuildStep(slide, step) {
  const totalSteps = getTotalBuildSteps(slide);
  currentBuildStep = clamp(step, 0, totalSteps);
  slide.interactiveCells.forEach((cell, index) => {
    setAnswerRevealed(slide, cell, index < currentBuildStep);
  });
}

function stopAutoPlay() {
  if (!autoPlayInterval) return;
  clearInterval(autoPlayInterval);
  autoPlayInterval = null;
  if (autoPlayBuildsBtn) {
    autoPlayBuildsBtn.classList.remove("active");
    autoPlayBuildsBtn.innerHTML = "<span>▶</span> Auto play";
  }
}

function toggleAutoPlay() {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  if (!slide?.isInteractive) return;

  if (autoPlayInterval) {
    stopAutoPlay();
    return;
  }

  autoPlayBuildsBtn?.classList.add("active");
  if (autoPlayBuildsBtn) {
    autoPlayBuildsBtn.innerHTML = "<span>Ⅱ</span> Pause";
  }

  const delay = slide.serialAnimation?.autoAdvanceDelayMs || 2500;
  autoPlayInterval = setInterval(() => {
    if (currentBuildStep >= getTotalBuildSteps(slide)) {
      stopAutoPlay();
      return;
    }
    advanceSerialBuildStep();
  }, delay);
}

function advanceSerialBuildStep() {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  if (!slide?.isInteractive) return;

  const totalSteps = getTotalBuildSteps(slide);
  if (currentBuildStep < totalSteps) {
    applyInteractiveBuildStep(slide, currentBuildStep + 1);
    renderInteractiveGrid(slide);
    if (activeSidebarTab === "editor") renderComponentEditorPanel();
  } else {
    stopAutoPlay();
  }
}

function regressSerialBuildStep() {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  if (!slide?.isInteractive || currentBuildStep <= 0) return;

  applyInteractiveBuildStep(slide, currentBuildStep - 1);
  renderInteractiveGrid(slide);
  if (activeSidebarTab === "editor") {
    renderComponentEditorPanel();
    updateAgentPathwayCopy();
  }
}

async function init() {
  setupEventListeners();
  await loadAgentPathways();
  await fetchDecks();
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

async function fetchDecks() {
  try {
    const response = await fetch("/api/decks");
    if (!response.ok) throw new Error("Could not load converted decks.");
    const data = await response.json();

    deckSelect.innerHTML = "";
    if (data.decks?.length) {
      data.decks.forEach((deck) => {
        const option = document.createElement("option");
        option.value = deck.id;
        option.textContent = deck.title || deck.id;
        deckSelect.appendChild(option);
      });

      const trialDeck = data.decks.find((deck) => deck.id === DEFAULT_TRIAL_DECK);
      await loadDeck(trialDeck?.id || data.defaultDeckId || data.decks[0].id);
      return;
    }

    deckTitle.textContent = "Converting trial deck…";
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
    deckTitle.textContent = "Presentation unavailable";
    console.error("Error loading decks:", error);
  }
}

async function loadDeck(deckId) {
  try {
    const response = await fetch(`/api/decks/${encodeURIComponent(deckId)}`);
    if (!response.ok) throw new Error(`Deck ${deckId} could not be loaded.`);
    currentDeck = await response.json();
    answerStates = {};
    editTargetsBySlide = {};
    currentSlideIndex = 0;
    currentBuildStep = 0;

    deckSelect.value = currentDeck.id;
    deckTitle.textContent = currentDeck.title || deckId;
    totalSlidesNum.textContent = currentDeck.totalSlides;
    slideCountBadge.textContent = `${currentDeck.totalSlides} slides`;
    progressBar.setAttribute("aria-valuemax", String(currentDeck.totalSlides));

    renderThumbnails();
    renderSlide(0);
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
        cell.answerBounds = { ...saved[cell.id] };
      }
    });
  } catch (error) {
    console.warn("Could not restore saved component bounds:", error);
  }
}

function renderSlide(index) {
  if (!currentDeck || index < 0 || index >= currentDeck.slides.length) return;

  stopAutoPlay();
  currentSlideIndex = index;
  currentBuildStep = 0;
  const slide = currentDeck.slides[index];
  restoreSavedBoundsForSlide(slide);

  if (slide.isInteractive && slide.interactiveCells) {
    applyInteractiveBuildStep(slide, 0);
  }

  slideImage.src = slide.imageUrl;
  slideImage.alt = slide.title || `Slide ${slide.number} of ${currentDeck.totalSlides}`;
  currentSlideNum.textContent = String(index + 1);

  const progress = ((index + 1) / currentDeck.slides.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", String(index + 1));
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === currentDeck.slides.length - 1;

  updateActiveThumbnail(index);

  if (slide.cognitiveGuide) {
    cognitiveTimeText.textContent = `~${slide.cognitiveGuide.timeGuideDisplay}`;
    vciPill.textContent = `VCI: ${slide.cognitiveGuide.vciScore}`;
  } else {
    cognitiveTimeText.textContent = "~30–45s";
    vciPill.textContent = "VCI: 5.0";
  }

  if (slide.isInteractive && slide.interactiveCells) {
    renderInteractiveGrid(slide);
  } else {
    interactiveOverlay.classList.add("hidden");
    interactiveOverlay.innerHTML = "";
    qaControls.classList.add("hidden");
  }

  if (activeSidebarTab === "editor") renderComponentEditorPanel();
  renderEditTargetSelection();
  renderSelectedTargetSummary();
}

function renderInteractiveGrid(slide) {
  interactiveOverlay.innerHTML = "";
  interactiveOverlay.classList.remove("hidden");
  qaControls.classList.remove("hidden");
  updateBuildStepButtons(slide);

  slide.interactiveCells.forEach((cell, index) => {
    const revealed = isAnswerRevealed(slide, cell);
    const card = document.createElement("button");
    const bounds = cell.answerBounds || cell.bounds;

    card.type = "button";
    card.id = `qa_card_${cell.id}`;
    card.className = `qa-card-overlay ${revealed ? "revealed" : "masked"}`;
    if (index === currentBuildStep && currentBuildStep < slide.interactiveCells.length) {
      card.classList.add("serial-active");
    }
    card.style.left = `${bounds.x}%`;
    card.style.top = `${bounds.y}%`;
    card.style.width = `${bounds.w}%`;
    card.style.height = `${bounds.h}%`;
    card.title = revealed ? "Hide this answer" : `Reveal answer: ${cell.question}`;
    card.setAttribute("aria-pressed", String(revealed));
    card.setAttribute(
      "aria-label",
      revealed ? `Hide answer for ${cell.question}` : `Reveal answer for ${cell.question}`
    );

    if (!revealed) {
      const content = document.createElement("span");
      content.className = "qa-card-content";

      const prompt = document.createElement("span");
      prompt.className = "qa-prompt-badge";
      prompt.textContent = "Click to reveal";

      const subtext = document.createElement("span");
      subtext.className = "qa-prompt-subtext";
      subtext.textContent = cell.question;

      content.append(prompt, subtext);
      card.appendChild(content);
    }

    card.addEventListener("click", () => {
      setAnswerRevealed(slide, cell, !revealed);
      currentBuildStep = slide.interactiveCells.filter((candidate) =>
        isAnswerRevealed(slide, candidate)
      ).length;
      renderInteractiveGrid(slide);
      if (activeSidebarTab === "editor") renderComponentEditorPanel();
    });

    interactiveOverlay.appendChild(card);
  });
}

function setAllAnswersRevealed(revealed) {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  if (!slide?.interactiveCells) return;

  currentBuildStep = revealed ? getTotalBuildSteps(slide) : 0;
  slide.interactiveCells.forEach((cell) => setAnswerRevealed(slide, cell, revealed));
  renderInteractiveGrid(slide);
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

    thumb.append(image, number);
    thumb.addEventListener("click", () => renderSlide(index));
    thumbnailsGrid.appendChild(thumb);
  });
}

function updateActiveThumbnail(index) {
  const items = thumbnailsGrid.querySelectorAll(".thumb-item");
  items.forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
    item.setAttribute("aria-current", itemIndex === index ? "true" : "false");
    if (itemIndex === index) {
      item.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

function renderComponentEditorPanel() {
  if (!currentDeck || !componentList) return;
  const slide = currentDeck.slides[currentSlideIndex];
  const selectedTarget = getSelectedEditTarget(slide);
  changeSlideHeading.textContent = `Edit slide ${slide.number}`;
  componentList.innerHTML = "";
  renderSelectedTargetSummary();
  renderEditTargetSelection();

  if (!slide.interactiveCells?.length) {
    componentList.innerHTML = `
      <div class="empty-editor-state">
        <strong>No pre-detected reveal components.</strong>
        <span>Click anywhere on the slide to create a custom edit region.</span>
      </div>
    `;
    return;
  }

  slide.interactiveCells.forEach((cell, index) => {
    const revealed = isAnswerRevealed(slide, cell);
    const bounds = cell.answerBounds || cell.bounds || { x: 0, y: 0, w: 20, h: 20 };
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
      setAnswerRevealed(slide, cell, !revealed);
      currentBuildStep = slide.interactiveCells.filter((candidate) =>
        isAnswerRevealed(slide, candidate)
      ).length;
      renderInteractiveGrid(slide);
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
      cell.answerBounds = updatedBounds;
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
        document.getElementById(`qa_card_${cell.id}`)?.classList.add("serial-active");
      });
      input.addEventListener("blur", () => {
        card.classList.remove("active-editing");
        document.getElementById(`qa_card_${cell.id}`)?.classList.remove("serial-active");
      });
    });

    componentList.appendChild(card);
  });
}

function triggerAutosaveBounds(slide) {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  const storageKey = `deck_bounds_${currentDeck.id}_slide_${slide.number}`;
  const boundsMap = Object.fromEntries(
    slide.interactiveCells.map((cell) => [cell.id, cell.answerBounds || cell.bounds])
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
  const pathway = selectedAgentPathway();
  const selectedTarget = getSelectedEditTarget(slide);
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
          editTarget
        })
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Revision request failed.");

    if (data.imageUrl) {
      slide.imageUrl = data.imageUrl;
      slideImage.src = data.imageUrl;
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
  const guide = currentDeck.slides[currentSlideIndex].cognitiveGuide;
  if (!guide) return;

  cognitiveModalBody.innerHTML = `
    <div class="metric-grid">
      <div class="metric-box">
        <label>Recommended processing time</label>
        <div class="val">~${escapeHtml(guide.timeGuideDisplay)}</div>
      </div>
      <div class="metric-box">
        <label>Visual complexity index</label>
        <div class="val">${escapeHtml(guide.vciScore)} / 10</div>
      </div>
      <div class="metric-box">
        <label>Reading and scan burden</label>
        <div class="val metric-secondary">${guide.breakdown.wordCount} words · ${guide.breakdown.visualElementsCount} zones</div>
      </div>
      <div class="metric-box">
        <label>Semantic integration</label>
        <div class="val metric-secondary">${(guide.breakdown.semanticProcessingMs / 1000).toFixed(1)} seconds</div>
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
  prevBuildStepBtn?.addEventListener("click", regressSerialBuildStep);
  nextBuildStepBtn?.addEventListener("click", advanceSerialBuildStep);
  autoPlayBuildsBtn?.addEventListener("click", toggleAutoPlay);
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
  geminiEditInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      sendRevisionInstruction();
    }
  });
  agentPathwaySelect?.addEventListener("change", updateAgentPathwayCopy);
  tabOverviewBtn?.addEventListener("click", () => switchSidebarTab("overview"));
  tabEditorBtn?.addEventListener("click", () => switchSidebarTab("editor"));
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

  fullscreenBtn?.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

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

    if (event.key === "Escape" && !cognitiveModal?.classList.contains("hidden")) {
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
