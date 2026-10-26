import { defineConfig, devices } from "@playwright/test";

/*
 * Day 9 — end-to-end and accessibility checks against the prerendered build,
 * not the dev server, so what passes here is what a host will serve.
 *
 *   npm run test:e2e          # all five profiles
 *   npm run test:e2e -- --project=firefox
 *
 * scripts/e2e-env.mjs supplies a disposable mongod, the seeded API and a
 * gzipped static server on 127.0.0.1:5000.
 */
export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://127.0.0.1:5000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "pixel-7", use: { ...devices["Pixel 7"] } },
    { name: "iphone-14", use: { ...devices["iPhone 14"] } },
  ],

  webServer: {
    command: "node scripts/e2e-env.mjs",
    url: "http://127.0.0.1:5000",
    reuseExistingServer: false,
    timeout: 180_000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 15_000 },
    stdout: "pipe",
    stderr: "pipe",
  },
});
