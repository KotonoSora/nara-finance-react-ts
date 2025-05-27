import type {
  Budget,
  Category,
  Transaction,
} from "~/routes/finance/presentation/types/ui.types";

// Generate a default budget for a given category
export function getDefaultBudget(category: Category): Budget {
  return {
    category_id: category.id,
    limit: category.budget_limit ?? 0,
    spent: 0,
    period: category.budget_period,
  };
}

// Update budgets with spent amounts based on transactions
export function updateBudgets(
  budgets: Budget[],
  transactions: Transaction[],
): Budget[] {
  return budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.category_id === budget.category_id)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      category_id: budget.category_id,
      limit: budget.limit,
      spent,
      period: budget.period,
    };
  });
}

// Simple audit trail utility
export const AuditTrail = {
  addRecord: (message: string) => {
    console.log("AuditTrail:", message);
  },
};
