interface DayItemBase {
  month: number;
  day: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  selected: boolean;
  onDateClick?: (date: Date) => void;
}

interface DragDropProps {
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  onMouseUp?: () => void;
  isInRange: boolean;
}

interface DayItem extends DayItemBase, DragDropProps {}

interface CalendarData {
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

interface ICalendarProps {
  calendarDetail: CalendarData;
  selectedDate: Date | null;
  currentViewDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onDateRangeSelect?: (range: DateRange) => void;
  transactions: Transaction[];
}

type TransactionType = "income" | "expense" | "investment";
type TransactionCategory =
  | "food"
  | "transport"
  | "shopping"
  | "salary"
  | "other";

interface Category {
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

interface CategoryWithAnalytics extends Category {
  spent: number;
  transaction_count: number;
  last_transaction_date?: string;
  spending_trend: "increasing" | "decreasing" | "stable";
}

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  category: TransactionCategory; // Legacy support
  category_id: string; // New category reference - now required
  description: string;
}

interface CategoryFormData {
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
interface Budget {
  category: TransactionCategory; // Legacy support
  category_id?: string; // New category reference
  limit: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
  carry_over?: number; // Unused budget from previous period
}

/**
 * Represents spending trend analysis for a category
 */
interface CategoryTrend {
  category: TransactionCategory;
  values: number[]; // Historical spending values
  trend: "increasing" | "decreasing" | "stable";
  forecast: number; // Predicted next value
}

/**
 * Represents the summary of transactions including totals and analysis
 */
interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categorySummary: Record<TransactionCategory, number>;
  budgets?: Budget[];
  trends?: CategoryTrend[];
  forecastedExpenses?: number;
  forecastedSavings?: number;
}

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categorySummary: Record<TransactionCategory, number>;
  budgets: Budget[];
  trends: CategoryTrend[];
  forecastedExpenses: number;
  forecastedSavings: number;
}

interface TableSort {
  column: keyof Transaction;
  direction: "asc" | "desc";
}

interface IListProps {
  selectedDate: Date | null;
  transactions?: Transaction[];
  onFilter?: (filters: TransactionFilters) => void;
  dateRange?: DateRange;
  summary?: FinancialSummary;
  selectedCategory?: TransactionCategory | null;
  onCategoryChange?: (category: TransactionCategory | null) => void;
}

interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  dateRange?: {
    from: Date;
    to: Date;
  };
  searchTerm?: string;
  categories?: TransactionCategory[];
}

interface DateRange {
  from: Date;
  to: Date;
}

interface FinancialInsightsProps {
  summary: FinancialSummary;
  dateRange?: DateRange;
  onCategorySelect?: (category: TransactionCategory) => void;
  previousPeriod?: {
    totalIncome: number;
    totalExpenses: number;
    savings: number;
  };
  timeframe?: "week" | "month" | "year";
}

// Add color theme support for categories
interface CategoryTheme {
  color: string;
  icon?: string;
  label: string;
}

type CategoryThemes = Record<TransactionCategory, CategoryTheme>;

type ViewMode = "day" | "week" | "month";

interface DayCellProps extends DayItem {
  transactionCount?: number;
  transactionSummary?: {
    income: number;
    expense: number;
  };
}

interface SpendingChartProps {
  data: Array<{
    category: string;
    amount: number;
    color: string;
  }>;
  onCategorySelect?: (category: string) => void;
  budgets?: Budget[];
  trends?: CategoryTrend[];
}

interface FinanceProps {
  loaderData: FinanceData & CalendarData;
}

interface FinanceData {
  transactions: Transaction[];
  summary: FinancialSummary;
}

interface ExportResult {
  filename: string;
}
