import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";
import { analyzeSlideCognitiveLoad } from "../src/cognitive-model.js";

const DECK_DIR = path.resolve("public/decks/physics_electricity_magnetism/Lesson_09_Fuses_and_Earthing");
const SLIDES_DIR = path.join(DECK_DIR, "slides");
const MANIFEST_PATH = path.join(DECK_DIR, "manifest.json");
const GEMINI_BG_PATH = "/Users/danieltagg/.gemini/antigravity-ide/brain/2874a669-d911-4533-92ab-362756f02cac/starter_2col_grid_bg_1792403260128.jpg";

const questions = [
  {
    num: "1",
    topic: "POWER CALCULATIONS",
    badgeColor: "#38bdf8",
    q: "State the equation linking power (P), current (I), and potential difference (V). Calculate the power of a toaster running at 230 V that draws a current of 4 A.",
    cue: "P = I × V",
    a: "P = I × V = 4 A × 230 V = 920 W (requires a 5 A or 13 A fuse)."
  },
  {
    num: "2",
    topic: "POWER & RESISTANCE",
    badgeColor: "#fbbf24",
    q: "State the equation linking power (P), current (I), and resistance (R). By what factor does heating power increase if the current flowing through a resistor triples?",
    cue: "P = I² × R",
    a: "P = I² × R. Power is proportional to current squared (I²), so tripling current increases power by 9× (3² = 9)."
  },
  {
    num: "3",
    topic: "CURRENT FLOW & CHARGE",
    badgeColor: "#fbbf24",
    q: "Define electric current and state the equation linking charge (Q), current (I), and time (t). How does the direction of electron flow compare to conventional current?",
    cue: "Q = I × t · Charge rate",
    a: "Current is the rate of flow of electric charge (Q = I × t). Electrons flow from negative to positive; conventional current flows positive to negative."
  },
  {
    num: "4",
    topic: "3-PIN PLUG PINS",
    badgeColor: "#38bdf8",
    q: "Identify the 3 pins in a UK plug (Live, Neutral, Earth) by their positions and wire colours. Which pin connects directly to the fuse, and why?",
    cue: "Brown · Blue · Green/Yellow",
    a: "Live = Brown (bottom right, connects to fuse); Neutral = Blue (bottom left); Earth = Green/Yellow (top center). Fuse isolates live 230 V supply."
  },
  {
    num: "5",
    topic: "PLUG PIN SAFETY",
    badgeColor: "#38bdf8",
    q: "Why is the earth pin made longer than the live and neutral pins, and why are all plug pins manufactured from solid brass?",
    cue: "Safety shutters · Brass hardness",
    a: "Longer earth pin opens socket safety shutters and connects earth first for protection. Brass is a rigid, corrosion-resistant, high conductor."
  },
  {
    num: "6",
    topic: "WHY TRANSFORMERS ARE USED",
    badgeColor: "#fbbf24",
    q: "Explain why step-up and step-down transformers are used in the National Grid transmission system.",
    cue: "High V → Low I → Low I²R loss",
    a: "Step-up transformers increase voltage (up to 400 kV) to reduce current, drastically cutting thermal energy losses (P = I²R) in cables. Step-down reduces to 230 V for safety."
  }
];

