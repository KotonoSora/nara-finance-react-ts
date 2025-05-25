import { desc, eq, sql } from "drizzle-orm";

import type { Category } from "~/routes/finance/domain/entities/category.entity";
import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { DatabaseContext } from "~/routes/finance/infrastructure/database-context";

import {
  categories as categoriesTable,
  transactions as transactionsTable,
} from "~/database/schema";

export class DrizzleDatabaseContext implements DatabaseContext {
  constructor(public db: any) {}

  // Transaction helpers
  private mapTransactionToDb(data: Partial<Transaction>) {
    return {
      amount: data.amount,
      description: data.description,
      type: data.type,
      date: data.date,
      category_id: data.category_id ? parseInt(data.category_id) : undefined,
    };
  }
  private mapTransactionToEntity(raw: any): Transaction {
    return {
      id: raw.id.toString(),
      date: new Date(raw.date),
      amount: raw.amount,
      type: raw.type,
      category_id: raw.category_id.toString(),
      description: raw.description,
    };
  }

  transactions = {
    async findAll(this: DrizzleDatabaseContext): Promise<Transaction[]> {
      const result = await this.db
        .select()
        .from(transactionsTable)
        .orderBy(desc(transactionsTable.date));
      return result.map((raw: any) => this.mapTransactionToEntity(raw));
    },
    async findById(
      this: DrizzleDatabaseContext,
      id: string,
    ): Promise<Transaction | null> {
      const result = await this.db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.id, parseInt(id)))
        .limit(1);
      return result[0] ? this.mapTransactionToEntity(result[0]) : null;
    },
    async create(
      this: DrizzleDatabaseContext,
      data: Omit<Transaction, "id">,
    ): Promise<Transaction> {
      const result = await this.db
        .insert(transactionsTable)
        .values(this.mapTransactionToDb(data))
        .returning();
      return this.mapTransactionToEntity(result[0]);
    },
    async update(
      this: DrizzleDatabaseContext,
      id: string,
      data: Partial<Transaction>,
    ): Promise<Transaction> {
      const result = await this.db
        .update(transactionsTable)
        .set(this.mapTransactionToDb(data))
        .where(eq(transactionsTable.id, parseInt(id)))
        .returning();
      return this.mapTransactionToEntity(result[0]);
    },
    async delete(this: DrizzleDatabaseContext, id: string): Promise<void> {
      await this.db
        .delete(transactionsTable)
        .where(eq(transactionsTable.id, parseInt(id)));
    },
  };

  // Category helpers
  private mapCategoryToDb(data: Partial<Category>) {
    return {
      name: data.name,
      type: data.type,
      parent_id: data.parent_id ? parseInt(data.parent_id) : null,
      budget_limit: data.budget_limit,
      budget_period: data.budget_period,
      is_archived: data.is_archived ? 1 : 0,
      icon: data.icon,
      color: data.color,
    };
  }
  private mapCategoryToEntity(raw: any): Category {
    return {
      id: raw.id.toString(),
      name: raw.name,
      type: raw.type,
      parent_id: raw.parent_id?.toString() || null,
      budget_limit: raw.budget_limit,
      budget_period: raw.budget_period,
      is_archived: Boolean(raw.is_archived),
      icon: raw.icon,
      color: raw.color,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    };
  }

  categories = {
    async findAll(this: DrizzleDatabaseContext): Promise<Category[]> {
      const result = await this.db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.is_archived, 0))
        .orderBy(categoriesTable.name);
      return result.map((raw: any) => this.mapCategoryToEntity(raw));
    },
    async findAllWithAnalytics(
      this: DrizzleDatabaseContext,
    ): Promise<Category[]> {
      const result = await this.db
        .select({
          id: categoriesTable.id,
          name: categoriesTable.name,
          type: categoriesTable.type,
          parent_id: categoriesTable.parent_id,
          budget_limit: categoriesTable.budget_limit,
          budget_period: categoriesTable.budget_period,
          is_archived: categoriesTable.is_archived,
          icon: categoriesTable.icon,
          color: categoriesTable.color,
          created_at: categoriesTable.created_at,
          updated_at: categoriesTable.updated_at,
          spent: sql`COALESCE(SUM(${transactionsTable.amount}), 0)`,
          transaction_count: sql`COUNT(${transactionsTable.id})`,
          last_transaction_date: sql`MAX(${transactionsTable.date})`,
        })
        .from(categoriesTable)
        .leftJoin(
          transactionsTable,
          eq(categoriesTable.id, transactionsTable.category_id),
        )
        .where(eq(categoriesTable.is_archived, 0))
        .groupBy(categoriesTable.id)
        .orderBy(categoriesTable.name);
      return result.map((raw: any) => ({
        ...this.mapCategoryToEntity(raw),
        spent: raw.spent || 0,
        transaction_count: raw.transaction_count || 0,
        last_transaction_date: raw.last_transaction_date,
        spending_trend: "stable" as const,
      }));
    },
    async findById(
      this: DrizzleDatabaseContext,
      id: string,
    ): Promise<Category | null> {
      const result = await this.db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, parseInt(id)))
        .limit(1);
      return result[0] ? this.mapCategoryToEntity(result[0]) : null;
    },
    async create(
      this: DrizzleDatabaseContext,
      data: Omit<Category, "id">,
    ): Promise<Category> {
      const result = await this.db
        .insert(categoriesTable)
        .values(this.mapCategoryToDb(data))
        .returning();
      return this.mapCategoryToEntity(result[0]);
    },
    async update(
      this: DrizzleDatabaseContext,
      id: string,
      data: Partial<Category>,
    ): Promise<Category> {
      const result = await this.db
        .update(categoriesTable)
        .set({
          ...this.mapCategoryToDb(data),
          updated_at: new Date().toISOString(),
        })
        .where(eq(categoriesTable.id, parseInt(id)))
        .returning();
      return this.mapCategoryToEntity(result[0]);
    },
    async archive(this: DrizzleDatabaseContext, id: string): Promise<void> {
      await this.db
        .update(categoriesTable)
        .set({ is_archived: 1, updated_at: new Date().toISOString() })
        .where(eq(categoriesTable.id, parseInt(id)));
    },
    async merge(
      this: DrizzleDatabaseContext,
      sourceIds: string[],
      targetId: string,
    ): Promise<void> {
      await this.db
        .update(transactionsTable)
        .set({ category_id: parseInt(targetId) })
        .where(
          sql`category_id IN (${sourceIds.map((id) => parseInt(id)).join(",")})`,
        );
      await this.db
        .update(categoriesTable)
        .set({ is_archived: 1, updated_at: new Date().toISOString() })
        .where(sql`id IN (${sourceIds.map((id) => parseInt(id)).join(",")})`);
    },
  };
}
