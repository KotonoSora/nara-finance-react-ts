// Domain constants for finance business logic
export const TRANSACTION_TYPES = ["income", "expense", "investment"] as const;
export const CATEGORY_TYPES = ["income", "expense", "investment"] as const;
export const BUDGET_PERIODS = ["monthly", "weekly", "yearly"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];
export type CategoryType = (typeof CATEGORY_TYPES)[number];
export type BudgetPeriod = (typeof BUDGET_PERIODS)[number];

// Business rules
export const MIN_TRANSACTION_AMOUNT = 0.01;
export const MAX_TRANSACTION_AMOUNT = 999999.99;
export const MIN_DESCRIPTION_LENGTH = 3;
export const MAX_DESCRIPTION_LENGTH = 100;

// Category display mappings
export const CATEGORY_COLORS: Record<CategoryType | "other", string> = {
  income: "#06b6d4", // cyan
  expense: "#ef4444", // red
  investment: "#3b82f6", // blue
  other: "#64748b", // slate
};

export const CATEGORY_ICONS: Record<CategoryType | "other", string> = {
  income: "💰",
  expense: "💸",
  investment: "📈",
  other: "❓",
};
