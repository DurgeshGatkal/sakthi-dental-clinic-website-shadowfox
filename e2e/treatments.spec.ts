import { expect, test } from "@playwright/test";
import { visit } from "./support";

const BLOCK_COUNT = 15;

test.describe("treatments", () => {
  test("lists all fifteen treatments as anchored blocks", async ({ page }) => {
    await visit(page, "/treatments");

    await expect(page.locator("article[id]")).toHaveCount(BLOCK_COUNT);
    await expect(page.locator('article[id] [data-cta="fix-appointment"]')).toHaveCount(BLOCK_COUNT);

    for (const heading of ["Teeth Cleaning & Scaling", "Dental Implants", "Clear Aligners"]) {
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    }
  });

  test("a jump chip scrolls to its block", async ({ page }) => {
    await visit(page, "/treatments");

    const index = page.getByRole("navigation", { name: "Treatments on this page" });
    await expect(index.getByRole("link")).toHaveCount(BLOCK_COUNT);

    await index.getByRole("link", { name: "Root Canal Therapy" }).click();

    expect(new URL(page.url()).hash).toBe("#root-canal-therapy");
    await expect(page.locator("#root-canal-therapy")).toBeInViewport();
  });

  test("each block has a heading, copy and image", async ({ page }) => {
    await visit(page, "/treatments");

    const first = page.locator("article[id]").first();
    await expect(first.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(first.locator("img")).toBeVisible();
    await expect(first.getByRole("button", { name: "Fix an Appointment" })).toBeVisible();
  });
});
