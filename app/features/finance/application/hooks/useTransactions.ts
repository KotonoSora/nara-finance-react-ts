import { useCallback, useEffect, useState } from "react";

import type { GetTransactionsQuery } from "~/features/finance/application/use-cases/GetTransactions";

import { GetTransactionsUseCase } from "~/features/finance/application/use-cases/GetTransactions";
import { Transaction } from "~/features/finance/domain/entities/Transaction";
import { type TransactionType } from "~/features/finance/domain/value-objects/TransactionType";

export interface UseTransactionsOptions {
  autoLoad?: boolean;
  initialQuery?: GetTransactionsQuery;
}

export interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadTransactions: (query?: GetTransactionsQuery) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * React hook for managing transactions list
 */
export function useTransactions(
  getTransactionsUseCase: GetTransactionsUseCase,
  options: UseTransactionsOptions = {},
): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<GetTransactionsQuery>(
    options.initialQuery || {},
  );

  const loadTransactions = useCallback(
    async (query: GetTransactionsQuery = {}) => {
      setLoading(true);
      setError(null);

      try {
        const result = await getTransactionsUseCase.execute(query);
        setTransactions(result.transactions);
        setHasMore(result.hasMore);
        setCurrentQuery(query);
      } catch (err: any) {
        setError(err.message || "Failed to load transactions");
        setTransactions([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [getTransactionsUseCase],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const nextQuery = {
        ...currentQuery,
        offset: (currentQuery.offset || 0) + (currentQuery.limit || 10),
      };

      const result = await getTransactionsUseCase.execute(nextQuery);
      setTransactions((prev) => [...prev, ...result.transactions]);
      setHasMore(result.hasMore);
      setCurrentQuery(nextQuery);
    } catch (err: any) {
      setError(err.message || "Failed to load more transactions");
    } finally {
      setLoading(false);
    }
  }, [getTransactionsUseCase, currentQuery, hasMore, loading]);

  const refresh = useCallback(async () => {
    const refreshQuery = { ...currentQuery, offset: 0 };
    await loadTransactions(refreshQuery);
  }, [loadTransactions, currentQuery]);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (options.autoLoad !== false) {
      loadTransactions(options.initialQuery);
    }
  }, [loadTransactions, options.autoLoad, options.initialQuery]);

  return {
    transactions,
    loading,
    error,
    hasMore,
    loadTransactions,
    loadMore,
    refresh,
  };
}
