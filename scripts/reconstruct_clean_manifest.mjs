import fs from "fs";
import path from "path";

const deckDir = "public/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited";
const manifestPath = path.join(deckDir, "manifest.json");

// Read current manifest and 2d9e8ed manifest
const currentManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const baseManifest = JSON.parse(fs.readFileSync("scratch/manifest_2d9e8ed.json", "utf8"));

// 1. Slide 1 (Title)
const slide1 = baseManifest.slides[0];

// 2. Slide 2 (Starter Grid) - use the current updated interactive slide 2
const slide2 = currentManifest.slides.find(s => s.number === 2);

// 3. Slide 3 (Learning Objectives)
const slide3 = baseManifest.slides[2];

// 4. Slide 4 (Somatic vs Germline) - 2d9e8ed index 3
const slide4 = baseManifest.slides[3];

// 5. Slide 5 (Triggers UV/Tobacco) - 2d9e8ed index 4
const slide5 = baseManifest.slides[4];

// 6. Slide 6 (Substitutions) - 2d9e8ed index 5
const slide6 = baseManifest.slides[5];

// 7. Slide 7 (Sickle cell / missense) - 2d9e8ed index 6
const slide7 = baseManifest.slides[6];

// 8. Slide 8 (The Frameshift Collapse) - 2d9e8ed index 7
const slide8 = baseManifest.slides[7];

// 9. Slide 9 (Interactive Sequence Mutation Analysis) - 2d9e8ed index 8
const slide9 = baseManifest.slides[8];

// 10. Slide 10 (TP53 Understanding Check) - 2d9e8ed index 9
const slide10 = {
  ...baseManifest.slides[9],
  number: 10,
  imageFileName: "slide_10.png",
  imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_10.png"
};

// 11. Slide 11 (Huntington locus & protein) - 2d9e8ed index 10
const slide11 = {
  ...baseManifest.slides[10],
  number: 11,
  imageFileName: "slide_11.png",
  imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_11.png"
};

// 12. Slide 12 (Molecular Stutter: CAG Repeat Expansion) - 2d9e8ed index 11
const slide12 = {
  ...baseManifest.slides[11],
  number: 12,
  imageFileName: "slide_12.png",
  imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_12.png"
};

// 13. Slide 13 (DNA Replication Slippage) - find in currentManifest
const slippageSlide = currentManifest.slides.find(s => s.title && s.title.includes("DNA Replication Slippage"));
const slide13 = {
  ...slippageSlide,
  number: 13,
  imageFileName: "slide_13.png",
  imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_13.png"
};

// 14. Slide 14 (Diagnostic Thresholds) - was 2d9e8ed index 12 (slide_13) -> now slide_14.png
const slide14 = {
  ...baseManifest.slides[12],
  number: 14,
  imageFileName: "slide_14.png",
  imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_14.png",
  geminiImageCells: baseManifest.slides[12].geminiImageCells ? baseManifest.slides[12].geminiImageCells.map(c => ({
    ...c,
    id: c.id.replace(/slide_\d+/, "slide_14"),
    sourceImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_14.png"
  })) : []
};

// 15. Slide 15 (Genetic Anticipation) - was 2d9e8ed index 13 (slide_14) -> now slide_15.png
const slide15 = {
  ...baseManifest.slides[13],
  number: 15,
  imageFileName: "slide_15.png",
  imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_15.png",
  geminiImageCells: baseManifest.slides[13].geminiImageCells ? baseManifest.slides[13].geminiImageCells.map(c => ({
    ...c,
    id: c.id.replace(/slide_\d+/, "slide_15"),
    sourceImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_15.png"
  })) : []
};

// 16. Slide 16 (Cellular Pathophysiology) - was 2d9e8ed index 14 (slide_15) -> now slide_16.png
const slide16 = {
  ...baseManifest.slides[14],
  number: 16,
  imageFileName: "slide_16.png",
  imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_16.png",
  geminiImageCells: baseManifest.slides[14].geminiImageCells ? baseManifest.slides[14].geminiImageCells.map(c => ({
    ...c,
    id: c.id.replace(/slide_\d+/, "slide_16"),
    sourceImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_16.png"
  })) : []
};

// 17. Slide 17 (Clinical Phenotype & Inheritance) - was 2d9e8ed index 15 (slide_16) -> now slide_17.png
const slide17 = {
  ...baseManifest.slides[15],
  number: 17,
  imageFileName: "slide_17.png",
  imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_17.png",
  geminiImageCells: baseManifest.slides[15].geminiImageCells ? baseManifest.slides[15].geminiImageCells.map(c => ({
    ...c,
    id: c.id.replace(/slide_\d+/, "slide_17"),
    sourceImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_17.png"
  })) : []
};

// 18. Slide 18 (NEA Pass Criteria P3: Genetic Variation Causal Chain)
const neaSlide = currentManifest.slides.find(s => s.title && s.title.includes("NEA Pass Criteria"));
const slide18 = {
  ...neaSlide,
  number: 18,
  imageFileName: "slide_18.png",
  imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_18.png",
  geminiImageCells: [
    {
      id: "gemini_slide_18_1_component_reveal",
      order: 1,
      kind: "image",
      mediaType: "image",
      source: "gemini-image-chat",
      label: "Build 1: Complete the instructional build",
      strategy: "component-reveal",
      fullCanvas: true,
      cumulative: true,
      prompt: "NEA Pass Criteria P3: Genetic Variation to Huntington's Disease Causal Chain",
      status: "planned",
      qaStatus: "approved",
      outputImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_18.png",
      sourceImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_18.png"
    }
  ]
};

// 19. Slide 19 (Plenary Summary) - was 2d9e8ed index 16 (slide_17) -> now slide_19.png
const slide19 = {
  ...baseManifest.slides[16],
  number: 19,
  title: "Plenary Summary",
  imageFileName: "slide_19.png",
  imageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_19.png",
  geminiImageCells: [
    {
      id: "gemini_slide_19_1_component_reveal",
      order: 1,
      kind: "image",
      mediaType: "image",
      source: "gemini-image-chat",
      label: "Build 1: Complete the instructional build",
      strategy: "component-reveal",
      fullCanvas: true,
      cumulative: true,
      prompt: "Plenary Summary",
      status: "planned",
      qaStatus: "approved",
      outputImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_19.png",
      sourceImageUrl: "/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited/slides/slide_19.png"
    }
  ]
};

const cleanSlides = [
  slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9,
  slide10, slide11, slide12, slide13, slide14, slide15, slide16, slide17, slide18, slide19
];

currentManifest.totalSlides = 19;
currentManifest.slides = cleanSlides;

fs.writeFileSync(manifestPath, JSON.stringify(currentManifest, null, 2), "utf8");
console.log("Successfully reconstructed clean manifest.json!");
cleanSlides.forEach((s, idx) => console.log(idx + 1, "number:", s.number, "title:", s.title, "img:", s.imageFileName));
