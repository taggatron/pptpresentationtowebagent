function revealCell(question, expectedAnswer, questionBounds, answerBounds, revealMode = "unmask") {
  return {
    question,
    expectedAnswer,
    questionBounds,
    bounds: questionBounds,
    answerBounds,
    revealMode,
    answerVisibleInImage: revealMode === "unmask",
    confidence: 1,
    provenance: "reviewed-current-slide-catalog"
  };
}

function repeatedAnswers(question, questionBounds, entries, revealMode = "unmask") {
  return entries.map(([expectedAnswer, answerBounds]) =>
    revealCell(question, expectedAnswer, questionBounds, answerBounds, revealMode)
  );
}

function groupedRevealCell(question, expectedAnswer, questionBounds, answerRegions, revealMode = "unmask") {
  if (!Array.isArray(answerRegions) || answerRegions.length === 0) {
    throw new Error("Grouped reveals require at least one answer region.");
  }

  return {
    ...revealCell(question, expectedAnswer, questionBounds, answerRegions[0], revealMode),
    answerRegions
  };
}

const SHARED_PHOTOSYNTHESIS_REACTION = repeatedAnswers(
  "Where do the inputs and outputs belong? Place carbon dioxide, water, light, glucose, and oxygen.",
  { x: 4.4, y: 16.5, w: 83.8, h: 6.8 },
  [
    ["Light", { x: 37.1, y: 30.6, w: 9.7, h: 8.9 }],
    ["Carbon dioxide", { x: 21, y: 61.1, w: 9.6, h: 8.6 }],
    ["Water", { x: 29.4, y: 86.6, w: 9.7, h: 8.6 }],
    ["Glucose", { x: 53.3, y: 61.1, w: 13.7, h: 8.6 }],
    ["Oxygen", { x: 70.4, y: 32.6, w: 9.5, h: 8.6 }]
  ]
);

const SHARED_FINAL_PHOTOSYNTHESIS_CHECK = [
  revealCell(
    "What is the word equation for photosynthesis?",
    "Carbon dioxide + Water → Glucose + Oxygen.",
    { x: 5.6, y: 22.8, w: 35.8, h: 21.1 },
    { x: 41.4, y: 24.7, w: 52, h: 17.2 }
  ),
  revealCell(
    "Why is photosynthesis described as an endothermic reaction?",
    "It requires light energy from the environment.",
    { x: 5.6, y: 46, w: 35.8, h: 21.1 },
    { x: 41.4, y: 48, w: 52, h: 17.2 }
  ),
  revealCell(
    "Why is it incorrect to say that plants only photosynthesise and do not respire?",
    "Plants also respire to release usable energy from glucose for living processes.",
    { x: 5.6, y: 69.4, w: 35.8, h: 21.1 },
    { x: 41.4, y: 71.3, w: 52, h: 17.2 }
  )
];

