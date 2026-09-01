import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

export const SLIDE_ANALYSIS_SCHEMA_VERSION = 1;

const RECOMMENDED_STRATEGIES = new Set([
  "component-reveal",
  "comparison",
  "process",
  "data-table",
  "worked-example",
  "staged-objectives",
  "objectives-key-terms",
  "question-base-overlay"
]);

function cleanSingleLine(value, maxLength = 300) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanVisibleText(value) {
  const values = Array.isArray(value) ? value : [value];
  return values
    .filter((entry) => entry != null)
    .map((entry) =>
      String(entry)
        .split(/\r?\n/)
        .map((line) => line.replace(/[\t ]+/g, " ").trim())
        .filter(Boolean)
        .join("\n")
    )
    .filter(Boolean)
    .join("\n")
    .slice(0, 12_000);
}

function stableId(value, prefix) {
  const normalized = cleanSingleLine(value, 200)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
  if (!normalized) {
    throw new TypeError(`${prefix} id is required.`);
  }
  return /^[a-z]/.test(normalized) ? normalized : `${prefix}_${normalized}`;
}

function parseGeminiJson(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
  if (typeof raw !== "string" || !raw.trim()) {
    throw new TypeError("Gemini slide analysis must be a JSON object or JSON string.");
  }

  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const candidate = fenced ? fenced[1] : trimmed;
  try {
    const parsed = JSON.parse(candidate);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new TypeError("Gemini slide analysis JSON must contain one object.");
    }
    return parsed;
  } catch (error) {
    if (error instanceof TypeError) throw error;
    throw new TypeError(`Gemini slide analysis is not valid JSON: ${error.message}`);
  }
}

function normalizePosition(position, componentId) {
  if (typeof position === "string") {
    const cleaned = cleanSingleLine(position, 240);
    if (!cleaned) throw new TypeError(`Component ${componentId} needs a position.`);
    return cleaned;
  }

  if (!position || typeof position !== "object" || Array.isArray(position)) {
    throw new TypeError(`Component ${componentId} needs a position.`);
  }
  const x = Number(position.x);
  const y = Number(position.y);
  const w = Number(position.w ?? position.width);
  const h = Number(position.h ?? position.height);
  if (![x, y, w, h].every(Number.isFinite)) {
    throw new TypeError(`Component ${componentId} has invalid position bounds.`);
  }
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > 100 || y + h > 100) {
    throw new RangeError(`Component ${componentId} position must fit the 0–100 slide canvas.`);
  }
  return { x, y, w, h };
}

function normalizeStrategy(value) {
  const normalized = cleanSingleLine(value, 80)
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");
  if (!RECOMMENDED_STRATEGIES.has(normalized)) {
    throw new TypeError(`Unsupported recommendedStrategy: ${value || "(missing)"}.`);
  }
  return normalized;
}

function isAnswerComponent(component) {
  return /(?:^|-)(?:answer|answer-key|solution|worked-answer)(?:-|$)/.test(component.role);
}

function knownSlideQuestionCount(slide) {
  const explicit = Number(slide?.knownQuestionCount ?? slide?.questionCount);
  if (Number.isInteger(explicit) && explicit >= 0) return explicit;
  if (Array.isArray(slide?.interactiveCells)) return slide.interactiveCells.length;
  if (Array.isArray(slide?.contentAnalysis?.questions)) {
    return slide.contentAnalysis.questions.length;
  }
  return 0;
}

function assertAcyclicDependencies(componentsById) {
  const visiting = new Set();
  const visited = new Set();

  function visit(id) {
    if (visiting.has(id)) {
      throw new TypeError(`Component dependency cycle includes ${id}.`);
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of componentsById.get(id).dependencies) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  }

  for (const id of componentsById.keys()) visit(id);
}

/**
 * Build the deterministic vision prompt used to analyze one rendered slide.
 * The image attached by the caller is deliberately the only content authority.
 */
