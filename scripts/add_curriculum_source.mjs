import { chromium } from "playwright";

const SOURCE_TITLE = "10-Week Photography Course Schedule: Dates & Core Topics";
const SOURCE_CONTENT = `# 10-Week Adult Photography Course: Comprehensive Schedule, Dates & Core Topics

## Course Overview & Term Schedule
- **Institution**: South Devon College (Adult Creative Arts & Photography)
- **Course Title**: An Introduction to Photography — 10-Week Master Curriculum
- **Format**: Weekly Evening Sessions (Thursdays, 18:30 – 21:00)
- **Academic Term**: Autumn Term 2026 (October – December 2026)

---

## Detailed Weekly Schedule: Dates & Core Topics

### Week 1 — Thursday, 8 October 2026
**Core Topic: Composition Viewpoints & Camera Familiarisation**
- **Perspective & Viewpoints**:
  * Bird’s-eye view (High angle / overhead overview, graphic and geometric framing)
  * Worm’s-eye view (Low angle, imposing scale, dynamic ground-level perspective)
  * Eye-level perspective (Direct engagement, neutral intimacy, human-scale connection)
  * Through-view photography (Framing through architectural elements, doorways, foliage, and natural apertures)
- **Technical & Practical Skills**:
  * Camera familiarisation: physical controls, dials, grips, lens mounting, battery & SD card care
  * Safe practice in the field and studio: neck strap etiquette, secure equipment handling
  * Introductory image review: baseline portfolio discussion and creative goals

---

### Week 2 — Thursday, 15 October 2026
**Core Topic: Composition Rule of Thirds & Leading Lines**
- **Compositional Principles**:
  * Rule of Thirds: 3x3 grid alignment, placing subjects at intersection focal points
  * Leading Lines: Utilizing roads, pathways, architectural edges, rivers, and fences to direct the viewer’s eye
  * Visual Balance: Symmetrical vs asymmetrical balance, negative space, and visual weight
  * Natural Framing: Enclosing focal points with environmental elements
- **Field & Studio Work**:
  * Practical composition challenges: capturing 3 distinct framing scenarios within the campus/grounds

---

### Week 3 — Thursday, 22 October 2026
**Core Topic: The Exposure Triangle — Aperture, Shutter Speed & ISO Fundamentals**
- **Exposure Mechanics**:
  * Introduction to the Exposure Triangle: balancing Aperture, Shutter Speed, and ISO for balanced exposure
  * Aperture & Depth of Field: wide apertures (f/1.8, f/2.8) for shallow depth of field and bokeh; narrow apertures (f/8, f/16) for edge-to-edge sharpness
  * Shutter Speed & Motion: freezing fast motion (1/1000s) vs capturing creative motion blur (1/15s)
  * ISO & Image Noise: base sensitivity (ISO 100) for clean image files vs high ISO (ISO 3200+) and managing digital grain/noise

---

*(Note: Autumn Half-Term Break — Thursday, 29 October 2026 — No formal session)*

---

### Week 4 — Thursday, 5 November 2026
**Core Topic: Applying Exposure in Dynamic Light & Basic Image Adjustments**
- **Practical Exposure Mastery**:
  * Applying exposure settings in changing and low-light environments
  * Freezing or blurring motion intentionally under variable conditions
  * Controlling depth of field in outdoor vs indoor lighting scenarios
  * Balancing ISO against available shutter speeds to prevent camera shake
- **Digital Darkroom**:
  * Introduction to digital workflow: importing RAW/JPEG files
  * Basic non-destructive image adjustments: exposure compensation, white balance, contrast, and highlight/shadow recovery

---

### Week 5 — Thursday, 12 November 2026
**Core Topic: Natural and Studio Portraiture**
- **Lighting & Aesthetics**:
  * Available light portraiture: window light, golden hour, open shade, and diffusers
  * Posing & Direction: relaxed, natural posing, head tilts, and body positioning
  * Backgrounds & Subject Isolation: choosing complementary backgrounds and avoiding visual distractions
  * Introductory Studio Lighting: key light, fill light, rim light, and softboxes
- **Ethics & Professionalism**:
  * Safe and respectful portrait practice: model consent, comfort, and collaborative creative direction

---

### Week 6 — Thursday, 19 November 2026
**Core Topic: Abstract & Macro Photography**
- **Close-Up & Creative Vision**:
  * Close-up and macro techniques: minimum focusing distance, macro lenses, and extension tubes
  * Exploring Texture, Pattern, and Shape: transforming microscopic everyday surfaces into abstract art
  * Selective Focus: razor-thin depth of field to isolate minute details
  * Creative Interpretation of Everyday Objects: seeing the extraordinary in ordinary items

---

### Week 7 — Thursday, 26 November 2026
**Core Topic: Landscape & Architecture Photography**
- **Environmental Composition**:
  * Horizon placement: high vs low horizon and dramatic sky vs textured foreground
  * Foreground interest: anchor stones, foliage, leading boardwalks, and depth cues
  * Architectural perspective: linear perspective, vertical convergence, and keystoning correction
  * Symmetry & Lines: reflections, repetitive arches, and structural patterns
- **Technical Stability**:
  * Natural light dynamics: directional side-light, Golden Hour, and Blue Hour
  * Camera stability: tripod usage, 2-second timer release, and image stabilization settings

---

### Week 8 — Thursday, 3 December 2026
**Core Topic: Shadows, Silhouettes, Dappled Light & Reflection**
- **Light & Shadow Dynamics**:
  * High-contrast photography: exposing for highlights and embracing deep shadows
  * Silhouette techniques: strong backlighting and metering against light sources
  * Dappled light & Gobos: foliage shadows, venetian blind effects, and atmospheric patterns
  * Reflective surfaces: water puddles, wet pavement, mirrors, glass facades, and metallic surfaces
  * Creative exposure: intentional under- and over-exposure for dramatic visual mood

---

### Week 9 — Thursday, 10 December 2026
**Core Topic: Personal Project — Theme, Field Capture & Initial Selection**
- **Independent Creative Production**:
  * Choosing a personal photographic theme: Street Life, Botanical Study, Heritage Architecture, Minimalist Light, or Portrait Story
  * Planning locations, subjects, lighting requirements, and safety
  * Independent capture shoot: collecting a cohesive series of images
  * Beginning digital culling: star ratings, initial RAW processing, and curation of a focused shortlist

---

### Week 10 — Thursday, 17 December 2026
**Core Topic: Personal Project Showcase, Group Exhibition & Farewell!**
- **Final Polish & Presentation**:
  * Completing final image adjustments: cropping, color grading, tone curves, and sharpening
  * Selecting and presenting the final capstone body of work (3–5 cohesive photographs)
  * Peer celebration and group showcase exhibition
  * Reflection on creative growth, technical transformation, and establishing independent next steps (advanced courses, local camera clubs, printing & exhibiting)`;

