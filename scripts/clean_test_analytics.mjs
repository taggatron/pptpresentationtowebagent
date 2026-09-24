/**
 * Clean up test fixtures and synthetic test decks from data/analytics.db and data/analytics_sessions.json
 * Preserves all genuine user lesson and rehearsal sessions.
 */

import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";

const dataDir = path.resolve(process.cwd(), "data");
const dbPath = path.join(dataDir, "analytics.db");
const jsonPath = path.join(dataDir, "analytics_sessions.json");

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at:", dbPath);
  process.exit(1);
}

// 1. Create backups before any cleanup
const backupDbPath = path.join(dataDir, "analytics_backup_before_cleanup.db");
const backupJsonPath = path.join(dataDir, "analytics_sessions_backup_before_cleanup.json");

fs.copyFileSync(dbPath, backupDbPath);
console.log(`Backed up ${dbPath} -> ${backupDbPath}`);

if (fs.existsSync(jsonPath)) {
  fs.copyFileSync(jsonPath, backupJsonPath);
  console.log(`Backed up ${jsonPath} -> ${backupJsonPath}`);
}

const db = new DatabaseSync(dbPath);

// 2. Identify test sessions
const testSessions = db.prepare(`
  SELECT id, deck_id, total_duration_seconds FROM sessions
  WHERE deck_id LIKE 'test_%'
     OR (deck_id = 'Classic_Lesson_04_Nitrogen_Cycle' AND total_duration_seconds = 120)
     OR (deck_id = 'Classic_Lesson_01_Ecosystems' AND total_duration_seconds IN (0, 45))
`).all();

console.log(`Identified ${testSessions.length} synthetic test sessions to remove.`);

if (testSessions.length > 0) {
  const sessionIds = testSessions.map((s) => s.id);

  // Chunk deletion to avoid SQLite variable limits
  const chunkSize = 200;
  for (let i = 0; i < sessionIds.length; i += chunkSize) {
    const chunk = sessionIds.slice(i, i + chunkSize);
    const placeholders = chunk.map(() => "?").join(",");

    db.prepare(`DELETE FROM phase_summaries WHERE session_id IN (${placeholders})`).run(...chunk);
    db.prepare(`DELETE FROM slide_dwells WHERE session_id IN (${placeholders})`).run(...chunk);
    db.prepare(`DELETE FROM sessions WHERE id IN (${placeholders})`).run(...chunk);
  }

  // Optimize database file
  try {
    db.exec("VACUUM;");
  } catch (err) {
    console.warn("Notice during VACUUM:", err.message);
  }
}

// 3. Inspect remaining genuine sessions
const remainingSessions = db.prepare("SELECT * FROM sessions ORDER BY created_at ASC").all();
const remainingDwells = db.prepare("SELECT * FROM slide_dwells").all();
const remainingPhases = db.prepare("SELECT * FROM phase_summaries").all();

console.log(`\nRemaining genuine sessions: ${remainingSessions.length}`);
console.log(`Remaining slide dwells: ${remainingDwells.length}`);
console.log(`Remaining phase summaries: ${remainingPhases.length}\n`);

for (const s of remainingSessions) {
  console.log(`- [${s.created_at}] ${s.deck_id}: ${s.total_duration_seconds}s (${s.lesson_group || "General"}, ${s.lesson_period || "rehearsal"})`);
}

// 4. Re-export clean JSON backup
const cleanJsonData = {
  exportedAt: new Date().toISOString(),
  sessions: remainingSessions,
  dwells: remainingDwells,
  phaseSummaries: remainingPhases
};

fs.writeFileSync(jsonPath, JSON.stringify(cleanJsonData, null, 2), "utf8");
console.log(`\nUpdated ${jsonPath} with clean state.`);
