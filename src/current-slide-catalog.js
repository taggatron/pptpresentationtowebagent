const STANDARD_GRID = [
  { row: 0, col: 0, bounds: { x: 4.2, y: 20, w: 45.6, h: 24.5 }, answerBounds: { x: 5.2, y: 33.5, w: 43.6, h: 10.5 } },
  { row: 0, col: 1, bounds: { x: 50.2, y: 20, w: 45.6, h: 24.5 }, answerBounds: { x: 51.2, y: 33.5, w: 43.6, h: 10.5 } },
  { row: 1, col: 0, bounds: { x: 4.2, y: 44.8, w: 45.6, h: 24.5 }, answerBounds: { x: 5.2, y: 58.3, w: 43.6, h: 10.5 } },
  { row: 1, col: 1, bounds: { x: 50.2, y: 44.8, w: 45.6, h: 24.5 }, answerBounds: { x: 51.2, y: 58.3, w: 43.6, h: 10.5 } },
  { row: 2, col: 0, bounds: { x: 4.2, y: 69.6, w: 45.6, h: 24.5 }, answerBounds: { x: 5.2, y: 83.1, w: 43.6, h: 10.5 } },
  { row: 2, col: 1, bounds: { x: 50.2, y: 69.6, w: 45.6, h: 24.5 }, answerBounds: { x: 51.2, y: 83.1, w: 43.6, h: 10.5 } }
];

const FULL_HEIGHT_GRID = [
  { row: 0, col: 0, bounds: { x: 3.6, y: 6, w: 46.4, h: 28.5 }, answerBounds: { x: 7.5, y: 22, w: 39, h: 11 } },
  { row: 0, col: 1, bounds: { x: 50, y: 6, w: 46.4, h: 28.5 }, answerBounds: { x: 54, y: 22, w: 39, h: 11 } },
  { row: 1, col: 0, bounds: { x: 3.6, y: 34.5, w: 46.4, h: 30.5 }, answerBounds: { x: 7.5, y: 51, w: 39, h: 12 } },
  { row: 1, col: 1, bounds: { x: 50, y: 34.5, w: 46.4, h: 30.5 }, answerBounds: { x: 54, y: 51, w: 39, h: 12 } },
  { row: 2, col: 0, bounds: { x: 3.6, y: 65, w: 46.4, h: 29 }, answerBounds: { x: 7.5, y: 81.5, w: 39, h: 11 } },
  { row: 2, col: 1, bounds: { x: 50, y: 65, w: 46.4, h: 29 }, answerBounds: { x: 54, y: 81.5, w: 39, h: 11 } }
];

const PHOTOSYNTHESIS_GRID = [
  { row: 0, col: 0, bounds: { x: 4, y: 23, w: 22.5, h: 34.5 }, answerBounds: { x: 5, y: 48, w: 20.5, h: 8 } },
  { row: 0, col: 1, bounds: { x: 27, y: 23, w: 22.5, h: 34.5 }, answerBounds: { x: 28, y: 48, w: 20.5, h: 8 } },
  { row: 0, col: 2, bounds: { x: 50, y: 23, w: 23, h: 34.5 }, answerBounds: { x: 51, y: 48, w: 21, h: 8 } },
  { row: 0, col: 3, bounds: { x: 73.5, y: 23, w: 22.5, h: 34.5 }, answerBounds: { x: 74.5, y: 48, w: 20.5, h: 8 } },
  { row: 1, col: 0, bounds: { x: 4, y: 59, w: 45.5, h: 34 }, answerBounds: { x: 5, y: 83, w: 43.5, h: 8 } },
  { row: 1, col: 2, bounds: { x: 73.5, y: 59, w: 22.5, h: 34 }, answerBounds: { x: 74.5, y: 83, w: 20.5, h: 8 } }
];

