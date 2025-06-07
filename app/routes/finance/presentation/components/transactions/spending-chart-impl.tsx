import clsx from "clsx";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SpendingChartProps } from "~/routes/finance/presentation/types/ui.types";

import { formatCurrency } from "~/routes/finance/presentation/utils/formatters";

export function SpendingChartImpl({
  data,
  onCategorySelect,
  budgets,
  trends,
}: SpendingChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="category"
          tickFormatter={(value: string) =>
            value.charAt(0).toUpperCase() + value.slice(1)
          }
        />
        <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const data = payload[0].payload;
            const budget = budgets?.find(
              (b: any) => b.category_id === data.category,
            );
            const trend = trends?.find(
              (t: any) => t.category_id === data.category,
            );

            return (
              <div className="rounded-lg border border-border/50 bg-card p-3 shadow-sm">
                <div className="font-medium mb-1 text-foreground">
                  {data.category.charAt(0).toUpperCase() +
                    data.category.slice(1)}
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(data.amount)}
                </div>
                {budget && (
                  <div className="text-sm mt-2">
                    <div className="flex justify-between mb-1">
                      <span>Budget</span>
                      <span>{formatCurrency(budget.limit)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={clsx("h-full rounded-full", {
                          "bg-chart-2": budget.spent / budget.limit < 0.8,
                          "bg-chart-4":
                            budget.spent / budget.limit >= 0.8 &&
                            budget.spent / budget.limit < 1,
                          "bg-destructive": budget.spent / budget.limit >= 1,
                        })}
                        style={{
                          width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {trend && (
                  <div className="text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      Trend:
                      <span
                        className={clsx({
                          "text-chart-2": trend.trend === "increasing",
                          "text-destructive": trend.trend === "decreasing",
                          "text-chart-4": trend.trend === "stable",
                        })}
                      >
                        {trend.trend}
                      </span>
                    </div>
                    <div>Forecast: ${trend.forecast.toFixed(2)}</div>
                  </div>
                )}
              </div>
            );
          }}
        />
        <Bar
          dataKey="amount"
          fill="hsl(var(--chart-1))"
          onClick={(data: any) => onCategorySelect?.(data.category)}
          className="cursor-pointer transition-opacity hover:opacity-80"
        >
          {data.map((entry: any, index: number) => {
            const budget = budgets?.find(
              (b: any) => b.category_id === entry.category,
            );
            return (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={budget && budget.spent > budget.limit ? 0.7 : 1}
              />
            );
          })}
        </Bar>
        {trends && trends.length > 0 && (
          <ReferenceLine
            y={Math.max(
              ...data.map(
                (d: any) =>
                  trends?.find((t: any) => t.category_id === d.category)
                    ?.forecast || 0,
              ),
            )}
            label="Forecast"
            stroke="var(--primary)"
            strokeDasharray="3 3"
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SpendingChartImpl;
