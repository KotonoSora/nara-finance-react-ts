/**
 * Domain Types and Interfaces
 * Data contracts for the finance domain
 */

// Currency data contract - represents currency information from external APIs
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

// Transaction data contract - represents transaction data from external APIs
export interface TransactionApiData {
  id: string;
  type: "income" | "expense";
  amount: number;
  currency_code: string;
  currency_symbol?: string;
  date: string;
  note?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

// Transaction creation data contract
export interface CreateTransactionData {
  type: "income" | "expense";
  amount: number;
  currency_code: string;
  date: string;
  note?: string;
  category?: string;
}

// Transaction update data contract
export interface UpdateTransactionData {
  type?: "income" | "expense";
  amount?: number;
  currency_code?: string;
  date?: string;
  note?: string;
  category?: string;
}
