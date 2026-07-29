import fs from "node:fs/promises";
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
  "Create a revised version of this slide that keeps its visual style and layout. Apply only the requested component change and leave every other slide element unchanged. Do not return the target area. Do not render any bounding boxes, selection highlights, grid overlays, or target markers on the generated image.";

async function isVisible(locator, timeout = 1500) {
  try {
    return await locator.isVisible({ timeout });
  } catch {
    return false;
  }
}

async function attachSlideImage(page, imagePath) {
  const triggerSelectors = [
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
    'button[data-test-id="local-images-files-uploader-button"]',
    '[data-test-id="local-images-files-uploader-button"]',
    'button[aria-label*="Upload files" i]',
    '[aria-label*="Upload files" i]',
    'button:has-text("Upload files")',
    'span.gem-menu-item-label:has-text("Upload files")',
    'span:has-text("Upload files")'
  ];

  // Try direct file input if already available
  try {
    const fileInput = page.locator('input[type="file"]').first();
    if (await isVisible(fileInput, 1000)) {
      await fileInput.setInputFiles(imagePath);
      await page.waitForTimeout(800);
      return true;
    }
  } catch {}

  // Find and click the (+) trigger button
  for (const sel of triggerSelectors) {
    try {
      const btn = page.locator(sel).first();
      if (await isVisible(btn, 1500)) {
        await btn.click();
        await page.waitForTimeout(600);

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

  // Fallback: setInputFiles on any input[type="file"] in DOM
  try {
    const fileInputs = page.locator('input[type="file"]');
    if ((await fileInputs.count()) > 0) {
      await fileInputs.first().setInputFiles(imagePath);
      await page.waitForTimeout(1200);
      return true;
    }
  } catch {}

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

async function captureGeneratedGeminiImage(page, deckId, slideNum, decksDir) {
  if (!decksDir) return null;
  try {
    const imgLocator = page
      .locator(
        'img[src*="googleusercontent"], img[src*="blob:"], image-viewer img, .image-canvas img, img[alt*="Generated" i]'
      )
      .last();

    if (await isVisible(imgLocator, 20000)) {
      const src = await imgLocator.getAttribute("src");
      if (src) {
        let buffer = null;
        if (src.startsWith("data:image/")) {
          const base64Data = src.split(",")[1];
          buffer = Buffer.from(base64Data, "base64");
        } else if (src.startsWith("http") || src.startsWith("blob:")) {
          buffer = await page
            .evaluate(async (url) => {
              const res = await fetch(url);
              const blob = await res.blob();
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
            })
            .then((dataUrl) => Buffer.from(dataUrl.split(",")[1], "base64"))
            .catch(() => null);
        }

        if (buffer) {
          const fileName = `slide_${String(slideNum).padStart(2, "0")}_revised_${Date.now()}.png`;
          const slideDir = path.join(decksDir, deckId, "slides");
          await fs.mkdir(slideDir, { recursive: true });
          const savePath = path.join(slideDir, fileName);
          await fs.writeFile(savePath, buffer);
          const relativeUrl = `/decks/${deckId}/slides/${fileName}`;
          console.log(`[Gemini Image Gen] Captured generated image: ${relativeUrl}`);
          return relativeUrl;
        }
      }
    }
  } catch (error) {
    console.warn("[Gemini Image Gen] Image capture notice:", error.message);
  }
  return null;
}

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

  if (dispatch) {
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
            let page =
              context?.pages().find((candidate) => candidate.url().includes("gemini.google.com")) ||
              context?.pages()[0];

            if (page) {
              cdpConnected = true;

              if (!page.url().includes("gemini.google.com/images")) {
                try {
                  await page.goto("https://gemini.google.com/images", {
                    waitUntil: "domcontentloaded",
                    timeout: 8000
                  });
                } catch {
                  // Ignore navigation timeouts if page is responsive
                }
              }

              imageAttached = await attachSlideImage(page, imagePath);
              if (!imageAttached) {
                throw new Error("Gemini image upload control was not available.");
              }

              await enterAndSendPrompt(page, finalPrompt);
              promptSent = true;

              if (decksDir) {
                capturedImageUrl = await captureGeneratedGeminiImage(
                  page,
                  deckId,
                  slideNum,
                  decksDir
                );
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
    timestamp: new Date().toISOString(),
    status: dispatched
      ? capturedImageUrl
        ? "Slide image generated and automatically incorporated into presentation."
        : "Slide image and revision prompt were sent to Google Gemini image chat."
      : notice || "Gemini image-chat revision is queued until a connected Gemini tab is available."
  };
}
