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

  // --- TEST SLIDE 6: Misconception Buster ---
  console.log("\nTesting Slide 6 (Misconception Buster)...");
  await goToSlide(6);
  const slide6Overlays = await page.$$('.qa-card-overlay.masked-blur');
  console.log(`Found ${slide6Overlays.length} blur overlays on Slide 6 (expected 1)`);
  if (slide6Overlays.length !== 1) {
    throw new Error(`Expected 1 blur overlay on Slide 6, found ${slide6Overlays.length}`);
  }
  await slide6Overlays[0].click();
  await page.waitForTimeout(300);
  const slide6Revealed = await page.evaluate(() => {
    return document.querySelector('.qa-card-overlay').classList.contains('revealed');
  });
  console.log(`Slide 6 cell unmasked/revealed: ${slide6Revealed}`);
  if (!slide6Revealed) {
    throw new Error("Slide 6 cell failed to reveal on click");
  }

  // --- TEST SLIDE 7: Task & Data Investigation Only ---
  console.log("\nTesting Slide 7 (Task & Pie Charts Only)...");
  await goToSlide(7);
  const slide7Src = await page.evaluate(() => {
    const img = document.querySelector('#slideImage');
    return img ? img.src : '';
  });
  console.log(`Slide 7 image src: ${slide7Src}`);
  if (!slide7Src.includes('slide_07.png')) {
    throw new Error(`Slide 7 image expected to be slide_07.png, got: ${slide7Src}`);
  }
  const slide7Overlays = await page.$$('.qa-card-overlay');
  console.log(`Slide 7 interactive overlays: ${slide7Overlays.length} (expected 0)`);
  if (slide7Overlays.length !== 0) {
    throw new Error(`Expected 0 overlays on Slide 7, found ${slide7Overlays.length}`);
  }

  // --- TEST SLIDE 8: Step-by-Step Model Answers with 3 Blurs ---
  console.log("\nTesting Slide 8 (Step-by-Step Model Answers with 3 Blurs)...");
  await goToSlide(8);
  const slide8Src = await page.evaluate(() => {
    const img = document.querySelector('#slideImage');
    return img ? img.src : '';
  });
  console.log(`Slide 8 image src: ${slide8Src}`);
  if (!slide8Src.includes('slide_08.png')) {
    throw new Error(`Slide 8 image expected to be slide_08.png, got: ${slide8Src}`);
  }
  const slide8Overlays = await page.$$('.qa-card-overlay.masked-blur');
  console.log(`Found ${slide8Overlays.length} blur overlays on Slide 8 (expected 3)`);
  if (slide8Overlays.length !== 3) {
    throw new Error(`Expected 3 blur overlays on Slide 8, found ${slide8Overlays.length}`);
  }

  // Click each step in turn (re-querying to avoid stale element handle)
  for (let i = 0; i < 3; i++) {
    const unrevealed = await page.$('.qa-card-overlay:not(.revealed)');
    if (unrevealed) {
      await unrevealed.click();
      await page.waitForTimeout(300);
    }
  }
  const allSlide8Revealed = await page.evaluate(() => {
    const cards = document.querySelectorAll('.qa-card-overlay');
    return Array.from(cards).every(c => c.classList.contains('revealed'));
  });
  console.log(`All 3 steps on Slide 8 revealed on click: ${allSlide8Revealed}`);
  if (!allSlide8Revealed) {
    throw new Error("Not all 3 step blur cells revealed on click");
  }

  // --- TEST SLIDE 9: OCR Exam Checkpoint & Mark Scheme Interactive Viewer ---
  console.log("\nTesting Slide 9 (OCR Exam PDF Interactive Viewer)...");
  await goToSlide(9);
  await page.waitForSelector('iframe', { timeout: 8000 });
  const iframeSrc = await page.evaluate(() => {
    const f = document.querySelector('iframe');
    return f ? f.src : '';
  });
  console.log(`Slide 9 iframe src: ${iframeSrc}`);
  if (!iframeSrc.includes('exam_pdf_viewer.html')) {
    throw new Error(`Slide 9 expected exam_pdf_viewer.html iframe, got ${iframeSrc}`);
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
    const l2 = document.getElementById('answerLayerPage2');
    return l1.classList.contains('visible') && l2.classList.contains('visible');
  });
  console.log(`Model Answer overlays visible after toggle: ${answersVisible}`);
  if (!answersVisible) {
    throw new Error("Model answer overlays not visible after clicking toggle");
  }

  // Check Split 50:50 mode
  const btnSplit = await frame.$('#modeBtnSplit');
  await btnSplit.click();
  await page.waitForTimeout(300);
  const isSplitActive = await frame.evaluate(() => {
    return document.getElementById('modeBtnSplit').classList.contains('active') &&
           document.getElementById('paneQuestions').style.display !== 'none' &&
           document.getElementById('paneMarkScheme').style.display !== 'none';
  });
  console.log(`Split 50:50 mode active: ${isSplitActive}`);
  if (!isSplitActive) {
    throw new Error("Split 50:50 mode failed to activate");
  }

  // --- TEST SLIDE 10: Plenary Summary & Exit-Ticket ---
  console.log("\nTesting Slide 10 (Plenary Summary & Exit-Ticket)...");
  await goToSlide(10);
  const slide10Src = await page.evaluate(() => {
    const img = document.querySelector('#slideImage');
    return img ? img.src : '';
  });
  console.log(`Slide 10 image src: ${slide10Src}`);
  if (!slide10Src.includes('slide_10.png')) {
    throw new Error(`Slide 10 image expected to be slide_10.png, got: ${slide10Src}`);
  }

  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! Everything is working cleanly and seamlessly.");
  await browser.close();
}

testAtmosphereLesson().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
