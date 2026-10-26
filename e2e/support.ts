import { expect, type Page } from "@playwright/test";

/* Section 5 — the six public routes plus the 404. */
export const ROUTES = [
  { path: "/", heading: /Specialized Dental Care for Women, Children & Families/i },
  { path: "/about", heading: "About Us" },
  { path: "/treatments", heading: "Our Treatments" },
  { path: "/faqs", heading: "Frequently Asked Questions" },
  { path: "/contact", heading: "Contact Us" },
  { path: "/privacy-policy", heading: "Privacy Policy" },
] as const;

export const APPOINTMENT_LABEL = "Fix an Appointment";

export async function visit(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response?.status(), `HTTP status for ${path}`).toBe(200);
  await expect(page.locator("h1")).toBeVisible();
}

/* Day 7 / G5 — nothing may stick out sideways, at any width tested. */
export async function expectNoHorizontalScroll(page: Page) {
  const size = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(
    size.scrollWidth,
    `horizontal overflow: document is ${size.scrollWidth}px wide in a ${size.clientWidth}px viewport`,
  ).toBeLessThanOrEqual(size.clientWidth + 1);
}

/*
 * Desktop has the header nav; phones and tablets use the drawer. One helper so
 * the same navigation spec runs on all five profiles.
 */
export async function openNav(page: Page) {
  const trigger = page.getByRole("button", { name: "Open menu" });

  if (!(await trigger.isVisible())) return;

  const drawer = page.locator("#mobile-menu");
  const wrapper = drawer.locator("..");

  await trigger.click();

  /* A fast click can land before hydration on a slow engine, so the first
   * tap is a no-op. The wrapper's inert flag tells us which it was. */
  if ((await wrapper.getAttribute("inert")) !== null) {
    await trigger.click();
  }

  await expect(wrapper).not.toHaveAttribute("inert", "");
  await expect(drawer).not.toHaveCSS("translate", "100%");
}

export async function followNav(page: Page, label: string) {
  await openNav(page);

  const mobileNav = page.getByRole("navigation", { name: "Mobile" });
  if (await mobileNav.isVisible()) {
    await mobileNav.getByRole("link", { name: label, exact: true }).click();
    return;
  }

  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: label }).click();
}

/* The appointment button lives in the header on md+, the action bar below. */
export function appointmentCta(page: Page) {
  return page.locator('[data-cta="fix-appointment"]:visible').first();
}
