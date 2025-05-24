import type { BudgetPeriod, CategoryType } from "../types";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  parent_id?: string | null;
  budget_limit?: number | null;
  budget_period: BudgetPeriod;
  is_archived: boolean;
  icon?: string | null;
  color?: string | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
  parent?: Category | null;
}

export interface CategoryProps {
  name: string;
  type: CategoryType;
  parent_id?: string | null;
  budget_limit?: number | null;
  budget_period: BudgetPeriod;
  icon?: string | null;
  color?: string | null;
}

export class CategoryEntity implements Category {
  id: string;
  name: string;
  type: CategoryType;
  parent_id?: string | null;
  budget_limit?: number | null;
  budget_period: BudgetPeriod;
  is_archived: boolean;
  icon?: string | null;
  color?: string | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
  parent?: Category | null;

  constructor(props: CategoryProps, id?: string) {
    this.id = id || Math.random().toString(36).substr(2, 9);
    this.name = props.name;
    this.type = props.type;
    this.parent_id = props.parent_id;
    this.budget_limit = props.budget_limit;
    this.budget_period = props.budget_period;
    this.is_archived = false;
    this.icon = props.icon;
    this.color = props.color;
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  archive(): void {
    this.is_archived = true;
    this.updated_at = new Date().toISOString();
  }

  unarchive(): void {
    this.is_archived = false;
    this.updated_at = new Date().toISOString();
  }

  updateBudget(limit: number, period: BudgetPeriod): void {
    this.budget_limit = limit;
    this.budget_period = period;
    this.updated_at = new Date().toISOString();
  }

  addChild(child: Category): void {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(child);
  }
}
