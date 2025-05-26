import { FinancialAmount } from "~/routes/finance/domain/value-objects/financial-amount";

/**
 * Financial analysis utilities for domain logic
 */
export class FinancialAnalysisUtils {
  /**
   * Evaluates the significance of change between two numerical values
   * @param current - Current value being compared
   * @param previous - Previous value to compare against
   * @returns "positive" for >5% increase, "negative" for >5% decrease, "neutral" otherwise
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
   */
  static calculatePercentageChange(current: number, previous: number): number {
    const currentAmount = new FinancialAmount(current);
    const previousAmount = new FinancialAmount(previous);

    if (previousAmount.toNumber() === 0) return 0;

    return currentAmount
      .subtract(previousAmount)
      .divide(previousAmount)
      .multiply(new FinancialAmount(100))
      .toNumber();
  }

  /**
   * Calculates growth rate over a period
   * @param values - Array of numerical values over time
   * @returns Average growth rate percentage
   */
  static calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;

    let totalGrowthRate = 0;
    let validPeriods = 0;

    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] > 0) {
        const periodGrowthRate =
          ((values[i] - values[i - 1]) / values[i - 1]) * 100;
        totalGrowthRate += periodGrowthRate;
        validPeriods++;
      }
    }

    return validPeriods > 0 ? totalGrowthRate / validPeriods : 0;
  }

  /**
   * Determines trend direction based on data points
   * @param values - Array of numerical values over time
   * @returns Trend direction: "up", "down", or "stable"
   */
  static getTrendDirection(values: number[]): "up" | "down" | "stable" {
    if (values.length < 2) return "stable";

    const growthRate = this.calculateGrowthRate(values);

    if (Math.abs(growthRate) < 3) return "stable";
    return growthRate > 0 ? "up" : "down";
  }

  /**
   * Calculates volatility (standard deviation) of values
   * @param values - Array of numerical values
   * @returns Volatility as a percentage
   */
  static calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;

    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const squaredDifferences = values.map((value) => Math.pow(value - mean, 2));
    const variance =
      squaredDifferences.reduce((sum, diff) => sum + diff, 0) / values.length;

    return Math.sqrt(variance);
  }

  /**
   * Calculates moving average for trend smoothing
   * @param values - Array of numerical values
   * @param windowSize - Size of the moving window
   * @returns Array of moving averages
   */
  static calculateMovingAverage(
    values: number[],
    windowSize: number = 3,
  ): number[] {
    if (values.length < windowSize) return values;

    const movingAverages: number[] = [];

    for (let i = windowSize - 1; i < values.length; i++) {
      const window = values.slice(i - windowSize + 1, i + 1);
      const average =
        window.reduce((sum, value) => sum + value, 0) / windowSize;
      movingAverages.push(average);
    }

    return movingAverages;
  }
}

// Legacy compatibility functions
export const getChangeType = FinancialAnalysisUtils.getChangeType;
export const calculatePercentageChange =
  FinancialAnalysisUtils.calculatePercentageChange;
export const calculateGrowthRate = FinancialAnalysisUtils.calculateGrowthRate;
export const getTrendDirection = FinancialAnalysisUtils.getTrendDirection;
export const calculateVolatility = FinancialAnalysisUtils.calculateVolatility;
export const calculateMovingAverage =
  FinancialAnalysisUtils.calculateMovingAverage;
