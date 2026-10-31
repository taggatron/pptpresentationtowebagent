import { chromium } from "playwright";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const DEFAULT_EDGE_PORT = 9334;
export const FALLBACK_EDGE_PORT = 9222;
export const EDGE_DEVTOOLS_ACTIVE_PORT_FILE = path.join(
  os.homedir(),
  "Library",
  "Application Support",
  "Microsoft Edge",
  "DevToolsActivePort"
);

function log(msg) {
  console.log(`[${new Date().toISOString()}] [EdgeBridge] ${msg}`);
}

async function isHttpCdpAlive(port) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/version`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function readEdgeDevToolsActivePort() {
  try {
    const raw = await fs.readFile(EDGE_DEVTOOLS_ACTIVE_PORT_FILE, "utf8");
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const port = Number.parseInt(lines[0] || "", 10);
    if (!Number.isFinite(port) || port <= 0) return null;
    const wsPath = lines[1] || "/devtools/browser";
    return {
      port,
      wsPath,
      wsEndpoint: `ws://127.0.0.1:${port}${wsPath.startsWith("/") ? wsPath : `/${wsPath}`}`
    };
  } catch {
    return null;
  }
}

/**
 * Executes a synchronous JavaScript expression inside the target Gemini Notebook tab
 * in the user's already-open, logged-in Microsoft Edge browser via macOS Apple Events.
 * Uses Base64 encoding so arbitrary multiline strings, quotes, and chemistry symbols pass cleanly.
 */
export async function evalInLoggedInEdgeTab(targetNotebookUrl, jsSource) {
  const uuidMatch = targetNotebookUrl.match(/\/notebook\/([a-f0-9-]+)/i);
  const urlMatchToken = uuidMatch ? uuidMatch[1] : "notebook.google.com";
  const b64 = Buffer.from(jsSource, "utf8").toString("base64");

  const appleScript = `
tell application "Microsoft Edge"
  set targetTab to missing value
  set targetWin to missing value
  repeat with w in windows
    repeat with t in tabs of w
      if URL of t contains "${urlMatchToken}" then
        set targetTab to t
        set targetWin to w
        exit repeat
      end if
    end repeat
    if targetTab is not missing value then exit repeat
  end repeat

  if targetTab is missing value then
    if (count of windows) = 0 then
      set targetWin to make new window
    else
      set targetWin to front window
    end if
    set targetTab to make new tab at end of tabs of targetWin with properties {URL:"${targetNotebookUrl}"}
    delay 3
  end if

  set res to execute targetTab javascript "eval(new TextDecoder().decode(Uint8Array.from(atob('${b64}'), function(c){return c.charCodeAt(0)})))"
  return res
end tell
`;

  const { stdout } = await execFileAsync("osascript", ["-e", appleScript], {
    maxBuffer: 10 * 1024 * 1024
  });
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

/**
 * Checks whether Microsoft Edge's "View > Developer > Allow JavaScript from Apple Events"
 * is enabled on the user's running Microsoft Edge session.
 */
export async function checkEdgeAppleEventsJsEnabled(targetNotebookUrl) {
  try {
    const res = await evalInLoggedInEdgeTab(
      targetNotebookUrl,
      `JSON.stringify({ ok: true, url: location.href, title: document.title })`
    );
    return Boolean(res && res.ok);
  } catch (err) {
    const msg = String(err.stderr || err.message || "");
    if (msg.includes("Allow JavaScript from Apple Events")) {
      return false;
    }
    return false;
  }
}

/**
 * Connects to the user's already logged-in Microsoft Edge browser, returning either:
 * - `{ mode: "cdp", browser }` when an Edge CDP port (9334 / 9222 / DevToolsActivePort) is open, OR
 * - `{ mode: "apple-events", targetNotebookUrl }` when `View > Developer > Allow JavaScript from Apple Events`
 *   is enabled on the user's open Microsoft Edge window (zero restart, zero re-login!).
 */
export async function connectToLoggedInEdgeSession(targetNotebookUrl, options = {}) {
  const { waitForEnable = true, waitTimeoutMs = 20 * 60 * 1000 } = options;

  const tryOnce = async () => {
    // 1. Check CDP ports first (9334, 9222, DevToolsActivePort)
    if (process.env.EDGE_CDP_URL) {
      const browser = await chromium.connectOverCDP(process.env.EDGE_CDP_URL, { timeout: 15000 });
      return { mode: "cdp", browser };
    }
    const activePort = await readEdgeDevToolsActivePort();
    if (activePort) {
      try {
        const browser = await chromium.connectOverCDP("msedge", { timeout: 15000 });
        return { mode: "cdp", browser };
      } catch {
        const browser = await chromium.connectOverCDP(activePort.wsEndpoint, { timeout: 15000 }).catch(() => null);
        if (browser) return { mode: "cdp", browser };
      }
    }
    for (const port of [DEFAULT_EDGE_PORT, FALLBACK_EDGE_PORT]) {
      if (await isHttpCdpAlive(port)) {
        const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`, { timeout: 15000 });
        return { mode: "cdp", browser };
      }
    }

    // 2. Check native macOS Microsoft Edge Apple Events JS bridge (already-open logged-in Edge!)
    if (await checkEdgeAppleEventsJsEnabled(targetNotebookUrl)) {
      return { mode: "apple-events", targetNotebookUrl };
    }

    return null;
  };

  let session = await tryOnce();
  if (session) {
    log(`Connected to logged-in Microsoft Edge via mode="${session.mode}"!`);
    return session;
  }

  if (!waitForEnable) {
    throw new Error(
      "Microsoft Edge automation permission not enabled. In Microsoft Edge's top menu bar, click: View > Developer > Allow JavaScript from Apple Events."
    );
  }

  // Bring Microsoft Edge to front on the Gemini Notebook tab so the menu bar is right there
  await execFileAsync("osascript", [
    "-e",
    `tell application "Microsoft Edge" to activate`
  ]).catch(() => { });

  log("Waiting for one-time Microsoft Edge menu bar toggle:");
  log("  In Microsoft Edge's macOS menu bar at the top of your screen, click:");
  log("  View  ->  Developer  ->  Allow JavaScript from Apple Events");

  const deadline = Date.now() + waitTimeoutMs;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    session = await tryOnce();
    if (session) {
      log(`✓ Connected to logged-in Microsoft Edge via mode="${session.mode}"!`);
      return session;
    }
  }

  throw new Error("Timed out waiting for 'View > Developer > Allow JavaScript from Apple Events' in Microsoft Edge.");
}

export async function connectToLoggedInEdge(options = {}) {
  const session = await connectToLoggedInEdgeSession("https://notebook.google.com", options);
  if (session.mode === "cdp") return session.browser;
  throw new Error("CDP port not active; use connectToLoggedInEdgeSession() to support Apple Events mode.");
}

export async function findOrOpenNotebookPage(browser, targetNotebookUrl) {
  const uuidMatch = targetNotebookUrl.match(/\/notebook\/([a-f0-9-]+)/i);
  const notebookId = uuidMatch ? uuidMatch[1] : targetNotebookUrl;

  for (const ctx of browser.contexts()) {
    for (const p of ctx.pages()) {
      if (p.url().includes(notebookId)) {
        await p.bringToFront().catch(() => { });
        return { context: ctx, page: p };
      }
    }
  }

  const primaryCtx = browser.contexts()[0];
  if (!primaryCtx) throw new Error("Connected to Microsoft Edge, but no browser context was exposed.");
  const page = await primaryCtx.newPage();
  await page.goto(targetNotebookUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  return { context: primaryCtx, page };
}
