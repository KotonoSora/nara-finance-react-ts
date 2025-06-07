/**
 * Calendar Utilities - Infrastructure Layer
 *
 * This module provides calendar data preparation and date manipulation utilities.
 * It handles locale-specific calendar formatting and date calculations.
 *
 * @layer Infrastructure
 * @category Utilities
 */

import { LocaleFormatter } from "~/routes/finance/infrastructure/formatters/locale.formatter";

/**
 * Calendar data structure for UI components
 */
export interface CalendarData {
  /** Current date as UTC */
  nowDate: Date;
  /** Current year */
  currentYear: number;
  /** Current month (0-11) */
  currentMonth: number;
  /** Current date (1-31) */
  currentDate: number;
  /** Localized days of week */
  daysOfWeek: string[];
  /** Number of days in current month */
  daysInMonth: number;
  /** First day of week offset (0-6) */
  firstDayOfWeek: number;
  /** Number of days in previous month */
  prevMonthDays: number;
  /** Previous month (0-11) */
  prevMonth: number;
  /** Next month (0-11) */
  nextMonth: number;
}

/**
 * Week data structure
 */
export interface WeekData {
  /** Week start date */
  startDate: Date;
  /** Week end date */
  endDate: Date;
  /** Days in the week */
  days: Date[];
  /** Week number in year */
  weekNumber: number;
}

/**
 * Month data structure
 */
export interface MonthData {
  /** Month start date */
  startDate: Date;
  /** Month end date */
  endDate: Date;
  /** All days in month */
  days: Date[];
  /** Month name */
  name: string;
  /** Week data for the month */
  weeks: WeekData[];
}

/**
 * Calendar utilities class
 */
export class CalendarUtils {
  /**
   * Prepares calendar data for a given date and locale
   *
   * @param date - Target date (defaults to current date)
   * @param locale - Locale string (defaults to 'en-US')
   * @returns Calendar data structure
   *
   * @example
   * ```ts
   * const calendar = CalendarUtils.prepareCalendarData(new Date(), 'en-US');
   * console.log(calendar.daysOfWeek); // ['Monday', 'Tuesday', ...]
   * ```
   */
  static prepareCalendarData(
    date: Date = new Date(),
    locale: string = "en-US",
  ): CalendarData {
    // Convert to UTC+0 to avoid timezone issues
    const utcDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );

    const currentYear = utcDate.getUTCFullYear();
    const currentMonth = utcDate.getUTCMonth();
    const currentDate = utcDate.getUTCDate();

    // Localized days of the week (e.g., Monday, Tuesday)
    const daysOfWeek = LocaleFormatter.getLocalizedDaysOfWeek(locale);

    // Calculate days in current month
    const daysInMonth = new Date(
      Date.UTC(currentYear, currentMonth + 1, 0),
    ).getUTCDate();

    // Calculate next month
    const nextMonth = new Date(
      Date.UTC(currentYear, currentMonth + 2, 0),
    ).getUTCMonth();

    // Calculate first day of week (adjusted for Monday start)
    const firstDayOfWeek =
      (new Date(Date.UTC(currentYear, currentMonth, 1)).getUTCDay() + 6) % 7;

    // Calculate previous month data
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
      daysOfWeek,
      daysInMonth,
      firstDayOfWeek,
      prevMonthDays,
      prevMonth,
      nextMonth,
    };
  }

  /**
   * Gets the start and end of a week for a given date
   *
   * @param date - Target date
   * @returns Week start and end dates
   */
  static getWeekBounds(date: Date): { start: Date; end: Date } {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start

    const start = new Date(date);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  /**
   * Gets the start and end of a month for a given date
   *
   * @param date - Target date
   * @returns Month start and end dates
   */
  static getMonthBounds(date: Date): { start: Date; end: Date } {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  /**
   * Gets the start and end of a year for a given date
   *
   * @param date - Target date
   * @returns Year start and end dates
   */
  static getYearBounds(date: Date): { start: Date; end: Date } {
    const start = new Date(date.getFullYear(), 0, 1);
    const end = new Date(date.getFullYear(), 11, 31);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  /**
   * Generates all days in a month
   *
   * @param year - Target year
   * @param month - Target month (0-11)
   * @returns Array of dates for the month
   */
  static getDaysInMonth(year: number, month: number): Date[] {
    const days: Date[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  /**
   * Generates week data for a given date
   *
   * @param date - Target date
   * @returns Week data structure
   */
  static getWeekData(date: Date): WeekData {
    const { start, end } = this.getWeekBounds(date);
    const days: Date[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    // Calculate week number (ISO week)
    const firstThursday = new Date(date.getFullYear(), 0, 1);
    firstThursday.setDate(
      firstThursday.getDate() + ((4 - firstThursday.getDay() + 7) % 7),
    );
    const weekNumber = Math.ceil(
      ((date.getTime() - firstThursday.getTime()) / 86400000 +
        firstThursday.getDay()) /
        7,
    );

    return {
      startDate: start,
      endDate: end,
      days,
      weekNumber,
    };
  }

  /**
   * Generates month data for a given date
   *
   * @param date - Target date
   * @param locale - Locale for month name
   * @returns Month data structure
   */
  static getMonthData(date: Date, locale: string = "en-US"): MonthData {
    const { start, end } = this.getMonthBounds(date);
    const days = this.getDaysInMonth(date.getFullYear(), date.getMonth());

    // Generate week data for the month
    const weeks: WeekData[] = [];
    const firstWeek = this.getWeekData(start);
    weeks.push(firstWeek);

    let currentWeekStart = new Date(firstWeek.endDate);
    currentWeekStart.setDate(currentWeekStart.getDate() + 1);

    while (currentWeekStart <= end) {
      const weekData = this.getWeekData(currentWeekStart);
      weeks.push(weekData);
      currentWeekStart = new Date(weekData.endDate);
      currentWeekStart.setDate(currentWeekStart.getDate() + 1);
    }

    // Get localized month name
    const name = date.toLocaleDateString(locale, { month: "long" });

    return {
      startDate: start,
      endDate: end,
      days,
      name,
      weeks,
    };
  }

  /**
   * Checks if two dates are in the same day
   *
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if dates are on the same day
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Checks if two dates are in the same week
   *
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if dates are in the same week
   */
  static isSameWeek(date1: Date, date2: Date): boolean {
    const week1 = this.getWeekBounds(date1);
    const week2 = this.getWeekBounds(date2);
    return this.isSameDay(week1.start, week2.start);
  }

  /**
   * Checks if two dates are in the same month
   *
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if dates are in the same month
   */
  static isSameMonth(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  }

  /**
   * Gets the number of days between two dates
   *
   * @param start - Start date
   * @param end - End date
   * @returns Number of days between dates
   */
  static getDaysBetween(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
