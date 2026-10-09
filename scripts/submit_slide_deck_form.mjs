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

  const overlay = page.locator(".cdk-overlay-pane");
  if ((await overlay.count()) === 0 || !(await overlay.first().isVisible())) {
    throw new Error("Customise slide deck dialog is not open!");
  }
  console.log("Customise slide deck dialog is OPEN!");

  // Click "Presenter slides" card
  console.log("Clicking 'Presenter slides'...");
  const presenterCard = overlay.locator('div, span, [role="radio"]').filter({ hasText: /^Presenter slides/ }).first();
  await presenterCard.click();
  await page.waitForTimeout(500);

  // Locate the textarea inside the overlay
  console.log("Locating textarea inside overlay...");
  const textarea = overlay.locator("textarea").first();
  await textarea.click();
  await textarea.fill(PROMPT_TEXT);
  console.log(`Filled textarea with ${PROMPT_TEXT.length} characters.`);
  await page.waitForTimeout(500);

  // Take screenshot showing the filled prompt
  await page.screenshot({ path: "scratch/prompt_filled_strictly.png" });
  console.log("Saved scratch/prompt_filled_strictly.png");

  // Click "Generate now"
  console.log("Clicking 'Generate now'...");
  const generateBtn = overlay.locator('button:has-text("Generate now")').first();
  await generateBtn.click();

  console.log("Waiting for overlay to close...");
  await overlay.first().waitFor({ state: "hidden", timeout: 15000 });
  console.log("Dialog closed! Generation successfully dispatched!");

  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/generation_dispatched_strictly.png" });
  console.log("Saved scratch/generation_dispatched_strictly.png");

  await browser.close();
}

main().catch(err => {
  console.error("Error submitting slide deck form:", err);
  process.exit(1);
});
