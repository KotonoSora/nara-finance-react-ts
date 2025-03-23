import clsx from "clsx";
import { format, startOfMonth } from "date-fns";
import { lazy, Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getCategoryColor } from "~/finance/utils/categories";
import { getChangeType } from "~/finance/utils/finance";

const SpendingChart = lazy(() => import("./spending-chart"));

export default function FinancialInsights({
  summary,
  dateRange,
  onCategorySelect,
  previousPeriod,
}: FinancialInsightsProps) {
  const spendingCategories = Object.entries(summary.categorySummary).filter(
    ([category]) => category !== "salary",
  );

  const chartData = spendingCategories.map(([category, amount]) => ({
    category,
    amount,
    color: getCategoryColor(category),
  }));

  const getDateRangeText = () => {
    if (!dateRange?.from || !dateRange?.to) {
      const now = new Date();
      const start = startOfMonth(now);
      return `Showing data for ${format(start, "MMM d")} - ${format(now, "MMM d, yyyy")}`;
    }
    try {
      return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    } catch (error) {
      return "Invalid date range";
    }
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    const changeType = getChangeType(current, previous);

    return (
      <div className="flex items-center gap-1 text-xs ml-2">
        <div
          className={clsx("px-2 py-0.5 rounded-full", {
            "bg-green-100 text-green-700": changeType === "positive",
            "bg-red-100 text-red-700": changeType === "negative",
            "bg-yellow-100 text-yellow-700": changeType === "neutral",
          })}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
        </div>
        <span className="text-muted-foreground">vs last period</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 px-1">
      <h3 className="text-lg font-semibold px-1">{getDateRangeText()}</h3>
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              Total Income
              <span className="text-xs text-muted-foreground ml-2">
                This period
              </span>
              {previousPeriod &&
                getPercentageChange(
                  summary.totalIncome,
                  previousPeriod.totalIncome,
                )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${summary.totalIncome.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getDateRangeText()}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              Total Expenses
              <span className="text-xs text-muted-foreground ml-2">
                This period
              </span>
              {previousPeriod &&
                getPercentageChange(
                  summary.totalExpenses,
                  previousPeriod.totalExpenses,
                )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${summary.totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getDateRangeText()}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              Savings
              <span className="text-xs text-muted-foreground ml-2">
                This period
              </span>
              {previousPeriod &&
                getPercentageChange(summary.savings, previousPeriod.savings)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${summary.savings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getDateRangeText()}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-full">
        <CardHeader className="pb-2 px-4 md:px-6">
          <CardTitle className="flex items-center justify-between">
            Spending by Category
            <Select
              defaultValue="month"
              onValueChange={(val) => console.log(val)}
            >
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="h-[300px]">
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">
                    Loading chart...
                  </div>
                </div>
              }
            >
              <SpendingChart
                data={chartData}
                onCategorySelect={
                  onCategorySelect
                    ? (category: string) =>
                        onCategorySelect(category as TransactionCategory)
                    : undefined
                }
              />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
