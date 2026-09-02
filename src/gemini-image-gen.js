import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { AGENT_PATHWAYS } from "./agent-config.js";

/**
 * Google Gemini image-chat automation.
 *
 * The workflow attaches the source slide image to an already-authenticated
 * gemini.google.com tab exposed over Chrome CDP, enters the user's prompt, and
 * sends the chat message. Generated images are deliberately not advertised as
 * local slide assets until a later download/sync step has actually produced a
 * file.
 */

export const DEFAULT_GEMINI_IMAGE_PROMPT_TEMPLATE =
  "Create a revised version of this slide that keeps its visual style and layout. Apply only the requested component change and leave every other slide element unchanged. Return the complete 16:9 slide canvas, not a crop or isolated target area.";

async function isVisible(locator, timeout = 1500) {
  try {
    return await locator.isVisible({ timeout });
  } catch {
    return false;
  }
}

async function attachSlideImage(page, imagePath) {
  const triggerSelectors = [
    'button[aria-label*="Upload and tools" i]',
    'button.hidden-local-file-image-selector-button',
    '.hidden-local-file-image-selector-button',
    '[xapfileselectortrigger]',
    'button[data-test-id="local-images-files-uploader-button"]',
    'button[data-test-id*="uploader"]',
    'button[data-test-id*="add"]',
    'button:has(mat-icon[fonticon="add"])',
    'button:has(mat-icon[fonticon="attach_file"])',
    'button:has(mat-icon:has-text("add"))',
    'button[aria-label*="Add" i]',
    'button[aria-label*="Upload" i]',
    'button[aria-label*="file" i]',
    'button[aria-label*="image" i]',
    'button:has(.mat-focus-indicator)',
    '.mat-focus-indicator',
    'button:has-text("+")'
  ];

  const uploadFilesSelectors = [
    'button.hidden-local-file-image-selector-button',
    '.hidden-local-file-image-selector-button',
    '[xapfileselectortrigger]',
    'button[data-test-id="local-images-files-uploader-button"]',
    '[data-test-id="local-images-files-uploader-button"]',
    'button[aria-label*="Upload files" i]',
    '[aria-label*="Upload files" i]',
    'button:has-text("Upload files")',
    'span.gem-menu-item-label:has-text("Upload files")',
    'span:has-text("Upload files")'
  ];

  // Try up to 3 attempts with retry delays
  for (let attempt = 0; attempt < 3; attempt++) {
    // Check direct file input first
    try {
      const fileInput = page.locator('input[type="file"]').first();
      if (await isVisible(fileInput, 1500)) {
        await fileInput.setInputFiles(imagePath);
        await page.waitForTimeout(1000);
        return true;
      }
    } catch {}

    // Check trigger buttons
    for (const sel of triggerSelectors) {
      try {
        const btn = page.locator(sel).first();
        if (await isVisible(btn, 2000)) {
          await btn.click();
          await page.waitForTimeout(800);

          // Check if "Upload files" menu option appears
          for (const menuSel of uploadFilesSelectors) {
            try {
              const menuOption = page.locator(menuSel).first();
              if (await isVisible(menuOption, 1500)) {
                const [fileChooser] = await Promise.all([
                  page.waitForEvent("filechooser", { timeout: 5000 }).catch(() => null),
                  menuOption.click().catch(() => {})
                ]);
                if (fileChooser) {
                  await fileChooser.setFiles(imagePath);
                  await page.waitForTimeout(1200);
                  return true;
                }
              }
            } catch {}
          }

          // Check if file input appeared after click
          const fileInput = page.locator('input[type="file"]').first();
          if (await isVisible(fileInput, 1500)) {
            await fileInput.setInputFiles(imagePath);
            await page.waitForTimeout(1200);
            return true;
          }
        }
      } catch {}
    }

    await page.waitForTimeout(1500);
  }

  return false;
}

async function enterAndSendPrompt(page, promptText) {
  const input = page
    .locator(
      'rich-textarea div[contenteditable="true"], div[contenteditable="true"][role="textbox"], div[contenteditable="true"], textarea[placeholder*="Describe" i], textarea, rich-textarea'
    )
    .first();

  if (!(await isVisible(input, 5000))) {
    throw new Error("Gemini image chat input was not available.");
  }

  try {
    await input.fill(promptText);
  } catch {
    await input.click();
    await page.keyboard.insertText(promptText);
  }

  await page.waitForTimeout(500);

  const sendSelectors = [
    'button[data-test-id="send-button"]',
    'button[data-test-id*="send"]',
    'button[data-test-id*="submit"]',
    'button[aria-label*="Send" i]',
    'button[aria-label*="Submit" i]',
    'button[aria-label*="Generate" i]',
    'button[aria-label*="Run" i]',
    'button:has(mat-icon[fonticon="send"])',
    'button:has(mat-icon[fonticon="arrow_forward"])',
    'button:has(mat-icon[fonticon="spark"])',
    'button:has-text("Send")'
  ];

  let clicked = false;
  for (const sel of sendSelectors) {
    try {
      const btn = page.locator(sel).first();
      if (await isVisible(btn, 1200)) {
        await btn.click();
        clicked = true;
        break;
      }
    } catch {}
  }

  if (!clicked) {
    try {
      await input.press("Enter");
      await page.keyboard.press("Enter");
    } catch {}
  }
}

