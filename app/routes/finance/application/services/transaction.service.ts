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
  }
  async calculateTransactionSummary(transactions: Transaction[]) {
    const totalIncome = new FinancialAmount(
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    );

    const totalExpenses = new FinancialAmount(
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    );

    const savings = totalIncome.subtract(totalExpenses);

    return {
      totalIncome: totalIncome.toNumber(),
      totalExpenses: totalExpenses.toNumber(),
      savings: savings.toNumber(),
    };
  }
}
