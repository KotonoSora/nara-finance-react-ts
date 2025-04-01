import { index, layout, route } from "@react-router/dev/routes";

import type { RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/finance.tsx"),
  route("home", "routes/home.tsx"),
  route("welcome", "routes/welcome.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("login", "routes/login.tsx"),
  route("contacts", "routes/contacts.tsx", [
    index("routes/contact-home.tsx"),
    route(":contactId", "routes/contact.tsx"),
  ]),
] satisfies RouteConfig;
