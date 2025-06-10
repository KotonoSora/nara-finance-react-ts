import { Transaction } from "~/features/finance/domain/entities/Transaction";
import { type TransactionType } from "~/features/finance/domain/value-objects/TransactionType";

/**
 * Create Transaction Use Case
 * Handles the business logic for creating a new transaction
 */
export interface CreateTransactionCommand {
  type: TransactionType;
  amount: number;
  currencyCode: string;
  date: Date;
  note?: string;
  category?: string;
}

export interface TransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findAll(params?: {
    limit?: number;
    offset?: number;
    type?: TransactionType;
    currencyCode?: string;
  }): Promise<Transaction[]>;
  update(transaction: Transaction): Promise<Transaction>;
  delete(id: string): Promise<void>;
}

export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    // Validate business rules
    if (command.amount < 0) {
      throw new Error("Transaction amount cannot be negative");
    }

    if (!command.currencyCode || command.currencyCode.trim().length !== 3) {
      throw new Error("Valid currency code is required");
    }

    if (!command.date) {
      throw new Error("Transaction date is required");
    }

    // Create transaction entity
    const transaction = Transaction.create({
      type: command.type,
      amount: command.amount,
      currencyCode: command.currencyCode.toUpperCase(),
      date: command.date,
      note: command.note?.trim() || undefined,
      category: command.category?.trim() || undefined,
    });

    // Persist through repository
    return await this.transactionRepository.save(transaction);
  }
}
