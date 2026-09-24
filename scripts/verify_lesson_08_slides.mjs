import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import { chromium } from "playwright";

const DECK_DIR = path.resolve("public/decks/ecology_atmosphere_classic/Classic_Lesson_08_Crude_Oil_and_Fractional_Distillation");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");

async function main() {
  console.log("=== Verifying Classic Lesson 08 Manifest and Assets ===");

  // 1. Verify Manifest
  const rawManifest = await fs.readFile(MANIFEST_PATH, "utf-8");
  const manifest = JSON.parse(rawManifest);

  if (manifest.totalSlides !== 10) {
    throw new Error(`Expected 10 totalSlides, but got ${manifest.totalSlides}`);
  }
  console.log("✓ Manifest totalSlides is 10");

  const slide4 = manifest.slides.find((s) => s.number === 4);
  if (!slide4) throw new Error("Slide 4 missing from manifest");
  if (!slide4.title.includes("Crude Oil")) {
    throw new Error(`Slide 4 title mismatch: ${slide4.title}`);
  }
  if (slide4.imageFileName !== "slide_04_crude_oil_hydrocarbons.png") {
    throw new Error(`Slide 4 image mismatch: ${slide4.imageFileName}`);
  }
  console.log(`✓ Slide 4: ${slide4.title} -> ${slide4.imageFileName}`);

  const slide5 = manifest.slides.find((s) => s.number === 5);
  if (!slide5) throw new Error("Slide 5 missing from manifest");
  if (!slide5.title.includes("Molymod Challenge")) {
    throw new Error(`Slide 5 title mismatch: ${slide5.title}`);
  }
  if (slide5.imageFileName !== "slide_05_molymod_building_challenge.png") {
    throw new Error(`Slide 5 image mismatch: ${slide5.imageFileName}`);
  }
  console.log(`✓ Slide 5: ${slide5.title} -> ${slide5.imageFileName}`);

  // Check all 10 slide images exist
  for (const slide of manifest.slides) {
    const imgPath = path.join(DECK_DIR, "slides", slide.imageFileName);
    const stat = await fs.stat(imgPath);
    if (stat.size < 50000) {
      throw new Error(`Slide ${slide.number} image ${slide.imageFileName} is unexpectedly small: ${stat.size} bytes`);
    }
  }
  console.log("✓ All 10 slide images physically present and valid size");

  // 2. Playwright Player Verification
  console.log("\n=== Starting Ephemeral Server & Playwright Player Test ===");
  const { createApp } = await import("../src/server.js");
  const app = createApp();

  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const port = server.address().port;
  console.log(`Ephemeral verification server running on http://127.0.0.1:${port}`);

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const deckUrl = `http://127.0.0.1:${port}/?set=ecology_atmosphere_classic&deck=Classic_Lesson_08_Crude_Oil_and_Fractional_Distillation&slide=4`;
  console.log(`Navigating to: ${deckUrl}`);
  await page.goto(deckUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Verify slide image on slide 4
  const slide4ImgSrc = await page.$eval("#slideImage", (el) => el.src);
  console.log("Slide 4 loaded image:", slide4ImgSrc);
  if (!slide4ImgSrc.includes("slide_04_crude_oil_hydrocarbons.png")) {
    throw new Error(`Slide 4 image mismatch in player: ${slide4ImgSrc}`);
  }

  // Take screenshot of Slide 4
  const brainDir = "/Users/danieltagg/.gemini/antigravity-ide/brain/bd365833-ab4a-462e-82a5-529c7aed65c3";
  const s4Path = path.join(brainDir, "player_verified_slide_04.png");
  await page.screenshot({ path: s4Path });
  console.log(`✓ Captured verified Slide 4 screenshot: ${s4Path}`);

  // Navigate to Slide 5
  const nextBtn = await page.$("#nextSlideBtn");
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(1500);
  } else {
    await page.goto(`http://127.0.0.1:${port}/?set=ecology_atmosphere_classic&deck=Classic_Lesson_08_Crude_Oil_and_Fractional_Distillation&slide=5`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  }

  const slide5ImgSrc = await page.$eval("#slideImage", (el) => el.src);
  console.log("Slide 5 loaded image:", slide5ImgSrc);
  if (!slide5ImgSrc.includes("slide_05_molymod_building_challenge.png")) {
    throw new Error(`Slide 5 image mismatch in player: ${slide5ImgSrc}`);
  }

  const s5Path = path.join(brainDir, "player_verified_slide_05.png");
  await page.screenshot({ path: s5Path });
  console.log(`✓ Captured verified Slide 5 screenshot: ${s5Path}`);

  await browser.close();
  server.close();
  console.log("✓ Playwright player verification complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
