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
import { getTrendSummary } from "~/finance/shared/utils/trends";

interface TrendAnalysisProps {
  trends: CategoryTrend[];
  onCategorySelect?: (category: TransactionCategory) => void;
}

type ChartDataPoint = {
  month: string;
  amount: number;
};

export default function TrendAnalysis({
  trends,
  onCategorySelect,
}: TrendAnalysisProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    TransactionCategory | "all"
  >("all");

  const handleCategorySelect = (category: TransactionCategory | "all") => {
    setSelectedCategory(category);
    if (category !== "all" && onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const visibleTrends =
    selectedCategory === "all"
      ? trends
      : trends.filter((t) => t.category === selectedCategory);

  const getTrendIcon = (trend: "increasing" | "decreasing" | "stable") => {
    switch (trend) {
      case "increasing":
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      case "decreasing":
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case "stable":
        return <ArrowRightIcon className="h-4 w-4 text-yellow-500" />;
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Spending Trends
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <BadgeInfo className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analysis of your spending patterns over time</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
          <Select
            value={selectedCategory}
            onValueChange={(value: TransactionCategory | "all") =>
              handleCategorySelect(value)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {trends.map((t) => (
                <SelectItem key={t.category} value={t.category}>
                  {t.category.charAt(0).toUpperCase() + t.category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {visibleTrends.map((trend) => (
          <div
            key={trend.category}
            className="space-y-2 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleCategorySelect(trend.category)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="capitalize font-medium">{trend.category}</span>
                {getTrendIcon(trend.trend)}
              </div>
              <span className="text-sm text-muted-foreground">
                Forecast: ${trend.forecast.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {getTrendSummary(trend)}
            </p>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData(trend)}>
                  <defs>
                    <linearGradient
                      id={`gradient-${trend.category}`}
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]?.payload) return null;
                      const data = payload[0].payload as ChartDataPoint;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="font-medium">{data.month}</div>
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
                    fill={`url(#gradient-${trend.category})`}
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
