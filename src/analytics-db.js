/**
 * Slideshow Timing Analytics Database Persistence
 * 
 * Uses SQLite (via Node's built-in node:sqlite) with JSON replication in data/
 * to store session runs, per-slide dwell times, and aggregated lesson phase metrics.
 */

import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { LESSON_PHASE_BENCHMARKS } from "./lesson-phase-classifier.js";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "analytics.db");
const JSON_BACKUP_FILE = path.join(DATA_DIR, "analytics_sessions.json");
const ARCHIVE_DIR = path.join(DATA_DIR, "analytics_archive");

let dbInstance = null;

export function getAnalyticsDb() {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  }

  dbInstance = new DatabaseSync(DB_FILE);

  // Initialize schema
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      deck_id TEXT NOT NULL,
      deck_title TEXT,
      start_time TEXT NOT NULL,
      end_time TEXT,
      total_duration_seconds REAL DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS slide_dwells (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      slide_number INTEGER NOT NULL,
      slide_title TEXT,
      lesson_phase TEXT NOT NULL,
      duration_seconds REAL DEFAULT 0,
      updated_at TEXT NOT NULL,
      UNIQUE(session_id, slide_number)
    );

    CREATE TABLE IF NOT EXISTS phase_summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      phase_key TEXT NOT NULL,
      total_seconds REAL DEFAULT 0,
      percentage REAL DEFAULT 0,
      UNIQUE(session_id, phase_key)
    );
  `);

  return dbInstance;
}

/**
 * Format duration in milliseconds to m s string
 */
export function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}

/**
 * Start a new slideshow tracking session
 */
export function startTrackingSession(deckIdOrOptions, totalSlides = 0, deckTitle = "") {
  let deckId = deckIdOrOptions;
  let sessionId = null;
  let title = deckTitle;
  if (typeof deckIdOrOptions === "object" && deckIdOrOptions !== null) {
    deckId = deckIdOrOptions.deckId;
    sessionId = deckIdOrOptions.sessionId;
    title = deckIdOrOptions.deckTitle || "";
    totalSlides = deckIdOrOptions.totalSlides || 0;
  }

  const db = getAnalyticsDb();
  const now = new Date().toISOString();
  const id = sessionId || `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // Deactivate any previous active sessions for this deck
  const deactivateStmt = db.prepare("UPDATE sessions SET is_active = 0 WHERE deck_id = ? AND is_active = 1");
  deactivateStmt.run(deckId);

  const insertStmt = db.prepare(`
    INSERT INTO sessions (id, deck_id, deck_title, start_time, total_duration_seconds, is_active, created_at)
    VALUES (?, ?, ?, ?, 0, 1, ?)
  `);
  insertStmt.run(id, deckId, title, now, now);

  syncJsonBackup();
  return { id, deckId, deckTitle: title, startTime: now, isActive: true, status: "recording" };
}

/**
 * Record or increment dwell time for a specific slide during an active session
 */
