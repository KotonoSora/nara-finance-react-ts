/**
 * Presentation Layer UI Types
 *
 * Essential types for the presentation layer UI components
 * Re-exports from domain layer for consistency
 */

// ============================================================================
// DOMAIN TYPE IMPORTS AND RE-EXPORTS
// ============================================================================

import type { Budget } from "~/routes/finance/domain/entities/budget.entity";
import type { Category } from "~/routes/finance/domain/entities/category.entity";
import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { CategoryTrend } from "~/routes/finance/domain/types/analytics.types";
import type { TransactionType } from "~/routes/finance/domain/value-objects/finance-constants";

// Re-export for external use
export type { Budget, Category, Transaction, CategoryTrend, TransactionType };

// ============================================================================
// UI-SPECIFIC TYPES
// ============================================================================

export interface DateRange {
  from: Date;
  to: Date;
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

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  dateRange?: DateRange;
  searchTerm?: string;
  categories?: string[];
}

export interface TableSort {
  column: string;
  direction: "asc" | "desc";
}

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

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface FinancialInsightsProps {
  summary: FinancialSummary;
  dateRange?: DateRange;
  onCategorySelect?: (category: string) => void;
  previousPeriod?: {
    totalIncome: number;
    totalExpenses: number;
    savings: number;
  };
}

export interface SpendingChartProps {
  data: Array<{
    category: string;
    amount: number;
    color?: string;
  }>;
  onCategorySelect?: (category: string) => void;
  budgets?: Array<{
    category_id: string;
    limit: number;
    spent: number;
  }>;
  trends?: Array<{
    category_id: string;
    trend: "increasing" | "decreasing" | "stable";
    forecast: number;
  }>;
}

// ============================================================================
// CALENDAR COMPONENT TYPES
// ============================================================================

export interface ICalendarProps {
  calendarDetail: CalendarData;
  selectedDate: Date;
  currentViewDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onDateRangeSelect?: (start: Date, end: Date) => void;
  transactions?: Transaction[];
  className?: string;
}

export interface DayCellProps {
  date: Date;
  month: number;
  day: number;
  isSelected: boolean;
  isToday: boolean;
  isOtherMonth: boolean;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  selected: boolean;
  transactions: Transaction[];
  onDateSelect: (date: Date) => void;
  onDateClick: () => void;
  transactionCount?: number;
  transactionSummary?: {
    income: any;
    expense: any;
    count: number;
  };
  isInRange?: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onMouseUp: () => void;
}

// ============================================================================
// CATEGORY MANAGEMENT TYPES
// ============================================================================

export interface CategoryFormData {
  name: string;
  type: TransactionType;
  parent_id?: string | null;
  budget_limit?: number | null;
  budget_period?: "monthly" | "weekly" | "yearly";
  icon?: string | null;
  color?: string | null;
}

export interface CategoryWithAnalytics extends Category {
  spent: number;
  transaction_count: number;
  spending_trend: "increasing" | "decreasing" | "stable";
  last_transaction_date?: Date;
}

// ============================================================================
// EXPORT/IMPORT TYPES
// ============================================================================

export interface ExportResult {
  filename: string;
}
