import { Plus } from "lucide-react";
import { lazy, Suspense, useState } from "react";

import type { Route } from "./+types/finance";

import { Button } from "~/components/ui/button";
import { prepareCalendarData } from "~/finance/shared/utils/calendar";
import { MOCK_DATA } from "~/finance/shared/utils/mock";

const BudgetSection = lazy(
  () => import("~/finance/features/analysis/budget-section"),
);
const IncomeExpenseChart = lazy(
  () => import("~/finance/features/analysis/income-expense-chart"),
);
const TrendAnalysis = lazy(
  () => import("~/finance/features/analysis/trend-analysis"),
);
const Calendar = lazy(
  () => import("~/finance/features/calendar/calendar-view"),
);
const List = lazy(
  () => import("~/finance/features/transactions/transaction-list"),
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finance" },
    { name: "description", content: "Finance Page Demo!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const calendarData = prepareCalendarData();

  return {
    ...calendarData,
    transactions: MOCK_DATA.transactions,
    summary: MOCK_DATA.summary,
  };
}

export default function FinanceDemo({ loaderData }: Route.ComponentProps) {
  const { transactions, summary, nowDate } = loaderData;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentViewDate, setCurrentViewDate] = useState<Date>(nowDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentViewDate(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1440px] mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Finance
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your transactions and track your spending
            </p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        <div className="grid lg:grid-cols-[_2fr_3fr] md:grid-cols-1 gap-4 md:gap-6">
          <aside className="space-y-4 md:space-y-6">
            <Suspense
              fallback={
                <div className="h-[400px] animate-pulse bg-muted rounded-lg" />
              }
            >
              <Calendar
                calendarDetail={loaderData}
                selectedDate={selectedDate}
                currentViewDate={currentViewDate}
                onDateSelect={handleDateSelect}
                onMonthChange={handleMonthChange}
                transactions={transactions}
              />
            </Suspense>
            <Suspense
              fallback={
                <div className="h-[200px] animate-pulse bg-muted rounded-lg" />
              }
            >
              <BudgetSection budgets={summary.budgets} />
            </Suspense>
          </aside>
          <main className="space-y-4 md:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <Suspense
                fallback={
                  <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
                }
              >
                <IncomeExpenseChart summary={summary} />
              </Suspense>
              <Suspense
                fallback={
                  <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
                }
              >
                <TrendAnalysis trends={summary.trends} />
              </Suspense>
            </div>
            <Suspense
              fallback={
                <div className="h-[400px] animate-pulse bg-muted rounded-lg" />
              }
            >
              <List
                selectedDate={selectedDate}
                transactions={transactions}
                summary={summary}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
