import type { Transaction } from "../../domain/entities/transaction.entity";
import type { DatabaseContext } from "../../infrastructure/database-context";
import type { IUseCase } from "../interfaces/use-case";
import type { CreateTransactionInput, UpdateTransactionInput } from "../types";

import { Money } from "../../domain/value-objects/money.value";

export class CreateTransactionUseCase
  implements IUseCase<CreateTransactionInput, Transaction>
{
  constructor(private dbContext: DatabaseContext) {}

  async execute(input: CreateTransactionInput): Promise<Transaction> {
    // Validate the amount
    const amount = new Money(input.amount);

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
      input.changes.amount = new Money(input.changes.amount).toNumber();
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

export class GetTransactionSummaryUseCase implements IUseCase<void, any> {
  constructor(private dbContext: DatabaseContext) {}

  async execute(): Promise<any> {
    const transactions = await this.dbContext.transactions.findAll();

    const totalIncome = new Money(
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    );

    const totalExpenses = new Money(
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
