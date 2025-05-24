import { and, desc, eq, isNull, sql } from "drizzle-orm";

import type {
  Category,
  CategoryProps,
} from "../../domain/entities/category.entity";
import type { ICategoryRepository } from "../../domain/repositories/category.repository";

import {
  categories as categoriesTable,
  transactions as transactionsTable,
} from "~/database/schema";

export class DrizzleCategoryRepository implements ICategoryRepository {
  constructor(private db: any) {}

  async findAll(): Promise<Category[]> {
    const result = await this.db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.is_archived, 0))
      .orderBy(categoriesTable.name);

    return result.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Category | null> {
    const result = await this.db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, parseInt(id)))
      .limit(1);

    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async findByParentId(parentId: string | null): Promise<Category[]> {
    const result = await this.db
      .select()
      .from(categoriesTable)
      .where(
        parentId
          ? eq(categoriesTable.parent_id, parseInt(parentId))
          : isNull(categoriesTable.parent_id),
      );

    return result.map(this.mapToEntity);
  }

  async findWithAnalytics(): Promise<Category[]> {
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
      ...this.mapToEntity(raw),
      spent: raw.spent,
      transaction_count: raw.transaction_count,
      last_transaction_date: raw.last_transaction_date,
      spending_trend: "stable" as const,
    }));
  }

  async create(category: Category): Promise<Category> {
    const result = await this.db
      .insert(categoriesTable)
      .values({
        name: category.name,
        type: category.type,
        parent_id: category.parent_id ? parseInt(category.parent_id) : null,
        budget_limit: category.budget_limit,
        budget_period: category.budget_period,
        is_archived: category.is_archived,
        icon: category.icon,
        color: category.color,
      })
      .returning();

    return this.mapToEntity(result[0]);
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const result = await this.db
      .update(categoriesTable)
      .set({
        name: category.name,
        type: category.type,
        parent_id: category.parent_id ? parseInt(category.parent_id) : null,
        budget_limit: category.budget_limit,
        budget_period: category.budget_period,
        icon: category.icon,
        color: category.color,
        updated_at: new Date().toISOString(),
      })
      .where(eq(categoriesTable.id, parseInt(id)))
      .returning();

    return this.mapToEntity(result[0]);
  }

  async archive(id: string): Promise<void> {
    await this.db
      .update(categoriesTable)
      .set({
        is_archived: 1,
        updated_at: new Date().toISOString(),
      })
      .where(eq(categoriesTable.id, parseInt(id)));
  }

  async merge(sourceIds: string[], targetId: string): Promise<void> {
    // Update all transactions from source categories to target category
    await this.db
      .update(transactionsTable)
      .set({
        category_id: parseInt(targetId),
      })
      .where(
        sql`category_id IN (${sourceIds.map((id) => parseInt(id)).join(",")})`,
      );

    // Archive source categories
    await this.db
      .update(categoriesTable)
      .set({
        is_archived: 1,
        updated_at: new Date().toISOString(),
      })
      .where(sql`id IN (${sourceIds.map((id) => parseInt(id)).join(",")})`);
  }

  private mapToEntity(raw: any): Category {
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
}
