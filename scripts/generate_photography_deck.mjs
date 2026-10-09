import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const PROMPT_TEXT = `Create a bright, clear, and inspiring classroom slide deck for an adult education course: "An Introduction to Photography — Adult Course".

Draw factual teaching content, pedagogy, and technical definitions directly from the selected notebook sources (visual education guides, adult learning principles, and university photography syllabi).

CRITICAL DESIGN & AESTHETIC REQUIREMENTS:
- BRIGHT, CLEAR, AND CREATIVE: Every slide must be designed with bright, luminous, clean, and highly creative layouts befitting the visual art of photography.
- VISUAL CLARITY & LOW COGNITIVE LOAD: Keep layouts open, spacious, and uncluttered with generous whitespace and high visual contrast.
- PUNCHY, MEMORABLE TEXT: Use short, punchy bullet points (under 15 words) with bold lead-in keywords. Avoid dense paragraphs or walls of text.
- ARTISTIC INSPIRATION: Infuse artistic terminology, visual framing metaphors, and creative prompts that engage adult learners.

SLIDE DECK OUTLINE (Synthesizing the attached course deck & notebook sources):

1. Title Slide: An Introduction to Photography
- Subtitle: Adult Creative Course
- Clean, welcoming, and inspiring introduction to the art and craft of photography.

2. Why Photography? (Artistic Discovery & Motivation)
- Exploring creative curiosity: What draws you to photography? What personal goals do you want to achieve?
- Celebrating the breadth of photographic art: Golden hour landscapes, dynamic sports/action, portraiture, astrophotography, street photography, and black-and-white architectural perspective.

3. Schedule of the Day (Day 1 Workflow)
- Structured, supportive adult learning session:
  • Course Overview & Creative Vision
  • Facilities Tour & Studio Space
  • Digital Onboarding & Portal Access
  • Visual Literacy & Compositional Viewpoints
  • Hands-On Practical Shoot
  • Group Critique & Peer Celebration
  • Reflective Feedback & Weekly Creative Challenge

4. 10-Week Course Roadmap (Syllabus Journey)
- Clear progression from foundations to personal artistic mastery:
  • Week 1: Composition & Viewpoints (Angles, perspective, framing)
  • Week 2: Rule of Thirds & Leading Lines (Dynamic balance)
  • Week 3: Aperture & Depth of Field (f-stops, bokeh, subject isolation)
  • Week 4: Shutter Speed & Motion (Freezing action vs intentional blur)
  • Week 5: Natural & Studio Portraiture (Directional lighting & expression)
  • Week 6: Abstract & Macro Photography (Textures, patterns, scale)
  • Week 7: Landscape & Architecture (Symmetry, scale, atmosphere)
  • Week 8: Shadows, Silhouettes & Reflection (Chiaroscuro & light)
  • Week 9: Personal Project Development (Curating a thematic body of work)
  • Week 10: Final Exhibition, Project Showcase & Celebration

5. Student Onboarding & Digital Workflow
- College network & learning portal access (student credentials)
- Best practices for file management, digital asset protection, and secure account access.

6. Week 1 Focus: Camera Basics & Compositional Viewpoints
- Unlocking the camera as an extension of the creative eye.
- Exploring visual viewpoints: Eye-level (intimate), Worm’s-eye / low-angle (dramatic, towering), Bird’s-eye / high-angle (graphic, overview), and Dutch tilt / dynamic framing.

7. Camera Anatomy: How To Use Your Camera
- Demystifying the physical hardware of DSLRs and Mirrorless cameras:
  • Front: Shutter release, Main command dial, Mode dial, Lens mount & release button, Focus switch (AF / MF), Built-in flash.
  • Back & Top: Viewfinder (optical/electronic), LCD screen, Power switch, Multi-controller / cross keys, Playback button, Trash/erase button.

8. Mastering Shooting Modes: From Auto to Creative Control
- Understanding camera intelligence and when to take creative control:
  • Program Mode (P): Intelligent camera control with creative exposure override.
  • Shutter Priority (S / Tv): You command the shutter speed (e.g. 1/1000s freeze vs 1/4s motion); camera sets aperture.
  • Aperture Priority (A / Av): You command depth of field (e.g. f/1.8 shallow bokeh vs f/11 deep landscape sharpness); camera sets shutter.
  • Manual Mode (M): Total artistic autonomy over the Exposure Triangle (Aperture, Shutter Speed, ISO).

9. Practical Shoot Assignment: Exploring Viewpoints
- Hands-on creative challenge for today's session:
  • Shoot the same subject from 3 distinct physical viewpoints (low angle, eye level, high angle).
  • Experiment with Mode Dial settings (P, A, or S) to notice changes in focus and motion.
  • Focus on intentional framing and seeing light before pressing the shutter.

10. Constructive Group Critique & Reflection
- Safe, supportive peer feedback framework:
  • Warm feedback: What draws the eye? What composition or lighting worked effectively?
  • Cool feedback: What alternative angle or technical adjustment could elevate the image?
  • Looking ahead to Week 2: Rule of Thirds and Leading Lines.`;

