import { Decimal } from "decimal.js";

/**
 * Money Value Object
 * Represents a monetary amount with currency using Decimal.js for precision
 */
export class Money {
  private constructor(
    private readonly amount: Decimal,
    private readonly currencyCode: string,
  ) {
    if (amount.lt(0)) {
      throw new Error("Amount cannot be negative");
    }

    if (!currencyCode || currencyCode.trim().length === 0) {
      throw new Error("Currency code is required");
    }

    if (currencyCode.length !== 3) {
      throw new Error("Currency code must be 3 characters long");
    }
  }
  static create(
    amount: number | string | Decimal,
    currencyCode: string,
  ): Money {
    const decimalAmount = new Decimal(amount);
    return new Money(decimalAmount, currencyCode.toUpperCase());
  }

  getAmount(): Decimal {
    return this.amount;
  }

  getAmountAsNumber(): number {
    return this.amount.toNumber();
  }

  getCurrencyCode(): string {
    return this.currencyCode;
  }
  /**
   * Format money for display
   * Note: This is a simple implementation. In a real app, you'd use a proper
   * internationalization library for currency formatting.
   */
  format(): string {
    const formatted = this.amount.toFixed(2);
    return `${this.currencyCode} ${formatted}`;
  }

  equals(other: Money): boolean {
    return (
      this.amount.equals(other.amount) &&
      this.currencyCode === other.currencyCode
    );
  }
  add(other: Money): Money {
    if (this.currencyCode !== other.currencyCode) {
      throw new Error("Cannot add money with different currencies");
    }
    return Money.create(this.amount.plus(other.amount), this.currencyCode);
  }

  subtract(other: Money): Money {
    if (this.currencyCode !== other.currencyCode) {
      throw new Error("Cannot subtract money with different currencies");
    }
    return Money.create(this.amount.minus(other.amount), this.currencyCode);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error("Factor cannot be negative");
    }
    return Money.create(this.amount.times(factor), this.currencyCode);
  }

  isZero(): boolean {
    return this.amount.isZero();
  }

  isGreaterThan(other: Money): boolean {
    if (this.currencyCode !== other.currencyCode) {
      throw new Error("Cannot compare money with different currencies");
    }
    return this.amount.gt(other.amount);
  }
}
