import { toast } from "sonner";

import { formatCurrency } from "~/routes/finance/shared/utils/format";

export function showTransactionAddedToast(
  amount: number,
  type: TransactionType,
) {
  toast.success("Transaction Added", {
    description: `${type === "expense" ? "Spent" : "Added"} ${formatCurrency(amount)}`,
  });
}

export function showTransactionUpdatedToast() {
  toast.success("Transaction Updated", {
    description: "Changes have been saved successfully",
  });
}

export function showTransactionDeletedToast() {
  toast.success("Transaction Deleted", {
    description: "The transaction has been removed",
  });
}

export function showBudgetWarningToast(
  category: TransactionCategory,
  remaining: number,
) {
  toast.warning("Budget Alert", {
    description: `${category} budget has ${formatCurrency(remaining)} remaining`,
  });
}

export function showErrorToast(message: string) {
  toast.error("Error", {
    description: message,
  });
}

// Import notifications
export const showImportStartedToast = () => {
  toast.loading("Importing transactions...", {
    description: "Please wait while we process your file",
  });
};

export const showImportCompletedToast = (count: number) => {
  toast.success("Import completed", {
    description: `Successfully imported ${count} transactions`,
  });
};

export const showImportErrorToast = (error: string) => {
  toast.error("Import failed", {
    description: error,
  });
};

export const showExportToast = (promise: Promise<ExportResult>) => {
  return toast.promise(promise, {
    loading: "Preparing export...",
    success: (data: ExportResult) =>
      `Your transactions have been exported to ${data.filename}`,
    error: (error: Error) => error.message || "Failed to export",
  });
};
