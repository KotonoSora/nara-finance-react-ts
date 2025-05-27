/**
 * Transaction Service - Domain Layer
 *
 * This service contains business logic for transaction analysis and processing.
 * It implements core domain rules for transaction aggregation, filtering, and analysis.
 *
 * @layer Domain
 * @category Services
 */

import type {
  DailyTransactionSummary,
  Transaction,
  TransactionAnalysis,
} from "~/routes/finance/domain/types/transaction.types";
import type { TransactionType } from "~/routes/finance/domain/value-objects/finance-constants";

import { FinancialAmount } from "~/routes/finance/domain/value-objects/financial-amount";
import { validateBusinessRules } from "~/routes/finance/domain/value-objects/validation";

/**
 * Transaction Service Class
 *
 * Provides domain-level business logic for transaction analysis and processing.
 * All methods include proper business rule validation and use FinancialAmount for precision.
 */
export class TransactionService {
  /**
   * Analyzes transactions for a specific date and returns summary statistics
   *
   * @param date - Target date to analyze
   * @param transactions - Array of transactions to analyze
   * @returns Transaction summary for the date, or null if no transactions exist
   * @throws {Error} If date or transactions parameters are invalid
   *
   * @example
   * ```ts
   * const service = new TransactionService();
   * const summary = service.getTransactionSummaryForDate(new Date(), transactions);
   * if (summary) {
   *   console.log(`Total income: ${summary.summary.income}`);
   *   console.log(`Total expenses: ${summary.summary.expense}`);
   * }
   * ```
   */
  getTransactionSummaryForDate(
    date: Date,
    transactions: Transaction[],
  ): DailyTransactionSummary | null {
    // Validate inputs
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid date parameter");
    }

    if (!Array.isArray(transactions)) {
      throw new Error("Transactions must be an array");
    }

    // Filter transactions for the specific date
    const dayTransactions = transactions.filter((transaction) => {
      if (!transaction.date || !(transaction.date instanceof Date)) {
        return false;
      }
      return transaction.date.toDateString() === date.toDateString();
    });

    if (dayTransactions.length === 0) {
      return null;
    }

    // Calculate financial totals with precision
    const income = new FinancialAmount(0);
    const expense = new FinancialAmount(0);

    for (const transaction of dayTransactions) {
      const amount = new FinancialAmount(transaction.amount);

      if (transaction.type === "income") {
        income.add(amount);
      } else if (transaction.type === "expense") {
        expense.add(amount);
      }
    }

    const net = income.subtract(expense);

    return {
      count: dayTransactions.length,
      summary: {
        income: income.toNumber(),
        expense: expense.toNumber(),
        net: net.toNumber(),
      },
      transactions: dayTransactions,
    };
  }

  /**
   * Performs comprehensive analysis of a transaction set
   *
   * @param transactions - Transactions to analyze
   * @returns Detailed analysis including totals, averages, and breakdowns
   * @throws {Error} If transactions are invalid
   */
  analyzeTransactions(transactions: Transaction[]): TransactionAnalysis {
    if (!Array.isArray(transactions)) {
      throw new Error("Transactions must be an array");
    }

    // Validate all transactions
    for (const transaction of transactions) {
      const validation = validateBusinessRules.transaction({
        amount: transaction.amount,
        description: transaction.description,
        type: transaction.type,
        date: transaction.date,
        categoryId: transaction.category_id,
      });
      if (!validation.isValid) {
        throw new Error(`Invalid transaction: ${validation.errors.join(", ")}`);
      }
    }

    // Separate by type
    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense",
    );

    // Calculate totals
    const totalIncome = incomeTransactions.reduce(
      (sum, t) => sum.add(new FinancialAmount(t.amount)),
      new FinancialAmount(0),
    );

    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum.add(new FinancialAmount(t.amount)),
      new FinancialAmount(0),
    );

    const netAmount = totalIncome.subtract(totalExpenses);

    // Calculate average
    const totalAmount = totalIncome.add(totalExpenses);
    const averageAmount =
      transactions.length > 0
        ? totalAmount.divide(new FinancialAmount(transactions.length))
        : new FinancialAmount(0);

    // Find largest transaction
    const largestTransaction = transactions.reduce<Transaction | null>(
      (largest, current) => {
        if (!largest) return current;
        return current.amount > largest.amount ? current : largest;
      },
      null,
    );

    // Category breakdown
    const categoryBreakdown = new Map<string, FinancialAmount>();
    for (const transaction of transactions) {
      const category = transaction.category_id;
      const existing =
        categoryBreakdown.get(category) || new FinancialAmount(0);
      categoryBreakdown.set(
        category,
        existing.add(new FinancialAmount(transaction.amount)),
      );
    }

    return {
      totalTransactions: transactions.length,
      incomeTransactions,
      expenseTransactions,
      totalIncome,
      totalExpenses,
      netAmount,
      averageAmount,
      largestTransaction,
      categoryBreakdown,
    };
  }

  /**
   * Filters transactions by date range
   *
   * @param transactions - Transactions to filter
   * @param startDate - Start date (inclusive)
   * @param endDate - End date (inclusive)
   * @returns Filtered transactions
   */
  filterByDateRange(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
  ): Transaction[] {
    if (startDate > endDate) {
      throw new Error("Start date must be before or equal to end date");
    }

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  /**
   * Filters transactions by type
   *
   * @param transactions - Transactions to filter
   * @param type - Transaction type to filter by
   * @returns Filtered transactions
   */
  filterByType(
    transactions: Transaction[],
    type: TransactionType,
  ): Transaction[] {
    return transactions.filter((transaction) => transaction.type === type);
  }

  /**
   * Filters transactions by category
   *
   * @param transactions - Transactions to filter
   * @param category - Category ID to filter by
   * @returns Filtered transactions
   */
  filterByCategory(
    transactions: Transaction[],
    category: string,
  ): Transaction[] {
    return transactions.filter(
      (transaction) => transaction.category_id === category,
    );
  }

  /**
   * Groups transactions by category
   *
   * @param transactions - Transactions to group
   * @returns Map of category ID to transactions
   */
  groupByCategory(transactions: Transaction[]): Map<string, Transaction[]> {
    const groups = new Map<string, Transaction[]>();

    for (const transaction of transactions) {
      const category = transaction.category_id;
      const existing = groups.get(category) || [];
      groups.set(category, [...existing, transaction]);
    }

    return groups;
  }

  /**
   * Groups transactions by month
   *
   * @param transactions - Transactions to group
   * @returns Map of month key (YYYY-MM) to transactions
   */
  groupByMonth(transactions: Transaction[]): Map<string, Transaction[]> {
    const groups = new Map<string, Transaction[]>();

    for (const transaction of transactions) {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      const existing = groups.get(monthKey) || [];
      groups.set(monthKey, [...existing, transaction]);
    }

    return groups;
  }
}

/**
 * Singleton instance for convenience
 */
export const transactionService = new TransactionService();
