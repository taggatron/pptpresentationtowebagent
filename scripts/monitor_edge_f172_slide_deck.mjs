import { chromium } from "playwright";

const EDGE_CDP_PORT = 9334;

async function main() {
  console.log(`Connecting to Microsoft Edge on CDP port ${EDGE_CDP_PORT}...`);
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${EDGE_CDP_PORT}`);
  const ctx = browser.contexts()[0];

  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) {
    throw new Error("Could not find F172 Genetics tab in Edge!");
  }

  console.log("Attached to Edge tab. Monitoring generation...");

  let generating = true;
  let iterations = 0;
  while (generating && iterations < 60) {
    iterations++;
    const spinner = page.locator('text="Generating slide deck...", [aria-label*="Generating"], mat-progress-spinner, .progress-spinner').first();
    const isSpinnerVisible = await spinner.isVisible().catch(() => false);
    
    // Also check text containing "Generating"
    const genText = page.getByText(/Generating slide deck/i).first();
    const isTextVisible = await genText.isVisible().catch(() => false);

    const active = isSpinnerVisible || isTextVisible;
    console.log(`[Poll ${iterations}] Generating active: ${active} (spinner: ${isSpinnerVisible}, text: ${isTextVisible})`);

    if (!active && iterations > 2) {
      console.log("Slide deck generation has completed!");
      generating = false;
      break;
    }

    await page.waitForTimeout(5000);
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scratch/edge_generation_completed.png" });
  console.log("Saved scratch/edge_generation_completed.png");

  // Find the newest slide deck item in the Studio list (first slide deck item under Studio)
  console.log("Looking for newest slide deck item in Studio...");
  const studioItems = page.locator('.studio-content mat-card, .studio-content [role="button"], mat-list-item, div:has-text("F172"), div:has-text("Genetic")').filter({ hasText: /Genetic|F172|Slide deck/i });
  const count = await studioItems.count();
  console.log(`Found ${count} candidate items in studio.`);

  // Click on the top artifact in Studio to view it
  const topArtifact = page.locator('div.studio-artifact-item, div.artifact-card, [aria-label*="slide deck" i], [aria-label*="Genetic" i]').first();
  if (await topArtifact.isVisible().catch(() => false)) {
    console.log("Clicking top artifact to open viewer...");
    await topArtifact.click();
    await page.waitForTimeout(4000);
    await page.screenshot({ path: "scratch/edge_slide_deck_viewer.png" });
    console.log("Saved scratch/edge_slide_deck_viewer.png");
  }
}

main().catch(err => {
  console.error("Monitor error:", err);
  process.exit(1);
});
