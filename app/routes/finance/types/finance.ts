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

export type TransactionType = "income" | "expense" | "investment";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  parent_id?: string | null;
  budget_limit?: number | null;
  budget_period: "monthly" | "weekly" | "yearly";
  is_archived: boolean;
  icon?: string | null;
  color?: string | null;
  created_at: string;
  updated_at: string;
  children?: Category[]; // For tree structure
  parent?: Category | null; // For parent reference
}

export interface CategoryWithAnalytics extends Category {
  spent: number;
  transaction_count: number;
  last_transaction_date?: string;
  spending_trend: "increasing" | "decreasing" | "stable";
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  category_id: string; // Category reference
  description: string;
}

export interface CategoryFormData {
  name: string;
  type: TransactionType;
  parent_id?: string | null;
  budget_limit?: number | null;
  budget_period: "monthly" | "weekly" | "yearly";
  icon?: string | null;
  color?: string | null;
}

/**
 * Represents a budget limit and spending for a specific category
 */
export interface Budget {
  category_id: string; // Category reference
  limit: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
  carry_over?: number; // Unused budget from previous period
}

/**
 * Represents spending trend analysis for a category
 */
export interface CategoryTrend {
  category_id: string; // Category reference
  values: number[]; // Historical spending values
  trend: "increasing" | "decreasing" | "stable";
  forecast: number; // Predicted next value
}

/**
 * Represents the summary of transactions including totals and analysis
 */
export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categorySummary: Record<string, number>; // category_id -> amount
  budgets?: Budget[];
  trends?: CategoryTrend[];
  forecastedExpenses?: number;
  forecastedSavings?: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categorySummary: Record<string, number>; // category_id -> amount
  budgets: Budget[];
  trends: CategoryTrend[];
  forecastedExpenses: number;
  forecastedSavings: number;
}

export interface TableSort {
  column: keyof Transaction;
  direction: "asc" | "desc";
}

export interface IListProps {
  selectedDate: Date | null;
  transactions?: Transaction[];
  onFilter?: (filters: TransactionFilters) => void;
  dateRange?: DateRange;
  summary?: FinancialSummary;
  selectedCategory?: string | null; // category_id
  onCategoryChange?: (category: string | null) => void; // category_id
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: string; // category_id
  dateRange?: {
    from: Date;
    to: Date;
  };
  searchTerm?: string;
  categories?: string[]; // category_ids
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface FinancialInsightsProps {
  summary: FinancialSummary;
  dateRange?: DateRange;
  onCategorySelect?: (category: string) => void; // category_id
  previousPeriod?: {
    totalIncome: number;
    totalExpenses: number;
    savings: number;
  };
  timeframe?: "week" | "month" | "year";
}

// Add color theme support for categories
export interface CategoryTheme {
  color: string;
  icon?: string;
  label: string;
}

export type CategoryThemes = Record<string, CategoryTheme>; // category_id -> theme

export type ViewMode = "day" | "week" | "month";

export interface DayCellProps extends DayItem {
  transactionCount?: number;
  transactionSummary?: {
    income: number;
    expense: number;
  };
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

export interface FinanceProps {
  loaderData: FinanceData & CalendarData;
}

export interface FinanceData {
  transactions: Transaction[];
  summary: FinancialSummary;
}

export interface ExportResult {
  filename: string;
}
