import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

import { currencies } from "~/database/schema/currencies";

const app = new Hono<{ Bindings: CloudflareEnvironment }>();

app.post("/seed", async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ success: false, error: "Database not available" });
    }
    const db = drizzle(c.env.DB);

    await seedCurrencies(db);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error seeding currencies:", error);
    return c.json({ success: false, error: "Failed to seed currencies" });
  }
});

const seedCurrencies = async (db: ReturnType<typeof drizzle>) => {
  const existing = await db
    .select({ code: currencies.code })
    .from(currencies)
    .limit(1);

  if (existing.length > 0) {
    return;
  }

  await db.insert(currencies).values([
    {
      code: "VND",
      name: "Vietnamese Dong",
      symbol: "₫",
      unit: "đồng",
      country: "Vietnam",
    },
    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      unit: "cent",
      country: "United States",
    },
    {
      code: "JPY",
      name: "Japanese Yen",
      symbol: "¥",
      unit: "sen",
      country: "Japan",
    },
  ]);
};

app.get("/", async (c) => {
  try {
    const db = drizzle(c.env.DB);
    const currenciesList = await db.select().from(currencies);
    return c.json(currenciesList);
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return c.json({ success: false, error: "Failed to fetch currencies" }, 500);
  }
});

export default app;