async function main() {
  console.log("Connecting to Chrome on CDP port 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));
  if (!page) throw new Error("Notebook page not found");

  // Click "Add sources" button
  console.log("Clicking 'Add sources' button...");
  const addSourcesBtn = page.locator('button[aria-label="Add source"], button:has-text("Add sources")').first();
  await addSourcesBtn.click();
  await page.waitForTimeout(1000);

  // Click "Copied text" button
  console.log("Clicking 'Copied text' button...");
  const copiedTextBtn = page.locator('button:has-text("Copied text"), [role="button"]:has-text("Copied text")').first();
  await copiedTextBtn.click();
  await page.waitForTimeout(1500);

  // In the copied text dialog, fill title & content
  const titleInput = page.locator('input[placeholder*="Title"], input[aria-label*="Title"], mat-dialog-container input[type="text"]').first();
  if (await titleInput.isVisible()) {
    console.log("Filling title input...");
    await titleInput.fill(SOURCE_TITLE);
  }

  const contentArea = page.locator('mat-dialog-container textarea, [role="dialog"] textarea').first();
  if (await contentArea.isVisible()) {
    console.log("Filling content textarea...");
    await contentArea.fill(SOURCE_CONTENT);
  }

  await page.screenshot({ path: "scratch/curriculum_source_filled.png" });
  console.log("Saved scratch/curriculum_source_filled.png");

  // Click Insert
  const insertBtn = page.locator('mat-dialog-container button:has-text("Insert"), mat-dialog-container button:has-text("Save"), mat-dialog-container button:has-text("Add")').first();
  if (await insertBtn.isVisible()) {
    console.log("Clicking Insert button...");
    await insertBtn.click();
    console.log("Waiting for source to process...");
    await page.waitForTimeout(5000);
  }

  await page.screenshot({ path: "scratch/sources_after_curriculum_add.png" });
  console.log("Saved scratch/sources_after_curriculum_add.png");

  await browser.close();
}

main().catch(err => {
  console.error("Error adding curriculum source:", err);
  process.exit(1);
});
