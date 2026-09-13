export const COURSE_NAME = "OCR Level 3 Cambridge Advanced National (AAQ) in Human Biology";
export const NOTEBOOK_URL = "https://notebook.google.com/notebook/2de0b311-3e7c-499a-81c8-68a43a8a8d8a";
export const INTRO_VIDEO_URL = NOTEBOOK_URL;
export const OUTPUT_DIR_NAME = "powerpoints_aaq_human_bio";
export const CHECKPOINT_FILE_NAME = "checkpoint_intro_aaq_human_bio.json";
export const END_LESSON_DEFAULT = 8;
export const DRIVE_FOLDER_NAME = "AAQ Human Biology Induction";
export const LESSON_LEVEL = "OCR Level 3 Cambridge Advanced National (AAQ) learners";
export const INCLUDE_LESSON1_COURSE_OUTLINE = true;
export const REQUIRE_CONTINUING_CASE_STUDY = true;
export const SELF_CONTAINED_LESSONS = true;
export const STARTER_GRID_MODE = "six-cell-topic";
export const BUILD_ON_PREVIOUS = true;
export const MAXIMIZE_LEARNING_GAMES = true;

export const courseParts = [
  "Week 1: Foundations, Practical Baseline & Mathematical Literacy (Lessons 1–4)",
  "Week 2: Data Interpretation, Clinical Trials & Evidence Synthesis (Lessons 5–8)"
];

