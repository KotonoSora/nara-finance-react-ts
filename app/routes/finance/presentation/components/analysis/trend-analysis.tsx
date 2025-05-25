import { lazy, Suspense } from "react";

import type {
  CategoryTrend,
  TransactionCategory,
} from "~/routes/finance/presentation/types";

const LazyTrendAnalysis = lazy(() => import("./trend-analysis-impl"));

const ChartSkeleton = () => (
  <div className="w-full h-full bg-muted/10 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-sm text-muted-foreground">Loading trends chart...</div>
  </div>
);

interface TrendAnalysisProps {
  trends: CategoryTrend[];
  onCategorySelect?: (category: TransactionCategory) => void;
}

export default function TrendAnalysis({
  trends,
  onCategorySelect,
}: TrendAnalysisProps) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <LazyTrendAnalysis trends={trends} onCategorySelect={onCategorySelect} />
    </Suspense>
  );
}