export function recordSlideDwell(
  sessionIdOrOptions,
  deckId = null,
  slideIndex = 0,
  slideNumber = 1,
  dwellMs = 0,
  phaseKey = "direct_instruction"
) {
  let sessionId = sessionIdOrOptions;
  let sNum = slideNumber;
  let slideTitle = "";
  let lessonPhase = phaseKey;
  let deltaSec = dwellMs ? dwellMs / 1000 : 1;

  if (typeof sessionIdOrOptions === "object" && sessionIdOrOptions !== null) {
    sessionId = sessionIdOrOptions.sessionId;
    sNum = sessionIdOrOptions.slideNumber || (sessionIdOrOptions.slideIndex !== undefined ? sessionIdOrOptions.slideIndex + 1 : 1);
    slideTitle = sessionIdOrOptions.slideTitle || "";
    lessonPhase = sessionIdOrOptions.lessonPhase || sessionIdOrOptions.phaseKey || "direct_instruction";
    deltaSec = sessionIdOrOptions.deltaSeconds ?? (sessionIdOrOptions.dwellMs ? sessionIdOrOptions.dwellMs / 1000 : 1);
  }

  const db = getAnalyticsDb();
  const now = new Date().toISOString();

  const upsertStmt = db.prepare(`
    INSERT INTO slide_dwells (session_id, slide_number, slide_title, lesson_phase, duration_seconds, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(session_id, slide_number) DO UPDATE SET
      duration_seconds = MAX(duration_seconds, excluded.duration_seconds),
      slide_title = CASE WHEN excluded.slide_title != '' THEN excluded.slide_title ELSE slide_title END,
      lesson_phase = excluded.lesson_phase,
      updated_at = excluded.updated_at
  `);
  upsertStmt.run(sessionId, sNum, slideTitle, lessonPhase, deltaSec, now);

  // Update session total duration
  const sumQuery = db.prepare("SELECT SUM(duration_seconds) as total FROM slide_dwells WHERE session_id = ?");
  const total = sumQuery.get(sessionId)?.total || deltaSec;

  const updateSessionStmt = db.prepare(`
    UPDATE sessions
    SET total_duration_seconds = ?
    WHERE id = ?
  `);
  updateSessionStmt.run(total, sessionId);

  syncJsonBackup();
  return {
    sessionId,
    slideNumber: sNum,
    dwellMs: Math.round(deltaSec * 1000),
    visitCount: 1,
    lessonPhase
  };
}

/**
 * Finish a tracking session and calculate phase percentages
 */
export function finishTrackingSession(sessionIdOrOptions, deckId = null) {
  let sessionId = sessionIdOrOptions;
  let totalDurationSeconds = null;
  if (typeof sessionIdOrOptions === "object" && sessionIdOrOptions !== null) {
    sessionId = sessionIdOrOptions.sessionId;
    totalDurationSeconds = sessionIdOrOptions.totalDurationSeconds;
  }

  const db = getAnalyticsDb();
  const now = new Date().toISOString();

  // Get all slide dwells for this session
  const dwellsQuery = db.prepare("SELECT * FROM slide_dwells WHERE session_id = ?");
  const dwells = dwellsQuery.all(sessionId) || [];

  let totalDuration = 0;
  const phaseTotals = {
    starter: 0,
    direct_instruction: 0,
    modelling: 0,
    guided_practice: 0,
    independent_practice: 0,
    plenary: 0
  };

  dwells.forEach((row) => {
    const dur = Number(row.duration_seconds) || 0;
    totalDuration += dur;
    const p = row.lesson_phase || "direct_instruction";
    if (phaseTotals[p] !== undefined) {
      phaseTotals[p] += dur;
    }
  });

  if (totalDurationSeconds && Number(totalDurationSeconds) > totalDuration) {
    totalDuration = Number(totalDurationSeconds);
  }

  // Update session
  const updateStmt = db.prepare(`
    UPDATE sessions
    SET end_time = ?, total_duration_seconds = ?, is_active = 0
    WHERE id = ?
  `);
  updateStmt.run(now, totalDuration, sessionId);

  // Record phase summaries
  const insertPhaseStmt = db.prepare(`
    INSERT INTO phase_summaries (session_id, phase_key, total_seconds, percentage)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(session_id, phase_key) DO UPDATE SET
      total_seconds = excluded.total_seconds,
      percentage = excluded.percentage
  `);

  Object.entries(phaseTotals).forEach(([key, seconds]) => {
    const pct = totalDuration > 0 ? (seconds / totalDuration) * 100 : 0;
    insertPhaseStmt.run(sessionId, key, seconds, Math.round(pct * 10) / 10);
  });

  syncJsonBackup();

  return {
    sessionId,
    endTime: now,
    durationMs: Math.round(totalDuration * 1000),
    totalDurationSeconds: totalDuration,
    status: "completed",
    phaseTotals
  };
}

