import { chromium } from "playwright";

const PROMPT_TEXT = `Create a bright, clear, and artistically inspiring classroom slide deck for "An Introduction to Photography — Adult Course", based directly on the attached course deck source (# An Introduction To Photography) and reference pedagogy.

AESTHETIC & DESIGN REQUIREMENTS:
- Bright, luminous, high-contrast, and clean layouts befitting photography as an art form.
- Generous whitespace, elegant structure, and zero visual clutter.
- Punchy, memorable bullet points (under 15 words) with bold lead-in keywords.

SLIDE DECK PROGRESSION:
1. Title: An Introduction to Photography (Adult Creative Course) - Welcoming vision and creative goals.
2. Why Photography? Artistic curiosity, personal motivation, and diverse genres (golden hour landscapes, sports action, portraiture, astro, street, monochrome).
3. Schedule of the Day (Day 1 Workflow): Overview, facilities tour, onboarding, composition, practical shoot, critique, feedback.
4. 10-Week Course Journey: From W1 Viewpoints, W2 Rule of Thirds/Lines, W3 Aperture, W4 Shutter Speed, W5 Portraiture, W6 Macro, W7 Landscapes, W8 Shadows/Light, to W9-W10 Personal Project & Showcase.
5. Student Digital Onboarding: College portal (@student.southdevonn.ac.uk), file management, and digital security.
6. Week 1 Focus: Camera Basics & Compositional Viewpoints: Eye-level (intimate), Worm's-eye (dramatic/low), Bird's-eye (graphic/high), and Dynamic angles.
7. Camera Anatomy & Controls: DSLR/Mirrorless hardware breakdown (shutter, mode dial, command dial, AF/MF switch, lens release, viewfinder, LCD, multi-controller, playback, erase).
8. Mastering Shooting Modes: Program (P), Shutter Priority (S/Tv), Aperture Priority (A/Av), and Full Manual (M) with the Exposure Triangle.
9. Practical Shoot Challenge: Exploring 3 physical viewpoints and mode settings.
10. Constructive Group Critique: Safe peer feedback framework (warm and cool feedback).`;

async function main() {
  console.log("Connecting to Chrome on CDP port 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));
  if (!page) throw new Error("Notebook page not found");

  // Open "Slide deck" dialog
  console.log("Opening Slide deck customization dialog...");
  const slideDeckBtn = page.locator('div.create-artifact-button-container[aria-label="Slide deck"], button:has-text("Slide deck")').first();
  await slideDeckBtn.click();
  await page.waitForTimeout(2000);

  // Wait for dialog
  const dialog = page.locator('mat-dialog-container, [role="dialog"]').first();
  await dialog.waitFor({ state: "visible", timeout: 10000 });
  console.log("Dialog is visible!");

  // Ensure "Presenter slides" is selected
  console.log("Selecting 'Presenter slides'...");
  const presenterCard = dialog.locator('div, span, mat-radio-button').filter({ hasText: /^Presenter slides/ }).first();
  if (await presenterCard.isVisible()) {
    await presenterCard.click();
    await page.waitForTimeout(500);
  }

  // Find the textarea STRICTLY inside the dialog
  const dialogTextarea = dialog.locator('textarea').first();
  console.log("Locating dialog textarea...");
  await dialogTextarea.waitFor({ state: "visible", timeout: 5000 });
  await dialogTextarea.fill(PROMPT_TEXT);
  console.log(`Filled dialog textarea with ${PROMPT_TEXT.length} characters.`);

  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scratch/dialog_strictly_filled.png" });
  console.log("Saved scratch/dialog_strictly_filled.png");

  // Click "Generate now"
  console.log("Clicking 'Generate now'...");
  const generateBtn = dialog.locator('button:has-text("Generate now")').first();
  await generateBtn.click();

  console.log("Clicked Generate now! Waiting for dialog to close...");
  await dialog.waitFor({ state: "hidden", timeout: 15000 });
  console.log("Dialog closed successfully! Slide deck generation initiated.");

  // Screenshot initial studio state
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/generation_dispatched.png" });
  console.log("Saved scratch/generation_dispatched.png");

  await browser.close();
}

main().catch(err => {
  console.error("Error triggering slide deck generation:", err);
  process.exit(1);
});
