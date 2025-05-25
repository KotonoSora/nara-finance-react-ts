import {
  addMonths,
  endOfMonth,
  format,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from "date-fns";

/**
 * Determines if a date falls within a specified range
 * @param date - Date to check
 * @param start - Start of date range
 * @param end - End of date range
 * @returns Boolean indicating if date is within range (inclusive)
 * @throws {Error} If any parameter is not a valid Date object
 * @example
 * ```ts
 * const date = new Date('2024-01-15')
 * const start = new Date('2024-01-01')
 * const end = new Date('2024-01-31')
 *
 * isDateInRange(date, start, end)  // true
 * isDateInRange(date, end, start)  // true (works with reversed range)
 * ```
 */
export function isDateInRange(
  date: Date,
  rangeStart: Date,
  rangeEnd: Date,
): boolean {
  return isWithinInterval(date, {
    start: rangeStart < rangeEnd ? rangeStart : rangeEnd,
    end: rangeStart < rangeEnd ? rangeEnd : rangeStart,
  });
}

export function getMonthRangeFromDate(date: Date): DateRange {
  return {
    from: startOfMonth(date),
    to: endOfMonth(date),
  };
}

export function getDateRangeLabel(range: DateRange): string {
  if (isSameMonth(range.from, range.to)) {
    return format(range.from, "MMMM yyyy");
  }

  if (isSameYear(range.from, range.to)) {
    return `${format(range.from, "MMM")} - ${format(range.to, "MMM yyyy")}`;
  }

  return `${format(range.from, "MMM yyyy")} - ${format(range.to, "MMM yyyy")}`;
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

export function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear();
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function formatTransactionDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy");
}

export function getRelativeDateRange(months: number): DateRange {
  const end = new Date();
  const start = subMonths(startOfMonth(end), months - 1);
  return {
    from: start,
    to: end,
  };
}
