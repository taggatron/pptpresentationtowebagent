/**
 * Lesson Phase Classifier & Pedagogical Time Allocation Benchmarks
 * 
 * Defines standard lesson phases, color palettes, recommended distribution targets
 * (based on OCR / EEF / Rosenshine's Principles of Instruction), and rules to
 * classify slides across all decks.
 */

export const LESSON_PHASE_BENCHMARKS = Object.freeze({
  starter: {
    key: "starter",
    label: "Warm-Up / Retrieval Practice (Starter)",
    shortLabel: "Starter / Warm-Up",
    pedagogicalTag: "Retrieval",
    targetPercent: 10,
    targetPercentage: 10,
    color: "#3c73a8", // Reference blue
    bgLight: "#eff6ff",
    borderColor: "#93c5fd",
    textColor: "#1e3a8a",
    description: "Low-stakes retrieval practice, bell-work, prior knowledge activation."
  },
  direct_instruction: {
    key: "direct_instruction",
    label: "Teacher Direct Instruction",
    shortLabel: "Direct Instruction",
    pedagogicalTag: "Instruction",
    targetPercent: 10,
    targetPercentage: 10,
    color: "#f28522", // Reference orange
    bgLight: "#fff7ed",
    borderColor: "#fed7aa",
    textColor: "#9a3412",
    description: "Explicit teaching of new core concepts, vocabulary, and principles."
  },
  modelling: {
    key: "modelling",
    label: "Modelling ('I Do')",
    shortLabel: "Modelling (I Do)",
    pedagogicalTag: "I Do",
    targetPercent: 10,
    targetPercentage: 10,
    color: "#fb923c", // Warm amber/orange
    bgLight: "#fffbeb",
    borderColor: "#fde68a",
    textColor: "#b45309",
    description: "Teacher demonstration, worked examples, diagram deconstruction."
  },
  guided_practice: {
    key: "guided_practice",
    label: "Guided Practice ('We Do')",
    shortLabel: "Guided Practice (We Do)",
    pedagogicalTag: "We Do",
    targetPercent: 25,
    targetPercentage: 25,
    color: "#e05353", // Reference coral/red
    bgLight: "#fef2f2",
    borderColor: "#fca5a5",
    textColor: "#b91c1c",
    description: "Collaborative checks, pair tasks, interactive sorting, scaffolded practice."
  },
  independent_practice: {
    key: "independent_practice",
    label: "Independent Practice ('You Do')",
    shortLabel: "Independent Practice (You Do)",
    pedagogicalTag: "You Do",
    targetPercent: 35,
    targetPercentage: 35,
    color: "#65aba0", // Reference teal/mint
    bgLight: "#f0fdfa",
    borderColor: "#99f6e4",
    textColor: "#0f766e",
    description: "Exam-style application, extended response, fluency drills without scaffolding."
  },
  plenary: {
    key: "plenary",
    label: "Review & Plenary / Exit Ticket",
    shortLabel: "Plenary / Review",
    pedagogicalTag: "Exit Ticket",
    targetPercent: 10,
    targetPercentage: 10,
    color: "#529c42", // Reference green
    bgLight: "#f0fdf4",
    borderColor: "#86efac",
    textColor: "#15803d",
    description: "Consolidation, exit tickets, big picture synthesis, self-reflection."
  }
});

export const LESSON_PHASES = Object.values(LESSON_PHASE_BENCHMARKS);

export const PHASE_ORDER = [
  "starter",
  "direct_instruction",
  "modelling",
  "guided_practice",
  "independent_practice",
  "plenary"
];

// Grouped 5-stage benchmark (merging Direct Instruction & Modelling to match 20% in diagram)
export const GROUPED_5STAGE_BENCHMARKS = Object.freeze({
  starter: { key: "starter", label: "Warm-Up / Retrieval Practice", targetPercent: 10, color: "#3c73a8" },
  direct_and_modelling: { key: "direct_and_modelling", label: "Direct Instruction / Modeling", targetPercent: 20, color: "#f28522" },
  guided_practice: { key: "guided_practice", label: "Guided Practice (\"We Do\")", targetPercent: 25, color: "#e05353" },
  independent_practice: { key: "independent_practice", label: "Independent Practice (\"You Do\")", targetPercent: 35, color: "#65aba0" },
  plenary: { key: "plenary", label: "Review & Plenary / Exit Ticket", targetPercent: 10, color: "#529c42" }
});

