import { chromium } from "playwright";
import { getSlide4Html } from "./update_slide_04.mjs";

async function render() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const html = getSlide4Html(5, true);
  await page.setContent(html);
  await page.screenshot({ path: "public/test_equation_render.png" });
  await browser.close();
  console.log("Rendered public/test_equation_render.png");
}

render().catch(console.error);

