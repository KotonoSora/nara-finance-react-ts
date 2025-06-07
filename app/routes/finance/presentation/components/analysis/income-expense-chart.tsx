import { lazy, Suspense } from "react";

import type { FinancialSummary } from "~/routes/finance/presentation/types/ui.types";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const LazyIncomeExpenseChart = lazy(
  () =>
    import(
      "~/routes/finance/presentation/components/analysis/income-expense-chart-impl"
    ),
);

const ChartSkeleton = () => (
  <div className="w-full h-full bg-muted/10 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-sm text-muted-foreground">Loading chart...</div>
  </div>
);

export default function IncomeExpenseChart({
  summary,
}: {
  summary: FinancialSummary;
}) {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 md:p-6">
        <CardTitle className="text-card-foreground flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg">
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary"></div>
          Income vs Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <Suspense fallback={<ChartSkeleton />}>
          <LazyIncomeExpenseChart summary={summary} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
