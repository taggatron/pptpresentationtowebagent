import { chromium } from "playwright";

const EDGE_CDP_PORT = 9334;

export const PROMPT_F172_GENETIC_ENGINEERING = `Create a comprehensive, visually luminous, high-clarity 12-slide classroom presentation deck artifact titled: "F172 - Genetic Engineering & Gene Therapy (Lessons 9 to 12)".

AESTHETIC & PEDAGOGICAL DIRECTIVES:
1. BRIGHT, LUMINOUS & LIGHT VISUAL DESIGN: Clean white/pale background, elegant floating cards, high-contrast crisp typography, and purposeful medical accent badges (biomedical cyan, emerald green for therapeutic success, deep navy for academic/clinical framing, crimson/amber for pathology/methodological limitations).
2. LOW COGNITIVE LOAD: Max 3–4 bullet points per card. Every bullet must be short, punchy (strictly under 15 words) with bold lead-in keywords. Eliminate dense walls of text.
3. CURRICULUM ALIGNMENT: Perfectly sequence Lessons 9 to 12 from Unit F172:
   - Lesson 9: Gene therapy: viral & non-viral vector delivery (Dan)
   - Lesson 10: Gene therapy clinical trials & Task 2 research (Matt) — focussing on ANT-130 (AMT-130) AAV5 microRNA gene therapy for Huntington's disease and NEA Task 2 marking criteria
   - Lesson 11: Genetic engineering compared to gene therapy (Matt)
   - Lesson 12: CRISPR-Cas9 gene editing & research workshop (Dan)
4. EXPLICIT NEA TASK 2 INTEGRATION: Directly reference the Pass, Merit, and Distinction marking criteria for Task 2 throughout the clinical trial and evaluation slides.

SLIDE-BY-SLIDE SPECIFICATION:

Slide 1: Title & Unit Orientation
- Title: F172 - Genetic Engineering & Gene Therapy
- Subtitle: OCR AAQ Level 3 Human Biology (Unit F172: Genetics) · Lessons 9 to 12
- Scope Badges: [Lesson 9: Vector Delivery] [Lesson 10: Clinical Trials & ANT-130] [Lesson 11: Engineering vs Therapy] [Lesson 12: CRISPR-Cas9]
- Assessment Anchor: Direct preparation for Genetics NEA Task 2 (Pass, Merit, Distinction)
- Facilitator Notes: Introduce the 4-lesson sequence bridging molecular gene delivery to clinical trials and cutting-edge genome editing.

Slide 2: Lesson 9 — Gene Therapy: Viral Vector Delivery Mechanisms
- Title: Lesson 9: Viral Vectors in Gene Therapy
- Layout: 3 Comparative Vector Cards [AAV] [Lentivirus] [Adenovirus]
- Card 1 (Adeno-Associated Virus - AAV):
  • High Neuronal Tropism: Preferentially transduces post-mitotic CNS neurons and retinal cells.
  • Episomal Persistence: Retained without genomic integration, drastically reducing oncogenic insertion risk.
  • Payload Limitation: Strict 4.7 kb packaging limit constrains gene payload size.
- Card 2 (Lentiviral Vectors):
  • Stable Integration: Permanently inserts into host genomic DNA for dividing cell lineages.
  • Larger Capacity: Accommodates payloads up to 8–10 kb (ideal for ex vivo CAR-T and HSCs).
  • Insertional Mutagenesis: Rare risk of activating oncogenes near insertion sites.
- Card 3 (Adenoviral Vectors):
  • High Immunogenicity: Triggers robust innate immune inflammatory responses.
  • Transient Expression: Rapid clearance without integration; suited for vaccines.
- Facilitator Notes: Contrast AAV safety in post-mitotic brain tissues against lentiviral integration in dividing stem cells.

Slide 3: Lesson 9 — Non-Viral Vector Delivery & Physical Systems
- Title: Lesson 9: Non-Viral Vectors & Cellular Delivery
- Layout: 2-Column Comparative Synthesis [Nanoparticle Systems] [Physical Delivery Methods]
- Left Column (Lipid Nanoparticles & Chemical Delivery):
  • Lipid Nanoparticles (LNPs): Ionizable lipid shell encapsulates negatively charged mRNA/DNA.
  • Endosomal Escape: Facilitates cytoplasmic payload release via membrane fusion.
  • Low Immunogenicity: Minimal immune rejection compared to viral protein capsids.
  • Blood-Brain Barrier Challenge: Systemic LNPs cannot easily cross the BBB without receptor targeting.
- Right Column (Physical Delivery Modalities):
  • Electroporation: Pulsed high-voltage electric fields create transient cell membrane pores.
  • Convection-Enhanced Delivery (CED): Pressure-driven continuous microinfusion directly into deep brain structures.
  • Stereotactic Guidance: Real-time neurosurgical MRI targeting to bypass peripheral clearance.
- Facilitator Notes: Emphasize why neurological gene therapies often require direct neurosurgical delivery due to the blood-brain barrier.

Slide 4: Lesson 10 — Clinical Trial Architecture & The NEA Task 2 Framework
- Title: Lesson 10: Clinical Trial Architecture & NEA Task 2
- Layout: 3 Horizontal Progression Swimlanes [Phase I] [Phase II] [Phase III] + NEA Task 2 Rubric Banner
- Swimlane 1 (Phase I - Safety & Tolerability):
  • Small Cohorts (N=10-30): Tests safety profile, dose escalation, and adverse event frequency.
- Swimlane 2 (Phase II - Biomarker & Efficacy Proof):
  • Intermediate Cohorts: Evaluates target engagement, optimal dose, and biomarker response.
- Swimlane 3 (Phase III - Multi-Centre RCT):
  • Large Scale (N=100s-1000s): Double-blind randomised placebo control measuring definitive clinical endpoints.
- NEA Task 2 Assessment Banner:
  • Pass (P): Accurately explain therapy mechanism and delivery route.
  • Merit (M): Critically compare trial methodology, controls, and biomarker data.
  • Distinction (D): Evaluate statistical vs clinical significance and identify structural study limitations.
- Facilitator Notes: Frame clinical trials not as simple proof, but as rigorous statistical risk-benefit evaluations required for NEA Task 2.

Slide 5: Lesson 10 — Case Study: ANT-130 (AMT-130) Gene Therapy for Huntington's Disease
- Title: Lesson 10 Case Study: ANT-130 Gene Therapy
- Context: Huntington's disease pathology (HTT exon 1 CAG expansion -> toxic mutant huntingtin / mHTT protein)
- Layout: 3-Part Molecular Mechanism Flow [AAV5 Vector] [Artificial miRNA] [Striatal Knockdown]
- Stage 1 (AAV5 Vector Package):
  • Engineered Capsid: Recombinant AAV5 selected for high striatal neuronal tropism.
  • Stereotactic Delivery: Single intracranial microinfusion into caudate and putamen under MRI guidance.
- Stage 2 (Artificial microRNA Expression):
  • Non-Integrating Transgene: Permanently transcribes synthetic miRNA hairpin targeting HTT pre-mRNA.
  • RNA Interference (RNAi): RISC complex binds HTT mRNA, cleaving it before translation.
- Stage 3 (Pathological Decoupling):
  • Lowering Toxic mHTT: Reduces toxic protein aggregates, protecting striatal medium spiny neurons (MSNs).
  • Halting Apoptosis: Preserves basal ganglia motor control circuitry to prevent chorea progression.
- Facilitator Notes: Walk learners through the exact molecular causal chain from neurosurgery to mRNA cleavage.

Slide 6: Lesson 10 — ANT-130 Clinical Trial Evidence & Biomarker Evaluation
- Title: ANT-130 Clinical Trial Data: Biomarkers vs Clinical Efficacy
- Layout: 2-Column Analytical Dashboard [Biomarker Dynamics] [Clinical Functional Scores]
- Left Card (Objective Biomarker Trends):
  • CSF mHTT Reduction: Dose-dependent lowering of mutant huntingtin protein in cerebrospinal fluid.
  • NfL Trajectory: Neurofilament light chain peaks post-surgery (surgical trauma), then drops below baseline.
  • Axonal Preservation: Sustained NfL reduction indicates slowed rate of active neuronal degeneration.
- Right Card (Clinical Functional Endpoints):
  • cUHDRS Metric: Composite Unified Huntington's Disease Rating Scale tracks motor and cognitive decline.
  • Disease Deceleration: High-dose cohort demonstrated statistically significant slowing of disease progression at 24–36 months.
  • Sham Control Comparison: Performance significantly outpaced natural history disease registries.
- Critical NEA Checkpoint: "Does biomarker reduction (mHTT) automatically guarantee long-term clinical motor improvement?"
- Facilitator Notes: Highlight the crucial distinction between surrogate biomarkers (CSF NfL) and meaningful patient-centred clinical outcomes.

Slide 7: Lesson 10 — NEA Task 2 Evaluative Workshop: Limitations & Criteria Alignment
- Title: NEA Task 2 Workshop: Critical Evaluation of ANT-130
- Layout: 2-Column Balanced Evaluation Matrix [Trial Strengths] [Methodological Limitations]
- Left Column (Trial Strengths - Merit Level):
  • Objective Endpoints: Paired CSF biomarker quantification alongside validated neurological scales.
  • Localized Delivery: Direct striatal stereotaxis avoids systemic hepatic clearance and peripheral toxicity.
  • Prolonged Follow-Up: Multi-year longitudinal tracking verifies durable gene expression.
- Right Column (Methodological Limitations - Distinction Level):
  • Small Cohort Size: Initial Phase I/II N<30 limits broad population generalisability.
  • Unblinding & Sham Ethics: Sham control patients unblinded after 12 months, limiting long-term placebo comparisons.
  • Irreversible Intervention: In vivo viral delivery cannot be turned off if adverse effects develop.
  • Non-Selective Knockdown: Lowers both mutant and normal huntingtin, raising potential neurodevelopmental questions.
- Facilitator Notes: This slide is the master template for Distinction-level coursework analysis in Task 2.

Slide 8: Lesson 11 — Genetic Engineering Compared to Gene Therapy
- Title: Lesson 11: Genetic Engineering vs Gene Therapy
- Layout: 2-Column Comparative Architecture [Genetic Engineering] [Gene Therapy]
- Left Card (Genetic Engineering - Broad Biotechnology):
  • Cross-Species Recombination: Inserting genes into host organisms (e.g. human insulin in E. coli).
  • Agricultural & Industrial: Enhancing crop resilience (Bt crops) and industrial enzyme synthesis.
  • Permanent Transgenic Lines: Stable germline inheritance in modified non-human organism lineages.
- Right Card (Gene Therapy - Human Medical Treatment):
  • Clinical Purpose: Treating, curing, or preventing human disease through genetic modification.
  • Targeted Pathologies: Single-gene monogenic disorders (SCID, spinal muscular atrophy, Huntington's).
  • Somatic Restriction: Legally and medically confined to non-reproductive patient somatic cells.
- Core Synthesis Banner: "Genetic engineering builds industrial tools and transgenic models; gene therapy delivers clinical medicine directly to human patients."
- Facilitator Notes: Clarify common exam confusions where students conflate industrial genetic modification with human therapeutic gene therapy.

Slide 9: Lesson 11 — Somatic vs Germline Interventions & Ethical Boundaries
- Title: Somatic vs Germline Gene Therapy: The Legal & Ethical Divide
- Layout: 2-Column Contrast Table + UK Regulatory Framework Banner
- Left Column (Somatic Cell Gene Therapy):
  • Target Cells: Differentiated adult or paediatric tissues (bone marrow, striatum, retina, liver).
  • Heritability: Strictly non-heritable; genetic changes perish with the treated patient.
  • Clinical Acceptance: Fully approved and funded (e.g. Luxturna, Zolgensma, Casgevy).
- Right Column (Germline Gene Therapy):
  • Target Cells: Human gametes (sperm/egg) or pre-implantation IVF embryos.
  • Heritability: Permanently passed to all subsequent offspring and future generations.
  • Ethical Consensus: Banned internationally and strictly prohibited under UK HFEA regulations.
  • Core Hazards: Unintended off-target generational mutations, consent impossibility, and eugenic risks.
- Regulatory Anchor: UK Human Fertilisation and Embryology Authority (HFEA) statutory oversight.
- Facilitator Notes: Ensure students memorize the exact legal and biological distinctions between somatic and germline modifications.

Slide 10: Lesson 12 — CRISPR-Cas9 Gene Editing: Molecular Architecture
- Title: Lesson 12: CRISPR-Cas9 Molecular Precision Engine
- Layout: 3-Part Molecular Anatomy Diagram Cards [gRNA Spacer] [PAM Recognition] [Cas9 Nuclease]
- Component 1 (Single Guide RNA - sgRNA):
  • 20-Nucleotide Spacer: Synthetic sequence engineered to match complementary genomic target DNA.
  • Watson-Crick Base Pairing: Unwinds and hybridizes to the target strand with high specificity.
- Component 2 (PAM Motif - Protospacer Adjacent Motif):
  • 5'-NGG-3' Sequence: Essential 3-base recognition motif immediately downstream of target site.
  • Kinetic Trigger: Cas9 binds PAM first before unwinding DNA; prevents cleavage of bacterial CRISPR loci.
- Component 3 (Cas9 Endonuclease Cleavage):
  • Dual Catalytic Domains: RuvC and HNH nuclease domains cleave opposing DNA strands.
  • Targeted Double-Strand Break: Induces a blunt DSB exactly 3-4 base pairs upstream of the PAM.
- Facilitator Notes: Emphasize that PAM recognition is the absolute physical prerequisite for Cas9 DNA binding and cutting.

Slide 11: Lesson 12 — DNA Repair Pathways: NHEJ vs HDR in Therapeutic Editing
- Title: Cellular Repair Pathways: NHEJ vs HDR Gene Editing
- Layout: 2-Column Pathway Comparison [NHEJ: Gene Knockout] [HDR: Precise Gene Correction]
- Left Card (Non-Homologous End Joining - NHEJ):
  • Mechanism: Error-prone blunt re-ligation without an homologous repair template.
  • Outcome: Introduces insertions/deletions (indels) causing reading frameshifts and premature stop codons.
  • Clinical Application: Disrupting toxic dominant alleles (e.g. knocking out mHTT or viral entry receptors like CCR5).
  • Timing: Active throughout all cell cycle phases (G1, S, G2).
- Right Card (Homology-Directed Repair - HDR):
  • Mechanism: High-fidelity template-directed repair using an exogenous synthetic donor DNA template.
  • Outcome: Precise nucleotide substitution, sequence correction, or therapeutic transgene insertion.
  • Clinical Application: Exact point-mutation correction in genetic disorders (e.g. sickle cell beta-globin gene).
  • Timing: Restricted to late S and G2 phases when sister chromatid templates are accessible.
- Facilitator Notes: Contrast why NHEJ is favoured for gene disruption while HDR is required for true genetic correction.

Slide 12: Lesson 12 Workshop & NEA Task 2 Master Synthesis
- Title: Research Workshop: Evaluating Future Gene Therapies
- Layout: Comparative Synthesis Grid [AAV RNAi (ANT-130)] vs [CRISPR-Cas9 Editing] + NEA Task 2 Checklist
- Technology Face-Off:
  • ANT-130 (AAV5-miRNA): In vivo post-transcriptional silencing; leaves DNA intact; requires permanent vector retention.
  • CRISPR-Cas9: Permanent genomic DNA excision of expanded CAG repeats; risks permanent off-target double-strand breaks.
- NEA Task 2 Distinction Checklist:
  • Criterion 1: Mechanistic precision detailing vectors, delivery routes, and molecular action.
  • Criterion 2: Methodological critique of clinical trial data, sample sizes, and control validity.
  • Criterion 3: Rigorous distinction between correlation and causation in clinical outcomes.
  • Criterion 4: Flawless Harvard referencing citing primary clinical trials and peer-reviewed literature.
- Facilitator Notes: Summarise how mastery of Lessons 9-12 equips learners to earn full Distinction marks in NEA Task 2.`;