async function main() {
  console.log("Connecting to Chrome on CDP port 9333...");
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("9a800698-e8aa-4f55-a640-ee8f50b31f4e"));
  if (!page) throw new Error("Notebook page not found");

  // Ensure "Presenter slides" is selected
  console.log("Ensuring 'Presenter slides' is selected...");
  const presenterCard = page.locator('div, span, mat-radio-button').filter({ hasText: /^Presenter slides/ }).first();
  await presenterCard.click();
  await page.waitForTimeout(500);

  // Fill prompt
  console.log("Filling prompt into textarea...");
  const textarea = page.locator('textarea').first();
  await textarea.fill(PROMPT_TEXT);
  await page.waitForTimeout(1000);

  // Take screenshot before clicking generate
  await page.screenshot({ path: "scratch/dialog_filled_ready.png" });
  console.log("Saved scratch/dialog_filled_ready.png");

  // Click Generate now
  console.log("Clicking 'Generate now'...");
  const generateBtn = page.locator('button:has-text("Generate now")').first();
  
  let quotaError = null;
  const onResponse = async (res) => {
    try {
      if (res.url().includes("batchexecute")) {
        const text = await res.text().catch(() => "");
        if (text.includes("daily Slides limit") || text.includes("reached your daily")) {
          quotaError = "Reached daily Slides generation limit";
        }
      }
    } catch {}
  };
  page.on("response", onResponse);

  try {
    await generateBtn.click();
    console.log("Clicked Generate now! Waiting for dialog to close...");
    const overlayHeading = page.getByText("Customise slide deck", { exact: true });
    await overlayHeading.waitFor({ state: "hidden", timeout: 30000 });
    console.log("Dialog closed. Generation initiated!");
  } finally {
    page.off("response", onResponse);
  }

  if (quotaError) {
    throw new Error(quotaError);
  }

  // Now monitor generation
  console.log("Monitoring generation progress in Studio...");
  const deadline = Date.now() + 15 * 60 * 1000; // 15 mins max
  let completed = false;

  while (Date.now() < deadline) {
    await page.waitForTimeout(6000);
    
    // Check Studio cards
    const studioCards = page.locator('artifact-library-item, div:has(button[aria-description="Slide deck"]), [aria-label*="Slide deck"]');
    const cardCount = await studioCards.count();
    
    let isGenerating = false;
    let cardInfo = "";
    for (let i = 0; i < cardCount; i++) {
      const txt = (await studioCards.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
      cardInfo += `[Card ${i + 1}: ${txt}] `;
      if (/generating|sync\b|progress/i.test(txt)) {
        isGenerating = true;
      }
    }

    // Also check spinners or generating text
    const generatingText = page.getByText(/Generating\.\.\./i);
    if ((await generatingText.count()) > 0 && (await generatingText.first().isVisible().catch(() => false))) {
      isGenerating = true;
    }

    const timestamp = new Date().toISOString().slice(11, 19);
    console.log(`[${timestamp}] Cards (${cardCount}): ${cardInfo || "none"} | isGenerating: ${isGenerating}`);

    if (cardCount > 0 && !isGenerating) {
      // Check if top card is a completed slide deck
      const topText = (await studioCards.first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
      if (/slide deck/i.test(topText) || /presentation/i.test(topText) || /photography/i.test(topText)) {
        console.log(`\n🎉 Slide deck generation COMPLETE! Card title: "${topText}"`);
        completed = true;
        break;
      }
    }
  }

  if (!completed) {
    console.warn("Generation did not settle within timeout.");
  }

  // Take screenshot of finished state
  await page.screenshot({ path: "scratch/notebook_deck_generated.png" });
  console.log("Saved scratch/notebook_deck_generated.png");

  await browser.close();
}

main().catch(err => {
  console.error("Error generating photography deck:", err);
  process.exit(1);
});
