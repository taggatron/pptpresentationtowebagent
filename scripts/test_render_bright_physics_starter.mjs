import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

const BRIGHT_BG_PATH = "/Users/danieltagg/.gemini/antigravity-ide/brain/2874a669-d911-4533-92ab-362756f02cac/bright_physics_starter_bg_1792404167368.jpg";

const questions = [
  {
    num: "1",
    topic: "POWER CALCULATIONS",
    badgeColor: "#0284c7",
    topBorder: "#0284c7",
    q: "State the equation linking power (P), current (I), and potential difference (V). Calculate the power of a toaster running at 230 V that draws a current of 4 A.",
    cue: "P = I × V",
    a: "P = I × V = 4 A × 230 V = 920 W (requires a 5 A or 13 A fuse)."
  },
  {
    num: "2",
    topic: "POWER & RESISTANCE",
    badgeColor: "#d97706",
    topBorder: "#d97706",
    q: "State the equation linking power (P), current (I), and resistance (R). By what factor does heating power increase if the current flowing through a resistor triples?",
    cue: "P = I² × R",
    a: "P = I² × R. Power is proportional to current squared (I²), so tripling current increases power by 9× (3² = 9)."
  },
  {
    num: "3",
    topic: "CURRENT FLOW & CHARGE",
    badgeColor: "#059669",
    topBorder: "#059669",
    q: "Define electric current and state the equation linking charge (Q), current (I), and time (t). How does the direction of electron flow compare to conventional current?",
    cue: "Q = I × t · Charge rate",
    a: "Current is the rate of flow of electric charge (Q = I × t). Electrons flow from negative to positive; conventional current flows positive to negative."
  },
  {
    num: "4",
    topic: "3-PIN PLUG PINS",
    badgeColor: "#4f46e5",
    topBorder: "#4f46e5",
    q: "Identify the 3 pins in a UK plug (Live, Neutral, Earth) by their positions and wire colours. Which pin connects directly to the fuse, and why?",
    cue: "Brown · Blue · Green/Yellow",
    a: "Live = Brown (bottom right, connects to fuse); Neutral = Blue (bottom left); Earth = Green/Yellow (top center). Fuse isolates live 230 V supply."
  },
  {
    num: "5",
    topic: "PLUG PIN SAFETY",
    badgeColor: "#db2777",
    topBorder: "#db2777",
    q: "Why is the earth pin made longer than the live and neutral pins, and why are all plug pins manufactured from solid brass?",
    cue: "Safety shutters · Brass hardness",
    a: "Longer earth pin opens socket safety shutters and connects earth first for protection. Brass is a rigid, corrosion-resistant, high conductor."
  },
  {
    num: "6",
    topic: "WHY TRANSFORMERS ARE USED",
    badgeColor: "#7c3aed",
    topBorder: "#7c3aed",
    q: "Explain why step-up and step-down transformers are used in the National Grid transmission system.",
    cue: "High V → Low I → Low I²R loss",
    a: "Step-up transformers increase voltage (up to 400 kV) to reduce current, drastically cutting thermal energy losses (P = I²R) in cables. Step-down reduces to 230 V for safety."
  }
];

export async function renderBrightStarter() {
  const bgData = await fs.readFile(BRIGHT_BG_PATH);
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
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700;800&display=swap");

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1920px;
    height: 1080px;
    position: relative;
    overflow: hidden;
    background: #ffffff url("${bgB64}") no-repeat center center;
    background-size: 1920px 1080px;
    font-family: "Inter", -apple-system, sans-serif;
    color: #0f172a;
    padding: 32px 56px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Header Section */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.94);
    border: 1.5px solid #cbd5e1;
    border-radius: 18px;
    padding: 18px 32px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
    backdrop-filter: blur(10px);
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .badge-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .badge-pill {
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    font-weight: 800;
    padding: 4px 12px;
    border-radius: 9999px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .pill-unit {
    background: #0284c7;
    color: #ffffff;
    box-shadow: 0 2px 4px rgba(2, 132, 199, 0.25);
  }

  .pill-sub {
    background: #f0fdf4;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }

  h1.title {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  .subtitle {
    font-size: 14.5px;
    font-weight: 500;
    color: #64748b;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .pill-time {
    font-family: "JetBrains Mono", monospace;
    font-size: 13.5px;
    font-weight: 700;
    padding: 8px 16px;
    border-radius: 10px;
    background: #fffbeb;
    color: #b45309;
    border: 1.5px solid #fde68a;
  }

  .pill-count {
    font-family: "JetBrains Mono", monospace;
    font-size: 13.5px;
    font-weight: 700;
    padding: 8px 16px;
    border-radius: 10px;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1.5px solid #bfdbfe;
  }

  /* Grid: 2 columns x 3 rows */
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 22px 32px;
    height: 870px;
    margin-top: 18px;
  }

  .card {
    background: rgba(255, 255, 255, 0.94);
    border: 1.5px solid #cbd5e1;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
    backdrop-filter: blur(8px);
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .card-badge {
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .badge-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
  }

  .cue-pill {
    font-family: "JetBrains Mono", monospace;
    font-size: 11.5px;
    font-weight: 700;
    color: #475569;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 3px 10px;
    border-radius: 6px;
  }

  .question-text {
    font-family: "Plus Jakarta Sans", -apple-system, sans-serif;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.35;
    color: #0f172a;
    flex: 1;
    margin-bottom: 8px;
  }

  .answer-well {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 50px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .ans-tag {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    font-weight: 800;
    background: #059669;
    color: #ffffff;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .ans-text {
    font-family: "Inter", sans-serif;
    font-size: 14.5px;
    font-weight: 600;
    line-height: 1.35;
    color: #0f172a;
  }
</style>
</head>
<body>

  <div class="header">
    <div class="header-left">
      <div class="badge-row">
        <span class="badge-pill pill-unit">GCSE PHYSICS P3.2</span>
        <span class="badge-pill pill-sub">DOMESTIC USES & ELECTRICAL SAFETY</span>
      </div>
      <h1 class="title">Starter Activity: Prior Knowledge Retrieval Grid</h1>
    </div>
    <div class="header-right">
      <div class="pill-time">⏱️ 5–10 MINS</div>
      <div class="pill-count">6 KNOWLEDGE CHECKS</div>
    </div>
  </div>

  <div class="grid-container">
    ${questions.map((q, idx) => `
      <div class="card" id="card-${idx + 1}" style="border-top: 4px solid ${q.topBorder};">
        <div class="card-header">
          <div class="card-badge" style="color: ${q.badgeColor};">
            <span class="badge-dot" style="background: ${q.badgeColor};"></span>
            QUESTION ${q.num} · ${q.topic}
          </div>
          <div class="cue-pill">${q.cue}</div>
        </div>
        <div class="question-text">${q.q}</div>
        <div class="answer-well" id="answer-well-${idx + 1}">
          <span class="ans-tag">ANSWER</span>
          <span class="ans-text">${q.a}</span>
        </div>
      </div>
    `).join("")}
  </div>

</body>
</html>`;

  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

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

  const tempOut = path.resolve("scratch/test_bright_starter.png");
  await page.screenshot({ path: tempOut });
  console.log(`Saved screenshot to ${tempOut}`);
  await page.close();

  return measurements;
}

if (process.argv[1]?.endsWith("test_render_bright_physics_starter.mjs")) {
  renderBrightStarter().then(m => {
    console.log("Measurements:", JSON.stringify(m, null, 2));
  }).catch(console.error);
}
