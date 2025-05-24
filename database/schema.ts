import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const guestBook = sqliteTable("guestBook", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
});

export const categories = sqliteTable("categories", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  type: text().notNull(), // "income" | "expense" | "investment"
  parent_id: integer(), // For subcategory support - references categories.id
  budget_limit: real(), // Monthly budget limit
  budget_period: text().default("monthly"), // "monthly" | "weekly" | "yearly"
  is_archived: integer().default(0), // 0 = active, 1 = archived
  icon: text(), // Icon name or emoji
  color: text(), // Hex color code
  created_at: text().default("CURRENT_TIMESTAMP"),
  updated_at: text().default("CURRENT_TIMESTAMP"),
});

export const transactions = sqliteTable("transactions", {
  id: integer().primaryKey({ autoIncrement: true }),
  amount: real().notNull(),
  description: text().notNull(),
  category_id: integer().notNull(), // References categories.id
  type: text().notNull(), // "income" | "expense" | "investment"
  date: text().notNull(), // ISO date string
  created_at: text().default("CURRENT_TIMESTAMP"),
  updated_at: text().default("CURRENT_TIMESTAMP"),
});
