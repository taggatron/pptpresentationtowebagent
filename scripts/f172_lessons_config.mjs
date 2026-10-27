import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const EDGE_CDP_PORT = 9334;
const BASE_OUTPUT_DIR = path.resolve("./output/f172_lessons");

const LESSONS = [
  {
    number: 9,
    folder: "Lesson_09_Gene_Therapy_Viral_and_Non_Viral_Vectors",
    title: "F172 - Lesson 9: Gene Therapy - Viral & Non-Viral Vector Delivery",
    shortName: "Lesson_09_Viral_and_Non_Viral_Vectors",
    prompt: `Create a comprehensive, visually luminous, high-clarity 10-slide classroom presentation deck artifact titled: "F172 - Lesson 9: Gene Therapy - Viral & Non-Viral Vector Delivery".

TARGET AUDIENCE & COURSE:
OCR AAQ Level 3 Human Biology (Unit F172: Genetics) · Lesson 9 (Dan).

AESTHETIC & PEDAGOGICAL DIRECTIVES:
1. BRIGHT, LUMINOUS DESIGN: Crisp white/pale backgrounds, floating glass-like cards, high-contrast typography, biomedical accent colors (cyan, emerald, navy, amber).
2. LOW COGNITIVE LOAD: Max 3-4 bullet points per card. Short, punchy bullets (under 15 words) with bold lead-in keywords.
3. CURRICULUM RIGOUR: Cover every aspect of gene therapy delivery vectors for Unit F172.

SLIDE-BY-SLIDE SPECIFICATION:
Slide 1: Title & Lesson Orientation
- Title: F172 Lesson 9: Gene Therapy Vector Delivery
- Subtitle: OCR AAQ Level 3 Human Biology · Unit F172: Genetics (Dan)
- Scope Badges: [Viral Vectors] [Non-Viral Systems] [Anatomical Barriers] [Delivery Routes]
- Core Objective: Differentiate molecular mechanisms, packaging capacities, and clinical trade-offs of viral and non-viral gene delivery systems.

Slide 2: Foundations of Gene Therapy Delivery Routes
- Title: Delivery Strategies: In Vivo, Ex Vivo & In Situ
- 3 Comparison Columns:
  • In Vivo: Direct systemic or local vector administration into patient tissues (e.g. AAV infusion into retina or CNS).
  • Ex Vivo: Patient cells harvested, genetically engineered in laboratory culture, and re-infused (e.g. HSCs, CAR-T).
  • In Situ: Localized administration directly into target anatomical compartment (e.g. intrathecal, stereotactic striatal).
- Key Principle: Choice depends on cell dividing state, anatomical accessibility, and immune clearance risks.

Slide 3: Adeno-Associated Virus (AAV) Vectors
- Title: Adeno-Associated Virus (AAV): The CNS Gold Standard
- 3 Vector Feature Cards:
  • Tropism & Serotypes: High affinity for post-mitotic cells; serotypes AAV2, AAV5, AAV9 target neurons and retinal cells.
  • Episomal Expression: Forms stable episomal concatemers in cell nucleus without integrating into host chromosomes; near-zero insertional oncogenesis risk.
  • Packaging Limit: Strict 4.7 kb genetic payload ceiling limits transgene size.
- Clinical Hallmark: Long-lasting expression in non-dividing neurons with low inflammatory immunogenicity.

Slide 4: Lentiviral & Retroviral Vectors
- Title: Lentiviral Vectors: Permanent Genomic Integration
- 3 Vector Feature Cards:
  • Stable Integration: Permanently integrates transgene into host chromosomal DNA, ensuring transmission to all daughter cells.
  • Cargo Capacity: Accommodates large gene payloads up to 8–10 kb.
  • Insertional Mutagenesis: Risk of insertional oncogenesis if integrated adjacent to proto-oncogenes.
- Primary Clinical Niches: Ex vivo hematopoietic stem cell therapy (ADA-SCID, beta-thalassemia) and CAR-T cell oncology.

Slide 5: Adenoviral & Other Viral Vector Systems
- Title: Adenoviral Vectors & Alternative Viral Platforms
- 2-Column Comparative Layout:
  • Adenovirus (AdV): Double-stranded DNA, non-integrating, massive packaging capacity (up to 30 kb in helper-dependent gutless vectors). High capsid immunogenicity triggers acute innate immune and inflammatory responses; transient expression ideal for vaccines.
  • Herpes Simplex Virus (HSV): Naturally neurotropic, enormous payload capacity (>30 kb), persistent latency in sensory ganglia.

Slide 6: Non-Viral Chemical Delivery: Lipid Nanoparticles (LNPs)
- Title: Lipid Nanoparticles (LNPs): Non-Viral Nanotechnology
- 3 Structural & Functional Cards:
  • Molecular Architecture: Ionizable cationic lipids (neutral at physiological pH, positively charged in endosomes), cholesterol, helper phospholipids, and PEG-lipids.
  • Cellular Uptake & Escape: Endocytosis followed by endosomal protonation; ionizable lipids disrupt endosomal membrane, facilitating cytoplasmic mRNA release.
  • Clinical Strengths: No viral protein capsids (minimal adaptive immune neutralization, allows repeated dosing), high manufacturing scalability.

Slide 7: Physical Delivery Methods & Cellular Permeabilization
- Title: Physical Delivery Modalities: Direct Membrane Entry
- 3 Physical Method Cards:
  • Electroporation: Short, high-voltage electrical pulses transiently destabilize cell membranes, creating aqueous nanopores for nucleic acid entry.
  • Microinjection & Ballistic: Direct mechanical micro-capillary injection into individual zygotes/cells or gold microparticle bombardment.
  • Hydrodynamic Delivery: High-pressure fluid injection to transiently permeabilize capillary endothelia in targeted organs.

Slide 8: Overcoming Anatomical Barriers: The Blood-Brain Barrier
- Title: Neurodelivery: Penetrating the Blood-Brain Barrier (BBB)
- 2-Column Analytical Layout:
  • The BBB Challenge: Continuous brain capillary endothelial tight junctions, astrocytic end-feet, and active efflux transporters block >98% of systemic macromolecules.
  • Convection-Enhanced Delivery (CED): Stereotactic neurosurgical microcannula placement; positive-pressure gradient infusion directly into brain parenchyma (e.g. striatum) driving homogeneous interstitial fluid distribution.

Slide 9: Comparative Vector Selection Matrix
- Title: Vector Evaluation: Selecting the Optimal Delivery System
- Comprehensive Comparison Table:
  • Criteria: Packaging Capacity | Target Cell Division | Integration Status | Immunogenicity | Duration of Expression.
  • AAV: 4.7 kb | Non-dividing | Episomal | Low | Years (post-mitotic).
  • Lentivirus: 8–10 kb | Dividing & non-dividing | Integrated | Moderate | Permanent.
  • Adenovirus: Up to 30 kb | Dividing & non-dividing | Episomal | Very High | Transient (weeks).
  • LNPs: Highly flexible | Dividing & non-dividing | Non-integrating | Low-Moderate | Transient (days-weeks).

Slide 10: Formative Knowledge Check & Exam Scenario
- Title: Lesson 9 Knowledge Check: Delivery Route Scenario
- 2 Student Challenge Cards:
  • Clinical Scenario: "A clinical team is developing a gene therapy for a genetic disorder affecting adult retinal photoreceptors (non-dividing cells). The cDNA sequence is 3.8 kb. Evaluate whether AAV, Lentivirus, or LNPs is the most appropriate delivery vector."
  • Success Criteria: Justify AAV based on packaging fit (<4.7 kb), high ocular/neuronal tropism, non-integrating episomal safety, and long-term expression without insertional oncogenesis.`
  },
  {
    number: 10,
    folder: "Lesson_10_Gene_Therapy_Clinical_Trials_ANT130_NEA_Task_2",
    title: "F172 - Lesson 10: Gene Therapy Clinical Trials & Task 2 Research (ANT-130)",
    shortName: "Lesson_10_Gene_Therapy_Clinical_Trials_ANT130",
    prompt: `Create a comprehensive, visually luminous, high-clarity 10-slide classroom presentation deck artifact titled: "F172 - Lesson 10: Gene Therapy Clinical Trials & Task 2 Research (ANT-130)".

TARGET AUDIENCE & COURSE:
OCR AAQ Level 3 Human Biology (Unit F172: Genetics) · Lesson 10 (Matt).

AESTHETIC & PEDAGOGICAL DIRECTIVES:
1. BRIGHT, LUMINOUS DESIGN: Clean white/pale background, crisp floating cards, high-contrast typography, clinical badge accents (cyan, emerald, navy, amber).
2. LOW COGNITIVE LOAD: Max 3-4 bullet points per card. Short, punchy bullets (under 15 words) with bold lead-in keywords.
3. CURRICULUM & NEA ALIGNMENT: Uncompromising focus on ANT-130 (AMT-130) AAV5 microRNA gene therapy for Huntington's disease and direct alignment to Genetics NEA Task 2 marking criteria across Pass, Merit, and Distinction!

SLIDE-BY-SLIDE SPECIFICATION:
Slide 1: Title & NEA Task 2 Framing
- Title: F172 Lesson 10: Gene Therapy Clinical Trials & Task 2 (ANT-130)
- Subtitle: OCR AAQ Level 3 Human Biology · Unit F172: Genetics (Matt)
- Scope Badges: [Clinical Trial Phases] [ANT-130 Case Study] [Biomarker Analysis] [NEA Task 2 Criteria]
- Assessment Focus: Complete preparation for OCR Genetics NEA Task 2 (Evaluating Gene Therapy Research).

Slide 2: Clinical Trial Architecture (Phases I to III)
- Title: Clinical Trial Architecture: From Bench to Bedside
- 3 Progressive Phase Swimlanes:
  • Phase I (Safety & Dosage): Small cohorts (N=10–30); assesses acute safety, tolerability, dose-limiting toxicities, and optimal dosage escalation.
  • Phase II (Biological Activity & Proof of Concept): Medium cohorts (N=30–100); evaluates target engagement, surrogate biomarkers, and preliminary efficacy signals.
  • Phase III (Pivotal Confirmatory Trial): Large multi-centre cohorts (N=100s–1000s); double-blind randomised controlled trials (RCTs) proving definitive clinical benefit vs standard of care or placebo/sham.
- Regulatory Milestones: MHRA (UK), EMA (Europe), and FDA (US) investigational new drug approvals.

Slide 3: Huntington's Disease: Pathology & Genetic Architecture
- Title: Huntington's Disease: Molecular Etiology & Neurodegeneration
- 3 Pathology Flow Cards:
  • Genetic Mutation: Autosomal dominant expansion of CAG trinucleotide repeats (>36 repeats) in exon 1 of the HTT gene on chromosome 4.
  • Toxic Polyglutamine Protein: Expanded CAG translates into toxic mutant huntingtin (mHTT) protein that misfolds and forms neuronal intracellular aggregates.
  • Striatal Neurodegeneration: Selective loss of GABAergic medium spiny neurons (MSNs) in the caudate nucleus and putamen; triggers progressive motor chorea, cognitive decline, and psychiatric disturbance.

Slide 4: ANT-130 (AMT-130) Molecular Mechanism of Action
- Title: Case Study: ANT-130 Molecular Mechanism of Action
- 3 Sequential Mechanism Stages:
  • Vector Architecture: Recombinant AAV5 capsid carrying an artificial engineered microRNA (miRNA) targeting human HTT mRNA transcripts.
  • Stereotactic Delivery: Single intracranial neurosurgical Convection-Enhanced Delivery (CED) microinfusion directly into bilateral caudate and putamen.
  • RNA Interference (RNAi): Intracellular miRNA processing by Dicer and loading into RISC; binds complementary HTT mRNA causing transcript cleavage and lowering toxic mHTT expression.

Slide 5: ANT-130 Clinical Trial Design & Control Methodology
- Title: ANT-130 Phase I/II Clinical Trial Design (NCT04120493)
- 3 Trial Methodology Cards:
  • Cohort Architecture: Multi-centre, randomized, double-blind trial with low-dose, high-dose, and imitation (sham) surgical control cohorts.
  • Sham Surgical Control: Imitation surgery involving superficial bone drilling without dural penetration to control for placebo effect and surgical expectation.
  • Longitudinal Duration: Multi-year follow-up (up to 36–60 months) assessing persistent vector expression and neurological stability.

Slide 6: Objective Biomarker Findings: mHTT & Neurofilament Light (NfL)
- Title: ANT-130 Biomarker Findings: CSF mHTT & NfL Dynamics
- 2-Column Biomarker Evaluation:
  • CSF mHTT Lowering: Dose-dependent, statistically significant reduction of mutant huntingtin protein in cerebrospinal fluid (CSF) confirming sustained target engagement.
  • Neurofilament Light Chain (NfL): Acute transient elevation in CSF immediately post-procedure reflecting minor surgical trauma, followed by sustained decline below baseline at 24–36 months indicating decelerated active neuroaxonal loss.

Slide 7: Clinical Functional Outcomes: cUHDRS & Total Motor Score
- Title: Clinical Functional Efficacy: Slowing Disease Progression
- 2-Column Clinical Dashboard:
  • Composite UHDRS (cUHDRS): High-dose ANT-130 cohort demonstrated significant preservation of composite cognitive, motor, and functional capacity compared to natural history disease progression.
  • Total Motor Score (TMS): Deceleration in motor decline (reduced progression of chorea, rigidity, and gait impairment) sustained across 24 and 36 months of follow-up.
  • Statistical vs Clinical Significance: Understanding p-values vs tangible daily functional improvements in patient quality of life.

Slide 8: Role of Genetic Counselling & Ethical Considerations
- Title: Predictive Genetic Testing & Genetic Counselling Scope
- 3 Ethical & Clinical Counselling Cards:
  • Pre-Test Counselling: Exploring psychological readiness, family history pedigree analysis, and implications of 50% autosomal dominant inheritance risk.
  • The Right Not to Know: Managing ethical tension where asymptomatic at-risk individuals decide whether to undergo predictive presymptomatic testing.
  • Trial Eligibility & Expectations: Ensuring realistic understanding that ANT-130 is disease-slowing/stabilizing, not a retroactive cure for lost neuronal tissue.

Slide 9: Critical Evaluation: Strengths vs Limitations of ANT-130
- Title: Evaluative Breakdown: Trial Strengths vs Structural Limitations
- 2-Column Evaluative Grid:
  • Trial Strengths (Merit Focus): Objective CSF biomarker tracking; precise intracranial stereotaxis bypassing the BBB; persistent long-term multi-year clinical follow-up.
  • Methodological Limitations (Distinction Focus): Small overall sample cohort (N<30); unblinding of sham controls after 12 months limits long-term placebo comparisons; non-selective HTT knockdown lowers wild-type huntingtin; irreversible neurosurgical delivery.

Slide 10: NEA Task 2 Marking Criteria & Distinction Roadmap
- Title: OCR AAQ Unit F172 Genetics NEA Task 2 Marking Rubric
- 3 Performance Tier Swimlanes:
  • Pass Level (P5, P7, P8): Accurately describe the genetic disorder (Huntington's), explain the therapeutic mechanism of action (AAV5 RNAi), and identify the delivery vector.
  • Merit Level (M3, M4, M5): Critically analyze trial methodology, evaluate sham control validity, interpret biomarker graphs (mHTT/NfL), and assess genetic counselling needs.
  • Distinction Level (D3, D4, D5): Evaluative mastery: differentiate surrogate biomarkers from true functional outcomes, critique sample size limitations, analyze irreversible risks, and cite primary clinical trial literature using flawless Harvard referencing.`
  },
  {
    number: 11,
    folder: "Lesson_11_Genetic_Engineering_vs_Gene_Therapy",
    title: "F172 - Lesson 11: Genetic Engineering Compared to Gene Therapy",
    shortName: "Lesson_11_Genetic_Engineering_vs_Gene_Therapy",
    prompt: `Create a comprehensive, visually luminous, high-clarity 10-slide classroom presentation deck artifact titled: "F172 - Lesson 11: Genetic Engineering Compared to Gene Therapy".

TARGET AUDIENCE & COURSE:
OCR AAQ Level 3 Human Biology (Unit F172: Genetics) · Lesson 11 (Matt).

AESTHETIC & PEDAGOGICAL DIRECTIVES:
1. BRIGHT, LUMINOUS DESIGN: Crisp white/pale backgrounds, elegant floating cards, high-contrast typography, distinctive comparative badges (cyan, emerald, navy, amber).
2. LOW COGNITIVE LOAD: Max 3-4 bullet points per card. Short, punchy bullets (under 15 words) with bold lead-in keywords.
3. CURRICULUM RIGOUR: Master the exact biological, medical, ethical, and legal distinctions between broad biotechnology genetic engineering and targeted human gene therapy.

SLIDE-BY-SLIDE SPECIFICATION:
Slide 1: Title & Lesson Orientation
- Title: F172 Lesson 11: Genetic Engineering vs Gene Therapy
- Subtitle: OCR AAQ Level 3 Human Biology · Unit F172: Genetics (Matt)
- Scope Badges: [Core Definitions] [Recombinant Tools] [Somatic vs Germline] [Ethical & Legal Governance]
- Essential Question: How does industrial and research genetic engineering fundamentally differ from human clinical gene therapy?

Slide 2: Defining Genetic Engineering: Scope & Applications
- Title: Genetic Engineering: Broad Biotechnology & Transgenics
- 3 Application Cards:
  • Definition: Direct artificial manipulation of an organism's genome using biotechnology to alter its characteristics or synthesize novel products.
  • Recombinant DNA: Isolating genes, inserting into bacterial plasmids using restriction enzymes and DNA ligase, and transforming host cells.
  • Commercial & Research Niches: Transgenic bacteria producing human insulin and clotting Factor VIII; genetically modified crops (Bt maize, golden rice); transgenic animal disease models.

Slide 3: Defining Gene Therapy: Scope & Medical Purpose
- Title: Gene Therapy: Targeted Human Clinical Medicine
- 3 Clinical Cards:
  • Medical Definition: Introduction, removal, or alteration of genetic material specifically within human cells to treat, prevent, or cure disease.
  • Clinical Purpose: Correcting monogenic pathology at its genetic root rather than managing downstream symptoms.
  • Targeted Disorders: Severe inherited monogenic disorders (SCID, cystic fibrosis, SMA, hemophilia, Huntington's) and acquired diseases (cancer immunotherapy).

Slide 4: Core Comparison: Genetic Engineering vs Gene Therapy
- Title: Comparative Matrix: Engineering vs Gene Therapy
- 4-Row Contrast Matrix:
  • Primary Objective: Engineering = Industrial synthesis & agricultural improvement | Therapy = Alleviating human disease & restoring normal physiological function.
  • Target Organisms: Engineering = Bacteria, plants, fungi, animals | Therapy = Exclusively human patients.
  • Delivery System: Engineering = Plasmids, Agrobacterium, microinjection | Therapy = Engineered viral vectors (AAV, Lentivirus) and targeted LNPs.
  • Regulatory Arena: Engineering = Agricultural & environmental biotechnology boards | Therapy = Human clinical trial regulatory agencies (MHRA, FDA).

Slide 5: Somatic Cell Gene Therapy: Principles & Practice
- Title: Somatic Cell Gene Therapy: The Clinical Standard
- 3 Biological Principle Cards:
  • Target Cells: Differentiated adult or paediatric non-reproductive somatic tissues (e.g. bone marrow, retinal pigment epithelium, striatal neurons).
  • Heritability: Strictly non-heritable; genetic modifications affect only the individual patient and perish with the treated cells.
  • Approved Therapies: Proven clinical successes including Luxturna (retinal dystrophy), Zolgensma (SMA), and Casgevy (sickle cell disease).

Slide 6: Germline Gene Therapy: Principles & Theoretical Risks
- Title: Germline Gene Therapy: The Generational Frontier
- 3 Frontier Principle Cards:
  • Target Cells: Human gametes (spermatozoa/oocytes) or early pre-implantation IVF embryos.
  • Heritability: Permanent and heritable; genetic modifications are incorporated into every cell lineage of the resulting individual and transmitted to future generations.
  • Biological Hazards: Unintended off-target mutations propagated indefinitely down ancestral lines; unpredictability of complex embryonic developmental epigenetics.

Slide 7: Ethical, Societal & Distributive Dilemmas
- Title: Ethical Frontiers: Treatment vs Enhancement
- 3 Ethical Dilemma Cards:
  • Consent Impossibility: Future generations cannot provide informed consent to germline genetic modifications performed on embryonic ancestors.
  • Genetic Enhancement: Slippery slope from curing monogenic pathology to selecting non-medical enhancement traits ("designer babies"), amplifying societal inequality.
  • Healthcare Equity & Cost: Astronomical pricing of single-dose curative therapies (£1.5m–£2.8m per patient) creating severe global and domestic healthcare rationing challenges.

Slide 8: Legal & Regulatory Frameworks: The UK Gold Standard
- Title: Regulatory Oversight: UK Statutory Governance
- 3 Regulatory Pillars:
  • Human Fertilisation & Embryology Authority (HFEA): Statutory body enforcing the HFEA Act 1990 (amended 2008); strictly prohibits implanting genetically modified human embryos.
  • Medicines & Healthcare products Regulatory Agency (MHRA): Enforces safety, efficacy, and batch quality for all somatic gene therapies entering UK clinical trials and NHS use.
  • Gene Therapy Advisory Committee (GTAC): Specialist national research ethics committee scrutinizing scientific merit and patient welfare in all clinical gene therapy protocols.

Slide 9: Concept Mastery: True or False Diagnostic Challenge
- Title: Concept Mastery: Testing Core Boundaries
- 3 Diagnostic Scenario Cards:
  • Scenario 1: "Injecting AAV vectors into adult liver cells changes the patient's offspring's DNA." -> FALSE: Somatic therapy cannot enter the germline.
  • Scenario 2: "Producing human insulin in E. coli bacteria is an example of human gene therapy." -> FALSE: It is industrial genetic engineering using recombinant DNA.
  • Scenario 3: "Under UK law, clinicians can use CRISPR to correct Huntington's disease in human IVF embryos intended for pregnancy." -> FALSE: Strictly illegal under HFEA statutory law.

Slide 10: Summary & NEA Task 2 Linkage
- Title: Lesson 11 Synthesis: Key Takeaways & NEA Readiness
- 3 Core Synthesis Takeaways:
  • Conceptual Clarity: Always distinguish between broad recombinant biotechnology and clinical human gene therapy.
  • Ethical Boundary: Somatic therapy is clinically validated and approved; germline therapy remains legally prohibited due to generational risk and lack of consent.
  • NEA Task 2 Application: In coursework, earn Distinction marks by precisely delineating whether proposed therapies operate in somatic tissue and evaluating their regulatory compliance under UK MHRA/HFEA rules.`
  },
  {
    number: 12,
    folder: "Lesson_12_CRISPR_Cas9_Gene_Editing_Research_Workshop",
    title: "F172 - Lesson 12: CRISPR-Cas9 Gene Editing & Research Workshop",
    shortName: "Lesson_12_CRISPR_Cas9_Gene_Editing",
    prompt: `Create a comprehensive, visually luminous, high-clarity 10-slide classroom presentation deck artifact titled: "F172 - Lesson 12: CRISPR-Cas9 Gene Editing & Research Workshop".

TARGET AUDIENCE & COURSE:
OCR AAQ Level 3 Human Biology (Unit F172: Genetics) · Lesson 12 (Dan).

AESTHETIC & PEDAGOGICAL DIRECTIVES:
1. BRIGHT, LUMINOUS DESIGN: Crisp white/pale backgrounds, elegant floating cards, high-contrast typography, high-tech molecular accent badges (cyan, emerald, navy, amber).
2. LOW COGNITIVE LOAD: Max 3-4 bullet points per card. Short, punchy bullets (under 15 words) with bold lead-in keywords.
3. CURRICULUM & WORKSHOP RIGOUR: Deep molecular explanation of CRISPR-Cas9 components, cellular repair pathways, clinical breakthroughs (Casgevy), and hands-on NEA Task 2 Distinction-level evaluative research.

SLIDE-BY-SLIDE SPECIFICATION:
Slide 1: Title & Workshop Orientation
- Title: F172 Lesson 12: CRISPR-Cas9 Gene Editing & Research Workshop
- Subtitle: OCR AAQ Level 3 Human Biology · Unit F172: Genetics (Dan)
- Scope Badges: [Molecular Engine] [PAM & sgRNA] [NHEJ vs HDR] [NEA Distinction Workshop]
- Workshop Goal: Master the molecular mechanisms of CRISPR-Cas9 and develop advanced evaluative research skills for Genetics NEA Task 2.

Slide 2: Bacterial Origins & Evolution of CRISPR Immunity
- Title: Biological Origins: Adaptive Bacterial Immunity
- 3 Evolutionary Stages:
  • CRISPR Loci: Clustered Regularly Interspaced Short Palindromic Repeats found in bacterial and archaeal genomes.
  • Viral Memory: Bacteria capture foreign bacteriophage DNA fragments and store them as spacers between repeats.
  • Adaptive Defense: Transcribed crRNA guides Cas endonucleases to recognize and cleave invading bacteriophage genomes upon re-infection.

Slide 3: Molecular Anatomy: The Three Core Components
- Title: The CRISPR-Cas9 Engine: 3 Essential Components
- 3 Molecular Component Cards:
  • Single Guide RNA (sgRNA): Synthetic 20-nucleotide spacer engineered to match target genomic sequence, fused to structural tracrRNA scaffold.
  • Protospacer Adjacent Motif (PAM): Essential 5'-NGG-3' DNA sequence immediately adjacent to target site; physical prerequisite for Cas9 binding.
  • Cas9 Endonuclease: Multi-domain enzyme with RuvC and HNH catalytic nuclease domains that cleave opposing strands, creating a targeted double-strand break (DSB).

Slide 4: Step-by-Step Mechanism of Genome Editing
- Title: Step-by-Step Mechanism of Cas9 Target Cleavage
- 4 Sequential Steps:
  • 1. PAM Interrogation: Cas9 scans the genome, binding PAM (5'-NGG-3') motifs through protein-DNA interactions.
  • 2. DNA Unwinding: Cas9 unwinds adjacent target DNA, allowing sgRNA to test for complementary base pairing.
  • 3. R-Loop Formation: Stable 20 bp RNA:DNA hybrid forms between sgRNA spacer and genomic target strand.
  • 4. Targeted Cleavage: RuvC and HNH domains induce a blunt double-strand break exactly 3 base pairs upstream of PAM.

Slide 5: DNA Repair Pathway 1: Non-Homologous End Joining (NHEJ)
- Title: DNA Repair Pathway 1: NHEJ Gene Knockout
- 3 Repair Mechanism Cards:
  • Mechanism: Error-prone direct re-ligation of broken blunt DNA ends without an homologous repair template.
  • Mutation Outcome: Frequent introduction of random insertions or deletions (indels) at the cleavage site.
  • Therapeutic Application: Induces reading frameshift mutations and premature stop codons, knocking out pathogenic dominant genes (e.g. viral receptors, oncogenes, or mHTT).

Slide 6: DNA Repair Pathway 2: Homology-Directed Repair (HDR)
- Title: DNA Repair Pathway 2: HDR Gene Correction
- 3 Repair Mechanism Cards:
  • Mechanism: High-fidelity template-dependent repair pathway that utilizes an exogenous synthetic donor DNA template.
  • Precision Outcome: Enables exact nucleotide substitution, point mutation correction, or therapeutic sequence knock-in without indels.
  • Clinical Limitations: Primarily active in late S and G2 phases of dividing cells; inefficient in non-dividing post-mitotic cells (e.g. adult neurons).

Slide 7: Clinical Landmark: Casgevy (Exa-cel) for Sickle Cell Disease
- Title: Clinical Landmark: Casgevy (First Approved CRISPR Therapy)
- 3 Clinical Milestone Cards:
  • Therapeutic Target: Ex vivo editing of patient CD34+ hematopoietic stem and progenitor cells (HSPCs).
  • Mechanism: CRISPR-Cas9 NHEJ disrupts the erythroid enhancer of the BCL11A gene.
  • Clinical Benefit: Silencing BCL11A reactivates fetal hemoglobin (HbF, alpha2-gamma2), preventing sickle hemoglobin polymerization and eliminating vaso-occlusive pain crises.

Slide 8: Technical Challenges & Limitations of CRISPR-Cas9
- Title: Technical Obstacles: Off-Target Cleavage & Delivery
- 3 Critical Challenge Cards:
  • Off-Target Effects: Cas9 can tolerate 1–3 base mismatches between sgRNA and non-target genomic sites, risking oncogene activation or chromosomal translocations.
  • p53 DNA Damage Response: Double-strand breaks activate p53-mediated apoptosis, potentially selecting for cells with compromised p53 tumor-suppressor pathways.
  • In Vivo Delivery Hurdles: SpCas9 (~4.1 kb) plus sgRNA approaches the packaging limit of AAV vectors; requiring dual-AAV systems or LNP delivery.

Slide 9: Comparative Face-Off: CRISPR-Cas9 vs RNAi (ANT-130)
- Title: Technology Face-Off: CRISPR Editing vs RNAi Silencing
- 2-Column Evaluative Comparison:
  • CRISPR-Cas9 Editing: Operates at genomic DNA level; permanent excision or correction; single intervention; risk of permanent off-target cuts and chromosomal rearrangements.
  • ANT-130 (AAV5-miRNA): Operates at post-transcriptional mRNA level; leaves genomic DNA intact; non-permanent expression dependent on episomal vector survival; potential need for continuous long-term monitoring.

Slide 10: NEA Task 2 Research Workshop & Distinction Checklist
- Title: NEA Task 2 Distinction Workshop: Evaluative Checklist
- 4 Distinction Criteria Pillars:
  • Detailed Vector & Delivery Analysis: Compare in vivo intracranial stereotaxis vs ex vivo hematopoietic electroporation.
  • Critical Trial Evaluation: Scrutinize patient cohort sizes, follow-up durations, and surrogate biomarker validity (mHTT/NfL vs clinical scores).
  • Safety & Ethical Balance: Weigh permanent DNA disruption vs reversible post-transcriptional knockdown and assess UK HFEA/MHRA regulatory compliance.
  • Primary Academic Sourcing: Support every claim with high-impact primary journal citations (Nature, NEJM, Lancet Neurology) in proper Harvard format.`
  }
];

export { LESSONS, EDGE_CDP_PORT, BASE_OUTPUT_DIR };
