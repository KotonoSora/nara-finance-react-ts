/**
 * Transaction Type Value Object
 * Represents the type of a financial transaction
 */
export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export const isValidTransactionType = (
  type: string,
): type is TransactionType => {
  return Object.values(TransactionType).includes(type as TransactionType);
};

export const getTransactionTypeLabel = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.INCOME:
      return "Income";
    case TransactionType.EXPENSE:
      return "Expense";
    default:
      throw new Error(`Unknown transaction type: ${type}`);
  }
};
