/**
 * Color mapping for different transaction categories
 */
export const categoryColors: Record<string, string> = {
  food: "#3b82f6",
  transport: "#22c55e",
  shopping: "#f97316",
  other: "#6b7280",
};

/**
 * Gets the color associated with a transaction category
 * @param category - The category to get the color for (e.g. 'food', 'transport', 'shopping')
 * @returns The hex color code (e.g. '#3b82f6') for the category. Returns the 'other' color if category not found
 * @example
 * ```ts
 * getCategoryColor('food') // returns '#3b82f6'
 * getCategoryColor('unknown') // returns '#6b7280' (other color)
 * ```
 */
export function getCategoryColor(category: string): string {
  return categoryColors[category] || categoryColors.other;
}
