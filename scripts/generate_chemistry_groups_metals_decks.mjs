import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { extractPptxDeck } from "../src/pptx-extractor.js";
import {
  connectToLoggedInEdgeSession,
  evalInLoggedInEdgeTab,
  findOrOpenNotebookPage
} from "./edge_cdp_helper.mjs";
import {
  TARGET_NOTEBOOK_URL,
  SLIDE_SET_ID,
  COURSE_NAME,
  LOCAL_OUTPUT_DIR,
  PUBLIC_DECKS_DIR,
  CHECKPOINT_PATH,
  CHEMISTRY_GROUPS_METALS_LESSONS,
  buildChemistryLessonPrompt
} from "./chemistry_groups_metals_config.mjs";

const execFileAsync = promisify(execFile);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function readCheckpoint() {
  try {
    return JSON.parse(await fs.readFile(CHECKPOINT_PATH, "utf8"));
  } catch {
    return { completedLessons: {} };
  }
}

async function saveCheckpoint(cp) {
  await fs.mkdir(path.dirname(CHECKPOINT_PATH), { recursive: true });
  await fs.writeFile(CHECKPOINT_PATH, JSON.stringify(cp, null, 2), "utf8");
}

async function pollForDownloadedFile(dirs, ext, startTimeMs, existingFilesSnapshot = new Map(), timeoutMs = 90000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await sleep(1000);
    for (const dir of dirs) {
      const files = await fs.readdir(dir).catch(() => []);
      // Ensure no active .crdownload for our file is still writing
      const hasActiveCrDownload = files.some((f) => f.endsWith(".crdownload"));
      for (const f of files) {
        if (f.toLowerCase().endsWith(ext) && !f.endsWith(".crdownload") && !f.startsWith("~$")) {
          const fullPath = path.join(dir, f);
          const stat = await fs.stat(fullPath).catch(() => null);
          if (!stat || stat.size < 40000) continue;
          const prevMtime = existingFilesSnapshot.get(fullPath) || 0;
          if (stat.mtimeMs >= startTimeMs - 3000 && stat.mtimeMs > prevMtime) {
            if (hasActiveCrDownload) {
              await sleep(1500);
            }
            const stat2 = await fs.stat(fullPath).catch(() => null);
            if (stat2 && stat2.size === stat.size) {
              return fullPath;
            }
          }
        }
      }
    }
  }
  return null;
}

async function snapshotDirMtimes(dirs, ext) {
  const map = new Map();
  for (const dir of dirs) {
    const files = await fs.readdir(dir).catch(() => []);
    for (const f of files) {
      if (f.toLowerCase().endsWith(ext)) {
        const fullPath = path.join(dir, f);
        const stat = await fs.stat(fullPath).catch(() => null);
        if (stat) map.set(fullPath, stat.mtimeMs);
      }
    }
  }
  return map;
}

