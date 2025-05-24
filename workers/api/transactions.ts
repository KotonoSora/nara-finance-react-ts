import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

import { categories, transactions } from "../../database/schema";

const app = new Hono<{ Bindings: CloudflareEnvironment }>();

// Get all transactions with pagination and filtering
app.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "50");
    const type = c.req.query("type");
    const category_id = c.req.query("category_id");
    const start_date = c.req.query("start_date");
    const end_date = c.req.query("end_date");
    const search = c.req.query("search");

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions: any[] = [];

    if (type) {
      conditions.push(eq(transactions.type, type));
    }

    if (category_id) {
      conditions.push(eq(transactions.category_id, parseInt(category_id)));
    }

    if (start_date) {
      conditions.push(gte(transactions.date, start_date));
    }

    if (end_date) {
      conditions.push(lte(transactions.date, end_date));
    }

    if (search) {
      conditions.push(
        sql`${transactions.description} LIKE ${"%" + search + "%"}`,
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get transactions with category info
    const transactionList = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        description: transactions.description,
        type: transactions.type,
        date: transactions.date,
        created_at: transactions.created_at,
        updated_at: transactions.updated_at,
        category: {
          id: categories.id,
          name: categories.name,
          type: categories.type,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.category_id, categories.id))
      .where(whereClause)
      .orderBy(desc(transactions.date), desc(transactions.id))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(whereClause);

    const total = countResult.count;
    const totalPages = Math.ceil(total / limit);

    return c.json({
      transactions: transactionList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return c.json({ error: "Failed to fetch transactions" }, 500);
  }
});

// Get transaction by ID
app.get("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));

  try {
    const transaction = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        description: transactions.description,
        type: transactions.type,
        date: transactions.date,
        created_at: transactions.created_at,
        updated_at: transactions.updated_at,
        category: {
          id: categories.id,
          name: categories.name,
          type: categories.type,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.category_id, categories.id))
      .where(eq(transactions.id, id))
      .limit(1);

    if (transaction.length === 0) {
      return c.json({ error: "Transaction not found" }, 404);
    }

    return c.json({ transaction: transaction[0] });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return c.json({ error: "Failed to fetch transaction" }, 500);
  }
});

// Create new transaction
app.post("/", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const body = await c.req.json();
    const { amount, description, category_id, type, date } = body;

    if (!amount || !description || !category_id || !type || !date) {
      return c.json(
        {
          error:
            "Amount, description, category_id, type, and date are required",
        },
        400,
      );
    }

    // Validate type
    if (!["income", "expense", "investment"].includes(type)) {
      return c.json({ error: "Invalid transaction type" }, 400);
    }

    // Validate amount is positive
    if (amount <= 0) {
      return c.json({ error: "Amount must be positive" }, 400);
    }

    // Check if category exists
    const categoryExists = await db
      .select()
      .from(categories)
      .where(eq(categories.id, category_id))
      .limit(1);

    if (categoryExists.length === 0) {
      return c.json({ error: "Category not found" }, 404);
    }

    const result = await db
      .insert(transactions)
      .values({
        amount,
        description,
        category_id,
        type,
        date,
        updated_at: new Date().toISOString(),
      })
      .returning();

    return c.json({ transaction: result[0] }, 201);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return c.json({ error: "Failed to create transaction" }, 500);
  }
});

