import type { Route } from "./+types/page";

import Calendar from "./calendar/calendar";
import List from "./detail/list";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Calendar" },
    { name: "description", content: "Calendar for detail" },
  ];
}

export default function Page() {
  return (
    <div className="flex flex-col gap-2 w-screen">
      <Calendar />
      <List />
    </div>
  );
}
