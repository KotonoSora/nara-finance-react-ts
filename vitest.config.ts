import path from "node:path";

import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  resolve: {
    alias: {
      "~/database": path.resolve(__dirname, "./database"),
      "~": path.resolve(__dirname, "./app"),
      "~/workers": path.resolve(__dirname, "./workers"),
    },
  },
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
      },
    },
    coverage: {
      provider: "istanbul",
      include: ["app/routes/**", "workers/api/**"],
    },
  },
});
