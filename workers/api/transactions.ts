import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { z } from "zod";

import { currencies } from "~/database/schema/currencies";
import { transactions } from "~/database/schema/transactions";

const app = new Hono<{ Bindings: CloudflareEnvironment }>();

const bodySchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  currency_code: z.string().min(1),
  category: z.string().optional(),
  note: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày không hợp lệ"),
});

app.post("/", async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const data = parsed.data;

  const existingCurrency = await db
    .select()
    .from(currencies)
    .where(eq(currencies.code, data.currency_code));

  if (existingCurrency.length === 0) {
    return c.json({ error: "currency_code không hợp lệ" }, 400);
  }

  await db.insert(transactions).values({
    id: nanoid(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...data,
  });

  return c.json({ success: true });
});

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const url = new URL(c.req.url);
  const type = url.searchParams.get("type"); // 'income' | 'expense'
  const limit = Number(url.searchParams.get("limit")) || 20;

  const whereClause = [];

  if (type === "income" || type === "expense") {
    whereClause.push(eq(transactions.type, type));
  }

  const result = await db
    .select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      currency_code: transactions.currency_code,
      currency_symbol: currencies.symbol,
      currency_name: currencies.name,
      category: transactions.category,
      note: transactions.note,
      date: transactions.date,
      created_at: transactions.created_at,
      updated_at: transactions.updated_at,
    })
    .from(transactions)
    .leftJoin(currencies, eq(transactions.currency_code, currencies.code))
    .where(whereClause.length ? and(...whereClause) : undefined)
    .orderBy(desc(transactions.date), desc(transactions.created_at))
    .limit(limit);

  return c.json(result);
});

app.delete("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param("id");

  await db.delete(transactions).where(eq(transactions.id, id));

  return c.json({ success: true });
});

app.put("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const data = parsed.data;

  const existingCurrency = await db
    .select()
    .from(currencies)
    .where(eq(currencies.code, data.currency_code));

  if (existingCurrency.length === 0) {
    return c.json({ error: "currency_code không hợp lệ" }, 400);
  }

  await db
    .update(transactions)
    .set({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .where(eq(transactions.id, id));

  return c.json({ success: true });
});

export default app;
