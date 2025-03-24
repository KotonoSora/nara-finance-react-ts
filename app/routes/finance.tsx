import { Plus } from "lucide-react";
import { useState } from "react";

import type { Route } from "./+types/finance";

import { Button } from "~/components/ui/button";
import BudgetSection from "~/finance/features/analysis/budget-section";
import IncomeExpenseChart from "~/finance/features/analysis/income-expense-chart";
import TrendAnalysis from "~/finance/features/analysis/trend-analysis";
import Calendar from "~/finance/features/calendar/calendar-view";
import List from "~/finance/features/transactions/transaction-list";
import { MOCK_DATA } from "~/finance/shared/utils/mock";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finance" },
    { name: "description", content: "Finance Page Demo!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const nowDate = new Date();
  const currentYear: number = nowDate.getFullYear();
  const currentMonth: number = nowDate.getMonth();
  const currentDate: number = nowDate.getDate();

  const daysOfWeek: string[] = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  return { nowDate, currentYear, currentMonth, currentDate, daysOfWeek };
}

export default function Finance({ loaderData }: Route.ComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentViewDate, setCurrentViewDate] = useState<Date>(
    loaderData.nowDate,
  );

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
            <Calendar
              calendarDetail={loaderData}
              selectedDate={selectedDate}
              currentViewDate={currentViewDate}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
              transactions={MOCK_DATA.transactions}
            />
            <BudgetSection budgets={MOCK_DATA.summary.budgets} />
          </aside>
          <main className="space-y-4 md:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <IncomeExpenseChart summary={MOCK_DATA.summary} />
              <TrendAnalysis trends={MOCK_DATA.summary.trends} />
            </div>
            <List
              selectedDate={selectedDate}
              transactions={MOCK_DATA.transactions}
              summary={MOCK_DATA.summary}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
