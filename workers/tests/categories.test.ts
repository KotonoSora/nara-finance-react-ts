import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

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
};

const MOCK_ENV = {
  DB: mockDb,
  VALUE_FROM_CLOUDFLARE: "test value",
  BASIC_AUTH_USERNAME: "test",
  BASIC_AUTH_PASSWORD: "test",
};

describe("categories", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "vitest");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  test("GET /api/categories", async () => {
    // Mock categories data
    const mockCategories = [
      {
        id: 1,
        name: "Food & Dining",
        type: "expense",
        parent_id: null,
        budget_limit: 500,
        budget_period: "monthly",
        icon: "🍔",
        color: "#FF6B6B",
        is_archived: 0,
      },
      {
        id: 2,
        name: "Restaurants",
        type: "expense",
        parent_id: 1,
        budget_limit: null,
        budget_period: "monthly",
        icon: "🍽️",
        color: "#FF6B6B",
        is_archived: 0,
      },
    ];

    mockDb.orderBy.mockResolvedValueOnce(mockCategories);

    const res = await app.request("/api/categories", {}, MOCK_ENV);
    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.categories).toBeDefined();
    expect(json.categories[0].name).toBe("Food & Dining");
    expect(json.categories[0].children).toBeDefined();
    expect(json.categories[0].children[0].name).toBe("Restaurants");
  });

  test("POST /api/categories", async () => {
    const mockCategory = {
      id: 3,
      name: "New Category",
      type: "expense",
      parent_id: null,
      budget_limit: null,
      budget_period: "monthly",
      icon: null,
      color: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: 0,
    };

    mockDb.returning.mockResolvedValueOnce([mockCategory]);

    const res = await app.request(
      "/api/categories",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "New Category",
          type: "expense",
        }),
      },
      MOCK_ENV,
    );

    expect(res.status).toBe(201);

    const json = (await res.json()) as any;
    expect(json.category).toBeDefined();
    expect(json.category.name).toBe("New Category");
  });

  test("PUT /api/categories/:id", async () => {
    const mockCategory = {
      id: 1,
      name: "Updated Category",
      type: "expense",
      parent_id: null,
      budget_limit: 600,
      budget_period: "monthly",
      icon: "🍔",
      color: "#FF6B6B",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: 0,
    };

    mockDb.returning.mockResolvedValueOnce([mockCategory]);

    const res = await app.request(
      "/api/categories/1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Updated Category",
          type: "expense",
          budget_limit: 600,
        }),
      },
      MOCK_ENV,
    );

    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.category).toBeDefined();
    expect(json.category.name).toBe("Updated Category");
  });

  test("PATCH /api/categories/:id/archive", async () => {
    const mockCategory = {
      id: 1,
      name: "Food & Dining",
      type: "expense",
      parent_id: null,
      budget_limit: 500,
      budget_period: "monthly",
      icon: "🍔",
      color: "#FF6B6B",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: 1,
    };

    mockDb.returning.mockResolvedValueOnce([mockCategory]);

    const res = await app.request(
      "/api/categories/1/archive",
      {
        method: "PATCH",
      },
      MOCK_ENV,
    );

    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.message).toBe("Category archived successfully");
  });

  test("GET /api/categories/archived", async () => {
    const mockArchivedCategories = [
      {
        id: 1,
        name: "Archived Category",
        type: "expense",
        parent_id: null,
        budget_limit: null,
        budget_period: "monthly",
        icon: null,
        color: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_archived: 1,
      },
    ];

    mockDb.orderBy.mockResolvedValueOnce(mockArchivedCategories);

    const res = await app.request("/api/categories/archived", {}, MOCK_ENV);
    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.categories).toBeDefined();
    expect(json.categories).toHaveLength(1);
    expect(json.categories[0].name).toBe("Archived Category");
  });

  test("POST /api/categories/merge", async () => {
    const res = await app.request(
      "/api/categories/merge",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_category_ids: [1, 2],
          target_category_id: 3,
        }),
      },
      MOCK_ENV,
    );

    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.message).toBe("Categories merged successfully");
  });

  test("PATCH /api/categories/:id/restore", async () => {
    const mockCategory = {
      id: 1,
      name: "Restored Category",
      type: "expense",
      parent_id: null,
      budget_limit: null,
      budget_period: "monthly",
      icon: null,
      color: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_archived: 0,
    };

    mockDb.returning.mockResolvedValueOnce([mockCategory]);

    const res = await app.request(
      "/api/categories/1/restore",
      {
        method: "PATCH",
      },
      MOCK_ENV,
    );

    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.message).toBe("Category restored successfully");
  });
});
