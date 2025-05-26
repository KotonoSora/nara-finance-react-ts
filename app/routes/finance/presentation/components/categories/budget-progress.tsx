import { clsx } from "clsx";
import {
  AlertTriangle,
  Calendar,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type { CategoryWithAnalytics } from "~/routes/finance/presentation/types/ui.types";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { formatCurrency } from "~/routes/finance/presentation/utils/formatters";

interface BudgetProgressProps {
  category: CategoryWithAnalytics;
  onClick?: () => void;
  showTrend?: boolean;
  compact?: boolean;
}

export default function BudgetProgress({
  category,
  onClick,
  showTrend = true,
  compact = false,
}: BudgetProgressProps) {
  const budgetLimit = category.budget_limit || 0;
  const spent = category.spent || 0;
  const percentage =
    budgetLimit > 0 ? Math.min((spent / budgetLimit) * 100, 100) : 0;
  const remaining = Math.max(0, budgetLimit - spent);
  const isOverBudget = spent > budgetLimit;

  const getStatusColor = () => {
    if (isOverBudget) return "text-destructive";
    if (percentage >= 80) return "text-chart-4";
    return "text-chart-2";
  };

  const getProgressColor = () => {
    if (isOverBudget) return "bg-destructive";
    if (percentage >= 80) return "bg-chart-4";
    return "bg-chart-2";
  };

  const getTrendIcon = () => {
    if (!showTrend) return null;

    switch (category.spending_trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-chart-2" />;
      default:
        return null;
    }
  };

  const formatBudgetPeriod = (period: string) => {
    switch (period) {
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return "Monthly";
    }
  };

  if (compact) {
    return (
      <div
        className={`p-2 sm:p-3 md:p-4 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-all duration-200 ${
          onClick ? "hover:border-primary/50 hover:shadow-sm" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {category.icon && (
              <span
                className="text-sm sm:text-base md:text-lg"
                style={{
                  color: category.color || "hsl(var(--muted-foreground))",
                }}
              >
                {category.icon}
              </span>
            )}
            <span className="font-medium text-xs sm:text-sm md:text-base text-card-foreground truncate">
              {category.name}
            </span>
            {getTrendIcon()}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {isOverBudget && (
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
            )}
            <span
              className={clsx(
                "text-xs sm:text-sm font-medium",
                getStatusColor(),
              )}
            >
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
        <Progress value={percentage} className="h-1.5 sm:h-2" />
        <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
          <span>{formatCurrency(spent)}</span>
          <span>{formatCurrency(budgetLimit)}</span>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={clsx(
        "border border-border bg-card shadow-sm transition-all duration-200",
        onClick && "cursor-pointer hover:border-primary/50 hover:shadow-md",
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-card-foreground">
          <div className="flex items-center gap-3">
            {category.icon && (
              <span
                className="text-lg"
                style={{
                  color: category.color || "hsl(var(--muted-foreground))",
                }}
              >
                {category.icon}
              </span>
            )}
            <span>{category.name}</span>
            {getTrendIcon()}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {formatBudgetPeriod(category.budget_period)}
            </Badge>
            {isOverBudget && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Over budget by {formatCurrency(spent - budgetLimit)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className={clsx("font-medium", getStatusColor())}>
              {formatCurrency(spent)}
            </span>
          </div>
          <Progress value={percentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {isOverBudget
                ? `Over by ${formatCurrency(spent - budgetLimit)}`
                : `${formatCurrency(remaining)} remaining`}
            </span>
            <span>{percentage.toFixed(1)}% used</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Budget</span>
            <div className="font-medium text-foreground">
              {formatCurrency(budgetLimit)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Transactions</span>
            <div className="font-medium text-foreground">
              {category.transaction_count || 0}
            </div>
          </div>
        </div>

        {category.last_transaction_date && (
          <div className="text-xs text-muted-foreground border-t border-border pt-3">
            Last transaction:{" "}
            {new Date(category.last_transaction_date).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
