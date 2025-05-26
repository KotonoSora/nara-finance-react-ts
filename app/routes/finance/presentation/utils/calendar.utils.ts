/**
 * Calendar utility functions for finance dashboard
 */

export interface CalendarData {
  nowDate: Date;
  currentYear: number;
  currentMonth: number;
  currentDate: number;
  daysOfWeek: string[];
  daysInMonth: number;
  firstDayOfWeek: number;
  prevMonthDays: number;
  prevMonth: number;
  nextMonth: number;
}

/**
 * Prepares calendar data for the current date
 */
export function prepareCalendarData(): CalendarData {
  const today = new Date();
  return {
    nowDate: today,
    currentYear: today.getFullYear(),
    currentMonth: today.getMonth(),
    currentDate: today.getDate(),
    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysInMonth: new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate(),
    firstDayOfWeek: new Date(today.getFullYear(), today.getMonth(), 1).getDay(),
    prevMonthDays: new Date(today.getFullYear(), today.getMonth(), 0).getDate(),
    prevMonth: today.getMonth() === 0 ? 11 : today.getMonth() - 1,
    nextMonth: today.getMonth() === 11 ? 0 : today.getMonth() + 1,
  };
}
