import { beforeEach, describe, expect, it } from "vitest";

import { Transaction } from "~/features/finance/domain/entities/Transaction";
import { TransactionId } from "~/features/finance/domain/value-objects/TransactionId";
import { TransactionType } from "~/features/finance/domain/value-objects/TransactionType";

describe("Transaction", () => {
  const mockDate = new Date("2024-01-15T10:00:00Z");
  const mockCreatedAt = new Date("2024-01-01T08:00:00Z");

  describe("create", () => {
    it("should create income transaction", () => {
      const transaction = Transaction.create({
        type: TransactionType.INCOME,
        amount: 1000,
        currencyCode: "USD",
        date: mockDate,
        note: "Salary",
        category: "Work",
      });

      expect(transaction.getType()).toBe(TransactionType.INCOME);
      expect(transaction.getAmount()).toBe(1000);
      expect(transaction.getCurrencyCode()).toBe("USD");
      expect(transaction.getDate()).toBe(mockDate);
      expect(transaction.getNote()).toBe("Salary");
      expect(transaction.getCategory()).toBe("Work");
      expect(transaction.getId()).toBeDefined();
      expect(transaction.getCreatedAt()).toBeDefined();
      expect(transaction.getUpdatedAt()).toBeDefined();
    });

    it("should create expense transaction", () => {
      const transaction = Transaction.create({
        type: TransactionType.EXPENSE,
        amount: 50,
        currencyCode: "EUR",
        date: mockDate,
      });

      expect(transaction.getType()).toBe(TransactionType.EXPENSE);
      expect(transaction.getAmount()).toBe(50);
      expect(transaction.getCurrencyCode()).toBe("EUR");
      expect(transaction.getNote()).toBeUndefined();
      expect(transaction.getCategory()).toBeUndefined();
    });

    it("should create transaction with zero amount", () => {
      const transaction = Transaction.create({
        type: TransactionType.INCOME,
        amount: 0,
        currencyCode: "USD",
        date: mockDate,
      });

      expect(transaction.getAmount()).toBe(0);
    });

    it("should throw error for negative amount", () => {
      expect(() =>
        Transaction.create({
          type: TransactionType.INCOME,
          amount: -100,
          currencyCode: "USD",
          date: mockDate,
        }),
      ).toThrow("Amount cannot be negative");
    });
  });

  describe("fromData", () => {
    it("should create transaction from existing data", () => {
      const transaction = Transaction.fromData({
        id: "txn_123",
        type: TransactionType.EXPENSE,
        amount: 75,
        currencyCode: "GBP",
        date: mockDate,
        note: "Coffee",
        category: "Food",
        createdAt: mockCreatedAt,
        updatedAt: mockCreatedAt,
      });

      expect(transaction.getId().getValue()).toBe("txn_123");
      expect(transaction.getType()).toBe(TransactionType.EXPENSE);
      expect(transaction.getAmount()).toBe(75);
      expect(transaction.getCurrencyCode()).toBe("GBP");
      expect(transaction.getCreatedAt()).toBe(mockCreatedAt);
    });
  });

  describe("business methods", () => {
    let incomeTransaction: Transaction;
    let expenseTransaction: Transaction;

    beforeEach(() => {
      incomeTransaction = Transaction.create({
        type: TransactionType.INCOME,
        amount: 1000,
        currencyCode: "USD",
        date: mockDate,
        note: "Salary",
      });

      expenseTransaction = Transaction.create({
        type: TransactionType.EXPENSE,
        amount: 50,
        currencyCode: "USD",
        date: mockDate,
      });
    });

    describe("isIncome/isExpense", () => {
      it("should correctly identify income transaction", () => {
        expect(incomeTransaction.isIncome()).toBe(true);
        expect(incomeTransaction.isExpense()).toBe(false);
      });

      it("should correctly identify expense transaction", () => {
        expect(expenseTransaction.isIncome()).toBe(false);
        expect(expenseTransaction.isExpense()).toBe(true);
      });
    });

    describe("hasNote/hasCategory", () => {
      it("should return true when note exists", () => {
        expect(incomeTransaction.hasNote()).toBe(true);
      });

      it("should return false when note is empty", () => {
        expect(expenseTransaction.hasNote()).toBe(false);
      });

      it("should return false for empty string note", () => {
        const transaction = Transaction.create({
          type: TransactionType.INCOME,
          amount: 100,
          currencyCode: "USD",
          date: mockDate,
          note: "   ",
        });
        expect(transaction.hasNote()).toBe(false);
      });
    });

    describe("getBalanceImpact", () => {
      it("should return positive value for income", () => {
        expect(incomeTransaction.getBalanceImpact()).toBe(1000);
      });

      it("should return negative value for expense", () => {
        expect(expenseTransaction.getBalanceImpact()).toBe(-50);
      });
    });

    describe("date operations", () => {
      it("should check if transaction is on specific date", () => {
        const sameDate = new Date("2024-01-15T15:30:00Z");
        const differentDate = new Date("2024-01-16T10:00:00Z");

        expect(incomeTransaction.isOnDate(sameDate)).toBe(true);
        expect(incomeTransaction.isOnDate(differentDate)).toBe(false);
      });

      it("should check if transaction is in specific month", () => {
        expect(incomeTransaction.isInMonth(2024, 0)).toBe(true); // January = 0
        expect(incomeTransaction.isInMonth(2024, 1)).toBe(false); // February = 1
        expect(incomeTransaction.isInMonth(2023, 0)).toBe(false);
      });
    });
  });

  describe("update", () => {
    let originalTransaction: Transaction;

    beforeEach(() => {
      originalTransaction = Transaction.create({
        type: TransactionType.EXPENSE,
        amount: 100,
        currencyCode: "USD",
        date: mockDate,
        note: "Original note",
        category: "Food",
      });
    });
    it("should update transaction type", async () => {
      // Wait a small amount to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 1));

      const updated = originalTransaction.update({
        type: TransactionType.INCOME,
      });

      expect(updated.getType()).toBe(TransactionType.INCOME);
      expect(updated.getAmount()).toBe(100); // unchanged
      expect(updated.getId()).toEqual(originalTransaction.getId()); // same ID
      expect(updated.getUpdatedAt()?.getTime()).toBeGreaterThan(
        originalTransaction.getUpdatedAt()?.getTime() || 0,
      );
    });

    it("should update amount and currency", () => {
      const updated = originalTransaction.update({
        amount: 200,
        currencyCode: "EUR",
      });

      expect(updated.getAmount()).toBe(200);
      expect(updated.getCurrencyCode()).toBe("EUR");
    });

    it("should update note and category", () => {
      const updated = originalTransaction.update({
        note: "Updated note",
        category: "Entertainment",
      });

      expect(updated.getNote()).toBe("Updated note");
      expect(updated.getCategory()).toBe("Entertainment");
    });

    it("should clear note when empty string provided", () => {
      const updated = originalTransaction.update({
        note: "",
      });

      expect(updated.getNote()).toBe("");
    });

    it("should preserve unchanged fields", () => {
      const updated = originalTransaction.update({
        amount: 150,
      });

      expect(updated.getType()).toBe(originalTransaction.getType());
      expect(updated.getDate()).toBe(originalTransaction.getDate());
      expect(updated.getNote()).toBe(originalTransaction.getNote());
      expect(updated.getCreatedAt()).toBe(originalTransaction.getCreatedAt());
    });
  });

  describe("toJSON", () => {
    it("should serialize transaction to JSON", () => {
      const transaction = Transaction.fromData({
        id: "txn_123",
        type: TransactionType.INCOME,
        amount: 500,
        currencyCode: "USD",
        date: mockDate,
        note: "Freelance",
        category: "Work",
        createdAt: mockCreatedAt,
        updatedAt: mockCreatedAt,
      });

      const json = transaction.toJSON();

      expect(json).toEqual({
        id: "txn_123",
        type: "income",
        amount: 500,
        currencyCode: "USD",
        date: mockDate.toISOString(),
        note: "Freelance",
        category: "Work",
        createdAt: mockCreatedAt.toISOString(),
        updatedAt: mockCreatedAt.toISOString(),
      });
    });
  });

  describe("equals", () => {
    it("should return true for transactions with same ID", () => {
      const transaction1 = Transaction.fromData({
        id: "txn_123",
        type: TransactionType.INCOME,
        amount: 100,
        currencyCode: "USD",
        date: mockDate,
      });

      const transaction2 = Transaction.fromData({
        id: "txn_123",
        type: TransactionType.EXPENSE,
        amount: 200,
        currencyCode: "EUR",
        date: mockDate,
      });

      expect(transaction1.equals(transaction2)).toBe(true);
    });

    it("should return false for transactions with different IDs", () => {
      const transaction1 = Transaction.fromData({
        id: "txn_123",
        type: TransactionType.INCOME,
        amount: 100,
        currencyCode: "USD",
        date: mockDate,
      });

      const transaction2 = Transaction.fromData({
        id: "txn_456",
        type: TransactionType.INCOME,
        amount: 100,
        currencyCode: "USD",
        date: mockDate,
      });

      expect(transaction1.equals(transaction2)).toBe(false);
    });
  });
});
