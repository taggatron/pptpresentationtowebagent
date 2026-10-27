import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const DECK_DIR = path.resolve("./public/decks/andragogical_inclusion");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const OUTPUT_DIR = path.resolve("./output/powerpoints_andragogical_inclusion");

const SLIDE_METADATA = [
  {
    number: 1,
    title: "Andragogical Inclusion: Title & Framing",
    notes: "Welcome colleagues. Emphasise that this room holds decades of front-line pedagogical wisdom. We are not delivering a deficit-model training session; we are interrogating institutional assumptions together to elevate learning for every adult."
  },
  {
    number: 2,
    title: "Knowles’ Andragogy Meets Critical Equity",
    notes: "Knowles assumed an unencumbered, autonomous adult. In reality, mature students carry socioeconomic precarity, systemic microaggressions, or past academic scarring. We must design psychological safety intentionally."
  },
  {
    number: 3,
    title: "The Inclusion Marketplace: 5 Adult Learning Barriers",
    notes: "Frame these not as student deficits, but as structural interfaces. Every barrier represents an institutional design friction that thoughtful pedagogy can alleviate."
  },
  {
    number: 4,
    title: "Marketplace Task: Friction vs. Inclusive Flow",
    notes: "Encourage radical candour. Green notes celebrate practical frontline genius; Amber notes pinpoint where university policies or assumptions create unnecessary roadblocks."
  },
  {
    number: 5,
    title: "Applied Case Studies: Choose Your Analytical Lens",
    notes: "Choice in professional development mirrors choice in adult learning. Give participants autonomy to select the challenge that directly stretches their domain expertise."
  },
  {
    number: 6,
    title: "Case Study A: Psychological Safety in Clinical Audiology",
    notes: "Provocation: How do we move from compliance-based classroom management to professional self-regulation in high-stakes practicals?"
  },
  {
    number: 7,
    title: "Case Study B: Workload-Sustainable HyFlex Equity in Health",
    notes: "Provocation: How can we offer genuine temporal flexibility without creating unsustainable 60-hour working weeks for faculty?"
  },
  {
    number: 8,
    title: "Case Study C: Multiple Means of Expression in Level 5 Coaching",
    notes: "Provocation: Does academic rigour live in the 3,000-word written essay, or does it live in the depth of critical evaluation demonstrated?"
  },
  {
    number: 9,
    title: "Next Week's Redesign: Differentiated Action Brief",
    notes: "No one leaves with abstract theory. This slide bridges professional dialogue into immediate classroom operational change."
  },
  {
    number: 10,
    title: "Redesign Protocols: Developing vs. Stretching Practice",
    notes: "Highlight that experienced teachers need space to wrestle with complex edge cases, while newer colleagues benefit from immediate, high-leverage procedural templates."
  },
  {
    number: 11,
    title: "Plenary Choice Board: Choose Your Exit Commitment",
    notes: "Thank colleagues for their vulnerability and expertise. Remind everyone that inclusive andragogy is not an endpoint or checklist—it is an ongoing scholarly discipline practiced in community."
  }
];

