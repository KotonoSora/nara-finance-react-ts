import type { TransactionType } from "~/routes/finance/domain/value-objects/finance-constants";

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TRANSACTION_AMOUNT,
  MIN_DESCRIPTION_LENGTH,
  MIN_TRANSACTION_AMOUNT,
  TRANSACTION_TYPES,
} from "~/routes/finance/domain/value-objects/finance-constants";

/**
 * Domain validation rules for financial data
 */

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateAmount(amount: string | number): number {
  const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(parsedAmount)) {
    throw new ValidationError(`Invalid amount format: ${amount}`, "amount");
  }

  if (parsedAmount < MIN_TRANSACTION_AMOUNT) {
    throw new ValidationError(
      `Amount must be at least $${MIN_TRANSACTION_AMOUNT}`,
      "amount",
    );
  }

  if (parsedAmount > MAX_TRANSACTION_AMOUNT) {
    throw new ValidationError(
      `Amount cannot exceed $${MAX_TRANSACTION_AMOUNT}`,
      "amount",
    );
  }

  return parsedAmount;
}

export function validateDate(date: string | Date): Date {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) {
    throw new ValidationError(`Invalid date: ${date}`, "date");
  }

  // Business rule: no future dates for transactions
  if (parsedDate > new Date()) {
    throw new ValidationError(
      "Transaction date cannot be in the future",
      "date",
    );
  }

  return parsedDate;
}

export function validateTransactionType(type: string): TransactionType {
  const normalizedType = type.toLowerCase() as TransactionType;

  if (!TRANSACTION_TYPES.includes(normalizedType)) {
    throw new ValidationError(
      `Invalid transaction type: ${type}. Must be one of: ${TRANSACTION_TYPES.join(", ")}`,
      "type",
    );
  }

  return normalizedType;
}

export function validateCategoryId(categoryId: string): string {
  if (!categoryId || categoryId.trim().length === 0) {
    throw new ValidationError("Category ID is required", "categoryId");
  }
  return categoryId.trim();
}

export function validateDescription(description: string): string {
  if (!description || description.trim().length < MIN_DESCRIPTION_LENGTH) {
    throw new ValidationError(
      `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`,
      "description",
    );
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    throw new ValidationError(
      `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
      "description",
    );
  }

  return description.trim();
}

/**
 * Validates a complete transaction object
 */
export function validateTransactionData(data: {
  amount: string | number;
  description: string;
  type: string;
  date: string | Date;
  categoryId: string;
}): {
  amount: number;
  description: string;
  type: TransactionType;
  date: Date;
  categoryId: string;
} {
  return {
    amount: validateAmount(data.amount),
    description: validateDescription(data.description),
    type: validateTransactionType(data.type),
    date: validateDate(data.date),
    categoryId: validateCategoryId(data.categoryId),
  };
}

/**
 * Business rules validation object
 * Provides organized validation methods for different entities
 */
export const validateBusinessRules = {
  /**
   * Validates transaction business rules
   */
  transaction: (data: {
    amount: string | number;
    description: string;
    type: string;
    date: string | Date;
    categoryId: string;
  }) => {
    try {
      const validated = validateTransactionData(data);
      return { isValid: true, data: validated, errors: [] };
    } catch (error) {
      const validationError = error as ValidationError;
      return {
        isValid: false,
        data: null,
        errors: [
          {
            field: validationError.field || "unknown",
            message: validationError.message,
          },
        ],
      };
    }
  },

  /**
   * Validates category business rules
   */
  category: (data: { name: string; color?: string }) => {
    const errors: { field: string; message: string }[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push({
        field: "name",
        message: "Category name must be at least 2 characters",
      });
    }

    if (data.name && data.name.length > 50) {
      errors.push({
        field: "name",
        message: "Category name must not exceed 50 characters",
      });
    }

    if (data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
      errors.push({
        field: "color",
        message: "Color must be a valid hex color code",
      });
    }

    return {
      isValid: errors.length === 0,
      data:
        errors.length === 0
          ? { name: data.name.trim(), color: data.color }
          : null,
      errors,
    };
  },

  /**
   * Validates budget business rules
   */
  budget: (data: {
    amount: string | number;
    categoryId: string;
    period: string;
  }) => {
    const errors: { field: string; message: string }[] = [];

    try {
      validateAmount(data.amount);
    } catch (error) {
      const validationError = error as ValidationError;
      errors.push({
        field: "amount",
        message: validationError.message,
      });
    }

    try {
      validateCategoryId(data.categoryId);
    } catch (error) {
      const validationError = error as ValidationError;
      errors.push({
        field: "categoryId",
        message: validationError.message,
      });
    }

    const validPeriods = ["weekly", "monthly", "yearly"];
    if (!validPeriods.includes(data.period)) {
      errors.push({
        field: "period",
        message: `Period must be one of: ${validPeriods.join(", ")}`,
      });
    }

    return {
      isValid: errors.length === 0,
      data:
        errors.length === 0
          ? {
              amount: validateAmount(data.amount),
              categoryId: validateCategoryId(data.categoryId),
              period: data.period,
            }
          : null,
      errors,
    };
  },
};