async function main() {
  console.log(`Connecting to Microsoft Edge on CDP port ${EDGE_CDP_PORT}...`);
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${EDGE_CDP_PORT}`);
  const ctx = browser.contexts()[0];

  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) {
    throw new Error("Could not find F172 Genetics tab in Edge!");
  }

  console.log("Attached to Edge tab:", await page.title());

  // Click "Slide deck" button
  console.log("Looking for 'Slide deck' button...");
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"], button:has-text("Slide deck")').first();
  await slideDeckBtn.waitFor({ state: "visible", timeout: 10000 });
  console.log("Clicking 'Slide deck' button...");
  await slideDeckBtn.click();
  await page.waitForTimeout(1500);

  // Check for the modal / overlay
  const overlay = page.locator(".cdk-overlay-pane, mat-dialog-container").first();
  await overlay.waitFor({ state: "visible", timeout: 10000 });
  console.log("Customise slide deck dialog is OPEN!");
  await page.screenshot({ path: "scratch/edge_slide_dialog_open.png" });

  // Click "Presenter slides" card
  console.log("Selecting 'Presenter slides' format...");
  const presenterCard = overlay.locator('div, span, [role="radio"]').filter({ hasText: /^Presenter slides/ }).first();
  if (await presenterCard.isVisible({ timeout: 5000 }).catch(() => false)) {
    await presenterCard.click();
    console.log("Selected 'Presenter slides' format.");
    await page.waitForTimeout(500);
  }

  // Locate the prompt textarea
  console.log("Locating textarea...");
  const textarea = overlay.locator("textarea").first();
  await textarea.waitFor({ state: "visible", timeout: 5000 });
  await textarea.click();
  await textarea.fill(PROMPT_F172_GENETIC_ENGINEERING);
  console.log(`Filled textarea with prompt (${PROMPT_F172_GENETIC_ENGINEERING.length} chars).`);
  await page.waitForTimeout(500);

  await page.screenshot({ path: "scratch/edge_prompt_filled.png" });
  console.log("Saved scratch/edge_prompt_filled.png");

  // Click "Generate now"
  console.log("Clicking 'Generate now'...");
  const generateBtn = overlay.locator('button:has-text("Generate now")').first();
  await generateBtn.waitFor({ state: "visible", timeout: 5000 });
  await generateBtn.click();
  console.log("Clicked 'Generate now'!");

  // Wait for overlay to close
  await overlay.waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
  console.log("Dialog closed! Slide deck generation initiated!");

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scratch/edge_generation_dispatched.png" });
  console.log("Saved scratch/edge_generation_dispatched.png");

  // Monitor generation
  console.log("Monitoring slide deck generation in Studio...");
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(5000);
    const generatingPill = page.locator('text="Generating..."').first();
    const isGenerating = await generatingPill.isVisible().catch(() => false);
    console.log(`[Check ${i + 1}/40] Generation active: ${isGenerating}`);
    if (!isGenerating && i > 2) {
      console.log("Generation finished or artifact settled!");
      break;
    }
  }

  await page.screenshot({ path: "scratch/edge_generation_finished.png" });
  console.log("Saved scratch/edge_generation_finished.png");
}

main().catch(err => {
  console.error("Execution error:", err);
  process.exit(1);
});
