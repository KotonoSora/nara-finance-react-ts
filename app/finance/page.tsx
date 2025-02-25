import type { Route } from "./+types/page";

import Calendar from "./calendar/calendar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Calendar" },
    { name: "description", content: "Calendar for detail" },
  ];
}

export default function Page() {
  return <Calendar />;
}
