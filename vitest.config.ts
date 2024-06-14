// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // or 'v8' 'istanbul'
      reporter: [["lcov", { projectRoot: "./src" }]],
      include: ["src"],
    },
  },
});
