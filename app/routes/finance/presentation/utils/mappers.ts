// Domain to Presentation mapping utilities
import type { CategoryTrend as DomainCategoryTrend } from "../../application/types";
import type {
  Budget as DomainBudget,
  Category as DomainCategory,
  Transaction as DomainTransaction,
} from "../../domain/types";
import type {
  Budget,
  Category,
  CategoryTrend,
  Transaction,
  TransactionCategory,
} from "../types";

// Legacy category mapping
const CATEGORY_ID_TO_LEGACY: Record<string, TransactionCategory> = {
  "1": "food",
  "2": "transport",
  "3": "shopping",
  "4": "salary",
  "5": "other",
};

const LEGACY_TO_CATEGORY_ID: Record<TransactionCategory, string> = {
  food: "1",
  transport: "2",
  shopping: "3",
  salary: "4",
  other: "5",
};

export function mapDomainTransactionToPresentation(
  domainTransaction: DomainTransaction,
): Transaction {
  const legacyCategory =
    CATEGORY_ID_TO_LEGACY[domainTransaction.category_id] || "other";

  return {
    ...domainTransaction,
    category: legacyCategory,
  };
}

export function mapPresentationTransactionToDomain(
  presentationTransaction: Omit<Transaction, "id">,
): Omit<DomainTransaction, "id"> {
  const categoryId =
    LEGACY_TO_CATEGORY_ID[presentationTransaction.category] || "5";

  return {
    date: presentationTransaction.date,
    amount: presentationTransaction.amount,
    type: presentationTransaction.type,
    category_id: categoryId,
    description: presentationTransaction.description,
  };
}

export function mapDomainBudgetToPresentation(
  domainBudget: DomainBudget,
  categoryId: string,
): Budget {
  const legacyCategory = CATEGORY_ID_TO_LEGACY[categoryId] || "other";

  return {
    ...domainBudget,
    category: legacyCategory,
    category_id: categoryId,
  };
}

export function mapDomainCategoryTrendToPresentation(
  domainTrend: DomainCategoryTrend,
): CategoryTrend {
  const legacyCategory =
    CATEGORY_ID_TO_LEGACY[domainTrend.category_id] || "other";

  return {
    ...domainTrend,
    category: legacyCategory,
  };
}

export function getLegacyCategoryFromId(
  categoryId: string,
): TransactionCategory {
  return CATEGORY_ID_TO_LEGACY[categoryId] || "other";
}

export function getCategoryIdFromLegacy(
  legacyCategory: TransactionCategory,
): string {
  return LEGACY_TO_CATEGORY_ID[legacyCategory] || "5";
}
