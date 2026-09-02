import { getCurrentAnimationPlan } from "./current-animation-plan-catalog.js";

const DEFAULT_BUILD_DELAY_MS = 3200;
const DEFAULT_COMPLEXITY_THRESHOLDS = Object.freeze({
  estimatedTimeSeconds: 36,
  vciScore: 7,
  wordCount: 72,
  visualElementsCount: 8
});

const QUESTION_LEADERS = [
  "what",
  "why",
  "how",
  "which",
  "where",
  "when",
  "who",
  "name",
  "state",
  "identify",
  "explain",
  "describe",
  "calculate",
  "predict",
  "suggest",
  "write",
  "complete",
  "compare",
  "evaluate"
];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function stableIdPart(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
}

function currentPlanningOverride(slide) {
  const analysis = slide?.agentAnalysis?.slideDecomposition?.analysis;
  if (
    analysis &&
    typeof analysis === "object" &&
    Array.isArray(analysis.components) &&
    Array.isArray(analysis.recommendedBuilds)
  ) {
    return {
      source: "gemini-multimodal-slide-analysis",
      title: cleanText(analysis.title),
      description: cleanText(analysis.description),
      layout: cleanText(analysis.layout),
      strategy: cleanText(analysis.recommendedStrategy),
      isQuestionSlide: analysis.isQuestionSlide === true,
      components: analysis.components,
      builds: analysis.recommendedBuilds
    };
  }

  const catalogPlan = getCurrentAnimationPlan(slide?.deckId, slide?.imageFileName);
  if (!catalogPlan) return null;
  return {
    source: "reviewed-current-animation-plan-catalog",
    title: cleanText(catalogPlan.title),
    strategy: cleanText(catalogPlan.strategy),
    cellCount: Number(catalogPlan.cellCount) || null,
    answerLocationCount: Number(catalogPlan.answerLocationCount) || null,
    builds: Array.isArray(catalogPlan.steps) ? catalogPlan.steps : null
  };
}

function describeAnalysisComponent(component) {
  const label = cleanText(component?.label || component?.id || "component");
  const position = cleanText(component?.position);
  const visibleText = cleanText(component?.visibleText);
  return [
    label,
    position ? `at ${position}` : null,
    visibleText ? `with exact source wording: “${visibleText}”` : null
  ]
    .filter(Boolean)
    .join(" ");
}

function structuredPlanningSteps(slide) {
  const plan = currentPlanningOverride(slide);
  if (!Array.isArray(plan?.builds) || plan.builds.length === 0) return null;
  if (plan.source !== "gemini-multimodal-slide-analysis") {
    return plan.builds.map((step) => ({ ...step }));
  }

  const componentsById = new Map(
    plan.components.map((component) => [cleanText(component?.id), component])
  );
  return plan.builds.map((build, index) => {
    const showComponents = asArray(build?.showComponentIds)
      .map((id) => componentsById.get(cleanText(id)))
      .filter(Boolean);
    const omittedComponents = asArray(build?.temporarilyOmitComponentIds)
      .map((id) => componentsById.get(cleanText(id)))
      .filter(Boolean);
    return {
      label: cleanText(build?.label) || `Reveal component ${index + 1}`,
      show:
        showComponents.map(describeAnalysisComponent).join("; ") ||
        "Only the components explicitly identified by the Gemini slide analysis for this build.",
      suppress:
        omittedComponents.map(describeAnalysisComponent).join("; ") ||
        "Nothing instructional; this is the complete cumulative source-slide state.",
      rationale: cleanText(build?.rationale)
    };
  });
}

export function isVideoMedia(entry) {
  if (!entry || typeof entry !== "object") return false;
  const mediaType = cleanText(entry.mediaType || entry.kind || entry.type).toLowerCase();
  const mimeType = cleanText(entry.mimeType).toLowerCase();
  return Boolean(
    entry.videoUrl ||
      entry.videoFileName ||
      entry.video?.url ||
      mediaType === "video" ||
      mediaType === "gemini-video" ||
      mimeType.startsWith("video/")
  );
}

export function collectProtectedVideoMedia(slide) {
  if (!slide || typeof slide !== "object") return [];
  const candidates = [
    slide,
    ...asArray(slide.progressiveBuilds),
    ...asArray(slide.history),
    ...asArray(slide.media),
    ...asArray(slide.generatedMedia)
  ];
  const seen = new Set();
  return candidates.filter((entry) => {
    if (!isVideoMedia(entry)) return false;
    const key = cleanText(
      entry.videoUrl || entry.videoFileName || entry.video?.url || entry.id || entry.label
    );
    if (key && seen.has(key)) return false;
    if (key) seen.add(key);
    return true;
  });
}

export function hasProtectedVideoMedia(slide) {
  return collectProtectedVideoMedia(slide).length > 0;
}

export function normalizeMediaBuild(build, index, fallbackImageUrl = null) {
  const source = build && typeof build === "object" ? build : {};
  const kind = isVideoMedia(source) ? "video" : "image";
  const version = Number.isFinite(Number(source.version))
    ? Number(source.version)
    : index + 1;
  const id = cleanText(source.id) || `${kind}_build_${version}`;
  const normalized = {
    ...source,
    id,
    version,
    kind,
    mediaType: kind,
    label: cleanText(source.label) || `Build ${version}`
  };

  if (kind === "video") {
    normalized.protected = true;
    normalized.posterUrl =
      source.posterUrl || source.imageUrl || fallbackImageUrl || null;
    if (!normalized.imageUrl && normalized.posterUrl) {
      normalized.imageUrl = normalized.posterUrl;
    }
  } else if (!normalized.imageUrl && fallbackImageUrl) {
    normalized.imageUrl = fallbackImageUrl;
  }

  return normalized;
}