export function getAllSessions(deckId = null) {
  const db = getAnalyticsDb();
  if (deckId) {
    return db.prepare("SELECT * FROM sessions WHERE deck_id = ? ORDER BY created_at DESC").all(deckId);
  }
  return db.prepare("SELECT * FROM sessions ORDER BY created_at DESC").all();
}

/**
 * Retrieve comprehensive analytics for a deck:
 * - Active or latest session
 * - Aggregated dwell times per slide
 * - Phase breakdown with actual vs recommended benchmarks
 * - Historical session count and averages
 */
export function getDeckAnalytics(deckId) {
  const db = getAnalyticsDb();

  // Find most recent session (active or latest finished)
  const sessionQuery = db.prepare(`
    SELECT * FROM sessions
    WHERE deck_id = ?
    ORDER BY is_active DESC, created_at DESC
    LIMIT 1
  `);
  const latestSession = sessionQuery.get(deckId);

  // Total sessions for this deck
  const countQuery = db.prepare("SELECT COUNT(*) as cnt FROM sessions WHERE deck_id = ?");
  const totalSessions = countQuery.get(deckId)?.cnt || 0;

  const allSessionsQuery = db.prepare("SELECT * FROM sessions WHERE deck_id = ? ORDER BY created_at DESC LIMIT 20");
  const allSessions = allSessionsQuery.all(deckId) || [];

  if (!latestSession) {
    return {
      hasData: false,
      deckId,
      session: null,
      latestSession: null,
      sessions: [],
      slides: [],
      slideDwells: [],
      phaseBreakdown: buildDefaultPhaseBreakdown(),
      phases: buildDefaultPhaseBreakdown(),
      totalSessions: 0,
      totalDurationMs: 0
    };
  }

  // Fetch slide dwells for this session
  const dwellsQuery = db.prepare(`
    SELECT * FROM slide_dwells
    WHERE session_id = ?
    ORDER BY slide_number ASC
  `);
  const dwells = dwellsQuery.all(latestSession.id) || [];

  let totalSeconds = Number(latestSession.total_duration_seconds) || 0;
  if (totalSeconds === 0) {
    totalSeconds = dwells.reduce((sum, d) => sum + (Number(d.duration_seconds) || 0), 0);
  }

  const phaseSeconds = {
    starter: 0,
    direct_instruction: 0,
    modelling: 0,
    guided_practice: 0,
    independent_practice: 0,
    plenary: 0
  };

  dwells.forEach((row) => {
    const p = row.lesson_phase || "direct_instruction";
    if (phaseSeconds[p] !== undefined) {
      phaseSeconds[p] += Number(row.duration_seconds) || 0;
    }
  });

  const phaseBreakdown = Object.entries(LESSON_PHASE_BENCHMARKS).map(([key, meta]) => {
    const secs = phaseSeconds[key] || 0;
    const dwellMs = Math.round(secs * 1000);
    const actualPercent = totalSeconds > 0 ? Math.round((secs / totalSeconds) * 1000) / 10 : 0;
    return {
      phaseKey: key,
      key,
      label: meta.label,
      shortLabel: meta.shortLabel,
      color: meta.color,
      totalDwellMs: dwellMs,
      formattedDwell: formatDuration(dwellMs),
      actualPercent,
      targetPercent: meta.targetPercent,
      targetPercentage: meta.targetPercent
    };
  });

  const slideMetrics = dwells.map((d) => {
    const durSec = Number(d.duration_seconds) || 0;
    const durMs = Math.round(durSec * 1000);
    return {
      slideNumber: d.slide_number,
      slideTitle: d.slide_title,
      lessonPhase: d.lesson_phase,
      totalDwellMs: durMs,
      durationSeconds: durSec,
      formattedDwell: formatDuration(durMs),
      visitCount: 1
    };
  });

  return {
    hasData: true,
    deckId,
    totalSessions,
    totalDurationMs: Math.round(totalSeconds * 1000),
    latestSession,
    session: latestSession,
    sessions: allSessions,
    slides: slideMetrics,
    slideDwells: slideMetrics,
    phaseBreakdown,
    phases: phaseBreakdown
  };
}

