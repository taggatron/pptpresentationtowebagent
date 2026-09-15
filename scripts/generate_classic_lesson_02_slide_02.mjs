import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_PATH = path.resolve(
  "./public/decks/ecology_atmosphere_classic/Classic_Lesson_02_Random_Sampling/slides/slide_02.png"
);

async function renderSlide() {
  console.log("Rendering refined Classic Lesson 2 Slide 2...");
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    position: relative;
    background-color: #fbf8ee;
    background-image: 
      linear-gradient(rgba(120, 140, 110, 0.16) 1.5px, transparent 1.5px),
      linear-gradient(90deg, rgba(120, 140, 110, 0.16) 1.5px, transparent 1.5px);
    background-size: 28px 28px;
    font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
    user-select: none;
  }

  .card {
    position: absolute;
    width: 636px;
    height: 222px;
    background: #fdfbf9;
    border: 1.5px solid #8d7457;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(60, 45, 25, 0.10);
    padding: 16px 20px 14px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Silver Push Pin */
  .pin {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #ffffff 0%, #cbd5e1 45%, #64748b 85%, #334155 100%);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.28);
    border: 0.5px solid rgba(0, 0, 0, 0.15);
  }

  .question-text {
    font-size: 18px;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.32;
    letter-spacing: -0.01em;
  }

  /* Answer Container - Taller & prominent so answers occupy a great proportion */
  .answer-container {
    width: 100%;
    min-height: 84px;
    max-height: 88px;
    background: #f7f3e8;
    border: 1.5px dashed rgba(45, 106, 79, 0.55);
    border-radius: 10px;
    padding: 10px 18px;
    display: flex;
    align-items: center;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.03);
  }

  .answer-text {
    font-size: 20px;
    line-height: 1.36;
    font-weight: 600;
    color: #262626;
    width: 100%;
  }

  .answer-text.text-compact {
    font-size: 18.5px;
    line-height: 1.32;
  }

  .answer-text.text-large {
    font-size: 21px;
    line-height: 1.35;
  }

  .cue-label {
    font-weight: 800;
    color: #1f2937;
    margin-right: 4px;
  }

  .highlight-green {
    color: #15803d;
    font-weight: 800;
  }

  .highlight-blue {
    color: #0284c7;
    font-weight: 800;
  }

  /* Watermark */
  .watermark {
    position: absolute;
    bottom: 12px;
    right: 28px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    opacity: 0.9;
  }
  .watermark-icon {
    font-size: 13px;
    color: #0f172a;
  }
</style>
</head>
<body>

  <!-- Row 1 -->
  <div class="card" style="left: 36px; top: 24px;">
    <div class="pin"></div>
    <div class="question-text">
      Question: Which technique estimates woodlice or field mice populations, and why?
    </div>
    <div class="answer-container">
      <div class="answer-text">
        <span class="cue-label">Success Cue:</span>
        <span class="highlight-green">Capture-recapture</span><br>
        (because animals are <span class="highlight-blue">motile / moving</span>).
      </div>
    </div>
  </div>

  <div class="card" style="left: 704px; top: 24px;">
    <div class="pin"></div>
    <div class="question-text">
      Question: When is systematic sampling along a transect used instead of random sampling?
    </div>
    <div class="answer-container">
      <div class="answer-text">
        <span class="cue-label">Success Cue:</span>
        When investigating changes across an<br>
        <span class="highlight-green">environmental gradient</span> (e.g., light, moisture).
      </div>
    </div>
  </div>

  <!-- Row 2 -->
  <div class="card" style="left: 36px; top: 272px;">
    <div class="pin"></div>
    <div class="question-text">
      Question: In capture-recapture: 20 marked, 30 caught later, 10 marked. Estimate total population.
    </div>
    <div class="answer-container">
      <div class="answer-text">
        <span class="cue-label">Success Cue:</span>
        <span class="highlight-green">60 individuals</span><br>
        <span style="font-size: 18px; color: #4b5563; font-weight: 600;">(Total population = (20 × 30) ÷ 10 = 60).</span>
      </div>
    </div>
  </div>

  <div class="card" style="left: 704px; top: 272px;">
    <div class="pin"></div>
    <div class="question-text">
      Question: Name two abiotic gradients investigated using a line or belt transect.
    </div>
    <div class="answer-container">
      <div class="answer-text">
        <span class="cue-label">Success Cue:</span>
        E.g., [<span class="highlight-blue">Light intensity</span>] (tree canopy) or<br>
        [<span class="highlight-green">moisture / salinity</span>] (rocky seashore).
      </div>
    </div>
  </div>

  <!-- Row 3 -->
  <div class="card" style="left: 36px; top: 520px;">
    <div class="pin"></div>
    <div class="question-text">
      Question: State one key assumption regarding marks applied during capture-recapture.
    </div>
    <div class="answer-container">
      <div class="answer-text text-compact">
        <span class="cue-label">Success Cue:</span>
        Mark <span class="highlight-green">does not affect survival or predation</span>, and<br>
        <span class="highlight-blue">does not rub or wash off</span>.
      </div>
    </div>
  </div>

  <div class="card" style="left: 704px; top: 520px;">
    <div class="pin"></div>
    <div class="question-text">
      Question: What is the fundamental difference between abundance and distribution?
    </div>
    <div class="answer-container">
      <div class="answer-text">
        <span class="cue-label">Success Cue:</span>
        <span class="highlight-green">Abundance</span> = how many exist;<br>
        <span class="highlight-blue">Distribution</span> = where they are located.
      </div>
    </div>
  </div>

  <!-- Watermark -->
  <div class="watermark">
    <span class="watermark-icon">❖</span>
    <span>Gemini Notebook</span>
  </div>

</body>
</html>`;

  await page.setContent(html);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: OUTPUT_PATH });
  console.log("Saved preview to:", OUTPUT_PATH);

  // Measure exact bounds of answer-containers
  const bounds = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.card'));
    return cards.map((card, idx) => {
      const container = card.querySelector('.answer-container');
      const rect = container.getBoundingClientRect();
      return {
        cardIndex: idx + 1,
        px: {
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          w: Math.round(rect.width),
          h: Math.round(rect.height)
        },
        percent: {
          x: +(rect.left / 1376 * 100).toFixed(1),
          y: +(rect.top / 768 * 100).toFixed(1),
          w: +(rect.width / 1376 * 100).toFixed(1),
          h: +(rect.height / 768 * 100).toFixed(1)
        }
      };
    });
  });

  console.log("Measured container bounds:", JSON.stringify(bounds, null, 2));
  await browser.close();
  return bounds;
}

renderSlide().catch((err) => {
  console.error("Error rendering slide:", err);
  process.exit(1);
});
