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
      ctx.quadraticCurveTo(x + width, y + width, x + width, y + radius);
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

    function drawHandwrittenCross(ctx, x, y, size = 11, color = "#dc2626") {
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

    function drawHandwrittenTick(ctx, x, y, size = 10, color = "#16a34a") {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x - size / 3, y + size);
      ctx.lineTo(x + size * 1.3, y - size);
      ctx.stroke();
      ctx.restore();
    }

    function drawHandwrittenEllipse(ctx, cx, cy, rx, ry, color = "#dc2626") {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, -0.03, 0, Math.PI * 2);
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
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(58, 642, 1260, 72);
      ctx.restore();
    }

    function drawMarginTag(ctx, x, y, text, color = "#dc2626") {
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(text, x, y);
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
    highlight(ctx2, 235, 452, 205, 18, "rgba(254, 226, 226, 0.85)");
    // Highlight "influencer, Zara Croft" in line 6
    highlight(ctx2, 172, 542, 160, 18, "rgba(254, 226, 226, 0.85)");
    drawHandwrittenCross(ctx2, 448, 461, 7);
    drawHandwrittenCross(ctx2, 340, 551, 7);

    // Left margin tag for Failure 1
    drawMarginTag(ctx2, 18, 461, "❌ #1");
    drawMarginTag(ctx2, 18, 551, "❌ #1");

    // Update bottom task bar
    clearBottomTaskBar(ctx2);
    ctx2.save();
    ctx2.fillStyle = "#b91c1c";
    ctx2.font = "bold 16.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx2.fillText("❌ Failure 1 Identified (Sample Size):", 78, 685);
    ctx2.fillStyle = "#1e293b";
    ctx2.font = "500 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx2.fillText("No sample size reported — relies solely on anecdotal influencer claims ('cured dozens', n = ?).", 380, 685);
    ctx2.restore();

    // -------------------------------------------------------------
    // BUILD 3: Failure 2 (Emotional & Unscientific Language)
    // -------------------------------------------------------------
    const { c: c3, ctx: ctx3 } = getBase();
    // Retain Failure 1
    highlight(ctx3, 235, 452, 205, 18, "rgba(254, 226, 226, 0.85)");
    highlight(ctx3, 172, 542, 160, 18, "rgba(254, 226, 226, 0.85)");
    drawHandwrittenCross(ctx3, 448, 461, 7);
    drawHandwrittenCross(ctx3, 340, 551, 7);
    drawMarginTag(ctx3, 18, 461, "❌ #1");
    drawMarginTag(ctx3, 18, 551, "❌ #1");

    // Headline annotations for Failure 2
    drawHandwrittenCross(ctx3, 44, 205, 12, "#dc2626"); // Cross next to Miracle S1 Jab
    drawHandwrittenEllipse(ctx3, 218, 300, 150, 36, "#dc2626"); // Circle around Tiredness Fast!
    ctx3.save();
    ctx3.fillStyle = "#dc2626";
    ctx3.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText("???", 390, 305);
    ctx3.restore();

    // Highlight emotional language in body
    highlight(ctx3, 388, 392, 105, 18, "rgba(254, 240, 138, 0.8)"); // 'wonder drug'
    highlight(ctx3, 75, 572, 140, 18, "rgba(254, 240, 138, 0.8)");  // absolute miracle!
    drawMarginTag(ctx3, 18, 205, "❌ #2");

    // Update bottom task bar
    clearBottomTaskBar(ctx3);
    ctx3.save();
    ctx3.fillStyle = "#b91c1c";
    ctx3.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText("❌ Failure 1: No Sample Size (Anecdotal)", 78, 685);
    ctx3.fillStyle = "#94a3b8";
    ctx3.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText(" | ", 380, 685);
    ctx3.fillStyle = "#b91c1c";
    ctx3.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText("❌ Failure 2: Emotional & Unscientific Language", 400, 685);
    ctx3.fillStyle = "#334155";
    ctx3.font = "500 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx3.fillText("('Miracle Jab', 'Fast!', 'wonder drug', 'fountain of youth')", 770, 685);
    ctx3.restore();

    // -------------------------------------------------------------
    // BUILD 4: Failure 3 + Scientific RCT Contrast
    // -------------------------------------------------------------
    const { c: c4, ctx: ctx4 } = getBase();
    // Retain Failure 1
    highlight(ctx4, 235, 452, 205, 18, "rgba(254, 226, 226, 0.85)");
    highlight(ctx4, 172, 542, 160, 18, "rgba(254, 226, 226, 0.85)");
    drawHandwrittenCross(ctx4, 448, 461, 7);
    drawHandwrittenCross(ctx4, 340, 551, 7);
    drawMarginTag(ctx4, 18, 461, "❌ #1");
    drawMarginTag(ctx4, 18, 551, "❌ #1");

    // Retain Failure 2
    drawHandwrittenCross(ctx4, 44, 205, 12, "#dc2626");
    drawHandwrittenEllipse(ctx4, 218, 300, 150, 36, "#dc2626");
    ctx4.save();
    ctx4.fillStyle = "#dc2626";
    ctx4.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx4.fillText("???", 390, 305);
    ctx4.restore();
    highlight(ctx4, 388, 392, 105, 18, "rgba(254, 240, 138, 0.8)");
    highlight(ctx4, 75, 572, 140, 18, "rgba(254, 240, 138, 0.8)");
    drawMarginTag(ctx4, 18, 205, "❌ #2");

    // Failure 3 Highlights on Tabloid (VIP-only & act fast)
    highlight(ctx4, 380, 572, 110, 18, "rgba(254, 205, 211, 0.85)");
    highlight(ctx4, 140, 572, 85, 18, "rgba(254, 205, 211, 0.85)");
    drawMarginTag(ctx4, 18, 575, "❌ #3");

    // Scientific Highlights (Right Container)
    highlight(ctx4, 704, 423, 245, 18, "rgba(187, 247, 208, 0.8)"); // double-blind, placebo-controlled
    highlight(ctx4, 704, 480, 215, 18, "rgba(254, 240, 138, 0.85)"); // cohort N=2000 patients
    highlight(ctx4, 704, 540, 390, 18, "rgba(187, 247, 208, 0.8)"); // statistically significant (p < 0.05)

    drawHandwrittenTick(ctx4, 958, 432, 9);
    drawHandwrittenTick(ctx4, 928, 489, 9);
    drawHandwrittenTick(ctx4, 1105, 549, 9);

    // Update bottom task bar: Comprehensive Summary
    clearBottomTaskBar(ctx4);
    ctx4.save();
    // Line 1: Tabloid Failures
    ctx4.fillStyle = "#b91c1c";
    ctx4.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx4.fillText("❌ Tabloid Failures:", 76, 668);
    ctx4.fillStyle = "#1e293b";
    ctx4.font = "500 13.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx4.fillText("1. No Sample Size (Zara Croft anecdote)  ·  2. Emotional Hype ('Miracle/wonder')  ·  3. Commercial Bias ('VIP stock', no controls)", 218, 668);

    // Line 2: Scientific Gold Standard
    ctx4.fillStyle = "#15803d";
    ctx4.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx4.fillText("✔️ Clinical RCT Standard:", 76, 696);
    ctx4.fillStyle = "#1e293b";
    ctx4.font = "500 13.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx4.fillText("N = 2,000 Patient Cohort  ·  Double-Blind Placebo Control  ·  Statistically Significant (p < 0.05) with monitored safety", 252, 696);
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

  await fs.writeFile(path.resolve("scratch/clean_b1.png"), b1);
  await fs.writeFile(path.resolve("scratch/clean_b2.png"), b2);
  await fs.writeFile(path.resolve("scratch/clean_b3.png"), b3);
  await fs.writeFile(path.resolve("scratch/clean_b4.png"), b4);
  console.log("Saved scratch/clean_b[1-4].png");

  await browser.close();
  process.exit(0);
}

run();
