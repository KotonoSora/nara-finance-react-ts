import { describe, expect, it } from "vitest";

import {
  getTransactionTypeLabel,
  isValidTransactionType,
  TransactionType,
} from "~/features/finance/domain/value-objects/TransactionType";

describe("TransactionType", () => {
  describe("enum values", () => {
    it("should have correct income value", () => {
      expect(TransactionType.INCOME).toBe("income");
    });

    it("should have correct expense value", () => {
      expect(TransactionType.EXPENSE).toBe("expense");
    });
  });

  describe("isValidTransactionType", () => {
    it("should return true for valid income type", () => {
      expect(isValidTransactionType("income")).toBe(true);
    });

    it("should return true for valid expense type", () => {
      expect(isValidTransactionType("expense")).toBe(true);
    });

    it("should return false for invalid type", () => {
      expect(isValidTransactionType("invalid")).toBe(false);
      expect(isValidTransactionType("")).toBe(false);
      expect(isValidTransactionType("INCOME")).toBe(false);
    });
  });

  describe("getTransactionTypeLabel", () => {
    it("should return correct label for income", () => {
      expect(getTransactionTypeLabel(TransactionType.INCOME)).toBe("Income");
    });

    it("should return correct label for expense", () => {
      expect(getTransactionTypeLabel(TransactionType.EXPENSE)).toBe("Expense");
    });

    it("should throw error for invalid type", () => {
      expect(() =>
        getTransactionTypeLabel("invalid" as TransactionType),
      ).toThrow("Unknown transaction type: invalid");
    });
  });
});
