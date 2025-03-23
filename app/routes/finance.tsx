import { Plus } from "lucide-react";
import { useState } from "react";

import type { Route } from "./+types/finance";

import { Button } from "~/components/ui/button";
import Calendar from "~/finance/calendar/calendar";
import List from "~/finance/detail/list";
import { MOCK_DATA } from "~/finance/utils/mock";

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

  const getTransactionSummaryForDate = (date: Date) => {
    const dayTransactions = MOCK_DATA.transactions.filter(
      (t) => t.date.toDateString() === date.toDateString(),
    );

    if (dayTransactions.length === 0) return null;

    return {
      count: dayTransactions.length,
      summary: {
        income: dayTransactions.reduce(
          (sum, t) => sum + (t.type === "income" ? t.amount : 0),
          0,
        ),
        expense: dayTransactions.reduce(
          (sum, t) => sum + (t.type === "expense" ? t.amount : 0),
          0,
        ),
      },
    };
  };

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
          <aside className="h-fit">
            <Calendar
              calendarDetail={loaderData}
              selectedDate={selectedDate}
              currentViewDate={currentViewDate}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
              getTransactionSummary={getTransactionSummaryForDate}
            />
          </aside>
          <main className="w-full">
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
