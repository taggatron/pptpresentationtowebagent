import fs from "fs";
import path from "path";

const DECK_DIR = path.resolve("public/decks/physics_electricity_magnetism/Lesson_05_EV_Power_Calculations");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

const slideTitles = [
  "The Physics of Ultra-Rapid EV Charging",
  "Activating Your Physics Toolkit: 6-Question Starter Grid",
  "The 152 Kettle Puzzle: The 60-Second Hook",
  "Power Dictates Charging Speed (P = E / t)",
  "The Physics Inside the Battery: Charge Flow (Q = It) & Energy (E = QV)",
  "The Heat Trap: The Physics of Dissipated Energy (P = I²R)",
  "The Voltage Solution: Outsmarting Resistance (400V vs. 800V)",
  "Where Does the Lost Energy Go? (Sankey Diagram & Cable Cooling)",
  "The Examiner's Trap: Units & Significant Figures",
  "The EV Charging Network Matrix: Voltage, Current, Power & Time",
  "Step-by-Step: The 6-Mark Exam Challenge (Interlocking Formulas)",
  "The Engineering Toolkit: Interlocking Equation Synthesis Map"
];

const reveals = [
  {
    id: "reveal_s2_cell_1",
    question: "1. What formula links electrical charge (Q), current (I), and time (t)?",
    expectedAnswer: "Q = I × t (Coulombs = Amps × seconds)",
    bounds: { x: 10.0, y: 33.5, w: 33.0, h: 6.0 },
    answerBounds: { x: 10.0, y: 33.5, w: 33.0, h: 6.0 },
    revealMode: "overlay",
    confidence: 1,
    provenance: "user-adjusted",
    locked: true,
    answerVisibleInImage: false,
    answerIsBaked: false
  },
  {
    id: "reveal_s2_cell_2",
    question: "2. What is the unit of electrical power, and what does 1 Watt equal in energy per second?",
    expectedAnswer: "Watt (W) = 1 Joule per second (1 J/s)",
    bounds: { x: 57.0, y: 33.5, w: 33.0, h: 6.0 },
    answerBounds: { x: 57.0, y: 33.5, w: 33.0, h: 6.0 },
    revealMode: "overlay",
    confidence: 1,
    provenance: "user-adjusted",
    locked: true,
    answerVisibleInImage: false,
    answerIsBaked: false
  },
  {
    id: "reveal_s2_cell_3",
    question: "3. What equation links energy transferred (E), charge (Q), and potential difference (V)?",
    expectedAnswer: "E = Q × V (Joules = Coulombs × Volts)",
    bounds: { x: 10.0, y: 62.5, w: 33.0, h: 6.0 },
    answerBounds: { x: 10.0, y: 62.5, w: 33.0, h: 6.0 },
    revealMode: "overlay",
    confidence: 1,
    provenance: "user-adjusted",
    locked: true,
    answerVisibleInImage: false,
    answerIsBaked: false
  },
  {
    id: "reveal_s2_cell_4",
    question: "4. A domestic kettle operates on 230 V mains and draws 10 A. Calculate its power rating.",
    expectedAnswer: "2,300 W (2.3 kW)",
    bounds: { x: 62.0, y: 62.5, w: 23.0, h: 6.0 },
    answerBounds: { x: 62.0, y: 62.5, w: 23.0, h: 6.0 },
    revealMode: "overlay",
    confidence: 1,
    provenance: "user-adjusted",
    locked: true,
    answerVisibleInImage: false,
    answerIsBaked: false
  },
  {
    id: "reveal_s2_cell_5",
    question: "5. How much electrical energy is transferred when a 2.3 kW kettle boils water for 200 seconds?",
    expectedAnswer: "460,000 J (460 kJ)",
    bounds: { x: 15.0, y: 88.5, w: 23.0, h: 6.0 },
    answerBounds: { x: 15.0, y: 88.5, w: 23.0, h: 6.0 },
    revealMode: "overlay",
    confidence: 1,
    provenance: "user-adjusted",
    locked: true,
    answerVisibleInImage: false,
    answerIsBaked: false
  },
  {
    id: "reveal_s2_cell_6",
    question: "6. If electrical current through a charging cable doubles, by what factor does resistive heat loss increase?",
    expectedAnswer: "Power quadruples (increases 4×)",
    bounds: { x: 57.0, y: 88.5, w: 33.0, h: 6.0 },
    answerBounds: { x: 57.0, y: 88.5, w: 33.0, h: 6.0 },
    revealMode: "overlay",
    confidence: 1,
    provenance: "user-adjusted",
    locked: true,
    answerVisibleInImage: false,
    answerIsBaked: false
  }
];

const slides = slideTitles.map((title, idx) => {
  const slideNum = idx + 1;
  const fileName = `slide_${String(slideNum).padStart(2, "0")}.png`;
  const slideObj = {
    number: slideNum,
    title: title,
    imageFileName: fileName,
    imageUrl: `/decks/physics_electricity_magnetism/Lesson_05_EV_Power_Calculations/slides/${fileName}`,
    sourceMediaPath: `ppt/media/${fileName}`,
    isInteractive: false,
    interactiveType: null
  };

  if (slideNum === 2) {
    slideObj.isInteractive = true;
    slideObj.interactiveType = "question_reveal";
    slideObj.reveals = reveals;
  }

  return slideObj;
});

const manifest = {
  id: "Lesson_05_EV_Power_Calculations",
  title: "5. Electrical Power & EV Charging Calculations",
  slideSet: "physics_electricity_magnetism",
  courseName: "GCSE Physics: Electricity and Magnetism",
  filename: "Lesson_05_EV_Power_Calculations.pptx",
  totalSlides: slides.length,
  teacher: "Dan",
  practicalsCount: 1,
  slides: slides
};

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
console.log(`Successfully generated manifest.json for ${slides.length} slides.`);
