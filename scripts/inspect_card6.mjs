import { chromium } from "playwright";

async function inspectCard6() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&display=swap');
  body { margin: 0; padding: 20px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 23px; font-weight: 800; }
  .box { width: 382px; border: 1px solid red; }
</style>
</head>
<body>
  <div class="box" id="b1">Explain what is meant by the genetic code being "degenerate" and "non-overlapping".</div>
  <div class="box" id="b2">Explain what is meant by the genetic code being "degenerate" and "non-overlapping."</div>
</body>
</html>`;

  await page.setContent(html);
  await page.screenshot({ path: "scratch/inspect_card6.png" });

  const info = await page.evaluate(() => {
    const b1 = document.getElementById("b1");
    return {
      text: b1.innerText,
      length: b1.innerText.length,
      scrollWidth: b1.scrollWidth,
      clientWidth: b1.clientWidth
    };
  });
  console.log("Card 6 info:", info);
  await browser.close();
}

inspectCard6().catch(console.error);
