import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { TaxBreakdown } from "../types/tax";
import type { Language } from "../utils/translations";

import { formatCurrency, formatPercent } from "../utils/currency-formatter";
import { getTranslation } from "../utils/translations";

interface TaxChartImplProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  result: TaxBreakdown;
  country: string;
  language: Language;
}

export function TaxChartImpl({
  data,
  result,
  country,
  language,
}: TaxChartImplProps) {
  return (
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
          paddingAngle={2}
          label={({ name, value }) =>
            `${name}: ${formatCurrency(value, country)}`
          }
          animationDuration={0} // Disable animations for better performance
          isAnimationActive={false} // Disable all animations
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.color}
              strokeWidth={2}
              className="transition-all duration-200 hover:opacity-80 hover:stroke-2"
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const data = payload[0].payload;
            return (
              <div className="rounded-lg border bg-card p-3 shadow-lg">
                <div className="font-semibold">{data.name}</div>
                <div className="text-lg">
                  {formatCurrency(data.value, country)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatPercent((data.value / result.grossIncome) * 100)}{" "}
                  {getTranslation("Results.OfGrossIncome", language)}
                </div>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default TaxChartImpl;
