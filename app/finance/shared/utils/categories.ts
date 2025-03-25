/**
 * Mapping of transaction categories to their display colors
 * @example
 * ```ts
 * categoryColors.food      // "#3b82f6"
 * categoryColors.transport // "#22c55e"
 * ```
 */
export const categoryColors: Record<string, string> = {
  food: "#3b82f6",
  transport: "#22c55e",
  shopping: "#f97316",
  other: "#6b7280",
};

/**
 * Retrieves the display color for a transaction category
 * @param category - Transaction category name
 * @returns Hex color code for the category or default color if not found
 * @example
 * ```ts
 * getCategoryColor('food')      // "#3b82f6"
 * getCategoryColor('unknown')   // "#6b7280" (other color)
 * ```
 */
export function getCategoryColor(category: string): string {
  return categoryColors[category] || categoryColors.other;
}
