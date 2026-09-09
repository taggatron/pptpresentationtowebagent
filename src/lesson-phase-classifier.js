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
    color: "#fb923c", // Warm amber/orange
    bgLight: "#fffbeb",
    borderColor: "#fde68a",
    textColor: "#b45309",
    description: "Teacher demonstration, worked examples, thinking aloud, and diagrams."
  },
  guided_practice: {
    key: "guided_practice",
    label: "Guided Practice ('We Do')",
    shortLabel: "Guided Practice (We Do)",
    pedagogicalTag: "We Do",
    targetPercent: 25,
    color: "#e05353", // Reference coral/red
    bgLight: "#fef2f2",
    borderColor: "#fca5a5",
    textColor: "#991b1b",
    description: "Scaffolded tasks, pair-and-share, quick-fire checks, collaborative practice."
  },
  independent_practice: {
    key: "independent_practice",
    label: "Independent Practice ('You Do')",
    shortLabel: "Independent Practice (You Do)",
    pedagogicalTag: "You Do",
    targetPercent: 35,
    color: "#65aba0", // Reference teal
    bgLight: "#f0fdfa",
    borderColor: "#99f6e4",
    textColor: "#115e59",
    description: "Individual fluency, application of concepts, exam questions, exam builder papers."
  },
  plenary: {
    key: "plenary",
    label: "Review & Plenary / Exit Ticket",
    shortLabel: "Review & Plenary",
    pedagogicalTag: "Consolidation",
    targetPercent: 10,
    color: "#529c42", // Reference green
    bgLight: "#f0fdf4",
    borderColor: "#86efac",
    textColor: "#166534",
    description: "Lesson summary, self-assessment, misconceptions check, and exit tickets."
  }
});

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
export function classifySlideLessonPhase(slide, { deckId = null, totalSlides = null } = {}) {
  if (!slide) return "direct_instruction";

  // 1. Explicit override on slide
  if (slide.lessonPhase && LESSON_PHASE_BENCHMARKS[slide.lessonPhase]) {
    return slide.lessonPhase;
  }

  const slideNum = Number(slide.number) || 1;

  // 2. Curated deck lookup
  if (deckId && CURATED_DECK_PHASES[deckId]?.[slideNum]) {
    return CURATED_DECK_PHASES[deckId][slideNum];
  }

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
    return "starter";
  }

  // Review / Plenary / Exit Ticket signals
  const isNearEnd = totalSlides && slideNum >= totalSlides - 1;
  if (
    text.includes("plenary") ||
    text.includes("exit ticket") ||
    text.includes("summary") ||
    text.includes("big picture") ||
    text.includes("consolidation") ||
    text.includes("recap") ||
    (isNearEnd && (text.includes("check") || text.includes("review")))
  ) {
    return "plenary";
  }

  // Independent Practice signals ("You Do" / Exam / Assessment)
  if (
    text.includes("exam") ||
    text.includes("assessment") ||
    text.includes("worksheet") ||
    text.includes("you do") ||
    text.includes("independent") ||
    text.includes("past paper") ||
    text.includes("mark scheme") ||
    text.includes("question paper") ||
    slide.questionAnalysis?.detected === true && slide.questionAnalysis?.questionCount > 1
  ) {
    return "independent_practice";
  }

  // Guided Practice signals ("We Do" / Active interaction / Collaborative)
  if (
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
    return "guided_practice";
  }

  // Modelling signals ("I Do" / Diagrams / Worked examples)
  if (
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
    return "modelling";
  }

  // Objectives & First Slide Intro -> Direct Instruction
  if (
    slideNum === 1 ||
    text.includes("objective") ||
    text.includes("introduction") ||
    text.includes("overview") ||
    text.includes("definition") ||
    text.includes("concept")
  ) {
    return "direct_instruction";
  }

  // Position-based heuristic fallback
  if (totalSlides) {
    const ratio = slideNum / totalSlides;
    if (ratio <= 0.25) return "direct_instruction";
    if (ratio <= 0.50) return "modelling";
    if (ratio <= 0.75) return "guided_practice";
    if (ratio <= 0.90) return "independent_practice";
    return "plenary";
  }

  return "direct_instruction";
}

/**
 * Returns complete phase breakdown with pedagogical metadata for a given deck.
 * 
 * @param {Object} manifest - Manifest object
 * @returns {Array<{ slideNumber: number, title: string, phase: Object }>}
 */
export function analyzeDeckLessonPhases(manifest) {
  if (!manifest?.slides) return [];
  const totalSlides = manifest.totalSlides || manifest.slides.length;
  const deckId = manifest.id;

  return manifest.slides.map((slide) => {
    const phaseKey = classifySlideLessonPhase(slide, { deckId, totalSlides });
    const phaseMeta = LESSON_PHASE_BENCHMARKS[phaseKey] || LESSON_PHASE_BENCHMARKS.direct_instruction;
    return {
      slideNumber: slide.number,
      title: slide.title || `Slide ${slide.number}`,
      phaseKey,
      phaseMeta
    };
  });
}
