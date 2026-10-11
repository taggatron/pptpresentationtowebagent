import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/40fbb05f-e884-4f79-828b-c4539e9a0d31";
const CDP_URL = "http://127.0.0.1:9333";

const EV_POWER_PROMPT = `Create a bright, visually stunning, high-engagement classroom slide deck for GCSE Physics: "The Kettle vs. The Supercharger: Decoding Electrical Power and Electricity Calculations".

Ground the entire deck in the context of Electric Vehicle (EV) charging and the provided GCSE physics sources.

Aesthetic & Visual Philosophy:
- Bright, minimalist, high-contrast modern clean tech: bright white and pale neutral card backgrounds, dark high-contrast typography, crisp neon accents (electric cyan, vivid cobalt, amber orange).
- Cognitive Load Management: Strict adherence to dual coding and Mayer's multimedia principles. Zero walls of text. Use dedicated rounded cards, bold key metrics, side-by-side comparative callouts, and clean formula boxes.
- Visual Descriptions: Include explicit visual prompts for what diagram, comparison graphic, or calculation card sits alongside the text.

Slide Sequence & Detailed Structure:

Slide 1: Title & The 60-Second Hook
- Title: The Kettle vs. The Supercharger: Decoding Electrical Power
- Subtitle: GCSE Physics · Electrical Power & High-Power Engineering
- The 60-Second Hook: "A standard domestic kitchen kettle draws 2,300 W. An ultra-rapid EV supercharger delivers 350,000 W. How many boiling kettles of electrical power are flowing simultaneously through that single charging cable?" (Answer: ~152 simultaneous kettles!).
- Visual Layout: Side-by-side comparison graphics — a standard household stainless-steel kettle (2,300 W) next to an ultra-rapid 350 kW DC charging dispenser with illuminated cable.
- Learning Goal: Connecting Watts, Volts, Amps, and Joules to real-world power demands and vehicle engineering.

Slide 2: Starter Activity — Knowledge Retrieval Grid (6 Starter Questions)
- Structure: Exactly one 6-cell grid (2 columns x 3 rows) of rounded cards with success cues and answer reveals:
  * Cell 1: What formula links electrical power, current, and potential difference? [Success Cue: P = V × I] [Answer: P = V × I]
  * Cell 2: What is the unit of electrical power, and what does 1 Watt equal in energy per second? [Success Cue: Joules per second] [Answer: Watt (W) = 1 Joule per second (1 J/s)]
  * Cell 3: A domestic kettle operates on 230 V mains and draws 10 A. Calculate its power rating. [Success Cue: P = 230 × 10] [Answer: 2,300 W (2.3 kW)]
  * Cell 4: What formula links total energy transferred, power rating, and operating time? [Success Cue: Energy = Power × time] [Answer: E = P × t]
  * Cell 5: How much electrical energy is transferred when a 2.3 kW kettle boils water for 200 seconds? [Success Cue: E = 2300 × 200] [Answer: 460,000 J (460 kJ)]
  * Cell 6: If electrical current through a charging cable doubles, by what factor does resistive heat loss increase? [Success Cue: P = I² × R squared relationship] [Answer: Power quadruples (increases 4×)]

Slide 3: Fundamental Formula — Power as Rate of Energy Transfer
- Core Equation: P = E / t (Power in Watts = Energy transferred in Joules ÷ Time taken in seconds).
- Key Takeaway: Power determines charging speed, not total battery capacity.
- Visual Layout: A 3-column split card comparing charging times for a typical 75 kWh EV battery:
  1. Domestic 3-Pin Plug (2.3 kW) ➔ ~32.6 hours (Overnight + Full Day)
  2. Dedicated Home Wallbox (7.4 kW) ➔ ~10.1 hours (Single Overnight Charge)
  3. Motorway Rapid DC Charger (150 kW) ➔ ~30 minutes (Quick Coffee Stop)
- Visual Metric: High-contrast progression bars showing charging time shrinking as power increases.

Slide 4: Inside the Cable — Current & Voltage (P = I × V)
- Core Concept: How do engineers deliver 350 kW without melting the charging cable?
- Engineering Trade-Off:
  * Option A: Crank the Current (I) ➔ Thick, heavy, unmanageable copper cables and extreme resistive heat.
  * Option B: Boost the Voltage (V) ➔ Why modern high-performance EVs run on 800 V architectures rather than standard household 230 V or older 400 V systems.
- Worked Example Callout Box:
  * Charge Power: 150 kW (150,000 W)
  * At 230 V: I = P / V = 150,000 / 230 = 652 A (cable would overheat and melt!)
  * At 800 V: I = P / V = 150,000 / 800 = 187.5 A (safe, manageable, lightweight cable).

Slide 5: The Heat Problem & Thermal Limits (P = I² × R)
- Core Concept: Energy dissipation and resistance losses in cables.
- The Squared Relationship: P = I² × R. Doubling current quadruples resistive heat loss (2² = 4×); tripling current increases heat nine-fold (3² = 9×).
- Visual Layout: Cutaway engineering diagram of an ultra-rapid liquid-cooled charging cable:
  * Copper conductors carrying heavy current.
  * Internal coolant channels circulating specialized dielectric liquid.
  * Thermal sensors preventing overheating.
- Key Insight: High voltage is the engineering solution to thermal limits.

Slide 6: Student Calculation Challenge (Scaffolded Diagnostic Check)
- Scenario: A driver arrives at a motorway service station with 10% charge on a 60 kWh battery and needs to reach 80% to complete the journey safely.
- Step-by-Step Scaffolded Questions:
  * Step 1: Calculate the total energy required in kWh and Joules (E). [70% of 60 kWh = 42 kWh = 151,200,000 J (151.2 MJ)]
  * Step 2: Calculate the time needed on a 50 kW charger vs. a 150 kW charger (t = E / P). [50 kW: ~50.4 minutes | 150 kW: ~16.8 minutes]
  * Step 3: Calculate the current flow (I) if the charging station operates at 400 V (I = P / V). [At 150 kW and 400 V: I = 150,000 / 400 = 375 A]
- Solution Box: Provided in clear formula, substitution, calculation, and unit breakdown.

Slide 7: Master Formula Matrix & Units (Visual Reference Card)
- Visual Reference Layout: 3 distinct vertical cards with luminous neon glow styling, formula circles, and unit badge pills above each symbol (matching the clean visual architecture of GCSE circuit calculations):
  * Card 1 (Electric Cyan): Flow & Push — Q = I × t (Charge in Coulombs, Current in Amps, Time in seconds) and V = I × R (Potential Difference in Volts, Current in Amps, Resistance in Ohms).
  * Card 2 (Cobalt Blue): Power & Heating — P = V × I (Power in Watts, Voltage in Volts, Current in Amps) and P = I² × R (Power in Watts, Current in Amps, Resistance in Ohms - Heating Effect).
  * Card 3 (Vivid Orange): Energy & Work — E = P × t (Energy in Joules, Power in Watts, Time in seconds - Work Done) and E = Q × V (Energy in Joules, Charge in Coulombs, Voltage in Volts - Charge Energy).`;

