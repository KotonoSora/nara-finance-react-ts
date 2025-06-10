// Domain exports
export { Transaction } from "~/features/finance/domain/entities/Transaction";
export {
  TransactionType,
  isValidTransactionType,
  getTransactionTypeLabel,
} from "~/features/finance/domain/value-objects/TransactionType";
export { TransactionId } from "~/features/finance/domain/value-objects/TransactionId";
export { Money } from "~/features/finance/domain/value-objects/Money";

// Application layer exports
export {
  CreateTransactionUseCase,
  type CreateTransactionCommand,
  type TransactionRepository,
} from "~/features/finance/application/use-cases/CreateTransaction";
export {
  GetTransactionsUseCase,
  type GetTransactionsQuery,
} from "~/features/finance/application/use-cases/GetTransactions";
export {
  UpdateTransactionUseCase,
  type UpdateTransactionCommand,
} from "~/features/finance/application/use-cases/UpdateTransaction";
export { DeleteTransactionUseCase } from "~/features/finance/application/use-cases/DeleteTransaction";

// Hooks
export {
  useCreateTransaction,
  type UseCreateTransactionOptions,
  type UseCreateTransactionReturn,
} from "~/features/finance/application/hooks/useCreateTransaction";
export {
  useTransactions,
  type UseTransactionsOptions,
  type UseTransactionsReturn,
} from "~/features/finance/application/hooks/useTransactions";

// Services and DI
export {
  FinanceServicesProvider,
  useFinanceServices,
  createFinanceServices,
  type FinanceServices,
} from "~/features/finance/application/services/FinanceServices";

// Infrastructure
export { TransactionApiClient } from "~/features/finance/infrastructure/clients/TransactionApiClient";
export { TransactionRepositoryImpl } from "~/features/finance/infrastructure/repositories/TransactionRepository";

// Components (legacy, will be refactored)
export { default as CreateTransactionForm } from "~/features/finance/components/CreateTransactionForm";
export { default as TransactionsList } from "~/features/finance/components/TransactionsList";
export { default as CreateTransactionModal } from "~/features/finance/components/CreateTransactionModal";
export { default as EditTransactionModal } from "~/features/finance/components/EditTransactionModal";
export { default as CurrenciesList } from "~/features/finance/components/CurrenciesList";
export { default as GenerateCurrencies } from "~/features/finance/components/GenerateCurrencies";
