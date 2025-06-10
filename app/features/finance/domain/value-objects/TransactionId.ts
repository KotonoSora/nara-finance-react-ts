/**
 * Transaction ID Value Object
 * Provides type-safe transaction identifiers
 */
export class TransactionId {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Transaction ID cannot be empty");
    }
  }

  static create(value: string): TransactionId {
    return new TransactionId(value);
  }

  static generate(): TransactionId {
    // Generate a UUID-like ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return new TransactionId(`txn_${timestamp}_${random}`);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TransactionId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
