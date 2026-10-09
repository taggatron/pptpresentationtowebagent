import fs from "node:fs/promises";
import path from "node:path";
import yauzl from "yauzl";
import { createWriteStream } from "node:fs";

const PROJECT_ROOT = process.cwd();
const PPTX_SOURCE = path.resolve(PROJECT_ROOT, "GCSE_Electrical_Circuits.pptx");
const NOTEBOOK_AGENT_OUTPUT = "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/NotebookLMagent/output/powerpoints_physics_electricity_magnetism";
const PUBLIC_DECKS_DIR = path.resolve(PROJECT_ROOT, "public/decks/physics_electricity_magnetism");
const VERCEL_STATIC_DIR = path.resolve(PROJECT_ROOT, ".vercel/output/static/decks/physics_electricity_magnetism");

const DECK_ID = "Lesson_02_Circuits_Alternative";
const DECK_DIR = path.join(PUBLIC_DECKS_DIR, DECK_ID);
const SLIDES_DIR = path.join(DECK_DIR, "slides");

async function extractZipEntryToFile(zipPath, entry, targetFilePath) {
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      zipfile.openReadStream(entry, (err, readStream) => {
        if (err) return reject(err);
        const writeStream = createWriteStream(targetFilePath);
        readStream.pipe(writeStream);
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
    });
  });
}

