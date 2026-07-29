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
  const triggerSelector = [
    'button:has(.mat-focus-indicator)',
    '.mat-focus-indicator',
    'button[data-test-id*="uploader"]',
    'button[aria-label*="Upload" i]',
    'button[aria-label*="file" i]',
    'button[aria-label*="Add" i]',
    'button[aria-label*="image" i]',
    'button:has-text("Upload")',
    'button:has-text("Add")'
  ].join(", ");

  const uploadFilesSelector = [
    'button[data-test-id="local-images-files-uploader-button"]',
    '[data-test-id="local-images-files-uploader-button"]',
    'button[aria-label*="Upload files" i]',
    'button:has-text("Upload files")',
    'span.gem-menu-item-label:has-text("Upload files")',
    'span:has-text("Upload files")'
  ].join(", ");

  // Step 1: Open popup menu at trigger button (.mat-focus-indicator) FIRST
  const triggerButton = page.locator(triggerSelector).first();
  if (await isVisible(triggerButton, 3000)) {
    try {
      await triggerButton.click();
      await page.waitForTimeout(500);

      // Locate "Upload files" button inside the open popup menu
      const uploadFilesOption = page.locator(uploadFilesSelector).first();
      if (await isVisible(uploadFilesOption, 2500)) {
        const [fileChooser] = await Promise.all([
          page.waitForEvent("filechooser", { timeout: 5000 }).catch(() => null),
          uploadFilesOption.click().catch(() => {})
        ]);

        if (fileChooser) {
          await fileChooser.setFiles(imagePath);
          await page.waitForTimeout(800);
          return true;
        }
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Step 2: Fallback if popup menu item is already open/visible
  const directUploadOption = page.locator(uploadFilesSelector).first();
  if (await isVisible(directUploadOption, 1000)) {
    try {
      const [fileChooser] = await Promise.all([
        page.waitForEvent("filechooser", { timeout: 4000 }).catch(() => null),
        directUploadOption.click().catch(() => {})
      ]);
      if (fileChooser) {
        await fileChooser.setFiles(imagePath);
        await page.waitForTimeout(800);
        return true;
      }
    } catch {
      // Fall through
    }
  }

  // Step 3: Fallback direct setInputFiles on existing file input
  try {
    const fileInputs = page.locator('input[type="file"]');
    if ((await fileInputs.count()) > 0) {
      await fileInputs.first().setInputFiles(imagePath);
      await page.waitForTimeout(800);
      return true;
    }
  } catch {
    // Fall through
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

  await page.waitForTimeout(300);

  const sendButton = page
    .locator(
      'button[aria-label*="Send" i], button[aria-label*="Submit" i], button[aria-label*="Generate" i], button:has-text("Send")'
    )
    .first();

  if (await isVisible(sendButton)) {
    await sendButton.click();
  } else {
    await input.press("Enter");
  }
}

export async function generateGeminiSlideImage(
  deckId,
  slideNum,
  imagePath,
  promptText,
  { cdpEndpoint = "http://127.0.0.1:9333", dispatch = true } = {}
) {
  const finalPrompt = promptText || DEFAULT_GEMINI_IMAGE_PROMPT_TEMPLATE;
  await fs.access(imagePath);

  let cdpConnected = false;
  let imageAttached = false;
  let promptSent = false;
  let notice = null;

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
                  // Ignore if navigation is slow or already at destination
                }
              }

              imageAttached = await attachSlideImage(page, imagePath);
              if (!imageAttached) {
                throw new Error("Gemini image upload control was not available.");
              }
              await enterAndSendPrompt(page, finalPrompt);
              promptSent = true;
            }
          } finally {
            try {
              if (typeof browser.disconnect === "function") {
                await browser.disconnect();
              }
            } catch {
              // Ignore disconnect errors to keep Chrome process active
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
    imageUrl: null,
    timestamp: new Date().toISOString(),
    status: dispatched
      ? "Slide image and revision prompt were sent to Google Gemini image chat."
      : notice || "Gemini image-chat revision is queued until a connected Gemini tab is available."
  };
}
