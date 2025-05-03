import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function IncomeExpenseChart({
  summary,
}: {
  summary: FinancialSummary;
}) {
  const data = [
    { name: "Income", value: summary.totalIncome, color: "#22c55e" },
    { name: "Expenses", value: summary.totalExpenses, color: "#ef4444" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
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
                outerRadius={80}
                label={(entry) => `$${entry.value.toFixed(2)}`}
                aria-label="Income versus expenses pie chart"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
