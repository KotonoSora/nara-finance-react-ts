export class Money {
  private readonly amount: number;

  constructor(amount: number) {
    this.amount = this.roundToTwo(amount);
  }

  private roundToTwo(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  add(money: Money): Money {
    return new Money(this.amount + money.amount);
  }

  subtract(money: Money): Money {
    return new Money(this.amount - money.amount);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error("Cannot divide by zero");
    }
    return new Money(this.amount / divisor);
  }

  equals(money: Money): boolean {
    return this.amount === money.amount;
  }

  isGreaterThan(money: Money): boolean {
    return this.amount > money.amount;
  }

  isLessThan(money: Money): boolean {
    return this.amount < money.amount;
  }

  toNumber(): number {
    return this.amount;
  }

  toString(): string {
    return this.amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
}
