import { Outlet } from "react-router";

import type { Route } from "./+types/route";

import { ModeSwitcher } from "~/components/mode-switcher";

export default function Page({}: Route.ComponentProps) {
  return (
    <div>
      <div className="absolute top-4 right-4">
        <ModeSwitcher />
      </div>
      <Outlet />
    </div>
  );
}
