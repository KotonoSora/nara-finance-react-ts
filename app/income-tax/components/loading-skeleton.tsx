import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function TaxCalculatorSkeleton() {
  return (
    <Card className="p-6 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
