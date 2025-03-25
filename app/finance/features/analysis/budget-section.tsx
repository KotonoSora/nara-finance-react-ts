import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { getCategoryColor } from "~/finance/shared/utils/categories";

export default function BudgetSection({ budgets }: { budgets: Budget[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Budgets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isOverBudget = percentage > 100;

          return (
            <div key={budget.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium capitalize">
                  {budget.category}
                </span>
                <span className="text-muted-foreground">
                  ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                </span>
              </div>
              <Progress
                value={Math.min(percentage, 100)}
                className="h-2"
                style={
                  {
                    backgroundColor: `${getCategoryColor(budget.category)}40`,
                    "--progress-foreground": isOverBudget
                      ? "var(--destructive)"
                      : getCategoryColor(budget.category),
                  } as React.CSSProperties
                }
                aria-label={`${budget.category} budget progress: ${percentage.toFixed(1)}%`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
