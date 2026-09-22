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
      "Next Lesson: Communicating like a Human Biologist — source reliability, publication bias, and academic referencing."
    ]
  },
  {
    number: 5,
    part: 2,
    teacher: "Dan",
    deckId: "Lesson_05_Communicating_like_a_Human_Biologist_Source_Reliability_and_Referencing",
    title: "Communicating like a Human Biologist: Source Reliability & Academic Referencing",
    focus: "Source Credibility, Critical Appraisal (CRAAP/PROMPT), COVID-19 ARDS NSAID Case Study & Harvard Referencing",
    deliverable: "Evaluate biomedical source reliability using CRAAP/PROMPT, critique sensationalised trial reporting in COVID-19 ARDS NSAID therapies, construct compliant Harvard references, and complete the interactive referencing challenge.",
    details: "Communicating like a Human Biologist: Source Reliability & Academic Referencing. Lead: Dan. Clinical Case Study & Starter Hook: A severe COVID-19 patient presents with Acute Respiratory Distress Syndrome (ARDS), severe dyspnea, bilateral pulmonary infiltrates, and hyper-inflammatory cytokine storm (elevated CRP, IL-6, ferritin). Administration of an NSAID (ibuprofen) produces marked symptom alleviation and inflammatory biomarker reduction. The Media vs Science Conflict: In March 2020, unvetted ministerial statements and sensationalized media headlines triggered global panic claiming NSAIDs exacerbated COVID-19 mortality. Contrast this tabloid panic against subsequent peer-reviewed observational and randomized trial evidence (e.g., openSAFELY, Lancet Rheumatology cohorts) proving NSAIDs did not worsen ARDS or mortality. Bridge to mRNA Vaccine Debate: Connect this trial controversy to the accelerated COVID-19 mRNA vaccine pipeline—evaluating the initial absence of longitudinal Phase III trial data, rolling regulatory reviews, emergency authorizations, and reliance on surrogate immunogenicity biomarkers (neutralizing antibodies) before broad clinical effectiveness was established. This directly underpins the Mock NEA in Lesson 6. Classroom Movement & Ranking Activity ('Can we always trust what we read?'): Learners move around the classroom using post-it notes to rank 6 biomedical information sources (Academic Journals, Medical Textbooks, Health Authority Guidelines, TV/Radio Documentaries, Daily Newspapers, and Reddit/Social Media) from #1 (most trustworthy) to #6 (least trustworthy) with scientific justifications. Critical Appraisal Framework (CRAAP/PROMPT adapted for biosciences): Scrutinize peer-review status, sample power (n numbers), blinding, control selection, and funding declarations/conflicts of interest. Bad Science & Publication Bias (Dr Ben Goldacre): Deconstruct how negative or unpromising trial data is suppressed by commercial sponsors, skewing meta-analyses. Database Search Strategies: Formulate Boolean search strings in PubMed (>30 million records, [tiab] field tags, MeSH headings, open-access filters) and Google Scholar (date filters, 'Cited by' citation chaining). AI Research Tools: Natural-language literature discovery, summarization, and citation management, balanced against critical risks (hallucinations, hidden paywalls, black-box algorithms, reproducibility, mandatory primary source verification). Academic Conventions & Referencing: Mechanics of Harvard referencing (in-text author-date citations vs alphabetized reference list with DOIs; rules for single, dual, and 4+ authors becoming et al.). AI Referencing Protocol: Treat AI as software, do not cite as an author, describe methodology and prompts in an appendix. Interactive Lab: Live digital practice via the RefMaster Referencing Game (https://taggatron.github.io/Referencinggame/).",
    starterQuestions: [
      { q: "What is the primary purpose of a clinical trial control group?", a: "To establish a baseline comparison to isolate the specific pharmacological effect of the experimental variable from placebo effect or natural disease progression." },
      { q: "Name two variables that must be controlled in a blood test analysis.", a: "E.g., incubation temperature, sample storage time before centrifugation, anticoagulant type (e.g. EDTA vs heparin), or reagent concentration." },
      { q: "Why is a large sample size critical in biomedical research?", a: "It maximizes statistical power, minimizes the distortion of random anomalies/biological variance, and narrows confidence intervals." },
      { q: "Define quantitative data in the context of urinalysis.", a: "Numerical, measurable data with defined clinical units (e.g., glucose concentration in mmol/L or protein mg/dL) rather than descriptive/qualitative observations." },
      { q: "What is the risk of using a biased sample in a drug trial?", a: "Produces unrepresentative results and skewed conclusions that fail to reflect the target patient population, risking ineffective treatment or hidden toxicity." },
      { q: "How does peer review improve the reliability of scientific claims?", a: "Subjecting research methodology, statistical calculations, and data interpretation to scrutiny by independent experts (Review -> Feedback -> Correction) before publication." }
    ],
    objectives: {
      knowledge: "Understand peer-review hierarchies, publication bias (Goldacre), and CRAAP/PROMPT critical appraisal criteria in biosciences.",
      application: "Deconstruct media sensationalism (COVID-19 ARDS NSAID controversy) against peer-reviewed trial literature using PubMed and Harvard referencing.",
      evaluation: "Critically appraise trial validity, sample power, and surrogate endpoints, linking accelerated pandemic trials to the mRNA Mock NEA."
    },
    terminology: [
      { term: "ARDS & Cytokine Storm", def: "Acute Respiratory Distress Syndrome: severe alveolar inflammation and fluid accumulation driven by systemic hyper-cytokinemia." },
      { term: "Publication Bias", def: "Selective suppression or withholding of negative or unpromising trial data, skewing published medical meta-analyses toward false-positive efficacy." },
      { term: "CRAAP / PROMPT Framework", def: "Systematic critical appraisal tool adapted for biosciences: Currency, Relevance, Authority, Accuracy, and Purpose/Funding bias." },
      { term: "Surrogate vs Clinical Endpoint", def: "Surrogate biomarkers (e.g. antibody titres, CRP levels) serve as indirect proxies; clinical primary endpoints measure survival or disease prevention." }
    ],
    theoryPoints: [
      "Evidence Hierarchy: Unfiltered web/social media opinions < Case reports < Retrospective observational cohorts < Randomized Controlled Trials (RCTs) < Systematic Reviews & Meta-Analyses.",
      "Ben Goldacre's 'Bad Science' & Publication Bias: Up to 50% of industry-sponsored clinical trials have historically gone unpublished, concealing adverse events and distorting clinical practice guidelines.",
      "Biomedical Database Search Strategies: Utilize PubMed ([tiab] title/abstract field tags, Boolean AND/OR/NOT, MeSH indexing) and Google Scholar (date filtering, 'Cited by' citation tracking, paywall awareness).",
      "AI in Research & Academic Integrity: AI tools accelerate literature scoping and summarization, but carry severe risks of hallucinated citations and black-box opacity; primary source verification is mandatory."
    ],
    workedExample: {
      title: "Referencing Repair Clinic: Correcting Malformed Biomedical Citations",
      subtitle: "Transforming flawed citations into publication-ready Harvard format",
      steps: [
        { label: "Flawed In-Text Citation", detail: "Malformed: 'Ibuprofen reduces ARDS inflammation (Dan, Goldacre, and others in Lancet 2021).' Error: Lists first names, lacks year parentheses, includes journal name in-text." },
        { label: "Repaired In-Text Citation", detail: "Corrected: 'NSAID administration was not associated with increased mortality or ARDS severity in hospitalized cohorts (Goldacre et al., 2021).' Follows standard author-date format." },
        { label: "Flawed Reference List Entry", detail: "Malformed: 'Goldacre B. 2021. Lancet paper on COVID trial data. www.google.com.' Error: Missing article title, journal volume, pagination, and persistent DOI." },
        { label: "Repaired Reference List Entry", detail: "Corrected: Goldacre, B., Smeeth, L. and Perry, R. (2021) 'Safety of non-steroidal anti-inflammatory drugs in patients with viral respiratory infections: a retrospective cohort study', The Lancet Rheumatology, 3(6), pp. e420–e428. doi:10.1016/S2665-9913(21)00093-5." },
        { label: "Critical Appraisal Takeaway", detail: "Consistent Harvard citation allows readers to independently audit source authority and verify raw experimental evidence." }
      ]
    },
    hingeQuestions: [
      {
        question: "In March 2020, news reports warned that NSAIDs worsen COVID-19 ARDS based on a tweet. What was the primary methodological flaw in accepting this claim?",
        options: [
          "The tweet was not translated into Latin",
          "It relied on anecdotal speculation without peer-reviewed empirical evidence, controlled trials, or adjusted confounding variables",
          "NSAIDs are not chemical molecules",
          "The author did not use Harvard referencing in the tweet"
        ],
        correctIndex: 1,
        explanation: "Clinical guidance requires peer-reviewed trial cohorts with statistical power and confounder adjustment, not unvetted anecdotal statements."
      },
      {
        question: "Why was the rapid rollout of COVID-19 mRNA vaccines subjected to critical academic scrutiny regarding initial clinical trial data?",
        options: [
          "mRNA cannot enter eukaryotic cells",
          "Accelerated emergency authorization meant initial trials evaluated short-term surrogate immunogenicity (antibody titres) with limited longitudinal follow-up",
          "The vaccines were tested only on bacteria",
          "No clinical trials were ever conducted"
        ],
        correctIndex: 1,
        explanation: "The accelerated pipeline compressed phases, requiring regulatory review based on surrogate immune markers before years of longitudinal safety data were available."
      }
    ],
    examQuestion: {
      question: "A popular health website reported that a novel synthetic molecule 'completely halts viral pulmonary inflammation with zero side effects'. The article cited a pilot trial of 10 healthy volunteers funded entirely by the drug manufacturer. Critically evaluate this report, identifying three methodological and reporting flaws according to OCR Level 3 criteria. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Critique 1: Sample size is critically underpowered (n=10), introducing high risk of random sampling error and precluding detection of uncommon adverse drug reactions. [2 marks]",
        "Critique 2: High risk of commercial conflict of interest / funding bias from manufacturer sponsorship without independent multi-centre replication. [2 marks]",
        "Critique 3: The media claim 'zero side effects' ignores Phase I dosage limitations and conflates early tolerance in healthy subjects with confirmed clinical efficacy in diseased patients. [2 marks]"
      ]
    },
    plenary: [
      "Evidence-based medicine demands peer-reviewed scrutiny over media sensationalism: always audit trial sample size, controls, and sponsor disclosures.",
      "Master Harvard referencing and AI software attribution protocols to maintain flawless academic integrity in your Level 3 portfolio.",
      "Next Lesson: F172 Genetics Mini Mock NEA — mRNA Vaccines: Gene Expression & Clinical Trial Evidence."
    ]
  },
  {
    number: 6,
    part: 2,
    teacher: "Dan",
    deckId: "Lesson_06_Communicating_like_a_Human_Biologist_Clinical_Data_and_Mock_NEA",
    title: "Communicating like a Human Biologist: F172 Genetics Mini Mock NEA (mRNA Vaccines)",
    focus: "F172 Genetics Mini Mock NEA Scaffold: Gene Expression, Lipid Nanoparticle Delivery & Clinical Trial Evidence",
    deliverable: "Complete the F172 Genetics Mini Mock NEA scaffold: draft Side 1 (Gene Expression & LNP Delivery without altering genomic DNA) and Side 2 (Clinical Trial Evidence & 2-Sided Evaluation) with independent Harvard citations.",
    details: "F172 Genetics Mini Mock NEA: mRNA Vaccines: Gene Expression and Clinical Trials. Lead: Dan. Purpose & Referencing Requirements: Prepare learners for the research, explanation, analysis, and evaluation skills required in the F172 Genetics NEA, with independent Harvard referencing for all sources (Pardi et al., Fullick et al. OCR textbook, Polack et al., Hou et al., Baden et al.). SIDE 1 — GENES, mRNA AND PROTEIN PRODUCTION: Task 1 (From Genetic Information to Protein): Pathway DNA → transcription → mRNA → translation → protein. Core concepts: what a gene is, the role of DNA base sequence, transcription, role of mRNA, ribosomes, translation, and how nucleotide triplets determine amino-acid sequences. Apply knowledge: how an mRNA vaccine uses this host pathway to make a human cell temporarily produce a viral spike protein. VITAL SCIENTIFIC REQUIREMENT: Learners must explain why mRNA vaccination uses genetic information but does not alter the recipient's genomic DNA (mRNA functions solely in the cytoplasm, lacks reverse transcriptase and integrase, and is rapidly broken down by cellular ribonucleases). Task 2 (Delivering mRNA into Cells): Explain why injecting unprotected naked mRNA presents severe biochemical barriers (rapid enzymatic degradation by RNases, negative phosphate backbone charge preventing passage across hydrophobic cell membranes). Solution: Lipid nanoparticles (LNPs) (Hou et al.). Complete pathway: Lipid nanoparticle containing mRNA → endocytosis/membrane fusion → cytoplasm → ribosomal translation → viral protein. Technology trade-offs: Analyse 3 advantages and 3 challenges across temporary expression, mRNA stability, delivery efficiency, speed of redesign, immune response, and storage (ultra-cold chain). Mini-judgement framework: Evidence → explanation → consequence → judgement. SIDE 2 — CLINICAL TRIAL EVIDENCE: Task 3 (Can the Vaccine Work?): Landmark Phase III clinical trial: Polack et al. (2020) NEJM (Safety and Efficacy of the BNT162b2 mRNA Covid-19 Vaccine, N=43,448). Methodological strengths: Explain why each feature strengthens a clinical trial: Large sample (statistical power), Randomisation (eliminates confounding bias), Placebo group (controls for background infection rates and placebo effects), Blinding (prevents observer/reporting bias), Defined binary outcome (laboratory PCR-confirmed COVID-19 ≥7 days post-dose 2), and Adverse-event monitoring. Quantitative Data Interpretation: Vaccine group: 8 COVID-19 cases vs Placebo group: 162 COVID-19 cases. Analytical reasoning chain: comparison → size of difference (95.0% vaccine efficacy, 154 fewer cases) → what it suggests → strength of evidence. Important Scientific Reasoning (Correlation vs Causation): 'Can we conclude that every medical problem occurring after vaccination was caused by the vaccine?' Distinguish between something happening AFTER vaccination (temporal coincidence) versus happening BECAUSE OF vaccination (true causal adverse reaction), grounded in placebo group comparison, population background incidence rates, coincidence, biological plausibility, and sample size. Task 4 (Evaluate the Evidence): Structured two-sided critique of the statement: 'The clinical trial proves that the mRNA vaccine is safe and effective.' Contrast trial strengths (large multi-centre RCT, blinding, 95% efficacy) against trial limitations (median 2-month follow-up, rare adverse events undetectable in N=20,000, excluded demographic groups like children and pregnant individuals, waning immunity, emerging viral variants). Suggested writing scaffold: Evidence suggests that... This evidence is strong because... However, a limitation is... This matters because... Overall, I would conclude that... Exit Task: Upload completed Side 1 & Side 2 Mini Mock NEA scaffold into the shared learning folder ahead of Lesson 7 peer review.",
    starterQuestions: [
      { q: "What is the biological pathway from genetic code to functional protein?", a: "DNA → transcription → mRNA → translation → protein." },
      { q: "Why can an mRNA vaccine NOT alter or integrate into human genomic DNA?", a: "mRNA operates exclusively in the cytoplasm, cannot cross into the nucleus, lacks reverse transcriptase/integrase enzymes, and is rapidly degraded by cellular ribonucleases." },
      { q: "Why would injecting unprotected 'naked' mRNA directly into a patient fail?", a: "It is rapidly degraded by ubiquitous extracellular ribonucleases (RNases) and its negative phosphate charge prevents crossing hydrophobic cell membranes." },
      { q: "What role do lipid nanoparticles (LNPs) play in mRNA delivery?", a: "LNPs encapsulate and protect mRNA from enzymatic breakdown and facilitate cellular entry via endocytosis and endosomal release into the cytoplasm." },
      { q: "In the Polack et al. (2020) Phase III trial, how many COVID-19 cases occurred in the vaccine vs placebo groups?", a: "Vaccine group: 8 cases; Placebo group: 162 cases (demonstrating ~95.0% vaccine efficacy)." },
      { q: "Why must clinical researchers distinguish between an adverse event happening 'after' vaccination vs 'because of' vaccination?", a: "Temporal succession does not establish causation; background illness rates in large populations mean medical events occur coincidentally regardless of vaccination, requiring placebo comparison." }
    ],
    objectives: {
      knowledge: "Master the gene expression pathway (DNA → mRNA → protein), LNP delivery mechanisms, and why mRNA cannot alter genomic DNA.",
      application: "Interpret Polack et al. Phase III clinical trial data (8 vs 162 cases) and distinguish post-vaccination correlation from causation.",
      evaluation: "Draft the F172 Genetics Mini Mock NEA scaffold evaluating trial strengths, limitations, and LNP trade-offs with independent Harvard referencing."
    },
    terminology: [
      { term: "Central Dogma Pathway", def: "DNA → transcription → mRNA → translation → protein: the directional flow of genetic information inside eukaryotic cells." },
      { term: "Genomic Non-Alteration Principle", def: "Exogenous mRNA cannot alter recipient DNA because it acts strictly in the cytoplasm, lacks reverse transcriptase, and is rapidly hydrolysed." },
      { term: "Lipid Nanoparticles (LNPs)", def: "Submicroscopic lipid vesicles that encapsulate fragile mRNA, shielding it from RNases and facilitating cellular endocytosis." },
      { term: "Double-Blind Placebo RCT", def: "A clinical trial where neither subjects nor researchers know who receives active vaccine or inert placebo, eliminating confounding and bias." },
      { term: "Post Hoc Fallacy (Association vs Causation)", def: "The logical fallacy of assuming an event occurring after vaccination was caused by the vaccine, ignoring background incidence rates." }
    ],
    theoryPoints: [
      "Protein Synthesis Pathway: DNA is transcribed into mRNA in the nucleus (or delivered synthetically into cytoplasm); ribosomes translate codon triplets into polypeptides.",
      "Biological Non-Alteration Rule: mRNA has zero access to the nuclear genome; it lacks viral reverse transcriptase and integrase, making genomic integration biologically impossible.",
      "LNP Delivery Kinetics: Synthetic mRNA is encapsulated in ionizable lipid nanoparticles to bypass RNases, cross the anionic lipid bilayer via endocytosis, and release into the cytosol.",
      "Clinical Evidence (Polack et al., 2020): N=43,448 randomized participants demonstrated 8 COVID-19 cases in the BNT162b2 group vs 162 in the placebo group (95.0% efficacy).",
      "Scientific Reasoning on Safety: Rare adverse events must be judged against placebo event rates and population background incidence to distinguish coincidence from drug-induced causality."
    ],
    workedExample: {
      title: "F172 Mini Mock NEA Scaffold: Side 1 Mechanism & Side 2 Trial Evidence Evaluation",
      subtitle: "Step-by-step model integrating biological cause-and-effect with quantitative trial critique",
      steps: [
        { label: "Side 1, Task 1: Gene Expression & Non-Alteration of DNA", detail: "Explain DNA → transcription → mRNA → translation → protein. Apply to vaccine: mRNA directs host ribosomes to translate viral spike protein. Must clarify: mRNA functions strictly in cytoplasm, cannot enter nucleus, and lacks reverse transcriptase, so cannot alter host genomic DNA." },
        { label: "Side 1, Task 2: LNP Delivery & Trade-Offs", detail: "Delivery pathway: LNP containing mRNA → endocytosis/fusion → cytoplasm → ribosomes → protein. Analyse 3 advantages (temporary expression, modular redesign, no live pathogen) vs 3 challenges (RNase instability, formulation complexity, ultra-cold storage)." },
        { label: "Side 2, Task 3: Quantitative Trial Analysis (Polack et al.)", detail: "Framework: comparison → size of difference → suggestion → strength. Vaccine (8 cases) vs Placebo (162 cases) = 95.0% efficacy in N=43,448. Evidence is exceptionally robust due to large sample, randomisation, and double-blinding." },
        { label: "Side 2, Task 3: Reasoning on Adverse Events", detail: "Distinguish 'after' vs 'because of' vaccination. Background incidence rates of stroke or heart attack occur spontaneously; if rates in vaccine arm match placebo, the event is coincidental, not causally drug-induced." },
        { label: "Side 2, Task 4: Structured Evidence Evaluation", detail: "Draft using: 'Evidence suggests that... This evidence is strong because... However, a limitation is... This matters because... Overall, I would conclude that...' Evaluate claim that trial 'proves' safety and efficacy." }
      ]
    },
    hingeQuestions: [
      {
        question: "A patient expresses concern that an mRNA vaccine will permanently alter their genome. Which biological explanation correctly addresses this concern?",
        options: [
          "mRNA is converted into a bacterial plasmid",
          "mRNA operates exclusively in the cytoplasm, cannot cross into the nucleus, lacks reverse transcriptase/integrase enzymes, and is rapidly broken down by cellular RNases",
          "The vaccine contains antibodies that destroy all host DNA",
          "mRNA permanently integrates into mitochondrial DNA only"
        ],
        correctIndex: 1,
        explanation: "Exogenous mRNA remains in the cytosol, has no reverse transcriptase to form DNA, cannot enter the nucleus, and is quickly degraded by intracellular ribonucleases."
      },
      {
        question: "During a Phase III vaccine trial of 40,000 individuals, 12 participants in the vaccine arm and 13 participants in the placebo arm experience appendicitis. What does this scientific evidence suggest?",
        options: [
          "The vaccine causes appendicitis in 12 patients",
          "Appendicitis occurred at expected background population rates independent of vaccination (temporal coincidence, not causation)",
          "The placebo was contaminated with appendicitis bacteria",
          "The trial was unblinded and invalid"
        ],
        correctIndex: 1,
        explanation: "Equal incidence in both active and placebo arms indicates the condition reflects natural background population rates, proving temporal association without causation."
      }
    ],
    examQuestion: {
      question: "A student is completing their F172 Genetics Mini Mock NEA on mRNA vaccines. (a) Explain why mRNA vaccines require a delivery system such as lipid nanoparticles, and why they cannot alter the recipient's genomic DNA. (b) Evaluate the statement: 'The Polack et al. (2020) clinical trial proves that the BNT162b2 vaccine is safe and effective.' [6 marks]",
      marks: "6 marks",
      guidance: [
        "(a) Unprotected mRNA is rapidly degraded by extracellular RNases and its negative charge blocks plasma membrane transit; LNPs enable endocytosis. [1 mark]",
        "(a) mRNA functions exclusively in cytoplasm, lacks reverse transcriptase, cannot enter nucleus, and cannot integrate into genomic DNA. [1 mark]",
        "(b) Strengths: Large sample size (N=43,448), double-blind RCT design, massive infection rate reduction (8 vs 162 cases, 95% efficacy). [2 marks]",
        "(b) Limitations: Median 2-month follow-up precludes detection of rare long-term adverse events; excludes paediatric/pregnant cohorts; cannot assess durability against future variant mutations. [1 mark]",
        "(b) Epistemological nuance: Distinguish evidence from absolute proof; ongoing Phase IV real-world pharmacovigilance is required. [1 mark]"
      ]
    },
    plenary: [
      "Side 1 mastery: mRNA expresses viral protein via ribosomes but CANNOT alter or enter recipient genomic DNA.",
      "Side 2 mastery: Polack et al. proves 95% short-term efficacy (8 vs 162 cases), but scientific evaluation demands distinguishing correlation from causation and recognising trial duration limits.",
      "Next Lesson: Introductory Unit Synthesis — Standardisation Exemplars, Diagnostic Peer Review & Individual Competency Profiling."
    ]
  },
  {
    number: 7,
    part: 2,
    teacher: "Matt",
    deckId: "Lesson_07_Introductory_Unit_Synthesis_Diagnostic_Profile_and_Peer_Review",
    title: "Introductory Unit Synthesis: Diagnostic Profile & Peer Review Workshop",
    focus: "Standardisation Exemplars, Diagnostic Peer Review & Diagnostic Competency Profiling",
    deliverable: "Perform structured peer review on Lesson 6 Mock NEA drafts using diagnostic rubrics and compile an individual competency diagnostic tracker.",
    details: "Introductory Unit Synthesis: Diagnostic Profile & Peer Review Workshop. Lead: Matt. Standardisation & Exemplars: Review an anonymised exemplar mock NEA draft demonstrating high-level academic critique alongside a weaker draft that relies on uncritical, surface-level claims. Diagnostic Peer Review: Learners swap Lesson 6 drafts and use a structured diagnostic rubric assessing: Critical appraisal of the clinical trial data (depth of methodology critique); Academic objectivity and tone; Accuracy and consistency of Harvard referencing (both in-text and bibliographic). Diagnostic Profiling: Learners complete their individual diagnostic tracker, highlighting personal strengths and actionable targets in scientific writing and statistical evaluation.",
    starterQuestions: [
      { q: "What is the primary pedagogical goal of a standardisation exercise before peer review?", a: "To calibrate evaluative judgements against defined grade criteria using contrasting high- and low-scoring exemplar drafts." },
      { q: "What characterizes an 'uncritical, surface-level claim' in a biomedical literature review?", a: "Accepting published trial conclusions uncritically without interrogating sample power, control validity, surrogate endpoints, or sponsor bias." },
      { q: "What three core criteria are evaluated in the Lesson 7 diagnostic peer-review rubric?", a: "1. Depth of clinical trial data and methodology critique; 2. Academic objectivity and tone; 3. Accuracy and consistency of Harvard referencing." },
      { q: "How should academic objectivity and scientific tone be maintained in an NEA evaluation?", a: "By using impersonal third-person syntax, hedged modal verbs (e.g. 'evidence suggests'), and avoiding emotive adjectives." },
      { q: "What is an individual diagnostic tracker in Level 3 Human Biology?", a: "A self-reflective profiling tool triangulating performance across recall, maths, microscopy, and writing to set SMART developmental targets." },
      { q: "What makes peer review feedback 'actionable' for the Lesson 8 refinement clinic?", a: "Providing specific, concrete revisions (e.g. 'replace colloquial adjective with quantitative p-value' or 'add missing DOI to citation')." }
    ],
    objectives: {
      knowledge: "Understand standardisation benchmarks: contrasting high-level academic critique against uncritical surface-level claims.",
      application: "Execute structured peer review using a diagnostic rubric assessing methodology critique, tone, and Harvard referencing.",
      evaluation: "Triangulate diagnostic performance to construct an individual competency profile with actionable targets for Lesson 8 refinement."
    },
    terminology: [
      { term: "Standardisation Exemplar", def: "An anonymised benchmark draft demonstrating concrete evidence of high- vs low-band performance against assessment rubrics." },
      { term: "Diagnostic Peer Review", def: "Collaborative evaluation of peer work against explicit rubrics to diagnose methodological, syntactic, and referencing gaps." },
      { term: "Academic Tone & Hedging", def: "Objective, non-emotive scientific expression using qualified claims ('the data indicates' rather than 'this proves without doubt')." },
      { term: "Diagnostic Profiling Tracker", def: "A personal competency matrix identifying strengths, consolidation needs, and priority targets ahead of final NEA submission." }
    ],
    theoryPoints: [
      "High-Level Critique vs Surface Claims: Top-band responses probe clinical trial methodology, confounders, and endpoints; weak responses simply summarise promotional abstracts.",
      "The Three-Pillar Peer Review Rubric: Pillar 1: Depth of Clinical Data Appraisal; Pillar 2: Academic Objectivity & Tone; Pillar 3: Harvard Referencing Precision.",
      "Constructive Feedback Protocol: State one diagnostic strength, two specific methodology/syntactic refinements, and one citation repair.",
      "Triangulated Diagnostic Profiling: Triangulate baseline knowledge (L1), microscope skills (L2), mathematical graphing (L3), referencing (L4-5), and writing (L6)."
    ],
    workedExample: {
      title: "Standardisation Clinic: High-Level Critique vs Surface-Level Draft",
      subtitle: "Comparing exemplar extracts to calibrate peer review grading",
      steps: [
        { label: "Draft A (Weak / Surface-Level)", detail: "'The Pfizer vaccine was amazing because it cured 95% of people and is much better than cancer treatments which don't work as well (Johnson, 2021). Doctors were very happy with this result.'" },
        { label: "Critique of Draft A", detail: "Emotive language ('amazing'), factually inaccurate ('cured' vs prevented symptomatic disease), uncritical comparison, incomplete citation lacking peer-reviewed authority." },
        { label: "Draft B (High-Level Academic Critique)", detail: "'Polack et al. (2020) reported 95.0% vaccine efficacy (95% CI: 90.3–97.6%) against symptomatic SARS-CoV-2 infection in a Phase III multinational trial (n=43,548). In contrast to oncology platforms measuring progression-free survival, this trial utilised a binary clinical primary endpoint. However, the median follow-up of 60 days post-dose two limited longitudinal characterisation of waning humoral immunity.'" },
        { label: "Evaluation of Draft B", detail: "Quantitatively precise, includes confidence intervals, accurately distinguishes public health from oncology endpoints, objective tone, identifies methodological follow-up limitation." },
        { label: "Peer Review Grading Calibrator", detail: "Award top marks only when claims are accompanied by quantitative bounds, mechanistic rationale, and balanced methodological critique." }
      ]
    },
    hingeQuestions: [
      {
        question: "Which piece of peer feedback provides the most actionable guidance for an NEA draft?",
        options: [
          "Your writing looks pretty good, maybe write a bit more about mRNA",
          "I liked your introduction",
          "In paragraph 2, replace 'this drug worked great' with the exact ARR (2.1%) and explain how the lack of blinding may have biased adverse event reporting",
          "Change the font to Arial"
        ],
        correctIndex: 2,
        explanation: "Actionable feedback identifies the exact location, provides specific replacement data, and suggests a clear methodological critique."
      },
      {
        question: "A peer's draft cites a news article instead of a primary trial paper for clinical efficacy. Under the rubric, how should this be classified?",
        options: [
          "Acceptable if the article has a recent date",
          "A referencing deficit: the student must substitute the secondary media report with the primary peer-reviewed trial paper (e.g. NEJM / The Lancet)",
          "An example of high-level synthesis",
          "A minor formatting preference"
        ],
        correctIndex: 1,
        explanation: "Secondary news reporting lacks peer-review rigor and must be replaced with primary trial citations in Level 3 NEA work."
      }
    ],
    examQuestion: {
      question: "Evaluate the role of structured peer review and standardised exemplars in developing academic objectivity and analytical critique in biomedical students. [4 marks]",
      marks: "4 marks",
      guidance: [
        "Standardised exemplars calibrate students' understanding of top-band vs weak criteria, removing ambiguity about expected academic rigor. [1 mark]",
        "Critiquing peer work forces learners to identify methodological gaps (e.g. confounding factors, unverified claims) that they often overlook in their own drafts. [1 mark]",
        "Peer review reinforces objective third-person scientific tone and prevents informal colloquialisms. [1 mark]",
        "Diagnostic rubrics provide concrete actionable targets that directly drive iterative draft refinement before final submission. [1 mark]"
      ]
    },
    plenary: [
      "Peer review is standard scientific practice: even Nobel Prize-winning papers undergo rigorous scrutiny by peers.",
      "Ensure your peer review feedback slip contains at least two specific, actionable methodology and citation targets.",
      "Complete your Diagnostic Profile Tracker and file it in your NEA working portfolio ahead of Lesson 8."
    ]
  },
  {
    number: 8,
    part: 2,
    teacher: "Matt",
    deckId: "Lesson_08_Mock_NEA_Finalisation_and_Transition_to_Genetics",
    title: "Mock NEA Finalisation & Transition to Biomedical Science & Genetics",
    focus: "Draft Refinement Clinic, Cohort Debrief & Transition to Molecular Genetics",
    deliverable: "Finalize the mock NEA section based on Lesson 7 peer feedback and complete the curriculum transition bridge to molecular genetics.",
    details: "Mock NEA Finalisation & Transition to Biomedical Science & Genetics. Lead: Matt. Draft Refinement Clinic: Learners implement the feedback received in Lesson 7, polishing their mock NEA section to final standard. Cohort Synthesis & Debrief: Address common cohort trends: tightening up the distinction between correlation and causation in clinical endpoints, and ensuring precise citation formatting. Curriculum Transition Bridge: Connect the mRNA case study directly to Biomedical Science & Genetics: How synthetic modified mRNA bypasses intracellular innate immune sensors (e.g., TLR pathways); Ribosomal translation, antigen processing, and the transition into molecular genetics and cellular pathology.",
    starterQuestions: [
      { q: "Why is the distinction between correlation and causation paramount when evaluating clinical endpoints?", a: "Correlation indicates a statistical association between variables, whereas causation proves that one variable directly produces the clinical change without confounding factors." },
      { q: "How does synthetic modified mRNA (incorporating N1-methylpseudouridine) evade intracellular innate immune sensors?", a: "Unmodified in vitro transcribed mRNA activates toll-like receptors (TLR3, TLR7, TLR8) and RIG-I, triggering ribonuclease degradation and translational arrest; nucleoside modifications prevent sensor binding." },
      { q: "Once mRNA is delivered into the host cytosol, which cellular organelle translates it into antigen proteins?", a: "Host cell ribosomes (80S complexes in the cytoplasm), translating mRNA codons via tRNA-delivered amino acids." },
      { q: "What happens to the synthesized viral/tumour antigen after ribosomal translation?", a: "It is processed by the proteasome and presented on cell-surface MHC Class I/II molecules to activate cytotoxic T-cells and helper T-cells." },
      { q: "State two primary improvements required during today's Draft Refinement Clinic.", a: "Implement Lesson 7 peer feedback targets and eliminate any remaining informal syntax or citation errors." },
      { q: "Which upcoming unit does this induction directly bridge into?", a: "Unit F171: Genetics, Gene Expression, and Molecular Pathology." }
    ],
    objectives: {
      knowledge: "Understand the biochemical mechanism of modified mRNA: escaping TLR innate sensors, cytosolic ribosomal translation, and MHC antigen presentation.",
      application: "Refine and finalize the Mock NEA draft, implementing peer diagnostic feedback and ensuring rigorous Harvard citations.",
      evaluation: "Evaluate the conceptual transition from applied clinical immunology to fundamental molecular genetics and cellular pathology."
    },
    terminology: [
      { term: "Correlation vs Causation", def: "Distinguishing an observed mutual relationship between clinical variables from a verified direct causal mechanism." },
      { term: "N1-Methylpseudouridine", def: "A modified nucleoside that replaces uridine in therapeutic mRNA, preventing detection by pattern-recognition receptors (TLRs)." },
      { term: "Toll-Like Receptors (TLR3/7/8)", def: "Pattern-recognition receptors that detect foreign pathogen-associated molecular patterns (like viral single-stranded RNA)." },
      { term: "Curriculum Bridge (Genetics)", def: "The conceptual link connecting synthetic mRNA translation to transcription, codon translation, mutations, and phenotypic variation." }
    ],
    theoryPoints: [
      "Draft Refinement Clinic: Systematically implement Lesson 7 rubric targets—upgrade informal vocabulary, cite exact statistical bounds, and align reference lists.",
      "The Correlation vs Causation Fallacy: A decrease in viral load concurrent with symptom relief does not automatically prove causality without randomised control arms.",
      "The Molecular Genetics Bridge: Synthetic modified mRNA must survive long enough to reach cytosolic 80S ribosomes without triggering PKR (protein kinase R) or TLR activation.",
      "Transition to Unit F171: Foundational knowledge now bridges directly into DNA replication, transcription, translation fidelity, genetic alleles, and epigenetic control."
    ],
    workedExample: {
      title: "Refining the NEA Draft & Bridging to Molecular Genetics",
      subtitle: "Polishing a clinical paragraph and linking to intracellular translation",
      steps: [
        { label: "Peer Feedback Implemented", detail: "Peer note: 'Paragraph 3 implies mRNA enters the nucleus and causes mutations. Clarify that mRNA acts strictly in the cytosol.'" },
        { label: "Refined Text", detail: "'Exogenous synthetic mRNA does not integrate into the host genome; it remains strictly cytoplasmic where host 80S ribosomes translate the encoded open reading frame into immunogenic target proteins (Sahin et al., 2020).'" },
        { label: "Biochemical Sensor Evasion", detail: "'Incorporation of N1-methylpseudouridine suppresses Toll-like receptor (TLR3, TLR7/8) activation, preventing interferon-mediated translation inhibition and allowing sustained polypeptide synthesis.'" },
        { label: "Correlation vs Causation Refinement", detail: "'High neutralising antibody titres correlated with reduced hospitalisations (r=0.88), and placebo-controlled Phase III trials confirmed this relationship to be directly causal (p < 0.001).'" },
        { label: "Final Standard Sign-off", detail: "Objective tone verified, Harvard citations cross-checked with bibliography, and ready for portfolio archive." }
      ]
    },
    hingeQuestions: [
      {
        question: "Why does therapeutic mRNA require nucleoside modification (e.g. N1-methylpseudouridine) before clinical administration?",
        options: [
          "To make the mRNA double-stranded like DNA",
          "To prevent unmodified single-stranded RNA from triggering innate pattern-recognition receptors (TLRs) that destroy the mRNA and halt translation",
          "To allow the mRNA to permanently integrate into host chromosomes",
          "To change the genetic code from RNA to protein"
        ],
        correctIndex: 1,
        explanation: "Unmodified in vitro transcribed mRNA triggers severe innate immune sensors (TLR3, TLR7/8) causing immediate translational arrest and inflammatory degradation."
      },
      {
        question: "How does the mRNA case study connect directly to the upcoming Genetics unit?",
        options: [
          "It shows how genetic codons in mRNA are translated by ribosomes into functional polypeptides, bridging into gene expression and mutation biology",
          "It proves genetics is no longer needed in medicine",
          "It shows all diseases are caused by viruses",
          "It replaces microscopy completely"
        ],
        correctIndex: 0,
        explanation: "mRNA translation on ribosomes is the core of gene expression (the Central Dogma), linking directly into molecular genetics and transcription."
      }
    ],
    examQuestion: {
      question: "Explain how synthetic modified mRNA illustrates the Central Dogma of molecular biology, and describe how intracellular innate immune mechanisms would destroy unmodified mRNA before translation could occur. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Central Dogma: Exogenous mRNA serves as the direct transcriptional intermediate, translated by host ribosomes into specific antigen polypeptides. [2 marks]",
        "Intracellular Sensors: Unmodified foreign ssRNA is recognized by pattern-recognition receptors (Toll-like receptors TLR7/8 in endosomes; RIG-I/MDA5 in cytosol). [2 marks]",
        "Consequences: Sensor activation triggers Type I interferon cascades, activating 2'-5'-oligoadenylate synthetase and RNase L, which degrade mRNA and phosphorylate eIF2α to shut down all translation. [2 marks]"
      ]
    },
    plenary: [
      "Congratulations on completing the 2-week Induction and Baseline Diagnostic Unit for OCR Level 3 AAQ Human Biology!",
      "Your refined Mock NEA draft and Diagnostic Competency Profile are now archived in your student portfolio.",
      "Next Unit: Unit F171 Genetics, Gene Expression & Molecular Pathology — beginning with Lesson 1: Phenotypic Variation and Environmental Interactions."
    ]
  }
];
