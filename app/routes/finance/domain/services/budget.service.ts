import { endOfMonth, isWithinInterval, startOfMonth } from "date-fns";

import type { Budget } from "~/routes/finance/domain/entities/budget.entity";
import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { CategoryTrend } from "~/routes/finance/domain/types/analytics.types";
import type { WarningLevel } from "~/routes/finance/domain/types/budget.types";

/**
 * Domain service for budget calculations and business rules
 */
export class BudgetService {
  /**
   * Update budgets with current month's spending
   */
  static updateBudgets(
    budgets: Budget[],
    transactions: Transaction[],
    referenceDate: Date = new Date(),
  ): Budget[] {
    const firstDayOfMonth = startOfMonth(referenceDate);
    const lastDayOfMonth = endOfMonth(referenceDate);

    return budgets.map((budget) => {
      const spent = transactions
        .filter(
          (t) =>
            t.category_id === budget.category_id &&
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

  /**
   * Get budget warning level based on spending percentage
   */
  static getBudgetWarningLevel(budget: Budget): WarningLevel {
    if (budget.limit <= 0) return "safe";

    const spentPercentage = (budget.spent / budget.limit) * 100;

    if (spentPercentage >= 100) {
      return "danger";
    } else if (spentPercentage >= 80) {
      return "warning";
    }
    return "safe";
  }

  /**
   * Calculate remaining budget amount
   */
  static calculateRemainingBudget(budget: Budget): number {
    return Math.max(0, budget.limit - budget.spent);
  }

  /**
   * Get human-readable budget status message
   */
  static getBudgetStatusMessage(budget: Budget): string {
    const remaining = this.calculateRemainingBudget(budget);
    const warningLevel = this.getBudgetWarningLevel(budget);
    const spentPercentage =
      budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;

    switch (warningLevel) {
      case "danger":
        const overSpent = budget.spent - budget.limit;
        return `Over budget by $${overSpent.toFixed(2)} (${Math.floor(spentPercentage)}%)`;
      case "warning":
        return `$${remaining.toFixed(2)} remaining (${Math.floor(spentPercentage)}% used)`;
      case "safe":
        return `$${remaining.toFixed(2)} remaining (${Math.floor(spentPercentage)}% used)`;
    }
  }

  /**
   * Get default budget for a category based on business rules
   */
  static getDefaultBudget(categoryId: string): Budget {
    // Default budget with zero limit; customize limits externally
    return {
      category_id: categoryId,
      limit: 0,
      spent: 0,
      period: "monthly",
    };
  }

  /**
   * Generate budget recommendation based on spending trends
   */
  static getBudgetRecommendation(
    budget: Budget,
    trends: CategoryTrend[],
  ): string {
    // Find trend by category_id
    const trend = trends.find((t) => t.category_id === budget.category_id);
    if (!trend) return "";

    const warningLevel = this.getBudgetWarningLevel(budget);
    const forecastedSpending = trend.forecast;
    const spentPercentage =
      budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;

    if (warningLevel === "danger") {
      const recommendedIncrease =
        Math.ceil(Math.max(0, forecastedSpending - budget.limit) / 50) * 50;
      if (recommendedIncrease > 0) {
        return `Consider increasing budget by $${recommendedIncrease} based on spending trends.`;
      }
    } else if (warningLevel === "safe" && spentPercentage < 50) {
      const recommendedDecrease =
        Math.floor(Math.max(0, budget.limit - forecastedSpending) / 50) * 50;
      if (recommendedDecrease > 0) {
        return `You might reduce this budget by $${recommendedDecrease} based on typical spending.`;
      }
    }

    // Return simple trend-based recommendation
    if (trend.trend === "increasing") {
      return "Spending in this category is trending upward.";
    } else if (trend.trend === "decreasing") {
      return "Spending in this category is trending downward.";
    }
    return "Spending in this category is stable.";
  }

  /**
   * Validate budget data according to business rules
   */
  static validateBudget(budget: Partial<Budget>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!budget.category_id) {
      errors.push("Budget category_id is required");
    }

    if (typeof budget.limit !== "number") {
      errors.push("Budget limit must be a number");
    } else if (budget.limit < 0) {
      errors.push("Budget limit cannot be negative");
    }

    if (
      budget.period &&
      !["monthly", "weekly", "yearly"].includes(budget.period)
    ) {
      errors.push("Invalid budget period");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate budget utilization percentage
   */
  static calculateUtilization(budget: Budget): number {
    if (budget.limit <= 0) return 0;
    return Math.min(100, (budget.spent / budget.limit) * 100);
  }

  /**
   * Check if budget is exceeded
   */
  static isBudgetExceeded(budget: Budget): boolean {
    return budget.spent > budget.limit;
  }

  /**
   * Get budget performance metrics
   */
  static getBudgetMetrics(budgets: Budget[]): {
    totalBudgeted: number;
    totalSpent: number;
    budgetsExceeded: number;
    averageUtilization: number;
  } {
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const budgetsExceeded = budgets.filter((b) =>
      this.isBudgetExceeded(b),
    ).length;
    const averageUtilization =
      budgets.length > 0
        ? budgets.reduce((sum, b) => sum + this.calculateUtilization(b), 0) /
          budgets.length
        : 0;

    return {
      totalBudgeted,
      totalSpent,
      budgetsExceeded,
      averageUtilization,
    };
  }
}
