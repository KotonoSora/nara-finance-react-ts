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
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-card-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Budget Tracking</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateBudgetCategory}
                    className="border-border hover:bg-accent hover:text-accent-foreground transition-colors"
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
          <div className="text-muted-foreground mb-6 space-y-2">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium">No budget categories found</p>
            <p className="text-sm">
              Create categories with budget limits to track spending
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleCreateBudgetCategory}
            className="shadow-sm hover:shadow-md transition-all duration-200"
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
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-card-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Budget Tracking</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateBudgetCategory}
                    className="border-border hover:bg-accent hover:text-accent-foreground transition-colors"
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
        <CardContent className="space-y-3">
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
