import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import BudgetProgress from "../categories/budget-progress";
import CategoryFormDialog from "../categories/category-form-dialog";

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

  // Filter categories that have budget limits and are not income categories
  const budgetCategories = categoriesWithAnalytics.filter(
    (cat) => cat.budget_limit && cat.budget_limit > 0 && cat.type !== "income",
  );

  const handleCreateBudgetCategory = () => {
    setShowCategoryForm(true);
  };

  const handleSubmitCategory = (data: CategoryFormData) => {
    onCreateCategory?.(data);
    setShowCategoryForm(false);
  };

  if (budgetCategories.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Budget Tracking</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateBudgetCategory}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create category with budget</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            <p>No budget categories found</p>
            <p className="text-sm">
              Create categories with budget limits to track spending
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateBudgetCategory}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Budget Category
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Budget Tracking</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateBudgetCategory}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new budget category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
    </>
  );
}
