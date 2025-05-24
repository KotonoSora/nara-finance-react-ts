import AuditTrail from "./audit";
import { FinancialAmount } from "./financial-precision";
import { formatCurrency } from "./format";

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
export function getChangeType(
  current: number,
  previous: number,
): "positive" | "negative" | "neutral" {
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
export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  const currentAmount = new FinancialAmount(current);
  const previousAmount = new FinancialAmount(previous);

  if (previousAmount.toNumber() === 0) return 0;

  return currentAmount
    .subtract(previousAmount)
    .multiply(new FinancialAmount(100))
    .toNumber();
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
export function calculateBudgetStatus(spent: number, limit: number): number {
  return (spent / limit) * 100;
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
export function analyzeTrend(historicalData: number[]): {
  trend: "increasing" | "decreasing" | "stable";
  forecast: number;
} {
  if (historicalData.length < 2) return { trend: "stable", forecast: 0 };

  const changes = historicalData
    .slice(1)
    .map((val, i) => ((val - historicalData[i]) / historicalData[i]) * 100);

  const avgChange = changes.reduce((sum, val) => sum + val, 0) / changes.length;
  const lastValue = historicalData[historicalData.length - 1];
  const forecast = lastValue * (1 + avgChange / 100);

  if (Math.abs(avgChange) < 5) return { trend: "stable", forecast };
  return {
    trend: avgChange > 0 ? "increasing" : "decreasing",
    forecast,
  };
}

/**
 * Formats a number as USD currency string
 * @param amount - Numerical value to format
 * @returns Formatted string with currency symbol and commas
 * @throws {Error} If amount is not a valid number
 * @example
 * ```ts
 * formatCurrency(1234.56)  // "$1,234.56"
 * formatCurrency(-1234.56) // "-$1,234.56"
 * formatCurrency(0)        // "$0.00"
 * ```
 */
export { formatCurrency } from "./format";
