import { eq } from "drizzle-orm";
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

export async function action({ request, params, context }: Route.ActionArgs) {
  try {
    if (request.method !== "DELETE") {
      throw new Error("Method not allowed. Use DELETE method.");
    }

    const { id } = params;
    if (!id) {
      throw new Error("Category ID is required.");
    }

    const category = await context.db.query.categories.findFirst({
      where: eq(categories.id, parseInt(id)),
      columns: {
        id: true,
      },
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    await context.db.delete(categories).where(eq(categories.id, parseInt(id)));

    return data(
      {
        message: "Category deleted successfully.",
      },
      {
        status: 204,
      },
    );
  } catch (error) {
    return data(
      {
        message: error instanceof Error ? error.message : "An error occurred.",
      },
      {
        status: 400,
      },
    );
  }
}
