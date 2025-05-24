import { clsx } from "clsx";
import {
  Archive,
  Calendar,
  ChevronRight,
  DollarSign,
  Hash,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { formatCurrency } from "~/routes/finance/shared/utils/format";

interface CategorySummaryCardProps {
  category: CategoryWithAnalytics;
  onClick?: () => void;
  onViewDetails?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export default function CategorySummaryCard({
  category,
  onClick,
  onViewDetails,
  showActions = true,
  compact = false,
}: CategorySummaryCardProps) {
  const getTrendIcon = () => {
    switch (category.spending_trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-chart-2" />;
      default:
        return <div className="h-4 w-4" />; // Empty space for alignment
    }
  };

  const getTrendColor = () => {
    switch (category.spending_trend) {
      case "increasing":
        return "text-destructive";
      case "decreasing":
        return "text-chart-2";
      default:
        return "text-muted-foreground";
    }
  };

  const getBudgetStatus = () => {
    if (!category.budget_limit) return null;

    const percentage = (category.spent / category.budget_limit) * 100;
    if (percentage >= 100) return { status: "over", color: "bg-destructive" };
    if (percentage >= 80) return { status: "warning", color: "bg-chart-4" };
    return { status: "safe", color: "bg-chart-2" };
  };

  const budgetStatus = getBudgetStatus();

  if (compact) {
    return (
      <div
        className={clsx(
          "p-2 sm:p-3 md:p-4 rounded-lg border transition-colors",
          onClick && "cursor-pointer hover:border-primary/50 hover:bg-muted/50",
          category.is_archived && "opacity-60",
        )}
        onClick={onClick}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {category.icon && (
              <span
                className="text-sm sm:text-base"
                style={{ color: category.color || undefined }}
              >
                {category.icon}
              </span>
            )}
            <span className="font-medium text-xs sm:text-sm md:text-base truncate">
              {category.name}
            </span>
            {category.is_archived && (
              <Archive className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {budgetStatus && (
              <div
                className={clsx("w-2 h-2 rounded-full", budgetStatus.color)}
              />
            )}
            <span className="text-xs sm:text-sm md:text-base font-medium">
              {formatCurrency(category.spent)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={clsx(
        "transition-colors",
        onClick && "cursor-pointer hover:border-primary/50",
        category.is_archived && "opacity-60",
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 sm:pb-3 md:pb-4 p-3 sm:p-4 md:p-6">
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {category.icon && (
              <span
                className="text-base sm:text-lg md:text-xl"
                style={{ color: category.color || undefined }}
              >
                {category.icon}
              </span>
            )}
            <span className="text-sm sm:text-base md:text-lg truncate">
              {category.name}
            </span>
            {category.is_archived && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Archive className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This category is archived</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Badge
              variant="outline"
              className="text-[10px] sm:text-xs capitalize px-1 sm:px-2 py-0.5"
            >
              {category.type}
            </Badge>
            {budgetStatus && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className={clsx(
                        "w-3 h-3 rounded-full",
                        budgetStatus.color,
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Budget status:{" "}
                      {budgetStatus.status === "over" && "Over budget"}
                      {budgetStatus.status === "warning" && "Near limit"}
                      {budgetStatus.status === "safe" && "Within budget"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Total Spent
            </div>
            <div className="text-xl font-bold">
              {formatCurrency(category.spent)}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="h-4 w-4" />
              Transactions
            </div>
            <div className="text-xl font-bold">
              {category.transaction_count || 0}
            </div>
          </div>
        </div>

        {category.budget_limit && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Budget ({category.budget_period})
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {formatCurrency(category.budget_limit)}
              </span>
              <span
                className={clsx(
                  "text-sm",
                  budgetStatus?.status === "over" && "text-destructive",
                  budgetStatus?.status === "warning" && "text-chart-4",
                  budgetStatus?.status === "safe" && "text-chart-2",
                )}
              >
                {((category.spent / category.budget_limit) * 100).toFixed(1)}%
                used
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={clsx("text-sm font-medium", getTrendColor())}>
              {category.spending_trend === "increasing" && "Trending up"}
              {category.spending_trend === "decreasing" && "Trending down"}
              {category.spending_trend === "stable" && "Stable"}
            </span>
          </div>
          {showActions && onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
            >
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
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
