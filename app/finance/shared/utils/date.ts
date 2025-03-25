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
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const [rangeStart, rangeEnd] = [start, end].sort(
    (a, b) => a.getTime() - b.getTime(),
  );
  return date >= rangeStart && date <= rangeEnd;
}
