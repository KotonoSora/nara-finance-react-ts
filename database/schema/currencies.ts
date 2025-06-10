import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const currencies = sqliteTable("currencies", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  unit: text("unit").notNull(),
  country: text("country").notNull(),
});
