import { useCallback, useState } from "react";

import type { CreateTransactionCommand } from "~/features/finance/application/use-cases/CreateTransaction";

import { CreateTransactionUseCase } from "~/features/finance/application/use-cases/CreateTransaction";
import { TransactionType } from "~/features/finance/domain/value-objects/TransactionType";

export interface UseCreateTransactionOptions {
  onSuccess?: (transactionId: string) => void;
  onError?: (error: Error) => void;
}

export interface UseCreateTransactionReturn {
  createTransaction: (data: {
    type: "income" | "expense";
    amount: number;
    currencyCode: string;
    date: string;
    note?: string;
    category?: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * React hook for creating transactions
 * Bridges the UI layer with the Create Transaction use case
 */
export function useCreateTransaction(
  createTransactionUseCase: CreateTransactionUseCase,
  options?: UseCreateTransactionOptions,
): UseCreateTransactionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = useCallback(
    async (data: {
      type: "income" | "expense";
      amount: number;
      currencyCode: string;
      date: string;
      note?: string;
      category?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        // Convert UI data to domain command
        const command: CreateTransactionCommand = {
          type:
            data.type === "income"
              ? TransactionType.INCOME
              : TransactionType.EXPENSE,
          amount: data.amount,
          currencyCode: data.currencyCode,
          date: new Date(data.date),
          note: data.note,
          category: data.category,
        };

        // Execute use case
        const transaction = await createTransactionUseCase.execute(command);

        // Notify success
        options?.onSuccess?.(transaction.getId().getValue());
      } catch (err: any) {
        const errorMessage = err.message || "Failed to create transaction";
        setError(errorMessage);
        options?.onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    [createTransactionUseCase, options],
  );

  return {
    createTransaction,
    loading,
    error,
  };
}
