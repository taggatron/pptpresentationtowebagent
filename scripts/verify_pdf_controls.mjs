import { chromium } from 'playwright';
import path from 'path';

async function verifyPdfControls() {
  console.log("Starting verification of PDF controls integration...");

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1376, height: 768 }
  });

  const page = await context.newPage();

  // Navigate directly to Lesson 7 Atmosphere Slide 12
  await page.goto('http://127.0.0.1:3005/?set=ecology_atmosphere_classic&deck=Classic_Lesson_07_The_Atmosphere&slide=12', {
    waitUntil: 'domcontentloaded'
  });

  await page.waitForTimeout(2000);

  // 1. Check parent state
  const parentState = await page.evaluate(() => {
    const zoomBar = document.getElementById('slideZoomBar');
    const isPdfMode = document.body.classList.contains('is-pdf-mode');
    const stageIsPdfMode = document.querySelector('.slide-stage')?.classList.contains('is-pdf-mode');
    const zoomBarVisible = zoomBar ? window.getComputedStyle(zoomBar).display !== 'none' : false;

    return {
      isPdfMode,
      stageIsPdfMode,
      zoomBarVisible,
      displayStyle: zoomBar ? window.getComputedStyle(zoomBar).display : 'none'
    };
  });

  console.log("Parent state on PDF slide:", parentState);

  if (parentState.zoomBarVisible) {
    throw new Error("FAIL: Parent slide zoom bar should be hidden (display: none) on PDF slide!");
  }
  console.log("✓ Parent slide zoom bar is hidden on PDF slide!");

  // 2. Check iframe controls
  const frameElement = await page.$('#webEmbedFrame');
  if (!frameElement) throw new Error("webEmbedFrame not found");

  const frame = await frameElement.contentFrame();
  if (!frame) throw new Error("Could not access webEmbedFrame contentFrame");

  await frame.waitForSelector('.slide-player-group', { timeout: 5000 });

  const iframeControls = await frame.evaluate(() => {
    const prevBtn = document.getElementById('btnPrevSlide');
    const nextBtn = document.getElementById('btnNextSlide');
    const counter = document.getElementById('slideCounterText');
    const slideshowBtn = document.getElementById('btnSlideshow');
    const fullscreenBtn = document.getElementById('btnFullscreen');
    const zoomGroup = document.querySelector('.zoom-group');

    return {
      hasPrevBtn: Boolean(prevBtn),
      hasNextBtn: Boolean(nextBtn),
      counterText: counter ? counter.textContent.trim() : null,
      hasSlideshowBtn: Boolean(slideshowBtn),
      hasFullscreenBtn: Boolean(fullscreenBtn),
      hasZoomGroup: Boolean(zoomGroup),
      prevDisabled: prevBtn?.disabled,
      nextDisabled: nextBtn?.disabled
    };
  });

  console.log("Iframe controls state:", iframeControls);

  if (!iframeControls.hasPrevBtn || !iframeControls.hasNextBtn || !iframeControls.hasSlideshowBtn || !iframeControls.hasFullscreenBtn) {
    throw new Error("FAIL: Integrated controls missing in iframe top bar!");
  }
  console.log("✓ All integrated controls present in PDF viewer top bar!");
  console.log("✓ Slide counter text:", iframeControls.counterText);

  // Take screenshot in windowed mode
  const artifactDir = '/Users/danieltagg/.gemini/antigravity-ide/brain/09c2a99e-c553-47cf-8031-186c29d41b00';
  await page.screenshot({ path: path.join(artifactDir, 'verify_pdf_controls_windowed.png') });
  console.log("✓ Windowed screenshot captured");

  // 3. Test Fullscreen toggle simulation / class
  await page.evaluate(() => {
    document.body.classList.add('is-fullscreen');
    window.dispatchEvent(new Event('resize'));
  });
  await page.waitForTimeout(500);

  // Check parent zoom bar in fullscreen on PDF slide
  const fsZoomBarVisible = await page.evaluate(() => {
    const zoomBar = document.getElementById('slideZoomBar');
    return zoomBar ? window.getComputedStyle(zoomBar).display !== 'none' : false;
  });

  console.log("Parent zoom bar visible in fullscreen PDF mode:", fsZoomBarVisible);
  if (fsZoomBarVisible) {
    throw new Error("FAIL: Parent slide zoom bar must remain hidden in fullscreen PDF mode!");
  }
  console.log("✓ Parent slide zoom bar correctly remains hidden in fullscreen PDF mode!");

  await page.screenshot({ path: path.join(artifactDir, 'verify_pdf_controls_fullscreen.png') });
  console.log("✓ Fullscreen screenshot captured");

  // 4. Test Previous Slide button click inside iframe
  console.log("Testing Previous Slide click inside iframe...");
  await frame.click('#btnPrevSlide');
  await page.waitForTimeout(1000);

  const newSlideNum = await page.evaluate(() => {
    return document.getElementById('currentSlideNum')?.textContent?.trim();
  });
  console.log("Slide number after Prev Slide click:", newSlideNum);
  if (newSlideNum !== '11') {
    throw new Error(`FAIL: Expected slide 11 after clicking prev slide, got ${newSlideNum}`);
  }
  console.log("✓ Prev Slide button inside iframe successfully navigated parent to slide 11!");

  // On slide 11 (normal slide), verify slide zoom bar is visible again!
  const slide11ZoomBarVisible = await page.evaluate(() => {
    const zoomBar = document.getElementById('slideZoomBar');
    return zoomBar ? window.getComputedStyle(zoomBar).display !== 'none' : false;
  });
  console.log("Parent zoom bar visible on regular slide 11:", slide11ZoomBarVisible);
  if (!slide11ZoomBarVisible) {
    throw new Error("FAIL: Slide zoom bar should be visible on regular slides!");
  }
  console.log("✓ Slide zoom bar is cleanly restored when returning to normal slides!");

  console.log("\nALL VERIFICATIONS PASSED!");
  await browser.close();
}

verifyPdfControls().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
