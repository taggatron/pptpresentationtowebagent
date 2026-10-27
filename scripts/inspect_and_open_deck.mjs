import { chromium } from "playwright";

async function run() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const artifactInfo = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("*"));
    const match = all.find(el => el.textContent && el.textContent.includes("Gene Therapy Masterclass") && el.children.length === 0);
    if (!match) return { found: false };

    let current = match;
    const chain = [];
    while (current && current !== document.body) {
      chain.push({
        tag: current.tagName,
        className: current.className,
        role: current.getAttribute("role"),
        ariaLabel: current.getAttribute("aria-label"),
      });
      current = current.parentElement;
    }
    return { found: true, text: match.textContent, chain: chain.slice(0, 6) };
  });

  console.log("Artifact info:", JSON.stringify(artifactInfo, null, 2));

  // Click via DOM
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("*"));
    const el = all.find(e => e.textContent && e.textContent.includes("Gene Therapy Masterclass"));
    if (el) {
      const clickTarget = el.closest("button") || el.closest('[role="button"]') || el.closest(".artifact-item") || el;
      clickTarget.click();
    }
  });

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scratch/edge_slide_viewer_open.png" });
  console.log("Screenshot taken!");
}

run().catch(console.error);
