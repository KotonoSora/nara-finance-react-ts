/**
 * Presentation Layer UI Types
 *
 * UI-specific types for the presentation layer, including legacy compatibility types
 */

import type { Budget as DomainBudget } from "~/routes/finance/domain/entities/budget.entity";
import type { Category as DomainCategory } from "~/routes/finance/domain/entities/category.entity";
import type { Transaction as DomainTransaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { CategoryTrend as DomainCategoryTrend } from "~/routes/finance/domain/types/analytics.types";
import type {
  BudgetPeriod,
  CategoryType,
} from "~/routes/finance/domain/value-objects/finance-constants";

/**
 * Transaction type for financial operations
 */
export type TransactionType = "income" | "expense" | "investment";

/**
 * Transaction type for financial operations
 */
export type TableSort = {
  column: string;
  direction: "asc" | "desc";
};

/** Category with analytics for UI display */
export interface CategoryWithAnalytics extends Category {
  spent: number;
  transaction_count: number;
  last_transaction_date?: string;
  spending_trend: "increasing" | "decreasing" | "stable";
}

// UI State Types
export interface DateRange {
  from: Date;
  to: Date;
}

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

/** Category form data type for UI forms */
export interface CategoryFormData {
  name: string;
  color?: string | null;
  description?: string;
  type?: CategoryType;
  budget_limit?: number | null;
  budget_period?: BudgetPeriod;
}

// UI-specific types for calendar and components
export interface DayItemBase {
  month: number;
  day: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  selected: boolean;
  onDateClick?: (date: Date) => void;
}

export interface DragDropProps {
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  onMouseUp?: () => void;
  isInRange: boolean;
}

export interface DayItem extends DayItemBase, DragDropProps {}

export interface DayCellProps extends DayItem {
  transactionCount?: number;
  transactionSummary?: {
    income: number;
    expense: number;
  };
}

export interface CalendarData {
  nowDate: Date;
  currentYear: number;
  currentMonth: number;
  currentDate: number;
  daysOfWeek: string[];
  daysInMonth: number;
  firstDayOfWeek: number;
  prevMonthDays: number;
  prevMonth: number;
  nextMonth: number;
}

export interface ICalendarProps {
  calendarDetail: CalendarData;
  selectedDate: Date | null;
  currentViewDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onDateRangeSelect?: (range: DateRange) => void;
  transactions: Transaction[];
}

export interface IListProps {
  selectedDate: Date | null;
  transactions?: Transaction[];
  onFilter?: (filters: TransactionFilters) => void;
  dateRange?: DateRange;
  summary?: FinancialSummary;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

export interface FinancialInsightsProps {
  summary: FinancialSummary;
  dateRange?: DateRange;
  onCategorySelect?: (category: string) => void;
  previousPeriod?: {
    totalIncome: number;
    totalExpenses: number;
    savings: number;
  };
  timeframe?: "week" | "month" | "year";
}

export interface SpendingChartProps {
  data: Array<{
    category: string;
    amount: number;
    color: string;
  }>;
  onCategorySelect?: (category: string) => void;
  budgets?: Budget[];
  trends?: CategoryTrend[];
}

export interface CategoryTheme {
  color: string;
  icon?: string;
  label: string;
}

export type CategoryThemes = Record<string, CategoryTheme>;

export type ViewMode = "day" | "week" | "month";

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
