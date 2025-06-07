/**
 * Toast Notification Utilities - Presentation Layer
 *
 * Centralized toast notifications for finance operations
 */

import { toast } from "sonner";

// ============================================================================
// BASIC TOAST FUNCTIONS
// ============================================================================

export function showSuccessToast(message: string): void {
  toast.success(message);
}

export function showErrorToast(message: string): void {
  toast.error(message);
}

export function showWarningToast(message: string): void {
  toast.warning(message);
}

export function showInfoToast(message: string): void {
  toast.info(message);
}

// ============================================================================
// FINANCE-SPECIFIC TOAST FUNCTIONS
// ============================================================================

export function showTransactionAddedToast(
  amount: number,
  type: "income" | "expense" | "investment",
): void {
  let prefix: string;
  switch (type) {
    case "income":
      prefix = "Income";
      break;
    case "expense":
      prefix = "Expense";
      break;
    case "investment":
      prefix = "Investment";
      break;
  }
  showSuccessToast(
    `${prefix} of $${amount.toLocaleString()} added successfully`,
  );
}

export function showTransactionUpdatedToast(): void {
  showSuccessToast("Transaction updated successfully");
}

export function showTransactionDeletedToast(): void {
  showSuccessToast("Transaction deleted successfully");
}

export function showBudgetWarningToast(
  category: string,
  remaining: number,
): void {
  showWarningToast(
    `Budget warning: Only $${remaining.toLocaleString()} remaining for ${category}`,
  );
}

export function showBudgetExceededToast(
  category: string,
  overage: number,
): void {
  showErrorToast(
    `Budget exceeded: Over by $${overage.toLocaleString()} for ${category}`,
  );
}

export function showCategoryCreatedToast(name: string): void {
  showSuccessToast(`Category "${name}" created successfully`);
}

export function showCategoryUpdatedToast(name: string): void {
  showSuccessToast(`Category "${name}" updated successfully`);
}

export function showCategoryArchivedToast(name: string): void {
  showSuccessToast(`Category "${name}" archived successfully`);
}

// ============================================================================
// EXPORT/IMPORT TOAST FUNCTIONS
// ============================================================================

export function showExportToastFromPromise<T>(promise: Promise<T>): void {
  toast.promise(promise, {
    loading: "Exporting data...",
    success: "Export completed successfully",
    error: "Failed to export data",
  });
}

export function showImportToastFromPromise<T>(promise: Promise<T>): void {
  toast.promise(promise, {
    loading: "Importing data...",
    success: "Import completed successfully",
    error: "Failed to import data",
  });
}
