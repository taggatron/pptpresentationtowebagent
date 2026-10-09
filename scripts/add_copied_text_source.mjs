import { chromium } from "playwright";

const SOURCE_TITLE = "Course Deck: An Introduction to Photography (Adult Course)";
const SOURCE_CONTENT = `# An Introduction To Photography — Adult Course

## Slide 1: Welcome & Course Title
- Title: An Introduction To Photography
- Audience: Adult Course
- Focus: Creative visual expression, camera mastery, and visual literacy for adult learners.

## Slide 2: Why Photography?
- What about Photography interests you?
- What do you want to get out of the course?
- What do you already know about Photography?
- Exploration of diverse artistic genres:
  * Golden hour and landscape photography
  * Fast-action and sports freezing motion
  * Fine art portraiture and human expression
  * Astrophotography and night skies
  * Black-and-white architectural perspective, leading lines, and geometry

## Slide 3: Schedule of the Day (Day 1)
- Course Overview & Creative Goals
- Facilities and Studio Tour
- Logging In & Student Systems
- Compositional Elements & Visual Language
- Practical Shoot Session
- Group Critique & Peer Celebration
- Constructive Feedback
- Weekly Homework & Reflection

## Slide 4: 10-Week Course Overview
- Week 1: Composition Viewpoints (Eye level, worm's-eye, bird's-eye, angles)
- Week 2: Composition: Rule of Thirds & Leading Lines
- Week 3: Aperture (f-stops, depth of field, subject isolation, bokeh)
- Week 4: Shutter Speed (Freezing motion vs. intentional creative blur)
- Week 5: Natural and Studio Portraiture (Directional lighting, posing, expression)
- Week 6: Abstract & Macro Photography (Textures, micro details, scale)
- Week 7: Landscape & Architecture (Horizon placement, symmetry, environment)
- Week 8: Shadows, Silhouettes, Dappled Light, and Reflection
- Week 9: Personal Project (Developing an individual visual series)
- Week 10: Personal Project Showcase, Exhibition & Farewell!

## Slide 5: Student Digital Onboarding & Security
- Student Portal Login: STUDENTNUMBER@student.southdevonn.ac.uk
- Initial Password Example: Sage06061991
- New Password Requirements: Number, capital letter, special character, 12 characters long, not your name or date of birth
- Digital workflow: Secure college storage, asset backup, and project organization

## Slide 6: Week 1: Camera Basics and Composition
- Core Theme: Demystifying the camera to unleash creative vision
- Viewpoints and Perspective:
  * Eye level: Intimate, relatable, direct engagement
  * Worm's-eye view (Low angle): Dramatic, towering, empowering subject
  * Bird's-eye view (High angle): Graphic, layout-focused, expansive overview
  * Dynamic tilt: Energy and tension

## Slide 7: How To Use Your Camera (Hardware Anatomy)
- DSLR and Mirrorless Physical Controls:
  * Front & Top:
    - Mode Dial (P, S/Tv, A/Av, M)
    - Main Command Dial (adjusting settings)
    - Shutter Button (focus acquisition & shutter release)
    - Built-in Flash & Flash Pop-up Button
    - Lens Mount & Lens Release Button
    - Lens Focus Mode Switch (AF / MF - Autofocus vs Manual Focus)
  * Back & Controls:
    - Optical / Electronic Viewfinder
    - LCD Display Screen (preview, playback, settings)
    - Power Switch
    - Cross Keys / Multi-controller (navigation and AF point selection)
    - Play Button (reviewing shots)
    - Erase / Trash Button (deleting test images)

## Slide 8: Manual & Creative Shooting Modes of DSLR
- Understanding Camera Intelligence & Modes:
  * Program Mode (P): Intelligent camera control with creative exposure override
  * Shutter Priority (S / Tv): Allows user to set shutter speed directly; camera calculates aperture
  * Aperture Priority (A / Av): Allows user to set aperture (depth of field); camera calculates shutter speed
  * Full Manual Mode (M): Full artistic autonomy over the Exposure Triangle (Aperture, Shutter Speed, ISO)`;

async function main() {
  console.log("Connecting to Chrome on CDP port 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));
  if (!page) throw new Error("Notebook page not found");

  // Click "Copied text" button
  console.log("Clicking 'Copied text' button in Add sources modal...");
  const copiedTextBtn = page.locator('button:has-text("Copied text"), [role="button"]:has-text("Copied text")').first();
  await copiedTextBtn.click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: "scratch/copied_text_modal.png" });
  console.log("Saved scratch/copied_text_modal.png");

  // In the copied text dialog, find textarea / title input
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

  await page.screenshot({ path: "scratch/copied_text_filled.png" });
  console.log("Saved scratch/copied_text_filled.png");

  // Click Save or Insert
  const saveBtn = page.locator('mat-dialog-container button:has-text("Insert"), mat-dialog-container button:has-text("Save"), mat-dialog-container button:has-text("Add")').first();
  console.log("Save button visible:", await saveBtn.isVisible());
  if (await saveBtn.isVisible()) {
    await saveBtn.click();
    console.log("Clicked Insert/Save button! Waiting for source to be processed...");
    await page.waitForTimeout(4000);
  }

  await page.screenshot({ path: "scratch/sources_after_add.png" });
  console.log("Saved scratch/sources_after_add.png");

  await browser.close();
}

main().catch(err => {
  console.error("Error adding copied text source:", err);
  process.exit(1);
});
