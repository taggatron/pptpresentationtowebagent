/**
 * Teaching Timetable Schedule & Analytics Guard Engine
 * 
 * Enforces automatic analytics recording strictly during scheduled lesson times
 * and defines the dynamic interactive timetable calendar for lesson selection.
 * Sources weekly scheme-of-work topics from calendar-data.json and planning-data.json.
 */

import fs from "fs";
import path from "path";

export const LESSON_PERIODS = [
  { period: 1, label: "Period 1", startTime: "09:15", endTime: "10:30", startMinutes: 9 * 60 + 15, endMinutes: 10 * 60 + 30 },
  { period: 2, label: "Period 2", startTime: "10:45", endTime: "12:00", startMinutes: 10 * 60 + 45, endMinutes: 12 * 60 + 0 },
  { period: 3, label: "Period 3", startTime: "12:45", endTime: "14:00", startMinutes: 12 * 60 + 45, endMinutes: 14 * 60 + 0 },
  { period: 4, label: "Period 4", startTime: "14:15", endTime: "15:30", startMinutes: 14 * 60 + 15, endMinutes: 15 * 60 + 30 }
];

export const LESSON_SCHEDULE = [
  {
    id: "tue-p2",
    day: "Tuesday",
    dayOfWeek: 2, // 0 = Sun, 1 = Mon, 2 = Tue, ...
    period: 2,
    periodLabel: "Period 2",
    startTime: "10:45",
    endTime: "12:00",
    startMinutes: 10 * 60 + 45, // 645
    endMinutes: 12 * 60 + 0,    // 720
    group: "Broadsands",
    room: "Lab 7 (2.095)",
    topic: "NITROGEN CYCLE",
    linkedLesson: "Linked Year 11 · Lesson 2",
    matchingDeckId: "Classic_Lesson_04_Nitrogen_Cycle",
    sharedWith: "with Greg"
  },
  {
    id: "tue-p3",
    day: "Tuesday",
    dayOfWeek: 2,
    period: 3,
    periodLabel: "Period 3",
    startTime: "12:45",
    endTime: "14:00",
    startMinutes: 12 * 60 + 45, // 765
    endMinutes: 14 * 60 + 0,    // 840
    group: "A Level",
    room: "Lab 1 (3.096)",
    topic: "Lesson 1: Welcome to Human Biology: What do you already know?",
    linkedLesson: "Linked AAQ Human Biology · Lesson 1",
    matchingDeckId: "Lesson_01_Human_Biology_Scientist_Onboarding",
    sharedWith: "with Matt"
  },
  {
    id: "tue-p4",
    day: "Tuesday",
    dayOfWeek: 2,
    period: 4,
    periodLabel: "Period 4",
    startTime: "14:15",
    endTime: "15:30",
    startMinutes: 14 * 60 + 15, // 855
    endMinutes: 15 * 60 + 30,   // 930
    group: "A Level",
    room: "Lab 1 (3.096)",
    topic: "Lesson 2: Working like a Human Biologist",
    linkedLesson: "Linked AAQ Human Biology · Lesson 2",
    matchingDeckId: "Lesson_01_Human_Biology_Scientist_Onboarding",
    sharedWith: "with Matt"
  },
  {
    id: "wed-p2",
    day: "Wednesday",
    dayOfWeek: 3,
    period: 2,
    periodLabel: "Period 2",
    startTime: "10:45",
    endTime: "12:00",
    startMinutes: 10 * 60 + 45, // 645
    endMinutes: 12 * 60 + 0,    // 720
    group: "Goodrington",
    room: "Lab 7 (2.095)",
    topic: "NITROGEN CYCLE",
    linkedLesson: "Linked Year 11 · Lesson 2",
    matchingDeckId: "Classic_Lesson_04_Nitrogen_Cycle",
    sharedWith: "with Greg"
  },
  {
    id: "thu-p1",
    day: "Thursday",
    dayOfWeek: 4,
    period: 1,
    periodLabel: "Period 1",
    startTime: "09:15",
    endTime: "10:30",
    startMinutes: 9 * 60 + 15,  // 555
    endMinutes: 10 * 60 + 30,   // 630
    group: "Goodrington",
    room: "Lab 7 (2.095)",
    topic: "CARBON AND WATER CYCLE",
    linkedLesson: "Linked Year 11 · Lesson 3",
    matchingDeckId: "Classic_Lesson_05_Carbon_and_Water_Cycle",
    sharedWith: "with Greg"
  },
  {
    id: "fri-p1",
    day: "Friday",
    dayOfWeek: 5,
    period: 1,
    periodLabel: "Period 1",
    startTime: "09:15",
    endTime: "10:30",
    startMinutes: 9 * 60 + 15,  // 555
    endMinutes: 10 * 60 + 30,   // 630
    group: "Science Rip",
    room: "Lab 7 (2.095)",
    topic: "DNA",
    linkedLesson: "Linked Year 10 · Lesson 3",
    matchingDeckId: "Lesson_04_DNA",
    sharedWith: "with Aimee"
  },
  {
    id: "fri-p4",
    day: "Friday",
    dayOfWeek: 5,
    period: 4,
    periodLabel: "Period 4",
    startTime: "14:15",
    endTime: "15:30",
    startMinutes: 14 * 60 + 15, // 855
    endMinutes: 15 * 60 + 30,   // 930
    group: "Goodrington",
    room: "Lab 7 (2.095)",
    topic: "HUMAN IMPACTS ON BIODIVERSITY",
    linkedLesson: "Linked Year 11 · Lesson 4",
    matchingDeckId: "Classic_Lesson_06_Human_Impacts_on_Biodiversity",
    sharedWith: "with Greg"
  }
];

