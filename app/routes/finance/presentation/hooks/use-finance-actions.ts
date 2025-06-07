import { useCallback, useState } from "react";

import type { Category } from "~/routes/finance/domain/entities/category.entity";
import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";
import type { DatabaseContext } from "~/routes/finance/infrastructure/database-context";

import {
  ArchiveCategoryUseCase,
  CreateCategoryUseCase,
  MergeCategoriesUseCase,
  UpdateCategoryUseCase,
} from "~/routes/finance/application/use-cases/category-use-cases";
import {
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
  UpdateTransactionUseCase,
} from "~/routes/finance/application/use-cases/transaction-use-cases";
import {
  showErrorToast,
  showSuccessToast,
} from "~/routes/finance/presentation/utils/toast.utils";

export function useFinanceActions(dbContext: DatabaseContext) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = useCallback(
    async (data: Omit<Transaction, "id">) => {
      setIsLoading(true);
      setError(null);
      try {
        const useCase = new CreateTransactionUseCase(dbContext);
        const result = await useCase.execute(data);
        showSuccessToast("Transaction created successfully");
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create transaction";
        setError(message);
        showErrorToast(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dbContext],
  );

  const updateTransaction = useCallback(
    async (id: string, data: Partial<Transaction>) => {
      setIsLoading(true);
      setError(null);
      try {
        const useCase = new UpdateTransactionUseCase(dbContext);
        const result = await useCase.execute({ id, changes: data });
        showSuccessToast("Transaction updated successfully");
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update transaction";
        setError(message);
        showErrorToast(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dbContext],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const useCase = new DeleteTransactionUseCase(dbContext);
        await useCase.execute(id);
        showSuccessToast("Transaction deleted successfully");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete transaction";
        setError(message);
        showErrorToast(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dbContext],
  );

  const createCategory = useCallback(
    async (data: Omit<Category, "id">) => {
      setIsLoading(true);
      setError(null);
      try {
        const useCase = new CreateCategoryUseCase(dbContext);
        const result = await useCase.execute(data);
        showSuccessToast("Category created successfully");
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create category";
        setError(message);
        showErrorToast(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dbContext],
  );

  const updateCategory = useCallback(
    async (id: string, data: Partial<Category>) => {
      setIsLoading(true);
      setError(null);
      try {
        const useCase = new UpdateCategoryUseCase(dbContext);
        const result = await useCase.execute({ id, changes: data });
        showSuccessToast("Category updated successfully");
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update category";
        setError(message);
        showErrorToast(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dbContext],
  );

  const archiveCategory = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const useCase = new ArchiveCategoryUseCase(dbContext);
        await useCase.execute(id);
        showSuccessToast("Category archived successfully");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to archive category";
        setError(message);
        showErrorToast(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dbContext],
  );

  const mergeCategories = useCallback(
    async (sourceIds: string[], targetId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const useCase = new MergeCategoriesUseCase(dbContext);
        await useCase.execute({ sourceIds, targetId });
        showSuccessToast("Categories merged successfully");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to merge categories";
        setError(message);
        showErrorToast(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dbContext],
  );

  return {
    isLoading,
    error,
    actions: {
      createTransaction,
      updateTransaction,
      deleteTransaction,
      createCategory,
      updateCategory,
      archiveCategory,
      mergeCategories,
    },
  };
}
