import type { Route } from "./+types/finance";

import { Finance } from "~/finance/finance";
import { prepareCalendarData } from "~/finance/shared/utils/calendar";
import { MOCK_DATA } from "~/finance/shared/utils/mock";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finance" },
    { name: "description", content: "Finance Page Demo!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const calendarData = prepareCalendarData();

  return {
    ...calendarData,
    transactions: MOCK_DATA.transactions,
    summary: MOCK_DATA.summary,
  };
}

export default function FinanceDemo({ loaderData }: Route.ComponentProps) {
  return <Finance loaderData={loaderData} />;
}
