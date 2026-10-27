import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9334");
  const ctx = browser.contexts()[0];
  const pages = ctx.pages();
  console.log(`Open pages count: ${pages.length}`);
  for (let i = 0; i < pages.length; i++) {
    console.log(`Page ${i}: ${pages[i].url()} | Title: ${await pages[i].title()}`);
  }

  const notebookPage = pages.find(p => p.url().includes("notebook.google.com"));
  if (notebookPage) {
    await notebookPage.screenshot({ path: "scratch/edge_current_state.png" });
    console.log("Saved scratch/edge_current_state.png");
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
