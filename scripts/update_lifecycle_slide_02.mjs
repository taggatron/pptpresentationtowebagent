import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const slide02Path = path.join(
  projectRoot,
  "public/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_analysis/slides/slide_02.png"
);
const backupSlide02Path = path.join(
  projectRoot,
  "public/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_analysis/slides/slide_02.orig.png"
);
const overlayPath = path.join(projectRoot, "scratch/new_title_overlay.png");

async function main() {
  console.log("=== Updating Slide 2 Title to 'Life cycle analysis - should I buy a new iphone?' ===");

  // 1. Back up original if not already done
  if (!fs.existsSync(backupSlide02Path)) {
    fs.copyFileSync(slide02Path, backupSlide02Path);
    console.log(`Backed up original slide 2 to: ${backupSlide02Path}`);
  }

  // 2. Render new title overlay with Playwright
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 2880, height: 1620 } });

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 2880px;
        height: 1620px;
        background: transparent;
        font-family: 'Amatic SC', cursive;
        font-weight: 700;
      }
      .title-container {
        position: absolute;
        top: 172px;
        left: 0;
        width: 2880px;
        text-align: center;
      }
      .title {
        display: inline-block;
        font-size: 140px;
        line-height: 1;
        letter-spacing: 0.02em;
        white-space: nowrap;
      }
      .red {
        color: #ea3323;
        text-decoration: underline;
        text-decoration-color: #ea3323;
        text-decoration-thickness: 6px;
        text-underline-offset: 14px;
      }
      .black {
        color: #212121;
        text-decoration: underline;
        text-decoration-color: #212121;
        text-decoration-thickness: 6px;
        text-underline-offset: 14px;
      }
    </style>
  </head>
  <body>
    <div class="title-container">
      <div class="title">
        <span class="red">Life cycle analysis - </span><span class="black">should I buy a new iphone?</span>
      </div>
    </div>
  </body>
  </html>`;

  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: overlayPath, omitBackground: true });
  await browser.close();
  console.log("Rendered title overlay to:", overlayPath);

  // 3. Composite onto slide_02.png using Python PIL
  const pythonScript = `
from PIL import Image

slide_path = '${slide02Path}'
backup_path = '${backupSlide02Path}'
overlay_path = '${overlayPath}'

# Load backup original to ensure repeatable, non-degraded generation
base = Image.open(backup_path).convert('RGBA')
overlay = Image.open(overlay_path).convert('RGBA')

# Clear old title area (y: 160 to 350) with pristine white
white_patch = Image.new('RGBA', (base.width, 190), (255, 255, 255, 255))
base.paste(white_patch, (0, 160))

# Composite title overlay
result = Image.alpha_composite(base, overlay)
result.save(slide_path, format='PNG')
print("Successfully saved updated slide_02.png")
`;

  execSync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
  console.log("✓ Slide 2 image updated successfully!");
}

main().catch(err => {
  console.error("Error updating slide 2:", err);
  process.exit(1);
});
