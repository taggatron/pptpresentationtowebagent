import { chromium } from "playwright";

const PROMPT_TEXT = `Act as an expert instructional designer and Higher/Further Education academic developer.
Create a comprehensive, engaging, and scholarly slide deck for a staff CPD session titled: "Andragogical Inclusion: A Professional Knowledge Exchange".

CRITICAL VISUAL & PEDAGOGICAL DIRECTIVES (100% LIGHT & BRIGHT AESTHETIC):
- PURE SOLID WHITE (#FFFFFF) OR LIGHT PORCELAIN (#F8FAFC) BACKGROUND ON EVERY SLIDE.
- ZERO DARK THEMES: STRICTLY NO black, dark navy, or charcoal backgrounds. NO dark blueprints, NO sci-fi neon HUDs, NO night modes.
- Luminous academic conference styling: clean white cards, thin light borders, dark slate high-contrast typography (#0F172A), and fresh bright accents (mint emerald, warm amber, sky blue).
- Low cognitive load: maximum 3-4 punchy bullet points per card with bold lead-ins, strictly under 15 words per bullet.
- For every slide include: Slide Title, visual layout suggestion, concise high-impact bullets, and Facilitator Speaker Notes / Provocations.

SEQUENCE ACROSS 11 SLIDES:

Slide 1: Title & Framing
- Title: Andragogical Inclusion: A Professional Knowledge Exchange
- Subtitle: Bridging Lived Experience, Equity, and Academic Rigour in Adult Learning
- Layout: Pure white canvas, clean pill tags [Community of Practice] [Critical Andragogy] [Equitable Rigour].
- Content: Peer Community: Convening as scholarly practitioners sharing expertise. Critical Synthesis: Interrogating where adult learning theory meets social justice. Action Horizon: Generating tangible curricular adaptations for next week.
- Facilitator Provocation: Establish the room as a community of practice. Everyone brings pedagogical expertise to interrogate and share.

Slide 2: Foundational Framework Starter — Knowles’ Andragogy Meets Equity
- Title: Knowles’ Andragogy Meets Critical Equity
- Left Card (Malcolm Knowles): Adults are self-directed, bring a rich reservoir of life experience, require immediate relevance.
- Right Card (The Equity Expansion): Power dynamics, socioeconomic status, and past educational trauma condition psychological safety.
- Discussion Provocation: "Whose lived experience is most easily validated in our curriculum, and who has to work harder to be heard?"

Slide 3: The Inclusion Marketplace (5 Adult Learning Barriers)
- 5 Station Cards on white background:
  1. Time Poverty & Role Conflict: Shift work, parenting, elder care.
  2. Neurodivergence & Executive Load: ADHD/autism masking, sensory processing.
  3. Linguistic Diversity & Academic Literacy: Academic register traps, imposter syndrome.
  4. Digital & Material Divide: Hardware sharing, mobile-only access, software costs.
  5. Past Schooling Scars: Educational trauma, fear of academic exposure.

Slide 4: Marketplace Task: Friction vs. Inclusive Adjustments
- Comparison & Instructions:
  - Friction vs Flow: Attendance penalties vs async scaffolds; ambiguous briefs vs TILT; jargon vs glossaries; synchronous demands vs low-bandwidth access.
  - Task (15 Mins): Triads spend 3 mins per station. Green post-its for what works; Amber for persistent institutional barriers.

Slide 5: Applied Case Studies: Choose Your Analytical Lens
- Choice Board: Pathway A (Audiology clinical examination), Pathway B (HyFlex health shift-workers), Pathway C (Level 5 coaching leadership).
- Task: Self-select into the scenario closest to your discipline. Identify hidden friction and co-design an inclusive adjustment.

Slide 6: Case Study A — Psychological Safety in Clinical Audiology
- Tension: Severe performance anxiety during peer otoscopy/physical exams due to sensory sensitivities.
- Co-Design Adjustment: Co-construct physical examination safety contracts on Day 1; low-stakes simulated practice.
- Pedagogical Payoff: Deepens patient empathy and clinical self-regulation.

Slide 7: Case Study B — Workload-Sustainable HyFlex Equity in Health
- Tension: Distance shift-workers isolated by 40-page weekly PDF readings and synchronous discussion boards.
- Co-Design Adjustment: Micro-chunked reading briefs, multi-modal responses (voice notes, short video), asynchronous peer pods.
- Pedagogical Payoff: Equal engagement parity without staff burnout.

Slide 8: Case Study C — Universal Design for Learning (UDL) in Level 5 Coaching
- Tension: Senior apprentice with undiagnosed dyslexia masking difficulties behind defensive resistance to academic essays.
- Co-Design Adjustment: Oral reflection vivas, assistive technology integration, structured reflective sentence stems.
- Pedagogical Payoff: Evaluates executive leadership mastery without academic literacy gating.

Slide 9: The Next Week Redesign: Differentiated Action Planning
- Action Framework: Friction vs Flow Matrix.
  - Current Friction: Where does unnecessary design roadblock occur?
  - Pedagogical Adjustment: What low-barrier modification removes the friction?
  - Academic Rigour: How is cognitive standard preserved or elevated?

Slide 10: Differentiated Takeaways for Diverse Staff Experience
- Developing Practitioners: 1 concrete quick win (TILT assignment design; 48-hour advance editable materials).
- Experienced Leaders: 1 systemic change (co-designing grading rubrics with students; auditing curriculum reading lists for structural bias).

Slide 11: Plenary, Peer Pact & Synthesis
- Core Synthesis: Inclusion is not lowering the bar; it is dismantling invisible barriers so learners can reach the high bar.
- Choice Board Exit: Option A (The Quick Win: 60-second barrier removal); Option B (The Critical Tension: unresolved dilemma); Option C (The Peer Pact: cross-discipline partner swap).`;