export async function ingestChemistryLessonDeck(pptxFile, pdfFile, lesson) {
  log(`Ingesting Lesson ${lesson.number} (${lesson.title}) into ${PUBLIC_DECKS_DIR}/${lesson.deckId}...`);
  await fs.mkdir(PUBLIC_DECKS_DIR, { recursive: true });
  const deckTargetDir = path.join(PUBLIC_DECKS_DIR, lesson.deckId);
  const slidesDir = path.join(deckTargetDir, "slides");
  await fs.mkdir(slidesDir, { recursive: true });

  const canonicalPptxPath = path.join(deckTargetDir, `${lesson.deckId}.pptx`);
  await fs.copyFile(pptxFile, canonicalPptxPath);
  if (pdfFile) {
    await fs.copyFile(pdfFile, path.join(deckTargetDir, `${lesson.deckId}.pdf`)).catch(() => {});
  }

  const manifest = await extractPptxDeck(canonicalPptxPath, PUBLIC_DECKS_DIR, lesson.deckId, {
    slideSet: SLIDE_SET_ID,
    title: `${lesson.number}. ${lesson.title}`
  });

  if ((!manifest.slides || manifest.slides.length === 0) && pdfFile) {
    log(`Fallback: rasterising slides from PDF using pdf2png...`);
    const pdf2pngBin = path.resolve("./src/tools/pdf2png");
    await execFileAsync(pdf2pngBin, [pdfFile, slidesDir, "2.0"]);
    const pngs = (await fs.readdir(slidesDir)).filter((f) => f.endsWith(".png")).sort();
    manifest.slides = pngs.map((fileName, idx) => ({
      number: idx + 1,
      title: idx + 1 === 2 ? `Starter Activity: Knowledge Retrieval (${lesson.title})` : `Slide ${idx + 1}`,
      imageFileName: fileName,
      imageUrl: `/decks/${SLIDE_SET_ID}/${lesson.deckId}/slides/${fileName}`,
      sourceMediaPath: `pdf/${fileName}`,
      isInteractive: false,
      interactiveType: null
    }));
    manifest.totalSlides = manifest.slides.length;
  }

  const manifestPath = path.join(deckTargetDir, "manifest.json");
  const currentManifest = JSON.parse(await fs.readFile(manifestPath, "utf8").catch(() => JSON.stringify(manifest)));

  currentManifest.id = lesson.deckId;
  currentManifest.title = `${lesson.number}. ${lesson.title}`;
  currentManifest.slideSet = SLIDE_SET_ID;
  currentManifest.filename = `${lesson.deckId}.pptx`;
  if (pdfFile) currentManifest.pdfFilename = `${lesson.deckId}.pdf`;
  currentManifest.lessonNumber = lesson.number;
  currentManifest.courseName = COURSE_NAME;
  currentManifest.teacher = lesson.teacher;
  currentManifest.practicalsCount = lesson.practicalsCount;
  currentManifest.totalSlides = currentManifest.slides.length;

  if (currentManifest.slides.length >= 1) {
    currentManifest.slides[0].title = `${lesson.number}. ${lesson.title}`;
  }

  if (currentManifest.slides.length >= 2 && Array.isArray(lesson.starterQuestions)) {
    const slide2 = currentManifest.slides[1];
    slide2.title = `Starter Activity: Knowledge Retrieval (${lesson.title})`;
    slide2.isInteractive = true;
    slide2.interactiveType = "question_reveal";

    const standardCells = [
      { x: 9.5, y: 38.5, w: 27, h: 6.5 },
      { x: 38.0, y: 38.5, w: 27, h: 6.5 },
      { x: 66.5, y: 38.5, w: 27, h: 6.5 },
      { x: 9.5, y: 72.0, w: 27, h: 6.5 },
      { x: 38.0, y: 72.0, w: 27, h: 6.5 },
      { x: 66.5, y: 72.0, w: 27, h: 6.5 }
    ];

    slide2.reveals = lesson.starterQuestions.map((sq, idx) => {
      const b = standardCells[idx] || standardCells[0];
      return {
        id: `reveal_s2_cell_${idx + 1}`,
        question: `${idx + 1}. ${sq.q}`,
        expectedAnswer: sq.a,
        bounds: { ...b },
        answerBounds: { ...b },
        revealMode: "overlay",
        confidence: 1,
        provenance: "user-adjusted",
        locked: true,
        answerVisibleInImage: false,
        answerIsBaked: false
      };
    });
  }

  await fs.writeFile(manifestPath, JSON.stringify(currentManifest, null, 2), "utf8");
  log(`✓ Ingested ${currentManifest.slides.length} slides for Lesson ${lesson.number} -> ${manifestPath}`);
  return currentManifest;
}

/**
 * Generates and downloads a single Chemistry lesson directly inside the user's already-open
 * Microsoft Edge browser using the Apple Events JavaScript bridge.
 */
