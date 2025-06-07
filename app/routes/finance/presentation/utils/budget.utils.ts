import type {
  Budget,
  Transaction,
} from "~/routes/finance/presentation/types/ui.types";

/**
 * Updates local budgets with current spending from transactions
 */
export function updateLocalBudgets(
  budgets: Budget[],
  transactions: Transaction[],
): Budget[] {
  return budgets.map((budget) => ({
    ...budget,
    spent: transactions
      .filter(
        (t) => t.type === "expense" && t.category_id === budget.category_id,
      )
      .reduce((sum, t) => sum + t.amount, 0),
  }));
}
