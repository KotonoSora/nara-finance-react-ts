import type { Category } from "../domain/entities/category.entity";
import type { Transaction } from "../domain/entities/transaction.entity";

export interface DatabaseContext {
  db: any; // Replace with your actual DB type
  transactions: {
    findAll(): Promise<Transaction[]>;
    findById(id: string): Promise<Transaction | null>;
    create(data: Omit<Transaction, "id">): Promise<Transaction>;
    update(id: string, data: Partial<Transaction>): Promise<Transaction>;
    delete(id: string): Promise<void>;
  };
  categories: {
    findAll(): Promise<Category[]>;
    findAllWithAnalytics(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    create(data: Omit<Category, "id">): Promise<Category>;
    update(id: string, data: Partial<Category>): Promise<Category>;
    archive(id: string): Promise<void>;
    merge(sourceIds: string[], targetId: string): Promise<void>;
  };
}