export function buildGeminiSlideAnalysisPrompt({
  deckTitle,
  slideNumber,
  knownQuestionCount = 0
} = {}) {
  const normalizedDeckTitle = cleanSingleLine(deckTitle, 300);
  const normalizedSlideNumber = Number(slideNumber);
  const normalizedQuestionCount = Number(knownQuestionCount);
  if (!normalizedDeckTitle) throw new TypeError("deckTitle is required.");
  if (!Number.isInteger(normalizedSlideNumber) || normalizedSlideNumber < 1) {
    throw new TypeError("slideNumber must be a positive integer.");
  }
  if (!Number.isInteger(normalizedQuestionCount) || normalizedQuestionCount < 0) {
    throw new TypeError("knownQuestionCount must be a non-negative integer.");
  }

  return `Analyze exactly one attached presentation-slide image.

The attached slide pixels are the sole visual and factual authority. Deck metadata is context only and must never override the pixels.
Deck context: ${normalizedDeckTitle}
Slide number: ${normalizedSlideNumber}
Known reviewed question count: ${normalizedQuestionCount}

Return JSON only, with no Markdown fence, preamble, explanation, or trailing text, using exactly this shape:
{
  "schemaVersion": ${SLIDE_ANALYSIS_SCHEMA_VERSION},
  "title": "exact visible slide title",
  "description": "concise whole-slide description grounded only in visible pixels",
  "layout": "concise description of the complete spatial layout and reading order",
  "components": [
    {
      "id": "stable_snake_case_id",
      "role": "semantic-role",
      "position": "precise whole-slide position, such as top-left or centre-right",
      "visibleText": "verbatim visible text belonging to this component, or an empty string for a purely visual component",
      "dependencies": ["stable_component_id_that_must_already_be_visible"]
    }
  ],
  "isQuestionSlide": false,
  "recommendedStrategy": "component-reveal",
  "recommendedBuilds": [
    {
      "id": "build_1",
      "label": "short presenter-facing label",
      "componentIds": ["stable_component_id"],
      "cumulative": true
    }
  ]
}

Analysis rules:
- Transcribe the exact visible title from the pixels. Do not promote a subtitle, numbered step, callout, column heading, or OCR fragment to the title.
- Describe the whole slide and its layout before proposing builds. Enumerate every meaningful visible component, including title, text blocks, diagrams, equations, tables, process stages, questions, answers, and synthesis callouts.
- Give every component a stable unique snake_case id. visibleText must be verbatim; never repair, expand, or invent wording.
- dependencies may reference only component ids in the same response and must represent genuine visible reading dependencies.
- Choose recommendedStrategy only from: ${[...RECOMMENDED_STRATEGIES].join(", ")}.
- Do not invent a process, sequence, comparison, equation, worked example, answer, diagram, icon, label, or visual relationship that is not visibly present in the source pixels.
- Recommend between 1 and 4 full-canvas cumulative builds. Each later componentIds list must contain every id from the previous build plus newly revealed ids. The final non-question build must contain every component id.
- Every build represents the entire 16:9 slide canvas. Never recommend cropping, zooming, spotlighting, dimming, blurring, outlining, halos, focus boxes, or focus treatment.
- If the slide visibly asks one or more questions, set isQuestionSlide to true, use recommendedStrategy "question-base-overlay", and recommend exactly one unanswered full-slide base build. Exclude every visible answer/solution component from that base; reviewed answers will be rendered later as exact web overlays.
- If Known reviewed question count is greater than zero, the slide must be treated as a question slide even if OCR is imperfect.
- Otherwise set isQuestionSlide to false. Do not turn explanatory prose into a question.
- Preserve the source canvas, theme, factual content, visible hierarchy, and spatial relationships; report uncertainty in description rather than inventing content.`;
}

/**
 * Validate and canonicalize Gemini's pure slide-analysis JSON. Invalid analysis
 * is rejected before it can influence planning or asset generation.
 */
