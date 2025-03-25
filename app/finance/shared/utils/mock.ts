/**
 * Creates sample transaction data for development and testing
 * @returns Object containing mock transactions and calculated summary statistics
 * @example
 * ```ts
 * const { transactions, summary } = generateMockTransactions()
 * console.log(`Generated ${transactions.length} sample transactions`)
 * console.log(`Total income: ${summary.totalIncome}`)
 * ```
 */
export function generateMockTransactions() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const transactions: Transaction[] = [
    {
      id: "1",
      date: new Date(currentYear, currentMonth, 15),
      amount: 3000,
      type: "income",
      category: "salary",
      description: "Monthly Salary",
    },
    {
      id: "2",
      date: new Date(currentYear, currentMonth, now.getDate()),
      amount: 25.5,
      type: "expense",
      category: "food",
      description: "Lunch at Restaurant",
    },
    {
      id: "3",
      date: new Date(currentYear, currentMonth, now.getDate() - 1),
      amount: 45,
      type: "expense",
      category: "transport",
      description: "Taxi Ride",
    },
    {
      id: "4",
      date: new Date(currentYear, currentMonth, now.getDate() - 2),
      amount: 120,
      type: "expense",
      category: "shopping",
      description: "Groceries",
    },
  ];

  const totalIncome = transactions.reduce(
    (sum, t) => sum + (t.type === "income" ? t.amount : 0),
    0,
  );
  const totalExpenses = transactions.reduce(
    (sum, t) => sum + (t.type === "expense" ? t.amount : 0),
    0,
  );

  const categorySummary: Record<TransactionCategory, number> = {
    food: 0,
    transport: 0,
    shopping: 0,
    salary: 0,
    other: 0,
  };

  transactions.forEach((t) => {
    categorySummary[t.category] += t.amount;
  });

  const budgets: Budget[] = [
    {
      category: "food",
      limit: 500,
      spent: categorySummary.food,
      period: "monthly",
    },
    {
      category: "transport",
      limit: 200,
      spent: categorySummary.transport,
      period: "monthly",
    },
    {
      category: "shopping",
      limit: 1000,
      spent: categorySummary.shopping,
      period: "monthly",
    },
    {
      category: "other",
      limit: 300,
      spent: categorySummary.other,
      period: "monthly",
    },
  ];

  const trends: CategoryTrend[] = [
    {
      category: "food",
      values: [350, 420, 380, categorySummary.food],
      trend: "stable",
      forecast: 400,
    },
    {
      category: "transport",
      values: [150, 180, 160, categorySummary.transport],
      trend: "increasing",
      forecast: 200,
    },
    {
      category: "shopping",
      values: [800, 950, 890, categorySummary.shopping],
      trend: "decreasing",
      forecast: 850,
    },
    {
      category: "other",
      values: [200, 250, 220, categorySummary.other],
      trend: "stable",
      forecast: 230,
    },
    {
      category: "salary",
      values: [3000, 3000, 3000, categorySummary.salary],
      trend: "stable",
      forecast: 3000,
    },
  ];

  // Calculate forecasts using the trend analysis
  const forecastedExpenses = trends.reduce(
    (sum, t) => (t.category !== "salary" ? sum + t.forecast : sum),
    0,
  );
  const forecastedSavings = categorySummary.salary - forecastedExpenses;

  return {
    transactions,
    summary: {
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      categorySummary,
      budgets,
      trends,
      forecastedExpenses,
      forecastedSavings,
    },
  };
}

export const MOCK_DATA = generateMockTransactions();
