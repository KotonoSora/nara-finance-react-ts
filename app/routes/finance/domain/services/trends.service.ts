import {
  endOfMonth,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from "date-fns";

import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { CategoryTrend } from "~/routes/finance/domain/types/analytics.types";

/**
 * Domain service for analyzing spending trends and forecasting
 */
export class TrendsService {
  /**
   * Calculate monthly total for a specific category
   */
  private static calculateMonthlyTotal(
    transactions: Transaction[],
    categoryId: string,
    month: Date,
  ): number {
    const start = startOfMonth(month);
    const end = endOfMonth(month);

    return transactions
      .filter(
        (t) =>
          t.category_id === categoryId &&
          t.type === "expense" &&
          isWithinInterval(new Date(t.date), { start, end }),
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Calculate forecast using simple linear regression
   */
  private static calculateForecast(values: number[]): number {
    if (values.length < 2) return values[0] || 0;

    // Simple moving average with trend adjustment
    const recent = values.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;

    // Calculate trend slope from last 3 months
    if (recent.length >= 3) {
      const slope = (recent[2] - recent[0]) / 2; // Change per month
      return Math.max(0, avg + slope);
    }

    return avg;
  }

  /**
   * Analyze spending trends for all categories
   */
  static analyzeTrends(
    transactions: Transaction[],
    monthsToAnalyze: number = 6,
  ): CategoryTrend[] {
    const now = new Date();
    const categories = Array.from(
      new Set(transactions.map((t) => t.category_id)),
    );
    return categories.map((category_id) => {
      const values = Array.from({ length: monthsToAnalyze }, (_, i) => {
        const monthDate = subMonths(now, i);
        return this.calculateMonthlyTotal(transactions, category_id, monthDate);
      }).reverse(); // Most recent last

      // Simple trend analysis using moving averages
      const recent = values.slice(-3);
      const earlier = values.slice(-6, -3);

      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const earlierAvg =
        earlier.length > 0
          ? earlier.reduce((a, b) => a + b, 0) / earlier.length
          : recentAvg;

      let trend: "increasing" | "decreasing" | "stable";
      const changePct =
        earlierAvg > 0 ? ((recentAvg - earlierAvg) / earlierAvg) * 100 : 0;

      if (Math.abs(changePct) < 5) {
        trend = "stable";
      } else {
        trend = changePct > 0 ? "increasing" : "decreasing";
      }

      // Simple forecast using linear regression on recent values
      const forecast = this.calculateForecast(values);

      return { category_id, values, trend, forecast };
    });
  }

  /**
   * Get human-readable trend summary
   */
  static getTrendSummary(trend: CategoryTrend): string {
    const lastValue = trend.values[trend.values.length - 1] || 0;
    const changePercent =
      lastValue > 0 ? ((trend.forecast - lastValue) / lastValue) * 100 : 0;

    switch (trend.trend) {
      case "increasing":
        return `Spending is trending up. Forecast suggests a ${Math.abs(changePercent).toFixed(1)}% increase next month.`;
      case "decreasing":
        return `Spending is trending down. Forecast suggests a ${Math.abs(changePercent).toFixed(1)}% decrease next month.`;
      case "stable":
        return "Spending has been stable. Little change expected next month.";
    }
  }
}

// Export methods for backward compatibility
export const analyzeTrends = TrendsService.analyzeTrends;
export const getTrendSummary = TrendsService.getTrendSummary;
