import type { Route } from "./+types/finance";

import Calendar from "../finance/calendar/calendar";
import List from "../finance/detail/list";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finance" },
    { name: "description", content: "Finance Page Demo!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
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

  return { nowDate, currentYear, currentMonth, currentDate, daysOfWeek };
}

export default function Finance({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-2">
      <Calendar calendarDetail={loaderData} />
      <List />
    </div>
  );
}