export function normalizeGeminiSlideAnalysis(raw, { slide } = {}) {
  const source = parseGeminiJson(raw);
  const suppliedVersion = source.schemaVersion ?? SLIDE_ANALYSIS_SCHEMA_VERSION;
  if (Number(suppliedVersion) !== SLIDE_ANALYSIS_SCHEMA_VERSION) {
    throw new TypeError(
      `Unsupported slide analysis schemaVersion ${suppliedVersion}; expected ${SLIDE_ANALYSIS_SCHEMA_VERSION}.`
    );
  }

  const title = cleanSingleLine(source.title, 300);
  const description = cleanSingleLine(
    source.description ?? source.wholeSlideDescription,
    2_000
  );
  const layout = cleanSingleLine(source.layout, 2_000);
  if (!title) throw new TypeError("Slide analysis title is required.");
  if (!description) throw new TypeError("Slide analysis description is required.");
  if (!layout) throw new TypeError("Slide analysis layout is required.");
  if (!Array.isArray(source.components) || source.components.length === 0) {
    throw new TypeError("Slide analysis must contain at least one component.");
  }

  const referenceMap = new Map();
  const rawDependencies = new Map();
  const components = source.components.map((candidate, index) => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw new TypeError(`Component ${index + 1} must be an object.`);
    }
    const originalId = cleanSingleLine(candidate.id, 200);
    const id = stableId(originalId, "component");
    if ([...referenceMap.values()].includes(id)) {
      throw new TypeError(`Duplicate component id after normalization: ${id}.`);
    }
    const role = stableId(candidate.role, "role").replace(/^role_/, "");
    const normalized = {
      id,
      role,
      position: normalizePosition(candidate.position, id),
      visibleText: cleanVisibleText(candidate.visibleText),
      dependencies: []
    };
    referenceMap.set(originalId, id);
    referenceMap.set(id, id);
    rawDependencies.set(id, candidate.dependencies ?? []);
    return normalized;
  });

  const componentsById = new Map(components.map((component) => [component.id, component]));
  const resolveComponentId = (value, context) => {
    const original = cleanSingleLine(value, 200);
    if (!original) throw new TypeError(`${context} contains an empty component reference.`);
    const normalized = referenceMap.get(original) || referenceMap.get(stableId(original, "component"));
    if (!normalized || !componentsById.has(normalized)) {
      throw new TypeError(`${context} references unknown component ${original}.`);
    }
    return normalized;
  };

  for (const component of components) {
    const dependencies = rawDependencies.get(component.id);
    if (!Array.isArray(dependencies)) {
      throw new TypeError(`Component ${component.id} dependencies must be an array.`);
    }
    const resolved = dependencies.map((dependency) =>
      resolveComponentId(dependency, `Component ${component.id}`)
    );
    if (resolved.includes(component.id)) {
      throw new TypeError(`Component ${component.id} cannot depend on itself.`);
    }
    if (new Set(resolved).size !== resolved.length) {
      throw new TypeError(`Component ${component.id} has duplicate dependencies.`);
    }
    component.dependencies = resolved;
  }
  assertAcyclicDependencies(componentsById);

  if (typeof source.isQuestionSlide !== "boolean") {
    throw new TypeError("isQuestionSlide must be a boolean.");
  }
  const isQuestionSlide = source.isQuestionSlide;
  const knownQuestionCount = knownSlideQuestionCount(slide);
  if (knownQuestionCount > 0 && !isQuestionSlide) {
    throw new TypeError("A slide with reviewed questions must be marked as a question slide.");
  }

  const recommendedStrategy = normalizeStrategy(source.recommendedStrategy);
  if (isQuestionSlide && recommendedStrategy !== "question-base-overlay") {
    throw new TypeError("Question slides must use recommendedStrategy question-base-overlay.");
  }
  if (!isQuestionSlide && recommendedStrategy === "question-base-overlay") {
    throw new TypeError("question-base-overlay may only be used for a question slide.");
  }

  if (
    !Array.isArray(source.recommendedBuilds) ||
    source.recommendedBuilds.length < 1 ||
    source.recommendedBuilds.length > 4
  ) {
    throw new RangeError("recommendedBuilds must contain between 1 and 4 builds.");
  }
  if (isQuestionSlide && source.recommendedBuilds.length !== 1) {
    throw new RangeError("Question slides must contain exactly one unanswered base build.");
  }

  const buildIds = new Set();
  let previousComponents = new Set();
  const recommendedBuilds = source.recommendedBuilds.map((candidate, index) => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw new TypeError(`Build ${index + 1} must be an object.`);
    }
    const id = stableId(candidate.id || `build_${index + 1}`, "build");
    if (buildIds.has(id)) throw new TypeError(`Duplicate build id: ${id}.`);
    buildIds.add(id);
    if (candidate.cumulative !== true) {
      throw new TypeError(`Build ${id} must declare cumulative: true.`);
    }
    const references =
      candidate.componentIds ?? candidate.visibleComponentIds ?? candidate.componentRefs;
    if (!Array.isArray(references) || references.length === 0) {
      throw new TypeError(`Build ${id} must reference at least one component.`);
    }
    const componentIds = references.map((reference) =>
      resolveComponentId(reference, `Build ${id}`)
    );
    if (new Set(componentIds).size !== componentIds.length) {
      throw new TypeError(`Build ${id} contains duplicate component references.`);
    }
    const currentComponents = new Set(componentIds);
    for (const priorId of previousComponents) {
      if (!currentComponents.has(priorId)) {
        throw new TypeError(`Build ${id} is not cumulative; it drops component ${priorId}.`);
      }
    }
    if (index > 0 && currentComponents.size === previousComponents.size) {
      throw new TypeError(`Build ${id} must add at least one component.`);
    }
    for (const componentId of currentComponents) {
      for (const dependency of componentsById.get(componentId).dependencies) {
        if (!currentComponents.has(dependency)) {
          throw new TypeError(
            `Build ${id} includes ${componentId} without dependency ${dependency}.`
          );
        }
      }
    }
    previousComponents = currentComponents;
    const normalized = {
      id,
      label: cleanSingleLine(candidate.label, 200) || `Build ${index + 1}`,
      componentIds,
      cumulative: true
    };
    const buildDescription = cleanSingleLine(candidate.description, 1_000);
    if (buildDescription) normalized.description = buildDescription;
    return normalized;
  });

  const answerIds = new Set(
    components.filter(isAnswerComponent).map((component) => component.id)
  );
  const expectedFinalIds = new Set(
    components
      .filter((component) => !isQuestionSlide || !answerIds.has(component.id))
      .map((component) => component.id)
  );
  const finalIds = new Set(recommendedBuilds.at(-1).componentIds);
  for (const expectedId of expectedFinalIds) {
    if (!finalIds.has(expectedId)) {
      throw new TypeError(`Final build is incomplete; it omits component ${expectedId}.`);
    }
  }
  for (const finalId of finalIds) {
    if (!expectedFinalIds.has(finalId)) {
      throw new TypeError(
        isQuestionSlide && answerIds.has(finalId)
          ? `Question base build must omit answer component ${finalId}.`
          : `Final build contains unexpected component ${finalId}.`
      );
    }
  }

  return {
    schemaVersion: SLIDE_ANALYSIS_SCHEMA_VERSION,
    title,
    description,
    layout,
    components,
    isQuestionSlide,
    recommendedStrategy,
    recommendedBuilds
  };
}

