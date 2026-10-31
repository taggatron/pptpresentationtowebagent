# Workspace Agent Rules — Gemini Notebook & Slide Deck Automations

## Default Browser for Gemini Notebook / NotebookLM Automations

For **all** Gemini Notebook (`notebook.google.com` / `notebooklm.google.com`) agentic slide deck creation, revision, and download automations:

1. **Always default to the user's already logged-in Microsoft Edge browser** — never launch a separate unauthenticated Google Chrome profile unless the user explicitly asks for Chrome.
2. **Use [`scripts/edge_cdp_helper.mjs`](./scripts/edge_cdp_helper.mjs)** (`connectToLoggedInEdgeSession()`, `evalInLoggedInEdgeTab()`, and `findOrOpenNotebookPage()`) to attach directly to the user's active Microsoft Edge session:
   - **Zero-restart native bridge (Primary for already-open default Edge)**: Uses macOS Apple Events JavaScript execution (`View → Developer → Allow JavaScript from Apple Events` in Microsoft Edge's menu bar) to drive the live logged-in Gemini Notebook tab directly without restarting Edge or re-signing in.
   - **Playwright CDP bridge (Automatic when active)**: Connects via `chromium.connectOverCDP` on `http://127.0.0.1:9334`, `http://127.0.0.1:9222`, or `DevToolsActivePort` whenever Edge is running with remote debugging enabled.
3. **Preserve the user's browser session**: Never kill or quit the user's running Microsoft Edge application.
4. **Slide Deck Ingestion Standard**:
   - Extract `.pptx` slides into `public/decks/<slideSetId>/<deckId>/` via `extractPptxDeck` (`src/pptx-extractor.js`), register any new `slideSetId` in `KNOWN_SLIDE_SETS` and `inferSlideSetId()` in `src/server.js`, and configure Slide 2 6-cell interactive `question_reveal` grids where applicable.
