import { chromium } from 'playwright';

async function testSlide1Video() {
  console.log("Starting test for Slide 1 Click-to-Play Video...");

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1376, height: 768 }
  });

  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });

  await page.goto('http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=1', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);

  // Check slideVideo visibility and poster
  const videoState = await page.evaluate(() => {
    const video = document.getElementById('slideVideo');
    const toggleBtn = document.getElementById('stageVideoToggleBtn');
    const slideImg = document.getElementById('slideImage');
    return {
      videoExists: Boolean(video),
      videoHidden: video ? video.classList.contains('hidden') : null,
      videoSrc: video ? video.src : null,
      videoPoster: video ? video.poster : null,
      videoPaused: video ? video.paused : null,
      videoCurrentTime: video ? video.currentTime : null,
      toggleBtnExists: Boolean(toggleBtn),
      toggleBtnHidden: toggleBtn ? toggleBtn.classList.contains('hidden') : null,
      slideImgSrc: slideImg ? slideImg.src : null
    };
  });

  console.log("Initial Slide 1 Video State:", JSON.stringify(videoState, null, 2));

  await browser.close();
}

testSlide1Video().catch(err => {
  console.error(err);
  process.exit(1);
});
