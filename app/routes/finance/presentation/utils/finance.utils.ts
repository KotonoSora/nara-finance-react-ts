import type { Budget } from "../../domain/entities/budget.entity";
import type { Category } from "../../domain/entities/category.entity";
import type { Transaction } from "../../domain/entities/transaction.entity";

import { analyzeTrends } from "../../application/services/analytics.service";
import { BudgetEntity } from "../../domain/entities/budget.entity";
import { Money as FinancialAmount } from "../../domain/value-objects/money.value";

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