async function generateLessonViaEdgeAppleEvents(lesson) {
  const downloadsDir = path.join(os.homedir(), "Downloads");
  const runJs = (code) => evalInLoggedInEdgeTab(TARGET_NOTEBOOK_URL, code);

  // 1. Ensure Studio root is clean & close any open viewer or modal
  await runJs(`(function() {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const closeBtn = document.querySelector('.studio-panel button[aria-label="Close slide deck"], button[aria-label="Close slide deck"], .studio-panel button[aria-label="Close"]');
    if (closeBtn && closeBtn.offsetParent !== null) closeBtn.click();
    const studioHeaders = Array.from(document.querySelectorAll('.panel-header-clickable, .panel-header-content'));
    const studioHdr = studioHeaders.find(el => /\\bStudio\\b/i.test(el.innerText || ''));
    const slideBtn = document.querySelector('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"]');
    if (!slideBtn && studioHdr) studioHdr.click();
    document.querySelectorAll('.panel-content-scrollable, .studio-panel').forEach(el => { el.scrollTop = 0; });
    return JSON.stringify({ ready: true });
  })()`);
  await sleep(1200);

  const getStudioState = async () => {
    return await runJs(`(function() {
      const items = Array.from(document.querySelectorAll('artifact-library-item'));
      const viewerMore = document.querySelector('.studio-panel button[aria-label="More options"]');
      const viewerClose = document.querySelector('button[aria-label="Close slide deck"], .studio-panel button[aria-label="Close"]');
      const isViewerOpen = Boolean((viewerMore && viewerMore.offsetParent !== null) || (viewerClose && viewerClose.offsetParent !== null));
      if (items.length === 0) {
        return JSON.stringify({ count: 0, text: '', hasProgress: false, disabled: false, isViewerOpen });
      }
      const el = items[0];
      const btn = el.querySelector('button.artifact-stretched-button');
      const icons = Array.from(el.querySelectorAll('mat-icon')).map(m => (m.textContent || '').trim());
      const rawText = (el.innerText || '').replace(/\\s+/g, ' ').trim();
      const hasProgress = icons.includes('progress_activity') || /Generating|Shaping|Rendering|Wrapping|Almost|Getting ready|Sync/i.test(rawText);
      const disabled = btn ? Boolean(btn.disabled || btn.getAttribute('disabled') === 'true') : false;
      return JSON.stringify({
        count: items.length,
        text: rawText.slice(0, 140),
        hasProgress,
        disabled,
        isViewerOpen
      });
    })()`);
  };

  // Wait if a prior generation is currently active
  for (let i = 0; i < 120; i++) {
    const st = await getStudioState();
    if (!st.hasProgress && !st.disabled) break;
    log(`Waiting for existing Studio generation to finish: "${st.text}"`);
    await sleep(5000);
  }

  const beforeState = await getStudioState();
  log(`Studio ready (existing artifacts: ${beforeState.count}, top: "${beforeState.text.slice(0, 60)}")`);

  // 2. Click "Slide deck" button to open customize dialog
  const clickSlideDeckRes = await runJs(`(function() {
    const candidates = [
      document.querySelector('div.create-artifact-button-container[aria-label="Slide deck"]'),
      document.querySelector('[aria-label="Slide deck"]'),
      ...Array.from(document.querySelectorAll('.create-artifact-button-container, button')).filter(el => /Slide deck/i.test(el.innerText || ''))
    ].filter(Boolean);
    const target = candidates.find(el => el.offsetParent !== null) || candidates[0];
    if (!target) return JSON.stringify({ clicked: false });
    target.click();
    return JSON.stringify({ clicked: true });
  })()`);
  if (!clickSlideDeckRes?.clicked) {
    throw new Error("Could not find 'Slide deck' button in Gemini Notebook Studio panel.");
  }
  log("Clicked 'Slide deck' button. Waiting for modal...");
  await sleep(1800);

  // 3. Select "Presenter slides" format
  await runJs(`(function() {
    const overlay = document.querySelector('mat-dialog-container, .cdk-overlay-pane') || document;
    const opts = Array.from(overlay.querySelectorAll('div, span, [role="radio"], .tile-content'));
    const presenter = opts.find(el => /^Presenter slides\\b/i.test((el.innerText || '').trim()));
    if (presenter) presenter.click();
    return JSON.stringify({ selected: Boolean(presenter) });
  })()`);
  await sleep(500);

  // 4. Fill prompt textarea using native setter + input/change events
  const promptText = buildChemistryLessonPrompt(lesson);
  const promptJsonLiteral = JSON.stringify(promptText);
  const fillRes = await runJs(`(function() {
    const overlay = document.querySelector('mat-dialog-container, .cdk-overlay-pane') || document;
    const ta = overlay.querySelector('textarea') || document.querySelector('textarea[aria-label*="Describe the slide deck"]');
    if (!ta) return JSON.stringify({ filled: false });
    ta.focus();
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    if (setter) {
      setter.call(ta, ${promptJsonLiteral});
    } else {
      ta.value = ${promptJsonLiteral};
    }
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
    return JSON.stringify({ filled: true, length: ta.value.length });
  })()`);
  if (!fillRes?.filled) {
    throw new Error("Could not find prompt textarea inside 'Customise slide deck' modal.");
  }
  log(`Injected lesson prompt (${fillRes.length} chars).`);
  await sleep(800);

  // 5. Click "Generate now"
  const genClickRes = await runJs(`(function() {
    const overlay = document.querySelector('mat-dialog-container, .cdk-overlay-pane') || document;
    const btns = Array.from(overlay.querySelectorAll('button'));
    const genBtn = btns.find(b => /Generate now/i.test(b.innerText || ''));
    if (!genBtn) return JSON.stringify({ clicked: false, reason: 'not_found' });
    genBtn.click();
    return JSON.stringify({ clicked: true });
  })()`);
  if (!genClickRes?.clicked) {
    throw new Error("Could not click 'Generate now' button in modal.");
  }
  log(`Clicked 'Generate now' for Lesson ${lesson.number}: ${lesson.title}! Monitoring Studio...`);
  await sleep(6000);

  // 6. Poll until generation finishes
  const deadline = Date.now() + 15 * 60 * 1000;
  let settled = 0;
  let sawActivity = false;

  while (Date.now() < deadline) {
    const cur = await getStudioState();
    if (cur.isViewerOpen) {
      log("Slide deck viewer opened automatically — generation complete!");
      break;
    }
    if (cur.hasProgress || cur.disabled || cur.count > beforeState.count || cur.text !== beforeState.text) {
      sawActivity = true;
    }
    if (cur.hasProgress || cur.disabled) {
      settled = 0;
      log(`Generating Lesson ${lesson.number}: ${cur.text}`);
    } else if (sawActivity && cur.count > 0) {
      settled += 1;
      log(`Artifact ready check (${settled}/2): "${cur.text}"`);
      if (settled >= 2) {
        log(`✓ Slide deck generation finished for Lesson ${lesson.number}!`);
        break;
      }
    }
    await sleep(5000);
  }

  await sleep(2500);

  // 7. Open newly generated deck in viewer so we can rename & download
  const stAfter = await getStudioState();
  if (!stAfter.isViewerOpen) {
    await runJs(`(function() {
      const first = document.querySelector('artifact-library-item');
      if (!first) return JSON.stringify({ opened: false });
      const target = first.querySelector('button.artifact-stretched-button, .title-container, span.artifact-title') || first;
      target.click();
      return JSON.stringify({ opened: true });
    })()`);
    await sleep(3500);
  }

  // 8. Rename artifact in Studio
  const desiredTitle = `Lesson ${lesson.number}: ${lesson.title}`;
  await runJs(`(function() {
    const inp = document.querySelector('input[aria-label="Artifact title"]');
    if (!inp) return JSON.stringify({ renamed: false });
    inp.focus();
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (setter) setter.call(inp, ${JSON.stringify(desiredTitle)});
    else inp.value = ${JSON.stringify(desiredTitle)};
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
    inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
    inp.blur();
    return JSON.stringify({ renamed: true });
  })()`);
  await sleep(1000);

  // 9. Trigger PowerPoint (.pptx) download into ~/Downloads
  const mtimeSnapshot = await snapshotDirMtimes([downloadsDir], ".pptx");
  const dlStart = Date.now();

  const moreOpenRes = await runJs(`(function() {
    const viewerMore = document.querySelector('.studio-panel button[aria-label="More options"]');
    if (viewerMore && viewerMore.offsetParent !== null) {
      viewerMore.click();
      return JSON.stringify({ opened: 'viewer_more' });
    }
    const moreVerts = Array.from(document.querySelectorAll('.studio-panel button')).filter(b => {
      const ic = b.querySelector('mat-icon');
      return ic && (ic.textContent || '').trim() === 'more_vert' && b.offsetParent !== null;
    });
    if (moreVerts.length > 0) {
      moreVerts[moreVerts.length - 1].click();
      return JSON.stringify({ opened: 'more_vert' });
    }
    const cardMore = document.querySelector('artifact-library-item button[aria-label="More"]');
    if (cardMore) {
      cardMore.click();
      return JSON.stringify({ opened: 'card_more' });
    }
    return JSON.stringify({ opened: null });
  })()`);
  log(`Opened More menu (${moreOpenRes?.opened}).`);
  await sleep(1200);

  const clickPptxRes = await runJs(`(function() {
    const items = Array.from(document.querySelectorAll('[role="menuitem"], .mat-mdc-menu-item, button'));
    const pptxBtn = items.find(el => /PowerPoint/i.test(el.innerText || '') && el.offsetParent !== null);
    if (!pptxBtn) return JSON.stringify({ clicked: false });
    pptxBtn.click();
    return JSON.stringify({ clicked: true, label: (pptxBtn.innerText || '').trim() });
  })()`);
  if (!clickPptxRes?.clicked) {
    throw new Error(`Could not find 'Download PowerPoint' menu item for Lesson ${lesson.number}.`);
  }
  log(`Clicked "${clickPptxRes.label}". Waiting for .pptx in ~/Downloads...`);

  const downloadedPptx = await pollForDownloadedFile([downloadsDir], ".pptx", dlStart, mtimeSnapshot, 95000);
  if (!downloadedPptx) {
    throw new Error(`Timed out waiting for downloaded .pptx in ~/Downloads for Lesson ${lesson.number}.`);
  }

  const savedPptxPath = path.join(LOCAL_OUTPUT_DIR, `${lesson.deckId}.pptx`);
  await fs.copyFile(downloadedPptx, savedPptxPath);
  log(`✓ Saved PPTX -> ${savedPptxPath}`);

  // 10. Close viewer to return Studio cleanly to root
  await runJs(`(function() {
    const closeBtn = document.querySelector('button[aria-label="Close slide deck"], .studio-panel button[aria-label="Close"]');
    if (closeBtn && closeBtn.offsetParent !== null) closeBtn.click();
    return JSON.stringify({ closed: true });
  })()`);
  await sleep(1500);

  // 11. Ingest into web app
  await ingestChemistryLessonDeck(savedPptxPath, null, lesson);
}

