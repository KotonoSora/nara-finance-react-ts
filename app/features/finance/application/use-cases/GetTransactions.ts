import { type TransactionRepository } from "~/features/finance/application/use-cases/CreateTransaction";
import { Transaction } from "~/features/finance/domain/entities/Transaction";
import { type TransactionType } from "~/features/finance/domain/value-objects/TransactionType";

/**
 * Get Transactions Use Case
 * Handles retrieving transactions with filtering and pagination
 */
export interface GetTransactionsQuery {
  limit?: number;
  offset?: number;
  type?: TransactionType;
  currencyCode?: string;
}

export interface GetTransactionsResult {
  transactions: Transaction[];
  total: number;
  hasMore: boolean;
}

export class GetTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(
    query: GetTransactionsQuery = {},
  ): Promise<GetTransactionsResult> {
    // Apply default pagination
    const limit = Math.min(query.limit || 10, 100); // Max 100 per request
    const offset = Math.max(query.offset || 0, 0);

    // Validate currency code if provided
    if (query.currencyCode && query.currencyCode.length !== 3) {
      throw new Error("Currency code must be 3 characters long");
    }

    // Get transactions from repository
    const transactions = await this.transactionRepository.findAll({
      limit: limit + 1, // Get one extra to check if there are more
      offset,
      type: query.type,
      currencyCode: query.currencyCode?.toUpperCase(),
    });

    // Check if there are more results
    const hasMore = transactions.length > limit;
    if (hasMore) {
      transactions.pop(); // Remove the extra transaction
    }

    return {
      transactions,
      total: transactions.length, // Note: This is not the total count, just current batch
      hasMore,
    };
  }

  async getById(id: string): Promise<Transaction | null> {
    if (!id || id.trim().length === 0) {
      throw new Error("Transaction ID is required");
    }

    return await this.transactionRepository.findById(id.trim());
  }
}
