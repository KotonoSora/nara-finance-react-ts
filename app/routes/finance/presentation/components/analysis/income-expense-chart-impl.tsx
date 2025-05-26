import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { FinancialSummary } from "~/routes/finance/presentation/types/ui.types";

interface IncomeExpenseChartImplProps {
  summary: FinancialSummary;
}

export function IncomeExpenseChartImpl({
  summary,
}: IncomeExpenseChartImplProps) {
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
        <div className="bg-popover border border-border rounded-lg shadow-md p-2 sm:p-3">
          <div className="text-xs sm:text-sm font-medium text-popover-foreground">
            {data.name}
          </div>
          <div className="text-base sm:text-lg font-bold text-popover-foreground">
            ${data.value.toLocaleString()}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="h-[200px] sm:h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              strokeWidth={2}
              stroke="hsl(var(--border))"
              label={(entry) => `$${entry.value.toLocaleString()}`}
              labelLine={false}
              aria-label="Income versus expenses pie chart"
              animationDuration={0} // Disable animations for better performance
              isAnimationActive={false} // Disable all animations
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-3 sm:mt-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-chart-2"></div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            Income
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-chart-1"></div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            Expenses
          </span>
        </div>
      </div>
    </>
  );
}

export default IncomeExpenseChartImpl;
