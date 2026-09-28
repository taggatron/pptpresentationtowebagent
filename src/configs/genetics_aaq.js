export const COURSE_NAME = "OCR Level 3 Cambridge Advanced National (AAQ) in Human Biology - Unit F172: Genetics";
export const NOTEBOOK_URL = "https://notebook.google.com/notebook/d1431642-e474-4174-bdde-740b1fa6e25c";
export const INTRO_VIDEO_URL = NOTEBOOK_URL;
export const OUTPUT_DIR_NAME = "powerpoints_aaq_genetics";
export const CHECKPOINT_FILE_NAME = "checkpoint_aaq_genetics.json";
export const END_LESSON_DEFAULT = 8;
export const DRIVE_FOLDER_NAME = "AAQ Human Biology Genetics";
export const LESSON_LEVEL = "OCR Level 3 Cambridge Advanced National (AAQ) learners";
export const INCLUDE_LESSON1_COURSE_OUTLINE = true;
export const REQUIRE_CONTINUING_CASE_STUDY = true;
export const SELF_CONTAINED_LESSONS = false;
export const STARTER_GRID_MODE = "six-cell-topic";
export const BUILD_ON_PREVIOUS = true;
export const MAXIMIZE_LEARNING_GAMES = true;

export const courseParts = [
  "Part 1: Molecular Foundations, Replication & Expression (Lessons 1–4)",
  "Part 2: Mutation Biology, Monogenic & Cytogenetic Pathology (Lessons 5–8)"
];

