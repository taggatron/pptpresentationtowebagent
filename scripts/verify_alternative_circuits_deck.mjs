import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

async function verify() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to Slide 9 of Alternative Circuits deck...");
  await page.goto("http://localhost:3000/?set=physics_electricity_magnetism&deck=Lesson_02_Circuits_Alternative&slide=9", {
    waitUntil: "networkidle"
  });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scratch/verify_alt_slide_09.png" });
  console.log("Captured scratch/verify_alt_slide_09.png");

  console.log("Navigating to Slide 1...");
  await page.goto("http://localhost:3000/?set=physics_electricity_magnetism&deck=Lesson_02_Circuits_Alternative&slide=1", {
    waitUntil: "networkidle"
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scratch/verify_alt_slide_01.png" });
  console.log("Captured scratch/verify_alt_slide_01.png");

  console.log("Navigating to Slide 3 (Knowledge Retrieval)...");
  await page.goto("http://localhost:3000/?set=physics_electricity_magnetism&deck=Lesson_02_Circuits_Alternative&slide=3", {
    waitUntil: "networkidle"
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scratch/verify_alt_slide_03.png" });
  console.log("Captured scratch/verify_alt_slide_03.png");

  await browser.close();
  console.log("Verification finished successfully!");
}

verify().catch(e => {
  console.error("Verification error:", e);
  process.exit(1);
});
