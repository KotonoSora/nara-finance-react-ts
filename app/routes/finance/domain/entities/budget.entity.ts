import type { BudgetPeriod } from "../types";

export interface Budget {
  limit: number;
  spent: number;
  period: BudgetPeriod;
}

export interface BudgetProps {
  limit: number;
  spent: number;
  period: BudgetPeriod;
}

export class BudgetEntity implements Budget {
  limit: number;
  spent: number;
  period: BudgetPeriod;

  constructor(props: BudgetProps) {
    this.limit = props.limit;
    this.spent = props.spent;
    this.period = props.period;
  }
}
