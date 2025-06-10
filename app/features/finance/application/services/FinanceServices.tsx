import React, { createContext, useContext } from "react";

import type { ReactNode } from "react";

import { CreateTransactionUseCase } from "~/features/finance/application/use-cases/CreateTransaction";
import { DeleteTransactionUseCase } from "~/features/finance/application/use-cases/DeleteTransaction";
import { GetTransactionsUseCase } from "~/features/finance/application/use-cases/GetTransactions";
import { UpdateTransactionUseCase } from "~/features/finance/application/use-cases/UpdateTransaction";
import { TransactionApiClient } from "~/features/finance/infrastructure/clients/TransactionApiClient";
import { TransactionRepositoryImpl } from "~/features/finance/infrastructure/repositories/TransactionRepository";

/**
 * Finance Services Container
 * Provides dependency injection for the finance feature
 */
export interface FinanceServices {
  createTransactionUseCase: CreateTransactionUseCase;
  getTransactionsUseCase: GetTransactionsUseCase;
  updateTransactionUseCase: UpdateTransactionUseCase;
  deleteTransactionUseCase: DeleteTransactionUseCase;
}

/**
 * Create finance services with dependencies
 */
export function createFinanceServices(): FinanceServices {
  // Infrastructure layer
  const apiClient = new TransactionApiClient();
  const transactionRepository = new TransactionRepositoryImpl(apiClient);

  // Application layer
  const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepository,
  );
  const getTransactionsUseCase = new GetTransactionsUseCase(
    transactionRepository,
  );
  const updateTransactionUseCase = new UpdateTransactionUseCase(
    transactionRepository,
  );
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    transactionRepository,
  );

  return {
    createTransactionUseCase,
    getTransactionsUseCase,
    updateTransactionUseCase,
    deleteTransactionUseCase,
  };
}

// React Context for dependency injection
const FinanceServicesContext = createContext<FinanceServices | null>(null);

export interface FinanceServicesProviderProps {
  children: ReactNode;
  services?: FinanceServices;
}

/**
 * Provider component for finance services
 */
export function FinanceServicesProvider({
  children,
  services = createFinanceServices(),
}: FinanceServicesProviderProps) {
  return (
    <FinanceServicesContext.Provider value={services}>
      {children}
    </FinanceServicesContext.Provider>
  );
}

/**
 * Hook to access finance services
 */
export function useFinanceServices(): FinanceServices {
  const context = useContext(FinanceServicesContext);
  if (!context) {
    throw new Error(
      "useFinanceServices must be used within a FinanceServicesProvider",
    );
  }
  return context;
}
