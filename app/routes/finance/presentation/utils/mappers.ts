import type { Budget as DomainBudget } from "~/routes/finance/domain/entities/budget.entity";
import type { Transaction as DomainTransaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { CategoryTrend as DomainCategoryTrend } from "~/routes/finance/domain/types/analytics.types";
import type {
  Budget,
  CategoryTrend,
  Transaction,
} from "~/routes/finance/presentation/types/ui.types";

export function mapDomainTransactionToPresentation(
  domainTransaction: DomainTransaction,
): Transaction {
  return domainTransaction;
}

export function mapPresentationTransactionToDomain(
  presentationTransaction: Omit<Transaction, "id">,
): Omit<DomainTransaction, "id"> {
  return presentationTransaction;
}

export function mapDomainBudgetToPresentation(
  domainBudget: DomainBudget,
): Budget {
  return { ...domainBudget };
}

export function mapDomainCategoryTrendToPresentation(
  domainTrend: DomainCategoryTrend,
): CategoryTrend {
  return domainTrend;
}
