/**
 * Cloud Firestore Analytics Data Persistence
 * Synchronizes slideshow sessions, dwells, and phase timings to Firebase Firestore
 */

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { app, isUserAuthorized, getCurrentAuthUser } from "./firebase-auth.js";

export const db = getFirestore(app);

export const LESSON_PHASE_BENCHMARKS = {
  starter: { key: "starter", label: "Starter / Knowledge Retrieval", shortLabel: "Starter", color: "#f59e0b", targetPercent: 15 },
  direct_instruction: { key: "direct_instruction", label: "Direct Instruction / Exposition", shortLabel: "Instruction", color: "#3b82f6", targetPercent: 25 },
  modelling: { key: "modelling", label: "Teacher Modelling / I Do", shortLabel: "Modelling", color: "#8b5cf6", targetPercent: 15 },
  guided_practice: { key: "guided_practice", label: "Guided Practice / We Do", shortLabel: "Guided", color: "#10b981", targetPercent: 15 },
  independent_practice: { key: "independent_practice", label: "Independent Practice / You Do", shortLabel: "Practice", color: "#ec4899", targetPercent: 20 },
  plenary: { key: "plenary", label: "Plenary / Review", shortLabel: "Plenary", color: "#06b6d4", targetPercent: 10 }
};

export function formatDurationMs(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}

/**
 * Save new session record to Firestore
 */
export async function saveFirestoreSession(sessionData) {
  if (!isUserAuthorized()) return null;
  const user = getCurrentAuthUser();

  try {
    const sessionRef = doc(db, "analytics_sessions", sessionData.id);
    const payload = {
      id: sessionData.id,
      deckId: sessionData.deckId,
      deckTitle: sessionData.deckTitle || sessionData.deckId,
      startTime: sessionData.startTime || new Date().toISOString(),
      endTime: null,
      totalDurationSeconds: sessionData.totalDurationSeconds || 0,
      isActive: 1,
      lessonId: sessionData.lessonId || null,
      lessonGroup: sessionData.lessonGroup || null,
      lessonPeriod: sessionData.lessonPeriod || null,
      lessonTopic: sessionData.lessonTopic || null,
      weekId: sessionData.weekId || null,
      userEmail: user?.email || "danielptagg@googlemail.com",
      createdAt: new Date().toISOString()
    };
    await setDoc(sessionRef, payload, { merge: true });
    return payload;
  } catch (err) {
    console.warn("[Firestore] Failed to save session:", err.message);
    return null;
  }
}

/**
 * Record or update slide dwell in Firestore
 */
export async function recordFirestoreSlideDwell(dwellData) {
  if (!isUserAuthorized()) return null;
  const user = getCurrentAuthUser();

  try {
    const dwellId = `${dwellData.sessionId}_slide_${dwellData.slideNumber}`;
    const dwellRef = doc(db, "analytics_slide_dwells", dwellId);
    const payload = {
      id: dwellId,
      sessionId: dwellData.sessionId,
      deckId: dwellData.deckId || null,
      slideNumber: dwellData.slideNumber,
      slideTitle: dwellData.slideTitle || `Slide ${dwellData.slideNumber}`,
      lessonPhase: dwellData.lessonPhase || "direct_instruction",
      durationSeconds: dwellData.durationSeconds || (dwellData.dwellMs ? dwellData.dwellMs / 1000 : 0),
      userEmail: user?.email || "danielptagg@googlemail.com",
      updatedAt: new Date().toISOString()
    };
    await setDoc(dwellRef, payload, { merge: true });

    // Also update session duration
    if (dwellData.totalSessionSeconds) {
      const sessionRef = doc(db, "analytics_sessions", dwellData.sessionId);
      await updateDoc(sessionRef, {
        totalDurationSeconds: dwellData.totalSessionSeconds,
        updatedAt: new Date().toISOString()
      }).catch(() => {});
    }

    return payload;
  } catch (err) {
    console.warn("[Firestore] Failed to record slide dwell:", err.message);
    return null;
  }
}

/**
 * Finish session in Firestore and calculate phase totals
 */
export async function finishFirestoreSession(sessionId, totalDurationSeconds, phaseTotals = {}) {
  if (!isUserAuthorized()) return null;

  try {
    const sessionRef = doc(db, "analytics_sessions", sessionId);
    const now = new Date().toISOString();
    await updateDoc(sessionRef, {
      endTime: now,
      totalDurationSeconds: totalDurationSeconds || 0,
      isActive: 0,
      updatedAt: now
    });

    // Write phase summaries
    const batchPromises = Object.entries(phaseTotals).map(async ([phaseKey, seconds]) => {
      const summaryId = `${sessionId}_${phaseKey}`;
      const summaryRef = doc(db, "analytics_phase_summaries", summaryId);
      const pct = totalDurationSeconds > 0 ? (seconds / totalDurationSeconds) * 100 : 0;
      return setDoc(summaryRef, {
        id: summaryId,
        sessionId,
        phaseKey,
        totalSeconds: seconds,
        percentage: Math.round(pct * 10) / 10,
        updatedAt: now
      }, { merge: true });
    });

    await Promise.all(batchPromises);
    return { success: true, sessionId };
  } catch (err) {
    console.warn("[Firestore] Failed to finish session:", err.message);
    return null;
  }
}

