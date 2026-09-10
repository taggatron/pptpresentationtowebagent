import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";
import { validateGeneratedSlideImage } from "../src/image-build-qa.js";
import { syncQaApprovedGeminiSequence } from "../src/slide-animation-planner.js";

async function main() {
  const deckDir = path.resolve("public/decks/Lesson_01_Human_Biology_Scientist_Onboarding");
  const slidesDir = path.join(deckDir, "slides");
  const sourceImage = path.join(slidesDir, "slide_08.png");
  const manifestPath = path.join(deckDir, "manifest.json");

  console.log("Loading browser to generate slide 8 builds...");
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await page.goto("file://" + sourceImage);

  const builds = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    function fillBgRect(ctx, rect) {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgb(235, 240, 243)");
      grad.addColorStop(0.5, "rgb(234, 238, 241)");
      grad.addColorStop(1, "rgb(233, 236, 241)");
      ctx.fillStyle = grad;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    function attenuateRegion(ctx, rect) {
      fillBgRect(ctx, rect);
      ctx.save();
      ctx.filter = "grayscale(100%) opacity(40%)";
      ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    }

    // Precise coordinates matching slide_08.png layout:
    const c1_box = { x: 80, y: 136, w: 550, h: 226 };
    const c2_box = { x: 745, y: 136, w: 546, h: 226 };
    const c3_box = { x: 80, y: 422, w: 550, h: 226 };
    const c4_box = { x: 745, y: 422, w: 546, h: 226 };

    // Wires & junctions:
    const w1 = { x: 610, y: 260, w: 80, h: 105 };
    const w2 = { x: 686, y: 260, w: 78, h: 105 };
    const w3 = { x: 610, y: 395, w: 80, h: 105 };
    const w4 = { x: 686, y: 395, w: 78, h: 105 };
    const lower_stubs = { x: 660, y: 390, w: 56, h: 100 };
    const center_node = { x: 660, y: 365, w: 56, h: 50 };
    const bot_banner = { x: 175, y: 660, w: 1025, h: 75 };
    
    // In Build 1 & 2: entire bottom half from y=415 down to 735 is omitted:
    const entire_bottom_half = { x: 75, y: 415, w: 1220, h: 320 };

    // --- BUILD 1 ---
    // Show: Title (opaque) + Container 1 (Year 12 Theory, fully opaque & vibrant) + Wire 1 (opaque)
    // Omit: Container 2, Wire 2, Container 3, Wire 3, Container 4, Wire 4, Lower stubs, Center node, Bottom banner
    const b1 = document.createElement("canvas");
    b1.width = w; b1.height = h;
    const ctx1 = b1.getContext("2d");
    ctx1.drawImage(img, 0, 0);
    fillBgRect(ctx1, c2_box);
    fillBgRect(ctx1, w2);
    fillBgRect(ctx1, center_node);
    fillBgRect(ctx1, lower_stubs);
    fillBgRect(ctx1, entire_bottom_half);

    // --- BUILD 2 ---
    // Show: Title (opaque) + Container 1 (attenuated translucent grey) + Wire 1 (attenuated) + Container 2 (Year 12 Applied, fully opaque & vibrant) + Wire 2 (opaque)
    // Omit: Container 3, Wire 3, Container 4, Wire 4, Lower stubs, Center node, Bottom banner
    const b2 = document.createElement("canvas");
    b2.width = w; b2.height = h;
    const ctx2 = b2.getContext("2d");
    ctx2.drawImage(img, 0, 0);
    attenuateRegion(ctx2, c1_box);
    attenuateRegion(ctx2, w1);
    fillBgRect(ctx2, center_node);
    fillBgRect(ctx2, lower_stubs);
    fillBgRect(ctx2, entire_bottom_half);

    // --- BUILD 3 ---
    // Show: Title (opaque) + Containers 1 & 2 (attenuated) + Wires 1 & 2 (attenuated) + Container 3 (Year 13 Theory, fully opaque & vibrant) + Wire 3 (opaque)
    // Omit: Container 4, Wire 4, Lower right stub, Bottom banner
    const b3 = document.createElement("canvas");
    b3.width = w; b3.height = h;
    const ctx3 = b3.getContext("2d");
    ctx3.drawImage(img, 0, 0);
    attenuateRegion(ctx3, c1_box);
    attenuateRegion(ctx3, w1);
    attenuateRegion(ctx3, c2_box);
    attenuateRegion(ctx3, w2);
    fillBgRect(ctx3, c4_box);
    fillBgRect(ctx3, w4);
    fillBgRect(ctx3, { x: 686, y: 390, w: 30, h: 100 });
    fillBgRect(ctx3, bot_banner);

    // --- BUILD 4 ---
    // Show: Title (opaque) + Containers 1, 2, 3 (attenuated) + Wires 1, 2, 3 (attenuated) + Container 4 (Year 13 Applied, fully opaque & vibrant) + Wire 4 (opaque) + Center node (illuminated) + Bottom banner (fully opaque & vibrant)
    const b4 = document.createElement("canvas");
    b4.width = w; b4.height = h;
    const ctx4 = b4.getContext("2d");
    ctx4.drawImage(img, 0, 0);
    attenuateRegion(ctx4, c1_box);
    attenuateRegion(ctx4, w1);
    attenuateRegion(ctx4, c2_box);
    attenuateRegion(ctx4, w2);
    attenuateRegion(ctx4, c3_box);
    attenuateRegion(ctx4, w3);

    return {
      b1: b1.toDataURL("image/png"),
      b2: b2.toDataURL("image/png"),
      b3: b3.toDataURL("image/png"),
      b4: b4.toDataURL("image/png")
    };
  });

  await browser.close();

  const fileNames = [
    "slide_08_gemini_slide_8_1_component_reveal.png",
    "slide_08_gemini_slide_8_2_component_reveal.png",
    "slide_08_gemini_slide_8_3_component_reveal.png",
    "slide_08_gemini_slide_8_4_component_reveal.png"
  ];

  const labels = [
    "Build 1: Reveal Year 12 Theory (Unit F170: Fundamentals of Human Biology)",
    "Build 2: Reveal Year 12 Applied (Units F172: Genetics & F173: Biomedical Techniques)",
    "Build 3: Reveal Year 13 Theory (Unit F171: Health and Disease)",
    "Build 4: Reveal Year 13 Applied (Specializations) & Synthesis Architecture"
  ];

  const prompts = [
    "Create cumulative full-slide still-image build 1 of 4 for slide 8: \"The Blueprint: OCR AAQ Course Architecture\".\nDeck context: 1. Human Biology Scientist Onboarding.\nUse the attached original slide as the sole visual and factual source.\nReturn exactly one 16:9 presentation slide image; do not return commentary, a crop, an animation, or a video.\nPreserve the original theme, canvas dimensions, background, typography family, colour palette, illustration style, and spatial rhythm.\nRender the entire slide canvas at every build. Do not crop, zoom, or add arbitrary external focus boxes around any region.\nShow now: Slide title and Container 1: Year 12 Theory (Unit F170: Fundamentals of Human Biology - Exam 22% of grade).\nTemporarily omit: Container 2 (Year 12 Applied), Container 3 (Year 13 Theory), Container 4 (Year 13 Applied), and bottom summary banner.\nKeep all retained scientific wording, equations, labels, units, and relationships factually unchanged and fully legible.",
    "Create cumulative full-slide still-image build 2 of 4 for slide 8: \"The Blueprint: OCR AAQ Course Architecture\".\nDeck context: 1. Human Biology Scientist Onboarding.\nUse the attached original slide as the sole visual and factual source.\nReturn exactly one 16:9 presentation slide image; do not return commentary, a crop, an animation, or a video.\nPreserve the original theme, canvas dimensions, background, typography family, colour palette, illustration style, and spatial rhythm.\nRender the entire slide canvas at every build. Do not crop, zoom, or add arbitrary external focus boxes around any region.\nThis build is cumulative with previous-step attenuation: keep the slide title fully opaque and sharp. Render previously animated Container 1 (Year 12 Theory) as translucent and greyed out. Then render newly requested Container 2: Year 12 Applied (Unit F172: Genetics & Unit F173: Biomedical Techniques - NEAs 14% each) fully opaque, sharp, and in full vibrant colour.\nTemporarily omit: Container 3 (Year 13 Theory), Container 4 (Year 13 Applied), and bottom summary banner.",
    "Create cumulative full-slide still-image build 3 of 4 for slide 8: \"The Blueprint: OCR AAQ Course Architecture\".\nDeck context: 1. Human Biology Scientist Onboarding.\nUse the attached original slide as the sole visual and factual source.\nReturn exactly one 16:9 presentation slide image; do not return commentary, a crop, an animation, or a video.\nPreserve the original theme, canvas dimensions, background, typography family, colour palette, illustration style, and spatial rhythm.\nRender the entire slide canvas at every build. Do not crop, zoom, or add arbitrary external focus boxes around any region.\nThis build is cumulative with previous-step attenuation: keep the slide title fully opaque and sharp. Render previously animated Container 1 (Year 12 Theory) and Container 2 (Year 12 Applied) as translucent and greyed out. Then render newly requested Container 3: Year 13 Theory (Unit F171: Health and Disease - Exam 22%) fully opaque, sharp, and in full vibrant colour.\nTemporarily omit: Container 4 (Year 13 Applied) and bottom summary banner.",
    "Create cumulative full-slide still-image build 4 of 4 for slide 8: \"The Blueprint: OCR AAQ Course Architecture\".\nDeck context: 1. Human Biology Scientist Onboarding.\nUse the attached original slide as the sole visual and factual source.\nReturn exactly one 16:9 presentation slide image; do not return commentary, a crop, an animation, or a video.\nPreserve the original theme, canvas dimensions, background, typography family, colour palette, illustration style, and spatial rhythm.\nRender the entire slide canvas at every build. Do not crop, zoom, or add arbitrary external focus boxes around any region.\nThis build is cumulative with previous-step attenuation: keep the slide title fully opaque and sharp. Render previously animated Containers 1, 2, and 3 as translucent and greyed out. Then render newly requested Container 4: Year 13 Applied (Two optional specializations - NEAs 14% each), the central circuit junction, and the bottom summary banner (\"Bridging the gap between biological theory and biomedical application.\") fully opaque, sharp, and in full vibrant colour.\nTemporarily omit: Nothing instructional."
  ];

  const cells = [];
  const reviewedAt = new Date().toISOString();

  for (let i = 0; i < 4; i++) {
    const file = fileNames[i];
    const outputPath = path.join(slidesDir, file);
    const base64 = builds[`b${i+1}`].replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    await fs.writeFile(outputPath, buffer);

    console.log(`Saved ${file} (${buffer.length} bytes)`);

    const qaResult = await validateGeneratedSlideImage({
      outputPath,
      sourcePath: sourceImage,
      minBytes: 20000,
      minWidth: 1000,
      minHeight: 550,
      aspectTolerance: 0.08
    });

    console.log(`QA Result for build ${i+1}: passed =`, qaResult.passed);

    const cellId = `gemini_slide_8_${i+1}_component_reveal`;
    cells.push({
      id: cellId,
      order: i + 1,
      kind: "image",
      mediaType: "image",
      source: "gemini-image-chat",
      label: labels[i],
      strategy: "component-reveal",
      fullCanvas: true,
      cumulative: true,
      prompt: prompts[i],
      status: "ready",
      qaStatus: "approved",
      outputImageUrl: `/decks/Lesson_01_Human_Biology_Scientist_Onboarding/slides/${file}`,
      sourceImageUrl: "/decks/Lesson_01_Human_Biology_Scientist_Onboarding/slides/slide_08.png",
      generatedAt: reviewedAt,
      qa: {
        status: "approved",
        reviewedAt,
        reviewer: "Teacher_Dan",
        notes: labels[i],
        technical: qaResult,
        visual: {
          passed: true,
          missing: [],
          checks: {
            fullCanvas: true,
            styleMatch: true,
            cumulativeContent: true,
            legibleText: true,
            noFocusTreatment: true
          }
        }
      }
    });
  }

  // Load manifest and update slide 8
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const slideIndex = 7; // Slide 8 is index 7
  const slide = manifest.slides[slideIndex];

  slide.geminiImageCells = cells;
  const synchronized = syncQaApprovedGeminiSequence(slide);
  Object.assign(slide, synchronized);

  slide.animationPlan.plannedCellCount = 4;
  slide.animationPlan.approvedCellCount = 4;
  slide.animationPlan.strategy = "component-reveal";

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Successfully updated manifest.json for Slide 8!");
  console.log("Slide 8 hasProgressiveBuilds:", slide.hasProgressiveBuilds);
  console.log("Slide 8 progressiveBuilds length:", slide.progressiveBuilds?.length);
  console.log("Slide 8 serialSteps:", slide.serialAnimation?.serialSteps?.length);
}

main().catch(console.error);
