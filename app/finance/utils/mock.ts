/**
 * Generates mock transaction data for testing and development
 * @returns Object containing transactions and summary data
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

  return {
    transactions,
    summary: {
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      categorySummary,
    },
  };
}

export const MOCK_DATA = generateMockTransactions();
