import { CalendarDays, LineChart, ListIcon } from "lucide-react";
import { lazy, Suspense } from "react";

import type {
  CalendarData,
  Category,
  DateRange,
  FinancialSummary,
  Transaction,
  TransactionCategory,
} from "~/routes/finance/presentation/types";

import { Card } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const TransactionList = lazy(() => import("./transaction-list"));
const Calendar = lazy(() => import("../calendar/calendar-view"));
const TrendAnalysis = lazy(() => import("../analysis/trend-analysis"));

interface TabsViewProps {
  selectedDate: Date | null;
  transactions: Transaction[];
  summary: FinancialSummary;
  dateRange?: DateRange;
  selectedCategory?: TransactionCategory | null;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onDateRangeSelect: (range: DateRange) => void;
  onAddTransaction: (data: Omit<Transaction, "id">) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onCategorySelect: (category: TransactionCategory) => void;
  calendarDetail: CalendarData;
  categories?: Category[];
  useLegacyCategories?: boolean;
}

export default function TabsView({
  selectedDate,
  transactions,
  summary,
  dateRange,
  selectedCategory,
  onDateSelect,
  onMonthChange,
  onDateRangeSelect,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onCategorySelect,
  calendarDetail,
  categories = [],
  useLegacyCategories = true,
}: TabsViewProps) {
  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="w-full justify-start mb-4">
        <TabsTrigger value="list" className="gap-2">
          <ListIcon className="h-4 w-4" />
          List
        </TabsTrigger>
        <TabsTrigger value="calendar" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="trends" className="gap-2">
          <LineChart className="h-4 w-4" />
          Trends
        </TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="mt-0">
        <Suspense
          fallback={
            <Card className="h-[400px] animate-pulse bg-muted rounded-lg" />
          }
        >
          <TransactionList
            selectedDate={selectedDate}
            transactions={transactions}
            summary={summary}
            onAddTransaction={onAddTransaction}
            onEditTransaction={onEditTransaction}
            onDeleteTransaction={onDeleteTransaction}
            categories={categories}
            useLegacyCategories={useLegacyCategories}
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="calendar" className="mt-0">
        <Suspense
          fallback={
            <Card className="h-[400px] animate-pulse bg-muted rounded-lg" />
          }
        >
          <Calendar
            calendarDetail={calendarDetail}
            selectedDate={selectedDate}
            currentViewDate={selectedDate || new Date()}
            onDateSelect={onDateSelect}
            onMonthChange={onMonthChange}
            onDateRangeSelect={onDateRangeSelect}
            transactions={transactions}
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="trends" className="mt-0">
        <Suspense
          fallback={
            <Card className="h-[400px] animate-pulse bg-muted rounded-lg" />
          }
        >
          <TrendAnalysis
            trends={summary.trends}
            onCategorySelect={onCategorySelect}
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
