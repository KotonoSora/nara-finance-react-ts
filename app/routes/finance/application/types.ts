/**
 * Application Layer Types
 *
 * Type definitions for application layer use cases and services
 */

import type { TransactionType } from "~/routes/finance/domain/value-objects/finance-constants";

export interface CreateTransactionInput {
  date: Date;
  amount: number;
  type: TransactionType;
  category_id: string;
  description: string;
}

export interface UpdateTransactionInput {
  id: string;
  changes: {
    date?: Date;
    amount?: number;
    type?: TransactionType;
    category_id?: string;
    description?: string;
  };
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}
