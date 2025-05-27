/** Represents spending trend analysis for a category */
export interface CategoryTrend {
  category_id: string;
  values: number[];
  trend: "increasing" | "decreasing" | "stable";
  forecast: number;
}
