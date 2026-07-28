let currentDeck = null;
let currentSlideIndex = 0;
let currentBuildStep = 1; // Serial build step index for current slide
let answerStates = {}; // cellId -> boolean (true = revealed, false = masked)
let autoPlayInterval = null;

// DOM Elements
const deckSelect = document.getElementById("deckSelect");
const deckTitle = document.getElementById("deckTitle");
const slideImage = document.getElementById("slideImage");
const interactiveOverlay = document.getElementById("interactiveOverlay");
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

// Serial Build Controls & Component Editor Elements
const serialStepBadge = document.getElementById("serialStepBadge");
const prevBuildStepBtn = document.getElementById("prevBuildStepBtn");
const nextBuildStepBtn = document.getElementById("nextBuildStepBtn");
const autoPlayBuildsBtn = document.getElementById("autoPlayBuildsBtn");
const editComponentBtn = document.getElementById("editComponentBtn");
const componentList = document.getElementById("componentList");
const geminiEditInput = document.getElementById("geminiEditInput");
const sendGeminiEditBtn = document.getElementById("sendGeminiEditBtn");

// Sidebar Tab Elements
const tabOverviewBtn = document.getElementById("tabOverviewBtn");
const tabEditorBtn = document.getElementById("tabEditorBtn");
const componentEditorView = document.getElementById("componentEditorView");
let activeSidebarTab = "overview"; // "overview" | "editor"
let autosaveTimer = null;

// Cognitive Processing Elements
const cognitiveBadge = document.getElementById("cognitiveBadge");
const cognitiveTimeText = document.getElementById("cognitiveTimeText");
const vciPill = document.getElementById("vciPill");
const cognitiveModal = document.getElementById("cognitiveModal");
const cognitiveModalBody = document.getElementById("cognitiveModalBody");
const closeModalBtn = document.getElementById("closeModalBtn");

// Initialize App
async function init() {
  await fetchDecks();
  setupEventListeners();
}

// Fetch list of converted decks from backend API
async function fetchDecks() {
  try {
    const res = await fetch("/api/decks");
    const data = await res.json();
    
    deckSelect.innerHTML = "";
    if (data.decks && data.decks.length > 0) {
      data.decks.forEach((deck) => {
        const option = document.createElement("option");
        option.value = deck.id;
        option.textContent = deck.title || deck.id;
        deckSelect.appendChild(option);
      });
      
      // Load first deck
      await loadDeck(data.decks[0].id);
    } else {
      // Trigger automatic conversion of trial deck if empty
      deckTitle.textContent = "Converting Trial Deck...";
      const convertRes = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pptxPath: "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/NotebookLMagent/output/powerpoints_cellbio_sequence_v2/Lesson_01_CELL_STRUCTURE.pptx"
        })
      });
      const convertData = await convertRes.json();
      if (convertData.success) {
        await fetchDecks();
      }
    }
  } catch (err) {
    console.error("Error loading decks:", err);
  }
}

// Load deck manifest and render slides
async function loadDeck(deckId) {
  try {
    const res = await fetch(`/api/decks/${deckId}`);
    currentDeck = await res.json();
    
    deckTitle.textContent = currentDeck.title || deckId;
    totalSlidesNum.textContent = currentDeck.totalSlides;
    slideCountBadge.textContent = `${currentDeck.totalSlides} Slides`;
    
    currentSlideIndex = 0;
    renderThumbnails();
    renderSlide(0);
  } catch (err) {
    console.error(`Error loading deck ${deckId}:`, err);
  }
}

