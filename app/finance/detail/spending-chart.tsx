import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function SpendingChart({
  data,
  onCategorySelect,
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
            return (
              <div className="rounded-lg border bg-card p-3 shadow-sm">
                <div className="font-medium mb-1">
                  {data.category.charAt(0).toUpperCase() +
                    data.category.slice(1)}
                </div>
                <div className="text-2xl font-bold">
                  ${data.amount.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Click to view transactions
                </div>
              </div>
            );
          }}
        />
        <Bar
          dataKey="amount"
          fill="var(--primary)"
          onClick={(data) => onCategorySelect?.(data.category)}
          className="cursor-pointer transition-opacity hover:opacity-80"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
