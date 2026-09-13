import fs from "node:fs/promises";
import path from "node:path";

const PPTX_OUTPUT_DIR = "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/NotebookLMagent/output/powerpoints_aaq_human_bio";
const PUBLIC_DECKS_DIR = path.resolve("./public/decks");

async function main() {
  console.log("=== STEP 1: Updating PPTX output directory ===");
  const srcPptx1 = path.join(PPTX_OUTPUT_DIR, "S1_Pharmaceuticals_Scientist_Onboarding.pptx");
  const srcPptx2 = path.join(PPTX_OUTPUT_DIR, "Biomedical_Microscopy_Standards.pptx");
  const targetPptx1 = path.join(PPTX_OUTPUT_DIR, "Lesson_01_Welcome_to_Human_Biology.pptx");
  const targetPptx2 = path.join(PPTX_OUTPUT_DIR, "Lesson_02_Working_like_a_Human_Biologist.pptx");

  // Copy to standard Lesson names
  await fs.copyFile(srcPptx1, targetPptx1);
  console.log("Copied", srcPptx1, "->", targetPptx1);
  await fs.copyFile(srcPptx2, targetPptx2);
  console.log("Copied", srcPptx2, "->", targetPptx2);

  // Remove the standalone names so server scan doesn't list duplicates
  await fs.unlink(srcPptx1).catch(() => {});
  await fs.unlink(srcPptx2).catch(() => {});
  console.log("Cleaned up un-prefixed PPTX files in output dir");

  console.log("\n=== STEP 2: Integrating Lesson 1 (S1 Pharmaceuticals Scientist Onboarding) ===");
  const deck1Dir = path.join(PUBLIC_DECKS_DIR, "Lesson_01_Welcome_to_Human_Biology");
  const deck1SlidesDir = path.join(deck1Dir, "slides");
  await fs.mkdir(deck1SlidesDir, { recursive: true });

  // Clean old slide files and copy new extracted slides
  const oldFiles1 = await fs.readdir(deck1SlidesDir);
  for (const f of oldFiles1) {
    await fs.unlink(path.join(deck1SlidesDir, f)).catch(() => {});
  }

  const srcSlides1Dir = path.resolve("./scratch_extract/test_deck_1/slides");
  const slideFiles1 = (await fs.readdir(srcSlides1Dir)).filter(f => f.endsWith(".png")).sort();
  for (const f of slideFiles1) {
    await fs.copyFile(path.join(srcSlides1Dir, f), path.join(deck1SlidesDir, f));
  }
  console.log(`Copied ${slideFiles1.length} slide images into ${deck1SlidesDir}`);

  // Starter questions and answers for Slide 2 of Lesson 1 (3 cols x 2 rows)
  const deck1StarterQuestions = [
    {
      q: "Cellular Architecture: Human cells are eukaryotic. What is the definitive characteristic of a eukaryotic cell compared to a bacterial pathogen?",
      a: "Eukaryotic cells possess a membrane-bound nucleus and membrane-bound organelles (mitochondria, ER), whereas bacterial pathogens are prokaryotes with circular naked DNA and no membrane-bound organelles."
    },
    {
      q: "System Organisation: From smallest to largest, map the hierarchy of human biological organisation starting with 'Cell' and ending with 'Organism'.",
      a: "Cell → Tissue → Organ → Organ System → Organism."
    },
    {
      q: "Metabolic Energy: What is the primary function of the mitochondria in a human muscle cell, and what gas is required for this process?",
      a: "To synthesize ATP via aerobic cellular respiration / oxidative phosphorylation; requires oxygen (O2) as terminal electron acceptor."
    },
    {
      q: "Cellular Transport: Which form of cellular transport moves substances against the concentration gradient, and what does it require to function?",
      a: "Active transport; requires specific transmembrane carrier proteins (pumps) and metabolic energy in the form of ATP hydrolysis."
    },
    {
      q: "Reproductive Endocrinology: Name two of the four primary hormones involved in regulating the female menstrual cycle.",
      a: "Any two of: FSH (Follicle-Stimulating Hormone), LH (Luteinising Hormone), Oestrogen, Progesterone."
    },
    {
      q: "Clinical Microbiology: What is the key difference between how we medically treat a bacterial infection versus a viral infection?",
      a: "Bacterial infections are treated with antibiotics targeting peptidoglycan cell walls or 70S ribosomes; viruses lack these targets and require antivirals, symptom management, or vaccines."
    }
  ];

  // 3 cols x 2 rows layout bounds
  const deck1StarterBounds = [
    { row: 0, col: 0, bounds: { x: 3.0, y: 16.0, w: 29.0, h: 36.0 } },
    { row: 0, col: 1, bounds: { x: 35.5, y: 16.0, w: 29.0, h: 36.0 } },
    { row: 0, col: 2, bounds: { x: 68.0, y: 16.0, w: 29.0, h: 36.0 } },
    { row: 1, col: 0, bounds: { x: 3.0, y: 59.0, w: 29.0, h: 36.0 } },
    { row: 1, col: 1, bounds: { x: 35.5, y: 59.0, w: 29.0, h: 36.0 } },
    { row: 1, col: 2, bounds: { x: 68.0, y: 59.0, w: 29.0, h: 36.0 } }
  ];

  const deck1Manifest = {
    id: "Lesson_01_Welcome_to_Human_Biology",
    title: "1. S1 Pharmaceuticals: Scientist Onboarding & Clinical Knowledge Baseline",
    slideSet: "intro_aaq_human_bio",
    filename: "Lesson_01_Welcome_to_Human_Biology.pptx",
    totalSlides: 8,
    courseName: "OCR Level 3 Cambridge Advanced National (AAQ) in Human Biology",
    teacher: "Dan",
    slides: [
      {
        number: 1,
        title: "Lesson 1: Welcome to Human Biology: What do you already know? - S1 Pharmaceuticals: Scientist Onboarding",
        imageFileName: "slide_01.png",
        imageUrl: "/decks/Lesson_01_Welcome_to_Human_Biology/slides/slide_01.png",
        sourceMediaPath: "ppt/media/image1.png",
        isInteractive: false,
        interactiveType: null
      },
      {
        number: 2,
        title: "Starter Activity Grid: Retrieval & Reflection for Biomedical Leaders",
        imageFileName: "slide_02.png",
        imageUrl: "/decks/Lesson_01_Welcome_to_Human_Biology/slides/slide_02.png",
        sourceMediaPath: "ppt/media/image2.png",
        isInteractive: true,
        interactiveType: "six_cell_grid",
        starterQuestions: deck1StarterQuestions,
        interactiveCells: deck1StarterQuestions.map((qObj, idx) => ({
          id: `cell_${idx + 1}`,
          row: deck1StarterBounds[idx].row,
          col: deck1StarterBounds[idx].col,
          bounds: deck1StarterBounds[idx].bounds,
          question: qObj.q,
          expectedAnswer: qObj.a,
          answer: qObj.a,
          overlayAnswer: true,
          revealMode: "overlay",
          confidence: 1
        })),
        cells: []
      },
      {
        number: 3,
        title: "Learning Objectives & Strategic Alignment: Traditional GCSE vs OCR Level 3 AAQ",
        imageFileName: "slide_03.png",
        imageUrl: "/decks/Lesson_01_Welcome_to_Human_Biology/slides/slide_03.png",
        sourceMediaPath: "ppt/media/image3.png",
        isInteractive: false,
        interactiveType: null
      },
      {
        number: 4,
        title: "Technical Architecture Deep Dive: Central Dogma & The Energetic Cost of Biosynthesis",
        imageFileName: "slide_04.png",
        imageUrl: "/decks/Lesson_01_Welcome_to_Human_Biology/slides/slide_04.png",
        sourceMediaPath: "ppt/media/image4.png",
        isInteractive: false,
        interactiveType: null
      },
      {
        number: 5,
        title: "Industry Applications: F173 NEA Scenario Briefing: S1 Pharmaceuticals Patient Profiles",
        imageFileName: "slide_05.png",
        imageUrl: "/decks/Lesson_01_Welcome_to_Human_Biology/slides/slide_05.png",
        sourceMediaPath: "ppt/media/image5.png",
        isInteractive: false,
        interactiveType: null
      },
      {
        number: 6,
        title: "Check for Understanding: Clinical Misconceptions & Strategic Corrections",
        imageFileName: "slide_06.png",
        imageUrl: "/decks/Lesson_01_Welcome_to_Human_Biology/slides/slide_06.png",
        sourceMediaPath: "ppt/media/image6.png",
        isInteractive: true,
        interactiveType: "custom_reveals",
        interactiveCells: [
          {
            id: "reveal_error_1_correction",
            question: "Correction: Microbiology Ribosomes & Antibiotics",
            bounds: { x: 5.6, y: 58.5, w: 41.5, h: 36.0 },
            answerBounds: { x: 5.6, y: 58.5, w: 41.5, h: 36.0 },
            revealMode: "blur",
            confidence: 1
          },
          {
            id: "reveal_error_2_correction",
            question: "Correction: Bioenergetics & ATP Transfer",
            bounds: { x: 52.8, y: 58.5, w: 41.5, h: 36.0 },
            answerBounds: { x: 52.8, y: 58.5, w: 41.5, h: 36.0 },
            revealMode: "blur",
            confidence: 1
          }
        ]
      },
      {
        number: 7,
        title: "Workshop Protocol: 30-Mark Diagnostic Baseline Assessment",
        imageFileName: "slide_07.png",
        imageUrl: "/decks/Lesson_01_Welcome_to_Human_Biology/slides/slide_07.png",
        sourceMediaPath: "ppt/media/image7.png",
        isInteractive: false,
        interactiveType: null
      },
      {
        number: 8,
        title: "Plenary Summary & 3 Strategic Executive Takeaways",
        imageFileName: "slide_08.png",
        imageUrl: "/decks/Lesson_01_Welcome_to_Human_Biology/slides/slide_08.png",
        sourceMediaPath: "ppt/media/image8.png",
        isInteractive: true,
        interactiveType: "custom_reveals",
        interactiveCells: [
          {
            id: "hinge_q1",
            question: "Ribosome size in human cytosol",
            bounds: { x: 4.0, y: 26.5, w: 42.0, h: 8.5 },
            answerBounds: { x: 4.0, y: 26.5, w: 42.0, h: 8.5 },
            revealMode: "blur",
            confidence: 1
          },
          {
            id: "hinge_q2",
            question: "Mitochondrial synthesized molecule",
            bounds: { x: 4.0, y: 36.5, w: 42.0, h: 8.5 },
            answerBounds: { x: 4.0, y: 36.5, w: 42.0, h: 8.5 },
            revealMode: "blur",
            confidence: 1
          },
          {
            id: "hinge_q3",
            question: "Site of transcription",
            bounds: { x: 4.0, y: 46.5, w: 42.0, h: 8.5 },
            answerBounds: { x: 4.0, y: 46.5, w: 42.0, h: 8.5 },
            revealMode: "blur",
            confidence: 1
          },
          {
            id: "hinge_q4",
            question: "Energy molecule for translation activation",
            bounds: { x: 4.0, y: 56.5, w: 42.0, h: 10.5 },
            answerBounds: { x: 4.0, y: 56.5, w: 42.0, h: 10.5 },
            revealMode: "blur",
            confidence: 1
          },
          {
            id: "hinge_q5",
            question: "Two systems for NEA patient diagnosis",
            bounds: { x: 4.0, y: 69.0, w: 42.0, h: 11.5 },
            answerBounds: { x: 4.0, y: 69.0, w: 42.0, h: 11.5 },
            revealMode: "blur",
            confidence: 1
          },
          {
            id: "hinge_q6",
            question: "F173 NEA scenario company name",
            bounds: { x: 4.0, y: 82.5, w: 42.0, h: 9.5 },
            answerBounds: { x: 4.0, y: 82.5, w: 42.0, h: 9.5 },
            revealMode: "blur",
            confidence: 1
          }
        ]
      }
    ]
  };
  deck1Manifest.slides[1].cells = deck1Manifest.slides[1].interactiveCells;

  await fs.writeFile(
    path.join(deck1Dir, "manifest.json"),
    JSON.stringify(deck1Manifest, null, 2),
    "utf8"
  );
  console.log("Successfully wrote manifest for Lesson 1");

  console.log("\n=== STEP 3: Integrating Lesson 2 (Biomedical Microscopy Standards) ===");
  const deck2Dir = path.join(PUBLIC_DECKS_DIR, "Lesson_02_Working_like_a_Human_Biologist");
  const deck2SlidesDir = path.join(deck2Dir, "slides");
  await fs.mkdir(deck2SlidesDir, { recursive: true });

  // Clean old slide files and copy new extracted slides
  const oldFiles2 = await fs.readdir(deck2SlidesDir);
  for (const f of oldFiles2) {
    await fs.unlink(path.join(deck2SlidesDir, f)).catch(() => {});
  }

  const srcSlides2Dir = path.resolve("./scratch_extract/test_deck_2/slides");
  const slideFiles2 = (await fs.readdir(srcSlides2Dir)).filter(f => f.endsWith(".png")).sort();
  for (const f of slideFiles2) {
    await fs.copyFile(path.join(srcSlides2Dir, f), path.join(deck2SlidesDir, f));
  }
  console.log(`Copied ${slideFiles2.length} slide images into ${deck2SlidesDir}`);

  // Starter questions and answers for Slide 2 of Lesson 2 (2 cols x 3 rows)
  const deck2StarterQuestions = [
    {
      q: "The Eukaryotic Baseline: Human cells are eukaryotic. From an analytical perspective, what defining structural features (nucleus, cell membrane, mitochondria) must our lab technicians look for under the microscope?",
      a: "A distinct membrane-bound nucleus with chromatin, well-defined cytoplasm bounded by a plasma membrane, and intracellular compartmentalisation/organelles."
    },
    {
      q: "Magnification Mechanics: If a technician uses a 10x eyepiece and a 40x objective lens, what is the total operational magnification?",
      a: "Total Magnification = Eyepiece (10×) × Objective (40×) = 400× total magnification."
    },
    {
      q: "Cellular Transport Principles: Identify the core difference between passive diffusion and active transport when considering how biological samples interact with chemical stains.",
      a: "Passive diffusion moves stain molecules down a concentration gradient without ATP expenditure; active transport requires ATP to move solutes against an electrochemical gradient across intact cell membranes."
    },
    {
      q: "Quality Control in Centrifugation: Why must cell suspensions be assessed for cell count and integrity before we dedicate resources to slide preparation?",
      a: "To ensure adequate cellular density, avoid overlapping clumps or cell lysis/debris, and prevent unstandardised staining or non-diagnostic slide artefacts."
    },
    {
      q: "The High-Dry Hazard: When using the 40x objective, why must we ensure the coverslip thickness and mounting medium strictly adhere to the 0.17mm tolerance limit?",
      a: "High-dry objective lenses have very short working distances and high numerical apertures calibrated for No. 1.5 (0.17 mm) coverslips; deviation causes spherical aberration and risks crushing the slide."
    },
    {
      q: "Standardising Stains: Why do industry standards require strict batch reporting for molecular formula, molar mass, and intended use?",
      a: "To guarantee clinical repeatability, diagnostic reproducibility, control dye purity/concentration, and comply with clinical quality assurance (ISO/GLP) standards."
    }
  ];

  // 2 cols x 3 rows layout bounds
  const deck2StarterBounds = [
    { row: 0, col: 0, bounds: { x: 4.2, y: 29.0, w: 45.0, h: 21.0 } },
    { row: 1, col: 0, bounds: { x: 4.2, y: 53.0, w: 45.0, h: 21.0 } },
    { row: 2, col: 0, bounds: { x: 4.2, y: 75.0, w: 45.0, h: 21.0 } },
    { row: 0, col: 1, bounds: { x: 50.8, y: 29.0, w: 45.0, h: 21.0 } },
    { row: 1, col: 1, bounds: { x: 50.8, y: 53.0, w: 45.0, h: 21.0 } },
    { row: 2, col: 1, bounds: { x: 50.8, y: 75.0, w: 45.0, h: 21.0 } }
  ];

  const deck2Manifest = {
    id: "Lesson_02_Working_like_a_Human_Biologist",
    title: "2. Biomedical Microscopy Standards & Slide Preparation",
    slideSet: "intro_aaq_human_bio",
    filename: "Lesson_02_Working_like_a_Human_Biologist.pptx",
    totalSlides: 8,
    courseName: "OCR Level 3 Cambridge Advanced National (AAQ) in Human Biology",
    teacher: "Dan",
    slides: [
      {
        number: 1,
        title: "Lesson 2: Working like a Human Biologist - Microscopy Baseline & Clinical Slide Preparation",
        imageFileName: "slide_01.png",
        imageUrl: "/decks/Lesson_02_Working_like_a_Human_Biologist/slides/slide_01.png",
        sourceMediaPath: "ppt/media/image1.png",
        isInteractive: false,
        interactiveType: null
      },
      {
        number: 2,
        title: "Starter Activity Grid: Industry Leader Reflections",
        imageFileName: "slide_02.png",
        imageUrl: "/decks/Lesson_02_Working_like_a_Human_Biologist/slides/slide_02.png",
        sourceMediaPath: "ppt/media/image2.png",
        isInteractive: true,
        interactiveType: "six_cell_grid",
        starterQuestions: deck2StarterQuestions,
        interactiveCells: deck2StarterQuestions.map((qObj, idx) => ({
          id: `cell_${idx + 1}`,
          row: deck2StarterBounds[idx].row,
          col: deck2StarterBounds[idx].col,
          bounds: deck2StarterBounds[idx].bounds,
          question: qObj.q,
          expectedAnswer: qObj.a,
          answer: qObj.a,
          overlayAnswer: true,
          revealMode: "overlay",
          confidence: 1
        })),
        cells: []
      },
      {
        number: 3,
        title: "Learning Objectives & Strategic Alignment: Unit F173 (Biomedical Techniques)",
        imageFileName: "slide_03.png",
        imageUrl: "/decks/Lesson_02_Working_like_a_Human_Biologist/slides/slide_03.png",
        sourceMediaPath: "ppt/media/image3.png",
        isInteractive: false,
        interactiveType: null
      },
      {
        number: 4,
        title: "Technical Architecture: Achieving Köhler Illumination: Phases 1 to 3",
        imageFileName: "slide_04.png",
        imageUrl: "/decks/Lesson_02_Working_like_a_Human_Biologist/slides/slide_04.png",
        sourceMediaPath: "ppt/media/image4.png",
        isInteractive: false,
        interactiveType: null
      },
      {
        number: 5,
        title: "Enterprise Scenario: S1 Pharmaceuticals Diagnostic Microscopy Link",
        imageFileName: "slide_05.png",
        imageUrl: "/decks/Lesson_02_Working_like_a_Human_Biologist/slides/slide_05.png",
        sourceMediaPath: "ppt/media/image5.png",
        isInteractive: false,
        interactiveType: null
      },
      {
        number: 6,
        title: "Diagnostic Troubleshooting Workshop: Sub-Optimal Microscopy Results",
        imageFileName: "slide_06.png",
        imageUrl: "/decks/Lesson_02_Working_like_a_Human_Biologist/slides/slide_06.png",
        sourceMediaPath: "ppt/media/image6.png",
        isInteractive: true,
        interactiveType: "custom_reveals",
        interactiveCells: [
          {
            id: "troubleshoot_1",
            question: "1. Preparation Error",
            bounds: { x: 50.5, y: 52.0, w: 42.5, h: 14.5 },
            answerBounds: { x: 50.5, y: 52.0, w: 42.5, h: 14.5 },
            revealMode: "blur",
            confidence: 1
          },
          {
            id: "troubleshoot_2",
            question: "2. Calibration Error",
            bounds: { x: 50.5, y: 68.0, w: 42.5, h: 12.0 },
            answerBounds: { x: 50.5, y: 68.0, w: 42.5, h: 12.0 },
            revealMode: "blur",
            confidence: 1
          },
          {
            id: "troubleshoot_3",
            question: "3. Methodology Evaluation",
            bounds: { x: 50.5, y: 81.5, w: 42.5, h: 14.0 },
            answerBounds: { x: 50.5, y: 81.5, w: 42.5, h: 14.0 },
            revealMode: "blur",
            confidence: 1
          }
        ]
      },
      {
        number: 7,
        title: "Task Execution: Temporary Wet Mounts & Biological Data Recording",
        imageFileName: "slide_07.png",
        imageUrl: "/decks/Lesson_02_Working_like_a_Human_Biologist/slides/slide_07.png",
        sourceMediaPath: "ppt/media/image7.png",
        isInteractive: false,
        interactiveType: null
      },
      {
        number: 8,
        title: "Plenary Summary & 3 Strategic Executive Takeaways: Working like a Human Biologist",
        imageFileName: "slide_08.png",
        imageUrl: "/decks/Lesson_02_Working_like_a_Human_Biologist/slides/slide_08.png",
        sourceMediaPath: "ppt/media/image8.png",
        isInteractive: false,
        interactiveType: null
      }
    ]
  };
  deck2Manifest.slides[1].cells = deck2Manifest.slides[1].interactiveCells;

  await fs.writeFile(
    path.join(deck2Dir, "manifest.json"),
    JSON.stringify(deck2Manifest, null, 2),
    "utf8"
  );
  console.log("Successfully wrote manifest for Lesson 2");

  console.log("\n=== ALL INTEGRATION STEPS COMPLETED ===");
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