const GENERATED_IMAGE_SELECTOR = [
  'model-response img:not([src*="avatar"]):not([src*="profile"])',
  'message-content img:not([src*="avatar"]):not([src*="profile"])',
  '.conversation-container img:not([src*="avatar"]):not([src*="profile"])',
  'image-viewer img',
  '.image-container img',
  '.image-canvas img',
  'generated-image img',
  'img[src*="googleusercontent.com"]',
  'img[src*="ggpht.com"]',
  'img[src*="blob:"]',
  'img[alt*="Generated" i]',
  'figure img'
].join(", ");

async function snapshotGeneratedMedia(page) {
  const images = page.locator(GENERATED_IMAGE_SELECTOR);
  const videos = page.locator("model-response video, message-content video, generated-video video, video[src]");
  return {
    imageCount: await images.count().catch(() => 0),
    videoCount: await videos.count().catch(() => 0)
  };
}

async function captureGeneratedGeminiImage(
  page,
  deckId,
  slideNum,
  decksDir,
  baseline = { imageCount: 0, videoCount: 0 }
) {
  if (!decksDir) return null;

  const startTime = Date.now();
  const maxWaitMs = 45000;

  console.log(`[Gemini Image Gen] Waiting for Gemini image generation completion for Slide ${slideNum}...`);

  // Step 1: Wait for generation progress indicator / spinner to detach if active
  try {
    const spinner = page
      .locator('mat-progress-spinner, [role="progressbar"], .loading-indicator, .pending-response, .sparkle-spinner')
      .first();
    if (await isVisible(spinner, 2500)) {
      console.log("[Gemini Image Gen] Generation spinner active. Waiting for response completion...");
      await spinner.waitFor({ state: "detached", timeout: 40000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }
  } catch {}

  // Step 2: Poll for valid generated image in DOM
  while (Date.now() - startTime < maxWaitMs) {
    try {
      const videos = page.locator(
        "model-response video, message-content video, generated-video video, video[src]"
      );
      const videoCount = await videos.count();
      if (videoCount > baseline.videoCount) {
        console.warn(
          "[Gemini Image Gen] Gemini returned a video. It was left untouched and was not substituted for the requested still-image build."
        );
        return { kind: "video", protected: true };
      }

      const candidates = page.locator(GENERATED_IMAGE_SELECTOR);
      const count = await candidates.count();

      if (count > baseline.imageCount) {
        for (let i = count - 1; i >= baseline.imageCount; i--) {
          const imgLoc = candidates.nth(i);
          if (!(await isVisible(imgLoc, 1000))) continue;

          const isCandidateValid = await imgLoc
            .evaluate((img) => {
              if (!img) return false;
              const width = img.naturalWidth || img.width || 0;
              const height = img.naturalHeight || img.height || 0;
              const src = img.src || "";
              if (
                src.includes("avatar") ||
                src.includes("profile") ||
                src.includes("favicon") ||
                src.endsWith(".svg")
              ) {
                return false;
              }
              return Boolean(img.complete && width > 150 && height > 150);
            })
            .catch(() => false);

          if (!isCandidateValid) continue;

          let buffer = null;

          // Attempt 1: Off-screen High-Resolution Canvas bitmap extraction (1920x1080 / 2560x1440 HD rendering with bicubic smoothing)
          try {
            const dataUrl = await page.evaluate(async (img) => {
              if (!img) return null;

              // Check for full size image URL if googleusercontent CDN
              let src = img.src || "";
              if (src.includes("googleusercontent.com") && src.includes("=s")) {
                src = src.replace(/=s\d+/, "=s2048");
              }

              // Determine high definition canvas target dimensions (min width 1920px HD presentation standard)
              const nativeWidth = img.naturalWidth || img.width || 1280;
              const nativeHeight = img.naturalHeight || img.height || 720;
              const minTargetWidth = 1920;
              const scale = nativeWidth < minTargetWidth ? minTargetWidth / nativeWidth : 1;

              const targetWidth = Math.round(nativeWidth * scale);
              const targetHeight = Math.round(nativeHeight * scale);

              const canvas = document.createElement("canvas");
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              const ctx = canvas.getContext("2d");

              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";
              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
              return canvas.toDataURL("image/png");
            }, await imgLoc.elementHandle());

            if (dataUrl && dataUrl.startsWith("data:image/")) {
              buffer = Buffer.from(dataUrl.split(",")[1], "base64");
            }
          } catch {}

          // Attempt 2: High-resolution direct image fetch
          if (!buffer || buffer.length < 5000) {
            try {
              const dataUrl = await page.evaluate(async (img) => {
                if (!img || !img.src) return null;
                let fetchUrl = img.src;
                if (fetchUrl.includes("googleusercontent.com") && fetchUrl.includes("=s")) {
                  fetchUrl = fetchUrl.replace(/=s\d+/, "=s2048");
                }
                const response = await fetch(fetchUrl);
                const blob = await response.blob();
                return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.readAsDataURL(blob);
                });
              }, await imgLoc.elementHandle());

              if (dataUrl && dataUrl.startsWith("data:image/")) {
                buffer = Buffer.from(dataUrl.split(",")[1], "base64");
              }
            } catch {}
          }

          // Attempt 3: Element screenshot fallback
          if (!buffer || buffer.length < 5000) {
            try {
              buffer = await imgLoc.screenshot({ type: "png" });
            } catch {}
          }

          if (buffer && buffer.length > 5000) {
            const fileName = `slide_${String(slideNum).padStart(2, "0")}_revised_${Date.now()}.png`;
            const slideDir = path.join(decksDir, deckId, "slides");
            await fs.mkdir(slideDir, { recursive: true });
            const savePath = path.join(slideDir, fileName);
            await fs.writeFile(savePath, buffer);
            const relativeUrl = `/decks/${deckId}/slides/${fileName}`;
            console.log(
              `[Gemini Image Gen] Successfully captured generated image (${buffer.length} bytes) to ${relativeUrl}`
            );
            return { kind: "image", imageUrl: relativeUrl };
          }
        }
      }
    } catch {
      // Continue polling
    }
    await page.waitForTimeout(2000);
  }

  console.warn(`[Gemini Image Gen] Timed out waiting for Gemini image generation after ${maxWaitMs / 1000}s.`);
  return null;
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

const withGeminiLock = createMutex();

export async function generateGeminiSlideImage(
  deckId,
  slideNum,
  imagePath,
  promptText,
  { cdpEndpoint = "http://127.0.0.1:9333", dispatch = true, decksDir = null } = {}
) {
  const finalPrompt = promptText || DEFAULT_GEMINI_IMAGE_PROMPT_TEMPLATE;
  await fs.access(imagePath);

  let cdpConnected = false;
  let imageAttached = false;
  let promptSent = false;
  let notice = null;
  let capturedImageUrl = null;
  let protectedVideoDetected = false;

  if (dispatch) {
    await withGeminiLock(async () => {
      try {
        const response = await fetch(`${cdpEndpoint}/json/list`).catch(() => null);
        if (response?.ok) {
          const tabs = await response.json();
          const geminiTab = tabs.find(
            (tab) => typeof tab.url === "string" && tab.url.includes("gemini.google.com")
          );

          if (geminiTab) {
            const browser = await chromium.connectOverCDP(cdpEndpoint);
            try {
              const context = browser.contexts()[0];
              let page = null;

              if (context) {
                cdpConnected = true;

                // Always use a new Images tab. Reusing or navigating an existing
                // Gemini tab can interrupt a video generation that is still in
                // progress in the user's session.
                page = await context.newPage();
                await page.goto("https://gemini.google.com/images", {
                  waitUntil: "domcontentloaded",
                  timeout: 12000
                });

                imageAttached = await attachSlideImage(page, imagePath);
                if (!imageAttached) {
                  throw new Error("Gemini image upload control was not available.");
                }

                const baseline = await snapshotGeneratedMedia(page);
                await enterAndSendPrompt(page, finalPrompt);
                promptSent = true;

                if (decksDir) {
                  const capturedMedia = await captureGeneratedGeminiImage(
                    page,
                    deckId,
                    slideNum,
                    decksDir,
                    baseline
                  );
                  if (capturedMedia?.kind === "image") {
                    capturedImageUrl = capturedMedia.imageUrl;
                  } else if (capturedMedia?.kind === "video") {
                    protectedVideoDetected = true;
                    notice =
                      "Gemini returned a video; it was preserved in Gemini and was not used to replace the still-image build.";
                  }
                }
              }
            } finally {
              try {
                if (typeof browser.disconnect === "function") {
                  await browser.disconnect();
                }
              } catch {
                // Keep browser active
              }
            }
          } else {
            notice = "Chrome is connected, but no Gemini tab is open.";
          }
        } else {
          notice = "Gemini image chat is ready as the default pathway; open Chrome with CDP to dispatch.";
        }
      } catch (error) {
        notice = error.message;
      }
    });
  } else {
    notice = "Dispatch was disabled for this run.";
  }

  const dispatched = cdpConnected && imageAttached && promptSent;

  return {
    success: true,
    pathway: AGENT_PATHWAYS.GEMINI_IMAGE_CHAT,
    deckId,
    slideNum,
    prompt: finalPrompt,
    cdpConnected,
    imageAttached,
    promptSent,
    dispatched,
    imageUrl: capturedImageUrl,
    mediaType: capturedImageUrl ? "image" : protectedVideoDetected ? "video" : null,
    protectedVideoDetected,
    timestamp: new Date().toISOString(),
    status: dispatched
      ? protectedVideoDetected
        ? notice
        : capturedImageUrl
        ? "Slide image generated and saved for QA; it is not in the click sequence yet."
        : "Slide image and revision prompt were sent to Google Gemini image chat."
      : notice || "Gemini image-chat revision is queued until a connected Gemini tab is available."
  };
}
