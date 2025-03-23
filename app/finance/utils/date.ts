/**
 * Checks if a date falls within a given range
 * @param date - The date to check
 * @param start - The start of the range
 * @param end - The end of the range
 * @returns True if the date is within the range, false otherwise
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const [rangeStart, rangeEnd] = [start, end].sort(
    (a, b) => a.getTime() - b.getTime(),
  );
  return date >= rangeStart && date <= rangeEnd;
}
