import { lazy, Suspense } from "react";

import type {
  Budget,
  CategoryTrend,
} from "~/routes/finance/presentation/types";

interface SpendingChartProps {
  data: { category: string; amount: number; color: string }[];
  onCategorySelect?: (category: string) => void;
  budgets?: Budget[];
  trends?: CategoryTrend[];
}

const LazySpendingChart = lazy(() => import("./spending-chart-impl"));

const ChartSkeleton = () => (
  <div className="w-full h-full bg-muted/10 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-sm text-muted-foreground">Loading chart...</div>
  </div>
);

export default function SpendingChart({
  data,
  onCategorySelect,
  budgets,
  trends,
}: SpendingChartProps) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <LazySpendingChart
        data={data}
        onCategorySelect={onCategorySelect}
        budgets={budgets}
        trends={trends}
      />
    </Suspense>
  );
}