/**
 * Generates and downloads a single Chemistry lesson via Playwright CDP if a CDP port is active.
 */
async function generateLessonViaPlaywrightCdp(browser, lesson) {
  const lessonOutDir = path.join(LOCAL_OUTPUT_DIR, lesson.deckId);
  await fs.mkdir(lessonOutDir, { recursive: true });
  const downloadsDir = path.join(os.homedir(), "Downloads");

  const { context, page } = await findOrOpenNotebookPage(browser, TARGET_NOTEBOOK_URL);
  try {
    const cdpSession = await context.newCDPSession(page);
    await cdpSession.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: lessonOutDir
    });
  } catch {}

  await page.keyboard.press("Escape").catch(() => {});
  const closeViewer = page.locator('button[aria-label="Close slide deck"], .studio-panel button[aria-label="Close"]').first();
  if (await closeViewer.isVisible().catch(() => false)) {
    await closeViewer.click().catch(() => {});
    await page.waitForTimeout(1200);
  }

  const slideDeckBtn = page
    .locator('div.create-artifact-button-container[aria-label="Slide deck"], [aria-label="Slide deck"], button:has-text("Slide deck")')
    .first();
  await slideDeckBtn.waitFor({ state: "visible", timeout: 20000 });
  const beforeCount = await page.locator("artifact-library-item").count();
  await slideDeckBtn.click();
  await page.waitForTimeout(1500);

  const overlay = page.locator("mat-dialog-container, .cdk-overlay-pane").first();
  await overlay.waitFor({ state: "visible", timeout: 15000 });

  const presenterOption = overlay.locator('div, span, [role="radio"]').filter({ hasText: /^Presenter slides/i }).first();
  if (await presenterOption.isVisible({ timeout: 4000 }).catch(() => false)) {
    await presenterOption.click().catch(() => {});
    await page.waitForTimeout(400);
  }

  const promptText = buildChemistryLessonPrompt(lesson);
  const textarea = overlay.locator('textarea, [aria-label*="Describe the slide deck"]').first();
  await textarea.fill(promptText);
  await page.waitForTimeout(600);

  await overlay.locator('button:has-text("Generate now")').first().click();
  await overlay.waitFor({ state: "hidden", timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(6000);

  const deadline = Date.now() + 15 * 60 * 1000;
  let settled = 0;
  while (Date.now() < deadline) {
    if (await page.locator('.studio-panel button[aria-label="More options"]').first().isVisible().catch(() => false)) break;
    const curCount = await page.locator("artifact-library-item").count();
    const topTxt = curCount > 0 ? await page.locator("artifact-library-item").first().innerText().catch(() => "") : "";
    const busy = /Generating|Shaping|Rendering|Wrapping|Almost|Getting ready|Sync/i.test(topTxt);
    if (!busy && curCount > beforeCount) {
      settled += 1;
      if (settled >= 2) break;
    } else {
      settled = 0;
    }
    await page.waitForTimeout(5000);
  }

  if (!(await closeViewer.isVisible().catch(() => false))) {
    await page.locator("artifact-library-item").first().locator("button.artifact-stretched-button, .title-container").first().click({ force: true }).catch(() => {});
    await page.waitForTimeout(3000);
  }

  const mtimeSnapshot = await snapshotDirMtimes([lessonOutDir, downloadsDir], ".pptx");
  const dlStart = Date.now();
  const moreBtn = page.locator('.studio-panel button[aria-label="More options"], button:has(mat-icon:has-text("more_vert"))').last();
  await moreBtn.click();
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("PowerPoint"), button:has-text("PowerPoint")').first().click();

  const downloadedPptx = await pollForDownloadedFile([lessonOutDir, downloadsDir], ".pptx", dlStart, mtimeSnapshot, 95000);
  if (!downloadedPptx) throw new Error(`Timed out waiting for PPTX download for Lesson ${lesson.number}`);

  const savedPptxPath = path.join(LOCAL_OUTPUT_DIR, `${lesson.deckId}.pptx`);
  await fs.copyFile(downloadedPptx, savedPptxPath);
  if (await closeViewer.isVisible().catch(() => false)) await closeViewer.click().catch(() => {});
  await ingestChemistryLessonDeck(savedPptxPath, null, lesson);
}

export async function runAllChemistryLessons(startNum = 1, endNum = 8) {
  await fs.mkdir(LOCAL_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_DECKS_DIR, { recursive: true });

  const checkpoint = await readCheckpoint();
  const session = await connectToLoggedInEdgeSession(TARGET_NOTEBOOK_URL, { waitForEnable: true });

  try {
    for (let num = startNum; num <= endNum; num++) {
      const lesson = CHEMISTRY_GROUPS_METALS_LESSONS.find((l) => l.number === num);
      if (!lesson) continue;

      const existingManifest = path.join(PUBLIC_DECKS_DIR, lesson.deckId, "manifest.json");
      const hasExisting = await fs.stat(existingManifest).then((s) => s.size > 200).catch(() => false);
      if (checkpoint.completedLessons[String(num)] && hasExisting && !process.env.FORCE_REGENERATE) {
        log(`Skipping Lesson ${num} (${lesson.title}) — already generated and ingested.`);
        continue;
      }

      log(`\n================================================================================`);
      log(`✦ Generating Lesson ${lesson.number}/8: ${lesson.title} [mode=${session.mode}]`);
      log(`================================================================================`);

      const executeOnce = async () => {
        if (session.mode === "cdp") {
          await generateLessonViaPlaywrightCdp(session.browser, lesson);
        } else {
          await generateLessonViaEdgeAppleEvents(lesson);
        }
      };

      try {
        await executeOnce();
      } catch (err) {
        log(`Error on Lesson ${num} (${lesson.title}): ${err.message}. Retrying once in 5s...`);
        await sleep(5000);
        await executeOnce();
      }

      checkpoint.completedLessons[String(num)] = {
        deckId: lesson.deckId,
        title: lesson.title,
        completedAt: new Date().toISOString()
      };
      await saveCheckpoint(checkpoint);
    }

    log("\n✦ ALL 8 GCSE CHEMISTRY LESSONS GENERATED & INGESTED INTO SLIDE SET 'chemistry_groups_metals'! ✦");
  } finally {
    if (session.mode === "cdp" && session.browser) {
      await session.browser.close().catch(() => {});
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const startArg = process.argv[2] ? Number.parseInt(process.argv[2], 10) : 1;
  const endArg = process.argv[3] ? Number.parseInt(process.argv[3], 10) : 8;
  runAllChemistryLessons(startArg, endArg).catch((err) => {
    console.error("FATAL CHEMISTRY GENERATION ERROR:", err);
    process.exit(1);
  });
}