/**
 * Curated phase mappings for specific decks
 */
const CURATED_DECK_PHASES = {
  Classic_Lesson_01_Ecosystems: {
    1: "direct_instruction",    // Slide 1: Video Hook / Context
    2: "starter",               // Slide 2: Starter: Dead or Alive
    3: "direct_instruction",    // Slide 3: Lesson Objectives: Ecosystems
    4: "modelling",             // Slide 4: Two Sets of Factors (Comparison)
    5: "guided_practice",       // Slide 5: Quick-Fire Challenge (Interactive)
    6: "modelling",             // Slide 6: Levels of Organisation
    7: "guided_practice",       // Slide 7: Knowledge Checkpoint: Match the Level
    8: "independent_practice",  // Slide 8: OCR Exam Checkpoint & Mark Scheme (PDF viewer)
    9: "direct_instruction",    // Slide 9: Ecological Interactions
    10: "modelling",            // Slide 10: Food Chains (Primary Consumers)
    11: "modelling",            // Slide 11: Food Webs & Energy Flows
    12: "guided_practice",      // Slide 12: Pair-and-Share: The Knock-on Effect
    13: "guided_practice",      // Slide 13: Invasive Species Scenarios
    14: "independent_practice", // Slide 14: Dynamic Equilibrium Graph
    15: "independent_practice", // Slide 15: Predator-Prey Exam Question
    16: "plenary",              // Slide 16: Summary Plenary
    17: "plenary"               // Slide 17: The Big Picture: The Ecosystem Engine
  }
};

/**
 * Classify a slide into its pedagogical lesson phase.
 * 
 * Prioritizes:
 * 1. Explicit `slide.lessonPhase` property if already declared on the slide.
 * 2. Curated mapping table for known decks.
 * 3. Heuristic analysis based on title, questions, interactives, and position.
 * 
 * @param {Object} slide - The slide object from manifest.slides
 * @param {Object} [options]
 * @param {string} [options.deckId] - Deck ID
 * @param {number} [options.totalSlides] - Total slides in deck
 * @returns {string} One of the LESSON_PHASE_BENCHMARKS keys
 */
