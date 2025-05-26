// Domain filter types

/** Represents a date range for filtering */
export interface DateRange {
  from: Date;
  to: Date;
}

/** Filters for querying transactions */
export interface TransactionFilters {
  type?: import("~/routes/finance/domain/value-objects/finance-constants").TransactionType;
  category?: string; // category_id
  dateRange?: DateRange;
  searchTerm?: string;
  categories?: string[]; // category_ids
}

/** Table sorting configuration */
export interface TableSort {
  column: string;
  direction: "asc" | "desc";
}