// Render active slide
function renderSlide(index, targetStep = 1) {
  if (!currentDeck || index < 0 || index >= currentDeck.slides.length) return;
  
  stopAutoPlay();
  currentSlideIndex = index;
  const slide = currentDeck.slides[index];

  // Restore saved boundary overrides from localStorage if present
  restoreSavedBoundsForSlide(slide);
  
  // Set build step range
  const totalSteps = slide.serialAnimation ? slide.serialAnimation.totalBuildSteps : 1;
  currentBuildStep = Math.max(1, Math.min(targetStep, totalSteps));

  slideImage.src = slide.imageUrl;
  currentSlideNum.textContent = index + 1;
  
  // Progress bar percentage
  const pct = ((index + 1) / currentDeck.slides.length) * 100;
  progressBar.style.width = `${pct}%`;
  
  // Update prev / next button states
  prevBtn.disabled = index === 0 && currentBuildStep === 1;
  nextBtn.disabled = index === currentDeck.slides.length - 1 && currentBuildStep === totalSteps;

  // Highlight active thumbnail
  updateActiveThumbnail(index);

  // Update Cognitive Processing Time Guide
  if (slide.cognitiveGuide) {
    cognitiveTimeText.textContent = `~${slide.cognitiveGuide.timeGuideDisplay}`;
    vciPill.textContent = `VCI: ${slide.cognitiveGuide.vciScore}`;
  } else {
    cognitiveTimeText.textContent = "~30–45s";
    vciPill.textContent = "VCI: 5.0";
  }

  // Render Interactive Q&A Layer & Serial Animations if applicable
  if (slide.isInteractive && slide.interactiveCells) {
    renderInteractiveGrid(slide);
  } else {
    interactiveOverlay.classList.add("hidden");
    qaControls.classList.add("hidden");
  }

  // Update component editor panel if active
  if (activeSidebarTab === "editor") {
    renderComponentEditorPanel();
  }
}

// Restore custom boundary overrides from localStorage
function restoreSavedBoundsForSlide(slide) {
  if (!currentDeck || !slide || !slide.interactiveCells) return;
  const storageKey = `deck_bounds_${currentDeck.id}_slide_${slide.number}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const savedBoundsMap = JSON.parse(raw);
      slide.interactiveCells.forEach((cell) => {
        if (savedBoundsMap[cell.id]) {
          cell.answerBounds = { ...savedBoundsMap[cell.id] };
          cell.bounds = { ...savedBoundsMap[cell.id] };
        }
      });
    }
  } catch (err) {
    console.warn("Could not load bounds from localStorage:", err);
  }
}

// Render click-to-reveal cards and serial build steps for Q&A grid slide
function renderInteractiveGrid(slide) {
  interactiveOverlay.innerHTML = "";
  interactiveOverlay.classList.remove("hidden");
  qaControls.classList.remove("hidden");

  const totalSteps = slide.serialAnimation ? slide.serialAnimation.totalBuildSteps : slide.interactiveCells.length;
  serialStepBadge.textContent = `Step ${currentBuildStep} / ${totalSteps}`;

  slide.interactiveCells.forEach((cell, index) => {
    // Serial step logic: component is revealed if step index <= currentBuildStep
    const stepNum = index + 1;
    const isBuildRevealed = stepNum <= currentBuildStep;
    const isActiveStep = stepNum === currentBuildStep;

    // Default or serial state
    const isRevealed = answerStates[cell.id] !== undefined ? answerStates[cell.id] : isBuildRevealed;
    answerStates[cell.id] = isRevealed;

    const card = document.createElement("div");
    card.id = `qa_card_${cell.id}`;
    card.className = `qa-card-overlay ${isRevealed ? "revealed" : "masked"} ${isActiveStep ? "serial-active" : ""}`;
    
    // Position using percentages from manifest
    const b = cell.answerBounds || cell.bounds;
    card.style.left = `${b.x}%`;
    card.style.top = `${b.y}%`;
    card.style.width = `${b.w}%`;
    card.style.height = `${b.h}%`;
    card.title = isRevealed ? "Answer Revealed (Click to Hide)" : "Click to reveal expected answer";

    card.innerHTML = `
      <div class="qa-card-content">
        <div class="qa-prompt-badge">
          <span>🔒</span>
          <span>Click to Reveal</span>
        </div>
        <div class="qa-prompt-subtext">${cell.question}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      answerStates[cell.id] = !answerStates[cell.id];
      renderInteractiveGrid(slide);
      if (activeSidebarTab === "editor") renderComponentEditorPanel();
    });

    interactiveOverlay.appendChild(card);
  });
}

