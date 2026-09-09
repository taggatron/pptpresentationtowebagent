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

let dbInstance = null;

export function getAnalyticsDb() {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
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
 * Start a new slideshow tracking session
 */
export function startTrackingSession({ sessionId, deckId, deckTitle = "" }) {
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
  insertStmt.run(id, deckId, deckTitle, now, now);

  syncJsonBackup();
  return { id, deckId, deckTitle, startTime: now, isActive: true };
}

/**
 * Record or increment dwell time for a specific slide during an active session
 */
export function recordSlideDwell({ sessionId, slideNumber, slideTitle = "", lessonPhase = "direct_instruction", deltaSeconds = 1 }) {
  const db = getAnalyticsDb();
  const now = new Date().toISOString();
  const sNum = Number(slideNumber) || 1;
  const delta = Number(deltaSeconds) || 0;

  if (delta <= 0) return;

  const upsertStmt = db.prepare(`
    INSERT INTO slide_dwells (session_id, slide_number, slide_title, lesson_phase, duration_seconds, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(session_id, slide_number) DO UPDATE SET
      duration_seconds = duration_seconds + excluded.duration_seconds,
      slide_title = excluded.slide_title,
      lesson_phase = excluded.lesson_phase,
      updated_at = excluded.updated_at
  `);
  upsertStmt.run(sessionId, sNum, slideTitle, lessonPhase, delta, now);

  // Update session total duration
  const updateSessionStmt = db.prepare(`
    UPDATE sessions
    SET total_duration_seconds = total_duration_seconds + ?
    WHERE id = ?
  `);
  updateSessionStmt.run(delta, sessionId);

  syncJsonBackup();
}

/**
 * Finish a tracking session and calculate phase percentages
 */
export function finishTrackingSession({ sessionId, totalDurationSeconds = null }) {
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
    phaseTotals[p] = (phaseTotals[p] || 0) + dur;
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
    totalDurationSeconds: totalDuration,
    phaseTotals
  };
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

  if (!latestSession) {
    return {
      hasData: false,
      deckId,
      session: null,
      slideDwells: [],
      phases: buildDefaultPhaseBreakdown(),
      totalSessions: 0
    };
  }

  // Fetch slide dwells for this session
  const dwellsQuery = db.prepare(`
    SELECT * FROM slide_dwells
    WHERE session_id = ?
    ORDER BY slide_number ASC
  `);
  const dwells = dwellsQuery.all(latestSession.id) || [];

  // Total sessions for this deck
  const countQuery = db.prepare("SELECT COUNT(*) as cnt FROM sessions WHERE deck_id = ?");
  const totalSessions = countQuery.get(deckId)?.cnt || 1;

  // Calculate phase breakdown
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

  const phaseSlideCounts = {
    starter: 0,
    direct_instruction: 0,
    modelling: 0,
    guided_practice: 0,
    independent_practice: 0,
    plenary: 0
  };

  dwells.forEach((row) => {
    const phase = row.lesson_phase || "direct_instruction";
    const dur = Number(row.duration_seconds) || 0;
    phaseSeconds[phase] = (phaseSeconds[phase] || 0) + dur;
    phaseSlideCounts[phase] = (phaseSlideCounts[phase] || 0) + 1;
  });

  const phases = Object.entries(LESSON_PHASE_BENCHMARKS).map(([key, meta]) => {
    const sec = phaseSeconds[key] || 0;
    const actualPercent = totalSeconds > 0 ? Math.round((sec / totalSeconds) * 1000) / 10 : 0;
    const targetPercent = meta.targetPercent;
    const delta = Math.round((actualPercent - targetPercent) * 10) / 10;

    return {
      key,
      label: meta.label,
      shortLabel: meta.shortLabel,
      color: meta.color,
      bgLight: meta.bgLight,
      borderColor: meta.borderColor,
      textColor: meta.textColor,
      targetPercent,
      actualPercent,
      actualSeconds: sec,
      slideCount: phaseSlideCounts[key] || 0,
      delta,
      status: Math.abs(delta) <= 5 ? "on-track" : (delta > 0 ? "extended" : "under")
    };
  });

  return {
    hasData: true,
    deckId,
    session: {
      id: latestSession.id,
      deckId: latestSession.deck_id,
      deckTitle: latestSession.deck_title,
      startTime: latestSession.start_time,
      endTime: latestSession.end_time,
      totalDurationSeconds: totalSeconds,
      isActive: Boolean(latestSession.is_active)
    },
    slideDwells: dwells.map((d) => ({
      slideNumber: d.slide_number,
      slideTitle: d.slide_title,
      lessonPhase: d.lesson_phase,
      durationSeconds: Number(d.duration_seconds) || 0
    })),
    phases,
    totalSessions
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