async function main() {
  console.log("Connecting to Chrome on port 9333...");
  const browser = await chromium.connectOverCDP(CDP_URL);
  const ctx = browser.contexts()[0];
  let page = ctx.pages().find(p => p.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31")) || ctx.pages()[0];

  if (!page.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31")) {
    console.log(`Navigating to ${TARGET_NOTEBOOK_URL}...`);
    await page.goto(TARGET_NOTEBOOK_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000);
  }

  // Close any open overlays or viewers first
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Setup download directory
  const dlDir = path.resolve("scratch/downloads_ev_deck");
  if (!fs.existsSync(dlDir)) fs.mkdirSync(dlDir, { recursive: true });

  const client = await ctx.newCDPSession(page);
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: dlDir
  });

  // 1. Click Slide deck button
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

  // 3. Enter prompt
  console.log("Entering prompt...");
  const textarea = overlay.locator('textarea');
  await textarea.fill(EV_POWER_PROMPT);
  await page.waitForTimeout(800);

  await page.screenshot({ path: "scratch/ev_deck_dialog_prepared.png" });
  console.log("Screenshot saved to scratch/ev_deck_dialog_prepared.png");

  // 4. Click "Generate now"
  console.log("Clicking 'Generate now'...");
  const generateBtn = overlay.locator('button:has-text("Generate now")');
  await generateBtn.click();
  await page.waitForTimeout(4000);

  // 5. Monitor generation
  console.log("Waiting for generation to begin...");
  let waitGenStart = Date.now();
  while (Date.now() - waitGenStart < 25000) {
    const item = page.locator("artifact-library-item").first();
    const text = (await item.innerText().catch(() => "")).trim().replace(/\s+/g, " ");
    if (text.includes("Generating") || text.includes("sync")) {
      console.log("Confirmed generation in progress:", text);
      break;
    }
    await page.waitForTimeout(1000);
  }

  console.log("Waiting for generation to complete (typically 3–4 minutes)...");
  const startTime = Date.now();
  let done = false;

  while (Date.now() - startTime < 600000) { // 10 min max timeout
    const item = page.locator("artifact-library-item").first();
    const text = (await item.innerText().catch(() => "")).trim().replace(/\s+/g, " ");
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`[+${elapsed}s] Status: ${text.slice(0, 80)}`);

    if (text.includes("Slide deck generation failed")) {
      throw new Error("NotebookLM reported generation failure.");
    }

    // Check if generation completed
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

  await page.screenshot({ path: "scratch/ev_deck_viewer_opened.png" });
  console.log("Screenshot saved to scratch/ev_deck_viewer_opened.png");

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
  console.log("Waiting for downloads to complete...");
  const waitDl = Date.now();
  let pptxFile = null;
  let pdfFile = null;

  while (Date.now() - waitDl < 40000) {
    const files = fs.readdirSync(dlDir);
    const inProgress = files.some(f => f.endsWith(".crdownload"));
    pptxFile = files.find(f => f.endsWith(".pptx"));
    pdfFile = files.find(f => f.endsWith(".pdf"));
    if (!inProgress && pptxFile && pdfFile) {
      console.log("Both PPTX and PDF downloaded successfully!");
      break;
    }
    await page.waitForTimeout(1500);
  }

  console.log("Downloaded files:", fs.readdirSync(dlDir));

  // Extract / render
  const outDir = path.resolve("public/decks/physics_electricity_magnetism/Lesson_05_EV_Power_Calculations");
  const slideDir = path.join(outDir, "slides");
  if (!fs.existsSync(slideDir)) fs.mkdirSync(slideDir, { recursive: true });

  if (pptxFile) {
    fs.copyFileSync(path.join(dlDir, pptxFile), path.join(outDir, "Lesson_05_EV_Power_Calculations.pptx"));
    console.log(`Saved PPTX to ${outDir}`);
  }

  if (pdfFile) {
    const pdfPath = path.join(dlDir, pdfFile);
    fs.copyFileSync(pdfPath, path.join(outDir, "Lesson_05_EV_Power_Calculations.pdf"));
    console.log(`Rendering slide PNGs with pdftoppm...`);
    execSync(`/opt/homebrew/bin/pdftoppm -png -r 150 "${pdfPath}" "${slideDir}/slide"`);
    console.log(`Rendered slide PNGs in ${slideDir}`);
  }

  await browser.close();
  console.log("🎉 Complete! Deck generated, downloaded, and rendered.");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
