import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractPptxDeck } from "../src/pptx-extractor.js";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_electrical_installation_level_2");
const PUBLIC_DECKS_DIR = path.resolve("./public/decks/electrical_installation_diploma_level_2");
const CDP_URL = "http://127.0.0.1:9333";
const TARGET_NOTEBOOK_URL = "https://notebook.google.com/notebook/3286ca38-5b3b-44b1-a429-080a12b5fb04";

export const UNIT_202_LESSONS = [
  {
    number: 1,
    deckId: "Lesson_01_Maths_Fundamentals_Formula_Transposition",
    title: "Maths Fundamentals & Formula Transposition",
    shortTitle: "Maths & Formulas",
    teacher: "Electrical Engineering Faculty",
    courseName: "Electrical Installation Diploma Level 2",
    slideSetId: "electrical_installation_diploma_level_2",
    starterQuestions: [
      {
        q: "What is the core rule of transposing algebraic formulas?",
        a: "Balance Method: Whatever operation is applied to one side of an equation must be applied equally to the other (+ becomes -, × becomes ÷).",
        cue: "The Balance Method"
      },
      {
        q: "What do the SI prefixes micro (μ), milli (m), kilo (k), and mega (M) represent?",
        a: "μ = 10⁻⁶ (millionth), m = 10⁻³ (thousandth), k = 10³ (thousand), M = 10⁶ (million).",
        cue: "Scientific Prefixes"
      },
      {
        q: "Transpose Ohm's Law (V = I × R) to make current (I) the subject.",
        a: "I = V ÷ R (or I = V / R). Current equals voltage divided by resistance.",
        cue: "I = V / R"
      },
      {
        q: "Transpose the power formula P = I² × R to solve for current (I).",
        a: "Divide both sides by R, then take the square root: I = √(P / R).",
        cue: "I = √(P / R)"
      },
      {
        q: "What trigonometry formula finds impedance (Z) from resistance (R) and reactance (X)?",
        a: "Pythagoras' Theorem on the AC Impedance Triangle: Z² = R² + X² → Z = √(R² + X²).",
        cue: "Z = √(R² + X²)"
      },
      {
        q: "Challenge: Transpose the conductor resistance equation R = (ρ × l) / A to find cross-sectional area (A).",
        a: "Multiply by A, then divide by R: A = (ρ × l) / R.",
        cue: "A = (ρ × l) / R"
      }
    ],
    prompt: `Create a luminous, high-clarity classroom presentation for Electrical Installation Diploma Level 2 (City & Guilds 2365 / EAL Unit 202: Principles of Electrical Science).

Exact Deck Title: "Lesson 1: Maths Fundamentals & Formula Transposition"
Course: Electrical Installation Diploma Level 2 · Principles of Electrical Science
Target Audience: Vocational apprentice electricians and adult trade learners.

PEDAGOGICAL & VISUAL REQUIREMENTS:
- Aesthetic: Bright, minimalist, ultra-clean modern technology theme (pure white / light cyan backgrounds, high-contrast typography, electric cyan, cobalt blue, and warm amber accents).
- Cognitive Clarity: Zero dense text walls, clear dedicated cards, bold keywords, step-by-step boxed mathematical proofs and calculations.
- Practical Trade Application: Cable sizing, voltage drop, motor current draw, heating element resistance, and Pythagorean AC power triangles.

SLIDE-BY-SLIDE CURRICULUM:
Slide 1: Title & Overview
- Title: "Maths Fundamentals & Formula Transposition"
- Subtitle: "City & Guilds 2365 Level 2 Diploma in Electrical Installations · Unit 202: Principles of Electrical Science"
- Feature clean portraits and quotes from Leonhard Euler (algebraic balance) and Georg Ohm (practical circuit relationships).

Slide 2: Starter Activity: Knowledge Retrieval (6-Question Grid)
- 6 clean retrieval question boxes:
  1. The Balance Method in algebra.
  2. SI metric engineering prefixes (μ, m, k, M).
  3. Transposing V = IR for I.
  4. Transposing P = I²R for I.
  5. Pythagoras on AC impedance triangles (Z = √(R² + X²)).
  6. Challenge: Transposing R = ρl/A for conductor cross-sectional area A.

Slide 3: CRITICAL ENGAGING HOOK
- Title: "The £14,000 Transposition Disaster: When a Maths Mistake Melts a Main Cable"
- Trade Scenario: Sizing a 3-phase sub-main feeder cable for a new commercial cold-storage warehouse.
- The Dilemma: An apprentice mis-transposes A = ρl/R, accidentally inverting R and installing an under-sized 16mm² cable instead of 35mm².
- The Consequence: Extreme voltage drop, motor contactors chattering, cable insulation overheating, and a £14,000 emergency strip-out and rewire!
- The Takeaway: "Formula transposition is not abstract maths—it is the direct engineering control of fire safety, power delivery, and regulatory compliance."

Slide 4: The Golden Rules of Transposition (The Balance Method)
- Golden Rule: What you do to one side of the equals sign, you must do to the other side.
- Reverse Operations Table:
  • Addition (+) ↔ Subtraction (-)
  • Multiplication (×) ↔ Division (÷)
  • Square (x²) ↔ Square Root (√x)
- The Danger of Formula Triangles: Why triangles fail on 3-variable squares like P = I²R and why true algebra guarantees 100% exam success.

Slide 5: WORKED EXAMPLE 1: Transposing Linear Circuit Equations
- Problem Statement: A commercial heating circuit is supplied at 230 V. The design current must not exceed 16 A. Calculate the minimum allowable element resistance.
- Step 1: Identify given variables (V = 230 V, I = 16 A, find R).
- Step 2: State starting formula: V = I × R.
- Step 3: Transpose to isolate R (divide both sides by I): R = V / I.
- Step 4: Substitute and solve: R = 230 / 16 = 14.375 Ω.
- Step 5: Trade sanity check: 14.38 Ω ensures maximum current stays within the 16 A Type B MCB rating.

Slide 6: WORKED EXAMPLE 2: Transposing Squared Formulas (P = I²R)
- Problem Statement: A 3 kW (3000 W) immersion heater element has an internal resistance of 12 Ω. Calculate the full-load operating current.
- Step 1: Identify variables: P = 3000 W, R = 12 Ω, find I.
- Step 2: State formula: P = I² × R.
- Step 3: Divide both sides by R: I² = P / R.
- Step 4: Take the square root of both sides: I = √(P / R).
- Step 5: Substitute numbers: I = √(3000 / 12) = √250 = 15.81 A.
- Highlight: Clear boxed step-by-step layout with highlighted square root symbol.

Slide 7: WORKED EXAMPLE 3: Transposing Fractions with Conductor Resistivity (R = ρl/A)
- Conductor Resistance Formula: R = (ρ × l) / A.
- Transposition Goal 1: Make cross-sectional area (A) the subject.
  • Multiply both sides by A: R × A = ρ × l.
  • Divide both sides by R: A = (ρ × l) / R.
- Transposition Goal 2: Make conductor length (l) the subject.
  • Multiply by A: R × A = ρ × l.
  • Divide by ρ: l = (R × A) / ρ.
- Practical insight: How electricians use this to calculate maximum allowable circuit run lengths for BS 7671 voltage drop compliance.

Slide 8: Scientific Notation & Engineering Prefixes
- Metric multipliers in electrical engineering:
  • Mega (M) = × 10⁶ (1,000,000) e.g., 20 MΩ insulation resistance.
  • Kilo (k) = × 10³ (1,000) e.g., 3.5 kW heater power.
  • Milli (m) = × 10⁻³ (0.001) e.g., 30 mA RCD trip sensitivity.
  • Micro (μ) = × 10⁻⁶ (0.000001) e.g., 47 μF motor start capacitor.
- Calculator walkthrough: Using the [EXP] or [×10ˣ] button on scientific calculators without syntax errors.

Slide 9: Right-Angled Triangles & Pythagoras in AC Circuits
- AC Power and Impedance Triangles:
  • Base = Resistance (R in Ohms)
  • Height = Reactance (X in Ohms: Inductive XL or Capacitive XC)
  • Hypotenuse = Total Impedance (Z in Ohms)
- Pythagorean Formula: Z² = R² + X² → Z = √(R² + X²).
- Step-by-step calculation: R = 12 Ω, X = 16 Ω → Z = √(144 + 256) = √400 = 20 Ω.

Slide 10: Summary, Transposition Cheat Sheet & Exam Checklist
- Master Transposition Table: Starting formula, Target variable, Transposed equation.
- 4-Step Exam Method:
  1. Write down known variables with units.
  2. Transpose formula BEFORE plugging in numbers.
  3. Convert metric prefixes to base units (e.g. kW → W, mA → A).
  4. Perform sanity check against typical installation values.`
  },
  {
    number: 2,
    deckId: "Lesson_02_SI_Units_Resistance_Resistivity",
    title: "SI Units, Resistance & Conductor Resistivity",
    shortTitle: "Resistance & Resistivity",
    teacher: "Electrical Engineering Faculty",
    courseName: "Electrical Installation Diploma Level 2",
    slideSetId: "electrical_installation_diploma_level_2",
    starterQuestions: [
      {
        q: "What are the base SI electrical units for current, potential difference, and charge?",
        a: "Current: Ampere (A), Potential Difference: Volt (V), Charge: Coulomb (Q, where 1 C = 1 A·s).",
        cue: "SI Electrical Base Units"
      },
      {
        q: "Define conductor resistivity (ρ) and state its standard SI unit.",
        a: "Resistivity is the intrinsic property of a material measuring its opposition to current flow, measured in Ohm-metres (Ω·m). Copper is 1.72 × 10⁻⁸ Ω·m.",
        cue: "Resistivity (Ω·m)"
      },
      {
        q: "List the 4 physical factors that determine the resistance of a conductor.",
        a: "1. Length (l), 2. Cross-sectional area (A), 3. Material resistivity (ρ), 4. Operating temperature (T).",
        cue: "4 Factors of Resistance"
      },
      {
        q: "State the formula relating resistance, resistivity, length, and cross-sectional area.",
        a: "R = (ρ × l) / A (where R is in Ω, ρ in Ω·m, l in metres, and A in square metres m²).",
        cue: "R = (ρ × l) / A"
      },
      {
        q: "What happens to the resistance of pure copper conductors as their temperature rises?",
        a: "Resistance increases because copper has a Positive Temperature Coefficient (PTC) of resistance (α ≈ +0.004 /°C).",
        cue: "Positive Temperature Coeff"
      },
      {
        q: "Calculate the resistance of a 50m copper conductor (4mm² csa, ρ = 1.72 × 10⁻⁸ Ω·m).",
        a: "A = 4 × 10⁻⁶ m². R = (1.72 × 10⁻⁸ × 50) / (4 × 10⁻⁶) = 8.6 × 10⁻⁷ / 4 × 10⁻⁶ = 0.215 Ω.",
        cue: "R = 0.215 Ω"
      }
    ],
    prompt: `Create a luminous, high-clarity classroom presentation for Electrical Installation Diploma Level 2 (City & Guilds 2365 / EAL Unit 202: Principles of Electrical Science).

Exact Deck Title: "Lesson 2: SI Units, Resistance & Conductor Resistivity"
Course: Electrical Installation Diploma Level 2 · Principles of Electrical Science
Target Audience: Vocational apprentice electricians and adult trade learners.

PEDAGOGICAL & VISUAL REQUIREMENTS:
- Aesthetic: Bright, minimalist, ultra-clean modern technology theme (pure white / light cyan backgrounds, high-contrast typography, electric cyan, cobalt blue, and warm amber accents).
- Cognitive Clarity: Zero dense text walls, clear dedicated cards, bold keywords, step-by-step boxed mathematical proofs and calculations.
- Practical Trade Application: Cable resistance calculations, conductor sizing under BS 7671, milliohm measurements, temperature correction factors.

SLIDE-BY-SLIDE CURRICULUM:
Slide 1: Title & Overview
- Title: "SI Units, Resistance & Conductor Resistivity"
- Subtitle: "City & Guilds 2365 Level 2 Diploma in Electrical Installations · Unit 202: Principles of Electrical Science"
- Feature clean portraits and quotes from Georg Simon Ohm and Lord Kelvin on electrical measurement.

Slide 2: Starter Activity: Knowledge Retrieval (6-Question Grid)
- 6 clean retrieval question boxes:
  1. SI Electrical Base Units (Ampere, Volt, Coulomb).
  2. Conductor Resistivity definition and unit (Ω·m).
  3. The 4 factors governing conductor resistance (length, area, material, temp).
  4. The Conductor Resistance Formula: R = (ρ × l) / A.
  5. Positive Temperature Coefficient (PTC) in copper conductors.
  6. Challenge: Calculating resistance of 50m of 4mm² copper wire.

Slide 3: CRITICAL ENGAGING HOOK
- Title: "The 1858 Transatlantic Telegraph Disaster: When Bad Resistance Destroyed Global Communications"
- Trade Scenario: Sizing long cable runs without understanding conductor resistivity and cross-sectional area.
- The Dilemma: Chief Electrician Dr Whitehouse pumped 2,000 V into a 2,500-mile undersea copper cable because of massive signal attenuation and high end-to-end resistance.
- The Consequence: The intense electric stress punctured the gutta-percha insulation, destroying the £350,000 cable after only 3 weeks of operation! Lord Kelvin proved that low-resistivity pure copper and precise cross-sectional area were required.
- The Takeaway: "Understanding conductor resistivity (ρ) and resistance is the difference between a cable that delivers clean, safe power and one that burns out under its own thermal resistance."

Slide 4: SI Base Units & Derived Electrical Quantities
- Core SI electrical units:
  • Electric Current: Ampere (A) - base SI unit (flow of 6.242 × 10¹⁸ electrons/sec).
  • Electric Charge: Coulomb (Q) where Q = I × t.
  • Potential Difference / EMF: Volt (V) - 1 Joule of work per Coulomb of charge (V = W / Q).
  • Electrical Resistance: Ohm (Ω) - opposition to electric current.
  • Electrical Power: Watt (W) - 1 Joule per second.
- Visual reference table of symbols, units, and definitions.

Slide 5: The Four Factors Determining Resistance
- 1. Length (l): Resistance is directly proportional to length (double length = double resistance).
- 2. Cross-Sectional Area (A): Resistance is inversely proportional to area (double area = half resistance).
- 3. Material Resistivity (ρ): Intrinsic property measured in Ω·m (Copper = 1.72 × 10⁻⁸ Ω·m, Aluminium = 2.8 × 10⁻⁸ Ω·m).
- 4. Temperature (T): As metal conductors heat up, atoms vibrate more vigorously, impeding electron drift and increasing resistance.

Slide 6: WORKED EXAMPLE 1: Conductor Resistance Calculation
- Problem Statement: A sub-main feeder uses a 40-metre run of 4 mm² copper conductor (ρ = 1.72 × 10⁻⁸ Ω·m). Calculate the conductor resistance at 20°C.
- Step 1: Identify given values:
  • ρ = 1.72 × 10⁻⁸ Ω·m
  • l = 40 m
  • A = 4 mm² = 4 × 10⁻⁶ m² (CRITICAL conversion!)
- Step 2: State formula: R = (ρ × l) / A.
- Step 3: Substitute values: R = (1.72 × 10⁻⁸ × 40) / (4 × 10⁻⁶).
- Step 4: Calculate: R = (6.88 × 10⁻⁷) / (4 × 10⁻⁶) = 0.172 Ω.
- Step 5: Trade sanity check: Compare with BS 7671 On-Site Guide Table I1 (4 mm² copper has ~4.61 mΩ/m → 40 × 0.00461 = 0.184 Ω, accounting for manufacturing tolerances).

Slide 7: WORKED EXAMPLE 2: Transposing for Maximum Circuit Run Length
- Problem Statement: A sub-circuit wired in 2.5 mm² copper cable (ρ = 1.72 × 10⁻⁸ Ω·m) must not exceed a line conductor resistance of 0.35 Ω to satisfy voltage drop regulations. Calculate the maximum permissible cable run length.
- Step 1: Identify values: R = 0.35 Ω, A = 2.5 × 10⁻⁶ m², ρ = 1.72 × 10⁻⁸ Ω·m.
- Step 2: Transpose R = ρl/A to make length (l) the subject: l = (R × A) / ρ.
- Step 3: Substitute values: l = (0.35 × 2.5 × 10⁻⁶) / (1.72 × 10⁻⁸).
- Step 4: Calculate: l = 8.75 × 10⁻⁷ / 1.72 × 10⁻⁸ = 50.87 metres.
- Step 5: Trade takeaway: The maximum cable route from the consumer unit to the furthest load is 50.8 metres.

Slide 8: Temperature Coefficient of Resistance (α)
- Principle: Metal conductors have a Positive Temperature Coefficient (PTC).
- Temperature formula: R₂ = R₁ [1 + α(T₂ - T₁)].
- Copper temperature coefficient: α = 0.004 /°C (or 0.00393 /°C).
- Rule of thumb: Resistance of copper increases by approximately 4% for every 10°C temperature rise!
- The BS 7671 Factor: Why electricians multiply measured 20°C resistance values by 1.20 when verifying Maximum Zs under operating temperatures (70°C thermoplastic insulation).

Slide 9: WORKED EXAMPLE 3: Hot Operating Resistance of an Element
- Problem Statement: A commercial heating element has a cold resistance of 25.0 Ω at 20°C. If its operating temperature reaches 120°C and α = 0.004 /°C, calculate its resistance at full operating temperature.
- Step 1: Identify values: R₁ = 25.0 Ω, T₁ = 20°C, T₂ = 120°C, ΔT = 100°C, α = 0.004 /°C.
- Step 2: State formula: R₂ = R₁ [1 + α × ΔT].
- Step 3: Calculate bracket: [1 + (0.004 × 100)] = [1 + 0.40] = 1.40.
- Step 4: Multiply: R₂ = 25.0 × 1.40 = 35.0 Ω.
- Step 5: Trade implication: Current draw drops from cold start (9.2 A) to steady running state (6.57 A) due to thermal resistance rise.

Slide 10: Summary, On-Site Guide Resistance Tables & City & Guilds Exam Practice
- Master Formula Summary Table: R = ρl/A, l = RA/ρ, A = ρl/R, R₂ = R₁[1 + αΔT].
- Material comparison chart: Silver, Copper, Gold, Aluminium, Brass, Nichrome.
- City & Guilds 202 Exam Golden Rule: Always convert mm² to m² by multiplying by 10⁻⁶ before entering into resistivity equations!`
  },
  {
    number: 3,
    deckId: "Lesson_03_DC_Series_Parallel_Circuits_Ohms_Law",
    title: "DC Series & Parallel Circuits (Ohm's Law)",
    shortTitle: "Series & Parallel Circuits",
    teacher: "Electrical Engineering Faculty",
    courseName: "Electrical Installation Diploma Level 2",
    slideSetId: "electrical_installation_diploma_level_2",
    starterQuestions: [
      {
        q: "What is the rule for electric current in a pure series circuit?",
        a: "Current is identical at every point in a series circuit: Itotal = I1 = I2 = I3.",
        cue: "Current in Series"
      },
      {
        q: "What is the rule for potential difference (voltage) in a series circuit?",
        a: "The supply voltage is divided across the series components: Vtotal = V1 + V2 + V3.",
        cue: "Voltage Division in Series"
      },
      {
        q: "State the formula for total equivalent resistance in a series circuit.",
        a: "Total resistance is the simple sum of individual resistances: RT = R1 + R2 + R3 + ...",
        cue: "RT = R1 + R2 + R3"
      },
      {
        q: "What is the rule for voltage across parallel branches connected to a common supply?",
        a: "Voltage is identical across all parallel branches: Vtotal = V1 = V2 = V3.",
        cue: "Voltage in Parallel"
      },
      {
        q: "State Kirchhoff's Current Law (KCL) for parallel electrical junctions.",
        a: "The total current entering a junction or busbar equals the total current leaving it: Itotal = I1 + I2 + I3.",
        cue: "Kirchhoff's Current Law"
      },
      {
        q: "What is the formula for total equivalent resistance of two parallel resistors?",
        a: "Product over Sum: RT = (R1 × R2) / (R1 + R2) (or 1/RT = 1/R1 + 1/R2).",
        cue: "Product over Sum"
      }
    ],
    prompt: `Create a luminous, high-clarity classroom presentation for Electrical Installation Diploma Level 2 (City & Guilds 2365 / EAL Unit 202: Principles of Electrical Science).

Exact Deck Title: "Lesson 3: DC Series & Parallel Circuits (Ohm's Law)"
Course: Electrical Installation Diploma Level 2 · Principles of Electrical Science
Target Audience: Vocational apprentice electricians and adult trade learners.

PEDAGOGICAL & VISUAL REQUIREMENTS:
- Aesthetic: Bright, minimalist, ultra-clean modern technology theme (pure white / light cyan backgrounds, high-contrast typography, electric cyan, cobalt blue, and warm amber accents).
- Cognitive Clarity: Zero dense text walls, clear dedicated cards, bold keywords, step-by-step boxed mathematical circuit proofs and calculations.
- Practical Trade Application: Radial lighting circuits, socket outlets wired in parallel, volt drop across loose connections, ring final circuit balancing.

SLIDE-BY-SLIDE CURRICULUM:
Slide 1: Title & Overview
- Title: "DC Series & Parallel Circuits (Ohm's Law)"
- Subtitle: "City & Guilds 2365 Level 2 Diploma in Electrical Installations · Unit 202: Principles of Electrical Science"
- Feature clean portraits and quotes from Gustav Kirchhoff and Georg Ohm on circuit conservation laws.

Slide 2: Starter Activity: Knowledge Retrieval (6-Question Grid)
- 6 clean retrieval question boxes:
  1. Current behavior in a series circuit (identical everywhere).
  2. Voltage division in series circuits (Vtotal = V1 + V2 + V3).
  3. Total series resistance calculation (RT = R1 + R2 + R3).
  4. Voltage across parallel branches (equal across all branches).
  5. Kirchhoff's Current Law (KCL) at circuit junctions.
  6. Parallel resistance: Product over Sum rule.

Slide 3: CRITICAL ENGAGING HOOK
- Title: "The Christmas Tree Nightmare vs. Modern Emergency Lighting: Why Topology Saves Lives"
- Trade Scenario: Understanding why old festive fairy lights failed completely when a single bulb blew, while a 200-luminaire hospital emergency lighting system remains fully illuminated.
- The Dilemma: In a series circuit, every component depends on the continuity of all others. If one filament burns out, the entire circuit opens! Furthermore, supply voltage divides, leaving each load under-energised unless specifically matched.
- The Consequence: An apprentice wired warehouse safety exit signs in series. Result: None reached full luminosity, and when one failed, the whole emergency escape route was plunged into darkness, breaching BS 5266!
- The Takeaway: "Circuit topology is not academic theory. Wiring in parallel gives every luminaire independent supply and full 230 V mains potential."

Slide 4: Series Circuits: Current, Voltage & Resistance Rules
- Core series rules:
  • Current: IT = I1 = I2 = I3 (one single path for charge flow).
  • Resistance: RT = R1 + R2 + R3 (adding resistors increases total circuit resistance).
  • Voltage: VT = V1 + V2 + V3 (Ohm's Law applies to each component: V1 = I × R1).
- Key Trade Principle: The component with the highest resistance drops the largest voltage!

Slide 5: WORKED EXAMPLE 1: Complete Analysis of a Series Circuit
- Problem Statement: Three resistors (R1 = 15 Ω, R2 = 25 Ω, R3 = 60 Ω) are connected in series across a 200 V DC power supply.
- Step 1: Calculate total resistance: RT = 15 + 25 + 60 = 100 Ω.
- Step 2: Calculate circuit current: I = VT / RT = 200 / 100 = 2.0 A.
- Step 3: Calculate individual voltage drops:
  • V1 = I × R1 = 2.0 × 15 = 30 V
  • V2 = I × R2 = 2.0 × 25 = 50 V
  • V3 = I × R3 = 2.0 × 60 = 120 V
- Step 4: Verification check: 30 V + 50 V + 120 V = 200 V (Kirchhoff's Voltage Law confirmed!).

Slide 6: Parallel Circuits: Voltage, Current & Resistance Rules
- Core parallel rules:
  • Voltage: VT = V1 = V2 = V3 (each branch experiences full supply voltage).
  • Current: IT = I1 + I2 + I3 (Kirchhoff's Current Law: current divides across paths).
  • Resistance: 1/RT = 1/R1 + 1/R2 + 1/R3.
- Fundamental rule: Total resistance in a parallel circuit is ALWAYS less than the smallest individual branch resistance!

Slide 7: WORKED EXAMPLE 2: Parallel Branch Circuit & Reciprocal Resistance
- Problem Statement: A 230 V DC industrial control supply feeds three parallel loads: R1 = 20 Ω, R2 = 30 Ω, and R3 = 60 Ω.
- Step 1: Calculate total equivalent resistance using reciprocals:
  • 1/RT = (1/20) + (1/30) + (1/60)
  • Common denominator = 60: 1/RT = (3/60) + (2/60) + (1/60) = 6/60 = 0.1
  • Invert to find RT: RT = 60 / 6 = 10 Ω.
- Step 2: Calculate individual branch currents:
  • I1 = 230 / 20 = 11.5 A
  • I2 = 230 / 30 = 7.67 A
  • I3 = 230 / 60 = 3.83 A
- Step 3: Total supply current: IT = 11.5 + 7.67 + 3.83 = 23.0 A.
- Step 4: Verification check: IT = VT / RT = 230 / 10 = 23.0 A (100% agreement!).

Slide 8: Kirchhoff's Laws in Real-World Electrical Systems
- Kirchhoff's Current Law (KCL): "At any junction (node) in an electric circuit, the sum of currents entering equals the sum of currents leaving."
  • Practical example: Consumer unit neutral bar combining branch currents back to the DNO cut-out.
- Kirchhoff's Voltage Law (KVL): "In any closed loop, the directed sum of the potential differences around the loop equals zero."
  • Practical example: Supply voltage equals the sum of conductor voltage drop plus load operating voltage.

Slide 9: WORKED EXAMPLE 3: Combined Series-Parallel Circuit
- Problem Statement: A feeder cable with series line resistance R_line = 2.0 Ω supplies a distribution board containing two parallel branch loads: R1 = 20 Ω and R2 = 30 Ω. The supply voltage is 230 V.
- Step 1: Resolve the parallel combination first:
  • Rp = (R1 × R2) / (R1 + R2) = (20 × 30) / (20 + 30) = 600 / 50 = 12.0 Ω.
- Step 2: Add the series line resistance:
  • RT = R_line + Rp = 2.0 + 12.0 = 14.0 Ω.
- Step 3: Calculate total circuit line current:
  • IT = 230 / 14.0 = 16.43 A.
- Step 4: Calculate voltage drop across line cable:
  • V_drop = IT × R_line = 16.43 × 2.0 = 32.86 V.
- Step 5: Calculate actual terminal voltage at parallel board:
  • V_board = 230 - 32.86 = 197.14 V (or V_board = 16.43 × 12 = 197.16 V).

Slide 10: Summary, Circuit Comparison Table & Exam Checklist
- Series vs. Parallel Master Comparison Table (Current, Voltage, Resistance, Practical trade use).
- 4-Step Circuit Solving Strategy:
  1. Identify pure parallel sections and resolve them into single equivalent resistances.
  2. Combine remaining series resistances to find total RT.
  3. Use IT = VT / RT to find total current.
  4. Work backwards through branches using Ohm's Law and Kirchhoff's Laws.`
  },
  {
    number: 4,
    deckId: "Lesson_04_Electrical_Power_Energy_Efficiency",
    title: "Electrical Power, Energy & Efficiency",
    shortTitle: "Power, Energy & Efficiency",
    teacher: "Electrical Engineering Faculty",
    courseName: "Electrical Installation Diploma Level 2",
    slideSetId: "electrical_installation_diploma_level_2",
    starterQuestions: [
      {
        q: "Define electrical power and state its SI unit.",
        a: "Electrical power is the rate of doing work or rate of energy conversion per second. Its unit is the Watt (W, where 1 W = 1 Joule/second).",
        cue: "Definition of Power (W)"
      },
      {
        q: "State the three formulas used to calculate electrical power in DC circuits.",
        a: "1. P = V × I, 2. P = I² × R, 3. P = V² / R.",
        cue: "Triple Power Formulas"
      },
      {
        q: "What is the relationship between electrical energy (E), power (P), and time (t)?",
        a: "Energy = Power × Time: E = P × t (Joules = Watts × Seconds).",
        cue: "E = P × t"
      },
      {
        q: "Define the commercial unit of electrical energy (the kilowatt-hour, kWh).",
        a: "1 kWh is the energy converted by a 1 kW (1000 W) appliance running continuously for 1 hour (3,600 s) = 3,600,000 Joules (3.6 MJ).",
        cue: "1 kWh = 3.6 MJ"
      },
      {
        q: "State the formula for calculating percentage efficiency (η) of electrical equipment.",
        a: "Efficiency (%) = (Useful Power Output / Total Power Input) × 100%.",
        cue: "Efficiency (%) Formula"
      },
      {
        q: "Calculate the heat power dissipated by a loose terminal carrying 25 A with 0.4 Ω contact resistance.",
        a: "P = I² × R = 25² × 0.4 = 625 × 0.4 = 250 Watts of concentrated heat.",
        cue: "P = 250 W Heat"
      }
    ],
    prompt: `Create a luminous, high-clarity classroom presentation for Electrical Installation Diploma Level 2 (City & Guilds 2365 / EAL Unit 202: Principles of Electrical Science).

Exact Deck Title: "Lesson 4: Electrical Power, Energy & Efficiency"
Course: Electrical Installation Diploma Level 2 · Principles of Electrical Science
Target Audience: Vocational apprentice electricians and adult trade learners.

PEDAGOGICAL & VISUAL REQUIREMENTS:
- Aesthetic: Bright, minimalist, ultra-clean modern technology theme (pure white / light cyan backgrounds, high-contrast typography, electric cyan, cobalt blue, and warm amber accents).
- Cognitive Clarity: Zero dense text walls, clear dedicated cards, bold keywords, step-by-step boxed mathematical proofs and calculations.
- Practical Trade Application: Cable thermal ratings, commercial energy billing (kWh), motor input/output efficiency, loose termination heat dissipation.

SLIDE-BY-SLIDE CURRICULUM:
Slide 1: Title & Overview
- Title: "Electrical Power, Energy & Efficiency"
- Subtitle: "City & Guilds 2365 Level 2 Diploma in Electrical Installations · Unit 202: Principles of Electrical Science"
- Feature clean portraits and quotes from James Watt and James Prescott Joule on power and thermodynamic work.

Slide 2: Starter Activity: Knowledge Retrieval (6-Question Grid)
- 6 clean retrieval question boxes:
  1. Definition of Electrical Power and unit (Watt).
  2. The 3 electrical power formulas (P = VI, P = I²R, P = V²/R).
  3. Electrical Energy formula: E = P × t (Joules).
  4. Commercial energy unit: Kilowatt-hour (kWh).
  5. Machine efficiency equation: η = (P_out / P_in) × 100%.
  6. Challenge: Heat dissipation of 25 A through 0.4 Ω loose connection.

Slide 3: CRITICAL ENGAGING HOOK
- Title: "The £25,000 Smouldering Neutral: The Hidden Danger of I²R Losses"
- Trade Scenario: A commercial bakery distribution board began intermittently tripping. A thermal imaging survey revealed a neutral terminal glowing cherry red at 190°C!
- The Dilemma: An apprentice tightened the terminal onto cable insulation, creating a high-resistance contact point of 0.45 Ω. Under a 32 A continuous industrial oven load, the power dissipated was P = I²R = 32² × 0.45 = 460.8 Watts!
- The Consequence: 460 Watts of heat inside an enclosed space is equivalent to putting an active soldering iron into a plastic distribution board! The busbar flashed over, shutting down the entire factory and ruining £25,000 of stock.
- The Takeaway: "Power formulas are not theoretical math exercises. I²R is the direct physics behind thermal failure, electrical fires, and safe installation practice."

Slide 4: The Electrical Power Wheel & Triple Formulas
- Derivation from Ohm's Law (V = IR):
  • Base formula: P = V × I (Power = Volts × Amps).
  • Substitute V = IR: P = (I × R) × I = I² × R (vital for cable losses and heater elements).
  • Substitute I = V / R: P = V × (V / R) = V² / R (vital for constant voltage supply systems).
- Visual Power Wheel showing all 12 transpositions linking P, V, I, and R.

Slide 5: WORKED EXAMPLE 1: Sizing Commercial Heating & Shower Elements
- Problem Statement: An electric instantaneous shower is rated at 9.2 kW on a 230 V single-phase supply. Calculate the full-load operating current and the internal element resistance.
- Step 1: Identify values: P = 9,200 W, V = 230 V.
- Step 2: Calculate operating current using P = V × I → I = P / V:
  • I = 9,200 / 230 = 40.0 A.
- Step 3: Calculate element resistance using P = V² / R → R = V² / P:
  • R = 230² / 9,200 = 52,900 / 9,200 = 5.75 Ω.
- Step 4: Verification using P = I²R: 40² × 5.75 = 1,600 × 5.75 = 9,200 W.
- Step 5: Trade selection: 40 A requires a 45 A/50 A Type B MCB and minimum 10 mm² twin and earth cable depending on installation method!

Slide 6: Electrical Energy & Commercial Tariffs (kWh)
- Differentiating Power vs Energy:
  • Power is the rate of energy conversion (Watts = Joules/sec).
  • Energy is the total work done over time (Joules or Watt-hours).
- The Kilowatt-Hour (kWh):
  • 1 kWh = 1,000 Watts × 3,600 seconds = 3,600,000 Joules (3.6 MJ).
  • Electricity meters (billing units) measure kWh consumed, not instantaneous Amps or Watts!

Slide 7: WORKED EXAMPLE 2: Running Cost & Energy Consumption Analysis
- Problem Statement: A commercial warehouse installation has 60 high-bay LED luminaires, each consuming 150 W. They operate 14 hours per day, 6 days per week. The commercial electricity tariff is £0.28 per kWh. Calculate the weekly energy consumed in kWh and the weekly operating electricity bill.
- Step 1: Total connected power: P_total = 60 × 150 W = 9,000 W = 9.0 kW.
- Step 2: Weekly operating hours: Time = 14 hours/day × 6 days = 84 hours/week.
- Step 3: Total weekly energy consumed: Energy = 9.0 kW × 84 hours = 756 kWh.
- Step 4: Weekly operating cost: Cost = 756 kWh × £0.28 = £211.68 per week.
- Step 5: Energy efficiency audit: If retrofitted from 400 W metal halide lamps (24 kW), the business saves £352.80 every week!

Slide 8: Equipment Efficiency (η) & Energy Losses
- Efficiency principle: No machine is 100% efficient due to physical energy losses:
  • Copper losses (I²R heat dissipation in windings).
  • Iron/core losses (hysteresis and eddy currents in magnetic laminations).
  • Friction and windage losses (bearings and cooling fans).
- Efficiency formula: η = (Useful Output Power / Total Input Power) × 100%.
- Note: 1 Metric Horsepower (HP) = 746 Watts.

Slide 9: WORKED EXAMPLE 3: Electric Motor Input Power & Losses
- Problem Statement: A 3-phase borehole pump motor delivers 11 kW of useful mechanical shaft power. The motor has an efficiency rating of 88% (0.88). Calculate:
  1. The electrical power input required from the supply.
  2. The heat power loss dissipated into the pump housing.
  3. The energy consumed in a 10-hour continuous pumping cycle.
- Step 1: Transpose efficiency formula for input power:
  • P_in = P_out / η = 11,000 W / 0.88 = 12,500 W (12.5 kW).
- Step 2: Calculate power loss:
  • P_loss = P_in - P_out = 12,500 - 11,000 = 1,500 W (1.5 kW of heat!).
- Step 3: Calculate energy consumed:
  • Energy = 12.5 kW × 10 hours = 125 kWh.
- Step 4: Engineering insight: 1.5 kW of constant heat must be dissipated by cooling fins to prevent motor winding insulation breakdown.

Slide 10: Summary, Power Formulas Master Grid & City & Guilds Exam Practice
- Master Summary Matrix: Formula, Target Variable, Practical Example.
- Top Exam Pitfall: Forgetting to square I or V in P = I²R and P = V²/R!
- City & Guilds 202 Exam Checklist: Check unit prefixes (kW to W, hours to seconds) before calculating!`
  },
  {
    number: 6,
    deckId: "Lesson_06_Magnetism_Electromagnetism_AC_Generation",
    title: "Magnetism, Electromagnetism & 50 Hz AC Generation",
    shortTitle: "Magnetism & AC Generation",
    teacher: "Electrical Engineering Faculty",
    courseName: "Electrical Installation Diploma Level 2",
    slideSetId: "electrical_installation_diploma_level_2",
    starterQuestions: [
      {
        q: "What is magnetic flux (Φ) and magnetic flux density (B), and what are their units?",
        a: "Magnetic flux (Φ) is total magnetic field quantity (Webers, Wb). Flux density (B) is flux per unit area: B = Φ / A (Tesla, T, where 1 T = 1 Wb/m²).",
        cue: "B = Φ / A (Tesla)"
      },
      {
        q: "State Fleming's Left-Hand Rule and what application it governs.",
        a: "Fleming's Left-Hand Rule governs the Motor Effect: Thumb = Motion/Force, First finger = Magnetic Field (N→S), Second finger = Current (+→-).",
        cue: "Fleming's Left-Hand (Motors)"
      },
      {
        q: "State Faraday's Law of Electromagnetic Induction.",
        a: "When a conductor moves through a magnetic field and cuts flux lines, an EMF is induced proportional to the rate of cutting flux: E = B × l × v.",
        cue: "Faraday's Law: E = Blv"
      },
      {
        q: "What is the relationship between the peak voltage (Vpk) and RMS voltage (VRMS) of an AC sine wave?",
        a: "VRMS = 0.707 × Vpk (or Vpk = VRMS / 0.707 = 1.414 × VRMS).",
        cue: "VRMS = 0.707 × Vpk"
      },
      {
        q: "What is the standard UK mains frequency and periodic time (T)?",
        a: "Frequency = 50 Hz (50 cycles/sec). Periodic time T = 1 / f = 1 / 50 = 0.02 seconds (20 ms).",
        cue: "50 Hz / 20 ms Period"
      },
      {
        q: "State the ideal transformer voltage and turns ratio equation.",
        a: "Vp / Vs = Np / Ns = Is / Ip (voltage ratio equals turns ratio; current ratio is inverted).",
        cue: "Transformer Equation"
      }
    ],
    prompt: `Create a luminous, high-clarity classroom presentation for Electrical Installation Diploma Level 2 (City & Guilds 2365 / EAL Unit 202: Principles of Electrical Science).

Exact Deck Title: "Lesson 6: Magnetism, Electromagnetism & 50 Hz AC Generation"
Course: Electrical Installation Diploma Level 2 · Principles of Electrical Science
Target Audience: Vocational apprentice electricians and adult trade learners.

PEDAGOGICAL & VISUAL REQUIREMENTS:
- Aesthetic: Bright, minimalist, ultra-clean modern technology theme (pure white / light cyan backgrounds, high-contrast typography, electric cyan, cobalt blue, and warm amber accents).
- Cognitive Clarity: Zero dense text walls, clear dedicated cards, bold keywords, step-by-step boxed mathematical proofs and calculations.
- Practical Trade Application: Solenoid contactors, transformer step-down for site safety (110 V CTE), alternating current sine wave values, motor torque.

SLIDE-BY-SLIDE CURRICULUM:
Slide 1: Title & Overview
- Title: "Magnetism, Electromagnetism & 50 Hz AC Generation"
- Subtitle: "City & Guilds 2365 Level 2 Diploma in Electrical Installations · Unit 202: Principles of Electrical Science"
- Feature clean portraits and quotes from Michael Faraday and Nikola Tesla on electromagnetic induction and AC power.

Slide 2: Starter Activity: Knowledge Retrieval (6-Question Grid)
- 6 clean retrieval question boxes:
  1. Magnetic flux (Φ) & flux density B = Φ/A (Tesla).
  2. Fleming's Left-Hand Rule for electric motors.
  3. Faraday's Law & induced EMF (E = Blv).
  4. AC Sine Wave: RMS vs Peak voltage (0.707 factor).
  5. UK grid frequency 50 Hz & periodic time (20 ms).
  6. Transformer equation: Vp/Vs = Np/Ns = Is/Ip.

Slide 3: CRITICAL ENGAGING HOOK
- Title: "The War of the Currents: Why Faraday's Rotating Coil Conquered the World"
- Trade Scenario: Why does the UK National Grid generate and transmit alternating current (AC) at 400,000 V and step it down to 230 V in domestic dwellings, instead of using DC?
- The Dilemma: In 1882, Thomas Edison championed direct current (DC), which could not be transformed in voltage easily. DC transmission cables suffered massive I²R heat losses, meaning power plants had to be built every 1 mile!
- The Consequence: Tesla and Westinghouse proved that using Faraday's electromagnetic induction, alternating current could be stepped up to 400 kV for transmission. Stepping voltage up by 1,000× reduces current by 1,000×, slashing cable heat losses by 1,000,000× (P = I²R)!
- The Takeaway: "Electromagnetism and AC generation are the sole reasons modern power distribution, national grids, and clean electricity are viable."

Slide 4: Magnetic Flux, Flux Density & Solenoid Electromagnets
- Magnetic flux (Φ): Total number of magnetic lines of force, measured in Webers (Wb).
- Magnetic flux density (B): Flux per square metre: B = Φ / A, measured in Tesla (T).
- Electromagnetism in Solenoids:
  • Field strength H = (N × I) / l (Ampere-turns per metre).
  • Practical applications in electrical trades: Contactor coils, RCD sensing toroids, circuit breaker electromagnetic trip coils.

Slide 5: WORKED EXAMPLE 1: Magnetic Flux Density Calculation
- Problem Statement: The laminated steel core of an electrical transformer has a rectangular cross-section of 80 mm by 50 mm. The primary winding produces a total magnetic flux of 0.006 Wb. Calculate the magnetic flux density (B) within the core.
- Step 1: Calculate cross-sectional area in square metres (m²):
  • A = (80 / 1000) × (50 / 1000) = 0.08 m × 0.05 m = 0.004 m².
- Step 2: State formula: B = Φ / A.
- Step 3: Substitute values: B = 0.006 / 0.004.
- Step 4: Calculate: B = 1.5 Tesla (T).
- Step 5: Engineering check: Typical electrical transformer steel saturates between 1.4 T and 1.8 T. A value of 1.5 T indicates efficient design without magnetic core saturation!

Slide 6: The AC Generator & Sine Wave Characteristics
- Electromagnetic Generation: A single loop of conductor rotating inside a uniform magnetic field cuts flux lines at changing angles:
  • At 0°: Moving parallel to flux → zero flux cut → 0 V induced.
  • At 90°: Moving perpendicular to flux → maximum flux cut → +V_pk induced.
  • At 180°: Moving parallel → 0 V induced.
  • At 270°: Cutting flux in opposite direction → -V_pk induced.
  • At 360°: Return to start of cycle.
- Mathematical wave characteristics:
  • Periodic Time (T): Time for 1 complete cycle (T = 1 / f = 1 / 50 = 0.02 s = 20 ms).
  • Frequency (f): Number of complete cycles per second (50 Hz).

Slide 7: WORKED EXAMPLE 2: RMS, Peak, and Peak-to-Peak Values
- Problem Statement: The standard single-phase UK mains supply is specified as 230 V AC RMS at 50 Hz.
  1. Calculate the peak voltage (V_pk).
  2. Calculate the peak-to-peak voltage (V_pk-pk).
  3. Explain why insulation testing requires 500 V DC when mains is only 230 V AC.
- Step 1: Relationship: V_RMS = 0.707 × V_pk → V_pk = V_RMS / 0.707 = 230 / 0.707 = 325.3 V.
- Step 2: Peak-to-peak: V_pk-pk = 2 × V_pk = 2 × 325.3 = 650.6 V.
- Step 3: Trade explanation: Although heating and lighting effects correspond to 230 V RMS, cable insulation experiences instantaneous electrical stress up to 325.3 V on every positive and negative crest! That is why BS 7671 requires 500 V DC insulation resistance testing!

Slide 8: Transformers & Mutual Induction Principles
- Mutual Induction: An alternating current in the primary winding creates an alternating magnetic flux in the laminated iron core, which cuts the secondary winding and induces an AC voltage.
- Ideal Transformer Equation:
  • V_p / V_s = N_p / N_s = I_s / I_p
- Step-Up vs Step-Down Transformers.
- Power conservation: P_in = P_out (V_p × I_p = V_s × I_s).

Slide 9: WORKED EXAMPLE 3: Construction Site Safety Transformer (110 V CTE)
- Problem Statement: A yellow BS 7375 construction site transformer steps down 230 V single-phase mains to 110 V (55-0-55 V centre-tapped to earth). The primary winding has 920 turns.
  1. Calculate the required number of secondary turns (N_s).
  2. If the secondary supplies an 1,800 W site demolition breaker tool (at unity power factor, I_s = 16.36 A), calculate the primary supply current (I_p).
- Step 1: Calculate secondary turns: N_s = N_p × (V_s / V_p) = 920 × (110 / 230) = 440 turns.
- Step 2: Calculate primary current: I_p = I_s × (V_s / V_p) = 16.36 × (110 / 230) = 7.82 A.
- Step 3: Verification: P_in = 230 × 7.82 = 1,798.6 W ≈ 1,800 W.
- Step 4: Safety note: Because the 110 V secondary winding is centre-tapped to earth (CTE), the maximum shock voltage to earth is only 55 V!

Slide 10: Summary, Waveform Cheat Sheet & Exam Checklist
- Waveform Formula Reference Table: V_RMS = 0.707 V_pk, V_pk = 1.414 V_RMS, f = 1/T, T = 1/f.
- Transformer Rule: V and N are directly proportional; I is inversely proportional!
- City & Guilds 202 Exam Tip: Always confirm whether an exam question asks for Peak, RMS, or Peak-to-Peak voltage before answering!`
  },
  {
    number: 7,
    deckId: "Lesson_07_Electronic_Components_Control_Circuits",
    title: "Electronic Components & Control Circuits",
    shortTitle: "Electronics & Control",
    teacher: "Electrical Engineering Faculty",
    courseName: "Electrical Installation Diploma Level 2",
    slideSetId: "electrical_installation_diploma_level_2",
    starterQuestions: [
      {
        q: "What is the key electrical property of semiconductor materials like silicon?",
        a: "Semiconductors have electrical conductivity between conductors (copper) and insulators (PVC); doping creates P-type (holes) and N-type (electrons).",
        cue: "Semiconductor Physics"
      },
      {
        q: "What is the primary function of a PN junction semiconductor diode?",
        a: "A diode permits electric current flow in one direction (forward bias) while blocking current flow in the reverse direction (reverse bias).",
        cue: "Diode One-Way Valve"
      },
      {
        q: "What is the typical forward bias barrier voltage for a standard silicon diode?",
        a: "Approximately 0.6 V to 0.7 V (must be exceeded before substantial conduction occurs).",
        cue: "0.6 V - 0.7 V Barrier"
      },
      {
        q: "What component arrangement converts AC alternating current into full-wave pulsating DC?",
        a: "A Bridge Rectifier, consisting of four semiconductor diodes arranged in a diamond bridge network.",
        cue: "Bridge Rectifier"
      },
      {
        q: "What is the role of a smoothing capacitor in a DC power supply circuit?",
        a: "A capacitor stores charge during voltage peaks and discharges during troughs, smoothing AC ripple into steady DC voltage (Q = C × V).",
        cue: "Capacitor Smoothing"
      },
      {
        q: "What are the three terminals of a Bipolar Junction Transistor (BJT)?",
        a: "Base (B), Collector (C), and Emitter (E). A small base current controls a much larger collector current.",
        cue: "Base, Collector, Emitter"
      }
    ],
    prompt: `Create a luminous, high-clarity classroom presentation for Electrical Installation Diploma Level 2 (City & Guilds 2365 / EAL Unit 202: Principles of Electrical Science).

Exact Deck Title: "Lesson 7: Electronic Components & Control Circuits"
Course: Electrical Installation Diploma Level 2 · Principles of Electrical Science
Target Audience: Vocational apprentice electricians and adult trade learners.

PEDAGOGICAL & VISUAL REQUIREMENTS:
- Aesthetic: Bright, minimalist, ultra-clean modern technology theme (pure white / light cyan backgrounds, high-contrast typography, electric cyan, cobalt blue, and warm amber accents).
- Cognitive Clarity: Zero dense text walls, clear dedicated cards, bold keywords, step-by-step boxed mathematical proofs and calculations.
- Practical Trade Application: LED indicator dropper resistors, DC power supply rectification, flyback diodes protecting EV relays, thermistor sensors for heating control.

SLIDE-BY-SLIDE CURRICULUM:
Slide 1: Title & Overview
- Title: "Electronic Components & Control Circuits"
- Subtitle: "City & Guilds 2365 Level 2 Diploma in Electrical Installations · Unit 202: Principles of Electrical Science"
- Feature clean portraits and quotes from William Shockley and John Bardeen on solid-state semiconductor electronics.

Slide 2: Starter Activity: Knowledge Retrieval (6-Question Grid)
- 6 clean retrieval question boxes:
  1. Semiconductor materials (silicon, doping).
  2. PN Junction Diode one-way conduction principle.
  3. Silicon forward bias voltage barrier (0.6 V - 0.7 V).
  4. Full-wave bridge rectifier with 4 diodes.
  5. Capacitors in DC power supply smoothing (Q = CV).
  6. Transistor terminals: Base, Collector, Emitter.

Slide 3: CRITICAL ENGAGING HOOK
- Title: "The EV Charger Relay Meltdown: The £0.10 Flyback Diode That Saved a £1,200 Controller"
- Trade Scenario: An electrician installs an intelligent 7.4 kW EV chargepoint. Every time the heavy contactor turns off, the electronic control board resets and permanently destroys its microprocessor!
- The Dilemma: Magnetic field collapse across the inductive contactor coil induces an instantaneous reverse EMF voltage spike exceeding 1,200 V (Lenz's Law: e = -L di/dt).
- The Consequence: Without a reverse-biased semiconductor "flyback diode" connected across the coil, the 1,200 V spike arc-flashes across the driving transistor, instantly frying the microprocessor board.
- The Takeaway: "Modern electrical work is no longer just heavy copper and conduit; every modern building uses semiconductors to control smart relays, dimmers, solar inverters, and EV chargers."

Slide 4: Semiconductor Physics & PN Junction Diodes
- Atomic structure of Silicon (4 valence electrons) and doping (P-type with holes, N-type with free electrons).
- Forward Bias: Positive voltage connected to Anode (+), Negative to Cathode (-). Depletion layer collapses once forward threshold (0.6 V - 0.7 V) is passed.
- Reverse Bias: High resistance, only negligible leakage current flows until Peak Inverse Voltage (PIV) breakdown.
- Light Emitting Diodes (LEDs): Emitting photons when electrons recombine across the junction.

Slide 5: WORKED EXAMPLE 1: Sizing an LED Dropper Resistor
- Problem Statement: A 24 V DC industrial machinery control panel uses a high-visibility panel indicator LED rated at 2.4 V forward drop and 20 mA (0.02 A) operating current. Calculate:
  1. The resistance required for a series dropper resistor.
  2. The power dissipated by the resistor, and the required physical wattage rating.
- Step 1: Calculate voltage drop required across the resistor:
  • V_resistor = V_supply - V_LED = 24 V - 2.4 V = 21.6 V.
- Step 2: Use Ohm's Law to calculate resistance:
  • R = V_resistor / I = 21.6 V / 0.02 A = 1,080 Ω.
  • Standard E12/E24 preferred value: 1.1 kΩ (1,100 Ω) or 1.2 kΩ.
- Step 3: Calculate power dissipated by the resistor:
  • P = V × I = 21.6 V × 0.02 A = 0.432 Watts (or P = I²R = 0.02² × 1,080 = 0.432 W).
- Step 4: Trade selection: A standard 0.25 W resistor would burn out! A 1.0 Watt or 2.0 Watt rated metal-film resistor must be installed to prevent overheating.

Slide 6: AC to DC Rectification & Filtering Circuits
- Half-Wave Rectification: Single diode passes positive half-cycles; wastes negative half-cycles.
- Full-Wave Bridge Rectification: 4 diodes in a bridge arrangement steer both positive and negative AC half-cycles into unipolar pulsating DC.
- Reservoir / Smoothing Capacitors: Charge storage during voltage peaks and discharging into the load during AC zero-crossings, drastically reducing ripple voltage.

Slide 7: WORKED EXAMPLE 2: Capacitors: Electric Charge & Energy Storage
- Problem Statement: A power supply filter circuit uses a 470 μF (470 × 10⁻⁶ F) electrolytic smoothing capacitor charged to a DC bus voltage of 50 V. Calculate:
  1. The electrical charge (Q) stored in Coulombs.
  2. The electrostatic energy (W) stored in Joules.
- Step 1: Calculate stored charge: Q = C × V.
  • Q = (470 × 10⁻⁶) × 50 = 0.0235 Coulombs (23.5 mC).
- Step 2: Calculate stored energy: W = 0.5 × C × V².
  • W = 0.5 × (470 × 10⁻⁶) × 50² = 0.5 × (470 × 10⁻⁶) × 2,500 = 0.5875 Joules.
- Step 3: Safety practice: High-voltage capacitors in VFD motor inverters store lethal energy; always verify safe zero voltage with a GS38 tester after isolating!

Slide 8: Bipolar Transistors (BJT) as Solid-State Switches
- NPN Transistor operation:
  • Collector (C), Base (B), Emitter (E).
  • A tiny base current (e.g. 5 mA) controls a large collector current (e.g. 500 mA) through current gain: I_C = β × I_B.
- Solid-State switching advantages over mechanical relays: No moving parts, zero contact bounce, microsecond switching speed, infinite cycle lifespan.

Slide 9: WORKED EXAMPLE 3: Thermistor / LDR Voltage Divider Sensor Circuit
- Problem Statement: A heating control system uses a Negative Temperature Coefficient (NTC) thermistor in a potential divider circuit with a fixed 10 kΩ resistor supplied at 12 V DC.
  • At 20°C: Thermistor resistance = 10 kΩ.
  • At 5°C (frost condition): Thermistor resistance increases to 30 kΩ.
  Calculate the sensor output voltage (V_out across the fixed 10 kΩ resistor) at both temperatures.
- Step 1: Potential divider formula: V_out = V_supply × [R_fixed / (R_thermistor + R_fixed)].
- Step 2: At 20°C:
  • V_out = 12 × [10 / (10 + 10)] = 12 × (10 / 20) = 6.0 V.
- Step 3: At 5°C (frost condition):
  • V_out = 12 × [10 / (30 + 10)] = 12 × (10 / 40) = 3.0 V.
- Step 4: Practical application: When V_out drops below 4.0 V, an electronic comparator triggers a frost-protection heating boiler contactor.

Slide 10: Summary, Electronic Component Symbols & City & Guilds Exam Checklist
- Master Schematic Symbols: Diode, Zener Diode, LED, Photodiode, NPN Transistor, Capacitor, Thermistor, LDR.
- City & Guilds 202 Exam Essentials: Know forward vs reverse bias, diode dropper resistor calculation, and smoothing capacitor purpose!`
  },
  {
    number: 8,
    deckId: "Lesson_08_Electrical_Science_Review_Exam_Prep",
    title: "Electrical Science Review & Online Examination Preparation",
    shortTitle: "Unit 202 Exam Preparation",
    teacher: "Electrical Engineering Faculty",
    courseName: "Electrical Installation Diploma Level 2",
    slideSetId: "electrical_installation_diploma_level_2",
    starterQuestions: [
      {
        q: "What is the formula for conductor resistance given resistivity, length, and cross-sectional area?",
        a: "R = (ρ × l) / A (where ρ is in Ω·m, l in metres, and A in square metres m²).",
        cue: "R = (ρ × l) / A"
      },
      {
        q: "State the power formula relating potential difference and resistance.",
        a: "P = V² / R (or P = V × I, P = I² × R).",
        cue: "P = V² / R"
      },
      {
        q: "Calculate the total resistance of two parallel resistors of 20 Ω and 30 Ω.",
        a: "Product over Sum: RT = (20 × 30) / (20 + 30) = 600 / 50 = 12 Ω.",
        cue: "RT = 12 Ω"
      },
      {
        q: "What is the conversion factor from peak AC voltage to RMS voltage?",
        a: "VRMS = 0.707 × Vpk (or Vpk = VRMS × 1.414).",
        cue: "0.707 Factor"
      },
      {
        q: "State the formula for force on a conductor in a magnetic field.",
        a: "F = B × I × l (Newtons = Tesla × Amperes × Metres).",
        cue: "F = B × I × l"
      },
      {
        q: "State the formula for machine efficiency.",
        a: "Efficiency (η) = (Power Output / Power Input) × 100%.",
        cue: "η = (Pout / Pin) × 100%"
      }
    ],
    prompt: `Create a luminous, high-clarity classroom presentation for Electrical Installation Diploma Level 2 (City & Guilds 2365 / EAL Unit 202: Principles of Electrical Science).

Exact Deck Title: "Lesson 8: Electrical Science Review & Online Examination Preparation"
Course: Electrical Installation Diploma Level 2 · Principles of Electrical Science
Target Audience: Vocational apprentice electricians and adult trade learners preparing for the City & Guilds 202 multiple-choice examination.

PEDAGOGICAL & VISUAL REQUIREMENTS:
- Aesthetic: Bright, minimalist, ultra-clean modern technology theme (pure white / light cyan backgrounds, high-contrast typography, electric cyan, cobalt blue, and warm amber accents).
- Cognitive Clarity: Zero dense text walls, clear dedicated cards, bold keywords, step-by-step boxed mathematical proofs and calculations.
- Practical Trade Application: Multi-step exam calculation mastery, avoiding fatal exam traps, unit prefix conversions, formula sheets.

SLIDE-BY-SLIDE CURRICULUM:
Slide 1: Title & Overview
- Title: "Electrical Science Review & Online Examination Preparation"
- Subtitle: "City & Guilds 2365 Level 2 Diploma in Electrical Installations · Unit 202: Principles of Electrical Science"
- Feature an exam readiness overview: 40 questions, 75 minutes, closed-book, 60% pass mark.

Slide 2: Starter Activity: Knowledge Retrieval (6-Question Grid)
- 6 clean retrieval question boxes:
  1. Conductor resistance formula R = ρl/A.
  2. Power formula P = V²/R.
  3. Parallel resistance: 20 Ω and 30 Ω in parallel (12 Ω).
  4. AC Peak to RMS factor (0.707).
  5. Motor force formula: F = BIl.
  6. Machine efficiency equation: η = (P_out / P_in) × 100%.

Slide 3: CRITICAL ENGAGING HOOK
- Title: "The Fatal Exam Traps: The 4 Distractors That Catch 40% of Level 2 Candidates"
- Trade Scenario: Sitting the 40-question City & Guilds 202 multiple-choice online exam under 75-minute timed pressure.
- The Dilemma: Question: "A 230 V immersion heater has an internal resistance of 17.6 Ω. What is its power rating?"
  • Distractor A: 13.06 W (Candidate calculates V / R instead of V² / R!).
  • Distractor B: 3,000 kW (Candidate confuses W with kW!).
  • Correct Answer C: 3,000 W (3.0 kW) using P = V² / R = 230² / 17.6 = 3,002 W.
- The Consequence: Candidates who rely on memory tricks without understanding algebraic units and transposition lose 10-15 marks to engineered distractor options.
- The Takeaway: "The Unit 202 exam is not a memory contest; it is a demonstration of systematic calculation discipline and unit sanity checks."

Slide 4: Unit 202 Master Science Formula Sheet
- Complete categorised formula reference table:
  • Ohm's Law & Circuit Rules: V = IR, RT_series = R1 + R2, 1/RT_parallel = 1/R1 + 1/R2.
  • Conductor Resistivity: R = (ρ × l) / A.
  • Electrical Power & Energy: P = VI = I²R = V²/R, E = P × t.
  • Electromagnetism & Motors: B = Φ/A, F = BIl, E = Blv.
  • AC Waveforms: V_RMS = 0.707 V_pk, f = 1/T.
  • Transformers: Vp/Vs = Np/Ns = Is/Ip.
  • Mechanics: Force F = m × a, Work W = F × d, Power P = W / t.
  • Efficiency: η = (P_out / P_in) × 100%.

Slide 5: WORKED EXAM QUESTION 1: Complex Conductor Resistivity & Voltage Drop
- Question: A 230 V sub-circuit supplies an 18 A load via a 35-metre twin-core copper cable (ρ = 1.72 × 10⁻⁸ Ω·m). Conductor cross-sectional area is 2.5 mm².
  1. Calculate the resistance of a single conductor.
  2. Calculate total loop resistance (line + neutral).
  3. Calculate circuit voltage drop and verify if it complies with the BS 7671 3% lighting limit (6.9 V).
- Step 1: Conductor resistance:
  • R_line = (ρ × l) / A = (1.72 × 10⁻⁸ × 35) / (2.5 × 10⁻⁶) = 6.02 × 10⁻⁷ / 2.5 × 10⁻⁶ = 0.2408 Ω.
- Step 2: Loop resistance (line + neutral):
  • R_loop = 2 × R_line = 2 × 0.2408 = 0.4816 Ω.
- Step 3: Voltage drop:
  • V_drop = I × R_loop = 18 A × 0.4816 Ω = 8.67 V.
- Step 4: Regulatory check: 8.67 V exceeds 6.9 V (3.77% > 3%). The cable fails for a lighting circuit and must be upgraded to 4.0 mm²!

Slide 6: WORKED EXAM QUESTION 2: Combined Series-Parallel Circuit Analysis
- Question: A 12 V battery with internal resistance r = 0.5 Ω supplies two parallel resistors of 6.0 Ω and 12.0 Ω. Calculate:
  1. The equivalent resistance of the parallel combination.
  2. Total circuit resistance including battery internal resistance.
  3. Total circuit current drawn from the battery.
  4. The terminal voltage of the battery under load.
- Step 1: Parallel combination: Rp = (6 × 12) / (6 + 12) = 72 / 18 = 4.0 Ω.
- Step 2: Total resistance: RT = Rp + r = 4.0 + 0.5 = 4.5 Ω.
- Step 3: Total current: IT = E / RT = 12 / 4.5 = 2.67 A.
- Step 4: Terminal voltage: V_terminal = E - (IT × r) = 12 - (2.67 × 0.5) = 12 - 1.33 = 10.67 V.

Slide 7: WORKED EXAM QUESTION 3: Mechanical to Electrical Power Conversion
- Question: An electric goods hoist lifts a 450 kg pallet through a vertical height of 12 metres in 30 seconds. Acceleration due to gravity g = 9.81 m/s². The hoist motor operates from a 230 V single-phase supply and has an overall efficiency of 72% (0.72). Calculate:
  1. The mechanical work done in Joules.
  2. The mechanical output power of the hoist in Watts.
  3. The electrical power input drawn from the supply.
  4. The electrical current drawn by the motor.
- Step 1: Force F = m × g = 450 × 9.81 = 4,414.5 N. Work W = F × d = 4,414.5 × 12 = 52,974 Joules.
- Step 2: Mechanical power output: P_out = W / t = 52,974 / 30 = 1,765.8 W.
- Step 3: Electrical power input: P_in = P_out / η = 1,765.8 / 0.72 = 2,452.5 W.
- Step 4: Current draw: I = P_in / V = 2,452.5 / 230 = 10.66 A.

Slide 8: WORKED EXAM QUESTION 4: AC Transformer & Sine Wave Calculation
- Question: A 230 V to 24 V step-down control transformer has 1,150 turns on its primary winding.
  1. Calculate the secondary winding turns (N_s).
  2. If the secondary delivers 5.0 A to a control relay bank, calculate the primary supply current (I_p), assuming 100% efficiency.
  3. Calculate the peak value of the secondary AC voltage.
- Step 1: Secondary turns: N_s = N_p × (V_s / V_p) = 1,150 × (24 / 230) = 120 turns.
- Step 2: Primary current: I_p = I_s × (V_s / V_p) = 5.0 × (24 / 230) = 0.522 A.
- Step 3: Peak secondary voltage: V_pk = V_RMS / 0.707 = 24 / 0.707 = 33.95 V.

Slide 9: Top 10 Exam Traps & Examiner Pitfalls
- 1. Area conversions: Forgetting mm² = 10⁻⁶ m².
- 2. Diameter vs Radius: Using diameter directly in πr² without halving it first.
- 3. Power formulas: Multiplying V × R instead of dividing in P = V² / R.
- 4. Parallel resistance: Adding parallel resistors directly instead of reciprocals.
- 5. RMS vs Peak: Confusing 0.707 with 1.414.
- 6. Length of cables: Forgetting "loop" means 2 conductors (line + neutral).
- 7. Efficiency: Inverting output and input power.
- 8. Time units: Forgetting to convert minutes or hours into seconds for Joules (E = P × t).
- 9. Metric prefixes: Confusing mA (10⁻³) with μA (10⁻⁶) or kW with MW.
- 10. Formula transposition: Changing sign instead of operation across equals sign.

Slide 10: Examination Day Strategy & City & Guilds Pass Plan
- 75-Minute Time Allocation: 40 questions = ~1.8 minutes per question.
- 3-Pass Exam Method:
  • Pass 1 (0-30 mins): Answer all rapid recall theory and definition questions immediately. Flag calculations.
  • Pass 2 (30-60 mins): Complete all multi-step formula calculations systematically on rough paper.
  • Pass 3 (60-75 mins): Review flagged questions, verify unit sanity checks, ensure no unanswered questions.
- Final Encouragement: Systematic algebraic method guarantees 100% confidence on exam day!`
  }
];

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function findStudioPage(browser) {
  const contexts = browser.contexts();
  for (const ctx of contexts) {
    for (const p of ctx.pages()) {
      if (p.url().includes("3286ca38-5b3b-44b1-a429-080a12b5fb04") || p.url().includes("notebook")) {
        return p;
      }
    }
  }
  if (contexts[0] && contexts[0].pages().length > 0) {
    return contexts[0].pages()[0];
  }
  throw new Error("No open Notebook tab found on CDP port 9333.");
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
    const spinners = page.locator('mat-spinner, mat-progress-spinner, .studio-panel mat-progress-bar, .studio-panel .spinner');
    const spinCount = await spinners.count();
    for (let i = 0; i < spinCount; i++) {
      if (await spinners.nth(i).isVisible().catch(() => false)) return true;
    }
    const topCard = page.locator('artifact-library-item').first();
    if ((await topCard.count()) > 0) {
      const txt = await topCard.innerText().catch(() => "");
      if (/generating|sync\b/i.test(txt)) return true;
    }
  } catch (e) {}
  return false;
}

