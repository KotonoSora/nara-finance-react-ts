import { describe, expect, it } from "vitest";

import { Money } from "~/features/finance/domain/value-objects/Money";

describe("Money", () => {
  describe("create", () => {
    it("should create valid Money with positive amount", () => {
      const money = Money.create(100, "USD");
      expect(money.getAmountAsNumber()).toBe(100);
      expect(money.getCurrencyCode()).toBe("USD");
    });

    it("should create valid Money with zero amount", () => {
      const money = Money.create(0, "EUR");
      expect(money.getAmountAsNumber()).toBe(0);
      expect(money.getCurrencyCode()).toBe("EUR");
    });

    it("should create Money with decimal amounts", () => {
      const money = Money.create(123.45, "USD");
      expect(money.getAmountAsNumber()).toBe(123.45);
      expect(money.format()).toBe("USD 123.45");
    });

    it("should convert currency code to uppercase", () => {
      const money = Money.create(50, "usd");
      expect(money.getCurrencyCode()).toBe("USD");
    });

    it("should throw error for negative amount", () => {
      expect(() => Money.create(-100, "USD")).toThrow(
        "Amount cannot be negative",
      );
    });

    it("should throw error for empty currency code", () => {
      expect(() => Money.create(100, "")).toThrow("Currency code is required");
      expect(() => Money.create(100, "   ")).toThrow(
        "Currency code is required",
      );
    });

    it("should throw error for invalid currency code length", () => {
      expect(() => Money.create(100, "US")).toThrow(
        "Currency code must be 3 characters long",
      );
      expect(() => Money.create(100, "USDX")).toThrow(
        "Currency code must be 3 characters long",
      );
    });
  });
  describe("format", () => {
    it("should format money correctly with 2 decimal places", () => {
      const money = Money.create(1234.56, "USD");
      const formatted = money.format();
      expect(formatted).toBe("USD 1234.56");
    });

    it("should format zero amount", () => {
      const money = Money.create(0, "EUR");
      const formatted = money.format();
      expect(formatted).toBe("EUR 0.00");
      expect(formatted).toContain("0");
    });
  });

  describe("equals", () => {
    it("should return true for same amount and currency", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(100, "USD");
      expect(money1.equals(money2)).toBe(true);
    });

    it("should return false for different amounts", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(200, "USD");
      expect(money1.equals(money2)).toBe(false);
    });

    it("should return false for different currencies", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(100, "EUR");
      expect(money1.equals(money2)).toBe(false);
    });
  });
  describe("add", () => {
    it("should add money with same currency", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(50, "USD");
      const result = money1.add(money2);

      expect(result.getAmountAsNumber()).toBe(150);
      expect(result.getCurrencyCode()).toBe("USD");
    });

    it("should add decimal amounts correctly", () => {
      const money1 = Money.create(10.25, "USD");
      const money2 = Money.create(5.75, "USD");
      const result = money1.add(money2);

      expect(result.getAmountAsNumber()).toBe(16);
      expect(result.format()).toBe("USD 16.00");
    });

    it("should throw error for different currencies", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(50, "EUR");

      expect(() => money1.add(money2)).toThrow(
        "Cannot add money with different currencies",
      );
    });
  });
  describe("subtract", () => {
    it("should subtract money with same currency", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(30, "USD");
      const result = money1.subtract(money2);

      expect(result.getAmountAsNumber()).toBe(70);
      expect(result.getCurrencyCode()).toBe("USD");
    });

    it("should subtract decimal amounts correctly", () => {
      const money1 = Money.create(25.75, "USD");
      const money2 = Money.create(10.25, "USD");
      const result = money1.subtract(money2);

      expect(result.getAmountAsNumber()).toBe(15.5);
      expect(result.format()).toBe("USD 15.50");
    });

    it("should throw error for different currencies", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(30, "EUR");

      expect(() => money1.subtract(money2)).toThrow(
        "Cannot subtract money with different currencies",
      );
    });
    it("should allow result to be zero", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(100, "USD");
      const result = money1.subtract(money2);

      expect(result.getAmountAsNumber()).toBe(0);
      expect(result.isZero()).toBe(true);
    });
  });
  describe("multiply", () => {
    it("should multiply amount by positive factor", () => {
      const money = Money.create(100, "USD");
      const result = money.multiply(2.5);

      expect(result.getAmountAsNumber()).toBe(250);
      expect(result.getCurrencyCode()).toBe("USD");
    });

    it("should multiply decimal amounts correctly", () => {
      const money = Money.create(12.5, "USD");
      const result = money.multiply(3);

      expect(result.getAmountAsNumber()).toBe(37.5);
      expect(result.format()).toBe("USD 37.50");
    });

    it("should multiply by zero", () => {
      const money = Money.create(100, "USD");
      const result = money.multiply(0);

      expect(result.getAmountAsNumber()).toBe(0);
      expect(result.isZero()).toBe(true);
    });

    it("should throw error for negative factor", () => {
      const money = Money.create(100, "USD");
      expect(() => money.multiply(-1)).toThrow("Factor cannot be negative");
    });
  });

  describe("isZero", () => {
    it("should return true for zero amount", () => {
      const money = Money.create(0, "USD");
      expect(money.isZero()).toBe(true);
    });

    it("should return false for non-zero amount", () => {
      const money = Money.create(100, "USD");
      expect(money.isZero()).toBe(false);
    });
  });

  describe("isGreaterThan", () => {
    it("should return true when amount is greater", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(50, "USD");
      expect(money1.isGreaterThan(money2)).toBe(true);
    });

    it("should return false when amount is less", () => {
      const money1 = Money.create(50, "USD");
      const money2 = Money.create(100, "USD");
      expect(money1.isGreaterThan(money2)).toBe(false);
    });

    it("should return false when amounts are equal", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(100, "USD");
      expect(money1.isGreaterThan(money2)).toBe(false);
    });

    it("should throw error for different currencies", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(50, "EUR");

      expect(() => money1.isGreaterThan(money2)).toThrow(
        "Cannot compare money with different currencies",
      );
    });
  });
});
