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
  "Create a revised version of this slide that keeps its visual style and layout. Apply only the requested component change and leave every other slide element unchanged.";

async function isVisible(locator, timeout = 1500) {
  try {
    return await locator.isVisible({ timeout });
  } catch {
    return false;
  }
}

async function attachSlideImage(page, imagePath) {
  const fileInput = page.locator('input[type="file"]').first();
  if (await fileInput.count()) {
    await fileInput.setInputFiles(imagePath);
    return true;
  }

  const uploadButton = page
    .locator(
      'button[aria-label*="Upload" i], button[aria-label*="file" i], button:has-text("Upload")'
    )
    .first();

  if (!(await isVisible(uploadButton))) return false;

  try {
    const fileChooserPromise = page.waitForEvent("filechooser", { timeout: 3000 });
    await uploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(imagePath);
    return true;
  } catch {
    return false;
  }
}

async function enterAndSendPrompt(page, promptText) {
  const input = page
    .locator(
      'rich-textarea div[contenteditable="true"], rich-textarea, div[contenteditable="true"][role="textbox"], textarea'
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

  const sendButton = page
    .locator('button[aria-label*="Send" i], button:has-text("Send")')
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
          const context = browser.contexts()[0];
          const page =
            context?.pages().find((candidate) => candidate.url().includes("gemini.google.com")) ||
            context?.pages()[0];

          if (page) {
            cdpConnected = true;
            imageAttached = await attachSlideImage(page, imagePath);
            if (!imageAttached) {
              throw new Error("Gemini image upload control was not available.");
            }
            await enterAndSendPrompt(page, finalPrompt);
            promptSent = true;
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
