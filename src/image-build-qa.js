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

export function buildGeminiVisualQaPrompt({
  deckTitle,
  slideNumber,
  buildNumber,
  totalBuilds,
  expectedTitle,
  showNow,
  temporarilyOmit
} = {}) {
  return `Perform visual quality assurance on this generated cumulative presentation slide build.

Source context: ${deckTitle || "Presentation"}, Slide ${slideNumber || "N"}, Build ${buildNumber || 1} of ${totalBuilds || 1}.
Expected visible title: "${expectedTitle || ""}".
Expected to SHOW NOW: ${showNow || "Components for this build."}
Expected to TEMPORARILY OMIT: ${temporarilyOmit || "Later build components."}

Compare the generated slide image against the source slide image.
Return JSON only with no Markdown formatting, using this schema:
{
  "pass": true,
  "titleExact": true,
  "expectedComponentsPresent": true,
  "laterComponentsAbsent": true,
  "inventedContent": false,
  "layoutFidelity": "high",
  "issues": []
}

QA Rules:
1. titleExact: true only if the exact source title wording is reproduced without dropped words, truncation, or substitution.
2. expectedComponentsPresent: true only if all items in SHOW NOW are visibly present in their correct positions.
3. laterComponentsAbsent: true only if all items in TEMPORARILY OMIT are completely absent (clean background, no ghosting or leakage).
4. inventedContent: false if no ungrounded diagrams, equations, molecules, arrows, or decorative clutter have been fabricated.
5. layoutFidelity: "high", "medium", or "low" describing how faithfully the background, font styling, and canvas layout match the source.
6. pass: true only if titleExact is true, expectedComponentsPresent is true, laterComponentsAbsent is true, inventedContent is false, and layoutFidelity is not "low".`;
}

export function validateSemanticBuildQa(qaReport) {
  if (!qaReport || typeof qaReport !== "object") {
    return {
      passed: false,
      issues: ["Missing QA report."]
    };
  }

  const issues = Array.isArray(qaReport.issues) ? [...qaReport.issues] : [];
  if (qaReport.titleExact !== true) {
    issues.push("Title wording does not match the source slide exactly.");
  }
  if (qaReport.expectedComponentsPresent !== true) {
    issues.push("Expected current-build components are missing from the generated image.");
  }
  if (qaReport.laterComponentsAbsent !== true) {
    issues.push("Components scheduled for later builds leaked into this build.");
  }
  if (qaReport.inventedContent === true) {
    issues.push("Generated image contains invented diagrams, equations, or annotations not present in source.");
  }
  if (qaReport.layoutFidelity === "low") {
    issues.push("Layout fidelity is low; canvas style or alignment deviates significantly from the source.");
  }

  const passed =
    qaReport.pass === true &&
    qaReport.titleExact === true &&
    qaReport.expectedComponentsPresent === true &&
    qaReport.laterComponentsAbsent === true &&
    qaReport.inventedContent === false &&
    qaReport.layoutFidelity !== "low" &&
    issues.length === 0;

  return {
    passed,
    titleExact: qaReport.titleExact === true,
    expectedComponentsPresent: qaReport.expectedComponentsPresent === true,
    laterComponentsAbsent: qaReport.laterComponentsAbsent === true,
    inventedContent: qaReport.inventedContent === true,
    layoutFidelity: qaReport.layoutFidelity || "medium",
    issues
  };
}

