import { lazy, Suspense } from "react";

import type { CategoryTrend } from "~/routes/finance/domain/types/analytics.types";

const LazyTrendAnalysis = lazy(
  () =>
    import(
      "~/routes/finance/presentation/components/analysis/trend-analysis-impl"
    ),
);

const ChartSkeleton = () => (
  <div className="w-full h-full bg-muted/10 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-sm text-muted-foreground">Loading trends chart...</div>
  </div>
);

interface TrendAnalysisProps {
  trends: CategoryTrend[];
  onCategorySelect?: (category: string) => void; // category_id
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
