import {
  BarChart3,
  Calendar,
  DollarSign,
  Hash,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type { CategoryWithAnalytics } from "~/routes/finance/presentation/types/ui.types";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { formatCurrency } from "~/routes/finance/presentation/utils/formatters";

interface CategoryDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryWithAnalytics | null;
  onEdit?: () => void;
}

export default function CategoryDetailsDialog({
  open,
  onOpenChange,
  category,
  onEdit,
}: CategoryDetailsDialogProps) {
  if (!category) return null;

  const getTrendIcon = () => {
    switch (category.spending_trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-chart-2" />;
      default:
        return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendText = () => {
    switch (category.spending_trend) {
      case "increasing":
        return "Spending has been increasing";
      case "decreasing":
        return "Spending has been decreasing";
      default:
        return "Spending has been stable";
    }
  };

  const getBudgetProgress = () => {
    if (!category.budget_limit) return null;
    const percentage = (category.spent / category.budget_limit) * 100;
    return Math.min(percentage, 100);
  };

  const getBudgetStatus = () => {
    if (!category.budget_limit) return null;
    const percentage = (category.spent / category.budget_limit) * 100;
    if (percentage >= 100)
      return { status: "Over budget", color: "destructive" };
    if (percentage >= 80)
      return { status: "Approaching limit", color: "warning" };
    return { status: "Within budget", color: "success" };
  };

  const budgetProgress = getBudgetProgress();
  const budgetStatus = getBudgetStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {category.icon && (
              <span
                className="text-2xl"
                style={{ color: category.color || undefined }}
              >
                {category.icon}
              </span>
            )}
            <div>
              <div className="flex items-center gap-2">
                {category.name}
                {category.is_archived && (
                  <Badge variant="secondary" className="text-xs">
                    Archived
                  </Badge>
                )}
              </div>
              <div className="text-sm font-normal text-muted-foreground capitalize">
                {category.type} category
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Spending Overview */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Spending Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Total Spent
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(category.spent)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Transactions
                </div>
                <div className="text-2xl font-bold">
                  {category.transaction_count || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Budget Information */}
          {category.budget_limit && budgetProgress !== null && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Budget Tracking</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Budget Limit ({category.budget_period})
                    </span>
                    <span className="font-medium">
                      {formatCurrency(category.budget_limit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Remaining
                    </span>
                    <span
                      className={`font-medium ${
                        category.spent > category.budget_limit
                          ? "text-destructive"
                          : "text-chart-2"
                      }`}
                    >
                      {formatCurrency(
                        Math.max(0, category.budget_limit - category.spent),
                      )}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Progress
                      </span>
                      <span className="text-sm font-medium">
                        {budgetProgress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          budgetProgress >= 100
                            ? "bg-destructive"
                            : budgetProgress >= 80
                              ? "bg-chart-4"
                              : "bg-chart-2"
                        }`}
                        style={{
                          width: `${Math.min(budgetProgress, 100)}%`,
                        }}
                      />
                    </div>
                    {budgetStatus && (
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            budgetStatus.color === "destructive"
                              ? "bg-destructive"
                              : budgetStatus.color === "warning"
                                ? "bg-chart-4"
                                : "bg-chart-2"
                          }`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {budgetStatus.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Spending Trend */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Spending Trend</h3>
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>{getTrendIcon()}</TooltipTrigger>
                  <TooltipContent>
                    <p>{getTrendText()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm text-muted-foreground">
                {getTrendText()}
              </span>
            </div>
          </div>

          {/* Last Activity */}
          {category.last_transaction_date && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Last Activity</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Last transaction on{" "}
                  {new Date(category.last_transaction_date).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <Separator />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && <Button onClick={onEdit}>Edit Category</Button>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
