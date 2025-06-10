import { type TransactionRepository } from "~/features/finance/application/use-cases/CreateTransaction";
import { Transaction } from "~/features/finance/domain/entities/Transaction";

/**
 * Update Transaction Use Case
 */
export interface UpdateTransactionCommand {
  id: string;
  type?: "income" | "expense";
  amount?: number;
  currencyCode?: string;
  date?: Date;
  note?: string;
  category?: string;
}

export class UpdateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(command: UpdateTransactionCommand): Promise<Transaction> {
    if (!command.id || command.id.trim().length === 0) {
      throw new Error("Transaction ID is required");
    }

    // Find existing transaction
    const existingTransaction = await this.transactionRepository.findById(
      command.id,
    );
    if (!existingTransaction) {
      throw new Error(`Transaction with ID ${command.id} not found`);
    }

    // Validate new values if provided
    if (command.amount !== undefined && command.amount < 0) {
      throw new Error("Transaction amount cannot be negative");
    }

    if (command.currencyCode && command.currencyCode.trim().length !== 3) {
      throw new Error("Valid currency code is required");
    }

    // Update transaction
    const updatedTransaction = existingTransaction.update({
      type: command.type as any,
      amount: command.amount,
      currencyCode: command.currencyCode?.toUpperCase(),
      date: command.date,
      note: command.note,
      category: command.category,
    });

    // Save through repository
    return await this.transactionRepository.update(updatedTransaction);
  }
}