async function main() {
  await fs.mkdir(SLIDES_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log("Connecting to Edge on CDP port 9334 at 1920x1080...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log("Navigating to interactive presentation...");
  await page.goto("http://localhost:3000/interactives/andragogical_inclusion.html", {
    waitUntil: "networkidle"
  });

  // Inject presentation snapshot styling:
  // Hide headers, navbars, drawers, and let .slide-stage fill the exact 1920x1080 canvas
  await page.addStyleTag({
    content: `
      body {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: #f8fafc !important;
      }
      header, footer, .notes-drawer, .notes-backdrop {
        display: none !important;
      }
      main {
        max-width: 100vw !important;
        width: 100vw !important;
        height: 100vh !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .slide-stage {
        border-radius: 0 !important;
        border: none !important;
        box-shadow: none !important;
        width: 1920px !important;
        height: 1080px !important;
        min-height: 1080px !important;
        max-height: 1080px !important;
        aspect-ratio: auto !important;
        background: radial-gradient(circle at top right, rgba(239, 246, 255, 0.8), transparent 50%),
                    radial-gradient(circle at bottom left, rgba(240, 253, 244, 0.6), transparent 45%),
                    #ffffff !important;
      }
      .slide {
        padding: 56px 72px !important;
        height: 100% !important;
        box-sizing: border-box !important;
      }
      .slide-title {
        font-size: 42px !important;
        margin-bottom: 12px !important;
      }
      .slide-subtitle {
        font-size: 22px !important;
        margin-bottom: 34px !important;
      }
      .content-card {
        padding: 28px 30px !important;
      }
      .card-title {
        font-size: 21px !important;
      }
      .bullet-list li {
        font-size: 17px !important;
        line-height: 1.55 !important;
      }
      .provocation-banner {
        padding: 20px 26px !important;
        margin-top: 24px !important;
      }
      .provocation-text {
        font-size: 17px !important;
      }
      table {
        font-size: 14.5px !important;
      }
      th {
        padding: 12px 18px !important;
        font-size: 15px !important;
      }
      td {
        padding: 10px 18px !important;
      }
      .choice-card {
        padding: 30px !important;
      }
      .choice-title {
        font-size: 21px !important;
      }
      .choice-desc {
        font-size: 16px !important;
      }
    `
  });

  const slides = [];

  for (const meta of SLIDE_METADATA) {
    const slideNum = meta.number;
    const slideId = `slide-${slideNum}`;
    const slideFileName = `slide_${String(slideNum).padStart(2, "0")}.png`;
    const slideFilePath = path.join(SLIDES_DIR, slideFileName);

    console.log(`Rendering Slide ${slideNum}: ${meta.title}...`);

    // Switch active slide
    await page.evaluate((id) => {
      document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
      const target = document.getElementById(id);
      if (target) target.classList.add("active");
    }, slideId);

    await page.waitForTimeout(400);

    const stage = page.locator(".slide-stage");
    await stage.screenshot({
      path: slideFilePath,
      type: "png"
    });

    console.log(`Saved slide image: ${slideFilePath}`);

    slides.push({
      number: slideNum,
      title: meta.title,
      imageFileName: slideFileName,
      imageUrl: `/decks/andragogical_inclusion/slides/${slideFileName}`,
      isInteractive: false,
      interactiveType: null,
      speakerNotes: meta.notes
    });
  }

  await page.close();

  // Clean out any orphaned slides beyond 11
  const existingFiles = await fs.readdir(SLIDES_DIR);
  for (const f of existingFiles) {
    const match = f.match(/slide_(\d+)\.png/);
    if (match && parseInt(match[1], 10) > SLIDE_METADATA.length) {
      await fs.unlink(path.join(SLIDES_DIR, f)).catch(() => {});
      console.log(`Removed old extra slide: ${f}`);
    }
  }

  // Write updated manifest.json
  const manifest = {
    id: "andragogical_inclusion",
    slideSet: "staff_cpd",
    title: "Andragogical Inclusion: A Professional Knowledge Exchange",
    filename: "Andragogical_Inclusion_CPD.pptx",
    totalSlides: SLIDE_METADATA.length,
    slides: slides
  };

  const manifestPath = path.join(DECK_DIR, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Updated manifest.json with 11 light & bright slides!");

  // Generate genuine 16:9 PowerPoint file using python-pptx
  console.log("Generating 16:9 PowerPoint (.pptx) with embedded speaker notes...");
  const pptxScript = `
import os
import pptx
from pptx.util import Inches

prs = pptx.Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

slides_data = ${JSON.stringify(slides)}

for s in slides_data:
    slide = prs.slides.add_slide(blank_layout)
    img_path = os.path.join("${SLIDES_DIR}", s["imageFileName"])
    slide.shapes.add_picture(img_path, 0, 0, width=prs.slide_width, height=prs.slide_height)
    if s.get("speakerNotes"):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = s["speakerNotes"]

output_pptx = os.path.join("${OUTPUT_DIR}", "Andragogical_Inclusion_CPD.pptx")
prs.save(output_pptx)
print("Successfully generated:", output_pptx)
`;

  await fs.writeFile("/tmp/build_pptx.py", pptxScript, "utf8");
  execSync("python3 /tmp/build_pptx.py", { stdio: "inherit" });

  console.log("All 11 light & bright slides rendered and packaged into PPTX successfully!");
}

main().catch(err => {
  console.error("Render error:", err);
  process.exit(1);
});
