import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const SOURCE_IMAGE = "/Users/danieltagg/.gemini/antigravity-ide/brain/8e0d4b0f-ebf8-4339-93e1-69956788e3a6/slide_8_content_1790076181208.jpg";

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await page.goto("file://" + SOURCE_IMAGE);

  const images = await page.evaluate(() => {
    const w = 1376, h = 768;
    const img = document.querySelector("img");

    function getBase() {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return { c, ctx };
    }

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }

    function drawHandwrittenCross(ctx, x, y, size, color = "#dc2626") {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x - size, y - size);
      ctx.lineTo(x + size, y + size);
      ctx.moveTo(x + size, y - size);
      ctx.lineTo(x - size, y + size);
      ctx.stroke();
      ctx.restore();
    }

    function drawHandwrittenTick(ctx, x, y, size, color = "#16a34a") {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x - size / 3, y + size);
      ctx.lineTo(x + size * 1.2, y - size);
      ctx.stroke();
      ctx.restore();
    }

    function drawHandwrittenEllipse(ctx, cx, cy, rx, ry, color = "#dc2626") {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, -0.04, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function highlight(ctx, x, y, w, h, color = "rgba(254, 240, 138, 0.65)") {
      ctx.save();
      ctx.fillStyle = color;
      roundRect(ctx, x, y, w, h, 3, true, false);
      ctx.restore();
    }

    function clearBottomTaskBar(ctx) {
      // Clear inside of task box (x: 58, y: 642, w: 1260, h: 72)
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(58, 642, 1260, 72);
      ctx.restore();
    }

    // -------------------------------------------------------------
    // BUILD 1: Clean Actual Content Baseline (No Answers)
    // -------------------------------------------------------------
    const { c: c1 } = getBase();

    // -------------------------------------------------------------
    // BUILD 2: Failure 1 (No Sample Size / Anecdotal Evidence)
    // -------------------------------------------------------------
    const { c: c2, ctx: ctx2 } = getBase();
    // Highlight "has cured dozens of individuals," in line 3
    highlight(ctx2, 235, 451, 205, 20, "rgba(254, 226, 226, 0.8)");
    // Highlight "influencer, Zara Croft" in line 6
    highlight(ctx2, 172, 541, 160, 20, "rgba(254, 226, 226, 0.8)");
    drawHandwrittenCross(ctx2, 448, 461, 7);
    drawHandwrittenCross(ctx2, 340, 551, 7);

    // Callout badge floating neatly in empty space next to Fast! (x: 395, y: 265)
    ctx2.save();
    ctx2.fillStyle = "#fef2f2";
    ctx2.strokeStyle = "#dc2626";
    ctx2.lineWidth = 1.8;
    roundRect(ctx2, 385, 260, 288, 92, 8, true, true);
    ctx2.fillStyle = "#b91c1c";
    ctx2.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx2.fillText("❌ Failure 1: No Sample Size", 398, 282);
    ctx2.fillStyle = "#334155";
    ctx2.font = "500 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx2.fillText("• Quotes single influencer (Zara Croft)", 402, 303);
    ctx2.fillText("• Vague 'cured dozens' claims", 402, 321);
    ctx2.fillText("• Zero clinical cohort data (n = ?)", 402, 339);
    ctx2.restore();

    // Update bottom task bar
    clearBottomTaskBar(ctx2);
    ctx2.save();
    ctx2.fillStyle = "#b91c1c";
    ctx2.font = "bold 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx2.fillText("Failure 1 Identified:", 80, 685);
    ctx2.fillStyle = "#1e293b";
    ctx2.font = "500 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx2.fillText("No sample size reported — relies solely on anecdotal influencer testimonial (fails PROMPT Methodology).", 252, 685);
    ctx2.restore();

    // -------------------------------------------------------------
    // BUILD 3: Failure 2 (Emotional & Unscientific Language)
    // -------------------------------------------------------------
    const { c: c3, ctx: ctx3 } = getBase();
    // Retain Failure 1
    highlight(ctx3, 235, 451, 205, 20, "rgba(254, 226, 226, 0.8)");
    highlight(ctx3, 172, 541, 160, 20, "rgba(254, 226, 226, 0.8)");
    drawHandwrittenCross(ctx3, 448, 461, 7);
    drawHandwrittenCross(ctx3, 340, 551, 7);

    // Headline annotations for Failure 2
    drawHandwrittenCross(ctx3, 48, 205, 11, "#dc2626"); // Cross next to Miracle S1 Jab
    drawHandwrittenEllipse(ctx3, 218, 300, 150, 36, "#dc2626"); // Circle around Tiredness Fast!
    ctx3.save();
    ctx3.fillStyle = "#dc2626";
    ctx3.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText("???", 390, 310);
    ctx3.restore();

    // Highlight emotional language in body
    highlight(ctx3, 388, 392, 105, 20, "rgba(254, 240, 138, 0.75)"); // 'wonder drug'
    highlight(ctx3, 75, 572, 140, 20, "rgba(254, 240, 138, 0.75)");  // absolute miracle!

    // Callout card for Failure 1 & 2 in empty space (x: 440, y: 255)
    ctx3.save();
    ctx3.fillStyle = "#fef2f2";
    ctx3.strokeStyle = "#dc2626";
    ctx3.lineWidth = 1.8;
    roundRect(ctx3, 435, 255, 240, 102, 8, true, true);
    ctx3.fillStyle = "#b91c1c";
    ctx3.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText("❌ 2. Emotional Tone", 448, 276);
    ctx3.fillStyle = "#334155";
    ctx3.font = "500 11.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText("• 'Miracle Jab' & 'Cures Fast!'", 450, 296);
    ctx3.fillText("• 'wonder drug' / 'miracle'", 450, 314);
    ctx3.fillText("• Sensationalist persuasion", 450, 332);
    ctx3.restore();

    // Update bottom task bar
    clearBottomTaskBar(ctx3);
    ctx3.save();
    ctx3.fillStyle = "#b91c1c";
    ctx3.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText("❌ 1. No Sample Size (Anecdotal)", 80, 685);
    ctx3.fillStyle = "#64748b";
    ctx3.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText(" | ", 332, 685);
    ctx3.fillStyle = "#b91c1c";
    ctx3.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText("❌ 2. Emotional & Unscientific Language", 355, 685);
    ctx3.fillStyle = "#1e293b";
    ctx3.font = "500 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText("('Miracle', 'wonder drug', 'Fast!' clickbait hyperbole)", 685, 685);
    ctx3.restore();

    // -------------------------------------------------------------
    // BUILD 4: Failure 3 + Scientific RCT Contrast
    // -------------------------------------------------------------
    const { c: c4, ctx: ctx4 } = getBase();
    // Retain Failure 1
    highlight(ctx4, 235, 451, 205, 20, "rgba(254, 226, 226, 0.8)");
    highlight(ctx4, 172, 541, 160, 20, "rgba(254, 226, 226, 0.8)");
    drawHandwrittenCross(ctx4, 448, 461, 7);
    drawHandwrittenCross(ctx4, 340, 551, 7);

    // Retain Failure 2
    drawHandwrittenCross(ctx4, 48, 205, 11, "#dc2626");
    drawHandwrittenEllipse(ctx4, 218, 300, 150, 36, "#dc2626");
    ctx4.save();
    ctx4.fillStyle = "#dc2626";
    ctx4.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx4.fillText("???", 390, 310);
    ctx4.restore();
    highlight(ctx4, 388, 392, 105, 20, "rgba(254, 240, 138, 0.75)");
    highlight(ctx4, 75, 572, 140, 20, "rgba(254, 240, 138, 0.75)");

    // Failure 3 Highlights on Tabloid (VIP-only & act fast)
    highlight(ctx4, 380, 572, 110, 20, "rgba(254, 205, 211, 0.85)");
    highlight(ctx4, 140, 572, 85, 20, "rgba(254, 205, 211, 0.85)");

    // Scientific Highlights (Right Container)
    highlight(ctx4, 704, 423, 245, 20, "rgba(187, 247, 208, 0.75)"); // double-blind, placebo-controlled
    highlight(ctx4, 704, 480, 215, 20, "rgba(254, 240, 138, 0.75)"); // cohort N=2000 patients
    highlight(ctx4, 704, 540, 390, 20, "rgba(187, 247, 208, 0.75)"); // statistically significant (p < 0.05)

    drawHandwrittenTick(ctx4, 958, 433, 9);
    drawHandwrittenTick(ctx4, 928, 490, 9);
    drawHandwrittenTick(ctx4, 1105, 550, 9);

    // Callout card for Failure 3 on left
    ctx4.save();
    ctx4.fillStyle = "#fef2f2";
    ctx4.strokeStyle = "#dc2626";
    ctx4.lineWidth = 1.8;
    roundRect(ctx4, 435, 255, 240, 102, 8, true, true);
    ctx4.fillStyle = "#b91c1c";
    ctx4.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx4.fillText("❌ 3. Commercial Bias", 448, 276);
    ctx4.fillStyle = "#334155";
    ctx4.font = "500 11.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx4.fillText("• 'VIP stock' sales pitch", 450, 296);
    ctx4.fillText("• Zero control / placebo group", 450, 314);
    ctx4.fillText("• No side effects disclosed", 450, 332);
    ctx4.restore();

    // Update bottom task bar: Comprehensive Summary
    clearBottomTaskBar(ctx4);
    ctx4.save();
    ctx4.fillStyle = "#b91c1c";
    ctx4.font = "bold 14.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx4.fillText("❌ Tabloid Flaws: 1. No Sample Size  2. Emotional Hype  3. Commercial Bias (No Controls/Risks)", 76, 672);

    ctx4.fillStyle = "#15803d";
    ctx4.font = "bold 14.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx4.fillText("✔️ Clinical RCT Standard: N = 2000 Cohort  ·  Double-Blind Placebo Control  ·  Significant (p < 0.05)", 76, 698);
    ctx4.restore();

    return {
      b1: c1.toDataURL("image/png"),
      b2: c2.toDataURL("image/png"),
      b3: c3.toDataURL("image/png"),
      b4: c4.toDataURL("image/png")
    };
  });

  const b1 = Buffer.from(images.b1.replace(/^data:image\/png;base64,/, ""), "base64");
  const b2 = Buffer.from(images.b2.replace(/^data:image\/png;base64,/, ""), "base64");
  const b3 = Buffer.from(images.b3.replace(/^data:image\/png;base64,/, ""), "base64");
  const b4 = Buffer.from(images.b4.replace(/^data:image\/png;base64,/, ""), "base64");

  await fs.writeFile(path.resolve("scratch/test_dash_b1.png"), b1);
  await fs.writeFile(path.resolve("scratch/test_dash_b2.png"), b2);
  await fs.writeFile(path.resolve("scratch/test_dash_b3.png"), b3);
  await fs.writeFile(path.resolve("scratch/test_dash_b4.png"), b4);
  console.log("Saved scratch/test_dash_b[1-4].png");

  await browser.close();
  process.exit(0);
}

run();
