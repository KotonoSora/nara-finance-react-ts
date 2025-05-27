// Domain types for transactions

import type { Transaction } from "../entities/transaction.entity";

import { FinancialAmount } from "../value-objects/financial-amount";

/** Summary of transactions for a specific date */
export interface DailyTransactionSummary {
  /** Number of transactions on the date */
  count: number;
  /** Financial summary breakdown */
  summary: {
    income: number;
    expense: number;
    net: number;
  };
  /** Transactions included in summary */
  transactions: Transaction[];
}

/** Result of transaction analysis */
export interface TransactionAnalysis {
  totalTransactions: number;
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  totalIncome: FinancialAmount;
  totalExpenses: FinancialAmount;
  netAmount: FinancialAmount;
  averageAmount: FinancialAmount;
  largestTransaction: Transaction | null;
  categoryBreakdown: Map<string, FinancialAmount>;
}

export type { Transaction };
