import { chromium } from 'playwright';

async function testAtmosphereLesson() {
  console.log("Starting verification of Lesson 7 Atmosphere...");

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1376, height: 768 }
  });

  const page = await context.newPage();

  // Navigate directly to Lesson 7 with explicit set and deck
  await page.goto('http://127.0.0.1:3005/?set=ecology_atmosphere_classic&deck=Classic_Lesson_07_The_Atmosphere&slide=1', {
    waitUntil: 'domcontentloaded'
  });

  await page.waitForTimeout(1000);
  console.log("✓ Presentation player loaded successfully");

  // Helper to jump to a slide number (1-based) via thumbnail click (no full page reload)
  async function goToSlide(slideNum) {
    const selector = `.thumb-item[data-slide-index="${slideNum - 1}"]`;
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.click(selector);
    await page.waitForTimeout(600);
  }

  // --- TEST SLIDE 1: Title Slide & Video Intro Build ---
  console.log("\nTesting Slide 1 (Title Slide & Animated Video Intro)...");
  await goToSlide(1);
  const slide1Initial = await page.evaluate(() => {
    return {
      badge: document.getElementById('serialStepBadge')?.textContent,
      slideImg: document.getElementById('slideImage')?.src,
      videoHidden: document.getElementById('slideVideo')?.classList.contains('hidden')
    };
  });
  console.log('Slide 1 Build 1 state:', slide1Initial);
  if (!slide1Initial.badge.includes('Build 1')) {
    throw new Error(`Expected Build 1 on Slide 1, got: ${slide1Initial.badge}`);
  }

  // Advance to Build 2 (Video)
  await page.click('#nextBuildStepBtn');
  await page.waitForTimeout(800);
  const slide1Video = await page.evaluate(() => {
    const video = document.getElementById('slideVideo');
    return {
      badge: document.getElementById('serialStepBadge')?.textContent,
      videoHidden: video?.classList.contains('hidden'),
      videoSrc: video?.src,
      videoDuration: video?.duration,
      videoPaused: video?.paused
    };
  });
  console.log('Slide 1 Build 2 (Video) state:', slide1Video);
  if (!slide1Video.videoSrc.includes('Please_produce_another_version.mp4')) {
    throw new Error(`Expected videoSrc to include Please_produce_another_version.mp4, got: ${slide1Video.videoSrc}`);
  }
  if (slide1Video.videoHidden) {
    throw new Error("Slide 1 video element is unexpectedly hidden on Build 2");
  }

  // --- TEST SLIDE 2: Starter Activity Blur Cells ---
  console.log("\nTesting Slide 2 (Starter Retrieval Grid)...");
  await goToSlide(2);
  const slide2Overlays = await page.$$('.qa-card-overlay.masked-blur');
  console.log(`Found ${slide2Overlays.length} blur overlays on Slide 2 (expected 6)`);
  if (slide2Overlays.length !== 6) {
    throw new Error(`Expected 6 blur overlays on Slide 2, found ${slide2Overlays.length}`);
  }

  // Check that prompt badges are hidden
  const visibleBadgesSlide2 = await page.evaluate(() => {
    const badges = document.querySelectorAll('.qa-card-overlay.masked-blur .qa-prompt-badge');
    let visibleCount = 0;
    badges.forEach(b => {
      const style = window.getComputedStyle(b);
      if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
        visibleCount++;
      }
    });
    return visibleCount;
  });
  console.log(`Visible prompt badges on Slide 2: ${visibleBadgesSlide2} (expected 0)`);
  if (visibleBadgesSlide2 > 0) {
    throw new Error(`Expected 0 visible prompt badges on Slide 2, found ${visibleBadgesSlide2}`);
  }

  // Click first cell on Slide 2 to test unmasking
  await slide2Overlays[0].click();
  await page.waitForTimeout(300);
  const firstCellRevealed = await page.evaluate(() => {
    const first = document.querySelector('.qa-card-overlay');
    return first.classList.contains('revealed');
  });
  console.log(`First cell on Slide 2 unmasked/revealed: ${firstCellRevealed}`);
  if (!firstCellRevealed) {
    throw new Error("First cell on Slide 2 failed to reveal on click");
  }

  // --- TEST SLIDE 3: Learning Objectives Progressive Builds ---
  console.log("\nTesting Slide 3 (Learning Objectives Progressive Builds)...");
  await goToSlide(3);
  const slide3Build1 = await page.evaluate(() => {
    return {
      badge: document.getElementById('serialStepBadge')?.textContent,
      src: document.getElementById('slideImage')?.src
    };
  });
  console.log('Slide 3 initial build state:', slide3Build1);
  if (!slide3Build1.badge || !slide3Build1.badge.includes('1 / 3')) {
    throw new Error(`Expected Step 1 / 3 on Slide 3, got: ${slide3Build1.badge}`);
  }

  // Advance build step
  await page.click('#nextBuildStepBtn');
  await page.waitForTimeout(400);
  const slide3Build2 = await page.evaluate(() => {
    return {
      badge: document.getElementById('serialStepBadge')?.textContent,
      src: document.getElementById('slideImage')?.src
    };
  });
  console.log('Slide 3 advanced build state:', slide3Build2);
  if (!slide3Build2.badge || !slide3Build2.badge.includes('2 / 3')) {
    throw new Error(`Expected Step 2 / 3 on Slide 3, got: ${slide3Build2.badge}`);
  }

  // --- TEST SLIDE 4: Atmospheric Changes Overview Slide (slide_04_atmospheric_changes.png) ---
  console.log("\nTesting Slide 4 (Atmospheric Changes Overview Slide)...");
  await goToSlide(4);
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/Users/danieltagg/.gemini/antigravity-ide/brain/09c2a99e-c553-47cf-8031-186c29d41b00/verify_slide_04_atmospheric_changes.png' });
  const slide4Src = await page.evaluate(() => {
    const img = document.querySelector('#slideImage');
    return img ? img.src : '';
  });
  console.log(`Slide 4 image src: ${slide4Src}`);
  if (!slide4Src.includes('slide_04_atmospheric_changes.png')) {
    throw new Error(`Slide 4 image expected to be slide_04_atmospheric_changes.png, got: ${slide4Src}`);
  }

  // --- TEST SLIDE 5: Earth A World Becoming Interactive Embed ---
  console.log("\nTesting Slide 5 (Earth A World Becoming Embed)...");
  await goToSlide(5);
  await page.waitForSelector('iframe', { timeout: 8000 });
  const slide5IframeSrc = await page.evaluate(() => {
    const f = document.querySelector('iframe');
    return f ? f.src : '';
  });
  console.log(`Slide 5 iframe src: ${slide5IframeSrc}`);
  if (!slide5IframeSrc.includes('earth-a-world-becoming')) {
    throw new Error(`Slide 5 expected earth-a-world-becoming iframe, got ${slide5IframeSrc}`);
  }

  // --- TEST SLIDE 7: Organic Laboratory Miller-Urey Interactive Embed ---
  console.log("\nTesting Slide 7 (Organic Laboratory Miller-Urey Embed)...");
  await goToSlide(7);
  await page.waitForSelector('iframe', { timeout: 8000 });
  const slide7IframeSrc = await page.evaluate(() => {
    const f = document.querySelector('iframe');
    return f ? f.src : '';
  });
  console.log(`Slide 7 iframe src: ${slide7IframeSrc}`);
  if (!slide7IframeSrc.includes('organic-laboratory')) {
    throw new Error(`Slide 7 expected organic-laboratory iframe, got ${slide7IframeSrc}`);
  }

  // --- TEST SLIDE 9: Misconception Buster ---
  console.log("\nTesting Slide 9 (Misconception Buster)...");
  await goToSlide(9);
  const slide9Overlays = await page.$$('.qa-card-overlay.masked-blur');
  console.log(`Found ${slide9Overlays.length} blur overlays on Slide 9 (expected 1)`);
  if (slide9Overlays.length !== 1) {
    throw new Error(`Expected 1 blur overlay on Slide 9, found ${slide9Overlays.length}`);
  }
  await slide9Overlays[0].click();
  await page.waitForTimeout(300);
  const slide9Revealed = await page.evaluate(() => {
    return document.querySelector('.qa-card-overlay').classList.contains('revealed');
  });
  console.log(`Slide 9 cell unmasked/revealed: ${slide9Revealed}`);
  if (!slide9Revealed) {
    throw new Error("Slide 9 cell failed to reveal on click");
  }

  // --- TEST SLIDE 10: Task & Data Investigation Only (slide_07.png) ---
  console.log("\nTesting Slide 10 (Task & Data Investigation Only)...");
  await goToSlide(10);
  const slide10Src = await page.evaluate(() => {
    const img = document.querySelector('#slideImage');
    return img ? img.src : '';
  });
  console.log(`Slide 10 image src: ${slide10Src}`);
  if (!slide10Src.includes('slide_07.png')) {
    throw new Error(`Slide 10 image expected to be slide_07.png, got: ${slide10Src}`);
  }
  const slide10Overlays = await page.$$('.qa-card-overlay');
  console.log(`Slide 10 interactive overlays: ${slide10Overlays.length} (expected 0)`);
  if (slide10Overlays.length !== 0) {
    throw new Error(`Expected 0 overlays on Slide 10, found ${slide10Overlays.length}`);
  }

  // --- TEST SLIDE 11: Step-by-Step Model Answers with 3 Blurs (slide_08.png) ---
  console.log("\nTesting Slide 11 (Step-by-Step Model Answers with 3 Blurs)...");
  await goToSlide(11);
  const slide11Src = await page.evaluate(() => {
    const img = document.querySelector('#slideImage');
    return img ? img.src : '';
  });
  console.log(`Slide 11 image src: ${slide11Src}`);
  if (!slide11Src.includes('slide_08.png')) {
    throw new Error(`Slide 11 image expected to be slide_08.png, got: ${slide11Src}`);
  }
  const slide11Overlays = await page.$$('.qa-card-overlay.masked-blur');
  console.log(`Found ${slide11Overlays.length} blur overlays on Slide 11 (expected 3)`);
  if (slide11Overlays.length !== 3) {
    throw new Error(`Expected 3 blur overlays on Slide 11, found ${slide11Overlays.length}`);
  }

  // Click each step in turn (re-querying to avoid stale element handle)
  for (let i = 0; i < 3; i++) {
    const unrevealed = await page.$('.qa-card-overlay:not(.revealed)');
    if (unrevealed) {
      await unrevealed.click();
      await page.waitForTimeout(300);
    }
  }
  const allSlide11Revealed = await page.evaluate(() => {
    const cards = document.querySelectorAll('.qa-card-overlay');
    return Array.from(cards).every(c => c.classList.contains('revealed'));
  });
  console.log(`All 3 steps on Slide 11 revealed on click: ${allSlide11Revealed}`);
  if (!allSlide11Revealed) {
    throw new Error("Not all 3 step blur cells revealed on click");
  }

  // --- TEST SLIDE 12: OCR Exam Checkpoint & Mark Scheme Interactive Viewer (slide_09_exam_checkpoint.png) ---
  console.log("\nTesting Slide 12 / Exam Checkpoint (OCR Exam PDF Interactive Viewer)...");
  await goToSlide(12);
  await page.waitForSelector('iframe', { timeout: 8000 });
  const iframeSrc = await page.evaluate(() => {
    const f = document.querySelector('iframe');
    return f ? f.src : '';
  });
  console.log(`Exam Checkpoint iframe src: ${iframeSrc}`);
  if (!iframeSrc.includes('exam_pdf_viewer.html')) {
    throw new Error(`Exam Checkpoint expected exam_pdf_viewer.html iframe, got ${iframeSrc}`);
  }

  // Test within iframe
  const frameHandle = await page.$('iframe');
  const frame = await frameHandle.contentFrame();
  if (!frame) {
    throw new Error("Could not access iframe contentFrame");
  }

  await frame.waitForSelector('#sheetPage1', { timeout: 5000 });
  console.log("✓ Page 1 loaded inside exam iframe");

  // Check toggle answers button
  const btnAnswers = await frame.$('#btnToggleAnswers');
  await btnAnswers.click();
  await page.waitForTimeout(300);

  const answersVisible = await frame.evaluate(() => {
    const l1 = document.getElementById('answerLayerPage1');
    return l1 && l1.classList.contains('visible');
  });
  console.log(`Model Answer overlay visible after toggle: ${answersVisible}`);
  if (!answersVisible) {
    throw new Error("Model answer overlay not visible after clicking toggle");
  }

  // Check Split 50:50 mode
  const btnSplit = await frame.$('#modeBtnSplit');
  await btnSplit.click();
  await page.waitForTimeout(300);
  const isSplitActive = await frame.evaluate(() => {
    const qDisp = window.getComputedStyle(document.getElementById('paneQuestions')).display;
    const mDisp = window.getComputedStyle(document.getElementById('paneMarkScheme')).display;
    return document.getElementById('modeBtnSplit').classList.contains('active') &&
           qDisp !== 'none' && mDisp !== 'none';
  });
  console.log(`Split 50:50 mode active: ${isSplitActive}`);
  if (!isSplitActive) {
    throw new Error("Split 50:50 mode failed to activate");
  }

  // Check Mark Scheme Only mode
  console.log("Testing Mark Scheme Only button...");
  const btnMarkScheme = await frame.$('#modeBtnMarkScheme');
  await btnMarkScheme.click();
  await page.waitForTimeout(400);

  const isMarkSchemeOnlyActive = await frame.evaluate(() => {
    const btn = document.getElementById('modeBtnMarkScheme');
    const paneQ = document.getElementById('paneQuestions');
    const paneM = document.getElementById('paneMarkScheme');
    const qDisp = window.getComputedStyle(paneQ).display;
    const mDisp = window.getComputedStyle(paneM).display;
    return {
      activeClass: btn.classList.contains('active'),
      ariaSelected: btn.getAttribute('aria-selected') === 'true',
      paneQuestionsHidden: qDisp === 'none',
      paneMarkSchemeVisible: mDisp === 'flex' || mDisp === 'block',
      paneMarkSchemeWidth: paneM.clientWidth
    };
  });
  console.log("Mark Scheme Only state:", isMarkSchemeOnlyActive);
  if (!isMarkSchemeOnlyActive.activeClass || !isMarkSchemeOnlyActive.ariaSelected) {
    throw new Error("Mark Scheme Only button did not show active state");
  }
  if (!isMarkSchemeOnlyActive.paneQuestionsHidden) {
    throw new Error("Question pane is not hidden in Mark Scheme Only mode");
  }
  if (!isMarkSchemeOnlyActive.paneMarkSchemeVisible || isMarkSchemeOnlyActive.paneMarkSchemeWidth < 500) {
    throw new Error("Mark scheme pane is not properly displayed in full width in Mark Scheme Only mode");
  }
  console.log("✓ Mark Scheme Only button is fully functioning!");

  // Check Questions Only mode return
  const btnQuestions = await frame.$('#modeBtnQuestions');
  await btnQuestions.click();
  await page.waitForTimeout(300);
  const isQuestionsActive = await frame.evaluate(() => {
    const qDisp = window.getComputedStyle(document.getElementById('paneQuestions')).display;
    const mDisp = window.getComputedStyle(document.getElementById('paneMarkScheme')).display;
    return document.getElementById('modeBtnQuestions').classList.contains('active') &&
           qDisp !== 'none' && mDisp === 'none';
  });
  console.log(`Returned to Questions Only mode: ${isQuestionsActive}`);
  if (!isQuestionsActive) {
    throw new Error("Failed to return to Questions Only mode");
  }

  // --- TEST SLIDE 13: Plenary Summary & Exit-Ticket (slide_10.png) ---
  console.log("\nTesting Slide 13 (Plenary Summary & Exit-Ticket)...");
  await goToSlide(13);
  const slide13Src = await page.evaluate(() => {
    const img = document.querySelector('#slideImage');
    return img ? img.src : '';
  });
  console.log(`Slide 13 image src: ${slide13Src}`);
  if (!slide13Src.includes('slide_10.png')) {
    throw new Error(`Slide 13 image expected to be slide_10.png, got: ${slide13Src}`);
  }

  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! Everything is working cleanly and seamlessly.");
  await browser.close();
}

testAtmosphereLesson().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
