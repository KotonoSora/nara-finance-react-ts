import type { BudgetPeriod } from "~/routes/finance/domain/value-objects/finance-constants";

export interface Budget {
  category_id: string;
  limit: number;
  spent: number;
  period: BudgetPeriod;
}

export interface BudgetProps {
  category_id: string;
  limit: number;
  spent: number;
  period: BudgetPeriod;
}

export class BudgetEntity implements Budget {
  category_id: string;
  limit: number;
  spent: number;
  period: BudgetPeriod;

  constructor(props: BudgetProps) {
    this.category_id = props.category_id;
    this.limit = props.limit;
    this.spent = props.spent;
    this.period = props.period;
  }
}
