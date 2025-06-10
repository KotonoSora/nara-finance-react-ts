import { type TransactionRepository } from "~/features/finance/application/use-cases/CreateTransaction";

/**
 * Delete Transaction Use Case
 */
export class DeleteTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new Error("Transaction ID is required");
    }

    // Check if transaction exists
    const existingTransaction = await this.transactionRepository.findById(id);
    if (!existingTransaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    // Delete through repository
    await this.transactionRepository.delete(id);
  }
}
