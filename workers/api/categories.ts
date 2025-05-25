import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

import { categories, transactions } from "../../database/schema";

const app = new Hono<{ Bindings: CloudflareEnvironment }>();

// Get all categories with tree structure
app.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.is_archived, 0))
      .orderBy(categories.name);

    // Build tree structure
    // Map category ID to node with children
    const categoryMap = new Map<number, any>();
    const rootCategories: any[] = [];

    // First pass: create map entries
    allCategories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });
    // Identify root categories (no parent)
    allCategories.forEach((cat) => {
      if (cat.parent_id == null) {
        rootCategories.push(categoryMap.get(cat.id));
      }
    });

    // Second pass: attach children to parents
    allCategories.forEach((cat) => {
      if (cat.parent_id != null) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children.push(categoryMap.get(cat.id));
        }
      }
    });

    return c.json({ categories: rootCategories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
});

// Get categories with analytics
app.get("/analytics", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const categoriesWithAnalytics = await db
      .select({
        id: categories.id,
        name: categories.name,
        type: categories.type,
        parent_id: categories.parent_id,
        budget_limit: categories.budget_limit,
        budget_period: categories.budget_period,
        is_archived: categories.is_archived,
        icon: categories.icon,
        color: categories.color,
        created_at: categories.created_at,
        updated_at: categories.updated_at,
        spent: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
        transaction_count: sql<number>`COUNT(${transactions.id})`,
        last_transaction_date: sql<string>`MAX(${transactions.date})`,
      })
      .from(categories)
      .leftJoin(transactions, eq(categories.id, transactions.category_id))
      .where(eq(categories.is_archived, 0))
      .groupBy(categories.id)
      .orderBy(categories.name);

    return c.json({ categories: categoriesWithAnalytics });
  } catch (error) {
    console.error("Error fetching category analytics:", error);
    return c.json({ error: "Failed to fetch category analytics" }, 500);
  }
});

// Create new category
app.post("/", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const body = await c.req.json();
    const { name, type, parent_id, budget_limit, budget_period, icon, color } =
      body;

    if (!name || !type) {
      return c.json({ error: "Name and type are required" }, 400);
    }

    const result = await db
      .insert(categories)
      .values({
        name,
        type,
        parent_id: parent_id || null,
        budget_limit: budget_limit || null,
        budget_period: budget_period || "monthly",
        icon: icon || null,
        color: color || null,
        updated_at: new Date().toISOString(),
      })
      .returning();

    return c.json({ category: result[0] }, 201);
  } catch (error) {
    console.error("Error creating category:", error);
    return c.json({ error: "Failed to create category" }, 500);
  }
});

// Update category
app.put("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));

  try {
    const body = await c.req.json();
    const { name, type, parent_id, budget_limit, budget_period, icon, color } =
      body;

    const result = await db
      .update(categories)
      .set({
        name,
        type,
        parent_id: parent_id || null,
        budget_limit: budget_limit || null,
        budget_period: budget_period || "monthly",
        icon: icon || null,
        color: color || null,
        updated_at: new Date().toISOString(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (result.length === 0) {
      return c.json({ error: "Category not found" }, 404);
    }

    return c.json({ category: result[0] });
  } catch (error) {
    console.error("Error updating category:", error);
    return c.json({ error: "Failed to update category" }, 500);
  }
});

// Archive category (soft delete)
app.patch("/:id/archive", async (c) => {
  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));

  try {
    const result = await db
      .update(categories)
      .set({
        is_archived: 1,
        updated_at: new Date().toISOString(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (result.length === 0) {
      return c.json({ error: "Category not found" }, 404);
    }

    return c.json({ message: "Category archived successfully" });
  } catch (error) {
    console.error("Error archiving category:", error);
    return c.json({ error: "Failed to archive category" }, 500);
  }
});

// Merge categories
app.post("/merge", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const body = await c.req.json();
    const { source_category_ids, target_category_id } = body;

    if (
      !source_category_ids ||
      !target_category_id ||
      source_category_ids.length === 0
    ) {
      return c.json(
        { error: "Source categories and target category are required" },
        400,
      );
    }

    // Update all transactions from source categories to target category
    for (const sourceId of source_category_ids) {
      await db
        .update(transactions)
        .set({
          category_id: target_category_id,
          updated_at: new Date().toISOString(),
        })
        .where(eq(transactions.category_id, sourceId));
    }

    // Archive source categories
    await db
      .update(categories)
      .set({
        is_archived: 1,
        updated_at: new Date().toISOString(),
      })
      .where(sql`${categories.id} IN (${source_category_ids.join(",")})`);

    return c.json({ message: "Categories merged successfully" });
  } catch (error) {
    console.error("Error merging categories:", error);
    return c.json({ error: "Failed to merge categories" }, 500);
  }
});

// Get archived categories
app.get("/archived", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const archivedCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.is_archived, 1))
      .orderBy(desc(categories.updated_at));

    return c.json({ categories: archivedCategories });
  } catch (error) {
    console.error("Error fetching archived categories:", error);
    return c.json({ error: "Failed to fetch archived categories" }, 500);
  }
});

// Restore archived category
app.patch("/:id/restore", async (c) => {
  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));

  try {
    const result = await db
      .update(categories)
      .set({
        is_archived: 0,
        updated_at: new Date().toISOString(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (result.length === 0) {
      return c.json({ error: "Category not found" }, 404);
    }

    return c.json({ message: "Category restored successfully" });
  } catch (error) {
    console.error("Error restoring category:", error);
    return c.json({ error: "Failed to restore category" }, 500);
  }
});

export default app;