export function normalizeMediaBuilds(slide) {
  return asArray(slide?.progressiveBuilds).map((build, index) =>
    normalizeMediaBuild(build, index, slide?.imageUrl)
  );
}

export function extractPlanningText(slide) {
  if (!slide || typeof slide !== "object") return "";
  const parts = [slide.title, slide.gridTitle, slide.text, slide.description, slide.notes];

  for (const component of asArray(slide.components)) {
    parts.push(component?.title, component?.label, component?.text, component?.description);
  }
  for (const cell of asArray(slide.interactiveCells)) {
    parts.push(cell?.question, cell?.expectedAnswer);
  }
  for (const question of asArray(slide.contentAnalysis?.questions)) {
    parts.push(question?.question || question?.text, question?.expectedAnswer);
  }

  return parts
    .flatMap((part) => (Array.isArray(part) ? part : [part]))
    .map(cleanText)
    .filter(Boolean)
    .join("\n");
}

export function detectQuestionSignals(slide) {
  const text = extractPlanningText(slide);
  const lines = text
    .split(/\n+|(?<=[?.!])\s+(?=[A-Z0-9])/)
    .map(cleanText)
    .filter(Boolean);
  const questions = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const startsLikeQuestion = QUESTION_LEADERS.some(
      (leader) => lower === leader || lower.startsWith(`${leader} `)
    );
    const labelledQuestion = /^(?:q(?:uestion)?\s*\d*\s*[:.)-])/i.test(line);
    if (line.includes("?") || startsLikeQuestion || labelledQuestion) {
      questions.push(line);
    }
  }

  const title = cleanText(slide?.title || slide?.gridTitle).toLowerCase();
  const titleSignal =
    /(?:question|knowledge check|checkpoint|retrieval|starter|plenary|practice|exit ticket)/.test(
      title
    );
  const explicitCells = asArray(slide?.interactiveCells).filter(
    (cell) => cleanText(cell?.question) && (cell?.answerBounds || cell?.bounds)
  );

  return {
    detected: explicitCells.length > 0 || questions.length > 0 || titleSignal,
    confidence:
      explicitCells.length > 0
        ? "high"
        : questions.length >= 2 || (questions.length >= 1 && titleSignal)
          ? "high"
          : titleSignal || questions.length === 1
            ? "medium"
            : "low",
    questions,
    titleSignal,
    explicitCellCount: explicitCells.length
  };
}

export function isQuestionRevealSlide(slide) {
  return asArray(slide?.interactiveCells).some(
    (cell) => cleanText(cell?.question) && (cell?.answerBounds || cell?.bounds)
  );
}

export function isOverlyComplexSlide(
  slide,
  thresholds = DEFAULT_COMPLEXITY_THRESHOLDS
) {
  if (!slide || typeof slide !== "object") return false;
  if (slide.disableAutomaticBuilds === true) return false;
  if (slide.interactiveType === "web_embed" || slide.webEmbed?.url) return false;
  if (isQuestionRevealSlide(slide)) return false;

  const guide = slide.cognitiveGuide || {};
  const breakdown = guide.breakdown || {};
  const estimatedTimeSeconds = Number(guide.estimatedTimeSeconds) || 0;
  const vciScore = Number.parseFloat(guide.vciScore) || 0;
  const wordCount = Number(breakdown.wordCount) || 0;
  const visualElementsCount = Number(breakdown.visualElementsCount) || 0;
  const category = cleanText(guide.complexityCategory).toLowerCase();

  return Boolean(
    category === "high" ||
      estimatedTimeSeconds >= thresholds.estimatedTimeSeconds ||
      vciScore >= thresholds.vciScore ||
      wordCount >= thresholds.wordCount ||
      visualElementsCount >= thresholds.visualElementsCount
  );
}

function inferBuildStrategy(slide, text) {
  const reviewedPlan = currentPlanningOverride(slide);
  if (reviewedPlan?.strategy) return reviewedPlan.strategy;
  const lower = text.toLowerCase();
  if (/\bobjectives?\s*(?:&|and)\s*key terms\b|\bkey terms\b/.test(lower)) {
    return "objectives-key-terms";
  }
  if (/\bstep\s*1\b/.test(lower) && /\bstep\s*2\b/.test(lower)) {
    return "staged-objectives";
  }
  if (/\b(?:versus|vs\.?|compare|comparison|difference|myth|reality)\b/.test(lower)) {
    return "comparison";
  }
  if (/\b(?:timeline|process|pathway|cycle|sequence|procedure|method)\b/.test(lower)) {
    return "process";
  }
  if (/\b(?:table|matrix|chart|graph)\b/.test(lower)) {
    return "data-table";
  }
  if (/\b(?:equation|calculate|calculation|formula)\b/.test(lower)) {
    return "worked-example";
  }
  return "component-reveal";
}

