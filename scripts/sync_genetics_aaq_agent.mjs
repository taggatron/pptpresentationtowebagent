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

  // Check if genetics_aaq is already in cardMatchesLesson
  if (!content.includes('unit === "genetics_aaq"')) {
    const cardMatchAnchor = '  if (unit === "intro_aaq_human_bio") {';
    const geneticsCardMatching = `  if (unit === "genetics_aaq" || unit === "genetics") {
    if (num === 1 && (text.includes("phenotypic") || text.includes("variation") || text.includes("intro") || text.includes("normal distribution") || text.includes("continuous"))) return true;
    if (num === 2 && (text.includes("dna") || text.includes("structure") || text.includes("telomere") || text.includes("replication") || text.includes("semiconservative") || text.includes("double helix"))) return true;
    if (num === 3 && (text.includes("central") || text.includes("dogma") || text.includes("transcription") || text.includes("translation") || text.includes("biosynthesis") || text.includes("ribosome"))) return true;
    if (num === 4 && (text.includes("expression") || text.includes("transcriptional") || text.includes("regulation") || text.includes("promoter") || text.includes("enhancer") || text.includes("transcription factor"))) return true;
    if (num === 5 && (text.includes("mutation") || text.includes("mutations") || text.includes("acquired") || text.includes("inherited") || text.includes("frameshift") || text.includes("mutagen"))) return true;
    if (num === 6 && (text.includes("single gene") || text.includes("cystic") || text.includes("fibrosis") || text.includes("sickle") || text.includes("monogenic") || text.includes("cftr"))) return true;
    if (num === 7 && (text.includes("chromosomal") || text.includes("abnormalit") || text.includes("nondisjunction") || text.includes("aneuploidy") || text.includes("karyotyp") || text.includes("down's") || text.includes("trisomy"))) return true;
    if (num === 8 && (text.includes("polygenic") || text.includes("complex") || text.includes("gwas") || text.includes("risk score") || text.includes("multifactorial") || text.includes("traits"))) return true;
  }
`;

    if (content.includes(cardMatchAnchor)) {
      content = content.replace(cardMatchAnchor, `${geneticsCardMatching}${cardMatchAnchor}`);
      console.log("[Update Agent] Added genetics_aaq to cardMatchesLesson.");
    }
  }

  // Check if genetics_aaq is in downloadPowerPoint
  if (!content.includes('process.env.UNIT === "genetics_aaq"')) {
    const downloadAnchor = 'if (!matches && process.env.UNIT === "intro_aaq_human_bio") {';
    const geneticsDownloadMatching = `if (!matches && (process.env.UNIT === "genetics_aaq" || process.env.UNIT === "genetics")) {
            if (lesson.number === 1) matches = fLower.includes("phenotypic") || fLower.includes("variation") || fLower.includes("intro");
            else if (lesson.number === 2) matches = fLower.includes("dna") || fLower.includes("telomere") || fLower.includes("replication");
            else if (lesson.number === 3) matches = fLower.includes("central") || fLower.includes("dogma") || fLower.includes("transcription");
            else if (lesson.number === 4) matches = fLower.includes("expression") || fLower.includes("transcriptional") || fLower.includes("regulation");
            else if (lesson.number === 5) matches = fLower.includes("mutation") || fLower.includes("acquired") || fLower.includes("inherited");
            else if (lesson.number === 6) matches = fLower.includes("single") || fLower.includes("disorder") || fLower.includes("cystic") || fLower.includes("sickle");
            else if (lesson.number === 7) matches = fLower.includes("chromosomal") || fLower.includes("abnormalit") || fLower.includes("aneuploidy") || fLower.includes("karyotyp");
            else if (lesson.number === 8) matches = fLower.includes("polygenic") || fLower.includes("complex") || fLower.includes("traits") || fLower.includes("gwas");
          }
          `;

    if (content.includes(downloadAnchor)) {
      content = content.replace(downloadAnchor, `${geneticsDownloadMatching}${downloadAnchor}`);
      console.log("[Update Agent] Added genetics_aaq to downloadPowerPoint.");
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
    "agent:genetics-aaq:lesson1": "UNIT=genetics_aaq START_LESSON=1 END_LESSON=1 node src/agent.js",
    "agent:gemini-notebook:genetics-aaq": "UNIT=genetics_aaq node src/agent.js",
    "agent:gemini-notebook:genetics-aaq:lesson1": "UNIT=genetics_aaq START_LESSON=1 END_LESSON=1 node src/agent.js"
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
