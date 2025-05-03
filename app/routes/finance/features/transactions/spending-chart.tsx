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

export default function SpendingChart({
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
          tickFormatter={(value) =>
            value.charAt(0).toUpperCase() + value.slice(1)
          }
        />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const data = payload[0].payload;
            const budget = budgets?.find((b) => b.category === data.category);
            const trend = trends?.find((t) => t.category === data.category);

            return (
              <div className="rounded-lg border bg-card p-3 shadow-sm">
                <div className="font-medium mb-1">
                  {data.category.charAt(0).toUpperCase() +
                    data.category.slice(1)}
                </div>
                <div className="text-2xl font-bold">
                  ${data.amount.toFixed(2)}
                </div>
                {budget && (
                  <div className="text-sm mt-2">
                    <div className="flex justify-between mb-1">
                      <span>Budget</span>
                      <span>${budget.limit.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={clsx("h-full rounded-full", {
                          "bg-green-500": budget.spent / budget.limit < 0.8,
                          "bg-yellow-500":
                            budget.spent / budget.limit >= 0.8 &&
                            budget.spent / budget.limit < 1,
                          "bg-red-500": budget.spent / budget.limit >= 1,
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
                          "text-green-500": trend.trend === "increasing",
                          "text-red-500": trend.trend === "decreasing",
                          "text-yellow-500": trend.trend === "stable",
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
          fill="var(--primary)"
          onClick={(data) => onCategorySelect?.(data.category)}
          className="cursor-pointer transition-opacity hover:opacity-80"
        >
          {data.map((entry, index) => {
            const budget = budgets?.find((b) => b.category === entry.category);
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
                (d) =>
                  trends?.find((t) => t.category === d.category)?.forecast || 0,
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
