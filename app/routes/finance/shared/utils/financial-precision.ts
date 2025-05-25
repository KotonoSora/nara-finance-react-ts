import Decimal from "decimal.js";

// Set precision to handle up to 16 decimal places (industry standard)
Decimal.set({ precision: 16 });

export class FinancialAmount {
  private value: Decimal;
  private checksum: string | undefined;

  constructor(amount: number | string) {
    this.value = new Decimal(amount);
    this.calculateChecksum().then((hash) => {
      this.checksum = hash;
    });
  }

  private async calculateChecksum(): Promise<string> {
    const msgBuffer = new TextEncoder().encode(this.value.toString());
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  public async verify(): Promise<boolean> {
    const currentHash = await this.calculateChecksum();
    return this.checksum === currentHash;
  }

  public add(other: FinancialAmount): FinancialAmount {
    return new FinancialAmount(this.value.plus(other.value).toString());
  }

  public subtract(other: FinancialAmount): FinancialAmount {
    return new FinancialAmount(this.value.minus(other.value).toString());
  }

  public multiply(other: FinancialAmount): FinancialAmount {
    return new FinancialAmount(this.value.times(other.value).toString());
  }

  public toNumber(): number {
    return this.value.toNumber();
  }

  public toString(): string {
    return this.value.toFixed(2);
  }

  public toPreciseString(): string {
    return this.value.toString();
  }
}

export async function validateTransaction(
  transaction: Transaction,
): Promise<boolean> {
  const amount = new FinancialAmount(transaction.amount);
  if (!(await amount.verify())) return false;

  // Ensure amounts are non-negative
  if (amount.toNumber() < 0) return false;

  return true;
}

export async function reconcileTransactions(
  transactions: Transaction[],
): Promise<{
  isValid: boolean;
  totalIncome: FinancialAmount;
  totalExpenses: FinancialAmount;
  netAmount: FinancialAmount;
}> {
  let totalIncome = new FinancialAmount(0);
  let totalExpenses = new FinancialAmount(0);

  for (const transaction of transactions) {
    if (!(await validateTransaction(transaction))) {
      return {
        isValid: false,
        totalIncome,
        totalExpenses,
        netAmount: new FinancialAmount(0),
      };
    }

    const amount = new FinancialAmount(transaction.amount);
    if (transaction.type === "income") {
      totalIncome = totalIncome.add(amount);
    } else if (transaction.type === "expense") {
      totalExpenses = totalExpenses.add(amount);
    }
  }

  return {
    isValid: true,
    totalIncome,
    totalExpenses,
    netAmount: totalIncome.subtract(totalExpenses),
  };
}
