// Presentation utilities - UI specific helpers
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from "~/routes/finance/domain/value-objects/finance-constants";

export function getCategoryColor(category: string): string {
  return (
    CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ||
    CATEGORY_COLORS.other
  );
}

export function getCategoryIcon(category: string): string {
  return (
    CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] ||
    CATEGORY_ICONS.other
  );
}

export function getCategoryLabel(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// Toast functions for user feedback
export function showSuccessToast(message: string): void {
  // Implementation would depend on your toast library
  console.log(`Success: ${message}`);
}

export function showErrorToast(message: string): void {
  // Implementation would depend on your toast library
  console.error(`Error: ${message}`);
}

export function showWarningToast(message: string): void {
  // Implementation would depend on your toast library
  console.warn(`Warning: ${message}`);
}

// Legacy function names for backward compatibility
export const showTransactionAddedToast = () =>
  showSuccessToast("Transaction added successfully");
export const showTransactionUpdatedToast = () =>
  showSuccessToast("Transaction updated successfully");
export const showTransactionDeletedToast = () =>
  showSuccessToast("Transaction deleted successfully");
export const showBudgetWarningToast = (message: string) =>
  showWarningToast(message);
