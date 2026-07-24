# Implementation Plan: PPTX to Interactive Web Presentation Agent

Build an automated agent and interactive web application that transforms whole-slide image-based PowerPoint decks (such as those in `NotebookLMagent/output/powerpoints_cellbio_sequence_v2`) into modern, interactive web presentations. Slide 2 ("Starter Activity: Knowledge Retrieval") and similar Q&A grid slides will feature click-to-reveal interactivity, where answers are initially hidden and appear only when the user clicks on the corresponding question cell.

## User Review Required

> [!IMPORTANT]
> **Gemini Automation & Integration**: The agent leverages the Google Chrome browser profile and Playwright CDP connection established in `NotebookLMagent` (connecting to `https://gemini.google.com/app` or local multimodal vision grid segmentation) to analyze slide layouts and extract question vs answer zones.

> [!TIP]
> **Trial Slide Deck**: We will automatically process and trial `Lesson_01_CELL_STRUCTURE.pptx` from `NotebookLMagent/output/powerpoints_cellbio_sequence_v2/` as the primary test deck.

## Open Questions

None at this time; requirements are clear.

---

## Proposed Changes

### Core Agent & Extractor (`pptpresentationtowebagent`)

#### [NEW] [package.json](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/package.json)
- Define dependencies (`express`, `playwright`, `yauzl` / zip utils) and npm scripts (`npm start`, `npm run convert`, `npm run agent:gemini`).

#### [NEW] [src/pptx-extractor.js](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/src/pptx-extractor.js)
- Utility to inspect `.pptx` archives, extract slide image media (PNGs), extract slide metadata/titles, and organize slide manifests.

#### [NEW] [src/gemini-segmenter.js](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/src/gemini-segmenter.js)
- Automation script using Playwright CDP (`http://127.0.0.1:9333` using `.state/browser-profile` from `NotebookLMagent`) or multimodal grid segmentation to send slide images to Gemini / process grid bounding boxes.
- For Slide 2 (Starter Activity grid): calculates cell bounds for the 6-question grid (3 rows x 2 columns) and generates interactive question-only masks and answer overlay coordinates.

#### [NEW] [src/server.js](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/src/server.js)
- Node.js Express server to serve extracted slide assets, deck manifests, and host the web presentation application locally (e.g. `http://localhost:3000`).

---

### Interactive Web Presentation App (`public/`)

#### [NEW] [public/index.html](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/public/index.html)
- Main interactive presentation viewer UI structure:
  - Header: Deck title, lesson tag, full-screen toggle, sidebar toggle, presenter/student mode toggle.
  - Slide Display Area: High-resolution slide viewport with dynamic SVG/canvas interactive overlays.
  - Sidebar: Thumbnail grid navigation for quick slide jumping.
  - Footer Controls: Slide counter, Prev/Next buttons, Progress bar, Q&A "Reveal All" / "Hide All" action bar for interactive slides.

#### [NEW] [public/css/styles.css](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/public/css/styles.css)
- Premium dark-mode styling with subtle glassmorphic elements, modern typography (Inter/Outfit), smooth slide transitions, interactive hover highlights, and answer reveal flip/slide animation effects.

#### [NEW] [public/js/app.js](file:///Users/danieltagg/Desktop/Desktop%20-%20Daniel%E2%80%99s%20MacBook%20Pro/pptpresentationtowebagent/public/js/app.js)
- Client-side presentation logic:
  - Keyboard navigation (Arrow keys, Space bar, Home, End).
  - Touch swipe / button navigation.
  - Dynamic overlay manager for Q&A slides: renders 6 interactive click hotspots matching the question cells on Slide 2.
  - Click event handlers for question cells: toggles answer visibility per cell with animated mask fading/uncovering.

---

## Verification Plan

### Automated Verification
- Run `npm run check` or test script to verify slide extraction from `Lesson_01_CELL_STRUCTURE.pptx`.
- Verify JSON manifest generation and asset extraction into `public/decks/Lesson_01_CELL_STRUCTURE/`.

### Manual Verification
- Launch the web app (`npm start`) on `http://localhost:3000`.
- Open browser to test presentation navigation across slides 1–15 of `Lesson_01_CELL_STRUCTURE`.
- Navigate to Slide 2 ("Starter Activity: Knowledge Retrieval").
- Verify that expected answers in all 6 grid cells are covered/hidden initially.
- Click each question cell individually and verify that the expected answer smoothly reveals for that specific cell.
- Test "Reveal All" and "Hide All" global buttons.
