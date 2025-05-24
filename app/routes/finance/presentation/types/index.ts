// Presentation Layer Types - UI specific types
import type { CategoryTrend as DomainCategoryTrend } from "../../application/types";
import type {
  Budget as DomainBudget,
  Category as DomainCategory,
  Transaction as DomainTransaction,
} from "../../domain/types";

// UI State Types
export interface DateRange {
  from: Date;
  to: Date;
}

export interface TransactionFilters {
  type?: "income" | "expense" | "investment";
  category?: string | TransactionCategory;
  dateRange?: DateRange;
  searchTerm?: string;
  categories?: string[];
}

export interface TableSort {
  column: keyof Transaction;
  direction: "asc" | "desc";
}

// Legacy UI Types (for backward compatibility) - extend domain types with UI-specific fields
export type TransactionCategory =
  | "food"
  | "transport"
  | "shopping"
  | "salary"
  | "other";

export interface Transaction extends DomainTransaction {
  category: TransactionCategory; // Legacy field for UI compatibility
}

export interface Category extends DomainCategory {
  // UI-specific extensions if needed
}

export interface Budget extends DomainBudget {
  category: TransactionCategory; // Legacy field for UI compatibility
  category_id?: string; // New field for proper domain reference
  carry_over?: number; // UI-specific field for budget rollover
}

export interface CategoryTrend extends DomainCategoryTrend {
  category: TransactionCategory; // Legacy field for UI compatibility
}

// Component Props Types
export interface FinancialInsightsProps {
  summary: FinancialSummary;
  dateRange?: DateRange;
  onCategorySelect?: (categoryId: string) => void;
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

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categorySummary: Record<TransactionCategory, number>;
  budgets: Budget[];
  trends: CategoryTrend[];
  forecastedExpenses: number;
  forecastedSavings: number;
}

// Calendar Types
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

export interface DayItem {
  month: number;
  day: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  selected: boolean;
  onDateClick?: (date: Date) => void;
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  onMouseUp?: () => void;
  isInRange: boolean;
  transactionCount?: number;
  transactionSummary?: {
    income: number;
    expense: number;
  };
}
