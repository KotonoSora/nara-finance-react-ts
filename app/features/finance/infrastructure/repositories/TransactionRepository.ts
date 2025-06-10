import type {
  CreateTransactionRequest,
  GetTransactionsParams,
  TransactionData,
  UpdateTransactionRequest,
} from "~/features/finance/infrastructure/clients/TransactionApiClient";

import { type TransactionRepository } from "~/features/finance/application/use-cases/CreateTransaction";
import { Transaction } from "~/features/finance/domain/entities/Transaction";
import {
  isValidTransactionType,
  TransactionType,
} from "~/features/finance/domain/value-objects/TransactionType";
import { TransactionApiClient } from "~/features/finance/infrastructure/clients/TransactionApiClient";

/**
 * Transaction Repository Implementation
 * Adapts the API client to the domain repository interface
 */
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(private readonly apiClient: TransactionApiClient) {}
  async save(transaction: Transaction): Promise<Transaction> {
    // Ensure date is in YYYY-MM-DD format for API compatibility
    const dateStr = transaction.getDate().toISOString().split("T")[0];

    const request: CreateTransactionRequest = {
      type: transaction.getType(),
      amount: transaction.getAmount(),
      currency_code: transaction.getCurrencyCode(),
      date: dateStr,
      note: transaction.getNote(),
      category: transaction.getCategory(),
    };

    const data = await this.apiClient.createTransaction(request);
    return this.mapToTransaction(data);
  }

  async findById(id: string): Promise<Transaction | null> {
    const data = await this.apiClient.getTransactionById(id);
    return data ? this.mapToTransaction(data) : null;
  }

  async findAll(
    params: {
      limit?: number;
      offset?: number;
      type?: TransactionType;
      currencyCode?: string;
    } = {},
  ): Promise<Transaction[]> {
    const apiParams: GetTransactionsParams = {
      limit: params.limit,
      offset: params.offset,
      type: params.type,
      currency_code: params.currencyCode,
    };

    const dataList = await this.apiClient.getTransactions(apiParams);
    return dataList.map((data) => this.mapToTransaction(data));
  }
  async update(transaction: Transaction): Promise<Transaction> {
    // Ensure date is in YYYY-MM-DD format for API compatibility
    const dateStr = transaction.getDate().toISOString().split("T")[0];

    const request: UpdateTransactionRequest = {
      type: transaction.getType(),
      amount: transaction.getAmount(),
      currency_code: transaction.getCurrencyCode(),
      date: dateStr,
      note: transaction.getNote(),
      category: transaction.getCategory(),
    };

    const data = await this.apiClient.updateTransaction(
      transaction.getId().getValue(),
      request,
    );
    return this.mapToTransaction(data);
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.deleteTransaction(id);
  }

  /**
   * Maps API data to Transaction domain entity
   */
  private mapToTransaction(data: TransactionData): Transaction {
    if (!isValidTransactionType(data.type)) {
      throw new Error(`Invalid transaction type: ${data.type}`);
    }

    return Transaction.fromData({
      id: data.id,
      type:
        data.type === "income"
          ? TransactionType.INCOME
          : TransactionType.EXPENSE,
      amount: data.amount,
      currencyCode: data.currency_code,
      date: new Date(data.date),
      note: data.note,
      category: data.category,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    });
  }
}
