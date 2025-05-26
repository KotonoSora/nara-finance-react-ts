// Entity types

/** Category entity interface */
export type { Category, CategoryProps } from "../entities/category.entity";

/** Category form data for creating/editing categories */
export type CategoryFormData =
  import("../entities/category.entity").CategoryProps;

/** Transaction entity interface */
export type {
  Transaction,
  TransactionProps,
} from "../entities/transaction.entity";

/** Budget entity interface */
export type { Budget, BudgetProps } from "../entities/budget.entity";
