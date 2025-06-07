import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { z } from "zod";

import { transactions } from "../../database/schema/transactions";

const app = new Hono<{ Bindings: CloudflareEnvironment }>();

const bodySchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().min(1),
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

  await db.insert(transactions).values({
    id: nanoid(),
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
    .select()
    .from(transactions)
    .where(whereClause.length ? and(...whereClause) : undefined)
    .orderBy(desc(transactions.date), desc(transactions.createdAt))
    .limit(limit);

  return c.json(result);
});

export default app;
