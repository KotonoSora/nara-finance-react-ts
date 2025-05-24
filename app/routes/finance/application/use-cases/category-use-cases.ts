import type {
  Category,
  CategoryProps,
} from "../../domain/entities/category.entity";
import type { DatabaseContext } from "../../infrastructure/database-context";
import type { IUseCase } from "../interfaces/use-case";

export class CreateCategoryUseCase
  implements IUseCase<CategoryProps, Category>
{
  constructor(private dbContext: DatabaseContext) {}

  async execute(input: CategoryProps): Promise<Category> {
    return await this.dbContext.categories.create({
      ...input,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
}

export interface UpdateCategoryInput {
  id: string;
  changes: Partial<CategoryProps>;
}

export class UpdateCategoryUseCase
  implements IUseCase<UpdateCategoryInput, Category>
{
  constructor(private dbContext: DatabaseContext) {}

  async execute(input: UpdateCategoryInput): Promise<Category> {
    return await this.dbContext.categories.update(input.id, {
      ...input.changes,
      updated_at: new Date().toISOString(),
    });
  }
}

export class ArchiveCategoryUseCase implements IUseCase<string, void> {
  constructor(private dbContext: DatabaseContext) {}

  async execute(id: string): Promise<void> {
    await this.dbContext.categories.archive(id);
  }
}

export interface MergeCategoriesInput {
  sourceIds: string[];
  targetId: string;
}

export class MergeCategoriesUseCase
  implements IUseCase<MergeCategoriesInput, void>
{
  constructor(private dbContext: DatabaseContext) {}

  async execute(input: MergeCategoriesInput): Promise<void> {
    await this.dbContext.categories.merge(input.sourceIds, input.targetId);
  }
}

export class GetCategoryAnalyticsUseCase implements IUseCase<void, Category[]> {
  constructor(private dbContext: DatabaseContext) {}

  async execute(): Promise<Category[]> {
    return await this.dbContext.categories.findAllWithAnalytics();
  }
}
