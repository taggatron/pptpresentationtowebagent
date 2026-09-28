import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

async function render() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap");
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1376px;
    height: 768px;
    background: #f8fafc;
    background-image: 
      linear-gradient(to right, rgba(14, 165, 233, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(14, 165, 233, 0.08) 1px, transparent 1px);
    background-size: 32px 32px;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    color: #0f172a;
    position: relative;
    overflow: hidden;
  }
  
  .slide-header {
    position: absolute;
    top: 36px;
    left: 60px;
  }
  .slide-title {
    font-size: 38px;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.02em;
  }
  
  /* Central Equation */
  .equation-container {
    position: absolute;
    top: 350px;
    left: 0;
    width: 1376px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    font-size: 46px;
    font-weight: 800;
    font-family: "Inter", sans-serif;
    z-index: 10;
  }
  .eq-term {
    padding: 6px 14px;
    border-radius: 12px;
    display: flex;
    align-items: baseline;
    transition: all 0.3s ease;
  }
  .eq-term .sub {
    font-size: 0.68em;
    font-weight: 700;
    margin-left: 1px;
  }
  .term-vp { color: #1d4ed8; background: rgba(219, 234, 254, 0.65); border: 2px solid #bfdbfe; }
  .term-vg { color: #047857; background: rgba(209, 250, 229, 0.65); border: 2px solid #a7f3d0; }
  .term-ve { color: #b45309; background: rgba(254, 243, 199, 0.65); border: 2px solid #fde68a; }
  .term-vgxe { color: #6d28d9; background: rgba(237, 233, 254, 0.65); border: 2px solid #ddd6fe; }
  .eq-op { color: #475569; font-weight: 600; font-size: 38px; }

  /* Callout Cards */
  .card {
    position: absolute;
    width: 580px;
    background: #ffffff;
    border-radius: 16px;
    padding: 18px 24px;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04);
    border: 1.5px solid #cbd5e1;
    z-index: 5;
  }
  
  .card-pill {
    display: inline-block;
    padding: 5px 14px;
    border-radius: 9999px;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .pill-vp { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
  .pill-vg { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
  .pill-ve { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
  .pill-vgxe { background: #ede9fe; color: #5b21b6; border: 1px solid #ddd6fe; }
  
  .card-bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .card-bullets li {
    font-size: 15px;
    line-height: 1.4;
    color: #334155;
    position: relative;
    padding-left: 18px;
  }
  .card-bullets li::before {
    content: "•";
    position: absolute;
    left: 4px;
    font-weight: 800;
    color: #64748b;
  }
  .card-bullets strong {
    color: #0f172a;
    font-weight: 700;
  }
  
  /* Positioning Cards */
  .card-vp {
    top: 105px;
    left: 60px;
  }
  .card-vg {
    top: 480px;
    left: 60px;
  }
  .card-ve {
    top: 105px;
    right: 60px;
  }
  .card-vgxe {
    top: 480px;
    right: 60px;
  }
  
  /* SVG Connectors */
  svg.connectors {
    position: absolute;
    top: 0;
    left: 0;
    width: 1376px;
    height: 768px;
    z-index: 4;
    pointer-events: none;
  }
  
  /* Watermark */
  .watermark {
    position: absolute;
    bottom: 20px;
    right: 32px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="slide-header">
    <h1 class="slide-title">The Phenotypic Equation</h1>
  </div>

  <!-- Equation -->
  <div class="equation-container" id="eqContainer">
    <div class="eq-term term-vp" id="termVp">V<span class="sub">p</span></div>
    <div class="eq-op">=</div>
    <div class="eq-term term-vg" id="termVg">V<span class="sub">g</span></div>
    <div class="eq-op">+</div>
    <div class="eq-term term-ve" id="termVe">V<span class="sub">e</span></div>
    <div class="eq-op">+</div>
    <div class="eq-term term-vgxe" id="termVgxe">V<span class="sub">g×e</span></div>
  </div>

  <!-- Card 1: Vp (Top-Left) -->
  <div class="card card-vp" id="cardVp">
    <div class="card-pill pill-vp">Vp (Phenotypic Variation)</div>
    <ul class="card-bullets">
      <li><strong>Observable traits</strong>: Physical manifestation of an organism.</li>
      <li><strong>Combined influences</strong>: Reflects genetics, lifestyle, and interactions.</li>
    </ul>
  </div>

  <!-- Card 2: Vg (Bottom-Left) -->
  <div class="card card-vg" id="cardVg">
    <div class="card-pill pill-vg">Vg (Genotypic Variation)</div>
    <ul class="card-bullets">
      <li><strong>Genetic foundation</strong>: Specific alleles inherited from parents.</li>
      <li><strong>Fixed variables</strong>: DNA sequence remains constant.</li>
    </ul>
  </div>

  <!-- Card 3: Ve (Top-Right) -->
  <div class="card card-ve" id="cardVe">
    <div class="card-pill pill-ve">Ve (Environmental Variation)</div>
    <ul class="card-bullets">
      <li><strong>External factors</strong>: Diet, climate, and lifestyle exposures.</li>
      <li><strong>Dynamic variables</strong>: Can alter gene expression over time.</li>
    </ul>
  </div>

  <!-- Card 4: Vgxe (Bottom-Right) -->
  <div class="card card-vgxe" id="cardVgxe">
    <div class="card-pill pill-vgxe">Vg×e (Gene–Environment Interaction)</div>
    <ul class="card-bullets">
      <li><strong>Differential response</strong>: Environmental impact differs depending on specific genotype.</li>
      <li><strong>Non-additive effects</strong>: Genetic predisposition modulates response to environment (e.g. UV exposure, PKU diet).</li>
    </ul>
  </div>

  <!-- SVG Connectors -->
  <svg class="connectors" id="svgConnectors"></svg>

  <div class="watermark">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    Gemini Notebook
  </div>

  <script>
    const svg = document.getElementById("svgConnectors");

    function drawLine(cardEl, termEl, color, fromPos, toPos, cardAnchorX = 0.5) {
      const cr = cardEl.getBoundingClientRect();
      const tr = termEl.getBoundingClientRect();

      let startX = cr.left + cr.width * cardAnchorX;
      let startY = fromPos === "bottom" ? cr.bottom : cr.top;

      let endX = tr.left + tr.width / 2;
      let endY = toPos === "top" ? tr.top - 6 : tr.bottom + 6;

      const midY = (startY + endY) / 2;
      const pathD = "M " + startX + " " + startY + " C " + startX + " " + midY + ", " + endX + " " + midY + ", " + endX + " " + endY;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathD);
      path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", "2.5");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", endX);
      circle.setAttribute("cy", endY);
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", color);
      svg.appendChild(circle);
    }

    drawLine(document.getElementById("cardVp"), document.getElementById("termVp"), "#2563eb", "bottom", "top", 0.55);
    drawLine(document.getElementById("cardVg"), document.getElementById("termVg"), "#059669", "top", "bottom", 0.7);
    drawLine(document.getElementById("cardVe"), document.getElementById("termVe"), "#d97706", "bottom", "top", 0.3);
    drawLine(document.getElementById("cardVgxe"), document.getElementById("termVgxe"), "#7c3aed", "top", "bottom", 0.45);
  </script>
</body>
</html>`;

  await page.setContent(html);
  await page.screenshot({ path: "public/test_equation_render.png" });
  await browser.close();
  console.log("Rendered public/test_equation_render.png");
}

render().catch(console.error);
