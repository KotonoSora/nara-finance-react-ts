import { DEFAULT_LOCALE, getLocalizedDaysOfWeek } from "./locale";

export function prepareCalendarData(
  date: Date = new Date(),
  locale = DEFAULT_LOCALE,
): CalendarData {
  // Convert to UTC+0
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );

  const currentYear = utcDate.getUTCFullYear();
  const currentMonth = utcDate.getUTCMonth();
  const currentDate = utcDate.getUTCDate();

  const daysInMonth = new Date(
    Date.UTC(currentYear, currentMonth + 1, 0),
  ).getUTCDate();
  const nextMonth = new Date(
    Date.UTC(currentYear, currentMonth + 2, 0),
  ).getUTCMonth();
  const firstDayOfWeek =
    (new Date(Date.UTC(currentYear, currentMonth, 1)).getUTCDay() + 6) % 7;
  const prevMonthDays = new Date(
    Date.UTC(currentYear, currentMonth, 0),
  ).getUTCDate();
  const prevMonth = new Date(
    Date.UTC(currentYear, currentMonth, 0),
  ).getUTCMonth();

  return {
    nowDate: utcDate,
    currentYear,
    currentMonth,
    currentDate,
    daysOfWeek: getLocalizedDaysOfWeek(locale),
    daysInMonth,
    firstDayOfWeek,
    prevMonthDays,
    prevMonth,
    nextMonth,
  };
}
