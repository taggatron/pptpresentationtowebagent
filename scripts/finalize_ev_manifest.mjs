import fs from "fs";
import path from "path";

const DECK_DIR = path.resolve("public/decks/physics_electricity_magnetism/Lesson_05_EV_Power_Calculations");
const SLIDES_DIR = path.join(DECK_DIR, "slides");

export function buildManifest() {
  if (!fs.existsSync(SLIDES_DIR)) {
    console.error("Slides dir does not exist yet:", SLIDES_DIR);
    return;
  }

  const slideFiles = fs.readdirSync(SLIDES_DIR)
    .filter(f => f.endsWith(".png"))
    .sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ""), 10);
      const numB = parseInt(b.replace(/\D/g, ""), 10);
      return numA - numB;
    });

  console.log(`Found ${slideFiles.length} rendered slide PNGs.`);

  // Rename slide-01.png or slide-1.png to standard slide_01.png format if needed
  const standardizedSlideFiles = [];
  slideFiles.forEach((file, idx) => {
    const slideNum = idx + 1;
    const stdName = `slide_${String(slideNum).padStart(2, "0")}.png`;
    const oldPath = path.join(SLIDES_DIR, file);
    const newPath = path.join(SLIDES_DIR, stdName);
    if (file !== stdName) {
      fs.renameSync(oldPath, newPath);
    }
    standardizedSlideFiles.push(stdName);
  });

  const starterQuestions = [
    { q: "What is the formula linking power, current, and voltage?", a: "P = V × I", cue: "P = V × I" },
    { q: "What is the unit of electrical power?", a: "Watt (W) = 1 Joule/second", cue: "Joules per second" },
    { q: "Calculate the power of a kettle with 230 V and 10 A.", a: "2,300 W (2.3 kW)", cue: "P = 230 × 10" },
    { q: "What formula links energy, power, and time?", a: "E = P × t", cue: "Energy = Power × time" },
    { q: "How much energy does a 2.3 kW kettle transfer in 200 seconds?", a: "460,000 J (460 kJ)", cue: "E = 2300 × 200" },
    { q: "If P = I² × R, what happens to cable heat loss if current doubles?", a: "Power quadruples (increases by 4×)", cue: "Squared relationship" }
  ];

  const standardCells = [
    { x: 9.5, y: 38.5, w: 27, h: 6.5 },
    { x: 38.0, y: 38.5, w: 27, h: 6.5 },
    { x: 66.5, y: 38.5, w: 27, h: 6.5 },
    { x: 9.5, y: 72.0, w: 27, h: 6.5 },
    { x: 38.0, y: 72.0, w: 27, h: 6.5 },
    { x: 66.5, y: 72.0, w: 27, h: 6.5 }
  ];

  const titles = [
    "The Kettle vs. The Supercharger: Decoding Electrical Power",
    "Starter Activity: Knowledge Retrieval (Electrical Power)",
    "Fundamental Formula: Power as the Rate of Energy Transfer (P = E / t)",
    "Inside the Cable: Current & Voltage Trade-offs (P = IV)",
    "The Heat Problem & Thermal Limits (P = I²R)",
    "Student Calculation Challenge: Motorway Charging Scenario",
    "Summary & Master Formula Matrix: Flow, Power & Energy",
    "Engineering Plenary & Real-World Grid Demands"
  ];

  const slides = standardizedSlideFiles.map((file, idx) => {
    const slideNum = idx + 1;
    const title = titles[idx] || `Slide ${slideNum}`;
    const slideObj = {
      number: slideNum,
      title: title,
      imageFileName: file,
      imageUrl: `/decks/physics_electricity_magnetism/Lesson_05_EV_Power_Calculations/slides/${file}`,
      sourceMediaPath: `ppt/media/${file}`,
      isInteractive: false,
      interactiveType: null
    };

    if (slideNum === 2) {
      slideObj.isInteractive = true;
      slideObj.interactiveType = "question_reveal";
      slideObj.reveals = starterQuestions.map((sq, qIdx) => {
        const b = standardCells[qIdx] || standardCells[0];
        return {
          id: `reveal_s2_cell_${qIdx + 1}`,
          question: `${qIdx + 1}. ${sq.q}`,
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

  const manifestPath = path.join(DECK_DIR, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Saved manifest to ${manifestPath} (${slides.length} slides)`);
}

if (process.argv[1] && process.argv[1].endsWith("finalize_ev_manifest.mjs")) {
  buildManifest();
}
