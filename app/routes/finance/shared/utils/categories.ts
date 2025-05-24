/**
 * Mapping of transaction categories to their display colors using theme-aware CSS variables
 * @example
 * ```ts
 * categoryColors.food      // "hsl(var(--chart-1))"
 * categoryColors.transport // "hsl(var(--chart-2))"
 * ```
 */
export const categoryColors: Record<string, string> = {
  food: "hsl(var(--chart-1))",
  transport: "hsl(var(--chart-2))",
  shopping: "hsl(var(--chart-4))",
  other: "hsl(var(--muted-foreground))",
  salary: "hsl(var(--chart-2))",
  entertainment: "hsl(var(--chart-3))",
  healthcare: "hsl(var(--chart-5))",
};

/**
 * Retrieves the theme-aware display color for a transaction category
 * @param category - Transaction category name
 * @returns CSS custom property color for the category or default color if not found
 * @example
 * ```ts
 * getCategoryColor('food')      // "hsl(var(--chart-1))"
 * getCategoryColor('unknown')   // "hsl(var(--muted-foreground))" (other color)
 * ```
 */
export function getCategoryColor(category: string): string {
  return categoryColors[category] || categoryColors.other;
}
