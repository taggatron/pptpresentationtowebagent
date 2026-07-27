// Interactive Presentation Web Application

let currentDeck = null;
let currentSlideIndex = 0;
let answerStates = {}; // cellId -> boolean (true = revealed, false = masked)

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
function renderSlide(index) {
  if (!currentDeck || index < 0 || index >= currentDeck.slides.length) return;
  
  currentSlideIndex = index;
  const slide = currentDeck.slides[index];
  
  slideImage.src = slide.imageUrl;
  currentSlideNum.textContent = index + 1;
  
  // Progress bar percentage
  const pct = ((index + 1) / currentDeck.slides.length) * 100;
  progressBar.style.width = `${pct}%`;
  
  // Update prev / next button states
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === currentDeck.slides.length - 1;

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

  // Render Interactive Q&A Layer if applicable
  if (slide.isInteractive && slide.interactiveCells) {
    renderInteractiveGrid(slide);
  } else {
    interactiveOverlay.classList.add("hidden");
    qaControls.classList.add("hidden");
  }
}

// Render click-to-reveal cards for Q&A grid slide
function renderInteractiveGrid(slide) {
  interactiveOverlay.innerHTML = "";
  interactiveOverlay.classList.remove("hidden");
  qaControls.classList.remove("hidden");

  slide.interactiveCells.forEach((cell) => {
    // Default to masked if not previously toggled
    if (answerStates[cell.id] === undefined) {
      answerStates[cell.id] = false; // false = masked/hidden
    }

    const card = document.createElement("div");
    const isRevealed = answerStates[cell.id];
    card.className = `qa-card-overlay ${isRevealed ? "revealed" : "masked"}`;
    
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
          <span>Click to Reveal Answer</span>
        </div>
        <div class="qa-prompt-subtext">${cell.question}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      answerStates[cell.id] = !answerStates[cell.id];
      renderInteractiveGrid(slide);
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

// Event Listeners
function setupEventListeners() {
  // Navigation buttons
  prevBtn.addEventListener("click", () => renderSlide(currentSlideIndex - 1));
  nextBtn.addEventListener("click", () => renderSlide(currentSlideIndex + 1));
  
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
      renderSlide(currentSlideIndex + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      renderSlide(currentSlideIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      renderSlide(0);
    } else if (e.key === "End" && currentDeck) {
      e.preventDefault();
      renderSlide(currentDeck.slides.length - 1);
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
