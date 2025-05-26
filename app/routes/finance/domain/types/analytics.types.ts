// Domain analytics types
import type { Budget } from "../entities/budget.entity";
import type { Category as DomainCategory } from "../entities/category.entity";

/** Represents spending trend analysis for a category */
export interface CategoryTrend {
  category_id: string;
  values: number[];
  trend: "increasing" | "decreasing" | "stable";
  forecast: number;
}

/** Represents a budget limit and spending for a specific category */
export interface BudgetSummary {
  category_id: string;
  limit: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
  carry_over?: number;
}

/** Represents the summary of transactions including totals and analysis */
export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categorySummary: Record<string, number>;
  budgets?: BudgetSummary[];
  trends?: CategoryTrend[];
  forecastedExpenses?: number;
  forecastedSavings?: number;
}

/** Comprehensive financial summary */
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categorySummary: Record<string, number>;
  budgets: BudgetSummary[];
  trends: CategoryTrend[];
  forecastedExpenses: number;
  forecastedSavings: number;
}

/** Represents spending and analytics for a category */
export interface CategoryWithAnalytics extends DomainCategory {
  spent: number;
  transaction_count: number;
  last_transaction_date?: string;
  spending_trend: "increasing" | "decreasing" | "stable";
}
