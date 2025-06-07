/**
 * Formatting Utilities - Presentation Layer
 *
 * Provides formatting functions for financial data and user interface display
 */

import { FinancialAmount } from "~/routes/finance/domain/value-objects/financial-amount";

// ============================================================================
// FINANCIAL FORMATTING
// ============================================================================

/**
 * Format amount using FinancialAmount domain object for consistency
 */
export const formatMoney = (amount: number): string => {
  return new FinancialAmount(amount).toString();
};

/**
 * Format currency with USD as default
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format date in medium format (e.g., "Jan 15, 2024")
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

/**
 * Format date in long format (e.g., "January 15, 2024")
 */
export const formatDateLong = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date in short format (e.g., "Jan 15")
 */
export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    food: "#ef4444",
    transport: "#3b82f6",
    shopping: "#8b5cf6",
    salary: "#10b981",
    other: "#6b7280",
  };
  return colors[category] || colors.other;
};

export const getChangeType = (
  change: number,
): "positive" | "negative" | "neutral" => {
  if (Math.abs(change) < 1) return "neutral";
  return change > 0 ? "positive" : "negative";
};
