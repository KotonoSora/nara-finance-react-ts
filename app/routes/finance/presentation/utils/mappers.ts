import type {
  Budget,
  CategoryTrend,
  Transaction,
} from "~/routes/finance/presentation/types/ui.types";
import type {
  Budget as DomainBudget,
  CategoryTrend as DomainCategoryTrend,
  Transaction as DomainTransaction,
} from "~/routes/finance/types/finance";

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
