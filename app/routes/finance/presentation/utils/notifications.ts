import { toast } from "sonner";

import { Money } from "../../domain/value-objects/money.value";

export const showTransactionAddedToast = (
  amount: number,
  type: "income" | "expense",
) => {
  const money = new Money(amount);
  toast.success(
    `${type === "income" ? "Income" : "Expense"} of ${money.toString()} added successfully`,
  );
};

export const showTransactionDeletedToast = () => {
  toast.success("Transaction deleted successfully");
};

export const showTransactionUpdatedToast = () => {
  toast.success("Transaction updated successfully");
};

export const showBudgetWarningToast = (category: string, remaining: number) => {
  const money = new Money(remaining);
  toast.warning(
    `Warning: ${category} budget is nearing its limit. ${money.toString()} remaining.`,
  );
};

export const showExportToast = (format: string, count: number) => {
  toast.success(`Exported ${count} transactions to ${format.toUpperCase()}`);
};

export const showExportToastFromPromise = (exportPromise: Promise<any>) => {
  toast.promise(exportPromise, {
    loading: "Exporting transactions...",
    success: (result: any) => `Exported to ${result.filename}`,
    error: "Failed to export transactions",
  });
};
