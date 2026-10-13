import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { lessons, COURSE_NAME, NOTEBOOK_URL } from "../src/configs/genetics_aaq.js";

const TARGET_NOTEBOOK_URL = NOTEBOOK_URL;
const CDP_URL = "http://127.0.0.1:9333";
const DECK_ID = "Lesson_09_Genetics_NEA_Task_1_Huntingtons_Case_Study_Revision";
const PPTX_OUTPUT_DIR = path.resolve("../NotebookLMagent/output/powerpoints_aaq_genetics");
const PUBLIC_DECK_DIR = path.resolve(`public/decks/genetics_aaq/${DECK_ID}`);
const SLIDES_DIR = path.join(PUBLIC_DECK_DIR, "slides");
const DL_DIR = path.resolve("scratch/downloads_lesson_09");

const LESSON_9_PROMPT = `Create a bright, visually stunning, high-engagement classroom slide deck for OCR Level 3 Cambridge Advanced National (AAQ) Human Biology (Unit F172: Genetics): "Lesson 9: Genetics NEA Task 1: Huntington's Disease Inheritance & Clinical Case Study (Ben)".

Pitch this lesson for Level 3 and A Level Human Biology learners preparing for Task 1 of their Genetics Non-Exam Assessment (NEA). Draw accurate, factual scientific teaching content from the notebook sources.

PRIMARY OBJECTIVE:
Provide a rigorous, comprehensive revision of all molecular knowledge (CAG triplet repeats in the HTT gene, toxic gain-of-function, effects on neuronal functioning, striatal GABAergic medium spiny neuron degradation, chorea, and genetic anticipation via paternal meiotic slippage) and academic skills (Boolean literature searching, CRAAP source evaluation, and Harvard referencing) needed to achieve top marks in NEA Task 1 on the inheritance of Huntington's disease using Ben's clinical case study.

CASE STUDY REVISION CONTEXT (BEN):
- 40-year-old male, early-stage Huntington's disease diagnosis.
- Adopted at age 2 by non-biological parents; teenage search was unsuccessful; biological family medical history is completely unknown.
- Symptom progression: involuntary jerky movements of arms, legs, face (chorea) began 1 year ago (age 39); affected ability to work as a teacher; difficulty controlling hands/fingers and gripping a pen; embarrassed in front of students.
- Clinical journey: GP identified chorea -> hospital radiology brain MRI showed neurodegenerative disease (bilateral striatal atrophy of caudate nucleus and putamen with lateral ventricle enlargement) -> genetic counsellor referral -> genetic test confirmed Huntington's disease (CAG repeat count >= 40).
- Emotional & personal impact: previously fit, active, loved teaching; devastated by loss of independence; GP managing symptoms (no cure exists).
- Family & inheritance concerns: wife, 6-year-old daughter, 3-year-old son, and wife is pregnant with their 3rd child. Ben is devastated that he may have passed the condition onto his children; wants to know specifically how HD is inherited, how to test his children, and what new medical technologies might help his family.

CRITICAL VISUAL & AESTHETIC PHILOSOPHY:
- Bright, luminous, high-contrast modern clean medical tech: bright white and pale slate/neutral card backgrounds, dark high-contrast typography, crisp vivid accent cards (emerald green, royal cobalt, medical cyan, warm amber).
- Zero walls of text. Short, punchy bullet points (under 15 words) with bold lead-ins.
- Generous whitespace, clean visual hierarchy, low cognitive load, readable immediately from the back of a classroom.

SLIDE SEQUENCE & DETAILED STRUCTURE REQUIRED:

Slide 1: Distinct Title Slide
- Title: Lesson 9: Genetics NEA Task 1: Huntington's Disease Inheritance
- Subtitle: OCR AAQ Level 3 Human Biology (Unit F172) · Synoptic Revision & Clinical Case Study (Ben)
- Key Topics: CAG Triplet Repeat Pathology, Neuronal Functioning, Genetic Anticipation, Autosomal Dominant Pedigree Risk, and Academic Research & Referencing
- Badge: Pass Criterion P3 & NEA Portfolio Task 1 Preparation

Slide 2: Starter Activity — Prior Knowledge Retrieval Grid (6-Cell Grid)
- Format: 6-cell grid (2 columns x 3 rows) of distinct rounded cards with concise questions and answer reveals:
  * Cell 1: What is the genotype of an individual affected by a heterozygous autosomal dominant disorder? [Hh (heterozygous, carrying one mutant expanded HTT allele)]
  * Cell 2: What is the percentage transmission risk for each child when an affected heterozygous parent (Hh) mates with an unaffected partner (hh)? [50% (1 in 2) risk per pregnancy, independent of previous children]
  * Cell 3: Which trinucleotide sequence expands in exon 1 of the HTT gene on chromosome 4p16.3? [Cytosine-Adenine-Guanine (CAG), encoding an elongated polyglutamine tract]
  * Cell 4: What is the clinical full-penetrance CAG repeat threshold for Huntington's disease? [>=40 CAG repeats confers 100% lifetime disease penetrance]
  * Cell 5: Which specific neuronal population in the basal ganglia undergoes selective apoptosis? [GABAergic Medium Spiny Neurons (MSNs) within the striatum (caudate and putamen)]
  * Cell 6: Why is genetic anticipation more pronounced during paternal transmission? [Continuous meiotic cell divisions during spermatogenesis drive high replication slippage]

Slide 3: Clinical Case Study Profile — Ben (40-Year-Old Teacher)
- Patient Profile: 40yo male, adopted at age 2, biological family medical history unknown.
- Clinical Presentation: 1-year history of progressive involuntary jerky movements (chorea) affecting face, arms, legs; impaired hand/finger grip preventing pen holding; classroom embarrassment.
- Diagnostic Journey: GP identification -> hospital radiology brain MRI -> clinical genetics referral -> diagnostic genetic testing confirmation.
- Family Context: Wife, 6yo daughter, 3yo son, wife pregnant with 3rd child.
- Crucial Insight: Why adoption obscures autosomal dominant late-onset traits across generations.

Slide 4: Molecular Pathology — The HTT Gene & CAG Triplet Repeat Expansion
- Genomic Locus: HTT gene located on chromosome 4p16.3, encoding huntingtin protein (essential for vesicle trafficking and BDNF transcription).
- Triplet Repeat Expansion: Unstable tandem CAG repeats in exon 1 translated into an elongated polyglutamine (polyQ) tract.
- Diagnostic CAG Scale & Clinical Thresholds:
  * <=26 repeats: Normal (stable transmission, unaffected)
  * 27–35 repeats: Intermediate (unaffected, but meiotically mutable; risk of expansion in offspring)
  * 36–39 repeats: Reduced penetrance (variable onset, some individuals remain asymptomatic)
  * >=40 repeats: Full penetrance (100% lifetime risk; inverse correlation with age of onset; juvenile HD >60 repeats)

Slide 5: Neurobiology & Cellular Pathophysiology — Striatal MSN Apoptosis
- Toxic Gain-of-Function: Mutant huntingtin (mHTT) undergoes abnormal conformational change into insoluble beta-sheet oligomers and intranuclear inclusion bodies.
- Cellular Mechanisms of Neurotoxicity:
  * Axonal Transport Disruption: Impairs motor protein trafficking (kinesin/dynein).
  * Mitochondrial Dysfunction: Respiratory chain failure and oxidative stress.
  * Transcriptional Repression: Sequesters CBP/CREB, drastically downregulating Brain-Derived Neurotrophic Factor (BDNF).
- Selective Striatal Vulnerability: Apoptosis of GABAergic Medium Spiny Neurons (MSNs) in the caudate nucleus and putamen.
- Clinical Consequence: Loss of inhibitory basal ganglia output disinhibits the motor thalamus -> hyperkinetic chorea and executive cognitive decline.

Slide 6: Mode of Inheritance & Pedigree Risk for Ben's Family
- Inheritance Pattern: Autosomal dominant monogenic transmission.
- Genotypic Cross: Ben is heterozygous affected (Hh); Wife is homozygous unaffected (hh).
- 2x2 Punnett Square:
  * Gametes: Ben contributes H (50%) or h (50%); Wife contributes h (100%).
  * Offspring Genotypes: 50% Hh (affected) : 50% hh (unaffected).
- The Independence Principle: Each conception is an independent event with an unvarying 50% (1 in 2) probability. The 6yo daughter, 3yo son, and unborn 3rd baby each face an independent 50% risk.

Slide 7: Genetic Anticipation & Paternal Meiotic Slippage
- Definition: Symptoms manifest at an earlier age of onset with increased clinical severity in successive generations.
- Molecular Mechanism: DNA polymerase replication slippage across repetitive CAG repeats during meiosis, stabilized by hairpin secondary structures.
- Paternal Transmission Bias: Spermatogenesis involves hundreds of continuous lifelong germline stem-cell divisions with high replication error rates, compared to oogenesis arrest in dictyotene.
- Clinical Impact on Ben's Children: As Ben is the biological father, his offspring are at heightened risk of inheriting expanded repeat lengths (> Ben's repeat count), potentially causing juvenile-onset Huntington's disease (<20 years).

Slide 8: Clinical Diagnostic Workup & Neuroimaging
- Brain MRI Findings: Marked bilateral atrophy of the striatum (flattened caudate heads and putamen shrinkage) accompanied by compensatory enlargement of the lateral ventricles (frontal horns).
- Molecular Diagnostic Confirmation: PCR amplification across the HTT exon 1 CAG repeat locus followed by capillary electrophoresis fragment sizing.
- Multidisciplinary Clinical Care: Neurologist, GP, genetic counsellor, occupational therapist, physiotherapist, speech therapist, and neuropsychologist.

Slide 9: Clinical Genetic Testing & Ethical Guidelines (Predictive Testing)
- Presymptomatic / Predictive Testing in Minors:
  * UK Clinical Genetics Consensus (BSGM guidelines): Testing asymptomatic minor children (the 6yo and 3yo) is strictly prohibited.
  * Ethical Justification: Preserves the child's future autonomy and 'right not to know'; absence of childhood preventative therapies means predictive disclosure causes severe psychological harm without medical benefit.
- Testing in Adulthood: Defer testing until age 18, accompanied by mandatory pre-test genetic counselling.

Slide 10: Reproductive Genetics & Emerging Medical Technologies
- Prenatal Diagnosis (For Current Pregnancy):
  * Chorionic Villus Sampling (CVS at 11–14 weeks) or Amniocentesis (15–20 weeks) to sample fetal DNA.
  * Clinical Trade-Offs: ~0.5% procedure-related miscarriage risk; complex ethical decision regarding termination of an affected pregnancy.
- Pre-implantation Genetic Diagnosis (PGD / PGT-M) with IVF:
  * Biopsy and PCR genetic screening of in vitro embryos prior to uterine transfer; only unaffected (hh) embryos are implanted. Eliminates transmission risk without requiring pregnancy termination.
- Treatment Horizons:
  * Current Symptomatic Care: Tetrabenazine / deutetrabenazine (VMAT2 inhibitors depleting presynaptic dopamine to suppress chorea).
  * Disease-Modifying Technologies: Antisense oligonucleotides (ASOs, e.g. tominersen) targeting HTT mRNA; RNA interference (RNAi); allele-selective CRISPR-Cas9 / zinc-finger gene editing.

Slide 11: Academic Research Skills for NEA Task 1 — Literature Searching
- Formulating Targeted Clinical Search Strategies:
  * Boolean Operators: AND (narrows search, e.g. "Huntington disease" AND "genetic counselling"), OR (broadens synonyms, e.g. "chorea" OR "motor symptoms"), NOT (excludes confounders).
  * Wildcards & Truncation: huntingt* retrieves huntingtin, Huntington's, Huntington.
- High-Credibility Academic Databases: PubMed / MEDLINE, Europe PMC, NICE Clinical Knowledge Summaries (CKS), and NHS Genomic Medicine Service guidelines.

Slide 12: Source Evaluation Masterclass — The CRAAP Framework
- Applying CRAAP to Genetics NEA Coursework:
  * Currency: Prioritize recent clinical trial data and up-to-date genetic testing guidelines (last 3–5 years).
  * Relevance: Directly addressing Ben's case study, inheritance risks, and diagnostic pathways.
  * Authority: Peer-reviewed medical journals (Lancet Neurology, NEJM, Nature Genetics), NHS clinical consensus, NICE guidelines vs unverified blogs.
  * Accuracy: Supported by experimental data, proper sample sizes, and established genetic thresholds.
  * Purpose: Objective clinical evidence vs commercial bias (e.g. unregulated direct-to-consumer genetic test marketing).

Slide 13: Referencing Protocol — Harvard Formatting for Coursework
- In-Text Citation Standards:
  * Paraphrased Citation: "Autosomal dominant inheritance confers a 50% recurrence risk per pregnancy (Harper, 2011)."
  * Direct Author Citation: "According to Bates et al. (2015), striatal GABAergic medium spiny neurons are selectively degraded..."
- Reference List Entry Anatomy:
  * Author Surname, Initials., Year. Title of article. Full Title of Journal, Volume(Issue), pp. page range. DOI.
  * Exemplar: Bates, G.P., Dorsey, R., Gusella, J.F., Hayden, M.R., Kay, C., Leavitt, B.R., Nance, M., Ross, C.A., Scahill, R.I., Wetzel, R. and Wild, E.J., 2015. Huntington disease. Nature Reviews Disease Primers, 1(1), pp.1-21. https://doi.org/10.1038/nrdp.2015.5

Slide 14: Synoptic NEA Task 1 Scaffold — Structuring Ben's Portfolio Submission
- Section 1: Clinical Case Presentation & Pathological Mechanism (Ben's adoption, chorea, HTT CAG repeat expansion, and striatal MSN death).
- Section 2: Inheritance Pattern & Pedigree Risk Calculation (Hh x hh cross, 50% independent risk for each of the 3 children).
- Section 3: Genetic Anticipation Analysis (paternal meiotic slippage and juvenile HD risks).
- Section 4: Critical Evaluation of Genetic Testing & Reproductive Options (minors vs adulthood, prenatal CVS/amnio, PGD-IVF, and ASO therapeutics).
- Section 5: Academic Reference List (fully compliant Harvard citations).

Slide 15: Plenary Summary & Key Exam Takeaways
- 4 Core Takeaways:
  1. Molecular Cause: Unstable CAG repeat expansion (>=40 repeats) in HTT encodes polyQ tract causing toxic gain-of-function and striatal MSN apoptosis.
  2. Transmission Risk: Autosomal dominant cross (Hh x hh) gives 50% independent recurrence risk per conception.
  3. Paternal Anticipation: Spermatogenic replication slippage causes repeat expansion, risking earlier juvenile onset.
  4. Clinical Ethics & NEA Success: Defer predictive testing in minors to age 18; balance CVS/amnio vs PGD-IVF; support all NEA arguments with CRAAP-evaluated Harvard references.`;

