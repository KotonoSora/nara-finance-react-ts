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
} from "~/routes/finance/shared/utils/budget";

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
        return <Check className="h-4 w-4 text-chart-2" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-chart-4" />;
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getProgressColor = (budget: Budget) => {
    const status = getBudgetWarningLevel(budget);
    switch (status) {
      case "safe":
        return "bg-chart-2";
      case "warning":
        return "bg-chart-4";
      case "danger":
        return "bg-destructive";
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
          if (budget.category === "salary") return null; // Skip income categories
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          const trend = trends.find((t) => t.category === budget.category);
          const recommendation = getBudgetRecommendation(budget, trends);

          return (
            <div
              key={budget.category}
              className="space-y-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-all duration-200 hover:border-primary/50"
              onClick={() => onBudgetClick?.(budget.category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="capitalize font-medium text-card-foreground">
                    {budget.category}
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
