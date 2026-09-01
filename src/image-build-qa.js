import crypto from "node:crypto";
import fs from "node:fs/promises";

const DEFAULT_MIN_BYTES = 20_000;
const DEFAULT_MIN_WIDTH = 1_000;
const DEFAULT_MIN_HEIGHT = 550;
const TARGET_ASPECT_RATIO = 16 / 9;
const DEFAULT_ASPECT_TOLERANCE = 0.08;

function pngDimensions(buffer) {
  if (
    buffer.length < 24 ||
    buffer[0] !== 0x89 ||
    buffer.toString("ascii", 1, 4) !== "PNG"
  ) {
    return null;
  }
  return {
    format: "png",
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isStartOfFrame && length >= 7) {
      return {
        format: "jpeg",
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3)
      };
    }
    offset += length;
  }
  return null;
}

export function inspectImageBuffer(buffer) {
  return pngDimensions(buffer) || jpegDimensions(buffer);
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function validateGeneratedSlideImage({
  outputPath,
  sourcePath = null,
  minBytes = DEFAULT_MIN_BYTES,
  minWidth = DEFAULT_MIN_WIDTH,
  minHeight = DEFAULT_MIN_HEIGHT,
  aspectTolerance = DEFAULT_ASPECT_TOLERANCE
}) {
  const checks = [];
  let outputBuffer;
  try {
    outputBuffer = await fs.readFile(outputPath);
    checks.push({ id: "file-readable", passed: true });
  } catch (error) {
    return {
      passed: false,
      checks: [{ id: "file-readable", passed: false, detail: error.message }],
      outputPath
    };
  }

  const dimensions = inspectImageBuffer(outputBuffer);
  checks.push({
    id: "supported-image-signature",
    passed: Boolean(dimensions),
    detail: dimensions?.format || "Expected a PNG or JPEG image."
  });
  checks.push({
    id: "minimum-file-size",
    passed: outputBuffer.length >= minBytes,
    detail: `${outputBuffer.length} bytes; minimum ${minBytes}`
  });

  if (dimensions) {
    const aspectRatio = dimensions.width / dimensions.height;
    checks.push({
      id: "minimum-resolution",
      passed: dimensions.width >= minWidth && dimensions.height >= minHeight,
      detail: `${dimensions.width}×${dimensions.height}; minimum ${minWidth}×${minHeight}`
    });
    checks.push({
      id: "sixteen-nine-canvas",
      passed: Math.abs(aspectRatio - TARGET_ASPECT_RATIO) <= aspectTolerance,
      detail: `aspect ${aspectRatio.toFixed(4)}; target ${TARGET_ASPECT_RATIO.toFixed(4)}`
    });
  }

  let sourceHash = null;
  let sourceDimensions = null;
  if (sourcePath) {
    try {
      const sourceBuffer = await fs.readFile(sourcePath);
      sourceHash = sha256(sourceBuffer);
      sourceDimensions = inspectImageBuffer(sourceBuffer);
      checks.push({
        id: "distinct-from-source",
        passed: sourceHash !== sha256(outputBuffer),
        detail: "A generated build must not be the unchanged source image."
      });
      if (dimensions && sourceDimensions) {
        const outputAspect = dimensions.width / dimensions.height;
        const sourceAspect = sourceDimensions.width / sourceDimensions.height;
        checks.push({
          id: "source-canvas-match",
          passed: Math.abs(outputAspect - sourceAspect) <= aspectTolerance,
          detail: `generated aspect ${outputAspect.toFixed(4)}; source aspect ${sourceAspect.toFixed(4)}`
        });
      }
    } catch (error) {
      checks.push({ id: "source-readable", passed: false, detail: error.message });
    }
  }

  return {
    passed: checks.every((check) => check.passed),
    checks,
    outputPath,
    byteLength: outputBuffer.length,
    sha256: sha256(outputBuffer),
    dimensions,
    sourceHash,
    sourceDimensions
  };
}

export const REQUIRED_VISUAL_QA_CHECKS = Object.freeze([
  "fullCanvas",
  "styleMatch",
  "cumulativeContent",
  "legibleText",
  "noFocusTreatment"
]);

export function validateVisualQaChecklist(checklist) {
  const normalized = checklist && typeof checklist === "object" ? checklist : {};
  const missing = REQUIRED_VISUAL_QA_CHECKS.filter((key) => normalized[key] !== true);
  return {
    passed: missing.length === 0,
    missing,
    checks: Object.fromEntries(
      REQUIRED_VISUAL_QA_CHECKS.map((key) => [key, normalized[key] === true])
    )
  };
}

