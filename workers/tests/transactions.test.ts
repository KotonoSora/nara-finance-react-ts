import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

import { default as app } from "../app";

// Mock drizzle-orm
vi.mock("drizzle-orm/d1", () => ({
  drizzle: vi.fn(() => mockDb),
}));

const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  leftJoin: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  offset: vi.fn().mockReturnThis(),
  groupBy: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

const MOCK_ENV = {
  DB: mockDb,
  VALUE_FROM_CLOUDFLARE: "test value",
  BASIC_AUTH_USERNAME: "test",
  BASIC_AUTH_PASSWORD: "test",
};

describe("transactions", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "vitest");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("GET /api/transactions", async () => {
    const mockTransactions = [
      {
        id: 1,
        amount: 25.5,
        description: "Coffee at Starbucks",
        type: "expense",
        date: "2024-01-15",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        category: {
          id: 1,
          name: "Food & Dining",
          type: "expense",
          icon: "🍔",
          color: "#FF6B6B",
        },
      },
    ];

    const mockCount = { count: 1 };

    // Setup proper mock chain for the transaction query
    const mockSelect = {
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue(mockTransactions),
              }),
            }),
          }),
        }),
      }),
    };

    // Setup mock chain for the count query
    const mockCountSelect = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([mockCount]),
      }),
    };

    // First call is for transaction list, second call is for count
    mockDb.select
      .mockReturnValueOnce(mockSelect)
      .mockReturnValueOnce(mockCountSelect);

    const res = await app.request("/api/transactions", {}, MOCK_ENV);
    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.transactions).toBeDefined();
    expect(json.transactions).toHaveLength(1);
    expect(json.transactions[0].description).toBe("Coffee at Starbucks");
    expect(json.pagination).toBeDefined();
    expect(json.pagination.page).toBe(1);
  });

  test("GET /api/transactions with filters", async () => {
    const mockTransactions = [
      {
        id: 1,
        amount: 25.5,
        description: "Coffee",
        type: "expense",
        date: "2024-01-15",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        category: {
          id: 1,
          name: "Food & Dining",
          type: "expense",
          icon: "🍔",
          color: "#FF6B6B",
        },
      },
    ];

    const mockCount = { count: 1 };

    // Setup proper mock chain for the transaction query
    const mockSelect = {
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue(mockTransactions),
              }),
            }),
          }),
        }),
      }),
    };

    // Setup mock chain for the count query
    const mockCountSelect = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([mockCount]),
      }),
    };

    // First call is for transaction list, second call is for count
    mockDb.select
      .mockReturnValueOnce(mockSelect)
      .mockReturnValueOnce(mockCountSelect);

    const res = await app.request(
      "/api/transactions?type=expense&category_id=1&search=coffee",
      {},
      MOCK_ENV,
    );
    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.transactions).toBeDefined();
    expect(json.transactions[0].type).toBe("expense");
  });

  test("POST /api/transactions", async () => {
    const mockTransaction = {
      id: 2,
      amount: 100.0,
      description: "Grocery shopping",
      type: "expense",
      date: "2024-01-16",
      category_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockDb.returning.mockResolvedValueOnce([mockTransaction]);

    const res = await app.request(
      "/api/transactions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 100.0,
          description: "Grocery shopping",
          type: "expense",
          date: "2024-01-16",
          category_id: 1,
        }),
      },
      MOCK_ENV,
    );

    expect(res.status).toBe(201);

    const json = (await res.json()) as any;
    expect(json.transaction).toBeDefined();
    expect(json.transaction.description).toBe("Grocery shopping");
    expect(json.transaction.amount).toBe(100.0);
  });

  test("PUT /api/transactions/:id", async () => {
    const mockTransaction = {
      id: 1,
      amount: 30.0,
      description: "Updated coffee purchase",
      type: "expense",
      date: "2024-01-15",
      category_id: 1,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: new Date().toISOString(),
    };

    mockDb.returning.mockResolvedValueOnce([mockTransaction]);

    const res = await app.request(
      "/api/transactions/1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 30.0,
          description: "Updated coffee purchase",
          type: "expense",
          date: "2024-01-15",
          category_id: 1,
        }),
      },
      MOCK_ENV,
    );

    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.transaction).toBeDefined();
    expect(json.transaction.description).toBe("Updated coffee purchase");
    expect(json.transaction.amount).toBe(30.0);
  });

  test("DELETE /api/transactions/:id", async () => {
    const mockDeletedTransaction = {
      id: 1,
      amount: 25.5,
      description: "Coffee at Starbucks",
      type: "expense",
      date: "2024-01-15",
      category_id: 1,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    };

    // Setup proper mock chain for delete().where().returning()
    const mockDelete = {
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockDeletedTransaction]),
      }),
    };

    mockDb.delete.mockReturnValue(mockDelete);

    const res = await app.request(
      "/api/transactions/1",
      {
        method: "DELETE",
      },
      MOCK_ENV,
    );

    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.message).toBe("Transaction deleted successfully");
  });

  test("GET /api/transactions/analytics/summary", async () => {
    const mockSummaryByType = [
      { type: "income", total: 5000, count: 10 },
      { type: "expense", total: 3000, count: 140 },
      { type: "investment", total: 1000, count: 5 },
    ];

    const mockSummaryByCategory = [
      {
        category_id: 1,
        category_name: "Food & Dining",
        category_type: "expense",
        category_icon: "🍔",
        category_color: "#FF6B6B",
        total: 800,
        count: 40,
      },
      {
        category_id: 2,
        category_name: "Transportation",
        category_type: "expense",
        category_icon: "🚗",
        category_color: "#4ECDC4",
        total: 600,
        count: 30,
      },
    ];

    // Mock the groupBy queries
    mockDb.groupBy.mockResolvedValueOnce(mockSummaryByType);
    mockDb.groupBy.mockResolvedValueOnce(mockSummaryByCategory);

    const res = await app.request(
      "/api/transactions/analytics/summary",
      {},
      MOCK_ENV,
    );
    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.summary).toBeDefined();
    expect(json.summary.totalIncome).toBe(5000);
    expect(json.summary.totalExpenses).toBe(3000);
    expect(json.summary.savings).toBe(1000); // 5000 - 3000 - 1000
  });

  test("POST /api/transactions/bulk", async () => {
    const mockTransactions = [
      {
        id: 1,
        amount: 25.5,
        description: "Coffee",
        type: "expense",
        date: "2024-01-15",
        category_id: 1,
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        amount: 100.0,
        description: "Groceries",
        type: "expense",
        date: "2024-01-15",
        category_id: 2,
        updated_at: new Date().toISOString(),
      },
    ];

    // Setup mock chain properly
    const mockInsert = {
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue(mockTransactions),
      }),
    };

    mockDb.insert.mockReturnValue(mockInsert);

    const res = await app.request(
      "/api/transactions/bulk",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions: [
            {
              amount: 25.5,
              description: "Coffee",
              type: "expense",
              date: "2024-01-15",
              category_id: 1,
            },
            {
              amount: 100.0,
              description: "Groceries",
              type: "expense",
              date: "2024-01-15",
              category_id: 2,
            },
          ],
        }),
      },
      MOCK_ENV,
    );

    expect(res.status).toBe(201);

    const json = (await res.json()) as any;
    expect(json.transactions).toBeDefined();
    expect(json.transactions).toHaveLength(2);
    expect(json.message).toBe("Successfully imported 2 transactions");
  });
});