export async function generateLessonDeck(lessonConfig) {
  log(`=== Starting Generation for Lesson ${lessonConfig.number}: ${lessonConfig.title} ===`);
  const browser = await chromium.connectOverCDP(CDP_URL);
  const page = await findStudioPage(browser);
  await page.setViewportSize({ width: 1600, height: 1000 }).catch(() => {});

  if (!page.url().includes("3286ca38-5b3b-44b1-a429-080a12b5fb04")) {
    log(`Navigating to target notebook URL: ${TARGET_NOTEBOOK_URL}`);
    await page.goto(TARGET_NOTEBOOK_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
  }

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

  // Close viewer if open
  const openCloseBtn = page.locator('.studio-panel button[aria-label="Close slide deck"], button[aria-label="Close slide deck"]').first();
  if ((await openCloseBtn.count()) > 0 && (await openCloseBtn.isVisible().catch(() => false))) {
    log("Closing open slide deck viewer...");
    await openCloseBtn.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  if (await isGenerationVisible(page)) {
    log("An existing generation is active. Waiting for it to settle...");
    while (await isGenerationVisible(page)) {
      await page.waitForTimeout(5000);
    }
    log("Previous generation completed.");
  }

  // Ensure "Slide deck" dialog is open
  const dialogHeading = page.getByText("Customise slide deck", { exact: true });
  if (!(await dialogHeading.isVisible().catch(() => false))) {
    log("Opening 'Slide deck' creator dialog...");
    const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"], button:has-text("Slide deck")').first();
    await slideDeckBtn.waitFor({ state: "visible", timeout: 20000 });
    await slideDeckBtn.click();
    await page.waitForTimeout(1500);
    await dialogHeading.waitFor({ state: "visible", timeout: 15000 });
  }

  // Select "Presenter slides" format for luminous visual cards
  const presenterSlidesBtn = page.locator("mat-dialog-container").getByText("Presenter slides").first();
  if ((await presenterSlidesBtn.count()) > 0) {
    await presenterSlidesBtn.click().catch(() => {});
    log("Selected 'Presenter slides' format.");
    await page.waitForTimeout(500);
  }

  const promptText = lessonConfig.prompt;
  const promptBox = page.getByLabel("Describe the slide deck that you want to create", { exact: true });
  await promptBox.fill(promptText);
  log(`Injected customised prompt for Lesson ${lessonConfig.number} (${promptText.length} characters).`);
  await page.waitForTimeout(1000);

  const generateBtn = page.locator('mat-dialog-container button:has-text("Generate now"), button:has-text("Generate now")').first();
  await generateBtn.click();
  log("Clicked 'Generate now'. Generation is queued in Gemini Notebook!");

  await dialogHeading.waitFor({ state: "hidden", timeout: 30000 }).catch(() => {});
  log("Dialog closed. Monitoring generation progress in Studio...");

  const deadline = Date.now() + 15 * 60 * 1000;
  let settledChecks = 0;
  await page.waitForTimeout(6000);

  const titleWords = lessonConfig.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);

  while (Date.now() < deadline) {
    const isViewerOpen = (await page.locator('.studio-panel button[aria-label="More options"]').count()) > 0;
    if (isViewerOpen) {
      log("Slide deck viewer opened! Generation is finished.");
      break;
    }

    const isGenerating = await isGenerationVisible(page);
    const cards = page.locator("artifact-library-item");
    const currentCount = await cards.count();
    let currentTopText = "";
    if (currentCount > 0) {
      currentTopText = (await cards.first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    }

    const isTopCardGenerating = /generating|sync\b/i.test(currentTopText);
    const matchesTitle = titleWords.some(kw => currentTopText.toLowerCase().includes(kw));

    if (isGenerating || isTopCardGenerating) {
      settledChecks = 0;
      log(`Gemini Notebook is generating (${currentTopText.slice(0, 60)}...)...`);
    } else if (matchesTitle || /just now/i.test(currentTopText)) {
      settledChecks += 1;
      log(`Detected completed artifact card: "${currentTopText.slice(0, 60)}" (settled check ${settledChecks}/2)`);
      if (settledChecks >= 2) {
        log("Slide deck generation complete!");
        break;
      }
    }

    await page.waitForTimeout(5000);
  }

  await page.waitForTimeout(3000);

  // Trigger PowerPoint download
  const pptxTargetFile = path.join(PPTX_OUTPUT_DIR, `${lessonConfig.deckId}.pptx`);
  const downloadStartTime = Date.now();
  log("Triggering PowerPoint (.pptx) download...");

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
    throw new Error(`Failed to find downloaded PPTX in ${PPTX_OUTPUT_DIR}`);
  }

  if (downloadedPptx !== pptxTargetFile) {
    await fs.copyFile(downloadedPptx, pptxTargetFile);
  }

  // Close viewer
  const closeViewerBtn = page.locator('.studio-panel button[aria-label="Close slide deck"]').first();
  if ((await closeViewerBtn.count()) > 0 && (await closeViewerBtn.isVisible().catch(() => false))) {
    await closeViewerBtn.click().catch(() => {});
    await page.waitForTimeout(1500);
  }

  await browser.close();

  // Ingest deck
  await ingestLessonDeck(lessonConfig, pptxTargetFile);
}

export async function ingestLessonDeck(lessonConfig, pptxTargetFile) {
  log(`Ingesting PPTX into web decks at ${PUBLIC_DECKS_DIR}...`);
  await fs.mkdir(PUBLIC_DECKS_DIR, { recursive: true });

  const deckFolder = lessonConfig.deckId;
  const deckTargetDir = path.join(PUBLIC_DECKS_DIR, deckFolder);

  const manifest = await extractPptxDeck(pptxTargetFile, PUBLIC_DECKS_DIR, deckFolder, {
    slideSet: lessonConfig.slideSetId,
    title: `${lessonConfig.number}. ${lessonConfig.title}`,
  });
  log(`Extracted ${manifest.totalSlides} slides into ${deckTargetDir}.`);

  const manifestPath = path.join(deckTargetDir, "manifest.json");
  const currentManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  currentManifest.title = `${lessonConfig.number}. ${lessonConfig.title}`;
  currentManifest.shortTitle = lessonConfig.shortTitle;
  currentManifest.slideSet = lessonConfig.slideSetId;
  currentManifest.courseName = lessonConfig.courseName;
  currentManifest.teacher = lessonConfig.teacher;

  // Slide 1 metadata
  if (currentManifest.slides && currentManifest.slides.length >= 1) {
    currentManifest.slides[0].title = `${lessonConfig.number}. ${lessonConfig.title} (Introduction)`;
  }

  // Slide 2: Interactive 6-cell starter retrieval grid
  if (currentManifest.slides && currentManifest.slides.length >= 2) {
    const slide2 = currentManifest.slides[1];
    slide2.title = `Starter Activity: Knowledge Retrieval (${lessonConfig.shortTitle})`;
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

    slide2.reveals = lessonConfig.starterQuestions.map((sq, idx) => {
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

  // Slide 3: Trade Hook
  if (currentManifest.slides && currentManifest.slides.length >= 3) {
    currentManifest.slides[2].title = `Trade Hook: Real-World Case Study (${lessonConfig.shortTitle})`;
  }

  await fs.writeFile(manifestPath, JSON.stringify(currentManifest, null, 2), "utf8");
  log(`Updated manifest for ${deckFolder} (${currentManifest.slides.length} slides).`);
}

// CLI Runner
const args = process.argv.slice(2);
if (args[0] === "all") {
  const lessonsToRun = [2, 3, 4, 6, 7, 8];
  for (const num of lessonsToRun) {
    const lesson = UNIT_202_LESSONS.find(l => l.number === num);
    if (lesson) {
      log(`Starting batch generation for Lesson ${num}...`);
      await generateLessonDeck(lesson);
      log(`Completed generation for Lesson ${num}. Waiting 5 seconds before next...`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  log("All Unit 202 lessons successfully generated and ingested!");
  process.exit(0);
} else {
  const lessonNum = parseInt(args[0], 10) || 1;
  const selectedLesson = UNIT_202_LESSONS.find(l => l.number === lessonNum) || UNIT_202_LESSONS[0];

  generateLessonDeck(selectedLesson).then(() => {
    log(`Successfully completed generation and ingestion for Lesson ${selectedLesson.number}!`);
    process.exit(0);
  }).catch((err) => {
    console.error("Fatal error during lesson generation:", err);
    process.exit(1);
  });
}
