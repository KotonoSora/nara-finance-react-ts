// Domain Types - Core business logic types
export type TransactionType = "income" | "expense" | "investment";
export type CategoryType = "income" | "expense" | "investment";
export type BudgetPeriod = "monthly" | "weekly" | "yearly";
export type TransactionCategory =
  | "food"
  | "transport"
  | "shopping"
  | "salary"
  | "other";

// Re-export entity interfaces
export type {
  Transaction,
  TransactionProps,
} from "~/routes/finance/domain/entities/transaction.entity";
export type {
  Category,
  CategoryProps,
} from "~/routes/finance/domain/entities/category.entity";
export type {
  Budget,
  BudgetProps,
} from "~/routes/finance/domain/entities/budget.entity";
