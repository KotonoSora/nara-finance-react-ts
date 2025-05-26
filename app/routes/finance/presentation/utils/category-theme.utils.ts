/**
 * Presentation utilities for category theming and display
 */

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
  investment: "hsl(var(--chart-6))",
  education: "hsl(var(--chart-7))",
  utilities: "hsl(var(--chart-8))",
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

/**
 * Get category icon mapping for UI display
 */
export const categoryIcons: Record<string, string> = {
  food: "🍔",
  transport: "🚗",
  shopping: "🛍️",
  salary: "💰",
  other: "📦",
  entertainment: "🎬",
  healthcare: "🏥",
  investment: "📈",
  education: "📚",
  utilities: "⚡",
};

/**
 * Get icon for a category
 */
export function getCategoryIcon(category: string): string {
  return categoryIcons[category] || categoryIcons.other;
}

/**
 * Get all available category theme options
 */
export function getCategoryThemeOptions(): Array<{
  value: string;
  label: string;
  color: string;
  icon: string;
}> {
  return Object.keys(categoryColors).map((category) => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
    color: getCategoryColor(category),
    icon: getCategoryIcon(category),
  }));
}

/**
 * Generate category color palette for charts
 */
export function getCategoryColorPalette(categories: string[]): string[] {
  return categories.map((category) => getCategoryColor(category));
}

/**
 * Get contrasting text color for a category background
 */
export function getCategoryTextColor(category: string): string {
  // For chart colors, use standard text colors based on theme
  return "hsl(var(--foreground))";
}

/**
 * Get category badge styles
 */
export function getCategoryBadgeStyles(category: string): {
  backgroundColor: string;
  color: string;
  borderColor: string;
} {
  return {
    backgroundColor: getCategoryColor(category),
    color: getCategoryTextColor(category),
    borderColor: getCategoryColor(category),
  };
}
