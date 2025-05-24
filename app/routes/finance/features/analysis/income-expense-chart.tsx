import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function IncomeExpenseChart({
  summary,
}: {
  summary: FinancialSummary;
}) {
  // Using CSS custom properties for consistent theming with Zinc palette
  const data = [
    {
      name: "Income",
      value: summary.totalIncome,
      color: "hsl(var(--chart-2))", // Using chart-2 for income (green tone)
    },
    {
      name: "Expenses",
      value: summary.totalExpenses,
      color: "hsl(var(--chart-1))", // Using chart-1 for expenses (warm tone)
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-popover border border-border rounded-lg shadow-md p-3">
          <div className="text-sm font-medium text-popover-foreground">
            {data.name}
          </div>
          <div className="text-lg font-bold text-popover-foreground">
            ${data.value.toLocaleString()}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary"></div>
          Income vs Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                strokeWidth={2}
                stroke="hsl(var(--border))"
                label={(entry) => `$${entry.value.toLocaleString()}`}
                labelLine={false}
                aria-label="Income versus expenses pie chart"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2"></div>
            <span className="text-sm text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-1"></div>
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
