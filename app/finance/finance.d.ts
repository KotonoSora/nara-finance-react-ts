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

interface ICalendarDetail {
  nowDate: Date;
  currentYear: number;
  currentMonth: number;
  currentDate: number;
  daysOfWeek: string[];
}

interface ICalendarProps {
  calendarDetail: ICalendarDetail;
  selectedDate: Date | null;
  currentViewDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  getTransactionSummary?: (date: Date) => {
    count: number;
    summary: {
      income: number;
      expense: number;
    };
  } | null;
  onDateRangeSelect?: (range: DateRange) => void;
}

type TransactionType = "income" | "expense" | "investment";
type TransactionCategory =
  | "food"
  | "transport"
  | "shopping"
  | "salary"
  | "other";

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
}

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categorySummary: Record<TransactionCategory, number>;
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
}
