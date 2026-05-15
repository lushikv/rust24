import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  webServer: {
    command: "node scripts/next-wasm.mjs dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 30_000,
    env: {
      AUTH_SESSION_SECRET: "dev-secret-for-e2e-tests",
      PAYMENT_PROVIDER: "disabled",
      MOCK_PAYMENT_WEBHOOK_SECRET: "dev-mock-secret"
    }
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
