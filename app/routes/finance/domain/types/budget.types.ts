import type { Budget } from "../entities/budget.entity";

/** Warning levels for budget thresholds */
export type WarningLevel = "safe" | "warning" | "danger";

/** Budget extended with category context for service operations */
export interface BudgetWithCategory extends Budget {
  category_id: string;
}