// Global controls for Q&A interactivity
function setAllAnswersRevealed(revealed) {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  if (slide && slide.interactiveCells) {
    slide.interactiveCells.forEach((cell) => {
      answerStates[cell.id] = revealed;
    });
    renderInteractiveGrid(slide);
    if (activeSidebarTab === "editor") renderComponentEditorPanel();
  }
}

// Render Thumbnails in sidebar
function renderThumbnails() {
  thumbnailsGrid.innerHTML = "";
  currentDeck.slides.forEach((slide, i) => {
    const thumb = document.createElement("div");
    thumb.className = `thumb-item ${i === currentSlideIndex ? "active" : ""}`;
    thumb.innerHTML = `
      <img src="${slide.imageUrl}" alt="Slide ${i + 1}">
      <span class="thumb-num">${i + 1}</span>
    `;
    thumb.addEventListener("click", () => renderSlide(i));
    thumbnailsGrid.appendChild(thumb);
  });
}

function updateActiveThumbnail(index) {
  const items = thumbnailsGrid.querySelectorAll(".thumb-item");
  items.forEach((item, i) => {
    if (i === index) {
      item.classList.add("active");
      item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      item.classList.remove("active");
    }
  });
}

// Sidebar Tab Switcher
function switchSidebarTab(tabName) {
  activeSidebarTab = tabName;
  sidebar.classList.remove("collapsed");

  if (tabName === "overview") {
    tabOverviewBtn.classList.add("active");
    tabEditorBtn.classList.remove("active");
    thumbnailsGrid.classList.remove("hidden");
    componentEditorView.classList.add("hidden");
  } else {
    tabEditorBtn.classList.add("active");
    tabOverviewBtn.classList.remove("active");
    thumbnailsGrid.classList.add("hidden");
    componentEditorView.classList.remove("hidden");
    renderComponentEditorPanel();
  }
}

