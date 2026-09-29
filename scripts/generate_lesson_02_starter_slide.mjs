import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

export function getStarterSlideHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap");
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: radial-gradient(circle at 50% 15%, #222b38 0%, #161c24 70%, #11151c 100%);
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #f8fafc;
    position: relative;
  }

  /* Subtle background ambient mesh glow */
  .glow-top-left {
    position: absolute;
    top: -120px;
    left: -100px;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(14, 165, 233, 0) 70%);
    pointer-events: none;
  }
  .glow-bottom-right {
    position: absolute;
    bottom: -100px;
    right: -80px;
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(217, 70, 239, 0.10) 0%, rgba(217, 70, 239, 0) 70%);
    pointer-events: none;
  }

  /* Slide Container */
  .slide-container {
    width: 1376px;
    height: 768px;
    padding: 30px 48px 24px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  /* Header Section */
  .header {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .badge-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .badge-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 9999px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .badge-starter {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.45);
  }
  .badge-time {
    background: rgba(6, 182, 212, 0.15);
    color: #22d3ee;
    border: 1px solid rgba(6, 182, 212, 0.45);
  }
  .badge-interactive {
    background: rgba(255, 255, 255, 0.08);
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
  .topic-tag {
    font-size: 13px;
    font-weight: 700;
    color: #94a3b8;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .topic-tag .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00f0ff;
    box-shadow: 0 0 8px #00f0ff;
  }

  .title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .slide-title {
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .subtitle {
    font-size: 14.5px;
    color: #94a3b8;
    font-weight: 500;
  }

  /* Grid Layout: 2 Columns x 3 Rows */
  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, 620px);
    grid-template-rows: repeat(3, 182px);
    gap: 18px 40px;
    justify-content: center;
    margin-top: 4px;
  }

  /* Question Card (Glassmorphism + Neon Bar) */
  .qa-card {
    position: relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.025) 100%);
    border: 1.5px solid rgba(255, 255, 255, 0.14);
    border-radius: 16px;
    padding: 14px 18px 14px 22px;
    box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.18);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  /* Left vertical glowing neon bar */
  .neon-bar {
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 4.5px;
    border-radius: 0 4px 4px 0;
  }
  .bar-1 { background: #facc15; box-shadow: 0 0 12px #facc15, 0 0 24px rgba(250, 204, 21, 0.4); }
  .bar-2 { background: #00f0ff; box-shadow: 0 0 12px #00f0ff, 0 0 24px rgba(0, 240, 255, 0.4); }
  .bar-3 { background: #f43f5e; box-shadow: 0 0 12px #f43f5e, 0 0 24px rgba(244, 63, 94, 0.4); }
  .bar-4 { background: #10b981; box-shadow: 0 0 12px #10b981, 0 0 24px rgba(16, 185, 129, 0.4); }
  .bar-5 { background: #a855f7; box-shadow: 0 0 12px #a855f7, 0 0 24px rgba(168, 85, 247, 0.4); }
  .bar-6 { background: #f97316; box-shadow: 0 0 12px #f97316, 0 0 24px rgba(249, 115, 22, 0.4); }

  /* Card Top Row */
  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .q-badge {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 3px 10px;
    border-radius: 9999px;
    font-family: "JetBrains Mono", monospace;
  }
  .q-badge-1 { background: rgba(250, 204, 21, 0.15); color: #fef08a; border: 1px solid rgba(250, 204, 21, 0.35); }
  .q-badge-2 { background: rgba(0, 240, 255, 0.15); color: #a5f3fc; border: 1px solid rgba(0, 240, 255, 0.35); }
  .q-badge-3 { background: rgba(244, 63, 94, 0.15); color: #fecdd3; border: 1px solid rgba(244, 63, 94, 0.35); }
  .q-badge-4 { background: rgba(16, 185, 129, 0.15); color: #a7f3d0; border: 1px solid rgba(16, 185, 129, 0.35); }
  .q-badge-5 { background: rgba(168, 85, 247, 0.15); color: #e9d5ff; border: 1px solid rgba(168, 85, 247, 0.35); }
  .q-badge-6 { background: rgba(249, 115, 22, 0.15); color: #fed7aa; border: 1px solid rgba(249, 115, 22, 0.35); }

  .q-tag {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Question Text */
  .q-text {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.35;
    margin-bottom: 8px;
  }

  /* Answer Container Box */
  .answer-box {
    background: rgba(10, 15, 24, 0.6);
    border: 1px dashed rgba(255, 255, 255, 0.2);
    border-radius: 9px;
    padding: 7px 12px;
    height: 62px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    transition: all 0.2s ease;
  }
  .answer-cue-header {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #34d399;
    font-family: "JetBrains Mono", monospace;
  }
  .answer-text {
    font-size: 13px;
    line-height: 1.35;
    color: #cbd5e1;
    font-weight: 500;
  }

  /* Footer */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12.5px;
    color: #64748b;
    font-weight: 600;
    padding-top: 4px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }
  .footer-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .watermark {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="glow-top-left"></div>
  <div class="glow-bottom-right"></div>

  <div class="slide-container">
    <!-- Header -->
    <div class="header">
      <div class="badge-row">
        <div class="badge-group">
          <span class="badge badge-starter">Starter Activity</span>
          <span class="badge badge-time">5–10 Minutes</span>
          <span class="badge badge-interactive">Click to reveal answers</span>
        </div>
        <div class="topic-tag">
          <span class="dot"></span>
          Nucleic Acid Ultrastructure & Semiconservative Replication
        </div>
      </div>
      <div class="title-row">
        <h1 class="slide-title">Starter Activity: Prior Knowledge Retrieval Grid</h1>
        <span class="subtitle">Activate core prerequisite molecular concepts</span>
      </div>
    </div>

    <!-- 6-Cell Grid -->
    <div class="grid-container">
      <!-- Cell 1 -->
      <div class="qa-card" id="card_cell_1">
        <div class="neon-bar bar-1"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-1">QUESTION 1</span>
            <span class="q-tag">Retrieval Check</span>
          </div>
          <p class="q-text">What chemical bond links adjacent nucleotides within a single DNA polynucleotide strand?</p>
        </div>
        <div class="answer-box" id="box_cell_1">
          <div class="answer-cue-header">Expected Answer / Success Cue:</div>
          <div class="answer-text">A 3'-5' phosphodiester bond between the 3' hydroxyl group of one deoxyribose and the 5' phosphate of the next.</div>
        </div>
      </div>

      <!-- Cell 2 -->
      <div class="qa-card" id="card_cell_2">
        <div class="neon-bar bar-2"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-2">QUESTION 2</span>
            <span class="q-tag">Retrieval Check</span>
          </div>
          <p class="q-text">Why are the two polynucleotide chains in double-stranded DNA described as antiparallel?</p>
        </div>
        <div class="answer-box" id="box_cell_2">
          <div class="answer-cue-header">Expected Answer / Success Cue:</div>
          <div class="answer-text">One strand runs in the 5' to 3' direction, while the complementary antiparallel strand runs in the 3' to 5' direction.</div>
        </div>
      </div>

      <!-- Cell 3 -->
      <div class="qa-card" id="card_cell_3">
        <div class="neon-bar bar-3"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-3">QUESTION 3</span>
            <span class="q-tag">Retrieval Check</span>
          </div>
          <p class="q-text">State the number of hydrogen bonds between A-T and G-C base pairs.</p>
        </div>
        <div class="answer-box" id="box_cell_3">
          <div class="answer-cue-header">Expected Answer / Success Cue:</div>
          <div class="answer-text">A-T pairs have 2 hydrogen bonds; G-C pairs have 3 hydrogen bonds.</div>
        </div>
      </div>

      <!-- Cell 4 -->
      <div class="qa-card" id="card_cell_4">
        <div class="neon-bar bar-4"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-4">QUESTION 4</span>
            <span class="q-tag">Retrieval Check</span>
          </div>
          <p class="q-text">Which enzyme synthesizes RNA primers required to initiate DNA synthesis?</p>
        </div>
        <div class="answer-box" id="box_cell_4">
          <div class="answer-cue-header">Expected Answer / Success Cue:</div>
          <div class="answer-text">RNA primase.</div>
        </div>
      </div>

      <!-- Cell 5 -->
      <div class="qa-card" id="card_cell_5">
        <div class="neon-bar bar-5"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-5">QUESTION 5</span>
            <span class="q-tag">Retrieval Check</span>
          </div>
          <p class="q-text">Why is the lagging strand synthesized discontinuously as Okazaki fragments?</p>
        </div>
        <div class="answer-box" id="box_cell_5">
          <div class="answer-cue-header">Expected Answer / Success Cue:</div>
          <div class="answer-text">DNA polymerase can only synthesize in the 5' to 3' direction, requiring backward synthesis away from the advancing fork.</div>
        </div>
      </div>

      <!-- Cell 6 -->
      <div class="qa-card" id="card_cell_6">
        <div class="neon-bar bar-6"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-6">QUESTION 6</span>
            <span class="q-tag">Retrieval Check</span>
          </div>
          <p class="q-text">What repetitive nucleotide sequence comprises human telomeres?</p>
        </div>
        <div class="answer-box" id="box_cell_6">
          <div class="answer-cue-header">Expected Answer / Success Cue:</div>
          <div class="answer-text">TTAGGG tandem repeats.</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">
        <span>Lesson 2: DNA structure, telomeres & replication</span>
        <span>·</span>
        <span>OCR Cambridge Advanced National (AAQ) Human Biology</span>
      </div>
      <div class="watermark">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Gemini Notebook
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function render() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  
  await page.setContent(getStarterSlideHtml(), { waitUntil: "load" });
  await page.waitForTimeout(500);

  // Measure exact bounding boxes of cards and answer boxes
  const metrics = await page.evaluate(() => {
    const results = {};
    for (let i = 1; i <= 6; i++) {
      const card = document.getElementById("card_cell_" + i).getBoundingClientRect();
      const box = document.getElementById("box_cell_" + i).getBoundingClientRect();
      results["cell_" + i] = {
        card: {
          x: +(card.left / 1376 * 100).toFixed(2),
          y: +(card.top / 768 * 100).toFixed(2),
          w: +(card.width / 1376 * 100).toFixed(2),
          h: +(card.height / 768 * 100).toFixed(2)
        },
        answerBox: {
          x: +(box.left / 1376 * 100).toFixed(2),
          y: +(box.top / 768 * 100).toFixed(2),
          w: +(box.width / 1376 * 100).toFixed(2),
          h: +(box.height / 768 * 100).toFixed(2)
        }
      };
    }
    return results;
  });

  console.log("Calculated Box Metrics:", JSON.stringify(metrics, null, 2));

  await page.screenshot({ path: "scratch/test_lesson_02_starter.png" });
  console.log("Rendered test image: scratch/test_lesson_02_starter.png");

  await browser.close();
  return metrics;
}

if (process.argv[1] && process.argv[1].endsWith("generate_lesson_02_starter_slide.mjs")) {
  render().catch(console.error);
}
