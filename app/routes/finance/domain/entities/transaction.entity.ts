import type { TransactionType } from "~/routes/finance/domain/types";

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  category_id: string;
  description: string;
}

export interface TransactionProps {
  date: Date;
  amount: number;
  type: TransactionType;
  category_id: string;
  description: string;
}

export class TransactionEntity implements Transaction {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  category_id: string;
  description: string;

  constructor(props: TransactionProps, id?: string) {
    this.id = id || Math.random().toString(36).substr(2, 9);
    this.date = props.date;
    this.amount = props.amount;
    this.type = props.type;
    this.category_id = props.category_id;
    this.description = props.description;
  }

  isIncome(): boolean {
    return this.type === "income";
  }

  isExpense(): boolean {
    return this.type === "expense";
  }

  isInvestment(): boolean {
    return this.type === "investment";
  }
}
