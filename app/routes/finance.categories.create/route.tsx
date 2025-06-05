import { eq, sql } from "drizzle-orm";
import { data } from "react-router";

import type { Route } from "./+types/route";

import { categories } from "~/database/schema";

export function loader({ request }: Route.LoaderArgs) {
  return data(
    {},
    {
      status: 302,
      headers: {
        Location: request.headers.get("referer") || "/finance/categories",
      },
    },
  );
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    if (request.method !== "POST") {
      throw new Error("Method not allowed. Only POST requests are allowed.");
    }

    const formData = await request.formData();
    const categoryName = formData.get("categoryName");

    if (typeof categoryName !== "string" || !categoryName.trim()) {
      throw new Error("Category name is required and must be a string.");
    }

    const name = categoryName.trim();

    const existingCategory = await context.db.query.categories.findFirst({
      where: eq(sql`LOWER(${categories.name})`, name.toLowerCase()),
    });

    if (existingCategory) {
      throw new Error("Category name already exists.");
    }

    await context.db.insert(categories).values({ name, type: "expense" });

    return data(
      {
        success: "Category created successfully.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return data(
      {
        error: error instanceof Error ? error.message : "An error occurred.",
      },
      {
        status: 400,
      },
    );
  }
}
