import { expect, test } from "@playwright/test";
import { visit } from "./support";

test.describe("FAQs", () => {
  test("renders 14 questions with the first one open", async ({ page }) => {
    await visit(page, "/faqs");

    const questions = page.locator("h2 > button[aria-expanded]");
    await expect(questions).toHaveCount(14);

    await expect(questions.first()).toHaveAttribute("aria-expanded", "true");
    await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("Can medication completely relieve tooth pain?")).toBeVisible();
  });

  test("opens one answer at a time and closes the previous", async ({ page }) => {
    await visit(page, "/faqs");

    const questions = page.locator("h2 > button[aria-expanded]");
    const second = questions.nth(1);

    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(questions.first()).toHaveAttribute("aria-expanded", "false");

    const panelId = await second.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    await expect(page.locator(`#${panelId}`)).toBeVisible();

    /* Clicking the open question closes it; nothing is forced open. */
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "false");
  });

  test("offers a route to contact for anything unanswered", async ({ page }) => {
    await visit(page, "/faqs");

    await expect(page.getByRole("heading", { name: "Still have questions?" })).toBeVisible();
    await page.getByRole("link", { name: "Contact us" }).click();
    await page.waitForURL((url) => url.pathname === "/contact");
  });
});
