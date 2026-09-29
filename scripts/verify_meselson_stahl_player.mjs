import { chromium } from "playwright";

async function verifyPlayer() {
  console.log("=== Verifying Meselson-Stahl Embed in Presentation Player ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on("console", msg => {
    if (msg.type() === "error") console.log("BROWSER ERROR:", msg.text());
  });

  // Navigate to player with the specific deck selected
  await page.goto("http://127.0.0.1:3000/?deck=genetics_aaq/Lesson_02_DNA_structure_telomeres_and_replication&slide=7", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // 1. Verify Slide 7 (Cell Cycle Checkpoints)
  await page.screenshot({ path: "scratch/verify_deck_slide_07.png" });
  console.log("✓ Captured Slide 7 screenshot");

  // 2. Advance to Slide 8 (Meselson-Stahl interactive)
  // Press Right arrow or click next button
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
  console.log("Slide 8 embed status:", embedStatus);

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
  } else {
    console.log("Could not access contentFrame directly");
  }

  await page.screenshot({ path: "scratch/verify_deck_slide_08_embed.png" });
  console.log("✓ Captured Slide 8 player screenshot");

  // 3. Test interaction inside iframe (click "LABEL THE PARENTAL DNA")
  if (frame) {
    const primaryBtn = await frame.$("#aaq-primary");
    if (primaryBtn) {
      console.log("Clicking primary button inside iframe...");
      await primaryBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: "scratch/verify_deck_slide_08_interacted.png" });
      console.log("✓ Captured Slide 8 interacted screenshot");
    }
  }

  // 4. Advance to Slide 9
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1500);

  const slide9Status = await page.evaluate(() => {
    const layer = document.getElementById("webEmbedLayer");
    const img = document.getElementById("slideImage");
    return {
      layerHidden: layer ? layer.classList.contains("hidden") : null,
      imgSrc: img ? img.getAttribute("src") : null
    };
  });
  console.log("Slide 9 status:", slide9Status);
  await page.screenshot({ path: "scratch/verify_deck_slide_09.png" });
  console.log("✓ Captured Slide 9 screenshot");

  // 5. Navigate back to Slide 8
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/verify_deck_slide_08_return.png" });
  console.log("✓ Captured Slide 8 return screenshot");

  await browser.close();
  console.log("\n=== All Verification Steps Completed Successfully! ===");
}

verifyPlayer().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
