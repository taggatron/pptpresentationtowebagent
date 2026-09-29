import { chromium } from "playwright";

async function verifyPlayer() {
  console.log("=== Verifying 3 Cell Cycle Checkpoint Slides + Meselson-Stahl in Player ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on("console", msg => {
    if (msg.type() === "error") console.log("BROWSER ERROR:", msg.text());
  });

  // Navigate to player with Slide 7 (Stage 1)
  await page.goto("http://127.0.0.1:3000/?set=genetics_aaq&deck=Lesson_02_DNA_structure_telomeres_and_replication&slide=7", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // 1. Verify Slide 7 (Stage 1 Emphasised)
  await page.screenshot({ path: "scratch/verify_deck_slide_07.png" });
  console.log("✓ Captured Slide 7 screenshot (Stage 1 emphasised)");

  // 2. Advance to Slide 8 (Stage 2 Emphasised)
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "scratch/verify_deck_slide_08.png" });
  console.log("✓ Captured Slide 8 screenshot (Stage 2 emphasised)");

  // 3. Advance to Slide 9 (Stage 3 Emphasised)
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "scratch/verify_deck_slide_09.png" });
  console.log("✓ Captured Slide 9 screenshot (Stage 3 emphasised)");

  // 4. Advance to Slide 10 (Meselson-Stahl interactive lab)
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(2500);

  // Check state of web embed layer
  const embedStatus = await page.evaluate(() => {
    const layer = document.getElementById("webEmbedLayer");
    const frame = document.getElementById("webEmbedFrame");
    const slideNumberEl = document.getElementById("slideCounter") || document.querySelector(".slide-counter");
    return {
      layerHidden: layer ? layer.classList.contains("hidden") : null,
      frameSrc: frame ? frame.getAttribute("src") : null,
      slideCounterText: slideNumberEl ? slideNumberEl.innerText : null
    };
  });
  console.log("Slide 10 embed status:", embedStatus);

  // Verify inside iframe
  const frameElement = await page.$("#webEmbedFrame");
  const frame = await frameElement.contentFrame();
  if (frame) {
    const iframeState = await frame.evaluate(() => {
      const aaq = document.getElementById("aaq");
      const btn = document.getElementById("aaq-focus");
      const primary = document.getElementById("aaq-primary");
      return {
        aaqFound: !!aaq,
        isFocused: aaq ? aaq.classList.contains("aaq-focused") : false,
        focusBtnText: btn ? btn.innerText : null,
        primaryBtnText: primary ? primary.innerText : null
      };
    });
    console.log("Iframe internal state:", iframeState);
  }

  await page.screenshot({ path: "scratch/verify_deck_slide_10_embed.png" });
  console.log("✓ Captured Slide 10 player screenshot");

  // 5. Advance to Slide 11
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1500);

  const slide11Status = await page.evaluate(() => {
    const layer = document.getElementById("webEmbedLayer");
    const img = document.getElementById("slideImage");
    return {
      layerHidden: layer ? layer.classList.contains("hidden") : null,
      imgSrc: img ? img.getAttribute("src") : null
    };
  });
  console.log("Slide 11 status:", slide11Status);
  await page.screenshot({ path: "scratch/verify_deck_slide_11.png" });
  console.log("✓ Captured Slide 11 screenshot");

  // 6. Navigate back to Slide 10
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/verify_deck_slide_10_return.png" });
  console.log("✓ Captured Slide 10 return screenshot");

  await browser.close();
  console.log("\n=== All Verification Steps Completed Successfully! ===");
}

verifyPlayer().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
