export function getParticleModelStarterSlideHtml() {
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
    background: radial-gradient(circle at 50% 15%, #1e293b 0%, #0f172a 55%, #080d1a 100%);
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #ffffff;
    position: relative;
  }

  /* Ambient Glow Meshes */
  .glow-top-left {
    position: absolute;
    top: -180px;
    left: -140px;
    width: 780px;
    height: 780px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.40) 0%, rgba(6, 182, 212, 0) 70%);
    pointer-events: none;
  }
  .glow-bottom-right {
    position: absolute;
    bottom: -160px;
    right: -120px;
    width: 750px;
    height: 750px;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(245, 158, 11, 0) 70%);
    pointer-events: none;
  }
  .glow-center {
    position: absolute;
    top: 15%;
    left: 12%;
    width: 1000px;
    height: 560px;
    background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.20) 0%, rgba(99, 102, 241, 0) 70%);
    pointer-events: none;
  }

  /* Slide Container */
  .slide-container {
    width: 1376px;
    height: 768px;
    padding: 20px 40px 16px 40px;
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
    gap: 12px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 13.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 5px 16px;
    border-radius: 9999px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .badge-starter {
    background: rgba(245, 158, 11, 0.30);
    color: #fef08a;
    border: 1.5px solid rgba(250, 204, 21, 0.85);
    box-shadow: 0 0 16px rgba(250, 204, 21, 0.35);
  }
  .badge-time {
    background: rgba(6, 182, 212, 0.28);
    color: #a5f3fc;
    border: 1.5px solid rgba(6, 182, 212, 0.85);
    box-shadow: 0 0 16px rgba(6, 182, 212, 0.30);
  }
  .badge-interactive {
    background: rgba(255, 255, 255, 0.16);
    color: #ffffff;
    border: 1.5px solid rgba(255, 255, 255, 0.50);
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
  }
  .topic-tag {
    font-size: 15px;
    font-weight: 750;
    color: #f8fafc;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    gap: 10px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  }
  .topic-tag .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #00f0ff;
    box-shadow: 0 0 12px #00f0ff;
  }

  .title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .slide-title {
    font-size: 36px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.025em;
    font-family: "Plus Jakarta Sans", sans-serif;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.5);
  }
  .subtitle {
    font-size: 16px;
    color: #cbd5e1;
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  }

  /* Grid Layout: 2 Columns x 3 Rows */
  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, 634px);
    grid-template-rows: repeat(3, 196px);
    gap: 14px 28px;
    justify-content: center;
    margin-top: 1px;
  }

  /* Question Card */
  .qa-card {
    position: relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.07) 100%);
    border: 1.6px solid rgba(255, 255, 255, 0.32);
    border-radius: 17px;
    padding: 12px 18px 11px 26px;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.45), inset 0 1.5px 3px rgba(255, 255, 255, 0.30);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    backdrop-filter: blur(16px);
  }

  /* Left vertical glowing neon bar */
  .neon-bar {
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 7px;
    border-radius: 0 4px 4px 0;
  }
  .bar-1 { background: #facc15; box-shadow: 0 0 16px #facc15, 0 0 32px rgba(250, 204, 21, 0.65); }
  .bar-2 { background: #00f0ff; box-shadow: 0 0 16px #00f0ff, 0 0 32px rgba(0, 240, 255, 0.65); }
  .bar-3 { background: #f43f5e; box-shadow: 0 0 16px #f43f5e, 0 0 32px rgba(244, 63, 94, 0.65); }
  .bar-4 { background: #10b981; box-shadow: 0 0 16px #10b981, 0 0 32px rgba(16, 185, 129, 0.65); }
  .bar-5 { background: #c084fc; box-shadow: 0 0 16px #c084fc, 0 0 32px rgba(192, 132, 252, 0.65); }
  .bar-6 { background: #fb923c; box-shadow: 0 0 16px #fb923c, 0 0 32px rgba(251, 146, 60, 0.65); }

  /* Card Top Row */
  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  .q-badge {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 3px 12px;
    border-radius: 9999px;
    font-family: "JetBrains Mono", monospace;
  }
  .q-badge-1 { background: rgba(250, 204, 21, 0.28); color: #fef08a; border: 1.5px solid rgba(250, 204, 21, 0.75); }
  .q-badge-2 { background: rgba(0, 240, 255, 0.28); color: #cffafe; border: 1.5px solid rgba(0, 240, 255, 0.75); }
  .q-badge-3 { background: rgba(244, 63, 94, 0.28); color: #ffe4e6; border: 1.5px solid rgba(244, 63, 94, 0.75); }
  .q-badge-4 { background: rgba(16, 185, 129, 0.28); color: #d1fae5; border: 1.5px solid rgba(16, 185, 129, 0.75); }
  .q-badge-5 { background: rgba(192, 132, 252, 0.28); color: #faf5ff; border: 1.5px solid rgba(192, 132, 252, 0.75); }
  .q-badge-6 { background: rgba(251, 146, 60, 0.28); color: #fff7ed; border: 1.5px solid rgba(251, 146, 60, 0.75); }

  .q-tag {
    font-size: 13px;
    font-weight: 750;
    color: #e2e8f0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  }

  /* Question Text */
  .q-text {
    font-size: 19px;
    font-weight: 750;
    color: #ffffff;
    line-height: 1.28;
    margin-bottom: 6px;
    letter-spacing: -0.015em;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  }

  /* Answer Container Box */
  .answer-box {
    background: rgba(15, 23, 42, 0.55);
    border: 1.5px solid rgba(255, 255, 255, 0.26);
    border-radius: 12px;
    padding: 7px 14px;
    height: 72px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.35);
  }
  .answer-cue-header {
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #4ade80;
    font-family: "JetBrains Mono", monospace;
    text-shadow: 0 0 10px rgba(74, 222, 128, 0.4);
  }
  .answer-text {
    font-size: 15px;
    line-height: 1.30;
    color: #ffffff;
    font-weight: 600;
  }

  /* Footer */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13.5px;
    color: #94a3b8;
    font-weight: 600;
    padding-top: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }
  .footer-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .watermark {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #94a3b8;
    font-size: 13.5px;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="glow-top-left"></div>
  <div class="glow-bottom-right"></div>
  <div class="glow-center"></div>

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
          GCSE Physics · Matter, Pressure & The Particle Model
        </div>
      </div>
      <div class="title-row">
        <h1 class="slide-title">Starter Activity: Particle Model Retrieval Grid</h1>
        <span class="subtitle">Recall core particle arrangements, kinetic theory & pressure mechanisms</span>
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
            <span class="q-tag">States & Structure</span>
          </div>
          <p class="q-text">How are particles arranged and how do they move in a solid compared to a gas?</p>
        </div>
        <div class="answer-box" id="box_cell_1">
          <div class="answer-cue-header">Expected Answer / Key Science:</div>
          <div class="answer-text">Solids: tightly packed in regular lattice, vibrating in place. Gases: far apart, rapid random motion.</div>
        </div>
      </div>

      <!-- Cell 2 -->
      <div class="qa-card" id="card_cell_2">
        <div class="neon-bar bar-2"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-2">QUESTION 2</span>
            <span class="q-tag">Kinetic Theory</span>
          </div>
          <p class="q-text">What does temperature measure in terms of the particle model?</p>
        </div>
        <div class="answer-box" id="box_cell_2">
          <div class="answer-cue-header">Expected Answer / Key Science:</div>
          <div class="answer-text">Temperature is directly proportional to the average kinetic energy (mean speed) of the particles.</div>
        </div>
      </div>

      <!-- Cell 3 -->
      <div class="qa-card" id="card_cell_3">
        <div class="neon-bar bar-3"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-3">QUESTION 3</span>
            <span class="q-tag">Pressure Origin</span>
          </div>
          <p class="q-text">How do gas particles exert pressure on the walls of their container?</p>
        </div>
        <div class="answer-box" id="box_cell_3">
          <div class="answer-cue-header">Expected Answer / Key Science:</div>
          <div class="answer-text">Particles collide with container walls; each impact exerts a normal force. Pressure is total force divided by area (P = F / A).</div>
        </div>
      </div>

      <!-- Cell 4 -->
      <div class="qa-card" id="card_cell_4">
        <div class="neon-bar bar-4"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-4">QUESTION 4</span>
            <span class="q-tag">Thermal Spike / Hook</span>
          </div>
          <p class="q-text">Why does heating a sealed aerosol can cause internal pressure to increase?</p>
        </div>
        <div class="answer-box" id="box_cell_4">
          <div class="answer-cue-header">Expected Answer / Key Science:</div>
          <div class="answer-text">Particles gain kinetic energy and speed, striking container walls harder (greater force) and more frequently.</div>
        </div>
      </div>

      <!-- Cell 5 -->
      <div class="qa-card" id="card_cell_5">
        <div class="neon-bar bar-5"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-5">QUESTION 5</span>
            <span class="q-tag">Volume & Spacing</span>
          </div>
          <p class="q-text">If gas volume is halved at constant temperature, what happens to pressure and why?</p>
        </div>
        <div class="answer-box" id="box_cell_5">
          <div class="answer-cue-header">Expected Answer / Key Science:</div>
          <div class="answer-text">Pressure doubles (P ∝ 1/V); particles are crowded into half the space, doubling wall collision frequency.</div>
        </div>
      </div>

      <!-- Cell 6 -->
      <div class="qa-card" id="card_cell_6">
        <div class="neon-bar bar-6"></div>
        <div>
          <div class="card-top">
            <span class="q-badge q-badge-6">QUESTION 6</span>
            <span class="q-tag">State Transitions</span>
          </div>
          <p class="q-text">When ice melts or liquid boils, why is mass conserved and which bonds break?</p>
        </div>
        <div class="answer-box" id="box_cell_6">
          <div class="answer-cue-header">Expected Answer / Key Science:</div>
          <div class="answer-text">Particle number stays constant (mass conserved); weak intermolecular forces break, not strong covalent bonds.</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">
        <span>Lesson 2: Pressure, Temperature & the Particle Model</span>
        <span>·</span>
        <span>GCSE Physics</span>
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
