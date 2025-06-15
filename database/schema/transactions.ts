import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { currencies } from "./currencies";

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  amount: real("amount").notNull(),
  currency_code: text("currency_code").references(() => currencies.code),
  category: text("category"),
  note: text("note"),
  date: text("date").notNull(),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});