/**
 * Returns default empty phase breakdown with benchmark targets
 */
function buildDefaultPhaseBreakdown() {
  return Object.entries(LESSON_PHASE_BENCHMARKS).map(([key, meta]) => ({
    key,
    label: meta.label,
    shortLabel: meta.shortLabel,
    color: meta.color,
    bgLight: meta.bgLight,
    borderColor: meta.borderColor,
    textColor: meta.textColor,
    targetPercent: meta.targetPercent,
    actualPercent: 0,
    actualSeconds: 0,
    slideCount: 0,
    delta: -meta.targetPercent,
    status: "not-started"
  }));
}

/**
 * Sync entire database to JSON backup file for rapid inspection & export
 */
function syncJsonBackup() {
  try {
    const db = getAnalyticsDb();
    const sessions = db.prepare("SELECT * FROM sessions ORDER BY created_at DESC LIMIT 50").all();
    const dwells = db.prepare("SELECT * FROM slide_dwells").all();
    const phaseSummaries = db.prepare("SELECT * FROM phase_summaries").all();

    const data = {
      exportedAt: new Date().toISOString(),
      sessions,
      dwells,
      phaseSummaries
    };

    fs.writeFileSync(JSON_BACKUP_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // Non-fatal backup sync
    console.warn("[Analytics DB] JSON backup sync skipped:", err.message);
  }
}

/**
 * Archive all session data for a deck to a timestamped JSON file and wipe active records for that deck
 */
export function archiveAndResetDeckAnalytics(deckId) {
  const db = getAnalyticsDb();
  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  }

  // 1. Gather all data for this deck
  const sessions = db.prepare("SELECT * FROM sessions WHERE deck_id = ? ORDER BY created_at DESC").all(deckId);
  const sessionIds = sessions.map((s) => s.id);

  let dwells = [];
  let phaseSummaries = [];
  if (sessionIds.length > 0) {
    const placeholders = sessionIds.map(() => "?").join(",");
    dwells = db.prepare(`SELECT * FROM slide_dwells WHERE session_id IN (${placeholders})`).all(...sessionIds);
    phaseSummaries = db.prepare(`SELECT * FROM phase_summaries WHERE session_id IN (${placeholders})`).all(...sessionIds);
  }

  // 2. Save archive file if there is data
  let archiveFilename = null;
  let archiveFilePath = null;
  if (sessions.length > 0) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    archiveFilename = `archive_${deckId}_${timestamp}.json`;
    archiveFilePath = path.join(ARCHIVE_DIR, archiveFilename);

    const archivePayload = {
      archiveType: "deck_reset",
      deckId,
      archivedAt: new Date().toISOString(),
      sessionsCount: sessions.length,
      sessions,
      dwells,
      phaseSummaries
    };

    fs.writeFileSync(archiveFilePath, JSON.stringify(archivePayload, null, 2), "utf8");
  }

  // 3. Clear database records for this deck
  if (sessionIds.length > 0) {
    const placeholders = sessionIds.map(() => "?").join(",");
    db.prepare(`DELETE FROM phase_summaries WHERE session_id IN (${placeholders})`).run(...sessionIds);
    db.prepare(`DELETE FROM slide_dwells WHERE session_id IN (${placeholders})`).run(...sessionIds);
    db.prepare("DELETE FROM sessions WHERE deck_id = ?").run(deckId);
  }

  syncJsonBackup();

  return {
    success: true,
    deckId,
    archivedSessionsCount: sessions.length,
    archiveFilename,
    archiveFilePath
  };
}

/**
 * Delete only the most recent tracking session for a specific slide set
 */