async function main() {
  console.log("Connecting to Edge on CDP port 9334...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("5927de21-65f8-4f39-9744-2bfd02ceb489"));
  if (!page) throw new Error("Notebook page not found");

  await page.bringToFront();

  // Check if dialog is open
  const dialog = page.locator("mat-dialog-container");
  if (!await dialog.isVisible().catch(() => false)) {
    console.log("Opening Slide deck modal...");
    const btn = page.locator(".create-artifact-button-container:has-text(\"Slide deck\")");
    await btn.click();
    await page.waitForTimeout(1500);
  }

  // Format selection: "Detailed deck" is selected by default in modal
  const detailedDeckTile = page.locator("mat-dialog-container .tile-content:has-text(\"Detailed deck\")");
  if (await detailedDeckTile.isVisible().catch(() => false)) {
    console.log("Ensuring 'Detailed deck' is selected...");
    await detailedDeckTile.click();
    await page.waitForTimeout(300);
  }

  // Fill the prompt textarea
  console.log("Filling prompt textarea...");
  const textarea = page.locator("textarea[placeholder*=\"Add a high-level outline\"]");
  await textarea.fill(PROMPT_TEXT);
  await page.waitForTimeout(500);

  // Screenshot before submission
  await page.screenshot({ path: "scratch/modal_filled_light_bright.png" });
  console.log("Saved scratch/modal_filled_light_bright.png");

  // Click Generate now
  console.log("Clicking 'Generate now'...");
  const generateNowBtn = page.locator("mat-dialog-container button:has-text(\"Generate now\")");
  await generateNowBtn.click();
  console.log("Clicked 'Generate now'!");

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scratch/after_generate_now_clicked.png" });
  console.log("Saved scratch/after_generate_now_clicked.png");

  await browser.close();
  process.exit(0);
}

main().catch(err => {
  console.error("Error submitting deck:", err);
  process.exit(1);
});
