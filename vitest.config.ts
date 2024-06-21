// vitest.config.ts
import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "**/e2e-playwright/**"],
    coverage: {
      provider: "v8", // or 'v8' 'istanbul'
      reporter: [["lcov", { projectRoot: "./src" }]],
      include: ["src"],
    },
  },
});
