import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  buildGeminiSlideAnalysisPrompt,
  normalizeGeminiSlideAnalysis
} from "../src/gemini-editor.js";
import { generateSlideInteractivity } from "../src/gemini-segmenter.js";

const GEMINI_IMAGES_URL = "https://gemini.google.com/images";
const GEMINI_APP_URL = "https://gemini.google.com/app";
const GEMINI_ANALYSIS_SCHEMA = "gemini-slide-analysis/v1";
const GEMINI_ANALYSIS_PROVIDER = "google-gemini";
const MIN_BYTES = 20_000;
const MIN_WIDTH = 1_000;
const MIN_HEIGHT = 550;
const TARGET_ASPECT = 16 / 9;
const ASPECT_TOLERANCE = 0.08;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function inspectPng(buffer) {
  const png =
    buffer?.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer.toString("ascii", 1, 4) === "PNG";
  const width = png ? buffer.readUInt32BE(16) : 0;
  const height = png ? buffer.readUInt32BE(20) : 0;
  const aspect = height ? width / height : 0;
  return {
    png,
    width,
    height,
    aspect,
    bytes: buffer?.length || 0,
    passed: Boolean(
      png &&
        buffer.length >= MIN_BYTES &&
        width >= MIN_WIDTH &&
        height >= MIN_HEIGHT &&
        Math.abs(aspect - TARGET_ASPECT) <= ASPECT_TOLERANCE
    )
  };
}

function createMutex() {
  let tail = Promise.resolve();
  return async (operation) => {
    let release;
    const mine = new Promise((resolve) => {
      release = resolve;
    });
    const before = tail;
    tail = mine;
    await before.catch(() => {});
    try {
      return await operation();
    } finally {
      release();
    }
  };
}

function outputPathFor(repoRoot, slide, cell) {
  return path.join(
    repoRoot,
    "public",
    "decks",
    slide.deckId,
    "slides",
    `slide_${String(slide.slideNum).padStart(2, "0")}_${cell.id}.png`
  );
}

function slideHasVideo(slide) {
  if (slide?.videoUrl) return true;
  if (
    Array.isArray(slide?.progressiveBuilds) &&
    slide.progressiveBuilds.some((build) => build?.videoUrl)
  ) {
    return true;
  }
  return Boolean(
    slide?.serialAnimation?.videoUrl ||
      slide?.serialAnimation?.serialSteps?.some(
        (step) => step?.videoUrl || step?.revealType === "play-video"
      )
  );
}

function isSixBoxStarterSlide(slide) {
  return slide?.interactiveType === "starter_qa_grid";
}

function analysisSidecarPathFor(repoRoot, deckDir, slideNumber) {
  return path.join(
    repoRoot,
    "public",
    "decks",
    deckDir,
    "analysis",
    `slide_${String(slideNumber).padStart(2, "0")}.json`
  );
}

async function readMatchingAnalysisSidecar(sidecarPath, sourceHash) {
  try {
    const sidecar = JSON.parse(await fs.readFile(sidecarPath, "utf8"));
    return sidecar?.sourceHash === sourceHash;
  } catch {
    return false;
  }
}

async function writeJsonAtomically(destinationPath, value) {
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  const temporaryPath = path.join(
    path.dirname(destinationPath),
    `.${path.basename(destinationPath)}.${process.pid}.${crypto.randomUUID()}.tmp`
  );
  try {
    await fs.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
    await fs.rename(temporaryPath, destinationPath);
  } catch (error) {
    await fs.unlink(temporaryPath).catch(() => {});
    throw error;
  }
}

