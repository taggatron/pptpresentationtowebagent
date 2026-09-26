import { chromium } from 'playwright';
import path from 'path';

async function verifyLifecycleDeck() {
  console.log("Starting verification of Classic_Lesson_11_Lifecycle_analysis...");

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1376, height: 768 }
  });

  const page = await context.newPage();

  // 1. Verify Slide 10: YouTube Video Slide
  console.log("\nTesting Slide 10 (YouTube embed)...");
  await page.goto('http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=10', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);

  const videoFrameEl = await page.$('#webEmbedFrame');
  if (!videoFrameEl) throw new Error("FAIL: webEmbedFrame not found on slide 10");

  const videoFrame = await videoFrameEl.contentFrame();
  if (!videoFrame) throw new Error("FAIL: Could not access contentFrame on slide 10");

  await videoFrame.waitForSelector('.video-container iframe', { timeout: 5000 });
  const videoSrc = await videoFrame.evaluate(() => {
    const iframe = document.querySelector('.video-container iframe');
    return iframe ? iframe.src : null;
  });
  console.log("✓ Slide 10 video iframe source:", videoSrc);
  if (!videoSrc || !videoSrc.includes('k_kioopGJtY')) {
    throw new Error(`FAIL: Video src should include k_kioopGJtY, got ${videoSrc}`);
  }

  const artifactDir = '/Users/danieltagg/.gemini/antigravity-ide/brain/b9189ef4-68a7-4279-a65a-a474af1efadf';
  await page.screenshot({ path: path.join(artifactDir, 'verify_slide_10_video.png') });
  console.log("✓ Slide 10 video screenshot captured");

  // 2. Verify Slide 23: Exam PDF Viewer & Mark Scheme
  console.log("\nTesting Slide 23 (Exam PDF Viewer & Mark Scheme)...");
  await page.goto('http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=23', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);

  const examFrameEl = await page.$('#webEmbedFrame');
  if (!examFrameEl) throw new Error("FAIL: webEmbedFrame not found on slide 23");

  const examFrame = await examFrameEl.contentFrame();
  if (!examFrame) throw new Error("FAIL: Could not access examFrame contentFrame on slide 23");

  await examFrame.waitForSelector('.slide-player-group', { timeout: 5000 });

  // Check controls state
  const controlsState = await examFrame.evaluate(() => {
    const prevBtn = document.getElementById('btnPrevSlide');
    const nextBtn = document.getElementById('btnNextSlide');
    const counter = document.getElementById('slideCounterText');
    const slideshowBtn = document.getElementById('btnSlideshow');
    const fullscreenBtn = document.getElementById('btnFullscreen');
    const modeQuestions = document.getElementById('modeBtnQuestions');
    const modeSplit = document.getElementById('modeBtnSplit');
    const modeMS = document.getElementById('modeBtnMarkScheme');
    const revealBtn = document.getElementById('btnToggleAnswers');
    const downloadPdf = document.getElementById('btnDownloadPdf');

    return {
      hasPrevBtn: Boolean(prevBtn),
      hasNextBtn: Boolean(nextBtn),
      counterText: counter ? counter.textContent.trim() : null,
      hasSlideshowBtn: Boolean(slideshowBtn),
      hasFullscreenBtn: Boolean(fullscreenBtn),
      hasModeQuestions: Boolean(modeQuestions),
      hasModeSplit: Boolean(modeSplit),
      hasModeMS: Boolean(modeMS),
      hasRevealBtn: Boolean(revealBtn),
      hasDownloadPdf: Boolean(downloadPdf),
      pdfHref: downloadPdf ? downloadPdf.getAttribute('href') : null
    };
  });

  console.log("✓ PDF Viewer controls state:", controlsState);
  if (!controlsState.hasPrevBtn || !controlsState.hasNextBtn || !controlsState.hasRevealBtn || !controlsState.hasModeSplit) {
    throw new Error("FAIL: Core PDF viewer controls missing!");
  }
  console.log("✓ Counter text:", controlsState.counterText);
  console.log("✓ PDF download link:", controlsState.pdfHref);

  await page.screenshot({ path: path.join(artifactDir, 'verify_slide_23_questions_only.png') });
  console.log("✓ Slide 23 Questions-Only screenshot captured");

  // Test Reveal Model Answer
  console.log("Testing Reveal Model Answer toggle...");
  await examFrame.click('#btnToggleAnswers');
  await page.waitForTimeout(600);

  const isAnswerVisible = await examFrame.evaluate(() => {
    const layer = document.getElementById('answerLayerPage1');
    return layer ? layer.classList.contains('visible') : false;
  });
  console.log("✓ Answer layer visible after click:", isAnswerVisible);
  if (!isAnswerVisible) throw new Error("FAIL: Answer layer did not become visible!");

  await page.screenshot({ path: path.join(artifactDir, 'verify_slide_23_revealed_answer.png') });
  console.log("✓ Slide 23 Revealed Answer screenshot captured");

  // Test Switch to Split Mode 50:50
  console.log("Testing Split Screen 50:50 mode...");
  await examFrame.click('#modeBtnSplit');
  await page.waitForTimeout(600);

  const splitState = await examFrame.evaluate(() => {
    const paneQ = document.getElementById('paneQuestions');
    const paneMS = document.getElementById('paneMarkScheme');
    const splitter = document.getElementById('splitterDivider');
    return {
      paneQVisible: paneQ ? window.getComputedStyle(paneQ).display !== 'none' : false,
      paneMSVisible: paneMS ? window.getComputedStyle(paneMS).display !== 'none' : false,
      splitterVisible: splitter ? window.getComputedStyle(splitter).display !== 'none' : false
    };
  });
  console.log("✓ Split screen state:", splitState);
  if (!splitState.paneQVisible || !splitState.paneMSVisible) {
    throw new Error("FAIL: Both panes should be visible in split mode!");
  }

  await page.screenshot({ path: path.join(artifactDir, 'verify_slide_23_split_screen.png') });
  console.log("✓ Slide 23 Split Screen screenshot captured");

  await browser.close();
  console.log("\n ALL VERIFICATIONS PASSED SUCCESSFULLY!");
}

verifyLifecycleDeck().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
