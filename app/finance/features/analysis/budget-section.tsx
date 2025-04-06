import { clsx } from "clsx";
import {
  AlertTriangle,
  BadgeInfo,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  getBudgetRecommendation,
  getBudgetStatusMessage,
  getBudgetWarningLevel,
} from "~/finance/shared/utils/budget";

interface BudgetSectionProps {
  budgets: Budget[];
  trends?: CategoryTrend[];
  onBudgetClick?: (category: TransactionCategory) => void;
}

export default function BudgetSection({
  budgets,
  trends = [],
  onBudgetClick,
}: BudgetSectionProps) {
  const getBudgetStatusIcon = (budget: Budget) => {
    const status = getBudgetWarningLevel(budget);
    switch (status) {
      case "safe":
        return <Check className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getProgressColor = (budget: Budget) => {
    const status = getBudgetWarningLevel(budget);
    switch (status) {
      case "safe":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "danger":
        return "bg-red-500";
    }
  };

  const getTrendIcon = (trend?: CategoryTrend) => {
    if (!trend) return null;
    switch (trend.trend) {
      case "increasing":
        return <ChevronUp className="h-4 w-4 text-red-500" />;
      case "decreasing":
        return <ChevronDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Monthly Budgets</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
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
          if (budget.category === "salary") return null; // Skip income categories
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          const trend = trends.find((t) => t.category === budget.category);
          const recommendation = getBudgetRecommendation(budget, trends);

          return (
            <div
              key={budget.category}
              className="space-y-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onBudgetClick?.(budget.category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="capitalize font-medium">
                    {budget.category}
                  </span>
                  {getBudgetStatusIcon(budget)}
                  {getTrendIcon(trend)}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-sm text-muted-foreground">
                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getBudgetStatusMessage(budget)}</p>
                      {recommendation && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {recommendation}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Progress
                  value={percentage}
                  className={clsx("h-2", getProgressColor(budget))}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