/**
 * Fetch deck analytics directly from Firestore
 */
export async function getFirestoreDeckAnalytics(deckId) {
  if (!isUserAuthorized()) return null;

  try {
    const sessionsCol = collection(db, "analytics_sessions");
    const q = query(
      sessionsCol,
      where("deckId", "==", deckId),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }

    const sessions = [];
    snapshot.forEach((d) => sessions.push(d.data()));
    const latestSession = sessions[0];

    // Fetch dwells for latest session
    const dwellsCol = collection(db, "analytics_slide_dwells");
    const dwellsQuery = query(dwellsCol, where("sessionId", "==", latestSession.id));
    const dwellsSnapshot = await getDocs(dwellsQuery);

    const dwells = [];
    dwellsSnapshot.forEach((d) => dwells.push(d.data()));
    dwells.sort((a, b) => a.slideNumber - b.slideNumber);

    let totalSeconds = Number(latestSession.totalDurationSeconds) || 0;
    if (totalSeconds === 0) {
      totalSeconds = dwells.reduce((sum, d) => sum + (Number(d.durationSeconds) || 0), 0);
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
      const p = row.lessonPhase || "direct_instruction";
      if (phaseSeconds[p] !== undefined) {
        phaseSeconds[p] += Number(row.durationSeconds) || 0;
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
        actualSeconds: Math.round(secs),
        formattedDwell: formatDurationMs(dwellMs),
        actualPercent,
        actualPercentage: actualPercent,
        targetPercent: meta.targetPercent,
        targetPercentage: meta.targetPercent,
        delta: Math.round((actualPercent - meta.targetPercent) * 10) / 10
      };
    });

    const slideMetrics = dwells.map((d) => {
      const durSec = Number(d.durationSeconds) || 0;
      const durMs = Math.round(durSec * 1000);
      return {
        slideNumber: d.slideNumber,
        slideTitle: d.slideTitle,
        lessonPhase: d.lessonPhase,
        totalDwellMs: durMs,
        durationSeconds: durSec,
        formattedDwell: formatDurationMs(durMs),
        visitCount: 1
      };
    });

    return {
      hasData: true,
      deckId,
      totalSessions: sessions.length,
      totalDurationMs: Math.round(totalSeconds * 1000),
      latestSession,
      session: latestSession,
      sessions,
      slides: slideMetrics,
      slideDwells: slideMetrics,
      phaseBreakdown,
      phases: phaseBreakdown,
      benchmarks: LESSON_PHASE_BENCHMARKS
    };
  } catch (err) {
    console.warn("[Firestore] Error loading deck analytics:", err.message);
    return null;
  }
}

/**
 * Fetch cross-deck averages from Firestore
 */
export async function getFirestoreAllDecksAverage() {
  if (!isUserAuthorized()) return null;

  try {
    const sessionsCol = collection(db, "analytics_sessions");
    const snapshot = await getDocs(query(sessionsCol, limit(100)));
    if (snapshot.empty) return null;

    const sessions = [];
    snapshot.forEach((d) => sessions.push(d.data()));

    const dwellsCol = collection(db, "analytics_slide_dwells");
    const dwellsSnapshot = await getDocs(query(dwellsCol, limit(500)));
    const allDwells = [];
    dwellsSnapshot.forEach((d) => allDwells.push(d.data()));

    const distinctDecks = new Set(sessions.map((s) => s.deckId));
    let grandTotalSeconds = 0;
    sessions.forEach((s) => {
      grandTotalSeconds += Number(s.totalDurationSeconds) || 0;
    });

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
      const sec = Number(d.durationSeconds) || 0;
      totalDwellTimeRecorded += sec;
      const p = d.lessonPhase || "direct_instruction";
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
        totalDwellMs: dwellMs,
        actualSeconds: Math.round(secs),
        formattedDwell: formatDurationMs(dwellMs),
        actualPercent,
        actualPercentage: actualPercent,
        targetPercent: meta.targetPercent,
        targetPercentage: meta.targetPercent,
        delta: Math.round((actualPercent - meta.targetPercent) * 10) / 10
      };
    });

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
      phases: phaseBreakdown,
      benchmarks: LESSON_PHASE_BENCHMARKS
    };
  } catch (err) {
    console.warn("[Firestore] Error loading cross-deck averages:", err.message);
    return null;
  }
}
