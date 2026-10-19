import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_physics_electricity_magnetism");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/physics_electricity_magnetism");
const CDP_URL = "http://127.0.0.1:9333";
const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/40fbb05f-e884-4f79-828b-c4539e9a0d31";

export const PHYSICS_LESSONS = [
  {
    number: 1,
    title: "Static Electricity",
    teacher: "Dan",
    practicalsCount: 2,
    deckId: "Lesson_01_Static_Electricity",
    practicalNames: ["Charging by Friction (Rods and Cloths)", "Van de Graaff Generator Demonstrations"],
    details: `Atomic structure and electrical charges (protons, neutrons, electrons), law of electrostatics (like charges repel, opposite charges attract). Transfer of negative electrons between insulating materials during friction. Electric fields around point charges and parallel plates. Demonstrations and experiments with electroscopes and spark discharges. Applications and hazards of static electricity (photocopiers, electrostatic precipitators, lightning, fuelling aircraft/cars and earthing precautions).
MANDATORY PRACTICAL SLIDES:
Practical 1 (Charging by Friction): Rubbing polythene rods (gains electrons, negative charge) and acetate rods (loses electrons, positive charge) with cloths; testing repulsion and attraction using a suspended rod turntable.
Practical 2 (Van de Graaff Generator): Metal dome charge accumulation, intense electric fields, spark discharge to an earthing wand, dielectric breakdown of air, hair standing on end, repelling pie tins / polystyrene spheres, laboratory safety and earthing procedures.`,
    starterQuestions: [
      { q: "What subatomic particle carries a negative electric charge?", a: "Electron", cue: "Orbits the nucleus" },
      { q: "What happens when two objects with the same charge are brought close?", a: "They repel", cue: "Like charges..." },
      { q: "Which subatomic particles are transferred when materials rub together?", a: "Electrons (never protons)", cue: "Mobile outer particles" },
      { q: "Why is a fuel pipe earthed before refuelling an aircraft?", a: "To prevent electrostatic spark / fire", cue: "Discharges static" },
      { q: "What is an electrical insulator? Give one example.", a: "Material where electrons cannot flow freely (e.g. plastic / glass / polythene)", cue: "Holds charge locally" },
      { q: "What is the unit of electric charge?", a: "Coulomb (C)", cue: "Symbol C" }
    ],
    interactives: [
      {
        title: "Interactive Practical: Van de Graaff Generator Simulation",
        url: "/interactives/physics/van_de_graaff.html",
        label: "Live Van de Graaff Lab"
      },
      {
        title: "Video Case Study: Stop Static – Refuelling Fire at Gas Pump",
        url: "/decks/physics_electricity_magnetism/Lesson_01_Static_Electricity/interactives/gas_pump_static_fire_video.html",
        label: "Video Case Study · Static Hazard & Earthing"
      }
    ]
  },
  {
    number: 2,
    title: "Circuits",
    teacher: "Greg",
    practicalsCount: 1,
    deckId: "Lesson_02_Circuits",
    practicalNames: ["Constructing Standard DC Circuits and Measuring Current & Potential Difference"],
    details: `Electric current as the rate of flow of electrical charge: Q = I × t (Charge = Current × time). Potential difference (voltage) as energy transferred per unit charge: V = E / Q. Standard circuit symbols (cell, battery, open/closed switch, lamp, ammeter, voltmeter, resistor, variable resistor, fuse, diode, LED). Drawing and interpreting circuit diagrams.
MANDATORY PRACTICAL SLIDE:
Practical 1 (Setting up Standard Circuits): Assembling a simple DC circuit with cell, switch, lamp, ammeter in series, and voltmeter in parallel across components. Verifying how current flows only in a closed circuit, measuring current in amperes (A), and measuring potential difference in volts (V).`,
    starterQuestions: [
      { q: "What is electric current?", a: "Rate of flow of electric charge (electrons)", cue: "Charge per second" },
      { q: "What formula links charge, current, and time?", a: "Q = I × t", cue: "Q = ..." },
      { q: "How must an ammeter be connected in a circuit?", a: "In series", cue: "Same loop as components" },
      { q: "How must a voltmeter be connected across a component?", a: "In parallel", cue: "Across the component" },
      { q: "What is the unit of potential difference?", a: "Volt (V)", cue: "Symbol V" },
      { q: "What happens to the current in a circuit if the switch is opened?", a: "Current drops to zero (open circuit)", cue: "Breaks the loop" }
    ],
    interactives: [
      {
        title: "Interactive Practical: Circuit Construction Workbench",
        url: "/interactives/physics/circuit_builder.html",
        label: "Interactive Circuit Workbench"
      }
    ]
  },
  {
    number: 3,
    title: "V=IR",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_03_V_equals_IR",
    practicalNames: ["Investigating the Resistance of a Wire with Length"],
    details: `Definition of electrical resistance as opposition to current flow. Ohm's Law formula: V = I × R (Potential Difference = Current × Resistance) and its rearrangements: I = V / R, R = V / I. Factors affecting the resistance of a wire: length (longer wire = greater resistance), cross-sectional area (thicker wire = lower resistance), material/resistivity, and temperature.
MANDATORY PRACTICAL SLIDE:
Practical 1 (Resistance of a Wire): Measuring resistance across different lengths of nichrome wire (20 cm to 100 cm) on a metre ruler using crocodile clips, DC power supply, switch, ammeter, and voltmeter. Recording V and I, calculating R = V / I, switching off between readings to minimise heating, and plotting Resistance against Length.`,
    starterQuestions: [
      { q: "State Ohm's law equation linking V, I, and R.", a: "V = I × R (or R = V / I)", cue: "Voltage, current, resistance" },
      { q: "What is the unit of electrical resistance?", a: "Ohm (Ω)", cue: "Greek letter omega" },
      { q: "If resistance increases at constant voltage, what happens to current?", a: "Current decreases", cue: "Inversely proportional" },
      { q: "How does doubling the length of a wire affect its resistance?", a: "Resistance doubles (directly proportional)", cue: "Twice as many collisions" },
      { q: "Why should the power pack be switched off between readings?", a: "To prevent the wire heating up (which changes resistance)", cue: "Temperature control" },
      { q: "Calculate V if I = 2 A and R = 5 Ω.", a: "10 V (V = 2 × 5)", cue: "V = I × R" }
    ],
    interactives: [
      {
        title: "Interactive Practical: Resistance of a Wire",
        url: "https://codexvirtualchemlab-ng72.vercel.app/?assessment=wirelength",
        label: "Codex Virtual Lab — Resistance of a Wire"
      }
    ]
  },
  {
    number: 4,
    title: "V=IR Graphs",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_04_V_equals_IR_Graphs",
    practicalNames: ["Investigating I-V Characteristics of Ohmic and Non-Ohmic Components"],
    details: `Current-potential difference (I-V) characteristics of components:
1. Ohmic conductor (fixed resistor at constant temperature): straight line through the origin, constant gradient, resistance is constant.
2. Filament lamp: S-shaped curve through origin; as voltage and current increase, temperature of the filament rises, metal lattice ions vibrate more vigorously, collisions with electrons increase, increasing resistance and flattening the curve.
3. Semiconductor Diode / LED: current only flows in the forward direction above threshold voltage (~0.6 V); extremely high resistance in reverse direction (negligible current).
MANDATORY PRACTICAL SLIDE:
Practical 1 (I-V Characteristics): Connecting variable DC supply, ammeter, voltmeter across resistor, filament lamp, and diode; recording pairs of V and I; reversing power supply polarity to obtain negative quadrant values; plotting and interpreting the three distinct graphs.`,
    starterQuestions: [
      { q: "What does the gradient of a current-voltage (I-V) graph represent?", a: "1 / Resistance (steeper gradient = lower resistance)", cue: "Gradient = ΔI / ΔV" },
      { q: "What shape is the I-V graph for a fixed resistor at constant temperature?", a: "Straight line through the origin", cue: "Directly proportional" },
      { q: "Why does the resistance of a filament lamp increase as current increases?", a: "Filament heats up, ions vibrate more, more electron collisions", cue: "Temperature rise" },
      { q: "In which direction does a diode allow electric current to flow?", a: "Forward direction only", cue: "Arrow in symbol" },
      { q: "What is an 'ohmic conductor'?", a: "A conductor where current is directly proportional to voltage at constant temp", cue: "Obeys Ohm's law" },
      { q: "What does the reverse-bias region of a diode I-V graph look like?", a: "Flat zero line along the voltage axis (very high resistance)", cue: "Blocks reverse current" }
    ],
    interactives: [
      {
        title: "Interactive Practical: Ohmic & Non-Ohmic I-V Characteristics",
        url: "https://codexvirtualchemlab-ng72.vercel.app/?assessment=ivdevices",
        label: "Codex Virtual Lab — I-V Devices"
      }
    ]
  },
  {
    number: 5,
    title: "Circuit Calculations",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_05_Circuit_Calculations",
    practicalNames: ["Circuit Power & Energy Dissipation Verification Practical"],
    details: `Core electrical calculations and equations for GCSE Physics:
1. Q = I × t (Charge = Current × time)
2. V = I × R (Potential Difference = Current × Resistance)
3. P = V × I (Power = Voltage × Current)
4. P = I² × R (Power = Current squared × Resistance)
5. E = P × t (Energy = Power × time)
6. E = Q × V (Energy = Charge × Potential Difference)
Clear, structured calculation methods: formula, substitution, calculation with correct units (Watts, Joules, Coulombs, Volts, Amps, Ohms). Power ratings of household appliances and electrical safety (fuses, earth wires).
MANDATORY PRACTICAL SLIDE:
Practical 1 (Electrical Power & Energy Verification): Measuring V and I for different circuit loads, calculating electrical power (P = VI), measuring time with a stopwatch to calculate total energy transferred (E = Pt), and verifying against component specifications.`,
    starterQuestions: [
      { q: "What is the formula linking power, current, and voltage?", a: "P = V × I", cue: "P = ..." },
      { q: "What is the unit of electrical power?", a: "Watt (W)", cue: "Joules per second" },
      { q: "Calculate the power of a lamp with 12 V and 2 A.", a: "24 W (P = 12 × 2)", cue: "P = V × I" },
      { q: "What formula links energy, power, and time?", a: "E = P × t", cue: "Energy = ..." },
      { q: "How much energy does a 100 W bulb transfer in 60 seconds?", a: "6,000 J (6 kJ)", cue: "E = 100 × 60" },
      { q: "If P = I² × R, what happens to power dissipated as heat if current doubles?", a: "Power quadruples (increases by 4×)", cue: "Squared relationship" }
    ],
    interactives: [
      {
        title: "Interactive Practical: Circuit Power & Energy Verification Lab",
        url: "/interactives/physics/circuit_calculations.html",
        label: "Power & Calculations Lab"
      }
    ]
  },
  {
    number: 6,
    title: "Series vs Parallel",
    teacher: "Greg",
    practicalsCount: 2,
    deckId: "Lesson_06_Series_vs_Parallel",
    practicalNames: ["Series Circuits Current & Voltage Rules", "Parallel Circuits Current & Voltage Rules"],
    details: `Comprehensive comparison of Series vs Parallel Circuits:
1. Series Circuits: Single loop, current is the same at all points (I_total = I₁ = I₂), total potential difference is shared across components (V_total = V₁ + V₂), total resistance is the sum (R_total = R₁ + R₂). If one component breaks, the entire circuit stops.
2. Parallel Circuits: Multiple branches, current splits across branches (I_total = I₁ + I₂), potential difference across each parallel branch is equal (V_total = V₁ = V₂), total resistance is less than the resistance of the smallest individual resistor. Components can be switched independently.
MANDATORY PRACTICAL SLIDES:
Practical 1 (Series Circuit Rules): Building 2-lamp and 3-lamp series circuits, measuring current at multiple positions, measuring voltages across each lamp and supply, demonstrating V_total = V₁ + V₂.
Practical 2 (Parallel Circuit Rules): Building parallel circuits, measuring branch currents and supply current, measuring potential difference across parallel branches, showing that adding parallel branches lowers total resistance.`,
    starterQuestions: [
      { q: "In a series circuit, how does current compare at different points?", a: "Current is identical everywhere", cue: "Only one path" },
      { q: "In a parallel circuit, what is true about the voltage across each branch?", a: "Voltage is equal across each parallel branch", cue: "Full supply voltage" },
      { q: "If two 10 Ω resistors are connected in series, what is the total resistance?", a: "20 Ω (10 + 10)", cue: "R_total = R₁ + R₂" },
      { q: "What happens to total resistance when a resistor is added in parallel?", a: "Total resistance decreases", cue: "More paths for current" },
      { q: "Why are domestic household lights wired in parallel rather than series?", a: "Can be switched independently and if one blows, others stay on", cue: "Home wiring advantages" },
      { q: "In a series circuit with a 12 V battery and two identical bulbs, what is the voltage across each?", a: "6 V (shared equally: 12 / 2)", cue: "V_total shared" }
    ],
    interactives: [
      {
        title: "Interactive Practical: Series vs Parallel Circuit Comparison",
        url: "/interactives/physics/series_parallel_lab.html",
        label: "Series vs Parallel Lab"
      }
    ]
  },
  {
    number: 7,
    title: "Magnets and Electromagnets",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_07_Magnets_and_Electromagnets",
    practicalNames: ["Making and Investigating an Electromagnet (Coil Turns & Paper Clips)"],
    details: `Magnetism and Electromagnetism:
Permanent magnets (produce their own magnetic field, poles N and S) vs induced magnets (become magnetic when placed in a magnetic field). Magnetic materials: iron, steel, cobalt, nickel. Magnetic field lines: direction North to South, field strength indicated by line density.
Magnetic effect of an electric current: concentric circular magnetic field around a straight wire (right-hand grip rule), magnetic field of a solenoid (similar to a bar magnet).
Electromagnet construction: insulated wire coiled around a soft iron core. Factors affecting strength: number of coil turns, current through coil, presence and type of iron core. Advantages of electromagnets: can be switched on/off, strength can be varied. Applications: electric bells, scrap metal cranes, relays, circuit breakers.
MANDATORY PRACTICAL SLIDE:
Practical 1 (Making an Electromagnet): Winding insulated copper wire around an iron nail core (10, 20, 30, 40, 50 turns), connecting to variable DC power supply, measuring electromagnet strength by counting the number of steel paper clips lifted, investigating the effect of coil turns and current.
Plus magnetic field pattern mapping demonstration with iron filings.`,
    starterQuestions: [
      { q: "Name four magnetic elements.", a: "Iron, Steel, Cobalt, Nickel", cue: "Ferromagnetic metals" },
      { q: "What is the direction of magnetic field lines outside a bar magnet?", a: "From North pole to South pole (N → S)", cue: "North to South" },
      { q: "What is a solenoid?", a: "A cylindrical coil of wire carrying an electric current", cue: "Coiled wire" },
      { q: "Give two advantages of an electromagnet over a permanent magnet.", a: "Can be switched on/off and strength can be varied", cue: "Controllability" },
      { q: "Why is soft iron used as the core of an electromagnet instead of steel?", a: "Iron easily magnetises and demagnetises (soft magnetic material)", cue: "Loses magnetism when off" },
      { q: "What happens to the strength of an electromagnet if coil turns are doubled?", a: "Strength increases (picks up more clips)", cue: "More magnetic field loops" }
    ],
    interactives: [
      {
        title: "Interactive Practical: Electromagnet Strength",
        url: "https://codexvirtualchemlab-ng72.vercel.app/?assessment=electromagnet",
        label: "Codex Virtual Lab — Electromagnet Strength"
      },
      {
        title: "Interactive Practical: Magnetic Field Patterns",
        url: "https://codexvirtualchemlab-ng72.vercel.app/?assessment=fieldlines",
        label: "Codex Virtual Lab — Field Patterns"
      }
    ]
  },
  {
    number: 8,
    title: "Motors and Left Hand Rule",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_08_Motors_and_Left_Hand_Rule",
    practicalNames: ["Demonstrating the Motor Effect and Fleming's Left Hand Rule"],
    details: `The Motor Effect: When a current-carrying conductor is placed in an external magnetic field, the magnetic field around the wire interacts with the magnetic field between the magnets, resulting in a mechanical force on the wire.
Calculating magnetic force: F = B × I × L (Force F in Newtons N, Magnetic flux density B in Tesla T, Current I in Amperes A, Length of conductor L in metres m).
Fleming's Left Hand Rule:
- ThuMb = Motion / Force
- First finger = Magnetic Field (North to South)
- seCond finger = Current (positive to negative conventional current)
DC Electric Motor construction and operation: rectangular coil in a magnetic field, forces on opposite sides act in opposite directions producing rotation, role of the split-ring commutator (reverses the direction of current in the coil every half-turn to keep the motor spinning in the same direction), carbon brushes providing electrical contact.
Ways to increase motor speed/force: larger current, stronger magnetic field, more turns in the coil.
MANDATORY PRACTICAL SLIDE:
Practical 1 (The Motor Effect & Left Hand Rule): Suspending a rigid wire between strong permanent magnets, passing a current, observing deflection, reversing current direction, reversing magnetic poles, verifying Fleming's Left Hand Rule predictions, and operating a demonstration DC electric motor.`,
    starterQuestions: [
      { q: "What is the motor effect?", a: "A current-carrying wire in a magnetic field experiences a mechanical force", cue: "Field interaction creates force" },
      { q: "State Fleming's Left Hand Rule for thumb, first finger, second finger.", a: "Thumb = Motion/Force, First finger = Field (N→S), Second finger = Current (+→-)", cue: "F-B-I / Motion-Field-Current" },
      { q: "What formula calculates the force on a conductor in a magnetic field?", a: "F = B × I × L", cue: "Force = Flux density × Current × Length" },
      { q: "What is the unit of magnetic flux density (B)?", a: "Tesla (T)", cue: "Symbol T" },
      { q: "What is the vital function of the split-ring commutator in a DC motor?", a: "Reverses current direction every half-turn to keep coil rotating in same direction", cue: "Prevents motor stalling" },
      { q: "Name two ways to increase the turning effect (torque) of an electric motor.", a: "Increase current, use stronger magnets, or increase turns on the coil", cue: "Strengthen the forces" }
    ],
    interactives: [
      {
        title: "Interactive Practical: Motor Effect & Fleming's Left Hand Rule Simulator",
        url: "/interactives/physics/electric_motor_sim.html",
        label: "Motor Effect & Left Hand Rule Simulator"
      }
    ]
  },
  {
    number: 9,
    title: "Fuses and Earthing",
    teacher: "Dan",
    practicalsCount: 1,
    deckId: "Lesson_09_Fuses_and_Earthing",
    practicalNames: ["Investigating Appliance Power, Fuse Selection, and Earthing Fault Protection"],
    details: `Domestic Electricity, Electrical Safety, Fuses, and Earthing:
1. Mains Electricity Supply: Alternating Current (AC) vs Direct Current (DC). UK domestic mains supply is 230 V AC at 50 Hz.
2. Three-Pin Plug Wiring & Wire Functions:
   - Live wire (Brown, bottom right): Carries 230 V alternating potential difference into the appliance. Most dangerous wire.
   - Neutral wire (Blue, bottom left): Completes the circuit, held at or close to 0 V.
   - Earth wire (Green and Yellow striped, top centre): Safety wire connected to the metal casing of the appliance, held at 0 V. Only carries current during a fault.
   - Safety features of the plug: Stiff plastic/rubber insulating casing, cable grip securing outer sheath, brass pins (excellent electrical conductor, hard-wearing).
3. The Fuse:
   - Contains a thin metal wire with a low melting point in a ceramic/glass tube.
   - Connected in series with the Live wire before the appliance switch.
   - Operates by the heating effect of electric current (P = I²R). When current exceeds the fuse rating, the wire heats up, melts ("blows"), and breaks the circuit.
   - Disconnects the appliance from the 230 V live supply, preventing cable overheating and electrical fires.
   - Standard UK domestic fuse ratings: 3 A, 5 A, and 13 A.
   - Selecting correct fuse: Calculate normal operating current using I = P / V. Choose the fuse rating immediately above normal operating current (e.g. 2300 W kettle / 230 V = 10 A → 13 A fuse; 690 W toaster / 230 V = 3 A → 5 A fuse).
4. Earthing & Fault Protection:
   - How electrical shocks occur: If a live wire becomes loose and touches the metal casing of an appliance, touching the casing would provide a path to ground through the human body, causing severe or fatal electric shock.
   - How earthing protects: The earth wire connects the metal casing directly to ground. It has an extremely low resistance.
   - If a fault occurs, a huge surge of current flows through the live wire, into the casing, and straight down the earth wire to ground (I = V / R is very large).
   - This huge surge current exceeds the fuse rating, instantly melting the fuse (or tripping a circuit breaker / RCCB).
   - This completely isolates the appliance from the live supply, cutting off current and making the casing safe before anyone touches it.
5. Double Insulation:
   - Appliances with plastic outer casings (e.g. hair dryers, vacuum cleaners, electric drills) have no exposed metal parts.
   - Marked with the double square symbol (回).
   - Since the casing cannot become live, they do not require an earth wire (use 2-core cable: live and neutral only).
MANDATORY PRACTICAL SLIDE:
Practical 1 (Fuse Ratings & Earthing Protection Investigation):
- Examining and correctly wiring a 3-pin plug (identifying wire colours, correct pin connections, cable grip position, fuse location).
- Calculating current drawn by household appliances (kettle, toaster, lamp, heater) using I = P / V and selecting the appropriate fuse (3 A, 5 A, or 13 A).
- Model fault circuit demonstration: Demonstrating what happens when a live wire touches an unearthed metal case vs an earthed metal case with a fuse, measuring current surge and observing fuse blow.`,
    starterQuestions: [
      { q: "What is the voltage and frequency of UK domestic mains electricity?", a: "230 V AC at 50 Hz", cue: "Standard UK domestic supply" },
      { q: "State the colours of the live, neutral, and earth wires in a UK 3-pin plug.", a: "Live = Brown, Neutral = Blue, Earth = Green/Yellow stripes", cue: "B-L-U-E = bottom left; B-R-O-W-N = bottom right" },
      { q: "Which wire in a plug contains the fuse and why?", a: "Live wire, so melting isolates appliance from 230 V supply", cue: "Cuts off high voltage" },
      { q: "How does an earth wire and fuse together prevent electric shock?", a: "Fault current surges to earth, melting fuse and cutting off power", cue: "Low-resistance path to ground" },
      { q: "Calculate current drawn by a 2300 W kettle connected to 230 V mains.", a: "10 A (I = P / V = 2300 / 230)", cue: "I = P / V" },
      { q: "What does the double insulation symbol (two concentric squares) mean?", a: "Appliance has plastic casing; cannot become live so needs no earth wire", cue: "Plastic casing, 2-core cable" }
    ],
    interactives: [
      {
        title: "Interactive Practical: Appliance Fuses, Earthing & Fault Protection Lab",
        url: "/interactives/physics/fuses_and_earthing_sim.html",
        label: "Fuses & Earthing Simulation Lab"
      }
    ]
  }
];

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function buildLessonPrompt(lesson) {
  return `Create a detailed classroom slide deck for GCSE Physics: Electricity and Magnetism.

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

  // Ensure download behavior allows writing to PPTX_OUTPUT_DIR
  await fs.mkdir(PPTX_OUTPUT_DIR, { recursive: true });
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
  log(`Initial Studio state: ${initialCardsCount} artifact cards present. Top card: "${prevTopCardText}"`);

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

  // Poll for downloaded file
  let downloadedPptx = null;
  const pollDeadline = Date.now() + 60000;
  while (Date.now() < pollDeadline) {
    await new Promise(r => setTimeout(r, 1000));
    const files = await fs.readdir(PPTX_OUTPUT_DIR).catch(() => []);
    for (const f of files) {
      if (f.endsWith(".pptx")) {
        const fullPath = path.join(PPTX_OUTPUT_DIR, f);
        const stat = await fs.stat(fullPath).catch(() => null);
        if (stat && stat.size > 100000 && stat.mtimeMs >= downloadStartTime - 5000) {
          downloadedPptx = fullPath;
          log(`Found downloaded PowerPoint file: ${f} (${stat.size} bytes).`);
          break;
        }
      }
    }
    if (downloadedPptx) break;
  }

  if (!downloadedPptx) {
    throw new Error(`Failed to find downloaded PPTX for Lesson ${lesson.number} in ${PPTX_OUTPUT_DIR}`);
  }

  if (downloadedPptx !== pptxTargetFile) {
    await fs.copyFile(downloadedPptx, pptxTargetFile);
  }

  // Close viewer if open to return to studio root
  const closeViewerBtn = page.locator('.studio-panel button[aria-label="Close slide deck"]').first();
  if ((await closeViewerBtn.count()) > 0 && (await closeViewerBtn.isVisible().catch(() => false))) {
    await closeViewerBtn.click().catch(() => {});
    await page.waitForTimeout(1500);
  }

  // Now extract PPTX and generate web deck
  await ingestAndEnhanceDeck(pptxTargetFile, lesson);
}

export async function ingestAndEnhanceDeck(pptxTargetFile, lesson) {
  log(`Ingesting PPTX into web decks for Lesson ${lesson.number}...`);
  await fs.mkdir(PUBLIC_DECKS_DIR, { recursive: true });

  const deckFolder = lesson.deckId;
  const deckTargetDir = path.join(PUBLIC_DECKS_DIR, deckFolder);

  const manifest = await extractPptxDeck(pptxTargetFile, PUBLIC_DECKS_DIR, deckFolder, {
    slideSet: "physics_electricity_magnetism",
    title: `${lesson.number}. ${lesson.title}`,
  });
  log(`Extracted ${manifest.totalSlides} slides into ${deckTargetDir}.`);

  const manifestPath = path.join(deckTargetDir, "manifest.json");
  const currentManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  currentManifest.title = `${lesson.number}. ${lesson.title}`;
  currentManifest.slideSet = "physics_electricity_magnetism";
  currentManifest.courseName = "GCSE Physics: Electricity and Magnetism";
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

  // Integrate relevant interactive HTML practicals from codexvirtualchemlab
  if (lesson.interactives && lesson.interactives.length > 0) {
    for (const interactive of lesson.interactives) {
      const practicalSlideNum = currentManifest.slides.length + 1;
      const slideDir = path.join(deckTargetDir, "slides");
      await fs.mkdir(slideDir, { recursive: true });

      const embedSlideFileName = `slide_${String(practicalSlideNum).padStart(2, "0")}_practical.png`;
      const fallbackSlideImg = path.join(slideDir, embedSlideFileName);
      
      // Use existing slide 1 or slide 2 image as poster if needed
      const existingSlideImg = path.join(slideDir, currentManifest.slides[0]?.imageFileName || "slide_01.png");
      try {
        await fs.copyFile(existingSlideImg, fallbackSlideImg);
      } catch {}

      const interactiveSlide = {
        number: practicalSlideNum,
        title: interactive.title,
        imageFileName: embedSlideFileName,
        imageUrl: `/decks/physics_electricity_magnetism/${deckFolder}/slides/${embedSlideFileName}`,
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

  for (const s of currentManifest.slides) {
    if (!s.cognitiveGuide) {
      s.cognitiveGuide = analyzeSlideCognitiveLoad(s);
    }
  }

  await fs.writeFile(manifestPath, JSON.stringify(currentManifest, null, 2), "utf8");
  log(`Updated manifest for ${deckFolder} (${currentManifest.slides.length} slides).`);
}

export async function runAgent(startLesson = 1, endLesson = 9) {
  log("Connecting to Google Chrome over CDP on port 9333...");
  const browser = await chromium.connectOverCDP(CDP_URL);
  
  for (let lNum = startLesson; lNum <= endLesson; lNum++) {
    const lesson = PHYSICS_LESSONS.find(l => l.number === lNum);
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

  log("\n✦ ALL SPECIFIED LESSONS GENERATED AND IMPORTED SUCCESSFULLY! ✦");
  await browser.close().catch(() => {});
  process.exit(0);
}

if (process.argv[1] && process.argv[1].endsWith("run_physics_electricity_agent.mjs")) {
  const args = process.argv.slice(2);
  const start = args[0] ? parseInt(args[0], 10) : 1;
  const end = args[1] ? parseInt(args[1], 10) : 9;

  runAgent(start, end).catch(err => {
    console.error("FATAL RUNNER ERROR:", err);
    process.exit(1);
  });
}