// Update transaction
app.put("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));

  try {
    const body = await c.req.json();
    const { amount, description, category_id, type, date } = body;

    // Validate required fields
    if (!amount || !description || !category_id || !type || !date) {
      return c.json(
        {
          error:
            "Amount, description, category_id, type, and date are required",
        },
        400,
      );
    }

    // Validate type
    if (!["income", "expense", "investment"].includes(type)) {
      return c.json({ error: "Invalid transaction type" }, 400);
    }

    // Validate amount is positive
    if (amount <= 0) {
      return c.json({ error: "Amount must be positive" }, 400);
    }

    // Check if category exists
    const categoryExists = await db
      .select()
      .from(categories)
      .where(eq(categories.id, category_id))
      .limit(1);

    if (categoryExists.length === 0) {
      return c.json({ error: "Category not found" }, 404);
    }

    const result = await db
      .update(transactions)
      .set({
        amount,
        description,
        category_id,
        type,
        date,
        updated_at: new Date().toISOString(),
      })
      .where(eq(transactions.id, id))
      .returning();

    if (result.length === 0) {
      return c.json({ error: "Transaction not found" }, 404);
    }

    return c.json({ transaction: result[0] });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return c.json({ error: "Failed to update transaction" }, 500);
  }
});

// Delete transaction
app.delete("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));

  try {
    const result = await db
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning();

    if (result.length === 0) {
      return c.json({ error: "Transaction not found" }, 404);
    }

    return c.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return c.json({ error: "Failed to delete transaction" }, 500);
  }
});

// Get transaction summary/analytics
app.get("/analytics/summary", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const start_date = c.req.query("start_date");
    const end_date = c.req.query("end_date");

    // Build where conditions for date range
    const conditions: any[] = [];

    if (start_date) {
      conditions.push(gte(transactions.date, start_date));
    }

    if (end_date) {
      conditions.push(lte(transactions.date, end_date));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get summary by type
    const summaryByType = await db
      .select({
        type: transactions.type,
        total: sql<number>`SUM(${transactions.amount})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(transactions)
      .where(whereClause)
      .groupBy(transactions.type);

    // Get summary by category
    const summaryByCategory = await db
      .select({
        category_id: transactions.category_id,
        category_name: categories.name,
        category_type: categories.type,
        category_icon: categories.icon,
        category_color: categories.color,
        total: sql<number>`SUM(${transactions.amount})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.category_id, categories.id))
      .where(whereClause)
      .groupBy(
        transactions.category_id,
        categories.name,
        categories.type,
        categories.icon,
        categories.color,
      );

    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalInvestment = 0;

    summaryByType.forEach((item) => {
      switch (item.type) {
        case "income":
          totalIncome = item.total;
          break;
        case "expense":
          totalExpenses = item.total;
          break;
        case "investment":
          totalInvestment = item.total;
          break;
      }
    });

    const savings = totalIncome - totalExpenses - totalInvestment;

    return c.json({
      summary: {
        totalIncome,
        totalExpenses,
        totalInvestment,
        savings,
        summaryByType,
        summaryByCategory,
      },
    });
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    return c.json({ error: "Failed to fetch transaction summary" }, 500);
  }
});

// Bulk import transactions
app.post("/bulk", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const body = await c.req.json();
    const { transactions: transactionList } = body;

    if (!Array.isArray(transactionList) || transactionList.length === 0) {
      return c.json({ error: "Transactions array is required" }, 400);
    }

    // Validate each transaction
    for (const transaction of transactionList) {
      const { amount, description, category_id, type, date } = transaction;

      if (!amount || !description || !category_id || !type || !date) {
        return c.json(
          {
            error:
              "Each transaction must have amount, description, category_id, type, and date",
          },
          400,
        );
      }

      if (!["income", "expense", "investment"].includes(type)) {
        return c.json({ error: "Invalid transaction type" }, 400);
      }

      if (amount <= 0) {
        return c.json({ error: "Amount must be positive" }, 400);
      }
    }

    // Insert all transactions
    const results = await db
      .insert(transactions)
      .values(
        transactionList.map((t) => ({
          amount: t.amount,
          description: t.description,
          category_id: t.category_id,
          type: t.type,
          date: t.date,
          updated_at: new Date().toISOString(),
        })),
      )
      .returning();

    return c.json(
      {
        message: `Successfully imported ${results.length} transactions`,
        transactions: results,
      },
      201,
    );
  } catch (error) {
    console.error("Error bulk importing transactions:", error);
    return c.json({ error: "Failed to import transactions" }, 500);
  }
});

export default app;
