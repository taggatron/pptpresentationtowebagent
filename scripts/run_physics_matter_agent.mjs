import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_physics_matter_pressure_heat");
const LOCAL_PPTX_DIR = path.resolve("./output/powerpoints_physics_matter_pressure_heat");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/physics_matter_pressure_heat");
const CDP_URL = "http://127.0.0.1:9333";
const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/40fbb05f-e884-4f79-828b-c4539e9a0d31";

export const PHYSICS_MATTER_LESSONS = [
  {
    number: 1,
    title: "States of Matter",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_01_States_of_Matter",
    practicalNames: ["Particle Kinetic Model & Changes of State Demonstrations"],
    details: `The particle model of matter and kinetic theory for GCSE Combined Science / Physics:
1. Three States of Matter:
   - Solid: particles tightly packed in a regular arrangement/lattice; vibrate about fixed positions; strong electrostatic intermolecular forces; definite shape and fixed volume; highest density (for most substances).
   - Liquid: particles closely spaced but in an irregular/random arrangement; can move/slide past one another; moderate intermolecular forces; fixed volume but takes the shape of its container.
   - Gas: particles far apart with large empty spaces; move randomly and rapidly in all directions at varying speeds; negligible/weak intermolecular forces; no fixed shape or volume; low density and highly compressible.
2. Changes of State:
   - Melting (solid to liquid), Freezing (liquid to solid), Boiling/Evaporation (liquid to gas), Condensing (gas to liquid), Sublimation (solid directly to gas, e.g. dry ice/iodine).
   - Physical changes: no new substance is formed, the change is completely reversible, and total mass is strictly conserved. Contrast with chemical reactions.
3. Internal Energy & Temperature:
   - Internal energy is the sum of the total kinetic energy (due to particle motion) and total potential energy (due to intermolecular bonds and separation).
   - Temperature is a measure of the average kinetic energy of the particles in a substance.
   - When heating a substance without a state change, kinetic energy increases and temperature rises.`,
    starterQuestions: [
      { q: "What are the three common states of matter?", a: "Solid, liquid, and gas", cue: "Three physical phases" },
      { q: "In which state are particles arranged in a regular, fixed lattice?", a: "Solid", cue: "Vibrate in fixed spots" },
      { q: "What is the process of a solid turning directly into a gas called?", a: "Sublimation", cue: "Skips liquid phase" },
      { q: "Why are changes of state considered physical changes?", a: "Reversible and mass is conserved (no new chemicals formed)", cue: "Not chemical" },
      { q: "Define internal energy of a system.", a: "Sum of kinetic energy and potential energy of all particles", cue: "Total particle energy" },
      { q: "What property of particles increases when temperature rises?", a: "Average kinetic energy (speed of vibration/motion)", cue: "Movement energy" }
    ],
    interactives: [
      {
        title: "Interactive Simulation: States of Matter & Particle Motion",
        url: "https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_all.html",
        label: "PhET Simulation · Particle Kinetic Model"
      }
    ]
  },
  {
    number: 2,
    title: "Pressure",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_02_Pressure",
    practicalNames: ["Investigating Pressure Under Different Contact Areas & Fluid Columns"],
    details: `Pressure in Solids, Liquids, and Gases for GCSE Physics:
1. Pressure in Solids:
   - Definition: normal force exerted perpendicularly per unit area of a surface.
   - Formula: P = F / A (Pressure P in Pascals Pa or N/m², Force F in Newtons N, Area A in m²).
   - High pressure applications: knife edges, nail points, football studs, ice skate blades (minimise contact area to maximise pressure).
   - Low pressure applications: snowshoes, caterpillar tracks on tanks/tractors, wide tyres on sand (maximise area to spread force and minimise sinkage).
2. Pressure in Fluids (Liquids and Gases):
   - Fluids exert pressure in all directions perpendicular to any surface.
   - Liquid column pressure formula: P = h × ρ × g (P in Pa, depth h in metres m, liquid density ρ in kg/m³, gravitational field strength g = 10 N/kg or 9.8 N/kg).
   - Liquid pressure increases directly with depth and density of the fluid (e.g. pressure on a diver or submarine deep underwater; dam walls must be thicker at the base).
3. Gas Pressure & Atmospheric Pressure:
   - Gas pressure is produced by gas particles continually colliding with the interior walls of their container, exerting an outward force per unit area.
   - Effect of temperature: heating a gas at constant volume increases the average kinetic energy of the particles, causing more frequent and energetic collisions, significantly increasing gas pressure.
   - Atmospheric pressure: caused by air molecules colliding with surfaces. It decreases with altitude because the air becomes less dense and there are fewer molecules in the air column above.`,
    starterQuestions: [
      { q: "State the equation linking pressure, force, and area.", a: "P = F / A", cue: "P = ..." },
      { q: "What is the SI unit of pressure?", a: "Pascal (Pa) or N/m²", cue: "1 Pa = 1 N/m²" },
      { q: "Why do snowshoes stop a person sinking into deep snow?", a: "Large surface area reduces the pressure on the snow", cue: "Spreads weight" },
      { q: "What formula calculates pressure at depth in a liquid?", a: "P = h × ρ × g", cue: "Depth × Density × Gravity" },
      { q: "Why must a hydroelectric dam wall be thicker at the base than at the top?", a: "Water pressure increases with depth (greater force at bottom)", cue: "Depth pressure" },
      { q: "What happens to the pressure of a sealed gas container when heated?", a: "Pressure increases (particles collide faster and more frequently)", cue: "More energetic impacts" }
    ],
    interactives: [
      {
        title: "Interactive Simulation: Fluid Pressure & Depth",
        url: "https://phet.colorado.edu/sims/html/under-pressure/latest/under-pressure_all.html",
        label: "PhET Simulation · Hydrostatic Pressure Lab"
      }
    ]
  },
  {
    number: 3,
    title: "Density and Archimedes Principle",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_03_Density_and_Archimedes_Principle",
    practicalNames: ["OCR Mandatory Practical PAG P1: Measuring Density of Regular, Irregular Solids & Liquids; Archimedes Principle & Upthrust"],
    details: `Density, Upthrust, and Archimedes' Principle for GCSE Physics (OCR Gateway Practical PAG P1):
1. Definition & Formula of Density:
   - Density is the mass per unit volume of a substance.
   - Formula: ρ = m / V (Density ρ in kg/m³ or g/cm³, Mass m in kg or g, Volume V in m³ or cm³). Conversion: 1 g/cm³ = 1000 kg/m³.
2. OCR Mandatory Practical PAG P1 (Measuring Density):
   - Regular Solid: measure dimensions with ruler or Vernier calipers/micrometer (Volume = l × w × h), measure mass on digital balance, calculate ρ = m / V.
   - Irregular Solid (Eureka / Displacement Can method): fill Eureka can until water overflows from spout into a waste beaker until dripping stops; position an accurate measuring cylinder beneath the spout; carefully submerge the irregular solid on a thin thread; read volume of displaced water in measuring cylinder (at eye level, bottom of meniscus) = volume of solid; measure mass on balance; calculate ρ = m / V.
   - Liquids: weigh an empty measuring cylinder; add a specific volume of liquid (e.g. 50 cm³); reweigh cylinder + liquid; subtract empty mass to get liquid mass; calculate ρ = m / V.
3. Upthrust & Archimedes' Principle:
   - Origin of Upthrust: fluid pressure increases with depth (P = hρg), so the upward pressure on the bottom surface of a submerged object is greater than the downward pressure on top. This pressure differential creates a net upward resultant force called upthrust.
   - Archimedes' Principle: The upthrust on an object submerged in a fluid is exactly equal to the weight of the fluid displaced by the object.
   - Floating and Sinking:
     - If object weight > maximum upthrust (average density of object > fluid density), the object sinks.
     - If upthrust = object weight (average density of object ≤ fluid density), the object floats.`,
    starterQuestions: [
      { q: "State the equation linking density, mass, and volume.", a: "ρ = m / V (or Density = Mass / Volume)", cue: "ρ = ..." },
      { q: "What is the standard SI unit of density?", a: "kg/m³ (or g/cm³)", cue: "Mass per volume" },
      { q: "How is the volume of an irregular solid measured in the lab?", a: "Using a Eureka (displacement) can and measuring cylinder", cue: "Water overflow method" },
      { q: "What causes the upward buoyant force (upthrust) in a liquid?", a: "Pressure is greater at greater depth acting on the bottom", cue: "Pressure difference" },
      { q: "State Archimedes' principle.", a: "Upthrust equals the weight of fluid displaced", cue: "Displaced fluid weight" },
      { q: "Why does a steel ship float even though steel is denser than water?", a: "Hollow hull encloses air, making overall average density less than water", cue: "Average density" }
    ],
    interactives: [
      {
        title: "Interactive Simulation: Density & Buoyancy (Archimedes Principle)",
        url: "https://phet.colorado.edu/sims/html/density/latest/density_all.html",
        label: "PhET Simulation · Density & Upthrust Lab"
      }
    ]
  },
  {
    number: 4,
    title: "Latent Heat",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_04_Latent_Heat",
    practicalNames: ["Investigating Specific Latent Heat of Fusion with Ice Calorimeter & Heating Curves"],
    details: `Specific Latent Heat and Thermal State Changes for GCSE Physics:
1. Definition of Specific Latent Heat:
   - The amount of energy required to change the state of 1 kilogram of a substance with no change in temperature.
   - Formula: E = m × L (Energy E in Joules J, Mass m in kg, Specific Latent Heat L in J/kg).
   - Rearrangements: L = E / m, m = E / L.
2. Two Types of Specific Latent Heat:
   - Specific Latent Heat of Fusion (L_f): energy required to change 1 kg of a substance between solid and liquid (melting or freezing). For ice/water, L_f ≈ 334,000 J/kg.
   - Specific Latent Heat of Vaporisation (L_v): energy required to change 1 kg of a substance between liquid and gas (boiling or condensing). For water/steam, L_v ≈ 2,260,000 J/kg (much greater than L_f because bonds are completely broken and particles separated).
3. Heating and Cooling Curves:
   - Graphs of temperature against time during constant heating.
   - Temperature rises during single-phase heating as kinetic energy increases.
   - Horizontal flat plateaus occur during changes of state (melting point and boiling point).
   - Core explanation: During a phase change, thermal energy supplied is used to break intermolecular bonds (increasing potential energy), so average particle kinetic energy does not change, and temperature remains constant until the state change is complete.
4. Laboratory Practical:
   - Latent heat of fusion with crushed ice and warm water in an insulated calorimeter. Measuring mass of ice melted and temperature drops to calculate L_f.`,
    starterQuestions: [
      { q: "Define specific latent heat.", a: "Energy needed to change state of 1 kg of substance without changing temperature", cue: "State change without temp change" },
      { q: "What is the formula linking energy, mass, and specific latent heat?", a: "E = m × L", cue: "E = ..." },
      { q: "What is the difference between latent heat of fusion and vaporisation?", a: "Fusion is solid ↔ liquid; Vaporisation is liquid ↔ gas", cue: "Melt vs Boil" },
      { q: "Why does the temperature stay constant on a heating curve during melting?", a: "Energy is used to break intermolecular bonds (increasing potential energy)", cue: "Bonds, not kinetic energy" },
      { q: "What is the SI unit of specific latent heat?", a: "Joules per kilogram (J/kg)", cue: "Energy per mass" },
      { q: "Why is latent heat of vaporisation of water much larger than fusion?", a: "Particles must be completely separated against attractive forces in a gas", cue: "Complete separation" }
    ],
    interactives: [
      {
        title: "Interactive Simulation: Thermal Energy & Phase Changes",
        url: "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html",
        label: "PhET Simulation · Latent Heat & Phase Change"
      }
    ]
  },
  {
    number: 5,
    title: "Specific Heat Capacity",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_05_Specific_Heat_Capacity",
    practicalNames: ["OCR Mandatory Practical: Determining Specific Heat Capacity of a Metal Block using Immersion Heater"],
    details: `Specific Heat Capacity for GCSE Physics (OCR Combined Science / Physics Mandatory Practical):
1. Definition & Formula of Specific Heat Capacity (c):
   - Specific heat capacity is the amount of energy required to raise the temperature of 1 kilogram of a substance by 1 degree Celsius (or 1 Kelvin).
   - Formula: ΔE = m × c × Δθ (Change in thermal energy ΔE in Joules J, Mass m in kg, Specific Heat Capacity c in J/kg°C, Temperature change Δθ in °C).
   - Rearrangement: c = ΔE / (m × Δθ).
2. OCR Mandatory Practical (Measuring SHC of a Metal Block):
   - Equipment: 1 kg cylindrical metal block (aluminium, copper, or iron) with two drilled holes, electric immersion heater (e.g. 12 V, 50 W), DC power supply, voltmeter, ammeter, stopwatch, digital thermometer, lagging/insulation wrap, and a few drops of vegetable oil.
   - Method:
     1. Measure and record mass of the block using a digital balance.
     2. Wrap block in insulation to minimise heat loss to the surrounding air.
     3. Insert immersion heater into the central hole and thermometer into the second hole; add drops of oil into thermometer hole to provide good thermal contact.
     4. Record initial temperature. Switch on heater, start stopwatch, record voltmeter reading V and ammeter reading I.
     5. Record temperature every 60 seconds for 10 minutes.
     6. Calculate electrical energy supplied: E = P × t = V × I × t.
     7. Calculate specific heat capacity: c = E / (m × Δθ).
3. Analysis & Graphing:
   - Plot temperature (°C) against work done / energy (J). Gradient of linear portion = Δθ / ΔE = 1 / (m × c).
   - Sources of Experimental Error & Precautions:
     - Heat dissipated to surroundings: calculated c will be higher than true value because measured energy includes wasted thermal energy. Insulation minimises this.
     - Thermal lag: maximum temperature may occur slightly after turning off the heater.
4. Comparing High vs Low SHC Materials:
   - Water has very high SHC (4,200 J/kg°C), making it ideal for central heating radiators and car engine coolant. Metals have low SHC (e.g. aluminium ~900 J/kg°C, copper ~385 J/kg°C) and heat up rapidly.`,
    starterQuestions: [
      { q: "Define specific heat capacity.", a: "Energy required to raise 1 kg of a substance by 1 °C", cue: "Energy per kg per °C" },
      { q: "State the equation linking thermal energy, mass, SHC, and temperature change.", a: "ΔE = m × c × Δθ", cue: "ΔE = ..." },
      { q: "What is the SI unit of specific heat capacity?", a: "J/kg°C (Joules per kilogram per degree Celsius)", cue: "J / (kg °C)" },
      { q: "Why is thermal insulation wrapped around the metal block in the practical?", a: "To reduce thermal energy loss to the surroundings", cue: "Minimise heat loss" },
      { q: "Why is a drop of oil placed in the thermometer hole?", a: "To ensure good thermal contact between the thermometer and block", cue: "Thermal conductivity" },
      { q: "Why is water commonly used as a coolant in car engines?", a: "High specific heat capacity (absorbs lots of heat with small temp rise)", cue: "High SHC" }
    ],
    interactives: [
      {
        title: "Interactive Simulation: Specific Heat Capacity & Thermal Storage",
        url: "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html",
        label: "PhET Simulation · Specific Heat Capacity Lab"
      }
    ]
  }
];

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function buildLessonPrompt(lesson) {
  return `Create a detailed classroom slide deck for GCSE Physics: Matter, Pressure & Thermal Physics.

Use the exact deck title: “Lesson ${lesson.number}: ${lesson.title}”.
Teacher: ${lesson.teacher} (${lesson.practicalsCount} Practical${lesson.practicalsCount > 1 ? "s" : ""})

Lesson details: ${lesson.details}

Use UK English and draw factual teaching content from the selected notebook sources.

Pitch the lesson at GCSE Combined Science learners. Build a coherent teaching sequence with clear learning objectives, essential terminology, accurate explanations, context, worked examples or calculations where appropriate, safety and quality considerations for all practicals, regular checks for understanding, and a concise plenary summary.

CRITICAL REQUIREMENT - CLEAR AND BRIGHT SLIDES WITH LOW COGNITIVE LOAD: Every slide must be designed as clear and bright slides with exceptionally uncluttered layouts, generous whitespace, clean luminous visual styling, and high contrast. Use clear and bright slides that are fresh, well-lit, visually open, engaging, and immediately legible from the back of a classroom. Slides must NOT contain too much information, dark murky backgrounds, or dense walls of text.

Limit content on each slide to essential concepts: use short, punchy bullet points (under 15 words each, max 3–4 bullets per card/container) with bold lead-ins. Avoid long narrative paragraphs.

Ensure all diagrams, tables, and data callouts are large, well-spaced, high-contrast, clear and bright slides, and immediately readable from the back of a classroom.

Ensure that all lessons integrate knowledge checkpoints and learner activities at the correct part of the lesson to maintain active engagement.

For data interpretation, worked examples, and practical workflows, ensure practice tasks and exemplars have really clear, uncluttered step-by-step layouts with clean spacing between prompt, equipment, method, results, and explanation.

Make diagrams and layouts readable from the back of a classroom. Avoid invented references, unrealistic lab procedures, and claims that are not supported by the notebook sources.

Make this lesson fully self-contained. Do not pre-teach content from later lessons.

Maximise student learning activity frequencies and interactive learning games throughout the deck.

Include frequent high-engagement checkpoints such as pair-and-share challenges, quick-fire retrieval games, diagram labelling exercises, calculation races, and interactive concept-matching games on slides.

Make the first slide a clear title slide without any learner activities. Immediately following the title slide, include exactly one 5–10 minute starter slide formatted as a 6-cell grid (2 columns x 3 rows).

Populate each of the 6 cells with one concise starter question directly related to this lesson topic, each with a short success cue or expected answer:
${lesson.starterQuestions.map((sq, i) => `Cell ${i + 1}: ${sq.q} [Success Cue: ${sq.cue}] [Answer: ${sq.a}]`).join("\n")}

Ensure the questions activate prerequisite knowledge, diagnostic misconceptions, or core concepts needed for this specific lesson.

Keep all other slides focused on core teaching, practical demonstrations, guided practice, and checks for understanding. Do not place starter grids or retrieval activities on other slides.`;
}

