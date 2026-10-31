import path from "node:path";

export const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/40fbb05f-e884-4f79-828b-c4539e9a0d31";
export const SLIDE_SET_ID = "chemistry_groups_metals";
export const SLIDE_SET_TITLE = "GCSE Chemistry · Groups, Reactivity & Extraction";
export const COURSE_NAME = "GCSE Combined Science / Chemistry: Periodic Table Groups, Reactivity & Metal Extraction";
export const LOCAL_OUTPUT_DIR = path.resolve("./output/powerpoints_chemistry_groups_metals");
export const PUBLIC_DECKS_DIR = path.resolve("./public/decks/chemistry_groups_metals");
export const CHECKPOINT_PATH = path.resolve("./output/powerpoints_chemistry_groups_metals/generation_checkpoint.json");

export const CHEMISTRY_GROUPS_METALS_LESSONS = [
  {
    number: 1,
    title: "Alkali Metals",
    deckId: "Lesson_01_Alkali_Metals",
    teacher: "Chemistry Faculty",
    practicalsCount: 1,
    practicalNames: ["Teacher Demonstration: Reactions of Lithium, Sodium, and Potassium with Cold Water"],
    details: `Group 1 Alkali Metals (Lithium Li, Sodium Na, Potassium K, Rubidium Rb, Caesium Cs) for GCSE Combined Science / Chemistry:
1. Position & Electronic Configuration:
   - Located in Group 1 on the far left of the Periodic Table.
   - Every Group 1 atom has exactly 1 electron in its outermost shell (e.g. Li: 2,1; Na: 2,8,1; K: 2,8,8,1).
   - In chemical reactions, Group 1 atoms lose their 1 outer electron to form stable +1 positive ions (Li⁺, Na⁺, K⁺) with a full outer shell electronic structure.
2. Unusual Physical Properties & Trends Down Group 1:
   - Soft metals (easily cut with a scalpel/knife); freshly cut surfaces are shiny silver but rapidly tarnish (oxidise) to dull grey in air.
   - Low density compared to transition metals: Li, Na, and K are less dense than water (density < 1 g/cm³), so they float on water.
   - Low melting and boiling points that DECREASE going down Group 1.
   - Good conductors of electricity and thermal energy.
3. Chemical Reactions:
   - Reaction with Water (Teacher Demo with safety screen, forceps, rice-grain piece, stored under oil):
     • Alkali Metal + Water → Metal Hydroxide + Hydrogen gas (e.g. 2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)).
     • Observations: Li fizzes steadily and floats; Na melts into a silvery ball, fizzes rapidly, darts across surface; K melts immediately, fizzes violently, ignites with a lilac flame.
     • Universal indicator turns green → purple (pH 12–14) due to strongly alkaline hydroxide ions (OH⁻) formed; hence the name "Alkali Metals".
   - Reaction with Oxygen: forms white solid metal oxides (e.g. 4Li + O₂ → 2Li₂O).
   - Reaction with Chlorine: burns vigorously in chlorine gas to form white crystalline ionic metal chloride salts (e.g. 2Na(s) + Cl₂(g) → 2NaCl(s)), dissolving in water to give colourless neutral solutions.
4. Explaining Why Reactivity INCREASES Down Group 1 (Exam 4-Mark Model Explanation):
   - Going down Group 1, atoms have more occupied electron shells, so atomic radius increases (outer electron is further from the positive nucleus).
   - Inner electron shells shield (screen) the outer electron from nuclear charge.
   - Electrostatic attraction between the positively charged nucleus and the outer-shell electron becomes weaker.
   - Less energy is needed to lose the single outer electron, so reactivity increases dramatically down the group (predicting violent explosions for Rb and Cs).`,
    starterQuestions: [
      { q: "How many electrons do all Group 1 elements have in their outer shell?", a: "1 outer-shell electron", cue: "Group number = outer e⁻" },
      { q: "What charge ion does a sodium atom (2,8,1) form when it reacts?", a: "+1 ion (Na⁺) by losing 1 outer electron", cue: "Loses 1 electron" },
      { q: "Why are lithium, sodium, and potassium stored under oil in the lab?", a: "To prevent them reacting with oxygen and water vapour in the air", cue: "Air & moisture barrier" },
      { q: "Name the two products formed when potassium reacts with cold water.", a: "Potassium hydroxide (KOH) and hydrogen gas (H₂)", cue: "Alkali + Gas" },
      { q: "What colour does universal indicator turn after sodium reacts with water, and why?", a: "Purple (pH 13–14) because alkaline sodium hydroxide (OH⁻ ions) is formed", cue: "Strong alkali" },
      { q: "Why is potassium more reactive than lithium?", a: "Outer electron is further from nucleus with more shielding, so weaker attraction and easier to lose", cue: "Distance & shielding" }
    ]
  },
  {
    number: 2,
    title: "Halogens",
    deckId: "Lesson_02_Halogens",
    teacher: "Chemistry Faculty",
    practicalsCount: 1,
    practicalNames: ["Observing Physical States & Properties of Group 7 Halogens (Fume Cupboard)"],
    details: `Group 7 Halogens (Fluorine F₂, Chlorine Cl₂, Bromine Br₂, Iodine I₂, Astatine At₂) for GCSE Combined Science / Chemistry:
1. Molecular Structure & Electronic Configuration:
   - Group 7 non-metals with 7 electrons in their outermost shell (e.g. F: 2,7; Cl: 2,8,7).
   - Exist naturally as covalent diatomic molecules (F₂, Cl₂, Br₂, I₂) where two halogen atoms share one pair of electrons to achieve a full outer shell.
2. Physical Properties & Trends Down Group 7 at Room Temperature (20 °C):
   - Fluorine (F₂): pale yellow gas (extremely reactive and toxic).
   - Chlorine (Cl₂): pale green toxic gas; chemical test = turns damp blue litmus paper red then bleaches it white.
   - Bromine (Br₂): dense red-brown volatile liquid producing orange-brown toxic vapour.
   - Iodine (I₂): dark grey lustrous crystalline solid that sublimes on gentle heating into a vivid purple vapour.
   - Trend down Group 7: colour becomes darker, density increases, and melting & boiling points INCREASE (gas → liquid → solid) because relative molecular mass increases, creating stronger intermolecular forces that require more thermal energy to overcome.
   - Predict Astatine (At₂) at the bottom of Group 7: black solid at room temperature, highest boiling point and lowest reactivity among common halogens.
3. Chemical Bonding & Reactions of Halogens:
   - Reactions with Non-Metals (e.g. Hydrogen): share 1 pair of electrons covalently to form hydrogen halides (e.g. H₂ + Cl₂ → 2HCl(g)), which dissolve in water to form acidic solutions (hydrochloric acid HCl(aq)).
   - Reactions with Metals (e.g. Group 1 or Iron wool): gain 1 electron to form -1 halide ions (F⁻ fluoride, Cl⁻ chloride, Br⁻ bromide, I⁻ iodide) in ionic metal halide salts (e.g. 2Fe + 3Cl₂ → 2FeCl₃). Notice name change from "-ine" (element) to "-ide" (ion).
4. Explaining Why Reactivity DECREASES Down Group 7 (Contrast with Group 1):
   - Halogens react by GAINING 1 electron into their outer shell.
   - Going down Group 7, atoms have more electron shells → larger atomic radius and greater inner-shell electron shielding.
   - Electrostatic attraction between the positive nucleus and an incoming electron is weaker.
   - Therefore, it becomes harder to attract and capture an extra electron, so reactivity decreases down Group 7.`,
    starterQuestions: [
      { q: "Why do halogens exist as diatomic molecules (Cl₂, Br₂, I₂)?", a: "Two atoms share one pair of electrons covalently to complete their outer shells (7 → 8)", cue: "Covalent sharing" },
      { q: "Give the physical state and colour of chlorine and bromine at room temperature.", a: "Chlorine: pale green gas; Bromine: red-brown liquid", cue: "Gas vs Liquid" },
      { q: "What happens to melting and boiling points going down Group 7, and why?", a: "They increase due to larger molecules having stronger intermolecular forces", cue: "Intermolecular forces" },
      { q: "What is the laboratory test for chlorine gas?", a: "Bleaches damp blue litmus paper (turns red first, then white)", cue: "Litmus paper" },
      { q: "What charge ion does a bromine atom form when reacting with sodium, and what is its name?", a: "-1 ion, called a bromide ion (Br⁻)", cue: "-ine to -ide" },
      { q: "Why is fluorine more reactive than iodine?", a: "Smaller atom with less shielding, so stronger nuclear attraction to gain an incoming electron", cue: "Gaining 1 electron" }
    ]
  },
  {
    number: 3,
    title: "Halogen Displacement Reactions",
    deckId: "Lesson_03_Halogen_Displacement_Reactions",
    teacher: "Chemistry Faculty",
    practicalsCount: 1,
    practicalNames: ["Microscale Spotting-Tile Practical: Halogen Displacement Reactions (Cl₂, Br₂, I₂ vs KCl, KBr, KI)"],
    details: `Halogen Displacement Reactions, Ionic Equations & Redox for GCSE Combined Science / Chemistry:
1. Core Displacement Principle:
   - Reactivity order down Group 7: Chlorine (Cl₂) > Bromine (Br₂) > Iodine (I₂).
   - A more reactive halogen will displace (push out) a less reactive halogen from an aqueous solution of its halide salt.
   - A less reactive halogen CANNOT displace a more reactive halogen ("No reaction").
2. Laboratory Practical Investigation (Spotting Tile / Test Tubes):
   - Solutions tested: Aqueous chlorine water (very pale green/almost colourless), bromine water (yellow/orange), iodine solution (brown) added drop-by-drop to colourless solutions of Potassium Chloride (KCl), Potassium Bromide (KBr), and Potassium Iodide (KI).
   - Positive Reaction 1: Chlorine + Potassium Bromide → Potassium Chloride + Bromine
     • Balanced equation: Cl₂(aq) + 2KBr(aq) → 2KCl(aq) + Br₂(aq)
     • Observation: Colourless KBr turns yellow/orange as Br₂ forms.
   - Positive Reaction 2: Chlorine + Potassium Iodide → Potassium Chloride + Iodine
     • Balanced equation: Cl₂(aq) + 2KI(aq) → 2KCl(aq) + I₂(aq)
     • Observation: Colourless KI turns dark orange-brown as I₂ forms (turns blue-black with starch).
   - Positive Reaction 3: Bromine + Potassium Iodide → Potassium Bromide + Iodine
     • Balanced equation: Br₂(aq) + 2KI(aq) → 2KBr(aq) + I₂(aq)
     • Observation: Solution darkens to brown as I₂ is displaced.
   - Negative Combinations: Br₂ + KCl → No reaction; I₂ + KCl → No reaction; I₂ + KBr → No reaction (plus no need to test Cl₂ + KCl etc.).
   - Safety: Well-ventilated room/fume cupboard, low-concentration halogen waters, eye protection, avoid inhaling halogen vapours.
3. Writing Ionic Equations (Higher Tier Mastery):
   - Potassium ions (K⁺) remain unchanged in solution on both sides — they are spectator ions.
   - Cancelling spectator ions gives crisp ionic equations:
     • Cl₂(aq) + 2Br⁻(aq) → 2Cl⁻(aq) + Br₂(aq)
     • Cl₂(aq) + 2I⁻(aq) → 2Cl⁻(aq) + I₂(aq)
     • Br₂(aq) + 2I⁻(aq) → 2Br⁻(aq) + I₂(aq)
4. Halogen Displacement as REDOX (OIL RIG — Oxidation Is Loss, Reduction Is Gain of electrons):
   - In Cl₂ + 2I⁻ → 2Cl⁻ + I₂:
     • Chlorine (Cl₂) GAINS electrons to become chloride ions: Cl₂ + 2e⁻ → 2Cl⁻ (REDUCTION; Cl₂ is the oxidising agent).
     • Iodide ions (I⁻) LOSE electrons to become iodine molecules: 2I⁻ → I₂ + 2e⁻ (OXIDATION).`,
    starterQuestions: [
      { q: "Rank chlorine, bromine, and iodine in order of decreasing reactivity.", a: "Chlorine (most reactive) > Bromine > Iodine (least reactive)", cue: "Top to bottom of Group 7" },
      { q: "What colour is aqueous potassium iodide (KI) solution before any reaction?", a: "Colourless (halide salt solutions are colourless)", cue: "Halide ion vs element" },
      { q: "Predict what happens when chlorine water is added to potassium bromide solution.", a: "Chlorine displaces bromine; solution turns yellow/orange (Br₂ formed)", cue: "Cl₂ > Br₂" },
      { q: "Does a reaction occur when iodine solution is added to sodium chloride? Explain.", a: "No reaction — iodine is less reactive than chlorine so cannot displace chloride ions", cue: "I₂ < Cl₂" },
      { q: "What does the mnemonic OIL RIG stand for in redox chemistry?", a: "Oxidation Is Loss (of electrons), Reduction Is Gain (of electrons)", cue: "Electron transfer" },
      { q: "Write the ionic equation for chlorine reacting with bromide ions.", a: "Cl₂(aq) + 2Br⁻(aq) → 2Cl⁻(aq) + Br₂(aq)", cue: "Remove spectator K⁺" }
    ]
  },
  {
    number: 4,
    title: "Noble Gases",
    deckId: "Lesson_04_Noble_Gases",
    teacher: "Chemistry Faculty",
    practicalsCount: 0,
    practicalNames: ["Data Analysis Investigation: Density, Boiling Points & Real-World Engineering Applications of Group 0"],
    details: `Group 0 Noble Gases (Helium He, Neon Ne, Argon Ar, Krypton Kr, Xenon Xe, Radon Rn) for GCSE Combined Science / Chemistry:
1. Position, Electronic Structure & Chemical Inertness:
   - Located in Group 0 on the far right of the Periodic Table.
   - All Group 0 atoms have completely FULL outer electron shells:
     • Helium (He): 2 electrons (full 1st shell — crucial exam trap: 2, NOT 8!).
     • Neon (Ne): 2,8 (8 outer electrons).
     • Argon (Ar): 2,8,8 (8 outer electrons).
   - Because their outer electron shells are already energetically stable and complete, noble gas atoms do not easily lose, gain, or share electrons.
   - Consequently, they are chemically UNREACTIVE (inert), non-flammable, and exist as MONATOMIC gases (single unbonded atoms: He, Ne, Ar — NOT diatomic!).
2. Physical Properties & Trends Down Group 0:
   - All are colourless, odourless gases at room temperature with very low melting and boiling points.
   - Boiling Point Trend: Boiling points INCREASE going down Group 0 (He: -269 °C → Ne: -246 °C → Ar: -186 °C → Kr: -153 °C → Xe: -108 °C → Rn: -62 °C).
   - Explanation: Going down Group 0, relative atomic mass and total number of electrons increase, producing stronger intermolecular (van der Waals) forces between atoms that require more thermal energy to overcome.
   - Density Trend: Gas density INCREASES down Group 0 (He: 0.18 g/dm³ floats rapidly in air; Ar: 1.78 g/dm³ and Xe: 5.89 g/dm³ are denser than air at ~1.2 g/dm³ and sink).
3. Predicting Properties from Data Tables (Exam Skill):
   - Interpolating/extrapolating boiling points and densities of unfamiliar Group 0 elements (e.g. Kr, Xe, Rn) from partial tables, being careful with negative Celsius numbers (-108 °C is HIGHER than -186 °C!).
4. Linking Noble Gas Properties to Real-World Applications:
   - Helium (He): Airships, party/weather balloons (lower density than air AND non-flammable, unlike hydrogen which caused the Hindenburg disaster); liquid He cools superconducting MRI magnets.
   - Argon (Ar): Inert shielding gas in MIG/TIG welding (denser than air, blankets hot molten metal to prevent oxidation with O₂); fills filament light bulbs (stops hot tungsten filament burning out); preserves fine wine/historical documents.
   - Neon (Ne), Krypton (Kr) & Xenon (Xe): High-voltage illuminated advertising signs (Ne glows red-orange), high-intensity car headlights, lighthouse/camera flash tubes, double-glazing thermal insulation (Ar/Kr low thermal conductivity), and excimer eye-surgery lasers.`,
    starterQuestions: [
      { q: "Why are Group 0 elements called the noble (inert) gases?", a: "They are chemically unreactive because they have full, stable outer electron shells", cue: "Full outer shell" },
      { q: "How many electrons does Helium have in its outer shell, and how many does Argon have?", a: "Helium has 2 (full first shell); Argon has 8 (2,8,8)", cue: "Watch the He trap!" },
      { q: "What does 'monatomic' mean, and why are noble gases monatomic?", a: "Existing as single unbonded atoms, because they do not need to share electrons", cue: "Single atoms (He, Ar)" },
      { q: "What happens to the boiling point and density as you go down Group 0?", a: "Both boiling point and density increase down the group", cue: "Larger mass & forces" },
      { q: "Why is helium used in balloons and airships instead of hydrogen?", a: "Helium has low density (floats) AND is non-flammable (inert), whereas hydrogen is explosive", cue: "Two properties needed" },
      { q: "Why is argon used as a shielding gas during high-temperature metal welding?", a: "Argon is denser than air and chemically inert, stopping hot metal reacting with oxygen", cue: "Prevents oxidation" }
    ]
  },
  {
    number: 5,
    title: "Reactivity of Metals",
    deckId: "Lesson_05_Reactivity_of_Metals",
    teacher: "Chemistry Faculty",
    practicalsCount: 1,
    practicalNames: ["Laboratory Investigation: Comparing Reactions of Mg, Zn, Fe, and Cu with Dilute Acid & Water"],
    details: `Reactivity of Metals with Oxygen, Water, Steam & Dilute Acids for GCSE Combined Science / Chemistry:
1. What Makes a Metal Reactive?:
   - When metals react, their atoms LOSE outer-shell electrons to form positively charged ions (cations, e.g. Mg → Mg²⁺ + 2e⁻; Na → Na⁺ + e⁻).
   - The reactivity of a metal is determined by how easily its atoms lose outer electrons to form positive ions.
2. Reactions with Oxygen (Oxidation & Reduction in terms of Oxygen):
   - Metal + Oxygen → Metal Oxide (e.g. 2Mg(s) + O₂(g) → 2MgO(s) dazzling white flame; 2Cu(s) + O₂(g) → 2CuO(s) black surface layer on heating; Au does not react).
   - Oxidation = gain of oxygen by a substance; Reduction = loss of oxygen from a compound.
3. Reactions with Cold Water vs Steam (Crucial Product Distinction!):
   - Very reactive metals (K, Na, Li, Ca) react vigorously with COLD WATER:
     • Metal + Cold Water → Metal Hydroxide + Hydrogen (e.g. Ca(s) + 2H₂O(l) → Ca(OH)₂(aq/s) + H₂(g)).
   - Moderately reactive metals (Mg, Zn, Fe) react very slowly or negligibly with cold water, but react readily with STEAM:
     • Metal + Steam → Metal OXIDE + Hydrogen (e.g. Mg(s) + H₂O(g) → MgO(s) + H₂(g) — note solid oxide, NOT hydroxide!).
   - Unreactive metals (Cu, Ag, Au) do not react with cold water or steam.
4. Reactions with Dilute Acids (HCl and H₂SO₄):
   - General equation: Metal + Acid → Salt + Hydrogen gas
     • Hydrochloric acid makes chloride salts: Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)
     • Sulfuric acid makes sulfate salts: Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g)
   - Gas test for Hydrogen: Lit wooden splint at mouth of test tube gives a squeaky pop (2H₂ + O₂ → 2H₂O).
   - Metals below hydrogen (Cu, Ag, Au) do NOT react with dilute acids.
5. Practical Investigation — Deducing Reactivity Order:
   - Compare Mg, Zn, Fe, Cu in equal volumes & concentrations of dilute HCl using:
     1) Rate of effervescence (bubbles of H₂ per minute / gas syringe volume).
     2) Exothermic temperature rise (ΔT = T_max - T_initial in insulated polystyrene cup).
   - Control variables for fair test: mass & surface area of metal (powder vs ribbon), concentration & volume of acid, starting temperature.`,
    starterQuestions: [
      { q: "What happens to metal atoms in terms of electrons when they react?", a: "They lose outer-shell electrons to form positive ions (cations)", cue: "Form +ve ions" },
      { q: "Define oxidation and reduction in terms of oxygen.", a: "Oxidation is gain of oxygen; Reduction is loss of oxygen", cue: "Gain vs Loss of O" },
      { q: "Complete the word equation: Magnesium + Hydrochloric acid → ...", a: "Magnesium chloride + Hydrogen", cue: "Salt + Hydrogen" },
      { q: "How do you test for hydrogen gas in the laboratory?", a: "Insert a lit splint — hydrogen burns with a squeaky pop", cue: "Lit splint test" },
      { q: "How does the product differ when magnesium reacts with steam vs calcium with cold water?", a: "Steam forms a metal oxide (MgO + H₂); cold water forms a metal hydroxide (Ca(OH)₂ + H₂)", cue: "Oxide vs Hydroxide" },
      { q: "Name two control variables when comparing temperature rise of metals in acid.", a: "Concentration/volume of acid, mass and surface area of metal, initial temperature", cue: "Fair test controls" }
    ]
  },
  {
    number: 6,
    title: "Reactivity Series and Displacement of Metals",
    deckId: "Lesson_06_Reactivity_Series_and_Displacement_of_Metals",
    teacher: "Chemistry Faculty",
    practicalsCount: 1,
    practicalNames: ["Microscale Metal Displacement Matrix (Mg, Zn, Fe, Cu in Sulfate Solutions) & Thermite Demonstration"],
    details: `The Reactivity Series, Metal Displacement Reactions & Ionic Redox Equations for GCSE Combined Science / Chemistry:
1. The Full GCSE Reactivity Series (Most to Least Reactive):
   - Potassium (K) → Sodium (Na) → Lithium (Li) → Calcium (Ca) → Magnesium (Mg) → Aluminium (Al) → [CARBON (C)] → Zinc (Zn) → Iron (Fe) → Tin (Sn) → Lead (Pb) → [HYDROGEN (H)] → Copper (Cu) → Silver (Ag) → Gold (Au) → Platinum (Pt).
   - Why non-metals Carbon and Hydrogen are included as reference benchmarks:
     • Metals above Hydrogen react with dilute acids to release H₂; metals below Hydrogen (Cu, Ag, Au) do not.
     • Metals below Carbon can be extracted from their oxides by heating with Carbon; metals above Carbon require electrolysis.
   - Anomaly note: Aluminium sits high in the series but appears unreactive in air/water due to a tough, impermeable surface layer of aluminium oxide (Al₂O₃).
2. Metal Displacement in Aqueous Solutions (Practical Matrix):
   - Rule: A more reactive metal displaces a less reactive metal from an aqueous solution of its salt.
   - Classic Exam Example: Iron nail placed in blue Copper(II) Sulfate solution:
     • Equation: Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)
     • Observations: Blue solution fades to pale green (Fe²⁺); a salmon-pink/reddish-brown coating of solid copper forms on the nail; temperature rises (exothermic).
   - 4×4 Displacement Matrix Lab: testing Mg, Zn, Fe, Cu strips against MgSO₄, ZnSO₄, FeSO₄, CuSO₄ solutions — Mg displaces 3 metals, Zn displaces 2, Fe displaces 1, Cu displaces 0.
3. Solid-State Metal Oxide Displacement — The Thermite Reaction:
   - Aluminium + Iron(III) oxide → Aluminium oxide + Molten Iron
   - Balanced equation: 2Al(s) + Fe₂O₃(s) → Al₂O₃(s) + 2Fe(l)
   - Intensely exothermic; produces white-hot molten iron (~2500 °C) used in industry to weld continuous steel railway tracks in remote locations.
4. Ionic Equations, Spectator Ions & Redox (Higher Tier):
   - Example: Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s)
   - Split aqueous ionic compounds: Zn(s) + Cu²⁺(aq) + SO₄²⁻(aq) → Zn²⁺(aq) + SO₄²⁻(aq) + Cu(s)
   - Cancel spectator ion (SO₄²⁻): Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)
   - Half equations (OIL RIG):
     • Oxidation: Zn → Zn²⁺ + 2e⁻ (Zinc loses 2 electrons)
     • Reduction: Cu²⁺ + 2e⁻ → Cu (Copper(II) ions gain 2 electrons).`,
    starterQuestions: [
      { q: "Which two non-metals are placed inside the reactivity series as reference points?", a: "Carbon (C) and Hydrogen (H)", cue: "Extraction & Acid benchmarks" },
      { q: "Why does aluminium often appear unreactive despite being high in the reactivity series?", a: "It is coated in a tough, unreactive protective layer of aluminium oxide (Al₂O₃)", cue: "Oxide passivating layer" },
      { q: "What two visual changes occur when an iron nail is placed in blue copper(II) sulfate solution?", a: "Blue solution turns pale green (FeSO₄) and reddish-brown copper coats the nail", cue: "Solution + Solid colour" },
      { q: "Write the balanced symbol equation for the thermite reaction between Al and Fe₂O₃.", a: "2Al(s) + Fe₂O₃(s) → Al₂O₃(s) + 2Fe(l)", cue: "Welding railway lines" },
      { q: "Write the ionic equation for magnesium displacing copper from copper(II) sulfate.", a: "Mg(s) + Cu²⁺(aq) → Mg²⁺(aq) + Cu(s) (SO₄²⁻ is the spectator ion)", cue: "Cancel SO₄²⁻" },
      { q: "In Zn + Cu²⁺ → Zn²⁺ + Cu, which species is oxidised and which is reduced?", a: "Zn is oxidised (loses electrons); Cu²⁺ is reduced (gains electrons)", cue: "OIL RIG" }
    ]
  },
  {
    number: 7,
    title: "Metal Extraction: Blast Furnace, Bioleaching & Phytomining",
    deckId: "Lesson_07_Metal_Extraction_Blast_Furnace_Bioleaching_Phytomining",
    teacher: "Chemistry Faculty",
    practicalsCount: 1,
    practicalNames: ["Charcoal Block / Match-Head Reduction of Copper(II) Oxide & Iron Oxide + Copper Leachate Displacement"],
    details: `Extraction of Metals: Ores, The Blast Furnace (Iron Extraction), Phytomining, and Bioleaching for GCSE Combined Science / Chemistry:
CRITICAL CONTENT REQUIREMENT: This slide deck MUST thoroughly cover (A) Ores & Carbon Reduction Principles, (B) The Industrial Blast Furnace in complete chemical detail, (C) Phytomining, and (D) Bioleaching, plus a comparative evaluation!

1. Native Metals vs Metal Ores & Choosing the Extraction Method:
   - Unreactive metals (Gold Au, Silver Ag, Platinum Pt) are found uncombined as native elements in the Earth's crust.
   - Most metals exist chemically combined with oxygen or sulfur in rocks called ORES (rocks containing enough metal compound to make extraction economically worthwhile, e.g. haematite Fe₂O₃, bauxite Al₂O₃, chalcopyrite CuFeS₂).
   - Extraction rule linked to Reactivity Series:
     • Metals LESS reactive than Carbon (Zn, Fe, Sn, Pb, Cu) → extracted by heating/reduction with Carbon or Carbon Monoxide (cheap, abundant).
     • Metals MORE reactive than Carbon (K, Na, Ca, Mg, Al) → Carbon cannot displace them; must be extracted by Electrolysis of molten compounds (expensive, high electricity usage).

2. THE BLAST FURNACE — Industrial Extraction of Iron from Haematite (MUST COVER IN FULL DETAIL):
   - Raw Materials ("The Charge" fed into the top + Blast at bottom):
     1) Iron ore (Haematite, Fe₂O₃) — source of iron.
     2) Coke (impure Carbon, C, from coal) — fuel AND source of reducing agent.
     3) Limestone (Calcium carbonate, CaCO₃) — removes acidic sandy impurities (silicon dioxide, SiO₂) as molten slag.
     4) Hot Air Blast (Oxygen, O₂) — blown in through tuyeres near the base (~1500 °C at bottom, ~400 °C at top).
   - Step-by-Step Chemical Reactions Inside the Blast Furnace:
     • Stage 1 — Exothermic Combustion of Coke (generates intense heat ~1500 °C):
       Carbon + Oxygen → Carbon dioxide | C(s) + O₂(g) → CO₂(g)
     • Stage 2 — Formation of Carbon Monoxide (the main reducing agent):
       Carbon dioxide reacts with more hot coke: CO₂(g) + C(s) → 2CO(g)
     • Stage 3 — Reduction of Iron(III) Oxide to Molten Iron:
       Iron(III) oxide + Carbon monoxide → Molten Iron + Carbon dioxide
       Fe₂O₃(s) + 3CO(g) → 2Fe(l) + 3CO₂(g)
       (Direct reduction by solid carbon also occurs in hotter zones: 2Fe₂O₃(s) + 3C(s) → 4Fe(l) + 3CO₂(g)).
       Dense molten cast/pig iron (~96% Fe, ~4% C brittle) sinks to the very bottom and is tapped off to make steel.
     • Stage 4 — Removal of Impurities via Limestone & Slag Formation (Thermal Decomposition + Neutralisation):
       Step 4a: Limestone thermally decomposes in the heat: CaCO₃(s) → CaO(s) + CO₂(g) (calcium oxide = quicklime, a base).
       Step 4b: Basic calcium oxide reacts with acidic silicon dioxide (sand) impurities: CaO(s) + SiO₂(s) → CaSiO₃(l) (molten calcium silicate = SLAG).
       Molten slag is less dense than molten iron, so it floats as a protective layer on top of the molten iron and is tapped off separately for road construction and cement.

3. Why Biological Extraction Methods Are Needed (Low-Grade Copper Ores):
   - High-grade copper ores are rapidly running out due to global demand for electrical wiring, EV motors, and electronics.
   - Traditional open-cast mining, roasting, and smelting of low-grade ores (<1% Cu) is uneconomical, destroys habitats, consumes vast energy, and emits toxic sulfur dioxide (SO₂ → acid rain) and CO₂.
   - Sustainable biological alternatives extract copper economically from low-grade ores, quarry waste, and contaminated land: PHYTOMINING and BIOLEACHING.

4. PHYTOMINING — Extracting Copper Using Plants (Step-by-Step):
   - Step 1: Grow specialist hyperaccumulator plants (e.g. Brassica / Alyssum) on soil containing low-grade copper ore or mine spoil.
   - Step 2: Plants absorb dissolved copper(II) ions (Cu²⁺) through their roots and concentrate copper compounds in their stems and leaves as they grow.
   - Step 3: Harvest, dry, and burn the plants in air (the heat from burning biomass can be harnessed to generate electricity/steam, making it carbon-neutral/low-carbon).
   - Step 4: The remaining ash contains high concentrations of soluble/insoluble copper compounds (e.g. copper(II) oxide). React/dissolve the ash with dilute sulfuric acid (H₂SO₄) to produce an aqueous LEACHATE solution of copper(II) sulfate (CuSO₄(aq)).
   - Step 5: Extract pure copper metal from the leachate by EITHER:
     • Displacement using cheap scrap iron: Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s), OR
     • Electrolysis (cathode: Cu²⁺(aq) + 2e⁻ → Cu(s)).

5. BIOLEACHING — Extracting Copper Using Bacteria (Step-by-Step):
   - Step 1: Certain chemolithotrophic bacteria (e.g. Acidithiobacillus) are mixed with low-grade copper sulfide ores and water/oxygen in heap-leaching mounds.
   - Step 2: The bacteria feed on the mineral ore, breaking chemical bonds between copper and sulfur via biological and chemical oxidation, converting insoluble copper sulfides into soluble copper ions.
   - Step 3: This produces an acidic liquid run-off called a LEACHATE containing dissolved copper(II) ions (Cu²⁺(aq)), without any high-temperature furnace!
   - Step 4: Pure copper metal is recovered from the leachate via displacement with scrap iron (Fe(s) + Cu²⁺(aq) → Fe²⁺(aq) + Cu(s)) or electrolysis.

6. Evaluative Comparison Matrix (6-Mark GCSE Extended Response):
   - Compare Blast Furnace / Traditional Smelting vs Phytomining vs Bioleaching:
     • Advantages of Phytomining & Bioleaching: Extracts metal from low-grade ores/waste; much lower energy consumption than smelting; no SO₂ acid-rain gas; phytomining decontaminates polluted soil and is nearly carbon-neutral.
     • Disadvantages / Limitations: Very slow processes (months/years for crops or bacterial heaps vs hours in a furnace); bioleaching can produce toxic acidic leachate containing sulfuric acid and heavy metals that must be strictly contained to prevent river/groundwater pollution; phytomining depends on climate/growing seasons and land area.`,
    starterQuestions: [
      { q: "What is the definition of a metal ore?", a: "A rock containing enough of a metal compound to make extracting the metal economically worthwhile", cue: "Economic extraction" },
      { q: "Why is gold found as a pure native element whereas iron is found as iron(III) oxide?", a: "Gold is very unreactive, whereas iron is reactive enough to combine with oxygen", cue: "Reactivity difference" },
      { q: "Which metals can be extracted from their oxides by heating with carbon?", a: "Metals that are LESS reactive than carbon in the reactivity series (e.g. Zn, Fe, Cu)", cue: "Below Carbon" },
      { q: "Name the four raw materials fed into a Blast Furnace to extract iron.", a: "Iron ore (haematite Fe₂O₃), coke (carbon), limestone (CaCO₃), and hot air (oxygen)", cue: "3 solids + 1 gas" },
      { q: "What is the role of limestone in the Blast Furnace?", a: "Decomposes to CaO, which reacts with acidic SiO₂ sand impurities to form molten slag (CaSiO₃)", cue: "Removes SiO₂ impurities" },
      { q: "How do phytomining and bioleaching differ in the organism used to extract copper?", a: "Phytomining uses living plants grown on low-grade soil; bioleaching uses bacteria on sulfide ores", cue: "Plants vs Bacteria" }
    ]
  },
  {
    number: 8,
    title: "Electrolysis and Half Equations",
    deckId: "Lesson_08_Electrolysis_and_Half_Equations",
    teacher: "Chemistry Faculty",
    practicalsCount: 1,
    practicalNames: ["OCR Gateway PAG / Required Practical: Electrolysis of Aqueous Solutions (CuSO₄, NaCl, CuCl₂, Na₂SO₄) with Inert Graphite Electrodes"],
    details: `Electrolysis of Molten & Aqueous Electrolytes, Aluminium Extraction & Half Equations for GCSE Combined Science / Chemistry:
1. Fundamentals of Electrolysis:
   - Definition: Decomposition (splitting up) of a molten or dissolved (aqueous) ionic compound (the ELECTROLYTE) by passing a direct electric current (DC) through it.
   - Why electrolytes conduct electricity: Solid ionic lattices CANNOT conduct because ions are held in fixed positions by strong electrostatic forces; when melted (molten) or dissolved in water (aqueous), the lattice breaks down and ions are FREE TO MOVE and carry charge.
   - Electrodes & Ion Migration (PANIC = Positive is Anode, Negative is Cathode):
     • Positively charged cations (Mⁿ⁺, H⁺) are attracted to the NEGATIVE CATHODE, where they gain electrons (REDUCTION).
     • Negatively charged anions (X⁻, O²⁻, OH⁻) are attracted to the POSITIVE ANODE, where they lose electrons (OXIDATION).
2. Electrolysis of Molten Binary Ionic Compounds:
   - Only two ion types present → always produces the pure metal at the cathode and the non-metal at the anode.
   - Classic Lab Example — Molten Lead(II) Bromide (PbBr₂(l)):
     • Cathode (-): Silvery bead of molten lead forms → Pb²⁺(l) + 2e⁻ → Pb(l) (Reduction)
     • Anode (+): Toxic brown bromine vapour bubbles off → 2Br⁻(l) → Br₂(g) + 2e⁻ (Oxidation).
3. Industrial Extraction of Aluminium by Electrolysis (Bauxite / Hall-Héroult Cell):
   - Aluminium is more reactive than carbon, so must be extracted by electrolysis of purified aluminium oxide (Al₂O₃).
   - Role of Cryolite: Pure Al₂O₃ has an extremely high melting point (~2050 °C). Dissolving Al₂O₃ in molten CRYOLITE (Na₃AlF₆) lowers the operating temperature to ~900–950 °C, dramatically reducing energy costs and increasing conductivity.
   - Cathode (-) lining: Al³⁺ + 3e⁻ → Al(l) (molten aluminium sinks and is tapped off).
   - Carbon Anodes (+): 2O²⁻ → O₂(g) + 4e⁻. Because the cell is at ~950 °C, oxygen gas reacts immediately with the hot graphite carbon anodes (C + O₂ → CO₂), burning them away so anodes must be regularly replaced!
4. Electrolysis of Aqueous Solutions (Competing Ions from Water: H₂O ⇌ H⁺ + OH⁻):
   - CATHODE (-) Rule (Metal ion Mⁿ⁺ vs Hydrogen ion H⁺):
     • If metal is MORE reactive than Hydrogen (e.g. Na⁺, K⁺, Ca²⁺, Mg²⁺) → HYDROGEN GAS bubbles off: 2H⁺(aq) + 2e⁻ → H₂(g).
     • If metal is LESS reactive than Hydrogen (e.g. Cu²⁺, Ag⁺) → PURE METAL plates onto the cathode: Cu²⁺(aq) + 2e⁻ → Cu(s).
   - ANODE (+) Rule (Anion vs Hydroxide ion OH⁻):
     • If concentrated HALIDE ions (Cl⁻, Br⁻, I⁻) are present → HALOGEN forms: 2Cl⁻(aq) → Cl₂(g) + 2e⁻ (bleaches damp litmus).
     • If NO halide ions are present (e.g. sulfate SO₄²⁻ or nitrate NO₃⁻) → OXYGEN GAS and water form from OH⁻ ions: 4OH⁻(aq) → O₂(g) + 2H₂O(l) + 4e⁻ (relights glowing splint).
   - Brine (concentrated NaCl(aq)) three industrial products: Hydrogen gas (cathode), Chlorine gas (anode), and Sodium Hydroxide solution (Na⁺ and OH⁻ remaining in cell).
5. Step-by-Step Half Equations Mastery Workshop:
   - Clear 4-step method: (1) Write reactant ion & product formula (remember diatomic Cl₂, Br₂, I₂, O₂, H₂!), (2) Balance atoms, (3) Add electrons e⁻ to the more positive side so total charges balance, (4) Label Oxidation or Reduction using OIL RIG.`,
    starterQuestions: [
      { q: "Why can molten sodium chloride conduct electricity, whereas solid sodium chloride cannot?", a: "In molten NaCl ions are free to move and carry charge; in solid NaCl ions are locked in a fixed lattice", cue: "Free-moving ions" },
      { q: "State the charge of the anode and cathode (PANIC), and which ions move to each.", a: "Anode is positive (attracts negative anions); Cathode is negative (attracts positive cations)", cue: "PANIC" },
      { q: "Why is aluminium oxide dissolved in molten cryolite during aluminium extraction?", a: "To lower the melting point (from ~2050 °C to ~950 °C), saving thermal energy and lowering costs", cue: "Lowers melting point" },
      { q: "Why must the positive carbon anodes be replaced regularly in aluminium electrolysis?", a: "Oxygen produced at the anode reacts with the hot carbon electrodes to form CO₂ gas, burning them away", cue: "C + O₂ → CO₂" },
      { q: "Predict the products at the cathode and anode during electrolysis of aqueous copper(II) sulfate.", a: "Cathode: solid Copper (Cu < H); Anode: Oxygen gas (from OH⁻, since SO₄²⁻ is not a halide)", cue: "Discharge rules" },
      { q: "Write the balanced half equation for the discharge of chloride ions at the anode.", a: "2Cl⁻ → Cl₂ + 2e⁻ (Oxidation — loss of electrons)", cue: "Diatomic + 2e⁻" }
    ]
  }
];

