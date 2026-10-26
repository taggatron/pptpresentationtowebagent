import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";

const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/5927de21-65f8-4f39-9744-2bfd02ceb489";
const CDP_PORT = 9333;
const PROFILE_DIR = "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/NotebookLMagent/.state/browser-profile";
const OUTPUT_DIR = path.resolve("./output/powerpoints_andragogical_inclusion");
const PUBLIC_DECK_DIR = path.resolve("./public/decks/andragogical_inclusion");

export const PROMPT_ANDRAGOGICAL_INCLUSION = `Create a comprehensive, visually luminous, high-clarity 11-slide presentation deck artifact for a Higher and Further Education Staff CPD session titled: "Andragogical Inclusion: A Professional Knowledge Exchange".

CRITICAL PEDAGOGICAL & AESTHETIC DIRECTIVES (Adapted from the GCSE Biology Cognitive Clarity Architecture):
1. BRIGHT, LUMINOUS & LIGHT VISUAL DESIGN: Clean white/light canvas, elegant floating glassmorphic cards, crisp high-contrast typography, generous whitespace, and purposeful colour accents (emerald green for inclusive adjustments, warm amber for pedagogical friction, slate/navy for academic framing).
2. LOW COGNITIVE LOAD: Max 3–4 bullet points per card/container. Every bullet must be short, punchy (strictly under 15 words) with bold lead-in keywords. Eliminate dense narrative walls of text.
3. SCHOLARLY & COLLEGIAL TONE: Frame the session as a peer-to-peer community of practice and professional knowledge exchange, not top-down compliance training.
4. COMPLETE MULTI-SLIDE SPECIFICATION: Generate all 11 slides in full detail with explicit visual layouts, structured cards, and embedded facilitator provocations / speaker notes for discussion.

SLIDE-BY-SLIDE CURRICULUM SEQUENCE:

Slide 1: Title & Framing
- Title: Andragogical Inclusion: A Professional Knowledge Exchange
- Subtitle: Bridging Lived Experience, Equity, and Academic Rigour in Adult Learning
- Layout: Asymmetric hero card with subtitle banner and three foundational pill tags: [Community of Practice] [Critical Andragogy] [Equitable Rigour].
- On-Screen Content:
  • Peer Community: Convening as scholarly practitioners sharing classroom expertise.
  • Critical Synthesis: Interrogating where adult learning theory meets social justice.
  • Action Horizon: Generating tangible curricular adaptations for next week's teaching.
- Facilitator Provocation / Speaker Notes: Welcome colleagues. Emphasise that this room holds decades of front-line pedagogical wisdom. We are not delivering a deficit-model training session; we are interrogating institutional assumptions together to elevate learning for every adult.

Slide 2: Foundational Framework Starter — Knowles’ Andragogy Meets Equity
- Title: Knowles’ Andragogy Meets Critical Equity
- Layout: 2-Column Comparative Synthesis Card + Bottom Horizontal Provocation Banner.
- Left Card (Classical Andragogy - Malcolm Knowles):
  • Self-Directed Agency: Adults drive their own developmental learning goals.
  • Experiential Reservoir: Prior life experience forms the primary learning resource.
  • Immediate Relevance: Motivation peaks when learning solves real-world dilemmas.
- Right Card (The Equity Expansion):
  • Unequal Safety: Power dynamics and past educational trauma suppress voice.
  • Selective Validation: Curricula implicitly favour dominant cultural capital.
  • Systemic Friction: Adult motivation cannot overcome structural exclusion alone.
- Pair Provocation Banner: "Whose lived experience is most easily validated in our current curriculum, and who has to work harder to be heard?"
- Facilitator Speaker Notes: Knowles assumed an unencumbered, autonomous adult. In reality, mature students carry socioeconomic precarity, systemic microaggressions, or past academic scarring. We must design psychological safety intentionally.

Slide 3: Interactive Activity — The Inclusion Marketplace (Core Barriers vs. Adjustments)
- Title: The Inclusion Marketplace: Systemic Adult Barriers
- Layout: 5 Distinct Visual Cards (Stations 1 to 5) across an open grid.
- Station 1 (Time Poverty & Role Conflict): Balancing shift work, parenting, and elder care against inflexible timetables.
- Station 2 (Neurodivergence & Invisible Disability): Executive function load, sensory processing friction, ADHD/autism masking.
- Station 3 (Linguistic & Cultural Diversity): ESOL/EAL academic register navigation; international professional translation load.
- Station 4 (Financial & Digital Divide): Device sharing, mobile-only internet, unbudgeted specialist software/equipment costs.
- Station 5 (Imposter Phenomenon & Educational Trauma): Fear of academic exposure rooted in prior deficit schooling experiences.
- Facilitator Speaker Notes: Frame these not as student deficits, but as structural interfaces. Every barrier represents an institutional design friction that thoughtful pedagogy can alleviate.

Slide 4: Interactive Activity — Marketplace Reference & Task Protocol
- Title: Marketplace Task: Friction vs. Inclusive Adjustments
- Layout: 2-Column Comparative Framework Table + Step-by-Step Task Container.
- Framework Reference Table:
  • Time Poverty: Traditional attendance penalties VS Asynchronous micro-scaffolds & flexible check-ins.
  • Neurodivergence: Ambiguous essay briefs VS TILT framework (Transparency in Learning and Teaching).
  • Cultural Diversity: Eurocentric canonical examples VS Moll’s Funds of Knowledge & bilingual glossaries.
  • Digital Divide: Synchronous mandatory downloads VS Low-bandwidth, mobile-optimised LMS design.
  • Imposter Syndrome: High-stakes cold calling VS Low-stakes anonymised polling & staged drafting.
- Marketplace Action Task (15 Minutes Total):
  • Circulate: Spend 3 minutes at each physical/digital station in triads.
  • Green Post-it: Add "What already works in my studio, lab, or seminar".
  • Amber Post-it: Add "Where we still hit persistent institutional friction".
- Facilitator Speaker Notes: Encourage radical candour. Green notes celebrate practical frontline genius; Amber notes pinpoint where university policies or assumptions create unnecessary roadblocks.

Slide 5: Applied Case Studies — Choice-Based Breakout Pathways
- Title: Applied Case Studies: Choose Your Analytical Lens
- Layout: 3-Way Pathway Selection Matrix with contextual badges and breakout guidelines.
- Pathway Overview:
  • Pathway A (Audiology): Clinical sensory testing, high-stakes peer examinations, co-designed safety.
  • Pathway B (HyFlex Health): Nursing/Allied Health shift-workers, concurrent hybrid cohort parity.
  • Pathway C (Level 5 Coaching): Executive mid-career leaders, Universal Design for Learning (UDL) expression.
- Breakout Protocol (20 Mins):
  • Self-Select: Join the case study closest to your teaching or assessment modality.
  • Interrogate: Identify the hidden exclusive practice in the scenario.
  • Co-Design: Propose one structural adjustment protecting both equity and professional standards.
- Facilitator Speaker Notes: Choice in professional development mirrors choice in adult learning. Give participants autonomy to select the challenge that directly stretches their domain expertise.

Slide 6: Case Study A — Co-Designing Ground Rules in Audiology
- Title: Case Study A: Psychological Safety in Clinical Audiology
- Context: Clinical skill acquisition with mature learners from varied healthcare backgrounds.
- Layout: 3 Structured Vertical Columns [The Tension] [The Co-Design Shift] [The Pedagogical Payoff].
- Column 1 (The Tension):
  • Vulnerable Practice: Peer otoscopy and high-stakes sensory testing cause intense performance anxiety.
  • Tutor-Imposed Compliance: Top-down rules induce defensive silence rather than authentic reflection.
- Column 2 (The Co-Design Shift):
  • Negotiated Safety Contract: Learners co-construct clinical touch and feedback boundaries on Day 1.
  • Structured Safe-Fail Zones: Low-stakes diagnostic rehearsals before clinical supervisor sign-off.
- Column 3 (The Pedagogical Payoff):
  • Heightened Clinical Empathy: Experiencing peer examination builds patient-facing sensitivity.
  • Ownership & Rigour: Self-policing norms increase clinical standard adherence.
- Facilitator Provocation: "How do we move from compliance-based classroom management to professional self-regulation in high-stakes practicals?"

Slide 7: Case Study B — HyFlex Learning in Health
- Title: Case Study B: Workload-Sustainable HyFlex Equity in Health
- Context: Adult nursing and allied health learners balancing NHS shift patterns, family care, and study.
- Layout: 3 Horizontal Workflow Swimlanes [Room Learners] [Remote Live] [Asynchronous Catch-Up].
- Swimlane 1 (Room Learners): Interactive clinical simulation and physical equipment hands-on practice.
- Swimlane 2 (Remote Live): Digital chat anchors, shared digital whiteboards, audio-amplified peer triads.
- Swimlane 3 (Asynchronous Catch-Up): Timestamped micro-clips, collaborative Padlet debriefs, flexible quizzing.
- Core Workload Rule: Single unified collaborative task board — lecturer facilitates ONE learning community, NOT two parallel classes.
- Facilitator Provocation: "How can we offer genuine temporal flexibility without creating unsustainable 60-hour working weeks for faculty?"

Slide 8: Case Study C — Universal Design for Learning (UDL) in Level 5 Coaching
- Title: Case Study C: Multiple Means of Expression in Level 5 Coaching
- Context: Experienced mid-career professionals training for executive and leadership coaching credentials.
- Layout: Central UDL Triangle with 3 Balanced Assessment Expression Nodes.
- Assessment Modalities:
  • Triad Audio Capture: Unedited 15-minute recorded peer coaching session with timestamped self-critique.
  • Visual Systems Mapping: Rich visual diagram modeling systemic organizational dynamics and client roadblocks.
  • Academic Reflective Dialogue: 1,500-word scholarly critique linking practice directly to adult coaching literature.
- Professional Standards Gating: Identical Level 5 marking rubrics applied across all expressive formats.
- Facilitator Provocation: "Does academic rigour live in the 3,000-word written essay, or does it live in the depth of critical evaluation demonstrated?"

Slide 9: Core Takeaway Action — "Next Week's Redesign" Framework
- Title: Next Week's Redesign: Differentiated Action Brief
- Layout: Central Callout Card flanked by Dual Professional Progression Tracks.
- Activity Mandate:
  • Targeted Scope: Select ONE specific activity, assessment rubric, or briefing delivered next week.
  • Intentional Lens: Identify and dismantle one concrete barrier discovered in today's session.
  • Professional Respect: Choose the developmental pathway that matches your teaching trajectory.
- Pathway Badges:
  • Pathway 1: Developing Practice — High-impact, low-prep pragmatic adjustments.
  • Pathway 2: Refining & Stretching — Curricular interrogation, edge-cases, and micro-evaluations.
- Facilitator Speaker Notes: No one leaves with abstract theory. This slide bridges professional dialogue into immediate classroom operational change.

Slide 10: "Next Week's Redesign" — Differentiated Action Protocols
- Title: Redesign Pathways: Developing vs. Stretching Practice
- Layout: 2-Column High-Contrast Differentiated Cards.
- Left Card (Pathway 1: Developing Practice — Pragmatic Foundations):
  • Low-Prep Adjustments: Clarify assignment rubrics using the 3-part TILT model (Purpose, Task, Criteria).
  • Asynchronous Buffer: Release reading lists and recorded overviews 72 hours in advance.
  • Flexible Voice: Introduce 2-minute paired whisper-discussions before open-room questions.
  • Target Outcome: 2 concrete inclusive tweaks integrated into next week's session plan.
- Right Card (Pathway 2: Refining & Stretching — Advanced Pedagogical Inquiry):
  • Curricular Friction Audit: Interrogate where professional body requirements unintentionally exclude.
  • Assessment Choice Pilot: Design an alternative expression pathway (audio log vs written brief).
  • Micro-Evaluation Metric: Formulate a 2-question student feedback probe to measure cognitive depth.
  • Target Outcome: Run a bounded pedagogical experiment and share findings with department peers.
- Facilitator Speaker Notes: Highlight that experienced teachers need space to wrestle with complex edge cases, while newer colleagues benefit from immediate, high-leverage procedural templates.

Slide 11: Plenary & Summary — "Choose Your Exit Commitment"
- Title: Plenary Choice Board: Choose Your Exit Commitment
- Golden Thread Synthesis: Andragogy + Equity + Intentional Design = Autonomous Adult Learners.
- Layout: 3 Distinct Interactive Plenary Choice Cards.
- Choice A (The Quick Win):
  • 60-Second Stand-Up: Articulate the exact barrier you will eliminate from next week's session.
- Choice B (The Critical Tension):
  • Collegial Dilemma: Pose an unresolved tension between institutional compliance and inclusive flexibility.
- Choice C (The Peer Pact):
  • Cross-Disciplinary Ally: Exchange contact with a peer from another subject to review each other's redesign next week.
- Facilitator Closing Note: Thank colleagues for their vulnerability and expertise. Remind everyone that inclusive andragogy is not an endpoint or checklist—it is an ongoing scholarly discipline practiced in community.`;