// Render Selective Component & Boundary Editor inside Sidebar
function renderComponentEditorPanel() {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];

  componentList.innerHTML = "";

  if (slide.interactiveCells && slide.interactiveCells.length > 0) {
    slide.interactiveCells.forEach((cell, idx) => {
      const isRev = answerStates[cell.id];
      const b = cell.answerBounds || cell.bounds || { x: 0, y: 0, w: 20, h: 20 };

      const card = document.createElement("div");
      card.className = "component-card-editor";
      card.innerHTML = `
        <div class="component-card-header">
          <div>
            <span class="component-title-text">Step ${idx + 1}: ${cell.id}</span>
            <div class="component-question-sub">${cell.question}</div>
          </div>
          <button class="btn btn-outline-small toggle-reveal-btn" style="font-size: 0.7rem;">
            ${isRev ? "👁️ Revealed" : "🔒 Masked"}
          </button>
        </div>

        <div class="boundary-grid">
          <div class="boundary-field">
            <label>X (%)</label>
            <input type="number" step="0.5" class="bounds-input input-x" value="${b.x.toFixed(1)}">
          </div>
          <div class="boundary-field">
            <label>Y (%)</label>
            <input type="number" step="0.5" class="bounds-input input-y" value="${b.y.toFixed(1)}">
          </div>
          <div class="boundary-field">
            <label>W (%)</label>
            <input type="number" step="0.5" class="bounds-input input-w" value="${b.w.toFixed(1)}">
          </div>
          <div class="boundary-field">
            <label>H (%)</label>
            <input type="number" step="0.5" class="bounds-input input-h" value="${b.h.toFixed(1)}">
          </div>
        </div>
      `;

      // Toggle mask/reveal state
      card.querySelector(".toggle-reveal-btn").addEventListener("click", () => {
        answerStates[cell.id] = !answerStates[cell.id];
        if (slide.isInteractive) renderInteractiveGrid(slide);
        renderComponentEditorPanel();
      });

      // Boundary inputs event listeners (X, Y, W, H)
      const inputX = card.querySelector(".input-x");
      const inputY = card.querySelector(".input-y");
      const inputW = card.querySelector(".input-w");
      const inputH = card.querySelector(".input-h");

      const updateBoundaryValues = () => {
        const x = parseFloat(inputX.value) || 0;
        const y = parseFloat(inputY.value) || 0;
        const w = Math.max(1, parseFloat(inputW.value) || 10);
        const h = Math.max(1, parseFloat(inputH.value) || 10);

        const newBounds = { x, y, w, h };
        cell.answerBounds = { ...newBounds };
        cell.bounds = { ...newBounds };

        // Live update card overlay position on canvas
        const overlayCard = document.getElementById(`qa_card_${cell.id}`);
        if (overlayCard) {
          overlayCard.style.left = `${x}%`;
          overlayCard.style.top = `${y}%`;
          overlayCard.style.width = `${w}%`;
          overlayCard.style.height = `${h}%`;
        }

        // Trigger autosave
        triggerAutosaveBounds(slide);
      };

      [inputX, inputY, inputW, inputH].forEach((input) => {
        input.addEventListener("input", updateBoundaryValues);
        input.addEventListener("focus", () => {
          card.classList.add("active-editing");
          const overlayCard = document.getElementById(`qa_card_${cell.id}`);
          if (overlayCard) overlayCard.classList.add("serial-active");
        });
        input.addEventListener("blur", () => {
          card.classList.remove("active-editing");
          const overlayCard = document.getElementById(`qa_card_${cell.id}`);
          if (overlayCard) overlayCard.classList.remove("serial-active");
        });
      });

      componentList.appendChild(card);
    });
  } else {
    componentList.innerHTML = `
      <div style="color: #94a3b8; padding: 1.5rem 1rem; text-align: center; font-size: 0.8rem;">
        No interactive sub-components available on slide ${slide.number}.
      </div>
    `;
  }
}

