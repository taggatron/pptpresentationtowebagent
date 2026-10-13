import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DECK_ID = "Lesson_09_Genetics_NEA_Task_1_Huntingtons_Case_Study_Revision";
const DECK_DIR = path.resolve(`public/decks/genetics_aaq/${DECK_ID}`);
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

const SRC_WWW = path.resolve("scratch/feedback_slides/feedback_www.png");
const SRC_EBI = path.resolve("scratch/feedback_slides/feedback_ebi.png");

async function main() {
  console.log("=== Step 1: Shift existing slide images (14 down to 3) by +2 ===");
  for (let i = 14; i >= 3; i--) {
    const oldName = `slide_${String(i).padStart(2, "0")}.png`;
    const newName = `slide_${String(i + 2).padStart(2, "0")}.png`;
    const oldPath = path.join(SLIDES_DIR, oldName);
    const newPath = path.join(SLIDES_DIR, newName);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${oldName} -> ${newName}`);
    }
  }

  console.log("=== Step 2: Copy new feedback slides into positions 3 and 4 ===");
  fs.copyFileSync(SRC_WWW, path.join(SLIDES_DIR, "slide_03.png"));
  fs.copyFileSync(SRC_EBI, path.join(SLIDES_DIR, "slide_04.png"));
  console.log("Copied feedback_www.png -> slide_03.png");
  console.log("Copied feedback_ebi.png -> slide_04.png");

  console.log("=== Step 3: Update manifest.json ===");
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  manifest.totalSlides = 16;

  const originalSlides = manifest.slides;
  const newSlides = [];

  // Slide 1 (Title)
  newSlides.push(originalSlides[0]);

  // Slide 2 (Starter Grid)
  newSlides.push(originalSlides[1]);

  // Slide 3 (WWW Feedback)
  const slide3 = {
    number: 3,
    title: "Whole-Class Feedback: What Went Well",
    imageFileName: "slide_03.png",
    imageUrl: `/decks/genetics_aaq/${DECK_ID}/slides/slide_03.png`,
    isInteractive: false,
    interactiveType: null,
    cognitiveGuide: {
      estimatedTimeSeconds: 180,
      timeGuideDisplay: "3 min",
      vciScore: "2.8",
      complexityCategory: "Moderate",
      ragLevel: "low",
      ragColor: "green",
      ragLabel: "Formative Review",
      breakdown: {
        visualGistMs: 300,
        visualScanMs: 1200,
        readingMs: 2500,
        semanticProcessingMs: 14000,
        wordCount: 175,
        visualElementsCount: 6
      },
      academicReferences: [
        {
          citation: "Black, P., & Wiliam, D. (1998). Assessment and classroom learning. Assessment in Education: Principles, Policy & Practice, 5(1), 7-74.",
          relevance: "Emphasizes diagnostic formative whole-class feedback to consolidate foundational conceptual understanding."
        },
        {
          citation: "Hattie, J., & Timperley, H. (2007). The power of feedback. Review of Educational Research, 77(1), 81-112.",
          relevance: "Frames feedback around feed-up, feedback, and feed-forward to accelerate coursework attainment."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "manifest-text"
    }
  };
  newSlides.push(slide3);

  // Slide 4 (EBI Feedback)
  const slide4 = {
    number: 4,
    title: "Whole-Class Feedback: Even Better If (Moving to M2/D2)",
    imageFileName: "slide_04.png",
    imageUrl: `/decks/genetics_aaq/${DECK_ID}/slides/slide_04.png`,
    isInteractive: false,
    interactiveType: null,
    cognitiveGuide: {
      estimatedTimeSeconds: 240,
      timeGuideDisplay: "4 min",
      vciScore: "3.2",
      complexityCategory: "Moderate",
      ragLevel: "medium",
      ragColor: "amber",
      ragLabel: "Evaluation Scaffold",
      breakdown: {
        visualGistMs: 350,
        visualScanMs: 1400,
        readingMs: 2800,
        semanticProcessingMs: 18000,
        wordCount: 190,
        visualElementsCount: 8
      },
      academicReferences: [
        {
          citation: "Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257.",
          relevance: "Uses structured 4-stage evaluation scaffolds (Evidence-Explanation-Limitation-Judgement) to prevent extraneous cognitive overload."
        },
        {
          citation: "Sadler, D. R. (1989). Formative assessment and the design of instructional systems. Instructional Science, 18(2), 119-144.",
          relevance: "Provides explicit quality exemplars showing the gap between descriptive narrative and evaluative critique."
        }
      ]
    },
    questionAnalysis: {
      detected: false,
      confidence: "low",
      questionCount: 0,
      detectionSource: "manifest-text"
    }
  };
  newSlides.push(slide4);

  // Renumber remaining slides (indices 2..13 become slides 5..16)
  for (let i = 2; i < originalSlides.length; i++) {
    const s = originalSlides[i];
    const newNum = s.number + 2;
    const newFileName = `slide_${String(newNum).padStart(2, "0")}.png`;
    const newUrl = `/decks/genetics_aaq/${DECK_ID}/slides/${newFileName}`;
    newSlides.push({
      ...s,
      number: newNum,
      imageFileName: newFileName,
      imageUrl: newUrl,
      geminiImageCells: s.geminiImageCells ? s.geminiImageCells.map(c => ({
        ...c,
        id: c.id.replace(/slide_\d+/, `slide_${newNum}`),
        sourceImageUrl: newUrl,
        outputImageUrl: c.outputImageUrl ? newUrl : null
      })) : []
    });
  }

  manifest.slides = newSlides;
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Updated manifest.json with 16 slides!");

  console.log("=== Step 4: Update PPTX presentation with python-pptx ===");
  const pyScript = `
import os
import shutil
from pptx import Presentation
from PIL import Image

pptx_path = "${DECK_DIR}/${DECK_ID}.pptx"
prs = Presentation(pptx_path)

# Add WWW slide
blank_layout = prs.slide_layouts[6]
slide_www = prs.slides.add_slide(blank_layout)
slide_www.shapes.add_picture("${SRC_WWW}", 0, 0, prs.slide_width, prs.slide_height)

# Add EBI slide
slide_ebi = prs.slides.add_slide(blank_layout)
slide_ebi.shapes.add_picture("${SRC_EBI}", 0, 0, prs.slide_width, prs.slide_height)

# Reorder slides: move last two added slides to indices 2 and 3
sldIdLst = prs.slides._sldIdLst
s_www = sldIdLst[-2]
s_ebi = sldIdLst[-1]
sldIdLst.remove(s_www)
sldIdLst.remove(s_ebi)
sldIdLst.insert(2, s_www)
sldIdLst.insert(3, s_ebi)

prs.save(pptx_path)
print("Saved updated PPTX with 16 slides to", pptx_path)

# Copy to NotebookLMagent output folder as well
agent_pptx_path = os.path.abspath("../NotebookLMagent/output/powerpoints_aaq_genetics/${DECK_ID}.pptx")
if os.path.exists(os.path.dirname(agent_pptx_path)):
    shutil.copyfile(pptx_path, agent_pptx_path)
    print("Copied to", agent_pptx_path)

# Generate unified 16-page PDF using PIL
print("=== Step 5: Generate unified 16-page PDF ===")
pdf_path = "${DECK_DIR}/${DECK_ID}.pdf"
images = []
for i in range(1, 17):
    img_file = f"${SLIDES_DIR}/slide_{i:02d}.png"
    img = Image.open(img_file).convert("RGB")
    images.append(img)

images[0].save(pdf_path, save_all=True, append_images=images[1:], resolution=150.0)
print("Generated 16-page PDF at", pdf_path)
`;

  fs.writeFileSync("scratch/update_pptx_and_pdf.py", pyScript, "utf8");
  execSync("python3 scratch/update_pptx_and_pdf.py", { stdio: "inherit" });

  console.log("=== All steps completed successfully! ===");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