export const lessons = [
  {
    number: 1,
    part: 1,
    teacher: "Dan",
    deckId: "Lesson_01_Welcome_to_Human_Biology",
    title: "Welcome to Human Biology: What do you already know?",
    focus: "Course Induction, Diagnostic Baseline & Common Misconceptions",
    deliverable: "Complete 30-mark diagnostic baseline assessment across 5 core domains and identify personal misconception patterns.",
    details: "Course Induction + knowledge baseline. Brief course/assessment overview, expectations, and 'what makes Human Biology different?' from GCSE and traditional A-Level Biology (applied clinical pathology, diagnostics, human health and disease). Closed-book diagnostic sampling 30 marks across Cells (8), Tissues & Systems (6), Reproduction (5), Microbiology (5), and Scientific Maths (6). Targets OCR misconception patterns: bacterial cell ribosomes (70S in prokaryotes vs 80S in eukaryotic cytosol), mitochondria energy transfer vs production (ATP synthesis via chemiosmosis / aerobic respiration vs 'creating energy'), DNA → ribosome → protein → ATP requirement sequence (transcription, translation, amino acid activation requiring ATP). Concludes with 5–6 diagnostic hinge questions.",
    starterQuestions: [
      { q: "What type of ribosomes do prokaryotes and eukaryotes possess?", a: "Prokaryotes possess 70S ribosomes; eukaryotes possess 80S ribosomes (and 70S within mitochondria/chloroplasts)." },
      { q: "Why is it scientifically inaccurate to say mitochondria 'produce energy'?", a: "Energy cannot be created or destroyed (First Law of Thermodynamics); mitochondria transfer chemical energy from respiratory substrates to synthesize ATP." },
      { q: "Outline the sequential steps from gene to synthesized polypeptide.", a: "Nuclear transcription (DNA → mRNA) → mRNA export → Ribosomal translation (mRNA + tRNA) → ATP-dependent peptide bond formation." },
      { q: "Identify 3 key structural differences between prokaryotic and eukaryotic cells.", a: "Prokaryotes lack a membrane-bound nucleus, lack membrane-bound organelles, have circular naked DNA/plasmids, and have peptidoglycan cell walls." },
      { q: "What is the primary physiological function of epithelial tissue?", a: "Forms continuous protective barriers, lines cavities/tubes, and facilitates selective absorption, secretion, and transcellular transport." },
      { q: "Convert 0.045 mm into micrometres (µm).", a: "0.045 mm × 1,000 = 45 µm." }
    ],
    objectives: {
      knowledge: "Recall key cellular structures and distinguish eukaryotic vs prokaryotic organelle differences.",
      application: "Diagnose OCR common misconceptions surrounding mitochondrial energy transfers and protein synthesis energetics.",
      evaluation: "Evaluate diagnostic baseline responses to benchmark individual mastery across the 5 core biological themes."
    },
    terminology: [
      { term: "70S vs 80S Ribosomes", def: "Prokaryotes contain smaller 70S ribosomes; eukaryotes contain 80S cytosolic ribosomes and 70S in mitochondria." },
      { term: "Chemiosmotic Phosphorylation", def: "Generation of ATP using energy from a proton gradient created during cellular respiration (not energy creation)." },
      { term: "Diagnostic Hinge Question", def: "A targeted question designed to reveal specific conceptual misconceptions before moving forward in instruction." },
      { term: "Applied Clinical Pathology", def: "The study of disease mechanisms, diagnostic biomarkers, and abnormal physiological deviations in humans." }
    ],
    theoryPoints: [
      "Human Biology distinctives: Focuses directly on human pathophysiological mechanisms, clinical laboratory diagnostics, and therapeutic interventions rather than general botany/zoology.",
      "OCR Misconception 1 - Ribosomes: Bacterial pathogens contain 70S ribosomes, serving as the selective target for aminoglycoside and tetracycline antibiotics without harming host 80S ribosomes.",
      "OCR Misconception 2 - Mitochondria: Mitochondria do NOT 'create energy' (violating the First Law of Thermodynamics). They transduce chemical bond energy from substrate oxidation to phosphorylate ADP + Pi into ATP.",
      "OCR Misconception 3 - Protein Synthesis Pathway: DNA replication is distinct from expression. Transcription (nucleus) produces mRNA, which is translated on ribosomes requiring ATP for tRNA charging and elongation."
    ],
    workedExample: {
      title: "Diagnostic Baseline Scoring Profile",
      subtitle: "Sampling 30 marks across the 5 core Level 3 foundation domains",
      steps: [
        { label: "Domain 1: Cells (8 Marks)", detail: "Organelle ultrastructure, membrane transport mechanisms, and prokaryotic vs eukaryotic distinctions." },
        { label: "Domain 2: Tissues & Systems (6 Marks)", detail: "Epithelial, connective, muscular, and nervous tissue histology with organ coordination." },
        { label: "Domain 3: Reproduction & Inheritance (5 Marks)", detail: "Gametogenesis, chromosomal segregation, and monohybrid vs polygenic inheritance patterns." },
        { label: "Domain 4: Microbiology & Pathogens (5 Marks)", detail: "Viral, bacterial, and fungal virulence mechanisms, sterile laboratory technique, and antimicrobial action." },
        { label: "Domain 5: Scientific Maths (6 Marks)", detail: "Magnification calculations (M = I/A), unit conversions (mm to nm), standard form, and ratios." }
      ]
    },
    hingeQuestions: [
      {
        question: "Which cellular feature is found in BOTH human cardiac myocytes and pathogenic bacterial cells?",
        options: ["80S cytosolic ribosomes", "Peptidoglycan cell wall", "Ribosomes synthesizing polypeptides", "Membrane-bound mitochondria"],
        correctIndex: 2,
        explanation: "Both cell types contain ribosomes (70S in bacteria, 80S/70S in humans) to translate mRNA into polypeptides. Bacteria lack mitochondria and 80S ribosomes; myocytes lack peptidoglycan."
      },
      {
        question: "During aerobic cellular respiration, which statement precisely describes the role of mitochondria?",
        options: ["They generate fresh energy from glucose molecules", "They transfer energy from substrate bonds to phosphorylate ADP to ATP", "They store electricity inside the mitochondrial matrix", "They convert heat energy directly into glucose"],
        correctIndex: 1,
        explanation: "Energy is conserved; mitochondria oxidize metabolic intermediates to establish a proton gradient that drives ATP synthase to phosphorylate ADP + Pi into ATP."
      },
      {
        question: "Where is ATP directly consumed during the expression and synthesis of a polypeptide?",
        options: ["Only during DNA unwinding in the nucleus", "Only during peptide bond cleavage in lysosomes", "During amino acid activation (tRNA charging) and peptide bond formation on ribosomes", "No ATP is required during translation"],
        correctIndex: 2,
        explanation: "Aminoacyl-tRNA synthetases require ATP to attach amino acids to their cognate tRNAs, and elongation factors consume GTP/ATP during translocation and peptide bond synthesis."
      }
    ],
    examQuestion: {
      question: "A student states: 'Mitochondria are the powerhouses that create energy for the cell to build proteins from DNA.' Evaluate this statement, identifying three scientific inaccuracies according to OCR Level 3 criteria. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Inaccuracy 1: 'Create energy' violates the law of conservation of energy. Mitochondria transfer chemical potential energy from respiratory substrates to phosphorylate ADP to ATP.",
        "Inaccuracy 2: DNA is not directly converted into proteins; it is transcribed into pre-mRNA/mRNA first, which is then translated by ribosomes.",
        "Inaccuracy 3: Translation and amino acid activation consume ATP, meaning energy is required for synthesis rather than passively created during the process."
      ]
    },
    plenary: [
      "Human Biology demands precise clinical terminology: avoid colloquialisms like 'creates energy' or 'cell brain'.",
      "Benchmark your diagnostic score across the 5 domains to identify priority areas for Year 12 consolidation.",
      "Next Lesson: Working like a Human Biologist — laboratory wet mounts, staining protocols, and biological drawing standards."
    ]
  },
  {
    number: 2,
    part: 1,
    teacher: "Dan",
    deckId: "Lesson_02_Working_like_a_Human_Biologist",
    hasPractical: true,
    title: "Working like a Human Biologist",
    focus: "Microscopy Baseline, Slide Preparation & Biological Drawing",
    deliverable: "Prepare calibrated wet mounts of cheek and onion cells, execute textbook-standard biological drawings, and calculate optical magnification.",
    details: "Practical baseline diagnostic. Microscope set-up, preparing/examining temporary wet mounts (cheek & onion cells), focusing safely, scientific biological drawing with annotations, calculating magnification from measurements, identifying sources of error, and evaluating experimental methodology.",
    starterQuestions: [
      { q: "Why must microscope wet mounts be prepared as single-cell-thick layers?", a: "To allow light to transmit through the specimen without scattering, ensuring clear focal resolution of intracellular structures." },
      { q: "Why is methylene blue stain used for cheek epithelial cells?", a: "It binds selectively to negatively charged acidic polyanions (DNA/RNA in nuclei), creating high chromatic contrast." },
      { q: "What is the formula relating Image size (I), Actual size (A), and Magnification (M)?", a: "Magnification (M) = Image size (I) ÷ Actual size (A) [I = A × M]." },
      { q: "State two mandatory conventions for scientific biological drawings.", a: "Single unbroken lines (no sketchiness/cross-hatching), proportional representations, and horizontal ruler-drawn label lines with no arrowheads." },
      { q: "Why should a slide coverslip be lowered at a 45-degree angle?", a: "To displace air and prevent trapped refractive air bubbles from obscuring cellular morphology." },
      { q: "How do you calculate total magnification of a compound light microscope?", a: "Total Magnification = Eyepiece lens magnification (typically 10×) × Objective lens magnification (e.g. 4×, 10×, 40×)." }
    ],
    objectives: {
      knowledge: "Master optical microscope set-up, safe illumination, and systematic low-to-high magnification focusing.",
      application: "Prepare temporary wet mounts of squamous cheek epithelium and Allium cepa epidermal tissue with differential stains.",
      evaluation: "Execute standardized biological drawings with scale bars and evaluate sources of systematic vs random experimental error."
    },
    terminology: [
      { term: "Wet Mount Preparation", def: "Suspending a thin specimen in liquid (water or stain) beneath a coverslip for live optical examination." },
      { term: "Methylene Blue / Iodine", def: "Differential stains: methylene blue highlights acidic nuclear chromatin; iodine stains starch granules and cell walls." },
      { term: "Eyepiece Graticule", def: "A transparent micrometric ruler fitted in the microscope ocular lens that must be calibrated against a stage micrometer." },
      { term: "Parallax & Systematic Error", def: "Systematic calibration offsets or reading angle biases that shift all experimental measurements consistently." }
    ],
    theoryPoints: [
      "Slide Prep Protocols: Use a sterile cotton swab to scrape buccal mucosa gently. Smear onto glass slide, add 1 drop 1% methylene blue, lower coverslip with a mounted needle at 45° to exclude air bubbles.",
      "Infection Control & Biohazards: Used swabs and cheek slides must immediately be immersed in a 10% disinfectant bleach discard jar (CLEAPSS GL113).",
      "Biological Drawing Rules: Draw with a sharp HB pencil; no shading or artistic stippling; draw what is genuinely observed; include magnification factor and estimated scale bar.",
      "Error Analysis: Distinguish between random human focusing error and systematic eyepiece graticule miscalibration."
    ],
    workedExample: {
      title: "Magnification Calculation from Micrograph",
      subtitle: "Applying M = I / A with unit conversion",
      steps: [
        { label: "Step 1: Measure Image Size (I)", detail: "Using a ruler, measure the diameter of the cheek cell nucleus on the printed drawing: I = 24 mm." },
        { label: "Step 2: Convert to Same Units (µm)", detail: "Convert image size from mm to µm: 24 mm × 1,000 = 24,000 µm." },
        { label: "Step 3: Identify Actual Size (A)", detail: "From stage micrometer calibration, the true nucleus diameter is known to be A = 6.0 µm." },
        { label: "Step 4: Calculate Magnification (M)", detail: "M = I / A = 24,000 µm ÷ 6.0 µm = 4,000× magnification." },
        { label: "Step 5: Sanity Check", detail: "Ensure magnification has no units and is prefixed with '×'." }
      ]
    },
    hingeQuestions: [
      {
        question: "A student observes a cheek epithelial cell with an eyepiece graticule. The cell measures 30 mm under a 400× total magnification. What is the actual diameter in µm?",
        options: ["75 µm", "13.3 µm", "0.75 µm", "120 µm"],
        correctIndex: 0,
        explanation: "A = I / M = 30 mm / 400 = 0.075 mm = 75 µm."
      },
      {
        question: "Which of the following is considered a systematic error in optical microscopy?",
        options: ["Human error estimating half a graticule division under focus", "An eyepiece reticle miscalibrated by 5% across all magnifications", "Parallax error when glancing at the stage vernier scale", "Slight dust settlement on an individual coverslip"],
        correctIndex: 1,
        explanation: "A miscalibrated reticle affects every single measurement identically in one direction, representing a classical systematic calibration error."
      }
    ],
    examQuestion: {
      question: "Describe the method a student should use to prepare a stained temporary wet mount of onion epidermal tissue and view it under high power. Include relevant health and safety precautions. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Peel single-layer epidermis using fine forceps and place flat on glass slide without folding.",
        "Add 1–2 drops of iodine in potassium iodide stain to visualize cell walls and nuclei.",
        "Lower coverslip gently at 45° using a mounted needle to prevent air bubble formation.",
        "Place on stage, align low-power objective (4×/10×) first, use coarse focus, then switch to high power (40×) using fine focus only.",
        "Safety: Handle scalpel/forceps with care; wear eye protection to avoid iodine contact with cornea."
      ]
    },
    plenary: [
      "Microscope proficiency is a core assessed skill for Unit F173 Practical Endorsement (PAG B1).",
      "Always convert units (mm → µm → nm) before dividing in magnification formulas.",
      "Next Lesson: Thinking like a Human Biologist — interpolation, extrapolation, and cardiovascular physiology PAG."
    ]
  },
  {
    number: 3,
    part: 1,
    teacher: "Matt",
    deckId: "Lesson_03_Thinking_like_a_Human_Biologist_Heart_Rate_Practical",
    hasPractical: true,
    title: "Thinking like a Human Biologist: Interpolation and Extrapolation",
    focus: "Mathematical Literacy, Graph Analysis & Cardiovascular Physiology PAG",
    deliverable: "Collect resting vs post-exercise heart rate data, plot calibrated trend curves, and perform valid interpolation vs extrapolation.",
    details: "Scientific maths, data and exam literacy diagnostic with live physiological data collection. Part A (15 marks Mathematics): Unit conversion (mm → µm → nm), magnification (image size ÷ actual size), standard form, percentage change, cell dimension ratios, graph interpretation/trend analysis including interpolation and extrapolation. Part B (Heart rate PAG): Students measure resting and post-exercise heart rate, plot data, and draw interpolated/extrapolated trend lines to practise key mathematical skills in a biological context.",
    starterQuestions: [
      { q: "Convert 350 nm into micrometres (µm) in standard form.", a: "350 nm ÷ 1,000 = 0.35 µm = 3.5 × 10⁻¹ µm (or 3.5 × 10⁻⁷ m)." },
      { q: "Calculate percentage change if resting heart rate is 65 bpm and peak post-exercise is 143 bpm.", a: "[(143 - 65) / 65] × 100% = (78 / 65) × 100% = +120%." },
      { q: "What is the mathematical distinction between interpolation and extrapolation?", a: "Interpolation estimates values within the range of collected data points; extrapolation predicts values beyond the measured experimental boundaries." },
      { q: "Why is extrapolation risky when modelling human physiological recovery curves?", a: "Physiological responses are governed by non-linear homeostatic feedback, enzymatic saturation, and recovery limits, so trends rarely stay linear." },
      { q: "What happens to the Surface Area-to-Volume (SA:V) ratio as cell radius increases?", a: "The SA:V ratio decreases because volume scales with radius cubed (r³) while surface area scales with radius squared (r²)." },
      { q: "State the standard metric unit for cardiac frequency.", a: "Beats per minute (bpm) or Hertz (Hz = beats per second)." }
    ],
    objectives: {
      knowledge: "Master core biological mathematical calculations: standard form, unit conversions across 3 orders of magnitude, and SA:V ratios.",
      application: "Collect live cardiovascular data (resting vs post-exercise heart rate) and construct scientifically rigorous line graphs.",
      evaluation: "Evaluate the validity of interpolated vs extrapolated clinical predictions, highlighting physiological limits to linear models."
    },
    terminology: [
      { term: "Metric Hierarchy", def: "1 mm = 1,000 µm = 1,000,000 nm. Scale factors are powers of 10³." },
      { term: "Interpolation", def: "Estimating unmeasured intermediate values located strictly within the experimental range of known data points." },
      { term: "Extrapolation", def: "Projecting trends beyond the observed data range, carrying high risk of error due to unverified biological assumptions." },
      { term: "Cardiac Recovery Rate", def: "The velocity at which heart rate decelerates back to baseline following exercise cessation, indicating vagal tone." }
    ],
    theoryPoints: [
      "Metric Scaling: Subcellular organelles (mitochondria ~1 µm, ribosomes ~20 nm, cell membranes ~7 nm) require fluent conversion between mm, µm, and nm.",
      "Cardiovascular Response: Dynamic exercise increases skeletal muscle metabolic demand (O₂ consumption and CO₂ production), triggering sympathetic cardioaccelerator stimulation to increase stroke volume and heart rate.",
      "Non-Linear Recovery Kinetics: Post-exercise heart rate recovery follows a biphasic exponential decay curve (rapid parasympathetic reactivation followed by slower metabolite clearance), NOT a straight linear decline.",
      "Extrapolation Hazards: Extrapolating heart rate recovery past measured timepoints falsely suggests heart rate will drop to zero or plateau below resting baseline."
    ],
    workedExample: {
      title: "Heart Rate Recovery Curve Analysis",
      subtitle: "Distinguishing valid interpolation from hazardous extrapolation",
      steps: [
        { label: "Empirical Dataset", detail: "0 min (Peak): 150 bpm; 1 min: 125 bpm; 2 min: 105 bpm; 3 min: 90 bpm; 4 min: 80 bpm; 5 min: 75 bpm." },
        { label: "Interpolation Example", detail: "Estimate heart rate at 2.5 min: Read directly from smooth curve between 105 and 90 bpm → approx. 97 bpm (Valid interpolation)." },
        { label: "Percentage Recovery Calculation", detail: "[(150 - 75) / 150] × 100% = 50% recovery achieved over 5 minutes." },
        { label: "Linear Extrapolation Fallacy", detail: "Assuming a constant 15 bpm drop per minute projects heart rate at 10 min to be 0 bpm (Physiologically impossible)." },
        { label: "Conclusion", detail: "Homeostatic set-points (resting rate ~70 bpm) enforce an asymptote that linear extrapolation completely misses." }
      ]
    },
    hingeQuestions: [
      {
        question: "A student measures heart rate at 0, 2, 4, 6, and 8 minutes post-exercise. Estimating heart rate at 3.5 minutes is an example of:",
        options: ["Extrapolation with high uncertainty", "Interpolation within empirical boundaries", "Systematic regression bias", "Qualitative extrapolation"],
        correctIndex: 1,
        explanation: "Estimating at 3.5 minutes falls directly between the observed data points (2 and 4 minutes), which is interpolation."
      },
      {
        question: "Which physiological mechanism explains why heart rate does NOT extrapolate linearly with indefinite workload increase?",
        options: ["Blood viscosity drops to zero", "Maximal physiological cardiac output is constrained by maximum intrinsic SA node firing rate and ventricular filling time", "Sympathetic neurotransmitter stores increase exponentially", "Oxygen diffusion across alveoli stops"],
        correctIndex: 1,
        explanation: "The heart reaches a physiological ceiling (HR_max ≈ 220 - age); further increases in rate compromise diastolic filling time and stroke volume."
      }
    ],
    examQuestion: {
      question: "A cardiac patient's heart rate was monitored during recovery. At 2 min it was 110 bpm; at 4 min it was 86 bpm. (a) Calculate the rate of heart rate decrease per minute between 2 and 4 min. (b) Explain why extrapolating this rate to 10 minutes post-exercise is invalid. [4 marks]",
      marks: "4 marks",
      guidance: [
        "(a) Decrease = 110 - 86 = 24 bpm over 2 min → Rate = 12 bpm per minute. [1 mark]",
        "(b) Linear extrapolation is invalid because recovery is non-linear/exponential. [1 mark]",
        "Heart rate approaches a resting baseline homeostatic set-point and cannot drop indefinitely. [1 mark]",
        "Continuing 12 bpm/min would predict 14 bpm at 10 minutes, which is incompatible with life. [1 mark]"
      ]
    },
    plenary: [
      "Always check axes, scale intervals, and plot points with precise small crosses (×) when graphing PAG data.",
      "Interpolation is scientifically justifiable within continuous datasets; extrapolation requires strong mechanistic proof.",
      "Next Lesson: Working like a Scientist: Continued — sourcing academic literature and Harvard referencing masterclass."
    ]
  },
  {
    number: 4,
    part: 1,
    teacher: "Matt",
    deckId: "Lesson_04_Working_like_a_Scientist_Continued",
    title: "Working like a Scientist: Continued",
    focus: "Academic Literature Sourcing, Peer Review & Harvard Referencing",
    deliverable: "Conduct PubMed/Europe PMC Boolean literature queries, assess source credibility, and construct standard Harvard reference citations.",
    details: "Academic literature sourcing & Harvard referencing masterclass. Evaluating the credibility of scientific information; distinguishing peer-reviewed medical journals from commercial/secondary sources; assessing author authority, currency, sample sizes, and potential conflict of interest/bias; academic database search strategies (PubMed, Europe PMC, Google Scholar); constructing standard in-text citations and complete Harvard reference lists for journal papers, books, clinical trial registries, and NHS/NICE clinical guidelines.",
    starterQuestions: [
      { q: "What is the purpose of blind peer review in medical journal publishing?", a: "Subjecting research methodology, statistics, and conclusions to independent scrutiny by field experts to detect flaws, bias, or fraud before publication." },
      { q: "What distinguishes a primary research journal article from a secondary review paper?", a: "Primary articles present original empirical trial data; secondary reviews synthesize, critique, and meta-analyse previously published studies." },
      { q: "How do you cite a journal paper with three authors in Harvard format in-text?", a: "(FirstAuthor et al., Year) — e.g. (Patel et al., 2024)." },
      { q: "Name two academic databases specialized for biomedical literature.", a: "PubMed (NCBI/NLM) and Europe PMC (EMBL-EBI)." },
      { q: "What Boolean operator would you use to find articles discussing both Diabetes AND Renal Failure?", a: "The 'AND' operator narrows search results to records containing both medical concepts." },
      { q: "Why are NICE guidelines considered tier-1 clinical evidence in the UK?", a: "They are rigorously developed by multidisciplinary panels evaluating systematic reviews and randomized controlled trial evidence base." }
    ],
    objectives: {
      knowledge: "Understand the hierarchy of scientific evidence: from commercial blogs and secondary reviews up to meta-analyses and RCTs.",
      application: "Formulate advanced Boolean search syntax across PubMed and Europe PMC to source peer-reviewed medical literature.",
      evaluation: "Critically evaluate journal papers for funding bias, sample size adequacy, and construct compliant Harvard in-text citations and bibliographies."
    },
    terminology: [
      { term: "Peer Review", def: "Evaluation of scientific work by independent academic experts in the same discipline before publication." },
      { term: "Boolean Operators", def: "Logic terms (AND, OR, NOT) used in bibliographic search strings to combine or filter biomedical search concepts." },
      { term: "Harvard Referencing", def: "An author-date documentation system comprising brief in-text parenthetical citations and an alphabetized end-reference list." },
      { term: "Conflict of Interest (COI)", def: "Financial or personal affiliations (e.g. pharmaceutical sponsorship) that could compromise academic impartiality." }
    ],
    theoryPoints: [
      "Evidence Pyramid: Unfiltered web opinions < Case reports < Retrospective cohort studies < Randomized Controlled Trials (RCTs) < Systematic Reviews & Meta-Analyses.",
      "Database Search Strategies: Use Medical Subject Headings (MeSH), quotation marks for exact terms (e.g. \"type 2 diabetes mellitus\"), and Boolean filters.",
      "In-Text Harvard Rules: 1 author: (Smith, 2023); 2 authors: (Smith and Jones, 2023); 3+ authors: (Smith et al., 2023).",
      "Full Reference List Format: Author, Initials. (Year) 'Title of article', Journal Name, Volume(Issue), pp. page range. doi: link."
    ],
    workedExample: {
      title: "Constructing Full Harvard Citations",
      subtitle: "Converting raw publication metadata into standard academic format",
      steps: [
        { label: "Journal Paper Metadata", detail: "Authors: Sarah J. Jenkins, David R. Lee, Mary A. Evans. Published 2024. Title: Continuous glucose monitoring in intensive care. Journal: British Medical Journal, Vol 384, pages 112-120." },
        { label: "In-Text Citation", detail: "According to recent findings (Jenkins et al., 2024)... OR Jenkins et al. (2024) demonstrated that..." },
        { label: "Bibliography Reference", detail: "Jenkins, S.J., Lee, D.R. and Evans, M.A. (2024) 'Continuous glucose monitoring in intensive care', British Medical Journal, 384, pp. 112–120." },
        { label: "NHS/NICE Clinical Guideline", detail: "NICE (2023) Type 2 diabetes in adults: management (NG28). London: National Institute for Health and Care Excellence." },
        { label: "Checklist", detail: "Check author initials, year in parentheses, journal in italics, issue/page numbers, and alphabetical sorting." }
      ]
    },
    hingeQuestions: [
      {
        question: "Which of the following citations correctly follows the Harvard referencing system for an in-text citation with two authors?",
        options: ["(Davies & Green 2023: p. 12)", "(Davies and Green, 2023)", "[1] Davies, Green (2023)", "Davies et al. (2023)"],
        correctIndex: 1,
        explanation: "Two authors are joined with 'and' in Harvard format: (Davies and Green, 2023). 'et al.' is reserved for three or more authors."
      },
      {
        question: "A clinical trial funded entirely by a novel pharmaceutical company reports 99% efficacy with zero adverse events in a sample of 12 patients. What is the primary academic critique?",
        options: ["Lack of peer-reviewed journal color figures", "High risk of conflict of interest, inadequate power from tiny sample size (n=12), and selective outcome reporting", "The study cited articles older than 5 years", "Harvard referencing was omitted from the abstract"],
        correctIndex: 1,
        explanation: "Small sample sizes produce low statistical power and wide confidence intervals, combined with potential commercial sponsor bias."
      }
    ],
    examQuestion: {
      question: "Explain the importance of peer review in maintaining the integrity of published medical research, and describe two limitations of the peer-review process. [4 marks]",
      marks: "4 marks",
      guidance: [
        "Importance: Independent experts verify experimental rigor, statistical validity, and ensure conclusions are backed by data. [1 mark]",
        "Importance: Protects clinical practice from dangerous falsified therapies or flawed methodology. [1 mark]",
        "Limitation 1: Reviewers may harbor confirmation bias towards conventional dogmas or rival research groups. [1 mark]",
        "Limitation 2: Time-consuming process causing delays; does not always uncover sophisticated raw data manipulation or fraud. [1 mark]"
      ]
    },
    plenary: [
      "Rigorous academic referencing is mandatory in all OCR Level 3 AAQ coursework and extended investigations.",
      "Always scrutinize the funding disclosures and sample sizes of clinical papers before citing their conclusions.",
      "Next Lesson: Communicating like a Human Biologist — interpreting clinical trial data, error bars, and risk metrics."
    ]
  },
  {
    number: 5,
    part: 2,
    teacher: "Dan",
    deckId: "Lesson_05_Communicating_like_a_Human_Biologist_Interpreting_Data_Clinical_Trials",
    title: "Communicating like a Human Biologist: Interpreting Data Clinical Trials",
    focus: "Statistical Literacy, RCT Outcomes, Error Bars & Risk Metrics",
    deliverable: "Analyze clinical trial graphical datasets, evaluate statistical significance from error bars and confidence intervals, and calculate ARR vs RRR.",
    details: "Data interpretation, graphical analysis, and statistical literacy diagnostic using clinical trial datasets. Processing randomised controlled trial (RCT) outcomes and physiological datasets; interpreting error bars, standard deviation, and confidence intervals; evaluating relative risk reduction vs absolute risk reduction; identifying mathematical relationships (linear, exponential, saturation); evaluating validity, sources of systematic vs random error, and drawing evidence-based conclusions from biological data.",
    starterQuestions: [
      { q: "What does it mean when error bars representing 95% Confidence Intervals overlap between two trial arms?", a: "There is generally no statistically significant difference between the two treatments at the p < 0.05 threshold." },
      { q: "What is the formula for Absolute Risk Reduction (ARR)?", a: "ARR = Control Event Rate (CER) - Experimental Event Rate (EER)." },
      { q: "How is Relative Risk Reduction (RRR) calculated from ARR and CER?", a: "RRR = (ARR ÷ CER) × 100% or [(CER - EER) ÷ CER] × 100%." },
      { q: "What is the difference between Standard Deviation (SD) and Standard Error of the Mean (SEM)?", a: "SD quantifies biological dispersion/spread among individuals; SEM estimates the precision of the sample mean relative to the population mean." },
      { q: "Why is a double-blind protocol essential in phase III drug trials?", a: "To eliminate both participant placebo effect and investigator observation/allocation bias during outcome assessment." },
      { q: "Describe a biological relationship demonstrating 'saturation kinetics'.", a: "Enzyme-catalyzed reaction rates plateauing at V_max as all active sites become occupied by substrate (Michaelis-Menten kinetics)." }
    ],
    objectives: {
      knowledge: "Differentiate statistical significance metrics: SD vs SEM vs 95% CI, p-values, and statistical power.",
      application: "Calculate Absolute Risk Reduction (ARR), Relative Risk Reduction (RRR), and Number Needed to Treat (NNT) from RCT clinical datasets.",
      evaluation: "Critique graphical trends for saturation plateaus, linear proportionality, and distinguish random biological variation from clinical effect."
    },
    terminology: [
      { term: "Randomised Controlled Trial (RCT)", def: "Gold-standard experimental trial where participants are randomly assigned to experimental or control cohorts." },
      { term: "95% Confidence Interval (CI)", def: "A range of values around a sample statistic that has a 95% probability of containing the true population parameter." },
      { term: "Absolute Risk Reduction (ARR)", def: "The simple arithmetic difference in event rates between control and experimental treatment groups (ARR = CER - EER)." },
      { term: "Relative Risk Reduction (RRR)", def: "The proportional reduction in adverse event rates in treated vs untreated patients [RRR = (ARR / CER) × 100%]." }
    ],
    theoryPoints: [
      "Overlapping Error Bars: When 95% CIs overlap substantially, the difference between group means is not statistically significant (p > 0.05). If CIs do not overlap, p < 0.05.",
      "The ARR vs RRR Clinical Paradox: If baseline cardiac risk drops from 2% to 1%, ARR is only 1%, but RRR is a sensationalized 50%. Always report ARR alongside RRR.",
      "Number Needed to Treat (NNT): NNT = 1 / ARR. If ARR = 0.02 (2%), NNT = 50 (50 patients must be treated to prevent one single adverse event).",
      "Curve Types in Physiology: Linear (direct proportionality), Exponential (bacterial population growth), Saturation/Sigmoidal (enzyme kinetics, haemoglobin oxygen dissociation)."
    ],
    workedExample: {
      title: "Cardiovascular Drug Trial Analysis (Statin vs Placebo)",
      subtitle: "Extracting ARR, RRR, and evaluating clinical significance",
      steps: [
        { label: "Trial Parameters (n=5,000 per arm)", detail: "Control (Placebo): 200 myocardial infarctions out of 5,000 → CER = 200 / 5,000 = 0.04 (4.0%)." },
        { label: "Experimental (Statin)", detail: "Experimental: 100 myocardial infarctions out of 5,000 → EER = 100 / 5,000 = 0.02 (2.0%)." },
        { label: "Calculate ARR", detail: "ARR = CER - EER = 0.04 - 0.02 = 0.02 = 2.0% absolute benefit." },
        { label: "Calculate RRR", detail: "RRR = (ARR / CER) × 100% = (0.02 / 0.04) × 100% = 50% relative risk reduction." },
        { label: "Calculate NNT", detail: "NNT = 1 / ARR = 1 / 0.02 = 50 patients treated over 5 years to prevent 1 myocardial infarction." }
      ]
    },
    hingeQuestions: [
      {
        question: "In a stroke trial, cardiovascular event rates were 4% in the control group and 2% in the drug group. What are the ARR and RRR?",
        options: ["ARR = 2%, RRR = 50%", "ARR = 50%, RRR = 2%", "ARR = 0.5%, RRR = 25%", "ARR = 2%, RRR = 2%"],
        correctIndex: 0,
        explanation: "ARR = 4% - 2% = 2%. RRR = (2% / 4%) * 100 = 50%. Commercial sources often quote the 50% RRR to exaggerate perceived benefit over the 2% ARR."
      },
      {
        question: "If the 95% Confidence Interval for an odds ratio (OR) includes 1.0 (e.g., OR = 1.35, 95% CI: 0.88–1.92), what is the valid conclusion?",
        options: ["The experimental treatment is significantly better", "The result is not statistically significant because the null effect (OR = 1.0) cannot be rejected", "The sample size was too large", "The treatment caused a doubling of risk"],
        correctIndex: 1,
        explanation: "An odds ratio of 1.0 indicates identical odds between groups; if the 95% CI spans 1.0, the effect is not significant at p < 0.05."
      }
    ],
    examQuestion: {
      question: "The graph shows plasma antibody titres in vaccinated vs control cohorts. Cohort A mean = 450 units (95% CI: 420–480); Cohort B mean = 510 units (95% CI: 475–545). Evaluate whether Cohort B has a significantly higher antibody titre than Cohort A. [3 marks]",
      marks: "3 marks",
      guidance: [
        "State that the 95% Confidence Intervals overlap (between 475 and 480 units). [1 mark]",
        "Conclude that the difference between the cohorts is NOT statistically significant at p < 0.05. [1 mark]",
        "Explain that the observed difference between means may simply be due to random biological sampling variation. [1 mark]"
      ]
    },
    plenary: [
      "Never report Relative Risk Reduction (RRR) in isolation; always pair it with Absolute Risk Reduction (ARR) and sample size.",
      "Check error bar overlaps before claiming a biological intervention has a genuine clinical effect.",
      "Next Lesson: Communicating like a Human Biologist — academic writing masterclass and evidence synthesis on unfamiliar stimuli."
    ]
  },
  {
    number: 6,
    part: 2,
    teacher: "Dan",
    deckId: "Lesson_06_Communicating_like_a_Human_Biologist_Academic_Writing_and_Application",
    title: "Communicating like a Human Biologist: Academic Writing & Application",
    focus: "Evidence Synthesis, Structured Explanations & Clinical Coursework Baseline",
    deliverable: "Synthesize unfamiliar clinical trial stimulus evidence into a tripartite biological explanation (Fact → Mechanism → Clinical Impact) with Harvard citations.",
    details: "Academic literature sourcing & Harvard referencing masterclass. Evaluating the credibility of scientific information; distinguishing peer-reviewed medical journals from commercial/secondary sources; assessing author authority, currency, sample sizes, and potential conflict of interest/bias; academic database search strategies (PubMed, Europe PMC, Google Scholar); constructing standard in-text citations and complete Harvard reference lists for journal papers, books, clinical trial registries, and NHS/NICE clinical guidelines. Academic writing + evidence synthesis initial assessment. Controlled written task centered on an unfamiliar Human Biology stimulus (e.g. artificial organs clinical trial outcome data). Students extract and synthesize evidence, formulate structured biological explanations (fact → mechanism → clinical impact), correctly apply Harvard in-text citations, and complete evaluative conclusions to set a baseline for NEA and extended coursework.",
    starterQuestions: [
      { q: "Explain the three tiers of the 'Fact → Mechanism → Clinical Impact' writing framework.", a: "Fact: State the empirical finding/data; Mechanism: Explain the underlying cellular/physiological pathway; Clinical Impact: Explain the therapeutic outcome or prognostic consequence for patients." },
      { q: "Why are personal pronouns (I, we, our) avoided in scientific academic writing?", a: "Passive and objective third-person syntax maintains scientific neutrality and focuses emphasis on the evidence rather than the investigator." },
      { q: "What is an 'unfamiliar stimulus' in Level 3 AAQ assessments?", a: "Novel clinical data, experimental scenarios, or cutting-edge therapeutic trials not explicitly memorized from the specification, testing applied analytical skills." },
      { q: "How should limitations of a clinical study be constructively framed?", a: "Identify the specific constraint (e.g. short follow-up duration), explain how it limits clinical generalisability, and propose targeted methodological refinement." },
      { q: "What constitutes plagiarism in NEA coursework?", a: "Presenting another's ideas, text, figures, or synthesized arguments without explicit in-text citation and corresponding bibliography entry." },
      { q: "What is the clinical role of bio-artificial organs in end-stage disease?", a: "Providing vital organ functions (e.g., hemodialysis, metabolic processing, cardiac assist) as a bridge to transplantation or permanent destination therapy." }
    ],
    objectives: {
      knowledge: "Master the clinical tripartite explanation model: Biological Fact → Physiological Mechanism → Clinical Impact.",
      application: "Extract and synthesize quantitative evidence from unfamiliar clinical trial stimuli (bio-artificial organ trial data).",
      evaluation: "Draft an evaluative coursework baseline report integrating standard in-text Harvard citations and rigorous methodological critique."
    },
    terminology: [
      { term: "Tripartite Model", def: "A scientific writing structure linking empirical quantitative evidence to cellular mechanisms and clinical patient outcomes." },
      { term: "Bio-artificial Kidney / Organ", def: "A hybrid device combining synthetic filtration membranes with living renal tubule epithelial cells to replace organ function." },
      { term: "Clinical Translation", def: "The iterative process of transitioning laboratory bench discoveries into safe, effective clinical therapies." },
      { term: "Biomarker Endpoint", def: "A measurable biological indicator (e.g., serum creatinine, ejection fraction) used to evaluate therapeutic response." }
    ],
    theoryPoints: [
      "The Tripartite Structure: Fact = What the data objectively proves; Mechanism = Biochemical or physiological reason WHY; Clinical Impact = Consequence for patient morbidity, mortality, or healthcare pathways.",
      "Academic Precision: Avoid emotive adjectives ('miracle cure', 'terrible failure'); use measured clinical terminology ('statistically significant reduction in all-cause mortality').",
      "Unfamiliar Stimulus Handling: Deconstruct complex medical diagrams by identifying the independent variable, dependent variable, controls, and error bar boundaries first.",
      "Formulating Evaluative Conclusions: Balance therapeutic benefits against adverse reactions, economic costs (NICE QALY thresholds), and technical translation hurdles."
    ],
    workedExample: {
      title: "Model Paragraph: Bio-Artificial Kidney Stimulus",
      subtitle: "Applying Fact → Mechanism → Clinical Impact with Harvard Citation",
      steps: [
        { label: "Empirical Fact (Data)", detail: "In a Phase II multi-centre trial, patients implanted with the bio-artificial renal device exhibited a 42% reduction in serum urea concentrations compared to standard hemodialysis controls (p = 0.003) over 12 weeks (Williams et al., 2023)." },
        { label: "Physiological Mechanism", detail: "This clearance is facilitated by the incorporated proximal tubule epithelial cells, which perform active transcellular reabsorption and secretory transport via basolateral Na+/K+ ATPase pumps, mimicking native nephron tubuloglomerular feedback." },
        { label: "Clinical Impact", detail: "Consequently, patient incidence of uremic encephalopathy and systemic fluid overload was reduced, decreasing rehospitalization rates by 28% and demonstrating therapeutic efficacy as a destination bridge therapy." },
        { label: "Methodological Critique", detail: "However, trial generalisability is restricted by a small cohort (n=45) and short 12-week observation window, warranting Phase III longitudinal survival monitoring." }
      ]
    },
    hingeQuestions: [
      {
        question: "Which sentence best exemplifies the 'Fact → Mechanism → Clinical Impact' framework?",
        options: [
          "The drug works really well for patients and lowers blood pressure nicely.",
          "Patients receiving Drug X showed a 14 mmHg systolic drop (p<0.01) because competitive ACE inhibition reduces angiotensin II vasoconstriction, significantly reducing stroke incidence.",
          "Angiotensin is bad for vessels and causes hypertension so doctors prescribe tablets.",
          "Clinical trials prove that cardiovascular medicine is effective when prescribed regularly."
        ],
        correctIndex: 1,
        explanation: "Option B provides the quantitative Fact (14 mmHg drop, p<0.01), physiological Mechanism (competitive ACE inhibition prevents vasoconstriction), and Clinical Impact (reduced stroke incidence)."
      }
    ],
    examQuestion: {
      question: "Using the stimulus data provided for the novel artificial cardiac assist device: (a) Synthesize the evidence to write a structured paragraph explaining its impact on left ventricular workload. (b) Identify two clinical limitations of the study design. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Include quantitative Fact with correct units from stimulus data. [1 mark]",
        "Explain physiological Mechanism (e.g. reduced afterload, decreased myocardial wall stress, lower myocardial oxygen demand). [2 marks]",
        "Describe Clinical Impact on patient exercise tolerance or heart failure staging. [1 mark]",
        "Critique Limitation 1: e.g. lack of blinding or small sample size reducing statistical power. [1 mark]",
        "Critique Limitation 2: e.g. short follow-up duration failing to capture late device thrombosis or infection risks. [1 mark]"
      ]
    },
    plenary: [
      "The 'Fact → Mechanism → Clinical Impact' formula is your primary engine for scoring top-band marks in OCR Level 3 extended answers.",
      "Every evaluative claim must be anchored to empirical evidence, statistical significance, and Harvard citations.",
      "Next Lesson: Introductory Unit Synthesis — triangulating diagnostic evidence and personal target setting."
    ]
  },
  {
    number: 7,
    part: 2,
    teacher: "Matt",
    deckId: "Lesson_07_Introductory_Unit_Synthesis_Diagnostic_Profile_and_Target_Setting",
    title: "Introductory Unit Synthesis: Diagnostic Profile & Target Setting",
    focus: "Diagnostic Triangulation, Competency Profiling & SMART Target Setting",
    deliverable: "Triangulate baseline diagnostic performance across recall, maths, microscopy, and writing to produce an individual RAG competence profile and NEA priorities.",
    details: "Triangulation of baseline diagnostic evidence across knowledge recall, scientific maths, microscope practical competence, and academic writing/data interpretation to set individual learner targets and NEA skill priorities.",
    starterQuestions: [
      { q: "What does 'triangulation' mean in educational diagnostics?", a: "Cross-referencing multiple independent performance indicators (written recall, live practical skills, mathematical calculations, extended analysis) to construct an accurate competency profile." },
      { q: "What are the four core competencies evaluated in this induction diagnostic?", a: "1. Core biological knowledge recall; 2. Quantitative scientific maths; 3. Laboratory microscopy competence; 4. Academic writing and data evaluation." },
      { q: "What defines a SMART learning target in Level 3 vocational science?", a: "Specific, Measurable, Achievable, Relevant, and Time-bound (e.g. Master unit conversion and standard form calculation within 2 weeks)." },
      { q: "Why is self-evaluation of experimental error critical before starting Unit F173 NEA?", a: "NEA criteria mandate independent identification of confounding variables, measurement uncertainties, and procedural limitations." },
      { q: "How does a diagnostic RAG rating guide learner study allocation?", a: "Red (immediate intervention needed), Amber (requires consolidation and guided practice), Green (secure mastery; ready for extension)." },
      { q: "State one high-priority skill for success in non-examined assessment (NEA).", a: "Accurate calibration and execution of analytical techniques with reproducible quantitative record-keeping." }
    ],
    objectives: {
      knowledge: "Understand diagnostic triangulation across the 4 foundational pillars: Knowledge Recall, Scientific Maths, Microscopy Competence, and Academic Writing.",
      application: "Compile individual performance metrics into a personalized RAG (Red/Amber/Green) diagnostic competency profile.",
      evaluation: "Formulate individual SMART targets and prioritize practical skill development ahead of Unit F173 NEA coursework."
    },
    terminology: [
      { term: "Diagnostic Triangulation", def: "Synthesizing multiple independent assessments to form a robust, multi-dimensional view of learner strengths and deficits." },
      { term: "RAG Competency Rating", def: "Red (needs structured intervention), Amber (needs consolidation), Green (autonomous mastery demonstrated)." },
      { term: "SMART Target", def: "Specific, Measurable, Achievable, Relevant, and Time-bound developmental objectives." },
      { term: "NEA Skill Priorities", def: "Practical laboratory and analytical proficiencies essential for succeeding in the Non-Examined Assessment components." }
    ],
    theoryPoints: [
      "Pillar 1 - Knowledge Recall: Foundational cellular biology, organelle functions, and human physiology concepts sampled in the 30-mark baseline.",
      "Pillar 2 - Scientific Maths: Metric conversions ($mm \to \mu m \to nm$), magnification formulas ($M=I/A$), standard form, percentage change, and graph trends.",
      "Pillar 3 - Practical Competence: Microscope set-up, wet mount preparation (cheek/onion), biological drawing conventions, and scale calibration.",
      "Pillar 4 - Academic Writing & Data Literacy: Interpreting RCT datasets, distinguishing SD from 95% CI, and using Fact $\to$ Mechanism $\to$ Clinical Impact structure."
    ],
    workedExample: {
      title: "Triangulating an Individual Diagnostic Profile",
      subtitle: "Case Study: Learner A Performance Triangulation",
      steps: [
        { label: "Pillar 1: Knowledge Recall", detail: "Score: 24/30 (80%) → GREEN. Secure understanding of organelle function and biological systems; minor misconception in bacterial ribosomes." },
        { label: "Pillar 2: Scientific Maths", detail: "Score: 6/15 (40%) → RED. Struggled with $mm \to nm$ conversions and standard form; magnification calculation inverted." },
        { label: "Pillar 3: Microscopy Practical", detail: "Competency: SECURE (AMBER). Slide prepared well without air bubbles; drawing missed horizontal label lines and scale bar." },
        { label: "Pillar 4: Academic Writing", detail: "Score: 8/10 (80%) → GREEN. Fluent application of Fact $\to$ Mechanism $\to$ Clinical Impact; accurate Harvard in-text citation." },
        { label: "Resulting SMART Action Plan", detail: "Target: 'Complete 10 unit conversion and magnification calculation drills weekly with tutor check-in by Friday Week 4.'" }
      ]
    },
    hingeQuestions: [
      {
        question: "A learner scores 85% in cellular knowledge recall, but 40% in calculating eyepiece graticule calibration and 45% in interpreting clinical error bars. What should be their primary SMART target?",
        options: [
          "Reread the textbook chapters on organelle functions",
          "Focus weekly intervention on magnification formulas (M=I/A), unit conversions, and statistical confidence interval interpretation",
          "Retake the entire GCSE biology examination",
          "Skip practical sessions to read clinical trial papers"
        ],
        correctIndex: 1,
        explanation: "Targeted support must focus directly on the diagnosed deficiency: quantitative magnification mathematics and statistical data literacy."
      }
    ],
    examQuestion: {
      question: "Evaluate how triangulating multiple assessment methods (written tests, live practical observation, mathematical problem-solving) provides a more valid diagnostic profile than a written test alone. [4 marks]",
      marks: "4 marks",
      guidance: [
        "A written test only assesses theoretical recall and simulated problem-solving. [1 mark]",
        "Practical observation directly verifies fine motor laboratory competency, aseptic technique, and equipment safety that cannot be tested on paper. [1 mark]",
        "Mathematical problem-solving isolates quantitative numeracy from verbal literacy constraints. [1 mark]",
        "Triangulation prevents false negatives/positives, ensuring interventions target true procedural or conceptual deficits. [1 mark]"
      ]
    },
    plenary: [
      "Your diagnostic profile is a roadmap for excellence: turn Red domains into Amber, and Amber into Green before NEA submission.",
      "File your completed Diagnostic Profile and SMART Targets in your practical portfolio.",
      "Next Lesson: Transition to Biomedical Science & Genetics — curriculum overview, NEA scheduling, and lab safety."
    ]
  },
  {
    number: 8,
    part: 2,
    teacher: "Matt",
    deckId: "Lesson_08_Transition_to_Biomedical_Science_and_Genetics",
    title: "Transition to Biomedical Science & Genetics",
    focus: "Curriculum Roadmap, Assessment Routes, Lab Safety & Genetics Unit Bridge",
    deliverable: "Map the linear qualification progression, sign off diagnostic laboratory reagent COSHH protocols, and master prerequisites for the Genetics Unit.",
    details: "Introduction to the linear curriculum structure: Genetics unit → Biomedical Techniques unit → Fundamentals of Human Biology unit. Overview of assessment routes, NEA task schedule, health & safety briefing for diagnostic reagents, and transition to Genetics Unit topics.",
    starterQuestions: [
      { q: "Outline the three core units comprising the AAQ Human Biology qualification.", a: "1. Genetics & Gene Expression; 2. Biomedical Techniques (F173); 3. Fundamentals of Human Biology (F170)." },
      { q: "What is the assessment distinction between mandatory exam units and NEA units?", a: "Exam units are externally assessed via timed terminal papers; NEA units are internally completed coursework tasks validated by OCR moderation." },
      { q: "What is a COSHH assessment in a biomedical teaching laboratory?", a: "Control of Substances Hazardous to Health: systematic identification of hazardous reagents, exposure routes, and necessary risk mitigations." },
      { q: "Name three standard personal protective equipment (PPE) requirements for diagnostic reagents.", a: "Lab coat (fastened), safety spectacles/goggles, and nitrile protective gloves." },
      { q: "What core genetic concept connects Unit 1 to the upcoming Genetics unit?", a: "Phenotypic variation arising from the complex interplay of polygenic inheritance and environmental influences." },
      { q: "Why is a strict NEA task schedule essential for Year 12 learners?", a: "NEA tasks require multi-week practical optimization, clinical record tracking, and sequential milestone submission deadlines." }
    ],
    objectives: {
      knowledge: "Understand the linear three-unit curriculum structure: Genetics → Biomedical Techniques → Fundamentals of Human Biology.",
      application: "Apply COSHH regulations and risk assessments to hazardous diagnostic reagents, stains, and biological specimens.",
      evaluation: "Evaluate the assessment milestones and bridge foundational knowledge into the upcoming Genetics and Phenotypic Variation unit."
    },
    terminology: [
      { term: "Linear Curriculum Structure", def: "Sequential course progression ensuring prerequisite molecular genetics concepts precede applied biomedical laboratory techniques." },
      { term: "Non-Examined Assessment (NEA)", def: "Internally assessed, OCR-moderated practical and research coursework contributing directly to the final qualification grade." },
      { term: "COSHH Regulations", def: "UK legal framework mandating employers and schools to control health hazards from hazardous chemical substances." },
      { term: "Phenotypic Variation", def: "Observable physical and biochemical differences among individuals resulting from genetic alleles, environment, and epigenetics." }
    ],
    theoryPoints: [
      "The Qualification Roadmap: Year 12 Term 1: Genetics & Gene Regulation → Term 2: Unit F173 Biomedical Techniques & NEA → Term 3: Fundamentals of Human Biology & Pathology.",
      "Assessment Architecture: 50% Externally examined written assessments (Unit F170 / Unit F171) + 50% Internally assessed NEA coursework portfolio (Unit F173).",
      "Diagnostic Reagent Safety: Methylene blue (eye irritant), iodine solution (corrosive/staining), ethanol (flammable), biological tissues (microbial infection risk). Always use appropriate PPE and bleach disposal.",
      "The Genetics Bridge: Upcoming Lesson 1 explores continuous vs discontinuous variation, Gaussian normal distribution curves, and polygenic inheritance."
    ],
    workedExample: {
      title: "COSHH Risk Assessment for Diagnostic Laboratory",
      subtitle: "Standard Level 3 Risk Assessment Matrix",
      steps: [
        { label: "Substance / Hazard", detail: "Methylene blue stain (0.5% aqueous solution) & Methylene blue powder. Hazard: Irritant to eyes and mucous membranes; stains skin." },
        { label: "Route of Exposure", detail: "Accidental eye splash, skin absorption, or ingestion." },
        { label: "Risk Rating before Controls", detail: "Likelihood: Medium; Severity: Moderate → Overall Risk: Medium." },
        { label: "Control Measures", detail: "Wear chemical splash goggles (BS EN 166), nitrile gloves, and buttoned lab coat. Dispense via dropper bottles in secondary containment trays." },
        { label: "Emergency Response", detail: "Eye splash: Irrigate immediately with sterile eyewash solution for 10 minutes. Skin contact: Wash with warm soap and water." }
      ]
    },
    hingeQuestions: [
      {
        question: "When transitioning to the Genetics Unit, what is the critical distinction between continuous and discontinuous phenotypic variation?",
        options: [
          "Continuous variation has distinct non-overlapping categories; discontinuous is quantitative",
          "Continuous variation exhibits a quantitative numerical spectrum shaped by polygenes and environment; discontinuous exhibits discrete non-overlapping phenotypic categories controlled by 1–2 genes",
          "Continuous variation is only found in plants",
          "Discontinuous variation is caused exclusively by epigenetic factors"
        ],
        correctIndex: 1,
        explanation: "Continuous variation (e.g. human height) shows a normal distribution spectrum; discontinuous variation (e.g. ABO blood groups) consists of discrete distinct categories."
      }
    ],
    examQuestion: {
      question: "Explain why standard operating procedures in a biomedical diagnostic laboratory require both a risk assessment (COSHH) and a defined sample chain-of-custody protocol. [4 marks]",
      marks: "4 marks",
      guidance: [
        "COSHH ensures technician safety by identifying toxic/biohazardous reagents and establishing mandatory PPE/engineering controls. [1 mark]",
        "COSHH mitigates environmental contamination and hazardous chemical spill emergencies. [1 mark]",
        "Chain-of-custody protocols provide an unbroken auditable record of sample collection, handling, and storage. [1 mark]",
        "This prevents sample misidentification, cross-contamination, or degradation, guaranteeing diagnostic accuracy for patient clinical care. [1 mark]"
      ]
    },
    plenary: [
      "You have completed the 2-week Induction and Baseline Diagnostic unit for OCR Level 3 AAQ Human Biology!",
      "Review your Unit Roadmap and confirm all laboratory safety agreements are signed in your lab portfolio.",
      "Next Unit: Genetics & Genomics — starting with Lesson 1: Phenotypic Variation and Environmental Interactions."
    ]
  }
];
