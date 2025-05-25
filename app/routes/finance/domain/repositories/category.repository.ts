import type { Category } from "~/routes/finance/domain/entities/category.entity";

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findByParentId(parentId: string | null): Promise<Category[]>;
  findWithAnalytics(): Promise<Category[]>;
  create(category: Category): Promise<Category>;
  update(id: string, category: Partial<Category>): Promise<Category>;
  archive(id: string): Promise<void>;
  merge(sourceIds: string[], targetId: string): Promise<void>;
}
