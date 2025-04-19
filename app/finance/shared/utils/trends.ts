import { isWithinInterval, startOfMonth, subMonths } from "date-fns";

function calculateMonthlyTotal(
  transactions: Transaction[],
  category: TransactionCategory,
  month: Date,
): number {
  const start = startOfMonth(month);
  const end = subMonths(startOfMonth(new Date()), -1); // End of the month

  return transactions
    .filter(
      (t) =>
        t.category === category &&
        t.type === "expense" &&
        isWithinInterval(t.date, { start, end }),
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

export function analyzeTrends(
  transactions: Transaction[],
  monthsToAnalyze: number = 6,
): CategoryTrend[] {
  const categories = ["food", "transport", "shopping", "other"] as const;
  const now = new Date();

  return categories.map((category) => {
    const values = Array.from({ length: monthsToAnalyze }, (_, i) => {
      const monthDate = subMonths(now, i);
      return calculateMonthlyTotal(transactions, category, monthDate);
    }).reverse(); // Most recent last

    // Simple trend analysis
    const recent = values.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const prevAvg = values.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;

    let trend: "increasing" | "decreasing" | "stable";
    const changePct = ((avg - prevAvg) / prevAvg) * 100;

    if (Math.abs(changePct) < 5) {
      trend = "stable";
    } else {
      trend = changePct > 0 ? "increasing" : "decreasing";
    }

    // Simple forecast using moving average
    const forecast = Math.max(0, avg * (1 + changePct / 100));

    return {
      category,
      values,
      trend,
      forecast,
    };
  });
}

export function getTrendSummary(trend: CategoryTrend): string {
  const lastValue = trend.values[trend.values.length - 1];
  const changePercent = ((trend.forecast - lastValue) / lastValue) * 100;

  switch (trend.trend) {
    case "increasing":
      return `Spending is trending up. Forecast suggests a ${Math.abs(changePercent).toFixed(1)}% increase next month.`;
    case "decreasing":
      return `Spending is trending down. Forecast suggests a ${Math.abs(changePercent).toFixed(1)}% decrease next month.`;
    case "stable":
      return "Spending has been stable. Little change expected next month.";
  }
}