export function deleteLatestSession(deckId) {
  const db = getAnalyticsDb();

  // Find latest session for this deck
  const latest = db.prepare(`
    SELECT * FROM sessions
    WHERE deck_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `).get(deckId);

  if (!latest) {
    return {
      success: false,
      message: "No session found for this deck",
      deckId
    };
  }

  // Delete dwells and phase summaries for this session
  db.prepare("DELETE FROM phase_summaries WHERE session_id = ?").run(latest.id);
  db.prepare("DELETE FROM slide_dwells WHERE session_id = ?").run(latest.id);
  db.prepare("DELETE FROM sessions WHERE id = ?").run(latest.id);

  syncJsonBackup();

  // Check remaining count
  const remainingCount = db.prepare("SELECT COUNT(*) as cnt FROM sessions WHERE deck_id = ?").get(deckId)?.cnt || 0;

  return {
    success: true,
    deletedSessionId: latest.id,
    deckId,
    remainingSessionsCount: remainingCount
  };
}

/**
 * Calculate aggregated average analytics across ALL recorded slide decks
 */
export function getAllDecksAverageAnalytics() {
  const db = getAnalyticsDb();

  const sessions = db.prepare("SELECT * FROM sessions ORDER BY created_at DESC").all();
  if (!sessions || sessions.length === 0) {
    return {
      hasData: false,
      isAllDecks: true,
      totalSessions: 0,
      deckCount: 0,
      totalDurationMs: 0,
      avgPacePerSlideSeconds: 0,
      phaseBreakdown: buildDefaultPhaseBreakdown(),
      phases: buildDefaultPhaseBreakdown()
    };
  }

  const distinctDecks = new Set(sessions.map((s) => s.deck_id));
  let grandTotalSeconds = 0;
  sessions.forEach((s) => {
    grandTotalSeconds += Number(s.total_duration_seconds) || 0;
  });

  // Aggregate phase totals from all slide dwells
  const allDwells = db.prepare("SELECT * FROM slide_dwells").all();
  const phaseSeconds = {
    starter: 0,
    direct_instruction: 0,
    modelling: 0,
    guided_practice: 0,
    independent_practice: 0,
    plenary: 0
  };

  let totalDwellTimeRecorded = 0;
  allDwells.forEach((d) => {
    const sec = Number(d.duration_seconds) || 0;
    totalDwellTimeRecorded += sec;
    const p = d.lesson_phase || "direct_instruction";
    if (phaseSeconds[p] !== undefined) {
      phaseSeconds[p] += sec;
    }
  });

  const effectiveTotalSeconds = grandTotalSeconds > 0 ? grandTotalSeconds : totalDwellTimeRecorded;

  const phaseBreakdown = Object.entries(LESSON_PHASE_BENCHMARKS).map(([key, meta]) => {
    const secs = phaseSeconds[key] || 0;
    const dwellMs = Math.round(secs * 1000);
    const actualPercent = effectiveTotalSeconds > 0 ? Math.round((secs / effectiveTotalSeconds) * 1000) / 10 : 0;
    return {
      phaseKey: key,
      key,
      label: meta.label,
      shortLabel: meta.shortLabel,
      color: meta.color,
      bgLight: meta.bgLight,
      borderColor: meta.borderColor,
      textColor: meta.textColor,
      totalDwellMs: dwellMs,
      actualSeconds: Math.round(secs),
      formattedDwell: formatDuration(dwellMs),
      actualPercent,
      actualPercentage: actualPercent,
      targetPercent: meta.targetPercent,
      targetPercentage: meta.targetPercent,
      delta: Math.round((actualPercent - meta.targetPercent) * 10) / 10
    };
  });

  // Calculate average pace across all slide dwells
  const avgPaceSec = allDwells.length > 0 ? Math.round(totalDwellTimeRecorded / allDwells.length) : 0;

  return {
    hasData: true,
    isAllDecks: true,
    totalSessions: sessions.length,
    deckCount: distinctDecks.size,
    totalDurationMs: Math.round(effectiveTotalSeconds * 1000),
    avgPacePerSlideSeconds: avgPaceSec,
    totalSlidesTracked: allDwells.length,
    phaseBreakdown,
    phases: phaseBreakdown
  };
}

/**
 * Export analytics dataset for a specific deck or all slide sets
 */
