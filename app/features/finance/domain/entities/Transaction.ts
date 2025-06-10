import { Money } from "~/features/finance/domain/value-objects/Money";
import { TransactionId } from "~/features/finance/domain/value-objects/TransactionId";
import { TransactionType } from "~/features/finance/domain/value-objects/TransactionType";

/**
 * Transaction Entity
 * Core business entity representing a financial transaction
 */
export class Transaction {
  private constructor(
    private readonly id: TransactionId,
    private readonly type: TransactionType,
    private readonly money: Money,
    private readonly date: Date,
    private readonly note?: string,
    private readonly category?: string,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  static create(params: {
    type: TransactionType;
    amount: number;
    currencyCode: string;
    date: Date;
    note?: string;
    category?: string;
  }): Transaction {
    const id = TransactionId.generate();
    const money = Money.create(params.amount, params.currencyCode);
    const now = new Date();

    return new Transaction(
      id,
      params.type,
      money,
      params.date,
      params.note,
      params.category,
      now,
      now,
    );
  }

  static fromData(data: {
    id: string;
    type: TransactionType;
    amount: number;
    currencyCode: string;
    date: Date;
    note?: string;
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Transaction {
    const id = TransactionId.create(data.id);
    const money = Money.create(data.amount, data.currencyCode);

    return new Transaction(
      id,
      data.type,
      money,
      data.date,
      data.note,
      data.category,
      data.createdAt,
      data.updatedAt,
    );
  }

  // Getters
  getId(): TransactionId {
    return this.id;
  }

  getType(): TransactionType {
    return this.type;
  }

  getMoney(): Money {
    return this.money;
  }

  getAmount(): number {
    return this.money.getAmount();
  }

  getCurrencyCode(): string {
    return this.money.getCurrencyCode();
  }

  getDate(): Date {
    return this.date;
  }

  getNote(): string | undefined {
    return this.note;
  }

  getCategory(): string | undefined {
    return this.category;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  // Business methods
  isIncome(): boolean {
    return this.type === TransactionType.INCOME;
  }

  isExpense(): boolean {
    return this.type === TransactionType.EXPENSE;
  }

  hasNote(): boolean {
    return this.note !== undefined && this.note.trim().length > 0;
  }

  hasCategory(): boolean {
    return this.category !== undefined && this.category.trim().length > 0;
  }

  /**
   * Update transaction with new data
   */
  update(params: {
    type?: TransactionType;
    amount?: number;
    currencyCode?: string;
    date?: Date;
    note?: string;
    category?: string;
  }): Transaction {
    const newMoney = Money.create(
      params.amount ?? this.money.getAmount(),
      params.currencyCode ?? this.money.getCurrencyCode(),
    );

    return new Transaction(
      this.id,
      params.type ?? this.type,
      newMoney,
      params.date ?? this.date,
      params.note !== undefined ? params.note : this.note,
      params.category !== undefined ? params.category : this.category,
      this.createdAt,
      new Date(), // Updated timestamp
    );
  }

  /**
   * Get transaction impact on balance
   * Positive for income, negative for expense
   */
  getBalanceImpact(): number {
    return this.isIncome() ? this.money.getAmount() : -this.money.getAmount();
  }

  /**
   * Check if transaction occurred on a specific date
   */
  isOnDate(date: Date): boolean {
    return (
      this.date.getFullYear() === date.getFullYear() &&
      this.date.getMonth() === date.getMonth() &&
      this.date.getDate() === date.getDate()
    );
  }

  /**
   * Check if transaction occurred in a specific month
   */
  isInMonth(year: number, month: number): boolean {
    return this.date.getFullYear() === year && this.date.getMonth() === month;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      id: this.id.getValue(),
      type: this.type,
      amount: this.money.getAmount(),
      currencyCode: this.money.getCurrencyCode(),
      date: this.date.toISOString(),
      note: this.note,
      category: this.category,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }

  equals(other: Transaction): boolean {
    return this.id.equals(other.id);
  }
}
