/**
 * Transaction Use Cases
 *
 * Business logic for transaction management operations
 */

import type { IUseCase } from "~/routes/finance/application/interfaces/use-case";
import type {
  CreateTransactionInput,
  TransactionSummary,
  UpdateTransactionInput,
} from "~/routes/finance/application/types";
import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { DatabaseContext } from "~/routes/finance/infrastructure/database-context";

import { FinancialAmount } from "~/routes/finance/domain/value-objects/financial-amount";

export class CreateTransactionUseCase
  implements IUseCase<CreateTransactionInput, Transaction>
{
  constructor(private dbContext: DatabaseContext) {}

  async execute(input: CreateTransactionInput): Promise<Transaction> {
    // Validate the amount
    const amount = new FinancialAmount(input.amount);

    // Create the transaction
    const transaction = await this.dbContext.transactions.create({
      ...input,
      amount: amount.toNumber(),
    });

    return transaction;
  }
}

export class UpdateTransactionUseCase
  implements IUseCase<UpdateTransactionInput, Transaction>
{
  constructor(private dbContext: DatabaseContext) {}

  async execute(input: UpdateTransactionInput): Promise<Transaction> {
    if (input.changes.amount !== undefined) {
      input.changes.amount = new FinancialAmount(
        input.changes.amount,
      ).toNumber();
    }

    return await this.dbContext.transactions.update(input.id, input.changes);
  }
}

export class DeleteTransactionUseCase implements IUseCase<string, void> {
  constructor(private dbContext: DatabaseContext) {}

  async execute(id: string): Promise<void> {
    await this.dbContext.transactions.delete(id);
  }
}

export class GetTransactionSummaryUseCase
  implements IUseCase<void, TransactionSummary>
{
  constructor(private dbContext: DatabaseContext) {}

  async execute(): Promise<TransactionSummary> {
    const transactions = await this.dbContext.transactions.findAll();

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