export const DAY_NAMES = [
  { dayIndex: 1, name: "Monday", shortName: "Mon" },
  { dayIndex: 2, name: "Tuesday", shortName: "Tue" },
  { dayIndex: 3, name: "Wednesday", shortName: "Wed" },
  { dayIndex: 4, name: "Thursday", shortName: "Thu" },
  { dayIndex: 5, name: "Friday", shortName: "Fri" }
];

// In-memory cache for external planning & calendar data
let cachedPlanningData = null;
let cachedCalendarData = null;

function loadProgrammeSources() {
  if (cachedPlanningData && cachedCalendarData) {
    return { plan: cachedPlanningData, cal: cachedCalendarData };
  }

  const dataDir = path.resolve(process.cwd(), "data");
  const planPath = path.join(dataDir, "planning-data.json");
  const calPath = path.join(dataDir, "calendar-data.json");

  try {
    if (fs.existsSync(planPath)) {
      cachedPlanningData = JSON.parse(fs.readFileSync(planPath, "utf-8"));
    }
  } catch {}

  try {
    if (fs.existsSync(calPath)) {
      cachedCalendarData = JSON.parse(fs.readFileSync(calPath, "utf-8"));
    }
  } catch {}

  return { plan: cachedPlanningData, cal: cachedCalendarData };
}

function normalizeStr(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Scan public/decks directory to find the matching slide deck ID for a topic title.
 */
export function findMatchingDeckId(topic, className = "") {
  if (!topic) return null;
  const topicLower = topic.toLowerCase();

  // Special handling for A Level Human Biology
  if (className === "A Level" && (topicLower.includes("human biology") || topicLower.includes("scientist") || topicLower.includes("onboarding"))) {
    return "Lesson_01_Human_Biology_Scientist_Onboarding";
  }

  const decksDir = path.resolve(process.cwd(), "public", "decks");
  let availableDecks = [];
  try {
    if (fs.existsSync(decksDir)) {
      availableDecks = fs.readdirSync(decksDir);
    }
  } catch {}

  if (availableDecks.length === 0) {
    return null;
  }

  // 1. Exact normalized match
  const normTopic = normalizeStr(topic);
  for (const deck of availableDecks) {
    if (normalizeStr(deck) === normTopic) return deck;
  }

  // 2. Substring match
  for (const deck of availableDecks) {
    const normDeck = normalizeStr(deck);
    if (normDeck.includes(normTopic) || normTopic.includes(normDeck)) {
      return deck;
    }
  }

  // 3. Significant keyword match
  const stopWords = new Set(["lesson", "working", "biology", "science", "like", "what", "already", "know"]);
  const words = topicLower.split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !stopWords.has(w));
  if (words.length > 0) {
    for (const deck of availableDecks) {
      const normDeck = deck.toLowerCase();
      if (words.every((w) => normDeck.includes(w))) return deck;
    }
  }

  return null;
}

/**
 * Resolve a lesson topic, linked lesson index, and matching deck for a timetable slot and Monday date.
 */