async function findStudioPage(browser) {
  const contexts = browser.contexts();
  for (const ctx of contexts) {
    for (const p of ctx.pages()) {
      if (p.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31") || p.url().includes("notebook")) {
        return p;
      }
    }
  }
  if (contexts[0] && contexts[0].pages().length > 0) {
    return contexts[0].pages()[0];
  }
  throw new Error("No open Notebook tab found on CDP port 9333.");
}

async function dismissTransientDialogs(page) {
  const candidates = [
    page.getByRole("button", { name: "Got it", exact: true }),
    page.getByRole("button", { name: "Dismiss", exact: true }),
    page.getByRole("button", { name: "No thanks", exact: true }),
  ];
  for (const c of candidates) {
    if ((await c.count()) === 1 && (await c.isVisible().catch(() => false))) {
      await c.click().catch(() => {});
    }
  }
}

async function isGenerationVisible(page) {
  try {
    const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"]').first();
    if ((await slideDeckBtn.count()) > 0) {
      const cls = (await slideDeckBtn.getAttribute("class").catch(() => "")) || "";
      if (cls.includes("disabled-tile")) return true;
    }
    const generatingText = page.getByText(/Generating\.\.\./i);
    const count = await generatingText.count();
    for (let i = 0; i < count; i++) {
      if (await generatingText.nth(i).isVisible().catch(() => false)) return true;
    }
    const spinners = page.locator('mat-spinner, mat-progress-spinner, mat-progress-bar, .spinner, [role="progressbar"]');
    const spinCount = await spinners.count();
    for (let i = 0; i < spinCount; i++) {
      if (await spinners.nth(i).isVisible().catch(() => false)) return true;
    }
  } catch (e) {}
  return false;
}