const CARBON_STARTER_GRID = [
  { row: 0, col: 0, bounds: { x: 3.3, y: 17.0, w: 29.5, h: 36.0 }, answerBounds: { x: 4.5, y: 35.0, w: 27.0, h: 16.0 } },
  { row: 0, col: 1, bounds: { x: 35.3, y: 17.0, w: 29.5, h: 36.0 }, answerBounds: { x: 36.5, y: 35.0, w: 27.0, h: 16.0 } },
  { row: 0, col: 2, bounds: { x: 67.2, y: 17.0, w: 29.5, h: 36.0 }, answerBounds: { x: 68.5, y: 35.0, w: 27.0, h: 16.0 } },
  { row: 1, col: 0, bounds: { x: 3.3, y: 57.5, w: 29.5, h: 36.0 }, answerBounds: { x: 4.5, y: 75.5, w: 27.0, h: 16.0 } },
  { row: 1, col: 1, bounds: { x: 35.3, y: 57.5, w: 29.5, h: 36.0 }, answerBounds: { x: 36.5, y: 75.5, w: 27.0, h: 16.0 } },
  { row: 1, col: 2, bounds: { x: 67.2, y: 57.5, w: 29.5, h: 36.0 }, answerBounds: { x: 68.5, y: 75.5, w: 27.0, h: 16.0 } }
];