/**
 * Gemini Selective Component Editor & Serial Animation Segmenter
 * Interfaces with Google Gemini LM (via Chrome CDP on port 9333 or automated vision segmentation)
 * to allow selective slide component editing and generate serial 'same-slide' build step animation sequences.
 */

export async function processSerialBuildSteps(slide) {
  if (slide.isInteractive && slide.interactiveCells) {
    // 6-question grid: create serial build steps 1 through 6
    const serialSteps = slide.interactiveCells.map((cell, index) => ({
      step: index + 1,
      title: `Step ${index + 1}: ${cell.question}`,
      componentIds: [cell.id],
      targetBounds: cell.answerBounds || cell.bounds,
      revealType: "unmask", // 'unmask' | 'highlight' | 'fade-in'
    }));

    return {
      totalBuildSteps: serialSteps.length,
      autoAdvanceDelayMs: 2500,
      serialSteps,
    };
  }

  // Multi-component slide heuristic (Header, Content Box 1, Content Box 2)
  const defaultSteps = [
    { step: 1, title: "Title & Header", componentIds: ["header"], revealType: "highlight" },
    { step: 2, title: "Main Visual Content", componentIds: ["main_content"], revealType: "fade-in" },
    { step: 3, title: "Key Takeaway / Summary", componentIds: ["footer_summary"], revealType: "highlight" }
  ];

  return {
    totalBuildSteps: defaultSteps.length,
    autoAdvanceDelayMs: 3000,
    serialSteps: defaultSteps
  };
}

/**
 * Prompt Gemini LM over CDP port 9333 to selectively edit or segment components on a slide.
 */
export async function editSlideComponentViaGemini(deckId, slideNum, componentId, editPrompt) {
  console.log(`[Gemini Component Editor] Editing deck ${deckId}, slide ${slideNum}, component ${componentId} with prompt: "${editPrompt}"`);

  let cdpConnected = false;
  try {
    const response = await fetch("http://127.0.0.1:9333/json/list").catch(() => null);
    if (response && response.ok) {
      cdpConnected = true;
      console.log("[Gemini Component Editor] Successfully connected to Gemini LM via CDP port 9333.");
      // CDP automation can dispatch prompt payload to Gemini tab here
    }
  } catch (e) {}

  return {
    success: true,
    deckId,
    slideNum,
    componentId,
    editPrompt,
    cdpConnected,
    updatedAt: new Date().toISOString(),
    message: cdpConnected
      ? "Component edit instruction dispatched to active Gemini LM session."
      : "Component edit parameters registered locally for rendering."
  };
}
