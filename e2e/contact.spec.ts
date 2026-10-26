import { expect, test } from "@playwright/test";
import { MongoClient } from "mongodb";
import { visit } from "./support";

/* scripts/e2e-env.mjs owns this database and throws it away after the run. */
const MONGO_URI = "mongodb://127.0.0.1:27018/sakthi_e2e";
const TEST_EMAIL = "e2e@example.com";

function uniqueName() {
  const suffix = Math.random()
    .toString(36)
    .replace(/[^a-z]/g, "")
    .slice(0, 8);
  return `Eee ${suffix.charAt(0).toUpperCase()}${suffix.slice(1)}`;
}

test.afterAll(async () => {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  await client.db().collection("contact_messages").deleteMany({ email: TEST_EMAIL });
  await client.close();
});

test.describe("contact form", () => {
  test("marks the three required fields", async ({ page }) => {
    await visit(page, "/contact");

    for (const [id, label] of [
      ["name", "Name"],
      ["email", "Email"],
      ["phone", "Phone"],
    ] as const) {
      await expect(page.locator(`label[for="${id}"]`)).toContainText(label);
      await expect(page.locator(`label[for="${id}"]`)).toContainText("(required)");
      await expect(page.locator(`#${id}`)).toHaveAttribute("aria-required", "true");
    }

    await expect(page.locator('label[for="message"]')).toContainText("(optional)");
  });

  test("empty submit shows an inline error per required field", async ({ page }) => {
    await visit(page, "/contact");

    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter your email.")).toBeVisible();
    await expect(page.getByText("Please enter your phone number.")).toBeVisible();
    await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
  });

  test("a malformed phone number is rejected before it leaves the browser", async ({ page }) => {
    await visit(page, "/contact");

    await page.getByLabel(/^Name/).fill("Eee Tester");
    await page.getByLabel(/^Email/).fill(TEST_EMAIL);
    await page.getByLabel(/^Phone/).fill("12345");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Please enter a valid 10-digit mobile number.")).toBeVisible();
    await expect(page.locator("#phone")).toHaveAttribute("aria-invalid", "true");
  });

  test("an unreachable API falls back to the phone number", async ({ page }) => {
    await visit(page, "/contact");
    await page.route("**/api/v1/contact", (route) => route.abort());

    await page.getByLabel(/^Name/).fill("Eee Tester");
    await page.getByLabel(/^Email/).fill(TEST_EMAIL);
    await page.getByLabel(/^Phone/).fill("9876543210");
    await page.getByRole("button", { name: "Send message" }).click();

    const alert = page.getByRole("alert");
    await expect(alert).toContainText("We could not reach the clinic just now");
    await expect(alert.getByRole("link", { name: "+91 9862890897" })).toHaveAttribute(
      "href",
      "tel:+919862890897",
    );
  });

  test("a valid enquiry is saved and acknowledged", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "one real write per run; the API suite covers persistence on every push",
    );

    const name = uniqueName();
    const message = "Playwright smoke test - please delete.";

    await visit(page, "/contact");
    await page.getByLabel(/^Name/).fill(name);
    await page.getByLabel(/^Email/).fill(TEST_EMAIL);
    await page.getByLabel(/^Phone/).fill("+91 98765 43210");
    await page.getByLabel(/^Message/).fill(message);
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByRole("status")).toContainText(`Thank you, Eee`);
    await expect(page.getByRole("status")).toContainText("Your message is with our front desk");

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const saved = await client.db().collection("contact_messages").findOne({ email: TEST_EMAIL });
    await client.close();

    expect(saved, "the enquiry should be in contact_messages").not.toBeNull();
    expect(saved?.name).toBe(name);
    expect(saved?.phone).toBe("+919876543210");
    expect(saved?.message).toBe(message);
    expect(saved?.ipHash).toMatch(/^[a-f0-9]{64}$/);
  });
});
