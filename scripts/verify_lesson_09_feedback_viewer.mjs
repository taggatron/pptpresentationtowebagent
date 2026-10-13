import { chromium } from "playwright";

async function verify() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 850 } });

  const url = "http://localhost:3000/?set=genetics_aaq&deck=Lesson_09_Genetics_NEA_Task_1_Huntingtons_Case_Study_Revision";
  console.log("Navigating to:", url);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Capture Slide 1
  await page.screenshot({ path: "scratch/verify_viewer_slide_01.png" });
  console.log("Captured Slide 1");

  // Navigate to Slide 3 (WWW feedback)
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  // Now on Slide 2 (starter)
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  // Now on Slide 3 (WWW feedback)
  await page.screenshot({ path: "scratch/verify_viewer_slide_03_www.png" });
  console.log("Captured Slide 3 (WWW feedback)");

  // Navigate to Slide 4 (EBI feedback)
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  await page.screenshot({ path: "scratch/verify_viewer_slide_04_ebi.png" });
  console.log("Captured Slide 4 (EBI feedback)");

  // Navigate to Slide 5 (Ben Case Study)
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  await page.screenshot({ path: "scratch/verify_viewer_slide_05_ben.png" });
  console.log("Captured Slide 5 (Ben Case Study)");

  await browser.close();
  console.log("Verification finished successfully!");
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
