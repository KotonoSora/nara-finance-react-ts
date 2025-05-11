import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";

const app = new Hono<{ Bindings: CloudflareEnvironment }>();

// Middleware: Basic Auth
app.use("*", async (c, next) => {
  const path = c.req.path;
  const allowedPaths = ["/"];

  if (allowedPaths.includes(path) || import.meta.env.NODE_ENV === "vitest") {
    return await next();
  }

  return basicAuth({
    username: c.env.BASIC_AUTH_USERNAME,
    password: c.env.BASIC_AUTH_PASSWORD,
  })(c, next);
});

export default app;
