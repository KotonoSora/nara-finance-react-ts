/**
 * Analyzes transactions for a specific date and returns summary statistics
 * @param date - Target date to analyze
 * @param transactions - Array of transactions to analyze
 * @returns Object containing transaction count and financial totals, or null if no transactions exist
 * @throws {Error} If date or transactions parameters are invalid
 * @example
 * ```ts
 * const summary = getTransactionSummaryForDate(new Date(), transactions)
 * console.log(`Total income: ${summary?.summary.income ?? 0}`)
 * console.log(`Total expenses: ${summary?.summary.expense ?? 0}`)
 * ```
 */
export function getTransactionSummaryForDate(
  date: Date,
  transactions: Transaction[],
) {
  const dayTransactions = transactions.filter(
    (t) => t.date.toDateString() === date.toDateString(),
  );

  if (dayTransactions.length === 0) return null;

  return {
    count: dayTransactions.length,
    summary: {
      income: dayTransactions.reduce(
        (sum, t) => sum + (t.type === "income" ? t.amount : 0),
        0,
      ),
      expense: dayTransactions.reduce(
        (sum, t) => sum + (t.type === "expense" ? t.amount : 0),
        0,
      ),
    },
  };
}
