import { endOfMonth, isWithinInterval, startOfMonth } from "date-fns";

type WarningLevel = "safe" | "warning" | "danger";

export function updateBudgets(
  budgets: Budget[],
  transactions: Transaction[],
): Budget[] {
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  return budgets.map((budget) => {
    const spent = transactions
      .filter(
        (t) =>
          t.category === budget.category &&
          t.type === "expense" &&
          isWithinInterval(t.date, {
            start: firstDayOfMonth,
            end: lastDayOfMonth,
          }),
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...budget,
      spent,
    };
  });
}

export function getBudgetWarningLevel(budget: Budget): WarningLevel {
  const spentPercentage = (budget.spent / budget.limit) * 100;

  if (spentPercentage >= 100) {
    return "danger";
  } else if (spentPercentage >= 80) {
    return "warning";
  }
  return "safe";
}

export function calculateRemainingBudget(budget: Budget): number {
  return Math.max(0, budget.limit - budget.spent);
}

export function getBudgetStatusMessage(budget: Budget): string {
  const remaining = calculateRemainingBudget(budget);
  const warningLevel = getBudgetWarningLevel(budget);
  const spentPercentage = (budget.spent / budget.limit) * 100;

  switch (warningLevel) {
    case "danger":
      return `Over budget by $${(budget.spent - budget.limit).toFixed(2)} (${Math.floor(spentPercentage)}%)`;
    case "warning":
      return `$${remaining.toFixed(2)} remaining (${Math.floor(spentPercentage)}% used)`;
    case "safe":
      return `$${remaining.toFixed(2)} remaining (${Math.floor(spentPercentage)}% used)`;
  }
}

export function getDefaultBudget(category: TransactionCategory): Budget {
  const defaultLimits: Record<TransactionCategory, number> = {
    food: 500,
    transport: 200,
    shopping: 300,
    salary: 0, // Income category
    other: 200,
  };

  return {
    category,
    limit: defaultLimits[category],
    spent: 0,
    period: "monthly",
  };
}

export function getBudgetRecommendation(
  budget: Budget,
  trends: CategoryTrend[],
): string {
  const trend = trends.find((t) => t.category === budget.category);
  if (!trend) return "";

  const warningLevel = getBudgetWarningLevel(budget);
  const forecastedSpending = trend.forecast;
  const spentPercentage = (budget.spent / budget.limit) * 100;

  if (warningLevel === "danger") {
    const recommendedIncrease =
      Math.ceil((forecastedSpending - budget.limit) / 50) * 50;
    if (recommendedIncrease > 0) {
      return `Consider increasing budget by $${recommendedIncrease} based on spending trends.`;
    }
  } else if (warningLevel === "safe" && spentPercentage < 50) {
    const recommendedDecrease =
      Math.floor((budget.limit - forecastedSpending) / 50) * 50;
    if (recommendedDecrease > 0) {
      return `You might reduce this budget by $${recommendedDecrease} based on typical spending.`;
    }
  }

  return trend.trend === "increasing"
    ? "Spending in this category is trending upward."
    : trend.trend === "decreasing"
      ? "Spending in this category is trending downward."
      : "Spending in this category is stable.";
}
