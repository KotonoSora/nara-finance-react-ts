import { useState } from "react";

import type {
  CategoryFormData,
  CategoryWithAnalytics,
} from "~/routes/finance/presentation/types/ui.types";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import CategoryFormDialog from "~/routes/finance/presentation/components/categories/category-form-dialog";

interface EnableBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryWithAnalytics[];
  onEnableBudget: (categoryId: string, data: CategoryFormData) => void;
}

export default function EnableBudgetDialog({
  open,
  onOpenChange,
  categories,
  onEnableBudget,
}: EnableBudgetDialogProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [budgetLimit, setBudgetLimit] = useState<string>("");
  const [budgetPeriod, setBudgetPeriod] = useState<
    "monthly" | "weekly" | "yearly"
  >("monthly");
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleEnableBudget = () => {
    if (!selectedCategory || !budgetLimit || parseFloat(budgetLimit) <= 0) {
      return;
    }
    const updateData: CategoryFormData = {
      name: selectedCategory.name,
      type: selectedCategory.type,
      parent_id: selectedCategory.parent_id || undefined, // Ensure parent_id is string or undefined
      budget_limit: parseFloat(budgetLimit),
      budget_period: budgetPeriod,
      icon: selectedCategory.icon || undefined,
      color: selectedCategory.color || undefined,
    };

    onEnableBudget(selectedCategory.id, updateData);

    // Reset form
    setSelectedCategoryId("");
    setBudgetLimit("");
    setBudgetPeriod("monthly");
  };

  const handleCreateNewCategory = () => {
    setShowCategoryForm(true);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enable Budget Tracking</DialogTitle>
            <DialogDescription>
              Choose an existing category to enable budget tracking, or create a
              new category with budget limits.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-select">Select Category</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon && `${category.icon} `}
                      {category.name}
                      <span className="text-muted-foreground ml-2 capitalize">
                        ({category.type})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="budget-limit">Budget Limit</Label>
                  <Input
                    id="budget-limit"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget-period">Budget Period</Label>
                  <Select
                    value={budgetPeriod}
                    onValueChange={(value: "monthly" | "weekly" | "yearly") =>
                      setBudgetPeriod(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleCreateNewCategory}
              className="w-full sm:w-auto"
            >
              Create New Category Instead
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEnableBudget}
                disabled={
                  !selectedCategory ||
                  !budgetLimit ||
                  parseFloat(budgetLimit) <= 0
                }
                className="flex-1 sm:flex-none"
              >
                Enable Budget
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CategoryFormDialog
        open={showCategoryForm}
        onOpenChange={setShowCategoryForm}
        onSubmit={(data) => {
          // This will be handled by the parent component's onCreateCategory
          setShowCategoryForm(false);
        }}
        allCategories={categories} // Changed prop name from categories to allCategories
        mode="create"
      />
    </>
  );
}
