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

  const manifestPath = path.join(targetDir, "manifest.json");
  let previousManifest = null;
  try {
    previousManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch {
    // This is a new conversion.
  }

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
      const relationshipTags = relsXml.match(/<Relationship\b[^>]*>/g) || [];
      const imageRelationship = relationshipTags.find((tag) => {
        const type = tag.match(/\bType="([^"]+)"/)?.[1] || "";
        const target = tag.match(/\bTarget="([^"]+)"/)?.[1] || "";
        return (
          type.endsWith("/image") &&
          /^\.\.\/media\//.test(target) &&
          /\.(?:png|jpe?g|gif|bmp|tiff?|webp|emf|wmf)$/i.test(target)
        );
      });
      const imageTarget = imageRelationship?.match(/\bTarget="\.\.\/media\/([^"]+)"/)?.[1];
      if (imageTarget) {
        targetImage = `ppt/media/${imageTarget}`;
      }
    }

    if (targetImage && entries.has(targetImage)) {
      const ext = path.extname(targetImage) || ".png";
      const outSlideFileName = `slide_${String(slideNum).padStart(2, "0")}${ext}`;
      const outSlidePath = path.join(slidesDir, outSlideFileName);
      
      await extractZipEntryToFile(pptxPath, entries.get(targetImage), outSlidePath);

      const extractedSlide = {
        number: slideNum,
        title:
          slideNum === 2
            ? "Starter Activity: Knowledge Retrieval"
            : `Slide ${slideNum}`,
        imageFileName: outSlideFileName,
        imageUrl: `/decks/${deckId}/slides/${outSlideFileName}`,
        sourceMediaPath: targetImage,
        isInteractive: false,
        interactiveType: null
      };

      const previousSlide = previousManifest?.slides?.find(
        (candidate) =>
          candidate.imageFileName === outSlideFileName ||
          candidate.sourceMediaPath === targetImage ||
          candidate.number === slideNum
      );
      slides.push(
        previousSlide
          ? {
              ...previousSlide,
              ...extractedSlide,
              // Preserve authored titles; the extractor's generic title is
              // only useful when no analysis or manual title exists.
              title: previousSlide.title || extractedSlide.title
            }
          : extractedSlide
      );
    }
  }

  const manifest = {
    ...(previousManifest || {}),
    id: deckId,
    title:
      previousManifest?.title ||
      fileName.replace(/^Lesson_\d+_\d*_?/, "").replace(/_/g, " "),
    filename: path.basename(pptxPath),
    totalSlides: slides.length,
    slides
  };

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