async function main() {
  console.log(`Starting ingestion of ${PPTX_SOURCE} into ${DECK_DIR}...`);

  await fs.mkdir(SLIDES_DIR, { recursive: true });

  // 1. Read PPTX and map slides to images
  const entries = new Map();
  await new Promise((resolve, reject) => {
    yauzl.open(PPTX_SOURCE, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        entries.set(entry.fileName, entry);
        zipfile.readEntry();
      });
      zipfile.on("end", resolve);
      zipfile.on("error", reject);
    });
  });

  const slideNumbers = [];
  for (const [entryName] of entries) {
    const match = entryName.match(/^ppt\/slides\/_rels\/slide(\d+)\.xml\.rels$/);
    if (match) {
      slideNumbers.push(parseInt(match[1], 10));
    }
  }
  slideNumbers.sort((a, b) => a - b);
  console.log(`Found ${slideNumbers.length} slides in PPTX.`);

  const slidesMeta = [
    {
      num: 1,
      title: "Lesson 2: Electrical Circuits – What Causes That Light Bulb Moment?",
      desc: "GCSE Physics (Gateway Science) Core Practical Focus: Lesson title and introductory framing."
    },
    {
      num: 2,
      title: "Releasing the Charges: The Spark of Current",
      desc: "Connecting static electricity (charge separation trapped on insulators) to current electricity (continuous flow in closed loops)."
    },
    {
      num: 3,
      title: "Starter Activity: Knowledge Retrieval (Electrical Circuits)",
      desc: "Interactive 6-question retrieval grid reviewing static electricity, natural selection, electrostatic repulsion, metallic bonding, Rf calculation, and the light bulb moment."
    },
    {
      num: 4,
      title: "Learning Objectives & Keyword Toolkit",
      desc: "Define (V, I, R), Construct (simple DC circuits), Challenge (apply Ohm's Law V = I × R)."
    },
    {
      num: 5,
      title: "The Microscopic Mechanism of Conduction",
      desc: "Delocalised electron drift and metal lattice resistance causing radiant light and heat in filaments."
    },
    {
      num: 6,
      title: "The Engine: How a Battery Works",
      desc: "Chemical charge separation establishing electrical potential difference and continuous electron propulsion."
    },
    {
      num: 7,
      title: "The Great Paradox: 'Current Kills'",
      desc: "High Voltage (50,000 V static spark) vs High Current (230 V lethal mains electricity)."
    },
    {
      num: 8,
      title: "The Three Core Quantities: Current, Voltage & Resistance",
      desc: "Formulas (Q=It, V=E/Q, V=IR) and analogies (river flow, waterfall drop, pinched hosepipe)."
    },
    {
      num: 9,
      title: "The Universal Language of Circuits",
      desc: "Essential schematic symbols grid (cell, battery, switch, lamp, ammeter, voltmeter, resistors, thermistor, LDR, diode, LED, fuse) and microchip scale design."
    },
    {
      num: 10,
      title: "Challenge: Symbol Snap (Component Matching)",
      desc: "Speed challenge pairing physical components with universal abstract schematic symbols."
    },
    {
      num: 11,
      title: "The Golden Rules of Measurement",
      desc: "Ammeter in series (flow rate); Voltmeter in parallel (potential difference drop)."
    },
    {
      num: 12,
      title: "Core Practical: Filament Lamp Characteristics",
      desc: "Constructing a DC circuit with variable resistor to measure I-V curve of a filament lamp."
    },
    {
      num: 13,
      title: "The Anatomy of a Light Bulb Moment",
      desc: "Full synthesis: Chemical engine, potential difference, delocalised current, filament resistance, and radiant light dissipation."
    }
  ];

  const slides = [];

  for (const slideNum of slideNumbers) {
    const relsEntry = entries.get(`ppt/slides/_rels/slide${slideNum}.xml.rels`);
    let targetImage = `ppt/media/image${slideNum}.png`;
    if (relsEntry) {
      // Find actual image target
      // Usually image<N>.png
    }

    const outSlideFileName = `slide_${String(slideNum).padStart(2, "0")}.png`;
    const outSlidePath = path.join(SLIDES_DIR, outSlideFileName);

    if (entries.has(targetImage)) {
      await extractZipEntryToFile(PPTX_SOURCE, entries.get(targetImage), outSlidePath);
      console.log(`Extracted Slide ${slideNum} -> ${outSlideFileName}`);
    } else {
      console.warn(`Warning: ${targetImage} not found in zip!`);
    }

    const info = slidesMeta.find((m) => m.num === slideNum) || {
      num: slideNum,
      title: `Slide ${slideNum}`,
      desc: ""
    };

    const slideObj = {
      number: slideNum,
      title: info.title,
      imageFileName: outSlideFileName,
      imageUrl: `/decks/physics_electricity_magnetism/${DECK_ID}/slides/${outSlideFileName}`,
      sourceMediaPath: targetImage,
      isInteractive: false,
      interactiveType: null
    };

    // Configure Slide 3 as interactive question reveal (Knowledge Retrieval)
    if (slideNum === 3) {
      const revealCells = [
        {
          id: "reveal_s3_cell_1",
          question: "1. Physics: Define static electricity.",
          expectedAnswer: "Build-up and separation of electrical charge carried by electrons, caused by friction.",
          bounds: { x: 3.2, y: 10.5, w: 30.0, h: 41.5 },
          answerBounds: { x: 4.5, y: 22.0, w: 25.0, h: 18.0 },
          revealMode: "blur",
          confidence: 1,
          provenance: "user-adjusted",
          locked: true,
          answerVisibleInImage: true,
          answerIsBaked: true
        },
        {
          id: "reveal_s3_cell_2",
          question: "2. Physics: What force causes hair to stand on end rubbed with a balloon?",
          expectedAnswer: "Electrostatic repulsion.",
          bounds: { x: 34.8, y: 10.5, w: 30.0, h: 41.5 },
          answerBounds: { x: 36.5, y: 25.0, w: 25.0, h: 12.0 },
          revealMode: "blur",
          confidence: 1,
          provenance: "user-adjusted",
          locked: true,
          answerVisibleInImage: true,
          answerIsBaked: true
        },
        {
          id: "reveal_s3_cell_3",
          question: "3. Chemistry: How do you calculate the Rf value of a chromatography spot?",
          expectedAnswer: "Distance moved by spot ÷ distance moved by solvent.",
          bounds: { x: 66.4, y: 10.5, w: 30.0, h: 41.5 },
          answerBounds: { x: 68.0, y: 28.0, w: 26.0, h: 14.0 },
          revealMode: "blur",
          confidence: 1,
          provenance: "user-adjusted",
          locked: true,
          answerVisibleInImage: true,
          answerIsBaked: true
        },
        {
          id: "reveal_s3_cell_4",
          question: "4. Biology: What are the main parts of natural selection?",
          expectedAnswer: "Variation, Selection pressure, Survival, Inheritance.",
          bounds: { x: 3.2, y: 53.0, w: 30.0, h: 41.5 },
          answerBounds: { x: 4.5, y: 69.0, w: 25.0, h: 18.0 },
          revealMode: "blur",
          confidence: 1,
          provenance: "user-adjusted",
          locked: true,
          answerVisibleInImage: true,
          answerIsBaked: true
        },
        {
          id: "reveal_s3_cell_5",
          question: "5. Chemistry: Draw or describe metallic bonding.",
          expectedAnswer: "Regular lattice of positive metal ions surrounded by a sea of delocalised electrons.",
          bounds: { x: 34.8, y: 53.0, w: 30.0, h: 41.5 },
          answerBounds: { x: 36.5, y: 72.0, w: 25.0, h: 18.0 },
          revealMode: "blur",
          confidence: 1,
          provenance: "user-adjusted",
          locked: true,
          answerVisibleInImage: true,
          answerIsBaked: true
        },
        {
          id: "reveal_s3_cell_6",
          question: "6. Challenge: What causes the 'light bulb moment' in a circuit?",
          expectedAnswer: "Potential difference from a power source pushes delocalised electrons through the filament wire against resistance.",
          bounds: { x: 66.4, y: 53.0, w: 30.0, h: 41.5 },
          answerBounds: { x: 68.0, y: 69.0, w: 26.0, h: 20.0 },
          revealMode: "blur",
          confidence: 1,
          provenance: "user-adjusted",
          locked: true,
          answerVisibleInImage: true,
          answerIsBaked: true
        }
      ];
      slideObj.isInteractive = true;
      slideObj.interactiveType = "question_reveal";
      slideObj.reveals = revealCells;
      slideObj.interactiveCells = revealCells;
    }

    slides.push(slideObj);
  }

  const manifest = {
    id: DECK_ID,
    title: "2. Electrical Circuits (Alternative) – What Causes That Light Bulb Moment?",
    shortTitle: "Electrical Circuits (Alt)",
    slideSet: "physics_electricity_magnetism",
    courseName: "GCSE Physics: Electricity and Magnetism",
    teacher: "Greg",
    practicalsCount: 1,
    filename: `${DECK_ID}.pptx`,
    totalSlides: slides.length,
    slides
  };

  const manifestPath = path.join(DECK_DIR, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Saved manifest to ${manifestPath}`);

  // Copy PPTX to deck folder
  const pptxDestInDeck = path.join(DECK_DIR, `${DECK_ID}.pptx`);
  await fs.copyFile(PPTX_SOURCE, pptxDestInDeck);
  console.log(`Copied PPTX to ${pptxDestInDeck}`);

  // Copy PPTX to NotebookLMagent output folder
  try {
    await fs.mkdir(NOTEBOOK_AGENT_OUTPUT, { recursive: true });
    const pptxDestInAgent = path.join(NOTEBOOK_AGENT_OUTPUT, `${DECK_ID}.pptx`);
    await fs.copyFile(PPTX_SOURCE, pptxDestInAgent);
    console.log(`Copied PPTX to ${pptxDestInAgent}`);
  } catch (err) {
    console.warn("Could not copy to NotebookLMagent output:", err.message);
  }

  // Sync to .vercel/output/static/decks/physics_electricity_magnetism
  try {
    const vercelDeckDir = path.join(VERCEL_STATIC_DIR, DECK_ID);
    const vercelSlidesDir = path.join(vercelDeckDir, "slides");
    await fs.mkdir(vercelSlidesDir, { recursive: true });
    await fs.copyFile(manifestPath, path.join(vercelDeckDir, "manifest.json"));
    for (const slide of slides) {
      await fs.copyFile(
        path.join(SLIDES_DIR, slide.imageFileName),
        path.join(vercelSlidesDir, slide.imageFileName)
      );
    }
    console.log(`Synced deck to Vercel output: ${vercelDeckDir}`);
  } catch (err) {
    console.warn("Could not sync to Vercel output:", err.message);
  }

  console.log("Ingestion completed successfully!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
