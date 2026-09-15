import fs from "node:fs/promises";
import path from "node:path";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");

async function updatePrompts() {
  const promptsPath = path.join(NOTEBOOK_AGENT_DIR, "src", "prompts.js");
  let content = await fs.readFile(promptsPath, "utf8");

  // Fix isBusiness check and inject clarity instructions
  const oldIsBusinessPattern = /const isBusiness = Boolean\(\s*lesson\.deliverable \|\|\s*\(LESSON_LEVEL && LESSON_LEVEL\.toLowerCase\(\)\.includes\("business"\)\)\s*\);/;
  const newIsBusinessCode = `const isBusiness = Boolean(
    (COURSE_NAME && COURSE_NAME.toLowerCase().includes("business")) ||
    (LESSON_LEVEL && LESSON_LEVEL.toLowerCase().includes("business"))
  );`;

  if (oldIsBusinessPattern.test(content)) {
    content = content.replace(oldIsBusinessPattern, newIsBusinessCode);
    console.log("[Update Prompts] Fixed isBusiness detection.");
  }

  // Ensure prompt clarity in the default creationPrompt branch
  const oldPromptAnchor = '`Pitch the lesson at ${LESSON_LEVEL}. Build a coherent teaching sequence with learning objectives, essential terminology, accurate explanations, context, worked examples or calculations where appropriate, safety and quality considerations where relevant, regular checks for understanding, and a concise plenary summary.`,';
  
  const enhancedClarityPrompt = `\`Pitch the lesson at \${LESSON_LEVEL}. Build a coherent teaching sequence with learning objectives, essential terminology, accurate explanations, context, worked examples or calculations where appropriate, safety and quality considerations where relevant, regular checks for understanding, and a concise plenary summary.\`,
    "CRITICAL REQUIREMENT - VERY CLEAR SLIDES WITH LOW COGNITIVE LOAD: Every slide must feature exceptionally clear, uncluttered layouts with generous whitespace. Slides must NOT contain too much information or dense walls of text.",
    "Limit content on each slide to essential concepts: use short, punchy bullet points (under 15 words each, max 3–4 bullets per card/container) with bold lead-ins. Avoid long narrative paragraphs.",
    "Ensure all diagrams, tables, and data callouts are large, well-spaced, high-contrast, and immediately readable from the back of a classroom.",
    "Ensure that all lessons integrate knowledge checkpoints and learner activities (like labelling or interpreting clinical trial graphs) at the correct part of the lesson to maintain active engagement.",
    "For data interpretation, worked examples, and writing workshops, ensure practice tasks and exemplars have really clear, uncluttered step-by-step layouts with clean spacing between prompt, evidence, and explanation.",`;

  if (content.includes(oldPromptAnchor) && !content.includes("CRITICAL REQUIREMENT - VERY CLEAR SLIDES")) {
    content = content.replace(oldPromptAnchor, enhancedClarityPrompt);
    console.log("[Update Prompts] Injected clear, uncluttered slide directives into creationPrompt.");
  }

  // Add lesson.focus and lesson.deliverable handling if not already present
  if (!content.includes("if (lesson.deliverable)")) {
    const returnAnchor = "return prompt.join(\"\\n\\n\");";
    const deliverableAddition = `  if (lesson.focus) {
    prompt.push(\`Lesson Focus: \${lesson.focus}\`);
  }
  if (lesson.deliverable) {
    prompt.push(\`Key Learning Deliverable: \${lesson.deliverable}\`);
  }
  return prompt.join("\\n\\n");`;
    const parts = content.split(returnAnchor);
    if (parts.length >= 3) {
      content = `${parts[0]}${returnAnchor}${parts[1]}${deliverableAddition}${parts.slice(2).join(returnAnchor)}`;
      console.log("[Update Prompts] Added lesson focus and deliverable prompt items.");
    }
  }

  await fs.writeFile(promptsPath, content, "utf8");
  console.log("[Update Prompts] Successfully written prompts.js");
}

