import type {
  Transaction,
  TransactionProps,
} from "~/routes/finance/domain/entities/transaction.entity";
import type { ITransactionRepository } from "~/routes/finance/domain/repositories/transaction.repository";

import { TransactionEntity } from "~/routes/finance/domain/entities/transaction.entity";
import { FinancialAmount } from "~/routes/finance/domain/value-objects/financial-amount";

export class TransactionService {
  constructor(private transactionRepository: ITransactionRepository) {}

  async createTransaction(props: TransactionProps): Promise<Transaction> {
    const transaction = new TransactionEntity(props);
    return await this.transactionRepository.create(transaction);
  }

  async updateTransaction(
    id: string,
    props: Partial<TransactionProps>,
  ): Promise<Transaction> {
    return await this.transactionRepository.update(id, props);
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }

  async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.findByDateRange(startDate, endDate);
  } // Note: Transaction summary calculation moved to GetTransactionSummaryUseCase
  // This avoids duplication and follows clean architecture principles
}
