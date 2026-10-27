import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const browser = await chromium.connectOverCDP("http://localhost:9334");
  const context = browser.contexts()[0] || await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to web app...");
  await page.goto("http://localhost:3000/?set=staff_cpd&deck=andragogical_inclusion", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const mainScreenshot = "scratch/web_viewer_andragogical_verified.png";
  await page.screenshot({ path: mainScreenshot });
  console.log(`Saved main viewer screenshot to ${mainScreenshot}`);

  console.log("Navigating to interactive companion...");
  await page.goto("http://localhost:3000/interactives/andragogical_inclusion.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const interactiveScreenshot = "scratch/interactive_andragogical_verified.png";
  await page.screenshot({ path: interactiveScreenshot });
  console.log(`Saved interactive companion screenshot to ${interactiveScreenshot}`);

  await page.close();
}

main().catch(err => {
  console.error("Error verifying web deck:", err);
  process.exit(1);
});
