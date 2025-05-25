import type { TransactionType } from "~/routes/finance/domain/types";

export function validateAmount(amount: string | number): number {
  const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(parsedAmount) || parsedAmount < 0) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  return parsedAmount;
}

export function validateDate(date: string | Date): Date {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  return parsedDate;
}

export function validateTransactionType(type: string): TransactionType {
  const validTypes: TransactionType[] = ["income", "expense", "investment"];
  const normalizedType = type.toLowerCase() as TransactionType;

  if (!validTypes.includes(normalizedType)) {
    throw new Error(`Invalid transaction type: ${type}`);
  }

  return normalizedType;
}

export function validateCategoryId(categoryId: string): string {
  if (!categoryId || categoryId.trim().length === 0) {
    throw new Error("Category ID is required");
  }
  return categoryId.trim();
}

export function validateDescription(description: string): string {
  if (!description || description.trim().length < 3) {
    throw new Error("Description must be at least 3 characters");
  }
  if (description.length > 100) {
    throw new Error("Description must not exceed 100 characters");
  }
  return description.trim();
}
