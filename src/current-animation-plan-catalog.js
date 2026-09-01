function cloneStep(step) {
  return {
    ...step
  };
}

const CURRENT_ANIMATION_PLANS = Object.freeze({
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
