import { Plus } from "lucide-react";
import { useState } from "react";

import type {
  Category,
  CategoryFormData,
  CategoryWithAnalytics,
} from "~/routes/finance/types/finance";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import BudgetProgress from "~/routes/finance/presentation/components/categories/budget-progress";
import CategoryFormDialog from "~/routes/finance/presentation/components/categories/category-form-dialog";
import EnableBudgetDialog from "~/routes/finance/presentation/components/categories/enable-budget-dialog";

interface EnhancedBudgetSectionProps {
  categoriesWithAnalytics: CategoryWithAnalytics[];
  allCategories: Category[];
  onCategoryClick?: (categoryId: string) => void;
  onCreateCategory?: (data: CategoryFormData) => void;
  onUpdateCategory?: (id: string, data: CategoryFormData) => void;
}

export default function EnhancedBudgetSection({
  categoriesWithAnalytics,
  allCategories,
  onCategoryClick,
  onCreateCategory,
  onUpdateCategory,
}: EnhancedBudgetSectionProps) {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showEnableBudgetDialog, setShowEnableBudgetDialog] = useState(false);

  // Filter categories that have budget limits and are not income categories
  const budgetCategories = categoriesWithAnalytics.filter(
    (cat) => cat.budget_limit && cat.budget_limit > 0 && cat.type !== "income",
  );

  // Categories without budget tracking (excluding income categories)
  const categoriesWithoutBudget = categoriesWithAnalytics.filter(
    (cat) =>
      (!cat.budget_limit || cat.budget_limit <= 0) && cat.type !== "income",
  );

  const handleCreateBudgetCategory = () => {
    setShowCategoryForm(true);
  };

  const handleEnableBudgetTracking = () => {
    setShowEnableBudgetDialog(true);
  };

  const handleSubmitCategory = (data: CategoryFormData) => {
    onCreateCategory?.(data);
    setShowCategoryForm(false);
  };

  const handleEnableBudgetForCategory = (
    categoryId: string,
    data: CategoryFormData,
  ) => {
    onUpdateCategory?.(categoryId, data);
    setShowEnableBudgetDialog(false);
  };

  if (budgetCategories.length === 0) {
    return (
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center justify-between text-card-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary"></div>
              <span className="text-sm sm:text-base md:text-lg">
                Budget Tracking
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateBudgetCategory}
                    className="border-border hover:bg-accent hover:text-accent-foreground transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs sm:text-sm">
                    Create category with budget
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 sm:py-8 px-3 sm:px-4 md:px-6">
          <div className="text-muted-foreground mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm sm:text-base">
              No budget categories found
            </p>
            <p className="text-xs sm:text-sm">
              {categoriesWithoutBudget.length > 0
                ? "Enable budget tracking on existing categories or create new ones"
                : "Create categories with budget limits to track spending"}
            </p>
          </div>
          <div className="space-y-2">
            {categoriesWithoutBudget.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEnableBudgetTracking}
                className="shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2 mr-2"
              >
                Enable Budget Tracking
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateBudgetCategory}
              className="shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Create Budget Category
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center justify-between text-card-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary"></div>
              <span className="text-sm sm:text-base md:text-lg">
                Budget Tracking
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateBudgetCategory}
                    className="border-border hover:bg-accent hover:text-accent-foreground transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs sm:text-sm">
                    Create new budget category
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 md:p-6 pt-0">
          {budgetCategories.map((category) => (
            <BudgetProgress
              key={category.id}
              category={category}
              onClick={() => onCategoryClick?.(category.id)}
              compact
            />
          ))}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={showCategoryForm}
        onOpenChange={setShowCategoryForm}
        onSubmit={handleSubmitCategory}
        categories={allCategories}
        mode="create"
      />

      {/* Enable Budget Tracking Dialog */}
      {showEnableBudgetDialog && (
        <EnableBudgetDialog
          open={showEnableBudgetDialog}
          onOpenChange={setShowEnableBudgetDialog}
          categories={categoriesWithoutBudget}
          onEnableBudget={handleEnableBudgetForCategory}
        />
      )}
    </>
  );
}