// Trigger debounced autosave of boundary changes to server & localStorage
function triggerAutosaveBounds(slide) {
  if (autosaveTimer) clearTimeout(autosaveTimer);

  // 1. Instant local storage persistence
  const storageKey = `deck_bounds_${currentDeck.id}_slide_${slide.number}`;
  const boundsMap = {};
  slide.interactiveCells.forEach((c) => {
    boundsMap[c.id] = c.answerBounds || c.bounds;
  });
  localStorage.setItem(storageKey, JSON.stringify(boundsMap));

  // 2. Debounced API autosave to backend manifest.json
  autosaveTimer = setTimeout(async () => {
    try {
      await fetch(`/api/decks/${currentDeck.id}/slides/${slide.number}/bounds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interactiveCells: slide.interactiveCells
        })
      });
      console.log(`[Autosave] Component boundaries saved for slide ${slide.number}`);
    } catch (err) {
      console.error("Autosave error:", err);
    }
  }, 400);
}

async function sendGeminiEditInstruction() {
  if (!currentDeck) return;
  const promptText = geminiEditInput.value.trim();
  if (!promptText) return;

  const slide = currentDeck.slides[currentSlideIndex];
  sendGeminiEditBtn.disabled = true;
  sendGeminiEditBtn.innerHTML = "<span>⏳</span> Dispatching to Gemini LM...";

  try {
    const res = await fetch(`/api/decks/${currentDeck.id}/slides/${slide.number}/edit-component`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        componentId: "active_slide",
        editPrompt: promptText
      })
    });
    const data = await res.json();
    alert(`Gemini LM Revision Dispatched:\n${data.geminiResult.message}`);
    geminiEditInput.value = "";
  } catch (err) {
    console.error("Error dispatching Gemini edit:", err);
  } finally {
    sendGeminiEditBtn.disabled = false;
    sendGeminiEditBtn.innerHTML = "<span>✨</span> Dispatch Gemini Edit Instruction";
  }
}

// Event Listeners
function setupEventListeners() {
  // Navigation buttons
  prevBtn.addEventListener("click", regressSerialBuildStep);
  nextBtn.addEventListener("click", advanceSerialBuildStep);

  prevBuildStepBtn.addEventListener("click", regressSerialBuildStep);
  nextBuildStepBtn.addEventListener("click", advanceSerialBuildStep);
  autoPlayBuildsBtn.addEventListener("click", toggleAutoPlay);

  // Edit components button in QA bar opens Component Editor sidebar tab
  editComponentBtn.addEventListener("click", () => switchSidebarTab("editor"));

  // Sidebar Tab Switcher Listeners
  if (tabOverviewBtn) tabOverviewBtn.addEventListener("click", () => switchSidebarTab("overview"));
  if (tabEditorBtn) tabEditorBtn.addEventListener("click", () => switchSidebarTab("editor"));

  sendGeminiEditBtn.addEventListener("click", sendGeminiEditInstruction);


  // Deck selection change
  deckSelect.addEventListener("change", (e) => {
    if (e.target.value) loadDeck(e.target.value);
  });

  // Sidebar toggle
  toggleSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // Fullscreen toggle
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  // Interactivity global buttons
  revealAllBtn.addEventListener("click", () => setAllAnswersRevealed(true));
  hideAllBtn.addEventListener("click", () => setAllAnswersRevealed(false));

  // Cognitive Processing Modal Event Listeners
  cognitiveBadge.addEventListener("click", openCognitiveModal);
  closeModalBtn.addEventListener("click", closeCognitiveModal);
  cognitiveModal.addEventListener("click", (e) => {
    if (e.target === cognitiveModal) closeCognitiveModal();
  });

  // Keyboard Navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCognitiveModal();
    } else if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {

      e.preventDefault();
      advanceSerialBuildStep();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      regressSerialBuildStep();
    } else if (e.key === "Home") {
      e.preventDefault();
      renderSlide(0, 1);
    } else if (e.key === "End" && currentDeck) {
      e.preventDefault();
      renderSlide(currentDeck.slides.length - 1, 1);
    } else if (e.key === "t" || e.key === "T") {
      sidebar.classList.toggle("collapsed");
    } else if (e.key === "f" || e.key === "F") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  });
}

function openCognitiveModal() {
  if (!currentDeck) return;
  const slide = currentDeck.slides[currentSlideIndex];
  const g = slide.cognitiveGuide;

  if (!g) return;

  cognitiveModalBody.innerHTML = `
    <div class="metric-grid">
      <div class="metric-box">
        <label>Recommended Processing Time</label>
        <div class="val">~${g.timeGuideDisplay} (${g.estimatedTimeSeconds} sec)</div>
      </div>
      <div class="metric-box">
        <label>Visual Complexity Index (VCI)</label>
        <div class="val">${g.vciScore} / 10.0 (${g.complexityCategory})</div>
      </div>
      <div class="metric-box">
        <label>Reading & Scan Burden</label>
        <div class="val" style="font-size: 1.05rem; color: #93c5fd;">
          ${g.breakdown.wordCount} words &bull; ${g.breakdown.visualElementsCount} visual zones
        </div>
      </div>
      <div class="metric-box">
        <label>Cognitive Load Distribution</label>
        <div class="val" style="font-size: 1.05rem; color: #fca5a5;">
          ${(g.breakdown.semanticProcessingMs / 1000).toFixed(1)}s Semantic Integration
        </div>
      </div>
    </div>

    <div class="academic-section">
      <h4>📚 Academic Research & Measurement Foundations</h4>
      <ul class="reference-list">
        ${g.academicReferences.map(ref => `
          <li class="reference-item">
            <strong>${ref.citation}</strong>
            <br><span style="color: #94a3b8;">${ref.relevance}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  `;

  cognitiveModal.classList.remove("hidden");
}

function closeCognitiveModal() {
  cognitiveModal.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", init);
