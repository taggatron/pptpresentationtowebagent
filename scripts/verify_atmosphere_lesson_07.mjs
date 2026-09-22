import { chromium } from 'playwright';

async function testAtmosphereLesson() {
  console.log("Starting verification of Lesson 7 Atmosphere...");

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1376, height: 768 }
  });

  const page = await context.newPage();

  // Navigate directly to Lesson 7 with explicit set and deck
  await page.goto('http://127.0.0.1:3005/?set=ecology_atmosphere_classic&deck=Classic_Lesson_07_The_Atmosphere&slide=1', {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(1000);
  console.log("✓ Presentation player loaded successfully");

  // Helper to jump to a slide number (1-based)
  async function goToSlide(slideNum) {
    await page.evaluate((num) => {
      if (typeof window.jumpToSlide === 'function') {
        window.jumpToSlide(num);
      } else {
        const url = new URL(window.location.href);
        url.searchParams.set('slide', num);
        window.location.href = url.toString();
      }
    }, slideNum);
    await page.waitForTimeout(800);
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

  // --- TEST SLIDE 4: Earth A World Becoming Interactive Embed ---
  console.log("\nTesting Slide 4 (Earth A World Becoming Embed)...");
  await goToSlide(4);
  await page.waitForSelector('iframe', { timeout: 8000 });
  const slide4IframeSrc = await page.evaluate(() => {
    const f = document.querySelector('iframe');
    return f ? f.src : '';
  });
  console.log(`Slide 4 iframe src: ${slide4IframeSrc}`);
  if (!slide4IframeSrc.includes('earth-a-world-becoming')) {
    throw new Error(`Slide 4 expected earth-a-world-becoming iframe, got ${slide4IframeSrc}`);
  }

  // --- TEST SLIDE 6: Organic Laboratory Miller-Urey Interactive Embed ---
  console.log("\nTesting Slide 6 (Organic Laboratory Miller-Urey Embed)...");
  await goToSlide(6);
  await page.waitForSelector('iframe', { timeout: 8000 });
  const slide6IframeSrc = await page.evaluate(() => {
    const f = document.querySelector('iframe');
    return f ? f.src : '';
  });
  console.log(`Slide 6 iframe src: ${slide6IframeSrc}`);
  if (!slide6IframeSrc.includes('organic-laboratory')) {
    throw new Error(`Slide 6 expected organic-laboratory iframe, got ${slide6IframeSrc}`);
  }

  // --- TEST SLIDE 8: Misconception Buster ---
  console.log("\nTesting Slide 8 (Misconception Buster)...");
  await goToSlide(8);
  const slide8Overlays = await page.$$('.qa-card-overlay.masked-blur');
  console.log(`Found ${slide8Overlays.length} blur overlays on Slide 8 (expected 1)`);
  if (slide8Overlays.length !== 1) {
    throw new Error(`Expected 1 blur overlay on Slide 8, found ${slide8Overlays.length}`);
  }
  await slide8Overlays[0].click();
  await page.waitForTimeout(300);
  const slide8Revealed = await page.evaluate(() => {
    return document.querySelector('.qa-card-overlay').classList.contains('revealed');
  });
  console.log(`Slide 8 cell unmasked/revealed: ${slide8Revealed}`);
  if (!slide8Revealed) {
    throw new Error("Slide 8 cell failed to reveal on click");
  }

  // --- TEST SLIDE 9: Task & Data Investigation Only (slide_07.png) ---
  console.log("\nTesting Slide 9 (Task & Data Investigation Only)...");
  await goToSlide(9);
  const slide9Src = await page.evaluate(() => {
    const img = document.querySelector('#slideImage');
    return img ? img.src : '';
  });
  console.log(`Slide 9 image src: ${slide9Src}`);
  if (!slide9Src.includes('slide_07.png')) {
    throw new Error(`Slide 9 image expected to be slide_07.png, got: ${slide9Src}`);
  }
  const slide9Overlays = await page.$$('.qa-card-overlay');
  console.log(`Slide 9 interactive overlays: ${slide9Overlays.length} (expected 0)`);
  if (slide9Overlays.length !== 0) {
    throw new Error(`Expected 0 overlays on Slide 9, found ${slide9Overlays.length}`);
  }

  // --- TEST SLIDE 10: Step-by-Step Model Answers with 3 Blurs (slide_08.png) ---
  console.log("\nTesting Slide 10 (Step-by-Step Model Answers with 3 Blurs)...");
  await goToSlide(10);
  const slide10Src = await page.evaluate(() => {
    const img = document.querySelector('#slideImage');
    return img ? img.src : '';
  });
  console.log(`Slide 10 image src: ${slide10Src}`);
  if (!slide10Src.includes('slide_08.png')) {
    throw new Error(`Slide 10 image expected to be slide_08.png, got: ${slide10Src}`);
  }
  const slide10Overlays = await page.$$('.qa-card-overlay.masked-blur');
  console.log(`Found ${slide10Overlays.length} blur overlays on Slide 10 (expected 3)`);
  if (slide10Overlays.length !== 3) {
    throw new Error(`Expected 3 blur overlays on Slide 10, found ${slide10Overlays.length}`);
  }

  // Click each step in turn (re-querying to avoid stale element handle)
  for (let i = 0; i < 3; i++) {
    const unrevealed = await page.$('.qa-card-overlay:not(.revealed)');
    if (unrevealed) {
      await unrevealed.click();
      await page.waitForTimeout(300);
    }
  }
  const allSlide10Revealed = await page.evaluate(() => {
    const cards = document.querySelectorAll('.qa-card-overlay');
    return Array.from(cards).every(c => c.classList.contains('revealed'));
  });
  console.log(`All 3 steps on Slide 10 revealed on click: ${allSlide10Revealed}`);
  if (!allSlide10Revealed) {
    throw new Error("Not all 3 step blur cells revealed on click");
  }

  // --- TEST SLIDE 11: OCR Exam Checkpoint & Mark Scheme Interactive Viewer (slide_09_exam_checkpoint.png) ---
  console.log("\nTesting Slide 11 / Exam Checkpoint (OCR Exam PDF Interactive Viewer)...");
  await goToSlide(11);
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

  // --- TEST SLIDE 12: Plenary Summary & Exit-Ticket (slide_10.png) ---
  console.log("\nTesting Slide 12 (Plenary Summary & Exit-Ticket)...");
  await goToSlide(12);
  const slide12Src = await page.evaluate(() => {
    const img = document.querySelector('#slideImage');
    return img ? img.src : '';
  });
  console.log(`Slide 12 image src: ${slide12Src}`);
  if (!slide12Src.includes('slide_10.png')) {
    throw new Error(`Slide 12 image expected to be slide_10.png, got: ${slide12Src}`);
  }

  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! Everything is working cleanly and seamlessly.");
  await browser.close();
}

testAtmosphereLesson().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
