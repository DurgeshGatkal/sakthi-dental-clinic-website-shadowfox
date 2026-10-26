import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ROUTES, visit } from "./support";

/*
 * Section 13 — axe on every route plus the 404. Reduced motion reveals every
 * scroll section immediately, so axe sees the same colours a patient sees.
 */
test.use({ reducedMotion: "reduce" });

const BLOCKING = new Set(["serious", "critical"]);

test.describe("accessibility", () => {
  for (const route of ROUTES) {
    test(`${route.path} has no serious or critical violations`, async ({ page }) => {
      await visit(page, route.path);

      const results = await new AxeBuilder({ page }).analyze();
      const blocking = results.violations.filter((violation) =>
        BLOCKING.has(violation.impact ?? ""),
      );

      await test.info().attach(`axe-${route.path.replace(/\W+/g, "-") || "home"}.json`, {
        body: JSON.stringify(blocking, null, 2),
        contentType: "application/json",
      });

      expect(
        blocking.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.map((node) => node.target),
        })),
      ).toEqual([]);
    });
  }

  test("the 404 page has no serious or critical violations", async ({ page }) => {
    await page.goto("/no-such-page", { waitUntil: "domcontentloaded" });

    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((violation) => BLOCKING.has(violation.impact ?? ""));

    expect(
      blocking.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  });
});