async function checkPort(port) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/list`);
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function run() {
  console.log("================================================================================");
  console.log(" ✦ Gemini Notebook / NotebookLM Slide Deck Generator");
  console.log(" Target URL:", TARGET_NOTEBOOK_URL);
  console.log(" CDP Port:", CDP_PORT);
  console.log(" Profile Dir:", PROFILE_DIR);
  console.log("================================================================================");

  let tabs = await checkPort(CDP_PORT);
  if (!tabs) {
    console.log(`Launching Google Chrome with remote debugging on port ${CDP_PORT}...`);
    const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${PROFILE_DIR}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--start-maximized",
      TARGET_NOTEBOOK_URL
    ], { detached: true, stdio: "ignore" });
    chrome.unref();

    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 500));
      tabs = await checkPort(CDP_PORT);
      if (tabs) break;
    }
  }

  if (!tabs) {
    throw new Error(`Failed to connect to Google Chrome CDP on port ${CDP_PORT}`);
  }

  console.log(`Connected to Chrome! Available tabs: ${tabs.length}`);
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx = browser.contexts()[0];

  let page = ctx.pages().find(p => p.url().includes("5927de21-65f8-4f39-9744-2bfd02ceb489") || p.url().includes("notebook"));
  if (!page) {
    page = ctx.pages()[0] || await ctx.newPage();
    console.log(`Navigating page to ${TARGET_NOTEBOOK_URL}...`);
    await page.goto(TARGET_NOTEBOOK_URL, { waitUntil: "domcontentloaded" });
  }

  await page.waitForTimeout(3000);
  const currentUrl = page.url();
  console.log(`Active Page URL: ${currentUrl}`);

  if (currentUrl.includes("accounts.google.com")) {
    console.log("\n================================================================================");
    console.log(" ⚠️  AUTHENTICATION NOTICE:");
    console.log(" Google Chrome is currently displaying the Google sign-in page.");
    console.log(" Please complete sign-in in the open Chrome window on your screen.");
    console.log(" Once signed in, re-run this script to automatically submit the prompt!");
    console.log("================================================================================\n");
    return { status: "needs_auth", url: currentUrl };
  }

  // Once signed in, look for Slide deck creator
  console.log("Notebook is authenticated! Checking for 'Slide deck' button...");
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"], button:has-text("Slide deck")').first();
  if (await slideDeckBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
    console.log("Clicking 'Slide deck' button...");
    await slideDeckBtn.click();
    await page.waitForTimeout(1500);
  }

  // Select Presenter slides format
  const presenterCard = page.locator("mat-dialog-container, .cdk-overlay-pane").getByText("Presenter slides").first();
  if (await presenterCard.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log("Selecting 'Presenter slides' format for clean, card-based layout...");
    await presenterCard.click();
    await page.waitForTimeout(500);
  }

  // Fill prompt
  const promptBox = page.locator('textarea, [aria-label*="Describe the slide deck"]').first();
  if (await promptBox.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log(`Filling customized prompt (${PROMPT_ANDRAGOGICAL_INCLUSION.length} chars)...`);
    await promptBox.fill(PROMPT_ANDRAGOGICAL_INCLUSION);
    await page.waitForTimeout(1000);

    const generateBtn = page.locator('button:has-text("Generate now")').first();
    if (await generateBtn.isVisible().catch(() => false)) {
      console.log("Clicking 'Generate now'...");
      await generateBtn.click();
      console.log("Slide deck generation triggered in Gemini Notebook!");
      return { status: "generating", title: "Andragogical Inclusion" };
    }
  }

  return { status: "ready", pageUrl: page.url() };
}

if (process.argv[1] && process.argv[1].endsWith("generate_andragogical_inclusion_deck.mjs")) {
  run().catch(err => {
    console.error("Execution error:", err);
    process.exit(1);
  });
}