function cleanTranscriptLine(value) {
  return cleanText(value)
    .replace(/^[|;:,*'"`~+\-_=<>–—•·\s]+/, "")
    .replace(/[|;:,*'"`~+\-_=<>–—•·\s]+$/, "")
    .trim();
}

function isUsefulPlanningLine(value, { sourceReference = false } = {}) {
  const line = cleanTranscriptLine(value);
  if (line.length < 6 || line.length > 180) return false;
  const letters = (line.match(/[A-Za-z]/g) || []).length;
  const visible = (line.match(/[A-Za-z0-9]/g) || []).length;
  const words = line.split(/\s+/).filter(Boolean);
  const singleCharacterWords = words.filter((word) => /^[A-Za-z]$/.test(word)).length;
  const baseQuality = Boolean(
    letters >= 5 &&
      visible > 0 &&
      letters / visible >= 0.48 &&
      words.length >= 2 &&
      singleCharacterWords / words.length < 0.45
  );
  if (!baseQuality || !sourceReference) return baseQuality;

  const wordTokens = line.match(/[A-Za-z][A-Za-z°µ-]*/g) || [];
  const substantialWords = wordTokens.filter((word) => word.replace(/[^A-Za-z]/g, "").length >= 4);
  return Boolean(
    wordTokens.length >= 4 &&
      substantialWords.length >= 2 &&
      substantialWords.length / wordTokens.length >= 0.32
  );
}

function inferPlanningTitle(slide) {
  const reviewedTitle = currentPlanningOverride(slide)?.title;
  if (reviewedTitle) return reviewedTitle;
  const explicitTitle = cleanText(slide?.title || slide?.gridTitle);
  const transcript = String(slide?.contentAnalysis?.transcript || slide?.text || "");
  const normalizedTranscript = cleanText(transcript).toLowerCase();
  const comparableTitleText = (value) =>
    cleanText(value)
      .toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  const comparableTranscript = comparableTitleText(normalizedTranscript);
  const comparableExplicitTitle = comparableTitleText(explicitTitle);
  const transcriptLines = transcript
    .split(/\r?\n/)
    .map((raw, index) => ({ line: cleanTranscriptLine(raw), index }))
    .filter(({ line }) => isUsefulPlanningLine(line) && line.length <= 100);

  const candidates = transcriptLines
    .map(({ line, index }) => {
      const words = line.split(/\s+/).filter(Boolean);
      const titleCaseWords = words.filter((word) => /^[A-Z][A-Za-z0-9°µ-]*$/.test(word)).length;
      const vowelWords = words.filter((word) => /[AEIOU]/i.test(word) && /[A-Za-z]{2}/.test(word)).length;
      const noisySymbols = (line.match(/[^A-Za-z0-9\s:,'’“”()\-&]/g) || []).length;
      let score = Math.max(0, 12 - index);
      if (/^lesson\s+\d+/i.test(line)) score += 24;
      if (words.length >= 3 && words.length <= 9) score += 8;
      if (titleCaseWords / words.length >= 0.6) score += 7;
      if (!/[.!?]$/.test(line)) score += 3;
      if (/\b(?:because|therefore|however|which|when|whereby)\b/i.test(line)) score -= 8;
      if (vowelWords < 2) score -= 10;
      score -= noisySymbols * 2;
      return { line, score };
    })
    .sort((a, b) => b.score - a.score);

  // The rendered slide is the authority. Some imported manifests have a title
  // shifted from the following slide, so a strong title-like OCR line wins over
  // metadata. Very noisy title-slide OCR falls back to the known deck title.
  const bestVisible = candidates[0];
  const role = cleanText(slide?.contentAnalysis?.role).toLowerCase();
  const deckTitle = cleanText(slide?.deckTitle || slide?.lessonTitle);
  if (/\bobjectives?\s*(?:&|and)\s*key terms\b/i.test(transcript)) {
    return "Objectives & Key Terms";
  }
  // Prefer reviewed slide metadata when the same heading is visibly present in
  // the rendered source. This prevents a later numbered step from outscoring
  // the real title merely because it is shorter or more title-cased.
  if (
    explicitTitle &&
    comparableExplicitTitle &&
    comparableTranscript.includes(comparableExplicitTitle) &&
    !/^slide\s+\d+(?:\s+of\s+\d+)?$/i.test(explicitTitle)
  ) {
    return explicitTitle;
  }
  // A simple instructional slide may be tagged with the broad "title" role
  // even though its first visible line is a precise prompt such as "Identify
  // the microscope components". Keep that strong source heading. True lesson
  // cover slides normally begin with "Lesson N"; for those, the reviewed deck
  // title is safer than a possibly truncated OCR heading.
  if (
    role === "title" &&
    bestVisible?.score >= 20 &&
    !/^lesson\s+\d+/i.test(bestVisible.line)
  ) {
    return bestVisible.line;
  }
  if (role === "title" && deckTitle) return deckTitle;
  if (bestVisible?.score >= 20) return bestVisible.line;
  if (explicitTitle && !/^slide\s+\d+(?:\s+of\s+\d+)?$/i.test(explicitTitle)) {
    return explicitTitle;
  }
  return bestVisible?.line || deckTitle || `Slide ${slide?.number || ""}`;
}

function summarizePlanningText(slide, text) {
  const title = inferPlanningTitle(slide);
  const reviewedPlan = currentPlanningOverride(slide);
  if (reviewedPlan?.source === "gemini-multimodal-slide-analysis") {
    const concise = [reviewedPlan.description, reviewedPlan.layout]
      .filter(Boolean)
      .join(" Spatial layout: ")
      .slice(0, 900);
    return {
      title,
      concise: concise || title,
      sourceReferenceReliable: true
    };
  }
  const transcriptLines = String(slide?.contentAnalysis?.transcript || slide?.text || "")
    .split(/\r?\n/)
    .map(cleanTranscriptLine)
    .filter((line) => isUsefulPlanningLine(line, { sourceReference: true }));
  const fallbackSentences = text
    .split(/\n+|(?<=[.!?])\s+/)
    .map(cleanTranscriptLine)
    .filter((line) => isUsefulPlanningLine(line, { sourceReference: true }));
  const seen = new Set();
  const concise = [...transcriptLines, ...fallbackSentences]
    .filter((line) => {
      const key = line.toLowerCase();
      if (key === title.toLowerCase() || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8)
    .join(" • ")
    .slice(0, 900);
  const analysisSource = cleanText(slide?.contentAnalysis?.source).toLowerCase();
  return {
    title,
    concise: concise || title,
    sourceReferenceReliable: !analysisSource.includes("local-ocr")
  };
}

function strategySteps(strategy) {
  switch (strategy) {
    case "objectives-key-terms":
      return [
        {
          label: "Reveal the objectives",
          show: "The exact source title and the complete Objectives checklist or objectives column, with every objective reproduced verbatim in its original position.",
          suppress: "All key-term definitions in the separate definitions panel. Keep the original panel border if present, but its inside must be plain source-style background with no arrows, equations, molecules, diagrams, or invented decoration."
        },
        {
          label: "Add the first key terms",
          show: "Everything from build 1 plus the first half of the source key-term definitions, in top-to-bottom source order and in their original panel positions.",
          suppress: "The remaining lower key-term definitions. Do not convert any definition into a process arrow, chemical equation, molecule, icon, or illustration unless that exact visual exists in the attached source."
        },
        {
          label: "Complete the key terms",
          show: "Everything from builds 1 and 2 plus every remaining key-term definition, copied verbatim from the source in its original order and position.",
          suppress: "Nothing instructional. Do not add any arrow, equation, molecule, icon, or illustration that is absent from the source."
        }
      ];
    case "staged-objectives":
      return [
        {
          label: "Reveal the first learning step",
          show: "The exact source title plus the complete Step 1 heading and body text (for example, 'Step 1: Know'). The only allowed visual is the compact visual cluster immediately touching or directly below Step 1.",
          suppress: "Every Step 2 and Step 3 heading, body, stair segment, arrow, example, label, and diagram. Replace every omitted later-step region with the untouched source background so the rest of the canvas is genuinely blank. Never keep a later diagram as decoration and never substitute a later step for Step 1."
        },
        {
          label: "Add the second learning step",
          show: "Everything from build 1 plus the complete Step 2 heading and body text (for example, 'Step 2: Identify') and only the visual cluster immediately touching or directly below Step 2.",
          suppress: "Every Step 3 heading, body, stair segment, arrow, conclusion, label, and diagram. Replace the entire omitted Step 3 region with the untouched source background so it is genuinely blank. Never keep a Step 3 diagram as decoration or replace Step 1 or Step 2 with Step 3."
        },
        {
          label: "Complete the learning sequence",
          show: "Everything from builds 1 and 2 plus the complete final numbered step (for example, 'Step 3: Explain'), its exact body text, and its directly related visual or conclusion.",
          suppress: "Nothing instructional; retain only purposeful decoration from the source."
        }
      ];
    case "comparison":
      return [
        {
          label: "Reveal the first comparison component",
          show: "The title and the first comparison category with its essential labels and evidence.",
          suppress: "The second category and the final synthesis or key-insight container."
        },
        {
          label: "Add the second comparison component",
          show: "Both comparison categories, aligned consistently, with only the facts needed to contrast them.",
          suppress: "The final synthesis, conclusion, or key-insight container."
        },
        {
          label: "Add the comparison insight",
          show: "Everything from the earlier builds plus the source slide's final synthesis, conclusion, or key-insight container.",
          suppress: "Nothing instructional; retain only purposeful decoration from the source."
        }
      ];
    case "process":
      return [
        {
          label: "Reveal inputs and the first stage",
          show: "The title, inputs, and first stage of the process with one clear directional cue.",
          suppress: "Later stages, outcomes, and secondary annotations."
        },
        {
          label: "Add the remaining pathway",
          show: "Everything from the earlier build plus the next essential stages through the main outcome.",
          suppress: "The final interpretation, summary, or key-insight container."
        },
        {
          label: "Add the process insight",
          show: "Everything from the earlier builds plus the final interpretation, summary, or key-insight container from the source.",
          suppress: "Nothing instructional; retain only purposeful decoration from the source."
        }
      ];
    case "data-table":
      return [
        {
          label: "Reveal headings and first evidence group",
          show: "The title, column or axis headings, and the first evidence group needed to understand the structure.",
          suppress: "Remaining rows, secondary annotations, and decorative imagery."
        },
        {
          label: "Add the comparison pattern",
          show: "Everything from the earlier build plus the additional rows or marks needed to reveal the overall pattern.",
          suppress: "The final interpretation, conclusion, or key-insight container."
        },
        {
          label: "Add the data insight",
          show: "Everything from the earlier builds plus the final interpretation, conclusion, or key-insight container from the source.",
          suppress: "Nothing instructional; retain only purposeful decoration from the source."
        }
      ];
    case "worked-example":
      return [
        {
          label: "Reveal the problem and known values",
          show: "The title, problem statement, known values, and the required formula only.",
          suppress: "Substitution, arithmetic, and final answer."
        },
        {
          label: "Add substitution and reasoning",
          show: "Everything from the earlier build plus the substitution and one clearly ordered calculation path.",
          suppress: "The final answer and concluding interpretation."
        },
        {
          label: "Reveal the final answer",
          show: "Everything from the earlier builds plus the final answer, units, and concluding interpretation from the source.",
          suppress: "Nothing instructional; retain only purposeful decoration from the source."
        }
      ];
    default:
      return [
        {
          label: "Reveal the first component",
          show: "The title and the first meaningful content component with only its directly supporting visual or labels.",
          suppress: "All later components, examples, conclusions, and key-insight containers."
        },
        {
          label: "Add the next component",
          show: "Everything from the earlier build plus the next meaningful component, relationship, or example.",
          suppress: "Later components and the final conclusion or key-insight container."
        },
        {
          label: "Complete the instructional build",
          show: "Everything from the earlier builds plus the remaining source content and final conclusion or key-insight container.",
          suppress: "Nothing instructional; retain only purposeful decoration from the source."
        }
      ];
  }
}

function questionBaseOverlaySteps(interactiveCells) {
  const questionCount = interactiveCells.length;

  return [
    {
      label: questionCount === 1 ? "Prepare the unanswered question" : "Prepare the unanswered questions",
      show: `Exactly the source-visible title, instructions, diagram, question text or number markers, leader lines, and ${questionCount} empty answer locations. Keep every answer location aligned to the source so the web player can place reviewed answer overlays precisely. Do not print catalog-only question descriptions unless those words are visibly printed in the attached source.`,
      suppress: "Every answer word, value, diagram label that functions as an answer, worked solution, mark-scheme point, and explanatory conclusion. Leave each answer region as a clean source-style blank or empty answer box; do not move, swap, or reconnect question numbers or leader lines.",
      answerReference: "This is an unanswered base image. Do not show, infer, or hint at any answer; reviewed answers are revealed later by the web player."
    }
  ];
}

function componentStepsForSlide(strategy, text) {
  if (
    strategy === "comparison" &&
    /\bmyth\b/i.test(text) &&
    /\breality\b/i.test(text)
  ) {
    return [
      {
        label: "Reveal the myth cell diagram",
        show: "The source title and The Myth component, including its simple 2D cell diagram and its caption, in their original positions.",
        suppress: "The Reality component and the blue Key Insight container at the bottom."
      },
      {
        label: "Add the real cell image",
        show: "Everything from the myth build plus The Reality component, including the real 3D cell image, labels, and caption, in its original position.",
        suppress: "The blue Key Insight container at the bottom."
      },
      {
        label: "Add the key insight",
        show: "Everything from the earlier builds plus the complete blue Key Insight container at the bottom of the source slide.",
        suppress: "Nothing instructional; this is the complete cumulative slide state."
      }
    ];
  }
  return strategySteps(strategy);
}

function inferGeneratedCellCount(slide) {
  const breakdown = slide?.cognitiveGuide?.breakdown || {};
  const visualElements = Number(breakdown.visualElementsCount) || 0;
  const wordCount = Number(breakdown.wordCount) || 0;
  const role = cleanText(slide?.contentAnalysis?.role).toLowerCase();
  if (role === "title") return 1;
  // The cognitive model has a three-element baseline for the whole-slide
  // canvas, title, and visual surface, so higher visual counts are the signal
  // for additional instructional components.
  if (visualElements >= 8 || wordCount >= 45) return 3;
  if (visualElements >= 5 || wordCount >= 16) return 2;
  return 1;
}

function selectCumulativeSteps(steps, count) {
  const safeCount = Math.max(1, Math.min(3, count));
  if (safeCount === 1) return [steps.at(-1)];
  if (safeCount === 2) return [steps[0], steps.at(-1)];
  return steps.slice(0, 3);
}

function buildGeminiImagePrompt({ slide, strategy, step, index, total, summary }) {
  const deckContext = cleanText(slide?.deckTitle || slide?.lessonTitle);
  const questionBaseOverlay = strategy === "question-base-overlay";
  const partialBuild = total > 1 && index < total - 1;
  const declaredTitle = cleanText(slide?.title || slide?.gridTitle);
  const normalizedTranscript = cleanText(
    slide?.contentAnalysis?.transcript || slide?.text
  ).toLowerCase();
  const declaredTitleIsVisible = Boolean(
    declaredTitle && normalizedTranscript.includes(declaredTitle.toLowerCase())
  );
  const titleRole = cleanText(slide?.contentAnalysis?.role).toLowerCase() === "title";
  const contextLine = deckContext ? `Deck context: ${deckContext}.` : "";
  const contentReference = questionBaseOverlay
    ? "Question-slide source rule: read the title, question text, numbering, diagram, and connector layout from the attached pixels, but never transcribe text that occupies an answer region."
    : summary.sourceReferenceReliable
    ? `Source-content reference: ${summary.concise}`
    : `Content orientation: ${declaredTitleIsVisible ? declaredTitle : deckContext || summary.title}. Read every fact and label directly from the attached original; do not reproduce OCR artefacts.`;
  return [
    `Create cumulative full-slide still-image build ${index + 1} of ${total} for slide ${slide?.number || ""}: \"${summary.title}\".`,
    contextLine,
    "Use the attached original slide as the sole visual and factual source.",
    "Return exactly one 16:9 presentation slide image; do not return commentary, a crop, an animation, or a video.",
    "Preserve the original theme, canvas dimensions, background, typography family, colour palette, illustration style, and spatial rhythm.",
    "Render the entire slide canvas at every build. Do not spotlight, dim, blur, outline, crop, zoom, or add focus boxes around any region.",
    questionBaseOverlay
      ? "Reconstruct a new unanswered slide from the source-style blank background. Preserve the question layout, but remove every visible answer from the pixels; the web player will reveal reviewed answers later as overlays."
      : total === 1
      ? "This is the only build for this slide: reproduce every instructional element, visual, label, subtitle, and title word visible in the source. Do not omit, abbreviate, or rewrite any source content."
      : index > 0
      ? "This build is cumulative: reproduce every element shown in all earlier builds in the same position, then add only the newly requested component."
      : "This is the first build: retain the source background and title styling, then show only the first requested instructional component.",
    partialBuild
      ? "PARTIAL-BUILD CONSTRUCTION RULE: do not edit or preserve the complete source as one flattened layer. Start from a clean source-style background and reconstruct only the items named under Show now. Every item under Temporarily omit must be entirely absent, leaving clean background in its place."
      : null,
    `Instructional build strategy: ${strategy}.`,
    `Show now: ${step.show}`,
    `Temporarily omit: ${step.suppress}`,
    "Treat Show now and Temporarily omit as absolute. They override any noisy OCR-derived orientation hint.",
    step.rationale
      ? `Instructional sequencing rationale: ${step.rationale}`
      : null,
    strategy === "staged-objectives"
      ? "For numbered steps, read the requested step heading and body directly from the attached pixels and reproduce them verbatim. Do not show, relabel, or borrow content from a later step before its build."
      : null,
    strategy === "staged-objectives" && index === 0 && /cell structure/i.test(deckContext)
      ? "Source-specific Step 1 guard: show only the Step 1 eukaryotic-versus-prokaryotic classification text and its two adjacent comparison visuals. Do not show the later plant cell, animal cell, bacterial-cell identification diagram, mitochondrion, chloroplast, nucleus, or any of their labels. Those later regions must be plain graph-paper background."
      : null,
    strategy === "staged-objectives" && index === 1 && /cell structure/i.test(deckContext)
      ? "Source-specific Step 2 guard: keep the Step 1 comparison, then add the Step 2 plant-cell, animal-cell, and bacterial-cell identification visuals. Do not show the Step 3 mitochondrion, chloroplast, nucleus, structure/function labels, or explanation block; that upper-right region must remain plain graph-paper background."
      : null,
    declaredTitleIsVisible
      ? `The exact visible source title is: "${declaredTitle}". Keep it verbatim in every build.`
      : null,
    titleRole && deckContext
      ? `This is the title slide for "${deckContext}". Preserve every visible source title word, including the final word; never shorten the deck title.`
      : null,
    step.answerReference,
    contentReference,
    "Keep all retained scientific wording, equations, labels, units, and relationships factually unchanged and fully legible.",
    "Do not invent facts, redesign the deck, add watermarks, or modify any separate video asset."
  ]
    .filter(Boolean)
    .join("\n");
}

function generatedImageUrlForCell(existingCell, existingBuild, sourceImageUrl) {
  const cellUrl = cleanText(existingCell?.outputImageUrl);
  if (cellUrl && cellUrl !== cleanText(sourceImageUrl)) return cellUrl;
  if (!existingBuild || isVideoMedia(existingBuild)) return null;
  const imageUrl = cleanText(existingBuild.imageUrl);
  if (!imageUrl || imageUrl === cleanText(sourceImageUrl)) return null;
  return imageUrl;
}

export function createGeminiImageCells(slide, { maxGeneratedCells = null } = {}) {
  const text = extractPlanningText(slide);
  const interactiveCells = normalizeInteractiveCells(slide);
  const strategy = interactiveCells.length > 0 ? "question-base-overlay" : inferBuildStrategy(slide, text);
  const summary = summarizePlanningText(slide, text);
  const reviewedPlan = currentPlanningOverride(slide);
  const generatedCellCount =
    maxGeneratedCells !== null &&
    maxGeneratedCells !== undefined &&
    Number.isFinite(Number(maxGeneratedCells))
    ? Math.max(1, Math.min(3, Number(maxGeneratedCells)))
    : inferGeneratedCellCount(slide);
  const steps = interactiveCells.length > 0
    ? questionBaseOverlaySteps(interactiveCells)
    : structuredPlanningSteps(slide) ||
      selectCumulativeSteps(
        componentStepsForSlide(strategy, text),
        reviewedPlan?.cellCount || generatedCellCount
      );
  const priorBuilds = normalizeMediaBuilds(slide);
  const priorById = new Map(priorBuilds.map((build) => [build.id, build]));
  const priorCellsById = new Map(
    asArray(slide?.geminiImageCells).map((cell) => [cleanText(cell?.id), cell])
  );
  const total = steps.length;
  const prefix = `gemini_slide_${slide?.number || "x"}`;

  return steps.map((step, index) => {
    const id = `${prefix}_${index + 1}_${stableIdPart(strategy)}`;
    const existingCell = priorCellsById.get(id);
    const existingBuild = priorById.get(id);
    const outputImageUrl = generatedImageUrlForCell(
      existingCell,
      existingBuild,
      slide?.imageUrl
    );
    const qaStatus = cleanText(existingCell?.qaStatus || existingBuild?.qaStatus).toLowerCase();
    const isApproved = qaStatus === "approved" && Boolean(outputImageUrl);
    return {
      id,
      order: index + 1,
      kind: "image",
      mediaType: "image",
      source: "gemini-image-chat",
      label: `Build ${index + 1}: ${step.label}`,
      strategy,
      fullCanvas: true,
      cumulative: true,
      prompt: buildGeminiImagePrompt({ slide, strategy, step, index, total, summary }),
      status: isApproved ? "approved" : outputImageUrl ? "generated-pending-qa" : "planned",
      qaStatus: isApproved ? "approved" : outputImageUrl ? "pending" : "not-started",
      outputImageUrl,
      sourceImageUrl: slide?.imageUrl || null,
      ...(existingCell?.generatedAt ? { generatedAt: existingCell.generatedAt } : {}),
      ...(existingCell?.qa ? { qa: existingCell.qa } : {})
    };
  });
}

function buildsFromGeminiCells(cells, slide) {
  if (slide?.interactiveType === "question_reveal" || slide?.animationPlan?.questionReveal === true) {
    return [];
  }
  const orderedCells = [...cells].sort((a, b) => a.order - b.order);
  const allApproved =
    orderedCells.length > 0 &&
    orderedCells.every(
      (cell) => cell.qaStatus === "approved" && cleanText(cell.outputImageUrl)
    );
  if (!allApproved) return [];

  return orderedCells.map((cell, index) => ({
    id: cell.id,
    version: index + 1,
    kind: "image",
    mediaType: "image",
    label: cell.label,
    imageUrl: cell.outputImageUrl,
    sourceImageUrl: cell.sourceImageUrl || slide?.imageUrl || null,
    prompt: cell.prompt,
    generationStatus: "ready",
    qaStatus: "approved",
    qa: cell.qa,
    source: cell.source,
    targetBounds: { x: 0, y: 0, w: 100, h: 100 },
    transition: index === 0 ? "fade" : "crossfade"
  }));
}

function serialAnimationFromBuilds(builds) {
  return {
    totalBuildSteps: builds.length,
    autoAdvanceDelayMs: DEFAULT_BUILD_DELAY_MS,
    serialSteps: builds.map((build, index) => ({
      step: index + 1,
      buildId: build.id,
      title: build.label,
      componentIds: [build.id],
      targetBounds: build.targetBounds || { x: 0, y: 0, w: 100, h: 100 },
      revealType: build.kind === "video" ? "play-video" : "crossfade"
    }))
  };
}

function normalizeInteractiveCells(slide) {
  return asArray(slide?.interactiveCells)
    .filter((cell) => cleanText(cell?.question) && (cell?.answerBounds || cell?.bounds))
    .map((cell, index) => ({
      ...cell,
      id: cleanText(cell.id) || `question_${index + 1}`,
      revealMode:
        cell.revealMode || (cell.answerVisibleInImage === false ? "overlay" : "unmask")
    }));
}

export function isSixBoxStarterQuestionSlide(slide) {
  return Boolean(
    cleanText(slide?.interactiveType).toLowerCase() === "starter_qa_grid" &&
      normalizeInteractiveCells(slide).length === 6
  );
}

function questionSerialAnimation(interactiveCells, delayMs = DEFAULT_BUILD_DELAY_MS) {
  return {
    totalBuildSteps: interactiveCells.length,
    autoAdvanceDelayMs: delayMs,
    serialSteps: interactiveCells.map((cell, index) => ({
      step: index + 1,
      title: `Reveal: ${cell.question}`,
      componentIds: [cell.id],
      targetBounds: cell.answerBounds || cell.bounds,
      revealType: cell.revealMode === "overlay" ? "answer-overlay" : "unmask"
    }))
  };
}

/**
 * Materializes a Gemini sequence only after every planned cell is approved.
 * Pending, rejected, missing, and partially approved sets remain private
 * planning metadata and can never leak into playback through a fallback.
 */
export function syncQaApprovedGeminiSequence(slide) {
  if (hasProtectedVideoMedia(slide)) return { ...slide };

  const next = { ...slide };
  const interactiveCells = normalizeInteractiveCells(slide);
  const builds = buildsFromGeminiCells(asArray(slide?.geminiImageCells), slide);

  if (builds.length > 0) {
    next.progressiveBuilds = builds;
    next.hasProgressiveBuilds = true;
    next.serialAnimation = serialAnimationFromBuilds(builds);
  } else {
    next.hasProgressiveBuilds = false;
    delete next.progressiveBuilds;
    if (interactiveCells.length > 0) {
      next.serialAnimation = questionSerialAnimation(
        interactiveCells,
        slide.serialAnimation?.autoAdvanceDelayMs || DEFAULT_BUILD_DELAY_MS
      );
    } else {
      delete next.serialAnimation;
    }
  }

  return next;
}

export function planSlideAnimation(
  slide,
  { thresholds = DEFAULT_COMPLEXITY_THRESHOLDS, preserveVideo = true } = {}
) {
  const planned = { ...slide };
  const interactiveCells = normalizeInteractiveCells(slide);
  const questionSignals = detectQuestionSignals(slide);
  const normalizedExistingBuilds = normalizeMediaBuilds(slide);
  const protectedVideoMedia = collectProtectedVideoMedia(slide);

  planned.questionAnalysis = {
    ...(slide?.questionAnalysis || {}),
    detected: questionSignals.detected,
    confidence: questionSignals.confidence,
    questionCount: Math.max(questionSignals.questions.length, interactiveCells.length),
    detectionSource:
      interactiveCells.length > 0
        ? slide?.questionAnalysis?.detectionSource || "manifest-cells"
        : slide?.contentAnalysis?.source || "manifest-text"
  };

  // Protected video is the strongest routing constraint. Even if a future
  // analysis also reports questions or high complexity, automatic image or
  // reveal planning must not delete, replace, or reorder the media sequence.
  if (preserveVideo && protectedVideoMedia.length > 0) {
    planned.progressiveBuilds = asArray(slide.progressiveBuilds).map((build) => ({ ...build }));
    planned.hasProgressiveBuilds = planned.progressiveBuilds.length > 0;
    planned.serialAnimation =
      slide.serialAnimation || serialAnimationFromBuilds(normalizedExistingBuilds);
    delete planned.geminiImageCells;
    planned.animationPlan = {
      version: 2,
      mode: "protected-video",
      reason: "Existing Gemini video media is preserved without image-plan replacement.",
      protectedVideoCount: protectedVideoMedia.length
    };
    return planned;
  }

  if (isSixBoxStarterQuestionSlide(slide)) {
    planned.isInteractive = true;
    planned.interactiveType = "starter_qa_grid";
    planned.interactiveCells = interactiveCells;
    planned.hasProgressiveBuilds = false;
    delete planned.progressiveBuilds;
    delete planned.geminiImageCells;
    planned.serialAnimation = questionSerialAnimation(
      interactiveCells,
      slide.serialAnimation?.autoAdvanceDelayMs || DEFAULT_BUILD_DELAY_MS
    );
    planned.animationPlan = {
      version: 2,
      mode: "question-reveal",
      reason: "The six-box starter grid is intentionally excluded from Gemini still-image builds.",
      protectedVideoCount: protectedVideoMedia.length
    };
    return planned;
  }

  if (interactiveCells.length > 0) {
    planned.isInteractive = true;
    planned.interactiveType = slide.interactiveType || "question_reveal";
    // Gemini supplies one QA-approved unanswered base image. Reviewed answers
    // are then rendered by the web player as exact overlays, which prevents an
    // image model from swapping labels, connector boxes, or scientific values
    // across cumulative answer frames.
    planned.interactiveCells = interactiveCells.map((cell) => ({
      ...cell,
      revealMode: "overlay",
      answerVisibleInImage: false,
      answerIsBaked: false
    }));
  }

  const cells = createGeminiImageCells(planned);
  planned.geminiImageCells = cells;
  const withApprovedSequence = syncQaApprovedGeminiSequence(planned);
  const planningOverride = currentPlanningOverride(planned);
  planned.animationPlan = {
    version: 2,
    mode: "gemini-image-cells",
    reason: "Every non-video, non-starter slide receives cumulative full-canvas Gemini still-image builds.",
    strategy: cells[0]?.strategy || "component-reveal",
    planningSource: planningOverride?.source || "local-slide-heuristics",
    analyzedComponentCount: Array.isArray(planningOverride?.components)
      ? planningOverride.components.length
      : 0,
    plannedCellCount: cells.length,
    approvedCellCount: withApprovedSequence.progressiveBuilds?.length || 0,
    qaRequired: true,
    questionReveal: interactiveCells.length > 0,
    webEmbedPreserved: Boolean(slide?.interactiveType === "web_embed" || slide?.webEmbed?.url),
    protectedVideoCount: 0
  };
  withApprovedSequence.animationPlan = planned.animationPlan;
  return withApprovedSequence;
}

export function removeGeneratedImageBuildsPreservingVideo(slide) {
  if (hasProtectedVideoMedia(slide)) {
    return {
      ...slide,
      progressiveBuilds: asArray(slide.progressiveBuilds).map((build) => ({ ...build })),
      history: Array.isArray(slide.history)
        ? slide.history.map((entry) => ({ ...entry }))
        : slide.history,
      animationPlan: {
        version: 2,
        mode: "protected-video",
        reason: "Clear ignored for protected video sequence; media and timing were retained.",
        protectedVideoCount: collectProtectedVideoMedia(slide).length
      }
    };
  }

  const plannedCellIds = new Set(
    asArray(slide?.geminiImageCells).map((cell) => cleanText(cell?.id)).filter(Boolean)
  );
  const preservedBuilds = normalizeMediaBuilds(slide).filter(
    (build) =>
      isVideoMedia(build) ||
      (!plannedCellIds.has(build.id) &&
        build.source !== "gemini-image-chat" &&
        build.source !== "original-slide")
  );
  const next = { ...slide };
  delete next.geminiImageCells;

  if (preservedBuilds.length > 0) {
    next.progressiveBuilds = preservedBuilds;
    next.hasProgressiveBuilds = true;
    next.serialAnimation = serialAnimationFromBuilds(preservedBuilds);
  } else {
    next.hasProgressiveBuilds = false;
    delete next.progressiveBuilds;
    if (!isQuestionRevealSlide(next)) delete next.serialAnimation;
  }

  next.animationPlan = {
    version: 2,
    mode: preservedBuilds.some(isVideoMedia) ? "protected-video" : "static",
    reason: "Generated still-image cells were cleared; protected video media was retained.",
    protectedVideoCount: preservedBuilds.filter(isVideoMedia).length
  };
  return next;
}

export { DEFAULT_COMPLEXITY_THRESHOLDS };
