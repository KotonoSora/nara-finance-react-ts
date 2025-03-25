import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function TrendAnalysis({ trends }: { trends: CategoryTrend[] }) {
  const chartData = trends[0].values.map((_, index) => ({
    date: `Day ${index + 1}`,
    ...trends.reduce(
      (acc, trend) => ({
        ...acc,
        [trend.category]: trend.values[index],
      }),
      {},
    ),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {trends.map((trend) => (
                <Line
                  key={trend.category}
                  type="monotone"
                  dataKey={trend.category}
                  stroke={trend.category === "salary" ? "#22c55e" : "#3b82f6"}
                  name={
                    trend.category.charAt(0).toUpperCase() +
                    trend.category.slice(1)
                  }
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
