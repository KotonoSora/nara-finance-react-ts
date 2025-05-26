/**
 * Transaction Mapper - Application Layer
 *
 * Maps between domain Transaction entities and UI Transaction types
 * Handles category_id based transaction mapping
 */

import type { Transaction as DomainTransaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { Transaction as LegacyTransaction } from "~/routes/finance/presentation/types/ui.types";

/**
 * Maps domain transaction to UI transaction
 */
export function mapDomainToLegacy(
  domainTransaction: DomainTransaction,
): LegacyTransaction {
  return {
    id: domainTransaction.id,
    date: domainTransaction.date,
    amount: domainTransaction.amount,
    type: domainTransaction.type,
    category_id: domainTransaction.category_id,
    description: domainTransaction.description,
  };
}

/**
 * Maps UI transaction to domain transaction
 */
export function mapLegacyToDomain(
  legacyTransaction: Omit<LegacyTransaction, "id">,
): Omit<DomainTransaction, "id"> {
  return {
    date: legacyTransaction.date,
    amount: legacyTransaction.amount,
    type: legacyTransaction.type,
    category_id: legacyTransaction.category_id,
    description: legacyTransaction.description,
  };
}

/**
 * Maps array of domain transactions to UI transactions
 */
export function mapDomainArrayToLegacy(
  domainTransactions: DomainTransaction[],
): LegacyTransaction[] {
  return domainTransactions.map(mapDomainToLegacy);
}
