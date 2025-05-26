import { format, subMonths } from "date-fns";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BadgeInfo,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CategoryTrend } from "~/routes/finance/types/finance";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "~/components/ui/tooltip";
import { getTrendSummary } from "~/routes/finance/domain/services/trends.service";

interface TrendAnalysisImplProps {
  trends: CategoryTrend[];
  onCategorySelect?: (category: string) => void; // category_id
}

type ChartDataPoint = {
  month: string;
  amount: number;
};

export function TrendAnalysisImpl({
  trends,
  onCategorySelect,
}: TrendAnalysisImplProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all",
  );

  const handleCategorySelect = (category: string | "all") => {
    setSelectedCategory(category);
    if (category !== "all" && onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const visibleTrends =
    selectedCategory === "all"
      ? trends
      : trends.filter((t) => t.category_id === selectedCategory);

  const getTrendIcon = (trend: "increasing" | "decreasing" | "stable") => {
    switch (trend) {
      case "increasing":
        return <ArrowUpIcon className="h-4 w-4 text-destructive" />;
      case "decreasing":
        return <ArrowDownIcon className="h-4 w-4 text-chart-2" />;
      case "stable":
        return <ArrowRightIcon className="h-4 w-4 text-chart-4" />;
    }
  };

  const getChartData = (trend: CategoryTrend) => {
    return trend.values.map((value, index) => ({
      month: format(
        subMonths(new Date(), trend.values.length - 1 - index),
        "MMM",
      ),
      amount: value,
    }));
  };

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            Spending Trends
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <BadgeInfo className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analysis of your spending patterns over time</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
          <Select
            value={selectedCategory}
            onValueChange={(value: string | "all") =>
              handleCategorySelect(value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {trends.map((t) => (
                <SelectItem key={t.category_id} value={t.category_id}>
                  {t.category_id.charAt(0).toUpperCase() +
                    t.category_id.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {visibleTrends.map((trend) => (
          <div
            key={trend.category_id}
            className="space-y-3 p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-all duration-200 hover:border-primary/50"
            onClick={() => handleCategorySelect(trend.category_id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="capitalize font-medium text-card-foreground">
                  {trend.category_id}
                </span>
                {getTrendIcon(trend.trend)}
              </div>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Forecast: ${trend.forecast.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {getTrendSummary(trend)}
            </p>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData(trend)}>
                  <defs>
                    <linearGradient
                      id={`gradient-${trend.category_id}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--primary)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="month"
                    fontSize={12}
                    tickLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]?.payload) return null;
                      const data = payload[0].payload as ChartDataPoint;
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                          <div className="font-medium text-foreground">
                            {data.month}
                          </div>
                          <div className="text-muted-foreground">
                            ${data.amount.toFixed(2)}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--primary)"
                    fill={`url(#gradient-${trend.category_id})`}
                    strokeWidth={2}
                    animationDuration={0} // Disable animations for better performance
                    isAnimationActive={false} // Disable all animations
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default TrendAnalysisImpl;
