export const COURSE_NAME = "OCR Level 3 Cambridge Advanced National (AAQ) in Human Biology - Unit F172: Genetics";
export const NOTEBOOK_URL = "https://notebook.google.com/notebook/d1431642-e474-4174-bdde-740b1fa6e25c";
export const INTRO_VIDEO_URL = NOTEBOOK_URL;
export const OUTPUT_DIR_NAME = "powerpoints_aaq_genetics";
export const CHECKPOINT_FILE_NAME = "checkpoint_aaq_genetics.json";
export const END_LESSON_DEFAULT = 9;
export const DRIVE_FOLDER_NAME = "AAQ Human Biology Genetics";
export const LESSON_LEVEL = "OCR Level 3 Cambridge Advanced National (AAQ) and A Level Biology learners";
export const INCLUDE_LESSON1_COURSE_OUTLINE = true;
export const REQUIRE_CONTINUING_CASE_STUDY = true;
export const SELF_CONTAINED_LESSONS = false;
export const STARTER_GRID_MODE = "six-cell-topic";
export const BUILD_ON_PREVIOUS = true;
export const MAXIMIZE_LEARNING_GAMES = true;

export const courseParts = [
  "Part 1: Molecular Foundations, Replication & Expression (Lessons 1–4)",
  "Part 2: Mutation Biology, Monogenic & Cytogenetic Pathology (Lessons 5–8)",
  "Part 3: NEA Synoptic Case Study, Clinical Genetics & Research Skills (Lesson 9)"
];

