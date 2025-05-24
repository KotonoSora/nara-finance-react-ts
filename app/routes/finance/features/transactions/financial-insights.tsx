import clsx from "clsx";
import { format, startOfMonth } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import SpendingChart from "~/routes/finance/features/transactions/spending-chart";
import { getCategoryColor } from "~/routes/finance/shared/utils/categories";
import { getChangeType } from "~/routes/finance/shared/utils/finance";

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
          className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", {
            "bg-chart-2/10 text-chart-2 border border-chart-2/20":
              changeType === "positive",
            "bg-destructive/10 text-destructive border border-destructive/20":
              changeType === "negative",
            "bg-chart-4/10 text-chart-4 border border-chart-4/20":
              changeType === "neutral",
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
        <Card className="hover:shadow-md transition-all duration-200 border-border/50">
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
            <div className="text-2xl font-bold text-chart-2">
              ${summary.totalIncome.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getDateRangeText()}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 border-border/50">
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
            <div className="text-2xl font-bold text-destructive">
              ${summary.totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getDateRangeText()}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 border-border/50">
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
            <div className="text-2xl font-bold text-chart-1">
              ${summary.savings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getDateRangeText()}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-full border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-4 px-4 md:px-6 border-b border-border/50">
          <CardTitle className="flex items-center justify-between text-foreground">
            Spending by Category
            <Select
              defaultValue="month"
              onValueChange={(val) => console.log(val)}
            >
              <SelectTrigger className="h-8 w-[120px] border-border/50">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent className="border-border/50">
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="h-[300px]">
            <SpendingChart
              data={chartData}
              onCategorySelect={
                onCategorySelect
                  ? (category: string) =>
                      onCategorySelect(category as TransactionCategory)
                  : undefined
              }
              budgets={summary.budgets}
              trends={summary.trends}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
