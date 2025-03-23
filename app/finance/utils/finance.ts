/**
 * Determines the type of change between two values
 * @param current - The current value
 * @param previous - The previous value
 * @returns The type of change: "positive", "negative", or "neutral"
 */
export function getChangeType(
  current: number,
  previous: number,
): "positive" | "negative" | "neutral" {
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 5) return "neutral";
  return change > 0 ? "positive" : "negative";
}

/**
 * Calculates the percentage change between two values
 * @param current - The current value
 * @returns The percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  return ((current - previous) / previous) * 100;
}
