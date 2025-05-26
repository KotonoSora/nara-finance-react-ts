/**
 * Presentation Layer UI Types
 *
 * UI-specific types for the presentation layer, including legacy compatibility types
 */

import type { Budget as DomainBudget } from "~/routes/finance/domain/entities/budget.entity";
import type { Category as DomainCategory } from "~/routes/finance/domain/entities/category.entity";
import type { Transaction as DomainTransaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { TransactionType } from "~/routes/finance/domain/value-objects/finance-constants";
import type {
  CategoryFormData as DomainCategoryFormData,
  CategoryTrend as DomainCategoryTrend,
  CategoryWithAnalytics as DomainCategoryWithAnalytics,
  TableSort as DomainTableSort,
} from "~/routes/finance/types/finance";

// Re-export TransactionType for consistency
export type { TransactionType };

// UI State Types
export interface DateRange {
  from: Date;
  to: Date;
}

// Re-export TableSort for UI components
export type TableSort = DomainTableSort;

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  dateRange?: DateRange;
  searchTerm?: string;
  categories?: string[];
}

// Legacy UI Types (for backward compatibility) - extend domain types with UI-specific fields
// Presentation Transaction type directly uses DomainTransaction
export type Transaction = DomainTransaction;

// Presentation Budget type directly uses DomainBudget
export type Budget = DomainBudget;

// Presentation CategoryTrend type directly uses DomainCategoryTrend
export type CategoryTrend = DomainCategoryTrend;

// Alias domain Category for presentation
export type Category = DomainCategory;

// Financial Summary for UI display
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  budgets: Budget[];
  trends: CategoryTrend[];
  categorySummary: Record<string, number>;
  forecastedExpenses: number;
  forecastedSavings: number;
}

// UI Component State Types
export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface CalendarData {
  date: Date;
  amount: number;
  type: "income" | "expense";
  count: number;
}

// Notification Types
export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationOptions {
  type: NotificationType;
  title: string;
  description?: string;
  duration?: number;
}

// Shortcut Types
export type ShortcutAction =
  | "add-transaction"
  | "add-income"
  | "add-expense"
  | "export-data"
  | "import-data"
  | "toggle-theme";

export type ShortcutHandler = () => void;

export interface ShortcutHandlers {
  [key: string]: ShortcutHandler;
}

export interface ShortcutConfig {
  key: string;
  action: ShortcutAction;
  description: string;
  handler: ShortcutHandler;
}

export interface UseFinanceShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export interface UseFinanceShortcutsReturn {
  shortcuts: ShortcutConfig[];
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

// Chart Configuration Types
export interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
}

// Filter State Types
export interface FilterState {
  dateRange: DateRange | null;
  categories: string[];
  type: TransactionType | null;
  searchTerm: string;
}

// Export Types
export interface ExportOptions {
  format: "csv" | "json" | "pdf";
  dateRange?: DateRange;
  categories?: string[];
  includeDetails?: boolean;
}

export interface ExportResult {
  filename: string;
}

export interface ImportOptions {
  format: "csv" | "json";
  skipValidation?: boolean;
  allowDuplicates?: boolean;
}

/** Align with domain CategoryWithAnalytics **/
export type CategoryWithAnalytics = DomainCategoryWithAnalytics;

/** Align with domain CategoryFormData **/
export type CategoryFormData = DomainCategoryFormData;
