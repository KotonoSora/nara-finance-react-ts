/**
 * Toast notification utilities for finance operations
 */

/**
 * Shows a budget warning notification
 */
export function showBudgetWarningToast(
  category: string,
  remaining: number,
): void {
  console.log(`Budget warning for ${category}: ${remaining} remaining`);
  // TODO: Replace with actual toast implementation
}

/**
 * Shows transaction added notification
 */
export function showTransactionAddedToast(amount: number, type: string): void {
  console.log(`Transaction added: ${type} of ${amount}`);
  // TODO: Replace with actual toast implementation
}

/**
 * Shows transaction deleted notification
 */
export function showTransactionDeletedToast(): void {
  console.log("Transaction deleted");
  // TODO: Replace with actual toast implementation
}

/**
 * Shows transaction updated notification
 */
export function showTransactionUpdatedToast(): void {
  console.log("Transaction updated");
  // TODO: Replace with actual toast implementation
}
