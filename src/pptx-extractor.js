import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import yauzl from "yauzl";

/**
 * Extracts whole-slide images and metadata from a PPTX deck.
 */
export async function extractPptxDeck(pptxPath, outputBaseDir) {
  const fileName = path.basename(pptxPath, ".pptx");
  const deckId = fileName;
  const targetDir = path.join(outputBaseDir, deckId);
  const slidesDir = path.join(targetDir, "slides");

  await fs.mkdir(slidesDir, { recursive: true });

  const slideImageMap = new Map(); // slideNumber -> zipImagePath
  const entries = new Map();

  await new Promise((resolve, reject) => {
    yauzl.open(pptxPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);

      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        entries.set(entry.fileName, entry);
        zipfile.readEntry();
      });
      zipfile.on("end", () => resolve());
      zipfile.on("error", reject);
    });
  });

  // Find slide relationship mappings slide1.xml.rels -> image target
  const slideNumbers = [];
  for (const [entryName] of entries) {
    const match = entryName.match(/^ppt\/slides\/_rels\/slide(\d+)\.xml\.rels$/);
    if (match) {
      slideNumbers.push(parseInt(match[1], 10));
    }
  }
  slideNumbers.sort((a, b) => a - b);

  const slides = [];

  for (const slideNum of slideNumbers) {
    const relsEntryName = `ppt/slides/_rels/slide${slideNum}.xml.rels`;
    const relsEntry = entries.get(relsEntryName);
    
    let targetImage = null;
    if (relsEntry) {
      const relsXml = await extractZipEntryToString(pptxPath, relsEntry);
      const imgMatch = relsXml.match(/Target="\.\.\/media\/([^"]+)"/);
      if (imgMatch) {
        targetImage = `ppt/media/${imgMatch[1]}`;
      }
    }

    if (targetImage && entries.has(targetImage)) {
      const ext = path.extname(targetImage) || ".png";
      const outSlideFileName = `slide_${String(slideNum).padStart(2, "0")}${ext}`;
      const outSlidePath = path.join(slidesDir, outSlideFileName);
      
      await extractZipEntryToFile(pptxPath, entries.get(targetImage), outSlidePath);

      slides.push({
        number: slideNum,
        title:
          slideNum === 2
            ? "Starter Activity: Knowledge Retrieval"
            : `Slide ${slideNum}`,
        imageFileName: outSlideFileName,
        imageUrl: `/decks/${deckId}/slides/${outSlideFileName}`,
        sourceMediaPath: targetImage,
        isInteractive: slideNum === 2, // Slide 2 is starter activity Q&A grid by default
        interactiveType: slideNum === 2 ? "starter_qa_grid" : null
      });
    }
  }

  const manifest = {
    id: deckId,
    title: fileName.replace(/^Lesson_\d+_\d*_?/, "").replace(/_/g, " "),
    filename: path.basename(pptxPath),
    totalSlides: slides.length,
    slides
  };

  const manifestPath = path.join(targetDir, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`[PPTX Extractor] Successfully extracted ${slides.length} slides for ${deckId}`);
  return manifest;
}

function extractZipEntryToString(zipPath, entry) {
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      zipfile.openReadStream(entry, (err, readStream) => {
        if (err) return reject(err);
        let data = "";
        readStream.on("data", (chunk) => { data += chunk.toString("utf8"); });
        readStream.on("end", () => resolve(data));
        readStream.on("error", reject);
      });
    });
  });
}

function extractZipEntryToFile(zipPath, entry, targetFilePath) {
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