const CURRENT_QUESTION_REVEALS = {
  Lesson_01_CELL_STRUCTURE: {
    "slide_08b.png": [
      revealCell(
        "What does the central gobstopper represent?",
        "Nucleus",
        { x: 38, y: 44, w: 24, h: 22 },
        { x: 38, y: 52, w: 24, h: 8 },
        "overlay"
      ),
      revealCell(
        "What do the scattered sprinkles represent?",
        "Ribosomes",
        { x: 18, y: 62, w: 24, h: 20 },
        { x: 18, y: 68, w: 24, h: 8 },
        "overlay"
      ),
      revealCell(
        "What does the clear jelly represent?",
        "Cytoplasm",
        { x: 58, y: 68, w: 24, h: 20 },
        { x: 58, y: 74, w: 24, h: 8 },
        "overlay"
      )
    ],
    "slide_12.png": repeatedAnswers(
      "Name the labelled organelle or cell structure.",
      { x: 6.3, y: 20.2, w: 87, h: 6.2 },
      [
        ["Nucleus", { x: 35, y: 28.7, w: 12.8, h: 8.2 }],
        ["Mitochondrion", { x: 50.9, y: 28.7, w: 12.9, h: 8.2 }],
        ["Cell membrane", { x: 33.8, y: 83.4, w: 14.4, h: 8.5 }],
        ["Chloroplast", { x: 51.7, y: 83.4, w: 14.4, h: 8.5 }],
        ["Cell wall", { x: 81.1, y: 83.4, w: 14.4, h: 8.5 }]
      ],
      "overlay"
    ),
    "slide_13.png": repeatedAnswers(
      "Name the labelled bacterial cell structure.",
      { x: 7.6, y: 18.4, w: 84.4, h: 6 },
      [
        ["Main loop of chromosomal DNA / free genetic material", { x: 26.3, y: 29.4, w: 16.8, h: 7.9 }],
        ["Plasmid", { x: 73.6, y: 59, w: 16.9, h: 8 }],
        ["Ribosomes", { x: 73.6, y: 74.3, w: 16.9, h: 8 }]
      ],
      "overlay"
    ),
    "slide_14.png": [
      revealCell(
        "Which organelle contains receptor molecules and acts as a selective barrier?",
        "B) Cell membrane",
        { x: 19, y: 25, w: 68, h: 9.5 },
        { x: 29.9, y: 35.3, w: 19.5, h: 6 }
      ),
      revealCell(
        "Where are the enzymes for cellular respiration located?",
        "C) Mitochondria",
        { x: 19, y: 51.2, w: 66.5, h: 6.3 },
        { x: 47, y: 58, w: 16.2, h: 6 }
      ),
      revealCell(
        "What is the function of a ribosome?",
        "A) Site of protein synthesis",
        { x: 19, y: 75, w: 52, h: 6.4 },
        { x: 18.5, y: 82, w: 27.5, h: 6 }
      )
    ]
  },
  Lesson_02_MICROSCOPES: {
    "slide_04.png": repeatedAnswers(
      "Name the labelled microscope part.",
      { x: 15.2, y: 6.8, w: 69.8, h: 7.5 },
      [
        ["Eyepiece lens", { x: 9.7, y: 18.6, w: 19.6, h: 11.5 }],
        ["Objective lenses", { x: 9.7, y: 40.5, w: 19.6, h: 11.7 }],
        ["Stage", { x: 9.7, y: 60.7, w: 19.6, h: 11.5 }],
        ["Lamp / light source", { x: 9.7, y: 79.9, w: 19.6, h: 11.6 }],
        ["Coarse-focus knob", { x: 70.7, y: 33, w: 19.6, h: 11.8 }],
        ["Fine-focus knob", { x: 70.7, y: 52.8, w: 19.6, h: 11.7 }],
        ["Arm / supporting frame", { x: 70.7, y: 73, w: 19.6, h: 11.5 }]
      ],
      "overlay"
    ),
    "slide_11.png": [
      revealCell(
        "Calculate the magnification of the chloroplast image.",
        "Magnification = ×6000",
        { x: 4.7, y: 17.4, w: 42, h: 37 },
        { x: 4.7, y: 58.5, w: 42, h: 34.2 }
      ),
      revealCell(
        "Calculate the magnification of the mitochondrion image.",
        "80 mm = 8 × 10¹ mm",
        { x: 53.1, y: 17.4, w: 42.2, h: 37 },
        { x: 53.2, y: 58.5, w: 42.1, h: 34.2 }
      )
    ]
  },
  Lesson_03_MAGNIFICATION_CALCULATIONS: {
    "slide_05.png": [
      revealCell("Convert 5 mm to µm.", "5000 µm", { x: 5.7, y: 22.4, w: 43.4, h: 32.4 }, { x: 25.8, y: 33.7, w: 22.2, h: 10 }),
      revealCell("Convert 4500 µm to mm.", "4.5 mm", { x: 51.1, y: 22.4, w: 43.3, h: 32.4 }, { x: 74.4, y: 33.7, w: 18.5, h: 10 }),
      revealCell("Convert 0.2 mm to µm.", "200 µm", { x: 5.7, y: 58.2, w: 43.4, h: 32.5 }, { x: 28.6, y: 69.7, w: 19.3, h: 10 }),
      revealCell("Convert 8000 nm to µm.", "8 µm", { x: 51.1, y: 58.2, w: 43.3, h: 32.5 }, { x: 78, y: 69.8, w: 13.7, h: 10 })
    ],
    "slide_09.png": [
      revealCell("Which formula is needed?", "A = I ÷ M", { x: 7.3, y: 40.3, w: 35.5, h: 8 }, { x: 44.1, y: 38.3, w: 21, h: 10.4 }),
      revealCell("What conversion is needed first?", "30 mm = 30,000 µm", { x: 7.3, y: 53.3, w: 35.5, h: 8 }, { x: 44.1, y: 51.3, w: 42.4, h: 10.2 }),
      revealCell("What calculation should be performed?", "30,000 ÷ 10,000", { x: 7.3, y: 66.3, w: 35.5, h: 8 }, { x: 44.1, y: 64.3, w: 42.4, h: 10.2 }),
      revealCell("What is the final actual size?", "3 µm", { x: 7.3, y: 79.2, w: 35.5, h: 8 }, { x: 44.1, y: 77.2, w: 42.4, h: 10.3 })
    ],
    "slide_10.png": [
      groupedRevealCell(
        "A mitochondrion is 0.002 mm and its drawing is 40 mm. Find the magnification.",
        "×20,000 = 2 × 10⁴",
        { x: 7.3, y: 30.3, w: 38.9, h: 16 },
        [
          { x: 7.4, y: 52.8, w: 35.1, h: 10.3 },
          { x: 53.3, y: 21, w: 41.4, h: 58 }
        ]
      )
    ],
    "slide_11.png": [
      revealCell("Calculate the magnification of the onion epidermis image.", "×400", { x: 8.5, y: 24.2, w: 70.1, h: 16.7 }, { x: 80.2, y: 33.4, w: 13.5, h: 8.8 }, "overlay"),
      revealCell("Calculate the actual size of the plasmid.", "0.9 µm", { x: 8.5, y: 48.5, w: 83.3, h: 16.8 }, { x: 86, y: 57.8, w: 7.2, h: 8 }, "overlay"),
      revealCell("Calculate the image size of the red blood cell.", "32 mm = 3.2 × 10¹ mm", { x: 8.5, y: 72, w: 83.3, h: 17.5 }, { x: 76.7, y: 82, w: 16.5, h: 8.5 }, "overlay")
    ],
    "slide_14.png": [
      revealCell(
        "The actual size is 8 µm and the magnification is ×2000. What is the image size?",
        "16 mm",
        { x: 10.4, y: 81.4, w: 80.4, h: 12.3 },
        { x: 80, y: 69.8, w: 14, h: 8.5 },
        "overlay"
      )
    ]
  },
  Lesson_04_DNA: {
    "slide_08.png": repeatedAnswers(
      "Where do these structures live?",
      { x: 5.7, y: 18.4, w: 85, h: 7 },
      [
        ["Nucleus", { x: 23.7, y: 42.4, w: 13.9, h: 14.7 }],
        ["Chromosome", { x: 42, y: 42.4, w: 15.9, h: 14.7 }],
        ["DNA", { x: 62.4, y: 42.4, w: 13.8, h: 14.7 }],
        ["Gene", { x: 80.8, y: 42.4, w: 13.7, h: 14.7 }]
      ]
    ),
    "slide_12.png": [
      groupedRevealCell(
        "DNA is a type of protein: true or false?",
        "False — DNA is a polymer that codes for proteins; it is not a protein.",
        { x: 5.5, y: 20.2, w: 39.2, h: 6.2 },
        [
          { x: 45.5, y: 16.8, w: 16.2, h: 14.4 },
          { x: 9.4, y: 26.1, w: 84, h: 6.8 }
        ]
      ),
      groupedRevealCell(
        "A gene is larger than a chromosome: true or false?",
        "False — a chromosome contains hundreds or thousands of genes.",
        { x: 5.5, y: 37.2, w: 55.8, h: 6.4 },
        [
          { x: 60.4, y: 32.7, w: 16.6, h: 14 },
          { x: 9.5, y: 42.7, w: 78.5, h: 10 }
        ]
      ),
      groupedRevealCell(
        "DNA is a polymer shaped as a double helix: true or false?",
        "True.",
        { x: 5.5, y: 58.1, w: 62.6, h: 6.2 },
        [
          { x: 68.3, y: 52.3, w: 14.8, h: 13.7 },
          { x: 9.6, y: 63.8, w: 73.5, h: 6.8 }
        ]
      ),
      groupedRevealCell(
        "All genetic variants (alleles) arise from mutations: true or false?",
        "True — mutations are the ultimate source of new alleles.",
        { x: 5.5, y: 74.1, w: 75, h: 6.2 },
        [
          { x: 80.3, y: 69.1, w: 14.6, h: 12.8 },
          { x: 9.6, y: 79.8, w: 72, h: 10.6 }
        ]
      )
    ]
  },
  Lesson_05_ENZYMES: {
    "slide_09.png": repeatedAnswers(
      "Identify the equipment used in this investigation.",
      { x: 9.3, y: 21.8, w: 29.5, h: 13 },
      [
        ["Water bath", { x: 63.1, y: 22.5, w: 28.9, h: 18.3 }],
        ["Syringe", { x: 7.3, y: 75.9, w: 29.8, h: 14.2 }],
        ["Spotting tile and stopwatch", { x: 64.9, y: 72.8, w: 28.4, h: 18.3 }]
      ]
    ),
    "slide_11.png": [
      revealCell(
        "If the reaction at 40°C takes 45 seconds, calculate the rate.",
        "1000 ÷ 45 = 22.2 s⁻¹",
        { x: 52.8, y: 67, w: 37.2, h: 10.4 },
        { x: 57.4, y: 75.2, w: 32.7, h: 16.8 }
      )
    ]
  },
  Lesson_08_Aerobic_respiration: {
    "slide_06.png": repeatedAnswers(
      "Write down the missing raw materials, products, and energy yield to complete the word equation.",
      { x: 4.8, y: 17, w: 43.8, h: 11.9 },
      [
        ["Glucose", { x: 4.6, y: 46.6, w: 16.5, h: 18.8 }],
        ["Oxygen", { x: 4.6, y: 67.4, w: 16.5, h: 18.9 }],
        ["Carbon dioxide", { x: 79, y: 46.6, w: 16.5, h: 18.8 }],
        ["Water", { x: 79, y: 67.4, w: 16.5, h: 18.9 }],
        ["ATP / usable energy", { x: 50, y: 23.3, w: 29, h: 11.4 }]
      ],
      "overlay"
    ),
    "slide_11.png": [
      revealCell("Is aerobic respiration endothermic or exothermic?", "Exothermic.", { x: 4.1, y: 20, w: 45.8, h: 16 }, { x: 50.2, y: 20, w: 45.8, h: 16 }),
      revealCell("Where in a eukaryotic cell does aerobic respiration primarily occur?", "Mitochondria.", { x: 4.1, y: 39.1, w: 45.8, h: 16 }, { x: 50.2, y: 39.1, w: 45.8, h: 16 }),
      revealCell("What is the complete word equation for aerobic respiration?", "Glucose + Oxygen → Carbon Dioxide + Water.", { x: 4.1, y: 58.2, w: 45.8, h: 15.9 }, { x: 50.2, y: 58.2, w: 45.8, h: 15.9 }),
      revealCell("What monomers are synthesised into proteins using energy from respiration?", "Amino acids.", { x: 4.1, y: 77.2, w: 45.8, h: 16 }, { x: 50.2, y: 77.2, w: 45.8, h: 16 })
    ]
  },
  Lesson_09_ANAEROBIC_RESPIRATION: {
    "slide_05.png": repeatedAnswers(
      "Identify the missing substrate and products for a muscle cell operating without oxygen.",
      { x: 3.4, y: 18.9, w: 93.2, h: 9.1 },
      [
        ["Glucose", { x: 3.1, y: 51.9, w: 18.5, h: 13.8 }],
        ["Lactic acid", { x: 78.2, y: 42.6, w: 18.7, h: 14.1 }],
        ["Low ATP / energy yield", { x: 78.2, y: 65.1, w: 18.7, h: 13.9 }]
      ]
    ),
    "slide_07.png": [
      revealCell(
        "After exercise stops, you continue to breathe heavily. Why?",
        "Extra oxygen repays the oxygen debt; lactic acid is transported to the liver and broken down before breathing returns to normal.",
        { x: 3, y: 69.4, w: 30.9, h: 26.6 },
        { x: 34.5, y: 69.4, w: 62.5, h: 26.6 }
      )
    ],
    "slide_08.png": [
      revealCell("Anaerobic respiration produces a higher relative yield of ATP than aerobic respiration: true or false?", "False; it yields less ATP.", { x: 3, y: 18.4, w: 52.8, h: 24 }, { x: 55.8, y: 18.4, w: 41.1, h: 24 }),
      revealCell("Oxygen debt causes continued heavy breathing after a sprint: true or false?", "True.", { x: 3, y: 44.5, w: 52.8, h: 24.5 }, { x: 55.8, y: 44.5, w: 41.1, h: 24.5 }),
      revealCell("Carbon dioxide is the waste product of anaerobic respiration in animal cells: true or false?", "False; the product is lactic acid.", { x: 3, y: 71.1, w: 52.8, h: 25.1 }, { x: 55.8, y: 71.1, w: 41.1, h: 25.1 })
    ],
    "slide_11.png": [
      revealCell("Identify the muscle-cell anaerobic product.", "Lactic acid.", { x: 6.6, y: 64.5, w: 38.9, h: 7.2 }, { x: 6.7, y: 73, w: 38.7, h: 10.2 }),
      revealCell("Identify the yeast anaerobic products.", "Ethanol and carbon dioxide.", { x: 54.4, y: 64.5, w: 38.8, h: 7.2 }, { x: 54.4, y: 73, w: 38.8, h: 10.2 })
    ]
  },
  Lesson_10_FERMENTATION_PRACTICAL: {
    "slide_12.png": [
      revealCell("Why must the delivery tube be connected immediately after adding yeast to glucose?", "To stop carbon dioxide escaping and making the volume measurement inaccurate.", { x: 10.6, y: 33.4, w: 76.5, h: 9.6 }, { x: 13.2, y: 44, w: 74.7, h: 9.4 }),
      revealCell("Name one piece of apparatus that improves the resolution of the volume measurement.", "A gas syringe.", { x: 10.6, y: 55.6, w: 77.4, h: 9.1 }, { x: 13.2, y: 65.9, w: 73.5, h: 9.3 }),
      revealCell("How is an anomalous result handled?", "Identify or circle it and omit it from the mean.", { x: 10.6, y: 77.7, w: 55, h: 4.9 }, { x: 13.2, y: 82.7, w: 73.4, h: 9.2 })
    ]
  },
  Lesson_11_PHOTOSYNTHESIS: {
    "slide_08.png": SHARED_PHOTOSYNTHESIS_REACTION,
    "slide_12.png": SHARED_FINAL_PHOTOSYNTHESIS_CHECK
  },
  Lesson_12_Factors_effecting_RATE_OF_PHOTOSYNTHESIS: {
    "slide_08.png": SHARED_PHOTOSYNTHESIS_REACTION,
    "slide_12.png": SHARED_FINAL_PHOTOSYNTHESIS_CHECK
  },
  Lesson_13_PHOTOSYNTHESIS_INVESTIGATION: {
    "slide_04.png": [
      revealCell("Why do we use an aquatic plant such as Cabomba instead of a terrestrial plant?", "Its oxygen production is visible and countable as bubbles in water.", { x: 2, y: 87.2, w: 86.2, h: 10.9 }, { x: 21.7, y: 92.6, w: 76.1, h: 5.6 })
    ],
    "slide_08_restored.png": [
      revealCell("Which result is anomalous?", "Trial 3 at 10 cm: 12 bubbles per minute.", { x: 1.5, y: 1.7, w: 97.1, h: 10.7 }, { x: 76.1, y: 30.7, w: 14.3, h: 18.4 })
    ],
    "slide_12.png": repeatedAnswers(
      "Why use a datalogger instead of a thermometer and ruler?",
      { x: 52.6, y: 26.3, w: 40.9, h: 10.4 },
      [
        ["Higher-resolution temperature and light-intensity readings.", { x: 52.6, y: 40.6, w: 42.4, h: 15.4 }],
        ["It removes subjective human reading and counting error.", { x: 52.6, y: 58, w: 42.4, h: 15.4 }],
        ["It collects continuous real-time data and can plot changes automatically.", { x: 52.6, y: 75.7, w: 42.4, h: 15.2 }]
      ]
    ),
    "slide_13.png": repeatedAnswers(
      "Identify three flaws in this student's experimental design.",
      { x: 52.6, y: 22.3, w: 42.4, h: 15.1 },
      [
        ["Temperature is uncontrolled: there is no heat shield, so the incandescent lamp heats the water.", { x: 52.6, y: 40.5, w: 42.4, h: 15.2 }],
        ["Safety risk: the hot bulb is extremely close to water and glass.", { x: 52.6, y: 58.1, w: 42.4, h: 15.2 }],
        ["The water can overheat and denature the plant's enzymes, stopping photosynthesis.", { x: 52.6, y: 75.7, w: 42.4, h: 15.2 }]
      ]
    )
  }
};

export function getCurrentQuestionReveal(deckId, imageFileName) {
  const cells = CURRENT_QUESTION_REVEALS[deckId]?.[imageFileName];
  if (!cells) return null;
  return cells.map((cell, index) => ({
    ...cell,
    id: `question_${String(index + 1).padStart(2, "0")}`,
    questionBounds: { ...cell.questionBounds },
    bounds: { ...cell.bounds },
    answerBounds: { ...cell.answerBounds },
    ...(cell.answerRegions
      ? { answerRegions: cell.answerRegions.map((bounds) => ({ ...bounds })) }
      : {})
  }));
}

export function listCurrentQuestionRevealSlides() {
  return Object.entries(CURRENT_QUESTION_REVEALS).flatMap(([deckId, slides]) =>
    Object.keys(slides).map((imageFileName) => ({ deckId, imageFileName }))
  );
}
