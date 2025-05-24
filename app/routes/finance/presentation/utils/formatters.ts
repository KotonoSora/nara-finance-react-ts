import { toast } from "sonner";

import { Money } from "~/routes/finance/domain/value-objects/money.value";

export function showSuccessToast(message: string) {
  toast.success(message);
}

export function showErrorToast(message: string) {
  toast.error(message);
}

export function showWarningToast(message: string) {
  toast.warning(message);
}

export const formatMoney = (amount: number): string => {
  return new Money(amount).toString();
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatDateLong = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
