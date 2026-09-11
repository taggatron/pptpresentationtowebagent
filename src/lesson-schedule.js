/**
 * Teaching Timetable Schedule & Analytics Guard Engine
 * 
 * Enforces automatic analytics recording strictly during scheduled lesson times
 * and defines the interactive timetable calendar for lesson selection.
 */

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

export const TIMETABLE_WEEKS = [
  { id: "year11-week-1", number: 1, label: "Week 1", dateRange: "24–28 Aug 2026", mondayDate: "2026-08-24" },
  { id: "year11-week-2", number: 2, label: "Week 2", dateRange: "31 Aug–4 Sept 2026", mondayDate: "2026-08-31" },
  { id: "year11-week-3", number: 3, label: "Week 3", dateRange: "7–11 Sept 2026", mondayDate: "2026-09-07" },
  { id: "year11-week-4", number: 4, label: "Week 4", dateRange: "14–18 Sept 2026", mondayDate: "2026-09-14", isDefault: true },
  { id: "year11-week-5", number: 5, label: "Week 5", dateRange: "21–25 Sept 2026", mondayDate: "2026-09-21" },
  { id: "year11-week-6", number: 6, label: "Week 6", dateRange: "28 Sept–2 Oct 2026", mondayDate: "2026-09-28" }
];

export const DAY_NAMES = [
  { dayIndex: 1, name: "Monday", shortName: "Mon" },
  { dayIndex: 2, name: "Tuesday", shortName: "Tue" },
  { dayIndex: 3, name: "Wednesday", shortName: "Wed" },
  { dayIndex: 4, name: "Thursday", shortName: "Thu" },
  { dayIndex: 5, name: "Friday", shortName: "Fri" }
];

/**
 * Check if the given date / timestamp falls strictly within one of the scheduled lesson windows.
 * Returns the matching lesson slot or null.
 */
export function getCurrentLessonSlot(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  const currentMinutes = d.getHours() * 60 + d.getMinutes();

  return LESSON_SCHEDULE.find((slot) => {
    return slot.dayOfWeek === day &&
           currentMinutes >= slot.startMinutes &&
           currentMinutes < slot.endMinutes;
  }) || null;
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
 * Computes dates for the specified week (defaulting to Week 4).
 */
export function getWeekTimetable(weekId = "year11-week-4") {
  const weekInfo = TIMETABLE_WEEKS.find((w) => w.id === weekId) || TIMETABLE_WEEKS.find((w) => w.isDefault) || TIMETABLE_WEEKS[3];
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

      const isLiveNow = activeSlotNow && activeSlotNow.id === match.id;

      return {
        ...match,
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
    allWeeks: TIMETABLE_WEEKS,
    days,
    periods,
    activeSlotNow
  };
}
