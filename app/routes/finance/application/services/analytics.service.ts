import type { Budget } from "~/routes/finance/domain/entities/budget.entity";
import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";

import { FinancialAmount } from "~/routes/finance/domain/value-objects/financial-amount";

export function analyzeBudgetWarningLevel(
  budget: Budget,
): "safe" | "warning" | "danger" {
  const spentPercentage = (budget.spent / budget.limit) * 100;

  if (spentPercentage >= 100) return "danger";
  if (spentPercentage >= 80) return "warning";
  return "safe";
}

export function generateBudgetRecommendation(budget: Budget): string {
  const spentPercentage = (budget.spent / budget.limit) * 100;
  const remaining = new FinancialAmount(budget.limit - budget.spent);
  const daysInPeriod =
    budget.period === "monthly" ? 30 : budget.period === "weekly" ? 7 : 365;
  const dailyRemaining = remaining.divide(new FinancialAmount(daysInPeriod));

  if (spentPercentage >= 100) {
    return `Budget exceeded by ${new FinancialAmount(budget.spent - budget.limit).toString()}`;
  }

  if (spentPercentage >= 80) {
    return `${remaining.toString()} remaining. Consider limiting to ${dailyRemaining.toString()}/day`;
  }

  return `On track with ${remaining.toString()} remaining`;
}

export function analyzeTrends(
  transactions: Transaction[],
  period: "week" | "month" = "month",
) {
  // Group transactions by category
  const categories = new Map<string, number[]>();

  transactions.forEach((transaction) => {
    if (!categories.has(transaction.category_id)) {
      categories.set(transaction.category_id, []);
    }
    categories.get(transaction.category_id)?.push(transaction.amount);
  });
  // Calculate trends for each category
  return Array.from(categories.entries()).map(([category, amounts]) => {
    const avg = new FinancialAmount(
      amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length,
    );
    const trend = determineTrend(amounts);
    const forecast = forecastNextValue(amounts);

    return {
      category_id: category,
      values: amounts,
      trend,
      forecast: new FinancialAmount(forecast).toNumber(),
      average: avg.toNumber(),
    };
  });
}

function determineTrend(
  values: number[],
): "increasing" | "decreasing" | "stable" {
  if (values.length < 2) return "stable";

  const recent = values.slice(-3);
  const firstAvg = average(recent.slice(0, Math.ceil(recent.length / 2)));
  const secondAvg = average(recent.slice(-Math.ceil(recent.length / 2)));

  const change = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (change > 5) return "increasing";
  if (change < -5) return "decreasing";
  return "stable";
}

function forecastNextValue(values: number[]): number {
  if (values.length < 2) return values[0] || 0;

  // Simple moving average forecast
  const recentValues = values.slice(-3);
  return average(recentValues);
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}
