import { chromium } from "playwright";

async function main() {
  console.log("Testing Inside iPhone interactive directly...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const directUrl = "http://127.0.0.1:3000/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_analysis/interactivehtmls/index.html";
  await page.goto(directUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  
  // 1. Initial XS view
  await page.screenshot({ path: "/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/test_direct_xs_default.png" });
  console.log("Captured test_direct_xs_default.png");
  
  // 2. Click Battery on XS
  await page.click('[data-component="battery"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: "/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/test_direct_xs_battery.png" });
  console.log("Captured test_direct_xs_battery.png");
  
  // 3. Click Circuit Boards on XS
  await page.click('[data-component="circuit_boards"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: "/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/test_direct_xs_circuit.png" });
  console.log("Captured test_direct_xs_circuit.png");
  
  // 4. Switch to 12 Pro, click Other (MagSafe)
  await page.click('[data-model="12pro"]');
  await page.waitForTimeout(600);
  await page.click('[data-component="other"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: "/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/test_direct_12pro_magsafe.png" });
  console.log("Captured test_direct_12pro_magsafe.png");
  
  // 5. Switch to 16 Pro, click Battery
  await page.click('[data-model="16pro"]');
  await page.waitForTimeout(600);
  await page.click('[data-component="battery"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: "/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/test_direct_16pro_battery.png" });
  console.log("Captured test_direct_16pro_battery.png");

  // Now test slide 20 in player
  console.log("Testing in presentation player...");
  const playerUrl = "http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_11_Lifecycle_analysis&slide=20";
  await page.goto(playerUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/test_player_slide20.png" });
  console.log("Captured test_player_slide20.png");

  await browser.close();
  console.log("Verification finished successfully!");
}

main().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
