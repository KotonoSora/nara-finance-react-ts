// Shared constants for finance module
export const TRANSACTION_TYPES = ["income", "expense", "investment"] as const;
export const CATEGORY_TYPES = ["income", "expense", "investment"] as const;
export const BUDGET_PERIODS = ["monthly", "weekly", "yearly"] as const;
export const LEGACY_CATEGORIES = [
  "food",
  "transport",
  "shopping",
  "salary",
  "other",
] as const;

// Default budget limits
export const DEFAULT_BUDGET_LIMITS: Record<string, number> = {
  food: 500,
  transport: 200,
  shopping: 300,
  salary: 0,
  other: 200,
};

// Category colors
export const CATEGORY_COLORS: Record<string, string> = {
  food: "#ef4444",
  transport: "#3b82f6",
  shopping: "#f59e0b",
  salary: "#10b981",
  other: "#6b7280",
};

// Category icons
export const CATEGORY_ICONS: Record<string, string> = {
  food: "🍔",
  transport: "🚗",
  shopping: "🛍️",
  salary: "💰",
  other: "📦",
};
