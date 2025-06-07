import type {
  Category,
  CategoryProps,
} from "~/routes/finance/domain/entities/category.entity";
import type { ICategoryRepository } from "~/routes/finance/domain/repositories/category.repository";

import { CategoryEntity } from "~/routes/finance/domain/entities/category.entity";

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async createCategory(props: CategoryProps): Promise<Category> {
    const category = new CategoryEntity(props);
    return await this.categoryRepository.create(category);
  }

  async updateCategory(
    id: string,
    props: Partial<CategoryProps>,
  ): Promise<Category> {
    return await this.categoryRepository.update(id, props);
  }

  async archiveCategory(id: string): Promise<void> {
    await this.categoryRepository.archive(id);
  }

  async mergeCategories(sourceIds: string[], targetId: string): Promise<void> {
    await this.categoryRepository.merge(sourceIds, targetId);
  }

  async getCategoryTree(): Promise<Category[]> {
    const allCategories = await this.categoryRepository.findAll();
    return this.buildCategoryTree(allCategories);
  }

  private buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // Create map of all categories
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build tree structure
    categories.forEach((category) => {
      if (category.parent_id == null) {
        rootCategories.push(categoryMap.get(category.id)!);
      } else {
        const parent = categoryMap.get(category.parent_id!);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(categoryMap.get(category.id)!);
        }
      }
    });

    return rootCategories;
  }
}
