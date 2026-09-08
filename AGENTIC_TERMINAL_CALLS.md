# ✦ Agentic Terminal Calls Reference Guide

This document catalogs every **agentic terminal command, Node.js CLI script, and cURL REST API agent call** available in the `pptpresentationtowebagent` workspace.

---

## 📋 Table of Contents

1. [Prerequisites & Chrome CDP Agent Setup](#1-prerequisites--chrome-cdp-agent-setup)
2. [NPM Agent Scripts](#2-npm-agent-scripts)
3. [Direct Node.js Agentic CLI Commands](#3-direct-nodejs-agentic-cli-commands)
4. [Native macOS Vector Rasterization Tool](#4-native-macos-vector-rasterization-tool)
5. [Agentic REST API Calls via cURL](#5-agentic-rest-api-calls-via-curl)
   - [Agent & System Status](#agent--system-status)
   - [Slide Ingestion & Conversion](#slide-ingestion--conversion)
   - [Generative AI Point-and-Edit Revisions](#generative-ai-point-and-edit-revisions)
   - [Gemini Still-Image Generation & Progressive Builds](#gemini-still-image-generation--progressive-builds)
   - [Technical & Visual QA Gating](#technical--visual-qa-gating)
   - [NotebookLM Slide Revisions](#notebooklm-slide-revisions)
   - [Interactive Hotspots & Sequences](#interactive-hotspots--sequences)
6. [Testing & Verification Commands](#6-testing--verification-commands)
7. [Recommended End-to-End Workflows](#7-recommended-end-to-end-workflows)

---

## 1. Prerequisites & Chrome CDP Agent Setup

Several agent workflows (Gemini multimodal analysis, generative image builds, NotebookLM revisions) connect to an authenticated browser session using the **Chrome DevTools Protocol (CDP)** on port `9333`.

### Launch Chrome with CDP Enabled
Run this in a separate terminal before running browser-dependent agent tasks:

```bash
# Launch Google Chrome with remote debugging on port 9333
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9333 \
  --user-data-dir="/tmp/chrome-cdp-agent" &
```

> **Note**: Log in to [gemini.google.com](https://gemini.google.com) and [notebooklm.google.com](https://notebooklm.google.com) in this browser window once. The background agent workers will reuse the active authenticated session.

---

## 2. NPM Agent Scripts

These commands are defined in [`package.json`](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/package.json) and can be executed with `npm run <command>`.

| Command | Target Script | Description |
| :--- | :--- | :--- |
| `npm run agent:queue` | [`scripts/gemini-browser-queue-runner.mjs`](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/scripts/gemini-browser-queue-runner.mjs) | Launches the multi-worker parallel Gemini CDP queue for slide analysis and image generation. |
| `npm run agent:gemini` | [`src/gemini-segmenter.js`](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/src/gemini-segmenter.js) | Runs the Gemini cognitive segmentation and question overlay generator for Lesson 01. |
| `npm run agent:animation` | [`src/gemini-segmenter.js`](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/src/gemini-segmenter.js) | Alias for `agent:gemini`; generates interactive cell grids and serial animation plans. |
| `npm run analyze:current-slides` | [`src/enrich-current-decks.js`](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/src/enrich-current-decks.js) | Runs local OCR analysis (Tesseract) on all decks, infers slide roles, extracts questions, and updates manifests. |
| `npm run convert` | [`src/convert-deck.js`](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/src/convert-deck.js) | Ingests a PPTX file or entire directory, extracts slides and images, and builds interactive manifests. |
| `npm start` | [`src/server.js`](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/src/server.js) | Starts the Express presentation server on port `3000` (auto-increments if port is busy). |
| `npm test` | [`test/presentation-agent.test.js`](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/test/presentation-agent.test.js) etc. | Executes Node.js native test runner against all test suites under `test/`. |
| `npm run check` | Multiple files | Performs syntax checks (`node --check`) on all core source files and executes the test suite. |

---

## 3. Direct Node.js Agentic CLI Commands

Run these directly with `node` to supply fine-grained CLI arguments:

### A. Gemini Browser Queue Runner (CDP Agent)
Manages parallel browser tabs on `gemini.google.com` to analyze slides and generate missing build images.

```bash
# Syntax: node scripts/gemini-browser-queue-runner.mjs [mode] [concurrency]

# 1. Run both analysis and image generation with 1 worker (default)
node scripts/gemini-browser-queue-runner.mjs

# 2. Run both analysis and image generation with 3 parallel workers
node scripts/gemini-browser-queue-runner.mjs all 3

# 3. Run ONLY multimodal slide analysis with 2 workers
node scripts/gemini-browser-queue-runner.mjs analysis 2

# 4. Run ONLY image generation with 2 workers
node scripts/gemini-browser-queue-runner.mjs generation 2
```

### B. Gemini Slide Segmenter & Interactivity Planner
Applies cognitive load calculations (VCI, processing time), connects Gemini sidecars, and structures interactive reveals.

```bash
# Syntax: node src/gemini-segmenter.js [deckId | --all]

# 1. Segment a specific deck by folder name
node src/gemini-segmenter.js Lesson_01_CELL_STRUCTURE

# 2. Segment another specific deck
node src/gemini-segmenter.js Lesson_03_MAGNIFICATION_CALCULATIONS

# 3. Process ALL available decks in public/decks/
node src/gemini-segmenter.js --all
```

### C. Slide Deck OCR & Semantic Enricher
Scans rendered slide images with Tesseract OCR, extracts questions, identifies slide roles, and refreshes the manifest.

```bash
node src/enrich-current-decks.js
```

### D. PPTX Ingestion Agent
Extracts slides and assets from `.pptx` presentations into `public/decks/`.

```bash
# Syntax: node src/convert-deck.js [path/to/file.pptx | path/to/folder]

# 1. Ingest a single PPTX file
node src/convert-deck.js "/path/to/My_Lecture.pptx"

# 2. Batch ingest an entire folder of PPTX files
node src/convert-deck.js "/path/to/powerpoint_folder"

# 3. Run with default folder (NotebookLM sequence v2)
node src/convert-deck.js
```

### E. Start Presentation Server with Custom Port
```bash
# Start on default port 3000 (auto-fails over to 3001, 3002 if 3000 is occupied)
node src/server.js

# Force a specific port
PORT=3005 node src/server.js
```

---

## 4. Native macOS Vector Rasterization Tool

The repository contains an Objective-C / Cocoa PDFKit vector rendering binary [`src/tools/pdf2png`](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/src/tools/pdf2png) used for high-fidelity slide rasterization.

```bash
# Syntax: ./src/tools/pdf2png <input.pdf> <output_dir> [scale]

# Example: Rasterize a presentation PDF at 2.0x scale (default)
./src/tools/pdf2png "slides.pdf" "./public/decks/My_Deck/slides" 2.0

# Example: Rasterize at ultra-high-resolution 3.0x scale
./src/tools/pdf2png "slides.pdf" "./output_slides" 3.0
```

---

## 5. Agentic REST API Calls via cURL

While the web server is running (`npm start`, default `http://localhost:3000`), you can trigger agent workflows via terminal `curl` requests.

### Agent & System Status

#### Check Overall Agent & Queue Status
Returns counts of total slides, analyzed sidecars, planned cells, approved cells, and video slides:
```bash
curl -s http://localhost:3000/api/agent/status | jq .
```

#### Check Active Agent Pathways
```bash
curl -s http://localhost:3000/api/agent-pathways | jq .
```

#### Check Microsoft PowerPoint macOS Scripting Availability
```bash
curl -s http://localhost:3000/api/powerpoint/status | jq .
```

---

### Slide Ingestion & Conversion

#### Convert a PPTX Deck via Server Agent
```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "pptxPath": "/Users/danieltagg/Desktop/presentation.pptx",
    "pathway": "gemini-image-chat"
  }' | jq .
```

#### Ingest via macOS PowerPoint Native Scripting Engine
Extracts native shapes, text, and `p:timing` animation layers directly from Microsoft PowerPoint:
```bash
curl -X POST http://localhost:3000/api/powerpoint/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "pptxPath": "/Users/danieltagg/Desktop/presentation.pptx",
    "deckId": "Custom_Biology_Deck",
    "scale": 2.0,
    "extractAnimations": true
  }' | jq .
```

---

### Generative AI Point-and-Edit Revisions

#### Targeted Slide Revision (Spatial Bounding Box Grounding)
Dispatches a revision request to Gemini image chat restricting changes to the selected region while preserving the rest of the 16:9 canvas:
```bash
curl -X POST http://localhost:3000/api/decks/Lesson_01_CELL_STRUCTURE/slides/3/revise \
  -H "Content-Type: application/json" \
  -d '{
    "promptText": "Highlight the nucleus and enlarge its label text",
    "editTarget": {
      "type": "region",
      "label": "Cell nucleus diagram",
      "bounds": { "x": 15.0, "y": 25.0, "w": 35.0, "h": 40.0 }
    },
    "pathway": "gemini-image-chat",
    "dispatch": true
  }' | jq .
```

#### Full-Slide AI Revision
```bash
curl -X POST http://localhost:3000/api/decks/Lesson_01_CELL_STRUCTURE/slides/1/revise \
  -H "Content-Type: application/json" \
  -d '{
    "promptText": "Modernize the typography to clean sans-serif while keeping the dark blue background",
    "editTarget": { "type": "slide" },
    "pathway": "gemini-image-chat",
    "dispatch": true
  }' | jq .
```

---

### Gemini Still-Image Generation & Progressive Builds

#### Generate a Single Planned Gemini Still-Image Build
Generates the next cumulative stage of an instructional sequence without overwriting existing video assets:
```bash
curl -X POST http://localhost:3000/api/decks/Lesson_01_CELL_STRUCTURE/slides/3/builds/gemini_cell_1/generate \
  -H "Content-Type: application/json" \
  -d '{ "dispatch": true }' | jq .
```

---

### Technical & Visual QA Gating

#### Approve a Generated Slide Image After Visual QA
Images remain private planning assets until explicitly approved against the QA checklist. Once all cells for a slide are approved, they are atomically merged into the active presentation click sequence:
```bash
curl -X POST http://localhost:3000/api/decks/Lesson_01_CELL_STRUCTURE/slides/3/builds/gemini_cell_1/qa \
  -H "Content-Type: application/json" \
  -d '{
    "approved": true,
    "reviewer": "Teacher_Dan",
    "notes": "Clear typography and clean cumulative reveal.",
    "visualChecks": {
      "fullCanvas": true,
      "styleMatch": true,
      "cumulativeContent": true,
      "legible": true,
      "noFocusTreatment": true
    }
  }' | jq .
```

#### Reject a Generated Slide Image
```bash
curl -X POST http://localhost:3000/api/decks/Lesson_01_CELL_STRUCTURE/slides/3/builds/gemini_cell_1/qa \
  -H "Content-Type: application/json" \
  -d '{
    "approved": false,
    "reviewer": "Teacher_Dan",
    "notes": "Text is blurry, please regenerate."
  }' | jq .
```

---

### NotebookLM Slide Revisions

#### Dispatch Revision Prompt to NotebookLM Slide Studio
Connects over CDP to an active `notebooklm.google.com` studio tab:
```bash
curl -X POST http://localhost:3000/api/decks/Lesson_01_CELL_STRUCTURE/slides/3/revise-notebooklm \
  -H "Content-Type: application/json" \
  -d '{
    "revisionPrompt": "Change slide 3: Please only display Step 1 Know text and organelle diagrams."
  }' | jq .
```

---

### Interactive Hotspots & Sequences

#### Persist Custom Interactive Hotspot Coordinates
Updates the answer mask bounding box for click-to-reveal retrieval:
```bash
curl -X POST http://localhost:3000/api/decks/Lesson_01_CELL_STRUCTURE/slides/2/bounds \
  -H "Content-Type: application/json" \
  -d '{
    "cellId": "cell_1",
    "bounds": { "x": 5.2, "y": 34.5, "w": 43.6, "h": 9.0 }
  }' | jq .
```

#### Clear Generated Still-Image Sequence (Preserving Video)
Safely deletes generated still-image builds for a slide without touching protected video assets:
```bash
curl -X POST http://localhost:3000/api/decks/Lesson_01_CELL_STRUCTURE/slides/3/clear-sequence \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
```

#### Revert Slide to Original State
```bash
curl -X POST http://localhost:3000/api/decks/Lesson_01_CELL_STRUCTURE/slides/3/revert \
  -H "Content-Type: application/json" \
  -d '{ "versionId": "original" }' | jq .
```

#### Fetch Manifest for a Specific Deck
```bash
curl -s http://localhost:3000/api/decks/Lesson_01_CELL_STRUCTURE | jq .
```

---

## 6. Testing & Verification Commands

Use these terminal calls to verify pipeline integrity, cognitive models, and slide parity:

```bash
# 1. Run full test suite
npm test

# 2. Run presentation agent integration tests (150 slides, catalog parity, video preservation)
node --test test/presentation-agent.test.js

# 3. Run PowerPoint AppleScript and OpenXML extraction tests
node --test test/powerpoint-agent.test.js

# 4. Run Gemini editor and coordinate normalization tests
node --test test/gemini-editor.test.js

# 5. Run curriculum slide sets tests
node --test test/slide-sets.test.js

# 6. Run frontend player interaction logic tests
node --test test/frontend-player.test.js

# 7. Run static syntax check on all critical modules
npm run check
```

---

## 7. Recommended End-to-End Workflows

### Workflow 1: Convert a New PPTX Deck & Build Interactive Reveals
```bash
# Step 1: Ingest and extract PPTX
npm run convert /path/to/my_presentation.pptx

# Step 2: Extract text and infer slide roles with OCR
npm run analyze:current-slides

# Step 3: Segment interactivity and calculate cognitive load metrics
node src/gemini-segmenter.js --all

# Step 4: Launch presentation viewer
npm start
```

### Workflow 2: Automated Browser Multimodal Generation
```bash
# Step 1: Launch Chrome with debugging port
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9333 \
  --user-data-dir="/tmp/chrome-cdp-agent" &

# Step 2: In your main terminal, start the server
npm start &

# Step 3: In another terminal, run the Gemini browser queue with 2 workers
node scripts/gemini-browser-queue-runner.mjs all 2

# Step 4: Monitor status in terminal
curl -s http://localhost:3000/api/agent/status | jq .
```