async function updateAgent() {
  const agentPath = path.join(NOTEBOOK_AGENT_DIR, "src", "agent.js");
  let content = await fs.readFile(agentPath, "utf8");

  // Update cardMatchesLesson for intro_aaq_human_bio
  const oldCardMatching = `    if (num === 5 && (text.includes("communicating") || text.includes("clinical") || text.includes("trial") || text.includes("interpreting") || text.includes("data"))) return true;
    if (num === 6 && (text.includes("academic") || text.includes("writing") || text.includes("application") || text.includes("synthesis"))) return true;
    if (num === 7 && (text.includes("synthesis") || text.includes("profile") || text.includes("target") || text.includes("diagnostic"))) return true;
    if (num === 8 && (text.includes("transition") || text.includes("biomedical") || text.includes("genetics"))) return true;`;

  const newCardMatching = `    if (num === 5 && (text.includes("source") || text.includes("reliability") || text.includes("referencing") || text.includes("goldacre") || text.includes("academic") || text.includes("craap") || text.includes("prompt") || text.includes("bad science") || text.includes("communicating") || text.includes("evaluating"))) return true;
    if (num === 6 && (text.includes("mrna") || text.includes("clinical") || text.includes("data") || text.includes("mock") || text.includes("nea") || text.includes("oncology") || text.includes("trial") || text.includes("covid") || text.includes("vaccine") || text.includes("communicating") || text.includes("interpreting"))) return true;
    if (num === 7 && (text.includes("peer") || text.includes("review") || text.includes("diagnostic") || text.includes("profile") || text.includes("workshop") || text.includes("exemplar") || text.includes("rubric") || text.includes("synthesis") || text.includes("standardisation"))) return true;
    if (num === 8 && (text.includes("finalisation") || text.includes("refinement") || text.includes("transition") || text.includes("biomedical") || text.includes("genetics") || text.includes("tlr") || text.includes("molecular") || text.includes("bridge"))) return true;`;

  if (content.includes(oldCardMatching)) {
    content = content.replace(oldCardMatching, newCardMatching);
    console.log("[Update Agent] Updated cardMatchesLesson keywords for Lessons 5–8.");
  }

  // Update PPTX download matching
  const oldDownloadMatching = `            else if (lesson.number === 5) matches = fLower.includes("clinical") || fLower.includes("trial") || fLower.includes("communicating") || fLower.includes("interpreting");
            else if (lesson.number === 6) matches = fLower.includes("academic") || fLower.includes("writing") || fLower.includes("application");
            else if (lesson.number === 7) matches = fLower.includes("synthesis") || fLower.includes("profile") || fLower.includes("target");
            else if (lesson.number === 8) matches = fLower.includes("transition") || fLower.includes("biomedical") || fLower.includes("genetics");`;

  const newDownloadMatching = `            else if (lesson.number === 5) matches = fLower.includes("source") || fLower.includes("reliability") || fLower.includes("referencing") || fLower.includes("communicating") || fLower.includes("goldacre") || fLower.includes("academic");
            else if (lesson.number === 6) matches = fLower.includes("mrna") || fLower.includes("clinical") || fLower.includes("mock") || fLower.includes("nea") || fLower.includes("data") || fLower.includes("oncology") || fLower.includes("communicating");
            else if (lesson.number === 7) matches = fLower.includes("peer") || fLower.includes("review") || fLower.includes("diagnostic") || fLower.includes("profile") || fLower.includes("workshop") || fLower.includes("synthesis");
            else if (lesson.number === 8) matches = fLower.includes("finalisation") || fLower.includes("transition") || fLower.includes("biomedical") || fLower.includes("genetics") || fLower.includes("refinement");`;

  if (content.includes(oldDownloadMatching)) {
    content = content.replace(oldDownloadMatching, newDownloadMatching);
    console.log("[Update Agent] Updated PPTX download file matching logic for Lessons 5–8.");
  }

  await fs.writeFile(agentPath, content, "utf8");
  console.log("[Update Agent] Successfully written agent.js");
}

async function updatePackageJson() {
  const pkgPath = path.join(NOTEBOOK_AGENT_DIR, "package.json");
  const pkg = JSON.parse(await fs.readFile(pkgPath, "utf8"));

  const newScripts = {
    "agent:intro-aaq-human-bio": "UNIT=intro_aaq_human_bio node src/agent.js",
    "agent:intro-aaq-human-bio:lessons5-7": "UNIT=intro_aaq_human_bio START_LESSON=5 END_LESSON=7 node src/agent.js",
    "agent:gemini-notebook:intro-aaq-human-bio": "UNIT=intro_aaq_human_bio node src/agent.js",
    "agent:gemini-notebook:intro-aaq-human-bio:lessons5-7": "UNIT=intro_aaq_human_bio START_LESSON=5 END_LESSON=7 node src/agent.js",
    "gemini-agent:intro-aaq-human-bio": "UNIT=intro_aaq_human_bio node src/gemini-agent.js",
    "gemini-agent:intro-aaq-human-bio:lessons5-7": "UNIT=intro_aaq_human_bio START_LESSON=5 END_LESSON=7 node src/gemini-agent.js"
  };

  Object.assign(pkg.scripts, newScripts);
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log("[Update Package.json] Added dedicated intro_aaq_human_bio agent scripts.");
}

async function resetCheckpointLessons5to8() {
  const checkpointPath = path.join(NOTEBOOK_AGENT_DIR, ".state", "checkpoint_intro_aaq_human_bio.json");
  try {
    const checkpoint = JSON.parse(await fs.readFile(checkpointPath, "utf8"));
    if (checkpoint.lessons) {
      delete checkpoint.lessons["5"];
      delete checkpoint.lessons["6"];
      delete checkpoint.lessons["7"];
      delete checkpoint.lessons["8"];
      await fs.writeFile(checkpointPath, JSON.stringify(checkpoint, null, 2) + "\n", "utf8");
      console.log("[Update Checkpoint] Reset Lessons 5, 6, 7, and 8 in checkpoint_intro_aaq_human_bio.json.");
    }
  } catch (err) {
    console.warn("[Update Checkpoint] Could not reset checkpoint:", err.message);
  }
}

async function run() {
  await updatePrompts();
  await updateAgent();
  await updatePackageJson();
  await resetCheckpointLessons5to8();
  console.log("[Sync] All NotebookLM agent files successfully synchronized!");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
