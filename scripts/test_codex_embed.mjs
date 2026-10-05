import { chromium } from "playwright";

async function testLab() {
  const browser = await chromium.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log("Navigating to https://codexvirtualchemlab-ng72.vercel.app/?assessment=electromagnet ...");
  await page.goto("https://codexvirtualchemlab-ng72.vercel.app/?assessment=electromagnet", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const title = await page.title();
  console.log("Title:", title);
  
  const state = await page.evaluate(() => {
    return typeof window.render_game_to_text === "function" ? JSON.parse(window.render_game_to_text()) : null;
  });
  console.log("Assessment Electromagnet State:", JSON.stringify(state).slice(0, 300));

  await page.screenshot({ path: "scratch/test_electromagnet_assessment.png" });
  console.log("Saved scratch/test_electromagnet_assessment.png");

  await browser.close();
}

testLab().catch(console.error);
