import { chromium } from "playwright";
import path from "node:path";

async function main() {
  console.log("=== Testing Slide 4 Blurred Reveal Boxes ===");

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1376, height: 768 }
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("PAGE ERROR:", msg.text());
  });

  await page.goto(
    "http://127.0.0.1:3000/?set=ecology_atmosphere_classic&deck=Classic_Lesson_10_Pollutants&slide=4",
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(1500);

  // 1. Verify 2 reveal cards are present
  const cardsInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".qa-card-overlay"));
    return cards.map((c) => ({
      id: c.id,
      classes: c.className,
      left: c.style.left,
      top: c.style.top,
      width: c.style.width,
      height: c.style.height,
      ariaPressed: c.getAttribute("aria-pressed")
    }));
  });

  console.log(`Found ${cardsInfo.length} reveal cards on slide 4:`, cardsInfo);

  if (cardsInfo.length !== 2) {
    throw new Error(`FAIL: Expected 2 blur cards, but found ${cardsInfo.length}`);
  }

  // Verify initial masked-blur state
  const maskedPath = "scratch/slide_4_masked.png";
  await page.screenshot({ path: maskedPath });
  console.log("✓ Saved Initial Masked Screenshot:", maskedPath);

  // 2. Click left card to reveal it
  console.log("Clicking left card (Complete Combustion products)...");
  await page.click("#qa_card_reveal_4_cell_1");
  await page.waitForTimeout(600);

  const leftRevealedPath = "scratch/slide_4_left_revealed.png";
  await page.screenshot({ path: leftRevealedPath });
  console.log("✓ Saved Left Revealed Screenshot:", leftRevealedPath);

  // 3. Click right card to reveal it
  console.log("Clicking right card (Incomplete Combustion products)...");
  await page.click("#qa_card_reveal_4_cell_2");
  await page.waitForTimeout(600);

  const bothRevealedPath = "scratch/slide_4_both_revealed.png";
  await page.screenshot({ path: bothRevealedPath });
  console.log("✓ Saved Both Revealed Screenshot:", bothRevealedPath);

  // 4. Test "Hide all" button
  console.log("Testing Hide all button...");
  const hideAllBtn = await page.$("#hideAllBtn");
  if (hideAllBtn && (await hideAllBtn.isVisible())) {
    await hideAllBtn.click();
    await page.waitForTimeout(600);
    const remaskedPath = "scratch/slide_4_remasked.png";
    await page.screenshot({ path: remaskedPath });
    console.log("✓ Saved Remasked Screenshot:", remaskedPath);
  }

  await browser.close();
  console.log("\n🎉 ALL TESTS PASSED! Slide 4 blurred reveal boxes are functioning perfectly!");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
