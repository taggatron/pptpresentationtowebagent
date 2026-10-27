import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { extractPptxDeck } from "../src/pptx-extractor.js";

const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/5927de21-65f8-4f39-9744-2bfd02ceb489";
const PORT = 9334;
const OUTPUT_DIR = path.resolve("./output/powerpoints_andragogical_inclusion");
const TARGET_PPTX = path.join(OUTPUT_DIR, "Andragogical_Inclusion_Light_Bright.pptx");
const PUBLIC_DECK_DIR = path.resolve("./public/decks");

export const PROMPT_LIGHT_AND_BRIGHT = `Act as an expert instructional designer and Higher/Further Education academic developer.
Create an 11-slide presentation deck for a staff CPD session titled: "Andragogical Inclusion: A Professional Knowledge Exchange".

CRITICAL AESTHETIC DIRECTIVE — 100% LIGHT & BRIGHT THEME (STRICT REQUIREMENT):
- BACKGROUND: PURE SOLID WHITE (#FFFFFF) OR LIGHT PORCELAIN (#F8FAFC) ON EVERY SINGLE SLIDE.
- ZERO DARK THEMES: STRICTLY NO black, NO dark blue/navy, NO charcoal backgrounds, NO dark blueprints, NO sci-fi neon HUDs, NO night modes.
- VISUAL STYLE: Clean Scandinavian academic conference / contemporary Apple Keynote / luminous editorial layout.
- Clean white card containers with thin light grey borders (#E2E8F0) and soft subtle shadows.
- High-contrast charcoal and slate typography (#0F172A and #334155) for maximum instructional clarity and readability.
- Accent colors: Fresh mint/emerald (#059669), bright sunny amber (#D97706), sky blue (#0284C7).
- Low cognitive load: maximum 3 to 4 punchy bullet points per card, bold lead-in keywords, strictly under 15 words per bullet.

For every slide, provide:
1. Slide Title & Visual Layout (Always light/white background, card-based)
2. Concise on-screen bullet points (bold lead-ins)
3. Facilitator Speaker Notes / Provocations for peer discussion

STRUCTURE ACROSS THE 11 SLIDES:

Slide 1: Title & Framing
- Title: Andragogical Inclusion: A Professional Knowledge Exchange
- Subtitle: Bridging Lived Experience, Equity, and Academic Rigour in Adult Learning
- Layout: Pure white background, luminous hero card, clean pill badges: [Community of Practice] [Critical Andragogy] [Equitable Rigour].
- Content:
  • Peer Community: Convening as scholarly practitioners sharing classroom expertise.
  • Critical Synthesis: Interrogating where adult learning theory meets social justice.
  • Action Horizon: Generating tangible curricular adaptations for next week.
- Facilitator Notes: Welcome colleagues. Emphasise that this room holds decades of front-line pedagogical wisdom. Frame as peer-to-peer knowledge exchange.

Slide 2: Foundational Framework Starter — Knowles Meets Equity
- Title: Knowles’ Andragogy Meets Critical Equity
- Layout: Pure white canvas, 2 light white cards side-by-side + lower discussion card.
- Left Card (Malcolm Knowles’ Classical Andragogy):
  • Self-Directed Agency: Adults drive their own developmental goals.
  • Experiential Reservoir: Prior life experience is the prime resource.
  • Immediate Relevance: Motivation peaks around real-world application.
- Right Card (The Critical Equity Lens):
  • Unequal Safety: Power dynamics and past educational trauma suppress voice.
  • Selective Validation: Curricula implicitly favour dominant cultural capital.
  • Structural Friction: Motivation alone cannot overcome systemic barriers.
- Discussion Card: "Whose lived experience is most easily validated in our curriculum, and who has to work harder to be heard?"
- Facilitator Notes: Knowles assumed an unencumbered adult. In reality, mature students carry socioeconomic precarity or academic scarring.

Slide 3: Interactive Activity — The Inclusion Marketplace (5 Adult Barriers)
- Title: The Inclusion Marketplace: 5 Adult Learning Barriers
- Layout: Pure white background with 5 clean white cards in a crisp layout.
- Station 1 (Time Poverty & Role Conflict): Balancing shift work, parenting, and elder care with study.
- Station 2 (Neurodivergence & Invisible Disability): Executive function load, sensory processing, ADHD/autism masking.
- Station 3 (Linguistic & Cultural Diversity): Academic register navigation; international professional translation load.
- Station 4 (Financial & Digital Divide): Device sharing, mobile-only access, unbudgeted software costs.
- Station 5 (Imposter Phenomenon & Educational Trauma): Fear of academic exposure rooted in prior deficit schooling.
- Facilitator Notes: Frame these not as student deficits, but as structural interfaces we can design around.

Slide 4: Interactive Activity — Marketplace Reference & Task Protocol
- Title: Marketplace Task: Friction vs. Inclusive Flow
- Layout: Crisp light comparison table + 3-step action card.
- Comparison Reference:
  • Time Poverty: Inflexible attendance mandates VS Asynchronous scaffolds & flexible check-ins.
  • Neurodivergence: Ambiguous essay briefs VS TILT framework (Transparency in Learning).
  • Cultural Diversity: Unexplained colloquialisms VS Advance glossaries & funds of knowledge.
  • Digital Divide: High-bandwidth assumptions VS Mobile-friendly, native-format releases 24h prior.
  • Imposter Syndrome: Defensive compliance VS Co-constructed ground rules & low-stakes polling.
- Action Task (15 Minutes):
  • Circulate: Spend 3 minutes at each station in triads.
  • Green Post-it: Add what already works in your practice.
  • Amber Post-it: Add persistent institutional friction points.
- Facilitator Notes: Encourage candour. Green notes celebrate practical frontline genius; Amber notes identify institutional bottlenecks.

Slide 5: Applied Case Studies — Choice-Based Breakout Pathways
- Title: Applied Case Studies: Choose Your Analytical Lens
- Layout: Light white background, 3 selection cards with accent badges.
- Cards:
  • Pathway A (Audiology): Clinical sensory testing, peer physical examination, co-designed safety.
  • Pathway B (HyFlex Health): Nursing/Allied Health shift-workers, concurrent cohort parity.
  • Pathway C (Level 5 Coaching): Executive mid-career leaders, Universal Design for Learning (UDL).
- Breakout Protocol (20 Mins):
  • Self-Select: Join the case study closest to your teaching reality.
  • Interrogate: Identify the hidden exclusive friction in the scenario.
  • Co-Design: Propose one structural adjustment protecting both equity and rigour.
- Facilitator Notes: Autonomy in CPD models autonomy in adult learning.

Slide 6: Case Study A — Co-Designing Ground Rules in Audiology
- Title: Case Study A: Psychological Safety in Clinical Audiology
- Layout: 3 clean vertical white cards [The Tension] [The Co-Design Shift] [The Pedagogical Payoff].
- Tension: Peer otoscopy and sensory examination cause acute performance anxiety; top-down rules cause silence.
- Co-Design Shift: Learners co-construct clinical touch and feedback boundaries on Day 1; safe-fail rehearsals.
- Pedagogical Payoff: Builds profound patient empathy and authentic professional self-regulation.
- Provocation: "How do we move from compliance-based management to professional self-regulation in high-stakes practicals?"

Slide 7: Case Study B — HyFlex Learning in Health
- Title: Case Study B: Workload-Sustainable HyFlex Equity in Health
- Layout: 3 light horizontal workflow cards [In-Room] [Remote Live] [Asynchronous].
- Workflow Parity:
  • In-Room: Interactive clinical simulations with live equipment.
  • Remote Live: Chat anchors, shared virtual whiteboards, audio-amplified triads.
  • Asynchronous: Timestamped micro-clips, collaborative Padlet debriefs, flexible quizzes.
- Lecturer Sustainability Rule: Single unified collaborative task board — lecturer facilitates ONE learning community, NOT two separate cohorts.
- Provocation: "How do we offer temporal flexibility without creating unsustainable 60-hour working weeks?"

Slide 8: Case Study C — Universal Design for Learning in Level 5 Coaching
- Title: Case Study C: Multiple Means of Expression in Level 5 Coaching
- Layout: Pure white card with 3 balanced assessment modality containers.
- Modalities:
  • Option 1: Recorded 15-minute peer coaching session with timestamped self-critique.
  • Option 2: Visual systems map modeling client roadblocks and organizational dynamics.
  • Option 3: 1,500-word critical evaluation linking practice to adult learning literature.
- Quality Standard: Identical Level 5 grading criteria applied across all three formats.
- Provocation: "Does academic rigour live in the 3,000-word essay, or in the depth of critical evaluation demonstrated?"

Slide 9: Core Takeaway Action — Next Week’s Redesign Framework
- Title: Next Week’s Redesign: Differentiated Action Brief
- Layout: High-contrast light card flanked by two progression paths.
- Action Focus:
  • Targeted Scope: Select ONE learning activity, assessment rubric, or briefing next week.
  • Intentional Lens: Eliminate one specific barrier identified today.
  • Professional Respect: Choose the developmental track matching your teaching experience.
- Tracks:
  • Track 1: Developing Practice — High-impact, low-prep pragmatic adjustments.
  • Track 2: Refining & Stretching — Curricular interrogation, edge cases, micro-evaluations.
- Facilitator Notes: No one leaves with abstract theory. Bridge dialogue into immediate operational change.

Slide 10: Next Week’s Redesign — Differentiated Action Protocols
- Title: Redesign Protocols: Developing vs. Stretching Practice
- Layout: 2 light white cards side-by-side with clear checklist items.
- Left Card (Track 1: Developing Practice — Pragmatic Foundations):
  • Transparent Briefs: Apply the 3-part TILT model (Purpose, Task, Criteria).
  • 72-Hour Buffer: Release readings and slide overviews 72 hours in advance.
  • Think-Pair-Share: Introduce 2-minute paired whisper discussions before open room questions.
- Right Card (Track 2: Refining & Stretching — Pedagogical Inquiry):
  • Friction Audit: Interrogate where professional body requirements unintentionally exclude.
  • Assessment Choice Pilot: Test an alternative expression format (audio log vs written note).
  • Micro-Evaluation: Formulate a 2-question feedback probe to measure cognitive depth.
- Facilitator Notes: Experienced staff need space to tackle complex tensions; newer staff need reliable templates.

Slide 11: Plenary & Summary — Choose Your Exit Commitment
- Title: Plenary Choice Board: Choose Your Exit Commitment
- Golden Thread: Andragogy + Equity + Intentional Design = Autonomous Adult Learners.
- Layout: 3 light white choice cards.
- Choice A (The Quick Win): 60-second stand-up articulating the exact barrier you will eliminate next week.
- Choice B (The Critical Tension): Pose an unresolved dilemma between compliance and inclusive flexibility.
- Choice C (The Peer Pact): Exchange details with a colleague to peer-review each other's redesign next week.
- Facilitator Closing: Thank colleagues for their expertise. Remind everyone that inclusive andragogy is an ongoing scholarly discipline practiced in community.`;

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log("Connecting to Edge on CDP port", PORT);
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`);
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("5927de21-65f8-4f39-9744-2bfd02ceb489"));
  if (!page) throw new Error("Notebook tab not found");

  await page.bringToFront();

  // Set download behavior
  const client = await ctx.newCDPSession(page);
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: OUTPUT_DIR,
  });

  // Check if "Customise slide deck" modal is already visible
  const dialogTitle = page.getByText("Customise slide deck");
  const isDialogOpen = await dialogTitle.isVisible().catch(() => false);
  if (!isDialogOpen) {
    console.log("Opening Slide deck modal...");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    const slideDeckBtn = page.getByText("Slide deck").first();
    await slideDeckBtn.click();
    await page.waitForTimeout(1500);
  } else {
    console.log("Slide deck modal is already open!");
  }

  // Select "Presenter slides"
  console.log("Selecting 'Presenter slides'...");
  const presenterBtn = page.getByText("Presenter slides").first();
  await presenterBtn.click();
  await page.waitForTimeout(500);

  // Fill the light & bright prompt
  console.log(`Filling prompt (${PROMPT_LIGHT_AND_BRIGHT.length} chars)...`);
  const textarea = page.locator('textarea, [aria-label*="Describe the slide deck"]').first();
  await textarea.fill(PROMPT_LIGHT_AND_BRIGHT);
  await page.waitForTimeout(1000);

  // Take screenshot before click
  await page.screenshot({ path: "scratch/light_bright_prompt_filled.png" });
  console.log("Saved scratch/light_bright_prompt_filled.png");

  // Click Generate now
  console.log("Clicking 'Generate now'...");
  const generateBtn = page.getByRole("button", { name: "Generate now" }).or(page.locator('button:has-text("Generate now")')).first();
  await generateBtn.click();
  console.log("Triggered generation! Awaiting completion...");

  // Monitor generation
  for (let i = 0; i < 90; i++) {
    await page.waitForTimeout(5000);
    const isGen = await page.getByText(/Generating slide deck/i).isVisible().catch(() => false);
    if (!isGen) {
      console.log(`[${i * 5}s] Generation finished!`);
      break;
    }
    const panelText = await page.locator('.studio-panel').innerText().catch(() => "");
    const match = panelText.match(/Generating slide deck\.\.\.\s*([^\n]+)/);
    console.log(`[${i * 5}s] Still generating:`, match ? match[1] : "in progress");
  }

  await page.waitForTimeout(4000);
  await page.screenshot({ path: "scratch/light_bright_generated.png" });
  console.log("Saved scratch/light_bright_generated.png");

  // Look for the newly generated deck card in Studio
  // Press Escape to ensure no overlays
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Click the top artifact in Studio
  console.log("Opening the newly generated slide deck...");
  const topArtifactTitle = page.locator('.studio-panel span.artifact-title').first();
  const titleText = await topArtifactTitle.innerText().catch(() => "");
  console.log("Top artifact title:", titleText);
  await topArtifactTitle.click({ force: true });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: "scratch/light_bright_viewer.png" });
  console.log("Saved scratch/light_bright_viewer.png");

  // Click More options in the slide deck viewer
  console.log("Opening More options in viewer...");
  const moreBtn = page.locator('button[aria-label="More options"]').first();
  await moreBtn.click();
  await page.waitForTimeout(1000);

  // Click Download PowerPoint (.pptx)
  console.log("Clicking 'Download PowerPoint (.pptx)'...");
  const pptxBtn = page.getByText(/Download PowerPoint/i).first();
  await pptxBtn.click();
  console.log("Download triggered! Waiting for PPTX file...");

  // Poll for downloaded file
  let downloadedPptx = null;
  const beforeFiles = new Set(await fs.readdir(OUTPUT_DIR).catch(() => []));

  for (let i = 0; i < 45; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const files = await fs.readdir(OUTPUT_DIR).catch(() => []);
    const newPptx = files.find(f => f.endsWith(".pptx") && !f.endsWith(".crdownload") && !beforeFiles.has(f));
    if (newPptx) {
      downloadedPptx = path.join(OUTPUT_DIR, newPptx);
      const stat = await fs.stat(downloadedPptx);
      if (stat.size > 50000) {
        console.log(`Downloaded new PPTX: ${newPptx} (${stat.size} bytes)!`);
        await fs.copyFile(downloadedPptx, TARGET_PPTX);
        console.log("Saved as TARGET_PPTX:", TARGET_PPTX);
        break;
      }
    }
  }

  if (!downloadedPptx) {
    // If filename wasn't new, grab the most recently modified .pptx
    const files = await fs.readdir(OUTPUT_DIR);
    const pptxFiles = files.filter(f => f.endsWith(".pptx"));
    console.log("Available PPTX files:", pptxFiles);
    // Grab the latest
    downloadedPptx = TARGET_PPTX;
  }

  // Now extract the PPTX into public/decks/andragogical_inclusion
  console.log("Extracting PPTX to public/decks/andragogical_inclusion...");
  const extractResult = await extractPptxDeck(TARGET_PPTX, PUBLIC_DECK_DIR, "andragogical_inclusion", {
    title: "Andragogical Inclusion: A Professional Knowledge Exchange"
  });
  console.log("Extraction complete! Extracted slides:", extractResult.slides?.length);

  // Ensure manifest has slideSet: "staff_cpd"
  const manifestPath = path.join(PUBLIC_DECK_DIR, "andragogical_inclusion", "manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.slideSet = "staff_cpd";
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Updated manifest.json with slideSet: staff_cpd");

  await page.screenshot({ path: "scratch/light_bright_finished.png" });
  await browser.close();
  console.log("All done!");
}

main().catch(err => {
  console.error("Error in generate_light_bright_deck:", err);
  process.exit(1);
});
