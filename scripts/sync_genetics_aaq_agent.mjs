import fs from "node:fs/promises";
import path from "node:path";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const CONFIG_SRC = path.resolve("./src/configs/genetics_aaq.js");
const CONFIG_DEST = path.join(NOTEBOOK_AGENT_DIR, "src", "configs", "genetics_aaq.js");

async function copyConfig() {
  const content = await fs.readFile(CONFIG_SRC, "utf8");
  await fs.writeFile(CONFIG_DEST, content, "utf8");
  console.log("[Sync Config] Copied genetics_aaq.js to NotebookLMagent/src/configs/");
}

async function updateAgent() {
  const agentPath = path.join(NOTEBOOK_AGENT_DIR, "src", "agent.js");
  let content = await fs.readFile(agentPath, "utf8");

  // Ensure Lesson 9 is in cardMatchesLesson
  if (!content.includes('num === 9 && (text.includes("huntington")')) {
    const l8Anchor = 'if (num === 8 && (text.includes("polygenic") || text.includes("complex") || text.includes("gwas") || text.includes("risk score") || text.includes("multifactorial") || text.includes("traits"))) return true;';
    const l9Matching = `${l8Anchor}\n    if (num === 9 && (text.includes("huntington") || text.includes("nea") || text.includes("task 1") || text.includes("ben") || text.includes("case study") || text.includes("cag") || text.includes("anticipation") || text.includes("referencing"))) return true;`;
    if (content.includes(l8Anchor)) {
      content = content.replace(l8Anchor, l9Matching);
      console.log("[Update Agent] Added Lesson 9 to cardMatchesLesson.");
    }
  }

  // Ensure Lesson 9 is in downloadPowerPoint
  if (!content.includes('else if (lesson.number === 9) matches = fLower.includes("huntington")')) {
    const dlL8Anchor = 'else if (lesson.number === 8) matches = fLower.includes("polygenic") || fLower.includes("complex") || fLower.includes("traits") || fLower.includes("gwas");';
    const dlL9Matching = `${dlL8Anchor}\n            else if (lesson.number === 9) matches = fLower.includes("huntington") || fLower.includes("nea") || fLower.includes("ben") || fLower.includes("case") || fLower.includes("task") || fLower.includes("cag");`;
    if (content.includes(dlL8Anchor)) {
      content = content.replace(dlL8Anchor, dlL9Matching);
      console.log("[Update Agent] Added Lesson 9 to downloadPowerPoint.");
    }
  }

  await fs.writeFile(agentPath, content, "utf8");
  console.log("[Update Agent] Successfully verified agent.js.");
}

async function updatePackageJson() {
  const pkgPath = path.join(NOTEBOOK_AGENT_DIR, "package.json");
  const pkg = JSON.parse(await fs.readFile(pkgPath, "utf8"));

  const newScripts = {
    "agent:genetics-aaq": "UNIT=genetics_aaq node src/agent.js",
    "agent:genetics-aaq:lesson9": "UNIT=genetics_aaq START_LESSON=9 END_LESSON=9 node src/agent.js",
    "agent:gemini-notebook:genetics-aaq": "UNIT=genetics_aaq node src/agent.js",
    "agent:gemini-notebook:genetics-aaq:lesson9": "UNIT=genetics_aaq START_LESSON=9 END_LESSON=9 node src/agent.js"
  };

  Object.assign(pkg.scripts, newScripts);
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log("[Update Package.json] Added dedicated genetics_aaq agent scripts.");
}

async function run() {
  await copyConfig();
  await updateAgent();
  await updatePackageJson();
  console.log("[Sync] All Genetics AAQ agent configurations synchronized successfully!");
}

run().catch((err) => {
  console.error("[Sync Error]:", err);
  process.exit(1);
});
