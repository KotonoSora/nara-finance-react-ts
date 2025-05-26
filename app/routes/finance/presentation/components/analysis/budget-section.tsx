import {
  AlertTriangle,
  BadgeInfo,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import type { CategoryTrend } from "~/routes/finance/domain/types/analytics.types";
import type { Budget } from "~/routes/finance/domain/types/entity.types";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface BudgetSectionProps {
  budgets: Budget[];
  trends?: CategoryTrend[];
  categories?: Array<{ id: string; name: string; type: string }>; // Added categories prop
  onBudgetClick?: (categoryId: string) => void; // Changed to use string (category_id)
}

export default function BudgetSection({
  budgets,
  trends = [],
  categories = [],
  onBudgetClick,
}: BudgetSectionProps) {
  const getBudgetWarningLevel = (
    budget: Budget,
  ): "safe" | "warning" | "danger" => {
    const percentage =
      budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;

    if (percentage >= 90) return "danger";
    if (percentage >= 75) return "warning";
    return "safe";
  };

  const getBudgetStatusMessage = (budget: Budget): string => {
    const percentage =
      budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
    const remaining = budget.limit - budget.spent;

    if (percentage >= 100) {
      return `Over budget by $${Math.abs(remaining).toLocaleString()}`;
    } else if (percentage >= 90) {
      return `Close to budget limit! $${remaining.toLocaleString()} remaining`;
    } else if (percentage >= 75) {
      return `Warning: $${remaining.toLocaleString()} remaining`;
    } else {
      return `On track: $${remaining.toLocaleString()} remaining`;
    }
  };

  const getBudgetRecommendation = (
    budget: Budget,
    trends: CategoryTrend[],
  ): string => {
    const trend = trends.find((t) => t.category_id === budget.category_id);
    if (!trend) return "";

    const warningLevel = getBudgetWarningLevel(budget);
    const spentPercentage =
      budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;

    if (warningLevel === "danger") {
      return "Consider reducing spending in this category.";
    } else if (trend.trend === "increasing" && spentPercentage > 50) {
      return "Spending is trending upward. Monitor closely.";
    } else if (trend.trend === "decreasing") {
      return "Good job! Spending in this category is decreasing.";
    }

    return "Keep monitoring your spending in this category.";
  };

  const getBudgetStatusIcon = (budget: Budget) => {
    const status = getBudgetWarningLevel(budget);
    switch (status) {
      case "safe":
        return <Check className="h-4 w-4 text-chart-2" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-chart-4" />;
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getTrendIcon = (trend?: CategoryTrend) => {
    if (!trend) return null;
    switch (trend.trend) {
      case "increasing":
        return <ChevronUp className="h-4 w-4 text-destructive" />;
      case "decreasing":
        return <ChevronDown className="h-4 w-4 text-chart-2" />;
      default:
        return null;
    }
  };

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-card-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span>Monthly Budgets</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <BadgeInfo className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Track your spending against monthly budget limits</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget) => {
          // Find the category to check its type
          const category = categories.find((c) => c.id === budget.category_id);
          if (category?.type === "income") return null; // Skip income categories

          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          const trend = trends.find(
            (t) => t.category_id === budget.category_id,
          );
          const recommendation = getBudgetRecommendation(budget, trends);

          return (
            <div
              key={budget.category_id}
              className="space-y-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-all duration-200 hover:border-primary/50"
              onClick={() => onBudgetClick?.(budget.category_id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="capitalize font-medium text-card-foreground">
                    {category?.name || "Unknown Category"}
                  </span>
                  {getBudgetStatusIcon(budget)}
                  {getTrendIcon(trend)}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        ${budget.spent.toLocaleString()} / $
                        {budget.limit.toLocaleString()}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p>{getBudgetStatusMessage(budget)}</p>
                        {recommendation && (
                          <p className="text-xs text-muted-foreground">
                            {recommendation}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-1">
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{percentage.toFixed(0)}% used</span>
                  <span>
                    ${(budget.limit - budget.spent).toLocaleString()} remaining
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
