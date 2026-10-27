import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { LESSONS, BASE_OUTPUT_DIR } from "./f172_lessons_config.mjs";

const PUBLIC_DECKS_GENETICS = path.resolve("./public/decks/genetics_aaq");

const LESSON_METADATA = {
  9: {
    teacher: "Dan",
    focus: "Gene Therapy: Viral & Non-Viral Vector Delivery Systems, Tropism, Packaging Limits, and Anatomical Barriers",
    deliverable: "OCR AAQ Level 3 Human Biology (Unit F172: Genetics) Lesson 9 presentation covering in vivo, ex vivo, and in situ delivery routes, viral vectors (AAV serotypes, Lentivirus, Adenovirus), non-viral systems (Lipid Nanoparticles, electroporation, hydrodynamic delivery), and convection-enhanced delivery across the blood-brain barrier.",
    objectives: {
      knowledge: "Differentiate the structural biology, genome packaging capacities, and chromosomal integration profiles of AAV, lentiviral, and adenoviral vectors.",
      application: "Evaluate non-viral nanotechnologies (ionizable lipid nanoparticles, cellular endosomal escape) alongside physical permeabilization techniques for therapeutic delivery.",
      evaluation: "Select and justify the optimal delivery vector for specific clinical phenotypes (e.g. adult non-dividing neuronal vs dividing hematopoietic stem cells)."
    },
    terminology: [
      { term: "Adeno-Associated Virus (AAV)", def: "Single-stranded DNA parvovirus (4.7 kb packaging limit) maintaining long-term episomal expression in non-dividing cells without host integration." },
      { term: "Lentiviral Vector", def: "Recombinant retrovirus accommodating 8-10 kb payloads that permanently integrates into host chromosomal DNA, transmissible across cell division." },
      { term: "Lipid Nanoparticles (LNPs)", def: "Non-viral spherical nanocarriers composed of ionizable cationic lipids, helper lipids, and PEG-lipids enabling nucleic acid encapsulation and endosomal escape." },
      { term: "Convection-Enhanced Delivery (CED)", def: "Positive-pressure bulk flow microinfusion through intracranial cannulae driving macromolecular therapeutics through brain tissue." }
    ],
    slideData: [
      { slideNumber: 1, title: "F172 Lesson 9: Gene Therapy Vector Delivery", subtitle: "OCR AAQ Level 3 Human Biology · Unit F172: Genetics (Dan)", type: "title", takeaways: ["Comprehensive coverage of viral vectors, non-viral systems, and delivery barriers.", "Direct preparation for understanding delivery strategies in clinical practice."] },
      { slideNumber: 2, title: "Foundations of Gene Delivery: In Vivo, Ex Vivo & In Situ", subtitle: "Anatomical administration routes and therapeutic compartmentalization", type: "content", takeaways: ["In vivo delivers vectors systemically or locally directly to patient tissues.", "Ex vivo harvests, genetically engineers, and reinfuses patient cells (e.g. HSCs, CAR-T).", "In situ applies targeted microinfusion to isolated organs (e.g. striatum, subretinal space)."] },
      { slideNumber: 3, title: "Adeno-Associated Virus (AAV): The CNS Gold Standard", subtitle: "Tropism, episomal safety, and 4.7 kb genetic payload constraints", type: "vector_deep_dive", takeaways: ["AAV2, AAV5, AAV9 display high tropism for non-dividing neurons and photoreceptors.", "Remains non-integrating episomes, eliminating insertional oncogenesis risk.", "Strict 4.7 kb packaging limit requires compact cDNA or miRNA expression cassettes."] },
      { slideNumber: 4, title: "Lentiviral & Retroviral Vectors: Permanent Integration", subtitle: "Host chromosome insertion, dividing cell utility, and oncogenesis risks", type: "vector_deep_dive", takeaways: ["Permanently integrates transgenes into dividing host lineages (hematopoietic stem cells).", "Accommodates larger genomic payloads (8–10 kb).", "Carries insertional mutagenesis risk if inserted near proto-oncogenes."] },
      { slideNumber: 5, title: "Adenoviral Vectors & Alternative Viral Platforms", subtitle: "High payload capacity, transient expression, and acute immunogenicity", type: "vector_deep_dive", takeaways: ["Adenovirus vectors carry up to 30 kb but provoke intense innate inflammatory clearance.", "Transient expression makes adenoviral platforms ideal for vaccines rather than chronic cure.", "Herpes Simplex Virus (HSV) provides natural neurotropism with massive payload capacity."] },
      { slideNumber: 6, title: "Lipid Nanoparticles (LNPs): Non-Viral Nanotechnology", subtitle: "Ionizable lipids, endosomal proton sponge effect, and cellular escape", type: "technology", takeaways: ["Ionizable cationic lipids are neutral at pH 7.4 and positively charged in acidic endosomes.", "Disrupts endosomal membrane, releasing therapeutic mRNA or sgRNA into cytoplasm.", "Lack of viral capsids permits repeatable systemic dosing without neutralizing antibodies."] },
      { slideNumber: 7, title: "Physical Delivery Modalities: Direct Membrane Entry", subtitle: "Electroporation, microinjection, and hydrodynamic delivery", type: "methods", takeaways: ["Electroporation uses high-voltage microsecond pulses to induce transient aqueous membrane pores.", "Microinjection offers single-cell precision for zygotes and early embryos in transgenics.", "Hydrodynamic high-pressure infusion permeabilizes capillary endothelia in targeted organs."] },
      { slideNumber: 8, title: "Overcoming Anatomical Barriers: The Blood-Brain Barrier", subtitle: "Endothelial tight junctions and stereotactic Convection-Enhanced Delivery", type: "clinical_application", takeaways: ["Brain capillary endothelial tight junctions block >98% of systemic macromolecules.", "Stereotactic Convection-Enhanced Delivery (CED) bypasses BBB via positive-pressure microcannulae.", "Ensures homogeneous distribution across deep brain nuclei such as the caudate and putamen."] },
      { slideNumber: 9, title: "Comparative Vector Selection Matrix", subtitle: "Evaluating payload size, dividing status, integration, and immunogenicity", type: "comparative_table", takeaways: ["AAV: 4.7 kb payload, non-dividing cells, episomal, low immunogenicity, years of expression.", "Lentivirus: 8-10 kb payload, dividing cells, integrated, moderate immunogenicity, permanent.", "LNPs: Flexible cargo, non-integrating, low-moderate immunogenicity, transient expression."] },
      { slideNumber: 10, title: "Lesson 9 Formative Knowledge Check & Exam Scenario", subtitle: "Retinal gene therapy vector selection and clinical justification", type: "assessment", takeaways: ["Justify AAV selection for adult retinal dystrophy based on post-mitotic tropism.", "Explain why non-integrating episomal expression is safe and durable in non-dividing tissues."] }
    ]
  },
  10: {
    teacher: "Matt",
    focus: "Gene Therapy Clinical Trials & Task 2 Research: ANT-130 (AMT-130) Case Study, Biomarkers, and OCR Genetics NEA Marking Criteria",
    deliverable: "OCR AAQ Level 3 Human Biology (Unit F172: Genetics) Lesson 10 presentation focusing on clinical trial phases (I-III), uniQure ANT-130 (AMT-130) AAV5-miRNA striatal microinfusion for Huntington's disease, CSF biomarker analysis (mHTT and NfL), functional metrics (cUHDRS, TMS), genetic counselling ethics, and comprehensive alignment to OCR Genetics NEA Task 2 marking rubrics (Pass P5/P7/P8, Merit M3/M4/M5, Distinction D3/D4/D5).",
    objectives: {
      knowledge: "Explain clinical trial architecture (Phases I–III) and the molecular mechanism of ANT-130 (AAV5-miRNA targeting HTT mRNA via RNAi).",
      application: "Interpret primary clinical trial data: dose-dependent CSF mHTT reduction, transient vs chronic Neurofilament Light (NfL) dynamics, and cUHDRS functional deceleration.",
      evaluation: "Evaluate trial methodology (sham controls, small cohorts, irreversible intracranial surgery) and align coursework to Genetics NEA Task 2 Distinction criteria."
    },
    terminology: [
      { term: "ANT-130 / AMT-130", def: "An investigational AAV5-miRNA gene therapy delivering microRNA directly into the caudate and putamen to silence toxic mutant huntingtin (mHTT) via RNA interference." },
      { term: "Neurofilament Light Chain (NfL)", def: "A sensitive biomarker of active neuroaxonal damage; initial post-operative spike followed by long-term decline below baseline indicates neuroprotection." },
      { term: "Composite UHDRS (cUHDRS)", def: "A multidimensional clinical rating score combining total motor score, total functional capacity, and cognitive measures to assess Huntington's disease progression." },
      { term: "Genetics NEA Task 2", def: "OCR AAQ Level 3 coursework evaluating gene therapies against Pass (P5, P7, P8), Merit (M3, M4, M5), and Distinction (D3, D4, D5) criteria." }
    ],
    slideData: [
      { slideNumber: 1, title: "F172 Lesson 10: Gene Therapy Clinical Trials & Task 2 (ANT-130)", subtitle: "OCR AAQ Level 3 Human Biology · Unit F172: Genetics (Matt)", type: "title", takeaways: ["Core focus on ANT-130 / AMT-130 clinical trial architecture and NEA Task 2 criteria.", "Detailed analysis of biomarker curves, sham surgical controls, and evaluative grading."] },
      { slideNumber: 2, title: "Clinical Trial Architecture: From Bench to Bedside", subtitle: "Phases I, II, and III investigational design and regulatory thresholds", type: "content", takeaways: ["Phase I assesses safety, dose escalation, and toxicity in small cohorts (N=10-30).", "Phase II demonstrates biological activity, target engagement, and surrogate biomarkers (N=30-100).", "Phase III conducts multi-centre randomized controlled trials for definitive efficacy."] },
      { slideNumber: 3, title: "Huntington's Disease: Pathology & Genetic Architecture", subtitle: "Autosomal dominant CAG expansion, mHTT aggregation, and striatal degeneration", type: "pathology", takeaways: ["CAG trinucleotide repeat expansion (>36 repeats) in HTT gene exon 1 on chromosome 4.", "Misfolded toxic mutant huntingtin (mHTT) protein triggers medium spiny neuron apoptosis.", "Leads to progressive motor chorea, cognitive executive decline, and psychiatric symptoms."] },
      { slideNumber: 4, title: "ANT-130 (AMT-130) Molecular Mechanism of Action", subtitle: "AAV5 vector capsid, microRNA expression, and RNAi-mediated HTT knockdown", type: "molecular_mechanism", takeaways: ["Recombinant AAV5 carries artificial microRNA engineered to target human HTT transcripts.", "Administered via bilateral stereotactic Convection-Enhanced Delivery into striatal nuclei.", "miRNA loads into RISC complex, cleaving HTT mRNA and reducing toxic mHTT protein levels."] },
      { slideNumber: 5, title: "ANT-130 Clinical Trial Design & Control Methodology", subtitle: "Phase I/II multi-centre trial (NCT04120493) and sham surgical control", type: "clinical_trial_design", takeaways: ["Multi-centre randomized trial evaluating low-dose, high-dose, and imitation surgical controls.", "Sham surgery involves partial burr holes without dural penetration to control for placebo effect.", "Longitudinal follow-up tracks patients across 24, 36, and up to 60 months post-infusion."] },
      { slideNumber: 6, title: "Objective Biomarker Findings: mHTT & Neurofilament Light (NfL)", subtitle: "CSF target knockdown and neuroaxonal preservation trajectories", type: "biomarker_analysis", takeaways: ["High-dose ANT-130 demonstrated sustained, dose-dependent CSF mHTT reduction.", "CSF NfL exhibits transient acute elevation from surgical trauma, followed by drop below baseline.", "Long-term NfL reduction proves deceleration in underlying neuronal degeneration."] },
      { slideNumber: 7, title: "Clinical Functional Efficacy: cUHDRS & Total Motor Score", subtitle: "Deceleration of clinical disease progression compared to natural history", type: "clinical_outcomes", takeaways: ["High-dose cohort showed significant preservation on composite UHDRS (cUHDRS) at 24-36 months.", "Total Motor Score (TMS) demonstrated marked slowing of chorea and motor deterioration.", "Distinguishes between statistical p-value significance and meaningful clinical quality of life."] },
      { slideNumber: 8, title: "Role of Genetic Counselling & Ethical Considerations", subtitle: "Predictive presymptomatic testing, autosomal dominance, and patient autonomy", type: "ethics_and_counselling", takeaways: ["50% inheritance risk requires pre-test counselling on psychological and family implications.", "'The Right Not to Know' protects autonomy for asymptomatic individuals in affected pedigrees.", "Counsellors manage expectations: ANT-130 stabilizes disease but cannot reverse lost brain tissue."] },
      { slideNumber: 9, title: "Critical Evaluation: Strengths vs Structural Limitations", subtitle: "Merit analytical depth vs Distinction critical evaluation", type: "evaluation_matrix", takeaways: ["Strengths (Merit): Direct CSF biomarkers, CED delivery bypassing BBB, multi-year monitoring.", "Limitations (Distinction): Small sample size (N<30), sham control unblinding after 12 months, non-selective wild-type HTT knockdown, irreversible intracranial surgery."] },
      { slideNumber: 10, title: "OCR AAQ Unit F172 Genetics NEA Task 2 Marking Rubric", subtitle: "Grading criteria breakdown across Pass, Merit, and Distinction tiers", type: "marking_rubric", takeaways: ["Pass (P5, P7, P8): Accurate disorder description, AAV5 delivery route, and RNAi mechanism.", "Merit (M3, M4, M5): Trial methodology critique, sham control evaluation, and biomarker interpretation.", "Distinction (D3, D4, D5): Evaluative synthesis, sample size critique, irreversible surgical risk analysis, and Harvard referencing."] }
    ]
  },
  11: {
    teacher: "Matt",
    focus: "Genetic Engineering Compared to Gene Therapy: Molecular Tools, Somatic vs Germline Boundaries, and UK Regulatory Governance",
    deliverable: "OCR AAQ Level 3 Human Biology (Unit F172: Genetics) Lesson 11 presentation exploring recombinant DNA technology, industrial transgenics (insulin, GMOs), human somatic cell therapy, heritable germline editing risks, bioethics, and statutory UK governance (HFEA, MHRA, GTAC).",
    objectives: {
      knowledge: "Define and distinguish industrial/agricultural genetic engineering from human clinical gene therapy.",
      application: "Contrast somatic cell gene therapy (non-heritable, adult tissue) with germline genetic modification (heritable gamete/embryo editing).",
      evaluation: "Evaluate ethical dilemmas (equity, enhancement, lack of consent) and analyze statutory UK legal governance (HFEA Act 1990/2008, MHRA, GTAC)."
    },
    terminology: [
      { term: "Genetic Engineering", def: "Direct artificial modification of an organism's genome using recombinant DNA technology to alter traits or synthesize commercial products (e.g. human insulin in E. coli)." },
      { term: "Gene Therapy", def: "Targeted medical intervention introducing or altering genetic material specifically within human patient cells to treat or cure disease." },
      { term: "Somatic Cell Therapy", def: "Modification of differentiated non-reproductive cells; changes are strictly non-heritable and limited to the individual patient." },
      { term: "Germline Gene Therapy", def: "Modification of human gametes or early zygotes; permanent and heritable across all future generations (strictly prohibited under UK law)." },
      { term: "HFEA", def: "Human Fertilisation and Embryology Authority: UK statutory regulator governing human embryo research and prohibiting modified embryo implantation." }
    ],
    slideData: [
      { slideNumber: 1, title: "F172 Lesson 11: Genetic Engineering vs Gene Therapy", subtitle: "OCR AAQ Level 3 Human Biology · Unit F172: Genetics (Matt)", type: "title", takeaways: ["Clear boundary definitions between biotechnology genetic engineering and human gene therapy.", "Somatic vs germline principles and UK statutory legal framework."] },
      { slideNumber: 2, title: "Genetic Engineering: Broad Biotechnology & Transgenics", subtitle: "Recombinant DNA, bacterial plasmids, and industrial applications", type: "content", takeaways: ["Recombinant DNA utilizes restriction endonucleases and DNA ligase to insert target genes.", "Bacterial fermentation produces recombinant human insulin, factor VIII, and somatotropin.", "Transgenic agriculture (Bt maize, Golden Rice) and animal models support global industry."] },
      { slideNumber: 3, title: "Gene Therapy: Targeted Human Clinical Medicine", subtitle: "Treating human monogenic pathology at its molecular genetic etiology", type: "content", takeaways: ["Targeted medical introduction or correction of genetic material in human patients.", "Addresses root cause of monogenic disorders (SCID, CF, SMA, Huntington's) rather than symptoms.", "Delivered via clinical vectors (AAV, Lentivirus) directly to target patient tissues."] },
      { slideNumber: 4, title: "Comparative Matrix: Engineering vs Gene Therapy", subtitle: "Direct comparison across purpose, target organisms, vectors, and regulation", type: "comparative_table", takeaways: ["Purpose: Industrial/agricultural product synthesis vs curing human monogenic illness.", "Organisms: Microorganisms, plants, animals vs exclusively human clinical patients.", "Regulation: Environmental/food standards agencies vs human clinical regulators (MHRA, FDA)."] },
      { slideNumber: 5, title: "Somatic Cell Gene Therapy: The Clinical Standard", subtitle: "Non-heritable therapeutic correction in differentiated body tissues", type: "clinical_practice", takeaways: ["Targets differentiated adult or pediatric somatic tissues (bone marrow, retina, neurons).", "Modifications are non-heritable and perish with the treated patient's cells.", "Proven NHS-approved therapies include Luxturna (RPE65 retinal dystrophy) and Zolgensma (SMA)."] },
      { slideNumber: 6, title: "Germline Gene Therapy: The Generational Frontier", subtitle: "Gamete and early embryo modification, heritability, and biological hazards", type: "bioethics", takeaways: ["Modifies human spermatozoa, oocytes, or early pre-implantation IVF embryos.", "Permanent genetic alterations transmitted to all descendant generations.", "Catastrophic risks of permanent off-target mutations and epigenetic disruption."] },
      { slideNumber: 7, title: "Ethical, Societal & Distributive Dilemmas", subtitle: "Consent impossibility, enhancement slippery slope, and healthcare equity", type: "ethics", takeaways: ["Future generations cannot provide informed consent to modifications made on embryonic ancestors.", "Slippery slope from monogenic disease cure to non-medical enhancement ('designer babies').", "Astronomical treatment pricing (£1.5m–£2.8m) creates severe domestic and global inequality."] },
      { slideNumber: 8, title: "Regulatory Oversight: UK Statutory Governance", subtitle: "HFEA Act 1990/2008, MHRA clinical safety, and GTAC ethical review", type: "law_and_policy", takeaways: ["HFEA enforces statutory prohibition against placing genetically modified embryos into a woman.", "MHRA governs somatic clinical trial approvals, GMP manufacturing, and post-market vigilance.", "GTAC provides national research ethics scrutiny on all clinical gene therapy protocols."] },
      { slideNumber: 9, title: "Concept Mastery: Testing Core Boundaries", subtitle: "Diagnostic true/false scenarios addressing common student misconceptions", type: "diagnostic_quiz", takeaways: ["AAV liver infusion does NOT alter offspring DNA (somatic cells cannot enter germline).", "Producing insulin in bacteria is genetic engineering, NOT human gene therapy.", "CRISPR correction of human embryos intended for pregnancy is illegal under UK statutory law."] },
      { slideNumber: 10, title: "Lesson 11 Synthesis: Key Takeaways & NEA Readiness", subtitle: "Distinction-level demarcation of somatic boundaries in NEA Task 2", type: "synthesis", takeaways: ["Differentiate biotechnology engineering from human therapy in coursework introductions.", "Earn Distinction marks by confirming somatic non-heritable status and evaluating MHRA compliance."] }
    ]
  },
  12: {
    teacher: "Dan",
    focus: "CRISPR-Cas9 Gene Editing & Research Workshop: Molecular Engine, NHEJ vs HDR, Casgevy Case Study, and NEA Task 2 Distinction Checklist",
    deliverable: "OCR AAQ Level 3 Human Biology (Unit F172: Genetics) Lesson 12 presentation covering bacterial CRISPR immunity origins, sgRNA and PAM 5'-NGG-3' targeting, Cas9 endonuclease cleavage, cellular repair pathways (NHEJ knockout vs HDR template correction), clinical milestone Casgevy (ex-vivo BCL11A editing for sickle cell disease), and an advanced evaluative workshop for NEA Task 2.",
    objectives: {
      knowledge: "Explain the molecular anatomy and action of the CRISPR-Cas9 endonuclease system (crRNA/tracrRNA sgRNA, PAM motif, RuvC/HNH catalytic domains).",
      application: "Compare DNA repair mechanisms: error-prone Non-Homologous End Joining (NHEJ) knockout vs precision Homology-Directed Repair (HDR) knock-in.",
      evaluation: "Critique clinical applications (Casgevy BCL11A silencing) against ANT-130 RNAi and apply Distinction criteria to coursework evaluations."
    },
    terminology: [
      { term: "CRISPR-Cas9", def: "Adaptive bacterial immune system repurposed as a precision gene-editing tool; uses a single guide RNA (sgRNA) to direct Cas9 endonuclease to cut target DNA." },
      { term: "Protospacer Adjacent Motif (PAM)", def: "A short 5'-NGG-3' DNA sequence immediately adjacent to the target site, required for Cas9 binding and strand unwinding." },
      { term: "Non-Homologous End Joining (NHEJ)", def: "An error-prone repair pathway directly re-ligating double-strand breaks, frequently creating indels that knockout gene function." },
      { term: "Homology-Directed Repair (HDR)", def: "A high-fidelity repair pathway using an exogenous DNA donor template to introduce precise sequence corrections or insertions." },
      { term: "Casgevy (Exa-cel)", def: "The first approved CRISPR therapy; edits patient HSPCs via NHEJ to disrupt the BCL11A erythroid enhancer, reactivating fetal hemoglobin (HbF) in sickle cell disease." }
    ],
    slideData: [
      { slideNumber: 1, title: "F172 Lesson 12: CRISPR-Cas9 Gene Editing & Research Workshop", subtitle: "OCR AAQ Level 3 Human Biology · Unit F172: Genetics (Dan)", type: "title", takeaways: ["Molecular engine of CRISPR-Cas9, repair pathways, and clinical therapies.", "Dedicated NEA Task 2 Distinction evaluative research workshop."] },
      { slideNumber: 2, title: "Biological Origins: Adaptive Bacterial Immunity", subtitle: "CRISPR loci, viral memory spacers, and targeted cleavage of bacteriophages", type: "content", takeaways: ["CRISPR loci store captured fragments of invading bacteriophage DNA as spacers.", "Transcribed crRNA and tracrRNA guide Cas endonucleases to recognize re-invading phage genomes.", "Cleaves viral DNA upon re-infection, providing adaptive prokaryotic immune defense."] },
      { slideNumber: 3, title: "The CRISPR-Cas9 Engine: 3 Essential Components", subtitle: "Single guide RNA (sgRNA), PAM motif (5'-NGG-3'), and Cas9 endonuclease", type: "molecular_engine", takeaways: ["sgRNA: 20-nucleotide synthetic spacer matching genomic target fused to tracrRNA scaffold.", "PAM Motif: 5'-NGG-3' sequence essential for initial Cas9 binding and DNA strand separation.", "Cas9 Endonuclease: Catalytic RuvC and HNH domains induce targeted blunt double-strand breaks."] },
      { slideNumber: 4, title: "Step-by-Step Mechanism of Cas9 Target Cleavage", subtitle: "PAM interrogation, DNA unwinding, R-loop formation, and double-strand break", type: "mechanism", takeaways: ["1. PAM Interrogation: Cas9 scans genomic DNA for 5'-NGG-3' motifs.", "2. DNA Unwinding: Cas9 unwinds adjacent duplex, testing sgRNA complementarity.", "3. R-Loop Formation: Stable 20 bp RNA:DNA hybrid locks endonuclease in place.", "4. Double-Strand Break: RuvC and HNH domains cut both DNA strands 3 bp upstream of PAM."] },
      { slideNumber: 5, title: "DNA Repair Pathway 1: NHEJ Gene Knockout", subtitle: "Error-prone re-ligation, indel creation, and targeted gene disruption", type: "pathway", takeaways: ["Non-Homologous End Joining directly re-ligates broken ends without a repair template.", "Frequently inserts or deletes nucleotides (indels), creating reading frame-shifts.", "Ideal for knocking out pathogenic dominant genes, viral entry receptors, or silencer enhancers."] },
      { slideNumber: 6, title: "DNA Repair Pathway 2: HDR Gene Correction", subtitle: "High-fidelity template-directed repair for precise base correction", type: "pathway", takeaways: ["Homology-Directed Repair utilizes an exogenous synthetic donor DNA repair template.", "Enables exact nucleotide substitution, point mutation repair, or sequence knock-in.", "Active primarily in S/G2 phases of dividing cells; inefficient in non-dividing adult neurons."] },
      { slideNumber: 7, title: "Clinical Landmark: Casgevy for Sickle Cell Disease", subtitle: "First regulatory-approved CRISPR-Cas9 ex vivo therapy (Vertex / CRISPR Therapeutics)", type: "case_study", takeaways: ["Ex vivo editing of autologous CD34+ hematopoietic stem and progenitor cells (HSPCs).", "NHEJ disrupts the GATA1-binding site in the erythroid enhancer of BCL11A.", "Reactivates fetal hemoglobin (HbF, α2γ2), preventing sickle polymerization and pain crises."] },
      { slideNumber: 8, title: "Technical Obstacles: Off-Target Cleavage & Delivery", subtitle: "Mismatch tolerance, p53 activation, and in vivo vector packaging limits", type: "limitations", takeaways: ["Cas9 tolerates 1-3 base mismatches, risking off-target double-strand breaks elsewhere in genome.", "DSBs trigger p53-mediated apoptosis, risking selective outgrowth of p53-deficient oncogenic clones.", "SpCas9 (4.1 kb) plus sgRNA approaches AAV packaging ceiling, requiring dual AAVs or LNPs."] },
      { slideNumber: 9, title: "Technology Face-Off: CRISPR Editing vs RNAi Silencing", subtitle: "Permanent genomic DNA modification vs post-transcriptional mRNA regulation", type: "comparative_table", takeaways: ["CRISPR modifies genomic DNA permanently; risk of off-target chromosomal rearrangements.", "ANT-130 (AAV5-miRNA) acts post-transcriptionally; leaves DNA intact with non-permanent episomes.", "Coursework requires contrasting irreversible DNA excision against mRNA knockdown."] },
      { slideNumber: 10, title: "NEA Task 2 Distinction Workshop: Evaluative Checklist", subtitle: "Actionable rubric checklist for securing top marks in Genetics coursework", type: "workshop_rubric", takeaways: ["Compare in vivo intracranial stereotaxis vs ex vivo hematopoietic electroporation.", "Evaluate cohort size, follow-up duration, and surrogate biomarkers (mHTT/NfL vs clinical scores).", "Critique irreversible risk profiles and evaluate compliance under UK MHRA/HFEA frameworks.", "Include flawless Harvard referencing from primary peer-reviewed journals (NEJM, Nature, Lancet)."] }
    ]
  }
};

