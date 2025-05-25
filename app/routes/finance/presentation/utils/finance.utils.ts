import type { Budget } from "~/routes/finance/domain/entities/budget.entity";
import type { Category } from "~/routes/finance/domain/entities/category.entity";
import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";

import { analyzeTrends } from "~/routes/finance/application/services/analytics.service";
import { BudgetEntity } from "~/routes/finance/domain/entities/budget.entity";
import { Money as FinancialAmount } from "~/routes/finance/domain/value-objects/money.value";

// Re-export for convenience
export { analyzeTrends, FinancialAmount };

// Generate a default budget for a given category
export function getDefaultBudget(category: Category): Budget {
  return new BudgetEntity({
    limit: category.budget_limit ?? 0,
    spent: 0,
    period: category.budget_period,
  });
}

// Update budgets with spent amounts based on transactions
export function updateBudgets(
  budgets: Budget[],
  transactions: Transaction[],
): Budget[] {
  return budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.type === (budget as any).type)
      .reduce((sum, t) => sum + t.amount, 0);
    return new BudgetEntity({
      limit: (budget as any).limit,
      spent,
      period: (budget as any).period,
    });
  });
}

// Simple audit trail utility
export const AuditTrail = {
  addRecord: (message: string) => {
    console.log("AuditTrail:", message);
  },
};