export function resolveLessonForSlot(slot, weekMondayDate) {
  const { plan, cal } = loadProgrammeSources();
  if (!plan || !cal) {
    return {
      topic: slot.topic,
      linkedLesson: slot.linkedLesson,
      matchingDeckId: slot.matchingDeckId
    };
  }

  const session = plan.sessions.find((s) => s.id === slot.id);
  if (!session) return null;

  const aaqProg = cal.configurations?.aaq?.Linear || cal.programmes?.aaq;
  const progs = {
    year10: cal.programmes?.year10,
    year11: cal.programmes?.year11,
    year11_goodrington: cal.programmes?.year11,
    year11_broadsands: cal.programmes?.year11,
    aaq: aaqProg
  };

  const progKey = session.className === "Broadsands"
    ? "year11_broadsands"
    : (session.className === "Goodrington" ? "year11_goodrington" : session.linkedProgramme);

  const weeksList = progs[progKey] || progs[session.linkedProgramme];
  const linkedWeek = weeksList?.find((item) => item.date === weekMondayDate);
  if (!linkedWeek || linkedWeek.isBreak) {
    return { isBreak: true, topic: "No teaching" };
  }

  const lesson = linkedWeek.lessons?.[session.linkedLessonIndex];
  if (!lesson || !lesson.title) {
    return null; // Slot is free / no lesson this week
  }

  const progName = session.linkedProgramme === "year10"
    ? "Year 10"
    : (session.linkedProgramme === "year11" ? "Year 11" : "AAQ Human Biology");

  return {
    topic: lesson.title,
    lessonId: lesson.id,
    linkedLesson: `Linked ${progName} · Lesson ${session.linkedLessonIndex + 1}`,
    matchingDeckId: findMatchingDeckId(lesson.title, session.className)
  };
}

/**
 * Get all academic weeks with date ranges from calendar data.
 */
export function getTimetableWeeks() {
  const { cal } = loadProgrammeSources();
  if (cal?.programmes?.year11) {
    const weeks = cal.programmes.year11.filter((w) => w.date >= "2026-09-07");
    return weeks.map((w, idx) => {
      const d = new Date(w.date + "T12:00:00");
      const endD = new Date(d);
      endD.setDate(d.getDate() + 4);
      const startDay = d.getDate();
      const startMonth = d.toLocaleString("en-GB", { month: "short" });
      const endDay = endD.getDate();
      const endMonth = endD.toLocaleString("en-GB", { month: "short" });
      const dateRange = startMonth === endMonth
        ? `${startDay}–${endDay} ${startMonth} 2026`
        : `${startDay} ${startMonth}–${endDay} ${endMonth} 2026`;

      const isWeek4 = w.id === "year11-week-4" || w.date === "2026-09-14";
      return {
        id: w.id,
        number: idx + 3, // Align with Week 3, Week 4, etc.
        label: `Week ${idx + 3}`,
        displayLabel: `Week ${idx + 3} (${dateRange})`,
        dateRange,
        mondayDate: w.date,
        isBreak: Boolean(w.isBreak),
        isDefault: isWeek4
      };
    });
  }

  // Curated fallback
  return [
    { id: "year11-week-3", number: 3, label: "Week 3", displayLabel: "Week 3 (7–11 Sept 2026)", dateRange: "7–11 Sept 2026", mondayDate: "2026-09-07" },
    { id: "year11-week-4", number: 4, label: "Week 4", displayLabel: "Week 4 (14–18 Sept 2026)", dateRange: "14–18 Sept 2026", mondayDate: "2026-09-14", isDefault: true },
    { id: "year11-week-5", number: 5, label: "Week 5", displayLabel: "Week 5 (21–25 Sept 2026)", dateRange: "21–25 Sept 2026", mondayDate: "2026-09-21" },
    { id: "year11-week-6", number: 6, label: "Week 6", displayLabel: "Week 6 (28 Sept–2 Oct 2026)", dateRange: "28 Sept–2 Oct 2026", mondayDate: "2026-09-28" },
    { id: "year11-week-7", number: 7, label: "Week 7", displayLabel: "Week 7 (5–9 Oct 2026)", dateRange: "5–9 Oct 2026", mondayDate: "2026-10-05" },
    { id: "year11-week-8", number: 8, label: "Week 8", displayLabel: "Week 8 (12–16 Oct 2026)", dateRange: "12–16 Oct 2026", mondayDate: "2026-10-12" }
  ];
}

export const TIMETABLE_WEEKS = getTimetableWeeks();

/**
 * Check if the given date / timestamp falls strictly within one of the scheduled lesson windows.
 * Returns the matching lesson slot or null.
 */
