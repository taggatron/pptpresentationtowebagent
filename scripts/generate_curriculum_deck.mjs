import { chromium } from 'playwright';

async function main() {
  console.log('Connecting to Chrome on CDP port 9333...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Overlay should already be open from previous inspect script
  let overlay = page.locator('.cdk-overlay-pane').last();
  if (!(await overlay.isVisible())) {
    console.log('Opening Slide deck modal...');
    const slideDeckBtn = page.locator('div[role="button"][aria-label="Slide deck"]').first();
    await slideDeckBtn.click();
    await page.waitForTimeout(1000);
    overlay = page.locator('.cdk-overlay-pane').last();
  }

  // Click sources dropdown button
  console.log('Clicking sources dropdown button...');
  const sourcesBtn = overlay.locator('button, div, [role="button"]').filter({ hasText: /sources/i }).last();
  await sourcesBtn.click();
  await page.waitForTimeout(600);

  // Unselect options 2 through 11
  const sourcesDialog = page.locator('.cdk-overlay-pane').last();
  const options = await sourcesDialog.locator('mat-list-option').all();
  console.log(`Found ${options.length} source options.`);

  for (let i = 2; i < options.length; i++) {
    const isSelected = await options[i].getAttribute('aria-selected');
    if (isSelected === 'true') {
      const text = await options[i].innerText();
      console.log(`Unselecting [${i}] ${text.trim().slice(0, 30)}...`);
      await options[i].click();
      await page.waitForTimeout(150);
    }
  }

  // Confirm selection
  console.log('Confirming sources selection...');
  const confirmBtn = sourcesDialog.locator('button:has-text("Confirm")');
  await confirmBtn.click();
  await page.waitForTimeout(1000);

  // Select Presenter slides
  const parentOverlay = page.locator('.cdk-overlay-pane').last();
  console.log('Selecting Presenter slides format...');
  const presenterCard = parentOverlay.locator('div.tile-content').nth(1);
  await presenterCard.click();
  await page.waitForTimeout(300);

  // Fill prompt
  const promptText = `Create a bright, luminous, clear, and artistically creative slide deck for an adult 10-Week Photography Course, grounded in the source "10-Week Adult Photography Course: Comprehensive Schedule, Dates & Core Topics".

The presentation must explicitly encompass the Dates and Core Topics for all 10 weeks:

1. Title & Term Overview:
   - An Introduction to Photography — 10-Week Master Curriculum
   - Schedule: Autumn Term 2026 (October – December 2026), Thursday Evenings (18:30–21:00)
   - South Devon College

2. Week 1 (Thursday, 8 October 2026):
   - Topic: Composition Viewpoints & Camera Familiarisation
   - Perspectives: Bird’s-eye (overhead), worm’s-eye (ground-up), eye-level (intimate), and through-view framing
   - Practical: Camera familiarisation, hardware dials, safe practice & neck strap etiquette, introductory portfolio review

3. Week 2 (Thursday, 15 October 2026):
   - Topic: Composition — Rule of Thirds & Leading Lines
   - Principles: 3x3 grid alignment, focal points, visual balance, directing viewer’s eye, natural environmental framing
   - Practical: On-campus framing challenges

4. Week 3 (Thursday, 22 October 2026):
   - Topic: The Exposure Triangle — Aperture, Shutter Speed & ISO Fundamentals
   - Mechanics: Balancing light sensitivity, aperture & depth of field (shallow bokeh vs edge-to-edge sharpness), shutter speed & motion (freezing vs creative blur), ISO & image noise

5. Week 4 (Thursday, 5 November 2026):
   - Topic: Exposure in Changing Light & Basic Image Adjustments
   - Application: Applying exposure settings in changing/low light, motion control, balancing ISO
   - Digital Workflow: RAW file import, non-destructive exposure compensation, white balance, contrast

6. Week 5 (Thursday, 12 November 2026):
   - Topic: Natural and Studio Portraiture
   - Techniques: Available light, window lighting, diffusers, relaxed posing, background isolation, introductory studio lighting (key & fill)
   - Ethics: Safe, respectful portrait practice and model collaboration

7. Week 6 (Thursday, 19 November 2026):
   - Topic: Abstract & Macro Photography
   - Vision: Close-up techniques, minimum focus distance, texture, pattern, shape, selective focus, creative interpretation of everyday objects

8. Week 7 (Thursday, 26 November 2026):
   - Topic: Landscape & Architecture Photography
   - Composition: Horizon placement, foreground interest, linear perspective, symmetry, structural lines, natural light dynamics
   - Stability: Tripod technique, timer release, camera stability

9. Week 8 (Thursday, 3 December 2026):
   - Topic: Shadows, Silhouettes, Dappled Light & Reflection
   - Mood: Contrast, strong backlighting, silhouette metering, dappled foliage light, reflective surfaces (water, glass), creative exposure

10. Week 9 (Thursday, 10 December 2026):
    - Topic: Personal Project — Theme, Field Capture & Initial Selection
    - Production: Choosing a personal photographic theme, location planning, independent capture, initial digital culling & selection

11. Week 10 (Thursday, 17 December 2026):
    - Topic: Personal Project Showcase, Exhibition & Farewell!
    - Presentation: Final edits, curation of 3–5 final photographs, peer celebration, group exhibition, reflection on future photographic pathways

Visual & Editorial Guidelines:
- Clean, bright, luminous design aesthetic with generous whitespace and artistic elegance worthy of photography.
- High visual contrast, crisp headers, and punchy bullet points (under 12-15 words each) with bold lead-ins.
- Clearly display the Date and Week Number prominently on every slide.`;

  console.log('Filling prompt textarea...');
  const textarea = parentOverlay.locator('textarea');
  await textarea.fill(promptText);
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'scratch/curriculum_deck_prompt_entered.png' });
  console.log('Saved scratch/curriculum_deck_prompt_entered.png');

  // Click "Generate now"
  console.log('Clicking "Generate now" button...');
  const generateBtn = parentOverlay.locator('button:has-text("Generate now")');
  await generateBtn.click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'scratch/curriculum_deck_started.png' });
  console.log('Saved scratch/curriculum_deck_started.png');

  await browser.close();
}

main().catch(err => {
  console.error('Error generating curriculum deck:', err);
  process.exit(1);
});