async function main() {
  console.log("=== Step 1: Loading Gemini background and compiling template ===");
  const bgData = await fs.readFile(GEMINI_BG_PATH);
  const bgB64 = `data:image/jpeg;base64,${bgData.toString("base64")}`;

  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const context = browser.contexts()[0] || await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@600;700;800&display=swap");

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1920px;
    height: 1080px;
    position: relative;
    overflow: hidden;
    background: url("${bgB64}") no-repeat center center;
    background-size: 1920px 1080px;
    font-family: "Inter", -apple-system, sans-serif;
    color: #f8fafc;
  }

  /* Sleek top header overlay covering background text cleanly */
  .top-header-bar {
    position: absolute;
    top: 18px;
    left: 48px;
    right: 48px;
    height: 102px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 36px;
    background: #090e1c;
    border: 1.5px solid rgba(56, 189, 248, 0.4);
    border-radius: 20px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(56, 189, 248, 0.15);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .topic-pill {
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    font-weight: 800;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.45);
    padding: 7px 16px;
    border-radius: 9999px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
  }

  .header-title {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.015em;
    color: #ffffff;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .badge-item {
    font-family: "JetBrains Mono", monospace;
    font-size: 13.5px;
    font-weight: 700;
    padding: 7px 16px;
    border-radius: 9px;
    letter-spacing: 0.04em;
  }

  .badge-timer {
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.15);
    border: 1px solid rgba(251, 191, 36, 0.45);
  }

  .badge-count {
    color: #34d399;
    background: rgba(52, 211, 153, 0.15);
    border: 1px solid rgba(52, 211, 153, 0.45);
  }

  /* Grid of Cards positioned to match the Gemini background cards perfectly */
  .cards-grid {
    position: absolute;
    top: 172px;
    left: 110px;
    width: 1700px;
    height: 864px;
    display: grid;
    grid-template-columns: 810px 810px;
    grid-template-rows: 258px 258px 258px;
    column-gap: 80px;
    row-gap: 45px;
  }

  .card-box {
    position: relative;
    padding: 16px 28px 16px 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .badge-tag {
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .cue-tag {
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    font-weight: 700;
    color: #94a3b8;
    background: rgba(15, 23, 42, 0.6);
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid rgba(148, 163, 184, 0.25);
  }

  .question-text {
    font-family: "Inter", sans-serif;
    font-size: 18.5px;
    font-weight: 600;
    line-height: 1.35;
    color: #f1f5f9;
    flex: 1;
    margin-bottom: 10px;
  }

  .answer-well {
    background: rgba(10, 15, 29, 0.88);
    border: 1px solid rgba(56, 189, 248, 0.3);
    border-radius: 10px;
    padding: 9px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 52px;
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6);
  }

  .ans-badge {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    font-weight: 800;
    color: #34d399;
    background: rgba(52, 211, 153, 0.15);
    border: 1px solid rgba(52, 211, 153, 0.4);
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .ans-text {
    font-family: "Inter", sans-serif;
    font-size: 14.5px;
    font-weight: 500;
    line-height: 1.35;
    color: #e2e8f0;
  }
</style>
</head>
<body>

  <div class="top-header-bar">
    <div class="header-left">
      <span class="topic-pill">GCSE PHYSICS P3.2</span>
      <h1 class="header-title">Starter Activity: 6-Question Retrieval Grid</h1>
    </div>
    <div class="header-right">
      <span class="badge-item badge-timer">⏱️ 5–10 MINS</span>
      <span class="badge-item badge-count">6 KNOWLEDGE CHECKS</span>
    </div>
  </div>

  <div class="cards-grid">
    ${questions.map((q, idx) => `
      <div class="card-box" id="card-${idx + 1}">
        <div class="card-header">
          <div class="badge-tag" style="color: ${q.badgeColor};">
            <span class="badge-dot" style="background: ${q.badgeColor}; box-shadow: 0 0 8px ${q.badgeColor};"></span>
            QUESTION ${q.num} · ${q.topic}
          </div>
          <div class="cue-tag">${q.cue}</div>
        </div>
        <div class="question-text">${q.q}</div>
        <div class="answer-well" id="answer-well-${idx + 1}">
          <span class="ans-badge">ANSWER</span>
          <span class="ans-text">${q.a}</span>
        </div>
      </div>
    `).join("")}
  </div>

</body>
</html>`;

  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Exact measurement of coordinates
  const measurements = await page.evaluate(() => {
    const W = 1920, H = 1080;
    const cards = [];
    for (let i = 1; i <= 6; i++) {
      const cardEl = document.getElementById("card-" + i);
      const ansEl = document.getElementById("answer-well-" + i);
      const cRect = cardEl.getBoundingClientRect();
      const aRect = ansEl.getBoundingClientRect();
      cards.push({
        id: "reveal_s2_cell_" + i,
        bounds: {
          x: Number(((cRect.left / W) * 100).toFixed(2)),
          y: Number(((cRect.top / H) * 100).toFixed(2)),
          w: Number(((cRect.width / W) * 100).toFixed(2)),
          h: Number(((cRect.height / H) * 100).toFixed(2))
        },
        answerBounds: {
          x: Number(((aRect.left / W) * 100).toFixed(2)),
          y: Number(((aRect.top / H) * 100).toFixed(2)),
          w: Number(((aRect.width / W) * 100).toFixed(2)),
          h: Number(((aRect.height / H) * 100).toFixed(2))
        }
      });
    }
    return cards;
  });

  const slide02Path = path.join(SLIDES_DIR, "slide_02.png");
  await page.screenshot({ path: slide02Path });
  console.log(`Saved pristine starter slide image: ${slide02Path}`);
  await page.close();

  console.log("=== Step 2: Updating manifest.json ===");
  const manifestRaw = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestRaw);

  const reveals = measurements.map((m, idx) => ({
    id: m.id,
    question: `${questions[idx].num}. ${questions[idx].q}`,
    expectedAnswer: questions[idx].a,
    bounds: m.bounds,
    answerBounds: m.answerBounds,
    revealMode: "blur",
    confidence: 1,
    provenance: "gemini-image-creation",
    locked: true,
    answerVisibleInImage: true,
    answerIsBaked: true
  }));

  const slide2 = manifest.slides[1];
  slide2.title = "Starter Activity: 6-Question Retrieval Grid (Power, Current, Plug Pins & Transformers)";
  slide2.imageFileName = "slide_02.png";
  slide2.imageUrl = "/decks/physics_electricity_magnetism/Lesson_09_Fuses_and_Earthing/slides/slide_02.png";
  slide2.sourceMediaPath = "gemini-image-creation/starter_2col_grid_bg_1792403260128.jpg";
  slide2.isInteractive = true;
  slide2.interactiveType = "question_reveal";
  slide2.reveals = reveals;

  // Re-run cognitive load model
  const slideText = [
    slide2.title,
    ...questions.map(q => `${q.topic} ${q.q} ${q.cue} ${q.a}`)
  ].join(" ");
  slide2.cognitiveGuide = analyzeSlideCognitiveLoad(slideText, 6, "medium");

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log("Manifest updated successfully!");
}

main().catch(err => {
  console.error("Error updating starter slide:", err);
  process.exit(1);
});
