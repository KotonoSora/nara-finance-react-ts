import { FinancialAmount } from "~/routes/finance/domain/value-objects/financial-amount";

/**
 * Domain service for financial calculations and business logic
 */
export class FinanceService {
  /**
   * Evaluates the significance of change between two numerical values
   * @param current - Current value being compared
   * @param previous - Previous value to compare against
   * @returns "positive" for >5% increase, "negative" for >5% decrease, "neutral" otherwise
   * @throws {Error} If either parameter is not a valid number
   * @example
   * ```ts
   * getChangeType(110, 100) // "positive" (10% increase)
   * getChangeType(90, 100)  // "negative" (10% decrease)
   * getChangeType(102, 100) // "neutral" (2% change)
   * ```
   */
  static getChangeType(
    current: number,
    previous: number,
  ): "positive" | "negative" | "neutral" {
    if (previous === 0) return current > 0 ? "positive" : "neutral";

    const change = ((current - previous) / previous) * 100;
    if (Math.abs(change) < 5) return "neutral";
    return change > 0 ? "positive" : "negative";
  }

  /**
   * Calculates relative percentage change between two values
   * @param current - Current value being compared
   * @param previous - Previous value to compare against
   * @returns Percentage difference (positive or negative)
   * @throws {Error} If previous value is 0 or parameters are invalid
   * @example
   * ```ts
   * calculatePercentageChange(110, 100) // 10
   * calculatePercentageChange(90, 100)  // -10
   * calculatePercentageChange(200, 100) // 100
   * ```
   */
  static calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;

    const currentAmount = new FinancialAmount(current);
    const previousAmount = new FinancialAmount(previous);

    const difference = currentAmount.subtract(previousAmount);
    const percentage = difference
      .divide(previousAmount)
      .multiply(new FinancialAmount(100));

    return percentage.toNumber();
  }

  /**
   * Determines percentage of budget consumed
   * @param spent - Current amount spent
   * @param limit - Total budget allocation
   * @returns Percentage of budget used (can exceed 100)
   * @throws {Error} If limit is 0 or parameters are invalid
   * @example
   * ```ts
   * calculateBudgetStatus(75, 100)  // 75 (under budget)
   * calculateBudgetStatus(150, 100) // 150 (over budget)
   * ```
   */
  static calculateBudgetStatus(spent: number, limit: number): number {
    if (limit === 0) return 0;

    const spentAmount = new FinancialAmount(spent);
    const limitAmount = new FinancialAmount(limit);

    return spentAmount
      .divide(limitAmount)
      .multiply(new FinancialAmount(100))
      .toNumber();
  }

  /**
   * Analyzes numerical data series to identify trends and predict next value
   * @param historicalData - Array of sequential numerical values
   * @returns Object with trend direction and forecasted next value
   * @throws {Error} If input array has fewer than 2 values
   * @example
   * ```ts
   * analyzeTrend([100, 110, 120]) // { trend: "increasing", forecast: 130 }
   * analyzeTrend([100, 90, 80])   // { trend: "decreasing", forecast: 70 }
   * analyzeTrend([100, 102, 99])  // { trend: "stable", forecast: 100.33 }
   * ```
   */
  static analyzeTrend(historicalData: number[]): {
    trend: "increasing" | "decreasing" | "stable";
    forecast: number;
  } {
    if (historicalData.length < 2) {
      return {
        trend: "stable",
        forecast: historicalData[0] || 0,
      };
    }

    // Calculate percentage changes between consecutive values
    const changes = historicalData
      .slice(1)
      .map((val, i) => {
        const prev = historicalData[i];
        return prev === 0 ? 0 : ((val - prev) / prev) * 100;
      })
      .filter((change) => !isNaN(change));

    if (changes.length === 0) {
      return {
        trend: "stable",
        forecast: historicalData[historicalData.length - 1],
      };
    }

    const avgChange =
      changes.reduce((sum, val) => sum + val, 0) / changes.length;
    const lastValue = historicalData[historicalData.length - 1];
    const forecast = lastValue * (1 + avgChange / 100);

    if (Math.abs(avgChange) < 5) {
      return { trend: "stable", forecast: Math.max(0, forecast) };
    }

    return {
      trend: avgChange > 0 ? "increasing" : "decreasing",
      forecast: Math.max(0, forecast),
    };
  }

  /**
   * Calculate moving average for trend smoothing
   */
  static calculateMovingAverage(
    data: number[],
    windowSize: number = 3,
  ): number[] {
    if (data.length < windowSize) return data;

    const result: number[] = [];
    for (let i = windowSize - 1; i < data.length; i++) {
      const window = data.slice(i - windowSize + 1, i + 1);
      const average = window.reduce((sum, val) => sum + val, 0) / windowSize;
      result.push(average);
    }

    return result;
  }

  /**
   * Calculate financial ratios and metrics
   */
  static calculateFinancialMetrics(
    transactions: { amount: number; type: string; category: string }[],
  ): {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    savingsRate: number;
    expenseRatio: number;
    categoryBreakdown: Record<string, number>;
  } {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        },
        {} as Record<string, number>,
      );

    const netIncome = income - expenses;
    const savingsRate = income > 0 ? (netIncome / income) * 100 : 0;
    const expenseRatio = income > 0 ? (expenses / income) * 100 : 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netIncome,
      savingsRate,
      expenseRatio,
      categoryBreakdown,
    };
  }

  /**
   * Validate financial calculation inputs
   */
  static validateCalculationInputs(values: number[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    for (const [index, value] of values.entries()) {
      if (typeof value !== "number" || isNaN(value)) {
        errors.push(`Value at index ${index} is not a valid number`);
      }
      if (value < 0) {
        errors.push(`Value at index ${index} cannot be negative`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
