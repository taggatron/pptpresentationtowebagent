import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const context = browser.contexts()[0];
  const page = context.pages().find((p) => p.url().includes("gemini.google.com")) || context.pages()[0];

  console.log("Connected to Gemini URL:", page.url());

  const imageSelectors = [
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

  const candidates = page.locator(imageSelectors);
  const count = await candidates.count();
  console.log(`Found ${count} candidate images in Gemini chat`);

  for (let i = count - 1; i >= 0; i--) {
    const imgLoc = candidates.nth(i);
    const info = await imgLoc.evaluate((img) => ({
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      alt: img.alt
    })).catch(() => null);

    if (info && info.complete && info.naturalWidth > 150) {
      console.log("Extracting HD 1080p image bitmap via high-res canvas for candidate:", info.src.slice(0, 50));

      const dataUrl = await page.evaluate(async (img) => {
        let src = img.src || "";
        if (src.includes("googleusercontent.com") && src.includes("=s")) {
          src = src.replace(/=s\d+/, "=s2048");
        }

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
      }, await imgLoc.elementHandle()).catch(() => null);

      if (dataUrl && dataUrl.startsWith("data:image/")) {
        const buffer = Buffer.from(dataUrl.split(",")[1], "base64");
        const decksDir = "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/pptpresentationtowebagent/public/decks";
        const savePath = path.join(decksDir, "Lesson_01_CELL_STRUCTURE", "slides", "slide_01_revised_hd.png");
        await fs.writeFile(savePath, buffer);
        console.log(`Successfully extracted high-res HD image (${buffer.length} bytes) to ${savePath}!`);
        break;
      }
    }
  }

  await browser.disconnect().catch(() => {});
}

main().catch(console.error);
