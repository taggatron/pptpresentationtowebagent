import fs from "node:fs";
import path from "node:path";

const DECK_MAPPING = {
  cell_biology: [
    "Lesson_01_CELL_STRUCTURE",
    "Lesson_02_MICROSCOPES",
    "Lesson_03_MAGNIFICATION_ARCHITECTURE",
    "Lesson_03_MAGNIFICATION_CALCULATIONS",
    "Lesson_04_DNA",
    "Lesson_05_ENZYMES",
    "Lesson_08_Aerobic_respiration",
    "Lesson_09_ANAEROBIC_RESPIRATION",
    "Lesson_10_FERMENTATION_PRACTICAL",
    "Lesson_11_PHOTOSYNTHESIS",
    "Lesson_12_Factors_effecting_RATE_OF_PHOTOSYNTHESIS",
    "Lesson_13_PHOTOSYNTHESIS_INVESTIGATION",
    "Magnification_Architecture"
  ],
  intro_aaq_human_bio: [
    "Lesson_00_Welcome_to_Human_Biology",
    "Lesson_01_Welcome_to_Human_Biology",
    "Lesson_02_Working_like_a_Human_Biologist",
    "Lesson_03_Thinking_like_a_Human_Biologist_Heart_Rate_Practical",
    "Lesson_04_Working_like_a_Scientist_Continued",
    "Lesson_05_Communicating_like_a_Human_Biologist_Interpreting_Data_Clinical_Trials",
    "Lesson_06_Communicating_like_a_Human_Biologist_Academic_Writing_and_Application",
    "Lesson_07_Introductory_Unit_Synthesis_Diagnostic_Profile_and_Target_Setting",
    "Lesson_08_Transition_to_Biomedical_Science_and_Genetics"
  ],
  ecology_atmosphere_classic: [
    "Classic_Lesson_01_Ecosystems",
    "Classic_Lesson_02_Investigating_Abundance_and_Distribution",
    "Classic_Lesson_03_Competition",
    "Classic_Lesson_04_Nitrogen_Cycle",
    "Classic_Lesson_05_Carbon_and_Water_Cycle",
    "Classic_Lesson_06_Human_Impacts_on_Biodiversity",
    "Classic_Lesson_07_The_Atmosphere",
    "Classic_Lesson_08_Crude_Oil_and_Fractional_Distillation",
    "Classic_Lesson_09_Greenhouse_Effect",
    "Classic_Lesson_10_Pollutants",
    "Classic_Lesson_11_Lifecycle_Assessments",
    "Classic_Lesson_12_Recycling"
  ],
  ecology_atmosphere: [
    "Lesson_01_Ecosystems",
    "Lesson_02_Investigating_Abundance_and_Distribution",
    "Lesson_03_Competition",
    "Ecosystem_Interactions",
    "The_Arena_of_Life",
    "The_Circular_Economy_Blueprint"
  ],
  genetics_selection: [
    "Lesson_01_Cell_cycle_Stem_cells_Differentiation",
    "Lesson_02_Mitosis",
    "Lesson_03_Reproduction_meiosis",
    "Lesson_04_Genetic_diagrams_inheritance",
    "Lesson_06_Selective_breeding",
    "Lesson_09_Ethics_of_genetic_modification"
  ],
  chemistry: [
    "Lesson_01_THE_PERIODIC_TABLE"
  ],
  waves_radioactivity: [
    "Lesson_01_Waves_and_parts_of_a_wave_diagram",
    "Lesson_02_Wave_experiments_wave_speed_calculation"
  ],
  tbi_neuro: [
    "Lesson_01_Anatomy_of_the_Brain"
  ],
  ai_agentic: [
    "Lesson_01_The_AI_Landscape_and_Business_Imperative"
  ],
  digital_literacy: [
    "digital_literacy_conference_deck"
  ]
};

const ROOT_DIR = process.cwd();
const DECKS_DIR = path.resolve(ROOT_DIR, "public", "decks");

console.log(`[Reorganize Decks] Target decks dir: ${DECKS_DIR}`);

// 1. Move folders into unit directories
let totalMoved = 0;
for (const [unitId, decks] of Object.entries(DECK_MAPPING)) {
  const unitDir = path.join(DECKS_DIR, unitId);
  if (!fs.existsSync(unitDir)) {
    fs.mkdirSync(unitDir, { recursive: true });
    console.log(`Created unit directory: ${unitId}`);
  }

  for (const deckId of decks) {
    const srcPath = path.join(DECKS_DIR, deckId);
    const destPath = path.join(unitDir, deckId);

    if (fs.existsSync(srcPath) && srcPath !== destPath) {
      // If destination already exists, remove or merge
      if (fs.existsSync(destPath)) {
        console.warn(`Destination ${destPath} already exists, skipping move.`);
      } else {
        fs.renameSync(srcPath, destPath);
        totalMoved++;
        console.log(`Moved ${deckId} -> ${unitId}/${deckId}`);
      }
    } else if (fs.existsSync(destPath)) {
      console.log(`Already at destination: ${unitId}/${deckId}`);
    } else {
      console.warn(`Source path not found: ${srcPath}`);
    }
  }
}
console.log(`[Reorganize Decks] Finished moving ${totalMoved} decks into unit directories.`);

// 2. Update manifests and HTML files
function replaceInObject(obj, deckId, unitId) {
  if (!obj || typeof obj !== "object") return;
  const targetSubstr = `/decks/${deckId}/`;
  const replacementSubstr = `/decks/${unitId}/${deckId}/`;

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string") {
      if (val.includes(targetSubstr)) {
        obj[key] = val.split(targetSubstr).join(replacementSubstr);
      }
    } else if (typeof val === "object") {
      replaceInObject(val, deckId, unitId);
    }
  }
}

function updateHtmlFiles(dir, deckId, unitId) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      updateHtmlFiles(full, deckId, unitId);
    } else if (entry.isFile() && (entry.name.endsWith(".html") || entry.name.endsWith(".js") || entry.name.endsWith(".css"))) {
      let content = fs.readFileSync(full, "utf8");
      const targetSubstr = `/decks/${deckId}/`;
      const replacementSubstr = `/decks/${unitId}/${deckId}/`;
      if (content.includes(targetSubstr)) {
        content = content.split(targetSubstr).join(replacementSubstr);
        fs.writeFileSync(full, content, "utf8");
        console.log(`Updated paths in ${path.relative(DECKS_DIR, full)}`);
      }
    }
  }
}

let manifestsUpdated = 0;
for (const [unitId, decks] of Object.entries(DECK_MAPPING)) {
  const unitDir = path.join(DECKS_DIR, unitId);
  for (const deckId of decks) {
    const deckDir = path.join(unitDir, deckId);
    const manifestPath = path.join(deckDir, "manifest.json");

    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        manifest.slideSet = unitId;
        replaceInObject(manifest, deckId, unitId);
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
        manifestsUpdated++;
      } catch (err) {
        console.error(`Error updating manifest for ${deckId}:`, err.message);
      }
    }

    // Update any HTML files in interactives/ or slides/
    updateHtmlFiles(deckDir, deckId, unitId);
  }
}

console.log(`[Reorganize Decks] Updated ${manifestsUpdated} manifests.`);
