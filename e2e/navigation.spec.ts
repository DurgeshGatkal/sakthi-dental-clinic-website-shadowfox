import { expect, test } from "@playwright/test";
import { APPOINTMENT_LABEL, ROUTES, appointmentCta, followNav, visit } from "./support";

const NAV_LINKS = [
  { label: "About Us", path: "/about" },
  { label: "Treatments", path: "/treatments" },
  { label: "FAQs", path: "/faqs" },
  { label: "Contact", path: "/contact" },
] as const;

const FOOTER_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Treatments", path: "/treatments" },
  { label: "FAQs", path: "/faqs" },
  { label: "Contact", path: "/contact" },
  { label: "Privacy Policy", path: "/privacy-policy" },
] as const;

test.describe("navigation", () => {
  for (const link of NAV_LINKS) {
    test(`header reaches ${link.path}`, async ({ page }) => {
      await visit(page, "/");
      await followNav(page, link.label);

      await page.waitForURL((url) => url.pathname === link.path);
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("the appointment CTA is on every page", async ({ page }) => {
    for (const route of ROUTES) {
      await visit(page, route.path);
      await expect(appointmentCta(page)).toHaveText(APPOINTMENT_LABEL);
      await expect(appointmentCta(page)).toBeVisible();
    }
  });

  test("footer quick links reach every page", async ({ page }) => {
    for (const link of FOOTER_LINKS) {
      await visit(page, "/contact");

      const footer = page.getByRole("navigation", { name: "Footer" });
      await footer.getByRole("link", { name: link.label, exact: true }).click();

      await page.waitForURL((url) => url.pathname === link.path);
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("footer treatment links jump to the right block", async ({ page }) => {
    await visit(page, "/");

    const footer = page.getByRole("navigation", { name: "Key treatments" });
    await footer.getByRole("link", { name: "Teeth Cleaning or Scaling" }).click();

    await page.waitForURL((url) => url.pathname === "/treatments");
    expect(new URL(page.url()).hash).toBe("#teeth-cleaning-scaling");
    await expect(page.locator("#teeth-cleaning-scaling")).toBeInViewport();
  });

  test("no link is a dead placeholder", async ({ page }) => {
    for (const route of ROUTES) {
      await visit(page, route.path);

      const hrefs = await page
        .locator("a[href]")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));

      expect(hrefs, `empty href on ${route.path}`).not.toContain("");
      expect(hrefs, `placeholder href on ${route.path}`).not.toContain("#");
    }
  });

  test("an unknown URL returns HTTP 404 with the branded page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /couldn.t find that page/i })).toBeVisible();

    await page.getByRole("link", { name: "Back to home" }).click();
    await page.waitForURL((url) => url.pathname === "/");
  });
});
