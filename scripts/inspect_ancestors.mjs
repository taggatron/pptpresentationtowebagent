import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes("d1431642-e474-4174-bdde-740b1fa6e25c"));
  if (!page) throw new Error("Page not found");

  const ancestors = await page.evaluate(() => {
    const span = Array.from(document.querySelectorAll('span.artifact-title')).find(s => s.innerText.includes("F172"));
    if (!span) return { error: "Span not found" };

    const chain = [];
    let curr = span;
    while (curr && curr !== document.body) {
      chain.push({
        tag: curr.tagName,
        className: curr.className,
        rect: curr.getBoundingClientRect()
      });
      curr = curr.parentElement;
    }
    return chain;
  });

  console.log("Ancestors:", JSON.stringify(ancestors, null, 2));

  // Let's click the clickable row or span directly
  await page.evaluate(() => {
    const span = Array.from(document.querySelectorAll('span.artifact-title')).find(s => s.innerText.includes("F172"));
    const clickable = span.closest('button, [role="button"]') || span.parentElement.parentElement;
    clickable.click();
  });

  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scratch/f172_clicked_open.png" });
  console.log("Saved scratch/f172_clicked_open.png");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