export function buildChemistryLessonPrompt(lesson) {
  return `Create a detailed, visually luminous classroom slide deck for GCSE Combined Science / Chemistry: Periodic Table Groups, Reactivity & Extraction of Metals.

Use the exact deck title: "Lesson ${lesson.number}: ${lesson.title}".
Course: ${SLIDE_SET_TITLE}
Teacher: ${lesson.teacher}${lesson.practicalsCount > 0 ? ` (${lesson.practicalsCount} Practical: ${lesson.practicalNames.join("; ")})` : ""}

Lesson details & required scientific depth:
${lesson.details}

Use UK English (e.g. sulphur/sulfur per IUPAC/GCSE standard "sulfur", "aluminium", "haematite", "neutralisation", "oxidised", "colourless") and draw factual teaching content from the selected notebook sources and GCSE Chemistry curriculum specifications.

CRITICAL VISUAL & PEDAGOGICAL DIRECTIVE — 100% CLEAR, LIGHT & BRIGHT SLIDES WITH LOW COGNITIVE LOAD:
- Every single slide MUST use a clean, bright, luminous light background (pure white #FFFFFF or crisp porcelain #F8FAFC) with high-contrast dark slate typography and vibrant chemistry accent cards (cobalt blue, emerald, warm amber, teal). Strictly NO dark/black/murky backgrounds.
- Low cognitive load: limit text per card to max 3–4 short, punchy bullet points (under 15 words per bullet) with bold lead-in keywords. Avoid dense walls of text.
- Display all balanced symbol equations, ionic equations, and half equations in dedicated, high-contrast equation callout boxes with state symbols so they are immediately legible from the back of a classroom.
- Include clear, well-labelled schematic diagrams, comparison tables, and step-by-step worked examples where appropriate.

REQUIRED SLIDE SEQUENCE & INTERACTIVITY:
1. Slide 1: Clear Lesson Title Slide ("Lesson ${lesson.number}: ${lesson.title}") with unit context, visual scope badges, and zero learner tasks on Slide 1.
2. Slide 2: Immediately after the title slide, include EXACTLY ONE 5–10 minute Starter Knowledge Retrieval slide formatted as a clean 6-cell grid (3 columns × 2 rows). Populate the 6 numbered cells with these exact starter retrieval questions (keep the layout clean so students answer first):
${lesson.starterQuestions.map((sq, i) => `   Cell ${i + 1}: ${sq.q} [Cue: ${sq.cue}]`).join("\n")}
3. Slides 3 onwards (aim for 12–15 total slides): Coherent, self-contained teaching sequence covering:
   - Clear tiered Learning Objectives & Key Terminology
   - Core Scientific Explanations, Particle/Electronic Diagrams & Balanced Equations
   - Practical Demonstration / Laboratory Method, Observations, Variables & Safety Precautions
   - Frequent Mini-Whiteboard / Pair-and-Share Checkpoints, Misconception Traps & Guided Practice
   - Exam-Style Application Question (with clear mark-scheme breakdown) & Concise Plenary Summary.
   ${lesson.number === 7 ? "IMPORTANT FOR LESSON 7: Dedicate dedicated, thorough visual slides to (1) Ores & Carbon Reduction Reactivity Threshold, (2) The Blast Furnace architecture & raw materials, (3) All 4 Blast Furnace chemical reaction stages including CO reduction of Fe2O3 and CaCO3/CaO/CaSiO3 slag removal, (4) Phytomining step-by-step process, (5) Bioleaching step-by-step process, and (6) 6-Mark Comparative Evaluation of Blast Furnace/Smelting vs Phytomining vs Bioleaching!" : ""}`;
}

