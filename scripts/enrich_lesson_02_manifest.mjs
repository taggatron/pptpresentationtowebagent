import fs from "node:fs/promises";
import path from "node:path";

const manifestPath = path.resolve("public/decks/physics_electricity_magnetism/Lesson_02_Circuits/manifest.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

manifest.title = "2. Electrical Circuits – What Causes That Light Bulb Moment?";
manifest.shortTitle = "Electric Circuits";
manifest.courseName = "GCSE Physics: Electricity and Magnetism";
manifest.teacher = "Greg";
manifest.practicalsCount = 1;

// Define detailed titles and descriptions for each slide
const slideMetadata = [
  {
    number: 1,
    title: "Lesson 2: Electrical Circuits – What Causes That Light Bulb Moment?",
    cognitiveGuide: {
      estimatedTimeSeconds: 30,
      timeGuideDisplay: "30s",
      vciScore: "2.1",
      complexityCategory: "Low",
      ragLevel: "green",
      ragColor: "emerald",
      ragLabel: "Title & Hook"
    }
  },
  {
    number: 2,
    title: "The Starter Vault: Unlocking the Circuit (Knowledge Retrieval)",
    isInteractive: true,
    interactiveType: "question_reveal",
    cognitiveGuide: {
      estimatedTimeSeconds: 300,
      timeGuideDisplay: "5–10 min",
      vciScore: "4.5",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Active Retrieval"
    },
    reveals: [
      {
        id: "reveal_s2_cell_1",
        question: "1. Physics: Define static electricity.",
        expectedAnswer: "Build-up and separation of electrical charge carried by electrons, caused by friction.",
        bounds: { x: 3.2, y: 10.5, w: 30.0, h: 41.5 },
        answerBounds: { x: 4.5, y: 18.0, w: 14.5, h: 18.0 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_s2_cell_2",
        question: "2. Physics: What force causes hair to stand on end when rubbed with a balloon?",
        expectedAnswer: "Electrostatic repulsion (like charges repel).",
        bounds: { x: 34.8, y: 10.5, w: 30.0, h: 41.5 },
        answerBounds: { x: 36.0, y: 19.0, w: 10.0, h: 13.0 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_s2_cell_3",
        question: "3. Chemistry: Calculate the Rf value of a chromatography spot.",
        expectedAnswer: "Rf = distance moved by spot ÷ distance moved by solvent (e.g. 4 cm ÷ 10 cm = 0.4).",
        bounds: { x: 66.4, y: 10.5, w: 30.0, h: 41.5 },
        answerBounds: { x: 79.5, y: 28.5, w: 15.5, h: 11.0 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_s2_cell_4",
        question: "4. Biology: What are the main parts of natural selection?",
        expectedAnswer: "Variation (mutations), Selection pressure, Survival of the fittest, Inheritance of advantageous alleles.",
        bounds: { x: 3.2, y: 53.0, w: 30.0, h: 41.5 },
        answerBounds: { x: 4.5, y: 61.5, w: 19.0, h: 10.0 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_s2_cell_5",
        question: "5. Chemistry: Describe metallic bonding.",
        expectedAnswer: "Regular lattice of positive metal ions surrounded by a sea of delocalised electrons.",
        bounds: { x: 34.8, y: 53.0, w: 30.0, h: 41.5 },
        answerBounds: { x: 36.0, y: 61.5, w: 10.0, h: 18.0 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      },
      {
        id: "reveal_s2_cell_6",
        question: "6. Today's Challenge: What exactly causes that 'light bulb moment' in a circuit?",
        expectedAnswer: "Potential difference pushes delocalised electrons through a wire against resistance, transferring electrical energy into light and heat.",
        bounds: { x: 66.4, y: 53.0, w: 30.0, h: 41.5 },
        answerBounds: { x: 67.5, y: 64.5, w: 18.5, h: 12.0 },
        revealMode: "blur",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: true,
        answerIsBaked: true
      }
    ]
  },
  {
    number: 3,
    title: "The Microscopic Gauntlet: Inside the Wire",
    cognitiveGuide: {
      estimatedTimeSeconds: 90,
      timeGuideDisplay: "1–2 min",
      vciScore: "3.2",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Atomic Mechanism"
    }
  },
  {
    number: 4,
    title: "The Driving Force: Chemical Pumps and Electrical Waterfalls",
    cognitiveGuide: {
      estimatedTimeSeconds: 120,
      timeGuideDisplay: "2 min",
      vciScore: "3.5",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Battery & Analogy"
    }
  },
  {
    number: 5,
    title: "The Paradox: Why 50,000 Volts Tickles, but 230 Volts Kills",
    cognitiveGuide: {
      estimatedTimeSeconds: 120,
      timeGuideDisplay: "2 min",
      vciScore: "3.8",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Voltage vs Current"
    }
  },
  {
    number: 6,
    title: "The Three Core Quantities of Dynamic Electricity (I, V, R)",
    cognitiveGuide: {
      estimatedTimeSeconds: 150,
      timeGuideDisplay: "2–3 min",
      vciScore: "4.1",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Definitions & Units"
    }
  },
  {
    number: 7,
    title: "The Language of Engineers: Standard Circuit Symbols",
    cognitiveGuide: {
      estimatedTimeSeconds: 90,
      timeGuideDisplay: "1–2 min",
      vciScore: "2.9",
      complexityCategory: "Low",
      ragLevel: "green",
      ragColor: "emerald",
      ragLabel: "Symbols & Context"
    }
  },
  {
    number: 8,
    title: "60-Second Challenge: Symbol Snap (Pair & Share)",
    cognitiveGuide: {
      estimatedTimeSeconds: 60,
      timeGuideDisplay: "60s",
      vciScore: "3.0",
      complexityCategory: "Low",
      ragLevel: "green",
      ragColor: "emerald",
      ragLabel: "Active Practice"
    }
  },
  {
    number: 9,
    title: "The Measurement Matrix: Interrogating the Circuit (Ammeter & Voltmeter)",
    cognitiveGuide: {
      estimatedTimeSeconds: 120,
      timeGuideDisplay: "2 min",
      vciScore: "3.6",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Series vs Parallel"
    }
  },
  {
    number: 10,
    title: "Core Practical Setup: Filament Lamp Characteristics (PAG P6)",
    cognitiveGuide: {
      estimatedTimeSeconds: 180,
      timeGuideDisplay: "3 min",
      vciScore: "4.2",
      complexityCategory: "High",
      ragLevel: "high",
      ragColor: "rose",
      ragLabel: "Practical Method"
    }
  },
  {
    number: 11,
    title: "The Data: I-V Characteristics of a Filament Lamp",
    cognitiveGuide: {
      estimatedTimeSeconds: 180,
      timeGuideDisplay: "3 min",
      vciScore: "4.4",
      complexityCategory: "High",
      ragLevel: "high",
      ragColor: "rose",
      ragLabel: "Graph Analysis"
    }
  },
  {
    number: 12,
    title: "Synthesis: The Blueprint & The River (Micro, Macro, & Math)",
    cognitiveGuide: {
      estimatedTimeSeconds: 120,
      timeGuideDisplay: "2 min",
      vciScore: "3.7",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Plenary Synthesis"
    }
  },
  {
    number: 13,
    title: "Interactive Practical: Circuit Construction Workbench",
    isInteractive: false,
    interactiveType: "web_embed",
    webEmbed: {
      url: "/interactives/physics/circuit_builder.html",
      title: "Interactive Practical: Circuit Construction Workbench",
      label: "Interactive Circuit Workbench"
    },
    cognitiveGuide: {
      estimatedTimeSeconds: 300,
      timeGuideDisplay: "5–10 min",
      vciScore: "4.8",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Interactive Simulation"
    }
  }
];

manifest.slides = manifest.slides.map((slide, idx) => {
  const meta = slideMetadata.find(m => m.number === slide.number) || {};
  return {
    ...slide,
    ...meta
  };
});

manifest.totalSlides = manifest.slides.length;

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
console.log(`Successfully enriched manifest.json for ${manifest.id} with ${manifest.totalSlides} slides.`);
