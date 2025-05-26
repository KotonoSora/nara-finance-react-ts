import { Outlet } from "react-router";

import type { Route } from "./+types/route";

export default function Page({}: Route.ComponentProps) {
  return <Outlet />;
}
