/**
 * Transaction API Client
 * Handles HTTP communication with the transaction API
 */
export interface TransactionData {
  id: string;
  type: "income" | "expense";
  amount: number;
  currency_code: string;
  date: string;
  note?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionRequest {
  type: "income" | "expense";
  amount: number;
  currency_code: string;
  date: string;
  note?: string;
  category?: string;
}

export interface UpdateTransactionRequest {
  type?: "income" | "expense";
  amount?: number;
  currency_code?: string;
  date?: string;
  note?: string;
  category?: string;
}

export interface GetTransactionsParams {
  limit?: number;
  offset?: number;
  type?: "income" | "expense";
  currency_code?: string;
}

export class TransactionApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }
  async createTransaction(
    data: CreateTransactionRequest,
  ): Promise<TransactionData> {
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return await response.json();
  }

  async getTransactions(
    params: GetTransactionsParams = {},
  ): Promise<TransactionData[]> {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.offset) searchParams.set("offset", params.offset.toString());
    if (params.type) searchParams.set("type", params.type);
    if (params.currency_code)
      searchParams.set("currency_code", params.currency_code);

    const url = `${this.baseUrl}/transactions?${searchParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return await response.json();
  }

  async getTransactionById(id: string): Promise<TransactionData | null> {
    const response = await fetch(`${this.baseUrl}/transactions/${id}`);

    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return await response.json();
  }

  async updateTransaction(
    id: string,
    data: UpdateTransactionRequest,
  ): Promise<TransactionData> {
    const response = await fetch(`${this.baseUrl}/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return await response.json();
  }

  async deleteTransaction(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/transactions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }
  }
}