const STARTER_CONTENT = {
  Lesson_01_CELL_STRUCTURE: {
    title: "Starter Activity: Knowledge Retrieval",
    layout: STANDARD_GRID,
    cells: [
      ["What scientific instrument is essential for viewing cells?", "Light microscope (or electron microscope)."],
      ["What is the fundamental building block of all living organisms?", "The cell."],
      ["Are cells flat, 2-dimensional circles or 3-dimensional structures?", "3-dimensional structures."],
      ["Write the word equation for cellular respiration.", "Glucose + Oxygen → Carbon Dioxide + Water."],
      ["Write the word equation for photosynthesis.", "Carbon Dioxide + Water → Glucose + Oxygen."],
      ["Name one type of specialised human cell you already know.", "Any valid example, such as a red blood cell, nerve cell, or sperm cell."]
    ]
  },
  Lesson_02_MICROSCOPES: {
    title: "Activate prior knowledge before we zoom in",
    layout: STANDARD_GRID,
    cells: [
      ["Name the sub-cellular structure that contains the genetic material.", "Nucleus."],
      ["What structure provides a selective barrier to molecules entering and leaving an animal cell?", "Cell membrane."],
      ["Are plant and animal cells classed as eukaryotic or prokaryotic?", "Eukaryotic."],
      ["How many millimetres are there in one centimetre?", "10 mm."],
      ["What prefix is used for structures measured at one-thousandth of a millimetre?", "Micro; one micrometre is 0.001 mm."],
      ["Write 1000 in standard form.", "1 × 10³."]
    ]
  },
  Lesson_03_MAGNIFICATION_CALCULATIONS: {
    title: "Starter retrieval",
    layout: FULL_HEIGHT_GRID,
    cells: [
      ["Name the microscope lens closest to the specimen.", "Objective lens."],
      ["Name the lens you look directly into.", "Eyepiece lens."],
      ["How many millimetres are in one centimetre?", "10 mm."],
      ["Why do we use stains such as iodine on cells?", "To highlight colourless structures."],
      ["What is the function of the cell membrane?", "It controls what enters and leaves the cell."],
      ["Write 0.005 in standard form.", "5 × 10⁻³."]
    ]
  },
  Lesson_04_DNA: {
    title: "Starter Activity: Retrieval Grid",
    layout: [
      { row: 0, col: 0, bounds: { x: 4.8, y: 7.8, w: 43.8, h: 25 }, answerBounds: { x: 7.2, y: 24, w: 38, h: 6.5 } },
      { row: 0, col: 1, bounds: { x: 51.4, y: 7.8, w: 43.8, h: 25 }, answerBounds: { x: 53.8, y: 24, w: 38, h: 6.5 } },
      { row: 1, col: 0, bounds: { x: 4.8, y: 37.5, w: 43.8, h: 25 }, answerBounds: { x: 7.2, y: 53.8, w: 38, h: 6.5 } },
      { row: 1, col: 1, bounds: { x: 51.4, y: 37.5, w: 43.8, h: 25 }, answerBounds: { x: 53.8, y: 53.8, w: 38, h: 6.5 } },
      { row: 2, col: 0, bounds: { x: 4.8, y: 67.2, w: 43.8, h: 25 }, answerBounds: { x: 7.2, y: 83.5, w: 38, h: 6.5 } },
      { row: 2, col: 1, bounds: { x: 51.4, y: 67.2, w: 43.8, h: 25 }, answerBounds: { x: 53.8, y: 83.5, w: 38, h: 6.5 } }
    ],
    cells: [
      ["Where is genetic material kept in an animal cell?", "The nucleus"],
      ["Name the two main types of cell.", "Eukaryotic and Prokaryotic"],
      ["Are all enzymes made of proteins?", "Yes, they are biological catalysts"],
      ["What are the basic building blocks of proteins?", "Amino acids"],
      ["Which type of cell division is used for growth?", "Mitosis"],
      ["Which microscope offers the highest resolution?", "Electron microscope"]
    ]
  },
  Lesson_05_ENZYMES: {
    title: "Starter retrieval",
    layout: FULL_HEIGHT_GRID,
    cells: [
      ["What is an enzyme?", "A biological catalyst made of protein."],
      ["What happens to enzymes at extreme temperatures?", "They denature because the active site changes shape."],
      ["What reaction does amylase catalyse?", "It breaks starch down into sugars."],
      ["What is the chemical test for starch?", "Add iodine solution."],
      ["What colour indicates starch in the iodine test?", "Blue-black; iodine changes from amber when starch is present."],
      ["What is an independent variable?", "The variable that you purposefully change."]
    ]
  },
  Lesson_08_Aerobic_respiration: {
    title: "Starter Activity: Knowledge Retrieval",
    layout: STANDARD_GRID,
    cells: [
      ["What is the fundamental unit of all living organisms?", "The cell."],
      ["Which sub-cellular structure is the site of protein synthesis?", "Ribosomes."],
      ["What biological molecules act as biological catalysts?", "Enzymes."],
      ["Name the two reactants in photosynthesis.", "Carbon dioxide and water."],
      ["Is photosynthesis endothermic or exothermic?", "Endothermic."],
      ["What term describes movement of particles from high to low concentration?", "Diffusion."]
    ]
  },
  Lesson_09_ANAEROBIC_RESPIRATION: {
    title: "Starter retrieval",
    layout: STANDARD_GRID,
    cells: [
      ["What is the main purpose of cellular respiration?", "To supply ATP (energy) for living processes."],
      ["What is the main chemical reactant used as fuel in respiration?", "Glucose."],
      ["Is cellular respiration exothermic or endothermic?", "Exothermic; it releases energy."],
      ["What gas is required for aerobic respiration?", "Oxygen."],
      ["Which sub-cellular structure is the main site of aerobic respiration?", "Mitochondria."],
      ["What are the two waste products of aerobic respiration?", "Carbon dioxide and water."]
    ]
  },
  Lesson_10_FERMENTATION_PRACTICAL: {
    title: "Starter: Retrieval Practice",
    layout: STANDARD_GRID,
    cells: [
      ["State the word equation for anaerobic respiration in yeast.", "Glucose → Ethanol + Carbon Dioxide."],
      ["What is an independent variable?", "The variable that you change."],
      ["What is a dependent variable?", "The variable that you measure."],
      ["What is a control variable?", "A variable kept the same for a fair test."],
      ["Which biological molecules control the rate of respiration?", "Enzymes."],
      ["What happens to enzymes if the temperature is too high?", "They denature; the active site changes shape."]
    ]
  },
  Lesson_11_PHOTOSYNTHESIS: {
    title: "Starter Retrieval",
    layout: PHOTOSYNTHESIS_GRID,
    cells: [
      ["What sub-cellular structure is the site of photosynthesis?", "Chloroplast."],
      ["What green pigment is essential for absorbing light?", "Chlorophyll."],
      ["Which gas is absorbed from the air by plants?", "Carbon dioxide."],
      ["Which gas is released as a waste product?", "Oxygen."],
      ["True or false: photosynthesis transfers energy from the environment into the plant.", "True; photosynthesis is endothermic."],
      ["What do we call organisms that produce their own food or biomass?", "Producers."]
    ]
  },
  Lesson_12_Factors_effecting_RATE_OF_PHOTOSYNTHESIS: {
    title: "Starter Retrieval",
    layout: PHOTOSYNTHESIS_GRID,
    cells: [
      ["What sub-cellular structure is the site of photosynthesis?", "Chloroplast."],
      ["What green pigment is essential for absorbing light?", "Chlorophyll."],
      ["Which gas is absorbed from the air by plants?", "Carbon dioxide."],
      ["Which gas is released as a waste product?", "Oxygen."],
      ["True or false: photosynthesis transfers energy from the environment into the plant.", "True; photosynthesis is endothermic."],
      ["What do we call organisms that produce their own food or biomass?", "Producers."]
    ]
  },
  Lesson_13_PHOTOSYNTHESIS_INVESTIGATION: {
    title: "Starter: Retrieval Grid",
    layout: STANDARD_GRID,
    cells: [
      ["What is the word equation for photosynthesis?", "Carbon dioxide + Water → Glucose + Oxygen."],
      ["Is photosynthesis endothermic or exothermic?", "Endothermic; it takes in light energy."],
      ["What is the independent variable in an experiment?", "The variable that you change."],
      ["What is the dependent variable in an experiment?", "The variable that you measure."],
      ["Name three factors that can limit the rate of photosynthesis.", "Light intensity, temperature, and carbon dioxide concentration."],
      ["What does the resolution of a measuring instrument mean?", "The smallest change or unit that it can detect."]
    ]
  },
  Classic_Lesson_05_Carbon_and_Water_Cycle: {
    title: "Starter: Retrieval Grid",
    layout: CARBON_STARTER_GRID,
    cells: [
      ["Is aerobic respiration an exothermic or endothermic reaction?", "Exothermic (releases thermal energy and ATP to surroundings)."],
      ["What cellular pigment is required to absorb solar energy?", "Chlorophyll (contained within chloroplasts)."],
      ["Name two types of microorganisms that cause biomass decay.", "Bacteria and fungi."],
      ["What molecule acts as the immediate energy supply for living cells?", "ATP (Adenosine Triphosphate)."],
      ["What are the two primary chemical products of photosynthesis?", "Glucose (C₆H₁₂O₆) and Oxygen (O₂)."],
      ["Name one location where carbon is naturally stored on Earth.", "Atmosphere (as CO₂), oceans, living biomass, peat bogs / soil, or limestone rock."]
    ]
  }
};

export function getCurrentStarterGrid(deckId) {
  const resolvedDeckId = deckId === "Classic_Lesson_05_Carbon_Cycle" ? "Classic_Lesson_05_Carbon_and_Water_Cycle" : deckId;
  const config = STARTER_CONTENT[resolvedDeckId];
  if (!config) return null;
  return {
    title: config.title,
    cells: config.cells.map(([question, expectedAnswer], index) => ({
      id: `cell_${index + 1}`,
      ...config.layout[index],
      question,
      expectedAnswer,
      answerVisibleInImage: true,
      revealMode: "unmask",
      confidence: 1,
      provenance: "reviewed-current-slide-catalog"
    }))
  };
}

export const CURRENT_STARTER_DECK_IDS = Object.freeze(
  Object.keys(STARTER_CONTENT).filter((id) => id.startsWith("Lesson_"))
);
