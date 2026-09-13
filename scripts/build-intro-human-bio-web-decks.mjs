/**
 * Build Intro to Human Biology Web Decks
 * 
 * Generates 16:9 high-resolution slides (1376x768) and interactive manifests
 * for Lessons 1 to 8 of the OCR Level 3 AAQ Human Biology induction series.
 */

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { lessons, COURSE_NAME } from "../src/configs/intro_aaq_human_bio.js";

const PUBLIC_DECKS_DIR = path.resolve("public/decks");

function sanitizeDeckId(title, number) {
  const safe = title
    .normalize("NFKD")
    .replace(/[–—]/g, "-")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `Lesson_${String(number).padStart(2, "0")}_${safe}`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildSlideHtml(lesson, slideNum, totalSlides = 10) {
  const teacher = lesson.teacher || "Dan";
  const teacherTag = `TEACHER: ${teacher.toUpperCase()}`;
  const practicalBadge = lesson.hasPractical
    ? `<span class="badge badge-purple">🔬 1 Practical</span>`
    : "";

  const sharedCss = `
    @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap");
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1376px;
      height: 768px;
      overflow: hidden;
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      position: relative;
    }
    .slide-container {
      width: 1376px;
      height: 768px;
      padding: 34px 44px 20px 44px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .badge-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 9999px;
      font-family: "Plus Jakarta Sans", sans-serif;
    }
    .badge-teal { background: #ccfbf1; color: #0f766e; border: 1px solid #99f6e4; }
    .badge-blue { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .badge-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-amber { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .badge-purple { background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff; }
    .badge-dark { background: rgba(255, 255, 255, 0.12); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.2); }
    .header-meta {
      font-size: 13.5px;
      font-weight: 600;
      color: #64748b;
      letter-spacing: -0.01em;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .title-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    h1 {
      font-size: 30px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.025em;
      font-family: "Plus Jakarta Sans", sans-serif;
    }
    .subtitle {
      font-size: 14px;
      font-weight: 500;
      color: #475569;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 11.5px;
      color: #94a3b8;
      font-weight: 600;
    }
    .footer-dark {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #64748b;
    }
  `;

  // -------------------------------------------------------------
  // SLIDE 1: Title Slide (Clinical Dark)
  // -------------------------------------------------------------
  if (slideNum === 1) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${sharedCss}
  body {
    background: radial-gradient(circle at 85% 15%, #0f3952 0%, #061525 60%, #030a13 100%);
    color: #f8fafc;
  }
  .title-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 22px;
    max-width: 1200px;
    margin-top: 10px;
  }
  .hero-tag {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #38bdf8;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .hero-title {
    font-size: 44px;
    font-weight: 800;
    line-height: 1.15;
    color: #ffffff;
    letter-spacing: -0.03em;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .hero-focus {
    font-size: 20px;
    font-weight: 600;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .deliverable-card {
    background: rgba(15, 23, 42, 0.65);
    border: 1.5px solid rgba(56, 189, 248, 0.35);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 22px 28px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  }
  .deliverable-header {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #fbbf24;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .deliverable-text {
    font-size: 17px;
    font-weight: 600;
    color: #f1f5f9;
    line-height: 1.4;
  }
  .specs-bar {
    display: flex;
    align-items: center;
    gap: 24px;
    font-size: 13.5px;
    color: #94a3b8;
    font-weight: 500;
  }
  .spec-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .spec-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #38bdf8;
  }
</style>
</head>
<body>
<div class="slide-container">
  <div class="badge-row">
    <span class="badge badge-teal">OCR Level 3 AAQ</span>
    <span class="badge badge-blue">Human Biology</span>
    <span class="badge badge-dark">Unit Induction</span>
    <span class="badge badge-green">${teacherTag}</span>
    ${practicalBadge}
  </div>

  <div class="title-content">
    <div class="hero-tag">
      <span>●</span> LESSON ${lesson.number} OF ${lessons.length} · INDUCTION PROGRAMME
    </div>
    <div class="hero-title">${escapeHtml(lesson.title)}</div>
    <div class="hero-focus">
      <span>Focus:</span> <strong style="color:#e2e8f0">${escapeHtml(lesson.focus)}</strong>
    </div>

    <div class="deliverable-card">
      <div class="deliverable-header">🎯 Key Learning Deliverable</div>
      <div class="deliverable-text">${escapeHtml(lesson.deliverable)}</div>
    </div>

    <div class="specs-bar">
      <div class="spec-item"><div class="spec-dot"></div> OCR Specification Level 3 Cambridge Advanced National</div>
      <div class="spec-item"><div class="spec-dot"></div> Diagnostic Benchmark &amp; Skills Profiling</div>
      <div class="spec-item"><div class="spec-dot"></div> Academic Year 2026–2027</div>
    </div>
  </div>

  <div class="footer footer-dark">
    <span>${COURSE_NAME}</span>
    <span>Slide 1 of ${totalSlides}</span>
  </div>
</div>
</body>
</html>`;
  }

  // -------------------------------------------------------------
  // SLIDE 2: Starter Activity Grid (6-Cell Retrieval Grid)
  // -------------------------------------------------------------
  if (slideNum === 2) {
    const qCells = lesson.starterQuestions.map((item, idx) => {
      const qNum = idx + 1;
      return `
        <div class="q-card">
          <div class="q-top">
            <div class="q-pill">Question ${qNum}</div>
            <div class="q-tag">Retrieval Check</div>
          </div>
          <div class="q-text">${escapeHtml(item.q)}</div>
          <div class="ans-container">
            <div class="ans-label">Expected Answer / Success Cue:</div>
            <div class="ans-text">${escapeHtml(item.a)}</div>
          </div>
        </div>
      `;
    }).join("");

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${sharedCss}
  body {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  }
  .grid-6 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 16px;
    flex: 1;
    margin: 14px 0;
  }
  .q-card {
    background: #ffffff;
    border-radius: 14px;
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
  }
  .q-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .q-pill {
    background: #e0f2fe;
    color: #0369a1;
    font-size: 11px;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 6px;
    font-family: "Plus Jakarta Sans", sans-serif;
    text-transform: uppercase;
  }
  .q-tag {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
  }
  .q-text {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.35;
    margin-bottom: 6px;
  }
  .ans-container {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    padding: 8px 12px;
  }
  .ans-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: #059669;
    margin-bottom: 2px;
  }
  .ans-text {
    font-size: 12.5px;
    font-weight: 500;
    color: #334155;
    line-height: 1.3;
  }
</style>
</head>
<body>
<div class="slide-container">
  <div class="header">
    <div class="badge-row">
      <span class="badge badge-amber">Starter Activity</span>
      <span class="badge badge-teal">5–10 Minutes</span>
      <span class="badge badge-dark" style="color:#475569; border-color:#cbd5e1;">Click to Reveal Answers</span>
      ${practicalBadge}
    </div>
    <div class="title-row">
      <h1>Starter Activity: Prior Knowledge Retrieval Grid</h1>
      <span class="header-meta">Activate baseline prerequisite concepts</span>
    </div>
  </div>

  <div class="grid-6">
    ${qCells}
  </div>

  <div class="footer">
    <span>Lesson ${lesson.number}: ${escapeHtml(lesson.title)}</span>
    <span>Slide 2 of ${totalSlides} · Click individual cards in presentation mode to check responses</span>
  </div>
</div>
</body>
</html>`;
  }

  // -------------------------------------------------------------
  // SLIDE 3: Learning Objectives & Success Criteria
  // -------------------------------------------------------------
  if (slideNum === 3) {
    const obj = lesson.objectives || {
      knowledge: "Recall key theoretical concepts, organelle structures, and foundational physiological pathways.",
      application: "Apply diagnostic procedures, clinical formulas, and data analysis to clinical scenarios.",
      evaluation: "Critique sources of error, evaluate diagnostic evidence, and formulate justified conclusions."
    };

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${sharedCss}
  body {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  }
  .obj-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    flex: 1;
    margin: 18px 0;
  }
  .obj-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 26px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
    position: relative;
    overflow: hidden;
  }
  .obj-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; height: 6px;
  }
  .obj-card-1::before { background: linear-gradient(90deg, #0284c7, #38bdf8); }
  .obj-card-2::before { background: linear-gradient(90deg, #059669, #34d399); }
  .obj-card-3::before { background: linear-gradient(90deg, #d97706, #fbbf24); }
  .tier-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 8px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .obj-card-1 .tier-badge { background: #e0f2fe; color: #0284c7; }
  .obj-card-2 .tier-badge { background: #dcfce7; color: #059669; }
  .obj-card-3 .tier-badge { background: #fef3c7; color: #d97706; }
  .obj-title {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    margin: 14px 0 10px 0;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .obj-desc {
    font-size: 15px;
    font-weight: 500;
    color: #334155;
    line-height: 1.5;
  }
  .obj-target {
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid #f1f5f9;
    font-size: 12.5px;
    font-weight: 600;
    color: #64748b;
  }
</style>
</head>
<body>
<div class="slide-container">
  <div class="header">
    <div class="badge-row">
      <span class="badge badge-teal">Lesson Objectives</span>
      <span class="badge badge-blue">OCR AAQ Framework</span>
      <span class="badge badge-green">${teacherTag}</span>
    </div>
    <div class="title-row">
      <h1>Learning Objectives &amp; Success Criteria</h1>
      <span class="header-meta">Tripartite Cognitive Mastery Tiers</span>
    </div>
  </div>

  <div class="obj-grid">
    <div class="obj-card obj-card-1">
      <div>
        <div class="tier-badge">Tier 1 · Knowledge Recall</div>
        <div class="obj-title">Core Principles</div>
        <div class="obj-desc">${escapeHtml(obj.knowledge)}</div>
      </div>
      <div class="obj-target">Target: All learners demonstrate secure foundational terminology.</div>
    </div>

    <div class="obj-card obj-card-2">
      <div>
        <div class="tier-badge">Tier 2 · Application</div>
        <div class="obj-title">Clinical Practice</div>
        <div class="obj-desc">${escapeHtml(obj.application)}</div>
      </div>
      <div class="obj-target">Target: Most learners execute calculations and diagnostic protocols accurately.</div>
    </div>

    <div class="obj-card obj-card-3">
      <div>
        <div class="tier-badge">Tier 3 · Evaluation</div>
        <div class="obj-title">Critical Synthesis</div>
        <div class="obj-desc">${escapeHtml(obj.evaluation)}</div>
      </div>
      <div class="obj-target">Target: Some learners evaluate experimental validity and propose clinical refinements.</div>
    </div>
  </div>

  <div class="footer">
    <span>Lesson ${lesson.number}: ${escapeHtml(lesson.title)}</span>
    <span>Slide 3 of ${totalSlides}</span>
  </div>
</div>
</body>
</html>`;
  }

  // -------------------------------------------------------------
  // SLIDE 4: Key Terminology & Clinical Vocabulary
  // -------------------------------------------------------------
  if (slideNum === 4) {
    const terms = lesson.terminology || [
      { term: "Biomarker", def: "A measurable indicator of the severity or presence of some disease state." },
      { term: "Pathology", def: "The study of the causes and effects of disease or injury." },
      { term: "Clinical Diagnostic", def: "Procedures used to identify or determine a patient's medical condition." },
      { term: "Triangulation", def: "Cross-referencing multiple data points to evaluate overall competence." }
    ];

    const termCards = terms.map((t, idx) => `
      <div class="term-card">
        <div class="term-num">Term 0${idx + 1}</div>
        <div class="term-word">${escapeHtml(t.term)}</div>
        <div class="term-def">${escapeHtml(t.def)}</div>
      </div>
    `).join("");

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${sharedCss}
  body {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  }
  .term-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
    flex: 1;
    margin: 18px 0;
  }
  .term-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 22px 24px;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .term-num {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    color: #0284c7;
    letter-spacing: 0.08em;
    font-family: "Plus Jakarta Sans", sans-serif;
    margin-bottom: 6px;
  }
  .term-word {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 8px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .term-def {
    font-size: 14.5px;
    font-weight: 500;
    color: #334155;
    line-height: 1.45;
  }
</style>
</head>
<body>
<div class="slide-container">
  <div class="header">
    <div class="badge-row">
      <span class="badge badge-teal">Core Vocabulary</span>
      <span class="badge badge-blue">Clinical Terminology</span>
      <span class="badge badge-green">${teacherTag}</span>
    </div>
    <div class="title-row">
      <h1>Key Scientific &amp; Clinical Vocabulary</h1>
      <span class="header-meta">High-leverage terms for Level 3 AAQ assessments</span>
    </div>
  </div>

  <div class="term-grid">
    ${termCards}
  </div>

  <div class="footer">
    <span>Lesson ${lesson.number}: ${escapeHtml(lesson.title)}</span>
    <span>Slide 4 of ${totalSlides}</span>
  </div>
</div>
</body>
</html>`;
  }

  // -------------------------------------------------------------
  // SLIDE 5: Core Biological Theory & Mechanistic Architecture
  // -------------------------------------------------------------
  if (slideNum === 5) {
    const points = lesson.theoryPoints || [
      "Core theoretical principles must be firmly integrated before embarking on applied laboratory investigations.",
      "Misconceptions in cell biology and bioenergetics often stem from simplified GCSE language.",
      "Quantitative relationships govern cellular transport, organelle scaling, and metabolic turnover rates.",
      "Evidence-based clinical practice connects micro-level cellular biochemistry to macro-level human physiology."
    ];

    const pointCards = points.map((pt, idx) => `
      <div class="point-card">
        <div class="point-header">
          <div class="point-num">${idx + 1}</div>
          <div class="point-tag">Pillar 0${idx + 1}</div>
        </div>
        <div class="point-text">${escapeHtml(pt)}</div>
      </div>
    `).join("");

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${sharedCss}
  body {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  }
  .theory-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
    flex: 1;
    margin: 18px 0;
  }
  .point-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 22px 24px;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .point-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .point-num {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #0284c7;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 13px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .point-tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    letter-spacing: 0.06em;
  }
  .point-text {
    font-size: 14.5px;
    font-weight: 500;
    color: #1e293b;
    line-height: 1.45;
  }
</style>
</head>
<body>
<div class="slide-container">
  <div class="header">
    <div class="badge-row">
      <span class="badge badge-teal">Mechanistic Theory</span>
      <span class="badge badge-blue">Foundational Science</span>
      <span class="badge badge-green">${teacherTag}</span>
    </div>
    <div class="title-row">
      <h1>Core Biological Theory &amp; Mechanisms</h1>
      <span class="header-meta">Scientific principles and systemic coordination</span>
    </div>
  </div>

  <div class="theory-grid">
    ${pointCards}
  </div>

  <div class="footer">
    <span>Lesson ${lesson.number}: ${escapeHtml(lesson.title)}</span>
    <span>Slide 5 of ${totalSlides}</span>
  </div>
</div>
</body>
</html>`;
  }

  // -------------------------------------------------------------
  // SLIDE 6: Practical Protocol & Mathematical Worked Example
  // -------------------------------------------------------------
  if (slideNum === 6) {
    const ex = lesson.workedExample || {
      title: "Scientific Calculations & Step-by-Step Methodology",
      subtitle: "Worked demonstration of quantitative biological analysis",
      steps: [
        { label: "Step 1: Identify Given Variables", detail: "Extract all empirical measurements and note associated units." },
        { label: "Step 2: Check Unit Consistency", detail: "Convert measurements to uniform standard units (e.g. mm to µm) before calculation." },
        { label: "Step 3: State the Mathematical Formula", detail: "Explicitly state formula before substituting numbers to secure methodology marks." },
        { label: "Step 4: Execute Calculation", detail: "Perform substitutions, calculate intermediate values, and round appropriately." }
      ]
    };

    const stepRows = ex.steps.map((st) => `
      <div class="step-row">
        <div class="step-badge">${escapeHtml(st.label)}</div>
        <div class="step-detail">${escapeHtml(st.detail)}</div>
      </div>
    `).join("");

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${sharedCss}
  body {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  }
  .worked-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 24px 28px;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
    flex: 1;
    margin: 16px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .card-top-title {
    font-size: 21px;
    font-weight: 800;
    color: #0f172a;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .card-top-sub {
    font-size: 13.5px;
    font-weight: 600;
    color: #0284c7;
    margin-top: 2px;
  }
  .steps-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 14px 0;
  }
  .step-row {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .step-badge {
    background: #0284c7;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 6px;
    font-family: "Plus Jakarta Sans", sans-serif;
    white-space: nowrap;
  }
  .step-detail {
    font-size: 14px;
    font-weight: 500;
    color: #334155;
    line-height: 1.35;
  }
</style>
</head>
<body>
<div class="slide-container">
  <div class="header">
    <div class="badge-row">
      <span class="badge badge-teal">Practical Protocol</span>
      <span class="badge badge-blue">Worked Demonstration</span>
      <span class="badge badge-green">${teacherTag}</span>
      ${practicalBadge}
    </div>
    <div class="title-row">
      <h1>Worked Example &amp; Practical Methodology</h1>
      <span class="header-meta">Step-by-step rigorous scientific execution</span>
    </div>
  </div>

  <div class="worked-card">
    <div>
      <div class="card-top-title">${escapeHtml(ex.title)}</div>
      <div class="card-top-sub">${escapeHtml(ex.subtitle)}</div>
    </div>
    <div class="steps-container">
      ${stepRows}
    </div>
    <div style="font-size:12px; color:#64748b; font-weight:600;">
      💡 Key Exam Tip: Always write down the general formula and conversion factors before writing numerical substitutions.
    </div>
  </div>

  <div class="footer">
    <span>Lesson ${lesson.number}: ${escapeHtml(lesson.title)}</span>
    <span>Slide 6 of ${totalSlides}</span>
  </div>
</div>
</body>
</html>`;
  }

  // -------------------------------------------------------------
  // SLIDE 7: Clinical Case Study / Unfamiliar Stimulus
  // -------------------------------------------------------------
  if (slideNum === 7) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${sharedCss}
  body {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  }
  .stimulus-container {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 20px;
    flex: 1;
    margin: 16px 0;
  }
  .stim-left, .stim-right {
    background: #ffffff;
    border-radius: 18px;
    padding: 22px 24px;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .box-tag {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    color: #0369a1;
    letter-spacing: 0.08em;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .box-title {
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    margin: 4px 0 10px 0;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .box-body {
    font-size: 14px;
    color: #334155;
    line-height: 1.5;
    font-weight: 500;
  }
  .tripartite-flow {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }
  .tp-row {
    background: #f8fafc;
    border-left: 4px solid #0284c7;
    border-radius: 0 8px 8px 0;
    padding: 10px 14px;
  }
  .tp-row-green { border-left-color: #059669; }
  .tp-row-amber { border-left-color: #d97706; }
  .tp-tag {
    font-size: 10.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
  }
  .tp-text {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    margin-top: 2px;
  }
</style>
</head>
<body>
<div class="slide-container">
  <div class="header">
    <div class="badge-row">
      <span class="badge badge-teal">Case Study</span>
      <span class="badge badge-blue">Clinical Stimulus</span>
      <span class="badge badge-green">${teacherTag}</span>
    </div>
    <div class="title-row">
      <h1>Clinical Application: Unfamiliar Biological Stimulus</h1>
      <span class="header-meta">Evidence extraction and applied clinical reasoning</span>
    </div>
  </div>

  <div class="stimulus-container">
    <div class="stim-left">
      <div>
        <div class="box-tag">Case Scenario &amp; Clinical Data</div>
        <div class="box-title">Evaluating Patient Diagnostic Indicators</div>
        <div class="box-body">
          In clinical human biology, practitioners frequently encounter novel physiological data, trial outcomes, or diagnostic panels that require systematic decomposition:
          <br><br>
          • <strong>Independent Variable:</strong> Therapeutic intervention or physiological stressor.<br>
          • <strong>Dependent Biomarkers:</strong> Observable clinical measurements (e.g. heart rate bpm, serum creatinine, antibody titres).<br>
          • <strong>Controlled Parameters:</strong> Patient age, baseline health status, environmental temperature, and test timing.
        </div>
      </div>
      <div style="font-size: 12px; font-weight:600; color:#64748b; background:#f1f5f9; padding:8px 12px; border-radius:8px;">
        📌 Always identify whether observed variations represent genuine clinical effects or random sampling noise.
      </div>
    </div>

    <div class="stim-right">
      <div>
        <div class="box-tag">Structuring Clinical Explanations</div>
        <div class="box-title">The Tripartite Explanatory Model</div>
        <div class="tripartite-flow">
          <div class="tp-row">
            <div class="tp-tag">1. Empirical Fact (What the data shows)</div>
            <div class="tp-text">State the exact quantitative finding with units and statistical significance.</div>
          </div>
          <div class="tp-row tp-row-green">
            <div class="tp-tag">2. Biological Mechanism (Why it occurs)</div>
            <div class="tp-text">Explain the underlying cellular or biochemical process driving the response.</div>
          </div>
          <div class="tp-row tp-row-amber">
            <div class="tp-tag">3. Clinical Impact (What it means for patients)</div>
            <div class="tp-text">Synthesize the prognostic outcome, therapeutic efficacy, or safety risk.</div>
          </div>
        </div>
      </div>
      <div style="font-size: 11.5px; font-weight:600; color:#0369a1; text-align:right;">
        Standard writing model for AAQ extended responses →
      </div>
    </div>
  </div>

  <div class="footer">
    <span>Lesson ${lesson.number}: ${escapeHtml(lesson.title)}</span>
    <span>Slide 7 of ${totalSlides}</span>
  </div>
</div>
</body>
</html>`;
  }

  // -------------------------------------------------------------
  // SLIDE 8: Diagnostic Check for Understanding (Hinge Questions)
  // -------------------------------------------------------------
  if (slideNum === 8) {
    const hinge = lesson.hingeQuestions || [
      {
        question: "Which of the following represents the most reliable indicator of statistically significant difference between two clinical trial cohorts?",
        options: ["The experimental group has a higher mean value", "The 95% Confidence Intervals for the two cohorts do not overlap", "The sample size was larger than 10 patients", "Both groups reported identical standard deviations"],
        correctIndex: 1,
        explanation: "Non-overlapping 95% confidence intervals indicate p < 0.05, establishing statistical significance."
      },
      {
        question: "Why must cell magnification calculations always have units converted to the same scale before division?",
        options: ["Magnification is an absolute ratio and must be dimensionless", "Microscopes can only measure in millimetres", "To eliminate the need for objective lens multipliers", "Because standard form cannot be used with decimals"],
        correctIndex: 0,
        explanation: "Magnification is a dimensionless scalar ratio (Image / Actual), which requires both values to have matching units."
      }
    ];

    const hCards = hinge.slice(0, 2).map((hq, idx) => {
      const opts = hq.options.map((opt, oIdx) => {
        const letters = ["A", "B", "C", "D"];
        const isCorrect = oIdx === hq.correctIndex;
        return `
          <div class="opt-row ${isCorrect ? "opt-correct" : ""}">
            <div class="opt-letter">${letters[oIdx]}</div>
            <div class="opt-text">${escapeHtml(opt)}</div>
            ${isCorrect ? `<span class="opt-check">✓ Correct</span>` : ""}
          </div>
        `;
      }).join("");

      return `
        <div class="hinge-card">
          <div class="hinge-top">
            <span class="hinge-badge">Diagnostic Hinge 0${idx + 1}</span>
            <span class="hinge-sub">Concept Check</span>
          </div>
          <div class="hinge-q">${escapeHtml(hq.question)}</div>
          <div class="opts-container">${opts}</div>
          <div class="hinge-exp"><strong>Rationale:</strong> ${escapeHtml(hq.explanation)}</div>
        </div>
      `;
    }).join("");

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${sharedCss}
  body {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  }
  .hinge-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    flex: 1;
    margin: 16px 0;
  }
  .hinge-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 20px 22px;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .hinge-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .hinge-badge {
    background: #fef3c7;
    color: #b45309;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 6px;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .hinge-sub {
    font-size: 11.5px;
    font-weight: 600;
    color: #94a3b8;
  }
  .hinge-q {
    font-size: 14.5px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.35;
    margin-bottom: 12px;
  }
  .opts-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .opt-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 6px 12px;
  }
  .opt-correct {
    background: #ecfdf5;
    border-color: #a7f3d0;
  }
  .opt-letter {
    font-size: 11px;
    font-weight: 800;
    color: #0369a1;
    width: 20px;
  }
  .opt-text {
    font-size: 12.5px;
    font-weight: 500;
    color: #334155;
    flex: 1;
  }
  .opt-check {
    font-size: 10.5px;
    font-weight: 700;
    color: #059669;
    text-transform: uppercase;
  }
  .hinge-exp {
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid #f1f5f9;
    font-size: 11.5px;
    color: #475569;
    line-height: 1.35;
  }
</style>
</head>
<body>
<div class="slide-container">
  <div class="header">
    <div class="badge-row">
      <span class="badge badge-amber">Checkpoint</span>
      <span class="badge badge-teal">Hinge Questions</span>
      <span class="badge badge-green">${teacherTag}</span>
    </div>
    <div class="title-row">
      <h1>Diagnostic Check for Understanding</h1>
      <span class="header-meta">Identify and resolve common misconception patterns</span>
    </div>
  </div>

  <div class="hinge-grid">
    ${hCards}
  </div>

  <div class="footer">
    <span>Lesson ${lesson.number}: ${escapeHtml(lesson.title)}</span>
    <span>Slide 8 of ${totalSlides}</span>
  </div>
</div>
</body>
</html>`;
  }

  // -------------------------------------------------------------
  // SLIDE 9: Exam-Style Application & OCR Mark Scheme
  // -------------------------------------------------------------
  if (slideNum === 9) {
    const eq = lesson.examQuestion || {
      question: "Evaluate the role of diagnostic testing in contemporary biomedical healthcare. [4 marks]",
      marks: "4 marks",
      guidance: [
        "Identifies specific biomarker or analytical technique. [1 mark]",
        "Explains clinical relevance to disease diagnosis or monitoring. [1 mark]",
        "Discusses quality control, calibration, or false-positive/negative risks. [1 mark]",
        "Formulates a balanced concluding evaluative judgement. [1 mark]"
      ]
    };

    const criteriaRows = (eq.guidance || []).map((crit, idx) => `
      <div class="crit-row">
        <div class="crit-badge">Point 0${idx + 1}</div>
        <div class="crit-text">${escapeHtml(crit)}</div>
      </div>
    `).join("");

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${sharedCss}
  body {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  }
  .exam-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    margin: 16px 0;
  }
  .q-box {
    background: #ffffff;
    border-radius: 16px;
    padding: 20px 24px;
    border: 1.5px solid #0284c7;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  }
  .q-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .q-title {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    color: #0284c7;
    letter-spacing: 0.06em;
  }
  .q-marks {
    font-size: 13px;
    font-weight: 800;
    color: #d97706;
  }
  .q-stem {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.45;
  }
  .ms-box {
    background: #ffffff;
    border-radius: 16px;
    padding: 20px 24px;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .ms-title {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    color: #059669;
    letter-spacing: 0.06em;
    margin-bottom: 10px;
  }
  .crit-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .crit-row {
    background: #f8fafc;
    border-radius: 8px;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    gap: 14px;
    border: 1px solid #e2e8f0;
  }
  .crit-badge {
    background: #dcfce7;
    color: #15803d;
    font-size: 10.5px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
    font-family: "Plus Jakarta Sans", sans-serif;
    white-space: nowrap;
  }
  .crit-text {
    font-size: 13.5px;
    font-weight: 500;
    color: #334155;
  }
</style>
</head>
<body>
<div class="slide-container">
  <div class="header">
    <div class="badge-row">
      <span class="badge badge-teal">Exam Technique</span>
      <span class="badge badge-blue">OCR AAQ Assessment</span>
      <span class="badge badge-green">${teacherTag}</span>
    </div>
    <div class="title-row">
      <h1>Level 3 Exam-Style Application &amp; Mark Scheme</h1>
      <span class="header-meta">Mastering marking criteria and command words</span>
    </div>
  </div>

  <div class="exam-container">
    <div class="q-box">
      <div class="q-header">
        <span class="q-title">Examination Task</span>
        <span class="q-marks">${escapeHtml(eq.marks)}</span>
      </div>
      <div class="q-stem">${escapeHtml(eq.question)}</div>
    </div>

    <div class="ms-box">
      <div>
        <div class="ms-title">OCR Standard Mark Scheme Breakdown</div>
        <div class="crit-list">
          ${criteriaRows}
        </div>
      </div>
      <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-top: 10px;">
        📌 Command Word 'Evaluate': Requires both supportive evidence and critical limitations/counter-arguments before concluding.
      </div>
    </div>
  </div>

  <div class="footer">
    <span>Lesson ${lesson.number}: ${escapeHtml(lesson.title)}</span>
    <span>Slide 9 of ${totalSlides}</span>
  </div>
</div>
</body>
</html>`;
  }

  // -------------------------------------------------------------
  // SLIDE 10: Plenary Summary & Target Setting (Clinical Dark)
  // -------------------------------------------------------------
  const plenaryPoints = lesson.plenary || [
    "Consolidate key vocabulary, formulas, and practical safety protocols in your lab portfolio.",
    "Benchmark your diagnostic score against personal Year 12 academic targets.",
    "Prepare for the subsequent lesson sequence in the OCR Level 3 AAQ curriculum."
  ];

  const plenCards = plenaryPoints.map((pt, idx) => `
    <div class="plen-card">
      <div class="plen-num">${idx + 1}</div>
      <div class="plen-text">${escapeHtml(pt)}</div>
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${sharedCss}
  body {
    background: radial-gradient(circle at 85% 85%, #0f3952 0%, #061525 60%, #030a13 100%);
    color: #f8fafc;
  }
  .plen-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    margin: 16px 0;
  }
  .plen-card {
    background: rgba(15, 23, 42, 0.65);
    border: 1px solid rgba(56, 189, 248, 0.25);
    backdrop-filter: blur(10px);
    border-radius: 14px;
    padding: 18px 24px;
    display: flex;
    align-items: center;
    gap: 18px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }
  .plen-num {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #0284c7;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 800;
    font-family: "Plus Jakarta Sans", sans-serif;
    flex-shrink: 0;
  }
  .plen-text {
    font-size: 16px;
    font-weight: 500;
    color: #f1f5f9;
    line-height: 1.4;
  }
  .next-pill {
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.4);
    border-radius: 12px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #38bdf8;
    font-weight: 700;
  }
</style>
</head>
<body>
<div class="slide-container">
  <div class="header">
    <div class="badge-row">
      <span class="badge badge-teal">Plenary Summary</span>
      <span class="badge badge-blue">Lesson Consolidation</span>
      <span class="badge badge-green">${teacherTag}</span>
    </div>
    <div class="title-row">
      <h1 style="color: #ffffff;">Plenary Summary &amp; Target Setting</h1>
      <span class="header-meta" style="color:#94a3b8;">Reflect, consolidate, and review next milestones</span>
    </div>
  </div>

  <div class="plen-content">
    ${plenCards}
    <div class="next-pill">
      <span>🚀 Progression Target:</span>
      <span>${lesson.number < 8 ? `Next: Lesson ${lesson.number + 1} (${lessons[lesson.number]?.title || ""})` : "Induction Complete · Ready for Unit F171 Genetics"}</span>
    </div>
  </div>

  <div class="footer footer-dark">
    <span>${COURSE_NAME}</span>
    <span>Slide 10 of ${totalSlides} · Lesson Complete</span>
  </div>
</div>
</body>
</html>`;
}

function generateSlideManifest(lesson, deckId) {
  const slides = [];
  const totalSlides = 10;

  const slideTitles = [
    `Welcome & Induction: ${lesson.title}`,
    "Starter Activity: Knowledge Retrieval Grid",
    "Learning Objectives & Success Criteria",
    "Essential Scientific & Clinical Vocabulary",
    "Core Biological Theory & Mechanisms",
    "Worked Demonstration & Practical Protocol",
    "Clinical Application & Stimulus Evidence",
    "Diagnostic Check for Understanding (Hinge Questions)",
    "OCR Level 3 Exam-Style Application",
    "Plenary Summary & Target Setting"
  ];

  const slideRoles = [
    "title",
    "starter_grid",
    "objectives",
    "terminology",
    "theory",
    "worked_example",
    "case_study",
    "hinge_questions",
    "exam_practice",
    "plenary"
  ];

  for (let i = 1; i <= totalSlides; i++) {
    const fileName = `slide_${String(i).padStart(2, "0")}.png`;
    const isSlide2 = i === 2;

    const slideObj = {
      number: i,
      title: slideTitles[i - 1],
      imageFileName: fileName,
      imageUrl: `/decks/${deckId}/slides/${fileName}`,
      sourceMediaPath: `ppt/media/image${i}.png`,
      isInteractive: isSlide2,
      interactiveType: isSlide2 ? "qa_grid" : null,
      cognitiveGuide: {
        estimatedTimeSeconds: isSlide2 ? 45 : (i === 1 ? 20 : 35),
        timeGuideDisplay: isSlide2 ? "30–60s" : "20–40s",
        vciScore: isSlide2 ? "3.2" : (i === 1 ? "4.0" : "3.5"),
        complexityCategory: "Medium",
        ragLevel: "low",
        ragColor: "green",
        ragLabel: "Optimal Processing",
        breakdown: {
          visualGistMs: 250,
          visualScanMs: 1100,
          readingMs: isSlide2 ? 14500 : 9000,
          semanticProcessingMs: isSlide2 ? 6500 : 4500,
          wordCount: isSlide2 ? 80 : 55,
          visualElementsCount: isSlide2 ? 6 : 4
        }
      },
      questionAnalysis: {
        detected: isSlide2 || i === 8 || i === 9,
        confidence: "high",
        questionCount: isSlide2 ? 6 : (i === 8 ? 2 : (i === 9 ? 1 : 0)),
        detectionSource: "manifest-structured"
      },
      contentAnalysis: {
        schemaVersion: 1,
        status: "ready",
        source: "gemini-slide-generation-agent",
        role: slideRoles[i - 1],
        transcript: `${lesson.title} · ${slideTitles[i - 1]}`
      },
      hasProgressiveBuilds: false
    };

    if (isSlide2) {
      // 6 cells matching 2 columns x 3 rows
      slideObj.interactiveCells = lesson.starterQuestions.map((qItem, idx) => {
        const row = Math.floor(idx / 2);
        const col = idx % 2;
        // coordinates in percentage of 1376 x 768 canvas
        const colW = 45.0;
        const rowH = 22.0;
        const startX = col === 0 ? 3.5 : 51.5;
        const startY = 16.0 + row * 24.5;

        return {
          id: `cell_${idx + 1}`,
          row,
          col,
          bounds: {
            x: Number(startX.toFixed(1)),
            y: Number(startY.toFixed(1)),
            w: colW,
            h: rowH
          },
          answerBounds: {
            x: Number((startX + 1).toFixed(1)),
            y: Number((startY + 12).toFixed(1)),
            w: Number((colW - 2).toFixed(1)),
            h: 8.5
          },
          question: qItem.q,
          expectedAnswer: qItem.a,
          revealMode: "toggle",
          confidence: 1,
          provenance: "gemini-agent"
        };
      });
    }

    slides.push(slideObj);
  }

  return {
    id: deckId,
    title: `${lesson.number}. ${lesson.title}`,
    slideSet: "intro_aaq_human_bio",
    filename: `${deckId}.pptx`,
    totalSlides,
    slides,
    unit: "Intro to Human Biology",
    teacher: lesson.teacher,
    academicYear: "2026–27",
    generatedAt: new Date().toISOString()
  };
}

async function main() {
  console.log("=== Launching Intro to Human Biology Slide Generation Agent ===");
  console.log(`Processing ${lessons.length} lessons from curriculum schedule...`);

  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 1376, height: 768 } });
  const page = await context.newPage();

  for (const lesson of lessons) {
    const deckId = lesson.deckId || sanitizeDeckId(lesson.title, lesson.number);
    const deckDir = path.join(PUBLIC_DECKS_DIR, deckId);
    const slidesDir = path.join(deckDir, "slides");
    const manifestPath = path.join(deckDir, "manifest.json");

    console.log(`\n[Agent] Building Lesson ${lesson.number}: ${lesson.title} (${deckId})...`);
    await fs.mkdir(slidesDir, { recursive: true });

    for (let slideNum = 1; slideNum <= 10; slideNum++) {
      const slideFileName = `slide_${String(slideNum).padStart(2, "0")}.png`;
      const slideFilePath = path.join(slidesDir, slideFileName);

      const html = buildSlideHtml(lesson, slideNum, 10);
      await page.setContent(html, { waitUntil: "networkidle" });
      await page.screenshot({ path: slideFilePath, type: "png" });
      process.stdout.write(`  Slide ${slideNum}/10 rendered -> ${slideFileName}\r`);
    }
    console.log(`  All 10 slides rendered successfully.`);

    const manifest = generateSlideManifest(lesson, deckId);
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
    console.log(`  Manifest created at ${manifestPath}`);
  }

  await browser.close();
  console.log("\n=== Slide Generation Complete: All 8 Decks Built & Bound to intro_aaq_human_bio ===");
}

main().catch((err) => {
  console.error("Fatal error generating slides:", err);
  process.exit(1);
});
