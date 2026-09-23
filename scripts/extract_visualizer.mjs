import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
  const pages = browser.contexts().flatMap(c => c.pages());
  const page = pages.find(p => p.url().includes("aistudio.google.com"));
  if (!page) {
    console.error("AI Studio page not found! Pages:", pages.map(p => p.url()));
    process.exit(1);
  }

  console.log("Connected to AI Studio page:", page.url());

  // Click on Code mode button if not active
  try {
    const codeBtn = page.locator("[data-test-id=\"code-mode-btn\"]");
    if (await codeBtn.isVisible()) {
      await codeBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {
    console.log("Code btn click note:", e.message);
  }

  // Click on each file item in the file explorer to load it into Monaco
  const fileSelectors = [
    "package.json",
    "index.html",
    "index.css",
    "types.ts",
    "ErrorBoundary.tsx",
    "App.tsx",
    "Diagrams.tsx",
    "QuantumScene.tsx",
    "MilestonesTimeline.tsx",
    "metadata.json",
    "vite.config.ts"
  ];

  for (const fName of fileSelectors) {
    try {
      const el = page.locator(`text="${fName}"`).first();
      if (await el.isVisible()) {
        console.log(`Clicking ${fName}...`);
        await el.click({ force: true });
        await page.waitForTimeout(400);
      }
    } catch (e) {
      console.log(`Could not click ${fName}:`, e.message);
    }
  }

  // Retrieve all monaco models
  const models = await page.evaluate(() => {
    if (!window.monaco) return [];
    return window.monaco.editor.getModels().map(m => ({
      uri: m.uri.toString(),
      content: m.getValue()
    })).filter(m => !m.uri.endsWith(".d.ts"));
  });

  console.log(`Retrieved ${models.length} models:`, models.map(m => m.uri));

  const outDir = "/Users/danieltagg/.gemini/antigravity-ide/brain/cfbd5bc9-986c-43b8-bc09-32c8b117c18e/scratch/visualizer_source";
  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(path.join(outDir, "components"), { recursive: true });

  for (const m of models) {
    let rel = m.uri.replace(/^file:\/\/\/?/, "");
    const dest = path.join(outDir, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, m.content, "utf8");
    console.log(`Wrote ${dest} (${m.content.length} bytes)`);
  }

  console.log("Extraction complete!");
}

main().catch(console.error);
