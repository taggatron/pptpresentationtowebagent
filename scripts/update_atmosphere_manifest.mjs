import fs from 'node:fs/promises';
import path from 'node:path';

const manifestPath = path.resolve('public/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere/manifest.json');

async function updateManifest() {
  const raw = await fs.readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);

  manifest.totalSlides = 10;

  // Slide 2: Update all 6 interactive cells to revealMode: "blur", answerVisibleInImage: true, answerIsBaked: true
  const slide2 = manifest.slides.find(s => s.number === 2);
  if (slide2 && slide2.interactiveCells) {
    slide2.interactiveCells.forEach(cell => {
      cell.revealMode = 'blur';
      cell.answerVisibleInImage = true;
      cell.answerIsBaked = true;
    });
  }

  // Slide 6: Update reveal_6_cell_1 to revealMode: "blur", answerVisibleInImage: true, answerIsBaked: true
  const slide6 = manifest.slides.find(s => s.number === 6);
  if (slide6 && slide6.interactiveCells) {
    slide6.interactiveCells.forEach(cell => {
      cell.revealMode = 'blur';
      cell.answerVisibleInImage = true;
      cell.answerIsBaked = true;
    });
  }

  // Slide 7: Task & Data Investigation Only (pie charts)
  const slide7 = manifest.slides.find(s => s.number === 7);
  if (slide7) {
    slide7.number = 7;
    slide7.title = "Guided Practice: Data Analysis Workshop";
    slide7.imageFileName = "slide_07.png";
    slide7.imageUrl = "/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere/slides/slide_07.png";
    slide7.isInteractive = false;
    slide7.interactiveType = null;
    slide7.text = "Guided Practice: Data Analysis Workshop\nData Investigation: Compare the early atmosphere to the modern atmosphere.\nThe Task: Identify the percentage change for Oxygen and Carbon Dioxide, and state the scientific mechanism responsible for each change.\n\nChart A (Early Atmosphere): 95% CO2, 4% Water Vapour, 1% Trace Gases\nChart B (Modern Atmosphere): 78% N2, 21% O2, 1% Other (including 0.04% CO2)";
    slide7.geminiImageCells = [];
    slide7.hasProgressiveBuilds = false;
  }

  // Slide 8: New slide with full info and 3 blurring boxes
  const newSlide8 = {
    number: 8,
    title: "Guided Practice: Step-by-Step Model Answers",
    imageFileName: "slide_08.png",
    imageUrl: "/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere/slides/slide_08.png",
    sourceMediaPath: "ppt/media/image7.png",
    isInteractive: true,
    interactiveType: "question_reveal",
    interactiveCells: [
      {
        id: "reveal_8_step_1",
        question: "Step 1: Oxygen Analysis",
        expectedAnswer: "Data: Early = 0%, Modern = 21%.\nMechanism: The evolution of algae and green plants introduced photosynthesis, which outputs O2 as a product.",
        bounds: {
          x: 1.7,
          y: 66.7,
          w: 31.2,
          h: 32.0
        },
        answerBounds: {
          x: 1.7,
          y: 66.7,
          w: 31.2,
          h: 32.0
        },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_8_step_2",
        question: "Step 2: Carbon Dioxide Analysis",
        expectedAnswer: "Data: Early = ~95%, Modern = 0.04%.\nMechanism 1: Earth cooled, water vapour condensed into oceans; CO2 dissolved into oceans to form carbonate precipitates & sedimentary rocks.\nMechanism 2: Photosynthetic life absorbed remaining CO2 to produce glucose.",
        bounds: {
          x: 32.7,
          y: 66.3,
          w: 33.7,
          h: 32.4
        },
        answerBounds: {
          x: 32.7,
          y: 66.3,
          w: 33.7,
          h: 32.4
        },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_8_step_3",
        question: "Step 3: Nitrogen Analysis",
        expectedAnswer: "Data: Early = ~1% (Trace), Modern = 78%.\nMechanism: Nitrogen is highly unreactive. Once released by volcanoes, it slowly built up over billions of years without being consumed by chemical reactions.",
        bounds: {
          x: 66.1,
          y: 66.3,
          w: 32.1,
          h: 32.4
        },
        answerBounds: {
          x: 66.1,
          y: 66.3,
          w: 32.1,
          h: 32.4
        },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      }
    ],
    text: "Guided Practice: Data Analysis Workshop - Model Answers\nData Investigation: Compare the early atmosphere to the modern atmosphere.\nChart A (Early): 95% CO2, 4% Water Vapour, 1% Trace\nChart B (Modern): 78% N2, 21% O2, 1% Other\n\nStep-by-Step Model Answer:\nStep 1: Oxygen Analysis: Early = 0%, Modern = 21%. Photosynthesis produced O2.\nStep 2: Carbon Dioxide Analysis: Early = 95%, Modern = 0.04%. Dissolved in oceans / rocks and used in photosynthesis.\nStep 3: Nitrogen Analysis: Early = ~1%, Modern = 78%. Nitrogen is unreactive and accumulated.",
    contentAnalysis: {
      schemaVersion: 1,
      status: "ready",
      source: "manual-authoring",
      transcript: "Guided Practice: Step-by-Step Model Answers",
      role: "learner-question",
      questions: [],
      questionCount: 3
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 75,
      timeGuideDisplay: "60–90s",
      vciScore: "8.5",
      complexityCategory: "High",
      ragLevel: "high",
      ragColor: "red",
      ragLabel: "High Processing",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 45000,
        semanticProcessingMs: 20000,
        wordCount: 160,
        visualElementsCount: 3
      },
      academicReferences: [
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
          relevance: "Models intrinsic and extraneous cognitive load during visual information integration."
        }
      ]
    },
    questionAnalysis: {
      detected: true,
      confidence: "high",
      questionCount: 3,
      detectionSource: "manual-step-reveal"
    },
    hasProgressiveBuilds: false,
    animationPlan: {
      version: 2,
      mode: "question-reveal",
      reason: "Interactive blur unmasking for each model answer step.",
      strategy: "component-reveal",
      planningSource: "user-configuration",
      analyzedComponentCount: 3,
      plannedCellCount: 3,
      approvedCellCount: 3,
      qaRequired: false,
      questionReveal: true,
      webEmbedPreserved: false,
      protectedVideoCount: 0
    }
  };

  // Slide 9: OCR GCSE Exam Practice & Mark Scheme interactive PDF viewer
  const newSlide9 = {
    number: 9,
    title: "OCR Exam Practice: The Earth's Atmosphere",
    imageFileName: "slide_09_exam_checkpoint.png",
    imageUrl: "/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere/slides/slide_09_exam_checkpoint.png",
    sourceMediaPath: "assets/exam_pdf/ocr_atmosphere_checkpoint.pdf",
    isInteractive: true,
    interactiveType: "web_embed",
    webEmbed: {
      url: "/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere/interactives/exam_pdf_viewer.html",
      title: "OCR Combined Science: The Earth's Atmosphere Checkpoint & Mark Scheme",
      label: "Interactive Exam Paper & Mark Scheme Split Viewer"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 120,
      timeGuideDisplay: "90–150s",
      vciScore: "7.2",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Medium Processing",
      breakdown: {
        visualGistMs: 250,
        visualScanMs: 1050,
        readingMs: 65000,
        semanticProcessingMs: 30000,
        wordCount: 195,
        visualElementsCount: 3
      },
      academicReferences: [
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
          relevance: "Models intrinsic and extraneous cognitive load during visual information integration."
        }
      ]
    },
    questionAnalysis: {
      detected: true,
      confidence: "high",
      questionCount: 5,
      detectionSource: "ocr-exam-paper"
    },
    hasProgressiveBuilds: false,
    text: "OCR GCSE Combined Science Exam-style Practice Question: The Earth's Atmosphere (13 Marks Total)\n(a) Calculate percentage point decrease in CO2 [2]\n(b) Calculate percentage decrease in CO2 [2]\n(c) Explain how living organisms increased oxygen to 21% [3]\n(d) Explain two processes that caused CO2 to decrease [4]\n(e) Suggest why nitrogen was able to build up in the atmosphere [2]"
  };

  // Slide 10: Former Slide 8 Plenary Summary & Exit-Ticket
  const oldSlide8 = manifest.slides.find(s => s.number === 8);
  let slide10 = oldSlide8;
  if (!slide10) {
    console.warn("Could not find original slide 8; looking in manifest slides");
  } else {
    slide10.number = 10;
    slide10.title = "Plenary Summary & Exit-Ticket";
    slide10.imageFileName = "slide_10.png";
    slide10.imageUrl = "/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere/slides/slide_10.png";
    if (slide10.geminiImageCells) {
      slide10.geminiImageCells.forEach(cell => {
        cell.id = cell.id.replace('slide_8', 'slide_10');
        cell.sourceImageUrl = "/decks/ecology_atmosphere_classic/Classic_Lesson_07_The_Atmosphere/slides/slide_10.png";
      });
    }
  }

  // Re-assemble slides array in order 1..10
  const slides1to6 = manifest.slides.filter(s => s.number >= 1 && s.number <= 6);
  manifest.slides = [
    ...slides1to6,
    slide7,
    newSlide8,
    newSlide9,
    slide10
  ];

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Manifest updated successfully with ${manifest.slides.length} slides and totalSlides = ${manifest.totalSlides}.`);
}

updateManifest().catch(err => {
  console.error(err);
  process.exit(1);
});