export function classifySlideLessonPhase(slide, context = {}) {
  let deckId = null;
  let totalSlides = null;
  if (typeof context === "string") {
    deckId = context;
  } else if (context && typeof context === "object") {
    deckId = context.deckId || null;
    totalSlides = context.totalSlides || null;
  }

  let phaseKey = null;

  // 1. Explicit override on slide
  if (slide?.lessonPhase && LESSON_PHASE_BENCHMARKS[slide.lessonPhase]) {
    phaseKey = slide.lessonPhase;
  }

  const slideNum = Number(slide?.number) || 1;

  // 2. Curated deck lookup
  if (!phaseKey && deckId && CURATED_DECK_PHASES[deckId]?.[slideNum]) {
    phaseKey = CURATED_DECK_PHASES[deckId][slideNum];
  }

  if (!phaseKey && slide) {
    // 3. Heuristic classification based on content signals
    const title = String(slide.title || "").toLowerCase();
    const notes = String(slide.notes || "").toLowerCase();
    const text = `${title} ${notes}`;

    // Starter / Retrieval signals
    if (
      slideNum === 2 ||
      text.includes("starter") ||
      text.includes("warm-up") ||
      text.includes("retrieval") ||
      text.includes("dead or alive") ||
      text.includes("bell-work") ||
      text.includes("do now") ||
      slide.isStarterGrid === true
    ) {
      phaseKey = "starter";
    }
    // Review / Plenary / Exit Ticket signals
    else if (
      text.includes("plenary") ||
      text.includes("exit ticket") ||
      text.includes("summary") ||
      text.includes("big picture") ||
      text.includes("consolidation") ||
      text.includes("recap") ||
      (totalSlides && slideNum >= totalSlides - 1 && (text.includes("check") || text.includes("review")))
    ) {
      phaseKey = "plenary";
    }
    // Independent Practice signals ("You Do" / Exam / Assessment)
    else if (
      text.includes("independent") ||
      text.includes("you do") ||
      text.includes("exam question") ||
      text.includes("exam-style") ||
      text.includes("past paper") ||
      text.includes("ocr") ||
      text.includes("aqa") ||
      text.includes("edexcel") ||
      text.includes("mark scheme") ||
      text.includes("pdf question") ||
      slide.customComponent === "ocr_exam_viewer" ||
      (slide.questionAnalysis?.detected === true && slide.questionAnalysis?.questionCount > 1)
    ) {
      phaseKey = "independent_practice";
    }
    // Guided Practice signals ("We Do" / Active interaction / Collaborative)
    else if (
      text.includes("guided") ||
      text.includes("we do") ||
      text.includes("challenge") ||
      text.includes("pair-and-share") ||
      text.includes("checkpoint") ||
      text.includes("drag") ||
      text.includes("match the") ||
      text.includes("activity") ||
      text.includes("quick-fire") ||
      slide.isInteractive === true ||
      slide.interactiveType === "web_embed"
    ) {
      phaseKey = "guided_practice";
    }
    // Modelling signals ("I Do" / Diagrams / Worked examples)
    else if (
      text.includes("model") ||
      text.includes("i do") ||
      text.includes("worked example") ||
      text.includes("diagram") ||
      text.includes("comparison") ||
      text.includes("hierarchy") ||
      text.includes("food chain") ||
      text.includes("food web") ||
      text.includes("cycle") ||
      text.includes("step-by-step")
    ) {
      phaseKey = "modelling";
    }
    // Objectives & First Slide Intro -> Direct Instruction
    else if (
      slideNum === 1 ||
      text.includes("objective") ||
      text.includes("introduction") ||
      text.includes("overview") ||
      text.includes("definition") ||
      text.includes("concept")
    ) {
      phaseKey = "direct_instruction";
    }
    // Position-based heuristic fallback
    else if (totalSlides) {
      const ratio = slideNum / totalSlides;
      if (ratio <= 0.25) phaseKey = "direct_instruction";
      else if (ratio <= 0.50) phaseKey = "modelling";
      else if (ratio <= 0.75) phaseKey = "guided_practice";
      else if (ratio <= 0.90) phaseKey = "independent_practice";
      else phaseKey = "plenary";
    }
  }

  if (!phaseKey) phaseKey = "direct_instruction";

  const meta = LESSON_PHASE_BENCHMARKS[phaseKey] || LESSON_PHASE_BENCHMARKS.direct_instruction;
  return {
    phaseKey,
    key: phaseKey,
    toString() {
      return phaseKey;
    },
    ...meta
  };
}

/**
 * Returns complete phase breakdown with pedagogical metadata for a given deck.
 * 
 * @param {Object} manifest - Manifest object
 * @returns {{ slides: Array, phaseSummary: Array }}
 */
export function analyzeDeckLessonPhases(manifest) {
  if (!manifest?.slides) return { slides: [], phaseSummary: [] };
  const totalSlides = manifest.totalSlides || manifest.slides.length;
  const deckId = manifest.id;

  const slides = manifest.slides.map((slide) => {
    const classified = classifySlideLessonPhase(slide, { deckId, totalSlides });
    const phaseKey = classified.phaseKey;
    const phaseMeta = LESSON_PHASE_BENCHMARKS[phaseKey] || LESSON_PHASE_BENCHMARKS.direct_instruction;
    return {
      slideNumber: slide.number,
      title: slide.title || `Slide ${slide.number}`,
      phaseKey,
      phaseName: phaseMeta.label,
      shortLabel: phaseMeta.shortLabel,
      phaseColor: phaseMeta.color,
      phaseGuidance: phaseMeta.description,
      phaseMeta
    };
  });

  const phaseSummary = PHASE_ORDER.map((phaseKey) => {
    const meta = LESSON_PHASE_BENCHMARKS[phaseKey];
    const matchingSlides = slides.filter((s) => s.phaseKey === phaseKey);
    const slideNumbers = matchingSlides.map((s) => s.slideNumber);
    return {
      phaseKey,
      name: meta.label,
      shortLabel: meta.shortLabel,
      color: meta.color,
      description: meta.description,
      targetPercentage: meta.targetPercentage,
      targetPercent: meta.targetPercent,
      slideCount: matchingSlides.length,
      slideNumbers
    };
  });

  return {
    slides,
    phaseSummary
  };
}