export async function buildAnalysisQueues(repoRoot, deckGroups) {
  const decksRoot = path.join(repoRoot, "public", "decks");
  const deckDirs = (await fs.readdir(decksRoot)).sort();
  const slides = [];

  for (const deckDir of deckDirs) {
    const manifestPath = path.join(decksRoot, deckDir, "manifest.json");
    let manifest;
    try {
      manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    } catch {
      continue;
    }

    for (const manifestSlide of manifest.slides || []) {
      if (slideHasVideo(manifestSlide) || isSixBoxStarterSlide(manifestSlide)) {
        continue;
      }

      const cells = manifestSlide.geminiImageCells || [];
      const hasPendingCell = cells.some((cell) => cell.qaStatus !== "approved");
      const hasApprovedCell = cells.some((cell) => cell.qaStatus === "approved");
      if (!hasPendingCell || hasApprovedCell) continue;

      const sourceUrl =
        cells.find((cell) => cell.qaStatus !== "approved")?.sourceImageUrl ||
        manifestSlide.imageUrl;
      if (!sourceUrl) continue;

      const sourcePath = path.join(
        repoRoot,
        "public",
        sourceUrl.replace(/^\//, "")
      );
      let sourceHash;
      try {
        sourceHash = sha256(await fs.readFile(sourcePath));
      } catch {
        continue;
      }

      const sidecarPath = analysisSidecarPathFor(
        repoRoot,
        deckDir,
        manifestSlide.number
      );
      if (await readMatchingAnalysisSidecar(sidecarPath, sourceHash)) continue;

      const interactiveCellCount = Array.isArray(manifestSlide.interactiveCells)
        ? manifestSlide.interactiveCells.length
        : 0;
      const slide = {
        number: manifestSlide.number,
        title: manifestSlide.title || null,
        imageFileName:
          manifestSlide.imageFileName || path.basename(sourcePath),
        interactiveCellCount
      };

      slides.push({
        deckId: manifest.id || deckDir,
        deckDir,
        deckTitle: manifest.title || manifest.id || deckDir,
        slideNum: manifestSlide.number,
        title: manifestSlide.title || null,
        slide,
        sourcePath,
        sourceHash,
        sidecarPath,
        prompt: buildGeminiSlideAnalysisPrompt({
          deckTitle: manifest.title || manifest.id || deckDir,
          slideNumber: manifestSlide.number,
          knownQuestionCount: interactiveCellCount
        })
      });
    }
  }

  return deckGroups.map((deckIds) =>
    slides.filter(
      (slide) =>
        deckIds.includes(slide.deckId) || deckIds.includes(slide.deckDir)
    )
  );
}

export async function buildMissingQueues(repoRoot, deckGroups) {
  const decksRoot = path.join(repoRoot, "public", "decks");
  const deckDirs = (await fs.readdir(decksRoot)).sort();
  const slides = [];

  for (const deckDir of deckDirs) {
    const manifestPath = path.join(decksRoot, deckDir, "manifest.json");
    let manifest;
    try {
      manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    } catch {
      continue;
    }

    for (const slide of manifest.slides || []) {
      const pendingCells = (slide.geminiImageCells || []).filter(
        (cell) => cell.qaStatus !== "approved"
      );
      if (!pendingCells.length) continue;
      const sourceUrl = pendingCells[0].sourceImageUrl || slide.imageUrl;
      const queued = {
        deckId: manifest.id,
        slideNum: slide.number,
        title: slide.title,
        sourcePath: path.join(repoRoot, "public", sourceUrl.replace(/^\//, "")),
        cells: []
      };
      for (const cell of pendingCells) {
        const outputPath = outputPathFor(repoRoot, queued, cell);
        try {
          await fs.access(outputPath);
        } catch {
          queued.cells.push({
            id: cell.id,
            order: cell.order,
            prompt: cell.prompt,
            label: cell.label
          });
        }
      }
      if (queued.cells.length) slides.push(queued);
    }
  }

  return deckGroups.map((deckIds) =>
    slides.filter((slide) => deckIds.includes(slide.deckId))
  );
}

export function createGeminiBrowserQueueRunner({
  repoRoot,
  totalPlanned,
  progressPath = "/private/tmp/pptpresentationtowebagent-gemini-progress.json"
}) {
  const withClipboardLock = createMutex();
  const withUploadLock = createMutex();
  const withProgressLock = createMutex();
  const progress = {
    startedAt: new Date().toISOString(),
    totalPlanned,
    saved: 0,
    failed: 0,
    workers: {},
    failures: []
  };

  async function flushProgress() {
    await withProgressLock(() =>
      fs.writeFile(progressPath, JSON.stringify(progress, null, 2))
    );
  }

  async function prepareFreshImageChat(tab) {
    let lastError = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        if (typeof tab.ensureReady === "function") {
          await tab.ensureReady();
        }
        await tab.goto(GEMINI_APP_URL, { waitUntil: "domcontentloaded", timeout: 25_000 });
        await sleep(1_000);

        const newChatBtn = tab.playwright
          .getByRole("button", { name: /New chat/i })
          .or(tab.playwright.locator('button[aria-label*="New chat" i]'));
        if ((await newChatBtn.count().catch(() => 0)) > 0) {
          await newChatBtn.first().click().catch(() => {});
          await sleep(800);
        }

        // Open Upload and tools menu and toggle "Create image" tool mode
        const uploadBtn = tab.playwright
          .locator('button[aria-label*="Upload and tools" i]')
          .or(tab.playwright.getByRole("button", { name: /Upload and tools/i }))
          .first();
        if ((await uploadBtn.count().catch(() => 0)) > 0) {
          await uploadBtn.click({ timeout: 5_000 }).catch(() => {});
          await sleep(500);

          const createImageItem = tab.playwright
            .locator('[role="menuitemcheckbox"]:has-text("Create image")')
            .first();
          if ((await createImageItem.count().catch(() => 0)) > 0) {
            const isChecked = await createImageItem.getAttribute("aria-checked");
            if (isChecked !== "true") {
              await createImageItem.click({ timeout: 5_000 }).catch(() => {});
              await sleep(500);
            }
          }
        }

        const promptBox = tab.playwright
          .getByRole("textbox", { name: "Enter a prompt for Gemini" })
          .or(tab.playwright.locator('rich-textarea div[contenteditable="true"]'));
        await promptBox.first().waitFor({ state: "visible", timeout: 20_000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("Gemini Images chat did not become ready.");
  }

  async function uploadSlideSource(tab, sourcePath) {
    await withUploadLock(async () => {
      // 1. Open the Upload and tools popup menu
      const uploadBtn = tab.playwright
        .locator('button[aria-label*="Upload and tools" i]')
        .or(tab.playwright.getByRole("button", { name: /Upload and tools/i }))
        .first();
      await uploadBtn.waitFor({ state: "visible", timeout: 15_000 });
      await uploadBtn.click({ timeout: 10_000 });
      await sleep(500);

      // 2. Locate the "Upload files" action item
      const uploadFilesBtn = tab.playwright
        .locator(
          'button[data-test-id="local-images-files-uploader-button"], [role="menuitem"]:has-text("Upload files")'
        )
        .or(tab.playwright.getByRole("menuitem", { name: /Upload files/i }))
        .first();
      await uploadFilesBtn.waitFor({ state: "visible", timeout: 10_000 });

      // 3. Trigger native filechooser and set the file
      const [fileChooser] = await Promise.all([
        tab.playwright.waitForEvent("filechooser", { timeout: 15_000 }),
        uploadFilesBtn.click({ timeout: 10_000 })
      ]);
      await fileChooser.setFiles([sourcePath]);

      // 4. Robust upload completion check: wait until upload spinners clear and thumbnail is fully rendered
      let stableReadyChecks = 0;
      for (let index = 0; index < 60; index += 1) {
        await sleep(500);
        const status = await tab.playwright
          .evaluate(() => {
            const spinners = document.querySelectorAll(
              '[role="progressbar"], mat-progress-bar, mat-spinner, .spinner, [aria-label*="Loading" i], [aria-label*="Uploading" i]'
            );
            const thumbnails = Array.from(
              document.querySelectorAll(
                '.gem-attachment-style-img, img[src^="blob:"], [data-test-id="attachment-preview"] img, image-preview img, .preview-container img, img[alt*="Uploaded" i]'
              )
            );
            const readyThumbnails = thumbnails.filter((img) => img.complete && img.naturalWidth > 0);
            return {
              uploading: spinners.length > 0,
              hasReadyThumbnail: readyThumbnails.length > 0
            };
          })
          .catch(() => ({ uploading: false, hasReadyThumbnail: false }));

        if (!status.uploading && status.hasReadyThumbnail) {
          stableReadyChecks += 1;
          if (stableReadyChecks >= 3) {
            // Stable for 1.5 continuous seconds after upload spinner disappeared
            await sleep(2_000);
            return;
          }
        } else {
          stableReadyChecks = 0;
        }
      }

      // Final fallback buffer
      await sleep(3_000);
    });
  }

  async function waitForGeneratedImage(tab, baseline, timeoutMs = 180_000) {
    const startedAt = Date.now();
    let lastCounts = null;
    while (Date.now() - startedAt < timeoutMs) {
      const stopButton = tab.playwright.getByRole("button", { name: /Stop/i });
      const isGenerating = (await stopButton.count().catch(() => 0)) > 0;

      const imageButtons = tab.playwright.getByRole("button", {
        name: /AI generated/
      });
      const copyButtons = tab.playwright.getByRole("button", {
        name: "Copy image"
      });
      const imageCount = await imageButtons.count().catch(() => 0);
      const copyCount = await copyButtons.count().catch(() => 0);

      const domImageCount = await tab.playwright
        .evaluate(() => {
          const imgs = Array.from(
            document.querySelectorAll(
              'model-response img, message-content img, generated-image img, img[src*="googleusercontent"], img[src*="blob:"], .image-container img'
            )
          );
          return imgs.filter(
            (img) =>
              (img.naturalWidth > 200 || img.width > 200) &&
              (img.naturalHeight > 200 || img.height > 200) &&
              !img.src.includes("avatar") &&
              !img.src.includes("profile")
          ).length;
        })
        .catch(() => 0);

      lastCounts = { imageCount, copyCount, domImageCount };
      if ((imageCount > baseline || copyCount > baseline || domImageCount > 0) && !isGenerating) {
        await sleep(1_000);
        return lastCounts;
      }
      await sleep(1_500);
    }
    throw new Error(
      `Timed out waiting for a generated image and Copy image control; last counts ${JSON.stringify(lastCounts)}`
    );
  }

  async function copyNewestImage(tab, workerName) {
    // Attempt 1: Native Copy Image via clipboard
    try {
      const buffer = await withClipboardLock(async () => {
        await tab.clipboard.writeText(`gemini-export-${workerName}-${Date.now()}`);
        const copyBtn = tab.playwright.getByRole("button", { name: "Copy image" });
        if ((await copyBtn.count().catch(() => 0)) > 0) {
          await copyBtn.last().click({ timeout: 5_000 });
          for (let index = 0; index < 12; index += 1) {
            await sleep(300);
            const clipboardItems = await tab.clipboard.read();
            const imageEntry = clipboardItems
              .flatMap((item) => item.entries || [])
              .find((entry) => entry.mimeType === "image/png" && entry.base64);
            if (imageEntry) return Buffer.from(imageEntry.base64, "base64");
          }
        }
        return null;
      });
      if (buffer) return buffer;
    } catch {}

    // Attempt 2: High-resolution direct image / canvas extraction
    const dataUrl = await tab.playwright
      .evaluate(async () => {
        const imgs = Array.from(
          document.querySelectorAll(
            'model-response img, message-content img, generated-image img, img[src*="googleusercontent"], img[src*="blob:"]'
          )
        );
        const valid = imgs.filter(
          (img) =>
            (img.naturalWidth > 200 || img.width > 200) &&
            (img.naturalHeight > 200 || img.height > 200) &&
            !img.src.includes("avatar") &&
            !img.src.includes("profile")
        );
        if (valid.length === 0) return null;
        const target = valid[valid.length - 1];

        let src = target.src || "";
        if (src.includes("googleusercontent.com") && src.includes("=s")) {
          src = src.replace(/=s\d+/, "=s2048");
        }
        try {
          const resp = await fetch(src);
          const blob = await resp.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch {
          const canvas = document.createElement("canvas");
          canvas.width = target.naturalWidth || target.width || 1920;
          canvas.height = target.naturalHeight || target.height || 1080;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/png");
        }
      })
      .catch(() => null);

    if (dataUrl && dataUrl.startsWith("data:image/")) {
      return Buffer.from(dataUrl.split(",")[1], "base64");
    }

    throw new Error("Could not extract generated Gemini image buffer via clipboard or DOM canvas.");
  }

  async function generateCellAsset(tab, slide, cell, workerName, slideHashes) {
    let lastBuffer = null;
    let lastInspection = null;
    let lastHash = null;
    const sourceBuffer = await fs.readFile(slide.sourcePath);
    const sourceHash = sha256(sourceBuffer);

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const baseline = await tab.playwright
        .getByRole("button", { name: /AI generated/ })
        .count()
        .catch(() => 0);
      const prompt =
        attempt === 0
          ? cell.prompt
          : `${cell.prompt}\nQA CORRECTION: The previous result failed the file-level build check. Regenerate this exact cumulative build as a distinct, complete 16:9 slide canvas. Follow Show now and Temporarily omit precisely; do not return the unchanged source or duplicate another build.`;
      const promptBox = tab.playwright
        .locator('rich-textarea div[contenteditable="true"]')
        .or(tab.playwright.getByRole("textbox", { name: "Enter a prompt for Gemini" }))
        .first();
      await promptBox.focus().catch(() => {});
      await tab.playwright.keyboard.press("End").catch(() => {});
      await tab.playwright.keyboard.insertText(prompt);
      await sleep(400);

      const initialPromptCount = await tab.playwright
        .getByRole("button", { name: "Copy prompt" })
        .count()
        .catch(() => 0);

      const sendButton = tab.playwright.getByRole("button", {
        name: "Send message"
      });
      if (await sendButton.isVisible().catch(() => false)) {
        await sendButton.click({ timeout: 10_000 }).catch(() => {});
      } else {
        await tab.playwright.keyboard.press("Enter").catch(() => {});
      }

      let promptSubmitted = false;
      for (let check = 0; check < 24; check += 1) {
        await sleep(500);
        const composerText = await promptBox.textContent().catch(() => "");
        const promptCount = await tab.playwright
          .getByRole("button", { name: "Copy prompt" })
          .count()
          .catch(() => initialPromptCount);
        if (!String(composerText || "").trim() || promptCount > initialPromptCount) {
          promptSubmitted = true;
          break;
        }
        if (check === 9) {
          await sendButton.waitFor({ state: "visible", timeout: 10_000 }).catch(() => {});
          await sendButton.click({ timeout: 15_000 }).catch(() => {});
        }
      }
      if (!promptSubmitted) {
        throw new Error("Gemini prompt remained in the composer after two Send attempts.");
      }
      await waitForGeneratedImage(tab, baseline);
      lastBuffer = await copyNewestImage(tab, workerName);
      lastInspection = inspectPng(lastBuffer);
      lastHash = sha256(lastBuffer);

      if (
        lastInspection.passed &&
        lastHash !== sourceHash &&
        !slideHashes.has(lastHash)
      ) {
        const outputPath = outputPathFor(repoRoot, slide, cell);
        await fs.writeFile(outputPath, lastBuffer);
        slideHashes.add(lastHash);
        return {
          ok: true,
          path: outputPath,
          bytes: lastInspection.bytes,
          width: lastInspection.width,
          height: lastInspection.height,
          sha256: lastHash,
          attempt: attempt + 1
        };
      }
    }

    const failedPath = outputPathFor(repoRoot, slide, cell).replace(
      /\.png$/,
      "_qa_failed.png"
    );
    if (lastBuffer) await fs.writeFile(failedPath, lastBuffer);
    return {
      ok: false,
      path: failedPath,
      inspection: lastInspection,
      sha256: lastHash,
      error:
        "Generated image failed automatic resolution, aspect, source-distinctness, or sequence-uniqueness checks after retry."
    };
  }

  async function processQueue(tab, slides, workerName) {
    progress.workers[workerName] = {
      state: "running",
      planned: slides.reduce((count, slide) => count + slide.cells.length, 0),
      saved: 0,
      failed: 0,
      current: null
    };
    await flushProgress();

    for (let slideIndex = 0; slideIndex < slides.length; slideIndex += 1) {
      const slide = slides[slideIndex];
      const worker = progress.workers[workerName];
      worker.current = {
        deckId: slide.deckId,
        slideNum: slide.slideNum,
        title: slide.title,
        slideIndex: slideIndex + 1,
        slideCount: slides.length,
        cellId: null
      };
      await flushProgress();

      let processedCellCount = 0;
      try {
        if (typeof tab.ensureReady === "function") {
          await tab.ensureReady();
        }
        await prepareFreshImageChat(tab);
        await uploadSlideSource(tab, slide.sourcePath);
        const slideHashes = new Set();

        for (const cell of slide.cells) {
          worker.current.cellId = cell.id;
          await flushProgress();
          const result = await generateCellAsset(
            tab,
            slide,
            cell,
            workerName,
            slideHashes
          );
          if (result.ok) {
            progress.saved += 1;
            worker.saved += 1;
            worker.lastSaved = result;
          } else {
            progress.failed += 1;
            worker.failed += 1;
            progress.failures.push({
              workerName,
              deckId: slide.deckId,
              slideNum: slide.slideNum,
              cellId: cell.id,
              ...result
            });
          }
          processedCellCount += 1;
          await flushProgress();
        }
      } catch (error) {
        const failedCellIds = slide.cells
          .slice(processedCellCount)
          .map((cell) => cell.id);
        progress.failed += failedCellIds.length;
        worker.failed += failedCellIds.length;
        progress.failures.push({
          workerName,
          deckId: slide.deckId,
          slideNum: slide.slideNum,
          cellIds: failedCellIds,
          error: String(error?.message || error)
        });
        await flushProgress();
      }
    }

    const worker = progress.workers[workerName];
    worker.state = "complete";
    worker.current = null;
    worker.finishedAt = new Date().toISOString();
    await flushProgress();
    return worker;
  }

  async function prepareFreshAppChat(tab) {
    let lastError = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        if (typeof tab.ensureReady === "function") {
          await tab.ensureReady();
        }
        await tab.goto(GEMINI_APP_URL, { waitUntil: "domcontentloaded", timeout: 25_000 });
        await sleep(1_000);

        const newChatBtn = tab.playwright
          .getByRole("button", { name: /New chat/i })
          .or(tab.playwright.locator('button[aria-label*="New chat" i]'));
        if ((await newChatBtn.count().catch(() => 0)) > 0) {
          await newChatBtn.first().click().catch(() => {});
        }

        const promptBox = tab.playwright
          .getByRole("textbox", { name: "Enter a prompt for Gemini" })
          .or(tab.playwright.locator('rich-textarea div[contenteditable="true"]'));
        await promptBox.first().waitFor({ state: "visible", timeout: 20_000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("Gemini app chat did not become ready.");
  }

  async function waitForResponseText(tab, timeoutMs = 90_000) {
    const startedAt = Date.now();
    await sleep(2_000);

    while (Date.now() - startedAt < timeoutMs) {
      const stopButton = tab.playwright.getByRole("button", { name: /Stop/i });
      const isGenerating = (await stopButton.count().catch(() => 0)) > 0;

      // Extract all message content candidates
      const candidate = await tab.playwright
        .evaluate(() => {
          const elements = Array.from(
            document.querySelectorAll(
              "message-content .markdown, message-content, model-response, .markdown, .model-response-text, [data-test-id='model-response-text'], div, p"
            )
          );
          for (let i = elements.length - 1; i >= 0; i -= 1) {
            const t = (elements[i].innerText || "").trim();
            if (
              t.includes("schemaVersion") &&
              !t.includes("Return JSON only") &&
              t.includes("{") &&
              t.includes("}")
            ) {
              return t;
            }
          }
          return null;
        })
        .catch(() => null);

      if (candidate && !isGenerating) {
        return candidate;
      }

      // Check for Gemini error toast / snackbar
      const hasErrorToast = await tab.playwright
        .evaluate(() => {
          const body = (document.body.innerText || "").toLowerCase();
          return (
            body.includes("check your internet connection and try again") ||
            body.includes("something went wrong")
          );
        })
        .catch(() => false);

      if (hasErrorToast) {
        throw new Error("Gemini returned 'Check your internet connection and try again' error toast.");
      }

      await sleep(1_500);
    }
    throw new Error("Timed out waiting for Gemini text response.");
  }

  async function analyzeSlideAsset(tab, slideItem, workerName) {
    let lastError = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        await prepareFreshAppChat(tab);
        await uploadSlideSource(tab, slideItem.sourcePath);

        const promptBox = tab.playwright
          .locator('rich-textarea div[contenteditable="true"]')
          .or(tab.playwright.getByRole("textbox", { name: "Enter a prompt for Gemini" }))
          .first();
        await promptBox.focus().catch(() => {});
        await tab.playwright.keyboard.press("End").catch(() => {});
        await tab.playwright.keyboard.insertText(slideItem.prompt);
        await sleep(400);

        const sendButton = tab.playwright.getByRole("button", {
          name: "Send message"
        });
        if (await sendButton.isVisible().catch(() => false)) {
          await sendButton.click({ timeout: 10_000 }).catch(() => {});
        } else {
          await tab.playwright.keyboard.press("Enter").catch(() => {});
        }

        const responseText = await waitForResponseText(tab);
        const normalized = normalizeGeminiSlideAnalysis(responseText, {
          slide: slideItem.slide
        });

        const sidecarPayload = {
          schemaVersion: 1,
          provider: "google-gemini",
          analyzedAt: new Date().toISOString(),
          sourceHash: slideItem.sourceHash,
          analysis: normalized
        };

        await writeJsonAtomically(slideItem.sidecarPath, sidecarPayload);
        const decksRoot = path.join(repoRoot, "public", "decks");
        await generateSlideInteractivity(slideItem.deckId, decksRoot);

        return {
          ok: true,
          sidecarPath: slideItem.sidecarPath,
          title: normalized.title,
          strategy: normalized.recommendedStrategy,
          buildCount: normalized.recommendedBuilds?.length || 0,
          attempt: attempt + 1
        };
      } catch (error) {
        lastError = error;
        await sleep(2_000);
      }
    }
    return {
      ok: false,
      error: lastError ? lastError.message : "Failed to analyze slide image."
    };
  }

  async function processAnalysisQueue(tab, slides, workerName) {
    progress.workers[workerName] = {
      state: "running",
      planned: slides.length,
      saved: 0,
      failed: 0,
      current: null
    };
    await flushProgress();

    for (let slideIndex = 0; slideIndex < slides.length; slideIndex += 1) {
      const slideItem = slides[slideIndex];
      const worker = progress.workers[workerName];
      worker.current = {
        deckId: slideItem.deckId,
        slideNum: slideItem.slideNum,
        title: slideItem.title,
        slideIndex: slideIndex + 1,
        slideCount: slides.length
      };
      await flushProgress();

      try {
        if (typeof tab.ensureReady === "function") {
          await tab.ensureReady();
        }
        const result = await analyzeSlideAsset(tab, slideItem, workerName);
        if (result.ok) {
          progress.saved += 1;
          worker.saved += 1;
          worker.lastSaved = result;
        } else {
          progress.failed += 1;
          worker.failed += 1;
          progress.failures.push({
            workerName,
            deckId: slideItem.deckId,
            slideNum: slideItem.slideNum,
            ...result
          });
        }
      } catch (err) {
        progress.failed += 1;
        worker.failed += 1;
        progress.failures.push({
          workerName,
          deckId: slideItem.deckId,
          slideNum: slideItem.slideNum,
          ok: false,
          error: String(err?.message || err)
        });
      }
      await flushProgress();
    }

    const worker = progress.workers[workerName];
    worker.state = "complete";
    worker.current = null;
    worker.finishedAt = new Date().toISOString();
    await flushProgress();
    return worker;
  }

  return {
    processQueue,
    processAnalysisQueue,
    progress,
    progressPath,
    flushProgress
  };
}

export function createTabSession(context) {
  let page = null;

  async function getPage() {
    if (!page || page.isClosed()) {
      page = await context.newPage();
    }
    return page;
  }

  return {
    async ensureReady() {
      return await getPage();
    },
    async url() {
      const p = await getPage();
      return p.url();
    },
    async goto(url, opts) {
      const p = await getPage();
      return await p.goto(url, opts);
    },
    async reload(opts) {
      const p = await getPage();
      return await p.reload(opts);
    },
    get playwright() {
      return page;
    },
    async close() {
      if (page && !page.isClosed()) {
        await page.close().catch(() => {});
      }
      page = null;
    },
    clipboard: {
      writeText: async (text) => {
        const p = await getPage();
        await p.evaluate((t) => navigator.clipboard.writeText(t), text).catch(() => {});
      },
      read: async () => {
        const p = await getPage();
        return await p
          .evaluate(async () => {
            try {
              const items = await navigator.clipboard.read();
              const results = [];
              for (const item of items) {
                const entries = [];
                for (const type of item.types) {
                  if (type === "image/png") {
                    const blob = await item.getType(type);
                    const reader = new FileReader();
                    const base64 = await new Promise((resolve) => {
                      reader.onloadend = () => resolve(reader.result.split(",")[1]);
                      reader.readAsDataURL(blob);
                    });
                    entries.push({ mimeType: type, base64 });
                  }
                }
                results.push({ entries });
              }
              return results;
            } catch {
              return [];
            }
          })
          .catch(() => []);
      }
    }
  };
}

export function wrapPlaywrightPage(page) {
  return {
    ensureReady: async () => page,
    url: () => page.url(),
    goto: (url, opts) => page.goto(url, opts),
    reload: (opts) => page.reload(opts),
    playwright: page,
    close: async () => {
      if (page && !page.isClosed()) await page.close().catch(() => {});
    },
    clipboard: {
      writeText: async (text) => {
        await page.evaluate((t) => navigator.clipboard.writeText(t), text).catch(() => {});
      },
      read: async () => {
        return await page
          .evaluate(async () => {
            try {
              const items = await navigator.clipboard.read();
              const results = [];
              for (const item of items) {
                const entries = [];
                for (const type of item.types) {
                  if (type === "image/png") {
                    const blob = await item.getType(type);
                    const reader = new FileReader();
                    const base64 = await new Promise((resolve) => {
                      reader.onloadend = () => resolve(reader.result.split(",")[1]);
                      reader.readAsDataURL(blob);
                    });
                    entries.push({ mimeType: type, base64 });
                  }
                }
                results.push({ entries });
              }
              return results;
            } catch {
              return [];
            }
          })
          .catch(() => []);
      }
    }
  };
}

export async function runParallelBrowserQueue({
  repoRoot = process.cwd(),
  cdpEndpoint = "http://127.0.0.1:9333",
  concurrency = 1,
  mode = "all"
} = {}) {
  const decksRoot = path.join(repoRoot, "public", "decks");
  const deckDirs = (await fs.readdir(decksRoot)).filter((entry) => !entry.startsWith(".")).sort();

  // Partition decks across the concurrency workers
  const deckGroups = Array.from({ length: concurrency }, () => []);
  deckDirs.forEach((deckDir, index) => {
    deckGroups[index % concurrency].push(deckDir);
  });

  const analysisQueues = await buildAnalysisQueues(repoRoot, deckGroups);
  const missingQueues = await buildMissingQueues(repoRoot, deckGroups);

  const totalPlanned =
    mode === "analysis"
      ? analysisQueues.reduce((sum, q) => sum + q.length, 0)
      : mode === "generation"
      ? missingQueues.reduce((sum, q) => sum + q.reduce((c, s) => c + s.cells.length, 0), 0)
      : analysisQueues.reduce((sum, q) => sum + q.length, 0) +
        missingQueues.reduce((sum, q) => sum + q.reduce((c, s) => c + s.cells.length, 0), 0);

  console.log(`[Queue Runner] Initializing queue runner with ${concurrency} worker(s) (1 Gemini call at a time).`);
  console.log(`[Queue Runner] Mode: ${mode}, Total items planned: ${totalPlanned}`);

  const runner = createGeminiBrowserQueueRunner({
    repoRoot,
    totalPlanned
  });

  let browser;
  try {
    browser = await chromium.connectOverCDP(cdpEndpoint);
  } catch (error) {
    console.warn(`[Queue Runner] Could not connect to CDP endpoint ${cdpEndpoint}: ${error.message}`);
    return {
      success: false,
      error: `Could not connect to Chrome CDP on ${cdpEndpoint}. Ensure Chrome is running with --remote-debugging-port=9333.`,
      runner
    };
  }

  const context = browser.contexts()[0];
  if (!context) {
    throw new Error("No browser context found on CDP connection.");
  }

  const workers = [];
  for (let i = 0; i < concurrency; i += 1) {
    const workerName = `worker_${i + 1}`;
    const startupDelayMs = i * 4_000; // Stagger worker startups by 4 seconds

    workers.push(async () => {
      const tab = createTabSession(context);
      try {
        if (startupDelayMs > 0) {
          await sleep(startupDelayMs);
        }
        await tab.ensureReady();

        if (mode === "analysis" || mode === "all") {
          const queue = analysisQueues[i] || [];
          if (queue.length > 0) {
            console.log(`[${workerName}] Starting analysis queue with ${queue.length} slides.`);
            await runner.processAnalysisQueue(tab, queue, `${workerName}_analysis`).catch((err) => {
              console.warn(`[${workerName}] Analysis queue warning: ${err.message}`);
            });
          }
        }

        if (mode === "generation" || mode === "all") {
          const queue = missingQueues[i] || [];
          if (queue.length > 0) {
            console.log(`[${workerName}] Starting image generation queue with ${queue.length} slides.`);
            await runner.processQueue(tab, queue, `${workerName}_generation`).catch((err) => {
              console.warn(`[${workerName}] Generation queue warning: ${err.message}`);
            });
          }
        }
      } catch (err) {
        console.warn(`[${workerName}] Worker encountered error: ${err.message}`);
      } finally {
        await tab.close().catch(() => {});
      }
    });
  }

  await Promise.allSettled(workers.map((fn) => fn()));

  console.log(`[Queue Runner] Queue completed. Saved: ${runner.progress.saved}, Failed: ${runner.progress.failed}`);
  return {
    success: true,
    progress: runner.progress
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const mode = process.argv[2] || "all";
  const concurrency = Number(process.argv[3]) || 1;
  runParallelBrowserQueue({ mode, concurrency }).catch((error) => {
    console.error("[Queue Runner] Error:", error);
    process.exitCode = 1;
  });
}
