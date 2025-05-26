import { Plus, Search, Settings } from "lucide-react";
import { useState } from "react";

import type {
  Category,
  CategoryFormData,
  CategoryWithAnalytics,
} from "~/routes/finance/presentation/types/ui.types";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import BudgetProgress from "~/routes/finance/presentation/components/categories/budget-progress";
import CategoryDetailsDialog from "~/routes/finance/presentation/components/categories/category-details-dialog";
import CategoryFormDialog from "~/routes/finance/presentation/components/categories/category-form-dialog";
import CategorySummaryCard from "~/routes/finance/presentation/components/categories/category-summary-card";
import CategoryTreeView from "~/routes/finance/presentation/components/categories/category-tree-view";

interface CategoryManagementProps {
  categories: Category[];
  categoriesWithAnalytics: CategoryWithAnalytics[];
  onCreateCategory?: (data: CategoryFormData) => void | Promise<void>;
  onUpdateCategory?: (
    id: string,
    data: Partial<CategoryFormData>,
  ) => void | Promise<void>;
  onDeleteCategory?: (id: string) => void | Promise<void>;
  onArchiveCategory?: (id: string) => void | Promise<void>;
  onMergeCategories?: (
    sourceIds: string | string[],
    targetId: string,
  ) => void | Promise<void>;
}

export default function CategoryManagement({
  categories,
  categoriesWithAnalytics,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onArchiveCategory,
  onMergeCategories,
}: CategoryManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCategoryDetails, setShowCategoryDetails] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [detailsCategory, setDetailsCategory] =
    useState<CategoryWithAnalytics | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);

  // Build tree structure for categories
  const buildCategoryTree = (cats: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: create map and initialize children arrays
    cats.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: build tree structure
    cats.forEach((cat) => {
      const categoryWithChildren = categoryMap.get(cat.id)!;
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children?.push(categoryWithChildren);
          categoryWithChildren.parent = parent;
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  };

  const categoryTree = buildCategoryTree(categories);

  // Filter categories based on search term
  const filteredCategories = searchTerm
    ? categoriesWithAnalytics.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : categoriesWithAnalytics;

  // Separate by budget status
  const categoriesWithBudget = filteredCategories.filter(
    (cat) => cat.budget_limit && cat.budget_limit > 0,
  );
  const categoriesWithoutBudget = filteredCategories.filter(
    (cat) => !cat.budget_limit || cat.budget_limit <= 0,
  );

  const handleCreateCategory = (parentId?: string) => {
    const parent = parentId ? categories.find((c) => c.id === parentId) : null;
    setParentCategory(parent || null);
    setEditingCategory(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setEditingCategory(category);
      setParentCategory(null);
      setShowCategoryForm(true);
    }
  };

  const handleSubmitCategory = (data: CategoryFormData) => {
    if (editingCategory) {
      onUpdateCategory?.(editingCategory.id, data);
    } else {
      onCreateCategory?.(data);
    }
    setShowCategoryForm(false);
    setEditingCategory(null);
    setParentCategory(null);
  };

  const handleViewDetails = (categoryId: string) => {
    const category = categoriesWithAnalytics.find((c) => c.id === categoryId);
    if (category) {
      setDetailsCategory(category);
      setShowCategoryDetails(true);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Category Management
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your transaction categories and budgets
          </p>
        </div>
        <Button
          onClick={() => handleCreateCategory()}
          className="text-xs sm:text-sm px-3 sm:px-4 py-2"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          Add Category
        </Button>
      </div>

      <div className="flex gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 sm:pl-8 text-xs sm:text-sm"
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tree" className="text-xs sm:text-sm">
            Tree View
          </TabsTrigger>
          <TabsTrigger value="budgets" className="text-xs sm:text-sm">
            Budget Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <CategorySummaryCard
                key={category.id}
                category={category}
                onClick={() => setSelectedCategory(category.id)}
                onViewDetails={() => handleViewDetails(category.id)}
              />
            ))}
          </div>
          {filteredCategories.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                {searchTerm
                  ? "No categories match your search"
                  : "No categories found"}
              </div>
              <Button
                onClick={() => handleCreateCategory()}
                className="text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Create First Category
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tree" className="space-y-4 sm:space-y-6">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <CategoryTreeView
              categories={categoryTree}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              onAddSubcategory={handleCreateCategory}
              onEditCategory={handleEditCategory}
            />

            {selectedCategory && (
              <Card>
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                    Category Details
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(selectedCategory)}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                    >
                      <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      Edit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                  {(() => {
                    const category = categoriesWithAnalytics.find(
                      (c) => c.id === selectedCategory,
                    );
                    return category ? (
                      <CategorySummaryCard
                        category={category}
                        showActions={false}
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Category not found
                      </p>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6">
            {categoriesWithBudget.length > 0 && (
              <Card>
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <CardTitle className="text-sm sm:text-base">
                    Categories with Budget Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
                  {categoriesWithBudget.map((category) => (
                    <BudgetProgress
                      key={category.id}
                      category={category}
                      onClick={() => setSelectedCategory(category.id)}
                      compact
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {categoriesWithoutBudget.length > 0 && (
              <Card>
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <CardTitle className="text-sm sm:text-base">
                    Categories without Budget Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
                  {categoriesWithoutBudget.map((category) => (
                    <CategorySummaryCard
                      key={category.id}
                      category={category}
                      onClick={() => setSelectedCategory(category.id)}
                      compact
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {filteredCategories.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                  No categories found for budget tracking
                </div>
                <Button
                  onClick={() => handleCreateCategory()}
                  className="text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Create Category with Budget
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CategoryFormDialog
        open={showCategoryForm}
        onOpenChange={setShowCategoryForm}
        onSubmit={handleSubmitCategory}
        category={editingCategory || undefined}
        parentCategory={parentCategory || undefined}
        categories={categories}
        mode={editingCategory ? "edit" : "create"}
      />

      <CategoryDetailsDialog
        open={showCategoryDetails}
        onOpenChange={setShowCategoryDetails}
        category={detailsCategory}
        onEdit={() => {
          if (detailsCategory) {
            setShowCategoryDetails(false);
            handleEditCategory(detailsCategory.id);
          }
        }}
      />
    </div>
  );
}
