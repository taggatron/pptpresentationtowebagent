import { chromium } from "playwright";
import path from "node:path";

const ARTIFACT_DIR = "/Users/danieltagg/.gemini/antigravity-ide/brain/90432c67-34f6-4450-9d75-71ebb79dc63c";

async function main() {
  console.log("=== Verifying Slide 16 Video Integration in Lesson_01_Static_Electricity ===");

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1376, height: 768 } });
  const page = await context.newPage();

  // 1. Navigate to Slide 16
  const targetUrl = "http://127.0.0.1:3000/?set=physics_electricity_magnetism&deck=Lesson_01_Static_Electricity&slide=16";
  console.log(`Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // 2. Verify webEmbedFrame
  const webEmbedFrameEl = await page.$("#webEmbedFrame");
  if (!webEmbedFrameEl) throw new Error("FAIL: #webEmbedFrame not found on page!");
  console.log("✓ #webEmbedFrame element exists");

  const frame = await webEmbedFrameEl.contentFrame();
  if (!frame) throw new Error("FAIL: Cannot access webEmbedFrame contentFrame!");
  console.log("✓ Accessed webEmbedFrame contentFrame");

  // 3. Verify YouTube iframe inside the embed frame
  await frame.waitForSelector("#ytIframe", { timeout: 8000 });
  const ytSrc = await frame.$eval("#ytIframe", (el) => el.src);
  console.log("✓ YouTube iframe loaded with source:", ytSrc);
  if (!ytSrc.includes("FPKen4QwY7I")) {
    throw new Error(`FAIL: YouTube src does not contain FPKen4QwY7I, got: ${ytSrc}`);
  }

  // 4. Verify 4 Observation Phase Cards exist
  const cardCount = await frame.$$eval(".obs-card", (cards) => cards.length);
  console.log(`✓ Found ${cardCount} observation breakdown cards in embed`);
  if (cardCount !== 4) {
    throw new Error(`FAIL: Expected 4 cards, found ${cardCount}`);
  }

  // 5. Verify fallback YouTube link
  const ytLink = await frame.$eval(".fallback-link", (el) => el.href);
  console.log("✓ Fallback YouTube link:", ytLink);
  if (!ytLink.includes("FPKen4QwY7I")) {
    throw new Error(`FAIL: Fallback link does not contain FPKen4QwY7I, got: ${ytLink}`);
  }

  // 6. Capture full screenshot of Slide 16 in the web presentation app
  const screenshotPath = path.join(ARTIFACT_DIR, "verified_slide_16_video.png");
  await page.screenshot({ path: screenshotPath, type: "png" });
  console.log(`✓ Screenshot captured: ${screenshotPath}`);

  // 7. Verify navigation to Slide 15 and Slide 17
  console.log("\nVerifying adjacent slides...");
  await page.goto("http://127.0.0.1:3000/?set=physics_electricity_magnetism&deck=Lesson_01_Static_Electricity&slide=15", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const slide15Img = await page.$eval("#slideImage", (el) => el.src);
  console.log("✓ Slide 15 image loaded:", slide15Img);

  await page.goto("http://127.0.0.1:3000/?set=physics_electricity_magnetism&deck=Lesson_01_Static_Electricity&slide=17", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const slide17Img = await page.$eval("#slideImage", (el) => el.src);
  console.log("✓ Slide 17 image loaded:", slide17Img);

  await browser.close();
  console.log("\n★ ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ★");
}

main().catch((err) => {
  console.error("FATAL ERROR in verification:", err);
  process.exit(1);
});
