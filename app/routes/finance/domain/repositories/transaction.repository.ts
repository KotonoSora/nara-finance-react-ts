import type { Transaction } from "../entities/transaction.entity";

export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  findByCategoryId(categoryId: string): Promise<Transaction[]>;
  create(transaction: Transaction): Promise<Transaction>;
  update(id: string, transaction: Partial<Transaction>): Promise<Transaction>;
  delete(id: string): Promise<void>;
}
