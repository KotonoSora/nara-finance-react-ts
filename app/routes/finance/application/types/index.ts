// Use Case Input/Output Types
export interface CreateTransactionInput {
  date: Date;
  amount: number;
  type: "income" | "expense" | "investment";
  category_id: string;
  description: string;
}

export interface UpdateTransactionInput {
  id: string;
  changes: Partial<CreateTransactionInput>;
}

export interface CreateCategoryInput {
  name: string;
  type: "income" | "expense" | "investment";
  parent_id?: string | null;
  budget_limit?: number | null;
  budget_period: "monthly" | "weekly" | "yearly";
  icon?: string | null;
  color?: string | null;
}

export interface UpdateCategoryInput {
  id: string;
  changes: Partial<CreateCategoryInput>;
}

// Service Types
export interface AnalyticsResult {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categorySummary: Record<string, number>;
  trends: CategoryTrend[];
  forecastedExpenses: number;
  forecastedSavings: number;
}

export interface CategoryTrend {
  category_id: string;
  values: number[];
  trend: "increasing" | "decreasing" | "stable";
  forecast: number;
  average: number;
}
