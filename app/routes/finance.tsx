import type { Route } from "./+types/finance";

import { Finance } from "~/finance/finance";
import { MOCK_DATA } from "~/finance/shared/utils/mock";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finance" },
    { name: "description", content: "Finance Page Demo!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const nowDate = new Date();
  const currentYear: number = nowDate.getFullYear();
  const currentMonth: number = nowDate.getMonth();
  const currentDate: number = nowDate.getDate();

  const daysOfWeek: string[] = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  return {
    nowDate,
    currentYear,
    currentMonth,
    currentDate,
    daysOfWeek,
    transactions: MOCK_DATA.transactions,
    summary: MOCK_DATA.summary,
  };
}

export default function FinanceDemo({ loaderData }: Route.ComponentProps) {
  return <Finance loaderData={loaderData} />;
}
