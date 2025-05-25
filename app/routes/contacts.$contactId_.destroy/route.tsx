import { redirect } from "react-router";

import type { Route } from "./+types/route";

import { deleteContact } from "~/routes/contacts/data";

export async function action({ params }: Route.ActionArgs) {
  await deleteContact(params.contactId);
  return redirect("/contacts");
}
