import { and, desc, eq, sql } from "drizzle-orm";

import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { ITransactionRepository } from "~/routes/finance/domain/repositories/transaction.repository";

import { transactions as transactionsTable } from "~/database/schema";
import { TransactionEntity } from "~/routes/finance/domain/entities/transaction.entity";

export class DrizzleTransactionRepository implements ITransactionRepository {
  constructor(private db: any) {}

  async findAll(): Promise<Transaction[]> {
    const result = await this.db
      .select({
        id: transactionsTable.id,
        amount: transactionsTable.amount,
        description: transactionsTable.description,
        type: transactionsTable.type,
        date: transactionsTable.date,
        category_id: transactionsTable.category_id,
      })
      .from(transactionsTable)
      .orderBy(desc(transactionsTable.date));

    return result.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Transaction | null> {
    const result = await this.db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, parseInt(id)))
      .limit(1);

    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    const result = await this.db
      .select()
      .from(transactionsTable)
      .where(
        and(
          sql`${transactionsTable.date} >= ${startDate}`,
          sql`${transactionsTable.date} <= ${endDate}`,
        ),
      );

    return result.map(this.mapToEntity);
  }

  async findByCategoryId(categoryId: string): Promise<Transaction[]> {
    const result = await this.db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.category_id, parseInt(categoryId)));

    return result.map(this.mapToEntity);
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const result = await this.db
      .insert(transactionsTable)
      .values({
        amount: transaction.amount,
        description: transaction.description,
        type: transaction.type,
        date: transaction.date,
        category_id: parseInt(transaction.category_id),
      })
      .returning();

    return this.mapToEntity(result[0]);
  }

  async update(
    id: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    const result = await this.db
      .update(transactionsTable)
      .set({
        amount: transaction.amount,
        description: transaction.description,
        type: transaction.type,
        date: transaction.date,
        category_id: transaction.category_id
          ? parseInt(transaction.category_id)
          : undefined,
      })
      .where(eq(transactionsTable.id, parseInt(id)))
      .returning();

    return this.mapToEntity(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(transactionsTable)
      .where(eq(transactionsTable.id, parseInt(id)));
  }

  private mapToEntity(raw: any): Transaction {
    return new TransactionEntity(
      {
        amount: raw.amount,
        description: raw.description,
        type: raw.type,
        date: new Date(raw.date),
        category_id: raw.category_id.toString(),
      },
      raw.id.toString(),
    );
  }
}
