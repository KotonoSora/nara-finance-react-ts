/**
 * Calendar Utilities - Presentation Layer
 *
 * Provides calendar data preparation and date manipulation utilities
 * for the finance dashboard UI components.
 */

import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";

import type { CalendarData } from "~/routes/finance/presentation/types/ui.types";

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

/**
 * Checks if a date is within a specified range
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/**
 * Gets transaction summary for a specific date
 */
export function getTransactionSummaryForDate(date: Date, transactions: any[]) {
  const dateString = format(date, "yyyy-MM-dd");
  const dayTransactions = transactions.filter(
    (t) => format(new Date(t.date), "yyyy-MM-dd") === dateString,
  );

  return {
    income: dayTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
    expense: dayTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
    count: dayTransactions.length,
  };
}

/**
 * Gets calendar data for a specific month
 */
export function getMonthlyCalendarData(
  year: number,
  month: number,
): CalendarData {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  return {
    nowDate: new Date(),
    currentYear: year,
    currentMonth: month,
    currentDate: new Date().getDate(),
    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysInMonth: lastDay.getDate(),
    firstDayOfWeek: firstDay.getDay(),
    prevMonthDays: new Date(year, month, 0).getDate(),
    prevMonth: month === 0 ? 11 : month - 1,
    nextMonth: month === 11 ? 0 : month + 1,
  };
}
