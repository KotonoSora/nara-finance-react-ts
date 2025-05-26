import clsx from "clsx";
import { format, startOfMonth } from "date-fns";

import type { FinancialInsightsProps } from "~/routes/finance/types/finance";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getChangeType } from "~/routes/finance/domain/utilities/financial-analysis.utils";
import SpendingChart from "~/routes/finance/presentation/components/transactions/spending-chart";
import { getCategoryColor } from "~/routes/finance/presentation/utils/ui-helpers";

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
      <div className="flex items-center gap-1 text-[10px] sm:text-xs ml-1 sm:ml-2">
        <div
          className={clsx(
            "px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
            {
              "bg-chart-2/10 text-chart-2 border border-chart-2/20":
                changeType === "positive",
              "bg-destructive/10 text-destructive border border-destructive/20":
                changeType === "negative",
              "bg-chart-4/10 text-chart-4 border border-chart-4/20":
                changeType === "neutral",
            },
          )}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
        </div>
        <span className="text-muted-foreground hidden sm:inline">
          vs last period
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-1">
      <h3 className="text-base sm:text-lg font-semibold px-1">
        {getDateRangeText()}
      </h3>
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="hover:shadow-md transition-all duration-200 border-border/50">
          <CardHeader className="pb-1.5 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium flex flex-col sm:flex-row sm:items-center">
              <span>Total Income</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground sm:ml-2">
                This period
              </span>
              {previousPeriod &&
                getPercentageChange(
                  summary.totalIncome,
                  previousPeriod.totalIncome,
                )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-chart-2">
              ${summary.totalIncome.toFixed(2)}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              {getDateRangeText()}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 border-border/50">
          <CardHeader className="pb-1.5 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium flex flex-col sm:flex-row sm:items-center">
              <span>Total Expenses</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground sm:ml-2">
                This period
              </span>
              {previousPeriod &&
                getPercentageChange(
                  summary.totalExpenses,
                  previousPeriod.totalExpenses,
                )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-destructive">
              ${summary.totalExpenses.toFixed(2)}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              {getDateRangeText()}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 border-border/50 sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-1.5 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium flex flex-col sm:flex-row sm:items-center">
              <span>Savings</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground sm:ml-2">
                This period
              </span>
              {previousPeriod &&
                getPercentageChange(summary.savings, previousPeriod.savings)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-chart-1">
              ${summary.savings.toFixed(2)}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              {getDateRangeText()}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-full border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-4 md:px-6 border-b border-border/50">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-foreground gap-2 sm:gap-0">
            <span className="text-sm sm:text-base">Spending by Category</span>
            <Select
              defaultValue="month"
              onValueChange={(val) => console.log(val)}
            >
              <SelectTrigger className="h-8 w-full sm:w-[120px] border-border/50 text-xs sm:text-sm">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent className="border-border/50">
                <SelectItem value="week" className="text-xs sm:text-sm">
                  This Week
                </SelectItem>
                <SelectItem value="month" className="text-xs sm:text-sm">
                  This Month
                </SelectItem>
                <SelectItem value="year" className="text-xs sm:text-sm">
                  This Year
                </SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 md:px-6 p-3 sm:p-4 md:p-6 pt-3 sm:pt-4">
          <div className="h-[240px] sm:h-[280px] md:h-[300px]">
            <SpendingChart
              data={chartData}
              onCategorySelect={onCategorySelect}
              budgets={summary.budgets}
              trends={summary.trends}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
