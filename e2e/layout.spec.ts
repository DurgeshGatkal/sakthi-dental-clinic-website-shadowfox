import { expect, test } from "@playwright/test";
import { ROUTES, expectNoHorizontalScroll, openNav, visit } from "./support";

/*
 * G5 / section 13 — no horizontal scroll at any supported width. Runs on the
 * desktop profile only; the phone profiles already live at 390-412 px.
 */
test.describe("layout", () => {
  test.beforeEach(({ browserName: _browserName }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "one engine is enough for a CSS width sweep");
  });

  for (const width of [320, 360, 768, 1280]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });

      for (const route of ROUTES) {
        await visit(page, route.path);
        await expectNoHorizontalScroll(page);
      }
    });
  }

  test("the mobile drawer fits at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await visit(page, "/");

    await openNav(page);
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
    await expectNoHorizontalScroll(page);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    /* The panel gets the off-canvas class and its wrapper goes inert, so
     * nothing behind the page can be tabbed into while it is closed. */
    const drawer = page.locator("#mobile-menu");
    await expect(drawer).toHaveCSS("translate", "100%");
    await expect(drawer.locator("..")).toHaveAttribute("inert", "");
  });

  test("the fixed action bar never covers the last footer link", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await visit(page, "/privacy-policy");

    const privacyLink = page
      .getByRole("navigation", { name: "Footer" })
      .getByRole("link", { name: "Privacy Policy" });
    await privacyLink.scrollIntoViewIfNeeded();

    const box = await privacyLink.boundingBox();
    const bar = await page.locator(".fixed.inset-x-0.bottom-0").boundingBox();

    expect(box).not.toBeNull();
    expect(bar).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(bar!.y + 1);
  });
});
