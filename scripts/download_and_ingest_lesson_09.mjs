import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { ingestAndEnhanceDeck, PHYSICS_LESSONS } from "./run_physics_electricity_agent.mjs";

const NOTEBOOK_AGENT_DIR = path.resolve("../NotebookLMagent");
const PPTX_OUTPUT_DIR = path.join(NOTEBOOK_AGENT_DIR, "output", "powerpoints_physics_electricity_magnetism");
const CDP_URL = "http://127.0.0.1:9333";

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function main() {
  const lesson = PHYSICS_LESSONS.find(l => l.number === 9);
  if (!lesson) {
    throw new Error("Lesson 9 definition not found in PHYSICS_LESSONS!");
  }

  log(`Connecting to Chrome over CDP on ${CDP_URL}...`);
  const browser = await chromium.connectOverCDP(CDP_URL);
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("40fbb05f-e884-4f79-828b-c4539e9a0d31"));
  if (!page) {
    throw new Error("NotebookLM page not found in Chrome!");
  }

  await fs.mkdir(PPTX_OUTPUT_DIR, { recursive: true });

  // Set download behavior
  try {
    const client = await ctx.newCDPSession(page);
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: PPTX_OUTPUT_DIR,
    });
  } catch (err) {
    log(`CDP setDownloadBehavior notice: ${err.message}`);
  }

  log("Finding top artifact card in Studio...");
  const firstCard = page.locator("artifact-library-item").first();
  const cardTitle = (await firstCard.innerText().catch(() => "")).replace(/\s+/g, " ").trim();
  log(`Top card: "${cardTitle}"`);

  const downloadStartTime = Date.now();
  const cardMoreBtn = firstCard.locator('button[aria-label="More"]').first();
  await cardMoreBtn.waitFor({ state: "visible", timeout: 10000 });
  log("Clicking 'More' menu on top artifact card...");
  await cardMoreBtn.click();
  await page.waitForTimeout(1000);

  const pptxMenuItem = page.locator('[role="menuitem"]:has-text("Download PowerPoint")').first();
  await pptxMenuItem.waitFor({ state: "visible", timeout: 10000 });
  log("Clicking 'Download PowerPoint' menu item...");
  await pptxMenuItem.click();
  log("Download triggered! Waiting for .pptx file in output directory...");

  const pptxTargetFile = path.join(PPTX_OUTPUT_DIR, `${lesson.deckId}.pptx`);

  // Poll for downloaded file
  let downloadedPptx = null;
  const pollDeadline = Date.now() + 60000;
  while (Date.now() < pollDeadline) {
    await new Promise(r => setTimeout(r, 1000));
    const files = await fs.readdir(PPTX_OUTPUT_DIR).catch(() => []);
    for (const f of files) {
      if (f.endsWith(".pptx")) {
        const fullPath = path.join(PPTX_OUTPUT_DIR, f);
        const stat = await fs.stat(fullPath).catch(() => null);
        if (stat && stat.size > 100000 && stat.mtimeMs >= downloadStartTime - 5000) {
          downloadedPptx = fullPath;
          log(`Found downloaded PowerPoint file: ${f} (${stat.size} bytes).`);
          break;
        }
      }
    }
    if (downloadedPptx) break;
  }

  if (!downloadedPptx) {
    throw new Error(`Failed to find downloaded PPTX for Lesson ${lesson.number} in ${PPTX_OUTPUT_DIR}`);
  }

  if (downloadedPptx !== pptxTargetFile) {
    await fs.copyFile(downloadedPptx, pptxTargetFile);
  }

  log(`PowerPoint file ready at ${pptxTargetFile}. Starting ingestion and enhancement...`);
  await ingestAndEnhanceDeck(pptxTargetFile, lesson);

  log("\n✦ LESSON 9 INGESTED AND ENHANCED SUCCESSFULLY! ✦");
  await browser.close().catch(() => {});
  process.exit(0);
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
