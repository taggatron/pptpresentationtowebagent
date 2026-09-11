import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import {
  LESSON_SCHEDULE,
  LESSON_PERIODS,
  TIMETABLE_WEEKS,
  DAY_NAMES,
  getCurrentLessonSlot,
  isWithinLessonTime,
  getNextScheduledLesson,
  getWeekTimetable
} from "../src/lesson-schedule.js";
import {
  startTrackingSession,
  recordSlideDwell,
  finishTrackingSession,
  getLessonAnalytics
} from "../src/analytics-db.js";
import { createApp } from "../src/server.js";

test("Lesson Schedule defines all user-specified teaching periods accurately", () => {
  // 7 scheduled teaching lessons across the week
  assert.equal(LESSON_SCHEDULE.length, 7);

  // Tuesday lessons
  const tueLessons = LESSON_SCHEDULE.filter((s) => s.day === "Tuesday");
  assert.equal(tueLessons.length, 3);
  assert.deepEqual(
    tueLessons.map((l) => ({ time: `${l.startTime}–${l.endTime}`, group: l.group, period: l.period })),
    [
      { time: "10:45–12:00", group: "Broadsands", period: 2 },
      { time: "12:45–14:00", group: "A Level", period: 3 },
      { time: "14:15–15:30", group: "A Level", period: 4 }
    ]
  );

  // Wednesday lesson
  const wedLessons = LESSON_SCHEDULE.filter((s) => s.day === "Wednesday");
  assert.equal(wedLessons.length, 1);
  assert.equal(wedLessons[0].group, "Goodrington");
  assert.equal(wedLessons[0].startTime, "10:45");
  assert.equal(wedLessons[0].endTime, "12:00");

  // Thursday lesson
  const thuLessons = LESSON_SCHEDULE.filter((s) => s.day === "Thursday");
  assert.equal(thuLessons.length, 1);
  assert.equal(thuLessons[0].group, "Goodrington");
  assert.equal(thuLessons[0].startTime, "09:15");
  assert.equal(thuLessons[0].endTime, "10:30");

  // Friday lessons
  const friLessons = LESSON_SCHEDULE.filter((s) => s.day === "Friday");
  assert.equal(friLessons.length, 2);
  assert.equal(friLessons[0].group, "Science Rip");
  assert.equal(friLessons[0].startTime, "09:15");
  assert.equal(friLessons[0].endTime, "10:30");
  assert.equal(friLessons[1].group, "Goodrington");
  assert.equal(friLessons[1].startTime, "14:15");
  assert.equal(friLessons[1].endTime, "15:30");
});

test("isWithinLessonTime accurately evaluates time slots", () => {
  // Tuesday 11:15 (during Broadsands P2) -> TRUE
  const duringTueP2 = new Date("2026-09-15T11:15:00");
  assert.equal(isWithinLessonTime(duringTueP2), true);
  const slotTueP2 = getCurrentLessonSlot(duringTueP2);
  assert.ok(slotTueP2);
  assert.equal(slotTueP2.group, "Broadsands");
  assert.equal(slotTueP2.id, "tue-p2");

  // Tuesday 12:15 (during Lunch) -> FALSE
  const duringLunch = new Date("2026-09-15T12:15:00");
  assert.equal(isWithinLessonTime(duringLunch), false);
  assert.equal(getCurrentLessonSlot(duringLunch), null);

  // Monday 10:00 (Free day) -> FALSE
  const duringMon = new Date("2026-09-14T10:00:00");
  assert.equal(isWithinLessonTime(duringMon), false);

  // Sunday 14:00 (Weekend) -> FALSE
  const weekend = new Date("2026-09-13T14:00:00");
  assert.equal(isWithinLessonTime(weekend), false);

  // Thursday 09:30 (during Goodrington P1) -> TRUE
  const duringThuP1 = new Date("2026-09-17T09:30:00");
  assert.equal(isWithinLessonTime(duringThuP1), true);
  const slotThu = getCurrentLessonSlot(duringThuP1);
  assert.equal(slotThu.group, "Goodrington");
  assert.equal(slotThu.topic, "CARBON AND WATER CYCLE");
});

test("getWeekTimetable builds 5 days and 4 periods with correct lesson bindings", () => {
  const table = getWeekTimetable("year11-week-4");
  assert.equal(table.week.id, "year11-week-4");
  assert.equal(table.days.length, 5);
  assert.equal(table.periods.length, 4);

  // Check Thursday Period 1
  const p1 = table.periods.find((p) => p.period === 1);
  assert.ok(p1);
  const thuP1 = p1.daySlots.find((s) => s.dayIndex === 4);
  assert.ok(thuP1);
  assert.equal(thuP1.isFree, false);
  assert.equal(thuP1.group, "Goodrington");
  assert.equal(thuP1.topic, "CARBON AND WATER CYCLE");

  // Check Monday Period 1 (FREE)
  const monP1 = p1.daySlots.find((s) => s.dayIndex === 1);
  assert.ok(monP1);
  assert.equal(monP1.isFree, true);
});