export const lessons = [
  {
    number: 1,
    part: 1,
    teacher: "Dan",
    deckId: "Lesson_01_Unit_intro_and_Phenotypic_variation",
    title: "Unit intro & Phenotypic variation",
    focus: "Phenotypic Variation, Origins of Genetic Diversity & Biometric Analysis",
    deliverable: "Construct biometric plots (bar charts for discontinuous vs histograms for continuous traits), calculate and interpret standard deviation, and analyze blood-group genetics alongside the variance equation Vp = Vg + Ve.",
    details: "Unit Induction into OCR Cambridge Advanced National (AAQ) Human Biology Unit F172: Genetics. 1. Phenotypic variation reflects genetic, environmental, and combined influences (Vp = Vg + Ve). It manifests as interspecific variation (differences between different species) and intraspecific variation (differences between individuals of the same species). Traits are classified into continuous variation (quantitative, unbroken numerical spectrum, polygenic inheritance interacting with environmental factors, forming a Gaussian normal distribution) versus discontinuous variation (qualitative, distinct discrete non-overlapping categories, monogenic with zero or negligible environmental influence). 2. Origins of genetic diversity (overview): Meiosis (independent assortment of homologous chromosomes in Metaphase I and crossing over/chiasmata formation in Prophase I yielding recombinant chromatids), random fertilisation of gametes generating unique diploid zygotes, and gene/chromosomal mutations providing the ultimate raw source of novel alleles. 3. Clinical application & statistical analysis: Blood-group genetics (ABO system: IA, IB, IO codominant/recessive single-locus inheritance) as an exemplar of purely genetic discontinuous variation. Teaching appropriate graphical and statistical analysis: plotting discrete discontinuous data as bar charts (with spaces between distinct categories) versus continuous data grouped into class intervals as histograms (contiguous bars with no gaps); calculating and interpreting the arithmetic mean, variance, and standard deviation (evaluating dispersion around the mean and the 68-95-99.7 empirical rule for normal distributions).",
    starterQuestions: [
      { q: "What is the difference between interspecific and intraspecific variation?", a: "Interspecific is variation between distinct species; intraspecific is variation among individuals of the same species." },
      { q: "What three primary biological processes generate genetic diversity in sexually reproducing organisms?", a: "Meiosis (crossing over and independent assortment), random fertilisation of gametes, and DNA mutations." },
      { q: "Define phenotypic variance in the quantitative equation Vp = Vg + Ve.", a: "Total observable phenotypic variance (Vp) equals genetic variance (Vg) plus environmental variance (Ve)." },
      { q: "Why must ABO blood group data be plotted on a bar chart rather than a histogram?", a: "ABO blood groups are discrete, discontinuous qualitative categories, so bars must have distinct spaces between them." },
      { q: "When is a histogram used instead of a bar chart for biological data?", a: "For continuous quantitative variables grouped into contiguous class intervals/bins (with no spaces between bars)." },
      { q: "What does the standard deviation measure in a biometric dataset?", a: "The spread or dispersion of individual continuous phenotypic values around the calculated arithmetic mean." }
    ],
    objectives: {
      knowledge: "Explain how phenotypic variation reflects genetic, environmental, and combined influences, distinguishing interspecific vs intraspecific and continuous vs discontinuous variation.",
      application: "Outline how genetic diversity arises via meiosis, random fertilisation, and mutation, applying these principles to ABO blood-group genetics.",
      evaluation: "Select and construct appropriate graphical representations (bar charts vs histograms) and evaluate datasets using mean and standard deviation."
    },
    terminology: [
      { term: "Interspecific vs Intraspecific", def: "Interspecific: phenotypic variation between different species. Intraspecific: phenotypic variation between individuals of the same species." },
      { term: "Continuous Variation", def: "A quantitative phenotypic spectrum controlled polygenically with environmental modifiers, plotted as a histogram." },
      { term: "Discontinuous Variation", def: "Discrete, non-overlapping phenotypic categories determined by single-gene loci (e.g. ABO blood group), plotted as a bar chart." },
      { term: "Standard Deviation (s)", def: "A statistical metric quantifying the spread of continuous phenotypic measurements around the arithmetic mean: s = sqrt(sum(x - mean)^2 / (n - 1))." },
      { term: "ABO Blood-Group Genetics", def: "Monogenic codominant/recessive single-locus system (alleles IA, IB, IO) showing strictly discontinuous genetic inheritance." }
    ],
    theoryPoints: [
      "Variation Framework: Phenotypic variation (Vp = Vg + Ve) includes interspecific differences (between species) and intraspecific differences (within species).",
      "Origins of Diversity: Meiosis (crossing over in Prophase I, independent assortment in Metaphase I), random fertilisation of gametes, and spontaneous mutations.",
      "Graph Selection: Discontinuous traits (ABO blood groups) require separated bar charts; continuous traits (height, blood pressure) require contiguous histograms.",
      "Standard Deviation: In a standard normal biometric distribution, 68.2% of individuals lie within 1 standard deviation (mean +/- 1 SD), and 95.4% lie within 2 standard deviations."
    ],
    workedExample: {
      title: "Biometric & Blood-Group Statistical Analysis",
      subtitle: "Comparing discontinuous ABO phenotypes and continuous biometric parameters",
      steps: [
        { label: "Step 1: Categorising the Trait", detail: "ABO blood group is discontinuous (categories A, B, AB, O; monogenic IA, IB, IO; Ve = 0). Height or FEV1 is continuous (polygenic + environmental; Vp = Vg + Ve)." },
        { label: "Step 2: Graphical Selection", detail: "Plot ABO frequencies on a bar chart with spaces between categories. Plot height or blood pressure on a histogram with contiguous class intervals (e.g. 150-154 cm, 155-159 cm)." },
        { label: "Step 3: Calculating Central Tendency & Spread", detail: "For continuous data, calculate the arithmetic mean (e.g. 170 cm) and standard deviation s = 8 cm (variance s^2 = 64 cm^2)." },
        { label: "Step 4: Statistical Interpretation", detail: "Approximately 68% of the cohort falls between 162 cm and 178 cm (mean +/- 1 SD), and 95% falls between 154 cm and 186 cm (mean +/- 2 SD)." }
      ]
    },
    hingeQuestions: [
      {
        question: "Which biological mechanism generates new, novel alleles rather than simply reshuffling existing parental alleles?",
        options: ["Independent assortment in Metaphase I", "Crossing over in Prophase I", "DNA and chromosome mutations", "Random fertilisation of gametes"],
        correctIndex: 2,
        explanation: "Mutations are the only source of novel alleles. Meiosis (crossing over and independent assortment) and random fertilisation reshuffle existing alleles into new combinations."
      },
      {
        question: "A student records the blood groups (A, B, AB, O) of 200 students. How should this data be displayed graphically?",
        options: ["A line graph connecting the data points", "A bar chart with spaces between distinct qualitative categories", "A histogram with contiguous bins and no spaces", "A scatter plot with a line of best fit"],
        correctIndex: 1,
        explanation: "ABO blood group is discontinuous qualitative data with distinct discrete categories, which must be displayed as a bar chart with spaces between bars."
      },
      {
        question: "In a biometric cohort of adult standing height (mean = 175 cm, standard deviation = 10 cm), what percentage of individuals is expected between 165 cm and 185 cm in a normal distribution?",
        options: ["Approximately 50%", "Approximately 68%", "Approximately 95%", "Approximately 99.7%"],
        correctIndex: 1,
        explanation: "In a normal distribution, approximately 68.2% of the population lies within 1 standard deviation of the mean (175 +/- 10 cm)."
      }
    ],
    examQuestion: {
      question: "Distinguish between continuous and discontinuous variation in humans, using blood groups and height as examples. In your answer, explain how genetic diversity arises during sexual reproduction and describe how standard deviation and appropriate graphical presentations (bar charts vs histograms) are used to analyze biometric datasets. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Continuous vs Discontinuous Distinctions: Discontinuous variation shows discrete categories with no intermediates (monogenic, e.g. ABO blood groups; Ve=0); continuous variation forms a smooth numerical continuum (polygenic, e.g. height, modulated by Vp = Vg + Ve) [2 marks].",
        "Origins of Genetic Diversity: Explain that meiosis (crossing over in Prophase I, independent assortment in Metaphase I) and random fertilisation reshuffle alleles, while mutations create novel alleles [2 marks].",
        "Graphical and Statistical Analysis: Discontinuous data is plotted on bar charts with spaces between bars; continuous data is grouped into class intervals and plotted on histograms. Standard deviation quantifies spread around the mean (68% within 1 SD in normal distribution) [2 marks]."
      ]
    },
    plenary: [
      "Phenotypic variation reflects genetic, environmental, and combined influences, manifesting as interspecific and intraspecific diversity.",
      "Genetic diversity is generated through meiosis, random fertilisation, and mutations.",
      "Master graphical selection (bar charts for discontinuous vs histograms for continuous) and standard deviation analysis.",
      "Next Lesson: DNA structure, telomeres & replication — the molecular machinery of genetic inheritance."
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
    focus: "Acquired vs Inherited Mutations, Mutational Mechanisms & Huntington's CAG Repeat Pathology",
    deliverable: "Classify somatic acquired vs germline inherited mutations with concrete examples, contrast molecular mutation types (missense, nonsense, frameshift), and analyze the molecular pathology, CAG repeat thresholds, anticipation, and autosomal dominant transmission of Huntington's disease.",
    details: "1. Acquired (somatic) vs Inherited (germline) mutations: Somatic acquired mutations occur in non-reproductive body tissues (e.g. skin keratinocytes damaged by UV-B pyrimidine dimers, bronchial epithelium exposed to tobacco benzo[a]pyrene, or spontaneous DNA replication errors). They are confined to the individual's tissue lineage, cannot be transmitted to biological offspring via gametes, and are the primary drivers of oncogenesis and multistep carcinogenesis (accumulation of driver mutations in TP53, KRAS, APC). In contrast, germline inherited mutations occur in meiotic germ cells or gametes (spermatozoa, ova), are incorporated into the diploid zygote, exist in every cell of the offspring, and are heritable across generations according to Mendelian laws. 2. Molecular taxonomy and examples of gene mutations: Single nucleotide substitutions (transitions vs transversions) resulting in silent mutations (synonymous codon due to genetic code degeneracy), missense mutations (altering a single amino acid, e.g. sickle cell anaemia HBB GAG->GTG / Glu->Val causing hydrophobic HbS polymerisation; conservative vs non-conservative altering active site geometry), and nonsense mutations (premature stop codons UAA/UAG/UGA causing truncated non-functional proteins and nonsense-mediated mRNA decay, e.g. beta-thalassaemia codon 39). Insertion and deletion (indel) mutations causing reading frame shifts (frameshift mutations) unless occurring in multiples of 3 (in-frame indel, e.g. CFTR Delta F508). 3. Deep clinical & molecular focus — Huntington's disease (HD) and the CAG repeat expansion mutation: Located on chromosome 4p16.3 in the HTT gene, which encodes the huntingtin protein (essential for neurogenesis, vesicle trafficking, and BDNF transcription). Molecular pathology: an unstable trinucleotide / triplet repeat expansion of cytosine-adenine-guanine (CAG) in exon 1, encoding an elongated polyglutamine (polyQ) tract. Mechanism: replication slippage during meiosis causing hairpin loop structures and progressive repeat expansion. Diagnostic CAG repeat thresholds: Normal alleles (<=26 CAG repeats; stable transmission, unaffected); Intermediate alleles (27–35 CAG repeats; unaffected individual, but meiotically unstable and prone to expansion during spermatogenesis, posing risk to offspring); Reduced penetrance alleles (36–39 CAG repeats; variable or late-onset disease); Full penetrance alleles (>=40 CAG repeats; 100% lifetime risk of developing HD; inverse correlation between repeat number and age of symptom onset; juvenile HD >60 repeats). Genetic anticipation: phenomenon where symptoms manifest at an earlier age and with greater clinical severity in successive generations, driven by meiotic repeat expansion particularly through paternal transmission (spermatogenesis). Cellular pathophysiology: toxic gain-of-function mutant huntingtin (mHTT) misfolds into insoluble beta-sheet oligomers and intranuclear inclusions, disrupting axonal transport, impairing mitochondrial function, and sequestering transcription coactivators (CBP), leading to selective apoptotic neurodegeneration of striatal GABAergic medium spiny neurons in the caudate nucleus and putamen of the basal ganglia. Clinical phenotype: motor chorea (involuntary jerky movements), dystonia, rigidity, executive cognitive decline, and psychiatric disturbances. Inheritance: Autosomal dominant (50% risk for offspring of an affected parent). Presentation styling: Bright, high-contrast, luminous slides with clear colorful diagrams and generous whitespace.",
    starterQuestions: [
      { q: "Explain what is meant by 'semiconservative replication' of DNA.", a: "Each newly synthesized DNA molecule contains one original (template) parental strand and one newly synthesized daughter strand." },
      { q: "Describe the function of the enzyme DNA Helicase.", a: "Unwinds and separates the parental double helix by breaking hydrogen bonds between complementary base pairs at the replication fork." },
      { q: "Explain the action of DNA Polymerase III in terms of synthesis direction (5' to 3').", a: "Synthesizes new DNA exclusively in the 5' to 3' direction by adding complementary nucleotides to the free 3'-OH end of the growing strand." },
      { q: "Describe how Okazaki fragments are joined on the lagging strand, and identify the enzyme involved.", a: "Joined by DNA ligase, which catalyzes phosphodiester bonds between discontinuous Okazaki fragments following RNA primer removal." },
      { q: "State the role of RNA Primase in the initiation of DNA replication.", a: "Synthesizes a short RNA primer to provide a free 3'-OH group required by DNA polymerase to begin nucleotide addition." },
      { q: "Explain the process of DNA proofreading and how it maintains high replication fidelity.", a: "DNA polymerase 3' to 5' exonuclease activity detects and excises mismatched bases immediately during synthesis, ensuring high fidelity." }
    ],
    objectives: {
      knowledge: "Distinguish between acquired (somatic) and inherited (germline) mutations, classifying point mutations (missense, nonsense, silent) and indels.",
      application: "Explain the molecular mechanism of CAG triplet repeat expansion in the HTT gene on chromosome 4p16.3 and interpret clinical repeat thresholds (<26, 27-35, 36-39, >=40).",
      evaluation: "Evaluate the relationship between polyglutamine tract length, genetic anticipation (especially paternal transmission), striatal neurodegeneration, and autosomal dominant inheritance."
    },
    terminology: [
      { term: "Somatic vs Germline Mutation", def: "Somatic: acquired non-heritable mutations in body tissues driving cancer. Germline: mutations in sperm/egg passed to offspring." },
      { term: "Trinucleotide CAG Repeat", def: "A tandem repetition of Cytosine-Adenine-Guanine in exon 1 of the HTT gene encoding an expanded polyglutamine (polyQ) tract." },
      { term: "Full Penetrance Threshold (>=40)", def: "Alleles with 40 or more CAG repeats confer a 100% lifetime probability of developing Huntington's disease." },
      { term: "Genetic Anticipation", def: "Progression towards earlier age of onset and increased symptom severity across generations due to meiotic repeat expansion during gametogenesis." },
      { term: "Toxic Gain-of-Function", def: "Misfolded mutant huntingtin protein aggregating into toxic inclusion bodies that destroy striatal GABAergic neurons in the basal ganglia." }
    ],
    theoryPoints: [
      "Inheritance Boundary: Somatic mutations (e.g. UV skin damage) cannot be inherited because somatic lineages do not contribute genetic material to gametes.",
      "CAG Repeat Expansion Scale: Normal <=26; Intermediate 27–35 (unaffected, but mutable); Reduced penetrance 36–39; Full penetrance >=40 (inverse correlation with age of onset).",
      "Paternal Anticipation Bias: Instability and slippage of DNA polymerase during the thousands of mitotic/meiotic divisions of spermatogenesis cause greater repeat expansion through paternal transmission.",
      "Autosomal Dominant Risk: A single mutant HTT allele is sufficient to cause pathology; each child of an affected heterozygous parent faces a 50% risk."
    ],
    workedExample: {
      title: "Huntington's Diagnostic CAG Repeat & Pedigree Anticipation",
      subtitle: "Analyzing triplet repeat lengths and inheritance risk across three generations",
      steps: [
        { label: "Step 1: Paternal Grandfather", detail: "Carried an intermediate allele of 33 CAG repeats (unaffected, normal lifespan). During spermatogenesis, DNA replication slippage expanded the repeat tract." },
        { label: "Step 2: Affected Father", detail: "Inherited 42 CAG repeats (full penetrance). Developed classic motor chorea and cognitive changes at age 48 (autosomal dominant Hh)." },
        { label: "Step 3: Offspring Transmission", detail: "During father's spermatogenesis, further expansion occurred to 54 CAG repeats in his child." },
        { label: "Step 4: Clinical Anticipation Outcome", detail: "The child experiences onset of juvenile Huntington's disease in their late teens (~18 years), demonstrating genetic anticipation with earlier onset and increased severity." }
      ]
    },
    hingeQuestions: [
      {
        question: "A 32-year-old individual undergoes predictive genetic testing for Huntington's disease and is found to have 44 CAG repeats on one allele of the HTT gene. How should this result be interpreted?",
        options: ["Normal allele; the individual will never develop the condition", "Intermediate carrier; individual is unaffected but offspring are at risk", "Full penetrance allele; the individual will develop Huntington's disease if they live a normal lifespan, and each child has a 50% risk", "Recessive carrier; disease will only develop if the spouse also carries the allele"],
        correctIndex: 2,
        explanation: "Alleles with >=40 CAG repeats have 100% full penetrance for Huntington's disease, and as an autosomal dominant trait, each child has a 50% risk of inheritance."
      },
      {
        question: "Why do somatic mutations in the TP53 gene in skin cancer cells fail to pass to the patient's biological children?",
        options: ["Somatic mutations are automatically repaired during embryonic development", "Somatic cells do not form gametes; only germline mutations in sperm or ova are transmissible to offspring", "TP53 is only present in somatic tissue", "Maternal mitochondrial DNA suppresses paternal mutations"],
        correctIndex: 1,
        explanation: "Somatic mutations are confined to non-reproductive differentiated cell lineages and never enter meiotic germ cells or gametes."
      },
      {
        question: "What molecular mechanism is directly responsible for genetic anticipation in Huntington's disease families?",
        options: ["Progressive methylation of the promoter over time", "DNA polymerase replication slippage during gametogenesis (especially spermatogenesis) adding further CAG repeats across generations", "Telomere shortening in successive generations", "Accumulation of point mutations in mitochondrial DNA"],
        correctIndex: 1,
        explanation: "Replication slippage during meiosis expands the unstable CAG repeat sequence, leading to longer polyglutamine tracts and earlier onset in successive generations."
      }
    ],
    examQuestion: {
      question: "Explain the difference between acquired somatic mutations and inherited germline mutations, and analyze how a CAG trinucleotide repeat expansion in the HTT gene causes Huntington's disease, explaining the phenomenon of genetic anticipation. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Somatic vs Germline Distinction: Somatic mutations occur in non-gamete body tissues and cannot be passed to offspring (driving cancer); germline mutations arise in gametes and are inherited by all cells of offspring [2 marks].",
        "CAG Repeat Molecular Pathology: Unstable CAG expansion in HTT gene (exon 1, chromosome 4p16.3) encodes an elongated polyglutamine tract; >=40 repeats confers full penetrance; toxic gain-of-function mutant protein aggregates and causes selective neurodegeneration in striatal medium spiny neurons of the basal ganglia [2 marks].",
        "Genetic Anticipation Mechanism: DNA replication slippage during meiosis (particularly paternal transmission during spermatogenesis) further expands repeat length, resulting in earlier age of onset and increased symptom severity across generations [2 marks]."
      ]
    },
    plenary: [
      "Mutations are classified by origin (somatic vs germline) and molecular type (substitutions vs frameshifts).",
      "Huntington's disease is an exemplar triplet repeat disorder (CAG >=40 causes full-penetrance neurodegeneration).",
      "Genetic anticipation is driven by meiotic repeat expansion during gametogenesis.",
      "Next Lesson: Pedigree chart analysis & inheritance risk calculations — decoding family trees and computing precise genetic probabilities."
    ]
  },
  {
    number: 6,
    part: 2,
    teacher: "Dan",
    deckId: "Lesson_06_Genetic_disorders_single_gene_disorders",
    title: "Monohybrid crosses, pedigree chart analysis & inheritance risk calculations",
    focus: "Monohybrid Crosses (Punnett Squares), Pedigree Chart Analysis & Inheritance Risk Calculations",
    deliverable: "Construct and solve monohybrid crosses using 2x2 Punnett squares, interpret clinical pedigree charts across multiple generations to deduce inheritance modes (autosomal dominant, autosomal recessive, X-linked recessive), and calculate conditional inheritance risk probabilities using the product and sum rules.",
    details: "1. Principles of Monohybrid Genetic Crosses: Single-gene inheritance involving two contrasting alleles (dominant vs recessive, e.g. A vs a, or H vs h). Genotypes: homozygous dominant (AA), heterozygous (Aa), homozygous recessive (aa). Meiotic segregation of alleles (Mendel's First Law) during gamete formation. Standard conventions for setting up a monohybrid cross: identifying parental phenotypes, assigning parental genotypes, determining haploid gametes, constructing a 2x2 Punnett square, determining offspring genotypic ratios (1 AA : 2 Aa : 1 aa for a carrier cross Aa x Aa) and phenotypic ratios (3 unaffected : 1 affected for recessive traits; 1:1 for testcross Aa x aa). Testcross / backcross utility: crossing an organism displaying the dominant phenotype with a homozygous recessive (aa) mate to reveal whether the unknown genotype is homozygous (AA) or heterozygous (Aa). 2. Standard clinical pedigree chart nomenclature and symbols: International standardized pedigree conventions: Squares (males), Circles (females), Diamonds (unspecified sex), Shaded/filled symbols (affected individuals displaying the clinical phenotype), Unshaded/open symbols (unaffected individuals), Half-shaded or centered dot symbols (unaffected heterozygous carriers), Slashed symbols (deceased individuals), Double horizontal mating lines (consanguinity — mating between blood relatives), Roman numerals (I, II, III, IV) designating generational rows, Arabic numerals (1, 2, 3...) designating individuals within a generation, and an arrow indicating the proband (consultand / index case). 3. Deducing modes of inheritance from pedigree architecture: (a) Autosomal Recessive (e.g. Cystic Fibrosis, Sickle Cell Anaemia): Trait typically skips generations (horizontal pedigree distribution); affected offspring frequently born to unaffected asymptomatic carrier parents (Aa x Aa); equal ratio of affected males and females; consanguinity significantly increases frequency; unaffected parents of an affected child are obligate carriers. (b) Autosomal Dominant (e.g. Huntington's disease, Achondroplasia): Trait appears in every consecutive generation without skipping (vertical pedigree pattern); every affected individual has at least one affected parent; unaffected individuals (aa) do not transmit the condition to offspring; equal sex distribution; heterozygous affected parent (Aa) mated with unaffected spouse (aa) confers a 50% (1 in 2) recurrence risk per pregnancy. (c) X-Linked Recessive (e.g. Haemophilia A, Duchenne Muscular Dystrophy, Red-Green Colour Blindness): Distinctly higher incidence in males (hemizygous XY expressing disease with single mutant allele); strictly no male-to-male (father-to-son) transmission (fathers pass Y chromosome to sons); 100% of daughters of affected males are obligate carriers; carrier females (XAXa) transmit mutant allele to 50% of sons (affected) and 50% of daughters (carriers). 4. Integrating Monohybrid Crosses with Pedigree Analysis & Risk Calculations: Translating pedigree relationships into monohybrid Punnett square crosses. Product rule for independent events: P(A and B) = P(A) x P(B). Sum rule for mutually exclusive events: P(A or B) = P(A) + P(B). Conditional probability and the 2/3 carrier risk principle: An unaffected sibling of an individual with an autosomal recessive condition whose parents are carriers (Aa x Aa). Because the sibling is confirmed unaffected, the homozygous recessive genotype (aa) is excluded; the remaining possible genotypes are AA (1/3) and Aa (2/3). Therefore, the probability of being a carrier is 2/3, NOT 1/2! Multi-step genetic counseling risk calculation: Calculating the probability of a future child being affected = P(Parent 1 is carrier) x P(Parent 2 is carrier from general population) x P(both transmit mutant allele = 1/4). Punnett square verification and probability tree construction. Presentation styling: Bright, high-contrast, luminous slides with crisp black/white symbols, colorful highlighting, clear 2x2 Punnett square grids, and generous whitespace.",
    starterQuestions: [
      { q: "In a monohybrid cross between two heterozygous carriers (Aa x Aa), what are the expected genotypic and phenotypic ratios?", a: "Genotypic ratio is 1 AA : 2 Aa : 1 aa (1:2:1); phenotypic ratio is 3 dominant : 1 recessive (3:1)." },
      { q: "What geometric shapes represent males and females in standard clinical pedigree charts?", a: "Squares represent males; circles represent females." },
      { q: "What pedigree observation definitively disproves an X-linked recessive mode of inheritance?", a: "Father-to-son (male-to-male) transmission of the trait (fathers pass only their Y chromosome to sons)." },
      { q: "Why is a testcross performed with a homozygous recessive individual (aa)?", a: "To determine whether an individual showing the dominant phenotype is homozygous dominant (AA) or heterozygous (Aa)." },
      { q: "What is the probability that a healthy, unaffected sibling of a child with an autosomal recessive condition is a carrier?", a: "2 in 3 (2/3 or ~66.7%), because the homozygous recessive genotype (aa) is excluded from the surviving outcomes." },
      { q: "State the mathematical rule used to calculate the joint probability of two independent genetic events occurring together.", a: "The Product Rule (multiplication rule: P(A and B) = P(A) x P(B))." }
    ],
    objectives: {
      knowledge: "Construct 2x2 Punnett squares for monohybrid crosses and identify standard clinical pedigree chart symbols.",
      application: "Decode multi-generational pedigrees to deduce autosomal dominant, autosomal recessive, and X-linked recessive inheritance modes.",
      evaluation: "Combine monohybrid Punnett square probabilities with conditional pedigree analysis to calculate precise disease transmission and carrier risk probabilities."
    },
    terminology: [
      { term: "Monohybrid Cross", def: "A genetic mating analyzing the inheritance of a single gene locus with two alleles (yielding 3:1 phenotypic ratio for Aa x Aa)." },
      { term: "Punnett Square", def: "A 2x2 grid representing the meiotic segregation of parental alleles into gametes and all possible fertilization genotypes." },
      { term: "Pedigree Nomenclature", def: "Standardized genealogical symbols: squares (males), circles (females), Roman numerals (generations), and Arabic numbers (individuals)." },
      { term: "Conditional 2/3 Carrier Risk", def: "The probability that an unaffected sibling of an autosomal recessive patient is a carrier: 2/3 (sample space restricted to AA and Aa)." },
      { term: "Testcross", def: "Mating an individual with dominant phenotype to a homozygous recessive mate (aa) to deduce their genotype (1:1 ratio if heterozygous)." }
    ],
    theoryPoints: [
      "Monohybrid Segregation: Mendel's First Law ensures each gamete carries only one allele per gene locus, producing equal proportions of dominant and recessive gametes in heterozygotes.",
      "Pedigree Diagnostics: Look first for generational skipping (recessive) vs vertical continuity (dominant), and check sex ratios and father-son transmission (autosomal vs X-linked).",
      "Obligate Carrier Identification: In autosomal recessive pedigrees, both parents of an affected child must be carriers (Aa). In X-linked recessive, all daughters of an affected father must be carriers (XAXa).",
      "The 2/3 Sibling Rule: Phenotypically normal offspring of Aa x Aa crosses have genotypes 1 AA : 2 Aa, so carrier probability is 2/3.",
      "Compound Risk Product Rule: P(affected child) = P(Mother is carrier) x P(Father is carrier) x P(both transmit recessive allele = 1/4)."
    ],
    workedExample: {
      title: "Monohybrid Cross & Pedigree Risk Calculation",
      subtitle: "Combining a 2x2 Punnett square with a 3-generation clinical pedigree tree for Cystic Fibrosis",
      steps: [
        { label: "Step 1: Constructing the Monohybrid Punnett Square", detail: "Parental carrier cross: Aa x Aa. Gametes: A and a from each parent. 2x2 Punnett square yields genotypes: 1 AA (healthy non-carrier), 2 Aa (healthy carrier), 1 aa (affected CF). Phenotypic ratio: 3 healthy : 1 affected." },
        { label: "Step 2: Deducing Sarah's Conditional Carrier Probability", detail: "Pedigree shows Sarah is the unaffected sister of an affected brother (aa). Since Sarah is healthy, the aa genotype is ruled out. Her genotype must be AA (1/3) or Aa (2/3). Sarah's carrier risk is 2/3." },
        { label: "Step 3: Determining Partner's Population Carrier Probability", detail: "Her partner David has no family history of CF. In the UK population, the carrier frequency for CF is approximately 1 in 25 (1/25)." },
        { label: "Step 4: Applying the Product Rule for Total Offspring Risk", detail: "Risk of child having CF = P(Sarah is carrier = 2/3) x P(David is carrier = 1/25) x P(both transmit 'a' = 1/4) = 2/300 = 1/150 (~0.67%)." }
      ]
    },
    hingeQuestions: [
      {
        question: "In a pedigree, two unaffected parents have a son and a daughter with a rare metabolic disorder. What is the definitive mode of inheritance?",
        options: ["Autosomal dominant", "Autosomal recessive", "X-linked recessive", "Mitochondrial maternal"],
        correctIndex: 1,
        explanation: "Unaffected parents having affected children indicates recessive inheritance; both a male and female offspring are affected, confirming autosomal rather than X-linked or Y-linked."
      },
      {
        question: "A healthy man's brother died of Cystic Fibrosis. He marries a woman whose carrier status is unknown (general population carrier risk = 1/25). What is the probability that their first child will have Cystic Fibrosis?",
        options: ["1 in 50", "1 in 100", "1 in 150", "1 in 300"],
        correctIndex: 2,
        explanation: "Risk = P(Man is carrier = 2/3) x P(Woman is carrier = 1/25) x P(Both transmit mutant allele = 1/4) = 2/300 = 1/150."
      },
      {
        question: "A father affected with X-linked hypophosphataemic rickets (dominant) has children with an unaffected mother. What proportion of their children will inherit the condition?",
        options: ["50% of sons and 50% of daughters", "All daughters and no sons", "All sons and no daughters", "Zero children (condition requires two mutant alleles)"],
        correctIndex: 1,
        explanation: "An affected father passes his single affected X chromosome to 100% of his daughters, who will be affected because the trait is dominant. He passes his normal Y chromosome to all sons."
      }
    ],
    examQuestion: {
      question: "Analyze the inheritance pattern of an autosomal recessive condition in a three-generation pedigree, explain why unaffected siblings of affected individuals have a 2/3 carrier risk rather than 1/2, and calculate the overall risk of an affected child if an unaffected sibling marries an unrelated partner from a population where carrier frequency is 1 in 30. [6 marks]",
      marks: "6 marks",
      guidance: [
        "Pedigree Diagnostic Criteria: Autosomal recessive disorders skip generations (horizontal pattern); unaffected parents of affected offspring are obligate carriers (Aa); equal sex incidence [2 marks].",
        "Conditional 2/3 Carrier Probability: In an Aa x Aa cross, expected offspring genotypes are 1 AA : 2 Aa : 1 aa. Because an unaffected sibling cannot be 'aa', the denominator is restricted to 3 outcomes (1 AA and 2 Aa); therefore, 2 out of 3 possible genotypes are carriers (2/3 probability) [2 marks].",
        "Risk Calculation: Apply the product rule: P(affected child) = P(sibling is carrier = 2/3) x P(partner is carrier = 1/30) x P(both transmit 'a' = 1/4) = 2/360 = 1/180 (~0.56%) [2 marks]."
      ]
    },
    plenary: [
      "Pedigree charts provide a visual blueprint of genetic transmission across generations.",
      "Recognize key diagnostic flags: generation skipping (recessive), vertical continuity (dominant), and male bias / lack of father-to-son transmission (X-linked).",
      "Master conditional probability: unaffected siblings of autosomal recessive individuals are 2/3 carriers.",
      "Next Lesson: Genetic disorders: Chromosomal abnormalities — nondisjunction mechanisms and karyotyping of aneuploidies."
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
      "Unit F172 Genetics Synthesis: We have journeyed from DNA structure, through expression and mutation, to the population genomics of human disease.",
      "Next Lesson: Genetics NEA Task 1: Huntington's disease inheritance — synoptic clinical case study revision (Ben), molecular pathology, genetic anticipation, and academic research & referencing."
    ]
  },
  {
    number: 9,
    part: 3,
    teacher: "Dan",
    deckId: "Lesson_09_Genetics_NEA_Task_1_Huntingtons_Case_Study_Revision",
    title: "Genetics NEA Task 1: Huntington's disease inheritance (Ben case study)",
    focus: "Huntington's Disease Inheritance, CAG Triplet Repeats, Striatal Neuronal Degeneration, Genetic Anticipation, and Academic Research & Referencing for NEA Task 1",
    deliverable: "Complete the synoptic NEA Task 1 portfolio scaffold: analyze Ben's clinical case study (autosomal dominant transmission, 50% inheritance risk across all 3 children, CAG expansion mechanisms, and striatal MSN apoptosis), evaluate genetic testing and reproductive ethics (presymptomatic testing in minors, prenatal CVS/amniocentesis, and PGD/IVF), and construct an academic literature review with full Harvard referencing.",
    details: "Comprehensive revision of all core genetic knowledge and coursework research skills required to achieve top marks in Task 1 of the Unit F172 Genetics Non-Exam Assessment (NEA). 1. Clinical Case Study Analysis (Ben, 40-year-old teacher): Early-stage Huntington's disease diagnosis following a 1-year history of motor chorea (involuntary jerky movements of arms, legs, face), progressive loss of fine motor coordination (struggling to grip pens, affecting teaching and causing professional embarrassment), and brain MRI scan showing neurodegenerative striatal atrophy (caudate nucleus and putamen loss, ventricular enlargement). Critical adoption context: Ben was adopted at age two with unknown biological medical history; highlights how late-onset autosomal dominant conditions (symptoms appearing at age 30–50) can remain entirely unrecognised across generations when biological parentage is severed or ancestors die young from unlinked causes. 2. Molecular Pathology & The HTT Gene: Located on chromosome 4p16.3, the HTT gene encodes the large huntingtin protein essential for neurogenesis, vesicular transport, and BDNF transcription. Pathology is driven by an unstable trinucleotide CAG repeat expansion in exon 1, encoding an elongated polyglutamine (polyQ) tract. Diagnostic CAG repeat thresholds: Normal alleles (<=26 repeats, stable transmission); Intermediate alleles (27–35 repeats, clinically unaffected but meiotically mutable, posing risk to offspring); Reduced penetrance alleles (36–39 repeats, variable late onset); Full penetrance alleles (>=40 repeats, 100% lifetime probability of developing HD; inverse correlation between repeat length and age of onset; juvenile onset >60 repeats). 3. Cellular & Neuronal Pathophysiology: Mutant huntingtin (mHTT) undergoes toxic gain-of-function due to altered tertiary structure and misfolding into insoluble beta-sheet oligomers and intranuclear inclusion bodies. Cellular consequences: disruption of microtubule axonal transport of vesicles, mitochondrial respiratory dysfunction and increased oxidative stress, and sequestration of transcription factors and coactivators (such as CREB-binding protein / CBP), which silences transcription of Brain-Derived Neurotrophic Factor (BDNF) in the cortex and striatum. This triggers selective apoptotic neurodegeneration of GABAergic Medium Spiny Neurons (MSNs) within the striatum (caudate nucleus and putamen of the basal ganglia). Loss of GABAergic inhibitory output disinhibits the motor thalamus and cerebral cortex, causing hyperkinetic choreiform motor symptoms, alongside progressive executive cognitive dysfunction and affective psychiatric symptoms (depression, apathy). 4. Mode of Inheritance & Pedigree Risk for Ben's Family: Autosomal dominant monogenic transmission. Ben is heterozygous (genotype Hh; carrying one expanded CAG allele and one normal allele); his wife is homozygous unaffected (hh). Punnett square cross Hh x hh demonstrates: 50% (1 in 2) probability for EACH biological child inheriting the mutant HTT allele and developing Huntington's disease. Crucial genetic counselling principle: risk is entirely independent for each conception (the birth of an unaffected child does not reduce or alter the 50% risk for subsequent siblings); therefore, Ben's 6-year-old daughter, 3-year-old son, and unborn 3rd child each face an independent 50% risk of inheriting the fatal condition. 5. Genetic Anticipation & Parental Transmission Bias: Anticipation is the clinical phenomenon whereby a genetic condition manifests at an earlier age and with increasing clinical severity in successive generations. Biological mechanism: replication slippage by DNA polymerase during meiotic gametogenesis, where the repetitive CAG tract forms unstable secondary hairpin loop structures that are erroneously repaired with additional repeats. Paternal transmission bias: spermatogenesis involves continuous, lifelong mitotic and meiotic stem cell divisions (hundreds of cycles) with high replication slippage and reduced DNA repair efficiency compared to oogenesis (which arrests in prophase I dictyotene with fewer total divisions). Because Ben is a biological father transmitting the gene, his children are at significant risk of receiving an expanded CAG repeat tract (> Ben's repeat count), potentially causing juvenile-onset Huntington's disease (onset <20 years) or earlier onset than Ben's presentation at age 39. 6. Clinical Genetic Testing, Reproductive Genetics & Medical Technologies: (a) Presymptomatic / predictive testing: UK clinical consensus and British Society for Genetic Medicine guidelines strictly prohibit testing asymptomatic minor children (the 6-year-old daughter and 3-year-old son) until they reach the age of majority (18 years) to preserve their future autonomy and 'right not to know', as testing offers no childhood preventative therapy and carries severe psychological implications. (b) Prenatal diagnosis for the current pregnancy: Invasive procedures such as Chorionic Villus Sampling (CVS at 11–14 weeks) or Amniocentesis (15–20 weeks) to harvest fetal DNA for PCR CAG sizing (~0.5% miscarriage risk; raises ethical dilemma regarding termination of an affected pregnancy). (c) Pre-implantation Genetic Diagnosis (PGD / PGT-M) with IVF: For future pregnancies, embryos created in vitro undergo blastocyst biopsy and PCR testing; only embryos carrying two normal alleles (hh) are transferred, guaranteeing an unaffected child without requiring termination. Non-disclosure PGD protocol can be utilised if an at-risk parent does not want to learn their own status. (d) Current vs Emerging Therapies: Current management is purely symptomatic (tetrabenazine / deutetrabenazine to reduce chorea by inhibiting vesicular monoamine transporter 2 [VMAT2], depleting presynaptic dopamine; physiotherapy; speech therapy). Emerging technologies: disease-modifying therapies in clinical development include antisense oligonucleotides (ASOs, e.g. tominersen) targeting HTT pre-mRNA to downregulate toxic mutant protein synthesis, RNA interference (RNAi), and CRISPR-Cas9 / zinc-finger epigenetic repression targeting expanded CAG repeats. 7. Coursework Skills Workshop — Research & Referencing for NEA Task 1: (a) Formulating academic literature search strategies using Boolean logic (AND, OR, NOT), wildcard truncation (*), and MeSH headings across PubMed, Europe PMC, NICE Clinical Knowledge Summaries, and the NHS Huntington's Disease clinical network. (b) Evaluating source validity using the CRAAP framework (Currency, Relevance, Authority, Accuracy, Purpose) to distinguish high-impact peer-reviewed medical journals and clinical consensus guidelines from commercial blog posts or patient advocacy opinion. (c) Strict Harvard referencing: precise in-text author-date citations (e.g. 'Walker (2007) states...' or '...selective striatal neurodegeneration (Bates et al., 2015)') and complete bibliographic entries formatted according to institutional academic standards (Author surname, Initials., Year. Title of article. Full Title of Journal, Volume(Issue), pp. Page numbers. DOI/URL).",
    starterQuestions: [
      { q: "What is the genotype of an individual affected by a heterozygous autosomal dominant disorder such as Huntington's disease?", a: "Hh (heterozygous, carrying one mutant expanded HTT allele and one normal allele)." },
      { q: "What is the mathematical probability that an affected heterozygous parent (Hh) transmits Huntington's disease to each biological child when mated with an unaffected partner (hh)?", a: "50% (1 in 2, or a probability of 0.5) for each pregnancy, independent of the sex or health of previous children." },
      { q: "Which specific trinucleotide triplet sequence undergoes pathological expansion in exon 1 of the HTT gene on chromosome 4p16.3?", a: "Cytosine-Adenine-Guanine (CAG), encoding an elongated polyglutamine (polyQ) tract." },
      { q: "What is the diagnostic full-penetrance CAG repeat threshold for Huntington's disease?", a: "40 or more CAG repeats (>=40 CAG repeats confers 100% lifetime penetrance of Huntington's disease)." },
      { q: "Which specific population of neurons within the basal ganglia undergoes selective degeneration in early-stage Huntington's disease?", a: "GABAergic Medium Spiny Neurons (MSNs) within the striatum (caudate nucleus and putamen)." },
      { q: "Why is genetic anticipation in Huntington's disease significantly more pronounced when the mutant allele is transmitted paternally rather than maternally?", a: "Continuous, lifelong meiotic cell divisions in spermatogenesis generate high rates of DNA replication slippage compared to oogenesis." }
    ],
    objectives: {
      knowledge: "Explain how CAG repeat expansions in the HTT gene cause mutant huntingtin protein aggregation, selective striatal MSN apoptosis, and motor chorea, defining genetic anticipation.",
      application: "Apply autosomal dominant inheritance principles (Punnett square cross Hh x hh) to calculate transmission probabilities (50% per child) and evaluate clinical testing pathways for Ben's family.",
      evaluation: "Evaluate ethical dilemmas in predictive testing of minors versus prenatal diagnosis (CVS/amniocentesis) and PGD/IVF, applying CRAAP criteria and Harvard referencing to NEA Task 1 evidence."
    },
    terminology: [
      { term: "Trinucleotide CAG Repeat", def: "An unstable tandem repeat of Cytosine-Adenine-Guanine in exon 1 of the HTT gene encoding an expanded polyglutamine (polyQ) tract." },
      { term: "Toxic Gain-of-Function", def: "Pathological property where mutant huntingtin protein misfolds, aggregates, and destroys striatal GABAergic medium spiny neurons." },
      { term: "Autosomal Dominant Inheritance", def: "A pattern of monogenic inheritance where a single copy of a mutant allele on a non-sex chromosome is sufficient to cause the disease." },
      { term: "Genetic Anticipation", def: "The phenomenon where symptoms manifest at an earlier age and with greater clinical severity in successive generations due to meiotic repeat expansion." },
      { term: "Paternal Transmission Bias", def: "Pronounced repeat expansion occurring during spermatogenesis due to continuous germline replication slippage, risking juvenile HD." },
      { term: "Pre-implantation Genetic Diagnosis (PGD/PGT-M)", def: "Testing in vitro embryos prior to uterine implantation, selecting only unaffected (hh) embryos to prevent disease transmission." }
    ],
    theoryPoints: [
      "Case Study Grounding (Ben): Adopted background explains the absence of family history; 40-year-old presentation reflects classic midlife choreiform onset with bilateral striatal atrophy on brain MRI.",
      "Molecular & Cellular Mechanism: Unstable CAG expansion (>=40 repeats) in HTT encodes polyglutamine tract; mutant protein misfolding sequesters transcription factors (CBP), decreases BDNF, and triggers striatal MSN apoptosis.",
      "Transmission & Anticipation Risk: Autosomal dominant cross (Hh x hh) gives a 50% recurrence risk for each child (6yo daughter, 3yo son, unborn baby); paternal transmission risks meiotic slippage expansion and earlier juvenile onset.",
      "Coursework Skills for NEA Task 1: Rigorous academic literature search (PubMed/NICE), source critique using CRAAP criteria, and accurate Harvard author-date citation formatting."
    ],
    workedExample: {
      title: "Ben's Family Genetic Risk & Clinical Pathway Scaffolding",
      subtitle: "Constructing the Mendelian cross, evaluating anticipation, and planning clinical testing",
      steps: [
        { label: "Step 1: Parental Genotype Assignment", detail: "Ben is diagnosed with HD and is heterozygous (Hh). His wife is clinically unaffected with no family history, giving genotype hh." },
        { label: "Step 2: Punnett Square Cross (Hh x hh)", detail: "Gametes: Ben produces 50% H and 50% h; Wife produces 100% h. Offspring genotypes: 50% Hh (affected), 50% hh (unaffected). Each child has an independent 50% (1 in 2) risk." },
        { label: "Step 3: Paternal Anticipation Evaluation", detail: "Because Ben is the biological father, meiotic DNA polymerase slippage during spermatogenesis can expand his CAG tract (e.g. from 42 to >55 repeats), exposing his children to earlier-onset or juvenile Huntington's disease." },
        { label: "Step 4: Clinical & Reproductive Testing Plan", detail: "Presymptomatic testing for the 6yo and 3yo is deferred until age 18 (autonomy/right not to know); prenatal testing (CVS at 11-14 wks or amniocentesis at 15-20 wks) is evaluated for the unborn fetus; PGD with IVF is proposed for future reproductive planning." }
      ]
    },
    hingeQuestions: [
      {
        question: "Ben asks his genetic counsellor whether having two healthy children already means their third, unborn child has a lower chance of inheriting Huntington's disease. What is the scientifically accurate response?",
        options: [
          "Yes, because the binomial probability of having three affected children is only 12.5%",
          "No, because each conception is an independent event with an unvarying 50% probability of inheriting the mutant HTT allele",
          "Yes, because maternal alleles compensate for paternal mutations in later pregnancies",
          "No, the risk actually increases to 75% for the third child"
        ],
        correctIndex: 1,
        explanation: "In autosomal dominant monogenic inheritance, each conception represents an independent meiotic segregation event. The outcome of previous pregnancies has zero effect on subsequent pregnancies (each child faces an exact 50% risk)."
      },
      {
        question: "Why do UK clinical genetics guidelines recommend AGAINST predictive genetic testing for Ben's 6-year-old daughter and 3-year-old son?",
        options: [
          "Polymerase Chain Reaction (PCR) cannot amplify DNA from children under 10 years old",
          "Huntington's disease testing requires full adult skeletal maturity for accurate results",
          "To protect the child's future autonomy and 'right not to know' their genetic destiny, given that no preventative childhood intervention exists for this adult-onset condition",
          "Because adoption laws prohibit testing biological offspring"
        ],
        correctIndex: 2,
        explanation: "International and UK clinical consensus dictates that presymptomatic testing for adult-onset conditions without childhood preventative treatments should be deferred until the individual reaches the age of majority (18 years) to make an informed, autonomous decision."
      },
      {
        question: "Which molecular mechanism explains why genetic anticipation in Huntington's disease is significantly more pronounced when inherited from an affected father compared to an affected mother?",
        options: [
          "The HTT gene is located on the Y chromosome",
          "Spermatogenesis involves continuous lifelong germline cell divisions, leading to frequent replication slippage and repeat expansion in secondary hairpin structures",
          "Oocytes actively methylate and excise CAG repeat codons during meiosis I",
          "Mitochondrial DNA accelerates polyglutamine translation in males"
        ],
        correctIndex: 1,
        explanation: "Sperm production involves hundreds of cell divisions throughout male adult life, creating vast opportunities for DNA polymerase replication slippage across tandem repetitive sequences, whereas female gametogenesis involves far fewer divisions."
      }
    ],
    examQuestion: {
      question: "Ben, a 40-year-old adopted teacher, has been diagnosed with early-stage Huntington's disease following symptoms of chorea. He and his wife have two young children (aged 6 and 3) and are expecting a third child. (a) Explain the molecular and cellular mechanism by which a CAG triplet repeat expansion in the HTT gene causes neuronal damage, and explain why his children are at risk of genetic anticipation. (b) Explain how Huntington's disease is inherited in Ben's family, and evaluate the clinical and ethical options available to Ben and his wife regarding genetic testing for their children, prenatal diagnosis, and future reproductive technologies. [8 marks]",
      marks: "8 marks",
      guidance: [
        "Molecular & Cellular Pathophysiology: Unstable CAG repeat expansion (>=40 repeats) in exon 1 of HTT (chr 4p16.3) causes polyglutamine expansion; mutant huntingtin misfolds (toxic gain-of-function), forming inclusion bodies, disrupting axonal transport and BDNF expression, triggering selective apoptosis of GABAergic medium spiny neurons (MSNs) in the striatum (caudate and putamen), leading to motor chorea [3 marks].",
        "Genetic Anticipation Mechanism: DNA polymerase replication slippage during meiosis expands the CAG tract; paternal transmission bias during spermatogenesis causes substantial repeat expansion, conferring risk of earlier age of onset and greater severity in his offspring [2 marks].",
        "Inheritance & Testing Evaluation: Autosomal dominant cross (Ben Hh x Wife hh) confers a 50% independent risk per pregnancy. Presymptomatic testing of minor children (aged 6 and 3) is ethically deferred until adulthood (age 18) to preserve autonomy and right not to know. For the unborn fetus, prenatal diagnosis (CVS/amniocentesis) carries miscarriage risk and raises abortion dilemmas. Pre-implantation Genetic Diagnosis (PGD/PGT-M) with IVF offers an embryo-screening alternative for future pregnancies [3 marks]."
      ]
    },
    plenary: [
      "Huntington's disease exemplifies an autosomal dominant trinucleotide repeat disorder characterized by toxic gain-of-function and selective striatal MSN apoptosis.",
      "Each child of an affected heterozygous parent faces an independent 50% transmission risk, with paternal transmission posing heightened risk of genetic anticipation.",
      "Ethical clinical management balances predictive testing autonomy in minors against prenatal diagnosis (CVS/amniocentesis) and PGD-IVF options.",
      "Mastery of Boolean database searching, CRAAP source evaluation, and Harvard referencing provides the foundational toolkit for high-scoring NEA coursework."
    ]
  }
];
