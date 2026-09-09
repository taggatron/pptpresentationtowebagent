function cloneStep(step) {
  return {
    ...step
  };
}

const CURRENT_ANIMATION_PLANS = Object.freeze({
  Lesson_01_CELL_STRUCTURE: Object.freeze({
    "slide_06.png": Object.freeze({
      title: "Eukaryote Blueprint 1: Animal Cell",
      strategy: "component-reveal",
      cellCount: 2,
      steps: Object.freeze([
        Object.freeze({
          label: "Animal cell structure overview",
          show:
            "The exact source title 'Eukaryote Blueprint 1: Animal Cell' and the complete 3D cutaway animal cell illustration in the centre, on the light-blue graph paper grid background. Do not show any organelle labels or leader lines.",
          suppress:
            "All organelle callouts, leader lines, and labels (Nucleus, Cell Membrane, Mitochondria, Ribosomes, Cytoplasm). Leave the surrounding graph paper clean."
        }),
        Object.freeze({
          label: "Reveal animal cell organelle labels",
          show:
            "Everything from build 1 plus all animal cell organelle labels and pointer lines: Nucleus and Cell Membrane on the left; Mitochondria, Ribosomes, and Cytoplasm (Base jelly holding it all) on the right.",
          suppress:
            "Nothing instructional; this is the complete cumulative source-slide state. Never show plant-specific structures (no chloroplasts, no cell wall, no permanent vacuole)."
        })
      ])
    })
  }),
  Lesson_03_MAGNIFICATION_CALCULATIONS: Object.freeze({
    "slide_07.png": Object.freeze({
      title: "Image vs. Actual: Spotting the Difference",
      strategy: "comparison"
    }),
    "slide_08.png": Object.freeze({
      title: "Worked Example 1: Finding Magnification",
      strategy: "staged-objectives",
      cellCount: 4,
      steps: Object.freeze([
        Object.freeze({
          label: "Reveal the measurement",
          show:
            "The exact source title and context sentence, then the complete Step 1 text: 'Measure the image with a ruler. → 40 mm'. Include the cheek-cell and ruler visual with its 40 mm measurement in the original position.",
          suppress:
            "Every Step 2, Step 3, and Step 4 heading, calculation, arrow, result, and the Quality Check container. Replace their regions with clean source-style background."
        }),
        Object.freeze({
          label: "Add the unit conversion",
          show:
            "Everything from build 1 plus the complete Step 2 text: 'Units must match! Convert mm to µm. → 40 mm × 1000 = 40,000 µm', in its original position.",
          suppress:
            "Every Step 3 and Step 4 heading, calculation, arrow, result, and the Quality Check container. Leave those regions as clean source-style background."
        }),
        Object.freeze({
          label: "Add the I-A-M calculation",
          show:
            "Everything from builds 1 and 2 plus the complete Step 3 text: 'Use the I-A-M triangle: M = I ÷ A → 40,000 ÷ 50', in its original position.",
          suppress:
            "The complete Step 4 result and the Quality Check container. Leave both regions as clean source-style background."
        }),
        Object.freeze({
          label: "Reveal the result and quality check",
          show:
            "Everything from builds 1 through 3 plus the complete Step 4 result, 'Magnification = × 800', and the full Quality Check container about reflecting measurement precision, exactly as printed in the source.",
          suppress:
            "Nothing instructional; this is the complete cumulative source-slide state."
        })
      ])
    }),
    "slide_10.png": Object.freeze({
      title: "Higher Tier: Mastering Standard Form",
      strategy: "question-base-overlay",
      answerLocationCount: 2
    }),
    "slide_11.png": Object.freeze({
      title: "Independent Practice: Solve the Cases",
      strategy: "question-base-overlay"
    }),
    "slide_12.png": Object.freeze({
      title: "Solutions & Process Check",
      strategy: "process"
    }),
    "slide_14.png": Object.freeze({
      title: "Plenary: The Master Toolkit",
      strategy: "question-base-overlay"
    })
  }),
  Lesson_08_Aerobic_respiration: Object.freeze({
    "slide_01.png": Object.freeze({
      title: "Lesson 8: Aerobic respiration",
      strategy: "component-reveal"
    }),
    "slide_03.png": Object.freeze({
      title: "Misconception Buster: Breathing ≠ Respiration",
      strategy: "comparison"
    }),
    "slide_04.png": Object.freeze({
      title:
        "Aerobic cellular respiration is a universal chemical process, continuously occurring in all living cells to supply energy (ATP).",
      strategy: "component-reveal"
    }),
    "slide_05.png": Object.freeze({
      title: "The Equation: The Assembly Line",
      strategy: "process"
    }),
    "slide_12.png": Object.freeze({
      title: "Lesson Summary",
      strategy: "process"
    })
  }),
  Lesson_09_ANAEROBIC_RESPIRATION: Object.freeze({
    "slide_07.png": Object.freeze({
      title: "Economics: Repaying the Oxygen Debt",
      strategy: "question-base-overlay"
    }),
    "slide_08.png": Object.freeze({
      title: "Knowledge Checkpoint: True or False?",
      strategy: "question-base-overlay"
    }),
    "slide_11.png": Object.freeze({
      title: "Knowledge Checkpoint: Identify the Products",
      strategy: "question-base-overlay"
    }),
    "slide_12.png": Object.freeze({
      title: "Master Synthesis: Respiration Pathways",
      strategy: "component-reveal"
    }),
    "slide_13.png": Object.freeze({
      title: "Plenary: 3-2-1 Summary",
      strategy: "component-reveal",
      cellCount: 3,
      steps: Object.freeze([
        Object.freeze({
          label: "Reveal the three key products",
          show:
            "The exact source title plus the complete top '3 Key Products' container, including Lactic Acid (animals), Ethanol (plants/fungi), Carbon Dioxide (plants/fungi/aerobic), and its source icons, all in their original positions.",
          suppress:
            "The complete '2 Different Pathways' and '1 Biological Cost' containers, including their text, numbers, icons, and connector decoration. Leave those regions as clean source-style background."
        }),
        Object.freeze({
          label: "Add the two different pathways",
          show:
            "Everything from build 1 plus the complete middle '2 Different Pathways' container and its exact explanation that anaerobic outputs depend on the organism (Lactic Acid vs. Fermentation), with its source pathway visual.",
          suppress:
            "The complete '1 Biological Cost' container, including its text, number, mask icon, and toxic warning icon. Leave that region as clean source-style background."
        }),
        Object.freeze({
          label: "Add the one biological cost",
          show:
            "Everything from builds 1 and 2 plus the complete lower '1 Biological Cost' container: Oxygen Debt — the extra oxygen required post-exercise to break down accumulated, toxic lactic acid, with both source icons.",
          suppress:
            "Nothing instructional; this is the complete cumulative source-slide state."
        })
      ])
    })
  }),
  Classic_Lesson_01_Ecosystems: Object.freeze({
    "slide_02_objectives.png": Object.freeze({
      title: "Lesson Objectives: Ecosystems",
      strategy: "staged-objectives",
      cellCount: 3,
      steps: Object.freeze([
        Object.freeze({
          label: "Reveal Step 1: Know (Abiotic vs Biotic Factors)",
          show:
            "The exact slide title 'Lesson Objectives: Ecosystems' and Step 1 (Abiotic & Biotic Factors: Differentiate non-living physical factors from living community factors) in full vibrant colour.",
          suppress:
            "Step 2, Step 3, and the Key Scientific Terminology bar. Leave those regions clean."
        }),
        Object.freeze({
          label: "Add Step 2: Understand (Levels of Organisation) with attenuation",
          show:
            "Everything from build 1, but render Step 1 as translucent and greyed out. Keep the slide title 100% fully opaque and sharp. Reveal Step 2 (Levels of Organisation: Map the ecological hierarchy from organism to ecosystem) in full vibrant colour.",
          suppress:
            "Step 3 and the Key Scientific Terminology bar."
        }),
        Object.freeze({
          label: "Complete Objectives & Reveal Key Scientific Terminology",
          show:
            "Everything from builds 1 and 2, with Steps 1 and 2 rendered as translucent and greyed out. Keep the slide title 100% fully opaque and sharp. Reveal Step 3 (Interdependence & Dynamics: Predict knock-on consequences) and the complete Key Scientific Terminology bar in full vibrant colour.",
          suppress:
            "Nothing instructional; this is the complete cumulative source-slide state."
        })
      ])
    }),
    "slide_05.png": Object.freeze({
      title: "The Environment is Shaped by Two Sets of Factors",
      strategy: "comparison",
      cellCount: 2,
      steps: Object.freeze([
        Object.freeze({
          label: "Reveal the first comparison component (Abiotic Factors)",
          show:
            "The exact slide title 'The Environment is Shaped by Two Sets of Factors' and the entire left column (Abiotic Factors: Non-living factors that affect a community, with Light intensity, Temperature, Moisture level, and Soil pH) in full vibrant colour. Keep the central vertical divider line.",
          suppress:
            "The entire right column (Biotic Factors). Leave that right region as clean pale sage green background."
        }),
        Object.freeze({
          label: "Add the second comparison component (Biotic Factors) with previous-step attenuation",
          show:
            "Everything from build 1, but render the left column (Abiotic Factors) as translucent and greyed out (attenuated with reduced opacity and monochrome greyscale). Keep the slide title 100% fully opaque, sharp, and in full original colour. Reveal the entire right column (Biotic Factors: Living factors that affect a community, with Food availability, New predators, New pathogens, and Competition) in 100% full opacity and vibrant colour.",
          suppress:
            "Nothing instructional; this is the complete cumulative source-slide state."
        })
      ])
    })
  })
});

export function getCurrentAnimationPlan(deckId, imageFileName) {
  const plan = CURRENT_ANIMATION_PLANS[deckId]?.[imageFileName];
  if (!plan) return null;
  return {
    ...plan,
    ...(Array.isArray(plan.steps)
      ? { steps: plan.steps.map(cloneStep) }
      : {})
  };
}

export function listCurrentAnimationPlanSlides() {
  return Object.entries(CURRENT_ANIMATION_PLANS).flatMap(([deckId, slides]) =>
    Object.keys(slides).map((imageFileName) => ({ deckId, imageFileName }))
  );
}