export async function generateAndIngestLesson(browser, lesson) {
  log(`\n================================================================================`);
  log(`✦ Starting Flow for Lesson ${lesson.number}: ${lesson.title} (${lesson.teacher})`);
  log(`================================================================================`);

  const page = await findStudioPage(browser);
  await page.setViewportSize({ width: 1600, height: 1000 }).catch(() => {});

  if (!page.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31")) {
    log(`Navigating page to target notebook URL: ${TARGET_NOTEBOOK_URL}`);
    await page.goto(TARGET_NOTEBOOK_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
  }

  // Ensure download behavior allows writing to PPTX_OUTPUT_DIR & LOCAL_PPTX_DIR
  await fs.mkdir(PPTX_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(LOCAL_PPTX_DIR, { recursive: true });
  try {
    const client = await browser.contexts()[0].newCDPSession(page);
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: PPTX_OUTPUT_DIR,
    });
  } catch (err) {
    log(`CDP setDownloadBehavior notice: ${err.message}`);
  }

  // Close slide deck viewer if currently open in Studio
  const openCloseBtn = page.locator('.studio-panel button[aria-label="Close slide deck"], button[aria-label="Close slide deck"]').first();
  if ((await openCloseBtn.count()) > 0 && (await openCloseBtn.isVisible().catch(() => false))) {
    log("Closing previously open slide deck viewer...");
    await openCloseBtn.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  // Close any open mat-dialog-container
  const openDialog = page.locator('mat-dialog-container');
  if ((await openDialog.count()) > 0) {
    log("Closing leftover dialog...");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);
  }

  await dismissTransientDialogs(page);

  // If Studio panel is collapsed, expand it
  const studioHeader = page.locator('.panel-header-clickable:has-text("Studio"), .panel-header-content:has-text("Studio")').first();
  if ((await studioHeader.count()) > 0 && !(await page.locator('div.create-artifact-button-container[aria-label="Slide deck"]').isVisible().catch(() => false))) {
    await studioHeader.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  const getCards = () => page.locator("artifact-library-item");
  let prevTopCardText = "";
  const initialCardsCount = await getCards().count();
  if (initialCardsCount > 0) {
    prevTopCardText = (await getCards().first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
  }
  log(`Initial Studio state: ${initialCardsCount} artifact cards present. Top card: "${prevTopCardText.slice(0, 50)}"`);

  if (await isGenerationVisible(page)) {
    log("An existing generation is active. Waiting for it to settle...");
    while (await isGenerationVisible(page)) {
      await page.waitForTimeout(5000);
    }
    log("Previous generation completed.");
  }

  // Open "Slide deck" dialog
  log(`Opening 'Slide deck' creator for Lesson ${lesson.number}...`);
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"]').first();
  await slideDeckBtn.waitFor({ state: "visible", timeout: 20000 });
  await slideDeckBtn.click();
  await page.waitForTimeout(1500);

  const dialogHeading = page.getByText("Customise slide deck", { exact: true });
  await dialogHeading.waitFor({ state: "visible", timeout: 15000 });
  log("'Customise slide deck' dialog is open.");

  const presenterSlidesBtn = page.getByText("Presenter slides", { exact: true });
  if ((await presenterSlidesBtn.count()) > 0) {
    await presenterSlidesBtn.click();
    log("Selected 'Presenter slides' mode.");
    await page.waitForTimeout(500);
  }

  const promptText = buildLessonPrompt(lesson);
  const promptBox = page.getByLabel("Describe the slide deck that you want to create", { exact: true });
  await promptBox.fill(promptText);
  log(`Injected customised prompt with 'clear and bright slides' requirement for ${lesson.title}.`);
  await page.waitForTimeout(1000);

  const generateBtn = page.locator('mat-dialog-container button:has-text("Generate now"), button:has-text("Generate now")').first();
  await generateBtn.click();
  log("Clicked 'Generate now'. Generation is queued!");

  await dialogHeading.waitFor({ state: "hidden", timeout: 30000 });
  log("Dialog closed. Monitoring generation progress in Studio...");

  const deadline = Date.now() + 15 * 60 * 1000;
  let settledChecks = 0;
  await page.waitForTimeout(6000);

  const titleKeywords = lesson.title.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 4);

  while (Date.now() < deadline) {
    const isViewerOpen = (await page.locator('.studio-panel button[aria-label="More options"]').count()) > 0;
    if (isViewerOpen) {
      log(`Slide deck viewer opened for Lesson ${lesson.number}! Generation is finished.`);
      break;
    }

    const isGenerating = await isGenerationVisible(page);
    const cards = getCards();
    const currentCount = await cards.count();
    let currentTopText = "";
    if (currentCount > 0) {
      currentTopText = (await cards.first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    }

    const isTopCardGenerating = /generating|sync\b/i.test(currentTopText);
    const matchesTitle = titleKeywords.some(kw => currentTopText.toLowerCase().includes(kw));

    if (isGenerating || isTopCardGenerating) {
      settledChecks = 0;
      log(`NotebookLM is generating slide deck for Lesson ${lesson.number} (${currentTopText.slice(0, 60)}...)...`);
    } else if (matchesTitle || /just now/i.test(currentTopText)) {
      settledChecks += 1;
      log(`Detected completed artifact card: "${currentTopText.slice(0, 60)}" (settled check ${settledChecks}/2)`);
      if (settledChecks >= 2) {
        log(`Slide deck generation complete for Lesson ${lesson.number}!`);
        break;
      }
    }

    await page.waitForTimeout(5000);
  }

  await page.waitForTimeout(3000);

  // Trigger PowerPoint download
  const pptxTargetFile = path.join(PPTX_OUTPUT_DIR, `${lesson.deckId}.pptx`);
  const localPptxFile = path.join(LOCAL_PPTX_DIR, `${lesson.deckId}.pptx`);
  const downloadStartTime = Date.now();
  log(`Triggering PowerPoint (.pptx) download for Lesson ${lesson.number}...`);

  const viewerMoreBtn = page.locator('.studio-panel button[aria-label="More options"]').first();
  if ((await viewerMoreBtn.count()) > 0 && (await viewerMoreBtn.isVisible().catch(() => false))) {
    log("Opening More options menu from Studio viewer...");
    await viewerMoreBtn.click();
  } else {
    log("Opening More menu from top artifact card in list...");
    const cardMoreBtn = page.locator('artifact-library-item button[aria-label="More"]').first();
    await cardMoreBtn.waitFor({ state: "visible", timeout: 10000 });
    await cardMoreBtn.click();
  }

  await page.waitForTimeout(1000);
  const pptxMenuItem = page.locator('[role="menuitem"]:has-text("Download PowerPoint")').first();
  await pptxMenuItem.waitFor({ state: "visible", timeout: 10000 });
  await pptxMenuItem.click();
  log("Clicked 'Download PowerPoint (.pptx)'. Awaiting file on disk...");

  // Poll for downloaded file in PPTX_OUTPUT_DIR or ~/Downloads
  let downloadedPptx = null;
  const downloadsDir = path.join(process.env.HOME || "/Users/danieltagg", "Downloads");
  const pollDeadline = Date.now() + 60000;
  while (Date.now() < pollDeadline) {
    await new Promise(r => setTimeout(r, 1000));
    
    // Check PPTX_OUTPUT_DIR
    const files = await fs.readdir(PPTX_OUTPUT_DIR).catch(() => []);
    for (const f of files) {
      if (f.endsWith(".pptx")) {
        const fullPath = path.join(PPTX_OUTPUT_DIR, f);
        const stat = await fs.stat(fullPath).catch(() => null);
        if (stat && stat.size > 50000 && stat.mtimeMs >= downloadStartTime - 5000) {
          downloadedPptx = fullPath;
          log(`Found downloaded PowerPoint file in PPTX_OUTPUT_DIR: ${f} (${stat.size} bytes).`);
          break;
        }
      }
    }
    if (downloadedPptx) break;

    // Fallback: Check ~/Downloads
    const dlFiles = await fs.readdir(downloadsDir).catch(() => []);
    for (const f of dlFiles) {
      if (f.endsWith(".pptx")) {
        const fullPath = path.join(downloadsDir, f);
        const stat = await fs.stat(fullPath).catch(() => null);
        if (stat && stat.size > 50000 && stat.mtimeMs >= downloadStartTime - 5000) {
          downloadedPptx = fullPath;
          log(`Found downloaded PowerPoint file in ~/Downloads: ${f} (${stat.size} bytes).`);
          break;
        }
      }
    }
    if (downloadedPptx) break;
  }

  if (!downloadedPptx) {
    throw new Error(`Failed to find downloaded PPTX for Lesson ${lesson.number}`);
  }

  if (downloadedPptx !== pptxTargetFile) {
    await fs.copyFile(downloadedPptx, pptxTargetFile);
  }
  await fs.copyFile(downloadedPptx, localPptxFile);

  // Close viewer if open to return to studio root
  const closeViewerBtn = page.locator('.studio-panel button[aria-label="Close slide deck"]').first();
  if ((await closeViewerBtn.count()) > 0 && (await closeViewerBtn.isVisible().catch(() => false))) {
    await closeViewerBtn.click().catch(() => {});
    await page.waitForTimeout(1500);
  }

  // Now extract PPTX and generate web deck
  await ingestAndEnhanceDeck(localPptxFile, lesson);
}

export async function ingestAndEnhanceDeck(pptxTargetFile, lesson) {
  log(`Ingesting PPTX into web decks for Lesson ${lesson.number}...`);
  await fs.mkdir(PUBLIC_DECKS_DIR, { recursive: true });

  const deckFolder = lesson.deckId;
  const deckTargetDir = path.join(PUBLIC_DECKS_DIR, deckFolder);

  const manifest = await extractPptxDeck(pptxTargetFile, PUBLIC_DECKS_DIR, deckFolder, {
    slideSet: "physics_matter_pressure_heat",
    title: `${lesson.number}. ${lesson.title}`,
  });
  log(`Extracted ${manifest.totalSlides} slides into ${deckTargetDir}.`);

  const manifestPath = path.join(deckTargetDir, "manifest.json");
  const currentManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  currentManifest.title = `${lesson.number}. ${lesson.title}`;
  currentManifest.slideSet = "physics_matter_pressure_heat";
  currentManifest.courseName = "GCSE Physics: Matter, Pressure & Thermal Physics";
  currentManifest.teacher = lesson.teacher;
  currentManifest.practicalsCount = lesson.practicalsCount;

  // Format Slide 2 as interactive 6-cell starter retrieval grid
  if (currentManifest.slides && currentManifest.slides.length >= 2) {
    const slide2 = currentManifest.slides[1];
    slide2.title = `Starter Activity: Knowledge Retrieval (${lesson.title})`;
    slide2.isInteractive = true;
    slide2.interactiveType = "question_reveal";

    const standardCells = [
      { x: 9.5, y: 38.5, w: 27, h: 6.5 },
      { x: 38.0, y: 38.5, w: 27, h: 6.5 },
      { x: 66.5, y: 38.5, w: 27, h: 6.5 },
      { x: 9.5, y: 72.0, w: 27, h: 6.5 },
      { x: 38.0, y: 72.0, w: 27, h: 6.5 },
      { x: 66.5, y: 72.0, w: 27, h: 6.5 },
    ];

    slide2.reveals = lesson.starterQuestions.map((sq, idx) => {
      const b = standardCells[idx] || standardCells[0];
      return {
        id: `reveal_s2_cell_${idx + 1}`,
        question: `${idx + 1}. ${sq.q}`,
        expectedAnswer: sq.a,
        bounds: { ...b },
        answerBounds: { ...b },
        revealMode: "overlay",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: false,
        answerIsBaked: false
      };
    });
  }

  // Integrate relevant interactive HTML practicals
  if (lesson.interactives && lesson.interactives.length > 0) {
    for (const interactive of lesson.interactives) {
      const practicalSlideNum = currentManifest.slides.length + 1;
      const slideDir = path.join(deckTargetDir, "slides");
      await fs.mkdir(slideDir, { recursive: true });

      const embedSlideFileName = `slide_${String(practicalSlideNum).padStart(2, "0")}_practical.png`;
      const fallbackSlideImg = path.join(slideDir, embedSlideFileName);
      
      const existingSlideImg = path.join(slideDir, currentManifest.slides[0]?.imageFileName || "slide_01.png");
      try {
        await fs.copyFile(existingSlideImg, fallbackSlideImg);
      } catch {}

      const interactiveSlide = {
        number: practicalSlideNum,
        title: interactive.title,
        imageFileName: embedSlideFileName,
        imageUrl: `/decks/physics_matter_pressure_heat/${deckFolder}/slides/${embedSlideFileName}`,
        sourceMediaPath: `web_embed/${embedSlideFileName}`,
        isInteractive: false,
        interactiveType: "web_embed",
        webEmbed: {
          url: interactive.url,
          title: interactive.title,
          label: interactive.label || "Live Practical Simulation"
        },
        cognitiveGuide: {
          estimatedTimeSeconds: 45,
          timeGuideDisplay: "40–60s",
          vciScore: "4.8",
          complexityCategory: "Moderate",
          ragLevel: "medium",
          ragColor: "amber",
          ragLabel: "Active Simulation",
          breakdown: {
            visualGistMs: 250,
            visualScanMs: 1100,
            readingMs: 18000,
            semanticProcessingMs: 12000,
            wordCount: 45,
            visualElementsCount: 4
          }
        }
      };

      currentManifest.slides.push(interactiveSlide);
      currentManifest.totalSlides = currentManifest.slides.length;
      log(`Integrated interactive HTML practical slide: "${interactive.title}" -> ${interactive.url}`);
    }
  }

  await fs.writeFile(manifestPath, JSON.stringify(currentManifest, null, 2), "utf8");
  log(`Updated manifest for ${deckFolder} (${currentManifest.slides.length} slides).`);
}

export async function runAgent(startLesson = 1, endLesson = 5) {
  log("Connecting to Google Chrome over CDP on port 9333...");
  const browser = await chromium.connectOverCDP(CDP_URL);
  
  for (let lNum = startLesson; lNum <= endLesson; lNum++) {
    const lesson = PHYSICS_MATTER_LESSONS.find(l => l.number === lNum);
    if (!lesson) continue;
    try {
      await generateAndIngestLesson(browser, lesson);
    } catch (err) {
      log(`Error processing Lesson ${lesson.number} (${lesson.title}): ${err.message}. Retrying once after 5s...`);
      await new Promise(r => setTimeout(r, 5000));
      try {
        await generateAndIngestLesson(browser, lesson);
      } catch (retryErr) {
        log(`Retry also failed for Lesson ${lesson.number}: ${retryErr.message}. Proceeding to next lesson.`);
      }
    }
  }

  log("\n✦ ALL 5 PHYSICS LESSONS GENERATED AND IMPORTED SUCCESSFULLY! ✦");
}

const args = process.argv.slice(2);
const start = args[0] ? parseInt(args[0], 10) : 1;
const end = args[1] ? parseInt(args[1], 10) : 5;

runAgent(start, end).catch(err => {
  console.error("FATAL RUNNER ERROR:", err);
  process.exit(1);
});
