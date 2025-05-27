import type { Budget } from "~/routes/finance/domain/entities/budget.entity";
import type { Category } from "~/routes/finance/domain/entities/category.entity";
import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";

import { analyzeTrends } from "~/routes/finance/application/services/analytics.service";
import { FinancialAmount } from "~/routes/finance/domain/value-objects/financial-amount";

// Re-export for convenience
export { analyzeTrends, FinancialAmount };

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