test("startTrackingSession tags sessions with lesson metadata and getLessonAnalytics aggregates", () => {
  const testDeckId = "Classic_Lesson_04_Nitrogen_Cycle";
  const session = startTrackingSession({
    deckId: testDeckId,
    totalSlides: 15,
    lessonId: "tue-p2",
    lessonGroup: "Broadsands",
    lessonPeriod: "Period 2",
    lessonTopic: "NITROGEN CYCLE",
    weekId: "year11-week-4"
  });

  assert.equal(session.lessonId, "tue-p2");
  assert.equal(session.lessonGroup, "Broadsands");
  assert.equal(session.lessonTopic, "NITROGEN CYCLE");

  // Record slide dwell
  recordSlideDwell(session.id, testDeckId, 0, 1, 30000, "starter");
  recordSlideDwell(session.id, testDeckId, 1, 2, 90000, "direct_instruction");
  finishTrackingSession(session.id, testDeckId);

  // Fetch lesson analytics
  const lessonData = getLessonAnalytics("tue-p2", "year11-week-4");
  assert.equal(lessonData.hasData, true);
  assert.equal(lessonData.lessonGroup, "Broadsands");
  assert.equal(lessonData.lessonTopic, "NITROGEN CYCLE");
  assert.ok(lessonData.totalDurationMs >= 120000);
  assert.equal(lessonData.slides.length, 2);
  const starter = lessonData.phaseBreakdown.find((p) => p.phaseKey === "starter");
  assert.ok(starter);
  assert.ok(starter.totalDwellMs >= 30000);
});

test("GET /api/analytics/timetable and GET /api/analytics/lesson/:lessonId endpoints work properly", async () => {
  const app = createApp();
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Timetable endpoint
    const timeRes = await fetch(`${baseUrl}/api/analytics/timetable?weekId=year11-week-4`);
    assert.equal(timeRes.status, 200);
    const timeData = await timeRes.json();
    assert.equal(timeData.success, true);
    assert.equal(timeData.week.id, "year11-week-4");
    assert.equal(timeData.days.length, 5);
    assert.equal(timeData.periods.length, 4);

    // 2. Lesson analytics endpoint
    const lessonRes = await fetch(`${baseUrl}/api/analytics/lesson/tue-p2?weekId=year11-week-4`);
    assert.equal(lessonRes.status, 200);
    const lessonJson = await lessonRes.json();
    assert.equal(lessonJson.success, true);
    assert.ok(lessonJson.data);
    assert.equal(lessonJson.data.lessonId, "tue-p2");
    assert.equal(lessonJson.data.lessonGroup, "Broadsands");
  } finally {
    server.close();
  }
});

test("getWeekTimetable dynamically changes lesson content, topics, and decks when the week changes", () => {
  // Week 3 (7–11 Sept 2026)
  const week3 = getWeekTimetable("year11-week-3");
  assert.equal(week3.week.id, "year11-week-3");
  assert.equal(week3.days[0].dateFormatted, "7 Sept");

  const w3ThuP1 = week3.periods[0].daySlots.find((s) => s.id === "thu-p1");
  assert.equal(w3ThuP1.isFree, false);
  assert.equal(w3ThuP1.topic, "ECOSYSTEMS");
  assert.equal(w3ThuP1.matchingDeckId, "Classic_Lesson_01_Ecosystems");

  const w3FriP1 = week3.periods[0].daySlots.find((s) => s.id === "fri-p1");
  assert.equal(w3FriP1.isFree, false);
  assert.equal(w3FriP1.topic, "CELL STRUCTURE");
  assert.equal(w3FriP1.matchingDeckId, "Lesson_01_CELL_STRUCTURE");

  const w3TueP2 = week3.periods[1].daySlots.find((s) => s.id === "tue-p2");
  assert.equal(w3TueP2.isFree, true); // Y11 starts Thursday in Week 3

  // Week 4 (14–18 Sept 2026)
  const week4 = getWeekTimetable("year11-week-4");
  assert.equal(week4.week.id, "year11-week-4");
  assert.equal(week4.days[0].dateFormatted, "14 Sept");

  const w4TueP2 = week4.periods[1].daySlots.find((s) => s.id === "tue-p2");
  assert.equal(w4TueP2.isFree, false);
  assert.equal(w4TueP2.topic, "NITROGEN CYCLE");
  assert.equal(w4TueP2.matchingDeckId, "Classic_Lesson_04_Nitrogen_Cycle");

  const w4ThuP1 = week4.periods[0].daySlots.find((s) => s.id === "thu-p1");
  assert.equal(w4ThuP1.topic, "CARBON AND WATER CYCLE");
  assert.equal(w4ThuP1.matchingDeckId, "Classic_Lesson_05_Carbon_and_Water_Cycle");

  const w4FriP1 = week4.periods[0].daySlots.find((s) => s.id === "fri-p1");
  assert.equal(w4FriP1.topic, "DNA");
  assert.equal(w4FriP1.matchingDeckId, "Lesson_04_DNA");

  // Week 5 (21–25 Sept 2026)
  const week5 = getWeekTimetable("year11-week-5");
  assert.equal(week5.week.id, "year11-week-5");
  assert.equal(week5.days[0].dateFormatted, "21 Sept");

  const w5TueP2 = week5.periods[1].daySlots.find((s) => s.id === "tue-p2");
  assert.equal(w5TueP2.isFree, false);
  assert.equal(w5TueP2.topic, "CRUDE OIL AND FRACTIONAL DISTILLATION");
  assert.equal(w5TueP2.matchingDeckId, "Classic_Lesson_08_Crude_Oil_and_Fractional_Distillation");

  const w5ThuP1 = week5.periods[0].daySlots.find((s) => s.id === "thu-p1");
  assert.equal(w5ThuP1.topic, "GREENHOUSE EFFECT");
  assert.equal(w5ThuP1.matchingDeckId, "Classic_Lesson_09_Greenhouse_Effect");
});