export function getCurrentLessonSlot(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  const currentMinutes = d.getHours() * 60 + d.getMinutes();

  const slot = LESSON_SCHEDULE.find((s) => {
    return s.dayOfWeek === day &&
           currentMinutes >= s.startMinutes &&
           currentMinutes < s.endMinutes;
  });

  if (!slot) return null;

  // Resolve current week's Monday date to enrich with dynamic topic
  try {
    const monday = new Date(d);
    const dayDiff = d.getDay() === 0 ? -6 : 1 - d.getDay();
    monday.setDate(d.getDate() + dayDiff);
    const mondayStr = monday.toISOString().slice(0, 10);
    const resolved = resolveLessonForSlot(slot, mondayStr);
    if (resolved && resolved.topic && !resolved.isBreak) {
      return {
        ...slot,
        topic: resolved.topic,
        linkedLesson: resolved.linkedLesson || slot.linkedLesson,
        matchingDeckId: resolved.matchingDeckId || slot.matchingDeckId
      };
    }
  } catch {}

  return slot;
}

/**
 * Convenience boolean: returns true if current time is inside an active lesson.
 */
export function isWithinLessonTime(date = new Date()) {
  return getCurrentLessonSlot(date) !== null;
}

/**
 * Returns the next upcoming lesson slot from current time.
 */
export function getNextScheduledLesson(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const currentDay = d.getDay();
  const currentMinutes = d.getHours() * 60 + d.getMinutes();

  // Find next lesson later today
  const todayLessons = LESSON_SCHEDULE
    .filter((s) => s.dayOfWeek === currentDay && s.startMinutes > currentMinutes)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  if (todayLessons.length > 0) {
    return todayLessons[0];
  }

  // Find next lesson on subsequent days (wrap around week)
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (currentDay + offset) % 7;
    const nextLessons = LESSON_SCHEDULE
      .filter((s) => s.dayOfWeek === nextDay)
      .sort((a, b) => a.startMinutes - b.startMinutes);
    if (nextLessons.length > 0) {
      return nextLessons[0];
    }
  }

  return LESSON_SCHEDULE[0];
}

/**
 * Build the full weekly grid for display in the little calendar popup.
 * Dynamically resolves topics and deck bindings for the requested weekId.
 */
export function getWeekTimetable(weekId = "year11-week-4") {
  const weeks = getTimetableWeeks();
  const weekInfo = weeks.find((w) => w.id === weekId) || weeks.find((w) => w.isDefault) || weeks[0];
  const monday = new Date(weekInfo.mondayDate + "T00:00:00");

  const days = DAY_NAMES.map((d, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);
    const dayOfMonth = dayDate.getDate();
    const monthName = dayDate.toLocaleString("en-GB", { month: "short" });
    return {
      dayIndex: d.dayIndex,
      name: d.name,
      shortName: d.shortName,
      dateFormatted: `${dayOfMonth} ${monthName}`,
      isoDate: dayDate.toISOString().slice(0, 10)
    };
  });

  const activeSlotNow = getCurrentLessonSlot();

  const periods = LESSON_PERIODS.map((period) => {
    const daySlots = days.map((day) => {
      const match = LESSON_SCHEDULE.find((s) => s.dayOfWeek === day.dayIndex && s.period === period.period);
      if (!match) {
        return {
          dayIndex: day.dayIndex,
          dayName: day.name,
          period: period.period,
          periodLabel: period.label,
          timeSpan: `${period.startTime}–${period.endTime}`,
          isFree: true,
          label: "FREE",
          dateFormatted: day.dateFormatted
        };
      }

      // Dynamically resolve topic and lesson for this week
      const resolved = resolveLessonForSlot(match, weekInfo.mondayDate);

      if (!resolved || resolved.isBreak || !resolved.topic || resolved.topic === "No teaching") {
        return {
          ...match,
          dayIndex: day.dayIndex,
          dayName: day.name,
          isFree: true,
          label: resolved?.topic || "FREE",
          topic: "",
          matchingDeckId: null,
          dateFormatted: day.dateFormatted
        };
      }

      const isLiveNow = activeSlotNow && activeSlotNow.id === match.id;

      return {
        ...match,
        topic: resolved.topic,
        linkedLesson: resolved.linkedLesson || match.linkedLesson,
        matchingDeckId: resolved.matchingDeckId !== undefined ? resolved.matchingDeckId : match.matchingDeckId,
        dayIndex: day.dayIndex,
        dayName: day.name,
        isFree: false,
        weekId: weekInfo.id,
        slotKey: `${weekInfo.id}-${match.id}`,
        isLiveNow: Boolean(isLiveNow),
        dateFormatted: day.dateFormatted
      };
    });

    return {
      period: period.period,
      periodLabel: period.label,
      timeSpan: `${period.startTime}–${period.endTime}`,
      startTime: period.startTime,
      endTime: period.endTime,
      daySlots
    };
  });

  return {
    week: weekInfo,
    allWeeks: weeks,
    days,
    periods,
    activeSlotNow
  };
}