async function main() {
  console.log("================================================================================");
  console.log(" ✦ Generating Lesson 9 for AAQ Human Biology Genetics (Unit F172)");
  console.log(" Deck ID:", DECK_ID);
  console.log(" Target Notebook:", TARGET_NOTEBOOK_URL);
  console.log(" Target Output Dir:", PUBLIC_DECK_DIR);
  console.log("================================================================================");

  console.log("Connecting to Chrome on CDP port 9333...");
  const browser = await chromium.connectOverCDP(CDP_URL);
  const ctx = browser.contexts()[0];
  let page = ctx.pages().find(p => p.url().includes("d1431642")) || ctx.pages()[0];

  if (!page.url().includes("d1431642")) {
    console.log(`Navigating to ${TARGET_NOTEBOOK_URL}...`);
    await page.goto(TARGET_NOTEBOOK_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(4000);
  }

  // Close any open slide deck viewer or overlays
  const closeDeckBtn = page.locator('button[aria-label="Close slide deck"]');
  if (await closeDeckBtn.isVisible().catch(() => false)) {
    console.log("Closing open slide deck viewer...");
    await closeDeckBtn.click();
    await page.waitForTimeout(1000);
  }

  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Setup download directory and clear old downloads
  if (fs.existsSync(DL_DIR)) {
    for (const f of fs.readdirSync(DL_DIR)) {
      try { fs.unlinkSync(path.join(DL_DIR, f)); } catch {}
    }
  } else {
    fs.mkdirSync(DL_DIR, { recursive: true });
  }

  const client = await ctx.newCDPSession(page);
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: DL_DIR
  });

  // 1. Click "Slide deck" button
  console.log("Clicking 'Slide deck' button...");
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"]').first();
  await slideDeckBtn.waitFor({ state: "visible", timeout: 15000 });
  await slideDeckBtn.click();
  await page.waitForTimeout(1500);

  const overlay = page.locator(".cdk-overlay-pane").last();

  // 2. Select Presenter slides
  console.log("Selecting 'Presenter slides' format...");
  const presenterCard = overlay.locator('div.tile-content').nth(1);
  await presenterCard.click();
  await page.waitForTimeout(500);

  // 3. Enter Lesson 9 prompt
  console.log("Entering Lesson 9 prompt into customisation box...");
  const textarea = overlay.locator('textarea');
  await textarea.fill(LESSON_9_PROMPT);
  await page.waitForTimeout(800);

  // 4. Click "Generate now"
  console.log("Clicking 'Generate now'...");
  const generateBtn = overlay.locator('button:has-text("Generate now")');
  await generateBtn.click();
  await page.waitForTimeout(4000);

  // 5. Monitor generation progress
  console.log("Waiting for generation to begin...");
  let waitGenStart = Date.now();
  while (Date.now() - waitGenStart < 30000) {
    const item = page.locator("artifact-library-item").first();
    const text = (await item.innerText().catch(() => "")).trim().replace(/\s+/g, " ");
    if (text.includes("Generating") || text.includes("sync")) {
      console.log("Confirmed generation in progress:", text);
      break;
    }
    await page.waitForTimeout(1000);
  }

  console.log("Waiting for generation to complete (typically 2–4 minutes)...");
  const startTime = Date.now();
  let done = false;

  while (Date.now() - startTime < 600000) { // 10 min max timeout
    const item = page.locator("artifact-library-item").first();
    const text = (await item.innerText().catch(() => "")).trim().replace(/\s+/g, " ");
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`[+${elapsed}s] Status: ${text.slice(0, 80)}`);

    if (text.includes("Slide deck generation failed")) {
      throw new Error("NotebookLM reported slide deck generation failure.");
    }

    if (!text.includes("Generating slide deck") && !text.includes("sync") && text.length > 0) {
      console.log("SUCCESS: Slide deck generation finished!");
      done = true;
      break;
    }

    await page.waitForTimeout(10000);
  }

  if (!done) {
    throw new Error("Timed out waiting for slide deck generation.");
  }

  await page.waitForTimeout(3000);

  // 6. Open Slide Deck in viewer
  console.log("Opening generated slide deck in viewer...");
  const firstArtifact = page.locator("artifact-library-item").first();
  await firstArtifact.click();
  await page.waitForTimeout(4000);

  // 7. Find viewer action menu and download
  console.log("Finding viewer action menu (more_vert)...");
  const moreBtns = await page.locator('button:has-text("more_vert")').all();
  let menuBtn = null;
  for (const b of moreBtns) {
    const box = await b.boundingBox();
    if (box && box.x > 1150 && box.y > 40 && box.y < 220) {
      menuBtn = b;
      break;
    }
  }

  if (!menuBtn) {
    console.log("Using studio panel more options button fallback...");
    menuBtn = page.locator('.studio-panel button[aria-label="More options"], button[aria-label="More options"]').first();
  }

  // Download PPTX
  console.log("Downloading PowerPoint (.pptx)...");
  await menuBtn.click();
  await page.waitForTimeout(600);
  const pptxItem = page.locator('[role="menuitem"]').filter({ hasText: /PowerPoint/i });
  await pptxItem.click();
  console.log("Clicked Download PPTX. Waiting 8s...");
  await page.waitForTimeout(8000);

  // Download PDF
  console.log("Downloading PDF document (.pdf)...");
  await menuBtn.click();
  await page.waitForTimeout(600);
  const pdfItem = page.locator('[role="menuitem"]').filter({ hasText: /Download PDF/i });
  await pdfItem.click();
  console.log("Clicked Download PDF. Waiting 8s...");
  await page.waitForTimeout(8000);

  // Poll for downloaded files
  console.log("Waiting for downloads to complete in scratch directory...");
  const waitDl = Date.now();
  let pptxFile = null;
  let pdfFile = null;

  while (Date.now() - waitDl < 45000) {
    const files = fs.readdirSync(DL_DIR);
    const inProgress = files.some(f => f.endsWith(".crdownload"));
    pptxFile = files.find(f => f.endsWith(".pptx"));
    pdfFile = files.find(f => f.endsWith(".pdf"));
    if (!inProgress && pptxFile && pdfFile) {
      console.log("Both PPTX and PDF downloaded successfully!");
      break;
    }
    await page.waitForTimeout(1500);
  }

  console.log("Downloaded files:", fs.readdirSync(DL_DIR));

  // Ensure directories exist
  fs.mkdirSync(PUBLIC_DECK_DIR, { recursive: true });
  fs.mkdirSync(SLIDES_DIR, { recursive: true });
  fs.mkdirSync(PPTX_OUTPUT_DIR, { recursive: true });

  // Clear old PNG slides if any
  for (const f of fs.readdirSync(SLIDES_DIR)) {
    if (f.endsWith(".png")) fs.unlinkSync(path.join(SLIDES_DIR, f));
  }

  // Save PPTX
  const pptxDestLocal = path.join(PUBLIC_DECK_DIR, `${DECK_ID}.pptx`);
  const pptxDestAgent = path.join(PPTX_OUTPUT_DIR, `${DECK_ID}.pptx`);
  if (pptxFile) {
    fs.copyFileSync(path.join(DL_DIR, pptxFile), pptxDestLocal);
    fs.copyFileSync(path.join(DL_DIR, pptxFile), pptxDestAgent);
    console.log(`Saved PPTX to ${pptxDestLocal} and ${pptxDestAgent}`);
  }

  // Render slide PNGs with pdftoppm
  if (pdfFile) {
    const pdfPath = path.join(DL_DIR, pdfFile);
    fs.copyFileSync(pdfPath, path.join(PUBLIC_DECK_DIR, `${DECK_ID}.pdf`));
    console.log(`Rendering slide PNGs with pdftoppm at 150 DPI...`);
    execSync(`/opt/homebrew/bin/pdftoppm -png -r 150 "${pdfPath}" "${SLIDES_DIR}/page"`);
    console.log(`Rendered slide PNGs in ${SLIDES_DIR}`);

    // Rename page-1.png -> slide_01.png, page-01.png -> slide_01.png etc.
    const rendered = fs.readdirSync(SLIDES_DIR).filter(f => f.startsWith("page") && f.endsWith(".png"));
    rendered.sort((a, b) => {
      const numA = parseInt(a.replace(/[^0-9]/g, ""), 10);
      const numB = parseInt(b.replace(/[^0-9]/g, ""), 10);
      return numA - numB;
    });

    rendered.forEach((file, idx) => {
      const slideNum = idx + 1;
      const targetName = `slide_${String(slideNum).padStart(2, "0")}.png`;
      fs.renameSync(path.join(SLIDES_DIR, file), path.join(SLIDES_DIR, targetName));
    });
    console.log(`Renamed ${rendered.length} slides to slide_01.png, slide_02.png, etc.`);
  }

  // Build manifest.json
  const lessonConfig = lessons.find(l => l.number === 9);
  const slideFiles = fs.readdirSync(SLIDES_DIR).filter(f => f.endsWith(".png")).sort();
  console.log(`Building manifest.json for ${slideFiles.length} slides...`);

  const manifest = {
    id: DECK_ID,
    title: `Lesson 9: ${lessonConfig.title}`,
    slideSet: "genetics_aaq",
    filename: `${DECK_ID}.pptx`,
    lessonNumber: 9,
    courseName: COURSE_NAME,
    teacher: lessonConfig.teacher || "Dan",
    focus: lessonConfig.focus,
    deliverable: lessonConfig.deliverable,
    totalSlides: slideFiles.length,
    objectives: lessonConfig.objectives,
    terminology: lessonConfig.terminology,
    theoryPoints: lessonConfig.theoryPoints,
    workedExample: lessonConfig.workedExample,
    hingeQuestions: lessonConfig.hingeQuestions,
    examQuestion: lessonConfig.examQuestion,
    plenary: lessonConfig.plenary,
    slides: slideFiles.map((file, idx) => {
      const slideNum = idx + 1;
      const slideObj = {
        number: slideNum,
        title: slideNum === 1 
          ? "Title: Genetics NEA Task 1 Huntington's Case Study" 
          : (slideNum === 2 ? "Starter Activity: 6-Cell Knowledge Retrieval" : `Slide ${slideNum}`),
        imageFileName: file,
        imageUrl: `/decks/genetics_aaq/${DECK_ID}/slides/${file}`,
        isInteractive: false,
        interactiveType: null,
        cognitiveGuide: {
          estimatedTimeSeconds: slideNum === 1 ? 10 : (slideNum === 2 ? 600 : 90),
          timeGuideDisplay: slideNum === 2 ? "10 min" : "1.5 min",
          vciScore: "2.5",
          complexityCategory: "Low",
          ragLevel: "low",
          ragColor: "green",
          ragLabel: "Optimal Processing",
          academicReferences: [
            {
              citation: "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257.",
              relevance: "Models visual working memory and dual coding in biomedical education."
            }
          ]
        }
      };

      // Slide 2: Interactive 6-cell retrieval grid
      if (slideNum === 2 && lessonConfig.starterQuestions?.length >= 6) {
        slideObj.isInteractive = true;
        slideObj.interactiveType = "six_cell_grid";
        slideObj.starterQuestions = lessonConfig.starterQuestions;
        const cellBounds = [
          { row: 0, col: 0, bounds: { x: 6.8, y: 30.5, w: 41.5, h: 22.0 } },
          { row: 0, col: 1, bounds: { x: 51.5, y: 30.5, w: 41.5, h: 22.0 } },
          { row: 1, col: 0, bounds: { x: 6.8, y: 55.0, w: 41.5, h: 22.0 } },
          { row: 1, col: 1, bounds: { x: 51.5, y: 55.0, w: 41.5, h: 22.0 } },
          { row: 2, col: 0, bounds: { x: 6.8, y: 78.5, w: 41.5, h: 18.5 } },
          { row: 2, col: 1, bounds: { x: 51.5, y: 78.5, w: 41.5, h: 18.5 } },
        ];
        slideObj.interactiveCells = lessonConfig.starterQuestions.slice(0, 6).map((qObj, cIdx) => ({
          id: `cell_${cIdx + 1}`,
          row: cellBounds[cIdx].row,
          col: cellBounds[cIdx].col,
          bounds: cellBounds[cIdx].bounds,
          question: qObj.q,
          answer: qObj.a,
          revealed: false
        }));
      }

      return slideObj;
    })
  };

  const manifestPath = path.join(PUBLIC_DECK_DIR, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Saved manifest to ${manifestPath}`);

  // Update checkpoint_aaq_genetics.json in NotebookLMagent
  const checkpointPath = path.resolve("../NotebookLMagent/.state/checkpoint_aaq_genetics.json");
  if (fs.existsSync(checkpointPath)) {
    try {
      const cp = JSON.parse(fs.readFileSync(checkpointPath, "utf8"));
      cp.lessons["9"] = {
        title: lessonConfig.title,
        created: true,
        downloaded: true,
        file: pptxDestAgent,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(checkpointPath, JSON.stringify(cp, null, 2) + "\n", "utf8");
      console.log("[Checkpoint] Updated checkpoint_aaq_genetics.json for Lesson 9.");
    } catch (e) {
      console.warn("[Checkpoint] Could not update checkpoint file:", e.message);
    }
  }

  await browser.close();
  console.log("================================================================================");
  console.log(" 🎉 Lesson 9 Generation, Download, Rendering & Ingestion Complete!");
  console.log(" Deck ID:", DECK_ID);
  console.log(" Slides Count:", slideFiles.length);
  console.log(" Web viewer URL: http://localhost:3000/?set=genetics_aaq&deck=" + DECK_ID);
  console.log("================================================================================");
}

main().catch(err => {
  console.error("Fatal generation error:", err);
  process.exit(1);
});
