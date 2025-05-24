import { clsx } from "clsx";
import {
  AlertTriangle,
  Calendar,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

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
    if (isOverBudget) return "text-red-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getTrendIcon = () => {
    if (!showTrend) return null;

    switch (category.spending_trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
        className={`p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors ${
          onClick ? "hover:border-primary/50" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {category.icon && (
              <span style={{ color: category.color || undefined }}>
                {category.icon}
              </span>
            )}
            <span className="font-medium text-sm">{category.name}</span>
            {getTrendIcon()}
          </div>
          <div className="flex items-center gap-2">
            {isOverBudget && <AlertTriangle className="h-4 w-4 text-red-500" />}
            <span className={clsx("text-sm font-medium", getStatusColor())}>
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
        <Progress
          value={percentage}
          className={clsx("h-2", getProgressColor())}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatCurrency(spent)}</span>
          <span>{formatCurrency(budgetLimit)}</span>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={clsx(
        "transition-colors",
        onClick && "cursor-pointer hover:border-primary/50",
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {category.icon && (
              <span
                className="text-lg"
                style={{ color: category.color || undefined }}
              >
                {category.icon}
              </span>
            )}
            <span>{category.name}</span>
            {getTrendIcon()}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {formatBudgetPeriod(category.budget_period)}
            </Badge>
            {isOverBudget && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
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
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Spent</span>
            <span className={clsx("font-medium", getStatusColor())}>
              {formatCurrency(spent)}
            </span>
          </div>
          <Progress
            value={percentage}
            className={clsx("h-3", getProgressColor())}
          />
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
          <div>
            <span className="text-muted-foreground">Budget</span>
            <div className="font-medium">{formatCurrency(budgetLimit)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Transactions</span>
            <div className="font-medium">{category.transaction_count || 0}</div>
          </div>
        </div>

        {category.last_transaction_date && (
          <div className="text-xs text-muted-foreground">
            Last transaction:{" "}
            {new Date(category.last_transaction_date).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
