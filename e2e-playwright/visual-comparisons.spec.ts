import { test, expect } from "@playwright/test";

test("example test", async ({ page }) => {
  // await page.goto("https://playwright.dev");
  // await expect(page).toHaveScreenshot();
  await page.goto("https://demo.playwright.dev/todomvc");
  await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
});
