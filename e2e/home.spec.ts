import { expect, test } from "@playwright/test";
import { visit } from "./support";

test.describe("home", () => {
  test("hero states the offer and both CTAs", async ({ page }) => {
    await visit(page, "/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Specialized Dental Care for Women, Children & Families/i,
      }),
    ).toBeVisible();

    await expect(page.getByRole("button", { name: "Fix an Appointment" }).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Emergency Dental Support" }).first(),
    ).toBeVisible();

    for (const fact of ["Since 2004", "20+ years of expertise", "9 specialist doctors"]) {
      await expect(page.getByText(fact, { exact: true })).toBeVisible();
    }
  });

  test("shows the six core treatments and links to the full list", async ({ page }) => {
    await visit(page, "/");

    const section = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Explore Our Services" }) });

    await expect(section.getByRole("link", { name: /^Learn more about/ })).toHaveCount(6);

    await section.getByRole("link", { name: "View Full List of Treatments" }).click();
    await page.waitForURL((url) => url.pathname === "/treatments");
    await expect(page.getByRole("heading", { level: 1, name: "Our Treatments" })).toBeVisible();
  });

  test("a treatment card jumps to its block", async ({ page }) => {
    await visit(page, "/");

    await page.getByRole("link", { name: "Learn more about Tooth Extraction" }).first().click();

    await page.waitForURL((url) => url.pathname === "/treatments");
    expect(new URL(page.url()).hash).toBe("#tooth-extraction");
    await expect(page.locator("#tooth-extraction")).toBeInViewport();
  });

  test("testimonials can be stepped through and paused", async ({ page }) => {
    await visit(page, "/");

    const carousel = page.getByRole("group", { name: "Patient testimonials" });
    await carousel.scrollIntoViewIfNeeded();

    const dots = carousel.getByRole("button", { name: /^Show testimonial \d$/ });
    const compact = (page.viewportSize()?.width ?? 1280) < 1024;

    if (!compact) {
      await expect(carousel.getByRole("figure")).toHaveCount(3);
      return;
    }

    await expect(dots).toHaveCount(3);
    await dots.nth(1).click();
    await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");

    const pause = carousel.getByRole("button", { name: /testimonials$/i });
    await pause.click();
    await expect(pause).toHaveAttribute("aria-pressed", "true");
    await expect(carousel.getByRole("button", { name: "Play testimonials" })).toBeVisible();
  });
});
