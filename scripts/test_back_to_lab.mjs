import { chromium } from "playwright";

async function testBackToLab() {
  const browser = await chromium.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("https://codexvirtualchemlab-ng72.vercel.app/?assessment=electromagnet", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Click "Back to lab"
  const backBtn = page.getByRole("button", { name: "Back to lab" });
  if (await backBtn.count() > 0) {
    console.log("Clicking Back to lab...");
    await backBtn.click();
    await page.waitForTimeout(2500);
  }

  await page.screenshot({ path: "scratch/test_electromagnet_lab_view.png" });
  console.log("Saved scratch/test_electromagnet_lab_view.png");

  await browser.close();
}

testBackToLab().catch(console.error);
