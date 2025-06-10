import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TransactionRepository } from "~/features/finance/application/use-cases/CreateTransaction";

import { CreateTransactionUseCase } from "~/features/finance/application/use-cases/CreateTransaction";
import { Transaction } from "~/features/finance/domain/entities/Transaction";
import { TransactionType } from "~/features/finance/domain/value-objects/TransactionType";

describe("CreateTransactionUseCase", () => {
  const mockRepository: TransactionRepository = {
    save: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const useCase = new CreateTransactionUseCase(mockRepository);
  const mockDate = new Date("2024-01-15T10:00:00Z");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("execute", () => {
    it("should create and save income transaction successfully", async () => {
      const command = {
        type: TransactionType.INCOME,
        amount: 1000,
        currencyCode: "USD",
        date: mockDate,
        note: "Salary payment",
        category: "Work",
      };
      const expectedTransaction = Transaction.create(command);
      (mockRepository.save as any).mockResolvedValue(expectedTransaction);

      const result = await useCase.execute(command);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result.getType()).toBe(TransactionType.INCOME);
      expect(result.getAmount()).toBe(1000);
      expect(result.getCurrencyCode()).toBe("USD");
      expect(result.getNote()).toBe("Salary payment");
    });

    it("should create and save expense transaction successfully", async () => {
      const command = {
        type: TransactionType.EXPENSE,
        amount: 50,
        currencyCode: "eur",
        date: mockDate,
      };
      const expectedTransaction = Transaction.create({
        ...command,
        currencyCode: "EUR", // Should be converted to uppercase
      });
      (mockRepository.save as any).mockResolvedValue(expectedTransaction);

      const result = await useCase.execute(command);

      expect(result.getType()).toBe(TransactionType.EXPENSE);
      expect(result.getCurrencyCode()).toBe("EUR");
      expect(result.getNote()).toBeUndefined();
    });

    it("should trim and handle empty note", async () => {
      const command = {
        type: TransactionType.INCOME,
        amount: 100,
        currencyCode: "USD",
        date: mockDate,
        note: "   ",
      };
      const expectedTransaction = Transaction.create({
        ...command,
        note: undefined,
      });
      (mockRepository.save as any).mockResolvedValue(expectedTransaction);

      await useCase.execute(command);

      const saveCall = (mockRepository.save as any).mock.calls[0][0];
      expect(saveCall.getNote()).toBeUndefined();
    });

    it("should throw error for negative amount", async () => {
      const command = {
        type: TransactionType.INCOME,
        amount: -100,
        currencyCode: "USD",
        date: mockDate,
      };

      await expect(useCase.execute(command)).rejects.toThrow(
        "Transaction amount cannot be negative",
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("should throw error for invalid currency code", async () => {
      const command = {
        type: TransactionType.INCOME,
        amount: 100,
        currencyCode: "US",
        date: mockDate,
      };

      await expect(useCase.execute(command)).rejects.toThrow(
        "Valid currency code is required",
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("should throw error for empty currency code", async () => {
      const command = {
        type: TransactionType.INCOME,
        amount: 100,
        currencyCode: "",
        date: mockDate,
      };

      await expect(useCase.execute(command)).rejects.toThrow(
        "Valid currency code is required",
      );
    });

    it("should throw error for missing date", async () => {
      const command = {
        type: TransactionType.INCOME,
        amount: 100,
        currencyCode: "USD",
        date: null as any,
      };

      await expect(useCase.execute(command)).rejects.toThrow(
        "Transaction date is required",
      );
    });

    it("should handle repository save failure", async () => {
      const command = {
        type: TransactionType.INCOME,
        amount: 100,
        currencyCode: "USD",
        date: mockDate,
      };
      (mockRepository.save as any).mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(useCase.execute(command)).rejects.toThrow(
        "Database connection failed",
      );
    });
  });
});
