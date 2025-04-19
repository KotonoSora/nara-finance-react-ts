import { index, layout, prefix, route } from "@react-router/dev/routes";

import type { RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("welcome", "routes/welcome.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("login", "routes/login.tsx"),
  route("action/set-theme", "routes/action.set-theme.ts"),

  ...prefix("finance", [index("finance/finance.tsx")]),

  ...prefix("contacts", [
    layout("address-book/sidebar.tsx", [
      index("address-book/home.tsx"),
      route(":contactId", "address-book/contact.tsx"),
      route(":contactId/edit", "address-book/edit-contact.tsx"),
      route(":contactId/destroy", "address-book/destroy-contact.tsx"),
    ]),
    route("about", "address-book/about.tsx"),
  ]),
] satisfies RouteConfig;