export function exportAnalyticsData(deckId = null) {
  const db = getAnalyticsDb();

  if (deckId && deckId !== "all") {
    const deckAnalytics = getDeckAnalytics(deckId);
    const sessions = db.prepare("SELECT * FROM sessions WHERE deck_id = ? ORDER BY created_at DESC").all(deckId);
    const sessionIds = sessions.map((s) => s.id);
    let dwells = [];
    let phaseSummaries = [];
    if (sessionIds.length > 0) {
      const placeholders = sessionIds.map(() => "?").join(",");
      dwells = db.prepare(`SELECT * FROM slide_dwells WHERE session_id IN (${placeholders})`).all(...sessionIds);
      phaseSummaries = db.prepare(`SELECT * FROM phase_summaries WHERE session_id IN (${placeholders})`).all(...sessionIds);
    }

    return {
      exportType: "single_deck",
      exportedAt: new Date().toISOString(),
      deckId,
      benchmarks: LESSON_PHASE_BENCHMARKS,
      analyticsSummary: deckAnalytics,
      sessions,
      slideDwells: dwells,
      phaseSummaries
    };
  }

  // All decks export
  const allSessions = db.prepare("SELECT * FROM sessions ORDER BY created_at DESC").all();
  const allDwells = db.prepare("SELECT * FROM slide_dwells").all();
  const allPhaseSummaries = db.prepare("SELECT * FROM phase_summaries").all();
  const allDecksAverage = getAllDecksAverageAnalytics();

  // Group stats by deck
  const decksMap = {};
  allSessions.forEach((s) => {
    if (!decksMap[s.deck_id]) {
      decksMap[s.deck_id] = {
        deckId: s.deck_id,
        sessionCount: 0,
        totalDurationSeconds: 0
      };
    }
    decksMap[s.deck_id].sessionCount += 1;
    decksMap[s.deck_id].totalDurationSeconds += Number(s.total_duration_seconds) || 0;
  });

  return {
    exportType: "all_decks",
    exportedAt: new Date().toISOString(),
    benchmarks: LESSON_PHASE_BENCHMARKS,
    globalAverage: allDecksAverage,
    allDecksAverage,
    decksSummary: Object.values(decksMap),
    sessions: allSessions,
    slideDwells: allDwells,
    phaseSummaries: allPhaseSummaries
  };
}

/**
 * Export slide dwell logs as CSV formatted string
 */
export function exportAnalyticsCsv(deckId = null) {
  const db = getAnalyticsDb();
  let dwells = [];
  if (deckId && deckId !== "all") {
    dwells = db.prepare(`
      SELECT s.deck_id, d.session_id, d.slide_number, d.slide_title, d.lesson_phase, d.duration_seconds, s.created_at
      FROM slide_dwells d
      JOIN sessions s ON s.id = d.session_id
      WHERE s.deck_id = ?
      ORDER BY s.created_at DESC, d.slide_number ASC
    `).all(deckId);
  } else {
    dwells = db.prepare(`
      SELECT s.deck_id, d.session_id, d.slide_number, d.slide_title, d.lesson_phase, d.duration_seconds, s.created_at
      FROM slide_dwells d
      JOIN sessions s ON s.id = d.session_id
      ORDER BY s.deck_id ASC, s.created_at DESC, d.slide_number ASC
    `).all();
  }

  const rows = [
    ["Deck ID", "Session ID", "Slide Number", "Slide Title", "Lesson Phase", "Duration (Seconds)", "Session Date"]
  ];

  dwells.forEach((d) => {
    rows.push([
      `"${(d.deck_id || "").replace(/"/g, '""')}"`,
      `"${(d.session_id || "").replace(/"/g, '""')}"`,
      d.slide_number,
      `"${(d.slide_title || `Slide ${d.slide_number}`).replace(/"/g, '""')}"`,
      `"${(d.lesson_phase || "").replace(/"/g, '""')}"`,
      Math.round(Number(d.duration_seconds) || 0),
      `"${d.created_at || ""}"`
    ]);
  });

  return rows.map((r) => r.join(",")).join("\n");
}