async function ingestLesson(lessonNum) {
  const lessonCfg = LESSONS.find(l => l.number === lessonNum);
  if (!lessonCfg) throw new Error(`Unknown lesson number: ${lessonNum}`);

  const meta = LESSON_METADATA[lessonNum];
  const srcDir = path.join(BASE_OUTPUT_DIR, lessonCfg.folder);
  const destDir = path.join(PUBLIC_DECKS_GENETICS, lessonCfg.folder);
  const slidesDestDir = path.join(destDir, "slides");

  console.log(`\n--- Ingesting Lesson ${lessonNum}: ${lessonCfg.title} ---`);
  console.log(`Source:      ${srcDir}`);
  console.log(`Destination: ${destDir}`);

  // Find downloaded files
  const files = await fs.readdir(srcDir).catch(() => []);
  const pdfFile = files.find(f => f.endsWith(".pdf") && !f.endsWith(".crdownload"));
  const pptxFile = files.find(f => f.endsWith(".pptx") && !f.endsWith(".crdownload"));

  if (!pdfFile || !pptxFile) {
    throw new Error(`Missing PDF or PPTX in ${srcDir}. Files found: ${files.join(", ")}`);
  }

  const srcPdfPath = path.join(srcDir, pdfFile);
  const srcPptxPath = path.join(srcDir, pptxFile);

  await fs.mkdir(slidesDestDir, { recursive: true });

  // Copy PDF & PPTX
  const destPdfName = `${lessonCfg.folder}.pdf`;
  const destPptxName = `${lessonCfg.folder}.pptx`;
  await fs.copyFile(srcPdfPath, path.join(destDir, destPdfName));
  await fs.copyFile(srcPptxPath, path.join(destDir, destPptxName));
  console.log(`✓ Copied PDF and PPTX to ${destDir}`);

  // Extract slide images using pdftoppm
  console.log("Extracting slide images with pdftoppm...");
  const ppmPrefix = path.join(slidesDestDir, "slide");
  execSync(`pdftoppm -png -r 150 "${srcPdfPath}" "${ppmPrefix}"`);

  // Rename extracted files to both slide-01.png and slide_01.png for universal compatibility
  const slideFiles = await fs.readdir(slidesDestDir);
  const pngSlides = slideFiles.filter(f => f.startsWith("slide-") && f.endsWith(".png")).sort();
  console.log(`Extracted ${pngSlides.length} slides.`);

  for (const f of pngSlides) {
    // e.g. slide-01.png -> slide_01.png
    const underScoreName = f.replace("slide-", "slide_");
    await fs.copyFile(path.join(slidesDestDir, f), path.join(slidesDestDir, underScoreName));
  }

  // Build manifest.json
  const slidesArray = meta.slideData.map((s, idx) => {
    const num = idx + 1;
    const numStr = num < 10 ? `0${num}` : `${num}`;
    return {
      slideNumber: num,
      title: s.title,
      subtitle: s.subtitle,
      type: s.type,
      image: `slides/slide_${numStr}.png`,
      keyTakeaways: s.takeaways
    };
  });

  const manifest = {
    id: lessonCfg.folder,
    title: lessonCfg.title,
    slideSet: "genetics_aaq",
    filename: destPptxName,
    pdfFilename: destPdfName,
    lessonNumber: lessonNum,
    courseName: "OCR Level 3 Cambridge Advanced National (AAQ) in Human Biology - Unit F172: Genetics",
    teacher: meta.teacher,
    focus: meta.focus,
    deliverable: meta.deliverable,
    totalSlides: slidesArray.length,
    objectives: meta.objectives,
    terminology: meta.terminology,
    slides: slidesArray
  };

  const manifestPath = path.join(destDir, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`✓ Generated ${manifestPath}`);
  console.log(`✓ Ingestion complete for Lesson ${lessonNum}!`);
}

async function main() {
  const arg = process.argv[2];
  if (arg) {
    const num = parseInt(arg, 10);
    await ingestLesson(num);
  } else {
    // Ingest all that have downloaded files
    for (const l of LESSONS) {
      const srcDir = path.join(BASE_OUTPUT_DIR, l.folder);
      const files = await fs.readdir(srcDir).catch(() => []);
      if (files.some(f => f.endsWith(".pdf"))) {
        await ingestLesson(l.number);
      }
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