export const lessons = [
  {
    number: 1,
    part: 1,
    teacher: "Dan",
    deckId: "Lesson_01_Unit_intro_and_Phenotypic_variation",
    title: "Unit intro & Phenotypic variation",
    focus: "Unit Induction, Phenotypic Variance & Environmental Modifiers",
    deliverable: "Construct biometric variation curves, calculate standard deviation and phenotypic variance (Vp = Vg + Ve), and differentiate continuous vs discontinuous phenotypes.",
    details: "Unit Induction into OCR Cambridge Advanced National (AAQ) Human Biology Unit F172: Genetics. Biological mechanisms governing phenotypic variation: polygenic inheritance involving multiple additive gene loci vs monogenic Mendelian discrete traits. Construction and interpretation of normal distribution Gaussian curves for continuous biometric traits (mean, median, mode, standard deviation, and variance). The fundamental quantitative genetics partitioning equation Vp = Vg + Ve (where total phenotypic variance Vp equals genetic variance Vg plus environmental variance Ve). Environmental influences on gene expression (nutrition, UV exposure, physical stress, epigenetic modifications) leading to phenotypic plasticity. Diagnostic clarification: discrete categories (ABO blood groups, PTC tasting) are determined by single gene loci unaffected by environmental variance, whereas continuous polygenic traits (height, skin pigmentation, systolic blood pressure, forced expiratory volume FEV1) show unbroken gradations shaped by multifactorial interactions.",
    starterQuestions: [
      { q: "What distinguishes continuous from discontinuous phenotypic variation?", a: "Discontinuous variation falls into distinct non-overlapping categories (monogenic); continuous variation shows a smooth numerical spectrum (polygenic + environmental)." },
      { q: "Define phenotypic variance in the equation Vp = Vg + Ve.", a: "Total observed variation (Vp) equals the sum of genetic variance (Vg) and environmental variance (Ve)." },
      { q: "Give one clinical example of a continuous and one of a discontinuous trait in humans.", a: "Continuous: systolic blood pressure, height, or FEV1. Discontinuous: ABO blood group or PTC tasting ability." },
      { q: "What does the standard deviation measure in a biometric dataset?", a: "The spread or dispersion of phenotypic values around the calculated arithmetic mean." },
      { q: "How does polygenic inheritance produce a bell-shaped Gaussian normal distribution?", a: "Multiple gene loci have small, additive effects on the phenotype, producing many intermediate phenotypes and few extreme phenotypes." },
      { q: "Why cannot environmental factors alter an individual's ABO blood group phenotype?", a: "ABO blood group is determined entirely by single-locus Mendelian alleles (IA, IB, IO) with zero environmental variance contribution (Ve = 0)." }
    ],
    objectives: {
      knowledge: "Distinguish between continuous and discontinuous phenotypic variation and explain polygenic inheritance.",
      application: "Apply the variance equation Vp = Vg + Ve to evaluate the relative contributions of genotype and environment to human traits.",
      evaluation: "Evaluate biometric datasets using mean, variance, and standard deviation to assess normal distribution compliance."
    },
    terminology: [
      { term: "Phenotypic Variance (Vp)", def: "The total observable variation of a specific biological trait across a population: Vp = Vg + Ve." },
      { term: "Polygenic Inheritance", def: "A phenotypic characteristic controlled by the additive effects of two or more independent gene loci." },
      { term: "Normal Distribution", def: "A symmetrical bell-shaped probability distribution where mean, median, and mode coincide, typical of continuous traits." },
      { term: "Phenotypic Plasticity", def: "The capacity of a single genotype to produce different phenotypes in response to varying environmental conditions." }
    ],
    theoryPoints: [
      "Genetics Distinctive: Unit F172 bridges molecular nucleic acid architecture directly to clinical pathophysiological outcomes and population genomics.",
      "Quantitative Variance Partitioning: Vp = Vg + Ve. Twin studies and heritability estimates (H^2 = Vg / Vp) benchmark how strongly clinical conditions are inherited.",
      "Continuous vs Discontinuous Traits: Discontinuous traits are discrete, qualitative, and monogenic (e.g. ABO locus). Continuous traits are quantitative, metric, and polygenic.",
      "Normal Distribution Metrics: In a standard normal distribution, ~68.2% of individuals lie within 1 standard deviation of the mean, and ~95.4% lie within 2 standard deviations."
    ],
    workedExample: {
      title: "Biometric Variance Decomposition",
      subtitle: "Partitioning phenotypic variance in human systolic blood pressure",
      steps: [
        { label: "Step 1: Population Sampling", detail: "Measure systolic blood pressure across 1,000 adult subjects under resting baseline conditions." },
        { label: "Step 2: Descriptive Statistics", detail: "Calculate the sample mean (120 mmHg) and standard deviation (s = 12 mmHg, variance s^2 = 144 mmHg^2)." },
        { label: "Step 3: Variance Component Analysis", detail: "Monozygotic and dizygotic twin modeling establishes heritability at 0.50 (Vg = 72 mmHg^2, Ve = 72 mmHg^2)." },
        { label: "Step 4: Clinical Interpretation", detail: "50% of population blood pressure variance is attributable to polygenic risk alleles; 50% is modulated by lifestyle (sodium intake, aerobic exercise, psychological stress)." }
      ]
    },
    hingeQuestions: [
      {
        question: "Which of the following human traits exhibits purely discontinuous variation with zero environmental contribution (Ve = 0)?",
        options: ["Systolic blood pressure", "Resting heart rate", "ABO blood group antigens", "Adult standing height"],
        correctIndex: 2,
        explanation: "ABO blood group is determined strictly by the single ABO gene locus on chromosome 9, with no environmental influence on antigenic expression."
      },
      {
        question: "In a population study of adult human height, what accounts for the smooth bell-shaped normal distribution curve?",
        options: ["A single gene locus undergoing rapid somatic mutation", "Multiple additive gene loci interacting with environmental factors", "Dietary protein intake being the sole determinant of height", "Mitotic nondisjunction during embryonic development"],
        correctIndex: 1,
        explanation: "Continuous phenotypic variation arises because multiple independent gene loci exert small, additive effects on the phenotype alongside environmental nutrition."
      },
      {
        question: "If a biometric trait has a calculated heritability (H^2 = Vg / Vp) of 0.80, what does this indicate?",
        options: ["80% of an individual's trait value comes from genes and 20% from environment", "80% of the population phenotypic variance is attributable to genetic differences", "The trait will be inherited by exactly 80% of offspring", "Environmental interventions can only ever alter 20% of an individual's lifespan"],
        correctIndex: 1,
        explanation: "Heritability measures the proportion of total phenotypic variance across a population that is attributable to genetic variance (Vg / Vp)."
      }
    ],
    examQuestion: {
      question: "A clinical team measures the Forced Expiratory Volume in 1 second (FEV1) across 500 adult patients. The data shows a continuous normal distribution with a mean of 3.2 L and standard deviation of 0.4 L. Explain why FEV1 exhibits continuous rather than discontinuous variation, and describe how the variance equation Vp = Vg + Ve applies to this respiratory parameter. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Continuous Variation Architecture: FEV1 is a quantitative physiological metric controlled by polygenic inheritance (multiple gene loci affecting airway calibre and lung compliance) [2 marks].",
        "Environmental Contribution: Environmental variance (Ve) such as tobacco smoke exposure, airborne particulate pollution, and childhood respiratory infections directly modifies lung capacity [2 marks].",
        "Variance Equation Application: Vp = Vg + Ve partitions observed variance; 68% of the cohort lies between 2.8 L and 3.6 L (within 1 SD), illustrating how polygenic additive alleles and lifestyle interact [2 marks]."
      ]
    },
    plenary: [
      "Phenotypic variation is the outward manifestation of molecular genetics interacting with environmental exposures.",
      "Master the distinction between discrete monogenic traits and continuous polygenic distributions.",
      "Next Lesson: DNA structure, telomeres & replication — the chemical blueprint and the enzymatic choreography of nucleic acid duplication."
    ]
  },
  {
    number: 2,
    part: 1,
    teacher: "Dan",
    deckId: "Lesson_02_DNA_structure_telomeres_and_replication",
    title: "DNA structure, telomeres & replication",
    focus: "Nucleic Acid Ultrastructure, Semiconservative Replication & Replicative Senescence",
    deliverable: "Diagram the 5' to 3' replication fork showing leading/lagging strand enzyme coordination, and model the end-replication problem and telomere attrition in cellular ageing.",
    details: "Molecular ultrastructure of deoxyribonucleic acid (DNA): antiparallel double helix configuration, 5' to 3' polarity determined by carbon numbering of deoxyribose sugar, esterification of phosphate groups forming 3'-5' phosphodiester bonds, purine-pyrimidine Watson-Crick complementary base pairing (Adenine=Thymine with 2 hydrogen bonds, Guanine=Cytosine with 3 hydrogen bonds). Semiconservative replication mechanism: Meselson-Stahl density gradient proof (15N vs 14N isotopes). Coordinated enzymatic machinery at the replication fork: DNA helicase unwinding and unzipping parental strands; single-stranded binding proteins (SSBs) preventing reannealing; topoisomerase/DNA gyrase relieving torsional supercoiling; RNA primase synthesising short RNA primers; DNA polymerase III/delta/epsilon synthesising nascent DNA exclusively in the 5' to 3' direction (continuous leading strand synthesis vs discontinuous lagging strand Okazaki fragments); DNA polymerase I removing RNA primers and proofreading with 3'-to-5' exonuclease activity; DNA ligase catalysing phosphodiester linkages between fragments. The eukaryotic end-replication problem: inability of DNA polymerase to replicate the lagging strand 5' terminus after primer excision, leading to progressive shortening of hexameric repeats (TTAGGG) at telomeres. Telomere capping by shelterin complexes, critical Hayflick limit (~50 divisions), activation of p53/p21 checkpoint signalling, and cellular senescence vs immortalisation via human telomerase reverse transcriptase (hTERT) reactivation in stem cells and oncology.",
    starterQuestions: [
      { q: "What chemical bond links adjacent nucleotides within a single DNA polynucleotide strand?", a: "A 3'-5' phosphodiester bond between the 3' hydroxyl group of one deoxyribose and the 5' phosphate of the next." },
      { q: "Why are the two polynucleotide chains in double-stranded DNA described as antiparallel?", a: "One strand runs in the 5' to 3' direction, while the complementary antiparallel strand runs in the 3' to 5' direction." },
      { q: "State the number of hydrogen bonds between A-T and G-C base pairs.", a: "A-T pairs have 2 hydrogen bonds; G-C pairs have 3 hydrogen bonds." },
      { q: "Which enzyme synthesizes RNA primers required to initiate DNA synthesis?", a: "RNA primase." },
      { q: "Why is the lagging strand synthesized discontinuously as Okazaki fragments?", a: "DNA polymerase can only synthesize in the 5' to 3' direction, requiring backward synthesis away from the advancing replication fork." },
      { q: "What repetitive nucleotide sequence comprises human telomeres?", a: "TTAGGG tandem repeats." }
    ],
    objectives: {
      knowledge: "Describe the chemical architecture of DNA nucleotides, antiparallel strands, and complementary base pairing.",
      application: "Sequence the coordinated enzymatic steps of semiconservative replication at leading and lagging strands.",
      evaluation: "Evaluate the eukaryotic end-replication problem, telomere attrition, and the cellular consequences of the Hayflick limit."
    },
    terminology: [
      { term: "Phosphodiester Bond", def: "Covalent linkage between the 3' carbon of one deoxyribose and the 5' carbon of an adjacent sugar via a phosphate group." },
      { term: "Semiconservative Replication", def: "DNA duplication where each daughter double helix contains one intact parental template strand and one newly synthesized strand." },
      { term: "Okazaki Fragment", def: "Short segment of nascent DNA synthesized discontinuously on the lagging template strand during replication." },
      { term: "Telomere Attrition", def: "Progressive shortening of chromosome-end hexameric repeats (TTAGGG) with each round of somatic cell division." }
    ],
    theoryPoints: [
      "Antiparallel Polarity: Nucleic acid synthesis is strictly unidirectional: DNA polymerases require a free 3'-OH group to attach the alpha-phosphate of incoming dNTPs.",
      "Replication Machinery: Helicase unwinds, Topoisomerase relieves supercoils, Primase lays RNA primers, DNA Polymerase extends, and Ligase seals nicks.",
      "The End-Replication Problem: Removal of the terminal RNA primer on the lagging strand leaves an unreplicated 5' gap that cannot be extended, causing chromosome shortening.",
      "Replicative Senescence: When telomeres erode to a critical threshold (~4-5 kb), uncapped chromosomal ends activate a DNA damage response triggering p53-dependent growth arrest (Hayflick limit)."
    ],
    workedExample: {
      title: "Replication Fork Enzymatic Sequence",
      subtitle: "Tracing leading vs lagging strand synthesis step-by-step",
      steps: [
        { label: "Step 1: Strand Separation", detail: "DNA helicase breaks hydrogen bonds at the replication origin; topoisomerase relieves torsional strain ahead of the fork." },
        { label: "Step 2: Primer Annealing", detail: "RNA primase synthesizes a 10-12 nt RNA primer providing an essential free 3'-OH group." },
        { label: "Step 3: Continuous Leading Strand Extension", detail: "DNA polymerase extends continuously in the 5' to 3' direction toward the replication fork." },
        { label: "Step 4: Discontinuous Lagging Strand Synthesis", detail: "DNA polymerase synthesizes Okazaki fragments away from the fork; DNA pol I removes primers, and DNA ligase seals phosphodiester nicks." }
      ]
    },
    hingeQuestions: [
      {
        question: "Why does DNA polymerase require an RNA primer to initiate DNA synthesis?",
        options: ["It can only bind to double-stranded RNA", "It cannot initiate synthesis de novo; it requires a pre-existing 3'-OH group to attach incoming dNTPs", "RNA primers provide the ATP required for unwinding the double helix", "RNA primers prevent the DNA strands from re-annealing"],
        correctIndex: 1,
        explanation: "DNA polymerases cannot initiate polynucleotide synthesis de novo; they strictly require a free 3' hydroxyl group provided by an RNA primer."
      },
      {
        question: "What is the primary cellular consequence of somatic cells reaching the Hayflick limit?",
        options: ["Immediate cell lysis and necrosis", "Reactivation of hTERT leading to spontaneous pluripotency", "Irreversible cell cycle arrest (replicative senescence) driven by telomere erosion", "Transformation into malignant metastatic carcinoma"],
        correctIndex: 2,
        explanation: "The Hayflick limit represents the finite replicative capacity of human somatic cells, resulting in permanent cell cycle arrest (senescence) as telomeres critically shorten."
      },
      {
        question: "Which enzyme is responsible for catalyzing the final phosphodiester bond that joins Okazaki fragments on the lagging strand?",
        options: ["DNA helicase", "DNA ligase", "RNA primase", "Topoisomerase II"],
        correctIndex: 1,
        explanation: "DNA ligase seals nicks in the sugar-phosphate backbone by catalysing phosphodiester bond formation between adjacent Okazaki fragments."
      }
    ],
    examQuestion: {
      question: "Explain why DNA replication on the lagging strand is discontinuous, and evaluate why eukaryotic chromosomes shorten with progressive cell divisions in somatic tissues. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Lagging Strand Discontinuity: The antiparallel nature of DNA means the lagging template runs 5' to 3'; DNA polymerase can only synthesize in the 5' to 3' direction, necessitating discontinuous synthesis in Okazaki fragments away from the fork [3 marks].",
        "End-Replication Problem: When the terminal RNA primer on the lagging strand 5' end is removed, no upstream 3'-OH exists for DNA polymerase to fill the gap [2 marks].",
        "Telomere Erosion & Senescence: Somatic cells lack telomerase; progressive loss of TTAGGG repeats eventually triggers the Hayflick limit and replicative senescence [1 mark]."
      ]
    },
    plenary: [
      "DNA replication is a high-fidelity molecular machine that duplicates 3 billion base pairs with less than 1 error per 10^9 nucleotides.",
      "Telomere attrition acts as a biological clock limiting human somatic replicative lifespan.",
      "Next Lesson: The Central Dogma — how the genetic code directs protein synthesis and the energetic cost of biosynthesis."
    ]
  },
  {
    number: 3,
    part: 1,
    teacher: "Matt",
    deckId: "Lesson_03_The_Central_Dogma",
    title: "The Central Dogma",
    focus: "Directional Flow of Genetic Information, Ribosomal Architecture & Energetic Cost of Biosynthesis",
    deliverable: "Trace the sequential molecular pathway from genomic DNA code to functional tertiary polypeptide, calculating high-energy ATP/GTP phosphoanhydride bond consumption at each biosynthetical checkpoint.",
    details: "Crick's Central Dogma: directional transfer of sequence information from DNA -> RNA -> Protein, with molecular irreversibility (information cannot flow back from protein to nucleic acid). Nuclear transcription: RNA polymerase II holoenzyme binding to the core promoter, template (antisense) strand reading in 3' to 5' direction to synthesize pre-mRNA in 5' to 3' direction. Post-transcriptional nuclear processing in human eukaryotes: 7-methylguanosine (m7G) 5' capping (protecting from 5' exonucleases and facilitating eIF4E ribosome binding), 3' cleavage and polyadenylation (200-250 Adenine tail via poly-A polymerase), and spliceosome-mediated intron excision via lariat formation. Alternative splicing mechanisms enabling a single pre-mRNA to yield diverse protein isoforms (proteomic diversity vs gene count paradox). Cytosolic translation on 80S ribosomes (60S large subunit with peptidyl transferase ribozyme activity and aminoacyl [A], peptidyl [P], and exit [E] sites; 40S small subunit scanning for Kozak consensus / AUG start codon). Universal triplet code: non-overlapping, degenerate (wobble hypothesis at codon base 3), comma-less. The critical thermodynamic energetic cost of biosynthesis: aminoacyl-tRNA synthetase consuming ATP to form high-energy aminoacyl-AMP intermediate (ATP -> AMP + PPi, equivalent to 2 high-energy phosphate bonds), initiation factor eIF2 consuming GTP, elongation factor eEF1A consuming 1 GTP per cognate tRNA delivery, and elongation factor eEF2 consuming 1 GTP per ribosomal translocation step (~4 ATP/GTP equivalents per peptide bond). Co-translational and post-translational folding in the endoplasmic reticulum and Golgi apparatus.",
    starterQuestions: [
      { q: "State the directional flow of genetic information defined by the Central Dogma.", a: "DNA -> transcription -> RNA -> translation -> Protein." },
      { q: "What is the function of the 5' 7-methylguanosine cap added to pre-mRNA?", a: "Protects mRNA from 5' exonucleolytic degradation and serves as the binding recognition site for eukaryotic translation initiation factor eIF4E." },
      { q: "Why is the genetic code described as 'degenerate'?", a: "Multiple distinct triplet codons can encode the same specific amino acid (e.g. 6 different codons encode leucine)." },
      { q: "Identify the three functional tRNA-binding sites on the 60S eukaryotic ribosomal subunit.", a: "A site (aminoacyl), P site (peptidyl), and E site (exit)." },
      { q: "Which cellular enzyme family charges tRNAs with their cognate amino acids?", a: "Aminoacyl-tRNA synthetases." },
      { q: "Approximately how many high-energy phosphate bonds (ATP/GTP) are consumed per peptide bond formed?", a: "Approximately 4 ATP/GTP equivalents (2 ATP for tRNA charging, 1 GTP for EF-1A binding, 1 GTP for EF-2 translocation)." }
    ],
    objectives: {
      knowledge: "Explain the directional flow of the Central Dogma and the molecular steps of transcription, RNA processing, and translation.",
      application: "Calculate the energetic cost of protein biosynthesis in terms of ATP and GTP phosphoanhydride bond consumption.",
      evaluation: "Evaluate how alternative splicing resolves the paradox between the ~20,000 human genes and the >100,000 distinct functional proteins."
    },
    terminology: [
      { term: "Central Dogma", def: "The fundamental biological principle that genetic information flows directionally from DNA to RNA to functional protein." },
      { term: "Spliceosome", def: "A dynamic ribonucleoprotein complex of snRNAs and proteins that excises non-coding introns and splices exons in pre-mRNA." },
      { term: "Aminoacyl-tRNA Synthetase", def: "Enzyme that couples a specific amino acid to its cognate tRNA via an ATP-dependent esterification reaction." },
      { term: "Energetic Cost of Translation", def: "The thermodynamic expenditure of ~4 high-energy phosphate bonds (ATP/GTP) required for each peptide bond synthesized." }
    ],
    theoryPoints: [
      "Informational Irreversibility: Sequence information can be transferred from nucleic acid to protein, but never reverse-translated from protein sequence into nucleic acid.",
      "Pre-mRNA Maturation: Human pre-mRNA undergoes 5' m7G capping, spliceosomal intron removal, and 3' polyadenylation before nuclear pore export.",
      "Alternative Splicing: Exon skipping and alternative splice sites allow single pre-mRNAs to generate diverse tissue-specific protein isoforms.",
      "Biosynthetic Energetics: Protein synthesis is the single most endergonic process in living human cells, accounting for up to 50% of basal metabolic ATP consumption in actively growing cells."
    ],
    workedExample: {
      title: "Energetic Accounting of Biosynthesis",
      subtitle: "Calculating high-energy phosphate bonds required to synthesize a 100-amino-acid peptide",
      steps: [
        { label: "Step 1: tRNA Activation (Charging)", detail: "100 amino acids charged by aminoacyl-tRNA synthetases: 100 x 2 ATP equivalents (ATP -> AMP + PPi) = 200 ATP." },
        { label: "Step 2: Translation Initiation", detail: "eIF2-GTP binary complex binds Met-tRNA to 40S subunit: 1 GTP = 1 high-energy bond." },
        { label: "Step 3: Ribosomal Elongation", detail: "99 peptide bonds formed; each requires 1 GTP for eEF1A delivery + 1 GTP for eEF2 translocation = 99 x 2 = 198 GTP." },
        { label: "Step 4: Translation Termination", detail: "eRF1/eRF3-mediated polypeptide release consumes 1 GTP = 1 high-energy bond. Total cost: 400 high-energy phosphate bonds (4 per residue)." }
      ]
    },
    hingeQuestions: [
      {
        question: "Why does the human genome containing only ~20,000 protein-coding genes produce over 100,000 distinct cellular proteins?",
        options: ["DNA polymerase introduces programmed mutations into every transcribed gene", "Alternative splicing of pre-mRNA transcripts enables multiple mature mRNA isoforms from a single gene", "Ribosomes randomly substitute amino acids during translation", "Mitochondria duplicate human genes inside the cytosol"],
        correctIndex: 1,
        explanation: "Alternative splicing allows differential inclusion and exclusion of exons, enabling a single pre-mRNA transcript to generate multiple distinct functional protein isoforms."
      },
      {
        question: "During ribosomal translation, what directly drives the translocation of the ribosome along the mRNA from codon to codon?",
        options: ["Passive diffusion of water molecules", "Hydrolysis of GTP by elongation factor eEF2", "Cleavage of the 5' cap by exonucleases", "Direct electrical impulses from the mitochondrial membrane"],
        correctIndex: 1,
        explanation: "Ribosomal translocation is an active, endergonic process driven by the GTPase activity of eukaryotic elongation factor 2 (eEF2)."
      },
      {
        question: "What is the primary thermodynamic reason that amino acid activation requires the conversion of ATP to AMP and pyrophosphate (PPi)?",
        options: ["Pyrophosphate hydrolysis drives the reaction forward with strong negative Delta G, creating a high-energy ester linkage", "AMP is incorporated directly into the growing polypeptide chain", "ATP hydrolysis is required to unwind the mRNA secondary structure", "Pyrophosphate acts as a competitive inhibitor of the ribosome"],
        correctIndex: 0,
        explanation: "Subsequent hydrolysis of pyrophosphate (PPi -> 2 Pi) by inorganic pyrophosphatase makes the aminoacylation reaction thermodynamically irreversible."
      }
    ],
    examQuestion: {
      question: "Explain the sequential pathway by which a nuclear gene is transcribed and translated into a functional enzyme, and evaluate why protein synthesis represents a major energetic burden on cellular metabolism. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Transcription & Processing: RNA polymerase II synthesizes pre-mRNA; 5' capping, spliceosomal intron excision, and 3' polyadenylation produce mature mRNA exported to cytosol [2 marks].",
        "Ribosomal Translation: 80S ribosome coordinates aminoacyl-tRNA binding at A-site, peptidyl transferase peptide bond formation at P-site, and translocation [2 marks].",
        "Energetic Cost: High thermodynamic demand: amino acid activation consumes 2 ATP equivalents, while elongation requires 2 GTP per peptide bond (~4 high-energy bonds per residue), consuming a substantial fraction of basal ATP [2 marks]."
      ]
    },
    plenary: [
      "The Central Dogma establishes the directional execution of genomic blueprints into living biochemical reality.",
      "Protein synthesis is an energetically demanding process driven by coordinated ATP and GTP hydrolysis.",
      "Next Lesson: Gene expression & transcriptional regulation — how cells selectively turn genes on and off using transcription factors and epigenetics."
    ]
  },
  {
    number: 4,
    part: 1,
    teacher: "Matt",
    deckId: "Lesson_04_Gene_expression_and_transcriptional_regulation",
    title: "Gene expression & transcriptional regulation",
    focus: "Promoter Architecture, Transcription Factor Networks & Epigenetic Chromatin Remodelling",
    deliverable: "Map the assembly of the pre-initiation complex at eukaryotic promoters and analyse how distal enhancers, silencers, and epigenetic histone modifications regulate cell-type-specific gene expression.",
    details: "Differential gene expression in multicellular human organisms: why identical genomic DNA yields phenotypically distinct cell lineages (e.g. hepatocytes vs neurons). Eukaryotic promoter architecture: core promoter elements (TATA box at -25 to -30 bp, Initiator element Inr, downstream promoter element DPE) recognised by General Transcription Factors (TFIID containing TATA-binding protein TBP, TFIIB, TFIIE, TFIIH possessing helicase and kinase activity to phosphorylate RNA Pol II CTD). Proximal promoter elements: CAAT box and GC box binding regulatory transcription factors. Distal cis-regulatory elements: enhancers (binding transcriptional activators) and silencers (binding transcriptional repressors) operating across megabase distances via chromatin looping mediated by cohesin and the multi-subunit Mediator coactivator complex. Epigenetic regulation of chromatin architecture: heterochromatin (dense, transcriptionally silent) vs euchromatin (relaxed, transcriptionally permissive). Histone post-translational modifications: Histone Acetyltransferases (HATs) adding acetyl groups to basic lysine residues to neutralize positive charge and open chromatin; Histone Deacetylases (HDACs) restoring compaction. DNA cytosine methylation at CpG islands via DNA methyltransferases (DNMTs) enforcing stable gene silencing (e.g. genomic imprinting and X-chromosome inactivation). Physiological transcriptional response elements: nuclear hormone receptors (oestrogen, glucocorticoid receptors translocating to nucleus) and hypoxia-inducible factor 1 (HIF-1alpha) stabilizing under cellular hypoxia to activate erythropoietin (EPO) and VEGF transcription.",
    starterQuestions: [
      { q: "What is the primary core promoter element located ~25–30 base pairs upstream of eukaryotic transcription start sites?", a: "The TATA box (consensus sequence TATAAA)." },
      { q: "Which general transcription factor directly binds to the TATA box via its TBP subunit?", a: "TFIID (Transcription Factor II D)." },
      { q: "How do distal enhancers communicate with promoters located thousands of base pairs away?", a: "Through DNA looping facilitated by architectural protein complexes (cohesin) and the multi-subunit Mediator complex." },
      { q: "What chemical modification to histone lysine residues promotes an open, transcriptionally active chromatin state?", a: "Histone acetylation (catalyzed by Histone Acetyltransferases / HATs)." },
      { q: "What is the typical consequence of cytosine hypermethylation at gene promoter CpG islands?", a: "Long-term transcriptional repression (gene silencing)." },
      { q: "Name a physiological transcription factor stabilized under low oxygen conditions to activate EPO and VEGF expression.", a: "Hypoxia-Inducible Factor 1-alpha (HIF-1alpha)." }
    ],
    objectives: {
      knowledge: "Describe core promoter architecture, general transcription factors, and the pre-initiation complex.",
      application: "Explain how distal enhancers, silencers, and DNA looping achieve tissue-specific gene regulation.",
      evaluation: "Evaluate the role of epigenetic modifications (histone acetylation vs DNA methylation) in controlling chromatin accessibility."
    },
    terminology: [
      { term: "Core Promoter", def: "The minimal genomic region (~50 bp around the TSS) required for pre-initiation complex assembly and baseline transcription." },
      { term: "Enhancer", def: "A distal cis-regulatory DNA sequence that binds transcriptional activators to dramatically increase transcription rates." },
      { term: "Histone Acetylation", def: "Enzymatic addition of acetyl groups to lysine residues, neutralising positive charges and relaxing chromatin into euchromatin." },
      { term: "CpG Island Methylation", def: "Addition of methyl groups to cytosine bases in CpG dinucleotides near promoters, recruiting repressors to silence transcription." }
    ],
    theoryPoints: [
      "Cellular Specialization: All nucleated human cells share identical genomes; lineage identity is governed entirely by selective transcriptional regulation.",
      "Pre-Initiation Complex Assembly: Stepwise recruitment of TFIID, TFIIA, TFIIB, TFIIF, RNA Pol II, TFIIE, and TFIIH (which phosphorylates the Pol II C-terminal domain).",
      "Epigenetic Plasticity: Unlike permanent genetic mutations, epigenetic marks (acetylation, methylation) are dynamic and respond to physiological cues and environmental lifestyle factors.",
      "Clinical Therapeutics: Epigenetic drugs like HDAC inhibitors (e.g. vorinostat) and DNA methyltransferase inhibitors (e.g. azacitidine) are licensed oncology therapies."
    ],
    workedExample: {
      title: "Transcriptional Activation Mechanism",
      subtitle: "Molecular cascade of Hypoxia-Inducible Factor 1 (HIF-1) activation",
      steps: [
        { label: "Step 1: Normoxic Hydroxylation", detail: "Under normal O2 levels, prolyl hydroxylases hydroxylate HIF-1alpha, targeting it for VHL-mediated ubiquitination and proteasomal degradation." },
        { label: "Step 2: Hypoxic Stabilization", detail: "In cellular hypoxia, prolyl hydroxylases lack O2 cofactor; HIF-1alpha stabilizes and translocates into the nucleus." },
        { label: "Step 3: Dimerization & Binding", detail: "HIF-1alpha heterodimerizes with HIF-1beta and binds Hypoxia Response Elements (HRE: 5'-RCGTG-3') in target gene promoters." },
        { label: "Step 4: Target Gene Induction", detail: "Recruits p300/CBP coactivators and RNA Pol II to massively upregulate erythropoietin (EPO) and VEGF to restore oxygen delivery." }
      ]
    },
    hingeQuestions: [
      {
        question: "How does histone acetylation by Histone Acetyltransferases (HATs) stimulate gene transcription?",
        options: ["It removes thymine bases from the promoter", "It neutralizes the positive charge on basic lysine tails, reducing affinity for negatively charged DNA and opening chromatin into euchromatin", "It permanently cleaves the DNA double helix", "It recruits DNA methyltransferases to silence the gene"],
        correctIndex: 1,
        explanation: "By neutralizing the positive charge on histone lysine residues, acetylation weakens histone-DNA ionic interactions, relaxing chromatin into an accessible euchromatin state."
      },
      {
        question: "Which component of the eukaryotic pre-initiation complex possesses kinase activity that phosphorylates the C-terminal domain (CTD) of RNA Polymerase II to initiate promoter clearance?",
        options: ["TATA-binding protein (TBP)", "TFIIB", "TFIIH", "Cohesin"],
        correctIndex: 2,
        explanation: "TFIIH contains kinase and helicase subunits that phosphorylate serine residues on the CTD of RNA Polymerase II, releasing it from the promoter to begin elongation."
      },
      {
        question: "What is the primary function of the multi-protein Mediator complex in transcriptional regulation?",
        options: ["Splicing introns out of mature mRNA", "Bridging distal enhancer-bound activator proteins to the promoter-bound pre-initiation complex via DNA loops", "Degrading misfolded proteins in the cytosol", "Replicating telomeric repeat sequences"],
        correctIndex: 1,
        explanation: "The Mediator complex serves as a massive molecular bridge transmitting regulatory signals from distal enhancer-bound activators to RNA Polymerase II at the promoter."
      }
    ],
    examQuestion: {
      question: "Contrast the mechanisms by which transcription factors and epigenetic modifications regulate gene expression in human tissues, and explain how abnormal promoter hypermethylation can lead to oncogenesis. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Transcription Factor Regulation: Sequence-specific DNA-binding proteins bind promoters/enhancers to recruit or block RNA Polymerase II pre-initiation complex assembly [2 marks].",
        "Epigenetic Chromatin Remodelling: Histone modifications (acetylation by HATs/HDACs) and DNA methylation modulate chromatin accessibility without changing DNA base sequence [2 marks].",
        "Oncogenesis via Hypermethylation: In malignant cells, aberrant hypermethylation of CpG islands in tumour suppressor promoters (e.g. BRCA1, p16INK4a) recruits methyl-binding proteins and HDACs, silencing tumour suppressor transcription and permitting unregulated cell division [2 marks]."
      ]
    },
    plenary: [
      "Transcriptional regulation determines cell identity: the same 3-billion-base genome creates over 200 distinct specialised human cell types.",
      "Chromatin accessibility, promoter architecture, and distal enhancers form a multi-layered regulatory circuit.",
      "Next Lesson: Gene mutations: acquired and inherited — the molecular origins of genetic variation and human disease."
    ]
  },
  {
    number: 5,
    part: 2,
    teacher: "Dan",
    deckId: "Lesson_05_Gene_mutations_acquired_and_inherited",
    title: "Gene mutations: acquired and inherited",
    focus: "Mutational Mechanisms, Mutagenic Carcinogens & DNA Repair Pathology",
    deliverable: "Classify DNA sequence alterations by molecular type and functional consequence, evaluate endogenous vs exogenous mutagens, and contrast somatic oncogenic mutations with inherited germline transmission.",
    details: "Molecular taxonomy of DNA mutations: Point mutations / Single Nucleotide Variations (SNVs) categorized as transitions (purine <-> purine or pyrimidine <-> pyrimidine) vs transversions (purine <-> pyrimidine). Functional coding consequences: Silent mutations (synonymous codon change due to genetic code degeneracy), Missense mutations (amino acid substitution, conservative vs non-conservative altering active site stereochemistry or charge), Nonsense mutations (premature termination codon UAA/UAG/UGA causing truncated non-functional proteins and nonsense-mediated mRNA decay). Indels (insertions or deletions) of non-triplet base counts causing catastrophically disruptive frameshift mutations downstream. Etiology of mutations: endogenous errors (tautomeric shifts, oxidative stress from reactive oxygen species ROS, spontaneous cytosine deamination to uracil, depurination) vs exogenous mutagenic agents. Physical mutagens: ultraviolet radiation (UV-B inducing covalent cyclobutane pyrimidine dimers and 6-4 photoproducts) and ionizing radiation (alpha, beta, gamma, X-rays generating double-strand breaks). Chemical mutagens: intercalating agents (ethidium bromide), alkylating agents (nitrosamines), and reactive metabolites (benzo[a]pyrene in cigarette smoke forming bulky guanine adducts). Surveillance and DNA repair pathways: Base Excision Repair (BER via DNA glycosylases), Nucleotide Excision Repair (NER via endonuclease excision), and Mismatch Repair (MMR via MSH2/MLH1). Disease pathology of repair failure: Xeroderma Pigmentosum (NER defect causing extreme skin cancer vulnerability) and Lynch syndrome (MMR defect causing hereditary non-polyposis colorectal cancer). Critical clinical distinction: Germline mutations occurring in gametes/meiotic germ cells (present in every zygotic descendant cell, inherited across generations) vs Somatic acquired mutations occurring in differentiated somatic cells (confined to tissue lineage, not heritable to offspring, driving neoplastic transformation).",
    starterQuestions: [
      { q: "What is the difference between a missense mutation and a nonsense mutation?", a: "A missense mutation substitutes one amino acid for another; a nonsense mutation introduces a premature stop codon, terminating translation." },
      { q: "Why does an insertion of 2 base pairs cause more severe disruption than an insertion of 3 base pairs?", a: "2 bp disrupts the triplet reading frame (frameshift) altering all downstream amino acids; 3 bp adds exactly one amino acid without shifting the frame." },
      { q: "Name the specific lesion induced in DNA by ultraviolet (UV-B) radiation.", a: "Covalent cyclobutane pyrimidine dimers (e.g. thymine-thymine dimers)." },
      { q: "What repair pathway recognizes and repairs bulky helix-distorting DNA adducts?", a: "Nucleotide Excision Repair (NER)." },
      { q: "Explain the difference in transmission between a germline and a somatic mutation.", a: "Germline mutations occur in gametes and are inherited by offspring; somatic mutations occur in body tissues, are not heritable, and drive cancer." },
      { q: "Which clinical condition results from inherited defects in Nucleotide Excision Repair (NER)?", a: "Xeroderma Pigmentosum (extreme UV sensitivity and severe skin cancer predisposition)." }
    ],
    objectives: {
      knowledge: "Classify point mutations (silent, missense, nonsense) and frameshift insertions/deletions.",
      application: "Differentiate endogenous vs exogenous mutagenic mechanisms and their corresponding cellular repair pathways.",
      evaluation: "Evaluate the clinical and evolutionary implications of somatic mutations in oncogenesis versus germline mutations in inherited disorders."
    },
    terminology: [
      { term: "Missense Mutation", def: "A single nucleotide substitution that changes a codon to encode a different amino acid." },
      { term: "Frameshift Mutation", def: "An insertion or deletion of nucleotides not divisible by 3, altering the triplet reading frame for all downstream codons." },
      { term: "Nucleotide Excision Repair (NER)", def: "Enzymatic pathway that excises and resynthesizes oligonucleotides containing bulky helix-distorting DNA lesions." },
      { term: "Germline vs Somatic", def: "Germline mutations occur in gamete-producing cells and pass to offspring; somatic mutations are confined to non-reproductive tissues." }
    ],
    theoryPoints: [
      "Codon Vulnerability: Because the genetic code is triplet-based, non-multiple-of-three indels completely change the downstream peptide sequence and almost always introduce premature stop codons.",
      "Mutagen Signatures: Different mutagens leave distinct genomic signatures (e.g. UV causes C->T transitions at dipyrimidine sites; tobacco carcinogens cause G->T transversions).",
      "DNA Repair Fidelity: Cells possess specialised repair systems: BER fixes damaged individual bases, NER removes bulky adducts, and MMR corrects post-replication mismatches.",
      "Cancer Driver Mutations: Somatic accumulation of mutations in proto-oncogenes (gain of function) and tumour suppressor genes (loss of function) drives multistep carcinogenesis."
    ],
    workedExample: {
      title: "Mutational Consequence Analysis",
      subtitle: "Tracing the impact of different point mutations in the beta-globin gene",
      steps: [
        { label: "Step 1: Wild-type Sequence", detail: "Codon 6: GAG encodes hydrophilic Glutamic Acid on the surface of the beta-globin subunit." },
        { label: "Step 2: Missense Mutation (Sickle Cell)", detail: "GAG -> GTG transversion substitutes non-polar, hydrophobic Valine, creating a hydrophobic patch that polymerises under deoxygenation." },
        { label: "Step 3: Nonsense Mutation (beta-Thalassaemia)", detail: "AAG -> UAG substitution at codon 39 introduces a premature stop codon, terminating translation and eliminating beta-globin production." },
        { label: "Step 4: Clinical Contrast", detail: "The missense mutation produces a defective structural protein (HbS); the nonsense mutation causes complete absence of the protein chain." }
      ]
    },
    hingeQuestions: [
      {
        question: "A single nucleotide substitution changes a codon from UAC (Tyrosine) to UAA. What type of mutation has occurred and what is the likely functional outcome?",
        options: ["Silent mutation; normal functional enzyme is produced", "Missense mutation; enzyme has slightly reduced substrate affinity", "Nonsense mutation; translation terminates prematurely producing a non-functional truncated polypeptide", "Frameshift mutation; reading frame is completely scrambled"],
        correctIndex: 2,
        explanation: "UAA is a stop codon. A substitution generating a stop codon is a nonsense mutation, causing premature termination and severe loss of protein function."
      },
      {
        question: "Why do somatic mutations acquired in epidermal keratinocytes never pass to an individual's biological children?",
        options: ["Epidermal mutations are automatically repaired during meiosis", "Somatic cells do not contribute genetic material to gametes (sperm or ova)", "UV light cannot penetrate into cellular DNA", "Mitochondrial DNA replaces nuclear DNA in reproductive cells"],
        correctIndex: 1,
        explanation: "Only mutations present in meiotic germline cells (sperm and ova) can be transmitted to offspring; somatic mutations remain confined to the individual's body tissues."
      },
      {
        question: "Patients with Xeroderma Pigmentosum possess a hereditary deficiency in Nucleotide Excision Repair (NER). Which environmental mutagen poses the greatest clinical threat to these individuals?",
        options: ["Dietary trans-saturated fats", "Solar ultraviolet radiation (UV-B)", "Cosmic microwave background radiation", "Diagnostic ultrasound scans"],
        correctIndex: 1,
        explanation: "NER is the sole human pathway that repairs UV-induced cyclobutane pyrimidine dimers; without functional NER, UV exposure leads to catastrophic mutational loads and early skin cancer."
      }
    ],
    examQuestion: {
      question: "Differentiate between point mutations and frameshift mutations at the molecular level, and evaluate why inherited germline mutations in DNA repair genes (such as MSH2 in Lynch syndrome) dramatically elevate lifetime cancer risk. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Point vs Frameshift Molecular Contrast: Point mutations involve a single base substitution (silent, missense, nonsense); frameshifts involve indels not divisible by 3, altering every downstream codon reading frame and causing premature truncation [3 marks].",
        "DNA Repair Gene Failure: In Lynch syndrome, an inherited germline defect in Mismatch Repair (e.g. MSH2, MLH1) compromises post-replication proofreading [1 mark].",
        "Cancer Cascade: Loss of the second normal allele in somatic cells leads to hypermutation ('mutator phenotype'), accelerating the accumulation of driver mutations in oncogenes and tumour suppressors (APC, TP53), leading to early-onset colorectal carcinoma [2 marks]."
      ]
    },
    plenary: [
      "Mutations are the raw material of evolution but the direct driver of genetic disease and cancer.",
      "The consequences of a mutation depend strictly on its molecular class, reading frame impact, and whether it arises in the germline or soma.",
      "Next Lesson: Genetic disorders: single gene disorders — in-depth clinical pathology of Cystic Fibrosis and Sickle Cell Anaemia."
    ]
  },
  {
    number: 6,
    part: 2,
    teacher: "Dan",
    deckId: "Lesson_06_Genetic_disorders_single_gene_disorders",
    title: "Genetic disorders: single gene disorders",
    focus: "Monogenic Mendelian Inheritance, Pathophysiology of CFTR & Haemoglobinopathy",
    deliverable: "Construct clinical pedigree trees with Bayesian risk probabilities, and map the molecular-to-clinical pathophysiological cascades of Cystic Fibrosis (Delta F508) and Sickle Cell Anaemia (HbS).",
    details: "Principles of Monogenic Mendelian inheritance in clinical genetics: autosomal recessive, autosomal dominant (e.g. Huntington's chorea, Marfan syndrome), and X-linked recessive (e.g. Duchenne muscular dystrophy, Haemophilia A). Pedigree chart analysis, Punnett squares, and carrier risk probability calculations. In-depth clinical pathology case study 1 — Cystic Fibrosis: Autosomal recessive disorder located on chromosome 7q31.2. The CFTR gene encodes an ATP-binding cassette (ABC) transporter functioning as a cAMP-regulated chloride and thiocyanate ion channel across apical epithelial membranes. Molecular pathology of the predominant Delta F508 mutation: in-frame deletion of 3 base pairs (CTT) encoding phenylalanine at position 508, leading to misfolded CFTR protein trapped in the endoplasmic reticulum and degraded by the ubiquitin-proteasome system (class II defect). Downstream systemic pathophysiology: impaired chloride and water secretion with hyper-absorption of sodium via ENaC channels; accumulation of dehydrated, hyper-viscous mucus in the respiratory tract (impaired mucociliary clearance, chronic endobronchial infection with Pseudomonas aeruginosa, bronchiectasis); exocrine pancreatic duct obstruction (malabsorption of fat-soluble vitamins A, D, E, K, pancreatic insufficiency); and congenital bilateral absence of vas deferens (CBAVD) causing male infertility. Diagnostic testing: immunoreactive trypsinogen (IRT) newborn blood spot screening, quantitative pilocarpine iontophoresis sweat test (Cl- > 60 mmol/L), and targeted CFTR mutation panel PCR. In-depth clinical pathology case study 2 — Sickle Cell Anaemia: Autosomal recessive haemoglobinopathy located on chromosome 11p15.5. The HBB gene single point mutation GAG -> GTG at codon 6 substitutes hydrophilic glutamic acid with hydrophobic valine (beta-S chain). Molecular pathology: in deoxygenated states, hydrophobic valine fits into a complementary hydrophobic pocket on an adjacent deoxyhaemoglobin tetramer, triggering non-covalent HbS polymerisation into rigid 14-strand helical fibrous polymers. Downstream pathophysiology: erythrocyte distortion into rigid, non-deformable sickle crescents, membrane fragility, chronic extravascular/intravascular haemolytic anaemia (shortened red blood cell lifespan 10-20 days vs 120 days), and microvascular vaso-occlusion leading to acute painful crises, acute chest syndrome, splenic infarction (functional asplenia predisposing to encapsulated bacterial sepsis), and end-organ ischemic damage. Heterozygote advantage: balanced polymorphism against severe Plasmodium falciparum malaria.",
    starterQuestions: [
      { q: "What mode of inheritance governs both Cystic Fibrosis and Sickle Cell Anaemia?", a: "Autosomal recessive inheritance." },
      { q: "What specific molecular mutation accounts for ~70% of Cystic Fibrosis alleles in the UK?", a: "Delta F508: an in-frame deletion of 3 base pairs (CTT) causing the loss of phenylalanine at position 508 in the CFTR protein." },
      { q: "Explain the biochemical basis of the pilocarpine sweat test in Cystic Fibrosis diagnosis.", a: "Defective CFTR channels cannot reabsorb chloride ions from ductal sweat, resulting in elevated sweat chloride concentration (> 60 mmol/L)." },
      { q: "What amino acid substitution causes Sickle Cell Anaemia, and at which codon?", a: "Glutamic acid is replaced by valine at codon 6 of the beta-globin (HBB) chain." },
      { q: "Why do HbS molecules polymerise only under deoxygenated conditions?", a: "Deoxygenation exposes a hydrophobic binding pocket on the beta subunit that accommodates the mutant hydrophobic valine residue." },
      { q: "What evolutionary phenomenon explains the high carrier frequency of the sickle cell allele in equatorial regions?", a: "Heterozygote advantage (balanced polymorphism) conferring resistance against severe Plasmodium falciparum malaria." }
    ],
    objectives: {
      knowledge: "Explain the inheritance patterns and molecular aetiologies of Cystic Fibrosis and Sickle Cell Anaemia.",
      application: "Trace the pathophysiological cascade from primary gene mutation to multisystem clinical manifestations.",
      evaluation: "Evaluate diagnostic testing methodologies (newborn IRT screening, sweat test, haemoglobin electrophoresis) and risk probabilities."
    },
    terminology: [
      { term: "CFTR Channel", def: "Cystic Fibrosis Transmembrane Conductance Regulator: an ABC-class cAMP-gated chloride ion channel on epithelial apical membranes." },
      { term: "HbS Polymerisation", def: "Aggregation of deoxygenated sickle haemoglobin tetramers into rigid paracrystalline helical fibers that deform erythrocytes." },
      { term: "Vaso-occlusive Crisis", def: "Microvascular obstruction by rigid sickle erythrocytes causing acute severe tissue ischemia, infarction, and pain." },
      { term: "Heterozygote Advantage", def: "Higher biological fitness of heterozygous individuals (HbAS) relative to homozygotes in malaria-endemic regions." }
    ],
    theoryPoints: [
      "Autosomal Recessive Risk: Two carrier parents (Aa x Aa) face a 25% risk of affected offspring, a 50% carrier probability, and a 25% wild-type outcome per pregnancy.",
      "CFTR Class II Pathology: Delta F508 does not prevent transcription or translation; the protein is misfolded, retained in the ER, and prematurely degraded by proteasomes.",
      "Systemic CF Consequences: Defective chloride efflux causes unchecked ENaC sodium influx, desiccating mucosal secretions across lungs, pancreas, liver, and vas deferens.",
      "Sickle Vaso-Occlusion vs Haemolysis: Sickled RBCs cause both chronic extravascular haemolysis (anaemia, jaundice) and acute microvascular blockage (ischemic crisis, acute chest syndrome)."
    ],
    workedExample: {
      title: "Multisystem Pathophysiological Mapping",
      subtitle: "From CFTR Delta F508 gene defect to clinical end-stage bronchiectasis",
      steps: [
        { label: "Step 1: Gene Mutation", detail: "Deletion of CTT at codon 508 in CFTR gene on chromosome 7q31.2." },
        { label: "Step 2: Post-Translational Degradation", detail: "Misfolded CFTR is recognized by ER chaperone Hsp70 and degraded by the ubiquitin-proteasome system; zero CFTR reaches apical membrane." },
        { label: "Step 3: Epithelial Surface Dehydration", detail: "Absence of chloride export + hyperactive sodium reabsorption (ENaC) draws water out of airway surface liquid." },
        { label: "Step 4: Clinical Cascade", detail: "Dehydrated mucus collapses cilia; chronic colonization by Pseudomonas aeruginosa triggers neutrophilic inflammation, elastase release, and bronchiectasis." }
      ]
    },
    hingeQuestions: [
      {
        question: "Two healthy parents who are both confirmed carriers of the CFTR Delta F508 mutation have one child with Cystic Fibrosis. What is the probability that their next child will be a healthy non-carrier (homozygous wild-type)?",
        options: ["1 in 2 (50%)", "1 in 4 (25%)", "3 in 4 (75%)", "0% (all subsequent children are affected)"],
        correctIndex: 1,
        explanation: "In an autosomal recessive cross (Aa x Aa), the Mendelian ratio is 1 AA (25% non-carrier healthy) : 2 Aa (50% carrier healthy) : 1 aa (25% affected)."
      },
      {
        question: "Why does the substitution of valine for glutamic acid at codon 6 of beta-globin cause haemoglobin molecules to aggregate only when deoxygenated?",
        options: ["Valine is positively charged and repels oxygen molecules", "Oxygen binding alters haemoglobin quaternary structure, burying the complementary hydrophobic acceptor pocket", "Valine is converted into cysteine when oxygen levels drop", "Deoxygenated haemoglobin is transported into lysosomes"],
        correctIndex: 1,
        explanation: "Oxygenation maintains the R (relaxed) state where the hydrophobic pocket is concealed; deoxygenation shifts to the T (tense) state, exposing the pocket to accommodate mutant valine."
      },
      {
        question: "Which clinical screening finding provides the earliest biochemical indicator of Cystic Fibrosis during newborn blood-spot testing?",
        options: ["Elevated sweat chloride concentration", "Elevated immunoreactive trypsinogen (IRT) in serum due to blocked pancreatic ducts", "Complete absence of red blood cells", "Direct visualisation of lung bronchiectasis on chest X-ray"],
        correctIndex: 1,
        explanation: "Obstruction of fetal pancreatic ducts causes pancreatic pro-enzymes (including IRT) to leak into the fetal bloodstream, detected as elevated serum IRT on Guthrie cards."
      }
    ],
    examQuestion: {
      question: "Explain how a 3-base-pair deletion in the CFTR gene results in chronic respiratory failure and pancreatic insufficiency in Cystic Fibrosis patients, and evaluate the diagnostic validity of the pilocarpine sweat test. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Molecular Defect: Delta F508 deletes phenylalanine 508, causing protein misfolding and targeted destruction in the endoplasmic reticulum; no functional chloride channels reach epithelial apical membranes [2 marks].",
        "Respiratory & Pancreatic Pathology: Impaired chloride export with sodium hyper-absorption desiccates mucus; thick mucus obstructs airways (bacterial infection, bronchiectasis) and occludes pancreatic ducts, preventing enzyme delivery and causing malabsorption [2 marks].",
        "Diagnostic Sweat Test: Defective CFTR in sweat gland ducts prevents chloride reabsorption from primary sweat, resulting in abnormally high sweat chloride (> 60 mmol/L), providing a definitive gold-standard diagnostic metric [2 marks]."
      ]
    },
    plenary: [
      "Single-gene disorders illustrate molecular causality: an alteration of three base pairs can disrupt multi-organ human physiology.",
      "Precision diagnostics (Guthrie card IRT, sweat test, genetic sequencing) enable targeted clinical interventions before irreversible organ damage occurs.",
      "Next Lesson: Genetic disorders: Chromosomal abnormalities — nondisjunction mechanisms and cytogenetic karyotyping of aneuploidies."
    ]
  },
  {
    number: 7,
    part: 2,
    teacher: "Matt",
    deckId: "Lesson_07_Genetic_disorders_Chromosomal_abnormalities",
    title: "Genetic disorders: Chromosomal abnormalities",
    focus: "Cytogenetics, Meiotic Nondisjunction & Karyotypic Aneuploidy Syndromes",
    deliverable: "Diagram homologous vs sister chromatid nondisjunction during meiosis I and II, interpret diagnostic G-band karyotypes and FISH signals, and compare autosomal trisomies with sex chromosome aneuploidies.",
    details: "Human cytogenetics and chromosomal architecture: 46 chromosomes (22 pairs of autosomes, 1 pair of sex chromosomes XX/XY), p-arm (short) and q-arm (long), centromeric positioning (metacentric, submetacentric, acrocentric with satellite stalks). Structural chromosomal rearrangements: reciprocal vs Robertsonian translocations (fusion of acrocentric chromosomes 13, 14, 15, 21, 22), interstitial and terminal deletions (Cri-du-chat 5p- syndrome), inversions (paracentric vs pericentric), and ring chromosomes. Numerical chromosomal abnormalities: Polyploidy (triploidy 69,XXX from dispermy or meiotic failure; non-viable in humans) vs Aneuploidy (loss or gain of individual chromosomes). Molecular mechanism of aneuploidy: meiotic nondisjunction (failure of homologous chromosomes to separate during anaphase I yielding 100% abnormal gametes, vs failure of sister chromatids to disjoin during anaphase II yielding 50% abnormal gametes). Association with advanced maternal age: degradation of cohesin protein rings cross-linking sister chromatids during extended meiotic arrest in prophase I dictyotene. Clinical Autosomal Aneuploidy Syndromes: Trisomy 21 Down's syndrome (47,XX,+21 or 47,XY,+21; 95% meiotic nondisjunction, 4% Robertsonian translocation, 1% mosaicism; clinical features: intellectual disability, epicanthic folds, single transverse palmar crease, atrioventricular septal defects, early-onset Alzheimer's neuropathology due to triplicated amyloid precursor protein APP gene); Trisomy 18 Edwards syndrome (47,+18; micrognathia, clenched fists with overlapping fingers, rocker-bottom feet, severe cardiac malformations, <10% 1-year survival); Trisomy 13 Patau syndrome (47,+13; holoprosencephaly, microphthalmia, cleft lip/palate, polydactyly). Clinical Sex Chromosome Aneuploidies: Turner's syndrome (45,X monosomy; short stature, webbed neck, coarctation of aorta, streak gonads, hypergonadotropic hypogonadism, amenorrhoea) and Klinefelter's syndrome (47,XXY; tall eunuchoid habitus, gynecomastia, microorchidism, azoospermia, elevated gonadotropins LH/FSH). Diagnostic cytogenetic methodologies: G-banding (Giemsa staining of metaphase spreads at 400-550 band resolution), Fluorescence In Situ Hybridization (FISH using locus-specific or centromeric fluorescent DNA probes), array Comparative Genomic Hybridization (aCGH for submicroscopic copy number variations CNVs), and non-invasive prenatal testing (NIPT via cell-free fetal DNA in maternal circulation).",
    starterQuestions: [
      { q: "What is the standard diploid chromosome number and sex chromosome complement in a human male?", a: "46,XY (46 chromosomes total: 44 autosomes and two sex chromosomes X and Y)." },
      { q: "Define nondisjunction during cell division.", a: "The failure of homologous chromosomes (meiosis I) or sister chromatids (meiosis II / mitosis) to separate correctly during anaphase." },
      { q: "What proportion of gametes are abnormal if nondisjunction occurs in meiosis I versus meiosis II?", a: "Meiosis I nondisjunction yields 100% abnormal gametes (two n+1, two n-1); meiosis II yields 50% abnormal gametes (one n+1, one n-1, two normal n)." },
      { q: "State the karyotypic formula for a female with Down's syndrome resulting from complete trisomy 21.", a: "47,XX,+21." },
      { q: "Which sex chromosome monosomy is compatible with postnatal human survival?", a: "Turner's syndrome: 45,X (monosomy X)." },
      { q: "Why do acrocentric chromosomes undergo Robertsonian translocations?", a: "Their short p-arms contain redundant ribosomal RNA tandem repeats, allowing centromeric fusion of two long q-arms without loss of vital genetic material." }
    ],
    objectives: {
      knowledge: "Explain the cytogenetic mechanisms of numerical (aneuploidy) and structural chromosomal abnormalities.",
      application: "Differentiate the gametic consequences of nondisjunction in meiosis I versus meiosis II.",
      evaluation: "Evaluate diagnostic cytogenetic tools (karyotyping, FISH, aCGH, NIPT) and correlate karyotypes with clinical phenotypes."
    },
    terminology: [
      { term: "Aneuploidy", def: "An abnormal chromosome number involving loss or gain of individual chromosomes (e.g. 2n+1 trisomy, 2n-1 monosomy)." },
      { term: "Nondisjunction", def: "Failure of paired chromosomes or sister chromatids to disjoin during meiotic anaphase, producing aneuploid gametes." },
      { term: "Robertsonian Translocation", def: "Non-reciprocal translocation fusing the long q-arms of two acrocentric chromosomes (13, 14, 15, 21, 22) at their centromeres." },
      { term: "Fluorescence In Situ Hybridization (FISH)", def: "Molecular cytogenetic technique using fluorescently labelled DNA probes to detect specific chromosomal sequences on metaphase spreads or interphase nuclei." }
    ],
    theoryPoints: [
      "Maternal Age Effect: Human oocytes enter meiotic arrest in prophase I (dictyotene) before birth; prolonged arrest over decades degrades cohesin rings, escalating nondisjunction risk.",
      "Autosomal vs Sex Chromosome Tolerance: Autosomal monosomies are embryonic lethal. Autosomal trisomies (21, 18, 13) survive only for gene-poor chromosomes. Sex chromosome aneuploidies (45,X, 47,XXY) are well-tolerated due to X-inactivation (Barr bodies) and low Y gene content.",
      "Down's Syndrome Cytogenetic Origins: ~95% maternal meiotic nondisjunction, ~4% Robertsonian translocation (e.g. rob(14;21)), and ~1% post-zygotic mitotic mosaicism.",
      "Down's & Alzheimer's Link: The Amyloid Precursor Protein (APP) gene is located on chromosome 21q21.3; trisomy 21 produces lifelong 1.5-fold APP gene dosage, causing neuropathological amyloid plaque deposition by age 40."
    ],
    workedExample: {
      title: "Meiotic Nondisjunction Gamete Analysis",
      subtitle: "Tracking chromosome 21 segregation across Meiosis I vs Meiosis II failure",
      steps: [
        { label: "Step 1: Normal Meiosis", detail: "Meiosis I separates maternal and paternal homologues (2 x 1n); Meiosis II separates sister chromatids. Result: 4 normal haploid gametes (n = 23)." },
        { label: "Step 2: Meiosis I Nondisjunction", detail: "Homologues fail to separate at Anaphase I. Secondary spermatocytes/oocytes receive 24 and 22 chromosomes. Result: Two disomic (n+1) and two nullisomic (n-1) gametes (100% abnormal)." },
        { label: "Step 3: Fertilization by Normal Gamete", detail: "Fertilization by normal 23-chromosome sperm: Disomic gametes produce Trisomy 21 (47,XX/XY,+21); Nullisomic gametes produce Monosomy 21 (45,XX/XY,-21; embryonic lethal)." },
        { label: "Step 4: Meiosis II Contrast", detail: "Normal Meiosis I, followed by sister chromatid nondisjunction in one cell during Anaphase II. Result: One disomic (n+1), one nullisomic (n-1), and two normal haploid (n) gametes (50% abnormal)." }
      ]
    },
    hingeQuestions: [
      {
        question: "If meiotic nondisjunction of chromosome 21 occurs during Meiosis I of oogenesis, what will be the chromosomal constitution of the resulting four gametes?",
        options: ["Two normal haploid (n) gametes, one disomic (n+1), and one nullisomic (n-1)", "Four disomic (n+1) gametes", "Two disomic (n+1) gametes and two nullisomic (n-1) gametes (100% abnormal)", "Four normal haploid gametes"],
        correctIndex: 2,
        explanation: "Meiosis I nondisjunction leaves one daughter cell with both homologous chromosomes and the other with none, yielding 100% abnormal gametes upon completion of meiosis."
      },
      {
        question: "Why is complete monosomy of an autosome (such as Monosomy 21) universally lethal in early human embryonic development, whereas Monosomy X (Turner's syndrome: 45,X) is viable?",
        options: ["Autosomes do not contain essential genes", "Autosomal monosomy unmasks lethal recessive mutations and creates catastrophic haploinsufficiency across hundreds of genes; normal females inactivate one X chromosome anyway (Lyonisation)", "The X chromosome contains no functional genes", "Sperm cells provide extra autosomes during fertilization"],
        correctIndex: 1,
        explanation: "Autosomal monosomies cause severe haploinsufficiency and unmask lethal recessive alleles. Sex chromosomes are regulated by X-inactivation (Barr bodies), making X chromosome dosage abnormalities far more viable."
      },
      {
        question: "A newborn infant presents with micrognathia, low-set malformed ears, clenched fists with overlapping index fingers, and rocker-bottom feet. Which cytogenetic condition is most strongly suspected?",
        options: ["Down's syndrome (Trisomy 21)", "Turner's syndrome (45,X)", "Edwards syndrome (Trisomy 18)", "Klinefelter's syndrome (47,XXY)"],
        correctIndex: 2,
        explanation: "Overlapping fingers (index over middle), micrognathia, rocker-bottom feet, and severe cardiac defects are pathognomonic clinical features of Trisomy 18 (Edwards syndrome)."
      }
    ],
    examQuestion: {
      question: "Explain the molecular mechanisms that cause Down's syndrome, distinguishing between standard meiotic nondisjunction and Robertsonian translocations, and evaluate the diagnostic advantages of Non-Invasive Prenatal Testing (NIPT) over amniocentesis. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Meiotic Nondisjunction: 95% of cases arise from maternal nondisjunction (cohesin breakdown in prolonged prophase I arrest), producing an extra free chromosome 21 (47,XX/XY,+21) [2 marks].",
        "Robertsonian Translocation: ~4% of cases involve fusion of acrocentric chromosome 21q to another acrocentric (typically 14q); balanced carrier parents face high recurrence risk because translocation is heritable [2 marks].",
        "NIPT vs Amniocentesis: Amniocentesis is invasive (needle insertion, ~0.5% miscarriage risk) though definitive; NIPT analyses cell-free fetal DNA (cfDNA) in maternal blood from 10 weeks gestation with >99% sensitivity for trisomy 21 and zero procedural miscarriage risk [2 marks]."
      ]
    },
    plenary: [
      "Chromosomal abnormalities reflect large-scale disruptions involving hundreds to thousands of genes simultaneously.",
      "Understanding nondisjunction mechanisms and cytogenetic karyotyping provides essential clinical grounding for prenatal diagnosis and genetic counselling.",
      "Next Lesson: Genetic disorders: Polygenic and complex traits — GWAS architecture, polygenic risk scores (PRS), and multifactorial disease."
    ]
  },
  {
    number: 8,
    part: 2,
    teacher: "Matt",
    deckId: "Lesson_08_Genetic_disorders_Polygenic_and_complex_traits",
    title: "Genetic disorders: Polygenic and complex traits",
    focus: "Multifactorial Quantitative Genetics, GWAS Architecture & Polygenic Risk Scores (PRS)",
    deliverable: "Interpret a Genome-Wide Association Study (GWAS) Manhattan plot, calculate an individual Polygenic Risk Score (PRS) using effect-size log-odds ratios, and evaluate gene-environment interactions in complex chronic diseases.",
    details: "The architecture of human complex traits: contrasting Mendelian monogenic high-penetrance single-gene mutations with polygenic multifactorial inheritance. Most common human diseases (Type 2 Diabetes, Coronary Artery Disease, Hypertension, Major Depressive Disorder, Alzheimer's disease) are polygenic, caused by the cumulative additive effect of hundreds to thousands of common Single Nucleotide Polymorphisms (SNPs), each exerting a modest effect size (Odds Ratio typically 1.05 - 1.3). Polygenic liability threshold model: underlying normally distributed genetic liability curve where clinical phenotype manifests only when cumulative liability exceeds a critical threshold, modulated by environmental exposures and lifestyle choices. Genome-Wide Association Studies (GWAS): methodology querying millions of SNPs across vast case-control cohorts (n > 100,000). High-throughput genotyping microarrays and next-generation whole-genome sequencing. Construction and interpretation of Manhattan plots: genomic coordinates along chromosomes 1-22 on the x-axis, negative logarithm of the association p-value (-log10 p) on the y-axis, and the stringent genome-wide statistical significance threshold (p < 5 x 10^-8) adjusting for multiple testing (Bonferroni correction). Linkage disequilibrium (LD): non-random association of alleles at different loci within haplotype blocks. Polygenic Risk Scores (PRS): quantitative biometric metric aggregating an individual's carry count of risk alleles weighted by their respective GWAS beta-coefficients / log-odds ratios: PRS = sum(beta_j * G_ij). Clinical utility of PRS in personalized preventative medicine: identifying high-risk population deciles for targeted pharmacological intervention (e.g. early statin therapy for top 5% CAD risk), risk-stratified cancer screening intervals, and lifestyle modification counseling. Clinical limitations and ethical dilemmas: ancestry bias (overwhelming predominance of European ancestry cohorts in biobanks like UK Biobank leading to poor predictive transferability to African, Asian, and Hispanic populations), low individual positive predictive value, genetic fatalism vs optimism, and genetic discrimination in life insurance underwriting. Gene-environment interactions (G x E): e.g. APOE epsilon-4 allele conferring heightened susceptibility to late-onset Alzheimer's disease exacerbated by midlife cardiovascular risk factors and traumatic brain injury.",
    starterQuestions: [
      { q: "What is a Single Nucleotide Polymorphism (SNP)?", a: "A single base-pair variation in a DNA sequence present in at least 1% of the general population." },
      { q: "How do effect sizes of risk alleles in complex polygenic traits differ from mutations in Mendelian monogenic diseases?", a: "Mendelian mutations have massive effect sizes with high penetrance; complex polygenic SNPs have small additive effect sizes (Odds Ratios typically 1.05–1.3)." },
      { q: "What does the y-axis represent on a GWAS Manhattan plot?", a: "The negative logarithm of the association p-value (-log10 p); higher peaks indicate stronger statistical association." },
      { q: "What is the standard genome-wide significance threshold p-value in GWAS studies, and why is it so stringent?", a: "p < 5 x 10^-8; adjusted via Bonferroni correction for ~1 million independent statistical tests across the human genome." },
      { q: "Define a Polygenic Risk Score (PRS).", a: "A calculated individual metric summing the weighted effect sizes (log odds ratios) of all disease-associated risk alleles carried." },
      { q: "Why do current Polygenic Risk Scores perform poorly when applied to non-European ancestral populations?", a: "Ancestry bias: >80% of historical GWAS biobank data came from European cohorts, meaning SNP effect sizes and linkage disequilibrium patterns do not match other ancestries." }
    ],
    objectives: {
      knowledge: "Differentiate monogenic Mendelian inheritance from multifactorial polygenic complex trait architecture.",
      application: "Interpret GWAS Manhattan plots, identify significant loci (p < 5 x 10^-8), and compute Polygenic Risk Scores.",
      evaluation: "Evaluate the clinical utility, ancestry biases, and ethical dilemmas surrounding PRS implementation in preventative medicine."
    },
    terminology: [
      { term: "Single Nucleotide Polymorphism (SNP)", def: "A single nucleotide genomic locus where two or more alternative bases occur in >1% of a population." },
      { term: "Genome-Wide Association Study (GWAS)", def: "Observational study inspecting millions of SNPs across large populations to find genetic variants associated with disease." },
      { term: "Manhattan Plot", def: "A genomic scatter plot displaying -log10(p) across chromosomes, named for skyscrapers resembling tall significant peaks." },
      { term: "Polygenic Risk Score (PRS)", def: "A numerical estimate of an individual's genetic liability to a disease, calculated by summing risk alleles weighted by GWAS effect sizes." }
    ],
    theoryPoints: [
      "The Missing Heritability Paradox: Early candidate-gene studies failed to find single 'major genes' for complex diseases because liability is distributed across thousands of tiny-effect common SNPs.",
      "The Liability Threshold Model: Polygenic risk follows a continuous bell curve; individuals crossing the environmental-genetic threshold develop clinical pathology.",
      "Preventative Stratification: Patients in the top 5% of CAD Polygenic Risk Scores have equal cardiovascular risk to individuals with monogenic Familial Hypercholesterolaemia, but benefit dramatically from early lifestyle and statin therapy.",
      "Ethical & Equity Concerns: Addressing global health disparities requires expanding diverse ancestral sequencing (e.g. All of Us, H3Africa) before PRS can be safely deployed in public health screening."
    ],
    workedExample: {
      title: "Polygenic Risk Score (PRS) Calculation",
      subtitle: "Computing Coronary Artery Disease genetic liability across 3 representative risk loci",
      steps: [
        { label: "Step 1: Identify Validated Loci", detail: "Locus 1 (chr 9p21.3, beta = 0.28); Locus 2 (chr 1p13.3, beta = 0.18); Locus 3 (chr 19p13.2, beta = 0.14)." },
        { label: "Step 2: Determine Patient Genotype Dosage", detail: "Patient carries: Locus 1 homozygous risk (dosage = 2); Locus 2 heterozygous risk (dosage = 1); Locus 3 zero risk alleles (dosage = 0)." },
        { label: "Step 3: Weight and Sum Log-Odds", detail: "PRS = (0.28 x 2) + (0.18 x 1) + (0.14 x 0) = 0.56 + 0.18 + 0 = +0.74." },
        { label: "Step 4: Clinical Percentile Stratification", detail: "Log-odds score of +0.74 places patient in the 94th percentile of population cardiovascular risk, triggering early prophylactic statin consultation." }
      ]
    },
    hingeQuestions: [
      {
        question: "On a GWAS Manhattan plot, why is the horizontal genome-wide significance threshold set at p < 5 x 10^-8 rather than the standard p < 0.05?",
        options: ["To account for the high cost of DNA sequencing reagents", "To apply Bonferroni correction for testing approximately 1,000,000 independent SNP loci simultaneously, preventing massive false-positive discovery rates", "Because human DNA contains only 5 x 10^8 total nucleotides", "To eliminate the effect of environmental variance"],
        correctIndex: 1,
        explanation: "When conducting ~1 million statistical tests across the genome, a standard p < 0.05 threshold would produce 50,000 false-positive associations by pure chance. The threshold 5 x 10^-8 accounts for multiple hypothesis testing."
      },
      {
        question: "Why does an individual in the 98th percentile of Polygenic Risk Score for Type 2 Diabetes not inevitably develop the disease?",
        options: ["Polygenic Risk Scores are 100% inaccurate", "Type 2 Diabetes is a multifactorial disorder governed by gene-environment interactions; healthy diet and physical exercise can keep cumulative liability below the clinical threshold", "Type 2 Diabetes is exclusively caused by a single Mendelian dominant gene", "Somatic mutations will delete the risk alleles over time"],
        correctIndex: 1,
        explanation: "Polygenic disorders follow a multifactorial liability threshold model where genetic liability interacts dynamically with environmental lifestyle factors (diet, exercise) to determine disease manifestation."
      },
      {
        question: "What is currently the single greatest scientific limitation preventing the universal clinical rollout of Polygenic Risk Scores across global healthcare systems?",
        options: ["Computers cannot calculate logarithmic sums", "The severe Eurocentric ancestry bias in historical GWAS cohorts, leading to inaccurate and unreliable risk predictions in non-European populations", "DNA cannot be extracted from saliva samples", "All complex traits have already been cured by CRISPR"],
        correctIndex: 1,
        explanation: "Over 80% of historical GWAS participants were of European descent. Due to differences in allele frequencies and linkage disequilibrium, European-derived PRS scores demonstrate substantially reduced predictive accuracy in other ancestral groups."
      }
    ],
    examQuestion: {
      question: "Contrast the genetic architecture of monogenic diseases (such as Cystic Fibrosis) with complex polygenic disorders (such as Coronary Artery Disease). Explain how a Genome-Wide Association Study (GWAS) identifies novel risk loci, and evaluate the ethical implications of using Polygenic Risk Scores (PRS) in healthcare. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Genetic Architecture Contrast: Monogenic diseases are caused by rare, highly penetrant mutations in single genes following predictable Mendelian ratios; complex diseases are polygenic, caused by hundreds of common SNPs of small individual effect interacting with environmental lifestyle factors [2 marks].",
        "GWAS Methodology: GWAS compares SNP frequencies between thousands of cases and controls; statistical associations exceeding the genome-wide threshold (p < 5 x 10^-8) appear as significant peaks on Manhattan plots, pinpointing candidate risk loci [2 marks].",
        "Clinical & Ethical Evaluation: PRS enables early risk stratification and preventative intervention (e.g. lifestyle, statins); however, ancestry bias risks exacerbating health inequalities, and risk disclosure can trigger psychological fatalism or potential insurance discrimination [2 marks]."
      ]
    },
    plenary: [
      "Complex human disease represents the intersection of polygenic risk architectures and environmental exposures.",
      "GWAS and Polygenic Risk Scores represent the frontier of precision medicine, moving healthcare from reactive treatment to proactive risk stratification.",
      "Unit F172 Genetics Synthesis: We have journeyed from DNA structure, through expression and mutation, to the population genomics of human disease."
    ]
  }
];
